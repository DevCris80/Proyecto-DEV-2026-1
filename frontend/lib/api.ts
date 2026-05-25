import type {
  Proveedor, ProveedorCrear, ProveedorActualizar,
  Producto, ProductoCrear, ProductoActualizar,
  Venta, VentaCrear,
  OrdenSugerida,
} from "./types"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API error ${res.status}: ${text}`)
  }
  return res.json()
}

/* Proveedores */
export function getProveedores(): Promise<Proveedor[]> {
  return fetchJSON(`${API}/proveedores`)
}

export function createProveedor(data: ProveedorCrear): Promise<Proveedor> {
  return fetchJSON(`${API}/proveedores`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function updateProveedor(id: string, data: ProveedorActualizar): Promise<Proveedor> {
  return fetchJSON(`${API}/proveedores/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export function deleteProveedor(id: string): Promise<void> {
  return fetchJSON(`${API}/proveedores/${id}`, { method: "DELETE" })
}

/* Productos */
export function getProductos(estado?: boolean): Promise<Producto[]> {
  const params = estado !== undefined ? `?estado=${estado}` : ""
  return fetchJSON(`${API}/productos${params}`)
}

export function buscarProductos(nombre: string): Promise<Producto[]> {
  return fetchJSON(`${API}/productos/buscar/?nombre=${encodeURIComponent(nombre)}`)
}

export function createProducto(data: ProductoCrear): Promise<Producto> {
  return fetchJSON(`${API}/productos`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function updateProducto(id: string, data: ProductoActualizar): Promise<Producto> {
  return fetchJSON(`${API}/productos/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export function deleteProducto(id: string): Promise<void> {
  return fetchJSON(`${API}/productos/${id}`, { method: "DELETE" })
}

/* Ventas */
export function getVentas(): Promise<Venta[]> {
  return fetchJSON(`${API}/ventas`)
}

export function createVenta(data: VentaCrear): Promise<Venta> {
  return fetchJSON(`${API}/ventas`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

/* Optimización */
export function getAlertasPedidos(): Promise<OrdenSugerida[]> {
  return fetchJSON(`${API}/optimizar/pedidos`)
}

export function getSugerenciaProducto(id: string): Promise<OrdenSugerida> {
  return fetchJSON(`${API}/optimizar/${id}`)
}
