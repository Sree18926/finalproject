import { useState } from 'react';
import { Mail, MapPin, Phone, Send, Github, Linkedin, CheckCircle2, MessageSquare, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

/** Contact page — a contact form with validation + contact info cards. */
export function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  /** Validate the form fields. */
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.';
    if (!form.subject.trim()) e.subject = 'Subject is required.';
    if (form.message.trim().length < 10) e.message = 'Message must be at least 10 characters.';
    return e;
  };

  /** Handle form submission — saves the message to the contact_messages table. */
  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setSubmitError('');
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    if (!supabase) {
      setSubmitError('Database is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      });
      if (error) throw new Error(error.message);
      setSent(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setSubmitError(err.message || 'Could not send your message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const update = (k: keyof typeof form) => (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: ev.target.value }));
    if (sent) setSent(false);
    if (submitError) setSubmitError('');
  };

  return (
    <div className="container-page py-12">
      <div className="text-center max-w-2xl mx-auto animate-fade-in-up">
        <span className="badge bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300">
          <MessageSquare className="w-3.5 h-3.5" /> Get in Touch
        </span>
        <h1 className="mt-4 text-3xl sm:text-4xl font-bold">Contact Us</h1>
        <p className="mt-3 text-gray-500 dark:text-gray-400">
          Have questions about the project, the model, or want to collaborate?
          Send us a message.
        </p>
      </div>

      <div className="mt-12 grid lg:grid-cols-5 gap-8">
        {/* Contact info */}
        <div className="lg:col-span-2 space-y-4 animate-fade-in-up">
          {INFO.map((c) => (
            <div key={c.label} className="card p-5 flex items-start gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${c.color}`}>
                <c.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{c.label}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{c.value}</p>
              </div>
            </div>
          ))}
          <div className="card p-5">
            <h3 className="font-semibold text-sm mb-3">Follow Us</h3>
            <div className="flex gap-3">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-brand-600 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-brand-600 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
              <a href="mailto:contact@fakenewsai.example" className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-brand-600 hover:text-white transition-colors"><Mail className="w-5 h-5" /></a>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-3 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <form onSubmit={handleSubmit} className="card p-6 space-y-4" noValidate>
            {sent && (
              <div className="rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 px-4 py-3 text-sm text-green-700 dark:text-green-300 flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-5 h-5" /> Thank you! Your message has been sent.
              </div>
            )}
            {submitError && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300 flex items-center gap-2 animate-fade-in">
                <AlertCircle className="w-5 h-5" /> {submitError}
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Name" error={errors.name}>
                <input value={form.name} onChange={update('name')} placeholder="Your name" className="input" />
              </Field>
              <Field label="Email" error={errors.email}>
                <input type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" className="input" />
              </Field>
            </div>
            <Field label="Subject" error={errors.subject}>
              <input value={form.subject} onChange={update('subject')} placeholder="What is this about?" className="input" />
            </Field>
            <Field label="Message" error={errors.message}>
              <textarea value={form.message} onChange={update('message')} rows={5} placeholder="Write your message…" className="input resize-y" />
            </Field>
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending…</> : <><Send className="w-5 h-5" /> Send Message</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/** Reusable form field wrapper with label + error display. */
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

const INFO = [
  { icon: Mail, label: 'Email', value: 'contact@fakenewsai.example', color: 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400' },
  { icon: Phone, label: 'Phone', value: '+91 98765 43210', color: 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400' },
  { icon: MapPin, label: 'Location', value: 'Department of Computer Science, India', color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' },
];
