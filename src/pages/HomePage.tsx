import {
  Newspaper, ShieldCheck, Brain, BarChart3, Mic, Volume2, FileDown, ArrowRight,
  Sparkles, CheckCircle2, AlertTriangle, Layers, Cpu, Database,
} from 'lucide-react';
import type { Route } from '../lib/router';

/** Home page — hero, feature grid, how-it-works, and CTA. */
export function HomePage({ navigate }: { navigate: (r: Route['name']) => void }) {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-400/20 dark:bg-brand-600/20 rounded-full blur-3xl animate-float" />
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-cyan-400/20 dark:bg-cyan-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="container-page pt-20 pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-sm font-medium animate-fade-in">
            <Sparkles className="w-4 h-4" /> Powered by Machine Learning
          </div>

          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight animate-fade-in-up">
            Detect <span className="gradient-text">Fake News</span> with
            <br className="hidden sm:block" /> Artificial Intelligence
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Paste any news article and our Logistic Regression model — trained on
            the Kaggle Fake News dataset — instantly tells you whether it's real
            or fake, with a confidence score.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <button onClick={() => navigate('detect')} className="btn-primary text-base px-6 py-3">
              Try Detection Now <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('about')} className="btn-outline text-base px-6 py-3">
              Learn More
            </button>
          </div>

          {/* Stat strip */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            {[
              { value: '94%+', label: 'Model Accuracy' },
              { value: '20K+', label: 'Training Articles' },
              { value: '<1s', label: 'Prediction Time' },
              { value: 'TF-IDF', label: 'Feature Extraction' },
            ].map((s) => (
              <div key={s.label} className="card p-5">
                <div className="text-2xl font-bold gradient-text">{s.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container-page py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Powerful Features</h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400">Everything you need to verify news credibility.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="card p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 mb-4">
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg mb-1.5">{f.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white dark:bg-gray-900/50 border-y border-gray-200 dark:border-gray-800">
        <div className="container-page py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="mt-3 text-gray-500 dark:text-gray-400">From raw text to a verdict in four steps.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-4">
            {STEPS.map((s, i) => (
              <div key={s.title} className="relative text-center animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="mx-auto w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-brand-500 to-cyan-500 text-white text-xl font-bold shadow-lg">
                  {i + 1}
                </div>
                <h3 className="mt-4 font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo preview */}
      <section className="container-page py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="animate-fade-in-up">
            <h2 className="text-3xl font-bold">See it in action</h2>
            <p className="mt-3 text-gray-500 dark:text-gray-400 leading-relaxed">
              The detection engine analyzes your text, extracts TF-IDF features,
              and runs them through a trained Logistic Regression classifier —
              then returns a clear REAL or FAKE verdict with a confidence score.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                'Real-time prediction in under a second',
                'Color-coded results with confidence percentage',
                'Voice input and text-to-speech output',
                'Full prediction history with PDF export',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
            <button onClick={() => navigate('detect')} className="btn-primary mt-7">
              Start Detecting <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="card p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500">Sample Result</span>
              <span className="badge bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300">
                <AlertTriangle className="w-3.5 h-3.5" /> FAKE NEWS
              </span>
            </div>
            <div className="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              "SHOCKING! Scientists discover miracle cure the mainstream media
              won't tell you about! Click here to learn the secret..."
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>Confidence</span>
                <span className="font-semibold text-red-600 dark:text-red-400">92.4%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-500 animate-fade-in" style={{ width: '92.4%' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page pb-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-cyan-600 p-10 sm:p-14 text-center text-white">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="relative">
            <h2 className="text-3xl font-bold">Ready to verify the news?</h2>
            <p className="mt-3 text-white/90 max-w-xl mx-auto">
              Start detecting fake news today — no signup required.
            </p>
            <button onClick={() => navigate('detect')} className="btn bg-white text-brand-700 hover:bg-gray-100 mt-6 px-6 py-3 text-base">
              Open Detector <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

const FEATURES = [
  { icon: Brain, title: 'ML-Powered', desc: 'Logistic Regression trained on 20,000+ labeled news articles.' },
  { icon: Layers, title: 'TF-IDF Vectorizer', desc: 'Converts text into numerical features capturing word importance.' },
  { icon: ShieldCheck, title: 'Real or Fake', desc: 'Clear color-coded verdicts with a confidence percentage.' },
  { icon: Mic, title: 'Voice Input', desc: 'Speak your article instead of typing — powered by the Web Speech API.' },
  { icon: Volume2, title: 'Text-to-Speech', desc: 'The prediction result is read aloud for accessibility.' },
  { icon: BarChart3, title: 'Statistics Dashboard', desc: 'Visualize prediction counts with interactive charts.' },
  { icon: Database, title: 'Prediction History', desc: 'Every prediction is saved and searchable in the admin panel.' },
  { icon: FileDown, title: 'Export to PDF', desc: 'Download your full prediction history as a PDF report.' },
  { icon: Cpu, title: 'NLP Preprocessing', desc: 'Stopword removal and stemming clean text before classification.' },
];

const STEPS = [
  { title: 'Paste Article', desc: 'Type or paste a news article into the detector.' },
  { title: 'Preprocess', desc: 'Text is cleaned, stopwords removed, and stemmed.' },
  { title: 'Classify', desc: 'TF-IDF features are fed to the trained model.' },
  { title: 'Verdict', desc: 'Get a REAL or FAKE result with confidence.' },
];
