// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Calendar, MapPin, Users, LogOut, Heart, Filter, User, History, 
//   LayoutGrid, Mail, Clock, AlertCircle, Timer, Camera, MessageSquare, X
// } from "lucide-react";

// import { eventsAPI } from "../api/axios";

// // --- Countdown Timer Component ---
// const CountdownTimer = ({ targetDate }) => {
//   const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
//   function calculateTimeLeft() {
//     const difference = +new Date(targetDate) - +new Date();
//     let timeLeft = {};
//     if (difference > 0) {
//       timeLeft = {
//         days: Math.floor(difference / (1000 * 60 * 60 * 24)),
//         hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
//         minutes: Math.floor((difference / 1000 / 60) % 60),
//         seconds: Math.floor((difference / 1000) % 60),
//       };
//     }
//     return timeLeft;
//   }
//   useEffect(() => {
//     const timer = setTimeout(() => { setTimeLeft(calculateTimeLeft()); }, 1000);
//     return () => clearTimeout(timer);
//   });
//   const timerComponents = [];
//   Object.keys(timeLeft).forEach((interval) => {
//     if (!timeLeft[interval] && timeLeft[interval] !== 0) return;
//     timerComponents.push(
//       <span key={interval} className="font-mono font-bold text-indigo-600">
//         {timeLeft[interval]}<span className="text-xs font-normal text-gray-500 mr-1">{interval.charAt(0)}</span>
//       </span>
//     );
//   });
//   return timerComponents.length === 0 ? null : (
//     <div className="flex items-center gap-1 text-sm bg-indigo-50 px-2 py-1 rounded-md">
//       <Timer size={14} className="text-indigo-600" /><span className="text-gray-600 text-xs">Starts in:</span>
//       {timerComponents.slice(0, 3)}
//     </div>
//   );
// };

// // --- Post Experience Modal ---
// const PostExperienceModal = ({ event, onClose, onSubmit }) => {
//     const [text, setText] = useState("");
//     const [image, setImage] = useState(null);
//     const [uploading, setUploading] = useState(false);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setUploading(true);

//         // 1. Create FormData to handle image upload
//         const formData = new FormData();
//         formData.append('event', event.id);
//         formData.append('description', text);
//         if (image) {
//             formData.append('image', image);
//         }

//         try {
//             // 2. Call the Real API
//             await eventsAPI.postExperience(formData);
            
//             // 3. Update Parent State
//             onSubmit(event.id);
//             onClose();
//         } catch (error) {
//             console.error("Failed to post experience", error);
//             alert("Failed to share experience. Please try again.");
//         } finally {
//             setUploading(false);
//         }
//     };

//     return (
//         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
//             <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
//                 <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 flex justify-between items-center text-white">
//                     <h3 className="text-xl font-bold flex items-center gap-2"><Camera size={24} /> Post Experience</h3>
//                     <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full"><X size={20} /></button>
//                 </div>
//                 <div className="p-6">
//                     <p className="text-gray-600 mb-4">How was <strong>{event.title}</strong>? Share your memories.</p>
//                     <textarea 
//                         className="w-full border rounded-lg p-3 mb-4 focus:ring-2 focus:ring-indigo-500 outline-none" 
//                         rows="4" 
//                         placeholder="It was amazing because..."
//                         value={text}
//                         onChange={(e) => setText(e.target.value)}
//                     />
//                     <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer relative">
//                         <input 
//                             type="file" 
//                             accept="image/*" 
//                             className="absolute inset-0 opacity-0 cursor-pointer"
//                             onChange={(e) => setImage(e.target.files[0])}
//                         />
//                         {image ? (
//                             <p className="text-green-600 font-medium">{image.name}</p>
//                         ) : (
//                             <div className="text-gray-500">
//                                 <Camera className="mx-auto mb-2" />
//                                 <span className="text-sm">Click to upload a photo</span>
//                             </div>
//                         )}
//                     </div>
//                     <button 
//                         onClick={handleSubmit} 
//                         disabled={uploading || !text}
//                         className={`w-full mt-6 py-3 rounded-lg font-bold text-white shadow-lg transition ${uploading || !text ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-xl'}`}
//                     >
//                         {uploading ? 'Posting...' : 'Share Experience'}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const UserDashboard = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [sortBy, setSortBy] = useState("newest");
//   const [activeTab, setActiveTab] = useState("home"); 

