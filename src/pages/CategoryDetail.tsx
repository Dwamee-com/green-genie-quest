import { useParams, Link } from 'react-router-dom';
import { LayoutGrid, Bot, HelpCircle, ArrowRight, Eye } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import AppLayout from '@/components/layout/AppLayout';

const CategoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { categories, assistants, questions } = useAppContext();
  const category = categories.find((c) => c.id === id);
  const catAssistants = assistants.filter((a) => a.category_id === id);
  const catQuestions = questions.filter((q) => catAssistants.some((a) => a.id === q.assistant_id));

  if (!category) {
    return (
      <AppLayout>
        <div className="text-center py-20">
          <p className="text-muted-foreground">التصنيف غير موجود</p>
          <Link to="/categories" className="text-primary hover:underline mt-2 inline-block">العودة للتصنيفات</Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/categories" className="hover:text-foreground transition-colors">التصنيفات</Link>
        <ArrowRight className="w-3 h-3 rotate-180" />
        <span className="text-foreground font-medium">{category.name}</span>
      </div>

      {/* Header */}
      <div className="bg-card rounded-2xl border border-border p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl">{category.image || '📁'}</span>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{category.name}</h1>
            <p className="text-sm text-muted-foreground">{category.description}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
            <HelpCircle className="w-6 h-6 text-primary mx-auto mb-1" />
            <p className="text-2xl font-black text-foreground">{catQuestions.length}</p>
            <p className="text-xs text-muted-foreground">سؤال</p>
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
            <Bot className="w-6 h-6 text-primary mx-auto mb-1" />
            <p className="text-2xl font-black text-foreground">{catAssistants.length}</p>
            <p className="text-xs text-muted-foreground">مساعد</p>
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
            <LayoutGrid className="w-6 h-6 text-primary mx-auto mb-1" />
            <p className="text-2xl font-black text-foreground">{category.visibility ? 'مرئي' : 'مخفي'}</p>
            <p className="text-xs text-muted-foreground">الحالة</p>
          </div>
        </div>
      </div>

      {/* Assistants in this category */}
      <h2 className="text-lg font-bold text-foreground mb-4">المساعدون في هذا التصنيف</h2>
      {catAssistants.length === 0 ? (
        <p className="text-sm text-muted-foreground bg-muted rounded-xl p-6 text-center">لا يوجد مساعدون في هذا التصنيف</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {catAssistants.map((a) => {
            const aQuestions = questions.filter((q) => q.assistant_id === a.id);
            return (
              <div key={a.id} className="bg-card rounded-2xl border border-border p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-300">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-foreground">{a.name}</h3>
                    <p className="text-xs text-muted-foreground">{a.description}</p>
                  </div>
                  <Link to={`/assistants/${a.id}`} className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5" /> {aQuestions.length} سؤال</span>
                  <span className="flex items-center gap-1">📎 {a.files.length} ملف</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
};

export default CategoryDetail;
