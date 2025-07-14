'use client'

import { useState, FormEvent } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { usePayment } from '@/app/contexts/PaymentContext';
import { Button } from '@/components/ui/button';

export default function StripePaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { setPaymentView, setErrorMessage } = usePayment();

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${window.location.origin}/payment-complete`,
      },
      // We redirect to a temporary page to handle the result.
      // The status will be updated via webhooks, but this gives immediate feedback.
      redirect: 'if_required' 
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected.
    if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message || 'An unexpected error occurred.');
        } else {
            setMessage("An unexpected error occurred.");
            setErrorMessage("An unexpected error occurred during payment confirmation.");
            setPaymentView('ERROR');
        }
    } else {
        // If no redirect happens (e.g., for some 3D Secure flows),
        // we can assume success for now and let webhooks handle the final state.
        setPaymentView('SUCCESS');
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-center mb-4">Secure Payment</h2>
        <PaymentElement id="payment-element" className="mb-6" />
        <Button disabled={isLoading || !stripe || !elements} id="submit" className="w-full">
            <span id="button-text">
            {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : "Pay now"}
            </span>
        </Button>
        {/* Show any error or success messages */}
        {message && <div id="payment-message" className="text-destructive text-sm text-center mt-2">{message}</div>}
    </form>
  );
}
