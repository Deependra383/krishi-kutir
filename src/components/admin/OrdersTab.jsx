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
  handleUpdateOrderStatus
}) => {
  const pendingOrders = orders.filter(
    o => (o.status || 'Pending Verification') === 'Pending Verification' || o.status === 'Placed'
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending Verification':
      case 'Placed':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 animate-pulse">
            <Clock className="w-3 h-3 text-amber-400" /> Awaiting Payment Verification
          </span>
        );
      case 'Confirmed':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Payment Verified & Confirmed
          </span>
        );
      case 'Processing':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1.5">
            <Package className="w-3 h-3 text-blue-400" /> Processing & Packing
          </span>
        );
      case 'Dispatched':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1.5">
            <Truck className="w-3 h-3 text-purple-400" /> Dispatched / In Transit
          </span>
        );
      case 'Delivered':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-teal-400" /> Delivered
          </span>
        );
      case 'Cancelled':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-red-500/20 text-red-300 border border-red-500/40 flex items-center gap-1.5">
            <XCircle className="w-3 h-3 text-red-400" /> Cancelled / Rejected
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-neutral-800 text-neutral-300 border border-neutral-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Pending Confirmation Alert Banner */}
      {pendingOrders.length > 0 && (
        <div className="bg-gradient-to-r from-amber-950/80 to-amber-900/60 border border-amber-500/50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500 text-neutral-950 shrink-0">
              <AlertTriangle className="w-5 h-5 font-black" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase text-amber-200 tracking-wide">
                {pendingOrders.length} Order{pendingOrders.length > 1 ? 's' : ''} Awaiting Payment Verification
              </h3>
              <p className="text-xs text-amber-300/80 mt-0.5">
                Review the customer's UPI UTR / reference, verify payment in your bank app, then click <strong>"Verify & Confirm Order"</strong> to mark them confirmed.
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setOrderStatusFilter('Pending Verification')}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md shrink-0 flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5" />
            View {pendingOrders.length} Pending
          </button>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'All', value: 'All' },
            { label: `Pending (${pendingOrders.length})`, value: 'Pending Verification' },
            { label: 'Confirmed', value: 'Confirmed' },
            { label: 'Processing', value: 'Processing' },
            { label: 'Dispatched', value: 'Dispatched' },
            { label: 'Delivered', value: 'Delivered' },
            { label: 'Cancelled', value: 'Cancelled' }
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setOrderStatusFilter(tab.value)}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-black uppercase tracking-wider transition-all cursor-pointer ${
                orderStatusFilter === tab.value
                  ? 'bg-amber-400 text-neutral-950 shadow-xs'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-neutral-400 font-bold">
          Showing {filteredOrders.length} orders
        </span>
      </div>

      {/* Orders Feed */}
      {loadingOrders ? (
        <div className="py-20 text-center text-neutral-400 text-xs">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-500" />
          Loading live orders...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-20 text-center bg-neutral-950 rounded-2xl border border-neutral-800 space-y-3">
          <ShoppingBag className="w-12 h-12 text-neutral-700 mx-auto" />
          <h4 className="text-sm font-bold uppercase text-neutral-400">No orders in this category</h4>
          <p className="text-xs text-neutral-500">When visitors submit orders, they will appear here in real-time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => {
            const isPending = (order.status || 'Pending Verification') === 'Pending Verification' || order.status === 'Placed';
            const isConfirmed = order.status === 'Confirmed';

            return (
              <div 
                key={order.id}
                className={`bg-neutral-950 rounded-2xl border p-5 sm:p-6 shadow-md transition-all space-y-4 ${
                  isPending 
                    ? 'border-amber-500/60 bg-gradient-to-b from-neutral-950 to-amber-950/20' 
                    : 'border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {/* Top Row: ID, Time, Status Badge & Dropdown */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800/80 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-sm font-mono font-black text-amber-400">Order #{order.id}</span>
                      {getStatusBadge(order.status || 'Pending Verification')}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
                      <span>
                        📅 {order.createdAt?.seconds 
                            ? new Date(order.createdAt.seconds * 1000).toLocaleString() 
                            : (order.orderDate ? new Date(order.orderDate).toLocaleString() : 'Recent')}
                      </span>
                      <span>•</span>
                      <span className="font-bold text-white flex items-center gap-1">
                        👤 {order.customerName}
                      </span>
                      {order.phone && (
                        <a 
                          href={`tel:${order.phone}`}
                          className="text-emerald-400 hover:underline font-mono flex items-center gap-1"
                        >
                          <Phone className="w-3.5 h-3.5" /> {order.phone}
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-neutral-400">Update Status:</span>
                    <select
                      value={order.status || 'Pending Verification'}
                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                      className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-black uppercase rounded-xl border border-neutral-700 outline-none cursor-pointer"
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
                  <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                        <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Payment Verification Required Before Confirmation</span>
                      </div>
                      <p className="text-[11px] text-neutral-300">
                        Check your bank/UPI app for <strong className="text-amber-300">{formatPrice(order.totalAmount || 0)}</strong> with Reference <strong className="font-mono text-emerald-400">{order.paymentId || 'N/A'}</strong>.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'Confirmed')}
                        className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5"
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
                        className="px-3 py-2.5 bg-neutral-900 hover:bg-red-950 text-neutral-400 hover:text-red-400 border border-neutral-800 text-xs font-bold uppercase rounded-xl transition-all cursor-pointer"
                        title="Reject Order"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Secondary Quick Progression Actions if Confirmed */}
                {isConfirmed && (
                  <div className="bg-emerald-950/30 border border-emerald-800/50 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-emerald-300 font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Order Confirmed by Admin. Ready for Harvest & Packing.</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'Processing')}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase rounded-lg transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Package className="w-3.5 h-3.5" /> Move to Processing
                      </button>
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'Dispatched')}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase rounded-lg transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Truck className="w-3.5 h-3.5" /> Mark Dispatched
                      </button>
                    </div>
                  </div>
                )}

                {/* Itemized Line Items */}
                <div className="bg-neutral-900/70 rounded-xl p-3.5 space-y-2 text-xs border border-neutral-800/50">
                  <span className="text-[10px] font-black uppercase text-neutral-400 tracking-wider block">Items Ordered:</span>
                  {order.items?.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center text-neutral-200">
                      <span className="font-medium">{it.name} <strong className="text-emerald-400">× {it.quantity}</strong></span>
                      <span className="font-mono font-bold">{formatPrice ? formatPrice((it.price || 0) * (it.quantity || 1)) : `₹${(it.price || 0) * (it.quantity || 1)}`}</span>
                    </div>
                  ))}
                </div>

                {/* Delivery & Payment Details */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-400 pt-2 border-t border-neutral-900">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-medium text-neutral-300">{order.address}, {order.city}, {order.pincode}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-neutral-400" />
                      <span className="text-[11px] uppercase font-bold text-neutral-300">{order.paymentMethod}</span>
                    </div>
                    {order.paymentId && (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-emerald-400">
                        Ref/UTR: {order.paymentId}
                      </span>
                    )}
                    <span className="text-base font-black text-amber-400">
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

