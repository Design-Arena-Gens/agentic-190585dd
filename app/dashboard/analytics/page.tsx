'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    platformStats: [],
    engagementTrend: [],
    postsByStatus: [],
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Simulate analytics data
      const platformStats = [
        { platform: 'Facebook', posts: 12, likes: 450, comments: 89, shares: 23 },
        { platform: 'Instagram', posts: 18, likes: 820, comments: 156, shares: 45 },
        { platform: 'Twitter', posts: 25, likes: 340, comments: 67, shares: 12 },
        { platform: 'LinkedIn', posts: 8, likes: 210, comments: 34, shares: 18 },
      ];

      const engagementTrend = [
        { date: '2024-01-01', engagement: 230 },
        { date: '2024-01-02', engagement: 450 },
        { date: '2024-01-03', engagement: 380 },
        { date: '2024-01-04', engagement: 620 },
        { date: '2024-01-05', engagement: 540 },
        { date: '2024-01-06', engagement: 780 },
        { date: '2024-01-07', engagement: 690 },
      ];

      const postsByStatus = [
        { name: 'Published', value: 45, color: '#10b981' },
        { name: 'Scheduled', value: 12, color: '#3b82f6' },
        { name: 'Draft', value: 8, color: '#f59e0b' },
        { name: 'Failed', value: 2, color: '#ef4444' },
      ];

      setData({ platformStats, engagementTrend, postsByStatus });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">Track your social media performance</p>
      </div>

      {/* Platform Performance */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Platform Performance
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.platformStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="platform" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="likes" fill="#3b82f6" />
            <Bar dataKey="comments" fill="#10b981" />
            <Bar dataKey="shares" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Engagement Trend */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Engagement Trend
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.engagementTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="engagement"
              stroke="#8b5cf6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Posts by Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Posts by Status
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.postsByStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.postsByStatus.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Performing Posts */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Top Performing Posts
          </h2>
          <div className="space-y-3">
            {[
              { title: 'AI trends in 2024', engagement: 1200, platform: 'Instagram' },
              { title: 'Marketing tips', engagement: 980, platform: 'LinkedIn' },
              { title: 'Tech innovation', engagement: 850, platform: 'Facebook' },
              { title: 'Social media growth', engagement: 720, platform: 'Twitter' },
            ].map((post, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{post.title}</p>
                  <p className="text-sm text-gray-600">{post.platform}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary-600">
                    {post.engagement}
                  </p>
                  <p className="text-xs text-gray-500">engagements</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <p className="text-3xl font-bold text-primary-600">67</p>
          <p className="text-sm text-gray-600 mt-1">Total Posts</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-green-600">1,820</p>
          <p className="text-sm text-gray-600 mt-1">Total Likes</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-blue-600">346</p>
          <p className="text-sm text-gray-600 mt-1">Total Comments</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-orange-600">98</p>
          <p className="text-sm text-gray-600 mt-1">Total Shares</p>
        </div>
      </div>
    </div>
  );
}
