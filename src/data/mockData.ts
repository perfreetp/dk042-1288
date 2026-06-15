import type {
  Experiment,
  ExperimentGroup,
  SegmentRule,
  MetricData,
  CoreMetrics,
  GroupMetrics,
  Comment,
  ExperimentHypothesis,
  AbnormalAlert,
  AppVersion,
  Region,
  Channel,
} from '@/types';

export const mockExperiments: Experiment[] = [
  {
    id: 'exp-001',
    name: '会员中心入口优化实验',
    description: '测试新的会员入口图标和位置对点击率的影响',
    status: 'running',
    appVersion: 'v5.2.0',
    appName: '乐享生活',
    startTime: '2026-06-01',
    createdAt: '2026-05-28',
    progress: 65,
    type: 'entry',
    hypothesis: '将会员入口移至首页顶部并更换图标可以提升15%以上的点击率',
  },
  {
    id: 'exp-002',
    name: '新人礼包弹窗文案优化',
    description: '对比两种弹窗文案对新用户转化率的影响',
    status: 'running',
    appVersion: 'v5.2.0',
    appName: '乐享生活',
    startTime: '2026-06-05',
    createdAt: '2026-06-02',
    progress: 42,
    type: 'popup',
    hypothesis: '更强调稀缺性的弹窗文案可以提升新用户转化率',
  },
  {
    id: 'exp-003',
    name: '会员权益展示方式实验',
    description: '测试不同的会员权益展示方式对开通率的影响',
    status: 'ended',
    appVersion: 'v5.1.0',
    appName: '乐享生活',
    startTime: '2026-05-15',
    endTime: '2026-05-25',
    createdAt: '2026-05-10',
    progress: 100,
    type: 'benefit',
    hypothesis: '卡片式权益展示比列表式展示更能提升会员开通率',
  },
  {
    id: 'exp-004',
    name: '签到入口位置测试',
    description: '测试签到功能在不同位置的点击率差异',
    status: 'paused',
    appVersion: 'v5.2.0',
    appName: '乐享生活',
    startTime: '2026-06-10',
    createdAt: '2026-06-08',
    progress: 20,
    type: 'entry',
    hypothesis: '将签到入口放在首页底部可以提升每日签到率',
  },
  {
    id: 'exp-005',
    name: '积分商城入口测试',
    description: '测试积分商城入口的不同设计方案',
    status: 'draft',
    appVersion: 'v5.3.0',
    appName: '乐享生活',
    startTime: '',
    createdAt: '2026-06-12',
    progress: 0,
    type: 'entry',
    hypothesis: '使用动效的积分入口比静态入口点击率更高',
  },
];

