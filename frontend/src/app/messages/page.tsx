'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MessageCircle, User, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserConversations, getConversationMessages, sendMessage, subscribeToConversation } from '@/lib/api/messages';
import { Message } from '@/types/database';
import Button from '@/components/Button';

export default function MessagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [conversations, setConversations] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<{ listingId: number; otherUserId: string } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadConversations();

      // Check if we should open a specific conversation from URL params
      const listingParam = searchParams.get('listing');
      const sellerParam = searchParams.get('seller');

      if (listingParam && sellerParam) {
        setSelectedConversation({
          listingId: parseInt(listingParam),
          otherUserId: sellerParam,
        });
        loadConversationMessages(parseInt(listingParam), sellerParam);
      }
    }
  }, [user, searchParams]);

  useEffect(() => {
    if (selectedConversation) {
      // Subscribe to new messages
      const subscription = subscribeToConversation(
        selectedConversation.listingId,
        selectedConversation.otherUserId,
        (newMsg) => {
          setMessages((prev) => [...prev, newMsg]);
        }
      );
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    setLoading(true);
    const { data } = await getUserConversations();
    if (data) {
      setConversations(data);
    }
    setLoading(false);
  };

  const loadConversationMessages = async (listingId: number, otherUserId: string) => {
    const { data } = await getConversationMessages(listingId, otherUserId);
    if (data) {
      setMessages(data);
    }
  };

  const handleSelectConversation = (conv: Message) => {
    const otherUserId = conv.sender_id === user?.id ? conv.receiver_id : conv.sender_id;
    setSelectedConversation({
      listingId: conv.listing_id,
      otherUserId,
    });
    loadConversationMessages(conv.listing_id, otherUserId);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);
    const { data, error } = await sendMessage(
      selectedConversation.listingId,
      selectedConversation.otherUserId,
      newMessage
    );

    if (!error && data) {
      setMessages([...messages, data]);
      setNewMessage('');
    }
    setSending(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const selectedConvData = conversations.find((conv) => {
    const otherUserId = conv.sender_id === user.id ? conv.receiver_id : conv.sender_id;
    return conv.listing_id === selectedConversation?.listingId && otherUserId === selectedConversation.otherUserId;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-3 mb-6">
          <MessageCircle className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 overflow-hidden" style={{ height: 'calc(100vh - 250px)' }}>
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No conversations yet</p>
                </div>
              ) : (
                conversations.map((conv) => {
                  const otherUser = conv.sender_id === user.id ? conv.receiver : conv.sender;
                  const isSelected =
                    selectedConversation?.listingId === conv.listing_id &&
                    selectedConversation?.otherUserId === (conv.sender_id === user.id ? conv.receiver_id : conv.sender_id);

                  return (
                    <div
                      key={`${conv.listing_id}-${otherUser?.user_id}`}
                      onClick={() => handleSelectConversation(conv)}
                      className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition ${
                        isSelected ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900">
                            {otherUser?.first_name} {otherUser?.last_name}
                          </div>
                          <div className="text-sm text-gray-600 truncate">{conv.listing?.title}</div>
                          <div className="text-xs text-gray-500 truncate mt-1">{conv.message_text}</div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversation && selectedConvData ? (
                <>
                  {/* Conversation Header */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="font-semibold text-gray-900">
                      {selectedConvData.sender_id === user.id
                        ? `${selectedConvData.receiver?.first_name} ${selectedConvData.receiver?.last_name}`
                        : `${selectedConvData.sender?.first_name} ${selectedConvData.sender?.last_name}`}
                    </div>
                    <Link href={`/listings/${selectedConversation.listingId}`}>
                      <div className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                        Re: {selectedConvData.listing?.title}
                      </div>
                    </Link>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((msg) => {
                      const isOwnMessage = msg.sender_id === user.id;
                      return (
                        <div key={msg.message_id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              isOwnMessage ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'
                            }`}
                          >
                            <p>{msg.message_text}</p>
                            <p className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}`}>
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none text-gray-900 placeholder:text-gray-500"
                      />
                      <Button type="submit" variant="primary" isLoading={sending}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p>Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
