import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    statusStats: [],
    priorityStats: [],
    projectStats: []
  });
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    project: '',
    assignedTo: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 1
  });

  useEffect(() => {
    fetchBugs();
    fetchStats();
  }, [filters, pagination.page]);

  const fetchBugs = async () => {
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        page: pagination.page,
        limit: 10
      }).toString();

      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      console.log('Using API URL:', apiUrl);
      
      const response = await axios.get(`${apiUrl}/api/bugs?${queryParams}`);
      setBugs(response.data.bugs || []);
      setPagination(response.data.pagination || {
        page: 1,
        total: 0,
        pages: 1
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bugs:', error);
      setBugs([]);
      setPagination({
        page: 1,
        total: 0,
        pages: 1
      });
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${apiUrl}/api/bugs/stats`);
      setStats(response.data || {
        statusStats: [],
        priorityStats: [],
        projectStats: []
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        statusStats: [],
        priorityStats: [],
        projectStats: []
      });
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setFilters(prev => ({
      ...prev,
      search: value
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const getStatusColor = (status) => {
    const colors = {
      'Open': 'bg-red-100 text-red-800',
      'In Progress': 'bg-yellow-100 text-yellow-800',
      'Resolved': 'bg-green-100 text-green-800',
      'Closed': 'bg-gray-100 text-gray-800',
      'Reopened': 'bg-orange-100 text-orange-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div>
      {/* Search and Filters */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <input
            type="text"
            placeholder="Search bugs..."
            value={filters.search}
            onChange={handleSearch}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
            <option value="Reopened">Reopened</option>
          </select>
          <select
            name="priority"
            value={filters.priority}
            onChange={handleFilterChange}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
          <select
            name="project"
            value={filters.project}
            onChange={handleFilterChange}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">All Projects</option>
            {stats?.projectStats?.map(stat => (
              <option key={stat._id} value={stat._id}>
                {stat._id} ({stat.count})
              </option>
            ))}
          </select>
          <input
            type="text"
            name="assignedTo"
            placeholder="Filter by assignee"
            value={filters.assignedTo}
            onChange={handleFilterChange}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {stats?.statusStats?.map(stat => (
          <div key={stat._id} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700">{stat._id}</h3>
            <p className={`text-3xl font-bold ${
              stat._id === 'Open' ? 'text-red-600' :
              stat._id === 'In Progress' ? 'text-yellow-600' :
              stat._id === 'Resolved' ? 'text-green-600' :
              'text-gray-600'
            }`}>
              {stat.count}
            </p>
          </div>
        ))}
      </div>

      {/* Bugs Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">All Bugs</h3>
          <Link
            to="/report"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Report New Bug
          </Link>
        </div>
        <div className="border-t border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bugs.map((bug) => (
                <tr key={bug._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/bug/${bug._id}`} className="text-blue-600 hover:text-blue-900">
                      {bug.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${bug.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                        bug.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                        bug.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'}`}>
                      {bug.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(bug.status)}`}>
                      {bug.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bug.project}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bug.assignedTo || 'Unassigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bug.dueDate ? new Date(bug.dueDate).toLocaleDateString() : 'Not set'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.pages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing page <span className="font-medium">{pagination.page}</span> of{' '}
                <span className="font-medium">{pagination.pages}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.pages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 