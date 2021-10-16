const { equal } = require('assert');
const plays = require('../data/plays.json');
const invoices = require('../data/invoices.json');

function statement(invoices, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;

    let result = `Statement for ${invoices.customer}\n`;
    const format = new Intl.NumberFormat(
        'en-US',
        { style: 'currency', currency: 'USD', minimumFractionDigits: 2 },
    ).format;

    for (let perf of invoices.performances) {
        const play = plays[perf.playID];
        let thisAmount = 0;

        switch (play.type) {
            case 'tragedy':
                thisAmount = 40000;

                if (perf.audience > 30) {
                    thisAmount += 1000 * (perf.audience - 30);
                }

                break;
            
            case 'comedy':
                thisAmount = 30000;

                if (perf.audience > 20) {
                    thisAmount += 10000 + 500 * (perf.audience - 20);
                }

                thisAmount += 300 * perf.audience;
                break;
            
            default:
                throw new Error(`unknown type: ${play.type}`);
        }

        volumeCredits += Math.max(perf.audience - 30, 0);

        if ('comedy' === play.type) volumeCredits += Math.floor(perf.audience / 5);

        result += ` ${play.name}: ${format(thisAmount / 100)}`;
        result += ` (${perf.audience} seats)\n`;
        totalAmount += thisAmount;
    }

    result += `Amount owned is ${format(totalAmount/100)}\n`;
    result += `You earned ${volumeCredits} credits\n`;
    return result;
} 

const result = statement(invoices, plays);

equal(result, `Statement for BigCo
 Hamlet: $650.00 (55 seats)
 As you like it: $580.00 (35 seats)
 Othello: $500.00 (40 seats)
Amount owned is $1,730.00
You earned 47 credits
`);

console.log(result);