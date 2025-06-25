'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { usePusher } from '@/hooks/usePusher';
import { EstimationCards } from '@/components/EstimationCards';
import { ParticipantList } from '@/components/ParticipantList';
import { StoryForm } from '@/components/StoryForm';
import { Logo } from '@/components/Logo';
import { calculateEstimationStats } from '@/lib/utils';
import { BarChart3, Users, Eye, RotateCcw, Crown } from 'lucide-react';
import type { EstimationCardValue, Story, AIAnalysis } from '@/types';

export default function RoomPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const roomId = params?.roomId as string;
  const participantName = searchParams?.get('name') || 'Anonymous';

  const { roomState, actions } = usePusher(roomId, participantName);

  // AI Analysis function
  const handleStoryAnalysis = async (story: Omit<Story, 'aiAnalysis'>): Promise<AIAnalysis> => {
    try {
      const response = await fetch('/api/ai/analyze-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(story),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze story');
      }

      return await response.json();
    } catch (error) {
      console.error('Story analysis failed:', error);
      throw error;
    }
  };

  const handleStorySubmit = (story: Story) => {
    actions.submitStory({
      title: story.title,
      description: story.description,
      acceptanceCriteria: story.acceptanceCriteria || [],
    });
  };

  const handleEstimateSelect = (value: EstimationCardValue) => {
    if (typeof value === 'number') {
      actions.submitEstimate(value);
    } else if (value === '?') {
      actions.submitEstimate(-1); // Use -1 to represent unknown
    }
  };

  if (roomState.loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Joining room...</p>
        </div>
      </div>
    );
  }

  if (roomState.error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-12 h-12 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-400 text-xl">⚠</span>
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">Connection Error</h2>
          <p className="text-red-400 mb-4">{roomState.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const stats = roomState.revealed && roomState.estimates.length > 0
    ? calculateEstimationStats(roomState.estimates.map(e => e.estimate))
    : null;  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 lg:gap-4 min-w-0">
              <Logo size="sm" className="lg:hidden" />
              <Logo size="md" className="hidden lg:flex" />
              <div className="border-l border-gray-600 pl-3 lg:pl-4 min-w-0">
                <h1 className="text-lg lg:text-xl font-semibold text-white truncate">Room: {roomId}</h1>
                <p className="text-xs lg:text-sm text-gray-300 truncate">Welcome, {participantName}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
              <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-300">
                <Users className="h-3 w-3 lg:h-4 lg:w-4" />
                <span className="hidden sm:inline">{roomState.participants.length} participant{roomState.participants.length !== 1 ? 's' : ''}</span>
                <span className="sm:hidden">{roomState.participants.length}</span>
              </div>

              {roomState.isModerator && (
                <div className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm bg-yellow-900/20 text-yellow-300 px-2 lg:px-3 py-1 rounded-full border border-yellow-800">
                  <Crown className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="hidden sm:inline">Moderator</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-8">
          {/* Participants - Show first on mobile for quick overview */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 lg:p-6 lg:sticky lg:top-24">
              <ParticipantList
                participants={roomState.participants}
                moderatorId={roomState.isModerator ? (roomState.participant?.id || '') : ''}
                currentUserId={roomState.participant?.id || ''}
                revealed={roomState.revealed}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4 lg:space-y-6 order-2 lg:order-1">            {/* Story Form - Only for moderators */}
            {roomState.isModerator && (
              <section className="bg-gray-800 border border-gray-700 rounded-lg p-4 lg:p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Submit New Story</h2>
                <StoryForm
                  onSubmit={handleStorySubmit}
                  onAnalyze={handleStoryAnalysis}
                  disabled={!roomState.connected}
                />
              </section>
            )}

            {/* Current Story */}
            {roomState.currentStory && (
              <section className="bg-gray-800 border border-gray-700 rounded-lg p-4 lg:p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Current Story</h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-white break-words selectable-text">{roomState.currentStory.title}</h3>
                    <p className="text-gray-300 mt-2 break-words selectable-text">{roomState.currentStory.description}</p>
                  </div>

                  {roomState.currentStory.acceptanceCriteria && roomState.currentStory.acceptanceCriteria.length > 0 && (
                    <div>
                      <h4 className="font-medium text-white mb-2">Acceptance Criteria:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-300 selectable-text">
                        {roomState.currentStory.acceptanceCriteria.map((criteria, index) => (
                          <li key={index} className="break-words">{criteria}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {roomState.currentStory.aiAnalysis && (
                    <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-800">
                      <h4 className="font-medium text-blue-100 mb-2 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        AI Analysis
                      </h4>
                      <div className="space-y-2 text-sm text-blue-200 selectable-text">
                        <p><span className="font-medium">Complexity:</span> {roomState.currentStory.aiAnalysis.complexity}/10</p>
                        <p><span className="font-medium">Suggested Points:</span> {roomState.currentStory.aiAnalysis.suggestedPoints}</p>
                        <p className="break-words"><span className="font-medium">Reasoning:</span> {roomState.currentStory.aiAnalysis.reasoning}</p>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Estimation Cards */}
            {roomState.currentStory && (
              <section className="bg-gray-800 border border-gray-700 rounded-lg p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                  <h2 className="text-lg font-semibold text-white">Your Estimate</h2>

                  {roomState.isModerator && (
                    <div className="flex gap-2">
                      {!roomState.revealed ? (
                        <button
                          onClick={actions.revealEstimates}
                          className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors min-h-[44px]"
                          aria-label="Reveal all estimates"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="hidden sm:inline">Reveal</span>
                        </button>
                      ) : (
                        <button
                          onClick={actions.resetEstimates}
                          className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors min-h-[44px]"
                          aria-label="Reset estimates for new round"
                        >
                          <RotateCcw className="h-4 w-4" />
                          <span className="hidden sm:inline">Reset</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <EstimationCards
                  selectedValue={roomState.selectedEstimate === -1 ? '?' : (roomState.selectedEstimate as EstimationCardValue)}
                  onSelect={handleEstimateSelect}
                  disabled={!roomState.connected || roomState.revealed}
                  revealed={roomState.revealed}
                />

                {roomState.revealed && stats && (
                  <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
                    <h3 className="font-medium text-white mb-3">Estimation Results</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-300">Min:</span>
                        <span className="ml-2 font-medium text-white">{stats.min}</span>
                      </div>
                      <div>
                        <span className="text-gray-300">Max:</span>
                        <span className="ml-2 font-medium text-white">{stats.max}</span>
                      </div>
                      <div>
                        <span className="text-gray-300">Average:</span>
                        <span className="ml-2 font-medium text-white">{stats.average}</span>
                      </div>
                      <div>
                        <span className="text-gray-300">Median:</span>
                        <span className="ml-2 font-medium text-white">{stats.median}</span>
                      </div>
                    </div>
                    {stats.consensus && (
                      <div className="mt-3 p-3 bg-green-900/20 border border-green-800 rounded-lg">
                        <p className="text-green-200 font-medium flex items-center gap-2">
                          🎉 Consensus reached!
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
