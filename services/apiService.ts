import type { 
    OrdenProduccion, KpiData, Producto, NewProductoData, Cliente, NewClienteData,
    NewOrderData, Personal, NewPersonalData, Maquina, NewMaquinaData,
    Mantenimiento, NewMantenimientoData, MateriaPrima, NewMateriaPrimaData,
    RegistroCalidad, NewRegistroCalidadData
} from '../types';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzFmqGa3J-jqX9EIPIxZJu4llCvhmfL4QxQfb7jCPS3nJfS4cZBKqhkv0G3JbGx3Sbj4A/exec';

const SHEET_NAMES = {
    ordenes: 'ordenes',
    productos: 'productos',
    personal: 'personal',
    maquinas: 'maquinas',
    clientes: 'clientes',
    mantenimiento: 'mantenimiento',
    calidad: 'calidad',
    materiasPrimas: 'materiasPrimas'
};

const COLUMN_MAPPINGS = {
    [SHEET_NAMES.ordenes]: { 'No. OT': 'no_ot', 'Cliente': 'cliente', 'Fecha de Emision': 'fecha_emision', 'No. Orden de Compra': 'no_orden_compra', 'Referencia': 'referencia', 'Descripción': 'descripcion', 'Cantidad (Unidades)': 'cantidad_unidades', 'Material disponible (Sí/No)': 'material_disponible', 'Tiempo estimado (Días)': 'tiempo_estimado_dias', 'Prioridad': 'prioridad', 'Foto': 'foto', 'ESTADO': 'estado', 'OBSERVACION': 'observacion', 'MATERIAL': 'material' },
    [SHEET_NAMES.productos]: { 'CÓDIGO': 'codigo', 'CODIGO NUEVO': 'codigo_nuevo', 'CLIENTE': 'cliente', 'Imagen del producto': 'imagen_producto', 'PRODUCTO': 'producto', 'MATERIAL': 'material', 'Ubicación en almacén': 'ubicacion_almacen', 'MAERIA PRIMA': 'materia_prima', 'CALIBRE': 'calibre', 'PIEZAS POR HORA': 'piezas_por_hora', 'ANCHO DE TIRA mm': 'ancho_tira_mm', 'MEDIDAS X PIEZA mm': 'medidas_pieza_mm', 'ACABADO': 'acabado', 'PIEZAS LAMINA DE 4 x 8 A': 'piezas_lamina_4x8_a', 'PIEZAS POR LAMINA DE 4 x 8': 'piezas_por_lamina_4x8', 'PIEZAS POR LAMINA DE 2 x 1': 'piezas_por_lamina_2x1', 'EMPAQUE DE': 'empaque_de' },
    [SHEET_NAMES.personal]: { 'NOMBRE': 'nombre', 'CEDULA': 'cedula', 'CARGO': 'cargo' },
    [SHEET_NAMES.maquinas]: { 'COD. ACTUAL': 'cod_actual', 'DESCRIPCIÓN': 'descripcion', 'ADQUIRIDA EN': 'adquirida_en', 'ESTADO': 'estado', 'OBSERVACIONES': 'observaciones' },
    [SHEET_NAMES.clientes]: { 'ID': 'id', 'NOMBRE': 'nombre', 'EMPRESA': 'empresa', 'NIT': 'nit' },
    [SHEET_NAMES.mantenimiento]: { 'ID Mantenimiento': 'id_mantenimiento', 'Máquina/Equipo': 'maquina_equipo', 'Tipo de mantenimiento (Preventivo/Correctivo)': 'tipo_mantenimiento', 'Fecha programada': 'fecha_programada', 'Estado': 'estado', 'Técnico responsable': 'tecnico_responsable', 'Descripción del mantenimiento': 'descripcion_mantenimiento', 'Insumos utilizados': 'insumos_utilizados', 'Foto': 'foto', 'Observaciones': 'observaciones' },
    [SHEET_NAMES.calidad]: { 'ID REG CALIDAD': 'id_reg_calidad', 'No. OT': 'no_ot', 'Proceso inspeccionado': 'proceso_inspeccionado', 'Pieza': 'pieza', 'RESPONSABLE': 'responsable', 'Tipo de verificacion': 'tipo_verificacion', 'VERIFICACION VISUAL': 'verificacion_visual', 'Medida 1': 'medida_1', 'Medida 2': 'medida_2', 'Aprobado / Rechazado': 'aprobado_rechazado', 'Fecha hora de inspeccion': 'fecha_hora_inspeccion', 'FOTO': 'foto', 'Observaciones': 'observaciones', 'Firma': 'firma' },
    [SHEET_NAMES.materiasPrimas]: { 'MATERIAL': 'material', 'Descripción': 'descripcion', 'FOTO': 'foto', 'Cantidad en stock': 'cantidad_stock', 'Unidad de medida': 'unidad_medida', 'Peso unitario (K)': 'peso_unitario_k', 'Proveedor': 'proveedor', 'Fecha de ingreso': 'fecha_ingreso', 'Fecha de consumo': 'fecha_consumo', 'Peso (K)': 'peso_k', 'Estado (Disponible/Reservado)': 'estado' }
};

