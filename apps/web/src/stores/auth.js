import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: true,

  setAuth: (user, token) => {
    localStorage.setItem('sgcj_token', token);
    localStorage.setItem('sgcj_user', JSON.stringify(user));
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem('sgcj_token');
    localStorage.removeItem('sgcj_user');
    set({ user: null, token: null });
  },

  restoreSession: () => {
    const token = localStorage.getItem('sgcj_token');
    const user = localStorage.getItem('sgcj_user');

    if (token && user) {
      set({ user: JSON.parse(user), token, loading: false });
    } else {
      set({ loading: false });
    }
  }
}));
