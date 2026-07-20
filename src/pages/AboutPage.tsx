import { Target, BookOpen, Layers, Cpu, Database, GitBranch, Users, Lightbulb } from 'lucide-react';

/** About page — project overview, objectives, tech stack, and methodology. */
export function AboutPage() {
  return (
    <div className="container-page py-12">
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto animate-fade-in-up">
        <span className="badge bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300">
          <BookOpen className="w-3.5 h-3.5" /> About the Project
        </span>
        <h1 className="mt-5 text-4xl font-bold tracking-tight">
          Fake News Detection <span className="gradient-text">Using Machine Learning</span>
        </h1>
        <p className="mt-5 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          A Final Year B.Sc. Computer Science project that leverages Natural
          Language Processing and a Logistic Regression classifier to identify
          whether a news article is real or fake — helping combat the spread of
          misinformation online.
        </p>
      </section>

      {/* Objective */}
      <section className="mt-14 grid lg:grid-cols-2 gap-8 items-center">
        <div className="card p-8 animate-fade-in-up">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 mb-4">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Project Objective</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            To design, train, and deploy a machine learning model that can
            automatically classify news articles as real or fake based on their
            textual content. The system aims to provide an accessible,
            user-friendly tool that empowers readers to verify the credibility of
            information before sharing it.
          </p>
        </div>
        <div className="grid gap-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {OBJECTIVES.map((o) => (
            <div key={o} className="card p-4 flex items-start gap-3">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-brand-500 flex-shrink-0" />
              <span className="text-sm text-gray-600 dark:text-gray-300">{o}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Tech stack */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-8">Technology Stack</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STACK.map((s, i) => (
            <div key={s.category} className="card p-6 animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold mb-2">{s.category}</h3>
              <ul className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
                {s.items.map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Methodology */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-8">Methodology</h2>
        <div className="card p-8">
          <div className="grid gap-6 md:grid-cols-2">
            {METHODOLOGY.map((m, i) => (
              <div key={m.title} className="flex gap-4 animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-cyan-500 text-white flex items-center justify-center font-semibold text-sm">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{m.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Future scope */}
      <section className="mt-16 grid lg:grid-cols-2 gap-8">
        <div className="card p-8 animate-fade-in-up">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 mb-4">
            <Lightbulb className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold mb-3">Future Enhancements</h2>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            {FUTURE.map((f) => <li key={f} className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">→</span> {f}</li>)}
          </ul>
        </div>
        <div className="card p-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-4">
            <Users className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold mb-3">Social Impact</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            Misinformation can influence elections, spread panic, and damage
            reputations. By giving everyday readers a fast, free tool to verify
            news, this project contributes to a more informed and resilient
            society.
          </p>
        </div>
      </section>
    </div>
  );
}

const OBJECTIVES = [
  'Collect and preprocess a labeled dataset of real and fake news articles.',
  'Apply NLP techniques: stopword removal, stemming, and TF-IDF vectorization.',
  'Train a Logistic Regression classifier and evaluate its accuracy.',
  'Build a Flask REST API to serve predictions to a web frontend.',
  'Provide an intuitive UI with history tracking and export features.',
];

const STACK = [
  { category: 'Machine Learning', icon: Cpu, color: 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400', items: ['Scikit-learn', 'Pandas', 'NumPy', 'NLTK'] },
  { category: 'Backend', icon: Database, color: 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400', items: ['Python', 'Flask', 'Pickle', 'REST API'] },
  { category: 'Frontend', icon: Layers, color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400', items: ['React', 'Tailwind CSS', 'TypeScript', 'Lucide Icons'] },
  { category: 'Tooling', icon: GitBranch, color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400', items: ['VS Code', 'Git', 'Kaggle Dataset', 'Vite'] },
];

const METHODOLOGY = [
  { title: 'Data Collection', desc: 'Use the Kaggle Fake News dataset (train.csv) containing labeled real and fake news articles.' },
  { title: 'Preprocessing', desc: 'Clean text, remove punctuation, drop stopwords, and apply Porter stemming via NLTK.' },
  { title: 'Feature Extraction', desc: 'Transform cleaned text into numeric vectors using the TF-IDF Vectorizer (up to 5,000 features).' },
  { title: 'Model Training', desc: 'Train a Logistic Regression classifier and serialize it with pickle for reuse.' },
  { title: 'Evaluation', desc: 'Measure accuracy, precision, recall, and F1-score on a held-out test set.' },
  { title: 'Deployment', desc: 'Expose the model through a Flask REST API consumed by the React frontend.' },
];

const FUTURE = [
  'Deep learning models (LSTM / BERT) for higher accuracy.',
  'Multilingual fake news detection.',
  'Browser extension for real-time article checking.',
  'Source credibility scoring and URL analysis.',
];
