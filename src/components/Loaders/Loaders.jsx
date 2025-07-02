import React from 'react';

const Loader = () => (
  <div
    style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(15, 23, 42, 0.9)', // dark translucent background
      display: 'flex',
      justifyContent: 'center', // center horizontally
      alignItems: 'center',     // center vertically
      position: 'relative',
      top: 0,
      left: 0,
      zIndex: 9999,
    }}
  >
    <div
      className="hole"
      style={{
        position: 'relative',
        width: 100,
        height: 100,
      }}
    >
      {[...Array(10)].map((_, i) => (
        <i
          key={i}
          style={{
            position: 'absolute',
            width: 50,
            height: 50,
            borderRadius: 140,
            opacity: 0,
            animationName: 'scale',
            animationDuration: '3s',
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
            animationDelay: `${0.3 * (i + 1)}s`,
          }}
        />
      ))}
    </div>

    <style>{`
      @keyframes scale {
        0% {
          transform: scale(2);
          opacity: 0;
          box-shadow: 0 0 50px rgba(255, 255, 255, 0.5);
        }
        50% {
          transform: scale(1) translate(0, -5px);
          opacity: 1;
          box-shadow: 0 8px 20px rgba(255, 255, 255, 0.5);
        }
        100% {
          transform: scale(0.1) translate(0, 5px);
          opacity: 0;
          box-shadow: 0 10px 20px rgba(255, 255, 255, 0);
        }
      }
    `}</style>
  </div>
);

export default Loader;
