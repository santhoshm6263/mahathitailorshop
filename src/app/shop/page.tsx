'use client';

// src/app/shop/page.tsx
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useBoutique } from '../providers';
import { Product, ProductCategory } from '../../shared/types';
import { Search, Filter, ShoppingCart, Star } from 'lucide-react';

const ShopPageContent: React.FC = () => {
  const { products, addToCart, toggleWishlist, wishlist } = useBoutique();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setActiveCategory(cat);
    }
  }, [searchParams]);

  const categories = [
    { name: 'All Collection', value: 'all' },
    { name: 'Bridal Collections', value: 'bridal-collections' },
    { name: 'Aari Work Blouses', value: 'aari-work-blouses' },
    { name: 'Designer Blouses', value: 'designer-blouses' },
    { name: 'Party Wear Dresses', value: 'party-wear-dresses' },
    { name: 'Ethnic Wear', value: 'ethnic-wear' },
    { name: 'Kids Fashion', value: 'kids-dresses' },
    { name: 'Accessories', value: 'boutique-accessories' }
  ];

  // Filtering products
  const filteredProducts = products.filter(prod => {
    const matchesCategory = activeCategory === 'all' || prod.category === activeCategory;
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prod.fabric.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCategoryChange = (val: string) => {
    setActiveCategory(val);
    const newParams = new URLSearchParams(window.location.search);
    if (val === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', val);
    }
    router.push(`/shop?${newParams.toString()}`);
  };

  return (
    <section className="py-24 bg-[#FFF8F0]/10 min-h-screen pt-[120px] animate-fade-in">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="font-poppins text-xs font-semibold tracking-[0.25em] text-gold uppercase block">
            Boutique E-commerce
          </span>
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-maroon leading-tight">
            MAHATHI TAILOR SHOP
          </h1>
          <div className="w-12 h-[2px] bg-gold mx-auto"></div>
          <p className="font-poppins text-xs sm:text-sm text-maroon/70">
            Secure custom-stitched dresses, designer fabrics, and heavy zardosi bags. Select custom fit parameters in your dashboard.
          </p>
        </div>

        {/* Filter / Search Bar */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch lg:items-center justify-between border-b border-[#5C061E]/5 pb-8 mb-12">
          
          {/* Categories Grid */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-3 lg:pb-0 scrollbar-none max-w-full">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                className={`font-poppins text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-full transition-all duration-300 whitespace-nowrap cursor-pointer border ${
                  activeCategory === cat.value 
                    ? 'bg-maroon border-maroon text-gold font-bold shadow-luxury' 
                    : 'bg-white border-[#5C061E]/10 text-maroon/80 hover:border-gold hover:text-gold'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="flex border border-[#5C061E]/10 rounded-full overflow-hidden bg-white max-w-sm w-full shadow-luxury">
            <span className="flex items-center pl-4 text-maroon/40"><Search className="w-4 h-4" /></span>
            <input 
              type="text" 
              placeholder="Search design, fabric..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs px-3 py-3.5 focus:outline-none w-full placeholder-maroon/40 text-maroon" 
            />
          </div>

        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-20 font-poppins text-xs text-maroon/40 italic">
              No products found matching your active catalog filter.
            </div>
          ) : (
            filteredProducts.map(prod => {
              const discountedPrice = prod.price * (1 - prod.discount / 100);
              const isSaved = wishlist.includes(prod.id);
              
              return (
                <div 
                  key={prod.id} 
                  className="bg-white rounded-2xl overflow-hidden border border-maroon/5 shadow-luxury hover:border-gold/30 hover:shadow-gold transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="relative h-64 overflow-hidden bg-maroon-dark">
                    <Link href={`/shop/${prod.id}`}>
                      <img 
                        src={prod.image} 
                        alt={prod.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                    </Link>
                    
                    {/* Discount Badge */}
                    {prod.discount > 0 && (
                      <span className="absolute top-4 left-4 bg-maroon text-gold font-poppins text-[9px] font-bold px-2.5 py-1.5 rounded-full border border-gold/25 z-10">
                        {prod.discount}% Off
                      </span>
                    )}

                    {/* Wishlist Toggle Button */}
                    <button 
                      onClick={() => toggleWishlist(prod.id)}
                      className={`absolute top-4 right-4 p-2 rounded-full border shadow-md transition-all duration-300 z-10 cursor-pointer ${
                        isSaved 
                          ? 'bg-gold border-gold text-maroon' 
                          : 'bg-white/80 border-white/20 text-maroon/60 hover:bg-white hover:text-maroon'
                      }`}
                    >
                      ❤️
                    </button>
                  </div>

                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[9px] font-bold text-gold uppercase tracking-wider mb-2">
                        <span>{prod.category.replace('-', ' ')}</span>
                        <span className="flex items-center text-maroon">
                          <Star className="w-2.5 h-2.5 fill-current text-gold mr-0.5" />
                          {prod.rating.toFixed(1)}
                        </span>
                      </div>

                      <Link href={`/shop/${prod.id}`}>
                        <h4 className="font-playfair text-base font-bold text-maroon hover:text-gold transition-colors leading-snug mb-2">
                          {prod.name}
                        </h4>
                      </Link>

                      <p className="font-poppins text-[10px] text-maroon/60 leading-relaxed mb-4 line-clamp-2">
                        {prod.description}
                      </p>
                    </div>

                    <div className="border-t border-[#5C061E]/5 pt-4 mt-4 flex items-center justify-between">
                      <div>
                        {prod.discount > 0 ? (
                          <div className="space-x-1.5">
                            <span className="font-playfair text-lg font-bold text-maroon">₹{discountedPrice.toLocaleString()}</span>
                            <span className="font-poppins text-[10px] text-maroon/40 line-through">₹{prod.price.toLocaleString()}</span>
                          </div>
                        ) : (
                          <span className="font-playfair text-lg font-bold text-maroon">₹{prod.price.toLocaleString()}</span>
                        )}
                      </div>

                      <button 
                        onClick={() => addToCart(prod)}
                        className="p-2.5 rounded-xl bg-[#FFF8F0]/30 hover:bg-maroon border border-maroon/10 hover:border-maroon text-maroon hover:text-gold transition-all cursor-pointer flex items-center space-x-1"
                        title="Add to bag"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span className="font-poppins text-[9px] uppercase tracking-wider font-bold">Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </section>
  );
};

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] p-20 font-playfair text-xl text-maroon">
        Loading Shop Catalog...
      </div>
    }>
      <ShopPageContent />
    </Suspense>
  );
}
