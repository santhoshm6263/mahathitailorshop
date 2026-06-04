'use client';

// src/app/admin/customers/page.tsx
import React, { useState, useEffect } from 'react';
import { useBoutique } from '../../providers';
import { BoutiqueDB } from '../../../shared/api/db';
import { 
  Search, Users, Ruler, Save, Edit, 
  Phone, Mail, Calendar, FileText, CheckCircle 
} from 'lucide-react';
import { Profile, SizingMeasurements } from '../../../shared/types';

export default function AdminCustomerManagementPage() {
  const { updateCustomerMeasurements, refreshData } = useBoutique();
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  // Sizing measurements form state
  const [chest, setChest] = useState(0);
  const [waist, setWaist] = useState(0);
  const [blouseLength, setBlouseLength] = useState(0);
  const [shoulder, setShoulder] = useState(0);
  const [frontNeck, setFrontNeck] = useState(0);
  const [backNeck, setBackNeck] = useState(0);
  const [sleeveLength, setSleeveLength] = useState(0);
  const [sleeveRound, setSleeveRound] = useState(0);
  const [armHole, setArmHole] = useState(0);
  const [notes, setNotes] = useState('');

  // Fetch full list of customers
  const loadCustomers = async () => {
    try {
      const data = await BoutiqueDB.getCustomers();
      setCustomers(data);
    } catch (e) {
      console.error('Error fetching customers:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const selectCustomerForEditing = (cust: Profile) => {
    setSelectedCustomerId(cust.id);
    const m = cust.measurements || {
      chest: 0, waist: 0, blouse_length: 0, shoulder: 0,
      front_neck: 0, back_neck: 0, sleeve_length: 0, sleeve_round: 0, arm_hole: 0
    };
    setChest(m.chest);
    setWaist(m.waist);
    setBlouseLength(m.blouse_length);
    setShoulder(m.shoulder);
    setFrontNeck(m.front_neck);
    setBackNeck(m.back_neck);
    setSleeveLength(m.sleeve_length);
    setSleeveRound(m.sleeve_round);
    setArmHole(m.arm_hole);
    setNotes(cust.notes || '');
  };

  const handleSaveMeasurements = async (customerId: string) => {
    try {
      const sizing: Partial<SizingMeasurements> = {
        chest: Number(chest),
        waist: Number(waist),
        blouse_length: Number(blouseLength),
        shoulder: Number(shoulder),
        front_neck: Number(frontNeck),
        back_neck: Number(backNeck),
        sleeve_length: Number(sleeveLength),
        sleeve_round: Number(sleeveRound),
        arm_hole: Number(armHole),
      };
      
      // Update measurements in DB
      await updateCustomerMeasurements(customerId, sizing);
      
      // Update custom customer notes (since notes are in profile, let's update them)
      if (notes) {
        const state = BoutiqueDB.getLocalState();
        state.customers = state.customers.map((c: any) => c.id === customerId ? { ...c, notes } : c);
        BoutiqueDB.saveLocalState(state);
      }

      alert('Client measurements specifications recorded!');
      setSelectedCustomerId(null);
      loadCustomers();
      refreshData();
    } catch (err) {
      console.error(err);
      alert('Error updating measurements.');
    }
  };

  const filteredCustomers = customers.filter(cust => {
    const matchesSearch = 
      cust.name.toLowerCase().includes(search.toLowerCase()) ||
      cust.email.toLowerCase().includes(search.toLowerCase()) ||
      (cust.phone && cust.phone.includes(search)) ||
      (cust.notes && cust.notes.toLowerCase().includes(search.toLowerCase()));

    return matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in text-maroon">
      
      {/* Header */}
      <div className="border-b border-maroon/5 pb-4">
        <h3 className="font-playfair text-xl sm:text-2xl font-bold">Client database & Fitting logs</h3>
        <p className="font-poppins text-xs text-maroon/60">Log client measurement metrics, review styling history, and modify custom sizing records.</p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gold" />
        <input 
          type="text" 
          placeholder="Search customers by name, phone, email, or style tags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-maroon/10 focus:border-gold outline-none font-poppins text-xs text-maroon"
        />
      </div>

      {/* Layout Grid: Customers list vs. Sizing detail editor */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 items-start">
        
        {/* Customers list (left) */}
        <div className="xl:col-span-3 space-y-4">
          {loading ? (
            <div className="text-center py-10 font-poppins text-xs">
              <div className="w-8 h-8 rounded-full border-2 border-dashed border-gold border-t-maroon animate-spin mx-auto mb-2"></div>
              <span>Fetching Client Records...</span>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-maroon/5 shadow-luxury">
              <Users className="w-12 h-12 text-gold/40 mx-auto mb-3" />
              <h4 className="font-playfair text-base font-bold">No Clients Registered</h4>
              <p className="font-poppins text-xs text-maroon/50 mt-1">No profiles match the current filter query.</p>
            </div>
          ) : (
            filteredCustomers.map(cust => {
              const isSelected = selectedCustomerId === cust.id;
              const hasMeasurements = cust.measurements && Object.values(cust.measurements).some(v => v > 0);

              return (
                <div 
                  key={cust.id}
                  className={`bg-white rounded-2xl p-5 border shadow-luxury transition-all duration-300 ${
                    isSelected 
                      ? 'border-gold bg-gold/5' 
                      : 'border-maroon/5 hover:border-gold/40'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    
                    {/* Customer Meta */}
                    <div className="space-y-3">
                      <div>
                        <span className="font-poppins text-[9px] font-bold uppercase tracking-wider bg-maroon/10 text-maroon px-2 py-1 rounded-full">
                          ID: {cust.id}
                        </span>
                        <h4 className="font-playfair text-base font-bold text-maroon mt-1">{cust.name}</h4>
                      </div>

                      <div className="font-poppins text-xs text-maroon/70 space-y-1.5">
                        <p className="flex items-center space-x-2">
                          <Mail className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                          <span>{cust.email}</span>
                        </p>
                        <p className="flex items-center space-x-2">
                          <Phone className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                          <span>{cust.phone || 'No Contact Phone'}</span>
                        </p>
                        <p className="flex items-center space-x-2">
                          <Calendar className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                          <span>Joined: {cust.joined_date || 'Est. 2026'}</span>
                        </p>
                      </div>

                      {cust.notes && (
                        <div className="p-3 bg-[#FFF8F0]/30 border border-gold/10 rounded-xl max-w-md">
                          <span className="font-poppins text-[9px] uppercase tracking-wider text-maroon/40 font-bold block mb-1">
                            Styling Details:
                          </span>
                          <p className="font-poppins text-[11px] italic text-maroon/70 leading-relaxed">
                            "{cust.notes}"
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Sizing status & Action */}
                    <div className="sm:text-right flex flex-col justify-between items-start sm:items-end gap-4">
                      <div>
                        <span className={`inline-flex items-center space-x-1 font-poppins text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border ${
                          hasMeasurements 
                            ? 'bg-green-50 border-green-200 text-green-700' 
                            : 'bg-yellow-50 border-yellow-200 text-yellow-700'
                        }`}>
                          {hasMeasurements ? '📐 Size Configured' : '⚠️ Missing Sizing Variables'}
                        </span>
                      </div>

                      <button
                        onClick={() => selectCustomerForEditing(cust)}
                        className="inline-flex items-center space-x-2 font-poppins text-[10px] uppercase tracking-widest font-bold bg-maroon text-gold px-4 py-2.5 rounded-full border border-gold hover:bg-gold hover:text-maroon transition-all cursor-pointer"
                      >
                        <Ruler className="w-3.5 h-3.5" />
                        <span>Update measurements</span>
                      </button>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Measurements editor (right) */}
        <div className="xl:col-span-2">
          {selectedCustomerId ? (
            <div className="bg-white rounded-3xl p-6 border border-gold/30 shadow-luxury space-y-6 lg:sticky lg:top-[120px] animate-slide-up">
              <div className="border-b border-maroon/5 pb-3">
                <h4 className="font-playfair text-lg font-bold text-maroon">Couture Sizing Matrix</h4>
                <p className="font-poppins text-[10px] text-maroon/40 uppercase tracking-wider font-semibold">
                  Update dimensions for ID: {selectedCustomerId}
                </p>
              </div>

              {/* Matrix inputs */}
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3 font-poppins text-[10px] text-maroon">
                  <div>
                    <label className="block text-maroon/50 font-bold uppercase mb-1">Chest (in)</label>
                    <input 
                      type="number" 
                      step="0.25"
                      value={chest}
                      onChange={(e) => setChest(Number(e.target.value))}
                      className="w-full px-2 py-1.5 border border-maroon/10 focus:border-gold outline-none rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-maroon/50 font-bold uppercase mb-1">Waist (in)</label>
                    <input 
                      type="number" 
                      step="0.25"
                      value={waist}
                      onChange={(e) => setWaist(Number(e.target.value))}
                      className="w-full px-2 py-1.5 border border-maroon/10 focus:border-gold outline-none rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-maroon/50 font-bold uppercase mb-1">Length (in)</label>
                    <input 
                      type="number" 
                      step="0.25"
                      value={blouseLength}
                      onChange={(e) => setBlouseLength(Number(e.target.value))}
                      className="w-full px-2 py-1.5 border border-maroon/10 focus:border-gold outline-none rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-maroon/50 font-bold uppercase mb-1">Shoulder (in)</label>
                    <input 
                      type="number" 
                      step="0.25"
                      value={shoulder}
                      onChange={(e) => setShoulder(Number(e.target.value))}
                      className="w-full px-2 py-1.5 border border-maroon/10 focus:border-gold outline-none rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-maroon/50 font-bold uppercase mb-1">Front Neck</label>
                    <input 
                      type="number" 
                      step="0.25"
                      value={frontNeck}
                      onChange={(e) => setFrontNeck(Number(e.target.value))}
                      className="w-full px-2 py-1.5 border border-maroon/10 focus:border-gold outline-none rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-maroon/50 font-bold uppercase mb-1">Back Neck</label>
                    <input 
                      type="number" 
                      step="0.25"
                      value={backNeck}
                      onChange={(e) => setBackNeck(Number(e.target.value))}
                      className="w-full px-2 py-1.5 border border-maroon/10 focus:border-gold outline-none rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-maroon/50 font-bold uppercase mb-1">Sleeve Lth</label>
                    <input 
                      type="number" 
                      step="0.25"
                      value={sleeveLength}
                      onChange={(e) => setSleeveLength(Number(e.target.value))}
                      className="w-full px-2 py-1.5 border border-maroon/10 focus:border-gold outline-none rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-maroon/50 font-bold uppercase mb-1">Sleeve Rnd</label>
                    <input 
                      type="number" 
                      step="0.25"
                      value={sleeveRound}
                      onChange={(e) => setSleeveRound(Number(e.target.value))}
                      className="w-full px-2 py-1.5 border border-maroon/10 focus:border-gold outline-none rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-maroon/50 font-bold uppercase mb-1">Arm Hole</label>
                    <input 
                      type="number" 
                      step="0.25"
                      value={armHole}
                      onChange={(e) => setArmHole(Number(e.target.value))}
                      className="w-full px-2 py-1.5 border border-maroon/10 focus:border-gold outline-none rounded-lg bg-white"
                    />
                  </div>
                </div>

                {/* Styling tags */}
                <div className="font-poppins text-xs">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-maroon/50 mb-1">Bespoke Styling Notes</label>
                  <textarea 
                    rows={3}
                    placeholder="e.g. Needs extra soft cotton lining padding. Prefers high neckline cuts..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-maroon/10 focus:border-gold outline-none rounded-xl resize-none bg-white"
                  />
                </div>
              </div>

              {/* Commit & Discard */}
              <div className="flex space-x-3 pt-4 border-t border-maroon/5">
                <button
                  onClick={() => handleSaveMeasurements(selectedCustomerId)}
                  className="flex-grow inline-flex items-center justify-center space-x-2 font-poppins text-[10px] uppercase tracking-widest font-bold bg-maroon text-gold py-3 rounded-full border border-gold hover:bg-gold hover:text-maroon transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4 text-gold" />
                  <span>Save sizing matrix</span>
                </button>
                <button
                  onClick={() => setSelectedCustomerId(null)}
                  className="px-5 font-poppins text-[10px] uppercase tracking-widest font-bold bg-white text-maroon py-3 rounded-full border border-maroon/20 hover:bg-maroon/5 transition-all cursor-pointer"
                >
                  Discard
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-dashed border-maroon/25 text-center py-20 lg:sticky lg:top-[120px]">
              <Ruler className="w-8 h-8 text-gold/30 mx-auto mb-2 animate-pulse" />
              <h5 className="font-playfair text-sm font-bold text-maroon">Client sizing profile</h5>
              <p className="font-poppins text-[10px] text-maroon/50 mt-1 max-w-[200px] mx-auto leading-relaxed">
                Select a client and click "Update measurements" to edit custom shoulder, waist, back neck, and sleeve fit dimensions.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
