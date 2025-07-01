'use client';

import { FeedbackModal as ShakUIFeedbackModal } from '@shakgpt/ui';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackModal(props: FeedbackModalProps) {
  return <ShakUIFeedbackModal {...props} />;
}
