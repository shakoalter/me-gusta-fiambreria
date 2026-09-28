import React, { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { PricingProvider } from './context/PricingContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/layout/Header';
import { Hero } from './components/layout/Hero';
import { SandwichBuilder } from './components/builder/SandwichBuilder';
import { CartDrawer } from './components/cart/CartDrawer';
import { FloatingCartBar } from './components/layout/FloatingCartBar';
import { Footer } from './components/layout/Footer';
import { AdminModal } from './components/admin/AdminModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  const handleOpenAdmin = () => {
    if (isAuthenticated) {
      setIsAdminModalOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    setIsAdminModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col text-gourmet-dark">
      {/* Encabezado */}
      <Header />

      {/* Contenido Principal */}
      <main className="flex-1">
        <Hero />
        <SandwichBuilder />
      </main>

      {/* Pie de Página con enlace a Administración */}
      <Footer onOpenAdmin={handleOpenAdmin} />

      {/* Componentes Flotantes y Modales del Carrito */}
      <CartDrawer />
      <FloatingCartBar />

      {/* Modales de Administración y Login */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <PricingProvider>
        <AuthProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AuthProvider>
      </PricingProvider>
    </ToastProvider>
  );
};

export default App;
