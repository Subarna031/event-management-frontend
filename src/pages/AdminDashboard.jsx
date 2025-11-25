import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Users, 
  LogOut, 
  Plus, 
  Trash2, 
  Mail, 
  Send,
  BarChart3,
  LayoutDashboard,
  Heart,
  TrendingUp,
  Loader2
} from 'lucide-react';

import { eventsAPI } from '../api/axios'; 
import AdminAnalytics from './AdminAnalytics';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Navigation State
  const [activeTab, setActiveTab] = useState('events'); // 'events' or 'analytics'

  // Events Management State
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [eventForm, setEventForm] = useState({ title: '', description: '', date: '', location: '' });
  
  // Modal & Email State
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [interestedUsers, setInterestedUsers] = useState([]);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    
    if (!userData) {
        // For preview: Mock login
        setUser({ id: 1, username: "AdminUser", user_type: 'admin' });
        fetchEvents({ id: 1 });
    } else {
        const parsedUser = JSON.parse(userData);
        if (parsedUser.user_type !== 'admin') {
            navigate('/user/dashboard');
            return;
        }
        setUser(parsedUser);
        fetchEvents(parsedUser);
    }
  }, [navigate]);

  const fetchEvents = async (currentUser) => {
    try {
      const response = await eventsAPI.getAll();
      const eventData = response.data.results ? response.data.results : response.data;
      
      if (Array.isArray(eventData) && currentUser) {
        const myFilteredEvents = eventData.filter(event => {
            let eventCreatorId = event.created_by || event.created_by_id;
            if (typeof eventCreatorId === 'object' && eventCreatorId !== null) {
                eventCreatorId = eventCreatorId.id;
            }
            return String(eventCreatorId) === String(currentUser.id);
        });

        setEvents(myFilteredEvents);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]); 
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    try {
      await eventsAPI.create(eventForm);
      setShowCreateEvent(false);
      setEventForm({ title: '', description: '', date: '', location: '' });
      fetchEvents(user);
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event');
    }
  };

  const deleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await eventsAPI.delete(eventId);
      fetchEvents(user);
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    }
  };

  const viewInterestedUsers = async (eventId) => {
    try {
      setEmailSubject('');
      setEmailMessage('');
      const response = await eventsAPI.getInterestedUsers(eventId);
      setInterestedUsers(response.data);
      setSelectedEvent(eventId);
    } catch (error) {
      console.error('Error fetching interested users:', error);
    }
  };

  const handleSendNotification = async () => {
    if (!emailSubject || !emailMessage) {
        alert("Please enter both a subject and a message.");
        return;
    }
    setSendingEmail(true);
    try {
        await eventsAPI.sendNotification(selectedEvent, {
            subject: emailSubject,
            message: emailMessage
        });
        alert(`Successfully sent emails!`);
        setEmailSubject('');
        setEmailMessage('');
    } catch (error) {
        console.error("Error sending emails", error);
        alert("Failed to send emails.");
    } finally {
        setSendingEmail(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleChange = (e) => {
    setEventForm({ ...eventForm, [e.target.name]: e.target.value });
  };

  const renderEventManagement = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-3xl font-bold text-gray-800">Manage Events</h2>
          <button onClick={() => setShowCreateEvent(!showCreateEvent)} className="w-full md:w-auto flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition shadow-lg">
            <Plus size={20} /> Create New Event
          </button>
        </div>

        {/* Create Event Form */}
        {showCreateEvent && (
          <div className="bg-white rounded-lg shadow-xl p-6 mb-6 border-l-4 border-purple-500 animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold mb-4 text-purple-600">Create New Event</h2>
            <div className="space-y-4">
              <input name="title" value={eventForm.title} onChange={handleChange} placeholder="Event Title" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition" />
              <textarea name="description" value={eventForm.description} onChange={handleChange} placeholder="Description" rows="3" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="date" value={eventForm.date} onChange={handleChange} type="date" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition" />
                <input name="location" value={eventForm.location} onChange={handleChange} placeholder="Location" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition" />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button onClick={() => setShowCreateEvent(false)} className="bg-gray-100 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-200 font-medium transition">Cancel</button>
                <button onClick={handleCreateEvent} className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 font-medium transition">Create Event</button>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events?.length > 0 ? (
            events.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition border-t-4 border-purple-400 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800 flex-1">{event.title}</h3>
                  <button onClick={() => deleteEvent(event.id)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded transition">
                    <Trash2 size={20} />
                  </button>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">{event.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500"><Calendar size={16} />{new Date(event.date).toLocaleDateString()}</div>
                  <div className="flex items-center gap-2 text-sm text-gray-500"><MapPin size={16} />{event.location}</div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-purple-600"><Users size={16} />{event.interested_count} People Interested</div>
                </div>
                <button onClick={() => viewInterestedUsers(event.id)} className="w-full bg-purple-50 text-purple-700 py-3 rounded-lg hover:bg-purple-100 transition font-medium text-sm flex items-center justify-center gap-2">
                  <Mail size={16} /> Manage & Notify
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 bg-white rounded-lg shadow border-2 border-dashed border-gray-200">
                <Calendar className="mx-auto text-gray-300 mb-2" size={48} />
                <p className="text-gray-500 text-lg">You haven't created any events yet.</p>
                <button onClick={() => setShowCreateEvent(true)} className="mt-2 text-purple-600 font-medium hover:underline">Create your first event</button>
            </div>
          )}
        </div>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center">
        <div className="text-purple-600 text-xl font-medium animate-pulse">Loading Admin Dashboard...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 font-sans">
      <nav className="bg-white shadow-md border-b-4 border-purple-500 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Logo */}
            <div>
              <h1 className="text-2xl font-bold text-purple-600 flex items-center gap-2">
                <LayoutDashboard /> Admin Portal
              </h1>
              <p className="text-xs text-gray-500 ml-8">Logged in as {user?.username}</p>
            </div>

            {/* Middle Nav */}
            <div className="flex items-center bg-gray-100 p-1 rounded-lg">
                <button 
                    onClick={() => setActiveTab('events')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-md transition-all font-medium ${
                        activeTab === 'events' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-purple-600'
                    }`}
                >
                    <Calendar size={18} /> Events
                </button>
                <button 
                    onClick={() => setActiveTab('analytics')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-md transition-all font-medium ${
                        activeTab === 'analytics' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-purple-600'
                    }`}
                >
                    <BarChart3 size={18} /> Analytics
                </button>
            </div>

            {/* Logout */}
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition font-medium text-sm">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'events' && renderEventManagement()}
        
        {/* Render Analytics */}
        {activeTab === 'analytics' && <AdminAnalytics />}
        
        {/* Modal for Interested Users */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                  <h3 className="text-xl font-bold mb-4 text-purple-800 flex items-center gap-2">
                      <Users size={20} /> Interested Users
                  </h3>
                  {interestedUsers.length > 0 ? (
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                      {interestedUsers.map((interest) => (
                        <div key={interest.id} className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400 hover:bg-purple-100 transition">
                          <p className="font-bold text-gray-800">{interest.user.username}</p>
                          <p className="text-sm text-gray-600">{interest.user.email}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <Users className="mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500">No users interested yet.</p>
                    </div>
                  )}
              </div>
              <div className="flex-1 border-l pl-0 md:pl-6 border-gray-200">
                <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                    <Send size={20} className="text-blue-600" /> Send Update
                </h3>
                <div className="space-y-4">
                    <input 
                        type="text" 
                        placeholder="Subject (e.g., Change of Venue)"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                    />
                    <textarea 
                        rows="4"
                        placeholder="Message content..."
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                        value={emailMessage}
                        onChange={(e) => setEmailMessage(e.target.value)}
                    />
                    <div className="flex gap-3 pt-2">
                        <button onClick={() => setSelectedEvent(null)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition">
                            Close
                        </button>
                        <button 
                            onClick={handleSendNotification}
                            disabled={sendingEmail || interestedUsers.length === 0}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-white font-medium transition shadow-md ${
                                sendingEmail || interestedUsers.length === 0 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {sendingEmail ? 'Sending...' : <><Send size={16} /> Send Email</>}
                        </button>
                    </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;