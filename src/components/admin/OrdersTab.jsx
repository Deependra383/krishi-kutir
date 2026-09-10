import React from 'react';
import { 
  ShoppingBag, 
  RefreshCw, 
  Phone, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Package, 
  AlertTriangle,
  XCircle,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export const OrdersTab = ({
  orders = [],
  filteredOrders = [],
  loadingOrders,
  orderStatusFilter,
  setOrderStatusFilter,
  formatPrice,
  handleUpdateOrderStatus,
  isDarkMode = false
}) => {
  const pendingOrders = orders.filter(
    o => (o.status || 'Pending Verification') === 'Pending Verification' || o.status === 'Placed'
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending Verification':
      case 'Placed':
        return (
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 animate-pulse shadow-2xs ${
            isDarkMode
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-amber-100 text-amber-900 border border-amber-300'
          }`}>
            <Clock className={`w-3 h-3 ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`} /> Awaiting Payment Verification
          </span>
        );
      case 'Confirmed':
        return (
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 shadow-2xs ${
            isDarkMode
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40'
              : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
          }`}>
            <CheckCircle2 className={`w-3 h-3 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`} /> Payment Verified & Confirmed
          </span>
        );
      case 'Processing':
        return (
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 shadow-2xs ${
            isDarkMode
              ? 'bg-sky-500/15 text-sky-300 border border-sky-500/40'
              : 'bg-sky-100 text-sky-900 border border-sky-300'
          }`}>
            <Package className={`w-3 h-3 ${isDarkMode ? 'text-sky-400' : 'text-sky-700'}`} /> Processing & Packing
          </span>
        );
      case 'Dispatched':
        return (
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 shadow-2xs ${
            isDarkMode
              ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/40'
              : 'bg-indigo-100 text-indigo-900 border border-indigo-300'
          }`}>
            <Truck className={`w-3 h-3 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-700'}`} /> Dispatched / In Transit
          </span>
        );
      case 'Delivered':
        return (
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 shadow-2xs ${
            isDarkMode
              ? 'bg-teal-500/15 text-teal-300 border border-teal-400/40'
              : 'bg-teal-100 text-teal-900 border border-teal-300'
          }`}>
            <CheckCircle2 className={`w-3 h-3 ${isDarkMode ? 'text-teal-400' : 'text-teal-700'}`} /> Delivered
          </span>
        );
      case 'Cancelled':
        return (
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 shadow-2xs ${
            isDarkMode
              ? 'bg-red-500/15 text-red-300 border border-red-400/40'
              : 'bg-red-100 text-red-900 border border-red-300'
          }`}>
            <XCircle className={`w-3 h-3 ${isDarkMode ? 'text-red-400' : 'text-red-700'}`} /> Cancelled / Rejected
          </span>
        );
      default:
        return (
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
            isDarkMode
              ? 'bg-neutral-800 text-neutral-300 border-neutral-700'
              : 'bg-slate-100 text-slate-800 border-slate-300'
          }`}>
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Pending Confirmation Alert Banner */}
      {pendingOrders.length > 0 && (
        <div className={`rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border transition-all ${
          isDarkMode
            ? 'bg-gradient-to-r from-amber-950/80 to-amber-900/60 border-amber-500/50 shadow-lg text-amber-200'
            : 'bg-amber-50 border-amber-300 shadow-sm text-amber-950'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500 text-neutral-950 shrink-0 shadow-xs">
              <AlertTriangle className="w-5 h-5 font-black" />
            </div>
            <div>
              <h3 className={`text-sm font-black uppercase tracking-wide ${
                isDarkMode ? 'text-amber-200' : 'text-amber-950'
              }`}>
                {pendingOrders.length} Order{pendingOrders.length > 1 ? 's' : ''} Awaiting Payment Verification
              </h3>
              <p className={`text-xs mt-0.5 ${
                isDarkMode ? 'text-amber-300/80' : 'text-amber-800'
              }`}>
                Review the customer's UPI UTR / reference, verify payment in your bank app, then click <strong>"Verify & Confirm Order"</strong> to mark them confirmed.
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setOrderStatusFilter('Pending Verification')}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-neutral-950 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md shrink-0 flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5" />
            View {pendingOrders.length} Pending
          </button>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className={`flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border transition-all ${
        isDarkMode
          ? 'bg-neutral-950 border-neutral-800'
          : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'All', value: 'All' },
            { label: `Pending (${pendingOrders.length})`, value: 'Pending Verification' },
            { label: 'Confirmed', value: 'Confirmed' },
            { label: 'Processing', value: 'Processing' },
            { label: 'Dispatched', value: 'Dispatched' },
            { label: 'Delivered', value: 'Delivered' },
            { label: 'Cancelled', value: 'Cancelled' }
          ].map(tab => {
            const isTabActive = orderStatusFilter === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setOrderStatusFilter(tab.value)}
                className={`text-xs px-3.5 py-1.5 rounded-xl font-black uppercase tracking-wider transition-all cursor-pointer ${
                  isTabActive
                    ? 'bg-amber-400 text-neutral-950 shadow-xs font-black'
                    : isDarkMode
                      ? 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                      : 'bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <span className={`text-xs font-bold ${isDarkMode ? 'text-neutral-400' : 'text-slate-500'}`}>
          Showing {filteredOrders.length} orders
        </span>
      </div>

      {/* Orders Feed */}
      {loadingOrders ? (
        <div className={`py-20 text-center text-xs ${isDarkMode ? 'text-neutral-400' : 'text-slate-500'}`}>
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-500" />
          Loading live orders...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className={`py-20 text-center rounded-2xl border space-y-3 ${
          isDarkMode
            ? 'bg-neutral-950 border-neutral-800'
            : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <ShoppingBag className={`w-12 h-12 mx-auto ${isDarkMode ? 'text-neutral-700' : 'text-slate-300'}`} />
          <h4 className={`text-sm font-bold uppercase ${isDarkMode ? 'text-neutral-400' : 'text-slate-600'}`}>No orders in this category</h4>
          <p className={`text-xs ${isDarkMode ? 'text-neutral-500' : 'text-slate-400'}`}>When visitors submit orders, they will appear here in real-time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => {
            const isPending = (order.status || 'Pending Verification') === 'Pending Verification' || order.status === 'Placed';
            const isConfirmed = order.status === 'Confirmed';

            return (
              <div 
                key={order.id}
                className={`rounded-2xl border p-5 sm:p-6 transition-all space-y-4 ${
                  isPending 
                    ? isDarkMode
                      ? 'border-amber-500/60 bg-gradient-to-b from-neutral-950 to-amber-950/20 shadow-md' 
                      : 'bg-white border-amber-400 ring-2 ring-amber-400/20 shadow-sm'
                    : isDarkMode
                      ? 'bg-neutral-950 border-neutral-800 hover:border-neutral-700 shadow-md'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                {/* Top Row: ID, Time, Status Badge & Dropdown */}
                <div className={`flex flex-wrap items-center justify-between gap-3 border-b pb-4 ${
                  isDarkMode ? 'border-neutral-800/80' : 'border-slate-200'
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className={`text-xs sm:text-sm font-mono font-black px-2.5 py-1 rounded-lg border shadow-2xs ${
                        isDarkMode
                          ? 'bg-neutral-900 text-white border-neutral-700'
                          : 'bg-slate-100 text-slate-900 border-slate-300'
                      }`}>
                        Order #{order.id}
                      </span>
                      {getStatusBadge(order.status || 'Pending Verification')}
                    </div>
                    <div className={`flex flex-wrap items-center gap-3 text-xs ${
                      isDarkMode ? 'text-neutral-400' : 'text-slate-600'
                    }`}>
                      <span>
                        📅 {order.createdAt?.seconds 
                            ? new Date(order.createdAt.seconds * 1000).toLocaleString() 
                            : (order.orderDate ? new Date(order.orderDate).toLocaleString() : 'Recent')}
                      </span>
                      <span>•</span>
                      <span className={`font-bold flex items-center gap-1 ${
                        isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        👤 {order.customerName}
                      </span>
                      {order.phone && (
                        <a 
                          href={`tel:${order.phone}`}
                          className="text-emerald-600 hover:underline font-mono flex items-center gap-1 font-bold"
                        >
                          <Phone className="w-3.5 h-3.5" /> {order.phone}
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] uppercase font-bold ${
                      isDarkMode ? 'text-neutral-400' : 'text-slate-600'
                    }`}>Update Status:</span>
                    <select
                      value={order.status || 'Pending Verification'}
                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                      className={`px-3 py-1.5 text-xs font-black uppercase rounded-xl border outline-none cursor-pointer transition-all ${
                        isDarkMode
                          ? 'bg-neutral-900 hover:bg-neutral-800 text-white border-neutral-700'
                          : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-300 shadow-2xs'
                      }`}
                    >
                      <option value="Pending Verification">Pending Verification</option>
                      <option value="Confirmed">Confirmed (Payment Verified)</option>
                      <option value="Processing">Processing (Packing)</option>
                      <option value="Dispatched">Dispatched (In Transit)</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Verification & Action Bar for Admin */}
                {isPending && (
                  <div className={`rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border transition-all ${
                    isDarkMode
                      ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                      : 'bg-amber-50 border-amber-300 text-amber-950 shadow-2xs'
                  }`}>
                    <div className="space-y-1">
                      <div className={`flex items-center gap-2 font-bold text-xs ${
                        isDarkMode ? 'text-amber-300' : 'text-amber-900'
                      }`}>
                        <Clock className={`w-4 h-4 shrink-0 ${
                          isDarkMode ? 'text-amber-400' : 'text-amber-700'
                        }`} />
                        <span>Payment Verification Required Before Confirmation</span>
                      </div>
                      <p className={`text-[11px] ${
                        isDarkMode ? 'text-neutral-300' : 'text-amber-900'
                      }`}>
                        Check your bank/UPI app for <strong className={isDarkMode ? 'text-amber-300' : 'text-amber-950 font-black'}>{formatPrice(order.totalAmount || 0)}</strong> with Reference <strong className={`font-mono font-bold ${
                          isDarkMode ? 'text-emerald-400' : 'text-emerald-800'
                        }`}>{order.paymentId || 'N/A'}</strong>.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'Confirmed')}
                        className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Verify Payment & Confirm Order</span>
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to cancel order #${order.id}?`)) {
                            handleUpdateOrderStatus(order.id, 'Cancelled');
                          }
                        }}
                        className={`px-3 py-2.5 text-xs font-bold uppercase rounded-xl border transition-all cursor-pointer ${
                          isDarkMode
                            ? 'bg-neutral-900 hover:bg-red-950 text-neutral-400 hover:text-red-400 border-neutral-800'
                            : 'bg-white hover:bg-red-50 text-slate-600 hover:text-red-700 border-slate-300'
                        }`}
                        title="Reject Order"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Secondary Quick Progression Actions if Confirmed */}
                {isConfirmed && (
                  <div className={`rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 border shadow-2xs ${
                    isDarkMode
                      ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  }`}>
                    <div className={`flex items-center gap-2 text-xs font-bold ${
                      isDarkMode ? 'text-emerald-300' : 'text-emerald-900'
                    }`}>
                      <ShieldCheck className={`w-4 h-4 shrink-0 ${
                        isDarkMode ? 'text-emerald-400' : 'text-emerald-700'
                      }`} />
                      <span>Order Confirmed by Admin. Ready for Harvest & Packing.</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'Processing')}
                        className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold uppercase rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                      >
                        <Package className="w-3.5 h-3.5" /> Move to Processing
                      </button>
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'Dispatched')}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                      >
                        <Truck className="w-3.5 h-3.5" /> Mark Dispatched
                      </button>
                    </div>
                  </div>
                )}

                {/* Itemized Line Items - Light Theme */}
                <div className={`rounded-xl p-4 space-y-2.5 text-xs border ${
                  isDarkMode
                    ? 'bg-neutral-900/70 border-neutral-800'
                    : 'bg-slate-50 border-slate-200 shadow-2xs'
                }`}>
                  <div className={`flex items-center justify-between border-b pb-1.5 ${
                    isDarkMode ? 'border-neutral-800' : 'border-slate-200'
                  }`}>
                    <span className={`text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                      isDarkMode ? 'text-neutral-200' : 'text-slate-900'
                    }`}>
                      <Package className="w-3.5 h-3.5 text-emerald-600" />
                      Items Ordered:
                    </span>
                    <span className={`text-[10px] font-bold uppercase ${
                      isDarkMode ? 'text-neutral-400' : 'text-slate-500'
                    }`}>
                      {order.items?.reduce((acc, item) => acc + (item.quantity || 1), 0) || 0} Total Units
                    </span>
                  </div>
                  {order.items?.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center py-0.5">
                      <span className="font-medium flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                        <span className={`font-semibold ${isDarkMode ? 'text-neutral-200' : 'text-slate-900'}`}>{it.name}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-black border ${
                          isDarkMode
                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}>× {it.quantity}</span>
                      </span>
                      <span className={`font-mono font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {formatPrice ? formatPrice((it.price || 0) * (it.quantity || 1)) : `₹${(it.price || 0) * (it.quantity || 1)}`}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Delivery & Payment Details */}
                <div className={`flex flex-wrap items-center justify-between gap-3 text-xs pt-2 border-t ${
                  isDarkMode
                    ? 'border-neutral-800/80 text-neutral-400'
                    : 'border-slate-200 text-slate-600'
                }`}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className={`font-medium ${
                      isDarkMode ? 'text-neutral-300' : 'text-slate-700'
                    }`}>{order.address}, {order.city}, {order.pincode}</span>
                    
                    {(order.courierZone || order.shipping_address?.courier_zone) && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-sky-50 text-sky-800 border border-sky-200 flex items-center gap-1">
                        <Truck className="w-3 h-3 text-sky-600" />
                        {order.courierZone || order.shipping_address?.courier_zone}
                      </span>
                    )}

                    {order.deliveryFee !== undefined && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${
                        order.deliveryFee === 0
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-neutral-100 text-neutral-800 border-neutral-200'
                      }`}>
                        Delivery: {order.deliveryFee === 0 ? 'FREE' : formatPrice(order.deliveryFee)}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <CreditCard className={`w-3.5 h-3.5 ${
                        isDarkMode ? 'text-neutral-400' : 'text-slate-500'
                      }`} />
                      <span className={`text-[11px] uppercase font-bold ${
                        isDarkMode ? 'text-neutral-300' : 'text-slate-700'
                      }`}>{order.paymentMethod}</span>
                    </div>
                    {order.paymentId && (
                      <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                        isDarkMode
                          ? 'bg-neutral-900 border-neutral-800 text-emerald-400'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold'
                      }`}>
                        Ref/UTR: {order.paymentId}
                      </span>
                    )}
                    <span className={`text-base font-black font-sans ${
                      isDarkMode ? 'text-amber-400' : 'text-amber-700'
                    }`}>
                      {formatPrice ? formatPrice(order.totalAmount || 0) : `₹${order.totalAmount}`}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