const getReverseMapping = (sheetName: string) => Object.fromEntries(Object.entries(COLUMN_MAPPINGS[sheetName]).map(([k, v]) => [v, k]));

const transformData = (data: any[], sheetName: string) => {
    const mapping = COLUMN_MAPPINGS[sheetName];
    if (!mapping) return data;
    return data.map(row => {
        const newRow: { [key: string]: any } = {};
        for (const key in row) {
            const newKey = mapping[key] || key;
            newRow[newKey] = row[key];
        }
        return newRow;
    });
};

const apiGet = async <T>(sheetName: string): Promise<T> => {
    try {
        const response = await fetch(`${SCRIPT_URL}?sheet=${sheetName}`);
        if (!response.ok) throw new Error(`Error fetching ${sheetName}: ${response.statusText}`);
        const data = await response.json();
        return transformData(data, sheetName) as T;
    } catch (error) {
        console.error(`API GET Error for ${sheetName}:`, error);
        throw error;
    }
};

const apiPost = async (sheetName: string, data: any): Promise<any> => {
    const reverseMapping = getReverseMapping(sheetName);
    const newRow: { [key: string]: any } = {};
    for (const key in data) {
        const newKey = reverseMapping[key] || key;
        newRow[newKey] = data[key];
    }

    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Apps Script web apps often require this
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sheetName, newRow }),
        });
        // Since it's no-cors, we can't read the response, so we optimistically return success
        return { success: true };
    } catch (error) {
        console.error(`API POST Error for ${sheetName}:`, error);
        throw error;
    }
};

// API Functions
export const fetchOrdenes = (): Promise<OrdenProduccion[]> => apiGet<OrdenProduccion[]>(SHEET_NAMES.ordenes);
export const createOrden = (data: NewOrderData) => apiPost(SHEET_NAMES.ordenes, data);

export const fetchProductos = (): Promise<Producto[]> => apiGet<Producto[]>(SHEET_NAMES.productos);
export const createProducto = (data: NewProductoData) => apiPost(SHEET_NAMES.productos, data);

export const fetchPersonal = (): Promise<Personal[]> => apiGet<Personal[]>(SHEET_NAMES.personal);
export const createPersonal = (data: NewPersonalData) => apiPost(SHEET_NAMES.personal, data);

export const fetchMaquinas = (): Promise<Maquina[]> => apiGet<Maquina[]>(SHEET_NAMES.maquinas);
export const createMaquina = (data: NewMaquinaData) => apiPost(SHEET_NAMES.maquinas, data);

export const fetchClientes = (): Promise<Cliente[]> => apiGet<Cliente[]>(SHEET_NAMES.clientes);
export const createCliente = (data: NewClienteData) => apiPost(SHEET_NAMES.clientes, data);

export const fetchMantenimientos = (): Promise<Mantenimiento[]> => apiGet<Mantenimiento[]>(SHEET_NAMES.mantenimiento);
export const createMantenimiento = (data: NewMantenimientoData) => apiPost(SHEET_NAMES.mantenimiento, data);

export const fetchControlesCalidad = (): Promise<RegistroCalidad[]> => apiGet<RegistroCalidad[]>(SHEET_NAMES.calidad);
export const createControlCalidad = (data: NewRegistroCalidadData) => apiPost(SHEET_NAMES.calidad, data);

export const fetchMateriasPrimas = (): Promise<MateriaPrima[]> => apiGet<MateriaPrima[]>(SHEET_NAMES.materiasPrimas);
export const createMateriaPrima = (data: NewMateriaPrimaData) => apiPost(SHEET_NAMES.materiasPrimas, data);

// Client-side KPI calculation
export const fetchKpiData = async (): Promise<KpiData> => {
    const ordenes = await fetchOrdenes();
    const total_ordenes = ordenes.length;
    const ordenes_completadas = ordenes.filter(o => o.estado === 'Completada').length;
    const porcentaje_completadas = total_ordenes > 0 ? (ordenes_completadas / total_ordenes) * 100 : 0;
    return { total_ordenes, ordenes_completadas, porcentaje_completadas };
};
