import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users, FileText, AlertTriangle, TrendingUp } from 'lucide-react';
import { RootState, AppDispatch } from '../../store';
import { fetchDashboardStats } from '../../store/slices/dashboardSlice';
import StatsCard from './StatsCard';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { stats, loading, error } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading dashboard: {error}</p>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of React Play app statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="blue"
          trend={{
            value: 12,
            isPositive: true
          }}
        />
        
        <StatsCard
          title="Total Posts"
          value={stats.totalPosts}
          icon={FileText}
          color="green"
          trend={{
            value: 8,
            isPositive: true
          }}
        />
        
        <StatsCard
          title="Reports"
          value={stats.totalReports}
          icon={AlertTriangle}
          color="orange"
          trend={{
            value: -5,
            isPositive: false
          }}
        />
        
        <StatsCard
          title="Growth"
          value={stats.newUsersThisMonth}
          icon={TrendingUp}
          color="purple"
          trend={{
            value: 15,
            isPositive: true
          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">New user registered: john_doe</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">Post published: "React Best Practices"</p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">Report submitted for inappropriate content</p>
                <p className="text-xs text-gray-500">6 hours ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Users Today</span>
              <span className="font-semibold text-gray-900">1,247</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Posts This Week</span>
              <span className="font-semibold text-gray-900">156</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending Reports</span>
              <span className="font-semibold text-orange-600">8</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">User Engagement Rate</span>
              <span className="font-semibold text-green-600">87%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;