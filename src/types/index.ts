export type ExperimentStatus = 'draft' | 'running' | 'paused' | 'ended';

export interface Experiment {
  id: string;
  name: string;
  description: string;
  status: ExperimentStatus;
  appVersion: string;
  appName: string;
  startTime: string;
  endTime?: string;
  createdAt: string;
  progress: number;
  type: 'entry' | 'popup' | 'benefit';
  hypothesis: string;
}

export interface ExperimentGroup {
  id: string;
  name: string;
  type: 'control' | 'variant';
  trafficPercent: number;
  materialConfig: MaterialConfig;
}

export interface MaterialConfig {
  entryConfig?: EntryConfig;
  popupConfig?: PopupConfig;
  benefitConfig?: BenefitConfig;
}

export interface EntryConfig {
  icon: string;
  title: string;
  subtitle: string;
  position: string;
  badgeText?: string;
}

export interface PopupConfig {
  title: string;
  content: string;
  buttonText: string;
  secondaryButtonText?: string;
  imageUrl?: string;
}

export interface BenefitConfig {
  title: string;
  subtitle: string;
  benefits: string[];
  originalPrice: string;
  discountPrice: string;
  badgeText?: string;
}

export interface SegmentRule {
  regions: string[];
  channels: string[];
  dailyExposureLimit: number;
  totalExposureLimit: number;
  populationPercent: number;
}

export interface MetricData {
  date: string;
  control: number;
  variant: number;
}

export interface CoreMetrics {
  impressions: number;
  clicks: number;
  clickRate: number;
  conversionRate: number;
  retention7d: number;
}

export interface GroupMetrics {
  groupId: string;
  groupName: string;
  type: 'control' | 'variant';
  coreMetrics: CoreMetrics;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  replies?: Comment[];
}

export interface ExperimentHypothesis {
  id: string;
  assumption: string;
  conclusion: string;
  tags: string[];
  result: 'positive' | 'negative' | 'neutral';
}

export interface AbnormalAlert {
  id: string;
  type: 'click_rate' | 'retention' | 'conversion';
  severity: 'high' | 'medium' | 'low';
  description: string;
  timestamp: string;
  metricChange: string;
  possibleReasons: string[];
}

export interface AppVersion {
  id: string;
  version: string;
  name: string;
  description: string;
  releaseDate: string;
}

export interface Region {
  id: string;
  name: string;
  type: 'province' | 'city';
  parentId?: string;
}

export interface Channel {
  id: string;
  name: string;
  category: string;
  icon: string;
}

export interface OptimizationPlan {
  id: string;
  experimentId: string;
  experimentName: string;
  conclusionSummary: string;
  owner: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in_progress' | 'done';
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'comment_mention' | 'invite';
  experimentId: string;
  experimentName: string;
  fromUserName: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}
