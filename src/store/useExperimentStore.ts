import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
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
  generateDefaultGroups,
  generateDefaultSegmentRule,
} from '@/data/mockData';

interface ExperimentData {
  groups: ExperimentGroup[];
  segmentRule: SegmentRule;
  metrics: { groupId: string; groupName: string; type: string; coreMetrics: CoreMetrics }[];
  comments: Comment[];
  hypothesis: ExperimentHypothesis[];
  alerts: AbnormalAlert[];
  isFrozen: boolean;
  trendData: Record<string, MetricData[]>;
}

interface ExperimentStore {
  experiments: Experiment[];
  currentExperimentId: string | null;
  overviewStats: typeof mockOverviewStats;
  experimentsData: Record<string, ExperimentData>;
  
  setCurrentExperiment: (id: string) => void;
  getCurrentExperiment: () => Experiment | null;
  getCurrentGroups: () => ExperimentGroup[];
  getCurrentSegmentRule: () => SegmentRule | null;
  getCurrentMetrics: () => { groupId: string; groupName: string; type: string; coreMetrics: CoreMetrics }[];
  getCurrentComments: () => Comment[];
  getCurrentHypothesis: () => ExperimentHypothesis[];
  getCurrentAlerts: () => AbnormalAlert[];
  getCurrentIsFrozen: () => boolean;
  getMetricTrendData: (metricType: 'clickRate' | 'conversion' | 'retention', days: number) => MetricData[];
  
  updateExperiment: (id: string, data: Partial<Experiment>) => void;
  updateGroup: (groupId: string, data: Partial<ExperimentGroup>) => void;
  updateSegmentRule: (data: Partial<SegmentRule>) => void;
  addComment: (content: string, userName: string) => void;
  updateHypothesis: (data: Partial<ExperimentHypothesis>) => void;
  freezeResults: () => void;
  endExperiment: (id: string) => void;
  addExperiment: (experiment: Omit<Experiment, 'id' | 'createdAt' | 'progress'>) => string;
  
  getExperimentData: (id: string) => ExperimentData | undefined;
  ensureExperimentData: (id: string, type: 'entry' | 'popup' | 'benefit') => void;
  
  clearAllData: () => void;
}

const initializeExperimentData = (): Record<string, ExperimentData> => {
  const data: Record<string, ExperimentData> = {};
  
  mockExperiments.forEach(exp => {
    const trendData: Record<string, MetricData[]> = {};
    ['clickRate', 'conversion', 'retention'].forEach(metric => {
      [7, 14, 30].forEach(days => {
        trendData[`${metric}-${days}`] = generateMockMetricData(
          days,
          metric as 'clickRate' | 'conversion' | 'retention',
          exp.id
        );
      });
    });
    
    data[exp.id] = {
      groups: mockGroups[exp.id] || generateDefaultGroups(exp.id, exp.type),
      segmentRule: mockSegmentRules[exp.id] || generateDefaultSegmentRule(),
      metrics: mockGroupMetrics[exp.id] || [],
      comments: [...mockComments],
      hypothesis: mockHypothesis.filter(h => h.id === `hypo-${exp.id.split('-')[1]}`) || [],
      alerts: mockAlerts.slice(0, 2),
      isFrozen: false,
      trendData,
    };
  });
  
  return data;
};

