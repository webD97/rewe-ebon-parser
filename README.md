# REWE eBon parser
This library parses [REWE eBons](https://www.rewe-group.com/de/newsroom/pressemitteilungen/1753-rewe-elektronischer-kassenbon) into JS objects.

## Example
```json
{
  "date": "2019-12-07T16:21:00.000Z",
  "markt": "0449",
  "cashier": "545454",
  "checkout": "3",
  "vatin": "DE812706034",
  "items": [
    {
      "taxCategory": "B",
      "name": "SCHW.SCHINKEN",
      "subTotal": 1.99,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "GULASCHSUPPE",
      "subTotal": 2.99,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "SCHINKENWURST",
      "subTotal": 0.99,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "TEEWURST FEIN",
      "subTotal": 0.99,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "ROHSCHINKEN GEW.",
      "subTotal": 1.79,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "CARACTERE SCHEI.",
      "subTotal": 1.49,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "OFENKAESE WUERZ.",
      "subTotal": 2.69,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "1688 MEHRKORN",
      "subTotal": 1.29,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "BUTTERTOAST",
      "subTotal": 0.69,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "SONNTAGSBROETCH.",
      "subTotal": 0.99,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "BIO EIER M+L KLA",
      "subTotal": 2.15,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "RAMA M.BUTTER+ME",
      "subTotal": 1.29,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "H-MILCH GVO-FREI",
      "subTotal": 2.92,
      "paybackQualified": true,
      "amount": 4,
      "unit": "Stk",
      "pricePerUnit": 0.73
    },
    {
      "taxCategory": "B",
      "name": "TK HAE.CORD.BLEU",
      "subTotal": 2.89,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "PIZZA SALAMI",
      "subTotal": 2.29,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "STEINOFEN PIZZA",
      "subTotal": 2.29,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "JA! WEIZENMEHL",
      "subTotal": 0.39,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "FUSILLI",
      "subTotal": 0.39,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "PENNE RIGATE",
      "subTotal": 0.39,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "SPAGHETTIGERICHT",
      "subTotal": 0.69,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "LECKER F. RUEH.",
      "subTotal": 3.29,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "SAMT R. FRUECHTE",
      "subTotal": 2.19,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "CRUNCHIPS WESTER",
      "subTotal": 1.39,
      "paybackQualified": true
    },
    {
      "taxCategory": "B",
      "name": "CRUNCHIPS CHEESE",
      "subTotal": 1.39,
      "paybackQualified": true
    },
    {
      "taxCategory": "A",
      "name": "FRUEH KOELSCH",
      "subTotal": 4.29,
      "paybackQualified": true
    },
    {
      "taxCategory": "A",
      "name": "PFAND 0,48 EUR",
      "subTotal": 0.48,
      "paybackQualified": false
    },
    {
      "taxCategory": "A",
      "name": "GAFFEL FASSBRAUS",
      "subTotal": 3.79,
      "paybackQualified": true
    },
    {
      "taxCategory": "A",
      "name": "PFAND 0,48 EUR",
      "subTotal": 0.48,
      "paybackQualified": false
    },
    {
      "taxCategory": "B",
      "name": "LUNGO KAPSELN",
      "subTotal": 3.98,
      "paybackQualified": true,
      "amount": 2,
      "unit": "Stk",
      "pricePerUnit": 1.99
    },
    {
      "taxCategory": "A",
      "name": "Mitarbeiterrabatt 5%",
      "subTotal": -0.4,
      "paybackQualified": false
    },
    {
      "taxCategory": "B",
      "name": "Mitarbeiterrabatt 5%",
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
    "points": 405,
    "revenue": 49.31
  },
  "taxDetails": {
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
    },
    "total": {
      "net": 46.17,
      "tax": 4.1,
      "gross": 50.27
    }
  }
}

```
