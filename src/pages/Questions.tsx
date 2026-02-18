import { useState } from 'react';
import { HelpCircle, Pencil, Trash2, Sparkles, History, Eye, CheckCircle2, XCircle } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Question, QuestionType, Complexity, QUESTION_TYPE_LABELS, COMPLEXITY_LABELS } from '@/types';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/shared/PageHeader';
import Modal from '@/components/shared/Modal';
import EmptyState from '@/components/shared/EmptyState';

type Mode = 'manual' | 'ai';

const Questions = () => {
  const { questions, setQuestions, assistants } = useAppContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  const [form, setForm] = useState({
    user_id: 'u1', assistant_id: '', question: '', answer: '', page: 1,
    type: 'mcq' as QuestionType, chapter: '', complexity: 'medium' as Complexity,
    options: ['', '', '', ''] as string[],
  });

  const [aiForm, setAiForm] = useState({
    assistant_id: '',
    true_false: 0, yes_no: 0, mcq: 0, fill_blank: 0, ranking: 0, matching: 0,
  });

  const openManual = () => {
    setEditingId(null);
    setForm({ user_id: 'u1', assistant_id: '', question: '', answer: '', page: 1, type: 'mcq', chapter: '', complexity: 'medium', options: ['', '', '', ''] });
    setModalOpen(true);
  };

  const openEdit = (q: Question) => {
    setEditingId(q.id);
    setForm({ user_id: q.user_id, assistant_id: q.assistant_id, question: q.question, answer: q.answer, page: q.page, type: q.type, chapter: q.chapter, complexity: q.complexity, options: q.options || ['', '', '', ''] });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.question.trim()) return;
    const questionData: Partial<Question> = { ...form };
    if (form.type === 'mcq') {
      questionData.options = form.options.filter(o => o.trim());
    } else {
      questionData.options = undefined;
    }

    if (editingId) {
      setQuestions((prev) => prev.map((q) => {
        if (q.id === editingId) {
          const historyEntry = { id: Date.now().toString(), question: q.question, answer: q.answer, generated_at: new Date().toISOString() };
          return { ...q, ...questionData, history: [...q.history, historyEntry] };
        }
        return q;
      }));
    } else {
      setQuestions((prev) => [...prev, { ...questionData, id: Date.now().toString(), created_at: new Date().toISOString().split('T')[0], history: [] } as Question]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => setQuestions((prev) => prev.filter((q) => q.id !== id));

  const handleAIGenerate = () => {
    const types: { type: QuestionType; count: number }[] = [
      { type: 'true_false', count: aiForm.true_false },
      { type: 'yes_no', count: aiForm.yes_no },
      { type: 'mcq', count: aiForm.mcq },
      { type: 'fill_blank', count: aiForm.fill_blank },
      { type: 'ranking', count: aiForm.ranking },
      { type: 'matching', count: aiForm.matching },
    ];
    const newQuestions: Question[] = [];
    types.forEach(({ type, count }) => {
      for (let i = 0; i < count; i++) {
        newQuestions.push({
          id: `ai-${Date.now()}-${type}-${i}`,
          user_id: 'u1', assistant_id: aiForm.assistant_id,
          question: `سؤال ${QUESTION_TYPE_LABELS[type]} تم توليده بالذكاء الاصطناعي #${i + 1}`,
          answer: type === 'mcq' ? 'الخيار أ' : 'إجابة نموذجية',
          options: type === 'mcq' ? ['الخيار أ', 'الخيار ب', 'الخيار ج', 'الخيار د'] : undefined,
          page: 1, type, chapter: 'تم التوليد تلقائياً', complexity: 'medium',
          created_at: new Date().toISOString().split('T')[0], history: [],
        });
      }
    });
    setQuestions((prev) => [...prev, ...newQuestions]);
    setAiModalOpen(false);
  };

  const showHistory = (q: Question) => { setSelectedQuestion(q); setHistoryModalOpen(true); };
  const showPreview = (q: Question) => { setSelectedQuestion(q); setPreviewModalOpen(true); };

  const complexityColor = (c: Complexity) => {
    switch (c) {
      case 'easy': return 'bg-success/10 text-success';
      case 'medium': return 'bg-warning/10 text-warning';
      case 'hard': return 'bg-destructive/10 text-destructive';
    }
  };

  const typeIcon = (t: QuestionType) => {
    switch (t) {
      case 'true_false': return '✓✗';
      case 'yes_no': return '👍';
      case 'mcq': return '🔘';
      case 'fill_blank': return '📝';
      case 'ranking': return '📊';
      case 'matching': return '🔗';
    }
  };

  return (
    <AppLayout>
      <PageHeader title="الأسئلة" description="إدارة بنك الأسئلة" icon={HelpCircle} actionLabel="إضافة يدوية" onAction={openManual}>
        <button onClick={() => setAiModalOpen(true)} className="bg-accent text-accent-foreground px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-accent/80 transition-colors border border-border">
          <Sparkles className="w-4 h-4 text-primary" /> توليد بالذكاء الاصطناعي
        </button>
      </PageHeader>

      {questions.length === 0 ? (
        <EmptyState icon="❓" title="لا توجد أسئلة" description="أضف أسئلة يدوياً أو استخدم الذكاء الاصطناعي لتوليدها" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {questions.map((q, i) => (
            <div key={q.id} className="bg-card rounded-2xl border border-border p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-300 animate-fade-in flex flex-col" style={{ animationDelay: `${i * 0.04}s` }}>
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{typeIcon(q.type)}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{QUESTION_TYPE_LABELS[q.type]}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${complexityColor(q.complexity)}`}>{COMPLEXITY_LABELS[q.complexity]}</span>
                </div>
              </div>

              {/* Question text */}
              <p className="text-sm font-bold text-foreground mb-3 leading-relaxed line-clamp-2">{q.question}</p>

              {/* MCQ options */}
              {q.type === 'mcq' && q.options && q.options.length > 0 && (
                <div className="space-y-1.5 mb-3">
                  {q.options.map((opt, idx) => (
                    <div key={idx} className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border ${opt === q.answer ? 'border-success bg-success/10 text-success font-bold' : 'border-border bg-muted/50 text-muted-foreground'}`}>
                      {opt === q.answer ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <XCircle className="w-3.5 h-3.5 shrink-0 opacity-40" />}
                      {opt}
                    </div>
                  ))}
                </div>
              )}

              {/* Non-MCQ answer */}
              {q.type !== 'mcq' && (
                <div className="flex items-center gap-2 mb-3 text-xs text-success bg-success/10 px-3 py-1.5 rounded-lg border border-success/20">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-medium">الإجابة: {q.answer}</span>
                </div>
              )}

              {/* Meta */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto pt-3 border-t border-border">
                <span>📄 ص{q.page}</span>
                <span>📁 {q.chapter}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 mt-3">
                <button onClick={() => showPreview(q)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-xs font-medium transition-colors">
                  <Eye className="w-3.5 h-3.5" /> معاينة
                </button>
                <button onClick={() => openEdit(q)} className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-accent transition-colors">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                {q.history.length > 0 && (
                  <button onClick={() => showHistory(q)} className="p-2 rounded-lg text-info hover:bg-info/10 transition-colors">
                    <History className="w-3.5 h-3.5" />
                  </button>
                )}
                <button onClick={() => handleDelete(q.id)} className="p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Manual Entry Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'تعديل السؤال' : 'إضافة سؤال'} size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">المساعد</label>
            <select value={form.assistant_id} onChange={(e) => setForm({ ...form, assistant_id: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="">اختر مساعد</option>
              {assistants.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">النوع</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as QuestionType })} className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                {Object.entries(QUESTION_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">الصعوبة</label>
              <select value={form.complexity} onChange={(e) => setForm({ ...form, complexity: e.target.value as Complexity })} className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                {Object.entries(COMPLEXITY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">السؤال</label>
            <textarea value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none h-20" placeholder="نص السؤال" />
          </div>

          {form.type === 'mcq' && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">الخيارات (اختر الإجابة الصحيحة)</label>
              <div className="space-y-2">
                {form.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, answer: opt })}
                      className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center shrink-0 transition-colors ${opt && opt === form.answer ? 'border-success bg-success/10 text-success' : 'border-border bg-muted text-muted-foreground'}`}
                    >
                      {opt && opt === form.answer ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs">{String.fromCharCode(1571 + idx)}</span>}
                    </button>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...form.options];
                        newOpts[idx] = e.target.value;
                        setForm({ ...form, options: newOpts });
                      }}
                      className="flex-1 px-4 py-2 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder={`الخيار ${idx + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {form.type !== 'mcq' && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">الإجابة</label>
              <input type="text" value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="الإجابة الصحيحة" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">الفصل</label>
              <input type="text" value={form.chapter} onChange={(e) => setForm({ ...form, chapter: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="اسم الفصل" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">الصفحة</label>
              <input type="number" value={form.page} onChange={(e) => setForm({ ...form, page: parseInt(e.target.value) || 1 })} className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={handleSave} className="flex-1 gradient-primary text-primary-foreground py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">{editingId ? 'حفظ التعديلات' : 'إضافة'}</button>
            <button onClick={() => setModalOpen(false)} className="px-6 py-2.5 rounded-xl bg-muted text-muted-foreground text-sm font-medium hover:bg-accent transition-colors">إلغاء</button>
          </div>
        </div>
      </Modal>

      {/* AI Generation Modal */}
      <Modal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} title="توليد أسئلة بالذكاء الاصطناعي" size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">المساعد</label>
            <select value={aiForm.assistant_id} onChange={(e) => setAiForm({ ...aiForm, assistant_id: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="">اختر مساعد</option>
              {assistants.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <p className="text-sm font-medium text-foreground">حدد عدد الأسئلة لكل نوع:</p>
          <div className="grid grid-cols-2 gap-4">
            {([['true_false', 'صح / خطأ'], ['yes_no', 'نعم / لا'], ['mcq', 'اختيار من متعدد'], ['fill_blank', 'أكمل الفراغ'], ['ranking', 'ترتيب'], ['matching', 'مطابقة']] as const).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between bg-muted rounded-xl px-4 py-3">
                <span className="text-sm text-foreground">{label}</span>
                <input type="number" min={0} value={aiForm[key]} onChange={(e) => setAiForm({ ...aiForm, [key]: parseInt(e.target.value) || 0 })} className="w-16 px-2 py-1 rounded-lg bg-card border border-border text-foreground text-sm text-center focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            ))}
          </div>
          <button onClick={handleAIGenerate} className="w-full flex items-center justify-center gap-2 gradient-primary text-primary-foreground py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity shadow-glow">
            <Sparkles className="w-4 h-4" /> توليد الأسئلة
          </button>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal isOpen={previewModalOpen} onClose={() => setPreviewModalOpen(false)} title="معاينة السؤال" size="lg">
        {selectedQuestion && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">{QUESTION_TYPE_LABELS[selectedQuestion.type]}</span>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${complexityColor(selectedQuestion.complexity)}`}>{COMPLEXITY_LABELS[selectedQuestion.complexity]}</span>
              <span className="text-xs bg-muted text-muted-foreground px-3 py-1 rounded-full">📁 {selectedQuestion.chapter}</span>
              <span className="text-xs bg-muted text-muted-foreground px-3 py-1 rounded-full">📄 صفحة {selectedQuestion.page}</span>
            </div>

            <div className="bg-muted rounded-2xl p-6">
              <p className="text-lg font-bold text-foreground leading-relaxed">{selectedQuestion.question}</p>
            </div>

            {selectedQuestion.type === 'mcq' && selectedQuestion.options && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">الخيارات:</p>
                {selectedQuestion.options.map((opt, idx) => (
                  <div key={idx} className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-colors ${opt === selectedQuestion.answer ? 'border-success bg-success/10' : 'border-border bg-card'}`}>
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${opt === selectedQuestion.answer ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className={`text-sm ${opt === selectedQuestion.answer ? 'text-success font-bold' : 'text-foreground'}`}>{opt}</span>
                    {opt === selectedQuestion.answer && <CheckCircle2 className="w-5 h-5 text-success mr-auto" />}
                  </div>
                ))}
              </div>
            )}

            {selectedQuestion.type !== 'mcq' && (
              <div className="bg-success/10 border border-success/20 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                <div>
                  <p className="text-xs text-success font-medium mb-0.5">الإجابة الصحيحة</p>
                  <p className="text-sm font-bold text-foreground">{selectedQuestion.answer}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* History Modal */}
      <Modal isOpen={historyModalOpen} onClose={() => setHistoryModalOpen(false)} title="سجل التعديلات">
        <div className="space-y-3">
          {selectedQuestion?.history.map((h) => (
            <div key={h.id} className="bg-muted rounded-xl p-4">
              <p className="text-sm text-foreground mb-1">{h.question}</p>
              <p className="text-xs text-muted-foreground">الإجابة: {h.answer}</p>
              <p className="text-xs text-muted-foreground mt-1">{new Date(h.generated_at).toLocaleString('ar-SA')}</p>
            </div>
          ))}
          {(!selectedQuestion?.history || selectedQuestion.history.length === 0) && (
            <p className="text-sm text-muted-foreground text-center py-4">لا يوجد سجل تعديلات</p>
          )}
        </div>
      </Modal>
    </AppLayout>
  );
};

export default Questions;
