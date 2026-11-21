import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import axiosInstance from '../api/axios'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('cybershield_token') || null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // On mount: restore session from token
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem('cybershield_token')
      if (!storedToken) {
        setLoading(false)
        return
      }
      try {
        const response = await axiosInstance.get('/auth/me')
        setUser(response.data.data)
        setToken(storedToken)
        setIsAuthenticated(true)
      } catch (error) {
        // Token invalid or expired
        localStorage.removeItem('cybershield_token')
        localStorage.removeItem('cybershield_user')
        setToken(null)
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    restoreSession()
  }, [])

  const login = useCallback(async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials)
    const { token: newToken, data } = response.data
    localStorage.setItem('cybershield_token', newToken)
    localStorage.setItem('cybershield_user', JSON.stringify(data))
    setToken(newToken)
    setUser(data)
    setIsAuthenticated(true)
    return response.data
  }, [])

  const register = useCallback(async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData)
    return response.data
  }, [])

  const logout = useCallback(async () => {
    try {
      await axiosInstance.post('/auth/logout')
    } catch {
      // Silently fail — still clear local state
    } finally {
      localStorage.removeItem('cybershield_token')
      localStorage.removeItem('cybershield_user')
      setToken(null)
      setUser(null)
      setIsAuthenticated(false)
    }
  }, [])

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem('cybershield_user', JSON.stringify(updatedUser))
  }, [])

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }
  return context
}

export default AuthContext
