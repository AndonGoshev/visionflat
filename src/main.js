import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './globals.css';
import App from './App.tsx';
import { Toaster } from 'sonner';
createRoot(document.getElementById('root')).render(_jsxs(StrictMode, { children: [_jsx(App, {}), _jsx(Toaster, {})] }));
