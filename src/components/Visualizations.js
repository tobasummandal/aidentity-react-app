import React from 'react';
import Plot from 'react-plotly.js';
import datasetDistribution from '../data/dataset_distribution.json';
import regionalComparison from '../data/regional_feature_comparison.json';
import correlationHeatmap from '../data/feature_correlation_heatmap.json';

const Visualizations = () => {
  return (
    <div className="relative z-20 bg-orange-100/95 py-12 px-8 mt-96">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-black text-center mb-12 text-gray-800">Deep Dive: Research Findings</h2>
        
        {/* Dataset Distribution */}
        <div className="bg-white/80 p-8 rounded-lg mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">How Personas Distribute Across Datasets</h3>
          <p className="text-gray-600 mb-8">Our research drew from three major global datasets (GD1: North America, GD2: Europe, GD3: Asia-Pacific), showing distinct regional patterns in AI perspectives.</p>
          <Plot
            data={datasetDistribution.data}
            layout={datasetDistribution.layout}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler={true}
          />
        </div>
        
        {/* Regional Comparison */}
        <div className="bg-white/80 p-8 rounded-lg mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Regional AI Fear Patterns</h3>
          <p className="text-gray-600 mb-8">Different regions show markedly different patterns of AI-related concerns, reflecting cultural and economic contexts.</p>
          <Plot
            data={regionalComparison.data}
            layout={regionalComparison.layout}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler={true}
          />
        </div>
        
        {/* Correlation Heatmap */}
        <div className="bg-white/80 p-8 rounded-lg mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">How AI Fears Correlate</h3>
          <p className="text-gray-600 mb-8">This correlation matrix reveals which fears tend to appear together, helping us understand the psychological clustering of AI concerns.</p>
          <Plot
            data={correlationHeatmap.data}
            layout={correlationHeatmap.layout}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler={true}
          />
        </div>
      </div>
    </div>
  );
};

export default Visualizations;
