import React from 'react';
import { EstimationCards as ShakUIEstimationCards, type EstimationValue, type EstimationCard } from '@shakgpt/ui';
import { type EstimationCardValue, ESTIMATION_CARDS } from '@/types';

interface EstimationCardsProps {
  selectedValue?: EstimationCardValue;
  onSelect: (value: EstimationCardValue) => void;
  disabled?: boolean;
  revealed?: boolean;
}

export function EstimationCards({
  selectedValue,
  onSelect,
  disabled = false,
  revealed = false
}: EstimationCardsProps) {
  // Convert EstimAIte cards to ShakUI format
  const shakUICards: EstimationCard[] = ESTIMATION_CARDS.map(card => ({
    value: card.value as EstimationValue,
    label: card.label
  }));

  const handleSelect = (value: EstimationValue) => {
    onSelect(value as EstimationCardValue);
  };

  return (
    <ShakUIEstimationCards
      cards={shakUICards}
      selectedValue={selectedValue as EstimationValue}
      onSelect={handleSelect}
      disabled={disabled}
      revealed={revealed}
    />
  );
}
