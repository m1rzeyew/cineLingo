import { useNavigate } from 'react-router-dom'
import {
  Play, Star, BookOpen, Zap, Globe, Award,
  ChevronRight, Check, Film, Volume2, Trophy,
  Users, ArrowRight,
} from 'lucide-react'
import Button from '../../components/ui/Button'
import Badge  from '../../components/ui/Badge'

/* ── Mock data ──────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: Film,
    title: 'Learn through real cinema',
    desc: 'Every unit is built around an authentic movie scene. You absorb natural English the way it was meant to be heard — from real characters in real situations.',
  },
  {
    icon: BookOpen,
    title: 'Contextual vocabulary',
    desc: 'Words learned in context stick. Save any word mid-scene, review it in your personal dictionary, and drill it with spaced-repetition flashcards.',
  },
  {
    icon: Zap,
    title: 'Instant feedback quizzes',
    desc: 'Test your comprehension right after watching. MCQs, gap-fill, and listening exercises built from each scene\'s dialogue and vocabulary.',
  },
  {
    icon: Users,
    title: 'Study with friends',
    desc: 'Chat with your study group in real-time while watching the same unit. Discuss, share notes, help each other — learning is social.',
  },
  {
    icon: Trophy,
    title: 'Gamified progress',
    desc: 'Daily streaks, XP points, and a leaderboard keep momentum high. Celebrate every milestone from your first word to your first level complete.',
  },
  {
    icon: Globe,
    title: 'Six structured levels',
    desc: 'From absolute Beginner to Advanced. Each level is a curated playlist of units with escalating difficulty, tested and sequenced by language experts.',
  },
]

const LEVELS = [
  { name: 'Beginner',          emoji: '🌱', free: true,  desc: 'Start from zero' },
  { name: 'Elementary',        emoji: '📖', free: false, desc: 'Build foundations' },
  { name: 'Pre-Intermediate',  emoji: '🎯', free: false, desc: 'Connect ideas' },
  { name: 'Intermediate',      emoji: '🎬', free: false, desc: 'Express yourself' },
  { name: 'Upper-Intermediate',emoji: '🏆', free: false, desc: 'Think in English' },
  { name: 'Advanced',          emoji: '⭐', free: false, desc: 'Near-native fluency' },
]

const STEPS = [
  { n: '01', title: 'Pick your level', desc: 'Beginner is free forever. Premium unlocks all six levels.' },
  { n: '02', title: 'Watch & learn',   desc: 'Stream the scene, pause, look up words, build your vocab list.' },
  { n: '03', title: 'Take the quiz',   desc: 'Prove you understood it. Immediate score and explanation.' },
  { n: '04', title: 'Review & repeat', desc: 'Flashcards reinforce weak spots. Streak system keeps you daily.' },
]

const TESTIMONIALS = [
  { name: 'Sara K.',    level: 'Intermediate',  text: 'I went from B1 to B2 in four months. The cinema method just clicks — you remember lines from scenes, not textbook sentences.' },
  { name: 'Michael R.', level: 'Upper-Intermediate', text: 'The quiz after each unit is genuinely challenging. It forces real comprehension, not just watching passively.' },
  { name: 'Yuki T.',    level: 'Advanced',      text: 'The chat sidebar changed everything. Discussing the scene with friends while watching it doubled my retention.' },
]

const STATS = [
  { value: '12,400+', label: 'Active learners' },
  { value: '200+',    label: 'Cinema units'    },
  { value: '6',       label: 'CEFR levels'     },
  { value: '94%',     label: 'Completion rate' },
]

/* ── Sub-components ─────────────────────────────────────────────── */
function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div className="bg-dark-800 border border-white/8 rounded-2xl p-6 hover:border-brand-500/40 hover:bg-dark-700 transition-all duration-200 group">
      <div className="w-10 h-10 bg-brand-500/15 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-500/25 transition-colors">
        <Icon size={20} className="text-brand-400" />
      </div>
      <h3 className="font-display font-semibold text-white text-base mb-2">{title}</h3>
      <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
    </div>
  )
}