export const mockGroups: Record<string, ExperimentGroup[]> = {
  'exp-001': [
    {
      id: 'group-001-1',
      name: '对照组',
      type: 'control',
      trafficPercent: 50,
      materialConfig: {
        entryConfig: {
          icon: 'crown',
          title: '会员中心',
          subtitle: '尊享专属权益',
          position: '底部Tab',
        },
      },
    },
    {
      id: 'group-001-2',
      name: '实验组',
      type: 'variant',
      trafficPercent: 50,
      materialConfig: {
        entryConfig: {
          icon: 'gem',
          title: '超级会员',
          subtitle: '限时8折开通',
          position: '首页顶部',
          badgeText: 'HOT',
        },
      },
    },
  ],
  'exp-002': [
    {
      id: 'group-002-1',
      name: '对照组',
      type: 'control',
      trafficPercent: 50,
      materialConfig: {
        popupConfig: {
          title: '新人专享礼包',
          content: '注册即可领取100元新人礼包，包含多张优惠券',
          buttonText: '立即领取',
          secondaryButtonText: '稍后再说',
        },
      },
    },
    {
      id: 'group-002-2',
      name: '实验组',
      type: 'variant',
      trafficPercent: 50,
      materialConfig: {
        popupConfig: {
          title: '仅剩最后3个名额！',
          content: '100元新人礼包限时领取，今日已被领取987份',
          buttonText: '马上抢',
          secondaryButtonText: '放弃优惠',
        },
      },
    },
  ],
  'exp-003': [
    {
      id: 'group-003-1',
      name: '对照组',
      type: 'control',
      trafficPercent: 50,
      materialConfig: {
        benefitConfig: {
          title: '月度会员',
          subtitle: '尊享10+项会员权益',
          benefits: ['免广告', '专属客服', '积分加倍', '专属活动'],
          originalPrice: '¥30/月',
          discountPrice: '¥25/月',
        },
      },
    },
    {
      id: 'group-003-2',
      name: '实验组',
      type: 'variant',
      trafficPercent: 50,
      materialConfig: {
        benefitConfig: {
          title: '年度会员',
          subtitle: '立省90元，限时特惠',
          benefits: ['免广告', '专属客服', '积分加倍', '专属活动', '生日礼包', '优先体验'],
          originalPrice: '¥360/年',
          discountPrice: '¥258/年',
          badgeText: '超值推荐',
        },
      },
    },
  ],
  'exp-004': [
    {
      id: 'group-004-1',
      name: '对照组',
      type: 'control',
      trafficPercent: 50,
      materialConfig: {
        entryConfig: {
          icon: 'calendar',
          title: '每日签到',
          subtitle: '连续签到领好礼',
          position: '我的页面',
        },
      },
    },
    {
      id: 'group-004-2',
      name: '实验组',
      type: 'variant',
      trafficPercent: 50,
      materialConfig: {
        entryConfig: {
          icon: 'calendar-check',
          title: '签到领积分',
          subtitle: '连续7天得大奖',
          position: '首页底部',
          badgeText: '新',
        },
      },
    },
  ],
  'exp-005': [
    {
      id: 'group-005-1',
      name: '对照组',
      type: 'control',
      trafficPercent: 50,
      materialConfig: {
        entryConfig: {
          icon: 'gift',
          title: '积分商城',
          subtitle: '积分换好物',
          position: '我的页面',
        },
      },
    },
    {
      id: 'group-005-2',
      name: '实验组',
      type: 'variant',
      trafficPercent: 50,
      materialConfig: {
        entryConfig: {
          icon: 'store',
          title: '积分商城',
          subtitle: '限时兑换',
          position: '首页顶部',
          badgeText: '热门',
        },
      },
    },
  ],
};

export const mockSegmentRules: Record<string, SegmentRule> = {
  'exp-001': {
    regions: ['北京市', '上海市', '广州市', '深圳市', '杭州市'],
    channels: ['AppStore', '华为应用市场', '小米应用商店', 'OPPO软件商店'],
    dailyExposureLimit: 100000,
    totalExposureLimit: 5000000,
    populationPercent: 10,
  },
  'exp-002': {
    regions: ['全国'],
    channels: ['AppStore', '应用宝', '华为应用市场'],
    dailyExposureLimit: 50000,
    totalExposureLimit: 2000000,
    populationPercent: 15,
  },
  'exp-003': {
    regions: ['北京市', '上海市', '广州市', '深圳市'],
    channels: ['AppStore', '华为应用市场'],
    dailyExposureLimit: 80000,
    totalExposureLimit: 3000000,
    populationPercent: 20,
  },
  'exp-004': {
    regions: ['北京市', '上海市', '广州市', '深圳市', '成都市', '武汉市'],
    channels: ['AppStore', '华为应用市场', '小米应用商店', 'vivo应用商店'],
    dailyExposureLimit: 60000,
    totalExposureLimit: 1500000,
    populationPercent: 8,
  },
  'exp-005': {
    regions: ['全国'],
    channels: ['AppStore', '华为应用市场', '小米应用商店', 'OPPO软件商店', 'vivo应用商店', '应用宝'],
    dailyExposureLimit: 120000,
    totalExposureLimit: 6000000,
    populationPercent: 12,
  },
};

