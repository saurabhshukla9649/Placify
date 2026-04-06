"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export const UiverseAuroraTransition = () => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1000); // Aurora visible for 1 second before fading
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!isVisible && typeof window !== "undefined" && window.history.length > 0) {
     // Optional optimization: If we wanted to unmount 
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .aurora-transition-box {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 99999;
          pointer-events: none;
          opacity: 0;
          transition: opacity 800ms ease-in-out;
        }
        
        .aurora-transition-box.enter {
          opacity: 1;
          pointer-events: auto;
        }

        .aurora-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
              ellipse at 20% 30%,
              rgba(138, 43, 226, 0.8) 0%,
              rgba(138, 43, 226, 0) 60%
            ),
            radial-gradient(
              ellipse at 80% 50%,
              rgba(0, 191, 255, 0.7) 0%,
              rgba(0, 191, 255, 0) 70%
            ),
            radial-gradient(
              ellipse at 50% 80%,
              rgba(50, 205, 50, 0.6) 0%,
              rgba(50, 205, 50, 0) 65%
            ),
            linear-gradient(135deg, #000000 0%, #0a0520 100%);
          background-blend-mode: overlay, screen, hard-light;
          overflow: hidden;
          animation: aurora-drift 25s infinite alternate ease-in-out;
        }

        .aurora-container::before {
          content: "";
          position: absolute;
          width: 200%;
          height: 200%;
          top: -50%;
          left: -50%;
          background: repeating-linear-gradient(
              45deg,
              rgba(255, 255, 255, 0.02) 0px,
              rgba(255, 255, 255, 0.02) 1px,
              transparent 1px,
              transparent 40px
            ),
            repeating-linear-gradient(
              -45deg,
              rgba(255, 255, 255, 0.03) 0px,
              rgba(255, 255, 255, 0.03) 1px,
              transparent 1px,
              transparent 60px
            );
          animation: aurora-grid-shift 20s linear infinite;
        }

        .aurora-container::after {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            circle at center,
            transparent 70%,
            rgba(10, 5, 32, 0.9) 100%
          );
          animation: aurora-pulse 8s infinite alternate;
        }

        @keyframes aurora-drift {
          0% {
            background-position:
              0% 0%,
              0% 0%,
              0% 0%;
            filter: hue-rotate(0deg) brightness(1);
          }
          50% {
            background-position:
              -10% -5%,
              5% 10%,
              0% 15%;
            filter: hue-rotate(30deg) brightness(1.2);
          }
          100% {
            background-position:
              5% 10%,
              -10% -5%,
              15% 0%;
            filter: hue-rotate(60deg) brightness(1);
          }
        }

        @keyframes aurora-grid-shift {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(-50%, -50%);
          }
        }

        @keyframes aurora-pulse {
          0% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.05);
          }
          100% {
            opacity: 0.8;
            transform: scale(1);
          }
        }
      ` }} />
      <div className={`aurora-transition-box ${isVisible ? 'enter' : ''}`}>
        <div className="aurora-container"></div>
      </div>
    </>
  );
};
