import React from 'react';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { Header } from './components/layout/Header';
import { Hero } from './components/layout/Hero';
import { SandwichBuilder } from './components/builder/SandwichBuilder';
import { CartDrawer } from './components/cart/CartDrawer';
import { FloatingCartBar } from './components/layout/FloatingCartBar';
import { Footer } from './components/layout/Footer';

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col text-gourmet-dark">
          {/* Encabezado */}
          <Header />

          {/* Contenido Principal */}
          <main className="flex-1 py-4 sm:py-6 space-y-6">
            <Hero />
            <SandwichBuilder />
          </main>

          {/* Pie de Página */}
          <Footer />

          {/* Componentes Flotantes y Modales del Carrito */}
          <CartDrawer />
          <FloatingCartBar />
        </div>
      </CartProvider>
    </ToastProvider>
  );
};

export default App;