export const generateMockMetricData = (
  days: number = 14,
  metricType: 'clickRate' | 'conversion' | 'retention' = 'clickRate',
  experimentId?: string
): MetricData[] => {
  const data: MetricData[] = [];
  const today = new Date();
  
  const baseValues: Record<string, { control: number; variant: number }> = {
    'exp-001': { control: 0.07, variant: 0.09 },
    'exp-002': { control: 0.13, variant: 0.17 },
    'exp-003': { control: 0.05, variant: 0.065 },
    'exp-004': { control: 0.045, variant: 0.058 },
    'exp-005': { control: 0.06, variant: 0.075 },
  };
  
  const metricMultiplier: Record<string, number> = {
    clickRate: 1,
    conversion: 0.35,
    retention: 4,
  };
  
  const base = experimentId && baseValues[experimentId] 
    ? baseValues[experimentId] 
    : { control: 0.08, variant: 0.095 };
  const multiplier = metricMultiplier[metricType] || 1;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
    
    const controlBase = base.control * multiplier;
    const variantBase = base.variant * multiplier;
    
    data.push({
      date: dateStr,
      control: parseFloat((controlBase + (Math.random() - 0.5) * controlBase * 0.2).toFixed(4)),
      variant: parseFloat((variantBase + (Math.random() - 0.5) * variantBase * 0.2).toFixed(4)),
    });
  }
  
  return data;
};

export const mockGroupMetrics: Record<string, GroupMetrics[]> = {
  'exp-001': [
    {
      groupId: 'group-001-1',
      groupName: '对照组',
      type: 'control',
      coreMetrics: {
        impressions: 1250000,
        clicks: 87500,
        clickRate: 0.07,
        conversionRate: 0.023,
        retention7d: 0.35,
      },
    },
    {
      groupId: 'group-001-2',
      groupName: '实验组',
      type: 'variant',
      coreMetrics: {
        impressions: 1245000,
        clicks: 112050,
        clickRate: 0.09,
        conversionRate: 0.029,
        retention7d: 0.38,
      },
    },
  ],
  'exp-002': [
    {
      groupId: 'group-002-1',
      groupName: '对照组',
      type: 'control',
      coreMetrics: {
        impressions: 580000,
        clicks: 75400,
        clickRate: 0.13,
        conversionRate: 0.065,
        retention7d: 0.28,
      },
    },
    {
      groupId: 'group-002-2',
      groupName: '实验组',
      type: 'variant',
      coreMetrics: {
        impressions: 575000,
        clicks: 97750,
        clickRate: 0.17,
        conversionRate: 0.082,
        retention7d: 0.31,
      },
    },
  ],
  'exp-003': [
    {
      groupId: 'group-003-1',
      groupName: '对照组',
      type: 'control',
      coreMetrics: {
        impressions: 920000,
        clicks: 46000,
        clickRate: 0.05,
        conversionRate: 0.018,
        retention7d: 0.42,
      },
    },
    {
      groupId: 'group-003-2',
      groupName: '实验组',
      type: 'variant',
      coreMetrics: {
        impressions: 915000,
        clicks: 59475,
        clickRate: 0.065,
        conversionRate: 0.024,
        retention7d: 0.45,
      },
    },
  ],
  'exp-004': [
    {
      groupId: 'group-004-1',
      groupName: '对照组',
      type: 'control',
      coreMetrics: {
        impressions: 320000,
        clicks: 14400,
        clickRate: 0.045,
        conversionRate: 0.012,
        retention7d: 0.22,
      },
    },
    {
      groupId: 'group-004-2',
      groupName: '实验组',
      type: 'variant',
      coreMetrics: {
        impressions: 318000,
        clicks: 18444,
        clickRate: 0.058,
        conversionRate: 0.015,
        retention7d: 0.25,
      },
    },
  ],
  'exp-005': [
    {
      groupId: 'group-005-1',
      groupName: '对照组',
      type: 'control',
      coreMetrics: {
        impressions: 450000,
        clicks: 27000,
        clickRate: 0.06,
        conversionRate: 0.021,
        retention7d: 0.30,
      },
    },
    {
      groupId: 'group-005-2',
      groupName: '实验组',
      type: 'variant',
      coreMetrics: {
        impressions: 448000,
        clicks: 33600,
        clickRate: 0.075,
        conversionRate: 0.026,
        retention7d: 0.33,
      },
    },
  ],
};

