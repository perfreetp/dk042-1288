import { useState } from 'react';
import {
  Target,
  Clock,
  Play,
  CheckCircle2,
  User,
  Filter,
  X,
  ChevronRight,
  AlertCircle,
  MessageSquare,
  ArrowUpRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useExperimentStore } from '@/store/useExperimentStore';
import { cn } from '@/lib/utils';

type FilterOwner = 'all' | string;
type FilterPriority = 'all' | 'high' | 'medium' | 'low';

export default function OptimizationBoard() {
  const navigate = useNavigate();
  const { optimizationPlans, updateOptimizationPlan, experimentsData } = useExperimentStore();
  const [filterOwner, setFilterOwner] = useState<FilterOwner>('all');
  const [filterPriority, setFilterPriority] = useState<FilterPriority>('all');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const owners = ['all', ...new Set(optimizationPlans.map(p => p.owner))];

  const filteredPlans = optimizationPlans.filter(p => {
    const matchesOwner = filterOwner === 'all' || p.owner === filterOwner;
    const matchesPriority = filterPriority === 'all' || p.priority === filterPriority;
    return matchesOwner && matchesPriority;
  });

  const columns = [
    { key: 'todo' as const, label: '待开始', icon: Clock, color: 'slate' },
    { key: 'in_progress' as const, label: '进行中', icon: Play, color: 'primary' },
    { key: 'done' as const, label: '已完成', icon: CheckCircle2, color: 'success' },
  ];

  const priorityConfig = {
    high: { label: '高', bg: 'bg-danger-50 text-danger-600' },
    medium: { label: '中', bg: 'bg-warning-50 text-warning-600' },
    low: { label: '低', bg: 'bg-success-50 text-success-600' },
  };

  const selectedPlan = optimizationPlans.find(p => p.id === selectedPlanId);
  const selectedPlanExpData = selectedPlan ? experimentsData[selectedPlan.experimentId] : undefined;
  const selectedPlanComments = selectedPlanExpData?.comments || [];
  const selectedPlanHypothesis = selectedPlanExpData?.hypothesis || [];

  const handleDragStart = (e: React.DragEvent, planId: string) => {
    e.dataTransfer.setData('planId', planId);
  };

  const handleDrop = (e: React.DragEvent, newStatus: 'todo' | 'in_progress' | 'done') => {
    e.preventDefault();
    const planId = e.dataTransfer.getData('planId');
    if (planId) {
      updateOptimizationPlan(planId, { status: newStatus });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
            <Target className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">优化计划看板</h2>
            <p className="text-sm text-slate-500">跟踪实验结论的落地进展</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterOwner}
              onChange={(e) => setFilterOwner(e.target.value as FilterOwner)}
              className="px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              {owners.map(o => (
                <option key={o} value={o}>{o === 'all' ? '全部负责人' : o}</option>
              ))}
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as FilterPriority)}
              className="px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="all">全部优先级</option>
              <option value="high">高优先级</option>
              <option value="medium">中优先级</option>
              <option value="low">低优先级</option>
            </select>
          </div>
          <span className="text-sm text-slate-400">
            共 {filteredPlans.length} 项
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 min-h-[500px]">
        {columns.map((column) => {
          const ColumnIcon = column.icon;
          const columnPlans = filteredPlans.filter(p => p.status === column.key);
          return (
            <div
              key={column.key}
              className="bg-slate-50 rounded-xl p-4"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.key)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg',
                  column.color === 'primary' ? 'bg-primary-100 text-primary-700' :
                  column.color === 'success' ? 'bg-success-100 text-success-700' :
                  'bg-slate-200 text-slate-600'
                )}>
                  <ColumnIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">{column.label}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-white/60">{columnPlans.length}</span>
                </div>
              </div>
              <div className="space-y-3">
                {columnPlans.map((plan) => (
                  <div
                    key={plan.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, plan.id)}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={cn(
                      'bg-white rounded-xl p-4 border border-slate-100 cursor-grab active:cursor-grabbing',
                      'hover:border-primary-200 hover:shadow-md transition-all',
                      selectedPlanId === plan.id && 'border-primary-300 shadow-md ring-1 ring-primary-100'
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className={cn(
                        'px-2 py-0.5 text-xs font-medium rounded-md',
                        priorityConfig[plan.priority].bg
                      )}>
                        {priorityConfig[plan.priority].label}
                      </span>
                      <span className="text-xs text-slate-400">{plan.createdAt}</span>
                    </div>
                    <h4 className="font-medium text-slate-800 mb-1 text-sm">{plan.experimentName}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">{plan.conclusionSummary}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <User className="w-3 h-3" />
                        <span>{plan.owner}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/experiments/${plan.experimentId}/conclusion`);
                        }}
                        className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-0.5"
                      >
                        查看实验 <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
                {columnPlans.length === 0 && (
                  <div className="py-8 text-center text-slate-400 text-sm">
                    暂无{column.label}的计划
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedPlanId(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">计划详情</h3>
                  <p className="text-xs text-slate-400">{selectedPlan.experimentName}</p>
                </div>
              </div>
              <button onClick={() => setSelectedPlanId(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className={cn('px-2.5 py-1 text-xs font-medium rounded-md', priorityConfig[selectedPlan.priority].bg)}>
                  {priorityConfig[selectedPlan.priority].label}优先级
                </span>
                <span className="text-xs text-slate-400">负责人：{selectedPlan.owner}</span>
                <span className="text-xs text-slate-400">创建于：{selectedPlan.createdAt}</span>
              </div>

              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-1.5">关联实验</h4>
                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                  <span className="text-sm text-slate-800">{selectedPlan.experimentName}</span>
                  <button
                    onClick={() => navigate(`/experiments/${selectedPlan.experimentId}/conclusion`)}
                    className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
                  >
                    前往 <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-1.5">结论摘要</h4>
                <p className="text-sm text-slate-600 leading-relaxed p-3 bg-slate-50 rounded-xl">
                  {selectedPlan.conclusionSummary}
                </p>
              </div>

              {selectedPlanHypothesis.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-1.5">实验结论</h4>
                  <p className="text-sm text-slate-600 leading-relaxed p-3 bg-success-50 rounded-xl">
                    {selectedPlanHypothesis[0].conclusion || '暂无结论'}
                  </p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-1.5">
                  最近评论
                  <span className="text-slate-400 ml-1">({selectedPlanComments.length})</span>
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedPlanComments.slice(0, 3).map((c) => (
                    <div key={c.id} className="p-2.5 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-slate-700">{c.userName}</span>
                        <span className="text-xs text-slate-400">{c.createdAt}</span>
                      </div>
                      <p className="text-xs text-slate-600">{c.content}</p>
                    </div>
                  ))}
                  {selectedPlanComments.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-3">暂无评论</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                {(['todo', 'in_progress', 'done'] as const).map((s) => {
                  const sc = {
                    todo: { label: '待开始', icon: Clock, activeBg: 'bg-slate-100 text-slate-700' },
                    in_progress: { label: '进行中', icon: Play, activeBg: 'bg-primary-50 text-primary-700' },
                    done: { label: '已完成', icon: CheckCircle2, activeBg: 'bg-success-50 text-success-700' },
                  }[s];
                  const SIcon = sc.icon;
                  return (
                    <button
                      key={s}
                      onClick={() => updateOptimizationPlan(selectedPlan.id, { status: s })}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all border',
                        selectedPlan.status === s
                          ? `${sc.activeBg} border-transparent`
                          : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                      )}
                    >
                      <SIcon className="w-3.5 h-3.5" />
                      {sc.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
