import React from 'react';
import { Package, TrendingUp, Handshake, GraduationCap, Users } from 'lucide-react';

export const AdminKpiBar = ({
  productsCount = 0,
  ordersCount = 0,
  grossRevenue = 0,
  formatPrice,
  partnerInquiriesCount = 0,
  trainingInquiriesCount = 0,
  registeredUsersCount = 0
}) => {
  return (
    <div className="bg-neutral-900/60 border-b border-neutral-800 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          <div className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
              <span className="font-bold uppercase tracking-wider text-[10px]">Catalog</span>
              <Package className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl font-black text-white font-mono">{productsCount}</div>
            <span className="text-[9px] text-neutral-500 font-bold uppercase">Products Live</span>
          </div>

          <div className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
              <span className="font-bold uppercase tracking-wider text-[10px]">Gross Sales</span>
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl font-black text-white font-mono truncate">
              {formatPrice ? formatPrice(grossRevenue) : `₹${grossRevenue}`}
            </div>
            <span className="text-[9px] text-neutral-500 font-bold uppercase">{ordersCount} Orders Placed</span>
          </div>

          <div className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
              <span className="font-bold uppercase tracking-wider text-[10px]">Partners</span>
              <Handshake className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl font-black text-white font-mono">{partnerInquiriesCount}</div>
            <span className="text-[9px] text-emerald-400 font-bold uppercase">B2B Distributor Leads</span>
          </div>

          <div className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
              <span className="font-bold uppercase tracking-wider text-[10px]">Academy</span>
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl font-black text-white font-mono">{trainingInquiriesCount}</div>
            <span className="text-[9px] text-amber-400 font-bold uppercase">Workshop Inquiries</span>
          </div>

          <div className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
              <span className="font-bold uppercase tracking-wider text-[10px]">Customers</span>
              <Users className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="text-xl font-black text-white font-mono">{registeredUsersCount}</div>
            <span className="text-[9px] text-neutral-500 font-bold uppercase">User Profiles</span>
          </div>

          <div className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
              <span className="font-bold uppercase tracking-wider text-[10px]">Database</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <div className="text-xs font-black text-emerald-400 font-mono mt-1">FIRESTORE</div>
            <span className="text-[9px] text-neutral-500 font-bold uppercase">Real-Time Sync</span>
          </div>

        </div>
      </div>
    </div>
  );
};
