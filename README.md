# REWE eBon parser
This library parses [REWE eBons](https://www.rewe-group.com/de/newsroom/pressemitteilungen/1753-rewe-elektronischer-kassenbon) into JS objects.

## Installation
```shell
$ npm install --save rewe-ebon-parser
```

## Usage
```js
async function main() {
    const dataBuffer = fs.readFileSync('ebon.pdf');
    const receipt = await parseEBon(dataBuffer);
    console.log(JSON.stringify(receipt, undefined, 2));
}

main().catch(console.error);
```

The parser will perform a quick check in order to find out if it missed an item of the eBon by comparing the eBon's total sum and its own total sum. If there is a mismatch, an `Error` is thrown:

```
Error: Something went wrong when parsing the eBon: The eBon states a total sum of 50.27 but the parser only found items worth 45.69.
```

If this happens to you, it is likely that your eBon uses a slightly different format. In this case, please open an issue on GitHub.

## Example
```json
{
  "date": "2019-12-07T16:21:00.000Z",
  "market": "0449",
  "cashier": "545454",
  "checkout": "3",
  "vatin": "DE812706034",
  "items": [
    {
      "taxCategory": "B",
      "name": "SCHW.SCHINKEN",
      "amount": 1,
      "subTotal": 1.99,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "GULASCHSUPPE",
      "amount": 1,
      "subTotal": 2.99,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "SCHINKENWURST",
      "amount": 1,
      "subTotal": 0.99,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "TEEWURST FEIN",
      "amount": 1,
      "subTotal": 0.99,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "ROHSCHINKEN GEW.",
      "amount": 1,
      "subTotal": 1.79,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "CARACTERE SCHEI.",
      "amount": 1,
      "subTotal": 1.49,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "OFENKAESE WUERZ.",
      "amount": 1,
      "subTotal": 2.69,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "1688 MEHRKORN",
      "amount": 1,
      "subTotal": 1.29,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "BUTTERTOAST",
      "amount": 1,
      "subTotal": 0.69,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "SONNTAGSBROETCH.",
      "amount": 1,
      "subTotal": 0.99,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "BIO EIER M+L KLA",
      "amount": 1,
      "subTotal": 2.15,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "RAMA M.BUTTER+ME",
      "amount": 1,
      "subTotal": 1.29,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "H-MILCH GVO-FREI",
      "amount": 4,
      "subTotal": 2.92,
      "paybackQualified": true,
      "unit": "Stk",
      "pricePerUnit": 0.73
    },
    {
      "taxCategory": "B",
      "name": "TK HAE.CORD.BLEU",
      "amount": 1,
      "subTotal": 2.89,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "PIZZA SALAMI",
      "amount": 1,
      "subTotal": 2.29,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "STEINOFEN PIZZA",
      "amount": 1,
      "subTotal": 2.29,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "JA! WEIZENMEHL",
      "amount": 1,
      "subTotal": 0.39,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "FUSILLI",
      "amount": 1,
      "subTotal": 0.39,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "PENNE RIGATE",
      "amount": 1,
      "subTotal": 0.39,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "SPAGHETTIGERICHT",
      "amount": 1,
      "subTotal": 0.69,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "LECKER F. RUEH.",
      "amount": 1,
      "subTotal": 3.29,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "SAMT R. FRUECHTE",
      "amount": 1,
      "subTotal": 2.19,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "CRUNCHIPS WESTER",
      "amount": 1,
      "subTotal": 1.39,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "CRUNCHIPS CHEESE",
      "amount": 1,
      "subTotal": 1.39,
      "paybackQualified": true
    },
    {
      "taxCategory": "A",
      "name": "FRUEH KOELSCH",
      "amount": 1,
      "subTotal": 4.29,
      "paybackQualified": true
    },
    {
      "taxCategory": "A",
      "name": "PFAND 0,48 EUR",
      "amount": 1,
      "subTotal": 0.48,
      "paybackQualified": false
    },
    {
      "taxCategory": "A",
      "name": "GAFFEL FASSBRAUS",
      "amount": 1,
      "subTotal": 3.79,
      "paybackQualified": true
    },
    {
      "taxCategory": "A",
      "name": "PFAND 0,48 EUR",
      "amount": 1,
      "subTotal": 0.48,
      "paybackQualified": false
    },
    {
      "taxCategory": "B",
      "name": "LUNGO KAPSELN",
      "amount": 2,
      "subTotal": 3.98,
      "paybackQualified": true,
      "unit": "Stk",
      "pricePerUnit": 1.99
    },
    {
      "taxCategory": "A",
      "name": "Mitarbeiterrabatt 5%",
      "amount": 1,
      "subTotal": -0.4,
      "paybackQualified": false
    },
    {
      "taxCategory": "B",
      "name": "Mitarbeiterrabatt 5%",
      "amount": 1,
      "subTotal": -2.2,
      "paybackQualified": false
    }
  ],
  "total": 50.27,
  "given": [
    {
      "type": "REWE Guthaben",
      "value": 30
    },
    {
      "type": "EC-Cash",
      "value": 20.27
    }
  ],
  "payback": {
    "card": "#########9334",
    "pointsBefore": 4,
    "earnedPoints": 405,
    "basePoints": 24,
    "couponPoints": 381,
    "qualifiedRevenue": 49.31,
    "usedCoupons": [
      {
        "name": "eCoupon 10FACH P. Milch",
        "points": 9
      },
      {
        "name": "eCoupon 10FACH Punkte Bier",
        "points": 27
      },
      {
        "name": "eCoupon 15FACH Punkte",
        "points": 336
      },
      {
        "name": "Coupon Brotaufstrich10-fach",
        "points": 9
      }
    ],
    "usedREWECredit": 30,
    "newREWECredit": 0
  },
  "taxDetails": {
    "total": {
      "net": 46.17,
      "tax": 4.1,
      "gross": 50.27
    },
    "A": {
      "taxPercent": 19,
      "net": 7.26,
      "tax": 1.38,
      "gross": 8.64
    },
    "B": {
      "taxPercent": 7,
      "net": 38.91,
      "tax": 2.72,
      "gross": 41.63
    }
  }
}

```
