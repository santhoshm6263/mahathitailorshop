'use client';

// src/features/CartDrawer/index.tsx
import React from 'react';
import Link from 'next/link';
import { useBoutique } from '../../app/providers';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateCartQty } = useBoutique();

  if (!isOpen) return null;

  const total = cart.reduce((sum, item) => {
    const discountedPrice = item.product.price * (1 - item.product.discount / 100);
    return sum + discountedPrice * item.qty;
  }, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 bg-maroon-dark/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-luxury border-l border-gold/10 overflow-y-scroll">
            
            {/* Header */}
            <div className="p-6 bg-maroon text-white flex items-center justify-between border-b border-gold/15 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-maroon-light via-maroon to-maroon-dark">
              <div>
                <h3 className="font-playfair text-xl font-bold text-gold">Atelier Bag</h3>
                <p className="font-poppins text-[9px] uppercase tracking-widest text-white/70">Your curated style selects</p>
              </div>
              <button 
                onClick={onClose}
                className="text-gold hover:text-white p-2 text-xl font-bold font-poppins cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <span className="text-4xl block animate-bounce-soft">👜</span>
                  <h4 className="font-playfair text-lg font-bold text-maroon">Your Bag is Empty</h4>
                  <p className="font-poppins text-xs text-maroon/60 max-w-xs">
                    Explore our custom tailoring fabrics and ready-made ethnic boutique selections.
                  </p>
                  <Link 
                    href="/shop" 
                    onClick={onClose}
                    className="font-poppins text-[10px] uppercase tracking-widest font-bold text-gold bg-maroon px-6 py-3 rounded-full hover:bg-gold hover:text-maroon transition-all cursor-pointer"
                  >
                    Go to Shop →
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map(item => {
                    const price = item.product.price;
                    const discountedPrice = price * (1 - item.product.discount / 100);
                    return (
                      <div key={item.product.id} className="flex py-6 border-b border-[#5C061E]/5 items-center justify-between">
                        
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-gold/25">
                          <img 
                            src={item.product.image} 
                            alt={item.product.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>

                        <div className="ml-4 flex-1 flex flex-col">
                          <div>
                            <div className="flex justify-between text-sm font-semibold text-maroon">
                              <h5 className="font-playfair text-sm font-bold leading-tight">{item.product.name}</h5>
                              <p className="ml-4 font-poppins text-xs">
                                ₹{discountedPrice.toLocaleString()}
                              </p>
                            </div>
                            <p className="mt-1 text-[10px] text-gold font-poppins uppercase tracking-wider">{item.product.category.replace('-', ' ')}</p>
                          </div>
                          
                          <div className="flex-1 flex items-end justify-between text-xs pt-4">
                            <div className="flex border border-[#5C061E]/10 rounded-full bg-[#FFF8F0]/30 overflow-hidden items-center">
                              <button 
                                onClick={() => updateCartQty(item.product.id, item.qty - 1)}
                                className="px-2.5 py-1 text-maroon hover:bg-gold/10 font-bold cursor-pointer"
                              >
                                -
                              </button>
                              <span className="px-2 text-maroon font-semibold">{item.qty}</span>
                              <button 
                                onClick={() => updateCartQty(item.product.id, item.qty + 1)}
                                className="px-2.5 py-1 text-maroon hover:bg-gold/10 font-bold cursor-pointer"
                              >
                                +
                              </button>
                            </div>

                            <button 
                              type="button" 
                              onClick={() => removeFromCart(item.product.id)}
                              className="font-poppins text-[10px] uppercase font-bold text-red-700 hover:text-red-900 cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {cart.length > 0 && (
              <div className="border-t border-[#5C061E]/10 py-6 px-4 sm:px-6 bg-[#FFF8F0]/40">
                <div className="flex justify-between text-base font-bold text-maroon">
                  <span className="font-poppins text-xs font-semibold">Subtotal:</span>
                  <span className="font-playfair text-2xl font-bold">₹{total.toLocaleString()}</span>
                </div>
                <p className="mt-1 text-[10px] text-maroon/50 font-poppins">
                  Shipping, customized fitting, and GST calculated at checkout.
                </p>
                <div className="mt-6">
                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className="flex justify-center items-center px-6 py-4 border border-transparent rounded-full shadow-luxury text-xs font-poppins font-bold uppercase tracking-widest text-maroon bg-gold hover:bg-white hover:text-maroon transition-all cursor-pointer"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
                <div className="mt-6 flex justify-center text-center text-xs text-maroon/50 font-poppins">
                  <p>
                    or{' '}
                    <button
                      type="button"
                      className="text-gold font-bold hover:text-maroon transition-colors cursor-pointer"
                      onClick={onClose}
                    >
                      Continue Shopping<span aria-hidden="true"> &rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
export default CartDrawer;
