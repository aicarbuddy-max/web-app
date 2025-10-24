import { useState, useEffect } from 'react';
import { Trash2, Send } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner';
import { apiClient } from '../lib/api/client';
import type { PostComment } from '../lib/api/types';

interface CommentsDialogProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onCommentAdded?: () => void;
}

export function CommentsDialog({ postId, isOpen, onClose, isDarkMode, onCommentAdded }: CommentsDialogProps) {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentUser = apiClient.getUser();

  useEffect(() => {
    if (isOpen) {
      loadComments();
    }
  }, [isOpen, postId]);

  const loadComments = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getPostComments(postId);
      setComments(data);
    } catch (error: any) {
      console.error('Failed to load comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    if (!apiClient.isAuthenticated()) {
      toast.error('Please login to comment');
      return;
    }

    try {
      setIsSubmitting(true);
      const comment = await apiClient.addComment(postId, { content: newComment });
      setComments([...comments, comment]);
      setNewComment('');
      toast.success('Comment added successfully!');
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error: any) {
      console.error('Failed to add comment:', error);
      toast.error(error.message || 'Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await apiClient.deleteComment(commentId);
      setComments(comments.filter(c => c.id !== commentId));
      toast.success('Comment deleted successfully');
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error: any) {
      console.error('Failed to delete comment:', error);
      toast.error(error.message || 'Failed to delete comment');
    }
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-2xl ${isDarkMode ? 'bg-gray-900 border-gray-800 text-gray-100' : 'bg-white'}`}>
        <DialogHeader>
          <DialogTitle>Comments ({comments.length})</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Comments List */}
          <ScrollArea className="h-[400px] pr-4">
            {isLoading ? (
              <div className="text-center py-8">
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Loading comments...</p>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8">
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  No comments yet. Be the first to comment!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`p-4 rounded-lg ${
                      isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className={isDarkMode ? 'bg-orange-900 text-orange-300 text-xs' : 'bg-orange-100 text-orange-700 text-xs'}>
                          {getInitials(comment.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                              {comment.username}
                            </h4>
                            <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                              {getTimeAgo(comment.createdAt)}
                            </span>
                          </div>
                          {currentUser && comment.userId === currentUser.id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Add Comment */}
          {apiClient.isAuthenticated() ? (
            <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className={`min-h-20 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : ''}`}
                disabled={isSubmitting}
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleAddComment}
                  className="bg-orange-600 hover:bg-orange-700"
                  disabled={isSubmitting || !newComment.trim()}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Sending...' : 'Send'}
                </Button>
              </div>
            </div>
          ) : (
            <div className={`text-center py-4 border-t ${isDarkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-600'}`}>
              Please login to add comments
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
