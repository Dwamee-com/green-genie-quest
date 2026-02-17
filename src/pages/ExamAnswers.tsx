import { ClipboardList, BarChart3, TrendingUp, Award, Users } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';

const ExamAnswers = () => {
  const { examAnswers, exams } = useAppContext();

  const avgGrade = examAnswers.length > 0
    ? Math.round(examAnswers.reduce((sum, a) => sum + a.grade, 0) / examAnswers.length)
    : 0;
  const maxGrade = examAnswers.length > 0 ? Math.max(...examAnswers.map((a) => a.grade)) : 0;
  const minGrade = examAnswers.length > 0 ? Math.min(...examAnswers.map((a) => a.grade)) : 0;

  const gradeColor = (grade: number) => {
    if (grade >= 85) return 'text-success';
    if (grade >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const gradeBar = (grade: number) => {
    if (grade >= 85) return 'bg-success';
    if (grade >= 60) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <AppLayout>
      <PageHeader title="إجابات الاختبارات" description="متابعة نتائج وأداء الطلاب" icon={ClipboardList} />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        {[
          { icon: Users, label: 'عدد المشاركين', value: examAnswers.length, color: 'text-primary' },
          { icon: BarChart3, label: 'متوسط الدرجات', value: `${avgGrade}%`, color: 'text-info' },
          { icon: TrendingUp, label: 'أعلى درجة', value: `${maxGrade}%`, color: 'text-success' },
          { icon: Award, label: 'أدنى درجة', value: `${minGrade}%`, color: 'text-warning' },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-2xl border border-border p-5">
            <div className="flex items-center gap-3 mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-2xl font-black text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {examAnswers.length === 0 ? (
        <EmptyState icon="📊" title="لا توجد إجابات" description="ستظهر النتائج هنا بعد أن يكمل الطلاب اختباراتهم" />
      ) : (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted">
                  <th className="text-right px-4 py-3 text-xs font-bold text-muted-foreground">الطالب</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-muted-foreground">الهاتف</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-muted-foreground">الاختبار</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-muted-foreground">البدء</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-muted-foreground">الانتهاء</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-muted-foreground">الدرجة</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-muted-foreground">ملاحظات</th>
                </tr>
              </thead>
              <tbody>
                {examAnswers.map((answer) => {
                  const exam = exams.find((e) => e.id === answer.exam_id);
                  return (
                    <tr key={answer.id} className="border-t border-border hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-foreground">{answer.username}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground" dir="ltr">{answer.phone}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{exam?.title || '-'}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{new Date(answer.start_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{new Date(answer.end_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                            <div className={`h-full rounded-full ${gradeBar(answer.grade)}`} style={{ width: `${answer.grade}%` }} />
                          </div>
                          <span className={`text-sm font-bold ${gradeColor(answer.grade)}`}>{answer.grade}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{answer.note}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default ExamAnswers;
