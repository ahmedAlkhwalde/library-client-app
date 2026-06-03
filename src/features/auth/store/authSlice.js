import { createSlice } from '@reduxjs/toolkit';

const savedUser = localStorage.getItem('user');

const initialState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },

    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    }
  },
});

export const { setLoginSuccess, setLogout, updateUser } = authSlice.actions;
export default authSlice.reducer;