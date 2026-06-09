import { useState, useCallback, useRef, useEffect } from 'react'
import toast from 'react-hot-toast'

/**
 * useApi — wraps any async service call with loading / error / data state.
 *
 * Usage:
 *   const { data, loading, error, execute } = useApi(unitService.getAll)
 *   useEffect(() => execute(), [])           // fetch on mount
 *   const result = await execute({ page:2 }) // returns { data, error }
 */
export function useApi(fn, { immediate = false, args = [], onSuccess, onError, errorMessage } = {}) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(immediate)
  const [error,   setError]   = useState(null)
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
      const res  = await fn(...params)
      const result = res?.data ?? res
      if (mounted.current) {
        setData(result)
        onSuccess?.(result)
      }
      return { data: result, error: null }
    } catch (err) {
      const msg = err.response?.data?.message || errorMessage || 'Something went wrong.'
      if (mounted.current) {
        setError(msg)
        onError?.(err)
      }
      return { data: null, error: msg }
    } finally {
      if (mounted.current) setLoading(false)
    }
  }, [fn]) // eslint-disable-line

  useEffect(() => {
    if (immediate) execute(...args)
  }, []) // eslint-disable-line

  return { data, loading, error, execute, setData }
}

/**
 * useMutation — for POST/PUT/DELETE actions with toast feedback.
 */
export function useMutation(fn, { successMessage, errorMessage } = {}) {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const mutate = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    const tid = successMessage ? toast.loading('Processing...') : null
    try {
      const res  = await fn(...args)
      const data = res?.data ?? res
      if (successMessage) toast.success(successMessage, { id: tid })
      return { data, error: null }
    } catch (err) {
      const msg = err.response?.data?.message || errorMessage || 'Operation failed.'
      setError(msg)
      if (tid) toast.error(msg, { id: tid })
      else toast.error(msg)
      return { data: null, error: msg }
    } finally {
      setLoading(false)
    }
  }, [fn]) // eslint-disable-line

  return { mutate, loading, error }
}
