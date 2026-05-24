// src/features/BlouseCustomizer/index.js
import { html } from '../../shared/lib/html.js';
import { BoutiqueDB } from '../../entities/BoutiqueDB.js';
const React = window.React;

export const BlouseCustomizer = ({ setCurrentPage }) => {
  const [step, setStep] = React.useState(1);
  const [selections, setSelections] = React.useState({
    neckStyle: 'Round Neck',
    sleeveStyle: 'Short Sleeve',
    embroideryStyle: 'Minimalist Border',
    fabricType: 'Raw Silk',
    customNotes: '',
    paddingRequested: true,
    tasselsRequested: false
  });
  
  const [uploadedImage, setUploadedImage] = React.useState(null);
  const [customerName, setCustomerName] = React.useState('');
  const [customerPhone, setCustomerPhone] = React.useState('');
  const [orderCompleteModal, setOrderCompleteModal] = React.useState(null);

  // Price matrix based on selections
  const basePrice = 1200; // Base stitching cost
  const prices = {
    neck: { 'Round Neck': 0, 'Royal Pot Neck': 400, 'Boat Neck': 300, 'Sweetheart Neck': 500, 'Queen Anne': 600 },
    sleeve: { 'Short Sleeve': 0, 'Elbow Sleeve': 200, 'Full Sleeve': 400, 'Puff Sleeve': 300 },
    embroidery: { 'Minimalist Border': 2500, 'Medium Stone Work': 4500, 'Heavy Aari & Zardosi': 7500, 'Royal Maggam Work': 9500 }
  };

  const totalCost = basePrice + 
                    (prices.neck[selections.neckStyle] || 0) + 
                    (prices.sleeve[selections.sleeveStyle] || 0) + 
                    (prices.embroidery[selections.embroideryStyle] || 0) +
                    (selections.paddingRequested ? 300 : 0) +
                    (selections.tasselsRequested ? 400 : 0);

  // Neck Styles Selection Options
  const neckOptions = [
    { name: 'Round Neck', desc: 'Classic comfort, piping options', price: 0 },
    { name: 'Royal Pot Neck', desc: 'Deep royal curve, back neck ties', price: 400 },
    { name: 'Boat Neck', desc: 'Sophisticated modern neckline', price: 300 },
    { name: 'Sweetheart Neck', desc: 'Feminine bridal favorite', price: 500 },
    { name: 'Queen Anne', desc: 'Regal collared sweetheart contour', price: 600 }
  ];

  // Sleeve Options
  const sleeveOptions = [
    { name: 'Short Sleeve', desc: 'Standard 5-7 inches comfort', price: 0 },
    { name: 'Elbow Sleeve', desc: 'Trendy 10-11 inches bridal fit', price: 200 },
    { name: 'Puff Sleeve', desc: 'Elegant traditional puff alignments', price: 300 },
    { name: 'Full Sleeve', desc: 'Modern royal sheer sleeve fitting', price: 400 }
  ];

  // Embroidery Intensities
  const embroideryOptions = [
    { name: 'Minimalist Border', desc: 'Simple gold zari back and sleeve lines', price: 2500 },
    { name: 'Medium Stone Work', desc: 'Stone creepers, mirrors and bead highlights', price: 4500 },
    { name: 'Heavy Aari & Zardosi', desc: 'Full bridal layout, peacocks, heavy springs', price: 7500 },
    { name: 'Royal Maggam Work', desc: 'Grand wedding collection, intricate jali grids', price: 9500 }
  ];

  // Handle Fabric / sketch photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitDesign = (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      alert('Please fill out your Name and Contact Phone to submit the design.');
      return;
    }

    // 1. Check if customer profile exists, otherwise create it
    const customers = BoutiqueDB.getCustomers();
    let customer = customers.find(c => c.phone === customerPhone);
    if (!customer) {
      customer = BoutiqueDB.addCustomer({
        name: customerName,
        phone: customerPhone,
        email: `${customerName.toLowerCase().replace(/\s+/g, '')}@example.com`
      });
    }

    // 2. Create the stitching order
    const orderData = {
      customerId: customer.id,
      customerName: customer.name,
      phone: customer.phone,
      stitchingItem: 'Custom Designer Blouse',
      neckStyle: selections.neckStyle,
      sleeveStyle: selections.sleeveStyle,
      embroideryStyle: selections.embroideryStyle,
      fabricNotes: `Fabric Type: ${selections.fabricType}. Custom requests: ${selections.customNotes}. Tassels: ${selections.tasselsRequested ? 'Yes' : 'No'}. Padding: ${selections.paddingRequested ? 'Yes' : 'No'}`,
      cost: totalCost,
      advancePaid: 0,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from now
      inspirationImage: uploadedImage || './assets/designer-blouse.png',
      staffAssigned: 'Pending Assignment'
    };

    const newOrder = BoutiqueDB.addOrder(orderData);
    setOrderCompleteModal(newOrder);
  };

  const handleWhatsAppOrder = () => {
    if (!orderCompleteModal) return;
    const msg = encodeURIComponent(
      `Hello Mahathi Tailor Shop! I have designed a custom blouse online.\n\n` +
      `*Order ID:* ${orderCompleteModal.id}\n` +
      `*Customer:* ${customerName}\n` +
      `*Neck Shape:* ${selections.neckStyle}\n` +
      `*Sleeve Style:* ${selections.sleeveStyle}\n` +
      `*Embroidery:* ${selections.embroideryStyle}\n` +
      `*Fabric:* ${selections.fabricType}\n` +
      `*Estimated Cost:* ₹${totalCost}\n\n` +
      `Please confirm my measurement consultation slot.`
    );
    window.open(`https://wa.me/919840123456?text=${msg}`, '_blank');
    setOrderCompleteModal(null);
    setCurrentPage('home');
  };

  return html`
    <div className="w-full bg-white rounded-3xl border border-maroon/5 shadow-luxury overflow-hidden">
      
      <div className="bg-maroon p-8 text-center text-white border-b border-gold/15 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-maroon-light via-maroon to-maroon-dark">
        <h3 className="font-playfair text-2xl sm:text-3xl font-bold tracking-wide text-gold">
          Blouse Customizer Studio
        </h3>
        <p className="font-poppins text-xs text-white/80 uppercase tracking-widest mt-1">
          Design your luxury silhouette step-by-step
        </p>

        <div className="flex items-center justify-center space-x-4 mt-8">
          ${[1, 2, 3, 4].map(s => html`
            <div key=${s} className="flex items-center">
              <div className=${`w-8 h-8 rounded-full flex items-center justify-center font-poppins text-xs font-bold border transition-all duration-300 ${
                step >= s 
                  ? 'bg-gold border-gold text-maroon shadow-glow' 
                  : 'bg-maroon-dark/50 border-white/20 text-white/60'
              }`}>
                ${s}
              </div>
              ${s < 4 && html`
                <div className=${`w-10 sm:w-16 h-[2px] ml-4 transition-all duration-300 ${
                  step > s ? 'bg-gold' : 'bg-maroon-dark/50'
                }`}></div>
              `}
            </div>
          `)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        <div className="lg:col-span-8 p-6 sm:p-10 border-r border-maroon/5 max-h-[70vh] overflow-y-auto">
          
          ${step === 1 && html`
            <div className="space-y-6 animate-fade-in">
              <div>
                <h4 className="font-playfair text-xl font-bold text-maroon mb-2">Step 1: Choose Your Neck Shape</h4>
                <p className="font-poppins text-xs text-maroon/60">Select from our signature hand-cut tailoring necklines.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                ${neckOptions.map(opt => html`
                  <div 
                    key=${opt.name}
                    onClick=${() => setSelections({ ...selections, neckStyle: opt.name })}
                    className=${`p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                      selections.neckStyle === opt.name 
                        ? 'border-gold bg-gold/5 shadow-gold' 
                        : 'border-maroon/5 bg-cream/10 hover:bg-cream/40'
                    }`}
                  >
                    <div>
                      <h5 className="font-playfair text-base font-bold text-maroon">${opt.name}</h5>
                      <p className="font-poppins text-[11px] text-maroon/70 mt-1">${opt.desc}</p>
                    </div>
                    <span className="font-poppins text-xs font-bold text-gold mt-4 block">
                      ${opt.price === 0 ? 'Included' : `+ ₹${opt.price}`}
                    </span>
                  </div>
                `)}
              </div>
            </div>
          `}

          ${step === 2 && html`
            <div className="space-y-6 animate-fade-in">
              <div>
                <h4 className="font-playfair text-xl font-bold text-maroon mb-2">Step 2: Sleeve Silhouettes</h4>
                <p className="font-poppins text-xs text-maroon/60">Sleeve styles define modern Indian bridal elegance.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                ${sleeveOptions.map(opt => html`
                  <div 
                    key=${opt.name}
                    onClick=${() => setSelections({ ...selections, sleeveStyle: opt.name })}
                    className=${`p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                      selections.sleeveStyle === opt.name 
                        ? 'border-gold bg-gold/5 shadow-gold' 
                        : 'border-maroon/5 bg-cream/10 hover:bg-cream/40'
                    }`}
                  >
                    <div>
                      <h5 className="font-playfair text-base font-bold text-maroon">${opt.name}</h5>
                      <p className="font-poppins text-[11px] text-maroon/70 mt-1">${opt.desc}</p>
                    </div>
                    <span className="font-poppins text-xs font-bold text-gold mt-4 block">
                      ${opt.price === 0 ? 'Included' : `+ ₹${opt.price}`}
                    </span>
                  </div>
                `)}
              </div>
            </div>
          `}

          ${step === 3 && html`
            <div className="space-y-6 animate-fade-in">
              <div>
                <h4 className="font-playfair text-xl font-bold text-maroon mb-2">Step 3: Aari Embroidery Details</h4>
                <p className="font-poppins text-xs text-maroon/60">Handcrafted zari thread densities and stone motifs.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                ${embroideryOptions.map(opt => html`
                  <div 
                    key=${opt.name}
                    onClick=${() => setSelections({ ...selections, embroideryStyle: opt.name })}
                    className=${`p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                      selections.embroideryStyle === opt.name 
                        ? 'border-gold bg-gold/5 shadow-gold' 
                        : 'border-maroon/5 bg-cream/10 hover:bg-cream/40'
                    }`}
                  >
                    <div>
                      <h5 className="font-playfair text-base font-bold text-maroon">${opt.name}</h5>
                      <p className="font-poppins text-[11px] text-maroon/70 mt-1">${opt.desc}</p>
                    </div>
                    <span className="font-poppins text-xs font-bold text-gold mt-4 block">
                      ₹${opt.price.toLocaleString()}
                    </span>
                  </div>
                `)}
              </div>
            </div>
          `}

          ${step === 4 && html`
            <div className="space-y-8 animate-fade-in">
              <div>
                <h4 className="font-playfair text-xl font-bold text-maroon mb-2">Step 4: Contact & Fabric Upload</h4>
                <p className="font-poppins text-xs text-maroon/60">Provide fabric details and upload your design sketch or fabric photo.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-poppins text-[10px] uppercase tracking-widest text-maroon font-semibold mb-2">Your Full Name:</label>
                  <input 
                    type="text" 
                    placeholder="Enter your name" 
                    value=${customerName}
                    onChange=${(e) => setCustomerName(e.target.value)}
                    className="w-full bg-cream/40 border border-maroon/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-gold transition-colors duration-300"
                    required
                  />
                </div>
                <div>
                  <label className="block font-poppins text-[10px] uppercase tracking-widest text-maroon font-semibold mb-2">Contact Mobile Number:</label>
                  <input 
                    type="tel" 
                    placeholder="Enter 10-digit number" 
                    value=${customerPhone}
                    onChange=${(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-cream/40 border border-maroon/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-gold transition-colors duration-300"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-poppins text-[10px] uppercase tracking-widest text-maroon font-semibold mb-2">Fabric Type:</label>
                  <select 
                    value=${selections.fabricType}
                    onChange=${(e) => setSelections({ ...selections, fabricType: e.target.value })}
                    className="w-full bg-cream/40 border border-maroon/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-gold"
                  >
                    <option value="Raw Silk">Raw Silk (Recommended for heavy Aari)</option>
                    <option value="Banarasi Silk">Banarasi Brocade Silk</option>
                    <option value="Velvet">Velvet Silk</option>
                    <option value="Tussar Silk">Tussar Silk</option>
                    <option value="Georgette / Net">Georgette / Net fabric</option>
                  </select>
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center space-x-2 cursor-pointer font-poppins text-xs text-maroon font-semibold">
                    <input 
                      type="checkbox" 
                      checked=${selections.paddingRequested}
                      onChange=${(e) => setSelections({ ...selections, paddingRequested: e.target.checked })}
                      className="accent-maroon w-4 h-4"
                    />
                    <span>Add Pads (+ ₹300)</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer font-poppins text-xs text-maroon font-semibold">
                    <input 
                      type="checkbox" 
                      checked=${selections.tasselsRequested}
                      onChange=${(e) => setSelections({ ...selections, tasselsRequested: e.target.checked })}
                      className="accent-maroon w-4 h-4"
                    />
                    <span>Add Silk Latkans (+ ₹400)</span>
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block font-poppins text-[10px] uppercase tracking-widest text-maroon font-semibold">Upload Fabric Image or Sketch (Optional):</label>
                
                <div className="border-2 border-dashed border-maroon/20 hover:border-gold rounded-2xl p-6 flex flex-col items-center justify-center bg-cream/10 transition-colors duration-300 relative">
                  ${uploadedImage 
                    ? html`
                        <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-gold/30">
                          <img src=${uploadedImage} className="w-full h-full object-cover" />
                          <button 
                            onClick=${() => setUploadedImage(null)}
                            className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold font-poppins"
                          >
                            Remove
                          </button>
                        </div>
                      `
                    : html`
                        <span className="text-3xl mb-2">📷</span>
                        <p className="font-poppins text-xs text-maroon/60">Drag and drop file here, or click to upload</p>
                        <p className="font-poppins text-[10px] text-maroon/40 mt-1">Accepts PNG, JPG, JPEG (Max 5MB)</p>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange=${handlePhotoUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      `
                  }
                </div>
              </div>

              <div>
                <label className="block font-poppins text-[10px] uppercase tracking-widest text-maroon font-semibold mb-2">Special Stitching Notes / Measurement requests:</label>
                <textarea 
                  placeholder="e.g. Back neck depth 9.5 inches, front elbow length 11 inches. Regular loose fit. Double lining needed."
                  value=${selections.customNotes}
                  onChange=${(e) => setSelections({ ...selections, customNotes: e.target.value })}
                  className="w-full bg-cream/40 border border-maroon/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-gold h-20"
                ></textarea>
              </div>

            </div>
          `}

          <div className="flex items-center justify-between border-t border-maroon/5 pt-8 mt-8">
            <button 
              onClick=${() => setStep(prev => Math.max(1, prev - 1))}
              disabled=${step === 1}
              className="font-poppins text-xs uppercase tracking-widest font-semibold text-maroon/40 disabled:opacity-30 px-6 py-2"
            >
              ← Back
            </button>

            ${step < 4 
              ? html`
                  <button 
                    onClick=${() => setStep(prev => Math.min(4, prev + 1))}
                    className="font-poppins text-xs uppercase tracking-widest font-semibold bg-maroon hover:bg-gold text-gold hover:text-maroon px-8 py-3 rounded-full transition-all duration-300"
                  >
                    Next Step →
                  </button>
                `
              : html`
                  <button 
                    onClick=${handleSubmitDesign}
                    className="font-poppins text-xs uppercase tracking-widest font-bold bg-gold hover:bg-white text-maroon px-8 py-3 rounded-full border border-gold transition-all duration-300"
                  >
                    Submit Custom Design
                  </button>
                `
            }
          </div>

        </div>

        <div className="lg:col-span-4 bg-maroon-soft p-6 sm:p-10 flex flex-col justify-between">
          
          <div className="space-y-6">
            <h4 className="font-playfair text-xl font-bold text-maroon pb-4 border-b border-maroon/10">
              Live Custom Summary
            </h4>

            <div className="space-y-4 font-poppins text-xs">
              
              <div className="flex items-start justify-between">
                <span className="text-maroon/60">1. Neck Shape:</span>
                <span className="font-semibold text-maroon text-right">${selections.neckStyle}</span>
              </div>

              <div className="flex items-start justify-between">
                <span className="text-maroon/60">2. Sleeve Style:</span>
                <span className="font-semibold text-maroon text-right">${selections.sleeveStyle}</span>
              </div>

              <div className="flex items-start justify-between">
                <span className="text-maroon/60">3. Embroidery:</span>
                <span className="font-semibold text-maroon text-right">${selections.embroideryStyle}</span>
              </div>

              <div className="flex items-start justify-between">
                <span className="text-maroon/60">4. Fabric Preference:</span>
                <span className="font-semibold text-maroon text-right">${selections.fabricType}</span>
              </div>

              <div className="flex items-start justify-between border-t border-maroon/5 pt-4">
                <span className="text-maroon/60">Padding (Cups):</span>
                <span className="font-semibold text-maroon">${selections.paddingRequested ? 'Yes (+₹300)' : 'No'}</span>
              </div>

              <div className="flex items-start justify-between">
                <span className="text-maroon/60">Fabric Latkans:</span>
                <span className="font-semibold text-maroon">${selections.tasselsRequested ? 'Yes (+₹400)' : 'No'}</span>
              </div>

            </div>

            <div className="border border-gold/15 bg-white rounded-2xl p-4 shadow-luxury flex items-center justify-center h-[180px] relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(maroon_1px,transparent_1px)] [background-size:12px_12px]"></div>
              
              ${uploadedImage 
                ? html`<img src=${uploadedImage} className="w-full h-full object-cover rounded-xl" />`
                : html`
                    <div className="text-center z-10 space-y-2">
                      <span className="text-3xl block animate-[float_4s_infinite_ease-in-out]">👑</span>
                      <span className="font-playfair text-sm text-maroon font-bold block">${selections.neckStyle}</span>
                      <span className="font-poppins text-[10px] text-gold uppercase tracking-wider block">${selections.sleeveStyle}</span>
                    </div>
                  `
              }
            </div>

          </div>

          <div className="border-t border-maroon/10 pt-6 mt-8">
            <div className="flex items-baseline justify-between mb-4">
              <span className="font-poppins text-xs text-maroon/70">Estimated Total:</span>
              <span className="font-playfair text-3xl font-bold text-maroon">
                ₹${totalCost.toLocaleString()}
              </span>
            </div>
            <p className="font-poppins text-[10px] text-maroon/50 leading-relaxed">
              *Final prices are locked during boutique consultation based on measurements & fabric dimensions.
            </p>
          </div>

        </div>

      </div>

      ${orderCompleteModal && html`
        <div className="fixed inset-0 bg-maroon-dark/95 z-50 flex items-center justify-center p-4 sm:p-8 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full text-center border border-gold/20 shadow-glow space-y-6">
            
            <div className="w-16 h-16 rounded-full bg-gold/10 text-gold border border-gold/30 flex items-center justify-center text-3xl mx-auto animate-pulse">
              ✔
            </div>

            <div className="space-y-2">
              <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-maroon">Design Saved Successfully!</h3>
              <p className="font-poppins text-xs text-maroon/70">
                Your custom design is archived with Order ID: <strong className="text-maroon">${orderCompleteModal.id}</strong>.
              </p>
            </div>

            <div className="w-full border-t border-maroon/5 pt-4 space-y-3 font-poppins text-xs text-maroon/70 text-left">
              <div className="flex justify-between"><span>Customer Name:</span><strong className="text-maroon">${customerName}</strong></div>
              <div className="flex justify-between"><span>Selections:</span><strong className="text-maroon">${selections.neckStyle} + ${selections.sleeveStyle}</strong></div>
              <div className="flex justify-between"><span>Embroidery Detail:</span><strong className="text-maroon">${selections.embroideryStyle}</strong></div>
              <div className="flex justify-between"><span>Estimated Quote:</span><strong className="text-maroon">₹${totalCost.toLocaleString()}</strong></div>
            </div>

            <div className="space-y-3 pt-4">
              <button 
                onClick=${handleWhatsAppOrder}
                className="w-full font-poppins text-xs uppercase tracking-widest font-bold bg-gold hover:bg-gold-dark text-maroon py-3 rounded-full border border-gold transition-colors duration-300"
              >
                Send Design to Shop on WhatsApp
              </button>
              <button 
                onClick=${() => { setOrderCompleteModal(null); setCurrentPage('home'); }}
                className="w-full font-poppins text-xs uppercase tracking-widest font-semibold bg-transparent hover:bg-maroon/5 text-maroon py-3"
              >
                Return to Homepage
              </button>
            </div>

          </div>
        </div>
      `}

    </div>
  `;
};
export default BlouseCustomizer;

