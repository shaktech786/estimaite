'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Plus, LogIn, Sparkles } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { BrandName } from '@/components/BrandName';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { KeyboardShortcutHint } from '@/components/KeyboardShortcutHint';

export default function HomePage() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [participantName, setParticipantName] = useState('');

  const createRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) return;

    setIsCreating(true);
    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: roomName.trim() }),
      });

      if (!response.ok) throw new Error('Failed to create room');

      const { roomId } = await response.json();
      router.push(`/room/${roomId}?name=${encodeURIComponent(participantName || 'Anonymous')}`);
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Failed to create room. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const joinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode.trim()) return;

    setIsJoining(true);
    try {
      const response = await fetch(`/api/rooms?roomId=${roomCode.trim().toUpperCase()}`);

      if (!response.ok) {
        if (response.status === 404) {
          alert('Room not found. The room may have expired due to inactivity, or the code may be incorrect. Please double-check the room code or create a new room.');
        } else {
          throw new Error('Failed to join room');
        }
        return;
      }

      router.push(`/room/${roomCode.trim().toUpperCase()}?name=${encodeURIComponent(participantName || 'Anonymous')}`);
    } catch (error) {
      console.error('Error joining room:', error);
      alert('Failed to join room. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  // Keyboard shortcuts for form submissions
  const handleCreateRoom = () => {
    if (canCreateRoom) {
      createRoom({ preventDefault: () => {} } as React.FormEvent);
    }
  };

  const handleJoinRoom = () => {
    if (canJoinRoom) {
      joinRoom({ preventDefault: () => {} } as React.FormEvent);
    }
  };

  const canCreateRoom = roomName.trim() && participantName.trim() && !isCreating;
  const canJoinRoom = roomCode.trim() && participantName.trim() && !isJoining;

  const createPlatformInfo = useKeyboardShortcuts({
    onSubmit: handleCreateRoom,
    enabled: !!canCreateRoom
  });

  const joinPlatformInfo = useKeyboardShortcuts({
    onSubmit: handleJoinRoom,
    enabled: !!canJoinRoom
  });

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-4">
              <Logo size="md" className="sm:hidden" />
              <Logo size="lg" className="hidden sm:flex" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            Planning Poker Made Simple
          </h2>
          <p className="text-base lg:text-lg text-gray-300 max-w-2xl mx-auto selectable-text">
            Estimate user stories with your team using AI-powered insights.
            No sign-up required, sessions are temporary and private.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-2xl mx-auto">
          {/* Create Room */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 lg:p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Plus className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Create Room</h3>
            </div>

            <p className="text-gray-300 mb-6">
              Start a new estimation session and invite your team members.
            </p>

            <form onSubmit={createRoom} className="space-y-4">
              <div>
                <label htmlFor="participant-name-create" className="block text-sm font-medium text-gray-300 mb-2">
                  Your Name
                </label>
                <input
                  id="participant-name-create"
                  type="text"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                  aria-describedby="name-help"
                />
                <p id="name-help" className="text-xs text-gray-400 mt-1">
                  This will be visible to other participants
                </p>
              </div>

              <div>
                <label htmlFor="room-name" className="block text-sm font-medium text-gray-300 mb-2">
                  Room Name
                </label>
                <input
                  id="room-name"
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Sprint Planning Session"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                  maxLength={50}
                />
              </div>

              <button
                type="submit"
                disabled={isCreating || !roomName.trim() || !participantName.trim()}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px] touch-manipulation"
              >
                <div className="flex items-center justify-center gap-2">
                  <span>{isCreating ? 'Creating...' : 'Create Room'}</span>
                  {!isCreating && (
                    <KeyboardShortcutHint
                      shortcutDisplay={createPlatformInfo.shortcutDisplay}
                      isMobile={createPlatformInfo.isMobile}
                    />
                  )}
                </div>
              </button>
            </form>
          </div>

          {/* Join Room */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 lg:p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-green-900/30 rounded-lg flex items-center justify-center">
                <LogIn className="h-5 w-5 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Join Room</h3>
            </div>

            <p className="text-gray-300 mb-6">
              Enter a room code to join an existing estimation session.
            </p>
            
            <div className="bg-amber-900/20 border border-amber-700/50 rounded-lg p-3 mb-6">
              <p className="text-amber-200 text-xs">
                💡 <strong>Note:</strong> Rooms expire after 30 minutes of inactivity for privacy and performance.
              </p>
            </div>

            <form onSubmit={joinRoom} className="space-y-4">
              <div>
                <label htmlFor="participant-name-join" className="block text-sm font-medium text-gray-300 mb-2">
                  Your Name
                </label>
                <input
                  id="participant-name-join"
                  type="text"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="room-code" className="block text-sm font-medium text-gray-300 mb-2">
                  Room Code
                </label>
                <input
                  id="room-code"
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="A1B2C3D4"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors font-mono text-center"
                  required
                  maxLength={8}
                  minLength={8}
                />
              </div>

              <button
                type="submit"
                disabled={isJoining || !roomCode.trim() || !participantName.trim()}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px] touch-manipulation"
              >
                <div className="flex items-center justify-center gap-2">
                  <span>{isJoining ? 'Joining...' : 'Join Room'}</span>
                  {!isJoining && (
                    <KeyboardShortcutHint
                      shortcutDisplay={joinPlatformInfo.shortcutDisplay}
                      isMobile={joinPlatformInfo.isMobile}
                    />
                  )}
                </div>
              </button>
            </form>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 lg:mt-16 text-center">
          <h3 className="text-lg font-semibold text-white mb-6 lg:mb-8">
            Why <BrandName variant="dark" />?
          </h3>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Sparkles className="h-6 w-6 text-blue-400" />
              </div>
              <h4 className="font-medium text-white mb-2">AI-Powered</h4>
              <p className="text-sm text-gray-300">
                Get intelligent story analysis and estimation suggestions
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-green-400" />
              </div>
              <h4 className="font-medium text-white mb-2">Real-time</h4>
              <p className="text-sm text-gray-300">
                Collaborate instantly with your team members
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                <div className="w-6 h-6 border-2 border-purple-400 rounded border-dashed"></div>
              </div>
              <h4 className="font-medium text-white mb-2">Private</h4>
              <p className="text-sm text-gray-300">
                No data stored, sessions are temporary and secure
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-700 mt-12 lg:mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 text-center">
          <p className="text-sm text-gray-400">
            Built with Next.js, powered by AI. No data stored, sessions expire automatically.
          </p>
        </div>
      </footer>
    </div>
  );
}
