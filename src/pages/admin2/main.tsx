import { createRoot } from 'react-dom/client'
import './index.css'
import App from './Adminapp'
import { QueryProvider } from '../admin2/pages/providers'

createRoot(document.getElementById('root')!).render(
  <QueryProvider>
    <App />
  </QueryProvider>
)
