'use client';

// src/app/cart/page.tsx
import React from 'react';
import Link from 'next/link';
import { useBoutique } from '../providers';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateCartQty } = useBoutique();

  const total = cart.reduce((sum, item) => {
    const discountedPrice = item.product.price * (1 - item.product.discount / 100);
    return sum + discountedPrice * item.qty;
  }, 0);

  return (
    <section className="py-24 bg-[#FFF8F0]/10 min-h-screen pt-[120px] animate-fade-in text-maroon">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <span className="font-poppins text-xs font-semibold tracking-[0.25em] text-gold uppercase block">
            Your Selection
          </span>
          <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-maroon leading-tight">
            Atelier Selection Bag
          </h1>
          <div className="w-12 h-[2px] bg-gold mx-auto"></div>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-maroon/5 shadow-luxury">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-6">
              <span className="text-5xl block">👜</span>
              <h3 className="font-playfair text-xl font-bold">Your Bag is Empty</h3>
              <p className="font-poppins text-xs text-maroon/60 max-w-xs mx-auto">
                Explore our catalog for designer blouses, heavy Aari bridal works, and luxury boutique coordinates.
              </p>
              <Link href="/shop" className="font-poppins text-xs uppercase tracking-widest font-bold bg-[#D4AF37] text-maroon px-8 py-3.5 rounded-full border border-gold hover:bg-maroon hover:text-gold transition-all duration-300 inline-block cursor-pointer">
                Go to Shop
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="divide-y divide-maroon/5">
                {cart.map(item => {
                  const price = item.product.price;
                  const discountedPrice = price * (1 - item.product.discount / 100);
                  
                  return (
                    <div key={item.product.id} className="flex flex-col sm:flex-row py-6 items-center justify-between gap-6">
                      
                      <div className="flex items-center space-x-4 w-full sm:w-auto">
                        <img src={item.product.image} className="w-20 h-20 object-cover rounded-xl border border-gold/20" alt={item.product.name} />
                        <div>
                          <h4 className="font-playfair text-base font-bold">{item.product.name}</h4>
                          <span className="font-poppins text-[10px] text-gold uppercase tracking-wider block">{item.product.category.replace('-', ' ')}</span>
                          <span className="font-poppins text-[10px] text-maroon/40 block mt-1">Fabric: {item.product.fabric}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between w-full sm:w-auto gap-12">
                        {/* Qty increment */}
                        <div className="flex border border-[#5C061E]/10 rounded-full bg-[#FFF8F0]/30 overflow-hidden items-center">
                          <button 
                            onClick={() => updateCartQty(item.product.id, item.qty - 1)}
                            className="px-3 py-1 text-maroon hover:bg-gold/10 font-bold cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-2 text-maroon font-semibold text-xs">{item.qty}</span>
                          <button 
                            onClick={() => updateCartQty(item.product.id, item.qty + 1)}
                            className="px-3 py-1 text-maroon hover:bg-gold/10 font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="font-playfair text-lg font-bold block">₹{(discountedPrice * item.qty).toLocaleString()}</span>
                          {item.product.discount > 0 && (
                            <span className="font-poppins text-[10px] text-maroon/40 line-through">₹{(item.product.price * item.qty).toLocaleString()}</span>
                          )}
                        </div>

                        <button 
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-700 hover:text-red-950 font-poppins text-xs font-semibold cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Subtotal */}
              <div className="border-t border-[#5C061E]/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <span className="font-poppins text-xs text-maroon/60">Estimated Total:</span>
                  <span className="font-playfair text-3xl font-bold block mt-1">₹{total.toLocaleString()}</span>
                </div>
                <Link href="/checkout" className="font-poppins text-xs uppercase tracking-widest font-bold bg-gold hover:bg-maroon hover:text-gold text-maroon py-4 px-8 rounded-full border border-gold transition-all duration-300 flex items-center space-x-1.5 cursor-pointer">
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          )}
        </div>

      </div>
    </section>
  );
}
