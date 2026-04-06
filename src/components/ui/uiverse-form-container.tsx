"use client";

import React from "react";

interface UiverseFormContainerProps {
  title: string;
  children: React.ReactNode;
  actionText?: React.ReactNode;
  onAction?: () => void;
  className?: string;
}

export const UiverseFormContainer: React.FC<UiverseFormContainerProps> = ({ 
  title, 
  children, 
  actionText, 
  onAction,
  className = "" 
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      <style dangerouslySetInnerHTML={{ __html: `
        .uiverse-container {
          width: 100%;
          max-width: 100%;
          background: #F8F9FD;
          background: linear-gradient(0deg, rgb(255, 255, 255) 0%, rgb(244, 247, 251) 100%);
          border-radius: 40px;
          padding: 25px 35px;
          border: 5px solid rgb(255, 255, 255);
          box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 30px 30px -20px;
          margin-bottom: 20px;
        }

        .uiverse-heading {
          text-align: center;
          font-weight: 900;
          font-size: 30px;
          color: rgb(16, 137, 211);
        }

        .uiverse-form {
          margin-top: 20px;
        }

        .uiverse-form .uiverse-input,
        .uiverse-form textarea {
          width: 100%;
          background: white;
          border: none;
          padding: 15px 20px;
          border-radius: 20px;
          margin-top: 15px;
          box-shadow: #cff0ff 0px 10px 10px -5px;
          border-inline: 2px solid transparent;
          color: #333;
        }

        .uiverse-form .uiverse-input::-moz-placeholder,
        .uiverse-form textarea::-moz-placeholder {
          color: rgb(170, 170, 170);
        }

        .uiverse-form .uiverse-input::placeholder,
        .uiverse-form textarea::placeholder {
          color: rgb(170, 170, 170);
        }

        .uiverse-form .uiverse-input:focus,
        .uiverse-form textarea:focus {
          outline: none;
          border-inline: 2px solid #12B1D1;
        }

        .uiverse-form .login-button {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          font-weight: bold;
          background: linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%);
          color: white;
          padding-block: 15px;
          margin: 20px auto;
          border-radius: 20px;
          box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 20px 10px -15px;
          border: none;
          transition: all 0.2s ease-in-out;
          cursor: pointer;
        }

        .uiverse-form .login-button:hover:not(:disabled) {
          transform: scale(1.01);
          box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 23px 10px -20px;
        }

        .uiverse-form .login-button:active:not(:disabled) {
          transform: scale(0.98);
          box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 15px 10px -10px;
        }
        
        .uiverse-form .login-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      ` }} />
      <div className="uiverse-container">
        <div className="uiverse-heading">{title}</div>
        <div className="uiverse-form">
          {children}
          {actionText && (
            <button className="login-button mt-6" onClick={onAction} type="button">
              {actionText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
