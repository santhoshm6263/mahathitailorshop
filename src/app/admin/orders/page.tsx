'use client';

// src/app/admin/orders/page.tsx
import React, { useState } from 'react';
import { useBoutique } from '../../providers';
import { 
  Search, ClipboardList, User, Phone, 
  Calendar, Scissors, RefreshCw, Send, 
  MessageSquare, UserPlus, Save 
} from 'lucide-react';
import { OrderStatus } from '../../../shared/types';

export default function OrderManagementPage() {
  const { 
    orders, staff, updateOrderStatus, updateOrderStaff, 
    updateOrderStitching, refreshData 
  } = useBoutique();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  // Form states for manual updates
  const [editDue, setEditDue] = useState('');
  const [editStaff, setEditStaff] = useState('');
  const [editNeck, setEditNeck] = useState('');
  const [editSleeve, setEditSleeve] = useState('');
  const [editEmbroidery, setEditEmbroidery] = useState('');
  const [editCost, setEditCost] = useState(0);
  const [editAdvance, setEditAdvance] = useState(0);
  const [editStatus, setEditStatus] = useState<OrderStatus>('Pending');

  // Trigger loading order fields on click
  const selectOrderForEditing = (order: any) => {
    setSelectedOrder(order.id);
    setEditDue(order.due_date || '');
    setEditStaff(order.staff_assigned || 'Pending Assignment');
    setEditNeck(order.neck_style || '');
    setEditSleeve(order.sleeve_style || '');
    setEditEmbroidery(order.embroidery_style || '');
    setEditCost(order.cost || 0);
    setEditAdvance(order.advance_paid || 0);
    setEditStatus(order.status || 'Pending');
  };

  // Save edits
  const handleSaveEdits = async (orderId: string) => {
    try {
      await updateOrderStitching(orderId, {
        due_date: editDue,
        staff_assigned: editStaff,
        neck_style: editNeck,
        sleeve_style: editSleeve,
        embroidery_style: editEmbroidery,
        cost: Number(editCost),
        advance_paid: Number(editAdvance),
        status: editStatus
      });
      alert('Order specifications updated successfully!');
      setSelectedOrder(null);
      refreshData();
    } catch (e) {
      console.error(e);
      alert('Error updating order fields.');
    }
  };

  // WhatsApp reminder generator
  const triggerWhatsAppReminder = (order: any) => {
    const formattedPhone = order.phone.startsWith('91') ? order.phone : `91${order.phone}`;
    const text = encodeURIComponent(
      `Hello ${order.customer_name},\n\nThis is Mahathi Tailor Shop. We are pleased to update you on your order status for your *${order.stitching_item}* (Order ID: ${order.id}).\n\n✂️ *Current Status*: ${order.status}\n📅 *Expected Delivery*: ${order.due_date || 'TBD'}\n💰 *Balance Outstanding*: ₹${(order.cost - order.advance_paid).toLocaleString('en-IN')}\n\nThank you for choosing Mahathi Tailors!`
    );
    window.open(`https://wa.me/${formattedPhone}?text=${text}`, '_blank');
  };

  // Filtering
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      order.stitching_item.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.phone.includes(search);
      
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const allStatuses: OrderStatus[] = [
    'Pending', 'Measuring', 'Cutting', 'Embroidery', 
    'Stitching', 'Trial', 'Completed'
  ];

  return (
    <div className="space-y-8 animate-fade-in text-maroon">
      
      {/* Header */}
      <div className="border-b border-maroon/5 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-playfair text-xl sm:text-2xl font-bold">Stitching Operations Queue</h3>
          <p className="font-poppins text-xs text-maroon/60">Manage ongoing cuts, client specs, assigned tailors, and workshop updates.</p>
        </div>
        <button 
          onClick={refreshData}
          className="font-poppins text-[10px] uppercase font-bold tracking-widest text-gold bg-[#5C061E]/5 hover:bg-maroon hover:text-gold px-4 py-2 rounded-full border border-maroon/10 hover:border-gold transition-all duration-300 flex items-center space-x-1 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync Workspace</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow relative">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gold" />
          <input 
            type="text" 
            placeholder="Search by client name, item details, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-maroon/10 focus:border-gold outline-none font-poppins text-xs text-maroon"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-white rounded-xl border border-maroon/10 focus:border-gold outline-none font-poppins text-xs text-maroon font-semibold"
        >
          <option value="All">All Workshop Stations</option>
          {allStatuses.map(s => (
            <option key={s} value={s}>{s} Workshop</option>
          ))}
        </select>
      </div>

      {/* Main List / Editor Panel Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 items-start">
        
        {/* Orders List Panel */}
        <div className="xl:col-span-3 space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-maroon/5 shadow-luxury">
              <ClipboardList className="w-12 h-12 text-gold/40 mx-auto mb-3" />
              <h4 className="font-playfair text-base font-bold">No Stitching Records Found</h4>
              <p className="font-poppins text-xs text-maroon/50 mt-1">Try expanding search query parameters or changing filters.</p>
            </div>
          ) : (
            filteredOrders.map(order => {
              const isEditingThis = selectedOrder === order.id;
              const outstanding = order.cost - order.advance_paid;
              return (
                <div 
                  key={order.id}
                  className={`bg-white rounded-2xl p-5 border shadow-luxury transition-all duration-300 ${
                    isEditingThis 
                      ? 'border-gold bg-gold/5' 
                      : 'border-maroon/5 hover:border-gold/40'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    
                    {/* Basic specs */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-poppins text-[9px] font-bold uppercase tracking-wider bg-maroon text-gold px-2.5 py-1 rounded-full border border-gold/15">
                          {order.id}
                        </span>
                        <span className="font-poppins text-[9px] uppercase tracking-wider font-bold text-gold">
                          Due: {order.due_date || 'N/A'}
                        </span>
                      </div>
                      
                      <h4 className="font-playfair text-base font-bold text-maroon">{order.stitching_item}</h4>
                      
                      <div className="font-poppins text-xs text-maroon/70 space-y-1">
                        <p className="flex items-center space-x-1.5">
                          <User className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                          <span>{order.customer_name} ({order.phone})</span>
                        </p>
                        <p className="flex items-center space-x-1.5">
                          <Scissors className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                          <span>Staff Assigned: <strong className="text-maroon font-semibold">{order.staff_assigned || 'Unassigned'}</strong></span>
                        </p>
                      </div>

                      {order.inspiration_image && (
                        <div className="pt-2">
                          <span className="font-poppins text-[9px] text-maroon/40 block mb-1">Uploaded Sketch Preview:</span>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={order.inspiration_image} 
                            alt="inspiration template" 
                            className="h-14 rounded-lg object-cover border border-gold/15 bg-cream hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                    </div>

                    {/* Cost Status & Controls */}
                    <div className="sm:text-right space-y-4 flex flex-col justify-between items-start sm:items-end">
                      <div className="space-y-1">
                        <div className="font-poppins text-xs">
                          <span className="text-maroon/55">Total Budget: </span>
                          <strong className="text-sm font-semibold">₹{order.cost.toLocaleString('en-IN')}</strong>
                        </div>
                        <div className="font-poppins text-[10px] text-maroon/60">
                          Paid: ₹{order.advance_paid.toLocaleString('en-IN')} • 
                          <span className={outstanding > 0 ? 'text-red-700 font-bold ml-1' : 'text-green-700 font-bold ml-1'}>
                            Bal: ₹{outstanding.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {/* Status badge */}
                        <span className="bg-[#FFF8F0]/30 border border-gold/20 text-gold font-poppins text-[9px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full">
                          {order.status}
                        </span>

                        {/* Edit specs button */}
                        <button
                          onClick={() => selectOrderForEditing(order)}
                          className="font-poppins text-[9px] uppercase tracking-widest font-bold bg-maroon text-gold px-3.5 py-2 rounded-full border border-gold hover:bg-gold hover:text-maroon transition-all cursor-pointer"
                        >
                          Modify specifications
                        </button>

                        {/* WhatsApp update */}
                        <button
                          onClick={() => triggerWhatsAppReminder(order)}
                          className="p-2 bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 rounded-full transition-all cursor-pointer"
                          title="Send update notification via WhatsApp"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected / Edit Order Detail Panel */}
        <div className="xl:col-span-2">
          {selectedOrder ? (
            <div className="bg-white rounded-3xl p-6 border border-gold/30 shadow-luxury space-y-6 lg:sticky lg:top-[120px] animate-slide-up">
              <div className="border-b border-maroon/5 pb-3">
                <h4 className="font-playfair text-lg font-bold">Edit Order Specs</h4>
                <p className="font-poppins text-[11px] text-maroon/50 uppercase tracking-widest font-semibold mt-0.5">
                  Update detail parameters for ID: {selectedOrder}
                </p>
              </div>

              {/* Form fields */}
              <div className="space-y-4 font-poppins text-xs text-maroon">
                
                {/* Due Date */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-maroon/50 mb-1.5">Due Date</label>
                  <input 
                    type="date" 
                    value={editDue}
                    onChange={(e) => setEditDue(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-maroon/10 focus:border-gold outline-none rounded-xl"
                  />
                </div>

                {/* Status selector */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-maroon/50 mb-1.5">Workshop Station Status</label>
                  <select 
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as OrderStatus)}
                    className="w-full px-3 py-2.5 bg-white border border-maroon/10 focus:border-gold outline-none rounded-xl"
                  >
                    {allStatuses.map(s => (
                      <option key={s} value={s}>{s} Workshop</option>
                    ))}
                  </select>
                </div>

                {/* Staff Assignment */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-maroon/50 mb-1.5">Assign Artisan/Staff</label>
                  <select 
                    value={editStaff}
                    onChange={(e) => setEditStaff(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-maroon/10 focus:border-gold outline-none rounded-xl"
                  >
                    <option value="Pending Assignment">Pending Assignment</option>
                    {staff.map(st => (
                      <option key={st.id} value={`${st.name} (${st.role})`}>
                        {st.name} - {st.role}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Specifications details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-maroon/50 mb-1.5">Neck Style Cut</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Royal Pot Neck"
                      value={editNeck}
                      onChange={(e) => setEditNeck(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-maroon/10 focus:border-gold outline-none rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-maroon/50 mb-1.5">Sleeve Silhouette</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Elbow length puff"
                      value={editSleeve}
                      onChange={(e) => setEditSleeve(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-maroon/10 focus:border-gold outline-none rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-maroon/50 mb-1.5">Embroidery Intricacy Pattern</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Heavy Peacock Aari Work"
                    value={editEmbroidery}
                    onChange={(e) => setEditEmbroidery(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-maroon/10 focus:border-gold outline-none rounded-xl"
                  />
                </div>

                {/* Financial edits */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-maroon/50 mb-1.5">Total Cost (₹)</label>
                    <input 
                      type="number" 
                      value={editCost}
                      onChange={(e) => setEditCost(Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-white border border-maroon/10 focus:border-gold outline-none rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-maroon/50 mb-1.5">Advance Paid (₹)</label>
                    <input 
                      type="number" 
                      value={editAdvance}
                      onChange={(e) => setEditAdvance(Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-white border border-maroon/10 focus:border-gold outline-none rounded-xl"
                    />
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t border-maroon/5">
                <button
                  onClick={() => handleSaveEdits(selectedOrder)}
                  className="flex-1 inline-flex items-center justify-center space-x-2 font-poppins text-[10px] uppercase tracking-widest font-bold bg-maroon text-gold py-3 rounded-full border border-gold hover:bg-gold hover:text-maroon transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Commit updates</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 font-poppins text-[10px] uppercase tracking-widest font-bold bg-white text-maroon py-3 rounded-full border border-maroon/20 hover:bg-maroon/5 transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-dashed border-maroon/25 text-center py-20 lg:sticky lg:top-[120px]">
              <Scissors className="w-8 h-8 text-gold/30 mx-auto mb-2 animate-bounce" />
              <h5 className="font-playfair text-sm font-bold text-maroon">Select stitching item</h5>
              <p className="font-poppins text-[10px] text-maroon/50 mt-1 max-w-[200px] mx-auto leading-relaxed">
                Click "Modify specifications" to update artisan assignments, due dates, cost outlines, and status logs.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
