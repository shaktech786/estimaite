'use client';

import { FeedbackModal as ShakUIFeedbackModal } from 'shakui';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackModal(props: FeedbackModalProps) {
  return <ShakUIFeedbackModal {...props} />;
}
