import { useState, useCallback } from 'react';
import { paymentService } from '@/services/paymentService';
import { RAZORPAY_CONFIG } from '@/constants';
import { toast } from 'sonner';

/**
 * Hook to handle Razorpay payment checkout.
 * Manages Razorpay modal, payment verification, and error handling.
 */
export function useRazorpayPayment() {
  const [processing, setProcessing] = useState(false);

  const openRazorpayCheckout = useCallback(async (razorpayOrderId, amount, userEmail) => {
    if (!window.Razorpay) {
      toast.error('Razorpay not loaded. Please refresh the page.');
      return null;
    }

    return new Promise((resolve, reject) => {
      const options = {
        key: RAZORPAY_CONFIG.KEY_ID,
        order_id: razorpayOrderId,
        amount: amount * 100, // Razorpay expects amount in paise
        currency: RAZORPAY_CONFIG.CURRENCY,
        name: 'Delhivery',
        description: 'Product Purchase',
        prefill: {
          email: userEmail,
        },
        theme: {
          color: '#3b82f6', // primary blue
        },
        handler: async (response) => {
          setProcessing(true);
          try {
            // Verify payment on backend
            const verifyResult = await paymentService.verify(
              razorpayOrderId,
              response.razorpay_payment_id
            );
            
            toast.success('Payment successful!');
            resolve(verifyResult);
          } catch (err) {
            toast.error(err.message || 'Payment verification failed');
            reject(err);
          } finally {
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            toast.error('Payment cancelled');
            reject(new Error('Payment cancelled by user'));
          },
        },
      };

      try {
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } catch (err) {
        toast.error('Failed to open payment gateway');
        reject(err);
      }
    });
  }, []);

  return { openRazorpayCheckout, processing };
}
