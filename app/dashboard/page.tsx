'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, FileText, Calendar, Activity } from 'lucide-react';
import Link from 'next/link';

interface Stats {
  totalTrends: number;
  totalPosts: number;
  scheduledPosts: number;
  totalEngagement: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalTrends: 0,
    totalPosts: 0,
    scheduledPosts: 0,
    totalEngagement: 0,
  });
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, postsRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/posts?limit=5'),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (postsRes.ok) {
        const postsData = await postsRes.json();
        setRecentPosts(postsData.posts || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: 'Total Trends',
      value: stats.totalTrends,
      icon: TrendingUp,
      color: 'bg-blue-500',
      href: '/dashboard/trends',
    },
    {
      name: 'Total Posts',
      value: stats.totalPosts,
      icon: FileText,
      color: 'bg-green-500',
      href: '/dashboard/posts',
    },
    {
      name: 'Scheduled Posts',
      value: stats.scheduledPosts,
      icon: Calendar,
      color: 'bg-purple-500',
      href: '/dashboard/schedule',
    },
    {
      name: 'Total Engagement',
      value: stats.totalEngagement,
      icon: Activity,
      color: 'bg-orange-500',
      href: '/dashboard/analytics',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Welcome to AI Social Media Manager
        </h2>
        <p className="text-primary-100">
          Manage all your social media platforms from one place with AI-powered automation
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="card card-hover cursor-pointer"
          >
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Posts */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Posts</h3>
          <Link
            href="/dashboard/posts"
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            View all
          </Link>
        </div>

        {recentPosts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p>No posts yet. Start by discovering trends!</p>
            <Link
              href="/dashboard/trends"
              className="btn btn-primary mt-4 inline-block"
            >
              Discover Trends
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {post.content.substring(0, 100)}
                    {post.content.length > 100 ? '...' : ''}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {post.platform} • {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`badge ${
                    post.status === 'published'
                      ? 'badge-success'
                      : post.status === 'scheduled'
                      ? 'badge-info'
                      : 'badge-warning'
                  }`}
                >
                  {post.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/trends" className="card card-hover text-center">
          <TrendingUp className="h-10 w-10 mx-auto mb-3 text-primary-600" />
          <h4 className="font-semibold text-gray-900">Discover Trends</h4>
          <p className="text-sm text-gray-600 mt-1">
            Find trending topics to post about
          </p>
        </Link>

        <Link href="/dashboard/posts" className="card card-hover text-center">
          <FileText className="h-10 w-10 mx-auto mb-3 text-primary-600" />
          <h4 className="font-semibold text-gray-900">Create Post</h4>
          <p className="text-sm text-gray-600 mt-1">
            Generate AI-powered content
          </p>
        </Link>

        <Link href="/dashboard/analytics" className="card card-hover text-center">
          <Activity className="h-10 w-10 mx-auto mb-3 text-primary-600" />
          <h4 className="font-semibold text-gray-900">View Analytics</h4>
          <p className="text-sm text-gray-600 mt-1">
            Track your performance metrics
          </p>
        </Link>
      </div>
    </div>
  );
}
