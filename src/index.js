const { equal } = require('assert');

const invoices = require('../data/invoices.json');

const createStatementData = require('./create-statement-data');

function usd(aNumber) {
    return new Intl.NumberFormat(
        'en-US',
        { style: 'currency', currency: 'USD', minimumFractionDigits: 2 },
    ).format(aNumber / 100);
}



function renderPlainText(data) {
    let result = `Statement for ${data.customer}\n`;

    for (let perf of data.performances) {
        result += ` ${perf.play.name}: ${usd(perf.amount)}`;
        result += ` (${perf.audience} seats)\n`;
    }

    result += `Amount owned is ${usd(data.totalAmount)}\n`;
    result += `You earned ${data.totalVolumeCredits} credits\n`;

    return result;
}


function statement(invoices) {
    return renderPlainText(createStatementData(invoices));
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