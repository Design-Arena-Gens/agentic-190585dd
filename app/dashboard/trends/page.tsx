'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, TrendingUp, Check, X, Sparkles } from 'lucide-react';

interface Trend {
  id: string;
  title: string;
  description?: string;
  source: string;
  category?: string;
  popularityScore: number;
  url?: string;
  status: string;
  createdAt: string;
}

export default function TrendsPage() {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [filters, setFilters] = useState({
    source: 'all',
    status: 'all',
  });

  useEffect(() => {
    fetchTrends();
  }, [filters]);

  const fetchTrends = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.source !== 'all') params.append('source', filters.source);
      if (filters.status !== 'all') params.append('status', filters.status);

      const response = await fetch(`/api/trends?${params}`);
      if (response.ok) {
        const data = await response.json();
        setTrends(data.trends || []);
      }
    } catch (error) {
      console.error('Error fetching trends:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNewTrends = async () => {
    setFetching(true);
    try {
      const response = await fetch('/api/trends/fetch', { method: 'POST' });
      if (response.ok) {
        await fetchTrends();
      }
    } catch (error) {
      console.error('Error fetching new trends:', error);
    } finally {
      setFetching(false);
    }
  };

  const updateTrendStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/trends/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setTrends((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status } : t))
        );
      }
    } catch (error) {
      console.error('Error updating trend:', error);
    }
  };

  const generatePost = async (trendId: string) => {
    try {
      const response = await fetch('/api/posts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trendId }),
      });

      if (response.ok) {
        alert('Post generated successfully! Check the Posts page.');
      }
    } catch (error) {
      console.error('Error generating post:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trending Topics</h1>
          <p className="text-gray-600">
            Discover trending topics from multiple sources
          </p>
        </div>
        <button
          onClick={fetchNewTrends}
          disabled={fetching}
          className="btn btn-primary flex items-center"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${fetching ? 'animate-spin' : ''}`}
          />
          {fetching ? 'Fetching...' : 'Fetch New Trends'}
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source
            </label>
            <select
              value={filters.source}
              onChange={(e) =>
                setFilters({ ...filters, source: e.target.value })
              }
              className="input"
            >
              <option value="all">All Sources</option>
              <option value="google">Google Trends</option>
              <option value="reddit">Reddit</option>
              <option value="hackernews">Hacker News</option>
              <option value="twitter">Twitter/X</option>
              <option value="youtube">YouTube</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="input"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Trends List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading trends...</div>
        </div>
      ) : trends.length === 0 ? (
        <div className="card text-center py-12">
          <TrendingUp className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No trends found
          </h3>
          <p className="text-gray-600 mb-4">
            Click "Fetch New Trends" to discover trending topics
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {trends.map((trend) => (
            <div key={trend.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {trend.title}
                    </h3>
                    <span className="badge badge-info text-xs">
                      {trend.source}
                    </span>
                    <span className="text-sm text-gray-500">
                      Score: {trend.popularityScore}
                    </span>
                  </div>

                  {trend.description && (
                    <p className="text-gray-600 mb-3">{trend.description}</p>
                  )}

                  {trend.url && (
                    <a
                      href={trend.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      View source →
                    </a>
                  )}

                  <div className="flex items-center gap-2 mt-3">
                    <span
                      className={`badge ${
                        trend.status === 'approved'
                          ? 'badge-success'
                          : trend.status === 'rejected'
                          ? 'badge-danger'
                          : 'badge-warning'
                      }`}
                    >
                      {trend.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(trend.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  {trend.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateTrendStatus(trend.id, 'approved')}
                        className="btn btn-success text-sm py-1 px-3"
                        title="Approve"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => updateTrendStatus(trend.id, 'rejected')}
                        className="btn btn-danger text-sm py-1 px-3"
                        title="Reject"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  )}

                  {trend.status === 'approved' && (
                    <button
                      onClick={() => generatePost(trend.id)}
                      className="btn btn-primary text-sm py-1 px-3 flex items-center"
                      title="Generate Post"
                    >
                      <Sparkles className="h-4 w-4 mr-1" />
                      Generate
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
