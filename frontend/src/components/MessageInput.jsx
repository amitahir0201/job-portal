import React, { useRef, useState } from 'react';
import { Send, Paperclip, Smile, X, Loader } from 'lucide-react';

const MessageInput = ({ 
  onSendMessage, 
  disabled = false,
  isLoading = false,
  placeholder = 'Type your message...'
}) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [showEmojiMenu, setShowEmojiMenu] = useState(false);
  const fileInputRef = useRef(null);
  const textInputRef = useRef(null);

  const emojis = ['😊', '👍', '❤️', '🎉', '🚀', '✨', '💪', '🙏', '😂', '😍'];

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
    if (e.key === 'Enter' && !e.shiftKey) {
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

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (id) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id));
  };

  const addEmoji = (emoji) => {
    setMessage((prev) => prev + emoji);
    textInputRef.current?.focus();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="bg-white">
      {/* Attachment Preview */}
      {attachments.length > 0 && (
        <div className="px-4 pt-3 pb-2 border-b border-gray-100 space-y-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              {/* Attachment Thumbnail */}
              {attachment.type === 'image' && (
                <img
                  src={attachment.url}
                  alt={attachment.name}
                  className="w-12 h-12 rounded object-cover border border-gray-300"
                />
              )}
              {attachment.type === 'video' && (
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                  VIDEO
                </div>
              )}
              {attachment.type === 'file' && (
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-emerald-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 16.5a1 1 0 01-1-1V9.707l-3.146 3.147a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L9 9.707V15.5a1 1 0 01-1 1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {attachment.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(attachment.size)}
                </p>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeAttachment(attachment.id)}
                className="p-1.5 hover:bg-gray-300 rounded-lg transition-all flex-shrink-0"
                title="Remove attachment"
              >
                <X size={16} className="text-gray-700" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Section */}
      <div className="p-4 space-y-3">
        {/* Action Buttons + Text Input */}
        <div className="flex gap-2.5 items-end">
          {/* Attachment Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isLoading}
            className="p-2.5 hover:bg-gray-100 text-gray-600 hover:text-gray-800 rounded-lg transition-all flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Attach file"
            aria-label="Attach file"
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

          {/* Emoji Button */}
          <div className="relative">
            <button
              onClick={() => setShowEmojiMenu(!showEmojiMenu)}
              disabled={disabled || isLoading}
              className="p-2.5 hover:bg-gray-100 text-gray-600 hover:text-gray-800 rounded-lg transition-all flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Add emoji"
              aria-label="Add emoji"
            >
              <Smile size={20} />
            </button>

            {/* Emoji Menu */}
            {showEmojiMenu && (
              <div className="absolute bottom-full right-0 mb-2 p-3 bg-white rounded-xl shadow-xl border border-gray-200 grid grid-cols-5 gap-2 w-max z-50 animate-in fade-in scale-95 duration-200">
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      addEmoji(emoji);
                      setShowEmojiMenu(false);
                    }}
                    className="text-2xl hover:scale-125 transition-transform cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Text Input */}
          <textarea
            ref={textInputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={disabled || isLoading}
            placeholder={placeholder}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none max-h-28 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-50 focus:bg-white transition-all text-sm placeholder-gray-500 font-medium"
            rows="1"
          />

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={disabled || isLoading || (!message.trim() && attachments.length === 0)}
            className={`p-2.5 rounded-lg transition-all flex items-center justify-center min-w-[44px] h-[44px] flex-shrink-0 ${
              disabled || isLoading || (!message.trim() && attachments.length === 0)
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white hover:shadow-lg active:scale-95'
            }`}
            title="Send message (Enter)"
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>

        {/* Helper Text */}
        <p className="text-xs text-gray-500 px-2">
          Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-200 text-gray-700 font-semibold">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-200 text-gray-700 font-semibold">Shift+Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
};

export default MessageInput;
