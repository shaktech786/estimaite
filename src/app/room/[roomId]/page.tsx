'use client';

import React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { usePusher } from '@/hooks/usePusher';
import { EstimationCards } from '@/components/EstimationCards';
import { ParticipantList } from '@/components/ParticipantList';
import { StoryForm } from '@/components/StoryForm';
import { Logo } from '@/components/Logo';

import { OnboardingSteps } from '@/components/OnboardingSteps';
import { VotingTimer } from '@/components/VotingTimer';
import { BarChart3, Users, Eye, RotateCcw, FileText, Copy, Target } from 'lucide-react';
import type { EstimationCardValue, Story, AIAnalysis } from '@/types';
import { calculateEstimationStats, getCardColor } from '@/lib/utils';

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

  // Auto-reveal votes when everyone has voted (removed client-side logic since server handles this)

  if (roomState.loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-400 text-lg">Joining room...</p>
        </div>
      </div>
    );
  }

  if (roomState.error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-950/50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-800/50">
            <span className="text-red-400 text-2xl">⚠</span>
          </div>
          <h2 className="text-xl font-semibold text-white mb-3">Connection Error</h2>
          <p className="text-red-400 mb-6 leading-relaxed">{roomState.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black transition-all duration-200"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const stats = roomState.revealed && roomState.estimates.length > 0
    ? calculateEstimationStats(roomState.estimates.map(e => e.estimate))
    : null;

  // Determine current session step
  const getCurrentStep = (): 'waiting' | 'story' | 'voting' | 'results' => {
    if (roomState.revealed) return 'results';
    if (roomState.currentStory) return 'voting';
    if (roomState.participants.length === 1) return 'waiting';
    return 'story';
  };

  const currentStep = getCurrentStep();

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-gray-950/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0 flex-1">
              <Logo size="sm" className="flex-shrink-0" />
              <div className="border-l border-gray-700 pl-2 sm:pl-3 lg:pl-4 min-w-0 flex-1">
                <h1 className="text-base sm:text-lg lg:text-xl font-semibold text-white truncate">Room {roomId}</h1>
                <p className="text-xs sm:text-sm text-gray-500 truncate hidden xs:block">Welcome, {participantName}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-4 flex-shrink-0">
              <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 bg-gray-900/80 rounded-lg border border-gray-800">
                <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-cyan-400" />
                <span className="text-xs sm:text-sm text-gray-300 font-medium">{roomState.participants.length}</span>
              </div>

              <div className="group relative">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(roomId);
                    // Could add a toast notification here
                  }}
                  className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 bg-cyan-950/30 text-cyan-400 border border-cyan-800/50 rounded-lg hover:bg-cyan-950/50 transition-all duration-200 text-xs sm:text-sm font-mono touch-manipulation"
                  title="Click to copy room code"
                >
                  <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="hidden xs:inline">{roomId}</span>
                  <span className="xs:hidden">Copy</span>
                </button>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-950 border border-gray-800 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  Copy room code
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Participants - Show first on mobile for quick overview */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-gray-950/50 border border-gray-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 lg:sticky lg:top-24 backdrop-blur-xl">
              <ParticipantList
                participants={roomState.participants}
                moderatorId="" /* No moderator - all users have equal permissions */
                currentUserId={roomState.participant?.id || ''}
                revealed={roomState.revealed}
                roomId={roomId}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6 lg:space-y-8 order-2 lg:order-1">
            {/* Onboarding Steps */}
            <OnboardingSteps
              currentStep={currentStep}
              participantCount={roomState.participants.length}
              roomState={roomState}
            />

            {/* Voting Timer */}
            {roomState.votingTimer?.active && (
              <VotingTimer
                initialTime={roomState.votingTimer.remainingTime}
                active={roomState.votingTimer.active}
                onTimeUp={() => {
                  actions.revealEstimates(); // Anyone can reveal estimates when time is up
                }}
                showControls={true} // Anyone can control the timer
                onToggle={(paused) => {
                  // Logic to handle timer pause/resume would go here
                  console.log(`Timer ${paused ? 'paused' : 'resumed'}`);
                }}
              />
            )}

            {/* Story Form - Available to all users when no current story */}
            {!roomState.currentStory && (
              <section className="bg-gray-950/30 border border-gray-800/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 backdrop-blur-xl">
                <div className="text-center mb-6 sm:mb-8">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-500/10 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 border border-blue-500/20">
                    <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2 sm:mb-3">
                    Ready to Estimate
                  </h2>
                  <p className="text-sm sm:text-base text-gray-400 max-w-lg mx-auto leading-relaxed px-2">
                    Add a story title or description to begin the estimation process with your team.
                  </p>
                </div>
                <StoryForm
                  onSubmit={handleStorySubmit}
                  onAnalyze={handleStoryAnalysis}
                  disabled={!roomState.connected}
                />
              </section>
            )}

            {/* Current Story */}
            {roomState.currentStory && (
              <section className="bg-gray-950/30 border border-gray-800/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 backdrop-blur-xl">
                <div className="flex items-start justify-between mb-6 sm:mb-8">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 flex-shrink-0">
                      <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-lg sm:text-xl font-semibold text-white mb-1">Current Story</h2>
                      <p className="text-xs sm:text-sm text-gray-500">Active estimation in progress</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-gray-900/40 rounded-xl p-4 sm:p-6 border border-gray-800/40">
                    <h3 className="font-semibold text-white text-lg sm:text-xl mb-2 sm:mb-3 break-words selectable-text">
                      {roomState.currentStory.title}
                    </h3>
                    {roomState.currentStory.description && (
                      <p className="text-gray-300 text-sm sm:text-base leading-relaxed break-words selectable-text">
                        {roomState.currentStory.description}
                      </p>
                    )}
                  </div>

                  {roomState.currentStory.acceptanceCriteria && roomState.currentStory.acceptanceCriteria.length > 0 && (
                    <div className="bg-gray-900/20 rounded-xl p-4 sm:p-6 border border-gray-800/20">
                      <h4 className="font-medium text-white mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
                        <Target className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400 flex-shrink-0" />
                        Acceptance Criteria
                      </h4>
                      <ul className="space-y-2 sm:space-y-3 text-gray-300 selectable-text">
                        {roomState.currentStory.acceptanceCriteria.map((criteria, index) => (
                          <li key={index} className="flex items-start gap-2 sm:gap-3 break-words">
                            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-400 rounded-full mt-2 sm:mt-2.5 flex-shrink-0"></span>
                            <span className="text-sm sm:text-base leading-relaxed">{criteria}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {roomState.currentStory.aiAnalysis && (
                    <div className="bg-gradient-to-r from-blue-950/30 to-purple-950/30 rounded-xl p-6 border border-blue-800/30">
                      <h4 className="font-medium text-blue-100 mb-6 flex items-center gap-3">
                        <BarChart3 className="h-5 w-5" />
                        AI Analysis
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center justify-between p-4 bg-blue-950/40 rounded-xl border border-blue-800/30">
                          <span className="text-blue-200">Complexity</span>
                          <span className="font-bold text-blue-100 text-xl">
                            {roomState.currentStory.aiAnalysis.complexity}/10
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-purple-950/40 rounded-xl border border-purple-800/30">
                          <span className="text-purple-200">Suggested Points</span>
                          <span className="font-bold text-purple-100 text-xl">
                            {roomState.currentStory.aiAnalysis.suggestedPoints}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 bg-gray-950/60 rounded-xl border border-gray-800/40">
                        <p className="text-blue-200 leading-relaxed break-words selectable-text">
                          <span className="font-medium text-blue-100">Reasoning:</span> {roomState.currentStory.aiAnalysis.reasoning}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Estimation Cards */}
            {roomState.currentStory && (
              <section className="bg-gray-950/30 border border-gray-800/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 backdrop-blur-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-6">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2 sm:mb-3">Cast Your Vote</h2>
                    {!roomState.revealed && (
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-400 rounded-full animate-pulse flex-shrink-0"></div>
                        <p className="text-sm sm:text-base text-gray-400 min-w-0">
                          {roomState.estimates.length} of {roomState.participants.length} participants voted
                          {roomState.estimates.length === roomState.participants.length && ' - Ready to reveal!'}
                        </p>
                      </div>
                    )}
                    {roomState.revealed && (
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-400 rounded-full flex-shrink-0"></div>
                        <p className="text-sm sm:text-base text-gray-400">Results revealed - Ready for next round</p>
                      </div>
                    )}
                  </div>

                  {/* Control buttons with improved styling */}
                  <div className="flex gap-2 sm:gap-3 flex-shrink-0">
                    {!roomState.revealed ? (
                      <button
                        onClick={actions.revealEstimates}
                        disabled={roomState.estimates.length === 0}
                        className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium rounded-lg sm:rounded-xl hover:from-emerald-700 hover:to-green-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 min-h-[44px] sm:min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-700 disabled:to-gray-700 shadow-lg touch-manipulation text-sm sm:text-base"
                        aria-label="Reveal all estimates"
                      >
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                        <span className="hidden sm:inline">
                          {roomState.estimates.length === roomState.participants.length
                            ? 'Reveal All'
                            : `Reveal (${roomState.estimates.length})`}
                        </span>
                        <span className="sm:hidden">Reveal</span>
                      </button>
                    ) : (
                      <div className="flex gap-2 sm:gap-3">
                        <button
                          onClick={actions.resetEstimates}
                          className="flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-2.5 sm:py-3 bg-gray-800 text-white font-medium rounded-lg sm:rounded-xl hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 min-h-[44px] sm:min-h-[48px] border border-gray-700 touch-manipulation text-sm sm:text-base"
                          aria-label="Reset estimates for new round with same story"
                        >
                          <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                          <span className="hidden sm:inline">Re-vote</span>
                          <span className="sm:hidden">Re-vote</span>
                        </button>
                        <button
                          onClick={actions.clearStoryAndReset}
                          className="flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 min-h-[44px] sm:min-h-[48px] shadow-lg touch-manipulation text-sm sm:text-base"
                          aria-label="Start estimation for a new story"
                        >
                          <FileText className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                          <span className="hidden sm:inline">New Story</span>
                          <span className="sm:hidden">Next</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <EstimationCards
                  selectedValue={roomState.selectedEstimate === -1 ? '?' : (roomState.selectedEstimate as EstimationCardValue)}
                  onSelect={handleEstimateSelect}
                  disabled={!roomState.connected || roomState.revealed}
                  revealed={roomState.revealed}
                />

                {roomState.revealed && stats && (
                  <div className="mt-10 p-8 bg-gradient-to-r from-gray-950/60 to-gray-900/60 rounded-2xl border border-gray-800/50 backdrop-blur-xl">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                        <BarChart3 className="h-6 w-6 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-xl">Estimation Results</h3>
                        <p className="text-gray-500">Analysis of team votes</p>
                      </div>
                    </div>

                    {/* Key Stats Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                      <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-800/40">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Most Common</div>
                        <div className="text-2xl font-bold text-white">
                          {(() => {
                            const histogram: Record<number, number> = {};
                            roomState.estimates.forEach(e => {
                              const val = e.estimate;
                              histogram[val] = (histogram[val] || 0) + 1;
                            });
                            let mode = -1;
                            let maxCount = 0;
                            Object.entries(histogram).forEach(([val, count]) => {
                              if (count > maxCount) {
                                maxCount = count;
                                mode = parseInt(val);
                              }
                            });
                            return mode;
                          })()}
                        </div>
                      </div>
                      <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-800/40">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Median</div>
                        <div className="text-2xl font-bold text-emerald-400">{stats.median}</div>
                      </div>
                      <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-800/40">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Average</div>
                        <div className="text-2xl font-bold text-blue-400">{stats.average}</div>
                      </div>
                      <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-800/40">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Range</div>
                        <div className="text-2xl font-bold text-purple-400">{stats.min} - {stats.max}</div>
                      </div>
                    </div>

                    {/* Enhanced Distribution Chart */}
                    <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-800/30">
                      <h4 className="text-white font-semibold mb-6 flex items-center gap-3">
                        <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                        Vote Distribution
                      </h4>
                      <div className="flex items-end justify-center h-40 gap-3 px-4">
                        {(() => {
                          const histogram: Record<number, number> = {};
                          roomState.estimates.forEach(e => {
                            const val = e.estimate;
                            histogram[val] = (histogram[val] || 0) + 1;
                          });

                          const uniqueValues = [...new Set(roomState.estimates.map(e => e.estimate))].sort((a, b) => a - b);
                          const maxCount = Math.max(...Object.values(histogram));

                          return uniqueValues.map(value => {
                            const count = histogram[value] || 0;
                            const percentage = (count / maxCount) * 100;
                            const cardColorClass = getCardColor(value);

                            return (
                              <div key={value} className="flex flex-col items-center min-w-[70px]">
                                <div className="text-sm font-bold text-white mb-2">{count}</div>
                                <div
                                  className={`w-full rounded-t-xl transition-all duration-500 ${cardColorClass.replace('from-', 'bg-').split(' ')[0]} border-t-2 border-white/20`}
                                  style={{
                                    height: `${Math.max(percentage, 20)}%`,
                                    minHeight: '32px'
                                  }}
                                />
                                <div className="text-lg font-bold text-white mt-3 px-3 py-2 bg-gray-800 rounded-lg border border-gray-700">
                                  {value}
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>

                    {/* Consensus indicators */}
                    {stats?.consensus ? (
                      <div className="mt-6 p-6 bg-gradient-to-r from-emerald-950/50 to-green-950/50 border border-emerald-800/50 rounded-xl">
                        <p className="text-emerald-200 font-semibold flex items-center gap-3 text-lg">
                          🎉 Perfect consensus reached!
                        </p>
                      </div>
                    ) : (
                      roomState.estimates.length >= 2 &&
                      stats &&
                      ((stats.max - stats.min) / stats.max < 0.5) && (
                        <div className="mt-6 p-6 bg-gradient-to-r from-blue-950/50 to-indigo-950/50 border border-blue-800/50 rounded-xl">
                          <p className="text-blue-200 font-semibold flex items-center gap-3 text-lg">
                            ✓ Strong agreement (low variance)
                          </p>
                        </div>
                      )
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
