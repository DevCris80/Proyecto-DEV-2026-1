"use client"

import { useEffect, useState } from "react"
import GlassCard from "@/components/GlassCard"
import StatusIndicator from "@/components/StatusIndicator"
import { getResumenDashboard, getAlertasPedidos } from "@/lib/api"
import type { DashboardResumen, OrdenSugerida } from "@/lib/types"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts"

const COLORS = ["#ff2d55", "#c1ff72", "#00f2ff", "#ffffff20"]

export default function DashboardPage() {
  const [resumen, setResumen] = useState<DashboardResumen | null>(null)
  const [alertas, setAlertas] = useState<OrdenSugerida[]>([])

  useEffect(() => {
    Promise.all([
      getResumenDashboard(),
      getAlertasPedidos(),
    ]).then(([res, alert]) => {
      setResumen(res)
      setAlertas(alert)
    }).catch(() => {})
  }, [])

  const chartData = resumen?.ventas_por_mes ?? []

  const stockData = [
    { name: "Stock bajo (<10)", value: resumen?.distribucion_stock.bajo ?? 0 },
    { name: "Stock medio (10-50)", value: resumen?.distribucion_stock.medio ?? 0 },
    { name: "Stock alto (>50)", value: resumen?.distribucion_stock.alto ?? 0 },
  ]

  const urgentes = alertas.filter((a) => a.estado_alerta === "Urgente" || a.estado_alerta === "Pedir ahora")

  return (
    <div className="flex-1 px-8 pb-4 overflow-y-auto">
      <h1 className="text-2xl font-semibold text-white/90 font-clash mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <GlassCard glow="pink" padding="p-6">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-satoshi font-bold">Proveedores</span>
            <span className="text-4xl font-bold text-white/90 font-clash">{resumen?.total_proveedores ?? 0}</span>
          </div>
        </GlassCard>
        <GlassCard glow="lime" padding="p-6">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-satoshi font-bold">Productos</span>
            <span className="text-4xl font-bold text-white/90 font-clash">{resumen?.total_productos ?? 0}</span>
          </div>
        </GlassCard>
        <GlassCard glow="cyan" padding="p-6">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-satoshi font-bold">Ventas</span>
            <span className="text-4xl font-bold text-white/90 font-clash">{resumen?.total_ventas ?? 0}</span>
          </div>
        </GlassCard>
        <GlassCard glow="pink" padding="p-6">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-satoshi font-bold">Alertas</span>
            <span className="text-4xl font-bold text-white/90 font-clash">{urgentes.length}</span>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <GlassCard padding="p-6">
          <h3 className="text-sm font-semibold text-white/90 font-clash mb-4 uppercase tracking-[0.3em]">Ventas por Mes</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="mes" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#02040a", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "1rem" }} />
                <Bar dataKey="cantidad" fill="#ff2d55" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-white/50 font-satoshi">Sin datos de ventas</p>
          )}
        </GlassCard>

        <GlassCard padding="p-6">
          <h3 className="text-sm font-semibold text-white/90 font-clash mb-4 uppercase tracking-[0.3em]">Distribución de Stock</h3>
          {stockData.some((d) => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stockData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="value"
                  stroke="none"
                >
                  {stockData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#02040a", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "1rem" }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-white/50 font-satoshi">Sin datos de productos</p>
          )}
          <div className="flex justify-center gap-6 mt-4">
            {stockData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-[10px] text-white/90 font-satoshi">{d.name}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {urgentes.length > 0 && (
        <GlassCard glow="pink" padding="p-6" className="mb-8">
          <h3 className="text-sm font-semibold text-white/90 font-clash mb-4 uppercase tracking-[0.3em]">Alertas de Pedido</h3>
          <div className="flex flex-col gap-3">
            {urgentes.map((a) => (
              <div key={a.id_producto} className="flex items-center justify-between py-2 border-b border-glass-border last:border-0">
                <div>
                  <span className="text-sm text-white/90 font-satoshi">{a.nombre_producto}</span>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-white/60 font-satoshi uppercase tracking-[0.3em]">Stock: {a.punto_reorden}</span>
                    <StatusIndicator />
                  </div>
                </div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-pink font-satoshi font-bold">{a.estado_alerta}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  )
}
