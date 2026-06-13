import React from 'react'
import { Component } from 'react'
import { Clapperboard } from 'lucide-react'
import Button from './ui/Button'
import { getApiErrorMessage } from '../utils/helpers'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-amber">
              <Clapperboard size={26} />
            </div>
            <h1 className="mb-2 text-2xl font-black tracking-normal text-slate-950 dark:text-white">
              Scene Error
            </h1>
            <p className="mb-6 text-slate-600 dark:text-slate-300">
              Something went wrong during this scene. Let's reload and try again.
            </p>
            <p className="mb-6 rounded-xl bg-slate-100 px-4 py-3 font-mono text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              {getApiErrorMessage(this.state.error)}
            </p>
            <Button onClick={() => window.location.reload()}>
              Reload App
            </Button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
