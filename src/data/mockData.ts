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
};

export const generateMockMetricData = (days: number = 14): MetricData[] => {
  const data: MetricData[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
    
    const baseValue = 0.08 + Math.random() * 0.04;
    data.push({
      date: dateStr,
      control: parseFloat((baseValue + (Math.random() - 0.5) * 0.02).toFixed(4)),
      variant: parseFloat((baseValue + 0.015 + (Math.random() - 0.5) * 0.02).toFixed(4)),
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
];

export const mockOverviewStats = {
  runningExperiments: 2,
  totalImpressions: 3250000,
  avgClickRate: 0.083,
  avgRetention7d: 0.34,
  completedExperiments: 12,
  successRate: 0.67,
};
