import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeStore {
    theme: ThemeMode;
    systemTheme: 'light' | 'dark';
    setTheme: (theme: ThemeMode) => void;
    toggleTheme: () => void;
    initSystemTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
    persist(
        (set, get) => ({
            theme: 'system',
            systemTheme: 'light',
            
            setTheme: (theme) => {
                const actualTheme = theme === 'system' ? get().systemTheme : theme;
                document.documentElement.setAttribute('data-theme', actualTheme);
                set({ theme });
            },
            
            toggleTheme: () => {
                const currentTheme = get().theme;
                let newTheme: ThemeMode;
                
                if (currentTheme === 'system') {
                    // 从系统模式切换时，使用当前系统主题的相反主题
                    newTheme = get().systemTheme === 'light' ? 'dark' : 'light';
                } else {
                    // 简单切换亮/暗
                    newTheme = currentTheme === 'light' ? 'dark' : 'light';
                }
                
                get().setTheme(newTheme);
            },
            
            initSystemTheme: () => {
                // 检测系统主题偏好
                const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                const systemTheme = mediaQuery.matches ? 'dark' : 'light';
                
                set({ systemTheme });
                
                // 如果当前设置为系统主题，则应用系统主题
                if (get().theme === 'system') {
                    document.documentElement.setAttribute('data-theme', systemTheme);
                }
                
                // 监听系统主题变化
                const handler = (e: MediaQueryListEvent) => {
                    const newSystemTheme = e.matches ? 'dark' : 'light';
                    set({ systemTheme: newSystemTheme });
                    
                    // 如果当前设置为系统主题，则跟随系统变化
                    if (get().theme === 'system') {
                        document.documentElement.setAttribute('data-theme', newSystemTheme);
                    }
                };
                
                mediaQuery.addEventListener('change', handler);
                
                // 清理函数（可选）
                return () => mediaQuery.removeEventListener('change', handler);
            }
        }),
        {
            name: 'theme-preference',
            partialize: (state) => ({ theme: state.theme })
        }
    )
);
