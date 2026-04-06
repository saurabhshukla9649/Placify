import React from "react";
import { Send, Mic, Square } from "lucide-react";

export interface UiverseChatInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onSubmit'> {
  onSendAction?: () => void;
  containerClassName?: string;
  onMicToggle?: () => void;
  isRecording?: boolean;
}

export const UiverseChatInput: React.FC<UiverseChatInputProps> = ({
  containerClassName = "",
  onSendAction,
  onMicToggle,
  isRecording = false,
  disabled,
  ...props
}) => {
  return (
    <div className={`relative flex w-full ${containerClassName}`}>
      <style dangerouslySetInnerHTML={{
        __html: `
        .chat-input__container {
          position: relative;
          background: rgba(255, 255, 255, 0.664);
          padding: 10px 15px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 5px;
          border-radius: 22px;
          width: 100%;
          max-width: 100% !important; /* Overriden for chat layout */
          transition: transform 400ms;
          transform-style: preserve-3d;
          transform: rotateX(5deg) rotateY(-5deg);
          perspective: 500px;
        }

        .chat-input__container:hover, .chat-input__container:focus-within {
          transform: rotateX(0deg) rotateY(0deg);
        }

        .chat-shadow__input {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          bottom: 0;
          z-index: -1;
          filter: blur(30px);
          border-radius: 20px;
          background-color: #999cff;
          background-image: radial-gradient(at 85% 51%, hsla(60,60%,61%,1) 0px, transparent 50%),
            radial-gradient(at 74% 68%, hsla(235,69%,77%,1) 0px, transparent 50%),
            radial-gradient(at 64% 79%, hsla(284,72%,73%,1) 0px, transparent 50%),
            radial-gradient(at 75% 16%, hsla(283,60%,72%,1) 0px, transparent 50%),
            radial-gradient(at 90% 65%, hsla(153,70%,64%,1) 0px, transparent 50%),
            radial-gradient(at 91% 83%, hsla(283,74%,69%,1) 0px, transparent 50%),
            radial-gradient(at 72% 91%, hsla(213,75%,75%,1) 0px, transparent 50%);
        }

        .chat-input__button {
          cursor: pointer;
          border: none;
          background: none;
          transition: transform 400ms, background 400ms;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 12px;
          padding: 8px;
        }

        .chat-input__button:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.411);
        }
        
        .chat-input__button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .chat-input__field {
          width: 100%;
          border-radius: 20px;
          outline: none;
          border: none;
          padding: 10px;
          position: relative;
          background: transparent;
          color: #333;
          font-size: 16px;
        }
        
        .chat-input__field::placeholder {
          color: rgba(0, 0, 0, 0.5);
        }
        
        .chat-input__field:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .recording-pulse {
          animation: pulse-glow 1.5s infinite;
          background: rgba(239, 68, 68, 0.2);
          border-radius: 12px;
        }

        @keyframes pulse-glow {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      ` }} />
      <div className="chat-input__container w-full">
        <div className="chat-shadow__input"></div>
        <input
          type="text"
          className="chat-input__field flex-1"
          disabled={disabled}
          {...props}
        />
        {onMicToggle && (
          <button
            onClick={onMicToggle}
            className={`chat-input__button ${isRecording ? 'recording-pulse text-red-500' : 'text-gray-800'}`}
            type="button"
            aria-label="Toggle Microphone"
            disabled={disabled && !isRecording}
          >
            {isRecording ? <Square className="h-5 w-5 fill-current" /> : <Mic className="h-5 w-5" />}
          </button>
        )}
        <button
          onClick={onSendAction}
          className="chat-input__button text-gray-800"
          type="button"
          aria-label="Send"
          disabled={disabled || props.value === ''}
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
