import type {
  OrdenProduccion,
  KpiData,
  Producto,
  Cliente,
  NewOrderData,
  Personal,
  NewPersonalData,
  NewClienteData,
  Maquina,
  NewMaquinaData,
  Mantenimiento,
  NewMantenimientoData,
  MateriaPrima,
  NewMateriaPrimaData,
  RegistroCalidad,
  NewRegistroCalidadData,
  NewProductoData
} from '../types';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzFmqGa3J-jqX9EIPIxZJu4llCvhmfL4QxQfb7jCPS3nJfS4cZBKqhkv0G3JbGx3Sbj4A/exec';

// --- MAPPINGS (Sheet Column -> App Key) ---
const ordenesMapping: { [key: string]: keyof OrdenProduccion } = {
    'No. OT': 'no_ot', 'Cliente': 'cliente', 'Fecha de Emision': 'fecha_emision',
    'No. Orden de Compra': 'no_orden_compra', 'Referencia': 'referencia', 'Descripción': 'descripcion',
    'Cantidad (Unidades)': 'cantidad_unidades', 'Material disponible (Sí/No)': 'material_disponible',
    'Tiempo estimado (Días)': 'tiempo_estimado_dias', 'Prioridad': 'prioridad', 'ESTADO': 'estado',
    'OBSERVACION': 'observacion', 'MATERIAL': 'material'
};
const productosMapping: { [key: string]: keyof Producto } = {
    'CÓDIGO': 'codigo', 'CODIGO NUEVO': 'codigo_nuevo', 'CLIENTE': 'cliente',
    'PRODUCTO': 'producto', 'MATERIAL': 'material', 'Ubicación en almacén': 'ubicacion_almacen',
    'MAERIA PRIMA': 'materia_prima', 'CALIBRE': 'calibre', 'PIEZAS POR HORA': 'piezas_por_hora',
    'ANCHO DE TIRA mm': 'ancho_tira_mm', 'MEDIDAS X PIEZA mm': 'medidas_pieza_mm', 'ACABADO': 'acabado',
    'PIEZAS LAMINA DE 4 x 8 A': 'piezas_lamina_4x8_a', 'PIEZAS POR LAMINA DE 4 x 8': 'piezas_por_lamina_4x8',
    'PIEZAS POR LAMINA DE 2 x 1': 'piezas_por_lamina_2x1', 'EMPAQUE DE': 'empaque_de',
    'IMAGEN URL': 'imagen_url'
};
const personalMapping: { [key: string]: keyof Personal } = { 'NOMBRE': 'nombre', 'CEDULA': 'cedula', 'CARGO': 'cargo' };
const clientesMapping: { [key: string]: keyof Cliente } = { 'ID': 'id', 'NOMBRE': 'nombre', 'EMPRESA': 'empresa', 'NIT': 'nit' };
const maquinasMapping: { [key: string]: keyof Maquina } = { 'COD. ACTUAL': 'cod_actual', 'DESCRIPCIÓN': 'descripcion', 'ADQUIRIDA EN': 'adquirida_en', 'ESTADO': 'estado', 'OBSERVACIONES': 'observaciones' };
const mantenimientosMapping: { [key: string]: keyof Mantenimiento } = { 'ID Mantenimiento': 'id_mantenimiento', 'Máquina/Equipo': 'maquina_equipo', 'Tipo de mantenimiento (Preventivo/Correctivo)': 'tipo_mantenimiento', 'Fecha programada': 'fecha_programada', 'Estado': 'estado', 'Técnico responsable': 'tecnico_responsable' };
const materiasPrimasMapping: { [key: string]: keyof MateriaPrima } = { 'MATERIAL': 'material', 'Descripción': 'descripcion', 'Cantidad en stock': 'cantidad_stock', 'Unidad de medida': 'unidad_medida', 'Peso unitario (K)': 'peso_unitario_k', 'Proveedor': 'proveedor', 'Fecha de ingreso': 'fecha_ingreso', 'Estado (Disponible/Reservado)': 'estado' };
const calidadMapping: { [key: string]: keyof RegistroCalidad } = { 'ID REG CALIDAD': 'id_reg_calidad', 'No. OT': 'no_ot', 'Proceso inspeccionado': 'proceso_inspeccionado', 'Fecha hora de inspeccion': 'fecha_hora_inspeccion', 'RESPONSABLE': 'responsable', 'Aprobado / Rechazado': 'aprobado_rechazado' };

