import { Link } from 'react-router-dom'
import { cn } from '../../../lib/cn'

export function LogoMark({ className }) {
  return <img src="/rentit-favicon.svg" alt="" aria-hidden="true" className={cn('shrink-0', className)} />
}

function Logo({ showTagline = true, size = 'md', onClick, className }) {
  return (
    <Link to="/" onClick={onClick} aria-label="RentIt - Inicio" className={cn('group flex items-center gap-2 text-fg hover:text-fg', className)}>
      {showTagline ? (
        <img src="/rentit-logo.svg" alt="RentIt - Compra menos, alquila más" className={cn('w-auto shrink-0', size === 'sm' ? 'h-8' : 'h-11')} />
      ) : (
        <>
          <LogoMark className={size === 'sm' ? 'size-7' : 'size-10'} />
          <span
            className={cn(
              'font-heading leading-none font-extrabold tracking-tight transition-colors group-hover:text-primary-strong',
              size === 'sm' ? 'text-base' : 'text-lg',
            )}
          >
            RentIt
          </span>
        </>
      )}
    </Link>
  )
}

export default Logo
