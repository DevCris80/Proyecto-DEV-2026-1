# AGENTS.md — SISPRO

## Backend (FastAPI + SQLModel + NeonDB)

### Stack
- Python 3.11+ / FastAPI (async)
- SQLModel (ORM) + asyncpg (NeonDB PostgreSQL)
- pydantic-settings (config via .env)
- uv (package manager)

### Commands

```bash
cd backend

# Install all deps (including dev)
uv sync --group dev

# Run development server
uv run uvicorn main:app --reload

# Run tests
uv run pytest -v

# Run a specific test
uv run pytest tests/test_api.py -v

# Add a dependency
uv add <package>

# Add a dev dependency
uv add --dev <package>
```

### Project Structure

```
backend/
├── pyproject.toml        ← uv config + deps
├── .env                  ← DATABASE_URL (NeonDB)
├── main.py               ← entry point + lifespan (create_all)
├── app/
│   ├── core/
│   │   ├── config.py     ← pydantic-settings (DATABASE_URL)
│   │   └── database.py   ← async engine + get_session
│   ├── models/           ← SQLModel (table=True) + Create/Update schemas
│   │   ├── proveedor.py  ← Proveedor + ProveedorCreate + ProveedorUpdate
│   │   ├── producto.py   ← Producto + ProductoCreate + ProductoUpdate
│   │   ├── venta.py      ← Venta + VentaCreate
│   │   └── orden_sugerida.py ← schema only (EOQ output)
│   ├── repository/       ← Async CRUD con select() + async session
│   │   ├── proveedor_repo.py
│   │   ├── producto_repo.py
│   │   └── venta_repo.py
│   ├── logic/
│   │   └── math.py       ← EOQ, punto reorden, stock seguridad
│   └── routes/           ← async def endpoints
│       ├── proveedores_routes.py
│       ├── productos_routes.py
│       ├── ventas_routes.py
│       └── optimizacion_routes.py
└── tests/
    ├── test_models.py    ← validaciones Pydantic/SQLModel
    ├── test_math.py      ← EOQ, alertas, stock seguridad
    └── test_api.py       ← async API con mocks
```

### Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/proveedores` | Crear proveedor |
| GET | `/proveedores` | Listar activos |
| PATCH | `/proveedores/{id}` | Actualizar |
| DELETE | `/proveedores/{id}` | Desactivar (soft delete) |
| POST | `/productos` | Crear producto (valida proveedor + nombre único) |
| GET | `/productos` | Listar (filtro ?estado=true/false) |
| GET | `/productos/buscar?nombre=` | Buscar por nombre |
| PATCH | `/productos/{id}` | Actualizar |
| DELETE | `/productos/{id}` | Desactivar |
| POST | `/ventas` | Registrar venta (descuenta stock en transacción) |
| GET | `/ventas` | Listar todas |
| GET | `/optimizar/pedidos` | Alertas no-óptimas |
| GET | `/optimizar/{id_producto}` | Sugerencia EOQ para un producto |

### Validaciones backend (Pydantic/SQLModel)
- `stock_actual` ≥ 0, `costo_unitario` > 0, `cantidad` > 0
- `costo_pedido_fijo` > 0, `lead_time_promedio` > 0
- `nivel_servicio_objetivo` entre 0.80 y 0.99
- Nombre de producto único por activo

### Arquitectura
- **Async**: Todos los endpoints son `async def` con `AsyncSession` vía `Depends(get_session)`
- **Tablas**: Se crean automáticamente en el `lifespan` de FastAPI via `SQLModel.metadata.create_all`
- **Transacciones**: Venta y descuento de stock en la misma transacción del repositorio

### Tests
- **44 tests** (modelos: 17, matemáticas: 13, API: 14)
- API tests usan `httpx.AsyncClient` + `AsyncMock` (sin BD real)
- `asyncio_mode = auto` en pyproject.toml

### Reglas
- No usar Alembic (tablas via create_all en lifespan)
- BD es NeonDB (PostgreSQL) — configurar DATABASE_URL en .env
- El .env.example debe tener el placeholder sin credenciales reales
- CORS configurado en `main.py` con `CORSMiddleware` — agregar orígenes si es necesario
- Siempre correr `uv run pytest` antes de marcar tarea backend completa

---

## Frontend (Next.js + Tailwind)

### Stack
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4
- recharts (dashboards)
- next/font/local (Satoshi + Clash Grotesk)

### Commands

```bash
cd frontend && npm run dev
cd frontend && npm run build
cd frontend && npm run lint
```

### Project Structure

```
frontend/
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   ├── page.tsx
│   ├── dashboard/page.tsx
│   ├── proveedores/page.tsx
│   ├── productos/page.tsx
│   ├── ventas/page.tsx
│   └── optimizacion/page.tsx
├── components/
│   ├── Header.tsx, GlassCard.tsx, GradientButton.tsx
│   ├── CommandBar.tsx, Badge.tsx, GlassTable.tsx
│   ├── Modal.tsx, SearchInput.tsx, StatusIndicator.tsx
├── lib/
│   ├── api.ts
│   └── types.ts
├── public/fonts/
└── package.json
```

### Design Tokens

| Token | Value |
|---|---|
| `obsidian` | `#02040a` |
| `pink` | `#ff2d55` |
| `lime` | `#c1ff72` |
| `cyan` | `#00f2ff` |
| `glass-bg` | `rgba(255,255,255,0.015)` |
| `glass-border` | `rgba(255,255,255,0.05)` |
| `blur` | `24px` |

### Rules
- API base from NEXT_PUBLIC_API_URL env var
- Text < 14px must have tracking ≥ 0.3em
- Cards never use pure white backgrounds

### Verification
Before marking frontend task complete, run `npm run build` in frontend/ to verify no errors.
