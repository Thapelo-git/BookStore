import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CartProvider } from './contexts/CartContext.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { WishlistProvider } from './contexts/WishlistContext.tsx'
import { AddressProvider } from './contexts/AddressContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <WishlistProvider>
    <CartProvider>
  <AddressProvider>
    <App />
    </AddressProvider>
    </CartProvider>
    </WishlistProvider>
    </AuthProvider>
  </StrictMode>,
)