export const mockComments: Comment[] = [
  {
    id: 'comment-001',
    userId: 'user-001',
    userName: '张运营',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
    content: '实验组的点击率提升很明显，建议继续观察留存数据的稳定性。',
    createdAt: '2026-06-12 14:30',
    replies: [
      {
        id: 'comment-001-1',
        userId: 'user-002',
        userName: '李产品',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
        content: '同意，再观察3天看看数据是否稳定',
        createdAt: '2026-06-12 15:10',
      },
    ],
  },
  {
    id: 'comment-002',
    userId: 'user-003',
    userName: '王增长',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3',
    content: '有没有可能是因为新入口位置更显眼导致的？建议考虑位置因素的影响。',
    createdAt: '2026-06-13 09:45',
  },
];

export const mockHypothesis: ExperimentHypothesis[] = [
  {
    id: 'hypo-001',
    assumption: '将会员入口移至首页顶部并更换图标可以提升15%以上的点击率',
    conclusion: '实验组点击率提升28.6%，置信度95%以上，假设成立。位置因素是主要原因，建议全量上线。',
    tags: ['会员入口', '点击率', '位置优化'],
    result: 'positive',
  },
  {
    id: 'hypo-002',
    assumption: '更强调稀缺性的弹窗文案可以提升新用户转化率',
    conclusion: '实验组转化率提升26.2%，稀缺性文案确实能促使用户更快做出决策，建议在大促期间使用。',
    tags: ['弹窗文案', '转化率', '稀缺性'],
    result: 'positive',
  },
  {
    id: 'hypo-003',
    assumption: '卡片式权益展示比列表式展示更能提升会员开通率',
    conclusion: '实验组开通率提升30%，卡片式展示视觉效果更好，建议全量上线年度会员卡片。',
    tags: ['会员权益', '开通率', '展示方式'],
    result: 'positive',
  },
];

export const mockAlerts: AbnormalAlert[] = [
  {
    id: 'alert-001',
    type: 'click_rate',
    severity: 'medium',
    description: '6月14日实验组点击率较昨日下降12%',
    timestamp: '2026-06-14 10:30',
    metricChange: '-12%',
    possibleReasons: ['周末效应', '渠道流量波动', '竞品活动影响'],
  },
  {
    id: 'alert-002',
    type: 'conversion',
    severity: 'low',
    description: '对照组转化率近3天有轻微上升趋势',
    timestamp: '2026-06-13 16:00',
    metricChange: '+5%',
    possibleReasons: ['正常波动', '运营活动影响'],
  },
  {
    id: 'alert-003',
    type: 'retention',
    severity: 'high',
    description: '实验组7日留存率较上周下降8%',
    timestamp: '2026-06-11 09:00',
    metricChange: '-8%',
    possibleReasons: ['版本更新影响', '新用户质量变化', '功能异常'],
  },
];

export const mockAppVersions: AppVersion[] = [
  { id: 'v1', version: 'v5.3.0', name: '乐享生活 v5.3.0', description: '最新版本，包含积分商城功能', releaseDate: '2026-06-15' },
  { id: 'v2', version: 'v5.2.0', name: '乐享生活 v5.2.0', description: '当前主流版本，会员体系优化', releaseDate: '2026-05-20' },
  { id: 'v3', version: 'v5.1.0', name: '乐享生活 v5.1.0', description: '旧版本，逐步退出', releaseDate: '2026-04-10' },
];

export const mockRegions: Region[] = [
  { id: 'bj', name: '北京市', type: 'city' },
  { id: 'sh', name: '上海市', type: 'city' },
  { id: 'gz', name: '广州市', type: 'city' },
  { id: 'sz', name: '深圳市', type: 'city' },
  { id: 'hz', name: '杭州市', type: 'city' },
  { id: 'cd', name: '成都市', type: 'city' },
  { id: 'wh', name: '武汉市', type: 'city' },
  { id: 'xa', name: '西安市', type: 'city' },
  { id: 'nj', name: '南京市', type: 'city' },
  { id: 'cq', name: '重庆市', type: 'city' },
  { id: 'tj', name: '天津市', type: 'city' },
  { id: 'su', name: '苏州市', type: 'city' },
  { id: 'xz', name: '徐州市', type: 'city' },
  { id: 'nationwide', name: '全国', type: 'province' },
];

