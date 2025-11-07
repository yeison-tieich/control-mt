import { API_BASE_URL } from '../constants';
import type { OrdenProduccion, KpiData, Producto, Cliente, NewOrderData } from '../types';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error desconocido del servidor' }));
    throw new Error(errorData.message || `Error HTTP ${response.status}`);
  }
  return response.json();
};

export const fetchOrdenes = async (): Promise<OrdenProduccion[]> => {
  const response = await fetch(`${API_BASE_URL}/ordenes-produccion`);
  const data = await handleResponse(response);
  // Map snake_case from backend to camelCase for frontend
  return data.map((item: any) => ({
    id: item.id,
    nombreProducto: item.nombre_producto,
    nombreCliente: item.nombre_cliente,
    cantidadSolicitada: item.cantidad_solicitada,
    estado: item.estado,
    prioridad: item.prioridad,
    fechaCreacion: item.fecha_creacion,
  }));
};

export const fetchKpiData = async (): Promise<KpiData> => {
  const response = await fetch(`${API_BASE_URL}/kpis`);
  return handleResponse(response);
};

export const fetchProductos = async (): Promise<Producto[]> => {
  const response = await fetch(`${API_BASE_URL}/productos`);
  const data = await handleResponse(response);
    // Map snake_case from backend to camelCase for frontend
  return data.map((item: any) => ({
    id: item.id,
    nombre: item.nombre_producto,
    codigoProducto: item.codigo_producto,
    imageUrl: item.imagen_url,
    nombreMaterial: item.nombre_material,
    acabado: item.acabado,
    medidaPieza: item.medida_pieza,
    stock: item.stock_disponible || 0,
  }));
};

export const fetchClientes = async (): Promise<Cliente[]> => {
    const response = await fetch(`${API_BASE_URL}/clientes`);
    return handleResponse(response);
};

export const updateOrderStatus = async (id: number, newStatus: string): Promise<OrdenProduccion> => {
  const response = await fetch(`${API_BASE_URL}/ordenes-produccion/${id}/estado`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado: newStatus }),
  });
  return handleResponse(response);
};

export const deleteOrden = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/ordenes-produccion/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error desconocido del servidor' }));
    throw new Error(errorData.message || `Error HTTP ${response.status}`);
  }
};

export const createOrden = async (ordenData: NewOrderData): Promise<OrdenProduccion> => {
    const response = await fetch(`${API_BASE_URL}/ordenes-produccion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cliente_id: ordenData.clienteId,
        producto_id: ordenData.productoId,
        cantidad_solicitada: ordenData.cantidadSolicitada,
        prioridad: ordenData.prioridad,
        estado: 'Pendiente', // Default state on creation
      }),
    });
    return handleResponse(response);
};

export const uploadProductImage = async (id: number, imageBase64: string): Promise<Producto> => {
    const response = await fetch(`${API_BASE_URL}/productos/${id}/upload-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageBase64 }),
    });
    return handleResponse(response);
};
