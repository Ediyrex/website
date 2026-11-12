"use client";

import {
  ENGAGEMENT_MODELS,
  type EngagementId,
} from "../data/engagementModels";
import { EngagementCard } from "./EngagementCard";
import { EngagementRibbon } from "./EngagementRibbon";

interface EngagementCardListProps {
  selectedId: EngagementId;
  onSelect: (id: EngagementId) => void;
}

export function EngagementCardList({
  selectedId,
  onSelect,
}: EngagementCardListProps) {
  return (
    <div
      data-engagement-stage
      className="relative py-4 sm:py-6"
    >
      {/* Flowing orange ambient ribbon woven behind cards */}
      <EngagementRibbon selectedId={selectedId} />

      {/* Three dimensional interactive engagement cards */}
      <div
        role="group"
        aria-label="Choose an engagement model"
        className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-3 lg:gap-4 items-stretch"
      >
        {ENGAGEMENT_MODELS.map((model, index) => (
          <EngagementCard
            key={model.id}
            model={model}
            slotIndex={index}
            isActive={selectedId === model.id}
            onSelect={() => onSelect(model.id)}
          />
        ))}
      </div>
    </div>
  );
}

