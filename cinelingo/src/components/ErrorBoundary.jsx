import { Component } from 'react'
import Button from './ui/Button'

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
        <div className="min-h-screen bg-cream-100 flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">🎬</div>
            <h1 className="text-2xl font-bold font-display text-dark-900 mb-2">
              Scene Error
            </h1>
            <p className="text-dark-600 mb-6">
              Something went wrong during this scene. Let's reload and try again.
            </p>
            <p className="text-xs text-dark-600/50 font-mono mb-6 bg-cream-200 rounded-xl px-4 py-3">
              {this.state.error?.message}
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
