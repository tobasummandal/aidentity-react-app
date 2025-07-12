import React from 'react';

const PersonaAvatar = ({ personaId }) => {
  const avatars = {
    0: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="40" fill="#7994b5" opacity="0.2"/>
        <rect x="35" y="35" width="30" height="30" fill="#7994b5" opacity="0.8" rx="5"/>
        <circle cx="50" cy="50" r="15" fill="#312c25"/>
        <path d="M40 40 L60 40 L60 45 L55 50 L45 50 L40 45 Z" fill="#f3dbba"/>
        <circle cx="45" cy="55" r="2" fill="#7994b5"/>
        <circle cx="55" cy="55" r="2" fill="#7994b5"/>
      </svg>
    ),
    1: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="40" fill="#93b778" opacity="0.2"/>
        <circle cx="35" cy="35" r="8" fill="#93b778"/>
        <circle cx="65" cy="35" r="8" fill="#93b778"/>
        <circle cx="35" cy="65" r="8" fill="#93b778"/>
        <circle cx="65" cy="65" r="8" fill="#93b778"/>
        <circle cx="50" cy="50" r="12" fill="#312c25"/>
        <path d="M35 35 L50 50 L65 35 M35 65 L50 50 L65 65" stroke="#312c25" strokeWidth="2" fill="none"/>
      </svg>
    ),
    2: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="40" fill="#d17c3f" opacity="0.2"/>
        <polygon points="50,20 65,35 65,65 50,80 35,65 35,35" fill="#d17c3f" opacity="0.8"/>
        <circle cx="50" cy="50" r="12" fill="#312c25"/>
        <path d="M40 45 L60 45 M40 55 L60 55" stroke="#f3dbba" strokeWidth="2"/>
        <circle cx="42" cy="40" r="1.5" fill="#d17c3f"/>
        <circle cx="58" cy="40" r="1.5" fill="#d17c3f"/>
      </svg>
    ),
    3: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="40" fill="#b63e36" opacity="0.2"/>
        <path d="M50 15 L70 30 L70 70 L50 85 L30 70 L30 30 Z" fill="#b63e36" opacity="0.8"/>
        <circle cx="50" cy="50" r="10" fill="#312c25"/>
        <path d="M45 30 L55 30 L55 40 L45 40 Z M45 60 L55 60 L55 70 L45 70 Z" fill="#f3dbba"/>
        <rect x="47" y="47" width="6" height="6" fill="#b63e36"/>
      </svg>
    ),
    4: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="40" fill="#be7249" opacity="0.2"/>
        <rect x="25" y="25" width="50" height="50" fill="#be7249" opacity="0.8" rx="5"/>
        <circle cx="50" cy="50" r="8" fill="#312c25"/>
        <path d="M35 35 L65 35 M35 45 L65 45 M35 55 L65 55 M35 65 L65 65" stroke="#f3dbba" strokeWidth="1.5"/>
        <circle cx="40" cy="40" r="1" fill="#be7249"/>
        <circle cx="60" cy="40" r="1" fill="#be7249"/>
      </svg>
    )
  };
  
  return avatars[personaId] || null;
};

export default PersonaAvatar;
