import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Users, 
  LogOut, 
  Heart, 
  Filter, 
  User, 
  History, 
  LayoutGrid,
  Mail, 
  Clock
} from 'lucide-react';
import { eventsAPI } from '../api/axios'; 

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Navigation State
  const [sortBy, setSortBy] = useState('newest');
  const [activeTab, setActiveTab] = useState('home'); // Options: 'home', 'history', 'profile'

  useEffect(() => {
    const userData = localStorage.getItem('user');
    
    if (!userData) {
      const demoUser = { username: "DemoUser", email: "demo@example.com" };
      setUser(demoUser);
    } else {
      setUser(JSON.parse(userData));
    }
    
    fetchEvents();
  }, [navigate, sortBy]); 

  const fetchEvents = async () => {
    try {
      const response = await eventsAPI.getAll(sortBy);
      // Handle different API response structures
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

  const Interested = async (eventId) => {
    try {
      await eventsAPI.Interested(eventId);
      
      // Optimistic update: Update UI immediately without waiting for re-fetch
      setEvents(prev => prev.map(ev => 
        ev.id === eventId 
        ? { 
            ...ev, 
            is_interested: !ev.is_interested, 
            interested_count: ev.is_interested ? ev.interested_count - 1 : ev.interested_count + 1 
          } 
        : ev
      ));
    } catch (error) {
      console.error('Error toggling interest:', error);
      // Re-fetch events if optimistic update fails
      fetchEvents(); 
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // --- Sub-Components (Views) ---
  const renderProfile = () => (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden animate-in fade-in zoom-in duration-300">
      <div className="bg-indigo-600 px-6 py-8 text-center">
        <div className="w-24 h-24 bg-white rounded-full mx-auto flex items-center justify-center text-indigo-600 text-4xl font-bold mb-4 shadow-inner">
          {user?.username?.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-2xl font-bold text-white">{user?.username}</h2>
        <p className="text-indigo-200">Event Member</p>
      </div>
      <div className="p-8 space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">User Information</h3>
        <div className="grid gap-6">
          <div className="flex items-center gap-4 text-gray-600">
            <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600"><Mail size={20} /></div>
            <div><p className="text-sm text-gray-500">Email</p><p className="font-medium">{user?.email || 'N/A'}</p></div>
          </div>
          <div className="flex items-center gap-4 text-gray-600">
            <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600"><Clock size={20} /></div>
            <div><p className="text-sm text-gray-500">Joined</p><p className="font-medium">{new Date().toLocaleDateString()}</p></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHistory = () => {
    const historyEvents = events.filter(e => e.is_interested);
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <History className="text-indigo-600"/> Event History
        </h2>
        {historyEvents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500">No interested events found.</p></div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {historyEvents.map(event => renderEventCard(event))}
          </div>
        )}
      </div>
    );
  };

  const renderHome = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold text-gray-800">Available Events</h2>
          <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 text-gray-500 pl-2">
                  <Filter size={18} />
                  <span className="text-sm font-medium">Sort By:</span>
              </div>
              <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent py-1 px-2 text-gray-700 font-medium focus:outline-none cursor-pointer"
              >
                  <option value="newest">Newest Added</option>
                  <option value="most_interested">Most Popular</option>
                  <option value="date">Event Date (Soonest)</option>
              </select>
          </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => renderEventCard(event))}
      </div>
      {events.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">No events found.</p>
        </div>
      )}
    </div>
  );

  const renderEventCard = (event) => (
    <div key={event.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition border-t-4 border-indigo-400 flex flex-col h-full">
      <h3 className="text-xl font-bold text-gray-800 mb-3">{event.title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">{event.description}</p>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar size={16} />
          {new Date(event.date).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MapPin size={16} />
          {event.location}
        </div>
        <div className="flex items-center gap-2 text-sm text-indigo-600 font-medium">
          <User size={16} />
          <span>Created by: {event.creator_name || event.username || "Admin"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 pt-1">
          <Users size={16} />
          {event.interested_count} People Interested
        </div>
      </div>

      <button
        onClick={() => Interested(event.id)}
        className={`w-full py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
          event.is_interested
            ? 'bg-green-500 text-white hover:bg-green-600 shadow-md'
            : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
        }`}
      >
        <Heart size={18} fill={event.is_interested ? 'white' : 'none'} />
        {event.is_interested ? 'Interested' : "I'm Interested"}
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-xl text-gray-600 font-medium animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 font-sans">
      
      {/* --- UPDATED NAVBAR --- */}
      <nav className="bg-white shadow-md border-b-4 border-indigo-500 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Logo & Welcome */}
            <div 
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition" 
              onClick={() => setActiveTab('home')}
            >
               <div className="bg-indigo-600 p-2 rounded-lg">
                  <Calendar className="text-white" size={24} />
               </div>
               <div>
                  <h1 className="text-2xl font-bold text-indigo-600 leading-none">Events</h1>
                  <p className="text-xs text-gray-500 mt-1">Hello, {user?.username}</p>
               </div>
            </div>

            {/* Middle Navigation Buttons */}
            <div className="flex items-center bg-gray-100 p-1.5 rounded-xl">
              <button 
                onClick={() => setActiveTab('home')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                  activeTab === 'home' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-gray-500 hover:text-indigo-600'
                }`}
              >
                <LayoutGrid size={12} />
                <span className="hidden sm:inline">Dashboard</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                  activeTab === 'history' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-gray-500 hover:text-indigo-600'
                }`}
              >
                <History size={12} />
                <span className="hidden sm:inline">History</span>
              </button>

              <button 
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                  activeTab === 'profile' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-gray-500 hover:text-indigo-600'
                }`}
              >
                <User size={12} />
                <span className="hidden sm:inline">Profile</span>
              </button>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition text-sm font-medium"
            >
              <LogOut size={12} />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'home' && renderHome()}
        {activeTab === 'history' && renderHistory()}
        {activeTab === 'profile' && renderProfile()}
      </div>
    </div>
  );
};

export default UserDashboard;