//   // Modal State
//   const [showExperienceModal, setShowExperienceModal] = useState(false);
//   const [selectedEventForPost, setSelectedEventForPost] = useState(null);

//   useEffect(() => {
//     const userData = localStorage.getItem("user");
//     if (!userData) {
//       setUser({ username: "DemoUser", email: "demo@example.com" });
//     } else {
//       setUser(JSON.parse(userData));
//     }
//     fetchEvents();
//   }, [navigate, sortBy]);

//   const fetchEvents = async () => {
//     try {
//       const response = await eventsAPI.getAll(sortBy);
//       const eventData = response.data.results ? response.data.results : response.data;
//       if (Array.isArray(eventData)) setEvents(eventData);
//       else setEvents([]);
//     } catch (error) {
//       console.error("Error fetching events:", error);
//       setEvents([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const Interested = async (eventId) => {
//     try {
//       await eventsAPI.Interested(eventId);
//       setEvents((prev) => prev.map((ev) => ev.id === eventId ? { ...ev, is_interested: !ev.is_interested, interested_count: ev.is_interested ? ev.interested_count - 1 : ev.interested_count + 1 } : ev));
//     } catch (error) {
//       console.error("Error toggling interest:", error);
//       fetchEvents();
//     }
//   };

//   // Callback when a user successfully posts an experience
//   const handlePostSuccess = (eventId) => {
//       // Optimistically update the UI so the button changes to "Experience Shared"
//       setEvents(prev => prev.map(e => e.id === eventId ? {...e, has_posted_experience: true} : e));
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("access_token");
//     localStorage.removeItem("refresh_token");
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   const isDateConflict = (targetEvent) => {
//     if (targetEvent.is_interested) return false;
//     const targetDate = new Date(targetEvent.date).toDateString();
//     const conflictingEvent = events.find((ev) => ev.id !== targetEvent.id && ev.is_interested && new Date(ev.date).toDateString() === targetDate);
//     return !!conflictingEvent;
//   };

//   // CHECK IF EVENT IS COMPLETED
//   const isEventCompleted = (event) => {
//       const endDate = event.end_date ? new Date(event.end_date) : new Date(event.date);
//       return new Date() > endDate;
//   };

//   const formatDateTime = (dateString) => {
//     if (!dateString) return { date: '', time: '' };
//     const date = new Date(dateString);
//     return {
//       date: date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
//       time: date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }),
//     };
//   };

//   const renderEventCard = (event) => {
//     const conflict = isDateConflict(event);
//     const start = formatDateTime(event.date);
//     const end = event.end_date ? formatDateTime(event.end_date) : null;
//     const completed = isEventCompleted(event);

//     return (
//       <div key={event.id} className={`bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition border-t-4 flex flex-col h-full ${conflict ? "border-gray-400 opacity-90" : completed ? "border-green-500" : "border-indigo-400"}`}>
//         <div className="flex justify-between items-start mb-2">
//             <h3 className="text-xl font-bold text-gray-800 line-clamp-1">{event.title}</h3>
//             {/* Show Timer if not completed, else show 'Completed' badge */}
//             {!completed ? <CountdownTimer targetDate={event.date} /> : <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold uppercase border border-green-200">Completed</span>}
//         </div>
        
//         <p className="text-gray-600 mb-4 line-clamp-3 flex-grow text-sm">{event.description}</p>

//         <div className="space-y-3 mb-5 border-b border-gray-100 pb-4">
          
//           {/* Start Date */}
//           <div className={`flex items-center gap-2 text-sm ${conflict ? "text-red-500 font-bold" : "text-gray-700"}`}>
//             <Calendar size={16} className="text-indigo-500" />
//             <span className="font-semibold">Start:</span> {start.date} <span className="text-gray-400">|</span> {start.time}
//             {conflict && <span className="text-xs bg-red-100 px-2 py-0.5 rounded-full ml-auto">Conflict</span>}
//           </div>

//           {/* End Date */}
//           {end && (
//              <div className="flex items-center gap-2 text-sm text-gray-700">
//                <Clock size={16} className="text-red-400" />
//                <span className="font-semibold">Ends:</span> {end.date} <span className="text-gray-400">|</span> {end.time}
//              </div>
//           )}

//           <div className="flex items-center gap-2 text-sm text-gray-500"><MapPin size={16} />{event.location}</div>
          
//           <div className="flex justify-between items-center mt-2">
//             <div className="flex items-center gap-2 text-sm text-indigo-600 font-medium"><User size={16} /><span>{event.creator_name || "Admin"}</span></div>
//             <div className="flex items-center gap-2 text-sm font-semibold text-gray-500"><Users size={16} />{event.interested_count} Interested</div>
//           </div>
//         </div>

//         {/* --- DYNAMIC BUTTON LOGIC START --- */}
//         {completed ? (
//             // CASE 1: Event is Over
//             event.is_interested ? (
//                 // CASE 1A: User was Interested (They attended)
//                 event.has_posted_experience ? (
//                       // Already posted
//                       <button disabled className="w-full py-3 rounded-lg font-medium bg-green-50 text-green-600 border border-green-200 flex items-center justify-center gap-2 cursor-default">
//                          <MessageSquare size={18} /> Experience Shared
//                       </button>
//                 ) : (
//                     // Hasn't posted yet -> Show Button to open Modal
//                     <button 
//                         onClick={() => { setSelectedEventForPost(event); setShowExperienceModal(true); }}
//                         className="w-full py-3 rounded-lg font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg transition flex items-center justify-center gap-2"
//                     >
//                         <Camera size={18} /> Post Experience
//                     </button>
//                 )
//             ) : (
//                 // CASE 1B: User was NOT interested (Missed event)
//                 <button disabled className="w-full py-3 rounded-lg font-bold bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed flex items-center justify-center gap-2">
//                     <Clock size={18} /> Event Ended
//                 </button>
//             )
//         ) : (
//             // CASE 2: Event is Active/Future
//             <button
//             onClick={() => !conflict && Interested(event.id)}
//             disabled={conflict}
//             className={`w-full py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 
//                 ${event.is_interested ? "bg-green-500 text-white hover:bg-green-600 shadow-md" : conflict ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"}`}
//             >
//             {conflict ? <><AlertCircle size={18} /> Date Conflict</> : <><Heart size={18} fill={event.is_interested ? "white" : "none"} />{event.is_interested ? "Interested" : "I'm Interested"}</>}
//             </button>
//         )}
//         {/* --- DYNAMIC BUTTON LOGIC END --- */}
//       </div>
//     );
//   };

//   const renderProfile = () => (
//     <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden animate-in fade-in zoom-in duration-300">
//       <div className="bg-indigo-600 px-6 py-8 text-center">
//         <div className="w-24 h-24 bg-white rounded-full mx-auto flex items-center justify-center text-indigo-600 text-4xl font-bold mb-4 shadow-inner">{user?.username?.charAt(0).toUpperCase()}</div>
//         <h2 className="text-2xl font-bold text-white">{user?.username}</h2>
//         <p className="text-indigo-200">Event Member</p>
//       </div>
//       <div className="p-8 space-y-6">
//         <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">User Information</h3>
//         <div className="grid gap-6">
//           <div className="flex items-center gap-4 text-gray-600"><div className="p-3 bg-indigo-50 rounded-lg text-indigo-600"><Mail size={20} /></div><div><p className="text-sm text-gray-500">Email</p><p className="font-medium">{user?.email || "N/A"}</p></div></div>
//           <div className="flex items-center gap-4 text-gray-600"><div className="p-3 bg-indigo-50 rounded-lg text-indigo-600"><Clock size={20} /></div><div><p className="text-sm text-gray-500">Joined</p><p className="font-medium">{new Date().toLocaleDateString()}</p></div></div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderHistory = () => {
//     const historyEvents = events.filter((e) => e.is_interested);
//     return (
//       <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
//         <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2"><History className="text-indigo-600" /> Event History</h2>
//         {historyEvents.length === 0 ? (<div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500">No interested events found.</p></div>) : (<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{historyEvents.map((event) => renderEventCard(event))}</div>)}
//       </div>
//     );
//   };

//   const renderHome = () => (
//     <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
//       <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
//         <h2 className="text-3xl font-bold text-gray-800">Available Events</h2>
//         <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
//           <div className="flex items-center gap-2 text-gray-500 pl-2"><Filter size={18} /><span className="text-sm font-medium">Sort By:</span></div>
//           <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent py-1 px-2 text-gray-700 font-medium focus:outline-none cursor-pointer">
//             <option value="newest">Newest Added</option>
//             <option value="most_interested">Most Popular</option>
//             <option value="date">Event Date (Soonest)</option>
//           </select>
//         </div>
//       </div>
//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{events.map((event) => renderEventCard(event))}</div>
//       {events.length === 0 && (<div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500 text-lg">No events found.</p></div>)}
//     </div>
//   );

//   if (loading) return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center"><div className="text-xl text-gray-600 font-medium animate-pulse">Loading...</div></div>;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 font-sans">
//       <nav className="bg-white shadow-md border-b-4 border-indigo-500 sticky top-0 z-10">
//         <div className="max-w-7xl mx-auto px-4 py-3">
//           <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//             <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition" onClick={() => setActiveTab("home")}>
//               <div className="bg-indigo-600 p-2 rounded-lg"><Calendar className="text-white" size={24} /></div>
//               <div><h1 className="text-2xl font-bold text-indigo-600 leading-none">Events</h1><p className="text-xs text-gray-500 mt-1">Hello, {user?.username}</p></div>
//             </div>
//             <div className="flex items-center bg-gray-100 p-1.5 rounded-xl">
//               <button onClick={() => setActiveTab("home")} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${activeTab === "home" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-indigo-600"}`}><LayoutGrid size={18} /><span className="hidden sm:inline">Dashboard</span></button>
//               <button onClick={() => setActiveTab("history")} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${activeTab === "history" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-indigo-600"}`}><History size={18} /><span className="hidden sm:inline">History</span></button>
//               <button onClick={() => setActiveTab("profile")} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${activeTab === "profile" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-indigo-600"}`}><User size={18} /><span className="hidden sm:inline">Profile</span></button>
//             </div>
//             <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition text-sm font-medium"><LogOut size={20} /><span className="hidden md:inline">Logout</span></button>
//           </div>
//         </div>
//       </nav>
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         {activeTab === "home" && renderHome()}
//         {activeTab === "history" && renderHistory()}
//         {activeTab === "profile" && renderProfile()}
//       </div>
      
//       {/* Experience Modal Component */}
//       {showExperienceModal && selectedEventForPost && (
//           <PostExperienceModal 
//             event={selectedEventForPost} 
//             onClose={() => setShowExperienceModal(false)}
//             onSubmit={handlePostSuccess}
//           />
//       )}
//     </div>
//   );
// };

// export default UserDashboard;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar, MapPin, Users, LogOut, Heart, Filter, User, History, 
  LayoutGrid, Mail, Clock, AlertCircle, Timer, Camera, MessageSquare, X
} from "lucide-react";

