import { Navigate, useLocation } from 'react-router-dom'

interface Props {
  children: React.ReactNode
  role?: string
}

export default function ProtectedRoute({ children, role = 'admin' }: Props) {
  const location = useLocation()
  const stored = sessionStorage.getItem('sativa_role')

  if (stored !== role) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
