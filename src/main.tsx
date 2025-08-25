import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { routes } from '../src/pages/admin2/routes/routes';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <QueryProvider> */}
      <RouterProvider router={routes} />
    {/* </QueryProvider> */}
  </React.StrictMode>
);
