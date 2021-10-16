const { equal } = require('assert');
const plays = require('../data/plays.json');
const invoices = require('../data/invoices.json');

function playFor(perf) {
    return plays[perf.playID];
}

function amountFor(aPerformance, play) {
    let result = 0;

    switch (play.type) {
        case 'tragedy':
            result = 40000;

            if (aPerformance.audience > 30) {
                result += 1000 * (aPerformance.audience - 30);
            }

            break;

        case 'comedy':
            result = 30000;

            if (aPerformance.audience > 20) {
                result += 10000 + 500 * (aPerformance.audience - 20);
            }

            result += 300 * aPerformance.audience;
            break;

        default:
            throw new Error(`unknown type: ${play.type}`);
    }

    return result;
}

function statement(invoices, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;

    let result = `Statement for ${invoices.customer}\n`;
    const format = new Intl.NumberFormat(
        'en-US',
        { style: 'currency', currency: 'USD', minimumFractionDigits: 2 },
    ).format;

    for (let perf of invoices.performances) {
        let thisAmount = amountFor(perf, playFor(perf));

        volumeCredits += Math.max(perf.audience - 30, 0);

        if ('comedy' === playFor(perf).type) volumeCredits += Math.floor(perf.audience / 5);

        result += ` ${playFor(perf).name}: ${format(thisAmount / 100)}`;
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