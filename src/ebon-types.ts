export type TaxCategory = 'A' | 'B';

export type ReceiptItem = {
    taxCategory: TaxCategory,
    name: string,
    subTotal: number,
    paybackQualified: boolean,
    amount?: number,
    unit?: string,
    pricePerUnit?: number
};

export type Payment = {
    type: string,
    value: number
}

export type Receipt = {
    date: Date,
    market: string,
    cashier: string,
    checkout: string,
    vatin: string,
    items: ReceiptItem[],
    total: number,
    given: Payment[],
    change?: number,
    payout?: number,
    payback?: PaybackData,
    taxDetails: TaxDetails
};

export type PaybackData = {
    card: string,
    pointsBefore: number,
    points: number,
    revenue: number
};

export type TaxDetailsEntry = {
    taxPercent: number,
    net: number,
    tax: number,
    gross: number
};

export type TaxDetails = {
    total: {
        net: number,
        tax: number,
        gross: number
    },
    A: TaxDetailsEntry,
    B: TaxDetailsEntry
};
