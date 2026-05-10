'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AdminLayout } from '@/components/admin/AdminComponents';
import { analyticsApi } from '@/services/api';

interface DashData {
  pageViews: number;
  projectClicks: number;
  totalEvents: number;
  topProjects: { _id: string; title: string; clicks: number }[];
  recentViews: { createdAt: string }[];
}
interface DayCount { _id: string; count: number }

export default function AdminAnalytics() {
  const [data, setData]     = useState<DashData | null>(null);
  const [series, setSeries] = useState<DayCount[]>([]);
  const [range, setRange]   = useState<'7d'|'30d'|'90d'>('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      analyticsApi.getDashboard(),
      analyticsApi.getPageViews(range),
    ])
      .then(([d, s]) => { setData(d.data.data); setSeries(s.data.data || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [range]);

  // Simple bar chart
  const maxCount = series.length ? Math.max(...series.map(s => s.count), 1) : 1;

  const StatCard = ({ label, value, icon, color }: { label: string; value: number | string; icon: string; color: string }) => (
    <div className="bg-surface border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-xs text-text3 uppercase tracking-wider">{label}</span>
        <span style={{ color }} className="text-lg">{icon}</span>
      </div>
      <div className="font-heading font-extrabold text-3xl gradient-text">{value}</div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading font-extrabold text-2xl">Analytics</h1>
        <div className="flex gap-2">
          {(['7d','30d','90d'] as const).map(r => (
            <button key={r} onClick={() => setRange(r)}
              className={`font-mono text-xs px-3 py-1.5 rounded-lg border transition-all ${
                range === r ? 'border-accent text-accent bg-accent/8' : 'border-border2 text-text2 hover:border-accent/50'
              }`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1,2,3,4].map(i => <div key={i} className="h-28 bg-surface border border-border rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Page Views"      value={data?.pageViews ?? 0}     icon="◎" color="var(--accent)" />
            <StatCard label="Project Clicks"  value={data?.projectClicks ?? 0} icon="◈" color="var(--purple)" />
            <StatCard label="Total Events"    value={data?.totalEvents ?? 0}   icon="⊡" color="var(--green)" />
            <StatCard label="Days in Range"   value={range.replace('d',' days')} icon="⊞" color="var(--accent3)" />
          </div>

          {/* Page views bar chart */}
          <div className="bg-surface border border-border rounded-xl p-6 mb-6">
            <h2 className="font-heading font-bold text-base mb-6">Page Views — {range}</h2>
            {series.length === 0 ? (
              <div className="h-40 flex items-center justify-center font-mono text-sm text-text3">No data for this period</div>
            ) : (
              <div className="flex items-end gap-1 h-40 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
                {series.map((s, i) => (
                  <motion.div
                    key={s._id}
                    initial={{ height: 0 }}
                    animate={{ height: `${(s.count / maxCount) * 100}%` }}
                    transition={{ delay: i * 0.03, duration: 0.4 }}
                    className="flex-shrink-0 rounded-t-md relative group"
                    style={{ width: 20, minHeight: 4, background: 'linear-gradient(180deg,#00d4ff,#0088ff)', opacity: 0.85 }}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-bg-tertiary border border-border rounded px-2 py-1 font-mono text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      {s._id}: {s.count}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            <div className="flex justify-between mt-2 font-mono text-xs text-text3 px-1">
              <span>{series[0]?._id}</span>
              <span>{series[series.length - 1]?._id}</span>
            </div>
          </div>

          {/* Top projects + Recent activity */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-surface border border-border rounded-xl p-6">
              <h2 className="font-heading font-bold text-base mb-4">Top Clicked Projects</h2>
              {!data?.topProjects?.length ? (
                <p className="font-mono text-xs text-text3">No project clicks yet.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {data.topProjects.map((p, i) => (
                    <div key={p._id} className="flex items-center gap-3">
                      <span className="font-mono text-xs text-text3 w-4">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-xs text-text2 truncate mb-1">{p.title || p._id}</div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(p.clicks / (data.topProjects[0]?.clicks || 1)) * 100}%` }}
                            transition={{ delay: i * 0.1, duration: 0.6 }}
                            className="h-full rounded-full"
                            style={{ background: 'linear-gradient(90deg,#00d4ff,#0088ff)' }}
                          />
                        </div>
                      </div>
                      <span className="font-heading font-bold text-sm gradient-text flex-shrink-0">{p.clicks}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-surface border border-border rounded-xl p-6">
              <h2 className="font-heading font-bold text-base mb-4">Recent Activity</h2>
              <div className="flex flex-col gap-2">
                {(data?.recentViews || []).slice(0, 10).map((v, i) => (
                  <div key={i} className="flex items-center justify-between font-mono text-xs">
                    <span className="text-text3">Page View</span>
                    <span className="text-text2">{new Date(v.createdAt).toLocaleString()}</span>
                  </div>
                ))}
                {!data?.recentViews?.length && <p className="font-mono text-xs text-text3">No recent activity.</p>}
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
