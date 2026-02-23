import { useState } from 'react';
import { LayoutDashboard, Star, Check, ArrowLeft, Zap } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/shared/PageHeader';

const packages = [
  {
    id: 'free',
    name: 'مجاني',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: ['50 سؤال شهرياً', 'اختباران', 'تحليل أساسي', 'دعم مجتمعي'],
  },
  {
    id: 'pro',
    name: 'احترافي',
    monthlyPrice: 49,
    yearlyPrice: 470,
    features: ['أسئلة غير محدودة', 'اختبارات غير محدودة', 'تحليل متقدم', 'دعم أولوية', 'توليد AI متقدم'],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'مؤسسات',
    monthlyPrice: 199,
    yearlyPrice: 1900,
    features: ['كل مميزات الاحترافي', 'مستخدمون متعددون', 'API مخصص', 'دعم مخصص 24/7', 'تخصيص كامل'],
  },
];

const Dashboard = () => {
  const [currentPlan] = useState('free');
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <AppLayout>
      <PageHeader title="لوحة التحكم" description="إدارة حسابك وباقتك" icon={LayoutDashboard} />

      {/* Current plan */}
      <div className="bg-card rounded-2xl border border-border p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">الباقة الحالية</p>
            <h3 className="text-xl font-bold text-foreground">{packages.find(p => p.id === currentPlan)?.name}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Zap className="w-6 h-6 text-primary" />
          </div>
        </div>
      </div>

      {/* Upgrade section */}
      <h3 className="text-lg font-bold text-foreground mb-4">ترقية الحساب</h3>

      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <button
          onClick={() => setBilling('monthly')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${billing === 'monthly' ? 'gradient-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
        >
          شهري
        </button>
        <button
          onClick={() => setBilling('yearly')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${billing === 'yearly' ? 'gradient-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
        >
          سنوي <span className="text-xs opacity-80">(وفر 20%)</span>
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {packages.map((pkg) => {
          const price = billing === 'monthly' ? pkg.monthlyPrice : pkg.yearlyPrice;
          const isCurrent = currentPlan === pkg.id;
          return (
            <div
              key={pkg.id}
              className={`rounded-2xl p-6 border-2 transition-all duration-300 relative ${
                isCurrent
                  ? 'border-primary bg-primary/5 shadow-glow'
                  : pkg.popular
                    ? 'border-primary/50 bg-card hover:shadow-lg'
                    : 'border-border bg-card hover:border-primary/30'
              }`}
            >
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="gradient-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    الباقة الحالية
                  </span>
                </div>
              )}
              {pkg.popular && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-warning text-warning-foreground text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3" /> الأكثر شعبية
                  </span>
                </div>
              )}
              <h3 className="text-lg font-bold text-foreground mb-1">{pkg.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-black text-foreground">{price}</span>
                <span className="text-sm text-muted-foreground"> ر.س/{billing === 'monthly' ? 'شهر' : 'سنة'}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="w-3.5 h-3.5 text-primary shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              {isCurrent ? (
                <div className="text-center py-2.5 rounded-xl bg-muted text-muted-foreground text-sm font-medium">
                  الباقة الحالية ✓
                </div>
              ) : (
                <button className="w-full gradient-primary text-primary-foreground py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  ترقية
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
};

export default Dashboard;
