import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  gradient?: 'primary' | 'success' | 'warning' | 'danger';
  delay?: number;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel = '较上周',
  gradient = 'primary',
  delay = 0,
}: StatsCardProps) {
  const gradientClasses = {
    primary: 'from-primary-500 to-primary-600',
    success: 'from-success-500 to-success-600',
    warning: 'from-warning-500 to-warning-600',
    danger: 'from-danger-500 to-danger-600',
  };

  const bgClasses = {
    primary: 'bg-primary-50',
    success: 'bg-success-50',
    warning: 'bg-warning-50',
    danger: 'bg-danger-50',
  };

  const textClasses = {
    primary: 'text-primary-600',
    success: 'text-success-600',
    warning: 'text-warning-600',
    danger: 'text-danger-600',
  };

  return (
    <div
      className="bg-white rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-800">{value}</p>
          
          {trend !== undefined && (
            <div className="flex items-center gap-1 mt-3">
              <span
                className={cn(
                  'text-xs font-medium px-2 py-0.5 rounded-full',
                  trend >= 0 ? bgClasses.success + ' ' + textClasses.success : bgClasses.danger + ' ' + textClasses.danger
                )}
              >
                {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </span>
              <span className="text-xs text-slate-400">{trendLabel}</span>
            </div>
          )}
        </div>
        
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br',
            gradientClasses[gradient]
          )}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
