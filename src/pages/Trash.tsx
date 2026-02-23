import { useState } from 'react';
import { Trash2, LayoutGrid, Bot, FileText, HelpCircle, RotateCcw, Eye } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/shared/PageHeader';
import Modal from '@/components/shared/Modal';
import EmptyState from '@/components/shared/EmptyState';

type TrashType = 'categories' | 'sources' | 'documents' | 'questions';

interface TrashItem {
  id: string;
  name: string;
  type: TrashType;
  deletedAt: string;
  details?: string;
}

const mockTrash: TrashItem[] = [
  { id: 't1', name: 'التاريخ', type: 'categories', deletedAt: '2024-03-01', details: 'تصنيف يحتوي على 5 مساعدين' },
  { id: 't2', name: 'مساعد اللغة الإنجليزية', type: 'sources', deletedAt: '2024-03-05', details: '3 ملفات مرفوعة' },
  { id: 't3', name: 'كتاب_الفيزياء.pdf', type: 'documents', deletedAt: '2024-03-08', details: '25 صفحة' },
  { id: 't4', name: 'ما هو أكبر كوكب؟', type: 'questions', deletedAt: '2024-03-10', details: 'اختيار من متعدد - متوسط' },
  { id: 't5', name: 'النحو', type: 'categories', deletedAt: '2024-03-12', details: 'تصنيف فرعي' },
  { id: 't6', name: 'ما عاصمة مصر؟', type: 'questions', deletedAt: '2024-03-15', details: 'اختيار من متعدد - سهل' },
];

const typeConfig: Record<TrashType, { label: string; icon: typeof LayoutGrid; color: string }> = {
  categories: { label: 'التصنيفات', icon: LayoutGrid, color: 'text-primary' },
  sources: { label: 'المصادر', icon: Bot, color: 'text-info' },
  documents: { label: 'مستندات الأسئلة', icon: FileText, color: 'text-warning' },
  questions: { label: 'الأسئلة', icon: HelpCircle, color: 'text-destructive' },
};

const Trash = () => {
  const [trashItems, setTrashItems] = useState<TrashItem[]>(mockTrash);
  const [activeTab, setActiveTab] = useState<TrashType | 'all'>('all');
  const [viewItems, setViewItems] = useState<TrashType | null>(null);

  const counts: Record<TrashType, number> = {
    categories: trashItems.filter(t => t.type === 'categories').length,
    sources: trashItems.filter(t => t.type === 'sources').length,
    documents: trashItems.filter(t => t.type === 'documents').length,
    questions: trashItems.filter(t => t.type === 'questions').length,
  };

  const filteredItems = activeTab === 'all' ? trashItems : trashItems.filter(t => t.type === activeTab);

  const handleRestore = (id: string) => {
    setTrashItems(prev => prev.filter(t => t.id !== id));
  };

  const tabs: { key: TrashType | 'all'; label: string }[] = [
    { key: 'all', label: 'الكل' },
    { key: 'categories', label: 'التصنيفات' },
    { key: 'sources', label: 'المصادر' },
    { key: 'documents', label: 'المستندات' },
    { key: 'questions', label: 'الأسئلة' },
  ];

  return (
    <AppLayout>
      <PageHeader title="سلة المحذوفات" description="استعادة العناصر المحذوفة" icon={Trash2} />

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {(Object.keys(typeConfig) as TrashType[]).map((type) => {
          const config = typeConfig[type];
          const Icon = config.icon;
          return (
            <button
              key={type}
              onClick={() => { setActiveTab(type); }}
              className="bg-card rounded-2xl border border-border p-5 text-center hover:shadow-lg hover:border-primary/30 transition-all"
            >
              <Icon className={`w-6 h-6 ${config.color} mx-auto mb-2`} />
              <p className="text-2xl font-black text-foreground">{counts[type]}</p>
              <p className="text-xs text-muted-foreground mt-1">{config.label}</p>
            </button>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === tab.key ? 'gradient-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'
            }`}
          >
            {tab.label}
            {tab.key !== 'all' && (
              <span className="mr-1.5 text-xs opacity-70">({counts[tab.key as TrashType]})</span>
            )}
          </button>
        ))}
      </div>

      {/* Items */}
      {filteredItems.length === 0 ? (
        <EmptyState icon="🗑️" title="سلة المحذوفات فارغة" description="لا توجد عناصر محذوفة في هذا القسم" />
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item, i) => {
            const config = typeConfig[item.type];
            const Icon = config.icon;
            return (
              <div
                key={item.id}
                className="bg-card rounded-xl border border-border p-4 flex items-center justify-between hover:border-primary/30 transition-all animate-fade-in"
                style={{ animationDelay: `${i * 0.03}s` }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${config.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{item.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">{config.label}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">حُذف في {new Date(item.deletedAt).toLocaleDateString('ar-SA')}</span>
                    </div>
                    {item.details && <p className="text-xs text-muted-foreground mt-0.5">{item.details}</p>}
                  </div>
                </div>
                <button
                  onClick={() => handleRestore(item.id)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-success/10 text-success hover:bg-success/20 text-xs font-medium transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  استعادة
                </button>
              </div>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
};

export default Trash;
