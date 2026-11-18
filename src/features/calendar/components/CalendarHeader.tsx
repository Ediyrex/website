"use client";

import React from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
  Search,
  Plus,
} from "lucide-react";
import {
  CalendarSectionTab,
  CalendarViewMode,
  EventCategory,
} from "../types/calendar.types";
import {
  CALENDAR_SECTION_TABS,
  CATEGORY_STYLES,
} from "../config/calendar.config";

interface CalendarHeaderProps {
  currentTab: CalendarSectionTab;
  onTabChange: (tab: CalendarSectionTab) => void;
  viewMode: CalendarViewMode;
  onViewModeChange: (mode: CalendarViewMode) => void;
  currentDate: Date;
  onPrevDate: () => void;
  onNextDate: () => void;
  onToday: () => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isSyncing: boolean;
  onSync: () => void;
  dateRangeLabel: string;
}

export function CalendarHeader({
  currentTab,
  onTabChange,
  viewMode,
  onViewModeChange,
  onPrevDate,
  onNextDate,
  onToday,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  isSyncing,
  onSync,
  dateRangeLabel,
}: CalendarHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Top Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#252A32]">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[#D6B77A]" />
            <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-[#F5F3EE] tracking-tight">
              Calendar &amp; Scheduling
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#B2B4BA] mt-1">
            Google Calendar centralized management, client discovery calls, and studio operations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onSync}
            disabled={isSyncing}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#12151A] border border-[#252A32] text-xs font-mono text-[#F5F3EE] hover:border-[#D6B77A]/60 hover:text-[#D6B77A] transition-all disabled:opacity-50"
            title="Synchronize Google Calendar"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-[#D6B77A]" : ""}`}
            />
            <span className="hidden sm:inline">
              {isSyncing ? "Syncing..." : "Sync Calendar"}
            </span>
          </button>
        </div>
      </div>

      {/* Primary Section Tabs */}
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-[#252A32]">
        {CALENDAR_SECTION_TABS.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
                isActive
                  ? "bg-[#12151A] text-[#D6B77A] font-bold border border-[#D6B77A]/40 shadow-sm"
                  : "text-[#B2B4BA] hover:text-[#F5F3EE] hover:bg-[#12151A]/60 border border-transparent"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Calendar Controls (Shown on Calendar & Specific Filtered Views) */}
      {currentTab !== "integrations" && currentTab !== "overview" && (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1">
          {/* Left: Date Navigation */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToday}
              className="px-3 py-1.5 rounded-lg bg-[#12151A] border border-[#252A32] text-xs font-mono text-[#F5F3EE] hover:border-[#D6B77A]/60 transition-colors"
            >
              Today
            </button>

            <div className="flex items-center bg-[#12151A] rounded-lg border border-[#252A32]">
              <button
                type="button"
                onClick={onPrevDate}
                className="p-1.5 text-[#B2B4BA] hover:text-[#F5F3EE] transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onNextDate}
                className="p-1.5 text-[#B2B4BA] hover:text-[#F5F3EE] transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <span className="text-sm sm:text-base font-semibold text-[#F5F3EE] pl-2">
              {dateRangeLabel}
            </span>
          </div>

          {/* Right: Search, Category Filter, and View Mode Toggle */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#777D87] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-[#12151A] border border-[#252A32] rounded-lg text-[#F5F3EE] placeholder-[#777D87] focus:outline-none focus:border-[#D6B77A] w-36 sm:w-44 transition-colors"
              />
            </div>

            {/* Category Filter Dropdown */}
            {currentTab === "calendar" && (
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-[#12151A] border border-[#252A32] rounded-lg text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A] transition-colors cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  {Object.keys(CATEGORY_STYLES).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* View Mode Toggle: Month / Week / Day */}
            <div className="flex items-center bg-[#12151A] rounded-lg border border-[#252A32] p-0.5">
              {(["month", "week", "day"] as CalendarViewMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onViewModeChange(mode)}
                  className={`px-3 py-1 rounded text-xs font-mono uppercase tracking-wider transition-colors ${
                    viewMode === mode
                      ? "bg-[#D6B77A] text-[#08090B] font-bold shadow-sm"
                      : "text-[#B2B4BA] hover:text-[#F5F3EE]"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
