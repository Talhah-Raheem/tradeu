import { supabase } from '@/lib/supabase';
import { Message } from '@/types/database';

// Send a message
export async function sendMessage(listingId: number, receiverId: string, messageText: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // RATE LIMITING: Prevent spam and cost abuse
    // Check how many messages user sent in the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const MESSAGE_LIMIT_PER_HOUR = 50; // Easy to change later

    const { count } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('sender_id', user.id)
      .gte('timestamp', oneHourAgo);

    if (count !== null && count >= MESSAGE_LIMIT_PER_HOUR) {
      throw new Error(`Rate limit exceeded. Maximum ${MESSAGE_LIMIT_PER_HOUR} messages per hour.`);
    }

    const { data, error } = await supabase
      .from('messages')
      .insert({
        listing_id: listingId,
        sender_id: user.id,
        receiver_id: receiverId,
        message_content: messageText,
        message_type: 'text',
      })
      .select(`
        *,
        sender:users!messages_sender_id_fkey(user_id, first_name, last_name, profile_image_url),
        receiver:users!messages_receiver_id_fkey(user_id, first_name, last_name, profile_image_url),
        listing:listings(listing_id, title)
      `)
      .single();

    if (error) throw error;

    return { data: data as Message, error: null };
  } catch (error) {
    console.error('Error sending message:', error);
    return { data: null, error };
  }
}

// Get all messages for a conversation (between two users about a listing)
export async function getConversationMessages(listingId: number, otherUserId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey(user_id, first_name, last_name, profile_image_url),
        receiver:users!messages_receiver_id_fkey(user_id, first_name, last_name, profile_image_url),
        listing:listings(listing_id, title)
      `)
      .eq('listing_id', listingId)
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
      .order('timestamp', { ascending: true });

    if (error) throw error;

    // Mark messages as read
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('receiver_id', user.id)
      .eq('listing_id', listingId)
      .eq('sender_id', otherUserId);

    return { data: data as Message[], error: null };
  } catch (error) {
    console.error('Error fetching conversation messages:', error);
    return { data: null, error };
  }
}

// Get all conversations for a user (grouped by listing and other user)
export async function getUserConversations() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey(user_id, email),
        receiver:users!messages_receiver_id_fkey(user_id, email),
        listing:listings(listing_id, title, images:listing_images(image_url))
      `)
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('timestamp', { ascending: false });

    if (error) throw error;

    // Group messages by conversation (listing + other user)
    const conversationsMap = new Map<string, Message>();

    data?.forEach((message: Message) => {
      const otherUserId = message.sender_id === user.id ? message.receiver_id : message.sender_id;
      const conversationKey = `${message.listing_id}-${otherUserId}`;

      // Keep only the most recent message for each conversation
      if (!conversationsMap.has(conversationKey)) {
        conversationsMap.set(conversationKey, message);
      }
    });

    const conversations = Array.from(conversationsMap.values());

    return { data: conversations as Message[], error: null };
  } catch (error) {
    console.error('Error fetching user conversations:', error);
    return { data: null, error };
  }
}

// Subscribe to new messages in a conversation
export async function subscribeToConversation(
  listingId: number,
  otherUserId: string,
  callback: (message: Message) => void
) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const subscription = supabase
    .channel(`messages:${listingId}:${user.id}:${otherUserId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `listing_id=eq.${listingId}`,
      },
      async (payload) => {
        const newMessage = payload.new as Message;

        // Only notify if the message is part of this conversation
        if (
          (newMessage.sender_id === user.id && newMessage.receiver_id === otherUserId) ||
          (newMessage.sender_id === otherUserId && newMessage.receiver_id === user.id)
        ) {
          // Fetch full message with relations
          const { data } = await supabase
            .from('messages')
            .select(`
              *,
              sender:users!messages_sender_id_fkey(user_id, first_name, last_name, profile_image_url),
              receiver:users!messages_receiver_id_fkey(user_id, first_name, last_name, profile_image_url),
              listing:listings(listing_id, title)
            `)
            .eq('message_id', newMessage.message_id)
            .single();

          if (data) {
            callback(data as Message);
          }
        }
      }
    )
    .subscribe();

  return subscription;
}
