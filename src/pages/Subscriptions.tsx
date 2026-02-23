import { useState } from 'react';
import { CreditCard, Eye, Search } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/shared/PageHeader';
import Modal from '@/components/shared/Modal';

interface Subscriber {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: 'free' | 'pro' | 'enterprise';
  billing: 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
}

const mockSubscribers: Subscriber[] = [
  { id: 's1', name: 'أحمد محمد', email: 'ahmed@email.com', phone: '0501234567', plan: 'pro', billing: 'monthly', startDate: '2024-01-01', endDate: '2024-12-31', status: 'active' },
  { id: 's2', name: 'سارة أحمد', email: 'sara@email.com', phone: '0509876543', plan: 'enterprise', billing: 'yearly', startDate: '2024-02-01', endDate: '2025-02-01', status: 'active' },
  { id: 's3', name: 'محمد علي', email: 'moh@email.com', phone: '0551112233', plan: 'free', billing: 'monthly', startDate: '2024-03-01', endDate: '2024-04-01', status: 'expired' },
  { id: 's4', name: 'فاطمة خالد', email: 'fatma@email.com', phone: '0554445566', plan: 'pro', billing: 'yearly', startDate: '2024-01-15', endDate: '2025-01-15', status: 'active' },
  { id: 's5', name: 'عبدالله ناصر', email: 'abd@email.com', phone: '0567778899', plan: 'enterprise', billing: 'monthly', startDate: '2024-04-01', endDate: '2024-05-01', status: 'cancelled' },
];

const planLabels: Record<string, string> = { free: 'مجاني', pro: 'احترافي', enterprise: 'مؤسسات' };
const billingLabels: Record<string, string> = { monthly: 'شهري', yearly: 'سنوي' };
const statusLabels: Record<string, { label: string; class: string }> = {
  active: { label: 'نشط', class: 'bg-success/10 text-success' },
  expired: { label: 'منتهي', class: 'bg-warning/10 text-warning' },
  cancelled: { label: 'ملغي', class: 'bg-destructive/10 text-destructive' },
};

const Subscriptions = () => {
  const [subscribers] = useState<Subscriber[]>(mockSubscribers);
  const [detail, setDetail] = useState<Subscriber | null>(null);
  const [search, setSearch] = useState('');
  const [filterPlan, setFilterPlan] = useState<string>('all');

  const filtered = subscribers.filter(s => {
    const matchesSearch = s.name.includes(search) || s.email.includes(search);
    const matchesPlan = filterPlan === 'all' || s.plan === filterPlan;
    return matchesSearch && matchesPlan;
  });

  const activeSubs = subscribers.filter(s => s.status === 'active').length;
  const monthlySubs = subscribers.filter(s => s.billing === 'monthly').length;
  const yearlySubs = subscribers.filter(s => s.billing === 'yearly').length;

  return (
    <AppLayout>
      <PageHeader title="الاشتراكات" description="إدارة اشتراكات المستخدمين" icon={CreditCard} />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'إجمالي المشتركين', value: subscribers.length, color: 'text-primary' },
          { label: 'اشتراكات نشطة', value: activeSubs, color: 'text-success' },
          { label: 'اشتراكات شهرية', value: monthlySubs, color: 'text-info' },
          { label: 'اشتراكات سنوية', value: yearlySubs, color: 'text-warning' },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-2xl border border-border p-5 text-center">
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="بحث بالاسم أو البريد..."
          />
        </div>
        <div className="flex items-center gap-2">
          {['all', 'free', 'pro', 'enterprise'].map((plan) => (
            <button
              key={plan}
              onClick={() => setFilterPlan(plan)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                filterPlan === plan ? 'gradient-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              {plan === 'all' ? 'الكل' : planLabels[plan]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="py-3 px-4 text-right font-medium text-muted-foreground">الاسم</th>
                <th className="py-3 px-4 text-right font-medium text-muted-foreground">البريد</th>
                <th className="py-3 px-4 text-right font-medium text-muted-foreground">الباقة</th>
                <th className="py-3 px-4 text-right font-medium text-muted-foreground">نوع الاشتراك</th>
                <th className="py-3 px-4 text-right font-medium text-muted-foreground">الحالة</th>
                <th className="py-3 px-4 text-right font-medium text-muted-foreground">تاريخ الانتهاء</th>
                <th className="py-3 px-4 text-right font-medium text-muted-foreground">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sub) => (
                <tr key={sub.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 font-medium text-foreground">{sub.name}</td>
                  <td className="py-3 px-4 text-muted-foreground" dir="ltr">{sub.email}</td>
                  <td className="py-3 px-4">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{planLabels[sub.plan]}</span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{billingLabels[sub.billing]}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusLabels[sub.status].class}`}>
                      {statusLabels[sub.status].label}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{new Date(sub.endDate).toLocaleDateString('ar-SA')}</td>
                  <td className="py-3 px-4">
                    <button onClick={() => setDetail(sub)} className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      <Modal isOpen={!!detail} onClose={() => setDetail(null)} title={`تفاصيل اشتراك ${detail?.name || ''}`}>
        {detail && (
          <div className="space-y-4">
            {[
              { label: 'الاسم', value: detail.name },
              { label: 'البريد', value: detail.email },
              { label: 'الهاتف', value: detail.phone },
              { label: 'الباقة', value: planLabels[detail.plan] },
              { label: 'نوع الاشتراك', value: billingLabels[detail.billing] },
              { label: 'الحالة', value: statusLabels[detail.status].label },
              { label: 'تاريخ البدء', value: new Date(detail.startDate).toLocaleDateString('ar-SA') },
              { label: 'تاريخ الانتهاء', value: new Date(detail.endDate).toLocaleDateString('ar-SA') },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 bg-muted rounded-xl">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="text-sm font-medium text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </AppLayout>
  );
};

export default Subscriptions;
