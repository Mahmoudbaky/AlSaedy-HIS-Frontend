import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import '../src/css/globals.css';
import './i18n';
import App from './App.tsx';
import Spinner from './views/spinner/Spinner.tsx';

function ConfigLoader() {
  return (
    <Suspense fallback={<Spinner />}>
      <App />
    </Suspense>
  );
}

createRoot(document.getElementById('root')!).render(<ConfigLoader />);
