import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Plus, Trash2 } from 'lucide-react';
import { Card } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { toast } from 'sonner';
import { apiClient } from '../lib/api/client';
import type { CommunityPost } from '../lib/api/types';
import { CommentsDialog } from './CommentsDialog';

interface CommunityPageProps {
  isDarkMode: boolean;
}

export function CommunityPage({ isDarkMode }: CommunityPageProps) {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isCommentsDialogOpen, setIsCommentsDialogOpen] = useState(false);

  const currentUser = apiClient.getUser();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getAllPosts();
      setPosts(data);
    } catch (error: any) {
      console.error('Failed to load posts:', error);
      toast.error('Failed to load community posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPost = async () => {
    if (!newPostContent.trim()) {
      toast.error('Please enter some content');
      return;
    }

    if (!apiClient.isAuthenticated()) {
      toast.error('Please login to create a post');
      return;
    }

    try {
      setIsSubmitting(true);
      const newPost = await apiClient.createPost({ content: newPostContent });
      setPosts([newPost, ...posts]);
      setNewPostContent('');
      setIsDialogOpen(false);
      toast.success('Post added successfully!');
    } catch (error: any) {
      console.error('Failed to create post:', error);
      toast.error(error.message || 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (postId: string, isLiked: boolean) => {
    if (!apiClient.isAuthenticated()) {
      toast.error('Please login to like posts');
      return;
    }

    try {
      if (isLiked) {
        await apiClient.unlikePost(postId);
        setPosts(posts.map(post =>
          post.id === postId
            ? { ...post, likesCount: post.likesCount - 1, isLikedByCurrentUser: false }
            : post
        ));
      } else {
        await apiClient.likePost(postId);
        setPosts(posts.map(post =>
          post.id === postId
            ? { ...post, likesCount: post.likesCount + 1, isLikedByCurrentUser: true }
            : post
        ));
      }
    } catch (error: any) {
      console.error('Failed to like/unlike post:', error);
      toast.error(error.message || 'Failed to update like');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await apiClient.deletePost(postId);
      setPosts(posts.filter(post => post.id !== postId));
      toast.success('Post deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete post:', error);
      toast.error(error.message || 'Failed to delete post');
    }
  };

  const handleOpenComments = (postId: string) => {
    setSelectedPostId(postId);
    setIsCommentsDialogOpen(true);
  };

  const handleCommentsUpdated = () => {
    loadPosts(); // Reload posts to update comment counts
  };

  const getInitials = (username: string) => {
    return username
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>Community</h2>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Share experiences and ask questions
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className={`rounded-full ${isDarkMode ? 'bg-orange-600 hover:bg-orange-700' : 'bg-orange-600 hover:bg-orange-700'}`}
              disabled={!apiClient.isAuthenticated()}
            >
              <Plus className="w-5 h-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className={isDarkMode ? 'bg-gray-900 border-gray-800 text-gray-100' : 'bg-white'}>
            <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Textarea
                placeholder="Share your thoughts, questions, or experiences..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className={`min-h-32 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : ''}`}
                disabled={isSubmitting}
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddPost}
                  className="bg-orange-600 hover:bg-orange-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Posting...' : 'Post'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            No posts yet. Be the first to share!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map((post) => (
            <Card
              key={post.id}
              className={`p-4 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}
            >
              <div className="flex gap-3 mb-3">
                <Avatar>
                  <AvatarFallback className={isDarkMode ? 'bg-orange-900 text-orange-300' : 'bg-orange-100 text-orange-700'}>
                    {getInitials(post.username)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>{post.username}</h4>
                      <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        {getTimeAgo(post.createdAt)}
                      </span>
                    </div>
                    {currentUser && post.userId === currentUser.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {post.content}
              </p>

              <div className="flex gap-6">
                <button
                  onClick={() => handleLike(post.id, post.isLikedByCurrentUser)}
                  className={`flex items-center gap-2 transition-colors ${
                    post.isLikedByCurrentUser
                      ? 'text-red-500'
                      : isDarkMode
                      ? 'text-gray-400 hover:text-red-400'
                      : 'text-gray-600 hover:text-red-600'
                  }`}
                  disabled={!apiClient.isAuthenticated()}
                >
                  <Heart className={`w-5 h-5 ${post.isLikedByCurrentUser ? 'fill-current' : ''}`} />
                  <span>{post.likesCount}</span>
                </button>
                <button
                  onClick={() => handleOpenComments(post.id)}
                  className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-600 hover:text-orange-600'} transition-colors`}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{post.commentsCount}</span>
                </button>
                <button className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-400 hover:text-green-400' : 'text-gray-600 hover:text-green-600'} transition-colors`}>
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {selectedPostId && (
        <CommentsDialog
          postId={selectedPostId}
          isOpen={isCommentsDialogOpen}
          onClose={() => setIsCommentsDialogOpen(false)}
          isDarkMode={isDarkMode}
          onCommentAdded={handleCommentsUpdated}
        />
      )}
    </div>
  );
}
