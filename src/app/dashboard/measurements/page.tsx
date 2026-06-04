'use client';

// src/app/dashboard/measurements/page.tsx
import React, { useState, useEffect } from 'react';
import { useBoutique } from '../../providers';
import { Ruler, Sparkles, Check } from 'lucide-react';

export default function SizingGuideTab() {
  const { currentUser, updateCustomerMeasurements } = useBoutique();

  const [sizes, setSizes] = useState({
    chest: 0, waist: 0, blouse_length: 0, shoulder: 0,
    front_neck: 0, back_neck: 0, sleeve_length: 0, sleeve_round: 0, arm_hole: 0
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.measurements) {
      setSizes({
        chest: currentUser.measurements.chest || 0,
        waist: currentUser.measurements.waist || 0,
        blouse_length: currentUser.measurements.blouse_length || 0,
        shoulder: currentUser.measurements.shoulder || 0,
        front_neck: currentUser.measurements.front_neck || 0,
        back_neck: currentUser.measurements.back_neck || 0,
        sleeve_length: currentUser.measurements.sleeve_length || 0,
        sleeve_round: currentUser.measurements.sleeve_round || 0,
        arm_hole: currentUser.measurements.arm_hole || 0,
      });
    }
  }, [currentUser]);

  const handleInputChange = (field: string, val: number) => {
    setSizes(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setLoading(true);
    setSuccess(false);

    try {
      await updateCustomerMeasurements(currentUser.id, sizes);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      alert('Failed to update size variables. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-maroon/5 shadow-luxury space-y-8 animate-fade-in text-maroon">
      <div className="flex items-center justify-between border-b border-maroon/5 pb-4">
        <div>
          <h3 className="font-playfair text-xl sm:text-2xl font-bold">Personal Sizing Guide</h3>
          <p className="font-poppins text-xs text-maroon/60">Configure your exact body variables for perfect fittings.</p>
        </div>
        <span className="text-3xl animate-pulse-soft">📐</span>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        <div className="bg-[#FFF8F0]/30 rounded-2xl p-6 border border-gold/15 space-y-4">
          <span className="font-playfair text-sm font-bold flex items-center space-x-1">
            <Ruler className="w-4 h-4 text-gold" />
            <span>Tailoring Fit Variables (Inches)</span>
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 font-poppins text-xs">
            {Object.keys(sizes).map(key => (
              <div key={key} className="space-y-1">
                <label className="block text-maroon/60 uppercase text-[9px] font-bold tracking-wide">
                  {key.replace('_', ' ')}:
                </label>
                <input
                  type="number"
                  step="0.25"
                  value={sizes[key as keyof typeof sizes] || ''}
                  onChange={(e) => handleInputChange(key, parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="w-full bg-white border border-[#5C061E]/10 rounded-xl p-3 text-center text-xs font-semibold focus:outline-none focus:border-gold"
                  min="0"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-maroon/5">
          <p className="font-poppins text-[10px] text-maroon/50 leading-relaxed max-w-md">
            *Our cutting masters use these indicators for layout templates. If you schedule a home consult or studio visit, these will be verified live.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="font-poppins text-xs uppercase tracking-widest font-bold bg-maroon hover:bg-gold text-gold hover:text-maroon py-3.5 px-8 rounded-full border border-maroon hover:border-gold transition-all duration-300 flex items-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            {success ? (
              <>
                <Check className="w-4 h-4" />
                <span>Measurements Saved</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{loading ? 'Saving Changes...' : 'Save Sizes Profile'}</span>
              </>
            )}
          </button>
        </div>

      </form>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-poppins p-4 rounded-xl text-center">
          ✦ Sizing profile parameters saved. These values will automatically apply to checkout stencils!
        </div>
      )}

    </div>
  );
}
