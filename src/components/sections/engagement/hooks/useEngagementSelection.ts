"use client";

import { useState } from "react";
import {
  ENGAGEMENT_MODELS,
  type EngagementId,
  type EngagementModel,
} from "../data/engagementModels";

export type EngagementTab = "ways" | "faq";

export function useEngagementSelection(initialId: EngagementId = "project-based") {
  const [selectedId, setSelectedId] = useState<EngagementId>(initialId);
  const [activeTab, setActiveTab] = useState<EngagementTab>("ways");

  const selectedModel: EngagementModel =
    ENGAGEMENT_MODELS.find((item) => item.id === selectedId) ?? ENGAGEMENT_MODELS[0];

  const selectModel = (id: EngagementId) => {
    setSelectedId(id);
  };

  return {
    selectedId,
    selectedModel,
    selectModel,
    activeTab,
    setActiveTab,
  };
}

