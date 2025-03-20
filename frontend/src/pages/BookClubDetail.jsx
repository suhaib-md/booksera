import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthGuard from "../components/AuthGuard";
import { BookOpen, Users, Calendar, ArrowLeft, Send } from "lucide-react";
import { backendAPI, externalAPI } from "../utils/api";

function BookClubDetail() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [bookClub, setBookClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const messageIntervalRef = useRef(null);

  // Fetch book club details
  useEffect(() => {
    const fetchBookClub = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await backendAPI.get(
          `/book-clubs/${clubId}/`,
          { withCredentials: true }
        );
        setBookClub(response.data);
      } catch (error) {
        console.error("Error fetching book club:", error);
        setError("Failed to load book club details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookClub();
  }, [clubId]);

  // Fetch messages
  const fetchMessages = async () => {
    if (!bookClub?.is_member) return;
    
    setMessagesLoading(true);
    try {
      const response = await backendAPI.get(
        `/book-clubs/${clubId}/messages/`,
        { withCredentials: true }
      );
      setMessages(response.data.messages.reverse() || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setMessagesLoading(false);
    }
  };

  // Fetch members
  const fetchMembers = async () => {
    setMembersLoading(true);
    try {
      const response = await backendAPI.get(
        `/book-clubs/${clubId}/members/`,
        { withCredentials: true }
      );
      setMembers(response.data.members || []);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setMembersLoading(false);
    }
  };

  // Fetch messages and members when club loads
  useEffect(() => {
    if (bookClub) {
      fetchMessages();
      fetchMembers();
      
      // Set up polling for new messages
      if (bookClub.is_member) {
        messageIntervalRef.current = setInterval(fetchMessages, 10000); // Poll every 10 seconds
      }
    }
    
    return () => {
      if (messageIntervalRef.current) {
        clearInterval(messageIntervalRef.current);
      }
    };
  }, [bookClub]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sendingMessage) return;
    
    setSendingMessage(true);
    try {
      await backendAPI.post(
        `/book-clubs/${clubId}/messages/send/`,
        { content: newMessage },
        { withCredentials: true }
      );
      setNewMessage("");
      fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleJoinClub = async () => {
    try {
      await backendAPI.post(
        `/book-clubs/${clubId}/join/`,
        {},
        { withCredentials: true }
      );
      // Refresh club details
      window.location.reload();
    } catch (error) {
      console.error("Error joining club:", error);
      alert("Failed to join club: " + (error.response?.data?.error || "Unknown error"));
    }
  };

  const handleLeaveClub = async () => {
    if (!window.confirm("Are you sure you want to leave this book club?")) {
      return;
    }
    
    try {
      await backendAPI.post(
        `/book-clubs/${clubId}/leave/`,
        {},
        { withCredentials: true }
      );
      navigate("/communities");
    } catch (error) {
      console.error("Error leaving club:", error);
      alert("Failed to leave club: " + (error.response?.data?.error || "Unknown error"));
    }
  };

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex justify-center items-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </AuthGuard>
    );
  }

  if (error || !bookClub) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-6">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
              <p className="text-slate-600 mb-6">{error || "Failed to load book club details."}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/communities")}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-medium hover:shadow-lg transition-all flex items-center justify-center mx-auto"
              >
                <ArrowLeft size={16} className="mr-2" /> Back to Communities
              </motion.button>
            </motion.div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        {/* Header section with curved background */}
        <div className="relative mb-32">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-b-[40px] h-64"></div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 max-w-6xl mx-auto px-6 pt-16"
          >
            <motion.button
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/communities")}
              className="flex items-center text-white mb-6 hover:text-blue-100 transition-colors"
            >
              <ArrowLeft size={18} className="mr-2" /> Back to Communities
            </motion.button>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white">{bookClub.name}</h1>
                <p className="mt-2 text-blue-100">{bookClub.description}</p>
                
                <div className="flex flex-wrap items-center mt-4">
                  <div className="flex items-center mr-6 mb-2 text-sm text-white">
                    <Calendar size={16} className="mr-1" />
                    <span>Created {new Date(bookClub.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center mr-6 mb-2 text-sm text-white">
                    <Users size={16} className="mr-1" />
                    <span>{bookClub.members_count} members</span>
                  </div>
                  <div className="bg-black bg-opacity-20 px-3 py-1 rounded-full mb-2 text-sm text-white">
                    {bookClub.category.replace("_", " ")}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0">
                {bookClub.is_member ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLeaveClub}
                    className="px-6 py-3 bg-red-500 text-white rounded-full font-medium hover:shadow-lg transition-all"
                  >
                    Leave Club
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleJoinClub}
                    className="px-6 py-3 bg-white text-purple-600 rounded-full font-medium hover:shadow-lg transition-all"
                  >
                    Join Club
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto -mt-20 relative z-10 px-4 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Club Info and Members */}
            <div className="lg:col-span-1 space-y-6">
              {/* Current Book */}
              {bookClub.current_book && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-white rounded-2xl shadow-xl p-6"
                >
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Currently Reading</h3>
                  <div className="flex">
                    {bookClub.current_book_image ? (
                      <div className="relative w-24 h-36 rounded-lg overflow-hidden shadow-md">
                        <img
                          src={bookClub.current_book_image}
                          alt={bookClub.current_book}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-36 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center rounded-lg shadow-md">
                        <BookOpen size={32} className="text-purple-400" />
                      </div>
                    )}
                    <div className="ml-4 flex flex-col justify-center">
                      <h4 className="font-medium text-slate-800">{bookClub.current_book}</h4>
                      {bookClub.role === "admin" && (
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="mt-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          Change Book
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Members List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Members</h3>
                {membersLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    {members.map((member) => (
                      <motion.div 
                        key={member.id}
                        whileHover={{ x: 3 }}
                        className="flex items-center justify-between bg-slate-50 rounded-xl p-3 shadow-sm"
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center shadow-sm">
                            {member.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="ml-3 font-medium text-slate-700">{member.username}</span>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full shadow-sm ${
                          member.role === "admin" 
                            ? "bg-purple-100 text-purple-700" 
                            : member.role === "moderator"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          {member.role}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right Column - Chat */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-2 bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-[calc(100vh-220px)]"
            >
              {!bookClub.is_member ? (
                <div className="flex-grow flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                      <span className="text-2xl">💬</span>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-3">Join the Conversation</h3>
                    <p className="text-slate-600 mb-6 max-w-md mx-auto">
                      You need to join this book club to participate in discussions and connect with other readers.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleJoinClub}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-medium hover:shadow-lg transition-all"
                    >
                      Join Club
                    </motion.button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Chat Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 border-b shadow-sm">
                    <h3 className="font-semibold text-slate-800">Book Club Discussion</h3>
                  </div>

                  {/* Messages */}
                  <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    {messagesLoading ? (
                      <div className="flex justify-center py-8">
                        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center text-gray-500 py-10">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">💭</span>
                        </div>
                        <p className="text-lg font-medium text-slate-600 mb-2">No messages yet</p>
                        <p className="text-slate-500">Be the first to start the discussion!</p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <motion.div 
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-start"
                        >
                          <div className="mr-3 mt-1 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                            {message.sender.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-baseline mb-1">
                              <span className="font-medium text-slate-800 mr-2">{message.sender.username}</span>
                              <span className="text-xs text-slate-500">
                                {new Date(message.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-slate-700 bg-slate-50 rounded-2xl rounded-tl-none py-3 px-4 shadow-sm whitespace-pre-line break-words">
                              {message.content}
                            </p>
                          </div>
                        </motion.div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="border-t p-4">
                    <div className="flex bg-slate-50 rounded-full shadow-sm">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Write a message..."
                        className="flex-grow bg-transparent px-5 py-3 focus:outline-none"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={!newMessage.trim() || sendingMessage}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white m-1 px-5 py-2 rounded-full disabled:opacity-50 flex items-center"
                      >
                        {sendingMessage ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <Send size={16} className="mr-1" /> Send
                          </>
                        )}
                      </motion.button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

export default BookClubDetail;