import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import CreateTrip from './create-trip'
import Header from './components/ui/custom/Header'
import { Toaster } from 'sonner'
import { GoogleOAuthProvider } from '@react-oauth/google'
import Viewtrip from './view-trip/[tripId]'
import MyTrips from './my-trips'

// Forcing new Vercel deployment - [current timestamp]
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Header />
        <App />
      </>
    )
  },
  {
    path: '/create-trip',
    element: (
      <>
        <Header />
        <CreateTrip />
      </>
    )
  },
  {
    path: '/view-trip/:tripId',
    element: (
      <>
        <Header />
        <Viewtrip />
      </>
    )
  },
  {
    path:'my-trips',
    element: (
      <>
        <Header />
        <MyTrips/>
      </>
    )
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider 
      clientId={CLIENT_ID}
      onScriptLoadSuccess={() => console.log('Google OAuth Script loaded successfully')}
      onScriptLoadError={(error) => console.error('Google OAuth Script load error:', error)}
    >
      <Toaster />
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </StrictMode>,
)
