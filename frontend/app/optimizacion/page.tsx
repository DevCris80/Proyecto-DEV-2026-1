"use client"

import { useEffect, useState } from "react"
import GlassCard from "@/components/GlassCard"
import StatusIndicator from "@/components/StatusIndicator"
import { getAlertasPedidos } from "@/lib/api"
import type { OrdenSugerida } from "@/lib/types"

const alertaColor: Record<string, "pink" | "lime" | "cyan"> = {
  optimo: "lime",
  "Pedir ahora": "pink",
  "Proximo pedido": "cyan",
  Urgente: "pink",
}

const alertaLabel: Record<string, string> = {
  optimo: "Óptimo",
  "Pedir ahora": "Pedir Ahora",
  "Proximo pedido": "Próximo Pedido",
  Urgente: "Urgente",
}

export default function OptimizacionPage() {
  const [alertas, setAlertas] = useState<OrdenSugerida[]>([])

  useEffect(() => {
    getAlertasPedidos().then(setAlertas).catch(() => {})
  }, [])

  const urgentes = alertas.filter((a) => a.estado_alerta === "Urgente" || a.estado_alerta === "Pedir ahora")
  const normales = alertas.filter((a) => a.estado_alerta === "optimo" || a.estado_alerta === "Proximo pedido")

  if (alertas.length === 0) {
    return (
      <div className="flex-1 px-8 pb-4 overflow-y-auto">
        <h1 className="text-2xl font-semibold text-white/90 font-clash mb-8">Optimización de Inventario</h1>
        <GlassCard padding="p-8" className="text-center">
          <p className="text-white/60 font-satoshi text-sm">No hay datos de optimización disponibles. Registre productos y ventas primero.</p>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="flex-1 px-8 pb-4 overflow-y-auto">
      <h1 className="text-2xl font-semibold text-white/90 font-clash mb-8">Optimización de Inventario</h1>

      {urgentes.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm uppercase tracking-[0.3em] text-pink font-satoshi font-bold mb-4">Alertas Críticas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {urgentes.map((a) => (
              <GlassCard key={a.id_producto} glow={alertaColor[a.estado_alerta]} padding="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-base font-semibold text-white/90 font-clash">{a.nombre_producto}</h3>
                  <span
                    className="text-[10px] uppercase tracking-[0.3em] font-satoshi font-bold px-3 py-1 rounded-full glass"
                    style={{ color: a.estado_alerta === "Urgente" ? "#ff2d55" : "#00f2ff" }}
                  >
                    {alertaLabel[a.estado_alerta]}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center py-2 border-b border-glass-border">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-satoshi font-bold">Cantidad EOQ</span>
                    <span className="text-sm text-white/90 font-satoshi">{a.cantidad_eoq.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-glass-border">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-satoshi font-bold">Punto de Reorden</span>
                    <span className="text-sm text-white/90 font-satoshi">{a.punto_reorden.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-glass-border">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-satoshi font-bold">Stock Seguridad</span>
                    <span className="text-sm text-white/90 font-satoshi">{a.stock_seguridad.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-satoshi font-bold">Fecha Sugerida</span>
                    <span className="text-sm text-white/90 font-satoshi">{a.fecha_sugerida_pedido}</span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {normales.length > 0 && (
        <div>
          <h2 className="text-sm uppercase tracking-[0.3em] text-white/70 font-satoshi font-bold mb-4">Estado Normal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {normales.map((a) => (
              <GlassCard key={a.id_producto} glow={alertaColor[a.estado_alerta]} padding="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-base font-semibold text-white/90 font-clash">{a.nombre_producto}</h3>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-lime font-satoshi font-bold px-3 py-1 rounded-full glass">
                    {alertaLabel[a.estado_alerta]}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center py-2 border-b border-glass-border">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-satoshi font-bold">Cantidad EOQ</span>
                    <span className="text-sm text-white/90 font-satoshi">{a.cantidad_eoq.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-glass-border">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-satoshi font-bold">Punto de Reorden</span>
                    <span className="text-sm text-white/90 font-satoshi">{a.punto_reorden.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-glass-border">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-satoshi font-bold">Stock Seguridad</span>
                    <span className="text-sm text-white/90 font-satoshi">{a.stock_seguridad.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-satoshi font-bold">Fecha Sugerida</span>
                    <span className="text-sm text-white/90 font-satoshi">{a.fecha_sugerida_pedido}</span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
