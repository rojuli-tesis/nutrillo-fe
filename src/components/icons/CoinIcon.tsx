import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

const CoinIcon: React.FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 64 64">
      <defs>
        <radialGradient id="coinGradient" cx="40%" cy="30%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#FFC107" />
          <stop offset="100%" stopColor="#FF9800" />
        </radialGradient>
      </defs>
      
      {/* Outer circle - coin rim */}
      <circle cx="32" cy="32" r="28" fill="url(#coinGradient)" />
      
      {/* Inner circle - coin face */}
      <circle cx="32" cy="32" r="24" fill="none" stroke="#FF9800" strokeWidth="2" opacity="0.6" />
      
      {/* Center symbol - simple N */}
      <text 
        x="32" 
        y="40" 
        fontSize="28" 
        fontWeight="bold" 
        fill="#FFFFFF" 
        textAnchor="middle" 
        fontFamily="Arial, sans-serif"
      >
        N
      </text>
      
      {/* Highlight for 3D effect */}
      <path 
        d="M 32 4 A 28 28 0 0 1 60 32" 
        fill="none" 
        stroke="#FFFFFF" 
        strokeWidth="2" 
        opacity="0.3" 
      />
    </SvgIcon>
  );
};

export default CoinIcon;
