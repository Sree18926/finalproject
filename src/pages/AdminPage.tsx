import { useEffect, useMemo, useState } from 'react';
import {
  Search, Trash2, FileDown, Database, CheckCircle2, AlertTriangle, Loader2,
  RefreshCw, ShieldAlert, Inbox,
} from 'lucide-react';
import {
  getHistory, deleteHistoryEntry, clearHistory, getStats,
  type HistoryEntry,
} from '../lib/api';

/** Admin dashboard — stats, chart, searchable history table, PDF export. */
export function AdminPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [stats, setStats] = useState({ real: 0, fake: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'REAL' | 'FAKE'>('all');

  /** Load history + stats from the backend (or local storage). */
  const load = async () => {
    setLoading(true);
    try {
      const [h, s] = await Promise.all([getHistory(), getStats()]);
      setHistory(h);
      setStats(s);
    } catch {
      // ignore — keep last state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // Refresh when local storage changes (same-tab prediction saves).
    const onChange = () => load();
    window.addEventListener('fnd-history-changed', onChange);
    return () => window.removeEventListener('fnd-history-changed', onChange);
  }, []);

  /** Delete one entry. */
  const handleDelete = async (id: string) => {
    await deleteHistoryEntry(id);
    load();
  };

  /** Delete all entries. */
  const handleClear = async () => {
    if (!confirm('Delete all prediction history? This cannot be undone.')) return;
    await clearHistory();
    load();
  };

  /** Export the current history to a PDF using the browser print dialog. */
  const exportPdf = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    const rows = filtered.map((h) => `
      <tr>
        <td>${h.id.slice(0, 8)}</td>
        <td class="${h.label === 'FAKE' ? 'fake' : 'real'}">${h.label}</td>
        <td>${Math.round(h.confidence * 100)}%</td>
        <td>${new Date(h.createdAt).toLocaleString()}</td>
        <td>${h.text.slice(0, 80).replace(/</g, '&lt;')}…</td>
      </tr>`).join('');
    win.document.write(`<!doctype html><html><head><title>FakeNews AI — Prediction History</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; color: #111827; }
        h1 { color: #2563eb; }
        .summary { display:flex; gap:24px; margin:16px 0 24px; }
        .stat { padding:12px 16px; border:1px solid #e5e7eb; border-radius:8px; }
        .stat b { font-size:22px; display:block; }
        table { width:100%; border-collapse:collapse; font-size:12px; }
        th, td { border:1px solid #e5e7eb; padding:8px; text-align:left; }
        th { background:#f3f4f6; }
        .fake { color:#dc2626; font-weight:bold; }
        .real { color:#16a34a; font-weight:bold; }
      </style></head><body>
      <h1>FakeNews AI — Prediction History Report</h1>
      <p>Generated: ${new Date().toLocaleString()}</p>
      <div class="summary">
        <div class="stat"><b>${stats.total}</b>Total Predictions</div>
        <div class="stat"><b style="color:#16a34a">${stats.real}</b>Real News</div>
        <div class="stat"><b style="color:#dc2626">${stats.fake}</b>Fake News</div>
      </div>
      <table><thead><tr><th>ID</th><th>Label</th><th>Confidence</th><th>Date</th><th>Excerpt</th></tr></thead>
      <tbody>${rows}</tbody></table>
      <script>window.onload = () => window.print();</script>
      </body></html>`);
    win.document.close();
  };

  const filtered = useMemo(() => {
    return history.filter((h) => {
      if (filter !== 'all' && h.label !== filter) return false;
      if (query && !h.text.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [history, query, filter]);

  const maxCount = Math.max(stats.real, stats.fake, 1);

  return (
    <div className="container-page py-12">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-8 animate-fade-in-up">
        <div>
          <span className="badge bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300">
            <Database className="w-3.5 h-3.5" /> Admin Dashboard
          </span>
          <h1 className="mt-3 text-3xl font-bold">Prediction Analytics</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="btn-outline text-sm"><RefreshCw className="w-4 h-4" /> Refresh</button>
          <button onClick={exportPdf} disabled={!history.length} className="btn-primary text-sm">
            <FileDown className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <StatCard icon={Database} label="Total Predictions" value={stats.total} color="brand" delay={0} />
        <StatCard icon={CheckCircle2} label="Real News" value={stats.real} color="green" delay={0.05} />
        <StatCard icon={AlertTriangle} label="Fake News" value={stats.fake} color="red" delay={0.1} />
      </div>

      {/* Chart */}
      <div className="card p-6 mb-8 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
        <h2 className="font-semibold mb-5">Detection Distribution</h2>
        <div className="space-y-5">
          <Bar label="Real News" value={stats.real} max={maxCount} color="from-green-500 to-emerald-500" />
          <Bar label="Fake News" value={stats.fake} max={maxCount} color="from-red-500 to-orange-500" />
        </div>
      </div>

      {/* History table */}
      <div className="card overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-wrap gap-3">
          <h2 className="font-semibold">Prediction History</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles…"
                className="input pl-9 py-2 text-sm w-56"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="input py-2 text-sm w-auto"
            >
              <option value="all">All</option>
              <option value="REAL">Real</option>
              <option value="FAKE">Fake</option>
            </select>
            <button onClick={handleClear} disabled={!history.length} className="btn-outline text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30">
              <Trash2 className="w-4 h-4" /> Clear All
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-12 flex items-center justify-center text-gray-400"><Loader2 className="w-6 h-6 animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Inbox className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">{history.length ? 'No results match your search.' : 'No predictions yet. Run a detection to see history here.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-5 py-3 font-medium">#</th>
                  <th className="text-left px-5 py-3 font-medium">Result</th>
                  <th className="text-left px-5 py-3 font-medium">Confidence</th>
                  <th className="text-left px-5 py-3 font-medium">Date</th>
                  <th className="text-left px-5 py-3 font-medium">Excerpt</th>
                  <th className="text-right px-5 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filtered.map((h, i) => (
                  <tr key={h.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-5 py-3 text-gray-400">{i + 1}</td>
                    <td className="px-5 py-3">
                      <span className={`badge ${h.label === 'FAKE' ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' : 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'}`}>
                        {h.label === 'FAKE' ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                        {h.label}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-medium">{Math.round(h.confidence * 100)}%</td>
                    <td className="px-5 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">{new Date(h.createdAt).toLocaleString()}</td>
                    <td className="px-5 py-3 text-gray-500 dark:text-gray-400 max-w-xs truncate">{h.text}</td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => handleDelete(h.id)} className="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-gray-400 flex items-center gap-1.5">
        <ShieldAlert className="w-4 h-4" /> History persists to the Supabase database in this preview. When connected to the Flask backend, predictions persist in SQLite instead.
      </p>
    </div>
  );
}

/** Stat card for the dashboard. */
function StatCard({ icon: Icon, label, value, color, delay }: { icon: any; label: string; value: number; color: 'brand' | 'green' | 'red'; delay: number }) {
  const colors = {
    brand: 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400',
    green: 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    red: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  };
  return (
    <div className="card p-5 animate-fade-in-up" style={{ animationDelay: `${delay}s` }}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
          <div className="text-3xl font-bold mt-1">{value}</div>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

/** Horizontal bar for the distribution chart. */
function Bar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max ? (value / max) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-gray-600 dark:text-gray-300">{label}</span>
        <span className="font-semibold">{value}</span>
      </div>
      <div className="h-4 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <div className={`h-full rounded-full bg-gradient-to-r ${color} animate-fade-in transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
