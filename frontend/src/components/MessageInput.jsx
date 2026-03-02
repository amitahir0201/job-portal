import React, { useRef, useState, useEffect } from 'react';
import { Send, Paperclip, Smile, X, Loader } from 'lucide-react';

const MessageInput = ({ 
  onSendMessage, 
  disabled = false,
  isLoading = false,
  placeholder = 'Type a message...'
}) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [showEmojiMenu, setShowEmojiMenu] = useState(false);
  const fileInputRef = useRef(null);
  const textInputRef = useRef(null);

  const emojis = ['😊', '👍', '❤️', '🎉', '🚀', '✨', '💪', '🙏', '😂', '😍'];

  // Auto-resize textarea logic
  useEffect(() => {
    if (textInputRef.current) {
      textInputRef.current.style.height = 'inherit';
      const scrollHeight = textInputRef.current.scrollHeight;
      textInputRef.current.style.height = `${Math.min(scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSendMessage = async () => {
    if (!message.trim() && attachments.length === 0) return;

    await onSendMessage({
      message: message.trim(),
      attachments: attachments,
    });

    setMessage('');
    setAttachments([]);
    setShowEmojiMenu(false);
    textInputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && window.innerWidth > 768) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      
      reader.onload = (event) => {
        setAttachments((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            name: file.name,
            type: isImage ? 'image' : isVideo ? 'video' : 'file',
            size: file.size,
            url: event.target?.result,
            file: file,
          },
        ]);
      };
      
      if (isImage || isVideo) {
        reader.readAsDataURL(file);
      } else {
        setAttachments((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            name: file.name,
            type: 'file',
            size: file.size,
            file: file,
          },
        ]);
      }
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (id) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id));
  };

  const addEmoji = (emoji) => {
    setMessage((prev) => prev + emoji);
    // Keep focus on input after adding emoji for better mobile UX
    setTimeout(() => textInputRef.current?.focus(), 0);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white border-t border-gray-100 p-1.5 sm:p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
      {/* Attachment Preview - Horizontal Scroll for Mobile */}
      {attachments.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-3 mb-2 scrollbar-hide">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="relative flex-shrink-0 flex items-center gap-2 p-2 bg-gray-50 rounded-xl border border-gray-100 w-48 sm:w-60"
            >
              {attachment.type === 'image' ? (
                <img src={attachment.url} alt="" className="w-10 h-10 rounded-lg object-cover" />
              ) : (
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                  <Paperclip size={18} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-gray-900 truncate">{attachment.name}</p>
                <p className="text-[10px] text-gray-500">{formatFileSize(attachment.size)}</p>
              </div>
              <button
                onClick={() => removeAttachment(attachment.id)}
                className="absolute -top-1 -right-1 bg-white shadow-md rounded-full p-0.5 border border-gray-100 text-gray-400 hover:text-red-500"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-end gap-0.5 sm:gap-3">
          {/* Action Group */}
          <div className="flex items-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isLoading}
              className="p-1.5 sm:p-2.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors disabled:opacity-50"
            >
              <Paperclip size={20} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,video/*,.pdf,.doc,.docx,.txt"
            />

            <div className="relative hidden xs:block">
              <button
                onClick={() => setShowEmojiMenu(!showEmojiMenu)}
                disabled={disabled || isLoading}
                className={`p-2 sm:p-2.5 rounded-full transition-colors ${showEmojiMenu ? 'text-emerald-600 bg-emerald-50' : 'text-gray-500 hover:text-emerald-600 hover:bg-emerald-50'}`}
              >
                <Smile size={20} />
              </button>

              {showEmojiMenu && (
                <div className="absolute bottom-full left-0 mb-3 p-2 bg-white rounded-2xl shadow-2xl border border-gray-100 grid grid-cols-5 gap-1 z-50 animate-in slide-in-from-bottom-2 duration-200">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => addEmoji(emoji)}
                      className="p-1.5 text-xl hover:bg-gray-50 rounded-lg transition-transform active:scale-125"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

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
              className="w-full px-4 py-2 sm:py-3 bg-gray-100 focus:bg-white border-transparent focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-[22px] text-base sm:text-base resize-none transition-all placeholder-gray-500 max-h-[120px] overflow-y-auto"
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={disabled || isLoading || (!message.trim() && attachments.length === 0)}
            className={`flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-full shadow-sm transition-all active:scale-90 ${
              !message.trim() && attachments.length === 0
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