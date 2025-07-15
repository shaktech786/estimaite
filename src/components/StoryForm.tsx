'use client';
import React, { useState } from 'react';
import type { Story, AIAnalysis as EstimAIteAIAnalysis } from '@/types';

interface StoryFormProps {
  onSubmit: (story: Story) => void;
  onAnalyze?: (story: Omit<Story, 'aiAnalysis'>) => Promise<EstimAIteAIAnalysis>;
  disabled?: boolean;
  initialStory?: Partial<Story>;
}

export function StoryForm({
  onSubmit,
  onAnalyze,
  disabled = false,
  initialStory
}: StoryFormProps) {
  const [title, setTitle] = useState(initialStory?.title || '');
  const [description, setDescription] = useState(initialStory?.description || '');
  const [acceptanceCriteria, setAcceptanceCriteria] = useState<string[]>(initialStory?.acceptanceCriteria || []);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    setLoading(true);

    try {
      const story: Story = {
        title: title.trim(),
        description: description.trim(),
        acceptanceCriteria: acceptanceCriteria.filter(c => c.trim())
      };

      onSubmit(story);
    } finally {
      setLoading(false);
    }
  };

  const addCriteria = () => {
    setAcceptanceCriteria([...acceptanceCriteria, '']);
  };

  const updateCriteria = (index: number, value: string) => {
    const updated = [...acceptanceCriteria];
    updated[index] = value;
    setAcceptanceCriteria(updated);
  };

  const removeCriteria = (index: number) => {
    setAcceptanceCriteria(acceptanceCriteria.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
            Story Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="As a user, I want to..."
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-colors"
            disabled={disabled || loading}
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
            Description (Optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide additional context and details..."
            rows={3}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-colors resize-none"
            disabled={disabled || loading}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-300">
              Acceptance Criteria (Optional)
            </label>
            <button
              type="button"
              onClick={addCriteria}
              disabled={disabled || loading}
              className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors disabled:opacity-50"
            >
              + Add Criteria
            </button>
          </div>
          <div className="space-y-2">
            {acceptanceCriteria.map((criteria, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={criteria}
                  onChange={(e) => updateCriteria(index, e.target.value)}
                  placeholder={`Criteria ${index + 1}`}
                  className="flex-1 px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-colors text-sm"
                  disabled={disabled || loading}
                />
                <button
                  type="button"
                  onClick={() => removeCriteria(index)}
                  disabled={disabled || loading}
                  className="px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={!title.trim() || disabled || loading}
            className="flex-1 px-6 py-3 bg-cyan-500 text-gray-900 font-medium rounded-lg hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Submitting...' : 'Start Estimation'}
          </button>
          {onAnalyze && (
            <button
              type="button"
              disabled={!title.trim() || disabled || loading}
              className="px-6 py-3 bg-gray-700 text-gray-300 font-medium rounded-lg border border-gray-600 hover:bg-gray-600 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              AI Analyze
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
