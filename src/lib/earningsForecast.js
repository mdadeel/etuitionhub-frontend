/**
 * Tutor earnings forecast — pure helpers for the dashboard "Projected this
 * month" card. Reuses data already returned by GET /api/payments/tutor/:email;
 * no backend change.
 */

/** Statuses that count toward the current-month projection. */
export const PROJECTED_STATUSES = new Set(["confirmed", "billing_generated", "escrow_hold"]);

/**
 * A payment is "projected" if it is confirmed-session, or a pending
 * billing_generated / escrow_hold pipeline payment.
 */
export const isSessionPayment = (payment) =>
  Boolean(payment) && (payment.basis === "session" || Boolean(payment.sessionId));

export const isProjectedPayment = (payment) => {
  if (!payment || !PROJECTED_STATUSES.has(payment.status)) return false;
  // The plan counts confirmed-SESSION payments only; pending pipeline statuses
  // (billing_generated / escrow_hold) count regardless of basis.
  if (payment.status === "confirmed" && !isSessionPayment(payment)) return false;
  return true;
};

/** Tutor's take-home for a payment (gross minus commission). */
export const paymentNetAmount = (payment) => {
  if (!payment) return 0;
  if (typeof payment.netTutorAmount === "number") return payment.netTutorAmount;
  const gross = typeof payment.grossAmount === "number" ? payment.grossAmount : 0;
  const commission = typeof payment.commissionAmount === "number" ? payment.commissionAmount : 0;
  return gross - commission;
};

/** The month a payment belongs to: billing period start, else creation time. */
export const paymentMonthDate = (payment) => {
  if (!payment) return null;
  const raw = payment.billingPeriodStart || payment.createdAt;
  if (!raw) return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const isSameMonth = (date, ref = new Date()) =>
  Boolean(date) && date.getFullYear() === ref.getFullYear() && date.getMonth() === ref.getMonth();

/**
 * Projected tutor earnings for the current month: sum of net amounts of
 * confirmed-session + pending billing_generated/escrow_hold payments whose
 * month falls within the reference month.
 *
 * @param {Array} payments payment docs from GET /api/payments/tutor/:email
 * @param {Date} [now] reference date for "this month" (injectable for tests)
 * @returns {number}
 */
export const computeProjectedThisMonth = (payments, now = new Date()) => {
  if (!Array.isArray(payments)) return 0;
  return payments.reduce((sum, p) => {
    if (!isProjectedPayment(p)) return sum;
    const monthDate = paymentMonthDate(p);
    if (!monthDate || !isSameMonth(monthDate, now)) return sum;
    return sum + paymentNetAmount(p);
  }, 0);
};
