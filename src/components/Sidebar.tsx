import { NavLink, useParams } from 'react-router-dom';
import {
  LayoutDashboard,
  FlaskConical,
  Settings,
  Users,
  BarChart3,
  FileCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { id } = useParams();

  const navItems = [
    { icon: LayoutDashboard, label: '实验首页', path: '/' },
    { icon: FlaskConical, label: '实验列表', path: '/experiments' },
  ];

  const experimentNavItems = id
    ? [
        { icon: Settings, label: '版本配置', path: `/experiments/${id}/version` },
        { icon: Users, label: '分群规则', path: `/experiments/${id}/segmentation` },
        { icon: BarChart3, label: '实时指标', path: `/experiments/${id}/metrics` },
        { icon: FileCheck, label: '实验结论', path: `/experiments/${id}/conclusion` },
      ]
    : [];

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full bg-white border-r border-slate-200 transition-all duration-300 z-40',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
        <div className={cn('flex items-center gap-3', collapsed && 'justify-center w-full')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
            <FlaskConical className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="font-bold text-slate-800 text-lg leading-tight">灰度实验</h1>
              <p className="text-xs text-slate-500">A/B Testing Platform</p>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onToggle}
        className={cn(
          'absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow z-10',
          collapsed && 'left-1/2 -translate-x-1/2 right-auto'
        )}
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-slate-500" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-slate-500" />
        )}
      </button>

      <nav className="py-4 px-3 space-y-1">
        {!collapsed && (
          <p className="px-3 py-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
            总览
          </p>
        )}
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                collapsed && 'justify-center'
              )
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}

        {experimentNavItems.length > 0 && (
          <>
            {!collapsed && (
              <p className="px-3 py-2 mt-6 text-xs font-medium text-slate-400 uppercase tracking-wider">
                实验详情
              </p>
            )}
            {experimentNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                    collapsed && 'justify-center'
                  )
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      <div className={cn('absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200', collapsed && 'px-2')}>
        <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
            alt="用户头像"
            className="w-9 h-9 rounded-full bg-slate-100"
          />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">运营管理员</p>
              <p className="text-xs text-slate-500 truncate">admin@example.com</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
