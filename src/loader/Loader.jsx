import React from 'react';

const Loader3D = () => {
  const spinnerStyle = {
    width: '56px',
    height: '56px',
    display: 'grid',
    color: '#004dff',
    background:
      'radial-gradient(farthest-side, currentColor calc(100% - 7px), #0000 calc(100% - 6px) 0)',
    WebkitMask:
      'radial-gradient(farthest-side, #0000 calc(100% - 15px), #000 calc(100% - 13px))',
    borderRadius: '50%',
    animation: 'spinner-sm4bhi 2s infinite linear'
  };

  const spinnerBeforeAfterStyle = {
    content: '""',
    gridArea: '1/1',
    background:
      'linear-gradient(currentColor 0 0) center, linear-gradient(currentColor 0 0) center',
    backgroundSize: '100% 11px, 11px 100%',
    backgroundRepeat: 'no-repeat'
  };

  const spinnerAfterStyle = {
    ...spinnerBeforeAfterStyle,
    transform: 'rotate(45deg)'
  };

  const keyframes = `
    @keyframes spinner-sm4bhi {
      100% { transform: rotate(1turn); }
    }
  `;

  return (
    <>
      <style>
        {keyframes}
      </style>
      <div style={spinnerStyle}>
        <div style={spinnerBeforeAfterStyle}></div>
        <div style={spinnerAfterStyle}></div>
      </div>
    </>
  );
};

export default Loader3D;