function TestimonialCard({ name, level, text }) {
  return (
    <div className="bg-dark-800 border border-white/8 rounded-2xl p-6">
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={13} className="text-brand-400 fill-brand-400" />
        ))}
      </div>
      <p className="text-white/70 text-sm leading-relaxed mb-5">"{text}"</p>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-bold">
          {name.split(' ').map(w => w[0]).join('')}
        </div>
        <div>
          <p className="text-white text-sm font-medium">{name}</p>
          <p className="text-white/40 text-xs">{level} learner</p>
        </div>
      </div>
    </div>
  )
}

/* ── Main page ─────────────────────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="text-white">

      {/* ╔══════════════════════════════════════════════════════╗
          ║  HERO                                               ║
          ╚══════════════════════════════════════════════════════╝ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Film-grain overlay */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }}
          />
          {/* Amber glow — bottom left */}
          <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-3xl" />
          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'linear-gradient(var(--tw-gradient-stops))', backgroundSize: '60px 60px',
              backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)' }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-brand-500/15 border border-brand-500/30 rounded-full px-4 py-1.5 mb-8 animate-fade-in">
            <span className="text-xs font-semibold text-brand-400 uppercase tracking-widest">New</span>
            <span className="w-px h-3 bg-brand-500/40" />
            <span className="text-xs text-white/60">SignalR real-time study rooms now live</span>
          </div>

          {/* Headline */}
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.05] mb-6 animate-slide-up"
            style={{ animationDelay: '60ms' }}
          >
            Master English
            <br />
            <span className="text-brand-400">through cinema.</span>
          </h1>

          <p
            className="text-lg md:text-xl text-white/55 leading-relaxed max-w-2xl mx-auto mb-10 animate-slide-up"
            style={{ animationDelay: '120ms' }}
          >
            Watch real movie scenes, learn vocabulary in context, take comprehension quizzes,
            and study with friends — all in one place.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 animate-slide-up"
            style={{ animationDelay: '180ms' }}
          >
            <Button
              variant="brand"
              size="xl"
              onClick={() => navigate('/register')}
              className="shadow-amber-lg"
            >
              Start for free
              <ArrowRight size={18} />
            </Button>
            <Button
              variant="ghost"
              size="xl"
              className="text-white/70 hover:text-white hover:bg-white/8 border border-white/15 hover:border-white/25"
              onClick={() => navigate('/login')}
            >
              <Play size={16} className="fill-current" />
              Sign in
            </Button>
          </div>

          {/* Social proof strip */}
          <div
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 animate-fade-in"
            style={{ animationDelay: '300ms' }}
          >
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-bold font-display text-brand-400">{value}</p>
                <p className="text-xs text-white/40 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hero mockup card */}
        <div
          className="relative max-w-3xl w-full mx-auto mt-16 animate-slide-up"
          style={{ animationDelay: '240ms' }}
        >
          <div className="bg-dark-800 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            {/* Fake browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-dark-900/60 border-b border-white/8">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 bg-dark-700 rounded-md h-5 mx-4 flex items-center px-3">
                <span className="text-white/30 text-[10px]">cinelingo.app/units/the-art-of-conversation</span>
              </div>
            </div>

            {/* Fake dashboard */}
            <div className="p-5">
              {/* Fake navbar */}
              <div className="flex items-center gap-4 mb-5 pb-4 border-b border-white/8">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 bg-brand-500 rounded-md" />
                  <span className="text-xs font-bold text-brand-400">CineLingo</span>
                </div>
                <div className="flex gap-3 ml-4">
                  {['Dashboard','Units','Vocab','Flashcards'].map(n => (
                    <span key={n} className={`text-xs ${n==='Units'?'text-white bg-white/15 px-2 py-0.5 rounded-full':'text-white/40'}`}>{n}</span>
                  ))}
                </div>
              </div>

              {/* Fake unit card */}
              <div className="bg-dark-900/60 rounded-2xl overflow-hidden border border-white/8">
                <div className="aspect-[3/1] bg-gradient-to-br from-dark-700 to-dark-900 flex items-center justify-center relative">
                  <Film size={40} className="text-white/20" />
                  <div className="absolute inset-0 bg-gradient-to-r from-dark-900/70 to-transparent flex items-end p-4">
                    <div>
                      <div className="flex gap-2 mb-1">
                        <span className="text-[10px] bg-brand-500/80 text-white px-2 py-0.5 rounded-full font-medium">Intermediate</span>
                        <span className="text-[10px] bg-white/10 text-white/60 px-2 py-0.5 rounded-full">6 words</span>
                      </div>
                      <p className="text-sm font-semibold text-white">The Art of Conversation</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                      <Play size={16} className="text-white ml-0.5 fill-white" />
                    </div>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="bg-brand-500 text-white text-xs px-4 py-2 rounded-xl font-medium flex items-center gap-1.5">
                      <Play size={12} className="fill-white" /> Watch Video
                    </div>
                    <div className="bg-white/10 text-white/70 text-xs px-4 py-2 rounded-xl font-medium flex items-center gap-1.5">
                      <BookOpen size={12} /> Take Quiz
                    </div>
                  </div>
                  <span className="text-white/30 text-xs">24 min</span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating chat bubble */}
          <div className="absolute -right-4 top-1/3 bg-white rounded-2xl shadow-dark p-3 w-44 border border-cream-200 animate-float hidden lg:block">
            <p className="text-xs text-dark-600 mb-1 font-medium">Study Chat</p>
            <div className="space-y-1.5">
              <div className="bg-cream-100 rounded-lg px-2.5 py-1.5">
                <p className="text-[10px] text-dark-700">"Did you catch that idiom?"</p>
              </div>
              <div className="bg-dark-900 rounded-lg px-2.5 py-1.5 ml-4">
                <p className="text-[10px] text-white">"Yes! 'Beat around the bush' 🎯"</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════════════╗
          ║  HOW IT WORKS                                        ║
          ╚══════════════════════════════════════════════════════╝ */}
      <section id="features" className="py-20 px-6 bg-dark-800/50">
        <div className="max-w-screen-lg mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-brand-400 uppercase tracking-widest mb-3">The method</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Four steps to fluency
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              A proven loop that takes you from first watch to full comprehension in under an hour per unit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map(({ n, title, desc }) => (
              <div key={n} className="relative bg-dark-800 border border-white/8 rounded-2xl p-5">
                <span className="font-mono text-4xl font-bold text-white/8 absolute top-4 right-5 select-none">
                  {n}
                </span>
                <div className="w-8 h-8 bg-brand-500/20 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-xs font-bold text-brand-400">{n}</span>
                </div>
                <h3 className="font-display font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════════════╗
          ║  FEATURES GRID                                       ║
          ╚══════════════════════════════════════════════════════╝ */}
      <section className="py-20 px-6">
        <div className="max-w-screen-lg mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-brand-400 uppercase tracking-widest mb-3">Platform</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Everything you need to progress
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(f => <FeatureCard key={f.title} {...f} />)}
          </div>
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════════════╗
          ║  LEVELS                                              ║
          ╚══════════════════════════════════════════════════════╝ */}
      <section id="levels" className="py-20 px-6 bg-dark-800/50">
        <div className="max-w-screen-lg mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-brand-400 uppercase tracking-widest mb-3">Curriculum</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Six levels, one destination
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Aligned to the CEFR framework. Begin free, upgrade when you're ready to go further.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {LEVELS.map((lvl, i) => (
              <div
                key={lvl.name}
                className={`relative rounded-2xl border p-4 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer ${
                  lvl.free
                    ? 'border-brand-500/50 bg-brand-500/10'
                    : 'border-white/8 bg-dark-800 hover:border-white/20'
                }`}
              >
                {lvl.free && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                    FREE
                  </span>
                )}
                <div className="text-2xl mb-2">{lvl.emoji}</div>
                <p className="text-xs font-semibold text-white">{lvl.name}</p>
                <p className="text-[10px] text-white/40 mt-0.5">{lvl.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <Button
              variant="brand"
              size="lg"
              onClick={() => navigate('/register')}
              className="shadow-amber"
            >
              Start with Beginner — it's free
              <ChevronRight size={17} />
            </Button>
          </div>
        </div>
      </section>

{/* ╔══════════════════════════════════════════════════════╗
    ║  SOCIAL PROOF STATS                                  ║
    ╚══════════════════════════════════════════════════════╝ */}
<section className="py-20 px-6">
  <div className="max-w-screen-lg mx-auto">
    <div className="text-center mb-14">
      <p className="text-xs font-semibold text-brand-400 uppercase tracking-widest mb-3">By the numbers</p>
      <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
        Real results from real learners
      </h2>
      <p className="text-white/50 max-w-xl mx-auto">
        Thousands of learners have already improved their English through cinema. Here's what the data shows.
      </p>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
      {[
        { value:'94%',    label:'Completion rate',        desc:'Learners who start finish their level' },
        { value:'3.2×',   label:'Faster vocabulary recall', desc:'Compared to traditional methods'      },
        { value:'68 days',label:'Average to next level',  desc:'From enrollment to level completion'   },
        { value:'4.8 / 5',label:'Learner satisfaction',   desc:'Rated by active users monthly'         },
      ].map(({ value, label, desc }) => (
        <div key={label} className="bg-dark-800 border border-white/8 rounded-2xl p-6 text-center hover:border-brand-500/30 transition-all">
          <p className="text-3xl font-bold font-display text-brand-400 mb-2">{value}</p>
          <p className="text-sm font-semibold text-white mb-1">{label}</p>
          <p className="text-xs text-white/40 leading-relaxed">{desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* ╔══════════════════════════════════════════════════════╗
          ║  FINAL CTA                                           ║
          ╚══════════════════════════════════════════════════════╝ */}
      <section id="about" className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-500/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-brand-500/15 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-brand-500/25">
            <Film size={28} className="text-brand-400" />
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-5 leading-tight">
            Your English journey
            <br />starts with one scene.
          </h2>
          <p className="text-white/50 mb-8 leading-relaxed">
            Join thousands of learners who ditched the textbook and chose cinema.
            Beginner level is completely free — no credit card needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              variant="brand"
              size="xl"
              onClick={() => navigate('/register')}
              className="shadow-amber-lg"
            >
              Create free account
              <ArrowRight size={18} />
            </Button>
            <Button
              variant="ghost"
              size="xl"
              className="text-white/60 hover:text-white border border-white/15 hover:border-white/25 hover:bg-white/8"
              onClick={() => navigate('/login')}
            >
              Already a member? Sign in
            </Button>
          </div>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {['No credit card required', 'Beginner level free forever', 'Cancel anytime'].map(t => (
              <div key={t} className="flex items-center gap-1.5 text-xs text-white/40">
                <Check size={12} className="text-brand-400" /> {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════════════╗
          ║  FOOTER                                              ║
          ╚══════════════════════════════════════════════════════╝ */}
      <footer className="border-t border-white/8 py-8 px-6">
        <div className="max-w-screen-lg mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brand-500 rounded-lg flex items-center justify-center">
              <Film size={13} className="text-white" />
            </div>
            <span className="font-display font-bold text-white text-sm">
              Cine<span className="text-brand-400">Lingo</span>
            </span>
          </div>
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} CineLingo. Learn English through the magic of cinema.
          </p>
          <div className="flex gap-5">
            {['Privacy', 'Terms', 'Contact'].map(l => (
              <a key={l} href="#" className="text-xs text-white/30 hover:text-white/60 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
