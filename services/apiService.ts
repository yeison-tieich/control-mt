import type {
  OrdenProduccion,
  KpiData,
  Producto,
  NewProductoData,
  Personal,
  NewPersonalData,
  Cliente,
  NewClienteData,
  Maquina,
  NewMaquinaData,
  Mantenimiento,
  NewMantenimientoData,
  MateriaPrima,
  NewMateriaPrimaData,
  RegistroCalidad,
  NewRegistroCalidadData,
  NewOrderData
} from '../types';

const API_URL = 'https://script.google.com/macros/s/AKfycbzFmqGa3J-jqX9EIPIxZJu4llCvhmfL4QxQfb7jCPS3nJfS4cZBKqhkv0G3JbGx3Sbj4A/exec';

// --- Mapeo de Columnas ---
const columnMappings: { [key: string]: { [key: string]: string } } = {
  ordenes: {
    'No. OT': 'id',
    'Cliente': 'nombreCliente',
    'Fecha de Emision': 'fecha_emision',
    'No. Orden de Compra': 'orden_compra',
    'Referencia': 'referencia',
    'Descripción': 'nombreProducto',
    'Cantidad (Unidades)': 'cantidadSolicitada',
    'Material disponible (Sí/No)': 'material_disponible',
    'Tiempo estimado (Días)': 'tiempo_estimado_dias',
    'Prioridad': 'prioridad',
    'Foto': 'foto_url',
    'ESTADO': 'estado',
    'OBSERVACION': 'observacion',
    'MATERIAL': 'material',
  },
  productos: {
    'id': 'id',
    'CÓDIGO': 'codigoProducto',
    'CODIGO NUEVO': 'codigo_nuevo',
    'CLIENTE': 'cliente_asociado',
    'Imagen del producto': 'imageUrl',
    'PRODUCTO': 'nombre',
    'MATERIAL': 'material',
    'Ubicación en almacén': 'ubicacion_almacen',
    'MAERIA PRIMA': 'materia_prima',
    'CALIBRE': 'calibre',
    'PIEZAS POR HORA': 'piezas_por_hora',
    'ANCHO DE TIRA mm': 'ancho_tira_mm',
    'MEDIDAS X PIEZA mm': 'medidas_pieza_mm',
    'ACABADO': 'acabado',
    'PIEZAS LAMINA DE 4 x 8 A': 'piezas_lamina_4x8_a',
    'PIEZAS POR LAMINA DE 4 x 8': 'piezas_lamina_4x8',
    'PIEZAS POR LAMINA DE 2 x 1': 'piezas_lamina_2x1',
    'EMPAQUE DE': 'empaque_de',
    'stock': 'stock',
  }
};

const getReverseMapping = (mapping: { [key: string]: string }): { [key: string]: string } => {
    const reversed: { [key: string]: string } = {};
    for (const key in mapping) {
        reversed[mapping[key]] = key;
    }
    return reversed;
};

// --- Lógica Central de API ---

const formatDate = (date: Date): string => {
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

const coerceItem = (item: any) => {
    const coercedItem = {...item};
    for (const key in coercedItem) {
        if (['id', 'cantidadSolicitada', 'stock', 'cantidad', 'ordenes_completadas', 'total_ordenes', 'porcentaje_completadas', 'tiempo_estimado_dias', 'piezas_por_hora', 'ancho_tira_mm', 'piezas_lamina_4x8_a', 'piezas_lamina_4x8', 'piezas_lamina_2x1'].includes(key)) {
            const num = Number(coercedItem[key]);
            coercedItem[key] = isNaN(num) ? coercedItem[key] : num;
        }
    }
    return coercedItem;
};

const fetchFromSheet = async <T>(sheetName: string): Promise<T[]> => {
  const response = await fetch(`${API_URL}?sheet=${sheetName}`);
  if (!response.ok) {
    throw new Error(`Error al cargar datos de la hoja: ${sheetName}`);
  }
  const data = await response.json();
  if (!Array.isArray(data)) {
      throw new Error(`La respuesta de la hoja "${sheetName}" no es una lista.`);
  }

  const mapping = columnMappings[sheetName];
  if (!mapping) {
      return data.map(item => coerceItem(item) as T);
  }

  const mappedData = data.map((item: any) => {
      const mappedItem: { [key: string]: any } = {};
      for (const sheetHeader in item) {
          const appKey = mapping[sheetHeader];
          if (appKey) {
              mappedItem[appKey] = item[sheetHeader];
          }
      }
      return coerceItem(mappedItem);
  });
  return mappedData as T[];
};

const postToSheet = async (sheetName: string, dataObject: { [key: string]: any }): Promise<any> => {
  let newRow: { [key: string]: any } = { ...dataObject };
  
  const reverseMapping = getReverseMapping(columnMappings[sheetName] || {});
  
  if (Object.keys(reverseMapping).length > 0) {
      newRow = {};
      for (const appKey in dataObject) {
          const sheetHeader = reverseMapping[appKey];
          if (sheetHeader) {
              newRow[sheetHeader] = dataObject[appKey];
          }
      }
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({ sheetName, newRow }),
    redirect: 'follow'
  });

  if (response.ok || response.type === 'opaque') {
      return { success: true };
  } else {
      const errorText = await response.text();
      throw new Error(`Error al enviar datos a Google Sheets: ${errorText}`);
  }
};


