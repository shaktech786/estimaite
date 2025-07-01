'use client';

import { FeedbackButton as ShakUIFeedbackButton } from 'shakui';

interface FeedbackButtonProps {
  variant?: 'floating' | 'inline';
  className?: string;
}

export function FeedbackButton(props: FeedbackButtonProps) {
  return <ShakUIFeedbackButton {...props} />;
}
