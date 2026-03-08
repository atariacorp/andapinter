import React, { useRef, useEffect, useState } from 'react';
import { MessageSquare, Send, Check, CheckCheck } from 'lucide-react';
import PropTypes from 'prop-types';

const ChatPanel = ({ 
  comments = [], 
  currentUser, 
  onSendComment, 
  commentText, 
  setCommentText,
  disabled = false,
  isDarkMode,
  colors 
}) => {
  const chatContainerRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const [isSending, setIsSending] = useState(false);

  // Generate random particles untuk efek Floating Particles
  useEffect(() => {
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animDuration: Math.random() * 15 + 10,
      animDelay: Math.random() * -20,
      opacity: Math.random() * 0.2 + 0.05,
    }));
    setParticles(newParticles);
  }, []);

  // Auto-scroll to bottom when new comments arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      requestAnimationFrame(() => {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      });
    }
  }, [comments]);

  // Handler form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (commentText?.trim()) {
      onSendComment(e);
    }
  };

  return (
    <div 
      className={`relative flex flex-col h-[500px] rounded-3xl overflow-hidden backdrop-blur-2xl border transition-all duration-500 shadow-2xl group/container ${
        isDarkMode 
          ? 'bg-gradient-to-br from-[#1a2b29]/80 to-[#152322]/90 border-[#cadfdf]/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]' 
          : 'bg-gradient-to-br from-white/90 to-[#f8fafc]/90 border-[#cadfdf]/40 shadow-[0_20px_50px_rgba(66,92,90,0.1)]'
      }`}
    >
      {/* Ambient Glows */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#10b981] blur-[100px] opacity-10 pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#3b82f6] blur-[100px] opacity-10 pointer-events-none z-0"></div>

      {/* Background Aesthetic (Subtle Grid) & Particles */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] z-0" 
        style={{ 
          backgroundImage: 'linear-gradient(#cadfdf 1px, transparent 1px), linear-gradient(90deg, #cadfdf 1px, transparent 1px)', 
          backgroundSize: '24px 24px' 
        }}
      />
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full bg-[#10b981] dark:bg-[#3b82f6] animate-float-chat mix-blend-screen"
            style={{
              width: `${p.size}px`, height: `${p.size}px`,
              left: `${p.left}%`, top: `${p.top}%`,
              opacity: p.opacity,
              animationDuration: `${p.animDuration}s`,
              animationDelay: `${p.animDelay}s`,
              boxShadow: `0 0 ${p.size * 3}px rgba(16, 185, 129, 0.4)`,
            }}
          />
        ))}
      </div>

      {/* Header Premium Glassmorphism */}
      <div className={`relative z-10 p-5 border-b flex items-center justify-between backdrop-blur-xl transition-colors shadow-sm ${
        isDarkMode ? 'bg-[#152322]/80 border-[#cadfdf]/10' : 'bg-white/80 border-[#cadfdf]/30'
      }`}>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-[#10b981] blur-md opacity-40 rounded-xl"></div>
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center text-white shadow-lg border border-white/20">
              <MessageSquare size={18} />
            </div>
          </div>
          <div>
            <h3 className={`text-sm font-black uppercase tracking-[0.15em] ${isDarkMode ? 'text-white' : 'text-[#425c5a]'}`}>
              Ruang Diskusi
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-[#cadfdf]/70' : 'text-[#3c5654]/70'}`}>
                Live Chat Aktif
              </span>
            </div>
          </div>
        </div>
        <span 
          className="text-[10px] font-black px-3 py-1.5 rounded-lg shadow-inner border"
          style={{ 
            backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)', 
            color: '#10b981', 
            borderColor: 'rgba(16, 185, 129, 0.2)' 
          }}
        >
          {comments.length} Pesan
        </span>
      </div>
      
      {/* Messages Container */}
      <div 
        ref={chatContainerRef}
        className="relative z-10 flex-grow p-6 overflow-y-auto space-y-6 scroll-smooth custom-chat-scroll"
      >
        {comments.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-70 animate-in fade-in duration-700">
            <div className="relative w-20 h-20 mb-5">
              <div className="absolute inset-0 bg-[#425c5a] blur-xl opacity-10 rounded-full"></div>
              <div className={`relative flex items-center justify-center w-full h-full rounded-full border border-dashed ${isDarkMode ? 'border-[#cadfdf]/20 bg-black/10' : 'border-[#cadfdf]/60 bg-white/50'}`}>
                <MessageSquare size={32} className={isDarkMode ? 'text-[#cadfdf]/50' : 'text-[#425c5a]/40'} />
              </div>
            </div>
            <p className={`text-sm font-black uppercase tracking-[0.15em] mb-1 ${isDarkMode ? 'text-[#cadfdf]' : 'text-[#425c5a]'}`}>
              Ruang Diskusi Kosong
            </p>
            <p className={`text-xs font-medium text-center max-w-[200px] ${isDarkMode ? 'text-[#cadfdf]/60' : 'text-[#3c5654]/70'}`}>
              Jadilah yang pertama memulai percakapan analitik pada dokumen ini.
            </p>
          </div>
        ) : (
          comments.map((comment, index) => {
            const isMe = comment.sender === currentUser?.nama || comment.sender === 'SAYA' || comment.isMine;
            
            const bubbleColors = isMe 
              ? 'bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white shadow-[0_5px_15px_rgba(59,130,246,0.3)]'
              : 'bg-gradient-to-br from-[#10b981] to-[#059669] text-white shadow-[0_5px_15px_rgba(16,185,129,0.3)]';

            const alignmentClass = isMe ? 'items-end' : 'items-start';
            const borderRadiusClass = isMe ? 'rounded-2xl rounded-tr-sm' : 'rounded-2xl rounded-tl-sm';

            return (
              <div key={index} className={`flex flex-col w-full group/msg animate-in slide-in-from-bottom-3 fade-in duration-500 ${alignmentClass}`}>
                
                <div className={`flex items-center gap-2 mb-1.5 px-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-[#cadfdf]/80' : 'text-[#425c5a]/80'}`}>
                    {isMe ? 'Anda' : comment.sender}
                  </span>
                  
                  {comment.role && !isMe && (
                    <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30">
                      {comment.role}
                    </span>
                  )}
                </div>
                
                <div className="relative max-w-[85%] sm:max-w-[75%]">
                  <div 
                    className={`relative p-4 text-sm font-medium leading-relaxed transition-all duration-300 transform group-hover/msg:-translate-y-0.5 border border-white/10 ${borderRadiusClass} ${bubbleColors}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover/msg:opacity-100 transition-opacity duration-500 pointer-events-none rounded-inherit"></div>
                    
                    <p className="relative z-10 drop-shadow-sm">{comment.text}</p>
                  </div>

                  <div className={`flex items-center gap-1.5 mt-1.5 px-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <span className={`text-[9px] font-bold tracking-widest opacity-0 group-hover/msg:opacity-100 transition-opacity duration-300 ${
                      isDarkMode ? 'text-[#cadfdf]/60' : 'text-[#3c5654]/60'
                    }`}>
                      {new Date(comment.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    
                    {isMe && (
                      <div className="opacity-0 group-hover/msg:opacity-100 transition-opacity duration-300 delay-100">
                         <CheckCheck size={12} className="text-[#3b82f6]" />
                      </div>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>
      
      {/* Input Form */}
      {!disabled && (
        <div className={`relative z-10 p-5 border-t backdrop-blur-2xl transition-colors ${
          isDarkMode ? 'bg-[#152322]/80 border-[#cadfdf]/10' : 'bg-white/80 border-[#cadfdf]/30'
        }`}>
          <form onSubmit={handleSubmit} className="flex items-end gap-3 relative group/form">
            <div className="flex-1 relative">
              <textarea 
                value={commentText} 
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Ketik balasan Anda..." 
                className={`w-full px-5 py-3.5 rounded-2xl text-sm font-medium outline-none transition-all duration-300 focus:ring-2 focus:ring-[#3b82f6]/50 border shadow-inner resize-none min-h-[50px] max-h-[120px] custom-chat-scroll ${
                  isDarkMode 
                    ? 'bg-[#1a2b29] border-[#cadfdf]/20 text-[#e2eceb] placeholder-[#cadfdf]/40' 
                    : 'bg-slate-50 border-[#cadfdf]/60 text-[#425c5a] placeholder-[#3c5654]/50'
                }`}
                rows={1}
              />
              <div className="absolute right-4 bottom-3 opacity-0 group-focus-within/form:opacity-100 transition-opacity duration-300 pointer-events-none">
                 <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-black/5 dark:bg-white/5 px-2 py-1 rounded">
                   Enter ↵
                 </span>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={!commentText?.trim()} 
              className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-2xl text-white shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none group-focus-within/form:shadow-[0_0_20px_rgba(59,130,246,0.4)] ${
                !commentText?.trim() 
                  ? 'bg-slate-400 dark:bg-slate-600 shadow-none' 
                  : 'bg-gradient-to-br from-[#3b82f6] to-[#2563eb] shadow-[#3b82f6]/30'
              }`}
            >
              <Send size={18} className={`transform transition-transform ${commentText?.trim() ? 'group-hover/form:translate-x-0.5 group-hover/form:-translate-y-0.5' : ''} ${!commentText?.trim() ? 'opacity-50' : 'opacity-100 drop-shadow-md'}`} />
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
        
        .custom-chat-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .custom-chat-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-chat-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(66, 92, 90, 0.2);
          border-radius: 10px;
        }
        .dark .custom-chat-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(202, 223, 223, 0.2);
        }
        .custom-chat-scroll:hover::-webkit-scrollbar-thumb {
          background-color: rgba(66, 92, 90, 0.4);
        }
        .dark .custom-chat-scroll:hover::-webkit-scrollbar-thumb {
          background-color: rgba(202, 223, 223, 0.4);
        }

        textarea {
          -webkit-appearance: none;
        }
      `}</style>
    </div>
  );
};

ChatPanel.propTypes = {
  comments: PropTypes.array,
  currentUser: PropTypes.object,
  onSendComment: PropTypes.func.isRequired,
  commentText: PropTypes.string,
  setCommentText: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  isDarkMode: PropTypes.bool,
  colors: PropTypes.object
};

export default ChatPanel;