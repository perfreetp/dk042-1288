import { useState } from 'react';
import {
  FlaskConical,
  Eye,
  MousePointerClick,
  UserCheck,
  Filter,
  Search,
  Plus,
  Target,
  User,
  Clock,
  CheckCircle2,
  Play,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatsCard from '@/components/StatsCard';
import ExperimentCard from '@/components/ExperimentCard';
import { useExperimentStore } from '@/store/useExperimentStore';
import { cn } from '@/lib/utils';

type TabType = 'all' | 'running' | 'ended' | 'draft';

export default function Home() {
  const navigate = useNavigate();
  const { experiments, addExperiment, getOverviewStats, optimizationPlans, updateOptimizationPlan, getPendingCommentCount } = useExperimentStore();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const overviewStats = getOverviewStats();

  const tabs: { key: TabType; label: string; count: number }[] = [
    { key: 'all', label: '全部实验', count: experiments.length },
    { key: 'running', label: '进行中', count: experiments.filter(e => e.status === 'running').length },
    { key: 'ended', label: '已结束', count: experiments.filter(e => e.status === 'ended').length },
    { key: 'draft', label: '草稿', count: experiments.filter(e => e.status === 'draft').length },
  ];

  const filteredExperiments = experiments.filter(exp => {
    const matchesTab = activeTab === 'all' || exp.status === activeTab;
    const matchesSearch = exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

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

  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    }
    return num.toLocaleString();
  };

  const formatPercent = (num: number) => {
    return (num * 100).toFixed(1) + '%';
  };

  const priorityConfig = {
    high: { label: '高', color: 'danger', bg: 'bg-danger-50 text-danger-600' },
    medium: { label: '中', color: 'warning', bg: 'bg-warning-50 text-warning-600' },
    low: { label: '低', color: 'success', bg: 'bg-success-50 text-success-600' },
  };

  const statusConfig = {
    todo: { label: '待开始', icon: Clock, color: 'text-slate-500' },
    in_progress: { label: '进行中', icon: Play, color: 'text-primary-500' },
    done: { label: '已完成', icon: CheckCircle2, color: 'text-success-500' },
  };

  const handlePlanStatusChange = (planId: string, status: 'todo' | 'in_progress' | 'done') => {
    updateOptimizationPlan(planId, { status });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="进行中实验"
          value={overviewStats.runningExperiments + ' 个'}
          icon={FlaskConical}
          gradient="primary"
          trend={12}
          delay={0}
        />
        <StatsCard
          title="今日曝光量"
          value={formatNumber(overviewStats.totalImpressions)}
          icon={Eye}
          gradient="success"
          trend={8.5}
          delay={100}
        />
        <StatsCard
          title="平均点击率"
          value={formatPercent(overviewStats.avgClickRate)}
          icon={MousePointerClick}
          gradient="warning"
          trend={-2.1}
          delay={200}
        />
        <StatsCard
          title="7日留存率"
          value={formatPercent(overviewStats.avgRetention7d)}
          icon={UserCheck}
          gradient="primary"
          trend={3.4}
          delay={300}
        />
      </div>

      {optimizationPlans.length > 0 && (
        <div className="bg-white rounded-xl shadow-card overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">优化计划</h3>
                  <p className="text-sm text-slate-500">沉淀实验结论，推动后续优化</p>
                </div>
              </div>
              <span className="text-sm text-slate-400">
                共 {optimizationPlans.length} 项
              </span>
              <button
                onClick={() => navigate('/optimization-board')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                看板视图 <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {optimizationPlans.slice(0, 6).map((plan) => {
                const StatusIcon = statusConfig[plan.status].icon;
                return (
                  <div key={plan.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all cursor-pointer group"
                    onClick={() => navigate(`/experiments/${plan.experimentId}/conclusion`)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className={cn(
                        'px-2.5 py-1 text-xs font-medium rounded-md',
                        priorityConfig[plan.priority].bg
                      )}>
                        {priorityConfig[plan.priority].label}优先级
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const nextStatus = plan.status === 'todo' ? 'in_progress' : plan.status === 'in_progress' ? 'done' : 'todo';
                          handlePlanStatusChange(plan.id, nextStatus);
                        }}
                        className={cn(
                          'p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white',
                          statusConfig[plan.status].color
                        )}
                        title="切换状态"
                      >
                        <StatusIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <h4 className="font-medium text-slate-800 mb-1 line-clamp-1">{plan.experimentName}</h4>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-3">{plan.conclusionSummary}</p>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <User className="w-3.5 h-3.5" />
                        <span>{plan.owner}</span>
                      </div>
                      <span className={cn(
                        'flex items-center gap-1',
                        statusConfig[plan.status].color
                      )}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusConfig[plan.status].label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-lg transition-all',
                    activeTab === tab.key
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  )}
                >
                  {tab.label}
                  <span className={cn(
                    'ml-1.5 px-1.5 py-0.5 text-xs rounded-full',
                    activeTab === tab.key ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-500'
                  )}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索实验..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-56 pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                />
              </div>

              <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <Filter className="w-4 h-4" />
                筛选
              </button>

              <button
                onClick={handleCreateExperiment}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-primary text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-primary-500/25 transition-all hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" />
                新建实验
              </button>
            </div>
          </div>
        </div>

        <div className="p-5">
          {filteredExperiments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredExperiments.map((exp, index) => (
                <ExperimentCard key={exp.id} experiment={exp} index={index} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                <FlaskConical className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-medium text-slate-700 mb-2">暂无实验</h3>
              <p className="text-sm text-slate-400 mb-4">点击右上角按钮创建你的第一个实验</p>
              <button
                onClick={handleCreateExperiment}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                创建实验
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
