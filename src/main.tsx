import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { Provider } from '@/components/ui/provider.tsx';
import { HashRouter } from 'react-router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Provider>
        <App />
      </Provider>
    </HashRouter>
  </StrictMode>,
);
