import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  Building2, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Lock,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const RazorpayTestModal = ({
  isOpen,
  onClose,
  amountInRupees,
  orderId,
  customerName,
  phone,
  email,
  selectedMethod = 'upi',
  onSuccess,
  onFailure
}) => {
  const [activeTab, setActiveTab] = useState(selectedMethod.includes('card') ? 'card' : selectedMethod.includes('netbanking') ? 'netbanking' : 'upi');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');
  const [cardHolder, setCardHolder] = useState(customerName || 'Test Customer');
  const [vpa, setVpa] = useState(`${phone ? phone.replace(/\D/g, '').slice(-10) : 'customer'}@okhdfcbank`);
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulatedError, setSimulatedError] = useState('');

  if (!isOpen) return null;

  const handlePaySuccess = () => {
    setIsProcessing(true);
    setSimulatedError('');
    setTimeout(() => {
      setIsProcessing(false);
      const randomPayId = `pay_rzp_${Math.random().toString(36).substring(2, 12).toUpperCase()}`;
      onSuccess({
        paymentId: randomPayId,
        orderId: orderId || `KK-${Math.floor(100000 + Math.random() * 900000)}`,
        signature: `sig_${Math.random().toString(36).substring(2, 15)}`
      });
      onClose();
    }, 1200);
  };

  const handleSimulateFailure = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSimulatedError('Payment authorization failed: Bank server timeout or insufficient test funds.');
      if (onFailure) {
        onFailure('Payment was cancelled or rejected by the test bank.');
      }
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs font-sans animate-in fade-in duration-200">
      <div className="bg-white text-neutral-900 w-full max-w-lg rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden relative">
        
        {/* Razorpay Branded Top Header */}
        <div className="bg-[#0c2340] text-white p-5 flex items-center justify-between border-b border-[#1b3a60]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-300 bg-blue-900/60 px-2 py-0.5 rounded border border-blue-700/50">
                  Razorpay Standard Checkout
                </span>
                <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 px-1.5 py-0.5 rounded">
                  Test Gateway
                </span>
              </div>
              <h3 className="text-base font-black uppercase tracking-tight text-white mt-0.5">
                Krishi Kutir
              </h3>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-neutral-400 uppercase font-mono block">Payable Amount</span>
            <span className="text-lg font-black text-emerald-400 font-mono">₹{amountInRupees}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-200 bg-neutral-50 text-xs font-bold text-neutral-600">
          <button
            type="button"
            onClick={() => { setActiveTab('upi'); setSimulatedError(''); }}
            className={`flex-1 py-3 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'upi' ? 'border-emerald-600 text-emerald-800 bg-white font-black' : 'border-transparent hover:bg-neutral-100'
            }`}
          >
            <QrCode className="w-4 h-4 text-emerald-600" />
            <span>UPI / QR</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('card'); setSimulatedError(''); }}
            className={`flex-1 py-3 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'card' ? 'border-emerald-600 text-emerald-800 bg-white font-black' : 'border-transparent hover:bg-neutral-100'
            }`}
          >
            <CreditCard className="w-4 h-4 text-blue-600" />
            <span>Card</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('netbanking'); setSimulatedError(''); }}
            className={`flex-1 py-3 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'netbanking' ? 'border-emerald-600 text-emerald-800 bg-white font-black' : 'border-transparent hover:bg-neutral-100'
            }`}
          >
            <Building2 className="w-4 h-4 text-purple-600" />
            <span>NetBanking</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 space-y-5">
          {simulatedError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{simulatedError}</span>
            </div>
          )}

          {/* UPI TAB */}
          {activeTab === 'upi' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">Fast UPI Pay</span>
                  <p className="text-xs text-emerald-950 font-bold mt-0.5">Instant zero-fee transfer via any UPI App</p>
                </div>
                <div className="flex gap-1.5">
                  <span className="text-[10px] font-bold bg-white text-neutral-800 px-2 py-1 rounded shadow-xs border border-neutral-200">GPay</span>
                  <span className="text-[10px] font-bold bg-white text-neutral-800 px-2 py-1 rounded shadow-xs border border-neutral-200">PhonePe</span>
                  <span className="text-[10px] font-bold bg-white text-neutral-800 px-2 py-1 rounded shadow-xs border border-neutral-200">Paytm</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-neutral-600 mb-1">Enter Virtual Payment Address (UPI ID)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={vpa}
                    onChange={(e) => setVpa(e.target.value)}
                    placeholder="yourname@upi or mobile@okhdfcbank"
                    className="flex-1 px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-mono outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setVpa('success@razorpay')}
                    className="px-3 py-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-[11px] font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Use Test VPA
                  </button>
                </div>
              </div>

              <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 text-xs text-neutral-500 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-neutral-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Razorpay Verified UPI Gateway</span>
                </div>
                <p className="text-[11px]">A test payment collect request of <strong>₹{amountInRupees}</strong> will be approved instantly in sandbox mode.</p>
              </div>
            </div>
          )}

          {/* CARD TAB */}
          {activeTab === 'card' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-neutral-700">Credit / Debit Card (Visa, Master, RuPay)</span>
                <button
                  type="button"
                  onClick={() => {
                    setCardNumber('4111 2222 3333 4444');
                    setCardExpiry('12/28');
                    setCardCvv('123');
                  }}
                  className="text-[11px] text-emerald-700 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" /> Auto-fill Test Card
                </button>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-mono outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-mono outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">CVV</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-mono outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* NETBANKING TAB */}
          {activeTab === 'netbanking' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-neutral-700 block">Select Your Bank:</span>
              <div className="grid grid-cols-2 gap-2">
                {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map(bank => (
                  <button
                    key={bank}
                    type="button"
                    onClick={() => setSelectedBank(bank)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                      selectedBank === bank
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                        : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-700'
                    }`}
                  >
                    {bank}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-neutral-100 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleSimulateFailure}
              disabled={isProcessing}
              className="flex-1 sm:flex-initial px-3 py-2.5 bg-red-100 hover:bg-red-200 text-red-800 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              Test Failure
            </button>

            <button
              type="button"
              onClick={handlePaySuccess}
              disabled={isProcessing}
              className="flex-1 sm:flex-initial px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              {isProcessing ? 'Authorizing...' : `Pay ₹${amountInRupees}`}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
