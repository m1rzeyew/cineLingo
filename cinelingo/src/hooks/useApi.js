import { useState, useCallback, useRef, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getApiErrorMessage } from '../utils/helpers'

export function useApi(fn, { immediate = false, args = [], onSuccess, onError, errorMessage } = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState(null)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])

  const execute = useCallback(async (...callArgs) => {
    setLoading(true)
    setError(null)
    try {
      const params = callArgs.length ? callArgs : args
      const res = await fn(...params)
      const result = res?.data ?? res
      if (mounted.current) {
        setData(result)
        onSuccess?.(result)
      }
      return { data: result, error: null }
    } catch (err) {
      const msg = getApiErrorMessage(err, errorMessage || 'Something went wrong.')
      if (mounted.current) {
        setError(msg)
        onError?.(err)
      }
      return { data: null, error: msg }
    } finally {
      if (mounted.current) setLoading(false)
    }
  }, [fn])

  useEffect(() => {
    if (immediate) execute(...args)
  }, [])

  return { data, loading, error, execute, setData }
}

export function useMutation(fn, { successMessage, errorMessage } = {}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const mutate = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    const tid = successMessage ? toast.loading('Processing...') : null
    try {
      const res = await fn(...args)
      const data = res?.data ?? res
      if (successMessage) toast.success(successMessage, { id: tid })
      return { data, error: null }
    } catch (err) {
      const msg = getApiErrorMessage(err, errorMessage || 'Operation failed.')
      setError(msg)
      if (tid) toast.error(msg, { id: tid })
      else toast.error(msg)
      return { data: null, error: msg }
    } finally {
      setLoading(false)
    }
  }, [fn])

  return { mutate, loading, error }
}
