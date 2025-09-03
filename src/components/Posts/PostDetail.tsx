import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Trash2, 
  Heart, 
  MessageCircle, 
  Calendar,
  User
} from 'lucide-react';
import { RootState, AppDispatch } from '../../store';
import { 
  fetchPostById, 
  fetchPostComments, 
  hidePost, 
  hideComment, 
  deletePost, 
  clearSelectedPost 
} from '../../store/slices/postSlice';

const PostDetail: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const { selectedPost, postComments, loading } = useSelector((state: RootState) => state.posts);

  useEffect(() => {
    if (postId) {
      dispatch(fetchPostById(postId));
      dispatch(fetchPostComments(postId));
    }
    
    return () => {
      dispatch(clearSelectedPost());
    };
  }, [dispatch, postId]);

  const handleTogglePostVisibility = async () => {
    if (selectedPost) {
      await dispatch(hidePost({ postId: selectedPost._id, hidden: !selectedPost.hidden }));
    }
  };

  const handleToggleCommentVisibility = async (commentId: string, currentHidden: boolean) => {
    await dispatch(hideComment({ commentId, hidden: !currentHidden }));
  };

  const handleDeletePost = async () => {
    if (selectedPost) {
      await dispatch(deletePost(selectedPost._id));
      navigate('/posts');
    }
  };

  if (loading || !selectedPost) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/posts')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Post Details</h1>
          <p className="text-gray-600 mt-1">View and manage post content</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Post Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {selectedPost.image && (
              <img 
                src={selectedPost.image} 
                alt="Post" 
                className="w-full h-64 object-cover"
              />
            )}
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      selectedPost.type === 'Question' ? 'bg-blue-100 text-blue-800' :
                      selectedPost.type === 'Achievement' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedPost.type}
                    </span>
                    
                    {selectedPost.hidden && (
                      <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                        Hidden
                      </span>
                    )}
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">{selectedPost.title}</h2>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedPost.text}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Heart size={16} className="mr-1" />
                    {selectedPost.likes.length} likes
                  </div>
                  <div className="flex items-center">
                    <MessageCircle size={16} className="mr-1" />
                    {postComments.length} comments
                  </div>
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1" />
                    {new Date(selectedPost.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Comments ({postComments.filter(c => !c.hidden).length})
            </h3>
            
            {postComments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No comments found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {postComments.map((comment) => (
                  <div 
                    key={comment._id} 
                    className={`border border-gray-200 rounded-lg p-4 ${
                      comment.hidden ? 'bg-red-50 border-red-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        {comment.user.avatar ? (
                          <img 
                            src={comment.user.avatar} 
                            alt={comment.user.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                            <User size={16} className="text-white" />
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium text-gray-900">
                              {comment.user.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              @{comment.user.username}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm">{comment.text}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {comment.hidden && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                            Hidden
                          </span>
                        )}
                        
                        <button
                          onClick={() => handleToggleCommentVisibility(comment._id, comment.hidden)}
                          className={`p-1 rounded transition-colors ${
                            comment.hidden 
                              ? 'text-green-600 hover:bg-green-100'
                              : 'text-orange-600 hover:bg-orange-100'
                          }`}
                        >
                          <EyeOff size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Post Actions & Author Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Post Actions</h3>
            
            <div className="space-y-3">
              <button
                onClick={handleTogglePostVisibility}
                className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-colors ${
                  selectedPost.hidden
                    ? 'bg-green-50 text-green-700 hover:bg-green-100'
                    : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                }`}
              >
                <EyeOff size={20} />
                <span>{selectedPost.hidden ? 'Show Post' : 'Hide Post'}</span>
              </button>
              
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg transition-colors"
              >
                <Trash2 size={20} />
                <span>Delete Post</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Author</h3>
            
            <div className="flex items-center space-x-3 mb-4">
              {selectedPost.user.avatar ? (
                <img 
                  src={selectedPost.user.avatar} 
                  alt={selectedPost.user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                  <User size={24} className="text-white" />
                </div>
              )}
              
              <div>
                <p className="font-medium text-gray-900">{selectedPost.user.name}</p>
                <p className="text-sm text-gray-500">@{selectedPost.user.username}</p>
              </div>
            </div>
            
            <button
              onClick={() => navigate(`/users/${selectedPost.user._id}`)}
              className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <Eye size={16} />
              <span>View Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Post</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this post? This action cannot be undone and will also delete all associated comments.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePost}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetail;