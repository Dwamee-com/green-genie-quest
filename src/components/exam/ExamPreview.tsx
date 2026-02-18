import { useState, useEffect, useCallback } from 'react';
import { Timer, ChevronRight, ChevronLeft, Send, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Exam, Question, QUESTION_TYPE_LABELS } from '@/types';

interface ExamPreviewProps {
  exam: Exam;
  onClose: () => void;
}

const ExamPreview = ({ exam, onClose }: ExamPreviewProps) => {
  const { questions } = useAppContext();
  const examQuestions = (exam.question_ids || []).map(id => questions.find(q => q.id === id)).filter(Boolean) as Question[];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(exam.time_in_minutes * 60);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [submitted, timeLeft]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const currentQ = examQuestions[currentIdx];
  const answeredCount = Object.keys(answers).length;
  const totalQ = examQuestions.length;

  const handleSubmit = () => setSubmitted(true);

  const score = examQuestions.reduce((acc, q) => {
    if (answers[q.id] === q.answer) acc++;
    return acc;
  }, 0);
  const percentage = totalQ > 0 ? Math.round((score / totalQ) * 100) : 0;

  if (examQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl border border-border p-8 text-center max-w-md">
          <p className="text-4xl mb-4">📝</p>
          <h2 className="text-xl font-bold text-foreground mb-2">لا توجد أسئلة</h2>
          <p className="text-sm text-muted-foreground mb-6">هذا الاختبار لا يحتوي على أسئلة بعد</p>
          <button onClick={onClose} className="gradient-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-bold">العودة</button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl border border-border p-8 text-center max-w-lg w-full">
          <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${percentage >= 60 ? 'bg-success/10' : 'bg-destructive/10'}`}>
            <span className="text-3xl">{percentage >= 85 ? '🏆' : percentage >= 60 ? '✅' : '❌'}</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">تم إنهاء الاختبار</h2>
          <p className="text-sm text-muted-foreground mb-4">{exam.title}</p>
          <div className={`text-5xl font-black mb-2 ${percentage >= 85 ? 'text-success' : percentage >= 60 ? 'text-warning' : 'text-destructive'}`}>{percentage}%</div>
          <p className="text-sm text-muted-foreground mb-6">{score} من {totalQ} إجابة صحيحة</p>

          {/* Review answers */}
          <div className="text-right space-y-3 mb-6 max-h-60 overflow-y-auto">
            {examQuestions.map((q, idx) => {
              const userAns = answers[q.id];
              const correct = userAns === q.answer;
              return (
                <div key={q.id} className={`p-3 rounded-xl border-2 ${correct ? 'border-success/30 bg-success/5' : 'border-destructive/30 bg-destructive/5'}`}>
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-bold mt-0.5">{idx + 1}.</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{q.question}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs">
                        <span className={correct ? 'text-success' : 'text-destructive'}>إجابتك: {userAns || 'لم تجب'}</span>
                        {!correct && <span className="text-success">الصحيحة: {q.answer}</span>}
                      </div>
                    </div>
                    {correct ? <CheckCircle2 className="w-5 h-5 text-success shrink-0" /> : <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />}
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={onClose} className="gradient-primary text-primary-foreground px-8 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">العودة للاختبارات</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-card border-b border-border px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-sm font-bold text-foreground truncate">{exam.title}</h1>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-1.5 text-sm font-bold ${timeLeft < 60 ? 'text-destructive animate-pulse' : timeLeft < 300 ? 'text-warning' : 'text-foreground'}`}>
              <Timer className="w-4 h-4" />
              {formatTime(timeLeft)}
            </div>
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
              {answeredCount}/{totalQ}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Question navigation dots */}
        <div className="flex items-center justify-center gap-1.5 mb-8 flex-wrap">
          {examQuestions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentIdx(idx)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                idx === currentIdx
                  ? 'bg-primary text-primary-foreground scale-110 shadow-glow'
                  : answers[q.id]
                    ? 'bg-success/20 text-success border border-success/30'
                    : 'bg-muted text-muted-foreground border border-border hover:bg-accent'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {/* Question card */}
        {currentQ && (
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                {QUESTION_TYPE_LABELS[currentQ.type]}
              </span>
              <span className="text-sm text-muted-foreground">سؤال {currentIdx + 1} من {totalQ}</span>
            </div>

            <p className="text-lg font-bold text-foreground leading-relaxed mb-6">{currentQ.question}</p>

            {/* Answer area */}
            {currentQ.type === 'mcq' && currentQ.options ? (
              <div className="space-y-2.5">
                {currentQ.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setAnswers(prev => ({ ...prev, [currentQ.id]: opt }))}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-right transition-all ${
                      answers[currentQ.id] === opt
                        ? 'border-primary bg-primary/10 shadow-sm'
                        : 'border-border bg-card hover:border-primary/30 hover:bg-muted'
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                      answers[currentQ.id] === opt ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm text-foreground">{opt}</span>
                  </button>
                ))}
              </div>
            ) : currentQ.type === 'true_false' ? (
              <div className="grid grid-cols-2 gap-3">
                {['صح', 'خطأ'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setAnswers(prev => ({ ...prev, [currentQ.id]: opt }))}
                    className={`py-4 rounded-xl border-2 text-sm font-bold transition-all ${
                      answers[currentQ.id] === opt
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-card hover:border-primary/30'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : currentQ.type === 'yes_no' ? (
              <div className="grid grid-cols-2 gap-3">
                {['نعم', 'لا'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setAnswers(prev => ({ ...prev, [currentQ.id]: opt }))}
                    className={`py-4 rounded-xl border-2 text-sm font-bold transition-all ${
                      answers[currentQ.id] === opt
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-card hover:border-primary/30'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <input
                type="text"
                value={answers[currentQ.id] || ''}
                onChange={(e) => setAnswers(prev => ({ ...prev, [currentQ.id]: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="اكتب إجابتك هنا..."
              />
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
            disabled={currentIdx === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-muted text-muted-foreground hover:bg-accent text-sm font-medium transition-colors disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" /> السابق
          </button>

          {currentIdx === totalQ - 1 ? (
            <button onClick={handleSubmit} className="flex items-center gap-2 gradient-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity shadow-glow">
              <Send className="w-4 h-4" /> إنهاء الاختبار
            </button>
          ) : (
            <button
              onClick={() => setCurrentIdx(prev => Math.min(totalQ - 1, prev + 1))}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 text-sm font-medium transition-colors"
            >
              التالي <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamPreview;
