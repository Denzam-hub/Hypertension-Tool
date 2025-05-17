import React, { useState } from 'react';
import PropTypes from 'prop-types';
import LikeButton from './LikeButton';
import CommentSection from './CommentSection';
import { formatDistanceToNow } from 'date-fns';
import api from '../../services/api';

const Post = ({ post, onLikeToggle, onCommentCountChange }) => {
  // Always initialize from backend value
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(post.comments);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [userLiked, setUserLiked] = useState(post.userLiked);
  
  // Get proper avatar URL with fallback
  const avatarUrl = post.author.avatar && post.author.avatar.trim() !== '' 
    ? api.getFullImageUrl(post.author.avatar) 
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.name)}&background=8b5cf6&color=fff`;
  
  // Handle comment count updates
  const handleCommentCountChange = (newCount) => {
    setCommentCount(newCount);
    // Propagate to parent if needed
    if (onCommentCountChange) {
      onCommentCountChange(post.id, newCount);
    }
  };

  // Update like count and liked status after toggle
  const handleLike = async () => {
    try {
      const response = await onLikeToggle(post.id, 'post');
      if (response && typeof response.count === 'number') {
        setLikeCount(response.count);
        setUserLiked(response.liked);
      }
    } catch (e) {
      console.error("Error toggling like:", e);
      // Don't update state on error - keep previous state
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md p-4 transition hover:shadow-lg">
      <div className="flex items-start space-x-3">
        <img 
          src={avatarUrl} 
          alt={post.author.name} 
          className="w-10 h-10 rounded-full object-cover" 
        />
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-semibold">{post.author.name}</h3>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </span>
          </div>
          <p className="text-gray-700 mb-3">{post.content}</p>
          
          <div className="flex items-center space-x-4 text-gray-500 pt-2 border-t border-gray-100">
            <LikeButton 
              liked={userLiked} 
              count={likeCount} 
              onToggle={handleLike}
            />
            
            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-1 hover:text-violet-600 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <span>{commentCount}</span>
            </button>
            
            <button className="flex items-center space-x-1 hover:text-violet-600 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span>Share</span>
            </button>
          </div>
          
          {showComments && (
            <CommentSection 
              postId={String(post.id)} // Ensure postId is a string
              postType="post"
              initialCommentCount={commentCount}
              onCommentCountChange={handleCommentCountChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

Post.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    author: PropTypes.shape({
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string,
    }).isRequired,
    createdAt: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    userLiked: PropTypes.bool,
    likes: PropTypes.number.isRequired,
    comments: PropTypes.number.isRequired,
  }).isRequired,
  onLikeToggle: PropTypes.func.isRequired,
  onCommentCountChange: PropTypes.func,
};

export default Post;