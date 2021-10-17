const { equal } = require('assert');
const plays = require('../data/plays.json');
const invoices = require('../data/invoices.json');

function playFor(perf) {
    return plays[perf.playID];
}

function amountFor(aPerformance) {
    let result = 0;

    switch (playFor(aPerformance).type) {
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
            throw new Error(`unknown type: ${playFor(aPerformance).type}`);
    }

    return result;
}

function volumeCreditsFor(aPerformance) {
    let result = Math.max(aPerformance.audience - 30, 0);

    if ('comedy' === playFor(aPerformance).type) result += Math.floor(aPerformance.audience / 5);

    return result;
}

function usd(aNumber) {
    return new Intl.NumberFormat(
        'en-US',
        { style: 'currency', currency: 'USD', minimumFractionDigits: 2 },
    ).format(aNumber / 100);
}

function totalVolumeCredits(invoices) {
    let result = 0;

    for (let perf of invoices.performances) {
        result += volumeCreditsFor(perf);
    }

    return result;
}

function totalAmount(invoices) {
    let totalAmount = 0

    for (let perf of invoices.performances) {
        totalAmount += amountFor(perf);
    }

    return totalAmount;
}

function statement(invoices) {
    let result = `Statement for ${invoices.customer}\n`;

    for (let perf of invoices.performances) {
        result += ` ${playFor(perf).name}: ${usd(amountFor(perf))}`;
        result += ` (${perf.audience} seats)\n`;
    }

    result += `Amount owned is ${usd(totalAmount(invoices))}\n`;
    result += `You earned ${totalVolumeCredits(invoices)} credits\n`;
    return result;
} 

const result = statement(invoices);

equal(result, `Statement for BigCo
 Hamlet: $650.00 (55 seats)
 As you like it: $580.00 (35 seats)
 Othello: $500.00 (40 seats)
Amount owned is $1,730.00
You earned 47 credits
`);

console.log(result);