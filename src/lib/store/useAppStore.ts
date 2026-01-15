import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
    // Loading State
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;

    // Route / History State (Satisfying "Guardado de rutas")
    lastVisitedRoute: string | null;
    setLastVisitedRoute: (route: string) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            isLoading: false,
            setIsLoading: (isLoading) => set({ isLoading }),

            lastVisitedRoute: null,
            setLastVisitedRoute: (route) => set({ lastVisitedRoute: route }),
        }),
        {
            name: 'app-storage', // unique name for localStorage
            partialize: (state) => ({
                lastVisitedRoute: state.lastVisitedRoute
            }), // Only persist these fields
        }
    )
);
