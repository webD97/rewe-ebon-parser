import pdf from 'pdf-parse';
import { MarketAddress, PaybackCoupon, Payment, Receipt, ReceiptItem, TaxCategory, TaxDetails } from './ebon-types';

/**
 * Create a Receipt object from a REWE eBon PDF file.
 * @param dataBuffer PDF data
 */
export async function parseEBon(dataBuffer: Buffer): Promise<Receipt> {
    const data: { text: string } = await pdf(dataBuffer);
    const lines = data.text
        .replace(/  +/g, ' ')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line !== '');

    let date: Date = new Date(),
        market: string = '?',
        marketAddress: MarketAddress | undefined = undefined,
        cashier: string = '?',
        checkout: string = '?',
        uid: string = '?',
        items: ReceiptItem[] = [],
        total: number = Number.NaN,
        given: Payment[] = [],
        change: number = Number.NaN,
        payout: number = Number.NaN,
        paybackPointsBefore = Number.NaN,
        paybackPoints: number = Number.NaN,
        paybackRevenue: number = Number.NaN,
        paybackCardNumber: string = '?',
        paybackCoupons: PaybackCoupon[] = [],
        usedREWECredit: number = Number.NaN,
        newREWECredit: number = Number.NaN,
        taxDetails: TaxDetails = {
            total: {  net: Number.NaN, tax: Number.NaN, gross: Number.NaN }
        };

    const addressMatch = data.text.match(/[\s\*]*([a-zäöüß \d.,-]+?)[\s\*]*(\d{5})\s*([a-zäöüß \d.,-]+)[\s\*]*/im);

    if (addressMatch) {
      marketAddress = {
        street: addressMatch[1].trim(),
        zip: addressMatch[2],
        city: addressMatch[3].trim(),
      };
    }

    lines.forEach(line => {
        const itemHit = line.match(/([0-9A-Za-zäöüÄÖÜß &%.!+,\-]*) (-?\d*,\d\d) ([AB]) ?(\*?)/);

        if (itemHit) {
            const item = itemHit[1];
            const price = parseFloat(itemHit[2].replace(',', '.'));
            const category = itemHit[3] as TaxCategory;
            const paybackQualified = !itemHit[4] && price > 0;

            items.push({
                taxCategory: category,
                name: item,
                amount: 1,
                subTotal: price,
                paybackQualified: paybackQualified
            });

            return;
        }

        const mengeHit = line.match(/(.*) (.*) x (.*).*/);

        if (mengeHit) {
            items[items.length - 1] = {
                ...items[items.length - 1],
                amount: parseFloat(mengeHit[1].replace(',', '.')),
                unit: mengeHit[2],
                pricePerUnit: parseFloat(mengeHit[3].replace(',', '.'))
            }

            return;
        }

        const totalHit = line.match(/SUMME EUR (-?\d*,\d\d)/);

        if (totalHit) {
            total = parseFloat(totalHit[1].replace(',', '.'));

            return;
        }

        const gegebenHit = line.match(/Geg\. (.*) EUR ([0-9,]*)/);

        if (gegebenHit) {
            given.push({
                type: gegebenHit[1],
                value: parseFloat(gegebenHit[2].replace(',', '.'))
            });

            return;
        }

        const returnHit = line.match(/Rückgeld BAR EUR ([0-9,]*)/);

        if (returnHit) {
            change = parseFloat(returnHit[1].replace(',', '.'));

            return;
        }

        const payoutMatch = line.match(/AUSZAHLUNG EUR ([0-9,]*)/);

        if (payoutMatch) {
            payout = parseFloat(payoutMatch[1].replace(',', '.'));

            return;
        }

        const timestampHit = line.match(/(\d*)\.(\d*)\.(\d*) (\d*):(\d*) Bon-Nr\.:(.*)/);

        if (timestampHit) {
            date = new Date(Date.UTC(
                parseInt(timestampHit[3]),
                parseInt(timestampHit[2]) - 1,
                parseInt(timestampHit[1]),
                parseInt(timestampHit[4]),
                parseInt(timestampHit[5])
            ));

            return;
        }

        const marktMatch = line.match(/Markt:(.*) Kasse:(.*) Bed\.:(.*)/);

        if (marktMatch) {
            market = marktMatch[1];
            checkout = marktMatch[2];
            cashier = marktMatch[3];

            return;
        }

        const uidMatch = line.match(/UID Nr.: (.*)/);

        if (uidMatch) {
            uid = uidMatch[1];

            return;
        }

        const paybackPointsMatch = line.match(/Sie erhalten (\d*) PAYBACK Punkte? auf|Mit diesem Einkauf gesammelt: (\d*) Punkte?/);

        if (paybackPointsMatch) {
            const match = paybackPointsMatch.slice(1).find(group => group != null)!;
            paybackPoints = parseInt(match);

            return;
        }

        const paybackRevenueMatch = line.match(/einen PAYBACK Umsatz von (.*) EUR!/);

        if (paybackRevenueMatch) {
            paybackRevenue = parseFloat(paybackRevenueMatch[1].replace(',', '.'));

            return;
        }

        const paybackPointsBeforeMatch = line.match(/Punktestand vor Einkauf: ([0-9.]*)|Punkte vor dem Einkauf: ([0-9.]*)/);

        if (paybackPointsBeforeMatch) {
            const match = paybackPointsBeforeMatch.slice(1).find(group => group != null)!;
            paybackPointsBefore = parseFloat(match.replace('.', ''));

            return;
        }

        const paybackCardNumberMatch = line.match(/PAYBACK Karten-Nr\.: ([0-9#]*)/);

        if (paybackCardNumberMatch) {
            paybackCardNumber = paybackCardNumberMatch[1];

            return;
        }

        const paybackCouponMatch = line.match(/(.*) ([0-9.]*) Punkte?/);

        if (paybackCouponMatch) {
            paybackCoupons.push({
                name: paybackCouponMatch[1],
                points: parseInt(paybackCouponMatch[2].replace('.', ''))
            });

            return;
        }

        const taxDetailsMatch = line.match(/([AB])= ([0-9,]*)% ([0-9,]*) ([0-9,]*) ([0-9,]*)/);

        if (taxDetailsMatch) {
            taxDetails[taxDetailsMatch[1] as TaxCategory] = {
                taxPercent: parseFloat(taxDetailsMatch[2].replace(',', '.')),
                net: parseFloat(taxDetailsMatch[3].replace(',', '.')),
                tax: parseFloat(taxDetailsMatch[4].replace(',', '.')),
                gross: parseFloat(taxDetailsMatch[5].replace(',', '.')),
            }

            return;
        }

        const totalTaxMatch = line.match(/Gesamtbetrag ([0-9,]*) ([0-9,]*) ([0-9,]*)/);

        if (totalTaxMatch) {
            taxDetails.total = {
                net: parseFloat(totalTaxMatch[1].replace(',', '.')),
                tax: parseFloat(totalTaxMatch[2].replace(',', '.')),
                gross: parseFloat(totalTaxMatch[3].replace(',', '.')),
            };
            
            return;
        }

        const usedREWECreditMatch = line.match(/Eingesetztes REWE Guthaben: ([0-9,]*) EUR/);

        if (usedREWECreditMatch) {
            usedREWECredit = parseFloat(usedREWECreditMatch[1].replace(',', '.'));
        }

        const newREWECreditMatch = line.match(/Neues REWE Guthaben: ([0-9,]*) EUR/);
        
        if (newREWECreditMatch) {
            newREWECredit = parseFloat(newREWECreditMatch[1].replace(',', '.'));
        }
    });

    // Check if we missed an item
    const realTotalInCents = items.reduce((accumulator, nextItem) => accumulator + nextItem.subTotal * 100, 0);
    const totalInCents = total * 100;

    if (realTotalInCents.toFixed(2) !== totalInCents.toFixed(2)) {
        throw new Error(`Something went wrong when parsing the eBon: The eBon states a total sum of ${totalInCents} but the parser only found items worth ${realTotalInCents}.`);
    }

    return {
        date: date,
        market: market,
        marketAddress: marketAddress,
        cashier: cashier,
        checkout: checkout,
        vatin: uid,
        items: items,
        total: total,
        given: given,
        change: change ? change : undefined,
        payout: payout ? payout : undefined,
        payback: paybackCardNumber ? ({
            card: paybackCardNumber,
            pointsBefore: paybackPointsBefore,
            earnedPoints: paybackPoints,
            get basePoints() {
                return this.earnedPoints - this.couponPoints
            },
            get couponPoints() {
                return this.usedCoupons.reduce((accumulator, nextCoupon) => accumulator + nextCoupon.points, 0)
            },
            get qualifiedRevenue() {
                if (!Number.isNaN(paybackRevenue)) return paybackRevenue;
                return items.filter(item => item.paybackQualified).reduce((prev, next) => prev + next.subTotal, 0)
            },
            usedCoupons: paybackCoupons,
            usedREWECredit: usedREWECredit ? usedREWECredit : undefined,
            newREWECredit: !isNaN(newREWECredit) ? newREWECredit : undefined
        }) : undefined,
        taxDetails: taxDetails
    };
}
