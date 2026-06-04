'use client';

// src/app/dashboard/wishlist/page.tsx
import React from 'react';
import Link from 'next/link';
import { useBoutique } from '../../providers';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, products, toggleWishlist, addToCart } = useBoutique();

  // Find products that match wishlist IDs
  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-maroon/5 shadow-luxury space-y-8 animate-fade-in">
      <div className="border-b border-maroon/5 pb-4 flex items-center justify-between">
        <div>
          <h3 className="font-playfair text-xl sm:text-2xl font-bold text-maroon">My Saved Wishlist</h3>
          <p className="font-poppins text-xs text-maroon/60">Your handpicked premium selections and designer favorites.</p>
        </div>
        <span className="bg-gold/10 text-gold font-poppins text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-gold/20">
          {wishlistProducts.length} {wishlistProducts.length === 1 ? 'Item' : 'Items'}
        </span>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-16 px-4 space-y-6">
          <div className="w-16 h-16 bg-[#FFF8F0]/50 border border-gold/15 rounded-full flex items-center justify-center mx-auto text-gold/60">
            <Heart className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h4 className="font-playfair text-lg font-bold text-maroon">Your Wishlist is Empty</h4>
            <p className="font-poppins text-xs text-maroon/50 max-w-sm mx-auto leading-relaxed">
              Explore our couture lookbooks, designer blouses, and luxury ready-to-wear collections to save your favorites.
            </p>
          </div>
          <Link 
            href="/shop" 
            className="inline-flex items-center space-x-2 font-poppins text-[10px] uppercase tracking-widest font-bold bg-maroon text-gold px-6 py-3 rounded-full border border-gold hover:bg-gold hover:text-maroon transition-all duration-300"
          >
            <span>Browse Collection</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {wishlistProducts.map(product => {
            const hasDiscount = product.discount > 0;
            const finalPrice = hasDiscount 
              ? product.price - (product.price * product.discount / 100) 
              : product.price;

            return (
              <div 
                key={product.id}
                className="group bg-white rounded-2xl border border-maroon/5 overflow-hidden hover:border-gold/30 hover:shadow-luxury transition-all duration-500 flex flex-col justify-between"
              >
                {/* Product Image and Meta */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {hasDiscount && (
                    <span className="absolute top-3 left-3 bg-red-800 text-gold font-poppins text-[9px] font-bold tracking-widest uppercase px-2.5 py-1.5 rounded-full border border-gold/35">
                      -{product.discount}% OFF
                    </span>
                  )}
                  <button 
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 rounded-full text-red-700 hover:text-red-950 shadow-md transition-all hover:scale-110 cursor-pointer"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div>
                    <span className="font-poppins text-[9px] uppercase tracking-wider text-gold font-bold">
                      {product.category.replace(/-/g, ' ')}
                    </span>
                    <h4 className="font-playfair text-base font-bold text-maroon mt-1 line-clamp-1 group-hover:text-gold transition-colors duration-300">
                      <Link href={`/shop/${product.id}`}>{product.name}</Link>
                    </h4>
                    <p className="font-poppins text-[11px] text-maroon/60 mt-1.5 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-maroon/5">
                    {/* Price */}
                    <div className="font-playfair text-sm font-bold text-maroon">
                      {hasDiscount ? (
                        <div className="flex items-center space-x-2">
                          <span>₹{finalPrice.toLocaleString('en-IN')}</span>
                          <span className="line-through text-maroon/40 text-xs font-normal">₹{product.price.toLocaleString('en-IN')}</span>
                        </div>
                      ) : (
                        <span>₹{product.price.toLocaleString('en-IN')}</span>
                      )}
                    </div>

                    {/* Quick Add To Cart */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="inline-flex items-center space-x-2 font-poppins text-[9px] uppercase tracking-widest font-bold bg-[#5C061E]/5 hover:bg-maroon hover:text-gold text-maroon px-4 py-2.5 rounded-full border border-maroon/10 hover:border-gold transition-all duration-300 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Bag</span>
                    </button>
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
