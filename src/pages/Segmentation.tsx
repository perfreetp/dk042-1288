import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  MapPin,
  Smartphone,
  Zap,
  Users,
  X,
  Search,
  Check,
  ArrowRight,
  Play,
  Globe,
} from 'lucide-react';
import { useExperimentStore } from '@/store/useExperimentStore';
import { mockRegions, mockChannels } from '@/data/mockData';
import { cn } from '@/lib/utils';

export default function Segmentation() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { updateSegmentRule, updateExperiment, getCurrentSegmentRule, getCurrentExperiment } = useExperimentStore();
  
  const [regionSearch, setRegionSearch] = useState('');
  const [channelSearch, setChannelSearch] = useState('');
  const [showAllRegions, setShowAllRegions] = useState(false);
  const [showAllChannels, setShowAllChannels] = useState(false);

  const currentSegmentRule = getCurrentSegmentRule();
  const currentExperiment = getCurrentExperiment();

  const selectedRegions = currentSegmentRule?.regions || [];
  const selectedChannels = currentSegmentRule?.channels || [];
  const dailyExposureLimit = currentSegmentRule?.dailyExposureLimit || 100000;
  const totalExposureLimit = currentSegmentRule?.totalExposureLimit || 5000000;
  const populationPercent = currentSegmentRule?.populationPercent || 10;

  const toggleRegion = (region: string) => {
    const newRegions = selectedRegions.includes(region)
      ? selectedRegions.filter(r => r !== region)
      : [...selectedRegions, region];
    updateSegmentRule({ regions: newRegions });
  };

  const toggleChannel = (channel: string) => {
    const newChannels = selectedChannels.includes(channel)
      ? selectedChannels.filter(c => c !== channel)
      : [...selectedChannels, channel];
    updateSegmentRule({ channels: newChannels });
  };

  const selectAllRegions = () => {
    updateSegmentRule({ regions: ['全国'] });
  };

  const clearRegions = () => {
    updateSegmentRule({ regions: [] });
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

  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(0) + '万';
    }
    return num.toLocaleString();
  };

  const filteredRegions = mockRegions.filter(r =>
    r.name.toLowerCase().includes(regionSearch.toLowerCase())
  );
  const displayedRegions = showAllRegions ? filteredRegions : filteredRegions.slice(0, 8);

  const filteredChannels = mockChannels.filter(c =>
    c.name.toLowerCase().includes(channelSearch.toLowerCase())
  );
  const displayedChannels = showAllChannels ? filteredChannels : filteredChannels.slice(0, 6);

  const channelCategories = [...new Set(mockChannels.map(c => c.category))];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">地域配置</h3>
                <p className="text-sm text-slate-500">选择实验覆盖的地区</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={selectAllRegions}
                className="px-3 py-1.5 text-xs font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
              >
                全国
              </button>
              <button
                onClick={clearRegions}
                className="px-3 py-1.5 text-xs font-medium text-slate-500 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                清空
              </button>
            </div>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索城市..."
              value={regionSearch}
              onChange={(e) => setRegionSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
            />
          </div>

          {selectedRegions.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 p-3 bg-slate-50 rounded-lg">
              {selectedRegions.map(region => (
                <span
                  key={region}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-100 text-primary-700 text-sm rounded-md"
                >
                  {region}
                  <button
                    onClick={() => toggleRegion(region)}
                    className="ml-1 hover:bg-primary-200 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
            {displayedRegions.map(region => (
              <button
                key={region.id}
                onClick={() => toggleRegion(region.name)}
                className={cn(
                  'px-3 py-2 text-sm rounded-lg transition-all text-left',
                  selectedRegions.includes(region.name)
                    ? 'bg-primary-50 text-primary-700 border border-primary-200'
                    : 'bg-slate-50 text-slate-600 border border-transparent hover:bg-slate-100'
                )}
              >
                <div className="flex items-center justify-between">
                  <span>{region.name}</span>
                  {selectedRegions.includes(region.name) && (
                    <Check className="w-4 h-4 text-primary-500" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {filteredRegions.length > 8 && (
            <button
              onClick={() => setShowAllRegions(!showAllRegions)}
              className="mt-3 w-full text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              {showAllRegions ? '收起' : `展开全部 ${filteredRegions.length} 个城市`}
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-success-50 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-success-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">渠道配置</h3>
                <p className="text-sm text-slate-500">选择目标用户来源渠道</p>
              </div>
            </div>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索渠道..."
              value={channelSearch}
              onChange={(e) => setChannelSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
            />
          </div>

          {selectedChannels.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 p-3 bg-slate-50 rounded-lg">
              {selectedChannels.map(channel => (
                <span
                  key={channel}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-success-100 text-success-700 text-sm rounded-md"
                >
                  {channel}
                  <button
                    onClick={() => toggleChannel(channel)}
                    className="ml-1 hover:bg-success-200 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {channelCategories.map(category => {
            const categoryChannels = displayedChannels.filter(c => c.category === category);
            if (categoryChannels.length === 0) return null;
            
            return (
              <div key={category} className="mb-4">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                  {category}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {categoryChannels.map(channel => (
                    <button
                      key={channel.id}
                      onClick={() => toggleChannel(channel.name)}
                      className={cn(
                        'px-3 py-2 text-sm rounded-lg transition-all text-left',
                        selectedChannels.includes(channel.name)
                          ? 'bg-success-50 text-success-700 border border-success-200'
                          : 'bg-slate-50 text-slate-600 border border-transparent hover:bg-slate-100'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{channel.name}</span>
                        {selectedChannels.includes(channel.name) && (
                          <Check className="w-4 h-4 text-success-500 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          {filteredChannels.length > 6 && (
            <button
              onClick={() => setShowAllChannels(!showAllChannels)}
              className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              {showAllChannels ? '收起' : `展开全部 ${filteredChannels.length} 个渠道`}
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-warning-50 flex items-center justify-center">
            <Zap className="w-5 h-5 text-warning-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">曝光限制</h3>
            <p className="text-sm text-slate-500">设置实验的曝光上限和人群比例</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              日曝光上限
            </label>
            <div className="relative">
              <input
                type="number"
                value={dailyExposureLimit}
                onChange={(e) => updateSegmentRule({ dailyExposureLimit: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                次
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1.5">约 {formatNumber(dailyExposureLimit)} 次/天</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              总曝光上限
            </label>
            <div className="relative">
              <input
                type="number"
                value={totalExposureLimit}
                onChange={(e) => updateSegmentRule({ totalExposureLimit: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                次
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1.5">约 {formatNumber(totalExposureLimit)} 次</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              人群比例：{populationPercent}%
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={populationPercent}
              onChange={(e) => updateSegmentRule({ populationPercent: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-500 mt-3"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-2">
              <span>1%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-5 border border-primary-200">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-primary-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-primary-800 mb-1">预估覆盖人群</h4>
            <p className="text-sm text-primary-600 mb-3">
              根据当前配置，预估每日可覆盖约 <span className="font-bold">{formatNumber(Math.round(dailyExposureLimit * 0.3))}</span> 独立用户
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-primary-700">
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                {selectedRegions.length} 个地区
              </div>
              <div className="flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" />
                {selectedChannels.length} 个渠道
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                {populationPercent}% 目标人群
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => navigate(`/experiments/${id}/version`)}
          className="flex items-center gap-2 px-5 py-2.5 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          返回版本配置
        </button>
        <button
          onClick={() => navigate(`/experiments/${id}/metrics`)}
          className="flex items-center gap-2 px-5 py-2.5 text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
        >
          查看指标
          <ArrowRight className="w-4 h-4" />
        </button>
        {currentExperiment?.status === 'draft' && (
          <button
            onClick={handleStartExperiment}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-primary text-white font-medium rounded-lg hover:shadow-lg hover:shadow-primary-500/25 transition-all hover:-translate-y-0.5"
          >
            <Play className="w-4 h-4" />
            启动实验
          </button>
        )}
      </div>
    </div>
  );
}