import { eventsAPI } from "../api/axios";

// --- Countdown Timer Component ---
const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  }

  useEffect(() => {
    const timer = setTimeout(() => { setTimeLeft(calculateTimeLeft()); }, 1000);
    return () => clearTimeout(timer);
  });

  const timerComponents = [];
  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval] && timeLeft[interval] !== 0) return;
    timerComponents.push(
      <span key={interval} className="font-mono font-bold text-indigo-600">
        {timeLeft[interval]}<span className="text-xs font-normal text-gray-500 mr-1">{interval.charAt(0)}</span>
      </span>
    );
  });

  return timerComponents.length === 0 ? null : (
    <div className="flex items-center gap-1 text-sm bg-indigo-50 px-2 py-1 rounded-md">
      <Timer size={14} className="text-indigo-600" /><span className="text-gray-600 text-xs">Starts in:</span>
      {timerComponents.slice(0, 3)}
    </div>
  );
};

// --- Post Experience Modal ---
const PostExperienceModal = ({ event, onClose, onSubmit }) => {
    const [text, setText] = useState("");
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        const formData = new FormData();
        formData.append('event', event.id);
        formData.append('description', text);
        if (image) {
            formData.append('image', image);
        }

        try {
            await eventsAPI.postExperience(formData);
            onSubmit(event.id); // Notify parent to update UI
            onClose();
        } catch (error) {
            console.error("Failed to post experience", error);
            alert("Failed to share experience. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 flex justify-between items-center text-white">
                    <h3 className="text-xl font-bold flex items-center gap-2"><Camera size={24} /> Post Experience</h3>
                    <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full"><X size={20} /></button>
                </div>
                <div className="p-6">
                    <p className="text-gray-600 mb-4">How was <strong>{event.title}</strong>? Share your memories.</p>
                    <textarea 
                        className="w-full border rounded-lg p-3 mb-4 focus:ring-2 focus:ring-indigo-500 outline-none" 
                        rows="4" 
                        placeholder="It was amazing because..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer relative">
                        <input 
                            type="file" 
                            accept="image/*" 
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                        {image ? (
                            <p className="text-green-600 font-medium">{image.name}</p>
                        ) : (
                            <div className="text-gray-500">
                                <Camera className="mx-auto mb-2" />
                                <span className="text-sm">Click to upload a photo</span>
                            </div>
                        )}
                    </div>
                    <button 
                        onClick={handleSubmit} 
                        disabled={uploading || !text}
                        className={`w-full mt-6 py-3 rounded-lg font-bold text-white shadow-lg transition ${uploading || !text ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-xl'}`}
                    >
                        {uploading ? 'Posting...' : 'Share Experience'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main Dashboard Component ---
const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [activeTab, setActiveTab] = useState("home"); 

  // Modal State
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [selectedEventForPost, setSelectedEventForPost] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      setUser({ username: "DemoUser", email: "demo@example.com" });
    } else {
      setUser(JSON.parse(userData));
    }
    fetchEvents();
  }, [navigate, sortBy]);

  const fetchEvents = async () => {
    try {
      const response = await eventsAPI.getAll(sortBy);
      const eventData = response.data.results ? response.data.results : response.data;
      if (Array.isArray(eventData)) setEvents(eventData);
      else setEvents([]);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const Interested = async (eventId) => {
    try {
      await eventsAPI.Interested(eventId);
      setEvents((prev) => prev.map((ev) => ev.id === eventId ? { ...ev, is_interested: !ev.is_interested, interested_count: ev.is_interested ? ev.interested_count - 1 : ev.interested_count + 1 } : ev));
    } catch (error) {
      console.error("Error toggling interest:", error);
      fetchEvents();
    }
  };

  const handlePostSuccess = (eventId) => {
      // Optimistically update UI to show user has posted
      setEvents(prev => prev.map(e => e.id === eventId ? {...e, has_posted_experience: true} : e));
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isDateConflict = (targetEvent) => {
    if (targetEvent.is_interested) return false;
    const targetDate = new Date(targetEvent.date).toDateString();
    const conflictingEvent = events.find((ev) => ev.id !== targetEvent.id && ev.is_interested && new Date(ev.date).toDateString() === targetDate);
    return !!conflictingEvent;
  };

  const isEventCompleted = (event) => {
      const endDate = event.end_date ? new Date(event.end_date) : new Date(event.date);
      return new Date() > endDate;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return { date: '', time: '' };
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
      time: date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const renderEventCard = (event) => {
    const conflict = isDateConflict(event);
    const start = formatDateTime(event.date);
    const end = event.end_date ? formatDateTime(event.end_date) : null;
    const completed = isEventCompleted(event);

    return (
      <div key={event.id} className={`bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition border-t-4 flex flex-col h-full ${conflict ? "border-gray-400 opacity-90" : completed ? "border-green-500" : "border-indigo-400"}`}>
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-gray-800 line-clamp-1">{event.title}</h3>
            {/* Show Timer if not completed, else show 'Completed' badge */}
            {!completed ? <CountdownTimer targetDate={event.date} /> : <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold uppercase border border-green-200">Completed</span>}
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-3 flex-grow text-sm">{event.description}</p>

        <div className="space-y-3 mb-5 border-b border-gray-100 pb-4">
          
          {/* Start Date */}
          <div className={`flex items-center gap-2 text-sm ${conflict ? "text-red-500 font-bold" : "text-gray-700"}`}>
            <Calendar size={16} className="text-indigo-500" />
            <span className="font-semibold">Start:</span> {start.date} <span className="text-gray-400">|</span> {start.time}
            {conflict && <span className="text-xs bg-red-100 px-2 py-0.5 rounded-full ml-auto">Conflict</span>}
          </div>

          {/* End Date */}
          {end && (
             <div className="flex items-center gap-2 text-sm text-gray-700">
               <Clock size={16} className="text-red-400" />
               <span className="font-semibold">Ends:</span> {end.date} <span className="text-gray-400">|</span> {end.time}
             </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-500"><MapPin size={16} />{event.location}</div>
          
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center gap-2 text-sm text-indigo-600 font-medium"><User size={16} /><span>{event.creator_name || "Admin"}</span></div>
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-500"><Users size={16} />{event.interested_count} Interested</div>
          </div>
        </div>

        {/* --- DYNAMIC BUTTON LOGIC --- */}
        <div className="mt-auto space-y-2">
            
            {/* 1. Post Experience Button (Visible ONLY if completed and NOT posted yet) */}
            {completed && !event.has_posted_experience && (
                <button 
                    onClick={() => { setSelectedEventForPost(event); setShowExperienceModal(true); }}
                    className="w-full py-2 rounded-lg font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg transition flex items-center justify-center gap-2 text-sm"
                >
                    <Camera size={16} /> Post Experience
                </button>
            )}

            {/* 1b. Already Posted Status */}
            {completed && event.has_posted_experience && (
                <div className="text-center text-xs text-green-600 font-bold py-1 flex items-center justify-center gap-1">
                    <MessageSquare size={12} /> You shared your memory
                </div>
            )}

            {/* 2. View Gallery Button (Visible ONLY if completed) - Navigates to new page */}
            {completed && (
                 <button 
                    onClick={() => navigate(`/event/${event.id}/gallery`)}
                    className="w-full py-2 rounded-lg font-medium bg-gray-100 text-indigo-600 border border-indigo-200 hover:bg-indigo-50 transition flex items-center justify-center gap-2 text-sm"
                 >
                    <Users size={16} /> View Gallery
                 </button>
            )}

            {/* 3. Interested Button (Visible ONLY if future/active) */}
            {!completed && (
                <button
                    onClick={() => !conflict && Interested(event.id)}
                    disabled={conflict}
                    className={`w-full py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 
                        ${event.is_interested ? "bg-green-500 text-white hover:bg-green-600 shadow-md" : conflict ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"}`}
                >
                    {conflict ? <><AlertCircle size={18} /> Date Conflict</> : <><Heart size={18} fill={event.is_interested ? "white" : "none"} />{event.is_interested ? "Interested" : "I'm Interested"}</>}
                </button>
            )}
        </div>
      </div>
    );
  };

  const renderProfile = () => (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden animate-in fade-in zoom-in duration-300">
      <div className="bg-indigo-600 px-6 py-8 text-center">
        <div className="w-24 h-24 bg-white rounded-full mx-auto flex items-center justify-center text-indigo-600 text-4xl font-bold mb-4 shadow-inner">{user?.username?.charAt(0).toUpperCase()}</div>
        <h2 className="text-2xl font-bold text-white">{user?.username}</h2>
        <p className="text-indigo-200">Event Member</p>
      </div>
      <div className="p-8 space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">User Information</h3>
        <div className="grid gap-6">
          <div className="flex items-center gap-4 text-gray-600"><div className="p-3 bg-indigo-50 rounded-lg text-indigo-600"><Mail size={20} /></div><div><p className="text-sm text-gray-500">Email</p><p className="font-medium">{user?.email || "N/A"}</p></div></div>
          <div className="flex items-center gap-4 text-gray-600"><div className="p-3 bg-indigo-50 rounded-lg text-indigo-600"><Clock size={20} /></div><div><p className="text-sm text-gray-500">Joined</p><p className="font-medium">{new Date().toLocaleDateString()}</p></div></div>
        </div>
      </div>
    </div>
  );

  const renderHistory = () => {
    const historyEvents = events.filter((e) => e.is_interested);
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2"><History className="text-indigo-600" /> Event History</h2>
        {historyEvents.length === 0 ? (<div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500">No interested events found.</p></div>) : (<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{historyEvents.map((event) => renderEventCard(event))}</div>)}
      </div>
    );
  };

  const renderHome = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-gray-800">Available Events</h2>
        <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 text-gray-500 pl-2"><Filter size={18} /><span className="text-sm font-medium">Sort By:</span></div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent py-1 px-2 text-gray-700 font-medium focus:outline-none cursor-pointer">
            <option value="newest">Newest Added</option>
            <option value="most_interested">Most Popular</option>
            <option value="date">Event Date (Soonest)</option>
          </select>
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{events.map((event) => renderEventCard(event))}</div>
      {events.length === 0 && (<div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500 text-lg">No events found.</p></div>)}
    </div>
  );

  if (loading) return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center"><div className="text-xl text-gray-600 font-medium animate-pulse">Loading...</div></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 font-sans">
      <nav className="bg-white shadow-md border-b-4 border-indigo-500 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition" onClick={() => setActiveTab("home")}>
              <div className="bg-indigo-600 p-2 rounded-lg"><Calendar className="text-white" size={24} /></div>
              <div><h1 className="text-2xl font-bold text-indigo-600 leading-none">Events</h1><p className="text-xs text-gray-500 mt-1">Hello, {user?.username}</p></div>
            </div>
            <div className="flex items-center bg-gray-100 p-1.5 rounded-xl">
              <button onClick={() => setActiveTab("home")} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${activeTab === "home" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-indigo-600"}`}><LayoutGrid size={18} /><span className="hidden sm:inline">Dashboard</span></button>
              <button onClick={() => setActiveTab("history")} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${activeTab === "history" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-indigo-600"}`}><History size={18} /><span className="hidden sm:inline">History</span></button>
              <button onClick={() => setActiveTab("profile")} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${activeTab === "profile" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-indigo-600"}`}><User size={18} /><span className="hidden sm:inline">Profile</span></button>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition text-sm font-medium"><LogOut size={20} /><span className="hidden md:inline">Logout</span></button>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === "home" && renderHome()}
        {activeTab === "history" && renderHistory()}
        {activeTab === "profile" && renderProfile()}
      </div>
      
      {/* Experience Modal */}
      {showExperienceModal && selectedEventForPost && (
          <PostExperienceModal 
            event={selectedEventForPost} 
            onClose={() => setShowExperienceModal(false)}
            onSubmit={handlePostSuccess}
          />
      )}
    </div>
  );
};

export default UserDashboard;