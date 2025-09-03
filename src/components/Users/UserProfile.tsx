import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, User, Mail, Calendar, ExternalLink, Award, Target } from 'lucide-react';
import { RootState, AppDispatch } from '../../store';
import { fetchUserProfile, fetchUserPosts, clearSelectedUser } from '../../store/slices/userSlice';

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { selectedUser, userPosts, loading } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserProfile(userId));
      dispatch(fetchUserPosts(userId));
    }
    
    return () => {
      dispatch(clearSelectedUser());
    };
  }, [dispatch, userId]);

  if (loading || !selectedUser) {
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
          onClick={() => navigate('/users')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
          <p className="text-gray-600 mt-1">View and manage user details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Info Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="text-center">
              {selectedUser.avatar ? (
                <img 
                  src={selectedUser.avatar} 
                  alt={selectedUser.name}
                  className="w-24 h-24 rounded-full mx-auto object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full mx-auto bg-blue-500 flex items-center justify-center">
                  <User size={32} className="text-white" />
                </div>
              )}
              
              <h2 className="text-xl font-bold text-gray-900 mt-4">{selectedUser.name}</h2>
              <p className="text-gray-600">@{selectedUser.username}</p>
              
              {selectedUser.bio && (
                <p className="text-gray-700 mt-3 text-sm">{selectedUser.bio}</p>
              )}
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center text-sm">
                <Mail size={16} className="text-gray-400 mr-2" />
                <span className="text-gray-700">{selectedUser.email}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <Calendar size={16} className="text-gray-400 mr-2" />
                <span className="text-gray-700">
                  Joined {new Date(selectedUser.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center text-sm">
                <Award size={16} className="text-gray-400 mr-2" />
                <span className="text-gray-700">{selectedUser.xp} XP</span>
              </div>

              <div className="flex items-center text-sm">
                <Target size={16} className="text-gray-400 mr-2" />
                <span className="text-gray-700">{selectedUser.challenges} Challenges</span>
              </div>
            </div>

            {/* Social Links */}
            {(selectedUser.github || selectedUser.linkedin || selectedUser.twitter) && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Social Links</h3>
                <div className="space-y-2">
                  {selectedUser.github && (
                    <a 
                      href={selectedUser.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink size={14} className="mr-2" />
                      GitHub
                    </a>
                  )}
                  {selectedUser.linkedin && (
                    <a 
                      href={selectedUser.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink size={14} className="mr-2" />
                      LinkedIn
                    </a>
                  )}
                  {selectedUser.twitter && (
                    <a 
                      href={selectedUser.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink size={14} className="mr-2" />
                      Twitter
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* User Posts */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              User Posts ({userPosts.length})
            </h3>
            
            {userPosts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No posts found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userPosts.map((post) => (
                  <div 
                    key={post._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer"
                    onClick={() => navigate(`/posts/${post._id}`)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{post.title}</h4>
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{post.text}</p>
                        <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                          <span className={`px-2 py-1 rounded-full ${
                            post.type === 'Question' ? 'bg-blue-100 text-blue-800' :
                            post.type === 'Achievement' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {post.type}
                          </span>
                          <span>{post.likes.length} likes</span>
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      {post.hidden && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          Hidden
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;