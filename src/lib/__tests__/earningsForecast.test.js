import { describe, it, expect } from "vitest";
import {
  PROJECTED_STATUSES,
  isSessionPayment,
  isProjectedPayment,
  paymentNetAmount,
  paymentMonthDate,
  isSameMonth,
  computeProjectedThisMonth,
} from "../earningsForecast";

const NOW = new Date("2026-08-15T10:00:00.000Z");

// Helper builders matching the Payment docs returned by /api/payments/tutor/:email
const sessionPayment = (overrides = {}) => ({
  status: "confirmed",
  basis: "session",
  grossAmount: 12000,
  commissionAmount: 1200,
  netTutorAmount: 10800,
  billingPeriodStart: "2026-08-01T00:00:00.000Z",
  createdAt: "2026-08-02T00:00:00.000Z",
  ...overrides,
});

describe("isSessionPayment", () => {
  it("accepts basis=session", () => {
    expect(isSessionPayment({ basis: "session" })).toBe(true);
  });

  it("accepts a sessionId even without basis", () => {
    expect(isSessionPayment({ sessionId: "abc" })).toBe(true);
  });

  it("rejects application basis / empty", () => {
    expect(isSessionPayment({ basis: "application" })).toBe(false);
    expect(isSessionPayment(null)).toBe(false);
    expect(isSessionPayment({})).toBe(false);
  });
});

describe("isProjectedPayment", () => {
  it("accepts confirmed session payments", () => {
    expect(isProjectedPayment(sessionPayment())).toBe(true);
  });

  it("rejects confirmed application payments (plan: confirmed-SESSION only)", () => {
    expect(isProjectedPayment(sessionPayment({ basis: "application" }))).toBe(false);
  });

  it("accepts pending billing_generated regardless of basis", () => {
    expect(isProjectedPayment(sessionPayment({ status: "billing_generated", basis: "application" }))).toBe(true);
  });

  it("accepts pending escrow_hold regardless of basis", () => {
    expect(isProjectedPayment(sessionPayment({ status: "escrow_hold", basis: "application" }))).toBe(true);
  });

  it("rejects other statuses", () => {
    for (const status of ["pending_verification", "commission_applied", "available_for_withdrawal", "withdrawn", "rejected"]) {
      expect(isProjectedPayment(sessionPayment({ status }))).toBe(false);
    }
  });

  it("rejects null", () => {
    expect(isProjectedPayment(null)).toBe(false);
  });
});

describe("PROJECTED_STATUSES", () => {
  it("contains exactly the three plan statuses", () => {
    expect([...PROJECTED_STATUSES].sort()).toEqual(["billing_generated", "confirmed", "escrow_hold"]);
  });
});

describe("paymentNetAmount", () => {
  it("prefers netTutorAmount (commission already applied)", () => {
    expect(paymentNetAmount(sessionPayment())).toBe(10800);
  });

  it("falls back to gross minus commission", () => {
    expect(paymentNetAmount(sessionPayment({ netTutorAmount: undefined }))).toBe(10800);
  });

  it("falls back to gross when commission is missing", () => {
    expect(paymentNetAmount(sessionPayment({ netTutorAmount: undefined, commissionAmount: undefined }))).toBe(12000);
  });

  it("returns 0 for null", () => {
    expect(paymentNetAmount(null)).toBe(0);
  });
});

describe("paymentMonthDate / isSameMonth", () => {
  it("uses billingPeriodStart when present", () => {
    const d = paymentMonthDate(sessionPayment());
    expect(d.getUTCFullYear()).toBe(2026);
    expect(d.getUTCMonth()).toBe(7); // August = 7
  });

  it("falls back to createdAt", () => {
    const d = paymentMonthDate(sessionPayment({ billingPeriodStart: undefined }));
    expect(d.getUTCMonth()).toBe(7);
  });

  it("returns null when no date present", () => {
    expect(paymentMonthDate({})).toBe(null);
    expect(paymentMonthDate(null)).toBe(null);
  });

  it("compares year + month", () => {
    expect(isSameMonth(new Date("2026-08-10T12:00:00Z"), NOW)).toBe(true);
    expect(isSameMonth(new Date("2026-07-15T00:00:00Z"), NOW)).toBe(false);
    expect(isSameMonth(null, NOW)).toBe(false);
  });
});

describe("computeProjectedThisMonth", () => {
  it("sums net amounts of in-month projected payments", () => {
    const payments = [
      sessionPayment(), // 10800 confirmed session this month
      sessionPayment({ status: "billing_generated", grossAmount: 6000, commissionAmount: 600, netTutorAmount: 5400 }),
      sessionPayment({ status: "escrow_hold", grossAmount: 3000, commissionAmount: 300, netTutorAmount: 2700 }),
    ];
    expect(computeProjectedThisMonth(payments, NOW)).toBe(18900);
  });

  it("excludes confirmed application payments", () => {
    const payments = [sessionPayment({ basis: "application" })];
    expect(computeProjectedThisMonth(payments, NOW)).toBe(0);
  });

  it("excludes payments outside the current month", () => {
    const payments = [
      sessionPayment({ billingPeriodStart: "2026-07-01T00:00:00.000Z", createdAt: "2026-07-10T00:00:00.000Z" }),
      sessionPayment({ status: "billing_generated", billingPeriodStart: "2026-09-01T00:00:00.000Z", createdAt: "2026-09-01T00:00:00.000Z" }),
    ];
    expect(computeProjectedThisMonth(payments, NOW)).toBe(0);
  });

  it("excludes non-projected statuses (rejected, withdrawn, pending_verification)", () => {
    const payments = [
      sessionPayment({ status: "rejected" }),
      sessionPayment({ status: "withdrawn" }),
      sessionPayment({ status: "pending_verification" }),
      sessionPayment({ status: "commission_applied" }),
    ];
    expect(computeProjectedThisMonth(payments, NOW)).toBe(0);
  });

  it("skips malformed entries", () => {
    const payments = [null, undefined, {}, sessionPayment()];
    expect(computeProjectedThisMonth(payments, NOW)).toBe(10800);
  });

  it("returns 0 for non-array / empty", () => {
    expect(computeProjectedThisMonth(null, NOW)).toBe(0);
    expect(computeProjectedThisMonth(undefined, NOW)).toBe(0);
    expect(computeProjectedThisMonth([], NOW)).toBe(0);
  });

  it("uses the fallback date (createdAt) when billingPeriodStart is absent", () => {
    const payments = [
      sessionPayment({ billingPeriodStart: undefined, createdAt: "2026-08-20T00:00:00.000Z" }),
      sessionPayment({ billingPeriodStart: undefined, createdAt: "2026-07-01T00:00:00.000Z" }),
    ];
    expect(computeProjectedThisMonth(payments, NOW)).toBe(10800);
  });
});
