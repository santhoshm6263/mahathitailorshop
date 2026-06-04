'use client';

// src/app/admin/page.tsx
import React from 'react';
import { useBoutique } from '../providers';
import { 
  Scissors, Calendar, DollarSign, Clock, 
  TrendingUp, Award, Bell, CheckCircle2 
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { 
    orders, appointments, notifications, products, 
    markNotificationRead, updateOrderStatus 
  } = useBoutique();

  // Financial calculations
  const totalRevenue = orders.reduce((acc, curr) => acc + curr.cost, 0);
  const totalAdvance = orders.reduce((acc, curr) => acc + curr.advance_paid, 0);
  const totalOutstanding = totalRevenue - totalAdvance;

  // Order stats
  const activeOrders = orders.filter(o => o.status !== 'Completed');
  const completedOrders = orders.filter(o => o.status === 'Completed');

  // Appointment stats
  const pendingAppointments = appointments.filter(a => a.status === 'Pending');

  // Status distributions
  const getStatusCount = (status: string) => orders.filter(o => o.status === status).length;

  const statuses = [
    { label: 'Pending', count: getStatusCount('Pending'), color: 'bg-yellow-500' },
    { label: 'Measuring', count: getStatusCount('Measuring'), color: 'bg-orange-500' },
    { label: 'Cutting', count: getStatusCount('Cutting'), color: 'bg-amber-600' },
    { label: 'Embroidery', count: getStatusCount('Embroidery'), color: 'bg-purple-600' },
    { label: 'Stitching', count: getStatusCount('Stitching'), color: 'bg-blue-600' },
    { label: 'Trial Runs', count: getStatusCount('Trial'), color: 'bg-pink-600' },
    { label: 'Completed', count: getStatusCount('Completed'), color: 'bg-green-600' }
  ];

  // Active notifications
  const activeNotifs = notifications.filter(n => !n.read);

  return (
    <div className="space-y-8 animate-fade-in text-maroon">
      
      {/* Page Header */}
      <div className="border-b border-maroon/5 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-playfair text-xl sm:text-2xl font-bold">Atelier Analytics & Operations</h3>
          <p className="font-poppins text-xs text-maroon/60">Real-time boutique metrics, stitching pipelines, and visitor schedules.</p>
        </div>
        <div className="font-poppins text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] bg-maroon px-4 py-2 rounded-full border border-gold/30">
          Executive Dashboard Mode
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Total Booked Value */}
        <div className="bg-white p-6 rounded-2xl border border-maroon/5 shadow-luxury flex items-center space-x-4">
          <div className="p-3.5 bg-gold/10 text-gold rounded-xl border border-gold/10">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="font-poppins text-[9px] uppercase tracking-wider text-maroon/40 font-bold block">Estimated Revenue</span>
            <h4 className="font-playfair text-xl font-bold mt-0.5">₹{totalRevenue.toLocaleString('en-IN')}</h4>
            <span className="font-poppins text-[9px] text-green-700 flex items-center space-x-1 mt-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>Full Stitching Pipeline</span>
            </span>
          </div>
        </div>

        {/* Advance Received */}
        <div className="bg-white p-6 rounded-2xl border border-maroon/5 shadow-luxury flex items-center space-x-4">
          <div className="p-3.5 bg-maroon/5 text-maroon rounded-xl border border-maroon/5">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="font-poppins text-[9px] uppercase tracking-wider text-maroon/40 font-bold block">Advance Deposited</span>
            <h4 className="font-playfair text-xl font-bold mt-0.5">₹{totalAdvance.toLocaleString('en-IN')}</h4>
            <span className="font-poppins text-[9px] text-maroon/60 block mt-0.5">
              ₹{totalOutstanding.toLocaleString('en-IN')} outstanding balance
            </span>
          </div>
        </div>

        {/* Active Stitching Orders */}
        <div className="bg-white p-6 rounded-2xl border border-maroon/5 shadow-luxury flex items-center space-x-4">
          <div className="p-3.5 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
            <Scissors className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="font-poppins text-[9px] uppercase tracking-wider text-maroon/40 font-bold block">Active Stitching</span>
            <h4 className="font-playfair text-xl font-bold mt-0.5">{activeOrders.length} Orders</h4>
            <span className="font-poppins text-[9px] text-blue-600 block mt-0.5">
              {completedOrders.length} completed & delivered
            </span>
          </div>
        </div>

        {/* Upcoming Consultations */}
        <div className="bg-white p-6 rounded-2xl border border-maroon/5 shadow-luxury flex items-center space-x-4">
          <div className="p-3.5 bg-orange-50 text-orange-600 rounded-xl border border-orange-100">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="font-poppins text-[9px] uppercase tracking-wider text-maroon/40 font-bold block">Pending Bookings</span>
            <h4 className="font-playfair text-xl font-bold mt-0.5">{pendingAppointments.length} Inquiries</h4>
            <span className="font-poppins text-[9px] text-orange-600 block mt-0.5">
              {appointments.filter(a => a.status === 'Confirmed').length} confirmed consultations
            </span>
          </div>
        </div>

        {/* In Stock Catalog Items */}
        <div className="bg-white p-6 rounded-2xl border border-maroon/5 shadow-luxury flex items-center space-x-4">
          <div className="p-3.5 bg-purple-50 text-purple-600 rounded-xl border border-purple-100">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="font-poppins text-[9px] uppercase tracking-wider text-maroon/40 font-bold block">Couture Products</span>
            <h4 className="font-playfair text-xl font-bold mt-0.5">{products.length} Designs</h4>
            <span className="font-poppins text-[9px] text-purple-600 block mt-0.5">
              Active in boutique gallery
            </span>
          </div>
        </div>

        {/* Active Notifications Count */}
        <div className="bg-white p-6 rounded-2xl border border-maroon/5 shadow-luxury flex items-center space-x-4">
          <div className="p-3.5 bg-red-50 text-red-700 rounded-xl border border-red-100">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <span className="font-poppins text-[9px] uppercase tracking-wider text-maroon/40 font-bold block">Admin Notifications</span>
            <h4 className="font-playfair text-xl font-bold mt-0.5">{activeNotifs.length} Unread</h4>
            <span className="font-poppins text-[9px] text-red-600 block mt-0.5">
              Attention required
            </span>
          </div>
        </div>

      </div>

      {/* Main Grid: Pipeline and Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Stitching Pipeline Tracker */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-maroon/5 shadow-luxury space-y-6">
          <div>
            <h4 className="font-playfair text-lg font-bold text-maroon">Stitching Pipeline Tracker</h4>
            <p className="font-poppins text-[11px] text-maroon/50 mt-0.5">Current workstation allocations for active tailoring orders.</p>
          </div>

          <div className="space-y-4">
            {statuses.map(st => {
              const percentage = orders.length > 0 ? (st.count / orders.length) * 100 : 0;
              return (
                <div key={st.label} className="font-poppins text-xs">
                  <div className="flex items-center justify-between mb-1.5 font-semibold">
                    <span className="flex items-center space-x-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${st.color}`}></span>
                      <span>{st.label} Workshop</span>
                    </span>
                    <span className="text-maroon/60 font-bold">
                      {st.count} {st.count === 1 ? 'Order' : 'Orders'} ({Math.round(percentage)}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#FFF8F0]/50 h-2.5 rounded-full overflow-hidden border border-maroon/5">
                    <div 
                      className={`h-full ${st.color} rounded-full transition-all duration-1000`} 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notifications and Alert logs */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-maroon/5 shadow-luxury space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-maroon/5 pb-3">
              <h4 className="font-playfair text-base font-bold text-maroon">System Alerts</h4>
              {activeNotifs.length > 0 && (
                <span className="bg-red-700 text-gold font-poppins text-[8px] font-bold tracking-wider uppercase px-2 py-1 rounded-full">
                  {activeNotifs.length} New
                </span>
              )}
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[300px] pr-1 scrollbar-luxury">
              {notifications.length === 0 ? (
                <div className="text-center py-10 font-poppins text-xs text-maroon/40">
                  No notifications recorded.
                </div>
              ) : (
                notifications.map(notif => (
                  <div 
                    key={notif.id}
                    className={`p-3 rounded-xl border transition-all duration-300 ${
                      notif.read 
                        ? 'bg-white border-maroon/5 text-maroon/60' 
                        : 'bg-red-50/30 border-red-200/50 text-maroon font-semibold'
                    }`}
                  >
                    <div className="flex items-start justify-between space-x-2">
                      <p className="font-poppins text-[10px] leading-relaxed flex-grow">
                        {notif.message}
                      </p>
                      {!notif.read && (
                        <button
                          onClick={() => markNotificationRead(notif.id)}
                          className="text-gold hover:text-maroon p-0.5 hover:bg-gold/15 rounded transition-all cursor-pointer"
                          title="Mark as Read"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <span className="font-poppins text-[8px] text-maroon/40 block mt-1.5">
                      {new Date(notif.created_at).toLocaleDateString()} at {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <Link
            href="/admin/orders"
            className="w-full text-center font-poppins text-[9px] uppercase tracking-widest font-bold bg-[#5C061E]/5 hover:bg-maroon hover:text-gold text-maroon py-3 rounded-full border border-maroon/10 hover:border-gold transition-all duration-300"
          >
            Review Stitching Queues
          </Link>
        </div>

      </div>

      {/* Dynamic Actions grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Latest Stitching Orders */}
        <div className="bg-white rounded-3xl p-6 border border-maroon/5 shadow-luxury space-y-4">
          <div className="flex items-center justify-between border-b border-maroon/5 pb-2">
            <h4 className="font-playfair text-base font-bold text-maroon">Recent Custom Orders</h4>
            <Link href="/admin/orders" className="font-poppins text-[10px] text-gold hover:underline font-bold">
              View All
            </Link>
          </div>

          <div className="space-y-3 font-poppins text-xs">
            {orders.slice(0, 3).map(order => (
              <div key={order.id} className="p-3 bg-[#FFF8F0]/20 rounded-xl border border-gold/10 flex items-center justify-between">
                <div>
                  <strong className="block text-maroon text-sm font-semibold">{order.stitching_item}</strong>
                  <span className="text-[10px] text-maroon/60">
                    Client: {order.customer_name} • Due: {order.due_date || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-gold/15 text-gold font-bold px-2.5 py-1.5 rounded-full text-[9px] uppercase border border-gold/10">
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Impending Appointments */}
        <div className="bg-white rounded-3xl p-6 border border-maroon/5 shadow-luxury space-y-4">
          <div className="flex items-center justify-between border-b border-maroon/5 pb-2">
            <h4 className="font-playfair text-base font-bold text-maroon">Upcoming Consultations</h4>
            <Link href="/admin/appointments" className="font-poppins text-[10px] text-gold hover:underline font-bold">
              Manage slots
            </Link>
          </div>

          <div className="space-y-3 font-poppins text-xs">
            {appointments.slice(0, 3).map(apt => (
              <div key={apt.id} className="p-3 bg-[#FFF8F0]/20 rounded-xl border border-gold/10 flex items-center justify-between">
                <div>
                  <strong className="block text-maroon text-sm font-semibold">{apt.type}</strong>
                  <span className="text-[10px] text-maroon/60">
                    {apt.name} • {apt.date} at {apt.time}
                  </span>
                </div>
                <span className={`px-2.5 py-1.5 rounded-full text-[9px] font-bold uppercase border ${
                  apt.status === 'Confirmed' 
                    ? 'bg-green-50 border-green-200 text-green-700' 
                    : apt.status === 'Pending'
                    ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                    : 'bg-gray-50 border-gray-200 text-gray-500'
                }`}>
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
