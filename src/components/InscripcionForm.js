// altoqueweb/src/components/InscripcionForm.js
'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import emailjs from 'emailjs-com';

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

  // Prefill directo desde ?slot= y ?course= (SIN parseo)
  useEffect(() => {
    if (!router.isReady) return;
    const s = router.query?.slot;
    const c = router.query?.course;

    if (typeof s === 'string') {
      const safeSlot = s.replace(/[<>]/g, '').slice(0, 60);
      setForm((f) => ({ ...f, schedule: safeSlot }));
    }
    if (typeof c === 'string') {
      const safeCourse = c.replace(/[<>]/g, '').slice(0, 60);
      setForm((f) => ({ ...f, course: safeCourse }));
    }
  }, [router.isReady, router.query?.slot, router.query?.course]);

  // Saneado general
  const sanitize = (str) =>
    String(str)
      .replace(/(--|\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|EXEC|UNION|XP_)\b)/gi, '')
      .replace(/[<>]/g, '')
      .slice(0, 1000);

  const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
  const isValidPhoneIE = (p) => {
    if (!p) return true;
    const cleaned = p.replace(/[^\d+]/g, '');
    return /^(\+353\d{8,9}|0\d{8,9})$/.test(cleaned);
  };

  const validate = (d) => {
    const e = {};
    if (!d.name || d.name.trim().length < 2) e.name = t('err_name') || 'Please enter your full name.';
    if (!isValidEmail(d.email)) e.email = t('err_email') || 'Enter a valid email.';
    if (!isValidPhoneIE(d.phone)) e.phone = t('err_phone') || 'Phone must be Irish format.';
    if (!d.course) e.course = t('err_course') || 'Select a course.';
    if (!d.level) e.level = t('err_level') || 'Select your level.';
    if (!d.schedule) e.schedule = t('err_schedule') || 'Choose a schedule.';
    return e;
  };

  const handleChange = (ev) => {
    const { name, value } = ev.target;
    setForm((f) => ({
      ...f,
      [name]:
        name === 'message'
          ? value
              .replace(/(--|\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|EXEC|UNION|XP_)\b)/gi, '')
              .replace(/[<>]/g, '')
              .slice(0, 1000)
          : sanitize(value)
    }));
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
      // 1) EmailJS (cliente) con envs públicas
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        {
          timestamp: new Date().toISOString(),
          name: form.name, email: form.email, phone: form.phone,
          course: form.course, level: form.level, schedule: form.schedule, message: form.message
        },
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID
      );

      // 2) SheetDB via API (oculto en /api/sheetdb)
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
      <select
        className={`${baseInput} ${errors.course ? errorInput : ''}`}
        name="course"
        value={form.course}
        onChange={handleChange}
        required
      >
        <option value="">{t('select_placeholder')}</option>
        <option value="Kids (7–11)">{t('course_kids') || 'Kids (7–11)'}</option>
        <option value="Junior Cert Spanish">{t('course_junior') || 'Junior Cert Spanish'}</option>
        <option value="Leaving Cert Spanish">{t('course_leaving') || 'Leaving Cert Spanish'}</option>
        <option value="Adults – Beginners">{t('course_beginners') || 'Adults – Beginners'}</option>
        <option value="Adults – Conversation">{t('course_convo') || 'Adults – Conversation'}</option>
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

      {/* Schedule (día + hora) */}
      <label className={labelCls}>{t('schedule')} *</label>
      <select
        className={`${baseInput} ${errors.schedule ? errorInput : ''}`}
        name="schedule"
        value={form.schedule}
        onChange={handleChange}
        required
      >
        <option value="">{t('select_placeholder')}</option>
        {/* Monday */}
        <option value="Monday 4:00–5:00 PM">{t('monday')} 4:00–5:00 PM</option>
        <option value="Monday 5:00–6:00 PM">{t('monday')} 5:00–6:00 PM</option>
        <option value="Monday 6:00–7:00 PM">{t('monday')} 6:00–7:00 PM</option>
        <option value="Monday 7:00–8:00 PM">{t('monday')} 7:00–8:00 PM</option>
        {/* Tuesday */}
        <option value="Tuesday 4:00–5:00 PM">{t('tuesday')} 4:00–5:00 PM</option>
        <option value="Tuesday 5:00–6:00 PM">{t('tuesday')} 5:00–6:00 PM</option>
        <option value="Tuesday 6:00–7:00 PM">{t('tuesday')} 6:00–7:00 PM</option>
        <option value="Tuesday 7:00–8:00 PM">{t('tuesday')} 7:00–8:00 PM</option>
        {/* Wednesday */}
        <option value="Wednesday 4:00–5:00 PM">{t('wednesday')} 4:00–5:00 PM</option>
        <option value="Wednesday 5:00–6:00 PM">{t('wednesday')} 5:00–6:00 PM</option>
        <option value="Wednesday 6:00–7:00 PM">{t('wednesday')} 6:00–7:00 PM</option>
        <option value="Wednesday 7:00–8:00 PM">{t('wednesday')} 7:00–8:00 PM</option>
        {/* Thursday */}
        <option value="Thursday 4:00–5:00 PM">{t('thursday')} 4:00–5:00 PM</option>
        <option value="Thursday 5:00–6:00 PM">{t('thursday')} 5:00–6:00 PM</option>
        <option value="Thursday 6:00–7:00 PM">{t('thursday')} 6:00–7:00 PM</option>
        <option value="Thursday 7:00–8:00 PM">{t('thursday')} 7:00–8:00 PM</option>
        {/* Friday */}
        <option value="Friday 4:00–5:00 PM">{t('friday')} 4:00–5:00 PM</option>
        <option value="Friday 5:00–6:00 PM">{t('friday')} 5:00–6:00 PM</option>
        <option value="Friday 6:00–7:00 PM">{t('friday')} 6:00–7:00 PM</option>
        <option value="Friday 7:00–8:00 PM">{t('friday')} 7:00–8:00 PM</option>

        <option value="Flexible">{t('sched_flexible') || 'Flexible'}</option>
      </select>
      {errors.schedule && <p className="text-sm text-rose-600 -mt-2 mb-2">{errors.schedule}</p>}

      <label className={labelCls}>{t('message')}</label>
      <textarea
        className={baseInput}
        name="message"
        rows={3}
        value={form.message}
        onChange={handleChange}
        placeholder={t('message_ph') || 'Tell us about goals, exam dates, availability...'}
        maxLength={1000}
      />

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
