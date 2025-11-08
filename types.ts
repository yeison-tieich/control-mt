
export interface OrdenProduccion {
    id: number; // No. OT
    nombreCliente: string; // Cliente
    fecha_emision: string; // Fecha de Emision
    orden_compra: string; // No. Orden de Compra
    referencia: string; // Referencia
    nombreProducto: string; // Descripción
    cantidadSolicitada: number; // Cantidad (Unidades)
    material_disponible: 'Sí' | 'No'; // Material disponible (Sí/No)
    tiempo_estimado_dias: number; // Tiempo estimado (Días)
    prioridad: 'Baja' | 'Media' | 'Alta'; // Prioridad
    foto_url?: string; // Foto
    estado: string; // ESTADO
    observacion?: string; // OBSERVACION
    material?: string; // MATERIAL
}
  
export interface NewOrderData {
    cliente_id: number;
    producto_id: number;
    orden_compra: string;
    referencia: string;
    cantidad: number;
    material_disponible: 'Sí' | 'No';
    tiempo_estimado_dias: number;
    prioridad: 'Baja' | 'Media' | 'Alta';
    observacion?: string;
}

export interface KpiData {
    total_ordenes: number;
    ordenes_completadas: number;
    porcentaje_completadas: number;
}

export interface Producto {
    id: number;
    codigoProducto: string; // CÓDIGO
    codigo_nuevo?: string; // CODIGO NUEVO
    cliente_asociado?: string; // CLIENTE
    imageUrl?: string; // Imagen del producto
    nombre: string; // PRODUCTO
    material?: string; // MATERIAL
    ubicacion_almacen?: string; // Ubicación en almacén
    materia_prima?: string; // MAERIA PRIMA (posiblemente typo de MATERIA PRIMA)
    calibre?: string; // CALIBRE
    piezas_por_hora?: number; // PIEZAS POR HORA
    ancho_tira_mm?: number; // ANCHO DE TIRA mm
    medidas_pieza_mm?: string; // MEDIDAS X PIEZA mm
    acabado?: string; // ACABADO
    piezas_lamina_4x8_a?: number; // PIEZAS LAMINA DE 4 x 8 A
    piezas_lamina_4x8?: number; // PIEZAS POR LAMINA DE 4 x 8
    piezas_lamina_2x1?: number; // PIEZAS POR LAMINA DE 2 x 1
    empaque_de?: string; // EMPAQUE DE
    stock: number; // Campo mantenido por ser esencial para inventario
}

export interface NewProductoData {
    codigoProducto: string;
    codigo_nuevo?: string;
    cliente_asociado?: string;
    nombre: string;
    material?: string;
    ubicacion_almacen?: string;
    materia_prima?: string;
    calibre?: string;
    piezas_por_hora: number;
    ancho_tira_mm: number;
    medidas_pieza_mm?: string;
    acabado?: string;
    piezas_lamina_4x8_a: number;
    piezas_lamina_4x8: number;
    piezas_lamina_2x1: number;
    empaque_de?: string;
    stock: number;
}


export interface Personal {
    id: number;
    nombreCompleto: string;
    cedula: string;
    cargo: string;
}

export interface NewPersonalData {
    nombreCompleto: string;
    cedula: string;
    cargo: string;
}

export interface Cliente {
    id: number;
    nombre_cliente: string;
    contacto: string;
    email: string;
}

export interface NewClienteData {
    nombre_cliente: string;
    contacto: string;
    email: string;
}

export interface Maquina {
    id: number;
    nombre: string;
    codigo: string;
    estado: 'Operativa' | 'En Mantenimiento' | 'Fuera de Servicio';
    ubicacion: string;
}

export interface NewMaquinaData {
    nombre: string;
    codigo: string;
    estado: 'Operativa' | 'En Mantenimiento' | 'Fuera de Servicio';
    ubicacion: string;
}

export interface Mantenimiento {
    id: number;
    maquina_nombre: string;
    maquina_codigo: string;
    fecha_programada: string;
    tipo_mantenimiento: 'Preventivo' | 'Correctivo';
    estado: 'Programado' | 'En Proceso' | 'Completado';
}

export interface NewMantenimientoData {
    maquina_id: number;
    fecha_programada: string;
    tipo_mantenimiento: 'Preventivo' | 'Correctivo';
    descripcion: string;
}

export interface MateriaPrima {
    id: number;
    nombre: string;
    proveedor: string;
    stock: number;
    unidad: string;
}

export interface NewMateriaPrimaData {
    nombre: string;
    proveedor: string;
    stock: number;
    unidad: string;
}

export interface RegistroCalidad {
    id: number;
    orden_id: number;
    producto_nombre: string;
    fecha_inspeccion: string;
    resultado: 'Aprobado' | 'Rechazado';
    observaciones: string;
}

export interface NewRegistroCalidadData {
    orden_id: number;
    resultado: 'Aprobado' | 'Rechazado';
    observaciones: string;
}