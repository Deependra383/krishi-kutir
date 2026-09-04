/**
 * Razorpay Payment Gateway Integration Utilities for Krishi Kutir
 */

export const DEFAULT_RAZORPAY_KEY = 'rzp_test_1DP5mmOlF5G5ag'; // Public test sandbox key placeholder

/**
 * Get active Razorpay Key ID
 */
export function getRazorpayKeyId() {
  // 1. Check Admin / LocalStorage setting
  const localKey = localStorage.getItem('krishi_rzp_key')?.trim();
  if (localKey) return localKey;

  // 2. Check Environment Variable
  const envKey = import.meta.env.VITE_RAZORPAY_KEY_ID?.trim();
  if (envKey) return envKey;

  return DEFAULT_RAZORPAY_KEY;
}

/**
 * Get active Razorpay Key Secret (optional for server notes)
 */
export function getRazorpayKeySecret() {
  return localStorage.getItem('krishi_rzp_secret')?.trim() || '';
}

/**
 * Check if the active key is a real live or custom test key
 */
export function isCustomKeyConfigured() {
  const key = getRazorpayKeyId();
  return Boolean(key && key !== DEFAULT_RAZORPAY_KEY && (key.startsWith('rzp_test_') || key.startsWith('rzp_live_')));
}

/**
 * Check if current key is a Live Production key
 */
export function isLiveMode() {
  const key = getRazorpayKeyId();
  return key.startsWith('rzp_live_');
}

/**
 * Load Razorpay Checkout Script dynamically
 */
export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn('Razorpay SDK failed to load from CDN. Using in-app fallback gateway.');
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

/**
 * Initiate Razorpay Standard Checkout
 *
 * @param {Object} params
 * @param {number} params.amountInRupees Grand total in INR (e.g. 450)
 * @param {string} params.orderId Krishi Kutir order reference ID (e.g. KK-849201)
 * @param {string} params.customerName
 * @param {string} params.email
 * @param {string} params.phone
 * @param {string} params.address
 * @param {string} params.city
 * @param {string} params.pincode
 * @param {string} [params.paymentMethodPrefill] 'upi' | 'card' | 'netbanking' | 'wallet'
 * @param {Function} params.onSuccess Callback on successful payment (receives { paymentId, orderId, signature })
 * @param {Function} params.onFailure Callback on payment failure or dismissal
 */
export async function openRazorpayCheckout({
  amountInRupees,
  orderId,
  customerName,
  email,
  phone,
  address,
  city,
  pincode,
  paymentMethodPrefill = 'upi',
  onSuccess,
  onFailure,
  onDismiss
}) {
  const scriptLoaded = await loadRazorpayScript();
  const keyId = getRazorpayKeyId();

  // If Razorpay SDK loaded and available
  if (scriptLoaded && typeof window !== 'undefined' && window.Razorpay) {
    try {
      const amountInPaise = Math.round(Number(amountInRupees) * 100);

      // Pre-fill payment method config if selected
      const methodConfig = {};
      if (paymentMethodPrefill === 'razorpay_upi' || paymentMethodPrefill === 'upi') {
        methodConfig.upi = 1;
      } else if (paymentMethodPrefill === 'razorpay_card' || paymentMethodPrefill === 'card') {
        methodConfig.card = 1;
      } else if (paymentMethodPrefill === 'razorpay_netbanking' || paymentMethodPrefill === 'netbanking') {
        methodConfig.netbanking = 1;
      }

      const options = {
        key: keyId,
        amount: amountInPaise,
        currency: 'INR',
        name: 'Krishi Kutir',
        description: `Order #${orderId} - Fresh Organic Harvest`,
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=128&auto=format&fit=crop&q=80',
        handler: function (response) {
          if (onSuccess) {
            onSuccess({
              paymentId: response.razorpay_payment_id || `pay_rzp_${Date.now().toString(36)}`,
              orderId: response.razorpay_order_id || orderId,
              signature: response.razorpay_signature || 'rzp_verified_sig'
            });
          }
        },
        prefill: {
          name: customerName || '',
          email: email || '',
          contact: phone || ''
        },
        notes: {
          krishi_order_id: orderId,
          delivery_address: `${address || ''}, ${city || ''} - ${pincode || ''}`
        },
        theme: {
          color: '#059669', // Emerald 600
          backdrop_color: 'rgba(0, 0, 0, 0.75)'
        },
        modal: {
          ondismiss: function () {
            if (onDismiss) onDismiss();
          },
          escape: true,
          backdropclose: false
        }
      };

      const rzpInstance = new window.Razorpay(options);

      rzpInstance.on('payment.failed', function (response) {
        console.warn('Razorpay payment failed:', response.error);
        if (onFailure) {
          onFailure(response.error?.description || 'Payment was unsuccessful or cancelled by user.');
        }
      });

      rzpInstance.open();
      return true;
    } catch (err) {
      console.error('Error invoking Razorpay window:', err);
      // Fallback if window creation errors
    }
  }

  // Fallback simulator for sandboxing / testing when in dev preview or offline
  return false;
}
