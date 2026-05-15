import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CartProvider } from './contexts/CartContext.tsx'

import { WishlistProvider } from './contexts/WishlistContext.tsx'
import { AddressProvider } from './contexts/AddressContext.tsx'
import { ReviewProvider } from './contexts/ReviewContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    
      <ReviewProvider>
      <WishlistProvider>
    <CartProvider>
  <AddressProvider>
    <App />
    </AddressProvider>
    </CartProvider>
    </WishlistProvider>
    </ReviewProvider>
    
  </StrictMode>,
)
