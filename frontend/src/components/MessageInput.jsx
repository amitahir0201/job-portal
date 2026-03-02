import React, { useRef, useState, useEffect } from 'react';
import { Send, Loader } from 'lucide-react';

const MessageInput = ({ 
  onSendMessage, 
  disabled = false,
  isLoading = false,
  placeholder = 'Type a message...'
}) => {
  const [message, setMessage] = useState('');
  const textInputRef = useRef(null);

  // Auto-resize textarea logic
  useEffect(() => {
    if (textInputRef.current) {
      textInputRef.current.style.height = 'auto';
      const scrollHeight = textInputRef.current.scrollHeight;
      textInputRef.current.style.height = `${Math.min(scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    await onSendMessage({
      message: message.trim(),
    });

    setMessage('');
    textInputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && window.innerWidth > 768) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white border-t border-gray-100 p-3 sm:p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
      {/* Input Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-end gap-1.5 sm:gap-3">
          {/* Text Area - Mobile Friendly Expanding */}
          <div className="flex-1 relative flex items-center">
            <textarea
              ref={textInputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={disabled || isLoading}
              placeholder={placeholder}
              rows="1"
              className="w-full px-4 py-2.5 sm:py-3 bg-gray-100 focus:bg-white border-transparent focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-[22px] text-[15px] sm:text-base resize-none transition-all placeholder-gray-500 min-h-[44px] max-h-[120px] overflow-y-auto"
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={disabled || isLoading || !message.trim()}
            className={`flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-full shadow-sm transition-all active:scale-90 ${
              !message.trim()
                ? 'bg-gray-100 text-gray-400'
                : 'bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700'
            }`}
          >
            {isLoading ? (
              <Loader size={20} className="animate-spin" />
            ) : (
              <Send size={20} className={message.trim() ? "ml-0.5" : ""} />
            )}
          </button>
        </div>

        {/* Desktop Shortcut Info */}
        <div className="hidden sm:flex justify-between px-2 text-[10px] text-gray-400 font-medium">
          <p>Press Enter to send, Shift+Enter for new line</p>
          {message.length > 0 && <p>{message.length} characters</p>}
        </div>
      </div>
    </div>
  );
};

export default MessageInput;