export const useExperimentStore = create<ExperimentStore>()(
  persist(
    (set, get) => ({
      experiments: mockExperiments,
      currentExperimentId: null,
      overviewStats: mockOverviewStats,
      
      experimentsData: initializeExperimentData(),
      
      setCurrentExperiment: (id: string) => {
        const state = get();
        const experiment = state.experiments.find(e => e.id === id);
        if (experiment) {
          state.ensureExperimentData(id, experiment.type);
        }
        set({ currentExperimentId: id });
      },
      
      getCurrentExperiment: () => {
        const state = get();
        if (!state.currentExperimentId) return null;
        return state.experiments.find(e => e.id === state.currentExperimentId) || null;
      },
      
      getCurrentGroups: () => {
        const state = get();
        if (!state.currentExperimentId) return [];
        const data = state.getExperimentData(state.currentExperimentId);
        return data?.groups || [];
      },
      
      getCurrentSegmentRule: () => {
        const state = get();
        if (!state.currentExperimentId) return null;
        const data = state.getExperimentData(state.currentExperimentId);
        return data?.segmentRule || null;
      },
      
      getCurrentMetrics: () => {
        const state = get();
        if (!state.currentExperimentId) return [];
        const data = state.getExperimentData(state.currentExperimentId);
        return data?.metrics || [];
      },
      
      getCurrentComments: () => {
        const state = get();
        if (!state.currentExperimentId) return [];
        const data = state.getExperimentData(state.currentExperimentId);
        return data?.comments || [];
      },
      
      getCurrentHypothesis: () => {
        const state = get();
        if (!state.currentExperimentId) return [];
        const data = state.getExperimentData(state.currentExperimentId);
        return data?.hypothesis || [];
      },
      
      getCurrentAlerts: () => {
        const state = get();
        if (!state.currentExperimentId) return [];
        const data = state.getExperimentData(state.currentExperimentId);
        return data?.alerts || [];
      },
      
      getCurrentIsFrozen: () => {
        const state = get();
        if (!state.currentExperimentId) return false;
        const data = state.getExperimentData(state.currentExperimentId);
        return data?.isFrozen || false;
      },
      
      getMetricTrendData: (metricType: 'clickRate' | 'conversion' | 'retention', days: number) => {
        const state = get();
        if (!state.currentExperimentId) return [];
        const data = state.getExperimentData(state.currentExperimentId);
        const key = `${metricType}-${days}`;
        return data?.trendData?.[key] || generateMockMetricData(days, metricType, state.currentExperimentId);
      },
      
      getExperimentData: (id: string) => {
        const state = get() as any;
        return state.experimentsData?.[id];
      },
      
      ensureExperimentData: (id: string, type: 'entry' | 'popup' | 'benefit') => {
        const state = get() as any;
        if (!state.experimentsData[id]) {
          const trendData: Record<string, MetricData[]> = {};
          ['clickRate', 'conversion', 'retention'].forEach(metric => {
            [7, 14, 30].forEach(days => {
              trendData[`${metric}-${days}`] = generateMockMetricData(
                days,
                metric as 'clickRate' | 'conversion' | 'retention',
                id
              );
            });
          });
          
          set((state: any) => ({
            experimentsData: {
              ...state.experimentsData,
              [id]: {
                groups: generateDefaultGroups(id, type),
                segmentRule: generateDefaultSegmentRule(),
                metrics: [],
                comments: [],
                hypothesis: [],
                alerts: [],
                isFrozen: false,
                trendData,
              },
            },
          }));
        }
      },
      
      updateExperiment: (id: string, data: Partial<Experiment>) => {
        set((state) => ({
          experiments: state.experiments.map(e =>
            e.id === id ? { ...e, ...data } : e
          ),
        }));
      },
      
      updateGroup: (groupId: string, data: Partial<ExperimentGroup>) => {
        const state = get();
        if (!state.currentExperimentId) return;
        
        set((state: any) => ({
          experimentsData: {
            ...state.experimentsData,
            [state.currentExperimentId!]: {
              ...state.experimentsData[state.currentExperimentId!],
              groups: state.experimentsData[state.currentExperimentId!].groups.map((g: ExperimentGroup) =>
                g.id === groupId ? { ...g, ...data } : g
              ),
            },
          },
        }));
      },
      
      updateSegmentRule: (data: Partial<SegmentRule>) => {
        const state = get();
        if (!state.currentExperimentId) return;
        
        set((state: any) => ({
          experimentsData: {
            ...state.experimentsData,
            [state.currentExperimentId!]: {
              ...state.experimentsData[state.currentExperimentId!],
              segmentRule: {
                ...state.experimentsData[state.currentExperimentId!].segmentRule,
                ...data,
              },
            },
          },
        }));
      },
      
      addComment: (content: string, userName: string) => {
        const state = get();
        if (!state.currentExperimentId) return;
        
        const newComment: Comment = {
          id: `comment-${Date.now()}`,
          userId: 'current-user',
          userName,
          userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`,
          content,
          createdAt: new Date().toLocaleString('zh-CN'),
          replies: [],
        };
        
        set((state: any) => ({
          experimentsData: {
            ...state.experimentsData,
            [state.currentExperimentId!]: {
              ...state.experimentsData[state.currentExperimentId!],
              comments: [newComment, ...state.experimentsData[state.currentExperimentId!].comments],
            },
          },
        }));
      },
      
      updateHypothesis: (data: Partial<ExperimentHypothesis>) => {
        const state = get();
        if (!state.currentExperimentId) return;
        
        set((state: any) => {
          const expData = state.experimentsData[state.currentExperimentId!];
          if (!expData) return state;
          
          let newHypothesis: ExperimentHypothesis[];
          if (expData.hypothesis.length === 0) {
            newHypothesis = [{
              id: `hypo-${Date.now()}`,
              assumption: data.assumption || '',
              conclusion: data.conclusion || '',
              tags: data.tags || [],
              result: data.result || 'neutral',
            }];
          } else {
            newHypothesis = expData.hypothesis.map((h: ExperimentHypothesis) => ({ ...h, ...data }));
          }
          
          return {
            experimentsData: {
              ...state.experimentsData,
              [state.currentExperimentId!]: {
                ...expData,
                hypothesis: newHypothesis,
              },
            },
          };
        });
      },
      
      freezeResults: () => {
        const state = get();
        if (!state.currentExperimentId) return;
        
        set((state: any) => ({
          experimentsData: {
            ...state.experimentsData,
            [state.currentExperimentId!]: {
              ...state.experimentsData[state.currentExperimentId!],
              isFrozen: true,
            },
          },
        }));
      },
      
      endExperiment: (id: string) => {
        set((state) => ({
          experiments: state.experiments.map(e =>
            e.id === id ? { 
              ...e, 
              status: 'ended', 
              endTime: new Date().toISOString().split('T')[0], 
              progress: 100 
            } : e
          ),
        }));
      },
      
      addExperiment: (experiment) => {
        const newId = `exp-${Date.now()}`;
        const newExperiment: Experiment = {
          ...experiment,
          id: newId,
          createdAt: new Date().toISOString().split('T')[0],
          progress: 0,
        };
        
        set((state) => ({
          experiments: [newExperiment, ...state.experiments],
        }));
        
        get().ensureExperimentData(newId, experiment.type);
        
        return newId;
      },
      
      clearAllData: () => {
        set({
          experiments: mockExperiments,
          currentExperimentId: null,
          experimentsData: initializeExperimentData(),
        });
      },
    }),
    {
      name: 'ab-testing-storage-v2',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        experiments: state.experiments,
        experimentsData: (state as any).experimentsData,
        currentExperimentId: state.currentExperimentId,
      }),
      merge: (persistedState, currentState) => {
        const defaultData = initializeExperimentData();
        const persisted = persistedState as any;
        
        if (!persisted || !persisted.experimentsData || Object.keys(persisted.experimentsData).length === 0) {
          return currentState;
        }
        
        const hasValidMetrics = Object.values(persisted.experimentsData).some((d: any) => 
          d.metrics && d.metrics.length > 0 && d.metrics[0].coreMetrics.impressions > 0
        );
        
        if (!hasValidMetrics) {
          return {
            ...currentState,
            experiments: mockExperiments,
            experimentsData: defaultData,
            currentExperimentId: persisted?.currentExperimentId || null,
          };
        }
        
        const mergedExperimentsData: Record<string, ExperimentData> = {};
        Object.keys(defaultData).forEach(expId => {
          const defaultExpData = defaultData[expId];
          const persistedExpData = persisted.experimentsData?.[expId];
          
          if (persistedExpData) {
            mergedExperimentsData[expId] = {
              ...defaultExpData,
              ...persistedExpData,
              groups: persistedExpData.groups || defaultExpData.groups,
              segmentRule: persistedExpData.segmentRule || defaultExpData.segmentRule,
              metrics: persistedExpData.metrics?.length > 0 && persistedExpData.metrics[0].coreMetrics.impressions > 0
                ? persistedExpData.metrics
                : defaultExpData.metrics,
              comments: persistedExpData.comments || defaultExpData.comments,
              hypothesis: persistedExpData.hypothesis || defaultExpData.hypothesis,
              alerts: persistedExpData.alerts || defaultExpData.alerts,
              trendData: defaultExpData.trendData,
            };
          } else {
            mergedExperimentsData[expId] = defaultExpData;
          }
        });
        
        return {
          ...currentState,
          experiments: persisted.experiments || mockExperiments,
          experimentsData: mergedExperimentsData,
          currentExperimentId: persisted.currentExperimentId || null,
        };
      },
    }
  )
);
