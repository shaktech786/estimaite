import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Plus, Trash2, Brain, Lightbulb, Tag } from 'lucide-react';
import type { Story, AIAnalysis } from '@/types';

interface StoryFormProps {
  onSubmit: (story: Story) => void;
  onAnalyze?: (story: Omit<Story, 'aiAnalysis'>) => Promise<AIAnalysis>;
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
  const [acceptanceCriteria, setAcceptanceCriteria] = useState<string[]>(
    initialStory?.acceptanceCriteria || ['']
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(
    initialStory?.aiAnalysis || null
  );

  const addCriteria = () => {
    setAcceptanceCriteria([...acceptanceCriteria, '']);
  };

  const removeCriteria = (index: number) => {
    setAcceptanceCriteria(acceptanceCriteria.filter((_, i) => i !== index));
  };

  const updateCriteria = (index: number, value: string) => {
    const updated = [...acceptanceCriteria];
    updated[index] = value;
    setAcceptanceCriteria(updated);
  };

  const handleAnalyze = async () => {
    if (!onAnalyze || !title.trim() || !description.trim()) return;

    setIsAnalyzing(true);
    try {
      const analysis = await onAnalyze({
        title: title.trim(),
        description: description.trim(),
        acceptanceCriteria: acceptanceCriteria.filter(ac => ac.trim())
      });
      setAiAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing story:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const story: Story = {
      title: title.trim(),
      description: description.trim(),
      acceptanceCriteria: acceptanceCriteria.filter(ac => ac.trim()),
      ...(aiAnalysis && { aiAnalysis })
    };

    onSubmit(story);
  };

  const canAnalyze = onAnalyze && title.trim() && description.trim() && !isAnalyzing;
  const canSubmit = title.trim() && description.trim() && !disabled;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Story Title */}
      <div>
        <label htmlFor="story-title" className="block text-sm font-medium text-gray-300 mb-2">
          Story Title *
        </label>
        <input
          type="text"
          id="story-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="As a user, I want to..."
          className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-h-[44px]"
          required
          disabled={disabled}
        />
      </div>

      {/* Story Description */}
      <div>
        <label htmlFor="story-description" className="block text-sm font-medium text-gray-300 mb-2">
          Description *
        </label>
        <textarea
          id="story-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the feature in detail..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
          required
          disabled={disabled}
        />
      </div>

      {/* Acceptance Criteria */}
      <div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
          <label className="block text-sm font-medium text-gray-300">
            Acceptance Criteria
          </label>
          <button
            type="button"
            onClick={addCriteria}
            disabled={disabled}
            className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 disabled:opacity-50 self-start sm:self-auto touch-manipulation"
          >
            <Plus className="h-4 w-4" />
            Add Criteria
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
                className="flex-1 px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-h-[44px]"
                disabled={disabled}
              />
              {acceptanceCriteria.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCriteria(index)}
                  disabled={disabled}
                  className="p-2 text-red-400 hover:text-red-300 disabled:opacity-50 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* AI Analysis Section */}
      {onAnalyze && (
        <div className="border-t border-gray-600 pt-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-400" />
              AI Analysis
            </h3>

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors min-h-[44px] self-start sm:self-auto touch-manipulation',
                canAnalyze
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              )}
            >
              <Brain className="h-4 w-4" />
              {isAnalyzing ? 'Analyzing...' : 'Analyze Story'}
            </button>
          </div>

          {aiAnalysis && (
            <div className="bg-blue-900/20 rounded-lg p-4 space-y-3 border border-blue-800">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-blue-200">Complexity:</span>
                <span className={cn(
                  'px-2 py-1 rounded-full text-xs font-medium',
                  aiAnalysis.complexity === 'low' && 'bg-green-900/30 text-green-300',
                  aiAnalysis.complexity === 'medium' && 'bg-yellow-900/30 text-yellow-300',
                  aiAnalysis.complexity === 'high' && 'bg-red-900/30 text-red-300'
                )}>
                  {aiAnalysis.complexity.charAt(0).toUpperCase() + aiAnalysis.complexity.slice(1)}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm font-medium text-blue-200">Suggested Points:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {aiAnalysis.suggestedPoints.map((point) => (
                    <span
                      key={point}
                      className="px-2 py-1 bg-blue-800 border border-blue-600 rounded text-sm font-medium text-blue-100"
                    >
                      {point}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-sm font-medium text-blue-200 block mb-1">Analysis:</span>
                <p className="text-sm text-blue-100 break-words">{aiAnalysis.reasoning}</p>
              </div>

              {aiAnalysis.tags.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="h-4 w-4 text-cyan-400" />
                    <span className="text-sm font-medium text-blue-200">Tags:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {aiAnalysis.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-cyan-900/30 text-cyan-300 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!canSubmit}
        className={cn(
          'w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 min-h-[50px] touch-manipulation',
          canSubmit
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-105'
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
        )}
      >
        Submit Story for Estimation
      </button>
    </form>
  );
}
