"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import type {
  BookingContextValue,
  BookingModalOptions,
  BookingModalState,
} from "../types/booking.types";
import { resolveCalLink } from "../config/booking.config";
import { CalBookingDialog } from "../components/CalBookingDialog";

const BookingContext = createContext<BookingContextValue | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [modalState, setModalState] = useState<BookingModalState>({
    isOpen: false,
    calLink: resolveCalLink(),
  });

  const openBookingModal = useCallback((options?: BookingModalOptions) => {
    setModalState({
      isOpen: true,
      calLink: options?.calLink || resolveCalLink(),
      prefill: options?.prefill,
      title: options?.title,
      description: options?.description,
    });
  }, []);

  const closeBookingModal = useCallback(() => {
    setModalState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  const value = useMemo<BookingContextValue>(
    () => ({
      isOpen: modalState.isOpen,
      calLink: modalState.calLink,
      prefill: modalState.prefill,
      title: modalState.title,
      description: modalState.description,
      openBookingModal,
      closeBookingModal,
    }),
    [modalState, openBookingModal, closeBookingModal]
  );

  return (
    <BookingContext.Provider value={value}>
      {children}
      <CalBookingDialog
        isOpen={modalState.isOpen}
        onClose={closeBookingModal}
        calLink={modalState.calLink}
        prefill={modalState.prefill}
        title={modalState.title}
        description={modalState.description}
      />
    </BookingContext.Provider>
  );
}

export function useBookingModal(): BookingContextValue {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBookingModal must be used within a BookingProvider");
  }
  return context;
}
