'use client'

import { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem } from './CartContext'; // Assuming CartItem is exported from CartContext

// Define the different views the payment modal can have
export type PaymentView = 'SELECT_METHOD' | 'STRIPE_PAYMENT' | 'PROCESSING' | 'SUCCESS' | 'ERROR';

interface PaymentContextType {
  isPaymentOpen: boolean;
  paymentView: PaymentView;
  purchaseId: number | null;
  clientSecret: string | null;
  errorMessage: string | null;
  startPaymentProcess: (cartItems: CartItem[]) => Promise<void>;
  setPaymentView: (view: PaymentView) => void;
  setErrorMessage: (message: string) => void;
  closePayment: () => void;
  resetPayment: () => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentView, setPaymentView] = useState<PaymentView>('SELECT_METHOD');
  const [purchaseId, setPurchaseId] = useState<number | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const startPaymentProcess = async (cartItems: CartItem[]) => {
    setIsPaymentOpen(true);
    setPaymentView('PROCESSING'); // Show processing while we talk to the backend

    try {
      // Call our Next.js API route to initiate the purchase
      const response = await fetch('/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart: cartItems }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to start payment process.');
      }

      const { purchaseId, clientSecret } = await response.json();
      
      setPurchaseId(purchaseId);
      setClientSecret(clientSecret);
      setPaymentView('STRIPE_PAYMENT'); // Move to the Stripe payment view

    } catch (error) {
      console.error("Payment initiation error:", error);
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred.');
      setPaymentView('ERROR');
    }
  };

  const closePayment = () => {
    setIsPaymentOpen(false);
  };
  
  // Resets the modal to its initial state for a new purchase attempt
  const resetPayment = () => {
      setPaymentView('SELECT_METHOD');
      setPurchaseId(null);
      setClientSecret(null);
      setErrorMessage(null);
  }

  const value = { 
    isPaymentOpen, 
    paymentView, 
    purchaseId,
    clientSecret,
    errorMessage,
    startPaymentProcess, 
    setPaymentView,
    setErrorMessage,
    closePayment,
    resetPayment
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
}
