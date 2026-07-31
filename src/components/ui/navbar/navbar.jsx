import { useState } from 'react'
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthContext } from '../../../contexts/auth-context'
import { cn } from '../../../lib/cn'
import { NAV_LINKS } from '../../../lib/constants'
import Button from '../button/button'
import Icon from '../icon/icon'
import Logo from '../logo/logo'
import UserMenu from '../user-menu/user-menu'

const navLinkClasses = ({ isActive }) =>
  cn(
    'rounded-control px-3 py-1.5 text-sm transition-colors',
    isActive ? 'font-bold text-primary-strong' : 'font-semibold text-fg-muted hover:text-fg',
  )

// Buscador compacto de la cabecera: lleva a la Home con ?q=
function HeaderSearch() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')

  const submit = (event) => {
    event.preventDefault()
    const q = query.trim()
    navigate(q ? `/?q=${encodeURIComponent(q)}` : '/')
  }

  return (
    <form
      role="search"
      onSubmit={submit}
      className="flex w-full items-center gap-2 rounded-control bg-surface-muted px-4 py-2 transition-colors focus-within:bg-surface focus-within:ring-2 focus-within:ring-primary/30 hover:bg-surface-strong/60"
    >
      <Icon name="search" className="text-lg text-fg-muted" />
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="¿Qué necesitas hoy?"
        aria-label="Buscar objetos"
        className="w-full bg-transparent text-sm text-fg placeholder:text-fg-muted focus:outline-none"
      />
    </form>
  )
}

function NavBar() {
  const { user } = useAuthContext()
  const [searchParams] = useSearchParams()

  return (
    <header className="sticky top-0 z-20 bg-surface shadow-card">
      <div className="mx-auto flex h-16 max-w-page items-center justify-between gap-6 px-4 md:h-20 md:px-8 lg:px-12">
        <div className="flex shrink-0 items-center gap-6">
          <Logo className="hidden sm:flex" />
          <Logo showTagline={false} className="sm:hidden" />
          <div className="hidden h-6 w-px bg-line xl:block" />
          <nav className="hidden items-center gap-1 xl:flex">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className={navLinkClasses}>
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="hidden max-w-md flex-1 md:flex">
          <HeaderSearch key={searchParams.get('q') || ''} />
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {user ? (
            <>
              <Button to="/items/new" icon="add" className="hidden md:inline-flex">
                Subir objeto
              </Button>
              <UserMenu />
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" to="/login">
                Iniciar sesión
              </Button>
              <Button size="sm" to="/register" className="hidden sm:inline-flex">
                Registrarse
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default NavBar
