import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import ErrorBoundary    from './components/ErrorBoundary'
import App              from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <App />
              <Toaster
                position="top-right"
                gutter={8}
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#1A1612',
                    color: '#ffffff',
                    borderRadius: '16px',
                    fontSize: '14px',
                    fontFamily: '"Inter", system-ui, sans-serif',
                    padding: '12px 16px',
                    boxShadow: '0 18px 48px rgba(18, 14, 11, 0.35)',
                  },
                  success: { iconTheme: { primary: '#C17D3C', secondary: '#fff' } },
                  error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
                }}
              />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
)
