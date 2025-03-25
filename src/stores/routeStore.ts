import { create } from 'zustand';
import { RouteData, RouteStop } from '@/config/googleMapsConfig';

interface RouteStore {
  routeData: Partial<RouteData>;
  setRouteData: (data: Partial<RouteData>) => void;
  updateStops: (stops: RouteStop[]) => void;
  clearRoute: () => void;
}

export const useRouteStore = create<RouteStore>((set) => ({
  routeData: {},
  setRouteData: (data) => set((state) => ({ 
    routeData: { ...state.routeData, ...data } 
  })),
  updateStops: (stops) => set((state) => ({ 
    routeData: { ...state.routeData, stops } 
  })),
  clearRoute: () => set({ routeData: {} }),
})); 