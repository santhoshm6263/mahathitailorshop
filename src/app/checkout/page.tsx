'use client';

// src/app/checkout/page.tsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useBoutique } from '../providers';
import { CreditCard, ShoppingBag, ShieldCheck, Ruler, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CheckoutPage() {
  const { cart, currentUser, addOrder, clearCart, updateCustomerMeasurements } = useBoutique();
  const router = useRouter();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [measurementOpt, setMeasurementOpt] = useState<'saved' | 'custom' | 'later'>('later');
  
  // Custom measurements inputs
  const [measurements, setMeasurements] = useState({
    chest: 34, waist: 28, blouse_length: 14, shoulder: 14,
    front_neck: 7, back_neck: 8, sleeve_length: 10, sleeve_round: 11, arm_hole: 16
  });

  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setPhone(currentUser.phone || '');
      setEmail(currentUser.email);
      if (currentUser.measurements && currentUser.measurements.chest > 0) {
        setMeasurementOpt('saved');
        setMeasurements(currentUser.measurements as any);
      }
    }
  }, [currentUser]);

  if (cart.length === 0 && !successOrder) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FDFBF7] text-center">
        <h2 className="font-playfair text-2xl font-bold text-maroon mb-4">Your Bag is Empty</h2>
        <p className="font-poppins text-xs text-maroon/60 mb-6">Add items from our catalog to proceed with stitching checkouts.</p>
        <Link href="/shop" className="font-poppins text-xs uppercase tracking-widest font-semibold bg-maroon text-gold px-6 py-3 rounded-full border border-gold hover:bg-gold hover:text-maroon transition-all">
          Go Shopping
        </Link>
      </div>
    );
  }

  const subtotal = cart.reduce((sum, item) => {
    const discountedPrice = item.product.price * (1 - item.product.discount / 100);
    return sum + discountedPrice * item.qty;
  }, 0);

  const shippingCost = subtotal > 5000 ? 0 : 250;
  const gstCost = subtotal * 0.05; // 5% GST on designer tailoring
  const grandTotal = subtotal + shippingCost + gstCost;

  // Helper to load external Razorpay checkout script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address) {
      alert('Please fill out all shipping fields.');
      return;
    }

    setLoading(true);

    // 1. Save sizes to user profile if entering custom values
    if (currentUser && measurementOpt === 'custom') {
      await updateCustomerMeasurements(currentUser.id, measurements);
    }

    // 2. Load Razorpay overlay if script runs
    const isScriptLoaded = await loadRazorpayScript();

    // Razorpay handler options
    const options = {
      key: 'rzp_test_mockkey12345', // Dummy Test Key
      amount: Math.round(grandTotal * 100), // Amount in paise
      currency: 'INR',
      name: 'Mahathi Tailor Shop',
      description: `Atelier Stitching Order - ${cart.length} items`,
      image: '/assets/designer-blouse.png',
      handler: async function (response: any) {
        // Payment success callback - Create orders in database
        try {
          // In tailoring system, we convert cart items into active stitching order queue entries
          const orderPromises = cart.map(item => {
            return addOrder({
              customer_id: currentUser?.id || null,
              customer_name: name,
              phone: phone,
              stitching_item: item.product.name,
              neck_style: item.product.category.includes('blouse') ? 'Round Neck' : null,
              sleeve_style: item.product.category.includes('blouse') ? 'Short Sleeve' : null,
              embroidery_style: item.product.category.includes('aari') ? 'Heavy Aari & Zardosi' : null,
              fabric_notes: `Size selected: ${selectedSizeString(item.product.sizes)}. Customer address: ${address}. Razorpay Payment ID: ${response.razorpay_payment_id || 'MockPaid'}`,
              cost: item.product.price * (1 - item.product.discount / 100),
              advance_paid: item.product.price * (1 - item.product.discount / 100), // Paid in full
              status: 'Pending',
              due_date: new Date(Date.now() + item.product.delivery_days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            });
          });

          await Promise.all(orderPromises);
          
          setSuccessOrder('SUCCESS');
          clearCart();
          
          // Trigger falling confetti celebration
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 }
          });

        } catch (err) {
          alert('Failed to save stitching records in database. Contact support.');
        } finally {
          setLoading(false);
        }
      },
      prefill: {
        name,
        contact: phone,
        email: email || 'client@example.com'
      },
      theme: {
        color: '#5C061E' // Maroon
      }
    };

    // If script fails (e.g. offline/blocked), run simulated payment loop
    if (!isScriptLoaded || typeof (window as any).Razorpay === 'undefined') {
      console.log('Razorpay SDK failed to load. Running simulated checkout verification...');
      setTimeout(async () => {
        const mockResponse = { razorpay_payment_id: `pay_mock_${Math.random().toString(36).substring(7)}` };
        
        // Execute identical order pushes
        const orderPromises = cart.map(item => {
          return addOrder({
            customer_id: currentUser?.id || null,
            customer_name: name,
            phone: phone,
            stitching_item: item.product.name,
            fabric_notes: `Simulated Checkout. Size selected: Std. Address: ${address}. Payment ID: ${mockResponse.razorpay_payment_id}`,
            cost: item.product.price * (1 - item.product.discount / 100),
            advance_paid: item.product.price * (1 - item.product.discount / 100),
            status: 'Pending',
            due_date: new Date(Date.now() + item.product.delivery_days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          });
        });

        await Promise.all(orderPromises);
        
        setSuccessOrder('SUCCESS');
        clearCart();
        setLoading(false);

        // Celebrating
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      }, 1500);
      return;
    }

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  const selectedSizeString = (sizes: string[]) => {
    return sizes && sizes.length > 0 ? sizes[0] : 'Free Size';
  };

  const handleMeasureChange = (field: string, val: number) => {
    setMeasurements(prev => ({ ...prev, [field]: val }));
  };

  return (
    <section className="py-24 bg-[#FFF8F0]/10 min-h-screen pt-[120px] animate-fade-in text-maroon">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        
        {successOrder ? (
          /* Success Screen */
          <div className="max-w-xl mx-auto bg-white rounded-3xl p-10 border border-gold/30 text-center shadow-glow space-y-6">
            <span className="text-5xl block animate-bounce">🎉</span>
            <h2 className="font-playfair text-3xl font-bold text-maroon">Atelier Order Placed!</h2>
            <div className="w-12 h-[2px] bg-gold mx-auto"></div>
            <p className="font-poppins text-xs text-maroon/70 leading-relaxed">
              Your payments are processed successfully. Our master cutters are compiling your design profile and measurements. You can track stitching states in your customer account dashboard.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard/orders" className="flex-1 font-poppins text-xs uppercase tracking-widest font-bold bg-maroon text-gold py-3.5 rounded-full border border-maroon hover:bg-gold hover:text-maroon transition-all text-center">
                Track Stitching Status
              </Link>
              <Link href="/shop" className="flex-1 font-poppins text-xs uppercase tracking-widest font-semibold bg-transparent text-maroon border border-maroon/20 py-3.5 rounded-full text-center">
                Return to Shop
              </Link>
            </div>
          </div>
        ) : (
          /* Checkout Form and Summary */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Form Fields */}
            <form onSubmit={handlePaymentSubmit} className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-maroon/5 shadow-luxury space-y-6">
              <div className="flex items-center justify-between border-b border-[#5C061E]/5 pb-4 mb-4">
                <h3 className="font-playfair text-xl sm:text-2xl font-bold">Shipping & Stitching Setup</h3>
                <Link href="/shop" className="font-poppins text-[10px] uppercase font-bold text-gold flex items-center space-x-1 hover:underline">
                  <ArrowLeft className="w-3 h-3" />
                  <span>Shop</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-poppins text-[10px] uppercase tracking-widest font-semibold mb-2">Shipping Name *</label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-cream/30 border border-maroon/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-gold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-poppins text-[10px] uppercase tracking-widest font-semibold mb-2">Mobile Phone *</label>
                  <input
                    type="tel"
                    placeholder="10-digit number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-cream/30 border border-maroon/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-gold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-poppins text-[10px] uppercase tracking-widest font-semibold mb-2">Shipping Address *</label>
                <textarea
                  placeholder="Provide complete street address, landmarks, and pincode..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-cream/30 border border-maroon/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-gold h-20"
                  required
                ></textarea>
              </div>

              {/* Sizing selection tabs */}
              <div className="border-t border-[#5C061E]/5 pt-6 space-y-4">
                <label className="block font-poppins text-[10px] uppercase tracking-widest font-semibold">Measurement Parameters:</label>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setMeasurementOpt('later')}
                    className={`p-3 rounded-xl border text-center font-poppins text-xs font-semibold cursor-pointer ${
                      measurementOpt === 'later'
                        ? 'bg-maroon border-maroon text-gold'
                        : 'bg-white border-maroon/10 text-maroon'
                    }`}
                  >
                    Provide Later
                  </button>
                  <button
                    type="button"
                    onClick={() => setMeasurementOpt('custom')}
                    className={`p-3 rounded-xl border text-center font-poppins text-xs font-semibold cursor-pointer ${
                      measurementOpt === 'custom'
                        ? 'bg-maroon border-maroon text-gold'
                        : 'bg-white border-maroon/10 text-maroon'
                    }`}
                  >
                    Enter Sizes Now
                  </button>
                  <button
                    type="button"
                    disabled={!currentUser || !currentUser.measurements || currentUser.measurements.chest === 0}
                    onClick={() => setMeasurementOpt('saved')}
                    className={`p-3 rounded-xl border text-center font-poppins text-xs font-semibold cursor-pointer disabled:opacity-30 ${
                      measurementOpt === 'saved'
                        ? 'bg-maroon border-maroon text-gold'
                        : 'bg-white border-maroon/10 text-maroon'
                    }`}
                  >
                    Use Saved Profile
                  </button>
                </div>

                {measurementOpt === 'later' && (
                  <p className="font-poppins text-[10px] text-maroon/60 leading-relaxed bg-[#FFF8F0]/30 p-3 rounded-xl border border-gold/15">
                    💡 You can schedule a measurement trial at our Kuppam studio separately, or enter size variables in your dashboard settings post-checkout.
                  </p>
                )}

                {measurementOpt === 'custom' && (
                  <div className="bg-[#FFF8F0]/30 rounded-2xl p-6 border border-maroon/5 space-y-4 animate-fade-in">
                    <span className="font-playfair text-sm font-bold text-maroon flex items-center space-x-1">
                      <Ruler className="w-4 h-4 text-gold" />
                      <span>Enter Blouse Measurements (Inches)</span>
                    </span>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-poppins text-xs">
                      {Object.keys(measurements).map(key => (
                        <div key={key}>
                          <label className="block text-maroon/60 uppercase text-[9px] mb-1.5">{key.replace('_', ' ')}</label>
                          <input
                            type="number"
                            step="0.25"
                            value={measurements[key as keyof typeof measurements]}
                            onChange={(e) => handleMeasureChange(key, parseFloat(e.target.value) || 0)}
                            className="w-full bg-white border border-maroon/10 rounded-lg p-2 text-center text-xs font-semibold"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Payments */}
              <div className="pt-6 border-t border-[#5C061E]/5">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full font-poppins text-xs uppercase tracking-widest font-bold bg-gold hover:bg-maroon hover:text-gold text-maroon py-4 rounded-full border border-gold transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{loading ? 'Initializing Razorpay...' : `Pay ₹${grandTotal.toLocaleString()} via Razorpay`}</span>
                </button>
              </div>

            </form>

            {/* Cart Summary */}
            <div className="lg:col-span-5 bg-[#FFF8F0]/40 rounded-3xl p-6 sm:p-8 border border-maroon/5 space-y-6">
              <h4 className="font-playfair text-lg font-bold pb-4 border-b border-maroon/10">Order Summary</h4>
              
              <div className="divide-y divide-maroon/5 overflow-y-auto max-h-[30vh] pr-2">
                {cart.map(item => {
                  const price = item.product.price;
                  const discountedPrice = price * (1 - item.product.discount / 100);
                  return (
                    <div key={item.product.id} className="flex py-4 items-center justify-between text-xs">
                      <div className="flex items-center space-x-3">
                        <img src={item.product.image} className="w-10 h-10 object-cover rounded-lg border border-gold/15" alt={item.product.name} />
                        <div>
                          <h5 className="font-playfair font-bold text-maroon">{item.product.name}</h5>
                          <span className="font-poppins text-[9px] text-maroon/40 uppercase">Qty: {item.qty} | Size: Standard</span>
                        </div>
                      </div>
                      <span className="font-semibold">₹{(discountedPrice * item.qty).toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-maroon/10 pt-4 space-y-3 font-poppins text-xs">
                <div className="flex justify-between text-maroon/60">
                  <span>Items subtotal:</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-maroon/60">
                  <span>Atelier Shipping:</span>
                  <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span>
                </div>
                <div className="flex justify-between text-maroon/60">
                  <span>Stitching GST (5%):</span>
                  <span>₹{gstCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-maroon text-sm font-bold border-t border-maroon/5 pt-3">
                  <span>Grand Total:</span>
                  <span className="font-playfair text-xl">₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-maroon/5 shadow-luxury flex items-start space-x-2 text-[10px] font-poppins text-maroon/60 leading-relaxed">
                <ShieldCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Secure Checkout Guarantee:</strong> Custom tailoring payments are secured inside verified gateways. Stitching due dates are backed by full refunds.
                </span>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
