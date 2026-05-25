"use client"

import { useEffect, useState, useCallback } from "react"
import GlassTable from "@/components/GlassTable"
import SearchInput from "@/components/SearchInput"
import Modal from "@/components/Modal"
import { getProveedores, createProveedor, updateProveedor, deleteProveedor } from "@/lib/api"
import type { Proveedor, ProveedorCrear, ProveedorActualizar } from "@/lib/types"

const defaultForm: ProveedorCrear = {
  nombre: "",
  costo_pedido_fijo: 0,
  lead_time_promedio: 0,
  desviacion_estandar_lead_time: 0,
  nivel_servicio_objetivo: 0.95,
}

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Proveedor | null>(null)
  const [form, setForm] = useState<ProveedorCrear>(defaultForm)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const fetchProveedores = useCallback(async () => {
    try {
      const data = await getProveedores()
      setProveedores(data)
    } catch { }
  }, [])

  useEffect(() => {
    fetchProveedores()
  }, [fetchProveedores])

  const filtered = proveedores.filter(
    (p) => p.nombre.toLowerCase().includes(search.toLowerCase()) && p.estado_activo
  )

  function openCreate() {
    setEditing(null)
    setForm({ ...defaultForm })
    setError("")
    setModalOpen(true)
  }

  function openEdit(p: Proveedor) {
    setEditing(p)
    setForm({
      nombre: p.nombre,
      costo_pedido_fijo: p.costo_pedido_fijo,
      lead_time_promedio: p.lead_time_promedio,
      desviacion_estandar_lead_time: p.desviacion_estandar_lead_time,
      nivel_servicio_objetivo: p.nivel_servicio_objetivo,
    })
    setError("")
    setModalOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!form.nombre.trim()) { setError("El nombre es obligatorio"); return }
    if (form.costo_pedido_fijo <= 0) { setError("Costo de pedido debe ser > 0"); return }
    if (form.lead_time_promedio <= 0) { setError("Lead time debe ser > 0"); return }
    setLoading(true)
    try {
      if (editing) {
        const updated: ProveedorActualizar = { ...form }
        await updateProveedor(editing.id, updated)
      } else {
        await createProveedor(form)
      }
      setModalOpen(false)
      await fetchProveedores()
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteProveedor(id)
      setProveedores((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      setError(String(err))
    }
  }

  return (
    <div className="flex-1 px-8 pb-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-white/90 font-clash">Proveedores</h1>
        <button
          onClick={openCreate}
          className="px-5 py-2 rounded-full glass text-[11px] uppercase tracking-[0.3em] text-white/90 hover:text-white hover:bg-white/5 transition-all duration-300 cursor-pointer font-satoshi font-medium"
        >
          + Nuevo
        </button>
      </div>

      <div className="mb-6">
        <SearchInput value={search} onChange={setSearch} placeholder="Buscar proveedor..." />
      </div>

      <GlassTable
        columns={[
          { key: "nombre", header: "Nombre" },
          { key: "costo_pedido_fijo", header: "Costo Pedido", render: (p: Proveedor) => `$${p.costo_pedido_fijo.toFixed(2)}` },
          { key: "lead_time_promedio", header: "Lead Time", render: (p: Proveedor) => `${p.lead_time_promedio} días` },
          { key: "nivel_servicio_objetivo", header: "Nivel Servicio", render: (p: Proveedor) => `${(p.nivel_servicio_objetivo * 100).toFixed(0)}%` },
          {
            key: "acciones",
            header: "",
            render: (p: Proveedor) => (
              <div className="flex gap-3">
                <button onClick={() => openEdit(p)} className="text-[10px] uppercase tracking-[0.3em] text-cyan hover:text-white transition-colors cursor-pointer font-satoshi font-medium">Editar</button>
                <button onClick={() => handleDelete(p.id)} className="text-[10px] uppercase tracking-[0.3em] text-pink hover:text-white transition-colors cursor-pointer font-satoshi font-medium">Eliminar</button>
              </div>
            ),
          },
        ]}
        data={filtered}
        keyExtractor={(p) => p.id}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar Proveedor" : "Nuevo Proveedor"}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-satoshi font-bold block mb-1">Nombre</label>
            <input
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full glass rounded-xl px-4 py-2.5 text-sm text-white/90 outline-none font-satoshi"
              placeholder="Nombre del proveedor"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-satoshi font-bold block mb-1">Costo Pedido Fijo</label>
            <input
              type="number" step="0.01"
              value={form.costo_pedido_fijo === 0 ? "" : form.costo_pedido_fijo}
              onChange={(e) => {
                const val = e.target.value
                setForm({ ...form, costo_pedido_fijo: val === "" ? 0 : parseFloat(val) })
              }}
              className="w-full glass rounded-xl px-4 py-2.5 text-sm text-white/90 outline-none font-satoshi"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-satoshi font-bold block mb-1">Lead Time Promedio (días)</label>
            <input
              type="number" step="0.1"
              value={form.lead_time_promedio === 0 ? "" : form.lead_time_promedio}
              onChange={(e) => {
                const val = e.target.value
                setForm({ ...form, lead_time_promedio: val === "" ? 0 : parseFloat(val) })
              }}
              className="w-full glass rounded-xl px-4 py-2.5 text-sm text-white/90 outline-none font-satoshi"
              placeholder="0"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-satoshi font-bold block mb-1">Desviación Estándar Lead Time</label>
            <input
              type="number" step="0.1"
              value={form.desviacion_estandar_lead_time === 0 ? "" : form.desviacion_estandar_lead_time}
              onChange={(e) => {
                const val = e.target.value
                setForm({ ...form, desviacion_estandar_lead_time: val === "" ? 0 : parseFloat(val) })
              }}
              className="w-full glass rounded-xl px-4 py-2.5 text-sm text-white/90 outline-none font-satoshi"
              placeholder="0"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-satoshi font-bold block mb-1">Nivel Servicio (0.8 - 0.99)</label>
            <input
              type="number" step="0.01" min="0.8" max="0.99"
              value={form.nivel_servicio_objetivo === 0.95 ? "" : form.nivel_servicio_objetivo}
              onChange={(e) => {
                const val = e.target.value
                setForm({ ...form, nivel_servicio_objetivo: val === "" ? 0.95 : parseFloat(val) })
              }}
              className="w-full glass rounded-xl px-4 py-2.5 text-sm text-white/90 outline-none font-satoshi"
              placeholder="0.95"
            />
          </div>
          {error && <p className="text-pink text-xs font-satoshi">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full font-satoshi text-sm font-medium text-white transition-all duration-300 cursor-pointer disabled:opacity-50"
            style={{ background: "linear-gradient(to right, #ff2d55, #00f2ff)" }}
          >
            {loading ? "Guardando..." : editing ? "Actualizar" : "Crear Proveedor"}
          </button>
        </form>
      </Modal>
    </div>
  )
}
