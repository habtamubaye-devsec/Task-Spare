import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'

interface AuthState {
  token: string | null
}

const initialState: AuthState = {
  token: Cookies.get('token') || null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      Cookies.set('token', action.payload, { expires: 7 })
    },
    clearAuth: (state) => {
      state.token = null
      Cookies.remove('token')
    },
  },
})

export const { setToken, clearAuth } = authSlice.actions
export default authSlice.reducer
