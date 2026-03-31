import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { HiOutlineSparkles, HiOutlineArrowPath, HiOutlineExclamationTriangle } from 'react-icons/hi2';

const tabLabels = {
  summary: 'Project Summary',
  cost: 'Cost Estimation',
  interior: 'Interior Design',
  vastu: 'Vastu Layout',
  timeline: 'Timeline',
};

export default function AIResults({ activeTab, projectData, aiResults, onAIResult }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAIResult = useCallback(async (forceRegenerate = false) => {
    if (!forceRegenerate && aiResults[activeTab]) return;
    
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/ai', {
        ...projectData,
        tab: activeTab,
      });

      if (response.data.success) {
        onAIResult(activeTab, response.data.data.content);
      } else {
        setError('Failed to generate plan. Please try again.');
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to connect to server';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [activeTab, projectData, aiResults, onAIResult]);

  useEffect(() => {
    if (activeTab && activeTab !== 'dashboard' && projectData) {
      fetchAIResult();
    }
  }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const formatContent = (text) => {
    if (!text) return '';
    
    // Convert markdown-style formatting to HTML
    let html = text
      // Headers
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Tables - handle pipe-separated tables
      .replace(/^\|(.+)\|$/gm, (match) => {
        const cells = match.split('|').filter(c => c.trim());
        if (cells.every(c => c.trim().match(/^[-:]+$/))) {
          return ''; // Skip separator rows
        }
        const isHeader = match.includes('---');
        const tag = 'td';
        const row = cells.map(c => `<${tag}>${c.trim()}</${tag}>`).join('');
        return `<tr>${row}</tr>`;
      })
      // Bullet points
      .replace(/^[-•] (.*$)/gm, '<li>$1</li>')
      .replace(/^(\d+)\. (.*$)/gm, '<li>$1. $2</li>')
      // Line breaks
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br/>');

    // Wrap consecutive <li> in <ul>
    html = html.replace(/((?:<li>.*<\/li><br\/>?)+)/g, '<ul>$1</ul>');
    // Wrap consecutive <tr> in <table>
    html = html.replace(/((?:<tr>.*<\/tr>)+)/g, '<table>$1</table>');
    
    return `<p>${html}</p>`;
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Tab header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">{tabLabels[activeTab]}</h2>
          <p className="text-gray-400 text-sm mt-1">AI-generated analysis for your construction project</p>
        </div>
        <button
          onClick={() => fetchAIResult(true)}
          disabled={loading}
          className="btn-secondary text-sm py-2 px-4 disabled:opacity-50"
        >
          <HiOutlineArrowPath className={`text-base ${loading ? 'animate-spin' : ''}`} />
          Regenerate
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          <LoadingSkeleton />
        </div>
      ) : error ? (
        <div className="glass rounded-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <HiOutlineExclamationTriangle className="text-3xl text-red-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Generation Failed</h3>
          <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">{error}</p>
          <button onClick={() => fetchAIResult(true)} className="btn-primary text-sm py-2.5 px-6">
            <HiOutlineArrowPath />
            Try Again
          </button>
        </div>
      ) : aiResults[activeTab] ? (
        <div className="glass rounded-2xl p-8">
          <div 
            className="ai-content"
            dangerouslySetInnerHTML={{ __html: formatContent(aiResults[activeTab]) }}
          />
        </div>
      ) : (
        <div className="glass rounded-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <HiOutlineSparkles className="text-3xl text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Ready to Generate</h3>
          <p className="text-gray-400 text-sm mb-6">Click the button below to generate your {tabLabels[activeTab]?.toLowerCase()}</p>
          <button onClick={() => fetchAIResult(true)} className="btn-primary text-sm py-2.5 px-6">
            <HiOutlineSparkles />
            Generate Now
          </button>
        </div>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="glass rounded-2xl p-8 space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg loading-shimmer"></div>
        <div className="h-6 w-48 rounded-lg loading-shimmer"></div>
      </div>
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="space-y-3">
          <div className="h-5 rounded-lg loading-shimmer" style={{ width: `${Math.random() * 40 + 60}%` }}></div>
          <div className="h-4 rounded-lg loading-shimmer" style={{ width: `${Math.random() * 30 + 50}%` }}></div>
          <div className="h-4 rounded-lg loading-shimmer" style={{ width: `${Math.random() * 35 + 45}%` }}></div>
        </div>
      ))}
      <div className="flex items-center justify-center gap-3 pt-4">
        <div className="w-6 h-6 border-3 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <span className="text-gray-400 text-sm">AI is generating your plan...</span>
      </div>
    </div>
  );
}
