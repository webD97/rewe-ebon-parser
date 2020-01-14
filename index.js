const fs = require('fs');
const pdf = require('pdf-parse');
 
let dataBuffer = fs.readFileSync('./REWE-eBon.pdf');
 
pdf(dataBuffer).then(function(data) {
 
    // number of pages
    // console.log(data.numpages);
    // number of rendered pages
    // console.log(data.numrender);
    // PDF info
    // console.log(data.info);
    // PDF metadata
    // console.log(data.metadata);
    // PDF.js version
    // check https://mozilla.github.io/pdf.js/getting_started/
    // console.log(data.version);
    // PDF text
    // console.log(data.text);
    const lines = data.text
        .replace(/  +/g, ' ')
        .split('\n')
        .filter(line => line !== '' && line !== ' ')
        .map(line => line.trim());
    console.log(JSON.stringify(lines, undefined, 2));
});
