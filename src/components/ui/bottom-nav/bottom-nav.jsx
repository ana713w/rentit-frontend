import { NavLink } from 'react-router-dom'
import { cn } from '../../../lib/cn'
import Icon from '../icon/icon'
import { NAV_LINKS } from '../../../lib/constants'

function Tab({ to, label, icon, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-bold transition-colors',
          isActive ? 'text-primary-strong hover:text-primary-strong' : 'text-fg-muted hover:text-fg',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon name={icon} filled={isActive} className="text-2xl" />
          {label}
        </>
      )}
    </NavLink>
  )
}

// Barra de pestañas fija abajo en móvil (< md): Inicio, Favoritos, + Subir, Reservas, Perfil
function BottomNav() {
  const [home, favorites, reservations, profile] = NAV_LINKS

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-30 flex items-end bg-surface px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_-2px_rgb(0_0_0/0.06)] md:hidden"
    >
      <Tab {...home} />
      <Tab {...favorites} />
      <div className="flex flex-1 justify-center">
        <NavLink
          to="/items/new"
          aria-label="Subir objeto"
          className="-mt-5 mb-1 flex size-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-primary ring-4 ring-surface hover:bg-primary-hover hover:text-on-primary"
        >
          <Icon name="add" className="text-3xl" />
        </NavLink>
      </div>
      <Tab {...reservations} />
      <Tab {...profile} />
    </nav>
  )
}

export default BottomNav
