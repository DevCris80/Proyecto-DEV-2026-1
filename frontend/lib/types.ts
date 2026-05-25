export interface Proveedor {
  id: string
  nombre: string
  costo_pedido_fijo: number
  lead_time_promedio: number
  desviacion_estandar_lead_time: number
  nivel_servicio_objetivo: number
  estado_activo: boolean
  imagen_url?: string
}

export interface ProveedorCrear {
  nombre: string
  costo_pedido_fijo: number
  lead_time_promedio: number
  desviacion_estandar_lead_time?: number
  nivel_servicio_objetivo?: number
}

export interface ProveedorActualizar {
  nombre?: string
  costo_pedido_fijo?: number
  lead_time_promedio?: number
  desviacion_estandar_lead_time?: number
  nivel_servicio_objetivo?: number
  estado_activo?: boolean
  imagen_url?: string
}

export interface Producto {
  id: string
  nombre: string
  id_proveedor: string
  stock_actual: number
  costo_unitario: number
  costo_almacenamiento_anual: number
  demanda_anual_estimada: number
  estado_activo: boolean
  imagen_url?: string
}

export interface ProductoCrear {
  nombre: string
  id_proveedor: string
  stock_actual: number
  costo_unitario: number
  costo_almacenamiento_anual: number
  demanda_anual_estimada: number
}

export interface ProductoActualizar {
  nombre?: string
  id_proveedor?: string
  stock_actual?: number
  costo_unitario?: number
  costo_almacenamiento_anual?: number
  demanda_anual_estimada?: number
  estado_activo?: boolean
  imagen_url?: string
}

export interface Venta {
  id: string
  id_producto: string
  cantidad: number
  fecha_venta: string
}

export interface VentaCrear {
  id_producto: string
  cantidad: number
  fecha_venta?: string
}

export interface DashboardResumen {
  total_proveedores: number
  total_productos: number
  total_ventas: number
  ventas_por_mes: { mes: string; cantidad: number }[]
  distribucion_stock: { bajo: number; medio: number; alto: number }
}

export interface OrdenSugerida {
  id_producto: string
  nombre_producto: string
  cantidad_eoq: number
  punto_reorden: number
  stock_seguridad: number
  fecha_sugerida_pedido: string
  estado_alerta: "optimo" | "Pedir ahora" | "Proximo pedido" | "Urgente"
}
