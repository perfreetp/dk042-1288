import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Settings,
  ChevronRight,
  Edit3,
  Smartphone,
  MessageSquare,
  Crown,
  SlidersHorizontal,
  Play,
  ArrowRight,
} from 'lucide-react';
import { useExperimentStore } from '@/store/useExperimentStore';
import { mockAppVersions } from '@/data/mockData';
import { cn } from '@/lib/utils';

type PreviewTabType = 'entry' | 'popup' | 'benefit';

export default function VersionConfig() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {
    getCurrentExperiment,
    getCurrentGroups,
    updateGroup,
    updateExperiment,
  } = useExperimentStore();
  
  const currentExperiment = getCurrentExperiment();
  const currentGroups = getCurrentGroups();
  
  const [previewTab, setPreviewTab] = useState<PreviewTabType>(currentExperiment?.type || 'entry');
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(currentExperiment?.name || '');
  const [selectedVersion, setSelectedVersion] = useState(currentExperiment?.appVersion || 'v5.2.0');
  const [experimentType, setExperimentType] = useState<'entry' | 'popup' | 'benefit'>(
    currentExperiment?.type || 'entry'
  );

  const controlGroup = currentGroups.find(g => g.type === 'control');
  const variantGroup = currentGroups.find(g => g.type === 'variant');

  const handleSaveName = () => {
    if (id && editName.trim()) {
      updateExperiment(id, { name: editName.trim() });
    }
    setIsEditingName(false);
  };

  const handleTrafficChange = (newPercent: number) => {
    if (controlGroup && variantGroup) {
      updateGroup(controlGroup.id, { trafficPercent: 100 - newPercent });
      updateGroup(variantGroup.id, { trafficPercent: newPercent });
    }
  };

  const handleStartExperiment = () => {
    if (id) {
      updateExperiment(id, {
        status: 'running',
        startTime: new Date().toISOString().split('T')[0],
      });
      navigate(`/experiments/${id}/metrics`);
    }
  };

  const previewTabs = [
    { key: 'entry' as const, label: '功能入口', icon: Smartphone },
    { key: 'popup' as const, label: '弹窗文案', icon: MessageSquare },
    { key: 'benefit' as const, label: '会员权益', icon: Crown },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={handleSaveName}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                    className="text-xl font-bold text-slate-800 bg-slate-50 border border-primary-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    autoFocus
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-800">{currentExperiment?.name}</h2>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="p-1 text-slate-400 hover:text-primary-500 hover:bg-slate-100 rounded transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              )}
              <p className="text-sm text-slate-500">{currentExperiment?.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 bg-primary-50 text-primary-600 text-sm font-medium rounded-lg">
              {currentExperiment?.appVersion}
            </span>
            <button
              onClick={() => navigate(`/experiments/${id}/segmentation`)}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              下一步：分群规则
              <ArrowRight className="w-4 h-4" />
            </button>
            {currentExperiment?.status === 'draft' && (
              <button
                onClick={handleStartExperiment}
                className="flex items-center gap-2 px-5 py-2 bg-gradient-primary text-white font-medium rounded-lg hover:shadow-lg hover:shadow-primary-500/25 transition-all hover:-translate-y-0.5"
              >
                <Play className="w-4 h-4" />
                启动实验
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              应用版本
            </label>
            <select
              value={selectedVersion}
              onChange={(e) => {
                setSelectedVersion(e.target.value);
                if (id) updateExperiment(id, { appVersion: e.target.value });
              }}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
            >
              {mockAppVersions.map(v => (
                <option key={v.id} value={v.version}>{v.name} - {v.description}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              实验类型
            </label>
            <div className="flex gap-2">
              {[
                { key: 'entry' as const, label: '功能入口' },
                { key: 'popup' as const, label: '弹窗文案' },
                { key: 'benefit' as const, label: '会员权益' },
              ].map(type => (
                <button
                  key={type.key}
                  onClick={() => {
                    setExperimentType(type.key);
                    if (id) updateExperiment(id, { type: type.key });
                  }}
                  className={cn(
                    'flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all',
                    experimentType === type.key
                      ? 'bg-primary-50 text-primary-600 border border-primary-200'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  )}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              实验假设
            </label>
            <input
              type="text"
              defaultValue={currentExperiment?.hypothesis}
              onBlur={(e) => {
                if (id) updateExperiment(id, { hypothesis: e.target.value });
              }}
              placeholder="输入你的实验假设..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success-50 flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5 text-success-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">分组配置</h3>
              <p className="text-sm text-slate-500">设置对照组和实验组的流量分配</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className={cn(
            'p-5 rounded-xl border-2 transition-all',
            'bg-slate-50 border-slate-200'
          )}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-500"></div>
                <span className="font-semibold text-slate-700">对照组</span>
                <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-xs rounded-full">
                  Control
                </span>
              </div>
              <span className="text-2xl font-bold text-slate-700">
                {controlGroup?.trafficPercent || 50}%
              </span>
            </div>
            <p className="text-sm text-slate-500">
              展示原有版本，作为实验的基准数据
            </p>
          </div>

          <div className={cn(
            'p-5 rounded-xl border-2 transition-all',
            'bg-primary-50 border-primary-200'
          )}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                <span className="font-semibold text-primary-700">实验组</span>
                <span className="px-2 py-0.5 bg-primary-100 text-primary-600 text-xs rounded-full">
                  Variant
                </span>
              </div>
              <span className="text-2xl font-bold text-primary-600">
                {variantGroup?.trafficPercent || 50}%
              </span>
            </div>
            <p className="text-sm text-primary-600">
              展示新的版本，验证优化效果
            </p>
          </div>
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium text-slate-700 mb-3">
            流量分配：实验组 {(variantGroup?.trafficPercent || 50)}% / 对照组 {(controlGroup?.trafficPercent || 50)}%
          </label>
          <input
            type="range"
            min="10"
            max="90"
            value={variantGroup?.trafficPercent || 50}
            onChange={(e) => handleTrafficChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>10%</span>
            <span>50%</span>
            <span>90%</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-warning-50 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-warning-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">素材预览</h3>
              <p className="text-sm text-slate-500">预览不同分组的展示效果</p>
            </div>
          </div>

          <div className="flex bg-slate-100 rounded-lg p-1">
            {previewTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setPreviewTab(tab.key)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all',
                  previewTab === tab.key
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-500"></div>
              <span className="text-sm font-medium text-slate-600">对照组</span>
            </div>
            <div className="relative mx-auto" style={{ width: '280px' }}>
              <div className="bg-slate-900 rounded-[2.5rem] p-2 shadow-xl">
                <div className="bg-white rounded-[2rem] overflow-hidden aspect-[9/16]">
                  <div className="h-6 bg-slate-900 flex items-center justify-center">
                    <div className="w-20 h-5 bg-black rounded-full"></div>
                  </div>
                  <div className="p-4">
                    {previewTab === 'entry' && controlGroup?.materialConfig.entryConfig && (
                      <div className="space-y-4">
                        <div className="text-center text-lg font-semibold text-slate-800 mt-2">首页</div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                          <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center">
                            <Crown className="w-6 h-6 text-slate-400" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-slate-800">
                              {controlGroup.materialConfig.entryConfig.title}
                            </div>
                            <div className="text-xs text-slate-500">
                              {controlGroup.materialConfig.entryConfig.subtitle}
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300" />
                        </div>
                        <div className="text-xs text-slate-400 text-center mt-4">
                          位置：{controlGroup.materialConfig.entryConfig.position}
                        </div>
                      </div>
                    )}

                    {previewTab === 'popup' && controlGroup?.materialConfig.popupConfig && (
                      <div className="h-full flex items-center justify-center p-4">
                        <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                          <div className="h-32 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                            <MessageSquare className="w-12 h-12 text-white/60" />
                          </div>
                          <div className="p-4">
                            <h4 className="font-semibold text-slate-800 text-center mb-2">
                              {controlGroup.materialConfig.popupConfig.title}
                            </h4>
                            <p className="text-xs text-slate-500 text-center mb-4">
                              {controlGroup.materialConfig.popupConfig.content}
                            </p>
                            <button className="w-full py-2.5 bg-slate-600 text-white text-sm font-medium rounded-xl">
                              {controlGroup.materialConfig.popupConfig.buttonText}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {previewTab === 'benefit' && controlGroup?.materialConfig.benefitConfig && (
                      <div className="space-y-3">
                        <div className="bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl p-4 text-center">
                          <Crown className="w-8 h-8 text-white mx-auto mb-2" />
                          <div className="font-bold text-slate-700">
                            {controlGroup.materialConfig.benefitConfig.title}
                          </div>
                          <div className="text-xs text-slate-500">
                            {controlGroup.materialConfig.benefitConfig.subtitle}
                          </div>
                        </div>
                        <div className="space-y-2">
                          {controlGroup.materialConfig.benefitConfig.benefits.map((benefit, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                              {benefit}
                            </div>
                          ))}
                        </div>
                        <div className="text-center pt-2">
                          <span className="text-xs text-slate-400 line-through">
                            {controlGroup.materialConfig.benefitConfig.originalPrice}
                          </span>
                          <span className="text-lg font-bold text-slate-700 ml-2">
                            {controlGroup.materialConfig.benefitConfig.discountPrice}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-primary-500"></div>
              <span className="text-sm font-medium text-primary-600">实验组</span>
            </div>
            <div className="relative mx-auto" style={{ width: '280px' }}>
              <div className="bg-slate-900 rounded-[2.5rem] p-2 shadow-xl">
                <div className="bg-white rounded-[2rem] overflow-hidden aspect-[9/16]">
                  <div className="h-6 bg-slate-900 flex items-center justify-center">
                    <div className="w-20 h-5 bg-black rounded-full"></div>
                  </div>
                  <div className="p-4">
                    {previewTab === 'entry' && variantGroup?.materialConfig.entryConfig && (
                      <div className="space-y-4">
                        <div className="text-center text-lg font-semibold text-slate-800 mt-2">首页</div>
                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl border border-primary-200">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center relative">
                            <Crown className="w-6 h-6 text-white" />
                            {variantGroup.materialConfig.entryConfig.badgeText && (
                              <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-warning-500 text-white text-xs font-bold rounded-full">
                                {variantGroup.materialConfig.entryConfig.badgeText}
                              </span>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-primary-700">
                              {variantGroup.materialConfig.entryConfig.title}
                            </div>
                            <div className="text-xs text-primary-500">
                              {variantGroup.materialConfig.entryConfig.subtitle}
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-primary-400" />
                        </div>
                        <div className="text-xs text-primary-400 text-center mt-4">
                          位置：{variantGroup.materialConfig.entryConfig.position}
                        </div>
                      </div>
                    )}

                    {previewTab === 'popup' && variantGroup?.materialConfig.popupConfig && (
                      <div className="h-full flex items-center justify-center p-4">
                        <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                          <div className="h-32 bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center relative">
                            <MessageSquare className="w-12 h-12 text-white/30" />
                            <span className="absolute top-3 right-3 px-2 py-1 bg-warning-500 text-white text-xs font-bold rounded-full">
                              限时
                            </span>
                          </div>
                          <div className="p-4">
                            <h4 className="font-bold text-slate-800 text-center mb-2">
                              {variantGroup.materialConfig.popupConfig.title}
                            </h4>
                            <p className="text-xs text-slate-500 text-center mb-4">
                              {variantGroup.materialConfig.popupConfig.content}
                            </p>
                            <button className="w-full py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-primary-500/30">
                              {variantGroup.materialConfig.popupConfig.buttonText}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {previewTab === 'benefit' && variantGroup?.materialConfig.benefitConfig && (
                      <div className="space-y-3">
                        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-4 text-center relative overflow-hidden">
                          {variantGroup.materialConfig.benefitConfig.badgeText && (
                            <span className="absolute top-2 right-2 px-2 py-0.5 bg-warning-500 text-white text-xs font-bold rounded-full">
                              {variantGroup.materialConfig.benefitConfig.badgeText}
                            </span>
                          )}
                          <Crown className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
                          <div className="font-bold text-white">
                            {variantGroup.materialConfig.benefitConfig.title}
                          </div>
                          <div className="text-xs text-primary-100">
                            {variantGroup.materialConfig.benefitConfig.subtitle}
                          </div>
                        </div>
                        <div className="space-y-2">
                          {variantGroup.materialConfig.benefitConfig.benefits.map((benefit, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
                              {benefit}
                            </div>
                          ))}
                        </div>
                        <div className="text-center pt-2">
                          <span className="text-xs text-slate-400 line-through">
                            {variantGroup.materialConfig.benefitConfig.originalPrice}
                          </span>
                          <span className="text-lg font-bold text-primary-600 ml-2">
                            {variantGroup.materialConfig.benefitConfig.discountPrice}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
