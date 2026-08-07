import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../hooks'
import { ProfileForm } from '../components/users'
import { StripeOnboardingCard } from '../components/payments'
import { Avatar, Button, Card, Icon } from '../components/ui'

const SHORTCUTS = [
  { to: '/my-items', label: 'Mis objetos', icon: 'inventory_2' },
  { to: '/reservations', label: 'Lo que alquilo', icon: 'shopping_bag' },
  { to: '/reservations?as=owner', label: 'Solicitudes recibidas', icon: 'inbox' },
  { to: '/favorites', label: 'Favoritos', icon: 'favorite' },
]

function ProfilePage() {
  const { user, isAdmin, logout } = useAuthContext()
  const navigate = useNavigate()

  const shortcuts = [
    ...SHORTCUTS,
    ...(isAdmin
      ? [
          { to: '/admin/disputes', label: 'Disputas', icon: 'gavel' },
          { to: '/admin/promote', label: 'Administradores', icon: 'admin_panel_settings' },
        ]
      : []),
  ]

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <section className="flex flex-wrap items-center gap-4">
        <Avatar name={user.full_name} className="size-16 text-2xl" />
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-2xl font-extrabold sm:text-3xl">{user.full_name}</h1>
          <p className="truncate text-sm text-fg-muted">{user.email}</p>
        </div>
        <Button
          variant="secondary"
          icon="logout"
          onClick={async () => {
            await logout()
            navigate('/login')
          }}
        >
          Cerrar sesión
        </Button>
      </section>

      <nav className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {shortcuts.map((shortcut) => (
          <Link
            key={shortcut.to}
            to={shortcut.to}
            className="flex flex-col items-center gap-2 rounded-card bg-surface p-4 text-center text-sm font-bold text-fg shadow-card transition-all hover:-translate-y-0.5 hover:text-primary-strong hover:shadow-card-hover"
          >
            <span className="flex size-11 items-center justify-center rounded-full bg-primary-soft text-primary-strong">
              <Icon name={shortcut.icon} className="text-2xl" />
            </span>
            {shortcut.label}
          </Link>
        ))}
      </nav>

      <Card icon="person" title="Tus datos" subtitle="Tu dirección solo se usa para la recogida y devolución de tus objetos.">
        <ProfileForm />
      </Card>

      <StripeOnboardingCard />
    </div>
  )
}

export default ProfilePage
