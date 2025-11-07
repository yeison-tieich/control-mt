export interface OrdenProduccion {
  id: number;
  nombreProducto: string;
  nombreCliente: string;
  cantidadSolicitada: number;
  estado: 'Pendiente' | 'En Proceso' | 'Completada' | 'Cancelada';
  prioridad: 'Baja' | 'Media' | 'Alta';
  fechaCreacion: string; // ISO date string
}

export interface KpiData {
  total_ordenes: number;
  ordenes_completadas: number;
  porcentaje_completadas: number;
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

export interface Cliente {
  id: number;
  nombre_cliente: string;
}

export interface NewOrderData {
  clienteId: number;
  productoId: number;
  cantidadSolicitada: number;
  prioridad: 'Baja' | 'Media' | 'Alta';
}
