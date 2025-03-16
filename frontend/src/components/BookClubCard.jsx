import React from "react";
import { BookOpen, Users, Calendar } from "lucide-react";

function BookClubCard({ club, onClick, onJoin, isMember, role }) {
  const categoryStyles = {
    fiction: "bg-blue-100 text-blue-700",
    non_fiction: "bg-green-100 text-green-700",
    mystery: "bg-purple-100 text-purple-700",
    science_fiction: "bg-indigo-100 text-indigo-700",
    fantasy: "bg-pink-100 text-pink-700",
    biography: "bg-yellow-100 text-yellow-700",
    history: "bg-amber-100 text-amber-700",
    romance: "bg-red-100 text-red-700",
    thriller: "bg-orange-100 text-orange-700",
    young_adult: "bg-teal-100 text-teal-700",
    classics: "bg-gray-100 text-gray-700",
    self_help: "bg-lime-100 text-lime-700",
    poetry: "bg-cyan-100 text-cyan-700",
    other: "bg-slate-100 text-slate-700",
  };

  const getCategoryStyle = (category) => {
    return categoryStyles[category] || "bg-gray-100 text-gray-700";
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "text-purple-700";
      case "moderator":
        return "text-blue-700";
      default:
        return "text-gray-700";
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
    >
      {/* Card Header with Image */}
      <div 
        className="h-40 bg-gradient-to-r from-blue-400 to-purple-500 relative cursor-pointer"
        onClick={onClick}
      >
        {club.image ? (
          <img
            src={club.image}
            alt={club.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen size={48} className="text-white" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-2">
          <h3 className="text-white font-semibold truncate">{club.name}</h3>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-grow cursor-pointer" onClick={onClick}>
        <div className="flex justify-between items-start mb-2">
          <span className={`text-xs px-2 py-1 rounded-full ${getCategoryStyle(club.category)}`}>
            {club.category?.replace("_", " ")}
          </span>
          {role && (
            <span className={`text-xs font-medium ${getRoleColor(role)}`}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
          )}
        </div>

        <p className="text-gray-600 text-sm line-clamp-3 mb-3">{club.description}</p>

        {/* Current Book */}
        {club.current_book && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">Currently reading:</p>
            <div className="flex items-center">
              {club.current_book_image ? (
                <img 
                  src={club.current_book_image} 
                  alt={club.current_book} 
                  className="w-8 h-12 object-cover mr-2"
                />
              ) : (
                <div className="w-8 h-12 bg-gray-200 flex items-center justify-center mr-2">
                  <BookOpen size={14} className="text-gray-400" />
                </div>
              )}
              <span className="text-sm font-medium line-clamp-1">{club.current_book}</span>
            </div>
          </div>
        )}

        {/* Club Info */}
        <div className="flex items-center text-xs text-gray-500 gap-3">
          <div className="flex items-center">
            <Users size={14} className="mr-1" />
            <span>{club.members_count || 0} members</span>
          </div>
          <div className="flex items-center">
            <Calendar size={14} className="mr-1" />
            <span>Since {new Date(club.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-3 border-t border-gray-100">
        {isMember ? (
          <button
            onClick={onClick}
            className="w-full py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-sm font-medium"
          >
            Visit Club
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onJoin();
            }}
            className="w-full py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            Join Club
          </button>
        )}
      </div>
    </div>
  );
}

export default BookClubCard;