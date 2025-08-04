import React from 'react';

const MaramesaLogoTransparent: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-fit relative z-50 ${className}`}>
      <style>
        {`
          @keyframes pulseGlow {
            0%, 100% {
              opacity: 0.9;
              box-shadow: 0 0 12px #00cfff55, 0 0 20px #00cfff44, 0 0 30px #00cfff33;
            }
            50% {
              opacity: 1;
              box-shadow: 0 0 20px #00cfffaa, 0 0 30px #00cfff88, 0 0 40px #00cfff55;
            }
          }

          .logo-container {
            animation: pulseGlow 8s infinite ease-in-out;
            background-color: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(2px);
            border-radius: 0.5rem;
            padding: 0.75rem 1.25rem;
          }

          .line {
            height: 4px;
            background-color: white;
            border-radius: 2px;
            margin-top: 0.2rem;
          }
        `}
      </style>

      <div className="logo-container text-white font-extrabold text-2xl sm:text-3xl tracking-wide leading-tight">
        <div className="flex flex-col">
          <span className="block leading-none">MARAMESA</span>
          <div className="flex items-center gap-2 mt-1">
          <div className="line w-16 sm:w-24"></div>
            <span className="text-sm italic font-semibold whitespace-nowrap">GROUP</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaramesaLogoTransparent;
