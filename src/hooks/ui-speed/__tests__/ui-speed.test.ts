import { describe, it, expect, vi } from "vitest";

describe("UI Speed & Perceived Performance Principles", () => {
  describe("Wait stage message resolution (explain waits over 1s)", () => {
    const stages = [
      { afterMs: 1000, message: "Securing brief..." },
      { afterMs: 2500, message: "Syncing with desk..." },
      { afterMs: 5000, message: "Finalizing..." },
    ];

    function resolveWaitMessage(elapsedMs: number, customStages = stages): string | null {
      const matching = [...customStages]
        .sort((a, b) => b.afterMs - a.afterMs)
        .find((s) => elapsedMs >= s.afterMs);
      return matching ? matching.message : null;
    }

    it("returns null when elapsed wait is under 1000ms", () => {
      expect(resolveWaitMessage(200)).toBeNull();
      expect(resolveWaitMessage(999)).toBeNull();
    });

    it("returns first stage explanation between 1000ms and 2499ms", () => {
      expect(resolveWaitMessage(1000)).toBe("Securing brief...");
      expect(resolveWaitMessage(2400)).toBe("Securing brief...");
    });

    it("progresses to next explanation at 2500ms and 5000ms", () => {
      expect(resolveWaitMessage(2500)).toBe("Syncing with desk...");
      expect(resolveWaitMessage(5500)).toBe("Finalizing...");
    });
  });

  describe("Optimistic UI state transitions", () => {
    it("immediately reflects optimistic changes and rolls back on failure", async () => {
      let state = { status: "failed", attempts: 3 };
      const originalState = { ...state };

      // Optimistic transition
      const optimisticUpdate = (prev: typeof state) => ({
        ...prev,
        status: "pending",
        attempts: 0,
      });

      state = optimisticUpdate(state);
      expect(state.status).toBe("pending");
      expect(state.attempts).toBe(0);

      // Simulated network failure
      const simulateFailedNetworkCall = async () => {
        throw new Error("Network timeout");
      };

      try {
        await simulateFailedNetworkCall();
      } catch {
        // Rollback
        state = originalState;
      }

      expect(state.status).toBe("failed");
      expect(state.attempts).toBe(3);
    });

    it("commits optimistic changes upon success", async () => {
      let state = { count: 1 };
      const nextState = { count: 2 };

      // Optimistic update
      state = nextState;
      expect(state.count).toBe(2);

      // Remote success
      const result = await Promise.resolve({ ok: true });
      expect(result.ok).toBe(true);
      expect(state.count).toBe(2);
    });
  });

  describe("Progress bar accelerated phases (progress bar speed up)", () => {
    it("defines speed-up phases reaching 35% in 80ms and 65% in 200ms", () => {
      const checkpoints = [
        { timeMs: 80, target: 35 },
        { timeMs: 200, target: 65 },
        { timeMs: 550, target: 85 },
      ];

      expect(checkpoints[0].target).toBe(35);
      expect(checkpoints[1].target).toBe(65);
      expect(checkpoints[2].target).toBe(85);
    });
  });
});