// --- Funciones de la API ---

// Ordenes de Producción
export const fetchOrdenes = (): Promise<OrdenProduccion[]> => fetchFromSheet<OrdenProduccion>('ordenes');
export const createOrden = async (data: NewOrderData, productos: Producto[], clientes: Cliente[]): Promise<any> => {
    const producto = productos.find(p => p.id === data.producto_id);
    const cliente = clientes.find(c => c.id === data.cliente_id);

    if (!producto || !cliente) throw new Error("Producto o cliente no encontrado");

    const newRowData = {
        id: 'AUTOGENERATED',
        nombreCliente: cliente.nombre_cliente,
        fecha_emision: formatDate(new Date()),
        orden_compra: data.orden_compra,
        referencia: data.referencia,
        nombreProducto: producto.nombre,
        cantidadSolicitada: data.cantidad,
        material_disponible: data.material_disponible,
        tiempo_estimado_dias: data.tiempo_estimado_dias,
        prioridad: data.prioridad,
        foto_url: '',
        estado: 'Pendiente',
        observacion: data.observacion || '',
        material: producto.material || '',
    };
    return postToSheet('ordenes', newRowData);
};

// KPIs (Calculado en el cliente)
export const fetchKpiData = async (): Promise<KpiData> => {
    const ordenes = await fetchOrdenes();
    const total_ordenes = ordenes.length;
    const ordenes_completadas = ordenes.filter(o => o.estado === 'Completada').length;
    const porcentaje_completadas = total_ordenes > 0 ? (ordenes_completadas / total_ordenes) * 100 : 0;
    return { total_ordenes, ordenes_completadas, porcentaje_completadas };
};

// Productos
export const fetchProductos = (): Promise<Producto[]> => fetchFromSheet<Producto>('productos');
export const createProducto = (data: NewProductoData): Promise<Producto> => postToSheet('productos', { ...data, id: 'AUTOGENERATED', imageUrl: '' });

// Personal
export const fetchPersonal = (): Promise<Personal[]> => fetchFromSheet<Personal>('personal');
export const createPersonal = (data: NewPersonalData): Promise<Personal> => postToSheet('personal', { ...data, id: 'AUTOGENERATED' });

// Clientes
export const fetchClientes = (): Promise<Cliente[]> => fetchFromSheet<Cliente>('clientes');
export const createCliente = (data: NewClienteData): Promise<Cliente> => postToSheet('clientes', { ...data, id: 'AUTOGENERATED' });

// Máquinas
export const fetchMaquinas = (): Promise<Maquina[]> => fetchFromSheet<Maquina>('maquinas');
export const createMaquina = (data: NewMaquinaData): Promise<Maquina> => postToSheet('maquinas', { ...data, id: 'AUTOGENERATED' });

// Mantenimiento
export const fetchMantenimientos = (): Promise<Mantenimiento[]> => fetchFromSheet<Mantenimiento>('mantenimiento');
export const createMantenimiento = async (data: NewMantenimientoData, maquinas: Maquina[]): Promise<Mantenimiento> => {
    const maquina = maquinas.find(m => m.id === data.maquina_id);
    if (!maquina) throw new Error('Máquina no encontrada');
    const newRow = {
        'id': 'AUTOGENERATED',
        'maquina_nombre': maquina.nombre,
        'maquina_codigo': maquina.codigo,
        'fecha_programada': data.fecha_programada,
        'tipo_mantenimiento': data.tipo_mantenimiento,
        'estado': 'Programado',
        'descripcion': data.descripcion,
    };
    return postToSheet('mantenimiento', newRow);
};

// Materias Primas
export const fetchMateriasPrimas = (): Promise<MateriaPrima[]> => fetchFromSheet<MateriaPrima>('materiasPrimas');
export const createMateriaPrima = (data: NewMateriaPrimaData): Promise<MateriaPrima> => postToSheet('materiasPrimas', { ...data, id: 'AUTOGENERATED' });

// Calidad
export const fetchRegistrosCalidad = (): Promise<RegistroCalidad[]> => fetchFromSheet<RegistroCalidad>('calidad');
export const createRegistroCalidad = async (data: NewRegistroCalidadData, ordenes: OrdenProduccion[]): Promise<RegistroCalidad> => {
    const orden = ordenes.find(o => o.id === data.orden_id);
    if (!orden) throw new Error('Orden no encontrada');

    const newRow = {
        'id': 'AUTOGENERATED',
        'orden_id': data.orden_id,
        'producto_nombre': orden.nombreProducto,
        'fecha_inspeccion': formatDate(new Date()),
        'resultado': data.resultado,
        'observaciones': data.observaciones,
    };
    return postToSheet('calidad', newRow);
};