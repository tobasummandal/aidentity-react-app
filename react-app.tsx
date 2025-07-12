import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import * as Plotly from 'plotly';

const AIIdentityApp = () => {
  // State management
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState(null);
  
  // Refs for DOM elements
  const mapRef = useRef(null);
  const scrollerRef = useRef(null);
  const observerRef = useRef(null);

  // PERSONA DATA
  const PERSONA_DATA = {
    personas: {
      0: {
        name: "The Balanced Dependency Participant",
        description: "Relatively optimistic about AI; displays variable response patterns; provides brief, focused responses; particularly focused on technology dependence issues",
        size: 3947,
        percentage: 6.63,
        color: "#7994b5",
        features: {
          fear_index: 0.075,
          technology_dependence_fear: 0.158,
          surveillance_control_fear: 0.140,
          social_isolation_fear: 0.098
        },
        dataset_distribution: {
          "GD1": 2785,
          "GD3": 859,
          "GD2": 303
        }
      },
      1: {
        name: "The Balanced Social Participant",
        description: "Relatively optimistic about AI; displays variable response patterns; provides brief, focused responses; particularly focused on social connection and isolation",
        size: 35344,
        percentage: 59.36,
        color: "#93b778",
        features: {
          fear_index: 0.002,
          social_isolation_fear: 0.003,
          cultural_values_fear: 0.002,
          economic_job_loss_fear: 0.002
        },
        dataset_distribution: {
          "GD2": 15819,
          "GD3": 10014,
          "GD1": 9511
        }
      },
      2: {
        name: "The Consistent Social Responder",
        description: "Relatively optimistic about AI; displays variable response patterns; provides brief, focused responses; particularly focused on social connection and isolation",
        size: 13241,
        percentage: 22.24,
        color: "#d17c3f",
        features: {
          fear_index: 0.047,
          social_isolation_fear: 0.180,
          economic_job_loss_fear: 0.089,
          cultural_values_fear: 0.005
        },
        dataset_distribution: {
          "GD1": 5844,
          "GD3": 4643,
          "GD2": 2754
        }
      },
      3: {
        name: "The Balanced Security Participant",
        description: "Relatively optimistic about AI; displays variable response patterns; provides brief, focused responses; particularly focused on safety and security risks",
        size: 2023,
        percentage: 3.40,
        color: "#b63e36",
        features: {
          fear_index: 0.067,
          safety_security_fear: 0.230,
          social_isolation_fear: 0.087,
          economic_job_loss_fear: 0.033
        },
        dataset_distribution: {
          "GD1": 1154,
          "GD3": 564,
          "GD2": 305
        }
      },
      4: {
        name: "The Consistent Cultural Responder",
        description: "Relatively optimistic about AI; displays variable response patterns; provides brief, focused responses; particularly focused on cultural and value preservation",
        size: 4987,
        percentage: 8.38,
        color: "#be7249",
        features: {
          fear_index: 0.060,
          cultural_values_fear: 0.259,
          social_isolation_fear: 0.089,
          economic_job_loss_fear: 0.008
        },
        dataset_distribution: {
          "GD2": 2861,
          "GD1": 1700,
          "GD3": 426
        }
      }
    }
  };

  // QUIZ DATA
  const QUIZ_QUESTIONS = [
    {"text":"How concerned are you about job loss due to AI?","options":["Not at all","Slightly","Moderately","Very","Extremely"],"scores":[1,2,3,4,5]},
    {"text":"How concerned are you about surveillance and control by AI?","options":["Not at all","Slightly","Moderately","Very","Extremely"],"scores":[1,2,3,4,5]},
    {"text":"How concerned are you about AI causing social isolation?","options":["Not at all","Slightly","Moderately","Very","Extremely"],"scores":[1,2,3,4,5]},
    {"text":"How concerned are you about safety and security risks from AI?","options":["Not at all","Slightly","Moderately","Very","Extremely"],"scores":[1,2,3,4,5]},
    {"text":"How concerned are you about AI impacting cultural values?","options":["Not at all","Slightly","Moderately","Very","Extremely"],"scores":[1,2,3,4,5]},
    {"text":"How dependent do you feel on AI tools in your daily life?","options":["Not at all","Slightly","Moderately","Very","Extremely"],"scores":[1,2,3,4,5]},
    {"text":"How optimistic are you about the overall future of AI?","options":["Not at all","Slightly","Moderately","Very","Extremely"],"scores":[1,2,3,4,5]},
    {"text":"How likely are you to use AI to manage your daily schedule?","options":["Not at all","Slightly","Moderately","Very","Extremely"],"scores":[1,2,3,4,5]},
    {"text":"How much do you agree that AI can understand and respect human values?","options":["Strongly disagree","Disagree","Neutral","Agree","Strongly agree"],"scores":[1,2,3,4,5]},
    {"text":"How interested are you in learning new AI technologies?","options":["Not at all","A little","Somewhat","Quite a bit","Extremely"],"scores":[1,2,3,4,5]}
  ];

  // Visualization data
  const DATASET_DISTRIBUTION_DATA = {
    data: [
      {
        x: ["Persona 0", "Persona 1", "Persona 2", "Persona 3", "Persona 4"],
        y: [70.5, 26.9, 44.1, 57.0, 34.1],
        name: "GD1 (North America)",
        type: "bar",
        marker: { color: "#636efa" }
      },
      {
        x: ["Persona 0", "Persona 1", "Persona 2", "Persona 3", "Persona 4"],
        y: [7.7, 44.8, 20.8, 15.1, 57.4],
        name: "GD2 (Europe)",
        type: "bar",
        marker: { color: "#EF553B" }
      },
      {
        x: ["Persona 0", "Persona 1", "Persona 2", "Persona 3", "Persona 4"],
        y: [21.8, 28.3, 35.1, 27.9, 8.5],
        name: "GD3 (Asia-Pacific)",
        type: "bar",
        marker: { color: "#00cc96" }
      }
    ],
    layout: {
      title: "Dataset Distribution Across Personas",
      xaxis: { title: "Persona" },
      yaxis: { title: "Percentage within Persona" },
      barmode: "group",
      height: 500,
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)'
    }
  };

  const REGIONAL_COMPARISON_DATA = {
    data: [
      {
        x: ["North America", "Europe", "Asia-Pacific"],
        y: [0.020, 0.015, 0.025],
        name: "Fear Index",
        type: "bar",
        marker: { color: "#636efa" }
      },
      {
        x: ["North America", "Europe", "Asia-Pacific"],
        y: [0.032, 0.018, 0.041],
        name: "Economic Job Loss Fear",
        type: "bar",
        marker: { color: "#EF553B" }
      },
      {
        x: ["North America", "Europe", "Asia-Pacific"],
        y: [0.052, 0.033, 0.089],
        name: "Social Isolation Fear",
        type: "bar",
        marker: { color: "#00cc96" }
      },
      {
        x: ["North America", "Europe", "Asia-Pacific"],
        y: [0.041, 0.038, 0.033],
        name: "Cultural Values Fear",
        type: "bar",
        marker: { color: "#ab63fa" }
      }
    ],
    layout: {
      title: "Regional AI Fear Comparison",
      xaxis: { title: "Region" },
      yaxis: { title: "Fear Level" },
      barmode: "group",
      height: 500,
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)'
    }
  };

  const CORRELATION_HEATMAP_DATA = {
    data: [{
      z: [
        [1.0, 0.895, 0.352, 0.393, 0.456],
        [0.895, 1.0, 0.374, 0.373, 0.456],
        [0.352, 0.374, 1.0, 0.300, 0.369],
        [0.393, 0.373, 0.300, 1.0, 0.151],
        [0.456, 0.456, 0.369, 0.151, 1.0]
      ],
      x: ["Fear Index", "PRI Score", "Economic Fear", "Surveillance Fear", "Social Fear"],
      y: ["Fear Index", "PRI Score", "Economic Fear", "Surveillance Fear", "Social Fear"],
      type: "heatmap",
      colorscale: "RdBu",
      showscale: true
    }],
    layout: {
      title: "Feature Correlation Matrix",
      height: 500,
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)'
    }
  };

  // Initialize visualizations
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      
      // Create visualizations after component mounts
      setTimeout(() => {
        createTestChart();
        createDatasetDistribution();
        createRegionalComparison();
        createCorrelationHeatmap();
      }, 100);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Scroll observer for scrollytelling
  useEffect(() => {
    if (!loading) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const step = entry.target.getAttribute('data-step');
              setCurrentStep(step);
            }
          });
        },
        { threshold: 0.5 }
      );

      const steps = document.querySelectorAll('.step');
      steps.forEach((step) => observer.observe(step));

      observerRef.current = observer;

      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      };
    }
  }, [loading]);

  // Visualization functions
  const createTestChart = () => {
    const container = document.getElementById('test-chart');
    if (container) {
      const testData = [{
        x: ['Persona 0', 'Persona 1', 'Persona 2', 'Persona 3', 'Persona 4'],
        y: [6.6, 59.4, 22.2, 3.4, 8.4],
        type: 'bar',
        marker: { color: ['#7994b5', '#93b778', '#d17c3f', '#b63e36', '#be7249'] }
      }];
      const layout = {
        title: 'AI Persona Distribution',
        xaxis: { title: 'Persona Type' },
        yaxis: { title: 'Percentage' },
        height: 300,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
      };
      Plotly.newPlot(container, testData, layout, {responsive: true});
    }
  };

  const createDatasetDistribution = () => {
    const container = document.getElementById('dataset-distribution');
    if (container) {
      Plotly.newPlot(container, DATASET_DISTRIBUTION_DATA.data, DATASET_DISTRIBUTION_DATA.layout, {responsive: true});
    }
  };

  const createRegionalComparison = () => {
    const container = document.getElementById('regional-comparison');
    if (container) {
      Plotly.newPlot(container, REGIONAL_COMPARISON_DATA.data, REGIONAL_COMPARISON_DATA.layout, {responsive: true});
    }
  };

  const createCorrelationHeatmap = () => {
    const container = document.getElementById('correlation-heatmap');
    if (container) {
      Plotly.newPlot(container, CORRELATION_HEATMAP_DATA.data, CORRELATION_HEATMAP_DATA.layout, {responsive: true});
    }
  };

  // Quiz functions
  const selectAnswer = (score) => {
    const newAnswers = [...quizAnswers];
    newAnswers[currentQuestion] = score;
    setQuizAnswers(newAnswers);

    setTimeout(() => {
      if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setQuizCompleted(true);
      }
    }, 500);
  };

  const calculatePersona = () => {
    const economic_fear = quizAnswers[0] || 1;
    const surveillance_fear = quizAnswers[1] || 1;
    const social_fear = quizAnswers[2] || 1;
    const safety_fear = quizAnswers[3] || 1;
    const cultural_fear = quizAnswers[4] || 1;
    const dependency = quizAnswers[5] || 1;
    
    if (dependency >= 4) return { ...PERSONA_DATA.personas[0], id: 0 };
    if (safety_fear >= 4) return { ...PERSONA_DATA.personas[3], id: 3 };
    if (cultural_fear >= 4) return { ...PERSONA_DATA.personas[4], id: 4 };
    if (social_fear >= 4) return { ...PERSONA_DATA.personas[2], id: 2 };
    return { ...PERSONA_DATA.personas[1], id: 1 };
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setQuizAnswers([]);
    setQuizCompleted(false);
  };

  // Persona Avatar Component
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

  // Quiz Component
  const Quiz = () => {
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

    const question = QUIZ_QUESTIONS[currentQuestion];
    return (
      <div className="mb-8">
        <div className="text-center mb-4">
          <span className="inline-block px-4 py-2 bg-gray-800 text-orange-100 rounded-full text-sm">
            Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
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
              style={{ width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
            />
          </div>
          <p className="text-gray-600 mt-2 text-sm">
            {Math.round(((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100)}% Complete
          </p>
        </div>
      </div>
    );
  };

  // Step title mapping
  const getStepTitle = (step) => {
    const titles = {
      'intro': { hed: '59,542 voices from around the world', dek: 'Shared their perspectives on artificial intelligence' },
      'personas-overview': { hed: '5 distinct AI personas emerge', dek: 'Each with unique relationships to artificial intelligence' },
      'social-persona': { hed: 'Balanced Social Participants - 59.4%', dek: 'Relatively optimistic but focused on social connection', color: '#93b778' },
      'fear-map': { hed: 'AI perspectives vary dramatically by region', dek: 'Different cultures approach AI in unique ways' },
      'economic-fears': { hed: 'Social isolation concerns - 22.2%', dek: 'Consistent Social Responders worry about community bonds', color: '#d17c3f' },
      'surveillance-fears': { hed: 'Security concerns - 3.4%', dek: 'Small but highly concerned group focused on safety risks', color: '#b63e36' },
      'cultural-fears': { hed: 'Cultural preservation concerns', dek: 'Will AI erode traditional values?', color: '#be7249' },
      'regional-patterns': { hed: 'Global tapestry of AI perspectives', dek: 'Understanding cultural responses to AI' },
      'persona-details': { hed: 'Meet the 5 personas', dek: 'Understanding diverse AI perspectives' },
      'conclusion': { hed: 'Global AI Cultural Perspectives', dek: 'Understanding diversity in the age of algorithms' }
    };
    return titles[step] || titles['intro'];
  };

  const stepTitle = getStepTitle(currentStep);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-orange-100 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading global AI perspectives...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-orange-100 min-h-screen">
      {/* Header */}
      <header className="relative py-16 px-8 text-center bg-orange-100">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-black uppercase tracking-wide text-gray-800 mb-4">
            (AI)DENTITY
          </h1>
          <p className="text-2xl text-gray-600 mb-2">Who Are We in the Age of Algorithms?</p>
          <p className="text-lg text-gray-500">A Global Dialogues Story</p>
          
          {/* Key Statistics */}
          <div className="bg-white/60 p-6 rounded-lg mt-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Key Findings</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-gray-800">59,542</div>
                <div className="text-gray-600">Total Participants</div>
              </div>
              <div>
                <div className="text-3xl font-bold" style={{ color: '#93b778' }}>59.4%</div>
                <div className="text-gray-600">Social Participants</div>
              </div>
              <div>
                <div className="text-3xl font-bold" style={{ color: '#d17c3f' }}>22.2%</div>
                <div className="text-gray-600">Social Responders</div>
              </div>
              <div>
                <div className="text-3xl font-bold" style={{ color: '#be7249' }}>8.4%</div>
                <div className="text-gray-600">Cultural Focus</div>
              </div>
            </div>
            
            {/* Test Chart */}
            <div className="mt-8 bg-white p-4 rounded-lg">
              <h4 className="text-xl font-bold text-gray-800 mb-4">Persona Distribution</h4>
              <div id="test-chart" style={{ height: '300px', width: '100%' }}></div>
            </div>
          </div>
        </div>
      </header>

      {/* Fixed Map Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-orange-100 to-orange-200 z-0">
        <div className="absolute bottom-8 left-8 z-10 max-w-md">
          <div className="bg-orange-100/90 p-4 rounded-lg shadow-lg">
            <p className="text-2xl font-bold mb-2" style={{ color: stepTitle.color || '#333' }}>
              {stepTitle.hed}
            </p>
            <p className="text-gray-600">{stepTitle.dek}</p>
          </div>
        </div>
      </div>

      {/* Scrollytelling Content */}
      <div className="relative z-10">
        {/* Step 1 */}
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="bg-orange-100/85 p-16 rounded-lg max-w-4xl mx-auto text-center">
            <p className="text-6xl md:text-8xl font-black uppercase mb-4">59,542 voices</p>
            <p className="text-3xl md:text-5xl">from around the world shared their hopes and fears about artificial intelligence.</p>
          </div>
        </div>
        <div className="step" data-step="intro"></div>

        {/* Step 2 */}
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="bg-orange-100/85 p-16 rounded-lg max-w-4xl mx-auto text-center">
            <p className="text-3xl md:text-5xl">
              They fell into{' '}
              <span className="bg-gray-800 text-orange-100 px-4 py-2 uppercase font-bold hover:bg-gray-700 transition-colors cursor-pointer">
                5 distinct personas
              </span>
              , each with their own unique relationship to AI.
            </p>
          </div>
        </div>
        <div className="step" data-step="personas-overview"></div>

        {/* Step 3 */}
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="bg-orange-100/85 p-16 rounded-lg max-w-4xl mx-auto text-center">
            <p className="text-3xl md:text-5xl">
              The majority—nearly 60%—are{' '}
              <span 
                className="px-4 py-2 uppercase font-bold hover:scale-105 transition-transform cursor-pointer"
                style={{ backgroundColor: '#93b778', color: '#f3dbba' }}
              >
                Balanced Social Participants
              </span>
              , who are relatively optimistic but focused on social connection.
            </p>
          </div>
        </div>
        <div className="step" data-step="social-persona"></div>

        {/* Step 4 */}
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="bg-orange-100/85 p-16 rounded-lg max-w-4xl mx-auto text-center">
            <p className="text-3xl md:text-5xl">
              Data from three global regions reveals{' '}
              <span className="bg-gray-800 text-orange-100 px-4 py-2 uppercase font-bold hover:bg-gray-700 transition-colors cursor-pointer">
                distinct cultural patterns
              </span>
              {' '}in how different societies approach AI.
            </p>
          </div>
        </div>
        <div className="step" data-step="fear-map"></div>

        {/* Step 5 */}
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="bg-orange-100/85 p-16 rounded-lg max-w-4xl mx-auto text-center">
            <p className="text-3xl md:text-5xl">
              Asia-Pacific shows the highest{' '}
              <span className="bg-gray-800 text-orange-100 px-4 py-2 uppercase font-bold hover:bg-gray-700 transition-colors cursor-pointer">
                social isolation fears
              </span>
              {' '}at 8.9%, while North America leads in economic concerns.
            </p>
          </div>
        </div>
        <div className="step" data-step="economic-fears"></div>

        {/* Step 6 */}
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="bg-orange-100/85 p-16 rounded-lg max-w-4xl mx-auto text-center">
            <p className="text-3xl md:text-5xl">
              European participants show more{' '}
              <span className="bg-gray-800 text-orange-100 px-4 py-2 uppercase font-bold hover:bg-gray-700 transition-colors cursor-pointer">
                balanced fear profiles
              </span>
              , with moderate levels across all AI concern categories.
            </p>
          </div>
        </div>
        <div className="step" data-step="surveillance-fears"></div>

        {/* Step 7 */}
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="bg-orange-100/85 p-16 rounded-lg max-w-4xl mx-auto text-center">
            <p className="text-3xl md:text-5xl">
              The research reveals strong{' '}
              <span className="bg-gray-800 text-orange-100 px-4 py-2 uppercase font-bold hover:bg-gray-700 transition-colors cursor-pointer">
                correlations between fears
              </span>
              —those worried about jobs often fear social isolation too.
            </p>
          </div>
        </div>
        <div className="step" data-step="cultural-fears"></div>

        {/* Step 8 */}
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="bg-orange-100/85 p-16 rounded-lg max-w-4xl mx-auto text-center">
            <p className="text-3xl md:text-5xl">
              Dataset analysis shows{' '}
              <span className="bg-gray-800 text-orange-100 px-4 py-2 uppercase font-bold hover:bg-gray-700 transition-colors cursor-pointer">
                regional clustering
              </span>
              : 70% of Dependency Participants come from North America (GD1).
            </p>
          </div>
        </div>
        <div className="step" data-step="regional-patterns"></div>

        {/* Step 9 */}
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="bg-orange-100/85 p-16 rounded-lg max-w-4xl mx-auto text-center">
            <p className="text-6xl md:text-8xl font-black uppercase">Meet the 5 personas</p>
          </div>
        </div>
        <div className="step" data-step="persona-details"></div>

        {/* Step 10 */}
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="bg-orange-100/85 p-16 rounded-lg max-w-4xl mx-auto text-center">
            <p className="text-3xl md:text-5xl">
              As AI reshapes our world, understanding these diverse cultural perspectives becomes crucial for building technology that serves all of humanity.
            </p>
          </div>
        </div>
        <div className="step" data-step="conclusion"></div>
      </div>

      {/* Research Visualizations */}
      <div className="relative z-20 bg-orange-100/95 py-12 px-8 mt-96">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12 text-gray-800">Deep Dive: Research Findings</h2>
          
          {/* Dataset Distribution */}
          <div className="bg-white/80 p-8 rounded-lg mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">How Personas Distribute Across Datasets</h3>
            <p className="text-gray-600 mb-8">Our research drew from three major global datasets (GD1: North America, GD2: Europe, GD3: Asia-Pacific), showing distinct regional patterns in AI perspectives.</p>
            <div id="dataset-distribution" style={{ height: '500px', width: '100%' }}></div>
          </div>
          
          {/* Regional Comparison */}
          <div className="bg-white/80 p-8 rounded-lg mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Regional AI Fear Patterns</h3>
            <p className="text-gray-600 mb-8">Different regions show markedly different patterns of AI-related concerns, reflecting cultural and economic contexts.</p>
            <div id="regional-comparison" style={{ height: '500px', width: '100%' }}></div>
          </div>
          
          {/* Correlation Heatmap */}
          <div className="bg-white/80 p-8 rounded-lg mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">How AI Fears Correlate</h3>
            <p className="text-gray-600 mb-8">This correlation matrix reveals which fears tend to appear together, helping us understand the psychological clustering of AI concerns.</p>
            <div id="correlation-heatmap" style={{ height: '500px', width: '100%' }}></div>
          </div>
        </div>
      </div>

      {/* Interactive Quiz Section */}
      <div className="relative z-20 bg-orange-100/95 py-12 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12 text-gray-800">Discover Your AI Persona</h2>
          <div className="bg-white/80 p-8 rounded-lg" id="quiz-container">
            <Quiz />
          </div>
        </div>
      </div>

      {/* Persona Grid */}
      <div className="relative z-20 bg-orange-100/95 py-12 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12 text-gray-800">The Five AI Personas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(PERSONA_DATA.personas).map(([id, persona]) => (
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
    </div>
  );
};

export default AIIdentityApp;