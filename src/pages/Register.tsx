import { useState } from 'react';
import { Brain, User, Mail, Phone, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, Check, Star, ChevronLeft } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const packages = [
  {
    id: 'free',
    name: 'مجاني',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: ['50 سؤال شهرياً', 'اختباران', 'تحليل أساسي', 'دعم مجتمعي'],
    limits: { questions: 50, exams: 2, ai: false, support: 'مجتمعي' },
  },
  {
    id: 'pro',
    name: 'احترافي',
    monthlyPrice: 49,
    yearlyPrice: 470,
    features: ['أسئلة غير محدودة', 'اختبارات غير محدودة', 'تحليل متقدم', 'دعم أولوية', 'توليد AI متقدم'],
    limits: { questions: -1, exams: -1, ai: true, support: 'أولوية' },
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'مؤسسات',
    monthlyPrice: 199,
    yearlyPrice: 1900,
    features: ['كل مميزات الاحترافي', 'مستخدمون متعددون', 'API مخصص', 'دعم مخصص 24/7', 'تخصيص كامل'],
    limits: { questions: -1, exams: -1, ai: true, support: '24/7' },
  },
];

const comparisonFeatures = [
  { label: 'عدد الأسئلة', free: '50/شهر', pro: 'غير محدود', enterprise: 'غير محدود' },
  { label: 'عدد الاختبارات', free: '2', pro: 'غير محدود', enterprise: 'غير محدود' },
  { label: 'توليد بالذكاء الاصطناعي', free: '✗', pro: '✓', enterprise: '✓' },
  { label: 'تحليل الأداء', free: 'أساسي', pro: 'متقدم', enterprise: 'متقدم + تقارير' },
  { label: 'الدعم الفني', free: 'مجتمعي', pro: 'أولوية', enterprise: '24/7 مخصص' },
  { label: 'مستخدمون متعددون', free: '✗', pro: '✗', enterprise: '✓' },
  { label: 'API مخصص', free: '✗', pro: '✗', enterprise: '✓' },
];

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accountType = searchParams.get('type') || 'client';

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPackage, setSelectedPackage] = useState('free');
  const [acceptPolicy, setAcceptPolicy] = useState(false);
  const [form, setForm] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleNext = () => {
    if (!form.username || !form.email || !form.password || !form.confirmPassword) return;
    if (form.password !== form.confirmPassword) return;
    if (!acceptPolicy) return;
    setStep(2);
  };

  const handleRegister = () => {
    navigate('/categories');
  };

  return (
    <div className="min-h-screen gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-primary blur-3xl" />
        <div className="absolute bottom-10 left-20 w-96 h-96 rounded-full bg-primary blur-3xl" />
      </div>

      <div className="relative z-10 py-8 px-4">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary-foreground">الاستبيانات الذكية</span>
          </Link>
          <p className="text-primary-foreground/60 text-sm">
            تسجيل حساب جديد {accountType === 'participant' ? 'كمشارك' : 'كعميل'}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-primary-foreground/40'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step >= 1 ? 'gradient-primary text-primary-foreground border-transparent' : 'border-primary-foreground/30 text-primary-foreground/40'}`}>
              {step > 1 ? <Check className="w-4 h-4" /> : '1'}
            </div>
            <span className="text-sm font-medium text-primary-foreground/80">البيانات الشخصية</span>
          </div>
          <div className="w-12 h-0.5 bg-primary-foreground/20" />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-primary-foreground/40'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step >= 2 ? 'gradient-primary text-primary-foreground border-transparent' : 'border-primary-foreground/30 text-primary-foreground/40'}`}>
              2
            </div>
            <span className="text-sm font-medium text-primary-foreground/80">اختيار الباقة</span>
          </div>
        </div>

        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div className="max-w-md mx-auto">
            <div className="bg-card rounded-2xl border border-border p-8 shadow-lg animate-fade-in">
              <h2 className="text-xl font-bold text-foreground text-center mb-6">البيانات الشخصية</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">اسم المستخدم</label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="اسم المستخدم" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">البريد الإلكتروني</label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="example@email.com" dir="ltr" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">رقم الهاتف</label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="05xxxxxxxx" dir="ltr" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">كلمة المرور</label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full pr-10 pl-10 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="••••••••" dir="ltr" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">تأكيد كلمة المرور</label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="••••••••" dir="ltr" />
                  </div>
                  {form.confirmPassword && form.password !== form.confirmPassword && (
                    <p className="text-xs text-destructive mt-1">كلمة المرور غير متطابقة</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setAcceptPolicy(!acceptPolicy)} className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${acceptPolicy ? 'bg-primary border-primary' : 'border-border bg-muted'}`}>
                    {acceptPolicy && <Check className="w-3 h-3 text-primary-foreground" />}
                  </button>
                  <span className="text-sm text-muted-foreground">أوافق على <a href="#" className="text-primary hover:underline">سياسة الخصوصية</a> و<a href="#" className="text-primary hover:underline">شروط الاستخدام</a></span>
                </div>
                <button onClick={handleNext} disabled={!acceptPolicy || !form.username || !form.email || !form.password || form.password !== form.confirmPassword} className="w-full gradient-primary text-primary-foreground py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity shadow-glow flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  التالي
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">لديك حساب؟ <Link to="/login" className="text-primary font-medium hover:underline">تسجيل الدخول</Link></p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Packages */}
        {step === 2 && (
          <div className="max-w-5xl mx-auto animate-fade-in">
            <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <button onClick={() => setStep(1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowRight className="w-4 h-4" />
                  رجوع
                </button>
                <h2 className="text-xl font-bold text-foreground">اختر الباقة المناسبة</h2>
                <div />
              </div>

              {/* Billing toggle */}
              <div className="flex items-center justify-center gap-3 mb-8">
                <button onClick={() => setBilling('monthly')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${billing === 'monthly' ? 'gradient-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  شهري
                </button>
                <button onClick={() => setBilling('yearly')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${billing === 'yearly' ? 'gradient-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  سنوي <span className="text-xs opacity-80">(وفر 20%)</span>
                </button>
              </div>

              {/* Package cards */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {packages.map((pkg) => {
                  const price = billing === 'monthly' ? pkg.monthlyPrice : pkg.yearlyPrice;
                  const isSelected = selectedPackage === pkg.id;
                  return (
                    <button
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg.id)}
                      className={`rounded-2xl p-6 border-2 text-right transition-all duration-300 ${
                        isSelected
                          ? 'border-primary bg-primary/5 shadow-glow'
                          : 'border-border bg-card hover:border-primary/30'
                      } ${pkg.popular ? 'relative' : ''}`}
                    >
                      {pkg.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className="gradient-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                            <Star className="w-3 h-3" /> الأكثر شعبية
                          </span>
                        </div>
                      )}
                      <h3 className="text-lg font-bold text-foreground mb-1">{pkg.name}</h3>
                      <div className="mb-4">
                        <span className="text-3xl font-black text-foreground">{price}</span>
                        <span className="text-sm text-muted-foreground"> ر.س/{billing === 'monthly' ? 'شهر' : 'سنة'}</span>
                      </div>
                      <ul className="space-y-2">
                        {pkg.features.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Check className="w-3.5 h-3.5 text-primary shrink-0" /> {f}
                          </li>
                        ))}
                      </ul>
                      {isSelected && (
                        <div className="mt-4 gradient-primary text-primary-foreground text-center py-2 rounded-xl text-xs font-bold">
                          محدد ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Comparison table */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-foreground mb-4 text-center">مقارنة الباقات</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="py-3 px-4 text-right text-muted-foreground font-medium">الميزة</th>
                        <th className="py-3 px-4 text-center text-foreground font-bold">مجاني</th>
                        <th className="py-3 px-4 text-center text-primary font-bold">احترافي</th>
                        <th className="py-3 px-4 text-center text-foreground font-bold">مؤسسات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonFeatures.map((row) => (
                        <tr key={row.label} className="border-b border-border/50">
                          <td className="py-3 px-4 text-foreground">{row.label}</td>
                          <td className="py-3 px-4 text-center text-muted-foreground">{row.free}</td>
                          <td className="py-3 px-4 text-center text-primary font-medium">{row.pro}</td>
                          <td className="py-3 px-4 text-center text-muted-foreground">{row.enterprise}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <button onClick={handleRegister} className="w-full gradient-primary text-primary-foreground py-3.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity shadow-glow flex items-center justify-center gap-2">
                إنشاء الحساب
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
