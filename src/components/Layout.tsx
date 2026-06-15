import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useExperimentStore } from '@/store/useExperimentStore';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { id } = useParams();
  const location = useLocation();
  const { currentExperiment, setCurrentExperiment, experiments } = useExperimentStore();

  useEffect(() => {
    if (id && experiments.length > 0) {
      setCurrentExperiment(id);
    }
  }, [id, experiments, setCurrentExperiment]);

  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/' || path === '/experiments') {
      return { title: '实验首页', subtitle: '查看所有实验概览和关键指标' };
    }
    if (path.includes('/version')) {
      return { title: '版本配置', subtitle: currentExperiment?.name || '实验配置' };
    }
    if (path.includes('/segmentation')) {
      return { title: '分群规则', subtitle: currentExperiment?.name || '实验配置' };
    }
    if (path.includes('/metrics')) {
      return { title: '实时指标', subtitle: currentExperiment?.name || '实验数据' };
    }
    if (path.includes('/conclusion')) {
      return { title: '实验结论', subtitle: currentExperiment?.name || '实验总结' };
    }
    return { title: '灰度实验', subtitle: '' };
  };

  const { title, subtitle } = getPageTitle();

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div
        className={cn(
          'min-h-screen transition-all duration-300',
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        )}
      >
        <Header title={title} subtitle={subtitle} />
        <main className="p-6">
          <div className="animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
