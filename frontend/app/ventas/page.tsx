"use client"

import { useEffect, useState } from "react"
import GlassTable from "@/components/GlassTable"
import GlassCard from "@/components/GlassCard"
import Modal from "@/components/Modal"
import { getVentas, createVenta, getProductos } from "@/lib/api"
import type { Venta, VentaCrear, Producto } from "@/lib/types"

export default function VentasPage() {
  const [ventas, setVentas] = useState<Venta[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<VentaCrear>({ id_producto: "", cantidad: 1 })
  const [error, setError] = useState("")

  useEffect(() => {
    Promise.all([getVentas(), getProductos()]).then(([v, p]) => {
      setVentas(v)
      setProductos(p)
    }).catch(() => {})
  }, [])

  function productoNombre(id: string) {
    return productos.find((p) => p.id === id)?.nombre || id
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!form.id_producto) { setError("Debe seleccionar un producto"); return }
    if (form.cantidad <= 0) { setError("La cantidad debe ser > 0"); return }
    try {
      await createVenta(form)
      const data = await getVentas()
      setVentas(data)
      setForm({ id_producto: "", cantidad: 1 })
      setModalOpen(false)
    } catch (err) {
      setError(String(err))
    }
  }

  return (
    <div className="flex-1 px-8 pb-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-white/90 font-clash">Ventas</h1>
        <button
          onClick={() => { setForm({ id_producto: "", cantidad: 1 }); setError(""); setModalOpen(true) }}
          className="px-5 py-2 rounded-full glass text-[11px] uppercase tracking-[0.3em] text-white/90 hover:text-white hover:bg-white/5 transition-all duration-300 cursor-pointer font-satoshi font-medium"
        >
          + Registrar Venta
        </button>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-4">
          <GlassCard padding="p-4" glow="cyan">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-satoshi font-bold">Total Ventas</span>
            <p className="text-2xl font-bold text-white/90 font-clash mt-1">{ventas.length}</p>
          </GlassCard>
        </div>
      </div>

      <GlassTable
        columns={[
          { key: "id", header: "ID", render: (v: Venta) => v.id.slice(0, 8) },
          { key: "id_producto", header: "Producto", render: (v: Venta) => productoNombre(v.id_producto) },
          { key: "cantidad", header: "Cantidad" },
          { key: "fecha_venta", header: "Fecha" },
        ]}
        data={ventas}
        keyExtractor={(v) => v.id}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Registrar Venta">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-satoshi font-bold block mb-1">Producto</label>
            <select
              value={form.id_producto}
              onChange={(e) => setForm({ ...form, id_producto: e.target.value })}
              className="w-full glass rounded-xl px-4 py-2.5 text-sm text-white/90 outline-none font-satoshi appearance-none"
            >
              <option value="" className="bg-obsidian">Seleccionar producto</option>
              {productos.filter((p) => p.estado_activo).map((p) => (
                <option key={p.id} value={p.id} className="bg-obsidian">{p.nombre} (stock: {p.stock_actual})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-satoshi font-bold block mb-1">Cantidad</label>
            <input
              type="number"
              value={form.cantidad || ""}
              onChange={(e) => setForm({ ...form, cantidad: parseInt(e.target.value) || 0 })}
              className="w-full glass rounded-xl px-4 py-2.5 text-sm text-white/90 outline-none font-satoshi"
              min="1"
            />
          </div>
          {error && <p className="text-pink text-xs font-satoshi">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 rounded-full font-satoshi text-sm font-medium text-white transition-all duration-300 cursor-pointer"
            style={{ background: "linear-gradient(to right, #ff2d55, #00f2ff)" }}
          >
            Registrar Venta
          </button>
        </form>
      </Modal>
    </div>
  )
}
