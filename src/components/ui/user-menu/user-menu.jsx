import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../../contexts/auth-context'
import { getInitials } from '../../../lib/format'
import Icon from '../icon/icon'

export function Avatar({ name, className = 'size-9 text-sm' }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-primary-soft font-bold text-primary-strong ${className}`}>
      {getInitials(name)}
    </span>
  )
}

// Avatar con menú desplegable: perfil, mis objetos, admin y cerrar sesión
function UserMenu() {
  const { user, isAdmin, logout } = useAuthContext()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const close = (event) => {
      if (event.type === 'keydown' && event.key !== 'Escape') return
      if (event.type === 'mousedown' && ref.current?.contains(event.target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', close)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', close)
    }
  }, [open])

  const links = [
    { to: '/profile', label: 'Mi perfil', icon: 'person' },
    { to: '/my-items', label: 'Mis objetos', icon: 'inventory_2' },
    { to: '/reservations', label: 'Reservas', icon: 'event_available' },
    { to: '/favorites', label: 'Favoritos', icon: 'favorite' },
    isAdmin && { to: '/admin/disputes', label: 'Disputas (admin)', icon: 'gavel' },
    isAdmin && { to: '/admin/promote', label: 'Administradores', icon: 'admin_panel_settings' },
  ].filter(Boolean)

  const handleLogout = async () => {
    setOpen(false)
    await logout()
    navigate('/login')
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Menú de usuario"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex items-center rounded-full p-0.5 transition-all hover:ring-2 hover:ring-primary"
      >
        <Avatar name={user.full_name} />
      </button>

      {open && (
        <div className="absolute top-12 right-0 z-30 w-64 overflow-hidden rounded-card bg-surface py-2 shadow-raised">
          <div className="border-b border-line px-4 pt-1 pb-3">
            <p className="truncate font-bold text-fg">{user.full_name}</p>
            <p className="truncate text-xs text-fg-muted">{user.email}</p>
          </div>
          <ul className="py-1">
            {links.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-fg hover:bg-surface-muted hover:text-fg"
                >
                  <Icon name={link.icon} className="text-xl text-fg-muted" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="border-t border-line pt-1">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-2 text-sm font-semibold text-danger hover:bg-danger-soft"
            >
              <Icon name="logout" className="text-xl" />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserMenu
