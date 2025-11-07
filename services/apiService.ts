import { API_BASE_URL } from '../constants';
import type { 
    OrdenProduccion, 
    KpiData, 
    Cliente, 
    Producto, 
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
    ControlCalidad,
    NewControlCalidadData
} from '../types';

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Error en la respuesta del servidor' }));
        throw new Error(error.message || `Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
};

const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });
    return handleResponse(response);
};

// Mock functions since we don't have a real API
// In a real scenario, these would make actual API calls
let mockOrdenes: OrdenProduccion[] = [
    { id: 101, nombreProducto: 'Puerta de Cedro', nombreCliente: 'Constructora XYZ', cantidadSolicitada: 10, estado: 'En Proceso', prioridad: 'Alta', fechaCreacion: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 102, nombreProducto: 'Ventana de Aluminio', nombreCliente: 'Juan Pérez', cantidadSolicitada: 5, estado: 'Pendiente', prioridad: 'Media', fechaCreacion: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 103, nombreProducto: 'Gabinete de Cocina', nombreCliente: 'Ana García', cantidadSolicitada: 2, estado: 'Completada', prioridad: 'Baja', fechaCreacion: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
];

let mockProductos: Producto[] = [
    { id: 1, nombre: 'Puerta de Cedro', codigoProducto: 'P-CED-001', imageUrl: 'https://via.placeholder.com/300x200.png?text=Puerta+Cedro', nombreMaterial: 'Madera de Cedro', acabado: 'Barnizado Natural', medidaPieza: '210x90cm', stock: 15 },
    { id: 2, nombre: 'Ventana de Aluminio', codigoProducto: 'V-ALU-002', imageUrl: 'https://via.placeholder.com/300x200.png?text=Ventana+Aluminio', nombreMaterial: 'Aluminio Anodizado', acabado: 'Blanco', medidaPieza: '120x150cm', stock: 30 },
];
let mockClientes: Cliente[] = [
    { id: 1, nombre_cliente: 'Constructora XYZ', contacto: 'Carlos Rodriguez', email: 'carlos@constructoraxyz.com' },
    { id: 2, nombre_cliente: 'Juan Pérez', contacto: 'Juan Pérez', email: 'juan.perez@email.com' },
    { id: 3, nombre_cliente: 'Ana García', contacto: 'Ana García', email: 'ana.garcia@email.com' },
];
let mockPersonal: Personal[] = [
    { id: 1, nombreCompleto: 'Mario López', cedula: '12345678', cargo: 'Operador de Sierra' },
    { id: 2, nombreCompleto: 'Luisa Martinez', cedula: '87654321', cargo: 'Ensambladora' },
];

// In a real app, I'd remove the mock logic and use `apiFetch`
export const fetchOrdenes = async (): Promise<OrdenProduccion[]> => {
    console.log('Fetching Ordenes (mock)');
    return Promise.resolve(mockOrdenes);
    // return apiFetch('ordenes');
};

export const fetchKpiData = async (): Promise<KpiData> => {
    console.log('Fetching KPI Data (mock)');
    const completadas = mockOrdenes.filter(o => o.estado === 'Completada').length;
    const total = mockOrdenes.length;
    return Promise.resolve({
        total_ordenes: total,
        ordenes_completadas: completadas,
        porcentaje_completadas: total > 0 ? (completadas / total) * 100 : 0,
    });
    // return apiFetch('kpis');
};

export const fetchClientes = async (): Promise<Cliente[]> => {
    console.log('Fetching Clientes (mock)');
    return Promise.resolve(mockClientes);
    // return apiFetch('clientes');
};

export const fetchProductos = async (): Promise<Producto[]> => {
    console.log('Fetching Productos (mock)');
    return Promise.resolve(mockProductos);
    // return apiFetch('productos');
};

export const createOrden = async (orderData: NewOrderData): Promise<OrdenProduccion> => {
    console.log('Creating Orden (mock)', orderData);
    const newId = Math.max(...mockOrdenes.map(o => o.id), 0) + 1;
    const producto = mockProductos.find(p => p.id === orderData.productoId);
    const cliente = mockClientes.find(c => c.id === orderData.clienteId);
    const newOrder: OrdenProduccion = {
        id: newId,
        nombreProducto: producto?.nombre || 'Producto Desconocido',
        nombreCliente: cliente?.nombre_cliente || 'Cliente Desconocido',
        cantidadSolicitada: orderData.cantidadSolicitada,
        estado: 'Pendiente',
        prioridad: orderData.prioridad === 'Urgente' ? 'Alta' : 'Media',
        fechaCreacion: new Date().toISOString(),
    };
    mockOrdenes = [newOrder, ...mockOrdenes];
    return Promise.resolve(newOrder);
    // return apiFetch('ordenes', { method: 'POST', body: JSON.stringify(orderData) });
};

export const updateOrderStatus = async (orderId: number, newStatus: string): Promise<OrdenProduccion> => {
     console.log(`Updating order ${orderId} to ${newStatus} (mock)`);
     const orderIndex = mockOrdenes.findIndex(o => o.id === orderId);
     if (orderIndex === -1) throw new Error('Orden no encontrada');
     mockOrdenes[orderIndex].estado = newStatus as OrdenProduccion['estado'];
     return Promise.resolve(mockOrdenes[orderIndex]);
    // return apiFetch(`ordenes/${orderId}/status`, { method: 'PUT', body: JSON.stringify({ estado: newStatus }) });
};

export const deleteOrden = async (orderId: number): Promise<void> => {
    console.log(`Deleting order ${orderId} (mock)`);
    mockOrdenes = mockOrdenes.filter(o => o.id !== orderId);
    return Promise.resolve();
    // return apiFetch(`ordenes/${orderId}`, { method: 'DELETE' });
};

export const uploadProductImage = async (productId: number, imageBase64: string): Promise<Producto> => {
    console.log(`Uploading image for product ${productId} (mock)`);
    const productIndex = mockProductos.findIndex(p => p.id === productId);
    if(productIndex === -1) throw new Error('Producto no encontrado');
    mockProductos[productIndex].imageUrl = imageBase64; // In reality, this would be a URL returned from the server.
    return Promise.resolve(mockProductos[productIndex]);
    // return apiFetch(`productos/${productId}/image`, { method: 'POST', body: JSON.stringify({ image: imageBase64 }) });
};

export const fetchPersonal = async (): Promise<Personal[]> => {
    console.log('Fetching Personal (mock)');
    return Promise.resolve(mockPersonal);
    // return apiFetch('personal');
};

export const createPersonal = async (personalData: NewPersonalData): Promise<Personal> => {
    console.log('Creating Personal (mock)', personalData);
    const newId = Math.max(...mockPersonal.map(p => p.id), 0) + 1;
    const newPersonal = { id: newId, ...personalData };
    mockPersonal.push(newPersonal);
    return Promise.resolve(newPersonal);
    // return apiFetch('personal', { method: 'POST', body: JSON.stringify(personalData) });
};

// Functions for other screens (placeholders)
export const createCliente = async (clienteData: NewClienteData): Promise<Cliente> => {
    const newId = Math.max(...mockClientes.map(c => c.id), 0) + 1;
    const newCliente = { id: newId, ...clienteData };
    mockClientes.push(newCliente);
    return Promise.resolve(newCliente);
    // return apiFetch('clientes', { method: 'POST', body: JSON.stringify(clienteData) });
}

export const fetchMaquinas = async (): Promise<Maquina[]> => {
    return Promise.resolve([]);
    // return apiFetch('maquinas');
}
export const createMaquina = async (maquinaData: NewMaquinaData): Promise<Maquina> => {
    return Promise.resolve({ id: 99, ...maquinaData });
    // return apiFetch('maquinas', { method: 'POST', body: JSON.stringify(maquinaData) });
}

export const fetchMantenimientos = async (): Promise<Mantenimiento[]> => {
    return Promise.resolve([]);
    // return apiFetch('mantenimientos');
}
export const createMantenimiento = async (mantenimientoData: NewMantenimientoData): Promise<Mantenimiento> => {
    const mockMantenimiento = { id: 99, maquinaNombre: 'Torno CNC', estado: 'Programado' as const, ...mantenimientoData };
    return Promise.resolve(mockMantenimiento);
    // return apiFetch('mantenimientos', { method: 'POST', body: JSON.stringify(mantenimientoData) });
}

export const fetchMateriasPrimas = async (): Promise<MateriaPrima[]> => {
    return Promise.resolve([]);
    // return apiFetch('materias-primas');
}
export const createMateriaPrima = async (data: NewMateriaPrimaData): Promise<MateriaPrima> => {
    return Promise.resolve({ id: 99, ...data });
    // return apiFetch('materias-primas', { method: 'POST', body: JSON.stringify(data) });
}

export const fetchControlesCalidad = async (): Promise<ControlCalidad[]> => {
    return Promise.resolve([]);
    // return apiFetch('calidad');
}
export const createControlCalidad = async (data: NewControlCalidadData): Promise<ControlCalidad> => {
    const mockCalidad = { id: 99, productoNombre: 'Puerta de Cedro', fechaInspeccion: new Date().toISOString(), ...data };
    return Promise.resolve(mockCalidad);
    // return apiFetch('calidad', { method: 'POST', body: JSON.stringify(data) });
}
