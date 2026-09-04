import React from 'react';
import { Database, Search, RefreshCw, Users, Mail, Calendar } from 'lucide-react';

export const UsersTab = ({
  registeredUsers = [],
  loadingUsers,
  userSearchTerm,
  setUserSearchTerm
}) => {
  return (
    <div className="space-y-6">
      
      {/* Database Sync Status Card */}
      <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-emerald-950/80 text-emerald-400 rounded-xl border border-emerald-800/40">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black uppercase text-white">Firestore Cloud Database</h3>
              <span className="bg-emerald-950 text-emerald-400 border border-emerald-800/60 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Real-Time Active
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1 font-mono">
              DB ID: <strong className="text-neutral-200">ai-studio-krishikutir-364aa0cd-f3b5-4e82-846b-891195186a33</strong>
            </p>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Synced Collections: <code className="text-amber-400">users</code>, <code className="text-amber-400">orders</code>, <code className="text-amber-400">products</code>, <code className="text-amber-400">partner_inquiries</code>, <code className="text-amber-400">training_inquiries</code>
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-bold uppercase text-neutral-400 block">Total Registered Customers</span>
          <span className="text-2xl font-black text-white">{registeredUsers.length} Users</span>
        </div>
      </div>

      {/* Search Users Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search registered accounts by name, email, or phone number..."
          value={userSearchTerm}
          onChange={(e) => setUserSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-neutral-500"
        />
      </div>

      {/* Users Grid */}
      {loadingUsers ? (
        <div className="p-16 text-center text-neutral-400 text-xs">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-500" />
          Querying users collection from Firestore...
        </div>
      ) : registeredUsers.length === 0 ? (
        <div className="bg-neutral-950 p-16 rounded-2xl border border-neutral-800 text-center space-y-3">
          <Users className="w-12 h-12 text-neutral-700 mx-auto" />
          <h4 className="text-sm font-bold uppercase text-neutral-300">No registered users yet</h4>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            When customers register via Email or Google Sign-In, their user documents automatically show here in real time.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {registeredUsers
            .filter(u => {
              const term = userSearchTerm.toLowerCase();
              return (
                (u.displayName || '').toLowerCase().includes(term) ||
                (u.email || '').toLowerCase().includes(term) ||
                (u.phone || '').toLowerCase().includes(term) ||
                (u.city || '').toLowerCase().includes(term)
              );
            })
            .map((user) => (
              <div 
                key={user.id || user.uid} 
                className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 shadow-xs hover:border-neutral-700 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800/50 flex items-center justify-center font-black text-sm uppercase shrink-0">
                      {user.displayName?.[0] || user.email?.[0] || 'U'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-white">
                          {user.displayName || 'Unnamed User'}
                        </h4>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                          user.role === 'admin' 
                            ? 'bg-amber-400 text-neutral-950 font-black' 
                            : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                        }`}>
                          {user.role === 'admin' ? 'Store Admin' : 'Customer'}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 flex items-center gap-1.5 mt-0.5">
                        <Mail className="w-3 h-3 text-neutral-500" />
                        {user.email || 'No email provided'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact & Address info */}
                <div className="bg-neutral-900/80 rounded-xl p-3 text-xs space-y-1.5 text-neutral-300 border border-neutral-800/60">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-neutral-500">Phone:</span>
                    <span className="font-mono font-medium text-emerald-400">{user.phone || 'Not added yet'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-neutral-500">Location:</span>
                    <span className="font-medium text-neutral-300">
                      {user.city ? `${user.city}, ${user.state || ''}` : 'Not provided'}
                    </span>
                  </div>
                  {user.address && (
                    <div className="flex items-start justify-between gap-2 pt-1 border-t border-neutral-800">
                      <span className="text-[10px] font-bold uppercase text-neutral-500 shrink-0">Address:</span>
                      <span className="font-medium text-right text-neutral-300 truncate">{user.address}</span>
                    </div>
                  )}
                </div>

                {/* Footer UID & Timestamp */}
                <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-1 font-mono">
                  <span title={user.uid || user.id}>UID: {(user.uid || user.id || '').substring(0, 12)}...</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-neutral-500" />
                    {user.createdAt?.seconds 
                      ? new Date(user.createdAt.seconds * 1000).toLocaleDateString()
                      : 'Recent'}
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}

    </div>
  );
};
