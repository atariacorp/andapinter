import React, { useRef, useEffect } from 'react';
import { MessageSquare, Send } from 'lucide-react';

const ChatPanel = ({ 
  comments = [], 
  currentUser, 
  onSendComment, 
  commentText, 
  setCommentText,
  disabled = false 
}) => {
  const chatContainerRef = useRef(null);

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
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col h-[350px] transition-colors">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 rounded-t-2xl flex items-center gap-2">
        <MessageSquare size={16} className="text-blue-600 dark:text-blue-400"/>
        <h3 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">
          Ruang Diskusi
        </h3>
        <span className="ml-auto text-[8px] bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full">
          {comments.length} pesan
        </span>
      </div>
      
      {/* Messages Container */}
      <div 
        ref={chatContainerRef}
        className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-900/20 scrollbar-thin"
      >
        {comments.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400 italic font-medium">
            <div className="text-center">
              <MessageSquare size={24} className="mx-auto mb-2 opacity-30" />
              <p>Belum ada diskusi</p>
            </div>
          </div>
        ) : (
          comments.map((comment, index) => {
            const isMe = comment.sender === currentUser?.nama;
            return (
              <div key={index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 mb-1">
                  {comment.sender} • {new Date(comment.timestamp).toLocaleTimeString('id-ID', {
                    hour: '2-digit', 
                    minute: '2-digit'
                  })}
                </span>
                <div className={`p-3 rounded-xl max-w-[85%] text-xs font-medium leading-relaxed shadow-sm ${
                  isMe 
                    ? 'bg-blue-600 text-white rounded-tr-sm' 
                    : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-tl-sm'
                }`}>
                  {comment.text}
                </div>
                {comment.role && !isMe && (
                  <span className="text-[8px] text-slate-400 mt-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full">
                    {comment.role}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
      
      {/* Input Form */}
      {!disabled && (
        <div className="p-3 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-b-2xl">
          <form onSubmit={onSendComment} className="flex gap-2">
            <input 
              type="text" 
              value={commentText} 
              onChange={(e) => setCommentText(e.target.value)} 
              placeholder="Tulis pesan..." 
              className="flex-grow p-2.5 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-none rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 font-medium" 
            />
            <button 
              type="submit" 
              disabled={!commentText?.trim()} 
              className="p-2.5 bg-blue-600 text-white rounded-xl disabled:opacity-50 hover:bg-blue-700 transition-colors"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatPanel;