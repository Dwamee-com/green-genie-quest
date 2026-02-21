import { useState } from 'react';
import { LayoutGrid, Eye, EyeOff, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Category } from '@/types';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/shared/PageHeader';
import Modal from '@/components/shared/Modal';
import EmptyState from '@/components/shared/EmptyState';

const initialForm: Omit<Category, 'id'> = {
  user_id: 'u1',
  name: '',
  description: '',
  visibility: true,
  parent_id: null,
  image: '',
};

const Categories = () => {
  const { categories, setCategories } = useAppContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);

  const openAdd = () => {
    setEditingId(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditingId(cat.id);
    setForm({ user_id: cat.user_id, name: cat.name, description: cat.description, visibility: cat.visibility, parent_id: cat.parent_id, image: cat.image });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editingId) {
      setCategories((prev) => prev.map((c) => (c.id === editingId ? { ...c, ...form } : c)));
    } else {
      setCategories((prev) => [...prev, { ...form, id: Date.now().toString() }]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const toggleVisibility = (id: string) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, visibility: !c.visibility } : c)));
  };

  const parentCategories = categories.filter((c) => !c.parent_id);

  return (
    <AppLayout>
      <PageHeader
        title="التصنيفات"
        description="إدارة تصنيفات الأسئلة والاختبارات"
        icon={LayoutGrid}
        actionLabel="إضافة تصنيف"
        onAction={openAdd}
      />

      {categories.length === 0 ? (
        <EmptyState icon="📂" title="لا توجد تصنيفات" description="أضف أول تصنيف لبدء تنظيم أسئلتك واختباراتك" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, i) => {
            const parent = categories.find((c) => c.id === cat.parent_id);
            return (
              <div
                key={cat.id}
                className="bg-card rounded-2xl border border-border p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{cat.image || '📁'}</span>
                    <div>
                      <h3 className="font-bold text-foreground">{cat.name}</h3>
                      {parent && (
                        <span className="text-xs text-muted-foreground">← {parent.name}</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleVisibility(cat.id)}
                    className={`p-2 rounded-lg transition-colors ${cat.visibility ? 'text-primary bg-primary/10' : 'text-muted-foreground bg-muted'}`}
                  >
                    {cat.visibility ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{cat.description}</p>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/categories/${cat.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-sm font-medium transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    عرض
                  </Link>
                  <button
                    onClick={() => openEdit(cat)}
                    className="flex items-center justify-center p-2 rounded-lg bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="flex items-center justify-center p-2 rounded-lg bg-muted text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">الاسم</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="اسم التصنيف"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">الوصف</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none h-20"
              placeholder="وصف التصنيف"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">الأيقونة أو رابط الصورة</label>
            <input
              type="text"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="📁 أو رابط صورة"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">التصنيف الأب</label>
            <select
              value={form.parent_id || ''}
              onChange={(e) => setForm({ ...form, parent_id: e.target.value || null })}
              className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">بدون تصنيف أب</option>
              {parentCategories.filter((c) => c.id !== editingId).map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-foreground">مرئي</label>
            <button
              onClick={() => setForm({ ...form, visibility: !form.visibility })}
              className={`w-12 h-6 rounded-full transition-colors relative ${form.visibility ? 'bg-primary' : 'bg-muted-foreground/30'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-card shadow transition-transform ${form.visibility ? 'right-0.5' : 'left-0.5'}`} />
            </button>
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={handleSave} className="flex-1 gradient-primary text-primary-foreground py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">
              {editingId ? 'حفظ التعديلات' : 'إضافة'}
            </button>
            <button onClick={() => setModalOpen(false)} className="px-6 py-2.5 rounded-xl bg-muted text-muted-foreground text-sm font-medium hover:bg-accent transition-colors">
              إلغاء
            </button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
};

export default Categories;
