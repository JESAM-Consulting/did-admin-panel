/**
 * Entry application component used to compose providers and render Routes.
 * */

import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Routes } from "./Routes";
// import { I18nProvider } from "../_metronic/i18n";
import { LayoutSplashScreen, MaterialThemeProvider } from "../_metronic/layout";
import { ToastContainer } from "react-toastify";

export default function App() {
  return (
        <React.Suspense fallback={<LayoutSplashScreen />}>
          <BrowserRouter>
            <MaterialThemeProvider>
              {/* <ToastContainer> */}
               {/* <I18nProvider> */}
                <Routes />
              {/* </I18nProvider> */} 
              {/* </ToastContainer>      */}
            </MaterialThemeProvider>
          </BrowserRouter>
        </React.Suspense>
  );
}
