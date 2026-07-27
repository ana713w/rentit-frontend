import { Link } from 'react-router-dom'
import { cn } from '../../../lib/cn'
import Spinner from '../spinner/spinner'
import Icon from '../icon/icon'

const VARIANTS = {
  primary: 'bg-primary text-on-primary shadow-primary hover:bg-primary-hover hover:text-on-primary',
  secondary: 'bg-surface text-fg shadow-card hover:bg-surface-muted hover:text-fg',
  soft: 'bg-primary-soft text-primary-strong hover:bg-primary-soft/70 hover:text-primary-strong',
  ghost: 'bg-transparent text-fg hover:bg-surface-muted hover:text-fg',
  danger: 'bg-danger text-white hover:bg-danger-hover hover:text-white',
  'danger-outline': 'border border-danger/40 bg-surface text-danger hover:bg-danger-soft hover:text-danger',
}

const SIZES = {
  sm: 'h-8 px-3.5 text-sm',
  md: 'h-10 px-5 text-sm',
  lg: 'h-12 px-7 text-base',
}

/**
 * Botón único de la app (píldora).
 * - to="/ruta"  → se renderiza como <Link>
 * - href="..."  → se renderiza como <a> (enlaces externos, PDFs)
 * - icon="add"  → icono de Material Symbols delante del texto
 * - loading     → muestra spinner y se deshabilita
 */
function Button({
  variant = 'primary',
  size = 'md',
  to,
  href,
  icon,
  loading = false,
  fullWidth = false,
  disabled,
  type = 'button',
  className,
  children,
  ...props
}) {
  const classes = cn(
    'inline-flex shrink-0 items-center justify-center gap-1.5 rounded-control font-bold whitespace-nowrap transition-all',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none',
    VARIANTS[variant],
    SIZES[size],
    fullWidth && 'w-full',
    className,
  )

  const iconNode = icon && !loading && <Icon name={icon} className={size === 'lg' ? 'text-2xl' : 'text-xl'} />

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {iconNode}
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {iconNode}
        {children}
      </a>
    )
  }

  return (
    <button type={type} disabled={disabled || loading} className={classes} {...props}>
      {loading && <Spinner size="sm" />}
      {iconNode}
      {children}
    </button>
  )
}

export default Button
