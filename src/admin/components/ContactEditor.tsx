'use client';

import React, { useEffect, useState } from 'react';
import { Save, RefreshCw, CheckCircle2, AlertCircle, MapPin, Mail, Phone, Clock, Map } from 'lucide-react';

export default function ContactEditor() {
  const [formData, setFormData] = useState({
    title: 'Contact Details',
    officeTitle: 'Our Office',
    address: '',
    emailTitle: 'Email Us',
    email: '',
    phoneTitle: 'Call Us',
    phone: '',
    googleMap: '',
    officeHours: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchContactDetails = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/admin/contact');
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        const c = data.data;
        setFormData({
          title: c.title || 'Contact Details',
          officeTitle: c.officeTitle || 'Our Office',
          address: c.address || '',
          emailTitle: c.emailTitle || 'Email Us',
          email: c.email || '',
          phoneTitle: c.phoneTitle || 'Call Us',
          phone: c.phone || '',
          googleMap: c.googleMap || '',
          officeHours: c.officeHours || '',
        });
      } else {
        setErrorMessage(data.message || 'Failed to fetch contact details');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Network error fetching contact details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactDetails();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/admin/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage('Contact details saved successfully!');
        setTimeout(() => setSuccessMessage(null), 4000);
      } else {
        setErrorMessage(data.message || data.errors?.[0] || 'Failed to update contact details.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('An unexpected error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <RefreshCw className="w-8 h-8 text-[#002B49] animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Loading contact settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#002B49] tracking-tight">Contact Settings</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your office address, phone, email, and contact information displayed on the website.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#00A79D] hover:bg-[#008f85] text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow transition-all disabled:opacity-50 cursor-pointer"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-3 shadow-2xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Office & Address */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2.5 rounded-xl bg-[#002B49]/5 text-[#002B49]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#002B49]">Office Location Details</h2>
              <p className="text-xs text-slate-400">Heading and physical address displayed under Office</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Section Heading
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Contact Details"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#00A79D] focus:ring-1 focus:ring-[#00A79D] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Office Card Title
              </label>
              <input
                type="text"
                name="officeTitle"
                value={formData.officeTitle}
                onChange={handleChange}
                placeholder="Our Office"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#00A79D] focus:ring-1 focus:ring-[#00A79D] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Office Address
            </label>
            <textarea
              name="address"
              rows={3}
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter full office address..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#00A79D] focus:ring-1 focus:ring-[#00A79D] transition-colors"
            />
          </div>
        </div>

        {/* Email & Phone */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2.5 rounded-xl bg-[#00A79D]/10 text-[#00A79D]">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#002B49]">Communication Details</h2>
              <p className="text-xs text-slate-400">Email and Phone contact fields</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Email Field Title
              </label>
              <input
                type="text"
                name="emailTitle"
                value={formData.emailTitle}
                onChange={handleChange}
                placeholder="Email Us"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#00A79D] focus:ring-1 focus:ring-[#00A79D] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="info@yfadvisors.in"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#00A79D] focus:ring-1 focus:ring-[#00A79D] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Phone Field Title
              </label>
              <input
                type="text"
                name="phoneTitle"
                value={formData.phoneTitle}
                onChange={handleChange}
                placeholder="Call Us"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#00A79D] focus:ring-1 focus:ring-[#00A79D] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 80805 06185"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#00A79D] focus:ring-1 focus:ring-[#00A79D] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Additional Settings */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#002B49]">Office Hours & Map Link</h2>
              <p className="text-xs text-slate-400">Optional working hours and Google Map embed URL</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Office Working Hours
              </label>
              <input
                type="text"
                name="officeHours"
                value={formData.officeHours}
                onChange={handleChange}
                placeholder="Mon - Fri: 9:00 AM - 6:00 PM"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#00A79D] focus:ring-1 focus:ring-[#00A79D] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Google Map URL
              </label>
              <input
                type="text"
                name="googleMap"
                value={formData.googleMap}
                onChange={handleChange}
                placeholder="https://maps.google.com/..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#00A79D] focus:ring-1 focus:ring-[#00A79D] transition-colors"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
