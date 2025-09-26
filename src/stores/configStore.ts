import { create } from 'zustand';
import type { SystemConfig, TierConfig } from '@/types';
import { db, PROJECT_PREFIX } from '@/config/firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

interface ConfigState {
  config: SystemConfig | null;
  userLimits: TierConfig['limits'] | null;
  loading: boolean;
  fetchConfig: () => Promise<void>;
  checkLimit: (limitKey: string) => boolean;
  isFeatureEnabled: (featureKey: string) => boolean;
}

export const useConfigStore = create<ConfigState>((set, get) => ({
  config: null,
  userLimits: null,
  loading: true,
  
  fetchConfig: async () => {
    try {
      const configDoc = await getDoc(doc(db, `${PROJECT_PREFIX}system_configs`, 'settings'));
      if (configDoc.exists()) {
        const config = configDoc.data() as SystemConfig;
        set({ config, loading: false });
        
        // Set up real-time listener
        onSnapshot(doc(db, `${PROJECT_PREFIX}system_configs`, 'settings'), (doc) => {
          if (doc.exists()) {
            set({ config: doc.data() as SystemConfig });
          }
        });
      }
    } catch (error) {
      console.error('Error fetching config:', error);
      set({ loading: false });
    }
  },
  
  checkLimit: (limitKey) => {
    const { userLimits } = get();
    if (!userLimits) return true;
    
    const keys = limitKey.split('.');
    let value: any = userLimits;
    
    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) return true;
    }
    
    return value === -1 || value === true || value > 0;
  },
  
  isFeatureEnabled: (featureKey) => {
    const { config } = get();
    if (!config) return false;
    
    const flag = config.featureFlags[featureKey];
    if (typeof flag === 'boolean') return flag;
    if (flag && typeof flag === 'object') return flag.enabled;
    return false;
  }
}));