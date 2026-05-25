"use client"

import { useEffect, useState } from "react"
import GlassTable from "@/components/GlassTable"
import SearchInput from "@/components/SearchInput"
import Modal from "@/components/Modal"
import { getProductos, buscarProductos, createProducto, updateProducto, deleteProducto, getProveedores } from "@/lib/api"
import type { Producto, ProductoCrear, ProductoActualizar, Proveedor } from "@/lib/types"

const defaultForm: ProductoCrear = {
  nombre: "",
  id_proveedor: "",
  stock_actual: 0,
  costo_unitario: 0,
  costo_almacenamiento_anual: 0,
  demanda_anual_estimada: 0,
}

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Producto | null>(null)
  const [form, setForm] = useState<ProductoCrear>(defaultForm)
  const [error, setError] = useState("")

  useEffect(() => {
    getProductos().then(setProductos).catch(() => {})
    getProveedores().then(setProveedores).catch(() => {})
  }, [])

  useEffect(() => {
    if (!search.trim()) {
      getProductos().then(setProductos).catch(() => {})
      return
    }
    const timer = setTimeout(() => {
      buscarProductos(search).then(setProductos).catch(() => {})
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  function proveedorNombre(id: string) {
    return proveedores.find((p) => p.id === id)?.nombre || id
  }

  function openCreate() {
    setEditing(null)
    setForm(defaultForm)
    setError("")
    setModalOpen(true)
  }

  function openEdit(p: Producto) {
    setEditing(p)
    setForm({
      nombre: p.nombre,
      id_proveedor: p.id_proveedor,
      stock_actual: p.stock_actual,
      costo_unitario: p.costo_unitario,
      costo_almacenamiento_anual: p.costo_almacenamiento_anual,
      demanda_anual_estimada: p.demanda_anual_estimada,
    })
    setError("")
    setModalOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!form.nombre.trim()) { setError("El nombre es obligatorio"); return }
    if (!form.id_proveedor) { setError("Debe seleccionar un proveedor"); return }
    if (form.stock_actual < 0) { setError("Stock no puede ser negativo"); return }
    if (form.costo_unitario <= 0) { setError("Costo unitario debe ser > 0"); return }
    try {
      if (editing) {
        const updated: ProductoActualizar = { ...form }
        await updateProducto(editing.id, updated)
      } else {
        await createProducto(form)
      }
      const data = await getProductos()
      setProductos(data)
      setSearch("")
      setModalOpen(false)
    } catch (err) {
      setError(String(err))
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteProducto(id)
      setProductos((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      setError(String(err))
    }
  }

  return (
    <div className="flex-1 px-8 pb-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-white/90 font-clash">Productos</h1>
        <button
          onClick={openCreate}
          className="px-5 py-2 rounded-full glass text-[11px] uppercase tracking-[0.3em] text-white/90 hover:text-white hover:bg-white/5 transition-all duration-300 cursor-pointer font-satoshi font-medium"
        >
          + Nuevo
        </button>
      </div>

      <div className="mb-6">
        <SearchInput value={search} onChange={setSearch} placeholder="Buscar producto por nombre..." />
      </div>

      <GlassTable
        columns={[
          { key: "nombre", header: "Nombre" },
          { key: "id_proveedor", header: "Proveedor", render: (p: Producto) => proveedorNombre(p.id_proveedor) },
          { key: "stock_actual", header: "Stock" },
          { key: "costo_unitario", header: "Costo Unit.", render: (p: Producto) => `$${p.costo_unitario.toFixed(2)}` },
          { key: "demanda_anual_estimada", header: "Demanda Anual", render: (p: Producto) => p.demanda_anual_estimada.toLocaleString() },
          {
            key: "acciones",
            header: "",
            render: (p: Producto) => (
              <div className="flex gap-3">
                <button onClick={() => openEdit(p)} className="text-[10px] uppercase tracking-[0.3em] text-cyan hover:text-white transition-colors cursor-pointer font-satoshi font-medium">Editar</button>
                <button onClick={() => handleDelete(p.id)} className="text-[10px] uppercase tracking-[0.3em] text-pink hover:text-white transition-colors cursor-pointer font-satoshi font-medium">Eliminar</button>
              </div>
            ),
          },
        ]}
        data={productos.filter((p) => p.estado_activo)}
        keyExtractor={(p) => p.id}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar Producto" : "Nuevo Producto"}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-satoshi font-bold block mb-1">Nombre</label>
            <input
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full glass rounded-xl px-4 py-2.5 text-sm text-white/90 outline-none font-satoshi"
              placeholder="Nombre del producto"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-satoshi font-bold block mb-1">Proveedor</label>
            <select
              value={form.id_proveedor}
              onChange={(e) => setForm({ ...form, id_proveedor: e.target.value })}
              className="w-full glass rounded-xl px-4 py-2.5 text-sm text-white/90 outline-none font-satoshi appearance-none"
            >
              <option value="" className="bg-obsidian">Seleccionar proveedor</option>
              {proveedores.filter((p) => p.estado_activo).map((p) => (
                <option key={p.id} value={p.id} className="bg-obsidian">{p.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-satoshi font-bold block mb-1">Stock Actual</label>
            <input
              type="number"
              value={form.stock_actual ?? ""}
              onChange={(e) => setForm({ ...form, stock_actual: parseInt(e.target.value) || 0 })}
              className="w-full glass rounded-xl px-4 py-2.5 text-sm text-white/90 outline-none font-satoshi"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-satoshi font-bold block mb-1">Costo Unitario</label>
            <input
              type="number" step="0.01"
              value={form.costo_unitario || ""}
              onChange={(e) => setForm({ ...form, costo_unitario: parseFloat(e.target.value) || 0 })}
              className="w-full glass rounded-xl px-4 py-2.5 text-sm text-white/90 outline-none font-satoshi"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-satoshi font-bold block mb-1">Costo Almacenamiento Anual</label>
            <input
              type="number" step="0.01"
              value={form.costo_almacenamiento_anual || ""}
              onChange={(e) => setForm({ ...form, costo_almacenamiento_anual: parseFloat(e.target.value) || 0 })}
              className="w-full glass rounded-xl px-4 py-2.5 text-sm text-white/90 outline-none font-satoshi"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-satoshi font-bold block mb-1">Demanda Anual Estimada</label>
            <input
              type="number"
              value={form.demanda_anual_estimada || ""}
              onChange={(e) => setForm({ ...form, demanda_anual_estimada: parseFloat(e.target.value) || 0 })}
              className="w-full glass rounded-xl px-4 py-2.5 text-sm text-white/90 outline-none font-satoshi"
            />
          </div>
          {error && <p className="text-pink text-xs font-satoshi">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 rounded-full font-satoshi text-sm font-medium text-white transition-all duration-300 cursor-pointer"
            style={{ background: "linear-gradient(to right, #ff2d55, #00f2ff)" }}
          >
            {editing ? "Actualizar" : "Crear Producto"}
          </button>
        </form>
      </Modal>
    </div>
  )
}
