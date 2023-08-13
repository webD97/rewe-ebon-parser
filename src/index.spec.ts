import { readFileSync } from 'fs';
import { parseEBon } from '.';
import { PaybackData, Receipt } from './ebon-types';

describe('given example pdf #5', () => {
    let ebon: Receipt;

    beforeAll(async () => {
        ebon = await parseEBon(readFileSync('./examples/eBons/5.pdf'));
    });

    describe('purchase metadata', () => {
        test('finds correct date', () => {
            expect(ebon.date).toBeInstanceOf(Date);
            expect(ebon.date.toISOString()).toBe("2023-08-11T16:09:00.000Z");
        });

        test('finds correct cashier', () => {
            expect(ebon.cashier).toBe('303030');
        });
    
        test('finds correct checkout', () => {
            expect(ebon.checkout).toBe('3');
        });

        test('finds correct store', () => {
            expect(ebon.market).toBe('5472');
        });

        test('finds correct store address', () => {
            expect(ebon.marketAddress).toEqual({
                street: "Im Weidenbruch 136",
                zip: "51061",
                city: "Köln"
            });
        });
    });

    describe('purchase', () => {
        test('finds correct amount of items', () => {
            expect(ebon.items.length).toBe(18);
        });

        test('correctly identifies item #1 (single)', () => {
            const item = ebon.items[0];
            expect(item.name).toBe('SALAMI SPITZENQ.');
            expect(item.amount).toBe(1);
            expect(item.paybackQualified).toBe(true);
            expect(item.pricePerUnit).toBeUndefined();
            expect(item.taxCategory).toBe('B');
            expect(item.unit).toBeUndefined();
            expect(item.subTotal).toBeCloseTo(1.79);
        });

        test('correctly identifies item #7 (multiple)', () => {
            const item = ebon.items[6];
            expect(item.name).toBe('BAG. SPECIALE');
            expect(item.amount).toBe(2);
            expect(item.paybackQualified).toBe(true);
            expect(item.pricePerUnit).toBeCloseTo(2.29);
            expect(item.taxCategory).toBe('B');
            expect(item.unit).toBe('Stk');
            expect(item.subTotal).toBeCloseTo(4.58);
        });

        test('correctly identifies item #17 (discount)', () => {
            const item = ebon.items[16];
            expect(item.name).toBe('Mitarbeiterrabatt 5%');
            expect(item.paybackQualified).toBe(false);
            expect(item.taxCategory).toBe('A');
            expect(item.subTotal).toBeCloseTo(-0.29);
        });

        test('returns payout as undefined', () => {
            expect(ebon.payout).toBeUndefined();
        });

        test('correctly identifies total', () => {
            expect(ebon.total).toBeCloseTo(39.44);
        });

        test('correctly identifies Payback information', () => {
            expect(ebon.payback?.card).toBe('#########9334');
            expect(ebon.payback?.basePoints).toBe(19);
            expect(ebon.payback?.couponPoints).toBe(0);
            expect(ebon.payback?.earnedPoints).toBe(19);
            expect(ebon.payback?.pointsBefore).toBe(7638);
            expect(ebon.payback?.qualifiedRevenue).toBeCloseTo(39.44);
            expect(ebon.payback?.usedCoupons).toEqual([]);
            expect(ebon.payback?.usedREWECredit).toBeUndefined;
            expect(ebon.payback?.newREWECredit).toBeUndefined;
        });
    });

    describe('customer payment', () => {
        test('finds correct given money', () => {
            expect(ebon.given.length).toBe(2);
        });
    
        test('correctly handles "Inflationsprämie"', () => {
            expect(ebon.given[0].type).toBe("Inflationsprämie");
            expect(ebon.given[0].value).toBeCloseTo(2.08);
        });

        test('correctly handles "EC-Cash"', () => {
            expect(ebon.given[1].type).toBe("EC-Cash");
            expect(ebon.given[1].value).toBeCloseTo(37.36);
        });

        test('determines change as undefined', () => {
            expect(ebon.change).toBeUndefined();
        });
    });

});
