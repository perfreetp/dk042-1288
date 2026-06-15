import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FileCheck,
  Trophy,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Clock,
  StopCircle,
  Snowflake,
  Send,
  MessageCircle,
  Lightbulb,
  Tag,
  Share2,
  Download,
  ExternalLink,
  Plus,
  X,
  Check,
  Users,
  BarChart3,
  AlertCircle,
} from 'lucide-react';
import { useExperimentStore } from '@/store/useExperimentStore';
import { cn } from '@/lib/utils';

export default function Conclusion() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {
    getCurrentExperiment,
    getCurrentMetrics,
    getCurrentComments,
    getCurrentHypothesis,
    getCurrentIsFrozen,
    addComment,
    updateHypothesis,
    freezeResults,
    endExperiment,
  } = useExperimentStore();

  const currentExperiment = getCurrentExperiment();
  const currentMetrics = getCurrentMetrics();
  const comments = getCurrentComments();
  const hypothesis = getCurrentHypothesis();
  const isFrozen = getCurrentIsFrozen();

  const [commentInput, setCommentInput] = useState('');
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [assumption, setAssumption] = useState(hypothesis[0]?.assumption || currentExperiment?.hypothesis || '');
  const [conclusion, setConclusion] = useState(hypothesis[0]?.conclusion || '');
  const [result, setResult] = useState<'positive' | 'negative' | 'neutral'>(
    (hypothesis[0]?.result as 'positive' | 'negative' | 'neutral') || 'positive'
  );
  const [tags, setTags] = useState<string[]>(hypothesis[0]?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [syncStatus, setSyncStatus] = useState(false);

  const controlMetrics = currentMetrics.find(m => m.type === 'control');
  const variantMetrics = currentMetrics.find(m => m.type === 'variant');

  const calculateUplift = (variant: number, control: number) => {
    if (control === 0) return 0;
    return ((variant - control) / control) * 100;
  };

  const formatPercent = (num: number, decimals: number = 1) => {
    return (num * 100).toFixed(decimals) + '%';
  };

  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    }
    return num.toLocaleString();
  };

  const handleAddComment = () => {
    if (!commentInput.trim()) return;
    addComment(commentInput.trim(), '我');
    setCommentInput('');
  };

  const handleEndExperiment = () => {
    if (id) {
      endExperiment(id);
      setShowEndConfirm(false);
    }
  };

  const handleFreeze = () => {
    freezeResults();
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSaveHypothesis = () => {
    updateHypothesis({
      assumption,
      conclusion,
      tags,
      result,
    });
  };

  const handleSyncPlan = () => {
    setSyncStatus(true);
    setTimeout(() => {
      setSyncStatus(false);
    }, 2000);
  };

  const clickRateUplift = calculateUplift(
    variantMetrics?.coreMetrics.clickRate || 0,
    controlMetrics?.coreMetrics.clickRate || 0
  );

  const isWin = clickRateUplift > 0;

  const resultConfig = {
    positive: { icon: ThumbsUp, label: '正向效果', color: 'success' },
    negative: { icon: ThumbsDown, label: '负向效果', color: 'danger' },
    neutral: { icon: Minus, label: '无显著差异', color: 'slate' },
  };

  const metricsCompare = [
    {
      name: '曝光量',
      control: controlMetrics?.coreMetrics.impressions || 0,
      variant: variantMetrics?.coreMetrics.impressions || 0,
      format: formatNumber,
    },
    {
      name: '点击量',
      control: controlMetrics?.coreMetrics.clicks || 0,
      variant: variantMetrics?.coreMetrics.clicks || 0,
      format: formatNumber,
    },
    {
      name: '点击率',
      control: controlMetrics?.coreMetrics.clickRate || 0,
      variant: variantMetrics?.coreMetrics.clickRate || 0,
      format: (v: number) => formatPercent(v),
      uplift: clickRateUplift,
      isPrimary: true,
    },
    {
      name: '转化率',
      control: controlMetrics?.coreMetrics.conversionRate || 0,
      variant: variantMetrics?.coreMetrics.conversionRate || 0,
      format: (v: number) => formatPercent(v),
      uplift: calculateUplift(
        variantMetrics?.coreMetrics.conversionRate || 0,
        controlMetrics?.coreMetrics.conversionRate || 0
      ),
    },
    {
      name: '7日留存率',
      control: controlMetrics?.coreMetrics.retention7d || 0,
      variant: variantMetrics?.coreMetrics.retention7d || 0,
      format: (v: number) => formatPercent(v),
      uplift: calculateUplift(
        variantMetrics?.coreMetrics.retention7d || 0,
        controlMetrics?.coreMetrics.retention7d || 0
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
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
            {currentExperiment?.status === 'running' ? '进行中' : '已结束'}
          </span>
          {isFrozen && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-600 text-sm font-medium rounded-lg">
              <Snowflake className="w-3.5 h-3.5" />
              结果已冻结
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {currentExperiment?.status === 'running' && (
            <>
              <button
                onClick={handleFreeze}
                disabled={isFrozen}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  isFrozen
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'text-slate-600 border border-slate-200 hover:bg-slate-50'
                )}
              >
                <Snowflake className="w-4 h-4" />
                {isFrozen ? '已冻结' : '冻结结果'}
              </button>
              <button
                onClick={() => setShowEndConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-warning-500 text-white text-sm font-medium rounded-lg hover:bg-warning-600 transition-colors"
              >
                <StopCircle className="w-4 h-4" />
                结束实验
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className={cn(
            'rounded-xl p-6 shadow-card text-white relative overflow-hidden',
            isWin ? 'bg-gradient-to-br from-success-500 to-success-600' : 'bg-gradient-to-br from-warning-500 to-warning-600'
          )}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  {isWin ? (
                    <Trophy className="w-6 h-6 text-yellow-200" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    {isWin ? '实验组胜出 🎉' : '结果未达预期'}
                  </h2>
                  <p className="text-white/80 text-sm">
                    实验置信度 95%，建议{isWin ? '全量上线' : '进一步优化方案'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div>
                  <p className="text-white/70 text-sm mb-1">核心指标提升</p>
                  <p className="text-3xl font-bold">
                    {clickRateUplift > 0 ? '+' : ''}{clickRateUplift.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-white/70 text-sm mb-1">实验周期</p>
                  <p className="text-3xl font-bold">14 天</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm mb-1">累计曝光</p>
                  <p className="text-3xl font-bold">
                    {formatNumber((controlMetrics?.coreMetrics.impressions || 0) + (variantMetrics?.coreMetrics.impressions || 0))}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">指标对比详情</h3>
                <p className="text-sm text-slate-500">对照组与实验组核心数据对比</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">指标</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                        对照组
                      </span>
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                        实验组
                      </span>
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">提升</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">置信度</th>
                  </tr>
                </thead>
                <tbody>
                  {metricsCompare.map((metric, index) => {
                    const uplift = metric.uplift;
                    const isPositive = uplift !== undefined && uplift >= 0;
                    const isPrimary = metric.isPrimary;
                    
                    return (
                      <tr
                        key={metric.name}
                        className={cn(
                          'border-b border-slate-100 transition-colors',
                          isPrimary && 'bg-primary-50/50',
                          'hover:bg-slate-50'
                        )}
                      >
                        <td className="py-4 px-4">
                          <span className={cn(
                            'text-sm',
                            isPrimary ? 'font-semibold text-slate-800' : 'text-slate-600'
                          )}>
                            {metric.name}
                            {isPrimary && (
                              <span className="ml-2 px-1.5 py-0.5 bg-primary-100 text-primary-700 text-xs rounded">
                                核心
                              </span>
                            )}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right text-sm text-slate-600">
                          {metric.format(metric.control)}
                        </td>
                        <td className="py-4 px-4 text-right text-sm font-medium text-slate-800">
                          {metric.format(metric.variant)}
                        </td>
                        <td className="py-4 px-4 text-right">
                          {uplift !== undefined && (
                            <span className={cn(
                              'inline-flex items-center gap-0.5 px-2 py-1 rounded text-xs font-medium',
                              isPositive ? 'bg-success-50 text-success-600' : 'bg-danger-50 text-danger-600'
                            )}>
                              {isPositive ? '↑' : '↓'} {Math.abs(uplift).toFixed(1)}%
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="inline-flex items-center gap-1 text-sm text-slate-500">
                            <span className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden inline-block">
                              <span
                                className={cn(
                                  'h-full rounded-full block',
                                  (index % 3 === 0) ? 'bg-success-500 w-[95%]' :
                                  (index % 3 === 1) ? 'bg-primary-500 w-[82%]' :
                                  'bg-warning-500 w-[65%]'
                                )}
                              ></span>
                            </span>
                            {(index % 3 === 0) ? '95%' : (index % 3 === 1) ? '82%' : '65%'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-warning-50 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-warning-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">讨论评论</h3>
                  <p className="text-sm text-slate-500">{comments.length} 条评论</p>
                </div>
              </div>
              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                <Users className="w-4 h-4" />
                邀请同事
              </button>
            </div>

            <div className="space-y-4 mb-5 max-h-80 overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.id} className="animate-fade-in-up">
                  <div className="flex gap-3">
                    <img
                      src={comment.userAvatar}
                      alt={comment.userName}
                      className="w-9 h-9 rounded-full bg-slate-100 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="bg-slate-50 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-slate-800">{comment.userName}</span>
                          <span className="text-xs text-slate-400">{comment.createdAt}</span>
                        </div>
                        <p className="text-sm text-slate-600">{comment.content}</p>
                      </div>
                      
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="ml-4 mt-3 space-y-3 border-l-2 border-slate-100 pl-4">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex gap-3">
                              <img
                                src={reply.userAvatar}
                                alt={reply.userName}
                                className="w-7 h-7 rounded-full bg-slate-100 flex-shrink-0"
                              />
                              <div className="flex-1">
                                <div className="bg-slate-50 rounded-xl p-3">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium text-slate-800">{reply.userName}</span>
                                    <span className="text-xs text-slate-400">{reply.createdAt}</span>
                                  </div>
                                  <p className="text-sm text-slate-600">{reply.content}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=me"
                alt="我"
                className="w-9 h-9 rounded-full bg-slate-100 flex-shrink-0"
              />
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                  placeholder="输入评论，@同事..."
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!commentInput.trim()}
                  className={cn(
                    'px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2',
                    commentInput.trim()
                      ? 'bg-primary-500 text-white hover:bg-primary-600'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  )}
                >
                  <Send className="w-4 h-4" />
                  发送
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-success-50 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-success-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">实验假设与结论</h3>
                <p className="text-sm text-slate-500">沉淀经验，指导未来</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  实验假设
                </label>
                <textarea
                  value={assumption}
                  onChange={(e) => setAssumption(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none"
                  placeholder="输入你的实验假设..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  实验结论
                </label>
                <textarea
                  value={conclusion}
                  onChange={(e) => setConclusion(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none"
                  placeholder="总结实验结论和经验..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  结果判定
                </label>
                <div className="flex gap-2">
                  {(['positive', 'negative', 'neutral'] as const).map((key) => {
                    const config = resultConfig[key];
                    const ResultIcon = config.icon;
                    return (
                      <button
                        key={key}
                        onClick={() => setResult(key)}
                        className={cn(
                          'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all border',
                          result === key && config.color === 'success' && 'bg-success-50 text-success-600 border-success-200',
                          result === key && config.color === 'danger' && 'bg-danger-50 text-danger-600 border-danger-200',
                          result === key && config.color === 'slate' && 'bg-slate-50 text-slate-600 border-slate-200',
                          result !== key && 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                        )}
                      >
                          <ResultIcon className="w-4 h-4" />
                          {config.label}
                        </button>
                      );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  经验标签
                </label>
                <div className="flex flex-wrap gap-2 mb-2 min-h-[32px]">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-50 text-primary-700 text-sm rounded-lg"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:bg-primary-100 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                    placeholder="输入标签，回车添加"
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleSaveHypothesis}
                className="w-full py-2.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                保存结论
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                <Share2 className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">后续行动</h3>
                <p className="text-sm text-slate-500">推动结论落地</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleSyncPlan}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left',
                  syncStatus
                    ? 'bg-success-50 border-success-200'
                    : 'bg-white border-slate-200 hover:border-primary-200 hover:bg-primary-50/30'
                )}
              >
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  syncStatus ? 'bg-success-100' : 'bg-primary-50'
                )}>
                  {syncStatus ? (
                    <Check className="w-5 h-5 text-success-600" />
                  ) : (
                    <ExternalLink className="w-5 h-5 text-primary-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={cn(
                    'text-sm font-medium',
                    syncStatus ? 'text-success-700' : 'text-slate-800'
                  )}>
                    {syncStatus ? '已同步到需求池' : '同步到优化计划'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {syncStatus ? '实验结论已同步' : '将结论同步到后续迭代计划'}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-primary-200 hover:bg-primary-50/30 transition-all text-left">
                <div className="w-10 h-10 rounded-lg bg-warning-50 flex items-center justify-center">
                  <Download className="w-5 h-5 text-warning-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">导出实验报告</p>
                  <p className="text-xs text-slate-500">生成 PDF 格式实验报告</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-primary-200 hover:bg-primary-50/30 transition-all text-left">
                <div className="w-10 h-10 rounded-lg bg-success-50 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-success-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">分享给团队</p>
                  <p className="text-xs text-slate-500">生成分享链接或发送邮件</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showEndConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 animate-fade-in-up">
            <div className="text-center mb-5">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-warning-50 flex items-center justify-center">
                <StopCircle className="w-8 h-8 text-warning-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">确认结束实验？</h3>
              <p className="text-sm text-slate-500">
                结束后实验将不再产生新数据，但已有的数据会被保留。
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 mb-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">实验名称</span>
                <span className="font-medium text-slate-800">{currentExperiment?.name}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-slate-500">累计曝光</span>
                <span className="font-medium text-slate-800">
                  {formatNumber((controlMetrics?.coreMetrics.impressions || 0) + (variantMetrics?.coreMetrics.impressions || 0))}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-slate-500">运行时长</span>
                <span className="font-medium text-slate-800">14 天</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowEndConfirm(false)}
                className="flex-1 py-2.5 text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleEndExperiment}
                className="flex-1 py-2.5 bg-warning-500 text-white font-medium rounded-xl hover:bg-warning-600 transition-colors"
              >
                确认结束
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
