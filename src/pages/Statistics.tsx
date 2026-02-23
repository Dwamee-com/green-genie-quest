import { useState } from 'react';
import { BarChart3, Users, UserCheck, LayoutGrid, FileText, HelpCircle, Bot, Eye } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/shared/PageHeader';
import Modal from '@/components/shared/Modal';

interface Participant {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  joinedAt: string;
}

const mockParticipants: Participant[] = [
  { id: 'p1', name: 'أحمد محمد', email: 'ahmed@email.com', phone: '0501234567', status: 'active', joinedAt: '2024-01-10' },
  { id: 'p2', name: 'سارة أحمد', email: 'sara@email.com', phone: '0509876543', status: 'inactive', joinedAt: '2024-01-15' },
  { id: 'p3', name: 'محمد علي', email: 'moh@email.com', phone: '0551112233', status: 'active', joinedAt: '2024-02-01' },
  { id: 'p4', name: 'فاطمة خالد', email: 'fatma@email.com', phone: '0554445566', status: 'active', joinedAt: '2024-02-10' },
];

const Statistics = () => {
  const { categories, assistants, questions, exams, examAnswers } = useAppContext();
  const [participants] = useState<Participant[]>(mockParticipants);
  const [detailParticipant, setDetailParticipant] = useState<Participant | null>(null);

  const activeParticipants = participants.filter(p => p.status === 'active').length;

  const stats = [
    { icon: Users, label: 'إجمالي المشاركين', value: participants.length, color: 'text-primary' },
    { icon: UserCheck, label: 'المشاركون النشطون', value: activeParticipants, color: 'text-success' },
    { icon: LayoutGrid, label: 'التصنيفات', value: categories.length, color: 'text-info' },
    { icon: FileText, label: 'الاختبارات', value: exams.length, color: 'text-warning' },
    { icon: HelpCircle, label: 'الأسئلة', value: questions.length, color: 'text-accent-foreground' },
    { icon: Bot, label: 'المصادر', value: assistants.length, color: 'text-primary' },
  ];

  return (
    <AppLayout>
      <PageHeader title="الإحصائيات" description="نظرة عامة على بيانات المنصة" icon={BarChart3} />

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card rounded-2xl border border-border p-5 text-center hover:shadow-lg hover:border-primary/30 transition-all">
            <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
            <p className="text-2xl font-black text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Participants table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="text-lg font-bold text-foreground">جميع المشاركين</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="py-3 px-4 text-right font-medium text-muted-foreground">الاسم</th>
                <th className="py-3 px-4 text-right font-medium text-muted-foreground">البريد</th>
                <th className="py-3 px-4 text-right font-medium text-muted-foreground">الهاتف</th>
                <th className="py-3 px-4 text-right font-medium text-muted-foreground">الحالة</th>
                <th className="py-3 px-4 text-right font-medium text-muted-foreground">تاريخ الانضمام</th>
                <th className="py-3 px-4 text-right font-medium text-muted-foreground">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p) => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 font-medium text-foreground">{p.name}</td>
                  <td className="py-3 px-4 text-muted-foreground" dir="ltr">{p.email}</td>
                  <td className="py-3 px-4 text-muted-foreground" dir="ltr">{p.phone}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                      {p.status === 'active' ? 'نشط' : 'غير نشط'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{new Date(p.joinedAt).toLocaleDateString('ar-SA')}</td>
                  <td className="py-3 px-4">
                    <button onClick={() => setDetailParticipant(p)} className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
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
      <Modal isOpen={!!detailParticipant} onClose={() => setDetailParticipant(null)} title={`تفاصيل ${detailParticipant?.name || ''}`}>
        {detailParticipant && (
          <div className="space-y-4">
            {[
              { label: 'الاسم', value: detailParticipant.name },
              { label: 'البريد', value: detailParticipant.email },
              { label: 'الهاتف', value: detailParticipant.phone },
              { label: 'الحالة', value: detailParticipant.status === 'active' ? 'نشط' : 'غير نشط' },
              { label: 'تاريخ الانضمام', value: new Date(detailParticipant.joinedAt).toLocaleDateString('ar-SA') },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 bg-muted rounded-xl">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="text-sm font-medium text-foreground">{item.value}</span>
              </div>
            ))}
            {/* Exams taken by participant */}
            <div>
              <p className="text-sm font-bold text-foreground mb-2">الاختبارات المقدمة</p>
              {examAnswers.filter(a => a.username === detailParticipant.name).length === 0 ? (
                <p className="text-xs text-muted-foreground">لا توجد اختبارات</p>
              ) : (
                examAnswers.filter(a => a.username === detailParticipant.name).map(a => {
                  const exam = exams.find(e => e.id === a.exam_id);
                  return (
                    <div key={a.id} className="p-3 bg-muted rounded-xl flex items-center justify-between mb-2">
                      <span className="text-sm text-foreground">{exam?.title || 'اختبار'}</span>
                      <span className="text-sm font-bold text-primary">{a.grade}%</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </Modal>
    </AppLayout>
  );
};

export default Statistics;
