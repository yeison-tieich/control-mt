export interface OrdenProduccion {
  no_ot: number;
  descripcion: string;
  cliente: string;
  cantidad_unidades: number;
  fecha_emision: string; // "DD/MM/YYYY HH:mm:ss"
  estado: 'Pendiente' | 'En Proceso' | 'Completada';
  prioridad: 'Baja' | 'Media' | 'Alta';
  no_orden_compra: string;
  referencia: string;
  tiempo_estimado_dias: number;
  material?: string;
  material_disponible: 'Sí' | 'No';
  observacion?: string;
}

export interface NewOrderData {
  descripcion: string;
  cliente: string;
  cantidad_unidades: number;
  prioridad: 'Baja' | 'Media' | 'Alta';
  no_orden_compra: string;
  referencia?: string;
  tiempo_estimado_dias: number;
  material?: string;
  material_disponible: 'Sí' | 'No';
  observacion?: string;
}

export interface KpiData {
  total_ordenes: number;
  ordenes_completadas: number;
  porcentaje_completadas: number;
}

export interface Producto {
  codigo: string;
  producto: string;
  imagen_url?: string;
  codigo_nuevo?: string;
  cliente?: string;
  material?: string;
  materia_prima?: string;
  ubicacion_almacen?: string;
  acabado?: string;
  calibre?: string;
  medidas_pieza_mm?: string;
  empaque_de?: string;
  piezas_por_hora?: number;
  ancho_tira_mm?: number;
  piezas_lamina_4x8_a?: number;
  piezas_por_lamina_4x8?: number;
  piezas_por_lamina_2x1?: number;
}

export type NewProductoData = Omit<Producto, 'codigo'> & { codigo: string };

export interface Cliente {
  id: number;
  nombre: string;
  empresa: string;
  nit: string;
}

export type NewClienteData = Omit<Cliente, 'id'>;

export interface Personal {
  cedula: string;
  nombre: string;
  cargo: string;
}

export type NewPersonalData = Personal;

export interface Maquina {
  cod_actual: string;
  descripcion: string;
  adquirida_en: string;
  estado: 'Operativa' | 'En Mantenimiento' | 'Fuera de Servicio';
  observaciones?: string;
}

export type NewMaquinaData = Maquina;

export interface Mantenimiento {
    id_mantenimiento: number;
    maquina_equipo: string;
    fecha_programada: string;
    tipo_mantenimiento: 'Preventivo' | 'Correctivo';
    tecnico_responsable: string;
    estado: string;
}

export interface NewMantenimientoData {
    maquina_equipo: string;
    fecha_programada: string;
    tipo_mantenimiento: 'Preventivo' | 'Correctivo';
    tecnico_responsable: string;
    estado: string;
    descripcion_mantenimiento?: string;
    insumos_utilizados?: string;
    observaciones?: string;
}

export interface MateriaPrima {
    material: string;
    descripcion?: string;
    cantidad_stock: number;
    unidad_medida: string;
    peso_unitario_k?: number;
    proveedor?: string;
    fecha_ingreso?: string;
    estado: 'Disponible' | 'Reservado';
}

export type NewMateriaPrimaData = MateriaPrima;

export interface RegistroCalidad {
    id_reg_calidad: number;
    no_ot: number;
    proceso_inspeccionado?: string;
    fecha_hora_inspeccion: string;
    responsable: string;
    aprobado_rechazado: 'Aprobado' | 'Rechazado';
}

export interface NewRegistroCalidadData {
    no_ot: number;
    proceso_inspeccionado?: string;
    pieza?: string;
    tipo_verificacion?: string;
    verificacion_visual?: string;
    medida_1?: number;
    medida_2?: number;
    fecha_hora_inspeccion: string;
    responsable: string;
    aprobado_rechazado: 'Aprobado' | 'Rechazado';
    observaciones?: string;
}