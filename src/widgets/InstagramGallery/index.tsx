'use client';

// src/widgets/InstagramGallery/index.tsx
import React, { useState } from 'react';
import { useBoutique } from '../../app/providers';
import { GalleryItem } from '../../shared/types';
import { Heart, ZoomIn, MessageSquare } from 'lucide-react';

export const InstagramGallery: React.FC = () => {
  const { gallery, likeGalleryItem } = useBoutique();
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const handleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    likeGalleryItem(id);
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="font-poppins text-xs font-semibold tracking-[0.2em] text-gold uppercase block">Visual lookbook</span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-maroon">Our Studio Gallery</h2>
          <div className="w-12 h-[2px] bg-gold mx-auto"></div>
        </div>
        
        <div className="masonry-grid w-full">
          {gallery.map(item => (
            <div 
              key={item.id}
              onClick={() => setLightbox(item)}
              className="masonry-item group relative bg-cream rounded-2xl overflow-hidden border border-maroon/5 shadow-luxury hover:shadow-gold transition-all duration-300 cursor-pointer"
            >
              <img src={item.image} alt={item.title} className="w-full h-auto object-cover select-none pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-maroon/90 via-maroon/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                <span className="font-poppins text-[9px] uppercase tracking-widest text-gold font-bold mb-1">{item.category}</span>
                <h4 className="font-playfair text-lg text-white mb-4">{item.title}</h4>
                <div className="flex items-center justify-between border-t border-white/10 pt-3">
                  <button 
                    onClick={(e) => handleLike(e, item.id)} 
                    className="flex items-center space-x-1.5 text-gold hover:text-white transition-colors cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span className="font-poppins text-[10px] font-semibold">{item.likes} Likes</span>
                  </button>
                  <span className="font-poppins text-[9px] text-white/50 flex items-center space-x-1">
                    <span>View Details</span>
                    <ZoomIn className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightbox && (
        <div 
          className="fixed inset-0 bg-maroon-dark/95 z-50 flex items-center justify-center p-4 animate-fade-in" 
          onClick={() => setLightbox(null)}
        >
          <button 
            className="absolute top-6 right-6 text-gold hover:text-white text-3xl font-bold font-poppins cursor-pointer" 
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>
          
          <div 
            className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row border border-gold/20 shadow-glow" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="md:w-3/5 bg-black h-[300px] md:h-auto">
              <img src={lightbox.image} alt={lightbox.title} className="w-full h-full object-cover" />
            </div>
            
            <div className="md:w-2/5 p-8 flex flex-col justify-between bg-cream-light text-maroon">
              <div className="space-y-6">
                <div>
                  <span className="font-poppins text-[9px] uppercase tracking-widest text-gold font-bold bg-gold/10 px-3 py-1.5 rounded-full border border-gold/25 inline-block mb-3">
                    {lightbox.category}
                  </span>
                  <h3 className="font-playfair text-2xl font-bold leading-tight">{lightbox.title}</h3>
                </div>
                <div className="w-10 h-[1px] bg-gold"></div>
                <p className="font-poppins text-xs text-maroon/70 leading-relaxed">
                  Each bridal backneck is hand-sketched on sheer silk patterns, sewn meticulously with metallic zari needles.
                </p>
              </div>
              
              <div className="border-t border-maroon/10 pt-6 mt-8 flex items-center justify-between">
                <button 
                  onClick={(e) => handleLike(e, lightbox.id)} 
                  className="flex items-center space-x-2 text-maroon hover:text-gold transition-colors cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-current text-gold" />
                  <span className="font-poppins text-xs font-semibold">{lightbox.likes} Likes</span>
                </button>
                <a 
                  href={`https://wa.me/919347001303?text=${encodeURIComponent(`Hello! I am enquiring about stitching design: "${lightbox.title}"`)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-poppins text-[10px] uppercase font-bold tracking-widest bg-gold text-maroon px-5 py-2.5 rounded-full border border-gold hover:bg-maroon hover:text-gold transition-all flex items-center space-x-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Consult</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
export default InstagramGallery;