// --- HELPER FUNCTIONS ---
const mapRowToObject = (row: any[], headers: string[], mapping: Record<string, string>): any => {
    const obj: any = {};
    headers.forEach((header, i) => {
        const key = mapping[header];
        if (key) {
           obj[key] = row[i];
        }
    });
    return obj;
};

const mapObjectToRow = (obj: any, mapping: Record<string, string>): any => {
    const row: any = {};
    for (const key in obj) {
        const header = Object.keys(mapping).find(h => mapping[h] === key);
        if (header) {
            row[header] = obj[key];
        }
    }
    return row;
};

const apiPost = async (payload: any): Promise<any> => {
    const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!result.success) {
        throw new Error(result.error || 'Error en la respuesta del servidor');
    }
    return result;
};

const fetchFromSheet = async <T>(sheetName: string, mapping: Record<string, string>): Promise<T[]> => {
    const response = await fetch(`${SCRIPT_URL}?sheet=${sheetName}`);
    if (!response.ok) throw new Error('Error al conectar con la API de Google Sheets.');
    
    const data = await response.json();
    if (data.error) throw new Error(data.error);

    const headers = Object.keys(data[0] || {});
    return data.map((row: any) => {
        const mappedRow: any = {};
        headers.forEach(header => {
            const key = mapping[header];
            if (key) {
                mappedRow[key] = row[header];
            }
        });
        return mappedRow as T;
    });
};

// --- EXPORTED API FUNCTIONS ---

// Ordenes de Producción
export const fetchOrdenes = () => fetchFromSheet<OrdenProduccion>('ordenes', ordenesMapping);
export const createOrden = (data: NewOrderData) => apiPost({ sheetName: 'ordenes', newRow: mapObjectToRow(data, ordenesMapping) });

// KPIs
export const fetchKpiData = async (): Promise<KpiData> => {
  const ordenes = await fetchOrdenes();
  const total_ordenes = ordenes.length;
  const ordenes_completadas = ordenes.filter(o => o.estado === 'Completada').length;
  const porcentaje_completadas = total_ordenes > 0 ? (ordenes_completadas / total_ordenes) * 100 : 0;
  return { total_ordenes, ordenes_completadas, porcentaje_completadas };
};

// Productos
export const fetchProductos = () => fetchFromSheet<Producto>('productos', productosMapping);
export const createProducto = (data: NewProductoData) => apiPost({ sheetName: 'productos', newRow: mapObjectToRow(data, productosMapping) });
export const updateProducto = (codigo: string, data: Partial<Producto>) => apiPost({
    sheetName: 'productos',
    action: 'update',
    uniqueId: codigo,
    newRow: mapObjectToRow(data, productosMapping)
});

// Clientes
export const fetchClientes = () => fetchFromSheet<Cliente>('clientes', clientesMapping);
export const createCliente = (data: NewClienteData) => apiPost({ sheetName: 'clientes', newRow: mapObjectToRow(data, clientesMapping) });

// Personal
export const fetchPersonal = () => fetchFromSheet<Personal>('personal', personalMapping);
export const createPersonal = (data: NewPersonalData) => apiPost({ sheetName: 'personal', newRow: mapObjectToRow(data, personalMapping) });

// Maquinas
export const fetchMaquinas = () => fetchFromSheet<Maquina>('maquinas', maquinasMapping);
export const createMaquina = (data: NewMaquinaData) => apiPost({ sheetName: 'maquinas', newRow: mapObjectToRow(data, maquinasMapping) });

// Mantenimiento
export const fetchMantenimientos = () => fetchFromSheet<Mantenimiento>('mantenimiento', mantenimientosMapping);
export const createMantenimiento = (data: NewMantenimientoData) => apiPost({ sheetName: 'mantenimiento', newRow: mapObjectToRow(data, mantenimientosMapping) });

// Materias Primas
export const fetchMateriasPrimas = () => fetchFromSheet<MateriaPrima>('materiasPrimas', materiasPrimasMapping);
export const createMateriaPrima = (data: NewMateriaPrimaData) => apiPost({ sheetName: 'materiasPrimas', newRow: mapObjectToRow(data, materiasPrimasMapping) });

// Control de Calidad
export const fetchControlesCalidad = () => fetchFromSheet<RegistroCalidad>('calidad', calidadMapping);
export const createControlCalidad = (data: NewRegistroCalidadData) => apiPost({ sheetName: 'calidad', newRow: mapObjectToRow(data, calidadMapping) });