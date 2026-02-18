import { useState } from 'react';
import { ClipboardList, BarChart3, TrendingUp, Award, Users, Eye, CheckCircle2, XCircle } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { ExamAnswer, QUESTION_TYPE_LABELS } from '@/types';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import Modal from '@/components/shared/Modal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const ExamAnswers = () => {
  const { examAnswers, exams, questions } = useAppContext();
  const [detailAnswer, setDetailAnswer] = useState<ExamAnswer | null>(null);

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

  const gradeBg = (grade: number) => {
    if (grade >= 85) return 'bg-success/10 border-success/30';
    if (grade >= 60) return 'bg-warning/10 border-warning/30';
    return 'bg-destructive/10 border-destructive/30';
  };

  // Chart data for detail modal
  const getDetailChartData = (answer: ExamAnswer) => {
    const correct = answer.answers?.filter(a => a.is_correct).length || 0;
    const wrong = (answer.answers?.length || 0) - correct;
    return { correct, wrong };
  };

  const barChartData = examAnswers.map(a => ({
    name: a.username,
    grade: a.grade,
  }));

  const COLORS = ['hsl(155, 70%, 40%)', 'hsl(0, 84%, 60%)'];

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

      {/* Bar chart overview */}
      {examAnswers.length > 0 && (
        <div className="bg-card rounded-2xl border border-border p-5 mb-8">
          <h3 className="text-sm font-bold text-foreground mb-4">مقارنة درجات الطلاب</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(155, 20%, 88%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="grade" fill="hsl(160, 84%, 30%)" radius={[6, 6, 0, 0]} name="الدرجة" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {examAnswers.length === 0 ? (
        <EmptyState icon="📊" title="لا توجد إجابات" description="ستظهر النتائج هنا بعد أن يكمل الطلاب اختباراتهم" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {examAnswers.map((answer, i) => {
            const exam = exams.find((e) => e.id === answer.exam_id);
            const { correct, wrong } = getDetailChartData(answer);
            return (
              <div key={answer.id} className="bg-card rounded-2xl border border-border p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-foreground">{answer.username}</h3>
                    <p className="text-xs text-muted-foreground" dir="ltr">{answer.phone}</p>
                  </div>
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center border-2 ${gradeBg(answer.grade)}`}>
                    <span className={`text-lg font-black ${gradeColor(answer.grade)}`}>{answer.grade}%</span>
                  </div>
                </div>

                {exam && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{exam.title}</span>}

                <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                  <span>🕐 {new Date(answer.start_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</span>
                  <span>→</span>
                  <span>{new Date(answer.end_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                {/* Mini progress */}
                <div className="mt-3">
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full ${gradeBar(answer.grade)}`} style={{ width: `${answer.grade}%` }} />
                  </div>
                </div>

                {answer.answers && answer.answers.length > 0 && (
                  <div className="flex items-center gap-3 mt-3 text-xs">
                    <span className="text-success">✓ {correct} صحيحة</span>
                    <span className="text-destructive">✗ {wrong} خاطئة</span>
                  </div>
                )}

                {answer.note && <p className="text-xs text-muted-foreground mt-2 italic">"{answer.note}"</p>}

                <button
                  onClick={() => setDetailAnswer(answer)}
                  className="w-full mt-4 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-xs font-medium transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" /> عرض التفاصيل
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      <Modal isOpen={!!detailAnswer} onClose={() => setDetailAnswer(null)} title={`تفاصيل إجابة ${detailAnswer?.username || ''}`} size="lg">
        {detailAnswer && (() => {
          const exam = exams.find(e => e.id === detailAnswer.exam_id);
          const { correct, wrong } = getDetailChartData(detailAnswer);
          const pieData = [
            { name: 'صحيحة', value: correct },
            { name: 'خاطئة', value: wrong },
          ];

          return (
            <div className="space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-muted rounded-xl p-3 text-center">
                  <p className="text-2xl font-black text-foreground">{detailAnswer.grade}%</p>
                  <p className="text-xs text-muted-foreground">الدرجة</p>
                </div>
                <div className="bg-success/10 rounded-xl p-3 text-center">
                  <p className="text-2xl font-black text-success">{correct}</p>
                  <p className="text-xs text-muted-foreground">صحيحة</p>
                </div>
                <div className="bg-destructive/10 rounded-xl p-3 text-center">
                  <p className="text-2xl font-black text-destructive">{wrong}</p>
                  <p className="text-xs text-muted-foreground">خاطئة</p>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted rounded-xl p-4">
                  <p className="text-xs font-bold text-foreground mb-3">توزيع الإجابات</p>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                        {pieData.map((_, idx) => (
                          <Cell key={idx} fill={COLORS[idx]} />
                        ))}
                      </Pie>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-muted rounded-xl p-4">
                  <p className="text-xs font-bold text-foreground mb-3">أداء كل سؤال</p>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={detailAnswer.answers?.map((a, idx) => ({ name: `س${idx + 1}`, score: a.is_correct ? 100 : 0 })) || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(155, 20%, 88%)" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Bar dataKey="score" fill="hsl(160, 84%, 30%)" radius={[4, 4, 0, 0]} name="النتيجة" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Answers detail */}
              <div>
                <p className="text-sm font-bold text-foreground mb-3">تفاصيل الأسئلة والأجوبة</p>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {detailAnswer.answers?.map((a, idx) => {
                    const q = questions.find(qu => qu.id === a.question_id);
                    return (
                      <div key={idx} className={`p-3 rounded-xl border-2 ${a.is_correct ? 'border-success/30 bg-success/5' : 'border-destructive/30 bg-destructive/5'}`}>
                        <div className="flex items-start gap-2">
                          {a.is_correct ? <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">{q?.question || `سؤال ${idx + 1}`}</p>
                            {q && <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">{QUESTION_TYPE_LABELS[q.type]}</span>}
                            <div className="flex items-center gap-4 mt-1.5 text-xs">
                              <span className={a.is_correct ? 'text-success' : 'text-destructive'}>
                                إجابة الطالب: {a.selected_answer}
                              </span>
                              {!a.is_correct && q && (
                                <span className="text-success">الإجابة الصحيحة: {q.answer}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}
      </Modal>
    </AppLayout>
  );
};

export default ExamAnswers;
