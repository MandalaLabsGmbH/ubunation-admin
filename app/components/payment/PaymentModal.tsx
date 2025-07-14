'use client'

import { usePayment } from '@/app/contexts/PaymentContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, CheckCircle, XCircle } from 'lucide-react';
import Image from 'next/image';
import StripePaymentForm from './StripePaymentForm'; // We will create this next

// Make sure to use your Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function PaymentModal() {
  const { 
    isPaymentOpen, 
    paymentView, 
    closePayment, 
    resetPayment,
    clientSecret,
    errorMessage
  } = usePayment();

  if (!isPaymentOpen) {
    return null;
  }

  const handleCloseAndReset = () => {
      closePayment();
      // Use a timeout to reset state after the modal has closed to avoid visual glitches
      setTimeout(resetPayment, 300);
  }

  const renderContent = () => {
    switch (paymentView) {
      case 'SELECT_METHOD':
        return <SelectMethodView />;
      
      case 'STRIPE_PAYMENT':
        if (!clientSecret) {
            return <ErrorView message="Could not initialize payment. Please try again." onRetry={resetPayment} onClose={handleCloseAndReset} />;
        }
        const options = { clientSecret };
        return (
            <Elements stripe={stripePromise} options={options}>
                <StripePaymentForm />
            </Elements>
        );

      case 'PROCESSING':
        return (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Processing your request...</p>
            </div>
        );

      case 'SUCCESS':
        return (
            <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
                <p className="text-muted-foreground mb-6">Your collectibles have been added to your account. Check your email for a receipt.</p>
                <Button onClick={handleCloseAndReset}>Done</Button>
            </div>
        );

      case 'ERROR':
        return <ErrorView message={errorMessage || 'An unknown error occurred.'} onRetry={resetPayment} onClose={handleCloseAndReset} />;

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
      <Card className="relative bg-background rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <button onClick={handleCloseAndReset} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X className="h-6 w-6" />
        </button>
        {renderContent()}
      </Card>
    </div>
  );
}

// Sub-component for selecting a payment method
function SelectMethodView() {
    // In a real app, these would call functions to start their respective payment flows
    return (
        <div>
            <h2 className="text-2xl font-bold text-center mb-6">Choose Payment Method</h2>
            <div className="grid gap-4">
                <Button variant="outline" className="h-14 text-lg" onClick={() => alert('Stripe logic will be handled by the checkout button.')}>
                    <Image src="/images/stripe-logo.svg" alt="Stripe" width={60} height={25} />
                </Button>
                <Button variant="outline" className="h-14 text-lg" disabled>
                    <Image src="/images/paypal-logo.svg" alt="PayPal" width={80} height={25} />
                </Button>
                 <Button variant="outline" className="h-14 text-lg" disabled>
                    <Image src="/images/wallet-logo.svg" alt="Wallet" width={90} height={25} />
                </Button>
            </div>
        </div>
    );
}

// Sub-component for displaying errors
function ErrorView({ message, onRetry, onClose }: { message: string, onRetry: () => void, onClose: () => void }) {
    return (
        <div className="text-center py-8">
            <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Payment Failed</h2>
            <p className="text-muted-foreground bg-destructive/10 p-3 rounded-md mb-6">{message}</p>
            <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={onRetry}>Try Again</Button>
                <Button variant="secondary" onClick={onClose}>Close</Button>
            </div>
        </div>
    );
}
