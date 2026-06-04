'use client';

// src/app/shop/[id]/page.tsx
import React, { useState, use } from 'react';
import Link from 'next/link';
import { useBoutique } from '../../providers';
import { ShoppingCart, Star, Heart, ArrowLeft, Ruler } from 'lucide-react';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = use(params);
  const { products, addToCart, toggleWishlist, wishlist } = useBoutique();
  
  const product = products.find(p => p.id === id);
  const [activeImage, setActiveImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  // Set default active image and attributes once product is loaded
  React.useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      if (product.sizes.length > 0) setSelectedSize(product.sizes[0]);
      if (product.colors.length > 0) setSelectedColor(product.colors[0]);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FDFBF7] text-center">
        <h2 className="font-playfair text-2xl font-bold text-maroon mb-4">Product Not Found</h2>
        <Link href="/shop" className="font-poppins text-xs uppercase tracking-widest font-semibold bg-maroon text-gold px-6 py-3 rounded-full border border-gold hover:bg-gold hover:text-maroon transition-all">
          Back to Shop
        </Link>
      </div>
    );
  }

  const isSaved = wishlist.includes(product.id);
  const discountedPrice = product.price * (1 - product.discount / 100);
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <section className="py-24 bg-[#FFF8F0]/10 min-h-screen pt-[120px] animate-fade-in">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 space-y-12">
        
        {/* Back Link */}
        <Link href="/shop" className="inline-flex items-center space-x-2 text-maroon hover:text-gold font-poppins text-xs font-semibold uppercase tracking-wider transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>

        {/* Product Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Images Section */}
          <div className="lg:col-span-6 space-y-4">
            <div className="aspect-square w-full rounded-3xl overflow-hidden border border-[#5C061E]/5 shadow-luxury bg-maroon-dark">
              <img 
                src={activeImage || product.image} 
                alt={product.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            
            {/* Gallery Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-none">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImage === img ? 'border-gold shadow-gold scale-95' : 'border-[#5C061E]/5 bg-[#FFF8F0]/30 hover:border-gold/30'
                    }`}
                  >
                    <img src={img} alt={`${product.name} gallery ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="space-y-2">
              <span className="font-poppins text-[10px] uppercase tracking-widest text-gold font-bold bg-[#D4AF37]/10 px-3.5 py-1.5 rounded-full border border-gold/25 inline-block">
                {product.category.replace('-', ' ')}
              </span>
              <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-maroon leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center space-x-4 pt-2">
                <span className="flex items-center text-maroon font-poppins text-xs font-semibold">
                  <Star className="w-3.5 h-3.5 fill-current text-gold mr-1" />
                  {product.rating.toFixed(1)} / 5.0
                </span>
                <span className="text-maroon/40 text-xs">•</span>
                <span className="font-poppins text-xs text-maroon/60">
                  {product.reviews.length} Client Reviews
                </span>
              </div>
            </div>

            <div className="border-y border-[#5C061E]/5 py-4">
              <div className="flex items-baseline space-x-3">
                {product.discount > 0 ? (
                  <>
                    <span className="font-playfair text-3xl font-bold text-maroon">₹{discountedPrice.toLocaleString()}</span>
                    <span className="font-poppins text-sm text-maroon/40 line-through">₹{product.price.toLocaleString()}</span>
                    <span className="font-poppins text-xs font-bold text-gold uppercase bg-gold/10 px-2 py-0.5 rounded">
                      {product.discount}% Off
                    </span>
                  </>
                ) : (
                  <span className="font-playfair text-3xl font-bold text-maroon">₹{product.price.toLocaleString()}</span>
                )}
              </div>
            </div>

            <p className="font-poppins text-sm text-maroon/80 leading-relaxed">
              {product.description}
            </p>

            {/* Specifications Card */}
            <div className="bg-[#FFF8F0]/30 rounded-2xl p-6 border border-[#5C061E]/5 space-y-3 font-poppins text-xs">
              <div className="flex justify-between border-b border-[#5C061E]/5 pb-2">
                <span className="text-maroon/60">Fabric coordinate:</span>
                <strong className="text-maroon">{product.fabric}</strong>
              </div>
              <div className="flex justify-between border-b border-[#5C061E]/5 pb-2">
                <span className="text-maroon/60">Estimated Stitching time:</span>
                <strong className="text-maroon">{product.delivery_days} Days to Atelier Slot</strong>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-maroon/60">Stitching stock:</span>
                <strong className="text-maroon">{product.stock > 0 ? `Active (${product.stock} units left)` : 'Fully booked'}</strong>
              </div>
            </div>

            {/* Size Picker */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block font-poppins text-[10px] uppercase tracking-widest text-maroon font-semibold">Select Size Profile:</label>
                  <Link href="/dashboard/measurements" className="text-gold font-poppins text-[10px] uppercase font-bold flex items-center space-x-1 hover:underline">
                    <Ruler className="w-3 h-3" />
                    <span>My Size Guide</span>
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(sz => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-4 py-2.5 rounded-xl border text-center font-poppins text-xs font-semibold cursor-pointer transition-all duration-300 ${
                        selectedSize === sz
                          ? 'bg-maroon border-maroon text-gold shadow-luxury'
                          : 'bg-white border-[#5C061E]/10 hover:border-gold text-maroon'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors Picker */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3">
                <label className="block font-poppins text-[10px] uppercase tracking-widest text-maroon font-semibold">Select Color Highlight:</label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(col => (
                    <button
                      key={col}
                      onClick={() => setSelectedColor(col)}
                      className={`px-4 py-2 rounded-xl border text-center font-poppins text-xs font-semibold cursor-pointer transition-all duration-300 ${
                        selectedColor === col
                          ? 'bg-maroon border-maroon text-gold'
                          : 'bg-white border-[#5C061E]/10 hover:border-gold text-maroon'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4 border-t border-[#5C061E]/5">
              
              {/* Qty selectors */}
              <div className="flex border border-[#5C061E]/10 rounded-full overflow-hidden bg-white items-center justify-between max-w-xs self-center">
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="px-4 py-3 text-maroon hover:bg-gold/10 font-bold text-sm cursor-pointer"
                >
                  -
                </button>
                <span className="px-4 text-maroon font-semibold text-xs">{quantity}</span>
                <button 
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="px-4 py-3 text-maroon hover:bg-gold/10 font-bold text-sm cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={() => addToCart(product, quantity)}
                className="font-poppins text-xs uppercase tracking-widest font-bold bg-maroon hover:bg-gold text-gold hover:text-maroon py-3.5 px-8 rounded-full border border-maroon hover:border-gold transition-all duration-300 flex-1 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Atelier Bag</span>
              </button>

              {/* Wishlist toggle */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 rounded-full border shadow-md transition-all duration-300 self-center cursor-pointer ${
                  isSaved 
                    ? 'bg-gold border-gold text-maroon' 
                    : 'bg-white border-[#5C061E]/10 text-maroon/60 hover:bg-white hover:text-maroon'
                }`}
              >
                ❤️
              </button>
            </div>

            {/* Custom tailored Blouse CTA link */}
            {product.category === 'aari-work-blouses' || product.category === 'designer-blouses' || product.category === 'maggam-work-collections' ? (
              <div className="bg-[#FFF8F0]/30 rounded-2xl p-6 border border-gold/15 text-center mt-6">
                <span className="text-xl block mb-2">✂</span>
                <h4 className="font-playfair text-base font-bold text-maroon">Prefer Bespoke Measurements?</h4>
                <p className="font-poppins text-[10px] text-maroon/60 leading-relaxed mb-4">
                  Configure this design using our step-by-step interactive customizer tool.
                </p>
                <Link href="/custom-tailoring" className="font-poppins text-[9px] uppercase tracking-widest font-bold bg-gold text-maroon px-5 py-2.5 rounded-full hover:bg-maroon hover:text-gold border border-gold transition-all">
                  Design Online Now
                </Link>
              </div>
            ) : null}

          </div>
        </div>

        {/* Client Reviews List */}
        <div className="border-t border-[#5C061E]/5 pt-12 space-y-6">
          <h3 className="font-playfair text-xl sm:text-2xl font-bold text-maroon">Client Reviews</h3>
          
          {product.reviews.length === 0 ? (
            <p className="font-poppins text-xs text-maroon/50 italic">No reviews submitted for this garment style yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.reviews.map((rev, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 border border-[#5C061E]/5 shadow-luxury space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="font-poppins text-maroon">{rev.user}</span>
                    <span className="flex items-center text-[#D4AF37]">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </span>
                  </div>
                  <p className="font-poppins text-xs text-maroon/70 leading-relaxed">
                    &quot;{rev.text}&quot;
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-[#5C061E]/5 pt-12 space-y-6">
            <h3 className="font-playfair text-xl sm:text-2xl font-bold text-maroon">Related Creations</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(rel => (
                <div key={rel.id} className="bg-white rounded-2xl overflow-hidden border border-[#5C061E]/5 shadow-luxury flex flex-col justify-between group">
                  <div className="relative h-48 overflow-hidden bg-maroon-dark">
                    <Link href={`/shop/${rel.id}`}>
                      <img src={rel.image} alt={rel.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </Link>
                  </div>
                  <div className="p-4 space-y-2">
                    <Link href={`/shop/${rel.id}`}>
                      <h4 className="font-playfair text-sm font-bold text-maroon hover:text-gold transition-colors line-clamp-1">{rel.name}</h4>
                    </Link>
                    <span className="font-playfair text-sm font-bold text-maroon/70">₹{rel.price.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
