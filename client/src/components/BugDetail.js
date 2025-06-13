import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BugDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bug, setBug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    status: '',
    assignedTo: '',
    priority: '',
    dueDate: '',
    estimatedTime: '',
    actualTime: '',
    tags: ''
  });

  useEffect(() => {
    fetchBug();
  }, [id]);

  const fetchBug = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/bugs/${id}`);
      setBug(response.data);
      setFormData({
        status: response.data.status,
        assignedTo: response.data.assignedTo || '',
        priority: response.data.priority,
        dueDate: response.data.dueDate ? new Date(response.data.dueDate).toISOString().split('T')[0] : '',
        estimatedTime: response.data.estimatedTime || '',
        actualTime: response.data.actualTime || '',
        tags: response.data.tags?.join(', ') || ''
      });
      setLoading(false);
    } catch (error) {
      setError('Error fetching bug details');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');

    try {
      const updateData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      await axios.put(`http://localhost:5000/api/bugs/${id}`, updateData);
      fetchBug();
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating bug');
    } finally {
      setUpdating(false);
    }
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

  const getPriorityColor = (priority) => {
    const colors = {
      'Critical': 'bg-red-100 text-red-800',
      'High': 'bg-orange-100 text-orange-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Low': 'bg-green-100 text-green-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (!bug) {
    return <div className="text-center py-4 text-red-600">Bug not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{bug.title}</h2>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Back to Dashboard
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Bug Details</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(bug.status)}`}>
                      {bug.status}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Priority</dt>
                  <dd>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(bug.priority)}`}>
                      {bug.priority}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Project</dt>
                  <dd className="text-sm text-gray-900">{bug.project}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Reporter</dt>
                  <dd className="text-sm text-gray-900">{bug.reporter}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Assigned To</dt>
                  <dd className="text-sm text-gray-900">{bug.assignedTo || 'Unassigned'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created At</dt>
                  <dd className="text-sm text-gray-900">{new Date(bug.createdAt).toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="text-sm text-gray-900">{new Date(bug.updatedAt).toLocaleString()}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Timeline</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Due Date</dt>
                  <dd className="text-sm text-gray-900">
                    {bug.dueDate ? new Date(bug.dueDate).toLocaleDateString() : 'Not set'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Estimated Time</dt>
                  <dd className="text-sm text-gray-900">
                    {bug.estimatedTime ? `${bug.estimatedTime} hours` : 'Not set'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Actual Time</dt>
                  <dd className="text-sm text-gray-900">
                    {bug.actualTime ? `${bug.actualTime} hours` : 'Not set'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Tags</dt>
                  <dd className="text-sm text-gray-900">
                    {bug.tags?.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {bug.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      'No tags'
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
            <p className="text-sm text-gray-900 whitespace-pre-wrap">{bug.description}</p>
          </div>

          {bug.screenshot && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Screenshot</h3>
              <img
                src={bug.screenshot}
                alt="Bug screenshot"
                className="max-w-full h-auto rounded-lg shadow"
              />
            </div>
          )}

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Update Bug</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                    <option value="Reopened">Reopened</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Assigned To</label>
                  <input
                    type="text"
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Estimated Time (hours)</label>
                  <input
                    type="number"
                    name="estimatedTime"
                    value={formData.estimatedTime}
                    onChange={handleChange}
                    min="0"
                    step="0.5"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Actual Time (hours)</label>
                  <input
                    type="number"
                    name="actualTime"
                    value={formData.actualTime}
                    onChange={handleChange}
                    min="0"
                    step="0.5"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {updating ? 'Updating...' : 'Update Bug'}
                </button>
              </div>
            </form>
          </div>

          {/* Change History */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Change History</h3>
            <div className="flow-root">
              <ul className="-mb-8">
                {bug.history?.map((change, index) => (
                  <li key={index}>
                    <div className="relative pb-8">
                      {index !== bug.history.length - 1 && (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                            <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm text-gray-500">
                            <div className="font-medium text-gray-900">
                              {change.field === 'status' && (
                                <span className="flex items-center">
                                  Status changed from{' '}
                                  <span className={`mx-1 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(change.oldValue)}`}>
                                    {change.oldValue || 'Not Set'}
                                  </span>
                                  {' to '}
                                  <span className={`mx-1 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(change.newValue)}`}>
                                    {change.newValue || 'Not Set'}
                                  </span>
                                </span>
                              )}
                              {change.field === 'priority' && (
                                <span className="flex items-center">
                                  Priority changed from{' '}
                                  <span className={`mx-1 px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(change.oldValue)}`}>
                                    {change.oldValue || 'Not Set'}
                                  </span>
                                  {' to '}
                                  <span className={`mx-1 px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(change.newValue)}`}>
                                    {change.newValue || 'Not Set'}
                                  </span>
                                </span>
                              )}
                              {change.field === 'assignedTo' && (
                                <span>
                                  Assigned to changed from <span className="font-medium">{change.oldValue || 'Unassigned'}</span> to{' '}
                                  <span className="font-medium">{change.newValue || 'Unassigned'}</span>
                                </span>
                              )}
                              {change.field === 'dueDate' && (
                                <span>
                                  Due date changed from{' '}
                                  <span className="font-medium">
                                    {change.oldValue ? new Date(change.oldValue).toLocaleDateString() : 'Not set'}
                                  </span>{' '}
                                  to{' '}
                                  <span className="font-medium">
                                    {change.newValue ? new Date(change.newValue).toLocaleDateString() : 'Not set'}
                                  </span>
                                </span>
                              )}
                              {change.field === 'estimatedTime' && (
                                <span>
                                  Estimated time changed from{' '}
                                  <span className="font-medium">{change.oldValue || 'Not set'}</span> to{' '}
                                  <span className="font-medium">{change.newValue || 'Not set'}</span>
                                </span>
                              )}
                              {change.field === 'actualTime' && (
                                <span>
                                  Actual time changed from{' '}
                                  <span className="font-medium">{change.oldValue || 'Not set'}</span> to{' '}
                                  <span className="font-medium">{change.newValue || 'Not set'}</span>
                                </span>
                              )}
                              {!['status', 'priority', 'assignedTo', 'dueDate', 'estimatedTime', 'actualTime'].includes(change.field) && (
                                <span>
                                  {change.field} changed from <span className="font-medium">{change.oldValue || 'Not set'}</span> to{' '}
                                  <span className="font-medium">{change.newValue || 'Not set'}</span>
                                </span>
                              )}
                            </div>
                            
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BugDetail; 