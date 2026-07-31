import { LogoMark } from '../logo/logo'

function Footer() {
  return (
    <footer className="mt-16 bg-surface shadow-[0_-4px_20px_-2px_rgb(0_0_0/0.03)]">
      <div className="mx-auto flex max-w-page flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-fg-muted md:flex-row md:px-8 lg:px-12">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <LogoMark className="size-7" />
          <span className="font-heading text-base font-extrabold text-fg">RentIt</span>
          <span>© {new Date().getFullYear()} · Alquiler colaborativo entre particulares</span>
        </div>
        <p className="text-center">Contrato firmado, depósito protegido y check-in con fotos</p>
      </div>
    </footer>
  )
}

export default Footer
