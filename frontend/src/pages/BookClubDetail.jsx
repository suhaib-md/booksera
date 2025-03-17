import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthGuard from "../components/AuthGuard";
import { BookOpen, Users, Calendar, ArrowLeft, Send } from "lucide-react";
import { backendAPI,externalAPI } from "../utils/api";

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
        <div className="min-h-screen bg-gray-100 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </AuthGuard>
    );
  }

  if (error || !bookClub) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-100 p-6">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
            <p>{error || "Failed to load book club details."}</p>
            <button
              onClick={() => navigate("/communities")}
              className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft size={16} className="mr-1" /> Back to Communities
            </button>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="max-w-6xl mx-auto p-6">
            <button
              onClick={() => navigate("/communities")}
              className="flex items-center text-white mb-4 hover:text-blue-100"
            >
              <ArrowLeft size={18} className="mr-1" /> Back to Communities
            </button>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold">{bookClub.name}</h1>
                <p className="mt-2 text-blue-100">{bookClub.description}</p>
                
                <div className="flex flex-wrap items-center mt-4 text-sm">
                  <div className="flex items-center mr-6 mb-2">
                    <Calendar size={16} className="mr-1" />
                    <span>Created {new Date(bookClub.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center mr-6 mb-2">
                    <Users size={16} className="mr-1" />
                    <span>{bookClub.members_count} members</span>
                  </div>
                  <div className="bg-white bg-opacity-20 px-3 py-0.5 rounded-full mb-2">
                    {bookClub.category.replace("_", " ")}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0">
                {bookClub.is_member ? (
                  <button
                    onClick={handleLeaveClub}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Leave Club
                  </button>
                ) : (
                  <button
                    onClick={handleJoinClub}
                    className="px-4 py-2 bg-white text-purple-600 rounded hover:bg-blue-50"
                  >
                    Join Club
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left Column - Club Info and Members */}
          <div className="lg:col-span-1 space-y-6">
            {/* Current Book */}
            {bookClub.current_book && (
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold mb-3">Currently Reading</h3>
                <div className="flex">
                  {bookClub.current_book_image ? (
                    <img
                      src={bookClub.current_book_image}
                      alt={bookClub.current_book}
                      className="w-20 h-30 object-cover rounded"
                    />
                  ) : (
                    <div className="w-20 h-30 bg-gray-200 flex items-center justify-center rounded">
                      <BookOpen size={24} className="text-gray-400" />
                    </div>
                  )}
                  <div className="ml-4">
                    <h4 className="font-medium">{bookClub.current_book}</h4>
                    {bookClub.role === "admin" && (
                      <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">
                        Change Book
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Members List */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold mb-3">Members</h3>
              {membersLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          {member.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="ml-2">{member.username}</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        member.role === "admin" 
                          ? "bg-purple-100 text-purple-700" 
                          : member.role === "moderator"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        {member.role}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Chat */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden flex flex-col h-[calc(100vh-220px)]">
            {!bookClub.is_member ? (
              <div className="flex-grow flex items-center justify-center p-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Join the Conversation</h3>
                  <p className="text-gray-600 mb-4">
                    You need to join this book club to participate in discussions.
                  </p>
                  <button
                    onClick={handleJoinClub}
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                  >
                    Join Club
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="bg-gray-50 p-4 border-b">
                  <h3 className="font-semibold">Book Club Discussion</h3>
                </div>

                {/* Messages */}
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                  {messagesLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      No messages yet. Be the first to start the discussion!
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div key={message.id} className="flex items-start">
                        <div className="mr-2 mt-1 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          {message.sender.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-baseline mb-1">
                            <span className="font-medium mr-2">{message.sender.username}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(message.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-gray-800 whitespace-pre-line break-words">{message.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="border-t p-4 flex">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Write a message..."
                    className="flex-grow border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sendingMessage}
                    className="bg-purple-600 text-white px-4 py-2 rounded-r-md hover:bg-purple-700 disabled:bg-purple-300 flex items-center"
                  >
                    {sendingMessage ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Send size={16} className="mr-1" /> Send
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

export default BookClubDetail;