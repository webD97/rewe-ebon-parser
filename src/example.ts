import { readFileSync } from 'fs';
import { parseEBon } from './index';

async function main() {
    const data = readFileSync('examples/eBons/3.pdf');
    console.log(
        JSON.stringify(await parseEBon(data), undefined, 2)
    )
}

main();