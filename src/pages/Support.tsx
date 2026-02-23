import { useState } from 'react';
import { Headphones, Mail, Send, CheckCircle2 } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/shared/PageHeader';

const Support = () => {
  const [form, setForm] = useState({ email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (!form.email.trim() || !form.message.trim()) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setForm({ email: '', message: '' });
    }, 3000);
  };

  return (
    <AppLayout>
      <PageHeader title="الدعم الفني" description="تواصل معنا وسنرد عليك في أقرب وقت" icon={Headphones} />

      <div className="max-w-2xl mx-auto">
        <div className="bg-card rounded-2xl border border-border p-8">
          {sent ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">تم إرسال رسالتك بنجاح</h3>
              <p className="text-sm text-muted-foreground">سنرد عليك خلال 24 ساعة</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="example@email.com"
                    dir="ltr"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">الرسالة</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none h-40"
                  placeholder="اكتب رسالتك هنا..."
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={!form.email.trim() || !form.message.trim()}
                className="w-full gradient-primary text-primary-foreground py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity shadow-glow flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                إرسال الرسالة
              </button>
            </div>
          )}
        </div>

        {/* FAQ */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-foreground mb-4">الأسئلة الشائعة</h3>
          <div className="space-y-3">
            {[
              { q: 'كيف أنشئ اختبار جديد؟', a: 'اذهب إلى صفحة الاختبارات واضغط على "إضافة اختبار" ثم اختر الأسئلة والإعدادات.' },
              { q: 'هل يمكنني تغيير الباقة لاحقاً؟', a: 'نعم، يمكنك الترقية أو تغيير الباقة في أي وقت من لوحة التحكم.' },
              { q: 'كيف أرفع ملفات للمساعد الذكي؟', a: 'من صفحة المساعدين، اختر المساعد المطلوب واضغط على "رفع ملف" لإضافة ملفات PDF أو Word.' },
            ].map((faq) => (
              <div key={faq.q} className="bg-card rounded-xl border border-border p-4">
                <p className="text-sm font-bold text-foreground mb-1">{faq.q}</p>
                <p className="text-xs text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Support;
