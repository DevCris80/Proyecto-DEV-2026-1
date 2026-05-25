import uuid
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.proveedor import Proveedor, ProveedorCreate, ProveedorUpdate


async def listar_activos(session: AsyncSession) -> list[Proveedor]:
    result = await session.execute(
        select(Proveedor).where(Proveedor.estado_activo == True)
    )
    return result.scalars().all()


async def obtener_por_id(session: AsyncSession, id: str) -> Proveedor | None:
    result = await session.execute(select(Proveedor).where(Proveedor.id == id))
    return result.scalar_one_or_none()


async def crear(session: AsyncSession, datos: ProveedorCreate) -> Proveedor:
    proveedor = Proveedor(
        id=str(uuid.uuid4())[:8],
        **datos.model_dump(),
    )
    session.add(proveedor)
    await session.commit()
    await session.refresh(proveedor)
    return proveedor


async def actualizar(
    session: AsyncSession, id: str, datos: ProveedorUpdate
) -> Proveedor | None:
    proveedor = await obtener_por_id(session, id)
    if not proveedor:
        return None

    cambios = datos.model_dump(exclude_unset=True)
    for campo, valor in cambios.items():
        setattr(proveedor, campo, valor)

    session.add(proveedor)
    await session.commit()
    await session.refresh(proveedor)
    return proveedor


async def eliminar(session: AsyncSession, id: str) -> bool:
    proveedor = await obtener_por_id(session, id)
    if not proveedor:
        return False

    proveedor.estado_activo = False
    session.add(proveedor)
    await session.commit()
    return True
