import React, { useState } from 'react';
import PersonaAvatar from './PersonaAvatar';
import questions from '../data/questions.json';
import personas from '../data/persona_profiles.json';

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const selectAnswer = (score) => {
    const newAnswers = [...quizAnswers];
    newAnswers[currentQuestion] = score;
    setQuizAnswers(newAnswers);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setQuizCompleted(true);
      }
    }, 500);
  };

  const calculatePersona = () => {
    const social_fear = quizAnswers[2] || 1;
    const safety_fear = quizAnswers[3] || 1;
    const cultural_fear = quizAnswers[4] || 1;
    const dependency = quizAnswers[5] || 1;
    
    if (dependency >= 4) return { ...personas.personas[0], id: 0 };
    if (safety_fear >= 4) return { ...personas.personas[3], id: 3 };
    if (cultural_fear >= 4) return { ...personas.personas[4], id: 4 };
    if (social_fear >= 4) return { ...personas.personas[2], id: 2 };
    return { ...personas.personas[1], id: 1 };
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setQuizAnswers([]);
    setQuizCompleted(false);
  };

  if (quizCompleted) {
    const persona = calculatePersona();
    return (
      <div className="text-center">
        <h2 className="text-3xl font-black text-gray-800 mb-4">Your AI Persona</h2>
        <div 
          className="rounded-lg p-8 mx-auto max-w-lg"
          style={{
            background: `linear-gradient(135deg, ${persona.color}22, ${persona.color}11)`,
            border: `2px solid ${persona.color}`
          }}
        >
          <div className="w-20 h-20 mx-auto mb-4">
            <PersonaAvatar personaId={persona.id} />
          </div>
          <h3 className="text-2xl font-bold mb-4" style={{ color: persona.color }}>
            {persona.name}
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">{persona.description}</p>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <div className="text-2xl font-bold" style={{ color: persona.color }}>
                {persona.size.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">people like you</div>
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: persona.color }}>
                {persona.percentage}%
              </div>
              <div className="text-sm text-gray-600">of participants</div>
            </div>
          </div>
        </div>
        <button 
          onClick={resetQuiz}
          className="mt-6 px-8 py-3 bg-gray-800 text-orange-100 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Take Quiz Again
        </button>
      </div>
    );
  }

  const question = questions[currentQuestion];
  return (
    <div className="mb-8">
      <div className="text-center mb-4">
        <span className="inline-block px-4 py-2 bg-gray-800 text-orange-100 rounded-full text-sm">
          Question {currentQuestion + 1} of {questions.length}
        </span>
      </div>
      <h3 className="text-xl font-bold text-gray-800 text-center mb-8 leading-relaxed">
        {question.text}
      </h3>
      <div className="grid gap-3 max-w-lg mx-auto">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => selectAnswer(question.scores[index])}
            className={`p-4 border-2 border-gray-300 rounded-lg bg-white hover:border-gray-800 hover:bg-gray-50 transition-all ${
              quizAnswers[currentQuestion] === question.scores[index] 
                ? 'bg-gray-800 text-orange-100 border-gray-800' 
                : ''
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="mt-8 text-center">
        <div className="bg-gray-200 rounded-full h-2 w-full max-w-md mx-auto overflow-hidden">
          <div 
            className="bg-gray-800 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
        <p className="text-gray-600 mt-2 text-sm">
          {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
        </p>
      </div>
    </div>
  );
};

export default Quiz;
