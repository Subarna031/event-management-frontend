import React from "react";
import { History, Heart } from "lucide-react";
import EventCard from "./EventCard"; // Assumes EventCard is in the same folder

const EventHistory = ({ events, onToggleInterest, setActiveTab }) => {
  // Filter events where is_interested is true
  const interestedEvents = events.filter((event) => event.is_interested);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
        <History className="text-indigo-600" />
        My Event History
      </h2>
      <p className="text-gray-600">Events you have expressed interest in.</p>

      {interestedEvents.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interestedEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onToggleInterest={onToggleInterest}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-100">
          <Heart size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            No Interested Events
          </h3>
          <p className="text-gray-500">
            You haven't marked interest in any events yet.
          </p>
          <button
            onClick={() => setActiveTab("home")}
            className="mt-4 text-indigo-600 font-medium hover:underline"
          >
            Browse available events
          </button>
        </div>
      )}
    </div>
  );
};

export default EventHistory;
