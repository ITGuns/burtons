import { create } from 'zustand'

export interface Toast {
  id: number
  title: string
  body?: string
  tone: 'success' | 'error' | 'info'
}

interface AppState {
  bookingOpen: boolean
  bookingService?: string
  openBooking: (service?: string) => void
  closeBooking: () => void
  toasts: Toast[]
  toast: (t: Omit<Toast, 'id'>) => void
  dismissToast: (id: number) => void
}

let toastSeq = 0

export const useStore = create<AppState>((set) => ({
  bookingOpen: false,
  bookingService: undefined,
  openBooking: (service) => set({ bookingOpen: true, bookingService: service }),
  closeBooking: () => set({ bookingOpen: false, bookingService: undefined }),
  toasts: [],
  toast: (t) => {
    const id = ++toastSeq
    set((s) => ({ toasts: [...s.toasts, { ...t, id }] }))
    setTimeout(() => {
      useStore.getState().dismissToast(id)
    }, 5000)
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}))
