'use client';

import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Send, Check, AlertCircle } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('general');
  const [message, setMessage] = useState('');
  
  // Validation States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = 'Please provide a valid email address';
    }
    if (message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
      setTopic('general');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--teal)]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--cherry)]/5 rounded-full blur-[150px] pointer-events-none" />

      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Info Details Column in custom card */}
          <div className="lg:col-span-5 glass-panel border border-white/5 rounded-[32px] p-8 sm:p-10 shadow-lg space-y-6 self-start relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--teal)]/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-accent bg-accent/5 px-3 py-1.5 rounded border border-accent/15">
                Connect
              </span>
              <h1 id="contact-title" className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mt-3 mb-4">
                Reach Our Office
              </h1>
              <p className="text-muted text-xs sm:text-sm leading-relaxed">
                Whether you have an editorial pitch, questions regarding subscription models, or interest in research partnerships, our desk is open.
              </p>
            </div>

            <hr className="border-white/5 relative z-10" />

            <div className="space-y-4 text-xs sm:text-sm relative z-10">
              <div>
                <h3 className="font-semibold text-accent uppercase text-[10px] tracking-wider mb-1">Office Enquiries</h3>
                <p className="text-foreground/80 font-medium">contact@youthprism.com</p>
              </div>
              <div>
                <h3 className="font-semibold text-accent uppercase text-[10px] tracking-wider mb-1">Editorial Pitches</h3>
                <p className="text-foreground/80 font-medium">submissions@youthprism.com</p>
              </div>
              <div>
                <h3 className="font-semibold text-accent uppercase text-[10px] tracking-wider mb-1">Follow Channels</h3>
                <div className="flex space-x-2.5 pt-2">
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent font-black transition-colors uppercase tracking-wider text-[10px]">Twitter</a>
                  <span className="text-card-border">•</span>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent font-black transition-colors uppercase tracking-wider text-[10px]">LinkedIn</a>
                  <span className="text-card-border">•</span>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent font-black transition-colors uppercase tracking-wider text-[10px]">Instagram</a>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column inside card */}
          <div className="lg:col-span-7 glass-panel border border-white/5 rounded-[32px] p-6 sm:p-10 shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-bl from-[var(--cherry)]/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
            {success ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center mx-auto text-accent shadow-inner">
                  <Check className="w-8 h-8" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-foreground">Despatch Sent Successfully</h2>
                <p className="text-xs sm:text-sm text-muted max-w-sm mx-auto leading-relaxed">
                  Thank you for writing. Our editorial desk will review your submission and follow up within 48 hours.
                </p>
                <button
                  id="send-another-btn"
                  onClick={() => setSuccess(false)}
                  className="btn-primary !py-2.5 mt-4"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="space-y-1">
                  <label className="form-lbl">Your Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g., Julian Vance"
                    className={`form-inp ${
                      errors.name ? 'border-red-500' : 'border-card-border'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 flex items-center mt-1">
                      <AlertCircle className="w-3.5 h-3.5 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="form-lbl">Email Address</label>
                  <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E.g., julian@example.com"
                    className={`form-inp ${
                      errors.email ? 'border-red-500' : 'border-card-border'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 flex items-center mt-1">
                      <AlertCircle className="w-3.5 h-3.5 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Topic selection */}
                <div className="space-y-1">
                  <label className="form-lbl">Despatch Subject</label>
                  <select
                    id="contact-topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="form-inp cursor-pointer"
                  >
                    <option value="general">General Enquiry</option>
                    <option value="pitch">Editorial Pitch / Submission</option>
                    <option value="partnership">Academic / Research Partnership</option>
                    <option value="press">Press / Media Inquiries</option>
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <label className="form-lbl">Message Brief</label>
                  <textarea
                    id="contact-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    placeholder="Describe your pitch or inquiry in detail..."
                    className={`form-inp ${
                      errors.message ? 'border-red-500' : 'border-card-border'
                    }`}
                  />
                  {errors.message && (
                    <p className="text-xs text-red-500 flex items-center mt-1">
                      <AlertCircle className="w-3.5 h-3.5 mr-1" />
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit button */}
                <button
                  id="contact-submit"
                  type="submit"
                  disabled={submitting}
                  className="w-full btn-cherry flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer !py-3.5"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-brand-cream border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Transmit Message</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );

}
