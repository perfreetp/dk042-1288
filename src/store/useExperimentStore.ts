import { create } from 'zustand';
import type {
  Experiment,
  ExperimentGroup,
  SegmentRule,
  Comment,
  ExperimentHypothesis,
  AbnormalAlert,
  CoreMetrics,
  MetricData,
} from '@/types';
import {
  mockExperiments,
  mockGroups,
  mockSegmentRules,
  mockGroupMetrics,
  mockComments,
  mockHypothesis,
  mockAlerts,
  mockOverviewStats,
  generateMockMetricData,
} from '@/data/mockData';

interface ExperimentStore {
  experiments: Experiment[];
  currentExperiment: Experiment | null;
  currentGroups: ExperimentGroup[];
  currentSegmentRule: SegmentRule | null;
  currentMetrics: { groupId: string; groupName: string; type: string; coreMetrics: CoreMetrics }[];
  metricTrendData: MetricData[];
  comments: Comment[];
  hypothesis: ExperimentHypothesis[];
  alerts: AbnormalAlert[];
  overviewStats: typeof mockOverviewStats;
  isFrozen: boolean;
  
  setCurrentExperiment: (id: string) => void;
  updateExperiment: (id: string, data: Partial<Experiment>) => void;
  updateGroup: (groupId: string, data: Partial<ExperimentGroup>) => void;
  updateSegmentRule: (data: Partial<SegmentRule>) => void;
  addComment: (content: string, userName: string) => void;
  updateHypothesis: (data: Partial<ExperimentHypothesis>) => void;
  freezeResults: () => void;
  endExperiment: (id: string) => void;
  addExperiment: (experiment: Omit<Experiment, 'id' | 'createdAt' | 'progress'>) => void;
}

export const useExperimentStore = create<ExperimentStore>((set, get) => ({
  experiments: mockExperiments,
  currentExperiment: null,
  currentGroups: [],
  currentSegmentRule: null,
  currentMetrics: [],
  metricTrendData: [],
  comments: [],
  hypothesis: [],
  alerts: [],
  overviewStats: mockOverviewStats,
  isFrozen: false,

  setCurrentExperiment: (id: string) => {
    const experiment = get().experiments.find(e => e.id === id);
    const groups = mockGroups[id] || [];
    const segmentRule = mockSegmentRules[id] || null;
    const metrics = mockGroupMetrics[id] || [];
    const trendData = generateMockMetricData(14);
    
    set({
      currentExperiment: experiment || null,
      currentGroups: groups,
      currentSegmentRule: segmentRule,
      currentMetrics: metrics,
      metricTrendData: trendData,
      comments: mockComments,
      hypothesis: mockHypothesis.filter(h => h.id === 'hypo-001'),
      alerts: mockAlerts.filter(a => a.id === 'alert-001'),
      isFrozen: false,
    });
  },

  updateExperiment: (id: string, data: Partial<Experiment>) => {
    set(state => ({
      experiments: state.experiments.map(e =>
        e.id === id ? { ...e, ...data } : e
      ),
      currentExperiment: state.currentExperiment?.id === id
        ? { ...state.currentExperiment, ...data }
        : state.currentExperiment,
    }));
  },

  updateGroup: (groupId: string, data: Partial<ExperimentGroup>) => {
    set(state => ({
      currentGroups: state.currentGroups.map(g =>
        g.id === groupId ? { ...g, ...data } : g
      ),
    }));
  },

  updateSegmentRule: (data: Partial<SegmentRule>) => {
    set(state => ({
      currentSegmentRule: state.currentSegmentRule
        ? { ...state.currentSegmentRule, ...data }
        : null,
    }));
  },

  addComment: (content: string, userName: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      userId: 'current-user',
      userName,
      userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`,
      content,
      createdAt: new Date().toLocaleString('zh-CN'),
      replies: [],
    };
    set(state => ({
      comments: [newComment, ...state.comments],
    }));
  },

  updateHypothesis: (data: Partial<ExperimentHypothesis>) => {
    set(state => {
      if (state.hypothesis.length === 0) {
        const newHypothesis: ExperimentHypothesis = {
          id: `hypo-${Date.now()}`,
          assumption: data.assumption || '',
          conclusion: data.conclusion || '',
          tags: data.tags || [],
          result: data.result || 'neutral',
        };
        return { hypothesis: [newHypothesis] };
      }
      return {
        hypothesis: state.hypothesis.map(h => ({ ...h, ...data })),
      };
    });
  },

  freezeResults: () => {
    set({ isFrozen: true });
  },

  endExperiment: (id: string) => {
    set(state => ({
      experiments: state.experiments.map(e =>
        e.id === id ? { ...e, status: 'ended', endTime: new Date().toISOString().split('T')[0], progress: 100 } : e
      ),
      currentExperiment: state.currentExperiment?.id === id
        ? { ...state.currentExperiment, status: 'ended', endTime: new Date().toISOString().split('T')[0], progress: 100 }
        : state.currentExperiment,
    }));
  },

  addExperiment: (experiment) => {
    const newExperiment: Experiment = {
      ...experiment,
      id: `exp-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      progress: 0,
    };
    set(state => ({
      experiments: [newExperiment, ...state.experiments],
    }));
  },
}));
