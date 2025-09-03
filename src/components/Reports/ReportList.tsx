import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Eye, 
  Check, 
  X, 
  AlertTriangle,
  ChevronLeft, 
  ChevronRight,
  User,
  MessageCircle,
  FileText
} from 'lucide-react';
import { RootState, AppDispatch } from '../../store';
import { fetchReports, updateReportStatus } from '../../store/slices/reportSlice';

const ReportList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  const { reports, pagination, loading, error } = useSelector((state: RootState) => state.reports);

  useEffect(() => {
    dispatch(fetchReports({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handlePageChange = (page: number) => {
    dispatch(fetchReports({ page, limit: pagination.limit, status: statusFilter }));
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    dispatch(fetchReports({ page: 1, limit: pagination.limit, status }));
  };

  const handleUpdateStatus = async (reportId: string, status: string) => {
    await dispatch(updateReportStatus({ reportId, status }));
    dispatch(fetchReports({ page: pagination.page, limit: pagination.limit, status: statusFilter }));
  };

  const filteredReports = reports.filter(report =>
    report.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.reporter.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && reports.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports Management</h1>
          <p className="text-gray-600 mt-1">Review and manage user reports</p>
        </div>
        
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="dismissed">Dismissed</option>
            </select>
            <Filter size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6">
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div key={report._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <AlertTriangle size={20} className="text-orange-500 mt-0.5" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            report.status === 'reviewed' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {report.status}
                          </span>
                          
                          <span className="text-xs text-gray-500">
                            {new Date(report.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <p className="text-gray-900 font-medium mb-1">{report.reason}</p>
                        
                        {report.message && (
                          <p className="text-gray-600 text-sm mb-3">"{report.message}"</p>
                        )}
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <User size={14} className="mr-1" />
                            Reported by {report.reporter.name}
                          </div>
                          
                          {report.post && (
                            <button
                              onClick={() => navigate(`/posts/${report.post._id}`)}
                              className="flex items-center text-blue-600 hover:text-blue-800"
                            >
                              <FileText size={14} className="mr-1" />
                              View Post
                            </button>
                          )}
                          
                          {report.comment && (
                            <div className="flex items-center">
                              <MessageCircle size={14} className="mr-1" />
                              Comment Report
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {report.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpdateStatus(report._id, 'reviewed')}
                        className="flex items-center space-x-1 px-3 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition-colors text-sm"
                      >
                        <Check size={14} />
                        <span>Approve</span>
                      </button>
                      
                      <button
                        onClick={() => handleUpdateStatus(report._id, 'dismissed')}
                        className="flex items-center space-x-1 px-3 py-2 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                      >
                        <X size={14} />
                        <span>Dismiss</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span> of{' '}
                <span className="font-medium">{pagination.total}</span> reports
              </p>
            </div>
            
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft size={20} />
                </button>
                
                {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                  const page = i + Math.max(1, pagination.page - 2);
                  return page <= pagination.totalPages ? (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === pagination.page
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ) : null;
                })}
                
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronRight size={20} />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportList;