import * as fs from 'fs';
import pdf from 'pdf-parse';

type TaxCategory = 'A' | 'B';

type ReceiptItem = {
    category: TaxCategory,
    name: string,
    subTotal: number,
    paybackQualified: boolean,
    amount?: number,
    unit?: string,
    perUnit?: number
};

type Receipt = {
    date: Date,
    markt: string,
    cashier: string,
    checkout: string,
    uid: string,
    items: ReceiptItem[],
    total: number,
    given: number,
    returned: number,
    payback?: {
        points?: number,
        revenue?: number
    }
};

let dataBuffer = fs.readFileSync('./REWE-eBon.pdf');

pdf(dataBuffer).then((data: { text: string }) => {
    const lines = data.text
        .replace(/  +/g, ' ')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line !== '');

    const receipt: Receipt = {
        date: new Date(),
        markt: '',
        cashier: '',
        checkout: '',
        uid: '',
        items: [],
        total: 0,
        given: 0,
        returned: 0
    };

    lines.forEach(line => {
        const itemHit = line.match(/([0-9A-Za-z %.!+,]*) (-?\d*,\d\d) ([AB]) ?(\*?)/);
        const totalHit = line.match(/SUMME EUR (-?\d*,\d\d)/);
        const gegebenHit = line.match(/Geg\. BAR EUR (\d*,\d\d)/);
        const returnHit = line.match(/Rückgeld BAR EUR (\d*,\d\d)/);
        const mengeHit = line.match(/(.*) (.*) x (.*).*/);
        const timestampHit = line.match(/(\d*)\.(\d*)\.(\d*) (\d*):(\d*) Bon-Nr\.:(.*)/);
        const marktMatch = line.match(/Markt:(.*) Kasse:(.*) Bed\.:(.*)/);
        const uidMatch = line.match(/UID Nr.: (.*)/);
        const paybackPointsMatch = line.match(/Sie erhalten (\d*) PAYBACK Punkte auf/);
        const paybackRevenueMatch = line.match(/einen PAYBACK Umsatz von (.*) EUR!/);

        if (itemHit) {
            const item = itemHit[1];
            const price = parseFloat(itemHit[2].replace(',', '.'));
            const category = itemHit[3] as TaxCategory;
            const paybackQualified = !itemHit[4] && price > 0;

            receipt.items.push({
                category: category,
                name: item,
                subTotal: price,
                paybackQualified: paybackQualified
            });

            return;
        }

        if (mengeHit) {
            receipt.items[receipt.items.length - 1 ] = {
                ...receipt.items[receipt.items.length - 1],
                amount: parseFloat(mengeHit[1].replace(',', '.')),
                unit: mengeHit[2],
                perUnit: parseFloat(mengeHit[3].replace(',', '.'))
            }

            return;
        }

        if (totalHit) {
            receipt.total = parseFloat(totalHit[1].replace(',', '.'));

            return;
        }

        if (gegebenHit) {
            receipt.given = parseFloat(gegebenHit[1].replace(',', '.'));

            return;
        }

        if (returnHit) {
            receipt.returned = parseFloat(returnHit[1].replace(',', '.'));

            return;
        }

        if (timestampHit) {
            receipt.date = new Date(Date.UTC(
                parseInt(timestampHit[3]),
                parseInt(timestampHit[2]) - 1,
                parseInt(timestampHit[1]),
                parseInt(timestampHit[4]),
                parseInt(timestampHit[5])
            ));

            return;
        }

        if (marktMatch) {
            receipt.markt = marktMatch[1];
            receipt.checkout = marktMatch[2];
            receipt.cashier = marktMatch[3];

            return;
        }

        if (uidMatch) {
            receipt.uid = uidMatch[1];

            return;
        }

        if (paybackPointsMatch) {
            receipt.payback = {
                ...receipt.payback,
                points: parseInt(paybackPointsMatch[1]),
            };

            return;
        }

        if (paybackRevenueMatch) {
            receipt.payback = {
                ...receipt.payback,
                revenue: parseFloat(paybackRevenueMatch[1].replace(',', '.')),
            };

            return;
        }
    });

    console.log(JSON.stringify(receipt, undefined, 2));
});
