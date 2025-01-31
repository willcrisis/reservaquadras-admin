import { Toaster } from '@/components/ui/toaster';
import FirebaseProvider, { useFirebase } from '@/providers/FirebaseProvider';
import Home from '@/routes';
import Login from '@/routes/login';

function RoutedApp() {
  const { user, role, loading, authing } = useFirebase();

  if (loading || authing) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Toaster />
      {user ? <Home /> : <Login />}
    </>
  );
}

function App() {
  return (
    <FirebaseProvider>
      <RoutedApp />
    </FirebaseProvider>
  );
}

export default App;
