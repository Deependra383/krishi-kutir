/**
 * Direct UPI Payment Utilities (NPCI Standard Protocol)
 * Allows accepting instant 0-fee payments without waiting for third-party gateway approvals.
 */

export const DEFAULT_UPI_ID = 'krishikutir@okaxis';
export const DEFAULT_MERCHANT_NAME = 'Krishi Kutir';

/**
 * Retrieve active Merchant UPI ID from localStorage or Environment
 */
export function getMerchantUpiId() {
  const localUpi = localStorage.getItem('krishi_merchant_upi')?.trim();
  if (localUpi) return localUpi;

  const envUpi = import.meta.env.VITE_MERCHANT_UPI_ID?.trim();
  if (envUpi) return envUpi;

  return DEFAULT_UPI_ID;
}

/**
 * Retrieve Merchant Name for UPI payload
 */
export function getMerchantName() {
  return localStorage.getItem('krishi_merchant_name')?.trim() || DEFAULT_MERCHANT_NAME;
}

/**
 * Generate standard NPCI UPI URI string
 * Spec: upi://pay?pa=<UPI_ID>&pn=<NAME>&am=<AMOUNT>&cu=INR&tn=<NOTE>
 */
export function generateUpiUri({
  upiId = getMerchantUpiId(),
  merchantName = getMerchantName(),
  amountInRupees,
  orderId
}) {
  const cleanUpi = upiId.trim();
  const cleanName = encodeURIComponent(merchantName.trim());
  const cleanAmount = Number(amountInRupees).toFixed(2);
  const cleanNote = encodeURIComponent(`Order ${orderId || 'KK-Store'}`);

  return `upi://pay?pa=${cleanUpi}&pn=${cleanName}&am=${cleanAmount}&cu=INR&tn=${cleanNote}`;
}

/**
 * Generate QR code image URL for scanning
 */
export function generateUpiQrUrl({
  upiId,
  merchantName,
  amountInRupees,
  orderId,
  size = 250
}) {
  const upiUri = generateUpiUri({ upiId, merchantName, amountInRupees, orderId });
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(upiUri)}&margin=10`;
}
