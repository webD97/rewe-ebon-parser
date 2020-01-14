const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('/mnt/c/Users/a121a6d/Downloads/REWE-eBon.pdf');

pdf(dataBuffer).then(function (data) {
    const lines = data.text
        .replace(/  +/g, ' ')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line !== '');

    const receipt = {
        items: []
    };

    lines.forEach(line => {
        const itemHit = line.match(/([0-9A-Za-z %.!+,]*) (-?\d*,\d\d) ([AB]) ?\*?/);
        const totalHit = line.match(/SUMME EUR (-?\d*,\d\d)/);
        const gegebenHit = line.match(/Geg\. BAR EUR (\d*,\d\d)/);
        const returnHit = line.match(/Rückgeld BAR EUR (\d*,\d\d)/);
        const mengeHit = line.match(/(.*) (.*) x (.*).*/);
        const timestampHit = line.match(/(\d*)\.(\d*)\.(\d*) (\d*):(\d*) Bon-Nr\.:(.*)/);
        const marktMatch = line.match(/Markt:(.*) Kasse:(.*) Bed\.:(.*)/);
        const uidMatch = line.match(/UID Nr.: (.*)/);

        if (itemHit) {
            const item = itemHit[1];
            const price = parseFloat(itemHit[2].replace(',', '.'));
            const category = itemHit[3];

            receipt.items.push({
                category: category,
                name: item,
                subTotal: price
            });

            return;
        }

        if (mengeHit) {
            receipt.items[receipt.items.length - 1 ] = {
                ...receipt.items[receipt.items.length - 1],
                amount: parseFloat(mengeHit[1]),
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
            receipt.date = new Date(Date.UTC(timestampHit[3], timestampHit[2] - 1, timestampHit[1], timestampHit[4], timestampHit[5]));

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
    });

    console.log(JSON.stringify(receipt, undefined, 2));
});
