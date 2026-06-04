'use client';

// src/app/admin/products/page.tsx
import React, { useState } from 'react';
import { useBoutique } from '../../providers';
import { 
  Plus, Search, ShoppingBag, DollarSign, 
  Layers, Package, Calendar, Sparkles, 
  Trash2, PlusCircle, Check, X 
} from 'lucide-react';
import { ProductCategory } from '../../../shared/types';

export default function AdminProductCatalogPage() {
  const { products, addProduct, refreshData } = useBoutique();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('designer-blouses');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [fabric, setFabric] = useState('');
  const [deliveryDays, setDeliveryDays] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState('/assets/designer-blouse.png');
  const [description, setDescription] = useState('');

  const productCategories: { value: ProductCategory; label: string }[] = [
    { value: 'designer-blouses', label: 'Designer Blouses' },
    { value: 'bridal-collections', label: 'Bridal Collections' },
    { value: 'aari-work-blouses', label: 'Aari Work Blouses' },
    { value: 'maggam-work-collections', label: 'Maggam Work Collections' },
    { value: 'ready-made-dresses', label: 'Ready-made Dresses' },
    { value: 'party-wear-dresses', label: 'Party Wear Dresses' },
    { value: 'kids-dresses', label: 'Kids Dresses' },
    { value: 'ethnic-wear', label: 'Ethnic Wear' },
    { value: 'sarees', label: 'Sarees' },
    { value: 'boutique-accessories', label: 'Boutique Accessories' }
  ];

  const mockImages = [
    { label: 'Designer Blouse Cut', url: '/assets/designer-blouse.png' },
    { label: 'Aari Detailed Stitching', url: '/assets/aari-detail.png' },
    { label: 'Bridal Wedding Lehenga', url: '/assets/hero-bridal.png' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stock) {
      alert('Please fill in Name, Price, and Stock level.');
      return;
    }

    try {
      await addProduct({
        name,
        category,
        price: Number(price),
        discount: discount ? Number(discount) : 0,
        fabric: fabric || 'Premium Silk blend',
        delivery_days: deliveryDays ? Number(deliveryDays) : 5,
        stock: Number(stock),
        image,
        images: [image],
        description: description || 'No description provided.',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Maroon Red', 'Gold Cream', 'Emerald Green']
      });

      alert('Couture Design Cataloged Successfully!');
      setIsAdding(false);
      // Reset form
      setName('');
      setCategory('designer-blouses');
      setPrice('');
      setDiscount('');
      setFabric('');
      setDeliveryDays('');
      setStock('');
      setImage('/assets/designer-blouse.png');
      setDescription('');
      
      refreshData();
    } catch (err) {
      console.error(err);
      alert('Error creating catalog entry.');
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-fade-in text-maroon">
      
      {/* Header */}
      <div className="border-b border-maroon/5 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-playfair text-xl sm:text-2xl font-bold">Couture Design Catalog</h3>
          <p className="font-poppins text-xs text-maroon/60">Publish new designs, control stock, and update fashion collections.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center space-x-2 font-poppins text-[10px] uppercase tracking-widest font-bold bg-maroon text-gold px-5 py-3 rounded-full border border-gold hover:bg-gold hover:text-maroon transition-all duration-300 cursor-pointer"
        >
          {isAdding ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          <span>{isAdding ? 'Close catalog form' : 'Publish Design'}</span>
        </button>
      </div>

      {/* Add Product Form */}
      {isAdding && (
        <form 
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/30 shadow-luxury space-y-6 animate-slide-up"
        >
          <div className="border-b border-maroon/5 pb-3">
            <h4 className="font-playfair text-lg font-bold">Publish New Boutique Design</h4>
            <p className="font-poppins text-[10px] text-maroon/40 uppercase tracking-wider font-semibold">
              Fill in specs below to showcase inside the shop catalog.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-poppins text-xs text-maroon">
            
            {/* Left Side fields */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-maroon/50 mb-1.5">Design Title / Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Zardosi Silk Bridal Blouse"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-maroon/10 focus:border-gold outline-none rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-maroon/50 mb-1.5">Collection Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ProductCategory)}
                    className="w-full px-3.5 py-2.5 bg-white border border-maroon/10 focus:border-gold outline-none rounded-xl font-semibold"
                  >
                    {productCategories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-maroon/50 mb-1.5">Fabric Composition</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Raw Kanchi Silk"
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-maroon/10 focus:border-gold outline-none rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-maroon/50 mb-1.5">Retail Price (₹) *</label>
                  <input 
                    type="number" 
                    required
                    placeholder="8500"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-maroon/10 focus:border-gold outline-none rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-maroon/50 mb-1.5">Discount Rate (%)</label>
                  <input 
                    type="number" 
                    placeholder="10"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-maroon/10 focus:border-gold outline-none rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-maroon/50 mb-1.5">In Stock Qty *</label>
                  <input 
                    type="number" 
                    required
                    placeholder="5"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-maroon/10 focus:border-gold outline-none rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-maroon/50 mb-1.5">Description Outline</label>
                <textarea 
                  rows={3}
                  placeholder="Provide details about stitching pattern, work intensity, embroidery threads, and measurements customizability..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-maroon/10 focus:border-gold outline-none rounded-xl resize-none"
                />
              </div>
            </div>

            {/* Right Side / Image Selection */}
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-maroon/50 mb-1.5">Exquisite Cover Image</label>
                
                {/* Image selections */}
                <div className="space-y-2">
                  {mockImages.map(img => (
                    <button
                      key={img.url}
                      type="button"
                      onClick={() => setImage(img.url)}
                      className={`w-full p-2 text-left rounded-xl border text-[11px] flex items-center justify-between transition-all duration-300 ${
                        image === img.url 
                          ? 'border-gold bg-[#5C061E]/5 text-maroon font-bold' 
                          : 'border-maroon/10 hover:border-gold bg-white'
                      }`}
                    >
                      <span>{img.label}</span>
                      {image === img.url && <Check className="w-3.5 h-3.5 text-gold" />}
                    </button>
                  ))}
                </div>

                <div className="mt-3">
                  <label className="block text-[9px] uppercase tracking-wider text-maroon/40 mb-1">Or Type Image URL Path</label>
                  <input 
                    type="text" 
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-maroon/10 focus:border-gold outline-none rounded-lg"
                  />
                </div>

                {/* Preview window */}
                <div className="mt-4 border border-gold/15 rounded-2xl overflow-hidden aspect-[4/3] bg-cream">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={image} 
                    alt="design template mockup" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/designer-blouse.png';
                    }}
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Submit */}
          <div className="flex space-x-3 pt-4 border-t border-maroon/5">
            <button
              type="submit"
              className="flex-grow inline-flex items-center justify-center space-x-2 font-poppins text-[10px] uppercase tracking-widest font-bold bg-maroon text-gold py-3 rounded-full border border-gold hover:bg-gold hover:text-maroon transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-gold" />
              <span>Publish Couture Design</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-6 font-poppins text-[10px] uppercase tracking-widest font-bold bg-white text-maroon py-3 rounded-full border border-maroon/20 hover:bg-maroon/5 transition-all cursor-pointer"
            >
              Discard
            </button>
          </div>
        </form>
      )}

      {/* Catalog Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow relative">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gold" />
          <input 
            type="text" 
            placeholder="Search catalog designs by keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-maroon/10 focus:border-gold outline-none font-poppins text-xs text-maroon"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-3 bg-white rounded-xl border border-maroon/10 focus:border-gold outline-none font-poppins text-xs text-maroon font-semibold"
        >
          <option value="All">All Categories</option>
          {productCategories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      {/* Product list grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProducts.map(product => {
          const outstandingStock = product.stock;
          const lowStock = outstandingStock <= 3;
          return (
            <div 
              key={product.id}
              className="bg-white rounded-2xl border border-maroon/5 overflow-hidden shadow-luxury flex flex-col justify-between group hover:border-gold/30 hover:shadow-xl transition-all duration-300"
            >
              {/* Product preview */}
              <div className="relative aspect-[4/3] bg-cream overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#5C061E]/90 text-gold border border-gold/25 font-poppins text-[8px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                  {product.category.replace(/-/g, ' ')}
                </span>
                
                {lowStock && (
                  <span className="absolute top-3 right-3 bg-red-700 text-white font-poppins text-[8px] font-bold uppercase tracking-wider px-2 py-1 rounded-full animate-pulse">
                    Low Stock ({outstandingStock})
                  </span>
                )}
              </div>

              {/* Product Details */}
              <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="font-playfair text-base font-bold text-maroon group-hover:text-gold transition-colors">
                    {product.name}
                  </h4>
                  <p className="font-poppins text-[10px] text-maroon/50 mt-1 uppercase tracking-widest font-semibold">
                    ID: {product.id} • Fabric: {product.fabric}
                  </p>
                  <p className="font-poppins text-xs text-maroon/70 mt-2 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-maroon/5 flex items-center justify-between font-poppins text-xs">
                  <div>
                    <span className="text-maroon/40 uppercase text-[9px] font-bold block">Base Price</span>
                    <strong className="text-maroon text-sm font-bold">
                      ₹{product.price.toLocaleString('en-IN')}
                    </strong>
                    {product.discount > 0 && (
                      <span className="text-red-700 text-[10px] ml-1 font-semibold">
                        (-{product.discount}%)
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-maroon/40 uppercase text-[9px] font-bold block">Stock Available</span>
                    <span className="font-semibold text-maroon">
                      {product.stock} units
                    </span>
                  </div>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
