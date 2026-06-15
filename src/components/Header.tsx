import { useState } from 'react';
import { Bell, Search, Plus, X, UserPlus, MessageSquare } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useExperimentStore } from '@/store/useExperimentStore';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { addExperiment, notifications, getUnreadNotificationCount, markNotificationRead } = useExperimentStore();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = getUnreadNotificationCount();

  const handleCreateExperiment = () => {
    const newId = addExperiment({
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

  const handleNotificationClick = (notif: any) => {
    markNotificationRead(notif.id);
    setShowNotifications(false);
    navigate(`/experiments/${notif.experimentId}/conclusion`);
    setTimeout(() => {
      const discussionSection = document.getElementById('discussion-section');
      if (discussionSection) {
        discussionSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
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

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-warning-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800">通知中心</h3>
                  <span className="text-xs text-slate-400">{unreadCount} 条未读</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-sm">
                      暂无通知
                    </div>
                  ) : (
                    notifications.slice(0, 10).map((notif: any) => (
                      <div
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={cn(
                          'px-4 py-3 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors',
                          !notif.isRead && 'bg-primary-50/50'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                            notif.type === 'invite' ? 'bg-primary-100 text-primary-600' : 'bg-warning-100 text-warning-600'
                          )}>
                            {notif.type === 'invite' ? <UserPlus className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-800 leading-snug">{notif.content}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-slate-400">{notif.fromUserName}</span>
                              <span className="text-xs text-slate-300">·</span>
                              <span className="text-xs text-slate-400">{notif.experimentName}</span>
                            </div>
                          </div>
                          {!notif.isRead && (
                            <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-2" />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

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
