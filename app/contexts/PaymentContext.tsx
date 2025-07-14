'use client'

import { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem } from './CartContext';

export type PaymentView = 'SELECT_METHOD' | 'STRIPE_PAYMENT' | 'PROCESSING' | 'SUCCESS' | 'ERROR';

interface PaymentContextType {
  isPaymentOpen: boolean;
  paymentView: PaymentView;
  purchaseId: number | null;
  clientSecret: string | null;
  errorMessage: string | null;
  startStripePayment: (cartItems: CartItem[]) => Promise<void>;
  startPaypalPayment: (cartItems: CartItem[]) => Promise<void>;
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

  // This function now specifically handles Stripe
  const startStripePayment = async (cartItems: CartItem[]) => {
    if (!isPaymentOpen) setIsPaymentOpen(true);
    setPaymentView('PROCESSING');

    try {
      const response = await fetch('/api/purchase/stripe', { // Updated endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart: cartItems }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to start Stripe payment.');
      }

      const { purchaseId, clientSecret } = await response.json();
      
      setPurchaseId(purchaseId);
      setClientSecret(clientSecret);
      setPaymentView('STRIPE_PAYMENT');

    } catch (error) {
      console.error("Stripe initiation error:", error);
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred.');
      setPaymentView('ERROR');
    }
  };

  // New function for PayPal
  const startPaypalPayment = async (cartItems: CartItem[]) => {
    if (!isPaymentOpen) setIsPaymentOpen(true);
    setPaymentView('PROCESSING');

    try {
        const response = await fetch('/api/purchase/paypal', { // New endpoint for PayPal
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart: cartItems }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create PayPal order.');
        }

        const { approveUrl } = await response.json();
        // Redirect the user to PayPal to approve the payment
        window.location.href = approveUrl;

    } catch (error) {
        console.error("PayPal initiation error:", error);
        setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred.');
        setPaymentView('ERROR');
    }
  };

  const closePayment = () => {
    setIsPaymentOpen(false);
  };
  
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
    startStripePayment,
    startPaypalPayment,
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
