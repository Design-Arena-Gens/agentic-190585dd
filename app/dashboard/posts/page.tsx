'use client';

import { useEffect, useState } from 'react';
import { FileText, Send, Trash2, Eye, Image } from 'lucide-react';

interface Post {
  id: string;
  platform: string;
  content: string;
  caption?: string;
  imageUrl?: string;
  status: string;
  scheduledFor?: string;
  publishedAt?: string;
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const publishPost = async (id: string) => {
    try {
      const response = await fetch(`/api/posts/${id}/publish`, {
        method: 'POST',
      });

      if (response.ok) {
        await fetchPosts();
        alert('Post published successfully!');
      }
    } catch (error) {
      console.error('Error publishing post:', error);
      alert('Failed to publish post');
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      facebook: 'bg-blue-600',
      instagram: 'bg-pink-600',
      twitter: 'bg-sky-500',
      linkedin: 'bg-blue-700',
      youtube: 'bg-red-600',
      pinterest: 'bg-red-500',
      threads: 'bg-black',
    };
    return colors[platform.toLowerCase()] || 'bg-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
          <p className="text-gray-600">
            Manage and publish your social media posts
          </p>
        </div>
      </div>

      {/* Posts Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading posts...</div>
        </div>
      ) : posts.length === 0 ? (
        <div className="card text-center py-12">
          <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No posts yet
          </h3>
          <p className="text-gray-600 mb-4">
            Generate posts from trending topics to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="card">
              {/* Platform Badge */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`${getPlatformColor(
                    post.platform
                  )} text-white text-xs font-medium px-2.5 py-1 rounded-full`}
                >
                  {post.platform}
                </span>
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

              {/* Image Preview */}
              {post.imageUrl && (
                <div className="mb-3 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={post.imageUrl}
                    alt="Post image"
                    className="w-full h-40 object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <p className="text-gray-900 mb-3 line-clamp-4">
                {post.content}
              </p>

              {/* Stats */}
              {post.status === 'published' && (
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span>❤️ {post.likes}</span>
                  <span>💬 {post.comments}</span>
                  <span>🔄 {post.shares}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t">
                <button
                  onClick={() => setSelectedPost(post)}
                  className="btn btn-secondary text-sm py-1 px-3 flex items-center"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </button>

                {post.status === 'draft' && (
                  <button
                    onClick={() => publishPost(post.id)}
                    className="btn btn-primary text-sm py-1 px-3 flex items-center"
                  >
                    <Send className="h-3 w-3 mr-1" />
                    Publish
                  </button>
                )}

                <button
                  onClick={() => deletePost(post.id)}
                  className="btn btn-danger text-sm py-1 px-3 flex items-center ml-auto"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Details Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Post Details</h2>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Platform
                  </label>
                  <p className="mt-1">{selectedPost.platform}</p>
                </div>

                {selectedPost.imageUrl && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Image
                    </label>
                    <img
                      src={selectedPost.imageUrl}
                      alt="Post"
                      className="mt-2 rounded-lg max-h-64 object-cover"
                    />
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Content
                  </label>
                  <p className="mt-1 whitespace-pre-wrap">
                    {selectedPost.content}
                  </p>
                </div>

                {selectedPost.caption && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Caption
                    </label>
                    <p className="mt-1">{selectedPost.caption}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <p className="mt-1">
                    <span
                      className={`badge ${
                        selectedPost.status === 'published'
                          ? 'badge-success'
                          : selectedPost.status === 'scheduled'
                          ? 'badge-info'
                          : 'badge-warning'
                      }`}
                    >
                      {selectedPost.status}
                    </span>
                  </p>
                </div>

                {selectedPost.status === 'published' && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Engagement
                    </label>
                    <div className="mt-1 flex gap-4">
                      <span>Likes: {selectedPost.likes}</span>
                      <span>Comments: {selectedPost.comments}</span>
                      <span>Shares: {selectedPost.shares}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-2">
                {selectedPost.status === 'draft' && (
                  <button
                    onClick={() => {
                      publishPost(selectedPost.id);
                      setSelectedPost(null);
                    }}
                    className="btn btn-primary"
                  >
                    Publish Now
                  </button>
                )}
                <button
                  onClick={() => setSelectedPost(null)}
                  className="btn btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
