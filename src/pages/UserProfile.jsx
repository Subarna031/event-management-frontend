import React from "react";
import { Mail, User, Clock } from "lucide-react";

const UserProfile = ({ user }) => {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden animate-in fade-in zoom-in duration-300">
      <div className="bg-indigo-600 px-6 py-8 text-center">
        <div className="w-24 h-24 bg-white rounded-full mx-auto flex items-center justify-center text-indigo-600 text-4xl font-bold mb-4 shadow-inner">
          {user?.username?.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-2xl font-bold text-white">{user?.username}</h2>
        <p className="text-indigo-200">Event Enthusiast</p>
      </div>

      <div className="p-8 space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
          User Information
        </h3>

        <div className="grid gap-6">
          <div className="flex items-center gap-4 text-gray-600">
            <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Email Address</p>
              <p className="font-medium">
                {user?.email || "No email provided"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-gray-600">
            <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
              <User size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Username</p>
              <p className="font-medium">{user?.username}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-gray-600">
            <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Login</p>
              <p className="font-medium">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
