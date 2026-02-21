import { useParams, Link } from 'react-router-dom';
import { Bot, HelpCircle, Upload, ArrowRight, Tag } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { QUESTION_TYPE_LABELS, COMPLEXITY_LABELS } from '@/types';
import AppLayout from '@/components/layout/AppLayout';

const AssistantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { assistants, questions, categories } = useAppContext();
  const assistant = assistants.find((a) => a.id === id);
  const aQuestions = questions.filter((q) => q.assistant_id === id);
  const category = categories.find((c) => c.id === assistant?.category_id);

  if (!assistant) {
    return (
      <AppLayout>
        <div className="text-center py-20">
          <p className="text-muted-foreground">المساعد غير موجود</p>
          <Link to="/assistants" className="text-primary hover:underline mt-2 inline-block">العودة للمساعدين</Link>
        </div>
      </AppLayout>
    );
  }

  const complexityColor = (c: string) => {
    switch (c) {
      case 'easy': return 'bg-success/10 text-success';
      case 'medium': return 'bg-warning/10 text-warning';
      case 'hard': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <AppLayout>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/assistants" className="hover:text-foreground transition-colors">المساعدون</Link>
        <ArrowRight className="w-3 h-3 rotate-180" />
        <span className="text-foreground font-medium">{assistant.name}</span>
      </div>

      {/* Header */}
      <div className="bg-card rounded-2xl border border-border p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center">
            <Bot className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{assistant.name}</h1>
            <p className="text-sm text-muted-foreground">{assistant.description}</p>
            {category && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full mt-1 inline-block">{category.name}</span>}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
            <Upload className="w-6 h-6 text-primary mx-auto mb-1" />
            <p className="text-2xl font-black text-foreground">{assistant.files.length}</p>
            <p className="text-xs text-muted-foreground">ملف مرفوع</p>
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
            <HelpCircle className="w-6 h-6 text-primary mx-auto mb-1" />
            <p className="text-2xl font-black text-foreground">{aQuestions.length}</p>
            <p className="text-xs text-muted-foreground">سؤال</p>
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
            <Bot className="w-6 h-6 text-primary mx-auto mb-1" />
            <p className="text-2xl font-black text-foreground">{assistant.visibility ? 'مرئي' : 'مخفي'}</p>
            <p className="text-xs text-muted-foreground">الحالة</p>
          </div>
        </div>
      </div>

      {/* Files */}
      <h2 className="text-lg font-bold text-foreground mb-4">الملفات المرفوعة ({assistant.files.length})</h2>
      {assistant.files.length === 0 ? (
        <p className="text-sm text-muted-foreground bg-muted rounded-xl p-6 text-center mb-6">لا توجد ملفات مرفوعة</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {assistant.files.map((file) => (
            <div key={file.id} className="bg-card rounded-xl border border-border p-4">
              <p className="text-sm font-medium text-foreground mb-2">📄 {file.name}</p>
              <div className="flex flex-wrap gap-1.5">
                {file.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                    <Tag className="w-3 h-3" />{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Questions */}
      <h2 className="text-lg font-bold text-foreground mb-4">الأسئلة ({aQuestions.length})</h2>
      {aQuestions.length === 0 ? (
        <p className="text-sm text-muted-foreground bg-muted rounded-xl p-6 text-center">لا توجد أسئلة لهذا المساعد</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aQuestions.map((q) => (
            <div key={q.id} className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{QUESTION_TYPE_LABELS[q.type]}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${complexityColor(q.complexity)}`}>{COMPLEXITY_LABELS[q.complexity]}</span>
              </div>
              <p className="text-sm text-foreground font-medium line-clamp-2">{q.question}</p>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default AssistantDetail;
