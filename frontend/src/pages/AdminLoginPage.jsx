import { Navigate } from 'react-router-dom';
import Container from '../components/layout/Container.jsx';
import Header from '../components/layout/Header.jsx';
import LoginForm from '../components/admin/LoginForm.jsx';
import { useAdminAuth } from '../context/AdminAuthContext.jsx';

export default function AdminLoginPage() {
  const { isAuthenticated, login } = useAdminAuth();

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-10">
        <Container className="max-w-sm">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="mb-4 text-lg font-semibold text-slate-900">Admin Login</h1>
            <LoginForm onSubmit={login} />
          </div>
        </Container>
      </main>
    </div>
  );
}
