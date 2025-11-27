import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Camera, Clock, MessageSquare, Send, X } from "lucide-react";
import { eventsAPI } from "../api/axios";
import axios from "axios"; // Direct axios for posting if eventsAPI doesn't have post method

const EventGallery = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  
  // States for posting/replying
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null); // ID of the comment being replied to
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  };

  // Fetch Data
  const fetchGallery = async () => {
    try {
      const [eventRes, expRes] = await Promise.all([
        eventsAPI.getEvent(id),
        eventsAPI.getExperiences(id),
      ]);
      setEvent(eventRes.data);
      // Filter out replies from the main list (they will be shown nested)
      const allExps = expRes.data || [];
      const rootExps = allExps.filter(exp => exp.parent === null); 
      setExperiences(rootExps);
    } catch (error) {
      console.error("Error fetching gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(user);
    fetchGallery();
  }, [id]);

  // Handle Post Submit (New Comment or Reply)
  const handlePostSubmit = async (parentId = null) => {
    const text = parentId ? replyText : newComment;
    if (!text.trim()) return;

    setSubmitting(true);
    const token = localStorage.getItem("access_token"); // Assuming you store JWT here

    const formData = new FormData();
    formData.append("description", text);
    formData.append("event", id);
    if (parentId) {
      formData.append("parent", parentId);
    }

    try {
      await axios.post(`${API_BASE_URL}/api/experiences/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Ensure user is logged in
        },
      });

      // Reset and Refresh
      setNewComment("");
      setReplyText("");
      setReplyingTo(null);
      fetchGallery(); // Refresh list to show new comment
    } catch (error) {
      console.error("Failed to post:", error);
      alert("Failed to post comment. Make sure you are logged in.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!event) return null;

  // --- Recursive Component for Rendering Comments & Replies ---
  const CommentCard = ({ exp, isReply = false }) => {
    const isMe = exp.user_name === currentUser?.username;
    const imageUrl = getImageUrl(exp.image);
    const userInitial = exp.user_name ? exp.user_name.charAt(0).toUpperCase() : "?";

    return (
      <div className={`flex flex-col ${isReply ? "ml-8 mt-4 border-l-2 border-indigo-100 pl-4" : ""}`}>
        <div className={`bg-white rounded-xl shadow-sm overflow-hidden border ${isMe ? "border-indigo-200" : "border-gray-100"}`}>
          
          {/* Image (Only show for main posts for cleaner UI, or remove condition to show for all) */}
          {imageUrl && !isReply && (
            <div className="h-48 overflow-hidden bg-gray-100">
              <img src={imageUrl} className="w-full h-full object-cover" alt="Memory" />
            </div>
          )}

          <div className="p-4">
            {/* User Info */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${isMe ? "bg-indigo-600" : "bg-orange-500"}`}>
                  {userInitial}
                </div>
                <div>
                  <span className="text-sm font-bold text-gray-800 block">
                    {isMe ? "You" : exp.user_name}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={10} /> {new Date(exp.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Comment Text */}
            <p className="text-gray-700 text-sm mb-3">{exp.description}</p>

            {/* Actions: Reply Button */}
            <div className="flex items-center gap-4 border-t pt-2">
              <button 
                onClick={() => setReplyingTo(replyingTo === exp.id ? null : exp.id)}
                className="text-indigo-600 text-xs font-medium flex items-center gap-1 hover:text-indigo-800 transition"
              >
                <MessageSquare size={14} /> Reply
              </button>
            </div>

            {/* Reply Input Box (Only visible if replying to THIS specific card) */}
            {replyingTo === exp.id && (
              <div className="mt-3 flex gap-2 animate-in fade-in slide-in-from-top-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply to ${exp.user_name}...`}
                  className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  autoFocus
                />
                <button
                  onClick={() => handlePostSubmit(exp.id)}
                  disabled={submitting}
                  className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Render Nested Replies */}
        {exp.replies && exp.replies.length > 0 && (
          <div className="mt-2">
            {exp.replies.map((reply) => (
              <CommentCard key={reply.id} exp={reply} isReply={true} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{event.title} Discussion</h1>
            <p className="text-xs text-gray-500">
              {experiences.length} Memories Shared
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        
        {/* --- Main "Add Comment" Input --- */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-8 border border-indigo-100">
          <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <MessageSquare size={16} className="text-indigo-600" /> Share your experience
          </h3>
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0">
              {currentUser?.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 relative">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="What was the highlight of this event?"
                className="w-full border-gray-200 bg-gray-50 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition outline-none resize-none h-24"
              />
              <button
                onClick={() => handlePostSubmit(null)}
                disabled={submitting || !newComment.trim()}
                className="absolute bottom-3 right-3 bg-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 transition"
              >
                {submitting ? "Posting..." : <>Post <Send size={12} /></>}
              </button>
            </div>
          </div>
        </div>

        {/* --- Gallery List --- */}
        <div className="space-y-6">
          {experiences.length === 0 ? (
            <div className="text-center py-10 text-gray-400 italic">No memories yet. Be the first!</div>
          ) : (
            experiences.map((exp) => (
              <CommentCard key={exp.id} exp={exp} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EventGallery;