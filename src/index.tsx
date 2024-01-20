import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';

import router from './routes/index';
import './index.scss';
import './variables.css';
import getStore from './modules';
import Loader from 'components/layout/Loader';
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    const refreshConfirmed = confirm(
      'A new version of the website is available. Would you like to refresh?',
    );
    if (refreshConfirmed) {
      updateSW();
    }
  },
});

// @ts-ignore
window.pxToRem = (px: number, baseSize = 16) => `${px / baseSize}rem`;

const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <Provider store={getStore()}>
      <Suspense fallback={<Loader isPage />}>
        <RouterProvider router={router} />
      </Suspense>
      <Toaster position="top-center" reverseOrder={true} />
    </Provider>
  </React.StrictMode>,
);
