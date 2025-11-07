export interface OrdenProduccion {
  id: number;
  nombreProducto: string;
  nombreCliente: string;
  cantidadSolicitada: number;
  estado: 'Pendiente' | 'En Proceso' | 'Completada' | 'Cancelada';
  prioridad: 'Baja' | 'Media' | 'Alta';
  fechaCreacion: string;
}

export interface KpiData {
  total_ordenes: number;
  ordenes_completadas: number;
  porcentaje_completadas: number;
}

export interface Cliente {
  id: number;
  nombre_cliente: string;
  contacto: string;
  email: string;
}

export interface Producto {
  id: number;
  nombre: string;
  codigoProducto: string;
  imageUrl?: string;
  nombreMaterial: string;
  acabado: string;
  medidaPieza: string;
  stock: number;
}

export interface NewOrderData {
  clienteId: number;
  productoId: number;
  cantidadSolicitada: number;
  prioridad: 'Normal' | 'Urgente';
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
    maquinaId: number;
    maquinaNombre: string;
    fechaProgramada: string;
    tipo: 'Preventivo' | 'Correctivo';
    estado: 'Programado' | 'En Proceso' | 'Completado';
}

export interface NewMantenimientoData {
    maquinaId: number;
    fechaProgramada: string;
    tipo: 'Preventivo' | 'Correctivo';
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

export interface ControlCalidad {
    id: number;
    ordenId: number;
    productoNombre: string;
    fechaInspeccion: string;
    resultado: 'Aprobado' | 'Rechazado';
    observaciones: string;
}

export interface NewControlCalidadData {
    ordenId: number;
    resultado: 'Aprobado' | 'Rechazado';
    observaciones: string;
}

export interface NewClienteData {
    nombre_cliente: string;
    contacto: string;
    email: string;
}
