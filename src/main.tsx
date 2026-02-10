import { Suspense, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/css/globals.css'
import './i18n'
import App from './App.tsx'
import Spinner from './views/spinner/Spinner.tsx'
import { ensureApiConfig } from './config/api.ts'

function ConfigLoader() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    ensureApiConfig().then(() => setReady(true))
  }, [])
  if (!ready) return <Spinner />
  return (
    <Suspense fallback={<Spinner />}>
      <App />
    </Suspense>
  )
}

createRoot(document.getElementById('root')!).render(<ConfigLoader />)
