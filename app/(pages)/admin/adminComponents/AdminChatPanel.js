'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Send, MessageCircle, User } from 'lucide-react';

export default function AdminChatPanel() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [userTyping, setUserTyping] = useState(false);
  const [messageStatus, setMessageStatus] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [lastMessageCount, setLastMessageCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const messagesEndRef = useRef(null);
  const pollingIntervalRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Poll for new messages and typing status
  const pollMessages = useCallback(async () => {
    if (!selectedConversation) return;

    try {
      const msgRes = await fetch(`/api/chat/messages?conversationId=${selectedConversation.userId}`);
      const msgData = await msgRes.json();
      
      if (msgData.success && msgData.messages) {
        if (msgData.messages.length !== lastMessageCount) {
          setMessages(msgData.messages);
          setLastMessageCount(msgData.messages.length);
          
          // Auto-mark messages as read
          await fetch('/api/chat/messages', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ conversationId: selectedConversation.userId })
          });
        }
      }

      // Check for user typing status
      const typingRes = await fetch(`/api/chat/typing?conversationId=${selectedConversation.userId}`);
      const typingData = await typingRes.json();
      if (typingData.success) {
        setUserTyping(typingData.isTyping);
      }
    } catch (error) {
      console.error('Polling error:', error);
    }
  }, [selectedConversation, lastMessageCount]);

  // Fetch conversations on mount and start polling
  useEffect(() => {
    if (session?.user) {
      fetchConversations();
      
      // Poll conversations list every 10 seconds
      const conversationsInterval = setInterval(() => {
        fetchConversations();
      }, 10000);

      return () => {
        clearInterval(conversationsInterval);
      };
    }
  }, [session]);

  // Start polling when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      // Initial poll
      pollMessages();
      
      // Poll every 3 seconds
      pollingIntervalRef.current = setInterval(() => {
        pollMessages();
      }, 3000);

      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
      };
    }
  }, [selectedConversation, pollMessages]);

  const fetchConversations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat/conversations');
      const data = await response.json();
      
      if (data.success) {
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    setIsLoadingMessages(true);
    
    try {
      const response = await fetch(`/api/chat/messages?conversationId=${conversation.userId}`);
      const data = await response.json();
      
      if (data.success) {
        setMessages(data.messages);
        
        // Mark messages as read
        await fetch('/api/chat/messages', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversationId: conversation.userId })
        });

        // Update unread count locally
        setConversations(prev =>
          prev.map(conv =>
            conv.userId === conversation.userId
              ? { ...conv, unreadCount: 0 }
              : conv
          )
        );
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || isSending) return;

    const messageText = newMessage;
    setNewMessage('');
    setIsSending(true);

    // Optimistic update
    const optimisticMessage = {
      _id: `temp-${Date.now()}`,
      conversationId: selectedConversation.userId,
      message: messageText,
      senderId: session.user.id,
      senderName: 'Support Team',
      senderRole: 'admin',
      timestamp: new Date().toISOString(),
      status: 'sending'
    };
    setMessages(prev => [...prev, optimisticMessage]);

    try {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConversation.userId,
          message: messageText
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Replace optimistic message with real one
        setMessages(prev => 
          prev.map(msg => 
            msg._id === optimisticMessage._id ? data.message : msg
          )
        );
        setLastMessageCount(prev => prev + 1);
        
        // Poll immediately
        pollMessages();
      } else {
        setMessages(prev => prev.filter(msg => msg._id !== optimisticMessage._id));
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => prev.filter(msg => msg._id !== optimisticMessage._id));
    } finally {
      setIsSending(false);
    }
  };
  
  // Enhanced typing functionality for admin
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    
    // Update typing status via API
    if (selectedConversation && e.target.value.trim()) {
      fetch('/api/chat/typing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConversation.userId,
          userId: session.user.id,
          userName: 'Support Team',
          isTyping: true,
          role: 'admin'
        })
      }).catch(err => console.error('Typing indicator error:', err));
      
      // Clear previous timeout
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      
      // Set new timeout to stop typing indicator
      const timeout = setTimeout(() => {
        fetch('/api/chat/typing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId: selectedConversation.userId,
            userId: session.user.id,
            isTyping: false,
            role: 'admin'
          })
        }).catch(err => console.error('Stop typing error:', err));
      }, 1000);
      
      setTypingTimeout(timeout);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Request notification permission
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="h-[calc(100vh-200px)] bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <div className="flex h-full">
        {/* Conversations List */}
        <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
          <div className="p-4 bg-gradient-to-r from-gray-700 to-gray-800 text-white">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <MessageCircle size={24} />
              Customer Chats
            </h2>
            <p className="text-sm text-blue-100 mt-1">
              {isLoading ? 'Loading conversations...' : 
               `${conversations.length} conversation${conversations.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p>Loading conversations...</p>
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <MessageCircle size={48} className="mx-auto mb-2 text-gray-300" />
                <p>No conversations yet</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.userId}
                  onClick={() => selectConversation(conv)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition relative ${
                    selectedConversation?.userId === conv.userId ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {conv.userName?.[0]?.toUpperCase() || <User size={20} />}
                      </div>
                      {onlineUsers.has(conv.userId) && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-800 truncate">{conv.userName}</h3>
                          {conv.isGuest && (
                            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Guest</span>
                          )}
                        </div>
                        {conv.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-2">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">{conv.userEmail}</p>
                      <p className="text-xs text-gray-500 truncate mt-1">{conv.lastMessage || 'No messages yet'}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {conv.lastMessageTime ? new Date(conv.lastMessageTime).toLocaleString() : ''}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white font-semibold">
                      {selectedConversation.userName?.[0]?.toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-800">{selectedConversation.userName}</h3>
                      {isLoadingMessages && (
                        <div className="w-4 h-4 border border-gray-400 rounded-full border-t-transparent animate-spin"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{selectedConversation.userEmail}</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {isLoadingMessages ? (
                  <div className="text-center text-gray-500 mt-20">
                    <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p>Loading messages...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-20">
                    <MessageCircle size={48} className="mx-auto mb-2 text-gray-300" />
                    <p>No messages yet</p>
                    <p className="text-sm mt-2">Start the conversation with {selectedConversation.userName}</p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.senderRole === 'admin' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                          msg.senderRole === 'admin'
                            ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-br-none'
                            : 'bg-white text-gray-800 shadow-sm rounded-bl-none border'
                        }`}
                      >
                        {msg.senderRole !== 'admin' && (
                          <p className="text-xs font-medium text-gray-600 mb-1">{msg.senderName}</p>
                        )}
                        <p className="text-sm break-words">{msg.message}</p>
                        <div className={`flex items-center justify-between mt-1 ${
                          msg.senderRole === 'admin' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          <p className="text-xs">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {msg.senderRole === 'admin' && (
                            <div className="flex items-center gap-1">
                              {messageStatus[msg._id] === 'delivered' && (
                                <svg className="w-3 h-3 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                              {messageStatus[msg._id] === 'read' && (
                                <div className="flex -space-x-1">
                                  <svg className="w-3 h-3 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                  <svg className="w-3 h-3 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                
                {userTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-800 rounded-2xl rounded-bl-none px-4 py-2 shadow-sm border">
                      <p className="text-xs font-medium text-gray-600 mb-1">{selectedConversation.userName}</p>
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-gray-200">
                {userTyping && (
                  <div className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    {selectedConversation.userName} is typing...
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your reply..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || isSending}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 text-white p-3 rounded-full hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSending ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send size={20} />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageCircle size={64} className="mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
