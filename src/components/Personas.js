import React, { useState } from 'react';
import PersonaAvatar from './PersonaAvatar';
// The import is correct.
import profilesData from '../data/persona_profiles.json';

const Personas = () => {
  const [selectedPersona, setSelectedPersona] = useState(null);

  // Guard clause: Check if the data or the nested 'personas' object is missing.
  if (!profilesData || !profilesData.personas) {
    // Log a helpful error to the console for debugging.
    console.error("Persona profiles data is missing or not in the expected format.", profilesData);
    // Render a loading or error state to prevent the app from crashing.
    return <div>Loading personas or data is unavailable...</div>;
  }

  // Access the nested 'personas' object for iteration.
  const personas = profilesData.personas;

  return (
    <div className="relative z-20 bg-orange-100/95 py-12 px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-black text-center mb-12 text-gray-800">The Five AI Personas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Use the corrected 'personas' variable */}
          {Object.entries(personas).map(([id, persona]) => (
            <div
              key={id}
              className={`bg-white/50 rounded-lg p-6 cursor-pointer transition-all hover:transform hover:-translate-y-1 hover:shadow-xl ${
                selectedPersona === id ? 'transform -translate-y-2 scale-105 shadow-2xl bg-white/80' : ''
              }`}
              style={{ borderLeft: `4px solid ${persona.color}` }}
              onMouseEnter={() => setSelectedPersona(id)}
              onMouseLeave={() => setSelectedPersona(null)}
            >
              <div className="w-16 h-16 mb-4">
                <PersonaAvatar personaId={id} />
              </div>
              <div className="text-xl font-bold mb-2" style={{ color: persona.color }}>
                {persona.name}
              </div>
              <div className="text-3xl font-black text-gray-800 mb-1">
                {persona.size.toLocaleString()} people
              </div>
              <div className="text-lg font-semibold text-gray-600 mb-3">
                {persona.percentage}% of participants
              </div>
              <div className="text-sm text-gray-600 leading-relaxed mb-4">
                {persona.description}
              </div>
              <div className="mt-4 text-xs text-gray-600">
                <div className="font-semibold">Fear Index: {(persona.features.fear_index * 100).toFixed(1)}%</div>
                <div className="mt-2">
                  <span className="font-semibold">Dataset Distribution:</span><br />
                  GD1: {persona.dataset_distribution.GD1.toLocaleString()} •
                  GD2: {persona.dataset_distribution.GD2.toLocaleString()} •
                  GD3: {persona.dataset_distribution.GD3.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Personas;
