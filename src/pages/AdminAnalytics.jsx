import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  Heart, 
  TrendingUp,
  Loader2
} from 'lucide-react';

import { eventsAPI } from '../api/axios';

const AdminAnalytics = () => {
  const [stats, setStats] = useState({ 
    total_users: 0, 
    total_events: 0, 
    total_interests: 0 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // Calls the API (mock or real)
      const response = await eventsAPI.getStats();
      
      // Handle different response structures (e.g., response.data or response.data.results)
      const data = response.data;
      
      setStats({
        total_users: data.total_users || 0,
        total_events: data.total_events || 0,
        total_interests: data.total_interests || 0
      });
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
      setError("Failed to load analytics data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-purple-600">
        <Loader2 className="animate-spin mb-2" size={32} />
        <p>Loading real-time stats...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-lg text-center border border-red-200">
        <p>{error}</p>
        <button 
          onClick={fetchStats}
          className="mt-4 px-4 py-2 bg-white border border-red-300 rounded hover:bg-red-50"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <BarChart3 className="text-purple-600" size={32} />
            Platform Analytics
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Total Users Card */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-gray-500 font-medium mb-1">Total Users</p>
                        <h3 className="text-4xl font-bold text-gray-800">{stats.total_users}</h3>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                        <Users size={24} />
                    </div>
                </div>
            </div>

            {/* Total Events Card */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-gray-500 font-medium mb-1">Total Events</p>
                        <h3 className="text-4xl font-bold text-gray-800">{stats.total_events}</h3>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                        <Calendar size={24} />
                    </div>
                </div>
            </div>

            {/* Total Interests Card */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-pink-500 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-gray-500 font-medium mb-1">Total Interests</p>
                        <h3 className="text-4xl font-bold text-gray-800">{stats.total_interests}</h3>
                    </div>
                    <div className="p-3 bg-pink-100 rounded-lg text-pink-600">
                        <Heart size={24} />
                    </div>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                    Total user interactions
                </div>
            </div>
        </div>

        {/* Chart Placeholder */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center">
            <div className="max-w-md mx-auto">
                <BarChart3 className="mx-auto text-gray-300 mb-4" size={64} />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Activity Overview</h3>
                <p className="text-gray-500">
                  Data loaded successfully. Graphical charts can be integrated here using libraries like Recharts or Chart.js.
                </p>
            </div>
        </div>
    </div>
  );
};

export default AdminAnalytics;