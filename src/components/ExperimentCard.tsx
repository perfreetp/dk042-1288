import { useNavigate } from 'react-router-dom';
import {
  Play,
  Pause,
  CheckCircle,
  Clock,
  ChevronRight,
  Settings,
} from 'lucide-react';
import type { Experiment } from '@/types';
import { cn } from '@/lib/utils';

interface ExperimentCardProps {
  experiment: Experiment;
  index?: number;
}

export default function ExperimentCard({ experiment, index = 0 }: ExperimentCardProps) {
  const navigate = useNavigate();

  const statusConfig = {
    running: {
      label: '进行中',
      icon: Play,
      bgClass: 'bg-success-50 text-success-600',
      dotClass: 'bg-success-500',
    },
    paused: {
      label: '已暂停',
      icon: Pause,
      bgClass: 'bg-warning-50 text-warning-600',
      dotClass: 'bg-warning-500',
    },
    ended: {
      label: '已结束',
      icon: CheckCircle,
      bgClass: 'bg-slate-100 text-slate-500',
      dotClass: 'bg-slate-400',
    },
    draft: {
      label: '草稿',
      icon: Clock,
      bgClass: 'bg-slate-100 text-slate-500',
      dotClass: 'bg-slate-400',
    },
  };

  const typeConfig = {
    entry: { label: '功能入口', color: 'bg-primary-50 text-primary-600' },
    popup: { label: '弹窗文案', color: 'bg-warning-50 text-warning-600' },
    benefit: { label: '会员权益', color: 'bg-success-50 text-success-600' },
  };

  const config = statusConfig[experiment.status];
  const typeConfigData = typeConfig[experiment.type];

  const handleClick = () => {
    if (experiment.status === 'draft') {
      navigate(`/experiments/${experiment.id}/version`);
    } else {
      navigate(`/experiments/${experiment.id}/metrics`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer hover:-translate-y-1 group animate-fade-in-up"
      style={{ animationDelay: `${index * 50}ms`}}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
              config.bgClass
            )}
          >
            <span className={cn('w-1.5 h-1.5 rounded-full', config.dotClass, experiment.status === 'running' && 'animate-pulse-soft')}></span>
            {config.label}
          </span>
          <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium', typeConfigData.color)}>
            {typeConfigData.label}
          </span>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/experiments/${experiment.id}/version`);
          }}
          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      <h3 className="text-base font-semibold text-slate-800 mb-2 group-hover:text-primary-600 transition-colors">
        {experiment.name}
      </h3>
      
      <p className="text-sm text-slate-500 mb-4 line-clamp-2">
        {experiment.description}
      </p>

      <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
        <span>{experiment.appName}</span>
        <span>·</span>
        <span>{experiment.appVersion}</span>
      </div>

      {experiment.status !== 'draft' && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-500 text-xs">实验进度</span>
            <span className="text-slate-700 text-xs font-medium">{experiment.progress}%</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
              style={{ width: `${experiment.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <span className="text-xs text-slate-400">
          {experiment.startTime ? `开始于 ${experiment.startTime}` : '未开始'}
        </span>
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary-500 transition-colors" />
      </div>
    </div>
  );
}
