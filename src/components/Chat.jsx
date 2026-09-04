import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Chat() {
  const { id: matchId } = useParams();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initChat() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user;
        setUser(currentUser);

        if (!matchId) return;

        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('match_id', matchId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (err) {
        console.error('Error loading chat:', err.message);
      } finally {
        setLoading(false);
      }
    }

    initChat();
  }, [matchId]);

  async function sendMessage(e) {
    e.preventDefault();
    if (!text.trim() || !user || !matchId) return;

    try {
      const newMessage = {
        match_id: matchId,
        sender_id: user.id,
        content: text.trim(),
      };

      const { data, error } = await supabase
        .from('messages')
        .insert([newMessage])
        .select()
        .single();

      if (error) throw error;

      setMessages(prev => [...prev, data]);
      setText('');
    } catch (err) {
      console.error('Error sending message:', err.message);
    }
  }

  if (loading) {
    return <div style={{ maxWidth: 700, margin: '40px auto', textAlign: 'center' }}>טוען צ'אט...</div>;
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: '0 20px', textAlign: 'right' }}>
      <h2>צ'אט התאמה</h2>
      <div 
        style={{ 
          border: '1px solid var(--border, #e2e8f0)', 
          borderRadius: 'var(--radius, 8px)', 
          height: '400px', 
          overflowY: 'auto', 
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          backgroundColor: '#fafafa'
        }}
      >
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#64748b', margin: 'auto' }}>אין עדיין הודעות בצ'אט זה</div>
        ) : (
          messages.map(msg => {
            const isMe = msg.sender_id === user?.id;
            return (
              <div 
                key={msg.id} 
                style={{
                  alignSelf: isMe ? 'flex-start' : 'flex-end',
                  backgroundColor: isMe ? 'var(--primary, #2563eb)' : '#e2e8f0',
                  color: isMe ? '#ffffff' : '#0f172a',
                  padding: '8px 14px',
                  borderRadius: '12px',
                  maxWidth: '75%',
                  wordBreak: 'break-word'
                }}
              >
                {msg.content}
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={sendMessage} style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <input 
          type="text" 
          value={text} 
          onChange={e => setText(e.target.value)}
          placeholder="הקלד הודעה..."
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: '6px',
            border: '1px solid var(--border, #cbd5e1)',
            outline: 'none'
          }}
        />
        <button 
          type="submit"
          style={{
            backgroundColor: 'var(--primary, #2563eb)',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 20px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          שלח
        </button>
      </form>
    </div>
  );
}