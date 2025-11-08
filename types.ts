// types.ts

// --- Ordenes de Produccion ---
export interface OrdenProduccion {
  no_ot: string;
  cliente: string;
  fecha_emision: string;
  no_orden_compra: string;
  referencia: string;
  descripcion: string;
  cantidad_unidades: number;
  material_disponible: 'Sí' | 'No';
  tiempo_estimado_dias: number;
  prioridad: 'Baja' | 'Media' | 'Alta';
  foto: string;
  estado: 'Pendiente' | 'En Proceso' | 'Completada';
  observacion: string;
  material: string;
}
export interface NewOrderData extends Omit<OrdenProduccion, 'no_ot' | 'estado' | 'foto'> {}

// --- KPI ---
export interface KpiData {
  porcentaje_completadas: number;
  ordenes_completadas: number;
  total_ordenes: number;
}

// --- Inventario Producto ---
export interface Producto {
  codigo: string;
  codigo_nuevo: string;
  cliente: string;
  imagen_producto: string;
  producto: string;
  material: string;
  ubicacion_almacen: string;
  materia_prima: string;
  calibre: string;
  piezas_por_hora: number;
  ancho_tira_mm: number;
  medidas_pieza_mm: string;
  acabado: string;
  piezas_lamina_4x8_a: number;
  piezas_por_lamina_4x8: number;
  piezas_por_lamina_2x1: number;
  empaque_de: string;
}
export interface NewProductoData extends Omit<Producto, 'imagen_producto'> {}

// --- Personal ---
export interface Personal {
  nombre: string;
  cedula: string;
  cargo: string;
}
export interface NewPersonalData extends Personal {}

// --- Maquinas ---
export interface Maquina {
  cod_actual: string;
  descripcion: string;
  adquirida_en: string;
  estado: 'Operativa' | 'En Mantenimiento' | 'Fuera de Servicio';
  observaciones: string;
}
export interface NewMaquinaData extends Maquina {}

// --- Clientes ---
export interface Cliente {
  id: string;
  nombre: string;
  empresa: string;
  nit: string;
}
export interface NewClienteData extends Omit<Cliente, 'id'> {}

// --- Mantenimiento ---
export interface Mantenimiento {
  id_mantenimiento: string;
  maquina_equipo: string;
  tipo_mantenimiento: 'Preventivo' | 'Correctivo';
  fecha_programada: string;
  estado: string;
  tecnico_responsable: string;
  descripcion_mantenimiento: string;
  insumos_utilizados: string;
  foto: string;
  observaciones: string;
}
export interface NewMantenimientoData extends Omit<Mantenimiento, 'id_mantenimiento' | 'foto'> {}

// --- Registro de Calidad ---
export interface RegistroCalidad {
  id_reg_calidad: string;
  no_ot: string;
  proceso_inspeccionado: string;
  pieza: string;
  responsable: string;
  tipo_verificacion: string;
  verificacion_visual: string;
  medida_1: number;
  medida_2: number;
  aprobado_rechazado: 'Aprobado' | 'Rechazado';
  fecha_hora_inspeccion: string;
  foto: string;
  observaciones: string;
  firma: string;
}
export interface NewRegistroCalidadData extends Omit<RegistroCalidad, 'id_reg_calidad' | 'foto' | 'firma'> {}

// --- Control Materia Prima ---
export interface MateriaPrima {
  material: string;
  descripcion: string;
  foto: string;
  cantidad_stock: number;
  unidad_medida: string;
  peso_unitario_k: number;
  proveedor: string;
  fecha_ingreso: string;
  fecha_consumo: string;
  peso_k: number;
  estado: 'Disponible' | 'Reservado';
}
export interface NewMateriaPrimaData extends Omit<MateriaPrima, 'foto'> {}
