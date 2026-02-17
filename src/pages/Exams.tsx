import { useState } from 'react';
import { FileText, Pencil, Trash2, ToggleLeft, ToggleRight, Clock, Users } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Exam } from '@/types';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/shared/PageHeader';
import Modal from '@/components/shared/Modal';
import EmptyState from '@/components/shared/EmptyState';

const Exams = () => {
  const { exams, setExams, assistants } = useAppContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    user_id: 'u1', assistant_id: '', title: '', questions_number: 10,
    start_time: '', time_in_minutes: 60, allowed_time: 90,
    is_random_mode: false, is_minus_mode: false, is_repeated_mode: false, is_public_mode: false,
  });

  const openAdd = () => {
    setEditingId(null);
    setForm({ user_id: 'u1', assistant_id: '', title: '', questions_number: 10, start_time: '', time_in_minutes: 60, allowed_time: 90, is_random_mode: false, is_minus_mode: false, is_repeated_mode: false, is_public_mode: false });
    setModalOpen(true);
  };

  const openEdit = (e: Exam) => {
    setEditingId(e.id);
    setForm({ user_id: e.user_id, assistant_id: e.assistant_id, title: e.title, questions_number: e.questions_number, start_time: e.start_time, time_in_minutes: e.time_in_minutes, allowed_time: e.allowed_time, is_random_mode: e.is_random_mode, is_minus_mode: e.is_minus_mode, is_repeated_mode: e.is_repeated_mode, is_public_mode: e.is_public_mode });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    if (editingId) {
      setExams((prev) => prev.map((e) => (e.id === editingId ? { ...e, ...form } : e)));
    } else {
      setExams((prev) => [...prev, { ...form, id: Date.now().toString() }]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => setExams((prev) => prev.filter((e) => e.id !== id));

  const ToggleSwitch = ({ value, onChange, label }: { value: boolean; onChange: () => void; label: string }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-foreground">{label}</span>
      <button onClick={onChange} className={`w-12 h-6 rounded-full transition-colors relative ${value ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-card shadow transition-transform ${value ? 'right-0.5' : 'left-0.5'}`} />
      </button>
    </div>
  );

  return (
    <AppLayout>
      <PageHeader title="الاختبارات" description="إنشاء وإدارة الاختبارات" icon={FileText} actionLabel="إنشاء اختبار" onAction={openAdd} />

      {exams.length === 0 ? (
        <EmptyState icon="📝" title="لا توجد اختبارات" description="أنشئ أول اختبار لبدء تقييم الطلاب" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {exams.map((exam, i) => {
            const assistant = assistants.find((a) => a.id === exam.assistant_id);
            return (
              <div key={exam.id} className="bg-card rounded-2xl border border-border p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-foreground text-lg">{exam.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${exam.is_public_mode ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                    {exam.is_public_mode ? 'عام' : 'خاص'}
                  </span>
                </div>
                {assistant && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{assistant.name}</span>}
                <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <HelpCircle className="w-4 h-4" /> {exam.questions_number} سؤال
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" /> {exam.time_in_minutes} دقيقة
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {exam.is_random_mode && <span className="text-xs bg-info/10 text-info px-2 py-0.5 rounded-full">عشوائي</span>}
                  {exam.is_minus_mode && <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">درجات سالبة</span>}
                  {exam.is_repeated_mode && <span className="text-xs bg-warning/10 text-warning px-2 py-0.5 rounded-full">تكرار</span>}
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <button onClick={() => openEdit(exam)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-accent text-sm font-medium transition-colors">
                    <Pencil className="w-3.5 h-3.5" /> تعديل
                  </button>
                  <button onClick={() => handleDelete(exam.id)} className="p-2 rounded-lg bg-muted text-destructive hover:bg-destructive/10 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'تعديل الاختبار' : 'إنشاء اختبار جديد'} size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">عنوان الاختبار</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="عنوان الاختبار" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">المساعد</label>
            <select value={form.assistant_id} onChange={(e) => setForm({ ...form, assistant_id: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="">اختر مساعد</option>
              {assistants.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">عدد الأسئلة</label>
              <input type="number" value={form.questions_number} onChange={(e) => setForm({ ...form, questions_number: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">المدة (دقائق)</label>
              <input type="number" value={form.time_in_minutes} onChange={(e) => setForm({ ...form, time_in_minutes: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">الوقت المسموح</label>
              <input type="number" value={form.allowed_time} onChange={(e) => setForm({ ...form, allowed_time: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">وقت البدء</label>
            <input type="datetime-local" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="bg-muted rounded-xl p-4 space-y-1">
            <p className="text-sm font-bold text-foreground mb-2">إعدادات الاختبار</p>
            <ToggleSwitch value={form.is_random_mode} onChange={() => setForm({ ...form, is_random_mode: !form.is_random_mode })} label="ترتيب عشوائي للأسئلة" />
            <ToggleSwitch value={form.is_minus_mode} onChange={() => setForm({ ...form, is_minus_mode: !form.is_minus_mode })} label="درجات سالبة" />
            <ToggleSwitch value={form.is_repeated_mode} onChange={() => setForm({ ...form, is_repeated_mode: !form.is_repeated_mode })} label="السماح بالتكرار" />
            <ToggleSwitch value={form.is_public_mode} onChange={() => setForm({ ...form, is_public_mode: !form.is_public_mode })} label="اختبار عام" />
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={handleSave} className="flex-1 gradient-primary text-primary-foreground py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">{editingId ? 'حفظ التعديلات' : 'إنشاء'}</button>
            <button onClick={() => setModalOpen(false)} className="px-6 py-2.5 rounded-xl bg-muted text-muted-foreground text-sm font-medium hover:bg-accent transition-colors">إلغاء</button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
};

const HelpCircle = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <path d="M12 17h.01" />
  </svg>
);

export default Exams;
