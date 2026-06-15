import { X, Download, Printer, FileText, Users, Target, BarChart3, MessageSquare, Lightbulb } from 'lucide-react';
import type { Experiment, ExperimentGroup, SegmentRule, Comment, ExperimentHypothesis, GroupMetrics } from '@/types';
import { cn } from '@/lib/utils';

interface ExperimentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  experiment: Experiment | null;
  groups: ExperimentGroup[];
  segmentRule: SegmentRule | null;
  metrics: GroupMetrics[];
  comments: Comment[];
  hypothesis: ExperimentHypothesis[];
  isFrozen: boolean;
}

export default function ExperimentReportModal({
  isOpen,
  onClose,
  experiment,
  groups,
  segmentRule,
  metrics,
  comments,
  hypothesis,
  isFrozen,
}: ExperimentReportModalProps) {
  if (!isOpen || !experiment) return null;

  const controlMetrics = metrics.find(m => m.type === 'control');
  const variantMetrics = metrics.find(m => m.type === 'variant');

  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    }
    return num.toLocaleString();
  };

  const formatPercent = (num: number) => {
    return (num * 100).toFixed(2) + '%';
  };

  const calculateUplift = (variant: number, control: number) => {
    if (control === 0) return 0;
    return ((variant - control) / control) * 100;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const reportContent = generateReportText();
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${experiment.name}-实验报告.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateReportText = () => {
    const lines = [
      '========================================',
      '         A/B 测试实验报告',
      '========================================',
      '',
      '【实验基本信息】',
      `实验名称：${experiment.name}`,
      `实验描述：${experiment.description}`,
      `实验类型：${experiment.type === 'entry' ? '功能入口' : experiment.type === 'popup' ? '弹窗文案' : '会员权益'}`,
      `应用版本：${experiment.appName} ${experiment.appVersion}`,
      `实验状态：${experiment.status === 'running' ? '进行中' : experiment.status === 'ended' ? '已结束' : experiment.status === 'draft' ? '草稿' : '已暂停'}`,
      isFrozen ? '结果状态：已冻结' : '',
      '',
      '【实验假设】',
      hypothesis[0]?.assumption || experiment.hypothesis || '暂无假设',
      '',
      '【分组配置】',
      ...groups.map((g, i) => [
        `${i + 1}. ${g.name}（${g.type === 'control' ? '对照组' : '实验组'}）`,
        `   流量比例：${g.trafficPercent}%`,
      ].join('\n')),
      '',
      '【分群规则】',
      `目标人群：${segmentRule?.populationPercent || 100}%`,
      `地域：${segmentRule?.regions?.length ? segmentRule.regions.join('、') : '全部'}`,
      `渠道：${segmentRule?.channels?.length ? segmentRule.channels.join('、') : '全部'}`,
      `日曝光上限：${formatNumber(segmentRule?.dailyExposureLimit || 0)}`,
      `总曝光上限：${formatNumber(segmentRule?.totalExposureLimit || 0)}`,
      '',
      '【核心指标对比】',
      `指标              对照组        实验组        提升幅度`,
      `--------------------------------------------------------`,
      `曝光量         ${formatNumber(controlMetrics?.coreMetrics.impressions || 0).padEnd(12)}${formatNumber(variantMetrics?.coreMetrics.impressions || 0).padEnd(12)}-`,
      `点击量         ${formatNumber(controlMetrics?.coreMetrics.clicks || 0).padEnd(12)}${formatNumber(variantMetrics?.coreMetrics.clicks || 0).padEnd(12)}-`,
      `点击率         ${formatPercent(controlMetrics?.coreMetrics.clickRate || 0).padEnd(12)}${formatPercent(variantMetrics?.coreMetrics.clickRate || 0).padEnd(12)}${calculateUplift(variantMetrics?.coreMetrics.clickRate || 0, controlMetrics?.coreMetrics.clickRate || 0).toFixed(2)}%`,
      `转化率         ${formatPercent(controlMetrics?.coreMetrics.conversionRate || 0).padEnd(12)}${formatPercent(variantMetrics?.coreMetrics.conversionRate || 0).padEnd(12)}${calculateUplift(variantMetrics?.coreMetrics.conversionRate || 0, controlMetrics?.coreMetrics.conversionRate || 0).toFixed(2)}%`,
      `7日留存率      ${formatPercent(controlMetrics?.coreMetrics.retention7d || 0).padEnd(12)}${formatPercent(variantMetrics?.coreMetrics.retention7d || 0).padEnd(12)}${calculateUplift(variantMetrics?.coreMetrics.retention7d || 0, controlMetrics?.coreMetrics.retention7d || 0).toFixed(2)}%`,
      '',
      '【实验结论】',
      hypothesis[0]?.conclusion || '暂无结论',
      '',
      hypothesis[0]?.result ? `结果判定：${hypothesis[0].result === 'positive' ? '正向效果' : hypothesis[0].result === 'negative' ? '负向效果' : '无显著差异'}` : '',
      hypothesis[0]?.tags?.length ? `经验标签：${hypothesis[0].tags.join('、')}` : '',
      '',
      `【讨论评论（${comments.length}条）】`,
      ...comments.map((c, i) => [
        `${i + 1}. ${c.userName}  ${c.createdAt}`,
        `   ${c.content}`,
      ].join('\n')),
      '',
      '========================================',
      '          报告生成完毕',
      '========================================',
    ];
    return lines.filter(Boolean).join('\n');
  };

  const clickRateUplift = calculateUplift(
    variantMetrics?.coreMetrics.clickRate || 0,
    controlMetrics?.coreMetrics.clickRate || 0
  );
  const isWin = clickRateUplift > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">实验报告</h2>
              <p className="text-sm text-slate-500">{experiment.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Printer className="w-4 h-4" />
              打印
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              导出
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-primary-500" />
              <h3 className="font-semibold text-slate-800">实验基本信息</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-400 mb-1">实验类型</p>
                <p className="text-sm font-medium text-slate-700">
                  {experiment.type === 'entry' ? '功能入口' : experiment.type === 'popup' ? '弹窗文案' : '会员权益'}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-400 mb-1">应用版本</p>
                <p className="text-sm font-medium text-slate-700">{experiment.appVersion}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-400 mb-1">实验状态</p>
                <p className="text-sm font-medium text-slate-700">
                  {experiment.status === 'running' ? '进行中' : experiment.status === 'ended' ? '已结束' : '草稿'}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-400 mb-1">结果状态</p>
                <p className={cn('text-sm font-medium', isFrozen ? 'text-primary-600' : 'text-slate-700')}>
                  {isFrozen ? '已冻结' : '未冻结'}
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-warning-500" />
              <h3 className="font-semibold text-slate-800">实验假设</h3>
            </div>
            <div className="p-4 bg-warning-50 rounded-xl border border-warning-100">
              <p className="text-sm text-slate-700 leading-relaxed">
                {hypothesis[0]?.assumption || experiment.hypothesis || '暂无实验假设'}
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-success-500" />
              <h3 className="font-semibold text-slate-800">分组与分群</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {groups.map((group) => (
                <div key={group.id} className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-700">{group.name}</span>
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded-full',
                      group.type === 'control' ? 'bg-slate-200 text-slate-600' : 'bg-primary-100 text-primary-600'
                    )}>
                      {group.type === 'control' ? '对照组' : '实验组'}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-slate-800">{group.trafficPercent}%</p>
                  <p className="text-xs text-slate-400 mt-1">流量分配</p>
                </div>
              ))}
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-400 mb-2">分群规则</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-500">目标人群：</span>
                  <span className="text-slate-700">{segmentRule?.populationPercent || 100}%</span>
                </div>
                <div>
                  <span className="text-slate-500">地域：</span>
                  <span className="text-slate-700">
                    {segmentRule?.regions?.length ? segmentRule.regions.slice(0, 3).join('、') + (segmentRule.regions.length > 3 ? '...' : '') : '全部'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">渠道：</span>
                  <span className="text-slate-700">
                    {segmentRule?.channels?.length ? segmentRule.channels.slice(0, 3).join('、') + (segmentRule.channels.length > 3 ? '...' : '') : '全部'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">日曝光上限：</span>
                  <span className="text-slate-700">{formatNumber(segmentRule?.dailyExposureLimit || 0)}</span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-4 h-4 text-primary-500" />
              <h3 className="font-semibold text-slate-800">核心指标对比</h3>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-4 py-3 text-left font-medium text-slate-500">指标</th>
                    <th className="px-4 py-3 text-right font-medium text-slate-500">对照组</th>
                    <th className="px-4 py-3 text-right font-medium text-slate-500">实验组</th>
                    <th className="px-4 py-3 text-right font-medium text-slate-500">提升幅度</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { name: '曝光量', control: controlMetrics?.coreMetrics.impressions || 0, variant: variantMetrics?.coreMetrics.impressions || 0, format: formatNumber, isPercent: false },
                    { name: '点击量', control: controlMetrics?.coreMetrics.clicks || 0, variant: variantMetrics?.coreMetrics.clicks || 0, format: formatNumber, isPercent: false },
                    { name: '点击率', control: controlMetrics?.coreMetrics.clickRate || 0, variant: variantMetrics?.coreMetrics.clickRate || 0, format: formatPercent, isPercent: true, primary: true },
                    { name: '转化率', control: controlMetrics?.coreMetrics.conversionRate || 0, variant: variantMetrics?.coreMetrics.conversionRate || 0, format: formatPercent, isPercent: true },
                    { name: '7日留存率', control: controlMetrics?.coreMetrics.retention7d || 0, variant: variantMetrics?.coreMetrics.retention7d || 0, format: formatPercent, isPercent: true },
                  ].map((metric) => {
                    const uplift = calculateUplift(metric.variant, metric.control);
                    return (
                      <tr key={metric.name} className={metric.primary ? 'bg-primary-50/50' : ''}>
                        <td className="px-4 py-3 text-slate-700 font-medium">{metric.name}</td>
                        <td className="px-4 py-3 text-right text-slate-600">{metric.format(metric.control)}</td>
                        <td className="px-4 py-3 text-right text-slate-600">{metric.format(metric.variant)}</td>
                        <td className={cn(
                          'px-4 py-3 text-right font-medium',
                          uplift > 0 ? 'text-success-600' : uplift < 0 ? 'text-danger-600' : 'text-slate-400'
                        )}>
                          {uplift > 0 ? '+' : ''}{uplift.toFixed(2)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-success-500" />
              <h3 className="font-semibold text-slate-800">实验结论</h3>
            </div>
            <div className="p-4 bg-success-50 rounded-xl border border-success-100">
              <div className="flex items-center gap-2 mb-2">
                <span className={cn(
                  'px-2 py-0.5 text-xs font-medium rounded-full',
                  hypothesis[0]?.result === 'positive' ? 'bg-success-100 text-success-700' :
                  hypothesis[0]?.result === 'negative' ? 'bg-danger-100 text-danger-700' : 'bg-slate-100 text-slate-600'
                )}>
                  {hypothesis[0]?.result === 'positive' ? '正向效果' : hypothesis[0]?.result === 'negative' ? '负向效果' : '无显著差异'}
                </span>
                {isWin && <span className="text-success-600 text-sm font-medium">实验组胜出 🎉</span>}
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {hypothesis[0]?.conclusion || '暂无实验结论'}
              </p>
              {hypothesis[0]?.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {hypothesis[0].tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 text-xs bg-white text-slate-600 rounded-md border border-slate-200">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-slate-500" />
              <h3 className="font-semibold text-slate-800">讨论评论 ({comments.length})</h3>
            </div>
            <div className="space-y-3">
              {comments.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6">暂无评论</p>
              ) : (
                comments.slice(0, 5).map((comment) => (
                  <div key={comment.id} className="p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-sm font-medium text-slate-700">{comment.userName}</span>
                      <span className="text-xs text-slate-400">{comment.createdAt}</span>
                    </div>
                    <p className="text-sm text-slate-600">{comment.content}</p>
                  </div>
                ))
              )}
              {comments.length > 5 && (
                <p className="text-sm text-slate-400 text-center">还有 {comments.length - 5} 条评论...</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
