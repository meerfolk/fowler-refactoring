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

function renderHtml(data) {
    let result = `<h1>Statement for ${data.customer}</h1>\n`;
    result += '<table>\n';
    result += '<tr><th>play</th><th>seats</th><th>costs</th></tr>\n';
    for (let perf of data.performances) {
        result += `  <tr><td>${perf.play.name}</td>`;
        result += `<td>${perf.audience}</td>`;
        result += `<td>${usd(perf.amount)}</td></tr>\n`;
    }

    result += '</table>\n';
    result += '<p>Amount owed is ';
    result += `<em>${usd(data.totalAmount)}</em></p>\n`;
    result += `<p>You earned <em>${data.totalVolumeCredits}`;
    result += `</em> credits</p>\n`;

    return result
}

function htmlStatement(invoices) {
    return renderHtml(createStatementData(invoices));
}

const result = statement(invoices);
const htmlResult = htmlStatement(invoices);

equal(result, `Statement for BigCo
 Hamlet: $650.00 (55 seats)
 As you like it: $580.00 (35 seats)
 Othello: $500.00 (40 seats)
Amount owned is $1,730.00
You earned 47 credits
`);

equal(htmlResult, `<h1>Statement for BigCo</h1>
<table>
<tr><th>play</th><th>seats</th><th>costs</th></tr>
  <tr><td>Hamlet</td><td>55</td><td>$650.00</td></tr>
  <tr><td>As you like it</td><td>35</td><td>$580.00</td></tr>
  <tr><td>Othello</td><td>40</td><td>$500.00</td></tr>
</table>
<p>Amount owed is <em>$1,730.00</em></p>
<p>You earned <em>47</em> credits</p>
`);

console.log(result);
console.log(htmlResult);