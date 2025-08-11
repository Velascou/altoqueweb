'use client';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import emailjs from 'emailjs-com';
import CONFIG from '../config';

export default function InscripcionForm() {
  const t = useTranslations('form');
  const router = useRouter();

  const [form, setForm] = useState({
    name: '', email: '', phone: '', course: '', level: '', schedule: '', message: ''
  });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});

  const sanitize = (str) =>
    String(str)
      .replace(/(--|\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|EXEC|UNION|XP_)\b)/gi, '')
      .replace(/[<>]/g, '')
      .trim()
      .slice(0, 1000);

  const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
  const isValidPhoneIE = (p) => {
    if (!p) return true;
    const cleaned = p.replace(/[^\d+]/g, '');
    return /^(\+353\d{8,9}|0\d{8,9})$/.test(cleaned);
  };

  const validate = (d) => {
    const e = {};
    if (!d.name || d.name.length < 2) e.name = t('err_name') || 'Please enter your full name.';
    if (!isValidEmail(d.email)) e.email = t('err_email') || 'Enter a valid email.';
    if (!isValidPhoneIE(d.phone)) e.phone = t('err_phone') || 'Phone must be Irish format.';
    if (!d.course) e.course = t('err_course') || 'Select a course.';
    if (!d.level) e.level = t('err_level') || 'Select your level.';
    if (!d.schedule) e.schedule = t('err_schedule') || 'Choose a schedule.';
    return e;
  };

  const handleChange = (ev) => {
    const { name, value } = ev.target;
    setForm((f) => ({ ...f, [name]: sanitize(value) }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const formInvalid = useMemo(() => Object.keys(validate(form)).length > 0, [form]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');

    const v = validate(form);
    if (Object.keys(v).length) { setErrors(v); return; }

    setSending(true);
    try {
      // 1) EmailJS
      await emailjs.send(
        CONFIG.EMAILJS_SERVICE_ID,
        CONFIG.EMAILJS_TEMPLATE_ID,
        {
          timestamp: new Date().toISOString(),
          name: form.name, email: form.email, phone: form.phone,
          course: form.course, level: form.level, schedule: form.schedule, message: form.message
        },
        CONFIG.EMAILJS_USER_ID
      );

      // 2) SheetDB via API (oculto)
      const row = {
        timestamp: new Date().toISOString(),
        name: form.name, email: form.email, phone: form.phone,
        course: form.course, level: form.level, schedule: form.schedule, message: form.message
      };
      const res = await fetch('/api/sheetdb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [row] })
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload?.error || 'Server error');

      setSuccess(t('success') || 'Sent!');
      setForm({ name: '', email: '', phone: '', course: '', level: '', schedule: '', message: '' });
      router.push('/gracias');
    } catch (err) {
      console.error('Submit error:', err);
      setError(t('submit_err') || 'Error submitting the form, try again.');
    } finally {
      setSending(false);
    }
  };

  const baseInput =
    'w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 shadow-sm ' +
    'placeholder:text-slate-400 focus:outline-none ' +
    'focus-visible:ring-2 focus-visible:ring-rose-500 focus:border-rose-500 ' +
    'transition-transform duration-200 focus:scale-[1.01]';
  const errorInput = 'border-rose-400 ring-2 ring-rose-200';
  const labelCls = 'text-sm font-semibold text-slate-800';

  return (
    <form onSubmit={handleSubmit} className="w-full bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm" noValidate>
      <h2 className="text-2xl font-bold mb-2 text-center text-rose-600">{t('submit')}</h2>

      {error && <div className="bg-rose-100 text-rose-700 px-3 py-2 rounded mb-2">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 px-3 py-2 rounded mb-2">{success}</div>}

      <label className={labelCls}>{t('name')} *</label>
      <input className={`${baseInput} ${errors.name ? errorInput : ''}`} name="name" value={form.name} onChange={handleChange} maxLength={120} autoComplete="name" required />
      {errors.name && <p className="text-sm text-rose-600 -mt-2 mb-2">{errors.name}</p>}

      <label className={labelCls}>{t('email')} *</label>
      <input className={`${baseInput} ${errors.email ? errorInput : ''}`} type="email" name="email" value={form.email} onChange={handleChange} autoComplete="email" required />
      {errors.email && <p className="text-sm text-rose-600 -mt-2 mb-2">{errors.email}</p>}

      <label className={labelCls}>{t('phone')}</label>
      <input className={`${baseInput} ${errors.phone ? errorInput : ''}`} type="tel" name="phone" value={form.phone} onChange={handleChange} inputMode="tel" placeholder="+353XXXXXXXXX or 08XXXXXXXX" />
      {errors.phone && <p className="text-sm text-rose-600 -mt-2 mb-2">{errors.phone}</p>}

      {/* Course */}
      <label className={labelCls}>{t('course_label')} *</label>
      <select className={`${baseInput} ${errors.course ? errorInput : ''}`} name="course" value={form.course} onChange={handleChange} required>
        <option value="">{t('select_placeholder')}</option>
        <option value="Junior Cert Spanish">{t('course_junior')}</option>
        <option value="Leaving Cert Spanish">{t('course_leaving')}</option>
        <option value="Conversation & Culture">{t('course_convo')}</option>
      </select>
      {errors.course && <p className="text-sm text-rose-600 -mt-2 mb-2">{errors.course}</p>}

      {/* Level */}
      <label className={labelCls}>{t('level')} *</label>
      <select className={`${baseInput} ${errors.level ? errorInput : ''}`} name="level" value={form.level} onChange={handleChange} required>
        <option value="">{t('select_placeholder')}</option>
        <option value="Beginner (A1/A2)">{t('level_a1a2')}</option>
        <option value="Intermediate (B1/B2)">{t('level_b1b2')}</option>
        <option value="Advanced (C1/C2)">{t('level_c1c2')}</option>
        <option value="Not sure">{t('level_notsure')}</option>
      </select>
      {errors.level && <p className="text-sm text-rose-600 -mt-2 mb-2">{errors.level}</p>}

      {/* Schedule */}
      <label className={labelCls}>{t('schedule')} *</label>
      <select className={`${baseInput} ${errors.schedule ? errorInput : ''}`} name="schedule" value={form.schedule} onChange={handleChange} required>
        <option value="">{t('select_placeholder')}</option>
        <option value="Morning">{t('sched_morning')}</option>
        <option value="Afternoon">{t('sched_afternoon')}</option>
        <option value="Evening">{t('sched_evening')}</option>
        <option value="Flexible">{t('sched_flexible')}</option>
      </select>
      {errors.schedule && <p className="text-sm text-rose-600 -mt-2 mb-2">{errors.schedule}</p>}

      <label className={labelCls}>{t('message')}</label>
      <textarea className={baseInput} name="message" rows={3} value={form.message} onChange={handleChange} placeholder={t('message_ph') || 'Tell us about goals, exam dates, availability...'} maxLength={1000} />

      <button
        className="mt-4 bg-rose-600 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg hover:bg-rose-700 active:scale-[.98] transition-transform duration-200 font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rose-500 disabled:opacity-50 disabled:pointer-events-none"
        type="submit"
        disabled={sending || formInvalid}
      >
        {sending ? t('sending') || 'Sending…' : t('submit')}
      </button>
    </form>
  );
}