import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutGrid,
  Bot,
  HelpCircle,
  FileText,
  ClipboardList,
  Home,
  ChevronRight,
  Brain,
  Headphones,
  LayoutDashboard,
  BarChart3,
  Trash2,
  CreditCard,
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'الرئيسية', icon: Home },
  { path: '/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
  { path: '/categories', label: 'التصنيفات', icon: LayoutGrid },
  { path: '/assistants', label: 'المساعدون الذكيون', icon: Bot },
  { path: '/questions', label: 'الأسئلة', icon: HelpCircle },
  { path: '/exams', label: 'الاختبارات', icon: FileText },
  { path: '/exam-answers', label: 'إجابات الاختبارات', icon: ClipboardList },
  { path: '/statistics', label: 'الإحصائيات', icon: BarChart3 },
  { path: '/subscriptions', label: 'الاشتراكات', icon: CreditCard },
  { path: '/trash', label: 'سلة المحذوفات', icon: Trash2 },
  { path: '/support', label: 'الدعم الفني', icon: Headphones },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed right-0 top-0 h-screen w-64 bg-sidebar text-sidebar-foreground flex flex-col z-50">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Brain className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold">الاستبيانات</h1>
            <p className="text-xs text-sidebar-foreground/60">منصة ذكية</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-primary'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="w-4 h-4 rotate-180" />}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="bg-sidebar-accent rounded-lg p-3">
          <p className="text-xs text-sidebar-foreground/70">الإصدار 1.0</p>
          <p className="text-xs text-sidebar-primary font-medium">مدعوم بالذكاء الاصطناعي</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
