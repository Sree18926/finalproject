import { useState, useRef, useEffect } from 'react';
import {
  ScanText, Mic, MicOff, Volume2, VolumeX, Loader2, CheckCircle2, AlertTriangle,
  RotateCcw, ShieldCheck, Sparkles,
} from 'lucide-react';
import { predictNews, type PredictionResult } from '../lib/api';
import type { Route } from '../lib/router';

/** Detect page — paste an article, run prediction, see REAL/FAKE result. */
export function DetectPage({ navigate }: { navigate: (r: Route['name']) => void }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState('');
  const [listening, setListening] = useState(false);
  const [speakOnResult, setSpeakOnResult] = useState(true);

  const recognitionRef = useRef<any>(null);

  // Set up the Web Speech API recognizer once.
  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';
    rec.onresult = (e: any) => {
      let final = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
      }
      if (final) setText((t) => (t ? t + ' ' : '') + final);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
  }, []);

  /** Toggle the microphone for voice input. */
  const toggleMic = () => {
    const rec = recognitionRef.current;
    if (!rec) {
      setError('Voice input is not supported in this browser.');
      return;
    }
    if (listening) {
      rec.stop();
      setListening(false);
    } else {
      try {
        rec.start();
        setListening(true);
      } catch {
        setListening(false);
      }
    }
  };

  /** Run the prediction against the backend (or local simulation). */
  const handlePredict = async () => {
    setError('');
    setResult(null);
    if (!text.trim()) {
      setError('Please paste a news article to analyze.');
      return;
    }
    setLoading(true);
    try {
      const r = await predictNews(text);
      setResult(r);
      if (speakOnResult) speakResult(r);
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /** Read the prediction aloud using the Web Speech Synthesis API. */
  const speakResult = (r: PredictionResult) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const pct = Math.round(r.confidence * 100);
    const utter = new SpeechSynthesisUtterance(
      `This article is classified as ${r.label === 'REAL' ? 'real news' : 'fake news'} with ${pct} percent confidence.`,
    );
    utter.rate = 1;
    window.speechSynthesis.speak(utter);
  };

  const stopSpeaking = () => window.speechSynthesis?.cancel();

  const reset = () => {
    setText('');
    setResult(null);
    setError('');
    stopSpeaking();
  };

  const confidencePct = result ? Math.round(result.confidence * 100) : 0;
  const isFake = result?.label === 'FAKE';

  return (
    <div className="container-page py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <span className="badge bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300">
            <ScanText className="w-3.5 h-3.5" /> News Detector
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-bold">Detect Fake News</h1>
          <p className="mt-3 text-gray-500 dark:text-gray-400">
            Paste a news article below and click <strong>Predict</strong> to analyze it.
          </p>
        </div>

        {/* Input card */}
        <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
          <div className="flex items-center justify-between mb-3">
            <label htmlFor="article" className="text-sm font-medium">News Article</label>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMic}
                className={`btn px-3 py-1.5 text-xs ${listening ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300' : 'btn-outline'}`}
                title={listening ? 'Stop voice input' : 'Start voice input'}
              >
                {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {listening ? 'Listening…' : 'Voice'}
              </button>
              <button
                onClick={() => setSpeakOnResult((s) => !s)}
                className={`btn px-3 py-1.5 text-xs ${speakOnResult ? 'bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300' : 'btn-outline'}`}
                title="Toggle text-to-speech for result"
              >
                {speakOnResult ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                TTS
              </button>
            </div>
          </div>

          <textarea
            id="article"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste the full text of a news article here…"
            rows={8}
            className="input resize-y leading-relaxed"
          />

          <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
            <span>{text.trim().split(/\s+/).filter(Boolean).length} words</span>
            {listening && <span className="text-red-500 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse-soft" /> Mic is recording</span>}
          </div>

          {error && (
            <div className="mt-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 px-4 py-2.5 text-sm text-red-700 dark:text-red-300 animate-fade-in">
              {error}
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={handlePredict} disabled={loading || !text.trim()} className="btn-primary flex-1 sm:flex-none">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing…</> : <><Sparkles className="w-5 h-5" /> Predict</>}
            </button>
            <button onClick={reset} className="btn-outline">
              <RotateCcw className="w-4 h-4" /> Clear
            </button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="mt-6 animate-scale-in">
            <div className={`card p-7 border-2 ${isFake ? 'border-red-300 dark:border-red-800' : 'border-green-300 dark:border-green-800'}`}>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isFake ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300' : 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-300'}`}>
                    {isFake ? <AlertTriangle className="w-7 h-7" /> : <CheckCircle2 className="w-7 h-7" />}
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wide">Result</div>
                    <div className={`text-2xl font-bold ${isFake ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                      {isFake ? 'FAKE NEWS' : 'REAL NEWS'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400 uppercase tracking-wide">Confidence</div>
                  <div className={`text-3xl font-bold ${isFake ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                    {confidencePct}%
                  </div>
                </div>
              </div>

              {/* Confidence bar */}
              <div className="mt-5">
                <div className="h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div
                    className={`h-full rounded-full animate-fade-in ${isFake ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'}`}
                    style={{ width: `${confidencePct}%` }}
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button onClick={() => speakResult(result)} className="btn-outline text-xs px-3 py-1.5">
                  <Volume2 className="w-4 h-4" /> Read aloud
                </button>
                <button onClick={stopSpeaking} className="btn-outline text-xs px-3 py-1.5">
                  <VolumeX className="w-4 h-4" /> Stop
                </button>
                <button onClick={() => navigate('admin')} className="btn-ghost text-xs px-3 py-1.5">
                  <ShieldCheck className="w-4 h-4" /> View history
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sample articles */}
        {!result && !loading && (
          <div className="mt-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Try a sample:</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {SAMPLES.map((s) => (
                <button
                  key={s.label}
                  onClick={() => setText(s.text)}
                  className="card p-4 text-left hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md transition-all"
                >
                  <span className={`badge mb-2 ${s.fake ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' : 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'}`}>
                    {s.fake ? 'Likely Fake' : 'Likely Real'}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3">{s.text}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const SAMPLES = [
  {
    fake: true,
    label: 'FAKE',
    text: "SHOCKING! Scientists discover miracle cure that mainstream media won't tell you about! You won't believe what happened next. Click here to learn the secret the government is hiding from you!",
  },
  {
    fake: false,
    label: 'REAL',
    text: "According to a study published in the Journal of the American Medical Association, researchers at Harvard University found that regular exercise is associated with a 30% reduction in cardiovascular disease risk over a ten-year period.",
  },
];
