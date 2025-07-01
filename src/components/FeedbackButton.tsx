'use client';

import { FeedbackButton as ShakUIFeedbackButton } from '@shakgpt/ui';

interface FeedbackButtonProps {
  variant?: 'floating' | 'inline';
  className?: string;
}

export function FeedbackButton(props: FeedbackButtonProps) {
  return <ShakUIFeedbackButton {...props} />;
}