export const mockChannels: Channel[] = [
  { id: 'appstore', name: 'AppStore', category: '官方渠道', icon: 'apple' },
  { id: 'huawei', name: '华为应用市场', category: '安卓渠道', icon: 'smartphone' },
  { id: 'xiaomi', name: '小米应用商店', category: '安卓渠道', icon: 'smartphone' },
  { id: 'oppo', name: 'OPPO软件商店', category: '安卓渠道', icon: 'smartphone' },
  { id: 'vivo', name: 'vivo应用商店', category: '安卓渠道', icon: 'smartphone' },
  { id: 'yingyongbao', name: '应用宝', category: '安卓渠道', icon: 'shopping-bag' },
  { id: 'baidu', name: '百度手机助手', category: '安卓渠道', icon: 'search' },
  { id: 'taobao', name: '淘宝推广', category: '推广渠道', icon: 'megaphone' },
  { id: 'wechat', name: '微信推广', category: '推广渠道', icon: 'message-circle' },
  { id: 'douyin', name: '抖音推广', category: '推广渠道', icon: 'video' },
];

export const mockOverviewStats = {
  runningExperiments: 2,
  totalImpressions: 3250000,
  avgClickRate: 0.083,
  avgRetention7d: 0.34,
  completedExperiments: 12,
  successRate: 0.67,
};

export const generateDefaultGroups = (experimentId: string, type: 'entry' | 'popup' | 'benefit'): ExperimentGroup[] => {
  const timestamp = Date.now();
  
  const defaultConfigs = {
    entry: {
      control: {
        entryConfig: {
          icon: 'default',
          title: '功能入口',
          subtitle: '点击查看详情',
          position: '默认位置',
        },
      },
      variant: {
        entryConfig: {
          icon: 'star',
          title: '新功能入口',
          subtitle: '全新体验',
          position: '新位置',
          badgeText: 'NEW',
        },
      },
    },
    popup: {
      control: {
        popupConfig: {
          title: '温馨提示',
          content: '欢迎使用我们的服务',
          buttonText: '知道了',
          secondaryButtonText: '取消',
        },
      },
      variant: {
        popupConfig: {
          title: '限时优惠',
          content: '新用户专享福利，立即领取',
          buttonText: '立即领取',
          secondaryButtonText: '稍后再说',
        },
      },
    },
    benefit: {
      control: {
        benefitConfig: {
          title: '普通会员',
          subtitle: '基础会员权益',
          benefits: ['权益1', '权益2', '权益3'],
          originalPrice: '¥30/月',
          discountPrice: '¥25/月',
        },
      },
      variant: {
        benefitConfig: {
          title: '高级会员',
          subtitle: '尊享全部权益',
          benefits: ['权益1', '权益2', '权益3', '权益4', '权益5'],
          originalPrice: '¥60/月',
          discountPrice: '¥45/月',
          badgeText: '推荐',
        },
      },
    },
  };
  
  return [
    {
      id: `${experimentId}-control-${timestamp}`,
      name: '对照组',
      type: 'control' as const,
      trafficPercent: 50,
      materialConfig: defaultConfigs[type].control,
    },
    {
      id: `${experimentId}-variant-${timestamp}`,
      name: '实验组',
      type: 'variant' as const,
      trafficPercent: 50,
      materialConfig: defaultConfigs[type].variant,
    },
  ];
};

export const generateDefaultSegmentRule = (): SegmentRule => ({
  regions: ['全国'],
  channels: ['AppStore', '华为应用市场', '小米应用商店'],
  dailyExposureLimit: 100000,
  totalExposureLimit: 5000000,
  populationPercent: 10,
});
