import { Route, Routes } from 'react-router-dom'
import { PageLayout, ScrollToTop } from './components/layouts'
import { GuestRoute, PrivateRoute } from './guards'
import {
  AdminDisputesPage,
  AdminPromotePage,
  FavoritesPage,
  ForbiddenPage,
  HomePage,
  ItemCreatePage,
  ItemDetailPage,
  ItemEditPage,
  LoginPage,
  MyItemsPage,
  NotFoundPage,
  ProfilePage,
  RegisterPage,
  ReservationDetailPage,
  ReservationsPage,
  StripeOnboardingCompletePage,
  StripeOnboardingRefreshPage,
} from './pages'

const privateRoute = (element, options = {}) => <PrivateRoute {...options}>{element}</PrivateRoute>

function App() {
  return (
    <PageLayout>
      <ScrollToTop />
      <Routes>
        {/* Publicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/items/:id" element={<ItemDetailPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

        {/* Con sesion */}
        <Route path="/items/new" element={privateRoute(<ItemCreatePage />)} />
        <Route path="/items/:id/edit" element={privateRoute(<ItemEditPage />)} />
        <Route path="/my-items" element={privateRoute(<MyItemsPage />)} />
        <Route path="/reservations" element={privateRoute(<ReservationsPage />)} />
        <Route path="/reservations/:id" element={privateRoute(<ReservationDetailPage />)} />
        <Route path="/profile" element={privateRoute(<ProfilePage />)} />
        <Route path="/stripe/onboarding/complete" element={privateRoute(<StripeOnboardingCompletePage />)} />
        <Route path="/stripe/onboarding/refresh" element={privateRoute(<StripeOnboardingRefreshPage />)} />

        {/* Admin */}
        <Route path="/admin/disputes" element={privateRoute(<AdminDisputesPage />, { admin: true })} />
        <Route path="/admin/promote" element={privateRoute(<AdminPromotePage />, { admin: true })} />

        <Route path="/403" element={<ForbiddenPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </PageLayout>
  )
}

export default App
