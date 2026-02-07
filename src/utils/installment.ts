/**
 * Tesham Installment Calculator Utilities
 */

export interface InstallmentPlan {
    months: number;
    markup: number; // Percentage (e.g., 14 for 14%)
}

// Rates with 20% Down Payment
export const RATES_WITH_DOWNPAYMENT: InstallmentPlan[] = [
    { months: 4, markup: 14 },
    { months: 5, markup: 15 },
    { months: 6, markup: 16 },
    { months: 7, markup: 17 },
    { months: 8, markup: 18 },
    { months: 9, markup: 23 },
    { months: 10, markup: 25 },
];

// Rates without Down Payment
export const RATES_NO_DOWNPAYMENT: InstallmentPlan[] = [
    { months: 2, markup: 21 },
    { months: 3, markup: 22 },
    { months: 4, markup: 23 },
    { months: 5, markup: 25 },
    { months: 6, markup: 27 },
    { months: 7, markup: 31 },
    { months: 8, markup: 33 },
    { months: 9, markup: 36 },
    { months: 10, markup: 38 },
];

export interface CalculationResult {
    totalPrice: number;
    markupAmount: number;
    downPayment: number;
    monthlyPayment: number;
    months: number;
    markupPercent: number;
}

export function calculateInstallment(
    price: number,
    months: number,
    hasDownPayment: boolean
): CalculationResult | null {
    const rates = hasDownPayment ? RATES_WITH_DOWNPAYMENT : RATES_NO_DOWNPAYMENT;
    const plan = rates.find((r) => r.months === months);

    if (!plan) return null;

    // 1. Calculate Total Price with Markup
    const markupAmount = Math.round(price * (plan.markup / 100));
    const totalPrice = price + markupAmount;

    // 2. Calculate Down Payment
    // "Первый взнос составляет 20% от общей суммы с учетом наценки"
    const downPayment = hasDownPayment ? Math.round(totalPrice * 0.20) : 0;

    // 3. Calculate Remainder
    const remainingAmount = totalPrice - downPayment;

    // 4. Calculate Monthly Payment
    // Note: If down payment exists, is the first month covered by down payment?
    // Usually, down payment is paid immediately, and then 'months' payments follow?
    // User says "duration of installment".
    // "divided by number of months" typically applies to the remainder.
    const monthlyPayment = Math.round(remainingAmount / months);

    return {
        totalPrice,
        markupAmount,
        downPayment,
        monthlyPayment,
        months,
        markupPercent: plan.markup
    };
}
