'use client';
import React from 'react';
import { StoryForm as ShakUIStoryForm, type StoryFormData, type AIAnalysis } from '@shakgpt/ui';
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
  const handleSubmit = (formData: StoryFormData) => {
    // Convert ShakUI story data to EstimAIte format
    const estimAIteStory: Story = {
      title: formData.title,
      description: formData.description || '',
      acceptanceCriteria: formData.acceptanceCriteria || []
      // aiAnalysis will be added separately after analysis
    };

    onSubmit(estimAIteStory);
  };

  const handleAnalyze = async (formData: StoryFormData): Promise<AIAnalysis> => {
    if (!onAnalyze) {
      throw new Error('Analysis function not provided');
    }

    // Convert ShakUI story data to EstimAIte format for analysis
    const estimAIteStory: Omit<Story, 'aiAnalysis'> = {
      title: formData.title,
      description: formData.description || '',
      acceptanceCriteria: formData.acceptanceCriteria || []
    };

    const estimAIteAnalysis = await onAnalyze(estimAIteStory);
    
    // Convert EstimAIte AIAnalysis to ShakUI format  
    const shakUIAnalysis: AIAnalysis = {
      complexity: estimAIteAnalysis.complexity === 'low' ? 'simple' : 
                  estimAIteAnalysis.complexity === 'high' ? 'complex' : 'medium',
      suggestedPoints: (estimAIteAnalysis.suggestedPoints?.[0] as number) || 3 // Take first suggested point
    };

    return shakUIAnalysis;
  };

  // Convert initial EstimAIte story to ShakUI format
  const initialFormData: Partial<StoryFormData> | undefined = initialStory ? {
    ...(initialStory.title && { title: initialStory.title }),
    ...(initialStory.description && { description: initialStory.description }),
    ...(initialStory.acceptanceCriteria && { acceptanceCriteria: initialStory.acceptanceCriteria })
  } : undefined;

  return (
    <ShakUIStoryForm
      onSubmit={handleSubmit}
      {...(onAnalyze && { onAnalyze: handleAnalyze })}
      disabled={disabled}
      {...(initialFormData && { initialStory: initialFormData })}
      variant="simple"
      showAIFeatures={!!onAnalyze}
    />
  );
}
