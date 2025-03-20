import React from "react";
import { BookOpen, Users, Calendar } from "lucide-react";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all flex flex-col h-full"
    >
      {/* Card Header with Image */}
      <div 
        className="h-40 relative cursor-pointer overflow-hidden"
        onClick={onClick}
      >
        {club.image ? (
          <img
            src={club.image}
            alt={club.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600">
            <BookOpen size={48} className="text-white" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 backdrop-blur-sm p-3">
          <h3 className="text-white font-semibold truncate">{club.name}</h3>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-grow cursor-pointer" onClick={onClick}>
        <div className="flex justify-between items-start mb-3">
          <span className={`text-xs px-3 py-1 rounded-full ${getCategoryStyle(club.category)}`}>
            {club.category?.replace("_", " ")}
          </span>
          {role && (
            <span className={`text-xs font-medium ${getRoleColor(role)}`}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
          )}
        </div>

        <p className="text-slate-600 text-sm line-clamp-3 mb-4">{club.description}</p>

        {/* Current Book */}
        {club.current_book && (
          <div className="mb-4 bg-slate-50 p-3 rounded-xl">
            <p className="text-xs text-slate-500 mb-2">Currently reading:</p>
            <div className="flex items-center">
              {club.current_book_image ? (
                <img 
                  src={club.current_book_image} 
                  alt={club.current_book} 
                  className="w-10 h-14 object-cover mr-3 rounded-md shadow-sm"
                />
              ) : (
                <div className="w-10 h-14 bg-gradient-to-b from-blue-100 to-blue-200 flex items-center justify-center mr-3 rounded-md shadow-sm">
                  <BookOpen size={16} className="text-blue-500" />
                </div>
              )}
              <span className="text-sm font-medium line-clamp-2">{club.current_book}</span>
            </div>
          </div>
        )}

        {/* Club Info */}
        <div className="flex items-center text-xs text-slate-500 gap-4">
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
      <div className="p-4 border-t border-gray-100">
        {isMember ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="w-full py-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors text-sm font-medium shadow-sm"
          >
            Visit Club
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              onJoin();
            }}
            className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-lg transition-all text-sm font-medium"
          >
            Join Club
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

export default BookClubCard;