import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Eye,
  MousePointerClick,
  TrendingUp,
  UserCheck,
  AlertTriangle,
  Clock,
  RefreshCw,
  ChevronDown,
  ArrowRight,
  Info,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Legend,
} from 'recharts';
import { useExperimentStore } from '@/store/useExperimentStore';
import { cn } from '@/lib/utils';

type TimeRangeType = '7d' | '14d' | '30d';
type MetricType = 'clickRate' | 'conversion' | 'retention';

export default function Metrics() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {
    currentExperiment,
    currentMetrics,
    metricTrendData,
    alerts,
  } = useExperimentStore();
  
  const [timeRange, setTimeRange] = useState<TimeRangeType>('14d');
  const [activeMetric, setActiveMetric] = useState<MetricType>('clickRate');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    }
    return num.toLocaleString();
  };

  const formatPercent = (num: number, decimals: number = 1) => {
    return (num * 100).toFixed(decimals) + '%';
  };

  const controlMetrics = currentMetrics.find(m => m.type === 'control');
  const variantMetrics = currentMetrics.find(m => m.type === 'variant');

  const calculateUplift = (variant: number, control: number) => {
    if (control === 0) return 0;
    return ((variant - control) / control) * 100;
  };

  const metricCards = [
    {
      title: '曝光量',
      control: controlMetrics?.coreMetrics.impressions || 0,
      variant: variantMetrics?.coreMetrics.impressions || 0,
      icon: Eye,
      format: formatNumber,
      color: 'primary',
    },
    {
      title: '点击量',
      control: controlMetrics?.coreMetrics.clicks || 0,
      variant: variantMetrics?.coreMetrics.clicks || 0,
      icon: MousePointerClick,
      format: formatNumber,
      color: 'success',
    },
    {
      title: '点击率',
      control: controlMetrics?.coreMetrics.clickRate || 0,
      variant: variantMetrics?.coreMetrics.clickRate || 0,
      icon: TrendingUp,
      format: (v: number) => formatPercent(v, 1),
      color: 'warning',
      uplift: calculateUplift(
        variantMetrics?.coreMetrics.clickRate || 0,
        controlMetrics?.coreMetrics.clickRate || 0
      ),
    },
    {
      title: '7日留存',
      control: controlMetrics?.coreMetrics.retention7d || 0,
      variant: variantMetrics?.coreMetrics.retention7d || 0,
      icon: UserCheck,
      format: (v: number) => formatPercent(v, 1),
      color: 'primary',
      uplift: calculateUplift(
        variantMetrics?.coreMetrics.retention7d || 0,
        controlMetrics?.coreMetrics.retention7d || 0
      ),
    },
  ];

  const chartData = metricTrendData.map(item => ({
    date: item.date,
    对照组: (item.control * 100).toFixed(1),
    实验组: (item.variant * 100).toFixed(1),
  }));

  const metricTabs = [
    { key: 'clickRate' as const, label: '点击率' },
    { key: 'conversion' as const, label: '转化率' },
    { key: 'retention' as const, label: '7日留存' },
  ];

  const timeRangeOptions = [
    { key: '7d' as const, label: '近7天' },
    { key: '14d' as const, label: '近14天' },
    { key: '30d' as const, label: '近30天' },
  ];

  const severityConfig = {
    high: { bg: 'bg-danger-50', text: 'text-danger-600', border: 'border-danger-200', icon: AlertTriangle },
    medium: { bg: 'bg-warning-50', text: 'text-warning-600', border: 'border-warning-200', icon: AlertTriangle },
    low: { bg: 'bg-primary-50', text: 'text-primary-600', border: 'border-primary-200', icon: Info },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium',
            currentExperiment?.status === 'running'
              ? 'bg-success-50 text-success-600'
              : 'bg-slate-100 text-slate-500'
          )}>
            <span className={cn(
              'w-2 h-2 rounded-full',
              currentExperiment?.status === 'running' ? 'bg-success-500 animate-pulse-soft' : 'bg-slate-400'
            )}></span>
            {currentExperiment?.status === 'running' ? '实验进行中' : '实验已结束'}
          </span>
          <span className="text-sm text-slate-500">
            <Clock className="w-4 h-4 inline mr-1" />
            已运行 14 天
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 rounded-lg p-1">
            {timeRangeOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setTimeRange(opt.key)}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-md transition-all',
                  timeRange === opt.key
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            <RefreshCw className={cn('w-4 h-4', isRefreshing && 'animate-spin')} />
            刷新
          </button>
          <button
            onClick={() => navigate(`/experiments/${id}/conclusion`)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-primary text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-primary-500/25 transition-all hover:-translate-y-0.5"
          >
            查看结论
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card, index) => {
          const IconComponent = card.icon;
          const uplift = card.uplift;
          const isPositive = (uplift || 0) >= 0;
          
          return (
            <div
              key={card.title}
              className="bg-white rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <p className="text-sm text-slate-500">{card.title}</p>
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  card.color === 'primary' && 'bg-primary-50',
                  card.color === 'success' && 'bg-success-50',
                  card.color === 'warning' && 'bg-warning-50',
                )}>
                  <IconComponent className={cn(
                    'w-5 h-5',
                    card.color === 'primary' && 'text-primary-600',
                    card.color === 'success' && 'text-success-600',
                    card.color === 'warning' && 'text-warning-600',
                  )} />
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-slate-800">
                      {card.format(card.variant)}
                    </span>
                    <span className="text-xs text-slate-400">实验组</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-medium text-slate-500">
                      {card.format(card.control)}
                    </span>
                    <span className="text-xs text-slate-400">对照组</span>
                  </div>
                </div>
              </div>

              {uplift !== undefined && (
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className={cn(
                    'inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium',
                    isPositive ? 'bg-success-50 text-success-600' : 'bg-danger-50 text-danger-600'
                  )}>
                    {isPositive ? '↑' : '↓'} {Math.abs(uplift).toFixed(1)}%
                    <span className="text-slate-400 font-normal ml-1">提升</span>
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">指标趋势</h3>
                <p className="text-sm text-slate-500">对比对照组与实验组的数据变化</p>
              </div>
            </div>

            <div className="flex bg-slate-100 rounded-lg p-1">
              {metricTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveMetric(tab.key)}
                  className={cn(
                    'px-4 py-1.5 text-sm font-medium rounded-md transition-all',
                    activeMetric === tab.key
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorControl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#64748B" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#64748B" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorVariant" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#94A3B8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94A3B8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  formatter={(value: string) => [`${value}%`, '']}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ paddingTop: '20px' }}
                />
                <Area
                  type="monotone"
                  dataKey="对照组"
                  stroke="#64748B"
                  strokeWidth={2}
                  fill="url(#colorControl)"
                  dot={false}
                  activeDot={{ r: 6 }}
                />
                <Area
                  type="monotone"
                  dataKey="实验组"
                  stroke="#0EA5E9"
                  strokeWidth={2}
                  fill="url(#colorVariant)"
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-warning-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-warning-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">异常提醒</h3>
                <p className="text-sm text-slate-500">数据波动异常监控</p>
              </div>
            </div>

            <div className="space-y-3">
              {alerts.map((alert) => {
                const config = severityConfig[alert.severity];
                const AlertIcon = config.icon;
                
                return (
                  <div
                    key={alert.id}
                    className={cn(
                      'p-4 rounded-xl border transition-all hover:shadow-md cursor-pointer',
                      config.bg,
                      config.border,
                      alert.severity === 'high' && 'animate-pulse-soft'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <AlertIcon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', config.text)} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className={cn('text-sm font-medium', config.text)}>
                            {alert.description}
                          </span>
                          <span className="text-xs font-bold bg-white/60 px-2 py-0.5 rounded">
                            {alert.metricChange}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mb-2">
                          {alert.timestamp}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {alert.possibleReasons.map((reason, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-white/60 text-xs text-slate-600 rounded"
                            >
                              {reason}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {alerts.length === 0 && (
                <div className="py-8 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-success-50 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-success-600" />
                  </div>
                  <p className="text-sm text-slate-500">暂无异常提醒</p>
                  <p className="text-xs text-slate-400 mt-1">数据表现稳定</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-slate-800">置信度</h4>
              <span className="text-xs text-slate-400">统计显著性</span>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-500">点击率</span>
                  <span className="font-semibold text-success-600">95.2%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-success-400 to-success-500 rounded-full"
                    style={{ width: '95.2%' }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-500">7日留存</span>
                  <span className="font-semibold text-primary-600">87.6%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full"
                    style={{ width: '87.6%' }}
                  ></div>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-4">
              * 置信度达到95%以上认为实验结果统计显著
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
