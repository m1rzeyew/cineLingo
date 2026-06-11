import { useState } from 'react'
import { Crown, Check, Zap, Star } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import toast from 'react-hot-toast'
import { paymentService } from '../../services'
import { getApiErrorMessage } from '../../utils/helpers'

const FEATURES = [
  'Access Intermediate and Advanced units',
  'Unlimited quiz attempts',
  'Advanced vocabulary tracking',
  'Priority leaderboard ranking',
  'Ad-free learning experience',
]

const PLANS = [
  { id: 'premium', name: 'Premium', price: 9.99, period: '/month' },
]

export default function PaywallModal({ open, onClose, onSuccess }) {
  const [selected, setSelected] = useState(null)
  const [subscribing, setSubscribing] = useState(false)

  const handleSubscribe = async () => {
    if (!selected) return
    setSubscribing(true)
    try {
      const res = await paymentService.createCheckout()
      const url = res.data?.checkoutUrl || res.data?.url
      if (url) {
        window.location.href = url
        return
      }
      toast.success('Checkout session created.')
      onSuccess?.()
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not start checkout.'))
    } finally {
      setSubscribing(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="" size="md">
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Crown size={28} className="text-brand-500" />
        </div>
        <h2 className="text-2xl font-bold font-display text-dark-900">Unlock All Levels</h2>
        <p className="text-dark-600 mt-1 text-sm leading-relaxed">
          Subscribe to continue your cinematic English journey.
        </p>
      </div>

      <div className="bg-cream-50 rounded-2xl p-4 mb-5">
        <p className="text-xs font-semibold text-dark-700 mb-3 uppercase tracking-normal">What you'll get:</p>
        <ul className="space-y-2">
          {FEATURES.map(f => (
            <li key={f} className="flex items-start gap-2 text-sm text-dark-700">
              <Check size={15} className="text-brand-500 mt-0.5 shrink-0" /> {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 gap-3 mb-5">
        {PLANS.map(plan => (
          <button key={plan.id} onClick={() => setSelected(plan.id)} className={`relative rounded-2xl border-2 p-4 text-left transition-all ${selected === plan.id ? 'border-brand-500 bg-brand-50' : 'border-cream-200 bg-white hover:border-brand-300'}`}>
            <div className="flex items-center gap-1.5 mb-1">
              <Star size={13} className="text-brand-500" />
              <span className="text-xs font-semibold text-dark-700">{plan.name}</span>
            </div>
            <p className="text-xl font-bold font-display text-dark-900">${plan.price}</p>
            <p className="text-xs text-dark-600">{plan.period}</p>
          </button>
        ))}
      </div>

      <Button fullWidth variant="brand" size="lg" loading={subscribing} disabled={!selected} onClick={handleSubscribe}>
        <Zap size={16} /> Subscribe Now
      </Button>
      <p className="text-center text-xs text-dark-600/50 mt-3">Secure payment. Instant access after confirmation.</p>
    </Modal>
  )
}
