import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/hooks/useAuth';
import AuthProvider from '@/providers/AuthProvider';
import Router from '@/routes';
import Login from '@/routes/login';

function RoutedApp() {
  const { user, loading, authing } = useAuth();

  if (loading || authing) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Toaster />
      {user ? <Router /> : <Login />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <RoutedApp />
    </AuthProvider>
  );
}

export default App;
