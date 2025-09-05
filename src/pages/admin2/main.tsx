import { createRoot } from 'react-dom/client'
import './index.css'
import App from './AdminApp'
import { QueryProvider } from './pages/providers' 

createRoot(document.getElementById('root')!).render(
  <QueryProvider>
    <App />
  </QueryProvider>
)
