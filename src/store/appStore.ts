import { create } from 'zustand';

interface AppState {
  // Loading states
  isLoading: boolean;
  loadingProgress: number;
  loadingText: string;
  
  // Navigation
  currentSection: 'home' | 'products' | 'solutions' | 'technology' | 'about' | 'contact';
  isMenuOpen: boolean;
  
  // 3D Scene
  currentProduct: string | null;
  isAutoRotate: boolean;
  isWireframe: boolean;
  isPerformanceMode: boolean;
  
  // UI Controls
  isProductInfoVisible: boolean;
  isControlsVisible: boolean;
  
  // Performance
  fps: number;
  
  // Internationalization
  language: 'vi' | 'en';
  
  // Actions
  setLoading: (loading: boolean) => void;
  setLoadingProgress: (progress: number, text: string) => void;
  setCurrentSection: (section: 'home' | 'products' | 'solutions' | 'technology' | 'about' | 'contact') => void;
  toggleMenu: () => void;
  setCurrentProduct: (product: string | null) => void;
  toggleAutoRotate: () => void;
  toggleWireframe: () => void;
  togglePerformanceMode: () => void;
  showProductInfo: () => void;
  hideProductInfo: () => void;
  toggleControls: () => void;
  setFPS: (fps: number) => void;
  resetCamera: () => void;
  setLanguage: (lang: 'vi' | 'en') => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial states
  isLoading: false,
  loadingProgress: 0,
  loadingText: 'Đang tải...',
  currentSection: 'home',
  isMenuOpen: false,
  currentProduct: null,
  isAutoRotate: false,
  isWireframe: false,
  isPerformanceMode: false,
  isProductInfoVisible: false,
  isControlsVisible: true,
  fps: 60,
  language: (typeof window !== 'undefined' && localStorage.getItem('thadorobot-lang') === 'en') ? 'en' : 'vi',
  
  // Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setLoadingProgress: (progress, text) => set({ loadingProgress: progress, loadingText: text }),
  setCurrentSection: (section) => set({ currentSection: section }),
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  setCurrentProduct: (product) => set({ currentProduct: product }),
  toggleAutoRotate: () => set((state) => ({ isAutoRotate: !state.isAutoRotate })),
  toggleWireframe: () => set((state) => ({ isWireframe: !state.isWireframe })),
  togglePerformanceMode: () => set((state) => ({ isPerformanceMode: !state.isPerformanceMode })),
  showProductInfo: () => set({ isProductInfoVisible: true }),
  hideProductInfo: () => set({ isProductInfoVisible: false }),
  toggleControls: () => set((state) => ({ isControlsVisible: !state.isControlsVisible })),
  setFPS: (fps) => set({ fps }),
  resetCamera: () => {
    // This will be handled by the 3D scene component
    console.log('Reset camera called');
  },
  setLanguage: (lang) => {
    localStorage.setItem('thadorobot-lang', lang);
    set({ language: lang });
  },
}));

// Product store for product data
interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  specs: Record<string, string>;
  features: string[];
  price?: string;
}

interface ProductStore {
  products: Product[];
  getProduct: (id: string) => Product | undefined;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [
    {
      id: 'amr',
      name: 'AMR Robot',
      description: 'Robot tự động di chuyển thông minh với khả năng định vị chính xác.',
      image: '/images/amr-robot.jpg',
      specs: {
        'Tải trọng': '1500kg',
        'Tốc độ': '2m/s',
        'Pin': '8 giờ',
        'Độ chính xác': '±10mm'
      },
      features: [
        'Định vị SLAM',
        'Tránh chướng ngại vật',
        'Tải trọng 1500kg',
        'Pin 8 giờ'
      ]
    },
    {
      id: 'handlift',
      name: 'Handlift Robot',
      description: 'Xe nâng tay tự động với hệ thống điều khiển thông minh.',
      image: '/images/handlift.jpg',
      specs: {
        'Tải trọng': '2000kg',
        'Chiều cao nâng': '3m',
        'Tốc độ': '1.5m/s',
        'Pin': '6 giờ'
      },
      features: [
        'Điều khiển tự động',
        'Cảm biến an toàn',
        'Tải trọng 2000kg',
        'Nâng cao 3m'
      ]
    },
    {
      id: 'reach-truck',
      name: 'Reach Truck',
      description: 'Xe nâng cao chuyên dụng với khả năng tiếp cận và nâng hàng.',
      image: '/images/reach-truck.jpg',
      specs: {
        'Tải trọng': '1500kg',
        'Chiều cao nâng': '12m',
        'Tốc độ': '1.2m/s',
        'Pin': '10 giờ'
      },
      features: [
        'Nâng cao 12m',
        'Điều khiển từ xa',
        'Cảm biến 3D',
        'Tải trọng 1500kg'
      ]
    },
    {
      id: 'charging-station',
      name: 'Charging Station',
      description: 'Trạm sạc tự động 24/7 với hệ thống quản lý năng lượng.',
      image: '/images/charging-station.jpg',
      specs: {
        'Công suất': '10kW',
        'Thời gian sạc': '2-4 giờ',
        'Hiệu suất': '95%',
        'Kết nối': 'WiFi/4G'
      },
      features: [
        'Sạc tự động',
        'Quản lý năng lượng',
        'Báo cáo thời gian thực',
        'Tương thích đa dạng'
      ]
    }
  ],
  
  getProduct: (id) => {
    const { products } = get();
    return products.find(product => product.id === id);
  }
})); 