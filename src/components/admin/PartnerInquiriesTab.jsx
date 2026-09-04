import React, { useState } from 'react';
import { 
  Handshake, 
  Search, 
  RefreshCw, 
  Phone, 
  Mail, 
  MapPin, 
  Building2, 
  Calendar, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Filter, 
  MessageSquare, 
  Send,
  Boxes,
  ExternalLink,
  PhoneCall
} from 'lucide-react';
import { db, doc, updateDoc, deleteDoc, serverTimestamp } from '../../firebase';

export const PartnerInquiriesTab = ({ inquiries, loading, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [partnerTypeFilter, setPartnerTypeFilter] = useState('All');
  const [inquiryToDelete, setInquiryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  const statusOptions = [
    'All',
    'New Partner Inquiry',
    'Contacted',
    'Proposal Sent',
    'Contracted',
    'Closed'
  ];

  const partnerTypes = [
    'All',
    'Restaurant & Cafe (HORECA)',
    'Supermarket / Organic Retail Chain',
    'Bulk B2B Wholesaler / Trader',
    'International Importer / Exporter',
    'Private Label & Custom Dehydration',
    'Farm Franchisee / Contract Grower'
  ];

  const handleUpdateStatus = async (inquiryId, newStatus) => {
    try {
      if (db) {
        const inquiryRef = doc(db, 'partner_inquiries', inquiryId);
        await updateDoc(inquiryRef, {
          status: newStatus,
          updatedAt: serverTimestamp()
        });
      }
      setActionSuccess(`Updated inquiry status to "${newStatus}"`);
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      console.error('Failed to update partner inquiry status:', err);
      // Local fallback
      try {
        const local = JSON.parse(localStorage.getItem('kk_partner_inquiries') || '[]');
        const updated = local.map(i => i.id === inquiryId ? { ...i, status: newStatus } : i);
        localStorage.setItem('kk_partner_inquiries', JSON.stringify(updated));
        if (onRefresh) onRefresh();
      } catch {}
    }
  };

  const confirmDeleteInquiry = async () => {
    if (!inquiryToDelete) return;
    setIsDeleting(true);
    try {
      if (db) {
        await deleteDoc(doc(db, 'partner_inquiries', inquiryToDelete.id));
      }
      // Also clean local if present
      try {
        const local = JSON.parse(localStorage.getItem('kk_partner_inquiries') || '[]');
        const updated = local.filter(i => i.id !== inquiryToDelete.id);
        localStorage.setItem('kk_partner_inquiries', JSON.stringify(updated));
        if (onRefresh) onRefresh();
      } catch {}

      setActionSuccess(`Deleted inquiry from ${inquiryToDelete.businessName || inquiryToDelete.fullName}`);
      setTimeout(() => setActionSuccess(''), 3000);
      setInquiryToDelete(null);
    } catch (err) {
      console.error('Failed to delete inquiry:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredInquiries = inquiries.filter(inq => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (inq.fullName || '').toLowerCase().includes(term) ||
      (inq.businessName || '').toLowerCase().includes(term) ||
      (inq.email || '').toLowerCase().includes(term) ||
      (inq.phone || '').toLowerCase().includes(term) ||
      (inq.cityLocation || '').toLowerCase().includes(term) ||
      (inq.message || '').toLowerCase().includes(term);

    const matchesStatus = statusFilter === 'All' || (inq.status || 'New Partner Inquiry') === statusFilter;
    const matchesType = partnerTypeFilter === 'All' || inq.partnerType === partnerTypeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'New Partner Inquiry':
        return 'bg-amber-400 text-neutral-950 font-black';
      case 'Contacted':
        return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
      case 'Proposal Sent':
        return 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
      case 'Contracted':
        return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
      case 'Closed':
        return 'bg-neutral-800 text-neutral-400 border border-neutral-700';
      default:
        return 'bg-amber-400/20 text-amber-300 border border-amber-500/30';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Action Notification */}
      {actionSuccess && (
        <div className="bg-emerald-950/90 text-emerald-200 border border-emerald-800 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Header Info Card */}
      <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-emerald-950/80 text-emerald-400 rounded-xl border border-emerald-800/40">
            <Handshake className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black uppercase text-white">B2B Partner & Commercial Inquiries</h3>
              <span className="bg-emerald-950 text-emerald-400 border border-emerald-800/60 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Real-Time Firestore Sync
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Commercial proposals submitted from HORECA, supermarkets, bulk traders, and export partners.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase text-neutral-400 block">Total Submissions</span>
            <span className="text-2xl font-black text-white">{inquiries.length} Inquiries</span>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search company, contact person, email, phone, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-neutral-900 text-white rounded-xl border border-neutral-800 outline-none focus:ring-2 focus:ring-emerald-500 placeholder-neutral-500"
          />
        </div>

        {/* Partner Type Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider whitespace-nowrap">Category:</span>
          <select
            value={partnerTypeFilter}
            onChange={(e) => setPartnerTypeFilter(e.target.value)}
            className="px-3 py-2 bg-neutral-900 text-white border border-neutral-800 rounded-xl text-xs font-bold outline-none cursor-pointer max-w-[200px] truncate"
          >
            {partnerTypes.map(pt => (
              <option key={pt} value={pt}>{pt}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Status Filter Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
        <div className="flex flex-wrap gap-2">
          {statusOptions.map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-black uppercase tracking-wider transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-amber-400 text-neutral-950 shadow-xs'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <span className="text-xs text-neutral-400 font-bold">
          Showing {filteredInquiries.length} partner inquiries
        </span>
      </div>

      {/* Inquiries Feed */}
      {loading ? (
        <div className="py-20 text-center text-neutral-400 text-xs">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-500" />
          Streaming partner proposals from Firestore...
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="py-20 text-center bg-neutral-950 rounded-2xl border border-neutral-800 space-y-3">
          <Handshake className="w-12 h-12 text-neutral-700 mx-auto" />
          <h4 className="text-sm font-bold uppercase text-neutral-400">No partner inquiries found</h4>
          <p className="text-xs text-neutral-500 max-w-md mx-auto">
            When potential B2B partners submit the "Partner With Us" form on the public website, their commercial proposals will appear here instantly.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredInquiries.map(inq => {
            const dateStr = inq.createdAt?.seconds 
              ? new Date(inq.createdAt.seconds * 1000).toLocaleString() 
              : (inq.createdAt ? new Date(inq.createdAt).toLocaleString() : 'Recent');

            const cleanPhone = (inq.phone || '').replace(/[^0-9]/g, '');

            return (
              <div 
                key={inq.id}
                className="bg-neutral-950 rounded-2xl border border-neutral-800 p-5 sm:p-6 shadow-xs hover:border-neutral-700 transition-all space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-neutral-800/80 pb-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h4 className="text-base font-black text-white flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
                        {inq.businessName || 'Business Organization'}
                      </h4>
                      <span className="text-xs text-neutral-400">
                        • Contact: <strong className="text-neutral-200 font-bold">{inq.fullName}</strong>
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400 pt-0.5">
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-950/80 text-emerald-400 border border-emerald-800/40 text-[10px] font-bold uppercase">
                        {inq.partnerType || 'B2B Partner'}
                      </span>
                      <span className="flex items-center gap-1 text-neutral-300">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        {inq.cityLocation || 'Location unspecified'}
                      </span>
                      <span className="flex items-center gap-1 text-neutral-500 font-mono text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-neutral-500" />
                        {dateStr}
                      </span>
                    </div>
                  </div>

                  {/* Status Dropdown & Delete */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-neutral-400">Status:</span>
                      <select
                        value={inq.status || 'New Partner Inquiry'}
                        onChange={(e) => handleUpdateStatus(inq.id, e.target.value)}
                        className={`px-3 py-1.5 text-xs font-black uppercase rounded-xl border outline-none cursor-pointer transition-all ${getStatusBadgeColor(inq.status || 'New Partner Inquiry')}`}
                      >
                        <option value="New Partner Inquiry">New Partner Inquiry</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Proposal Sent">Proposal Sent</option>
                        <option value="Contracted">Contracted</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>

                    <button
                      onClick={() => setInquiryToDelete(inq)}
                      className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/40 transition-all cursor-pointer"
                      title="Delete Inquiry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Requirements & Volume details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  
                  {/* Estimated Volume */}
                  <div className="bg-neutral-900/80 p-3.5 rounded-xl border border-neutral-800/60 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider block flex items-center gap-1.5">
                      <Boxes className="w-3.5 h-3.5 text-amber-400" /> Target Volume
                    </span>
                    <p className="text-xs font-bold text-white">
                      {inq.estimatedVolume || 'Weekly Recurring'}
                    </p>
                  </div>

                  {/* Direct Contact Buttons */}
                  <div className="md:col-span-2 bg-neutral-900/80 p-3.5 rounded-xl border border-neutral-800/60 flex flex-wrap items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider block">Direct Channels</span>
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {inq.phone}
                        </span>
                        <span className="text-neutral-300 font-mono flex items-center gap-1">
                          <Mail className="w-3 h-3 text-amber-400" /> {inq.email}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {inq.phone && (
                        <>
                          <a
                            href={`tel:${inq.phone}`}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold uppercase flex items-center gap-1 transition-all"
                            title="Call Phone"
                          >
                            <PhoneCall className="w-3 h-3" />
                            <span>Call</span>
                          </a>
                          <a
                            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${inq.fullName}, regarding your partnership inquiry with Krishi Kutir for ${inq.businessName || 'your company'}...`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/50 text-[11px] font-bold uppercase flex items-center gap-1 transition-all"
                            title="Message on WhatsApp"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </a>
                        </>
                      )}
                      {inq.email && (
                        <a
                          href={`mailto:${inq.email}?subject=${encodeURIComponent(`Krishi Kutir B2B Partnership - ${inq.businessName || inq.fullName}`)}&body=${encodeURIComponent(`Dear ${inq.fullName},\n\nThank you for reaching out to Krishi Kutir regarding partnership opportunities.\n\nBest regards,\nKrishi Kutir Corporate Desk`)}`}
                          className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] font-bold uppercase flex items-center gap-1 transition-all"
                          title="Send Email"
                        >
                          <Mail className="w-3 h-3" />
                          <span>Email</span>
                        </a>
                      )}
                    </div>
                  </div>

                </div>

                {/* Custom Requirements / Message */}
                {inq.message && (
                  <div className="bg-neutral-900/50 p-3.5 rounded-xl border border-neutral-800/40 text-xs text-neutral-300 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-neutral-400 block tracking-wider">
                      Specific Notes & Requirements:
                    </span>
                    <p className="font-light leading-relaxed whitespace-pre-wrap text-neutral-300">
                      "{inq.message}"
                    </p>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {inquiryToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-950 text-white rounded-3xl p-6 max-w-sm w-full space-y-4 border border-neutral-800 shadow-2xl animate-in fade-in">
            <div className="w-12 h-12 rounded-2xl bg-red-950 text-red-400 border border-red-800/40 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-black uppercase">Delete Partner Inquiry?</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Are you sure you want to remove the proposal record from <strong className="text-white">{inquiryToDelete.businessName || inquiryToDelete.fullName}</strong>?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setInquiryToDelete(null)}
                className="py-2.5 px-4 rounded-xl border border-neutral-800 text-neutral-300 text-xs font-bold uppercase hover:bg-neutral-900 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteInquiry}
                disabled={isDeleting}
                className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
