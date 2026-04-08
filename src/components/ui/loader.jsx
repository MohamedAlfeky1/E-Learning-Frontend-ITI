import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="wrap">

        <div className="particles">
          <div className="dot" style={{ left: '10%',  background: '#973BED', animationDelay: '0s',    animationDuration: '1.8s' }} />
          <div className="dot" style={{ left: '22%',  background: '#007CFF', animationDelay: '0.3s',  animationDuration: '2.1s' }} />
          <div className="dot" style={{ left: '38%',  background: '#FFC800', animationDelay: '0.6s',  animationDuration: '1.6s' }} />
          <div className="dot" style={{ left: '52%',  background: '#FF00FF', animationDelay: '0.9s',  animationDuration: '2.3s' }} />
          <div className="dot" style={{ left: '65%',  background: '#00E0ED', animationDelay: '0.2s',  animationDuration: '1.9s' }} />
          <div className="dot" style={{ left: '78%',  background: '#00DA72', animationDelay: '0.7s',  animationDuration: '2.0s' }} />
          <div className="dot" style={{ left: '90%',  background: '#973BED', animationDelay: '1.1s',  animationDuration: '1.7s' }} />
        </div>

        <svg viewBox="0 0 320 80" height="80" width="320" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="g1" gradientUnits="userSpaceOnUse" x1="0" y1="62" x2="0" y2="2">
              <stop stopColor="#973BED" />
              <stop stopColor="#007CFF" offset="1" />
            </linearGradient>
            <linearGradient id="g2" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="64">
              <stop stopColor="#FFC800" />
              <stop stopColor="#FF00FF" offset="1" />
              <animateTransform
                repeatCount="indefinite"
                keySplines=".42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1"
                keyTimes="0;0.125;0.25;0.375;0.5;0.625;0.75;0.875;1"
                dur="8s"
                values="0 32 32;-270 32 32;-270 32 32;-540 32 32;-540 32 32;-810 32 32;-810 32 32;-1080 32 32;-1080 32 32"
                type="rotate"
                attributeName="gradientTransform"
              />
            </linearGradient>
            <linearGradient id="g3" gradientUnits="userSpaceOnUse" x1="0" y1="62" x2="0" y2="2">
              <stop stopColor="#00E0ED" />
              <stop stopColor="#00DA72" offset="1" />
            </linearGradient>

            <mask id="m1"><text x="0"   y="68" fontFamily="sans-serif" fontSize="80" fontWeight="700" fill="white">N</text></mask>
            <mask id="m2"><text x="58"  y="68" fontFamily="sans-serif" fontSize="80" fontWeight="700" fill="white">e</text></mask>
            <mask id="m3"><text x="110" y="68" fontFamily="sans-serif" fontSize="80" fontWeight="700" fill="white">x</text></mask>
            <mask id="m4"><text x="162" y="68" fontFamily="sans-serif" fontSize="80" fontWeight="700" fill="white">o</text></mask>
            <mask id="m5"><text x="218" y="68" fontFamily="sans-serif" fontSize="80" fontWeight="700" fill="white">r</text></mask>
            <mask id="m6"><text x="252" y="68" fontFamily="sans-serif" fontSize="80" fontWeight="700" fill="white">a</text></mask>
          </defs>

          <g className="letter-n"><rect x="0"   y="0" width="58" height="80" fill="url(#g1)" mask="url(#m1)" /></g>
          <g className="letter-e"><rect x="58"  y="0" width="60" height="80" fill="url(#g2)" mask="url(#m2)" /></g>
          <g className="letter-x"><rect x="110" y="0" width="60" height="80" fill="url(#g3)" mask="url(#m3)" /></g>
          <g className="letter-o"><rect x="162" y="0" width="64" height="80" fill="url(#g1)" mask="url(#m4)" /></g>
          <g className="letter-r"><rect x="218" y="0" width="42" height="80" fill="url(#g2)" mask="url(#m5)" /></g>
          <g className="letter-a"><rect x="252" y="0" width="60" height="80" fill="url(#g3)" mask="url(#m6)" /></g>
        </svg>

      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 0;
    gap: 1rem;
  }

  .particles {
    position: relative;
    width: 320px;
    height: 20px;
  }

  .dot {
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    bottom: 0;
    animation: floatDot 2s ease-in-out infinite;
    opacity: 0;
  }

  .letter-n { animation: slideInLetter 0.6s cubic-bezier(.22,1,.36,1) 0s   both, shimmer 2s ease-in-out 0.6s  infinite; }
  .letter-e { animation: slideInLetter 0.6s cubic-bezier(.22,1,.36,1) 0.1s both, shimmer 2s ease-in-out 0.7s  infinite; }
  .letter-x { animation: slideInLetter 0.6s cubic-bezier(.22,1,.36,1) 0.2s both, shimmer 2s ease-in-out 0.8s  infinite; }
  .letter-o { animation: slideInLetter 0.6s cubic-bezier(.22,1,.36,1) 0.3s both, shimmer 2s ease-in-out 0.9s  infinite; }
  .letter-r { animation: slideInLetter 0.6s cubic-bezier(.22,1,.36,1) 0.4s both, shimmer 2s ease-in-out 1.0s  infinite; }
  .letter-a { animation: slideInLetter 0.6s cubic-bezier(.22,1,.36,1) 0.5s both, shimmer 2s ease-in-out 1.1s  infinite; }

  @keyframes floatDot {
    0%   { transform: translateY(0px);   opacity: 0; }
    20%  { opacity: 1; }
    100% { transform: translateY(-28px); opacity: 0; }
  }

  @keyframes slideInLetter {
    0%   { opacity: 0; transform: translateY(30px); }
    60%  { opacity: 1; transform: translateY(-4px); }
    80%  { transform: translateY(2px); }
    100% { opacity: 1; transform: translateY(0px); }
  }

  @keyframes shimmer {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.35; }
  }
`;

export default Loader;