import { Bell, Search, Plus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useExperimentStore } from '@/store/useExperimentStore';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const addExperiment = useExperimentStore(state => state.addExperiment);

  const handleCreateExperiment = () => {
    const newId = `exp-${Date.now()}`;
    addExperiment({
      name: '新实验',
      description: '点击编辑实验描述',
      status: 'draft',
      appVersion: 'v5.2.0',
      appName: '乐享生活',
      startTime: '',
      type: 'entry',
      hypothesis: '请输入实验假设',
    });
    navigate(`/experiments/${newId}/version`);
  };

  const showCreateButton = location.pathname === '/' || location.pathname === '/experiments';

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="搜索实验..."
            className="w-64 pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
          />
        </div>

        <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-warning-500 rounded-full"></span>
        </button>

        {showCreateButton && (
          <button
            onClick={handleCreateExperiment}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-primary text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-primary-500/25 transition-all hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            创建实验
          </button>
        )}
      </div>
    </header>
  );
}
