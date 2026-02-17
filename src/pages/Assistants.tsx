import { useState } from 'react';
import { Bot, Eye, EyeOff, Pencil, Trash2, Upload, Tag, Send, Plus, X } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Assistant, AssistantFile } from '@/types';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/shared/PageHeader';
import Modal from '@/components/shared/Modal';
import EmptyState from '@/components/shared/EmptyState';

const Assistants = () => {
  const { assistants, setAssistants, categories } = useAppContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [filesModalOpen, setFilesModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null);
  const [form, setForm] = useState({ user_id: 'u1', name: '', description: '', category_id: '', visibility: true });
  const [newFileName, setNewFileName] = useState('');
  const [newFileTag, setNewFileTag] = useState('');

  const openAdd = () => {
    setEditingId(null);
    setForm({ user_id: 'u1', name: '', description: '', category_id: '', visibility: true });
    setModalOpen(true);
  };

  const openEdit = (a: Assistant) => {
    setEditingId(a.id);
    setForm({ user_id: a.user_id, name: a.name, description: a.description, category_id: a.category_id, visibility: a.visibility });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editingId) {
      setAssistants((prev) => prev.map((a) => (a.id === editingId ? { ...a, ...form } : a)));
    } else {
      setAssistants((prev) => [...prev, { ...form, id: Date.now().toString(), files: [] }]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => setAssistants((prev) => prev.filter((a) => a.id !== id));

  const openFiles = (a: Assistant) => {
    setSelectedAssistant(a);
    setFilesModalOpen(true);
  };

  const addFile = () => {
    if (!newFileName.trim() || !selectedAssistant) return;
    const newFile: AssistantFile = { id: Date.now().toString(), name: newFileName, url: '#', tags: [] };
    setAssistants((prev) =>
      prev.map((a) => (a.id === selectedAssistant.id ? { ...a, files: [...a.files, newFile] } : a))
    );
    setSelectedAssistant((prev) => prev ? { ...prev, files: [...prev.files, newFile] } : prev);
    setNewFileName('');
  };

  const removeFile = (fileId: string) => {
    if (!selectedAssistant) return;
    setAssistants((prev) =>
      prev.map((a) => (a.id === selectedAssistant.id ? { ...a, files: a.files.filter((f) => f.id !== fileId) } : a))
    );
    setSelectedAssistant((prev) => prev ? { ...prev, files: prev.files.filter((f) => f.id !== fileId) } : prev);
  };

  const addTag = (fileId: string) => {
    if (!newFileTag.trim() || !selectedAssistant) return;
    const updateFiles = (files: AssistantFile[]) =>
      files.map((f) => (f.id === fileId ? { ...f, tags: [...f.tags, newFileTag] } : f));
    setAssistants((prev) =>
      prev.map((a) => (a.id === selectedAssistant.id ? { ...a, files: updateFiles(a.files) } : a))
    );
    setSelectedAssistant((prev) => prev ? { ...prev, files: updateFiles(prev.files) } : prev);
    setNewFileTag('');
  };

  const removeTag = (fileId: string, tag: string) => {
    if (!selectedAssistant) return;
    const updateFiles = (files: AssistantFile[]) =>
      files.map((f) => (f.id === fileId ? { ...f, tags: f.tags.filter((t) => t !== tag) } : f));
    setAssistants((prev) =>
      prev.map((a) => (a.id === selectedAssistant.id ? { ...a, files: updateFiles(a.files) } : a))
    );
    setSelectedAssistant((prev) => prev ? { ...prev, files: updateFiles(prev.files) } : prev);
  };

  return (
    <AppLayout>
      <PageHeader
        title="المساعدون الذكيون"
        description="إدارة المساعدين وملفاتهم"
        icon={Bot}
        actionLabel="إضافة مساعد"
        onAction={openAdd}
      />

      {assistants.length === 0 ? (
        <EmptyState icon="🤖" title="لا يوجد مساعدون" description="أضف أول مساعد ذكي لبدء توليد الأسئلة" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {assistants.map((a, i) => {
            const cat = categories.find((c) => c.id === a.category_id);
            return (
              <div key={a.id} className="bg-card rounded-2xl border border-border p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-foreground text-lg">{a.name}</h3>
                    {cat && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{cat.name}</span>}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${a.visibility ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                    {a.visibility ? 'مرئي' : 'مخفي'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{a.description}</p>
                <div className="flex items-center gap-2 mb-4">
                  <Upload className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{a.files.length} ملفات</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openFiles(a)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors">
                    <Upload className="w-3.5 h-3.5" /> الملفات
                  </button>
                  <button onClick={() => openEdit(a)} className="flex items-center justify-center p-2 rounded-lg bg-muted text-muted-foreground hover:bg-accent transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(a.id)} className="flex items-center justify-center p-2 rounded-lg bg-muted text-destructive hover:bg-destructive/10 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'تعديل المساعد' : 'إضافة مساعد جديد'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">الاسم</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="اسم المساعد" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">الوصف</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none h-20" placeholder="وصف المساعد" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">التصنيف</label>
            <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="">اختر تصنيف</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={handleSave} className="flex-1 gradient-primary text-primary-foreground py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">
              {editingId ? 'حفظ التعديلات' : 'إضافة'}
            </button>
            <button onClick={() => setModalOpen(false)} className="px-6 py-2.5 rounded-xl bg-muted text-muted-foreground text-sm font-medium hover:bg-accent transition-colors">إلغاء</button>
          </div>
        </div>
      </Modal>

      {/* Files Modal */}
      <Modal isOpen={filesModalOpen} onClose={() => setFilesModalOpen(false)} title={`ملفات: ${selectedAssistant?.name || ''}`} size="lg">
        <div className="space-y-4">
          {/* Add file */}
          <div className="flex gap-2">
            <input type="text" value={newFileName} onChange={(e) => setNewFileName(e.target.value)} className="flex-1 px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="اسم الملف (مثال: كتاب.pdf)" />
            <button onClick={addFile} className="gradient-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Files list */}
          {selectedAssistant?.files.map((file) => (
            <div key={file.id} className="bg-muted rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{file.name}</span>
                <button onClick={() => removeFile(file.id)} className="text-destructive hover:bg-destructive/10 p-1 rounded">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {file.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                    <Tag className="w-3 h-3" />{tag}
                    <button onClick={() => removeTag(file.id, tag)}><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-1.5">
                <input type="text" value={newFileTag} onChange={(e) => setNewFileTag(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTag(file.id)} className="flex-1 px-3 py-1.5 rounded-lg bg-card border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-ring" placeholder="أضف وسم..." />
                <button onClick={() => addTag(file.id)} className="text-primary text-xs px-2 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">إضافة</button>
              </div>
            </div>
          ))}

          {/* Send to AI simulation */}
          <div className="border-t border-border pt-4">
            <button className="w-full flex items-center justify-center gap-2 gradient-primary text-primary-foreground py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity shadow-glow">
              <Send className="w-4 h-4" />
              إرسال الملفات إلى OpenAI لتوليد الأسئلة
            </button>
            <p className="text-xs text-muted-foreground text-center mt-2">سيتم إرسال الملفات المحددة لتوليد أسئلة تلقائياً</p>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
};

export default Assistants;
