import React, { useState, useEffect, useRef } from 'react';
import Plot from 'react-plotly.js';
import Header from './Header';
import Quiz from './Quiz';
import Personas from './Personas';

import datasetDistribution from '../data/dataset_distribution.json';
import regionalComparison from '../data/regional_feature_comparison.json';
import correlationHeatmap from '../data/feature_correlation_heatmap.json';

const Story = () => {
  const [currentStep, setCurrentStep] = useState('intro');
  const observerRef = useRef(null);

  useEffect(() => {
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
  }, []);

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

  return (
    <>
      <Header />
      
      {/* Fixed Background Element */}
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
        
        {/* Visualization Section 1 */}
        <div className="relative z-20 bg-orange-100/95 py-12 px-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white/80 p-8 rounded-lg mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Dataset Distribution</h3>
                    <Plot data={datasetDistribution.data} layout={datasetDistribution.layout} style={{ width: '100%', height: '100%' }} useResizeHandler={true} />
                </div>
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

        {/* Visualization Section 2 */}
        <div className="relative z-20 bg-orange-100/95 py-12 px-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white/80 p-8 rounded-lg mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Regional AI Fear Patterns</h3>
                    <Plot data={regionalComparison.data} layout={regionalComparison.layout} style={{ width: '100%', height: '100%' }} useResizeHandler={true} />
                </div>
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

        {/* Visualization Section 3 */}
        <div className="relative z-20 bg-orange-100/95 py-12 px-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white/80 p-8 rounded-lg mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Feature Correlation</h3>
                    <Plot data={correlationHeatmap.data} layout={correlationHeatmap.layout} style={{ width: '100%', height: '100%' }} useResizeHandler={true} />
                </div>
            </div>
        </div>
        <div className="step" data-step="regional-patterns"></div>

        {/* Personas Section */}
        <div className="min-h-screen flex items-center justify-center p-8">
            <div className="bg-orange-100/85 p-16 rounded-lg max-w-4xl mx-auto text-center">
                <p className="text-6xl md:text-8xl font-black uppercase">Meet the 5 personas</p>
            </div>
        </div>
        <div className="step" data-step="persona-details"></div>
        <Personas />

        {/* Quiz Section */}
        <div className="relative z-20 bg-orange-100/95 py-12 px-8">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-black text-center mb-12 text-gray-800">Discover Your AI Persona</h2>
                <div className="bg-white/80 p-8 rounded-lg" id="quiz-container">
                    <Quiz />
                </div>
            </div>
        </div>
        <div className="step" data-step="conclusion"></div>
      </div>
    </>
  );
};

export default Story;
