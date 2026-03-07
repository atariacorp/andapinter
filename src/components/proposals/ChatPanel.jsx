import React, { useRef, useEffect, useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';

const ChatPanel = ({ 
  comments = [], 
  currentUser, 
  onSendComment, 
  commentText, 
  setCommentText,
  disabled = false,
  isDarkMode,
  colors // Prop tetap dipertahankan agar tidak error di parent
}) => {
  const chatContainerRef = useRef(null);
  const [particles, setParticles] = useState([]);

  // Generate random particles untuk efek Floating Gold Particles
  useEffect(() => {
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animDuration: Math.random() * 15 + 10,
      animDelay: Math.random() * -20,
      opacity: Math.random() * 0.3 + 0.1,
    }));
    setParticles(newParticles);
  }, []);

  // Auto-scroll to bottom when new comments arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [comments]);

  return (
    <div 
      className={`relative flex flex-col h-[400px] rounded-2xl overflow-hidden backdrop-blur-xl border transition-all duration-500 hover:shadow-2xl hover:shadow-[#d7a217]/10 group/container ${
        isDarkMode 
          ? 'bg-[#3c5654]/40 border-[#cadfdf]/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)]' 
          : 'bg-white/60 border-[#cadfdf]/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)]'
      }`}
    >
      {/* Background Aesthetic ECharts (Subtle Grid) & Particles */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04] dark:opacity-[0.06] z-0" 
        style={{ 
          backgroundImage: 'linear-gradient(#d7a217 1px, transparent 1px), linear-gradient(90deg, #d7a217 1px, transparent 1px)', 
          backgroundSize: '24px 24px' 
        }}
      />
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full bg-[#d7a217] animate-float-chat"
            style={{
              width: `${p.size}px`, height: `${p.size}px`,
              left: `${p.left}%`, top: `${p.top}%`,
              opacity: p.opacity,
              animationDuration: `${p.animDuration}s`,
              animationDelay: `${p.animDelay}s`,
              boxShadow: `0 0 ${p.size * 2}px #d7a217`,
            }}
          />
        ))}
      </div>

      {/* Header Glassmorphism */}
      <div className={`relative z-10 p-4 border-b flex items-center gap-3 backdrop-blur-md transition-colors ${
        isDarkMode ? 'bg-[#3c5654]/60 border-[#cadfdf]/10' : 'bg-white/50 border-[#cadfdf]/50'
      }`}>
        <div className="w-8 h-8 rounded-lg bg-[#d7a217]/20 flex items-center justify-center text-[#d7a217] shadow-inner">
          <MessageSquare size={16} />
        </div>
        <h3 className={`text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-[#e2eceb]' : 'text-[#425c5a]'}`}>
          Ruang Diskusi
        </h3>
        <span 
          className="ml-auto text-[9px] font-bold px-2.5 py-1 rounded-full shadow-sm"
          style={{ backgroundColor: '#d7a21720', color: '#d7a217', border: '1px solid #d7a21740' }}
        >
          {comments.length} Pesan
        </span>
      </div>
      
      {/* Messages Container */}
      <div 
        ref={chatContainerRef}
        className="relative z-10 flex-grow p-5 overflow-y-auto space-y-5 scroll-smooth custom-chat-scroll"
      >
        {comments.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-70 animate-in fade-in duration-700">
            <div className="w-16 h-16 rounded-full bg-[#d7a217]/10 flex items-center justify-center mb-4 shadow-inner">
              <MessageSquare size={28} className="text-[#d7a217]" />
            </div>
            <p className={`text-sm font-black uppercase tracking-widest ${isDarkMode ? 'text-[#cadfdf]' : 'text-[#425c5a]'}`}>
              Ruang Diskusi Kosong
            </p>
            <p className={`text-[11px] font-medium mt-1 ${isDarkMode ? 'text-[#cadfdf]/70' : 'text-[#3c5654]'}`}>
              Mulai percakapan analitik sekarang.
            </p>
          </div>
        ) : (
          comments.map((comment, index) => {
            const isMe = comment.sender === currentUser?.nama;
            return (
              <div key={index} className={`flex flex-col w-full group/msg animate-in slide-in-from-bottom-2 duration-300 ${isMe ? 'items-end' : 'items-start'}`}>
                
                {/* Meta Data Info */}
                <div className={`flex items-center gap-2 mb-1.5 px-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!isMe && (
                    <span className={`text-[10px] font-black uppercase tracking-wider ${isDarkMode ? 'text-[#cadfdf]' : 'text-[#3c5654]'}`}>
                      {comment.sender}
                    </span>
                  )}
                  {comment.role && !isMe && (
                    <span className="text-[8px] font-bold px-2 py-0.5 rounded-md bg-[#d7a217]/20 text-[#d7a217] border border-[#d7a217]/30">
                      {comment.role}
                    </span>
                  )}
                </div>
                
                {/* Bubble Chat - Parallax Hover Effect */}
                <div 
                  className={`relative p-4 max-w-[85%] text-[12px] font-medium leading-relaxed shadow-sm transition-all duration-300 transform group-hover/msg:-translate-y-1 group-hover/msg:shadow-md ${
                    isMe 
                      ? 'rounded-2xl rounded-tr-sm bg-gradient-to-br from-[#d7a217] to-[#b58812] text-white shadow-[#d7a217]/20' 
                      : `rounded-2xl rounded-tl-sm border ${
                          isDarkMode 
                            ? 'bg-[#3c5654]/80 text-[#e2eceb] border-[#cadfdf]/20' 
                            : 'bg-white/90 text-[#425c5a] border-[#cadfdf]/50'
                        }`
                  }`}
                >
                  {comment.text}
                </div>

                {/* Timestamp - Fade In on Hover */}
                <span className={`text-[9px] font-bold mt-1.5 px-1 transition-opacity duration-300 opacity-0 group-hover/msg:opacity-100 ${
                  isDarkMode ? 'text-[#cadfdf]/50' : 'text-[#3c5654]/50'
                }`}>
                  {new Date(comment.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </span>

              </div>
            );
          })
        )}
      </div>
      
      {/* Input Form Glassmorphism */}
      {!disabled && (
        <div className={`relative z-10 p-4 border-t backdrop-blur-xl transition-colors ${
          isDarkMode ? 'bg-[#3c5654]/50 border-[#cadfdf]/10' : 'bg-white/60 border-[#cadfdf]/50'
        }`}>
          <form onSubmit={onSendComment} className="flex gap-3 relative group/form">
            <input 
              type="text" 
              value={commentText} 
              onChange={(e) => setCommentText(e.target.value)} 
              placeholder="Ketik pesan analitik..." 
              className={`flex-1 px-4 py-3 rounded-xl text-xs font-medium outline-none transition-all duration-300 focus:ring-2 focus:ring-[#d7a217]/50 border shadow-inner ${
                isDarkMode 
                  ? 'bg-black/20 border-[#cadfdf]/20 text-[#e2eceb] placeholder-[#cadfdf]/40' 
                  : 'bg-white/80 border-[#cadfdf]/60 text-[#425c5a] placeholder-[#3c5654]/50'
              }`}
            />
            <button 
              type="submit" 
              disabled={!commentText?.trim()} 
              className="w-11 h-11 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#d7a217] to-[#c29115] text-white shadow-lg shadow-[#d7a217]/30 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(215,162,23,0.5)] disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none group-focus-within/form:shadow-[#d7a217]/50"
            >
              <Send size={16} className="ml-0.5 transform transition-transform group-hover/form:translate-x-0.5 group-hover/form:-translate-y-0.5" />
            </button>
          </form>
        </div>
      )}

      {/* Internal CSS for Chat Specific Animations and Custom Scrollbar */}
      <style jsx>{`
        @keyframes float-chat {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          20% { opacity: var(--opacity, 0.4); }
          80% { opacity: var(--opacity, 0.4); }
          100% { transform: translateY(-80px) translateX(20px) scale(0.8); opacity: 0; }
        }
        .animate-float-chat {
          animation-name: float-chat;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        
        /* Custom Scrollbar for ECharts Aesthetic */
        .custom-chat-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-chat-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-chat-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(215, 162, 23, 0.3);
          border-radius: 10px;
        }
        .custom-chat-scroll:hover::-webkit-scrollbar-thumb {
          background-color: rgba(215, 162, 23, 0.6);
        }
      `}</style>
    </div>
  );
};

export default ChatPanel;