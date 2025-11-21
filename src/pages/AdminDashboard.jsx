import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, LogOut, Plus, Trash2 } from 'lucide-react';
import { eventsAPI } from '../api/axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [eventForm, setEventForm] = useState({ title: '', description: '', date: '', location: '' });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [interestedUsers, setInterestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.user_type !== 'admin') {
      navigate('/user/dashboard');
      return;
    }
    setUser(parsedUser);
    fetchEvents();
  }, [navigate]);

  const fetchEvents = async () => {
    try {
      const response = await eventsAPI.getAll();
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    try {
      await eventsAPI.create(eventForm);
      setShowCreateEvent(false);
      setEventForm({ title: '', description: '', date: '', location: '' });
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event');
    }
  };

  const deleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await eventsAPI.delete(eventId);
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    }
  };

  const viewInterestedUsers = async (eventId) => {
    try {
      const response = await eventsAPI.getInterestedUsers(eventId);
      setInterestedUsers(response.data);
      setSelectedEvent(eventId);
    } catch (error) {
      console.error('Error fetching interested users:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleChange = (e) => {
    setEventForm({
      ...eventForm,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <nav className="bg-white shadow-md border-b-4 border-purple-500">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-purple-600">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome, {user?.username}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800">Manage Events</h2>
          <button
            onClick={() => setShowCreateEvent(!showCreateEvent)}
            className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition shadow-lg"
          >
            <Plus size={20} />
            Create New Event
          </button>
        </div>

        {showCreateEvent && (
          <div className="bg-white rounded-lg shadow-xl p-6 mb-6 border-l-4 border-purple-500">
            <h2 className="text-xl font-bold mb-4 text-purple-600">Create New Event</h2>
            <div className="space-y-4">
              <input
                name="title"
                value={eventForm.title}
                onChange={handleChange}
                placeholder="Event Title"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <textarea
                name="description"
                value={eventForm.description}
                onChange={handleChange}
                placeholder="Description"
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <input
                name="date"
                value={eventForm.date}
                onChange={handleChange}
                type="date"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <input
                name="location"
                value={eventForm.location}
                onChange={handleChange}
                placeholder="Location"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCreateEvent}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 font-medium"
                >
                  Create Event
                </button>
                <button
                  onClick={() => setShowCreateEvent(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition border-t-4 border-purple-400">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex-1">{event.title}</h3>
                <button
                  onClick={() => deleteEvent(event.id)}
                  className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar size={16} />
                  {new Date(event.date).toLocaleString()}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin size={16} />
                  {event.location}
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-purple-600">
                  <Users size={16} />
                  {event.interested_count} People Interested
                </div>
              </div>

              <button
                onClick={() => viewInterestedUsers(event.id)}
                className="w-full bg-purple-100 text-purple-700 py-3 rounded-lg hover:bg-purple-200 transition font-medium"
              >
                View Interested Users
              </button>
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No events created yet. Create your first event!</p>
          </div>
        )}

        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-96 overflow-y-auto shadow-2xl">
              <h3 className="text-2xl font-bold mb-4 text-purple-600">Interested Users</h3>
              {interestedUsers.length > 0 ? (
                <div className="space-y-3">
                  {interestedUsers.map((interest) => (
                    <div key={interest.id} className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                      <p className="font-bold text-gray-800">{interest.user.username}</p>
                      <p className="text-sm text-gray-600">{interest.user.email}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Registered: {new Date(interest.interested_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No users interested yet</p>
              )}
              <button
                onClick={() => {
                  setSelectedEvent(null);
                  setInterestedUsers([]);
                }}
                className="w-full mt-4 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;