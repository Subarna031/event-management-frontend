import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, LogOut, Plus, Trash2, Mail, Send } from 'lucide-react';
import { eventsAPI } from '../api/axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [eventForm, setEventForm] = useState({ title: '', description: '', date: '', location: '' });
  
  // State for Modal and Emailing
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [interestedUsers, setInterestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New State for Email Form
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

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
      const eventData = response.data.results ? response.data.results : response.data;
      if (Array.isArray(eventData)) {
          setEvents(eventData);
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
      // Reset email form when opening modal
      setEmailSubject('');
      setEmailMessage('');
      const response = await eventsAPI.getInterestedUsers(eventId);
      setInterestedUsers(response.data);
      setSelectedEvent(eventId);
    } catch (error) {
      console.error('Error fetching interested users:', error);
    }
  };

  // --- NEW FUNCTION TO SEND EMAILS ---
  const handleSendNotification = async () => {
    if (!emailSubject || !emailMessage) {
        alert("Please enter both a subject and a message.");
        return;
    }
    
    setSendingEmail(true);
    try {
        const response = await eventsAPI.sendNotification(selectedEvent, {
            subject: emailSubject,
            message: emailMessage
        });
        alert(`Successfully sent emails to ${response.data.count} users!`);
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <nav className="bg-white shadow-md border-b-4 border-purple-500">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-purple-600">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome, {user?.username}</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800">Manage Events</h2>
          <button onClick={() => setShowCreateEvent(!showCreateEvent)} className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition shadow-lg">
            <Plus size={20} /> Create New Event
          </button>
        </div>

        {/* Create Event Form - (Kept same as before) */}
        {showCreateEvent && (
          <div className="bg-white rounded-lg shadow-xl p-6 mb-6 border-l-4 border-purple-500">
            <h2 className="text-xl font-bold mb-4 text-purple-600">Create New Event</h2>
            <div className="space-y-4">
              <input name="title" value={eventForm.title} onChange={handleChange} placeholder="Event Title" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
              <textarea name="description" value={eventForm.description} onChange={handleChange} placeholder="Description" rows="4" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
              <input name="date" value={eventForm.date} onChange={handleChange} type="date" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
              <input name="location" value={eventForm.location} onChange={handleChange} placeholder="Location" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
              <div className="flex gap-2">
                <button onClick={handleCreateEvent} className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 font-medium">Create Event</button>
                <button onClick={() => setShowCreateEvent(false)} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 font-medium">Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events?.length > 0 ? (
            events.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition border-t-4 border-purple-400">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800 flex-1">{event.title}</h3>
                  <button onClick={() => deleteEvent(event.id)} className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded">
                    <Trash2 size={20} />
                  </button>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500"><Calendar size={16} />{new Date(event.date).toLocaleDateString()}</div>
                  <div className="flex items-center gap-2 text-sm text-gray-500"><MapPin size={16} />{event.location}</div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-purple-600"><Users size={16} />{event.interested_count} People Interested</div>
                </div>
                <button onClick={() => viewInterestedUsers(event.id)} className="w-full bg-purple-100 text-purple-700 py-3 rounded-lg hover:bg-purple-200 transition font-medium">
                  View Interested Users / Send Email
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500 text-lg">No events created yet.</p></div>
          )}
        </div>

        {/* --- MODAL WITH EMAIL FEATURE --- */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row gap-6">
              
              {/* Left Side: List of Users */}
              <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-4 text-purple-600">Interested Users</h3>
                  {interestedUsers.length > 0 ? (
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                      {interestedUsers.map((interest) => (
                        <div key={interest.id} className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                          <p className="font-bold text-gray-800">{interest.user.username}</p>
                          <p className="text-sm text-gray-600">{interest.user.email}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 py-4">No users interested yet.</p>
                  )}
              </div>

              {/* Right Side: Email Form */}
              <div className="flex-1 border-l pl-0 md:pl-6 border-gray-200">
                <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                    <Mail size={20} /> Send Update
                </h3>
                <div className="space-y-3">
                    <input 
                        type="text" 
                        placeholder="Subject (e.g., Change of Venue)"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500 outline-none"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                    />
                    <textarea 
                        rows="4"
                        placeholder="Message content..."
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500 outline-none"
                        value={emailMessage}
                        onChange={(e) => setEmailMessage(e.target.value)}
                    />
                    <div className="flex gap-2">
                        <button 
                            onClick={handleSendNotification}
                            disabled={sendingEmail || interestedUsers.length === 0}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded text-white font-medium ${
                                sendingEmail || interestedUsers.length === 0 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-green-600 hover:bg-green-700'
                            }`}
                        >
                            {sendingEmail ? 'Sending...' : <><Send size={16} /> Send Email</>}
                        </button>
                        <button onClick={() => setSelectedEvent(null)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                            Close
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        * This will send a personalized email to all {interestedUsers.length} interested users.
                    </p>
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