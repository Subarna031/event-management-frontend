// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Calendar, MapPin, Users, LogOut, Heart, Filter } from 'lucide-react';
// import { eventsAPI } from '../api/axios';

// const UserDashboard = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [sortBy, setSortBy] = useState('newest');

//   useEffect(() => {
//     const userData = localStorage.getItem('user');
//     if (!userData) {
//       navigate('/login');
//       return;
//     }
//     setUser(JSON.parse(userData));
    
//     fetchEvents();
  
//   }, [navigate, sortBy]); 

//   const fetchEvents = async () => {
//     try {
//       const response = await eventsAPI.getAll(sortBy);
//       const eventData = response.data.results ? response.data.results : response.data;
//       if (Array.isArray(eventData)) {
//           setEvents(eventData);
//       } else {
//           console.error("API did not return an array:", response.data);
//           setEvents([]); 
//       }
//     } catch (error) {
//       console.error('Error fetching events:', error);
//       setEvents([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const Interested = async (eventId) => {
//     try {
//       await eventsAPI.Interested(eventId);
//       fetchEvents();
//     } catch (error) {
//       console.error('Error toggling interest:', error);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('refresh_token');
//     localStorage.removeItem('user');
//     navigate('/login');
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
//         <div className="text-xl text-gray-600">Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
//       <nav className="bg-white shadow-md border-b-4 border-indigo-500">
//         <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
//           <div>
//             <h1 className="text-2xl font-bold text-indigo-600">Events Dashboard</h1>
//             <p className="text-sm text-gray-600">Welcome, {user?.username}</p>
//           </div>
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
//           >
//             <LogOut size={20} />
//             Logout
//           </button>
//         </div>
//       </nav>

//       <div className="max-w-7xl mx-auto px-4 py-8">
      
//         <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
//             <h2 className="text-3xl font-bold text-gray-800">Available Events</h2>
            
//             <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
//                 <div className="flex items-center gap-2 text-gray-500 pl-2">
//                     <Filter size={18} />
//                     <span className="text-sm font-medium">Sort By:</span>
//                 </div>
//                 <select 
//                     value={sortBy}
//                     onChange={(e) => setSortBy(e.target.value)}
//                     className="bg-transparent py-1 px-2 text-gray-700 font-medium focus:outline-none cursor-pointer"
//                 >
//                     <option value="newest">Newest Added</option>
//                     <option value="most_interested">Most Popular</option>
//                     <option value="date">Event Date (Soonest)</option>
//                 </select>
//             </div>
//         </div>
        
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {events.map((event) => (
//             <div key={event.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition border-t-4 border-indigo-400">
//               <h3 className="text-xl font-bold text-gray-800 mb-3">{event.title}</h3>
//               <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
              
//               <div className="space-y-2 mb-4">
//                 <div className="flex items-center gap-2 text-sm text-gray-500">
//                   <Calendar size={16} />
//                   {new Date(event.date).toLocaleDateString()}
//                 </div>
//                 <div className="flex items-center gap-2 text-sm text-gray-500">
//                   <MapPin size={16} />
//                   {event.location}
//                 </div>
//                 <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600">
//                   <Users size={16} />
//                   {event.interested_count} People Interested
//                 </div>
//               </div>

//               <button
//                 onClick={() => Interested(event.id)}
//                 className={`w-full py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
//                   event.is_interested
//                     ? 'bg-green-500 text-white hover:bg-green-600 shadow-md'
//                     : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
//                 }`}
//               >
//                 <Heart size={18} fill={event.is_interested ? 'white' : 'none'} />
//                 {event.is_interested ? 'Interested' : "I'm Interested"}
//               </button>
//             </div>
//           ))}
//         </div>

//         {events.length === 0 && (
//           <div className="text-center py-12 bg-white rounded-lg shadow">
//             <p className="text-gray-500 text-lg">No events found.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// 1. Added 'User' to imports for the admin icon
import { Calendar, MapPin, Users, LogOut, Heart, Filter, User } from 'lucide-react';
import { eventsAPI } from '../api/axios';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));
    
    fetchEvents();
  
  }, [navigate, sortBy]); 

  const fetchEvents = async () => {
    try {
      const response = await eventsAPI.getAll(sortBy);
      const eventData = response.data.results ? response.data.results : response.data;
      if (Array.isArray(eventData)) {
          setEvents(eventData);
      } else {
          console.error("API did not return an array:", response.data);
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
      fetchEvents();
    } catch (error) {
      console.error('Error toggling interest:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <nav className="bg-white shadow-md border-b-4 border-indigo-500">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-indigo-600">Events Dashboard</h1>
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
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition border-t-4 border-indigo-400">
              <h3 className="text-xl font-bold text-gray-800 mb-3">{event.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar size={16} />
                  {new Date(event.date).toLocaleDateString()}
                </div>
                
                {/* Location Address */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin size={16} />
                  {event.location}
                </div>

                {/* --- NEW: Admin Name Section --- */}
                <div className="flex items-center gap-2 text-sm text-indigo-600 font-medium">
                  <User size={16} />
                  <span>
                     {/* Checks for creator_name, then username, then falls back to 'Admin' */}
                     Created by: {event.creator_name || event.username || "Admin"} 
                  </span>
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
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No events found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;