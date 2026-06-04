'use client';

// src/app/dashboard/orders/page.tsx
import React from 'react';
import { useBoutique } from '../../providers';
import { OrderStatus } from '../../../shared/types';
import { ClipboardList, Calendar, CheckCircle } from 'lucide-react';

export default function OrderHistoryTab() {
  const { orders, currentUser } = useBoutique();

  if (!currentUser) return null;

  // Filter orders matching this customer's phone or customer ID
  const customerOrders = orders.filter(
    ord => ord.customer_id === currentUser.id || ord.phone === currentUser.phone
  );

  const statusSteps: OrderStatus[] = [
    'Pending', 'Measuring', 'Cutting', 'Embroidery', 'Stitching', 'Trial', 'Completed'
  ];

  const getStepIndex = (status: OrderStatus) => {
    return statusSteps.indexOf(status);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-maroon/5 shadow-luxury space-y-8 animate-fade-in text-maroon">
      <div className="border-b border-maroon/5 pb-4 flex items-center justify-between">
        <div>
          <h3 className="font-playfair text-xl sm:text-2xl font-bold">Stitching Order History</h3>
          <p className="font-poppins text-xs text-maroon/60">Trace your active garments and delivery targets.</p>
        </div>
        <ClipboardList className="w-8 h-8 text-gold" />
      </div>

      {customerOrders.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <span className="text-4xl block">📋</span>
          <h4 className="font-playfair text-lg font-bold">No Orders Logged</h4>
          <p className="font-poppins text-xs text-maroon/50 max-w-xs mx-auto">
            You haven&apos;t placed any custom design or product stitching orders yet.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {customerOrders.map(order => {
            const currentStepIdx = getStepIndex(order.status);
            
            return (
              <div 
                key={order.id} 
                className="bg-[#FFF8F0]/30 rounded-3xl p-6 border border-maroon/5 space-y-6 shadow-sm hover:shadow-md transition-shadow"
              >
                
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-maroon/5 pb-4 font-poppins text-xs">
                  <div>
                    <span className="text-maroon/40 text-[9px] uppercase block font-bold">Order Reference</span>
                    <strong className="text-sm font-semibold">{order.id}</strong>
                  </div>
                  <div>
                    <span className="text-maroon/40 text-[9px] uppercase block font-bold text-left sm:text-right">Order Date</span>
                    <strong className="text-maroon">{order.order_date}</strong>
                  </div>
                  <div>
                    <span className="text-maroon/40 text-[9px] uppercase block font-bold text-left sm:text-right">Due Target Date</span>
                    <strong className="text-gold font-bold">{order.due_date || 'TBD'}</strong>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-maroon/40 text-[9px] uppercase block font-bold">Stitching Cost</span>
                    <strong className="text-maroon text-sm font-bold">₹{order.cost.toLocaleString()}</strong>
                  </div>
                </div>

                {/* Garment details */}
                <div className="flex flex-col md:flex-row gap-6">
                  {order.inspiration_image && (
                    <div className="w-24 h-24 rounded-xl overflow-hidden border border-gold/25 bg-maroon-dark flex-shrink-0">
                      <img src={order.inspiration_image} alt={order.stitching_item} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="space-y-2 font-poppins text-xs">
                    <h4 className="font-playfair text-base font-bold text-maroon">{order.stitching_item}</h4>
                    <p className="text-maroon/70">
                      <strong>Silhouette parameters:</strong> {order.neck_style ? `${order.neck_style} + ` : ''} {order.sleeve_style || 'Standard Sleeves'}
                    </p>
                    {order.embroidery_style && (
                      <p className="text-maroon/70"><strong>Embroidery intensity:</strong> {order.embroidery_style}</p>
                    )}
                    {order.fabric_notes && (
                      <p className="text-maroon/50 leading-relaxed max-w-xl bg-white p-3 rounded-xl border border-maroon/5 italic">
                        {order.fabric_notes}
                      </p>
                    )}
                    {order.staff_assigned && (
                      <p className="text-gold font-bold text-[10px] uppercase tracking-wide">
                        👤 Assigned master: {order.staff_assigned}
                      </p>
                    )}
                  </div>
                </div>

                {/* Step status tracker */}
                <div className="border-t border-maroon/5 pt-6 space-y-4">
                  <span className="block font-poppins text-[10px] uppercase tracking-widest font-semibold">Production Status:</span>
                  
                  {/* Progress Line */}
                  <div className="relative pt-2">
                    <div className="absolute top-[21px] left-3 right-3 h-[2px] bg-maroon/10"></div>
                    <div 
                      className="absolute top-[21px] left-3 h-[2px] bg-gold transition-all duration-500" 
                      style={{ width: `${(currentStepIdx / (statusSteps.length - 1)) * 100}%` }}
                    ></div>
                    
                    <div className="flex justify-between items-center relative">
                      {statusSteps.map((step, idx) => {
                        const isCompleted = idx < currentStepIdx;
                        const isActive = idx === currentStepIdx;
                        
                        return (
                          <div key={step} className="flex flex-col items-center">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center border font-poppins text-[10px] font-bold z-10 transition-all duration-300 ${
                              isCompleted 
                                ? 'bg-gold border-gold text-maroon' 
                                : isActive 
                                  ? 'bg-maroon border-maroon text-gold shadow-luxury scale-110'
                                  : 'bg-white border-maroon/10 text-maroon/40'
                            }`}>
                              {isCompleted ? '✓' : idx + 1}
                            </div>
                            <span className={`text-[8px] uppercase tracking-wide font-bold mt-2 hidden sm:block ${
                              isActive ? 'text-gold' : isCompleted ? 'text-maroon' : 'text-maroon/40'
                            }`}>
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
