import { BottomNav, Footer, NavBar } from '../../ui'

function PageLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col pb-20 md:pb-0">
      <NavBar />
      <main className="mx-auto w-full max-w-page flex-1 px-4 py-6 md:px-8 md:py-8 lg:px-12">{children}</main>
      <Footer />
      <BottomNav />
    </div>
  )
}

export default PageLayout
