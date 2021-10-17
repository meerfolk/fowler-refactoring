const plays = require('../data/plays.json');

function playFor(perf) {
    return plays[perf.playID];
}

function amountFor(aPerformance) {
    let result = 0;

    switch (aPerformance.play.type) {
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
            throw new Error(`unknown type: ${aPerformance.play.type}`);
    }

    return result;
}

function volumeCreditsFor(aPerformance) {
    let result = Math.max(aPerformance.audience - 30, 0);

    if ('comedy' === aPerformance.play.type) result += Math.floor(aPerformance.audience / 5);

    return result;
}

function totalVolumeCredits(performances) {
    return performances.reduce(
        (total, performance) => total + performance.volumeCredits,
        0,
    );
}

function totalAmount(performances) {
    return performances.reduce(
        (total, performance) => total + performance.amount,
        0,
    );
}

function enrichPerformance(aPerformance) {
    const result = Object.assign({}, aPerformance);

    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);

    return result;
}

function createStatementData(invoices) {
    const statementData = {
        performances: invoices.performances.map(enrichPerformance),
        customer: invoices.customer,
    }

    statementData.totalAmount = totalAmount(statementData.performances);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData.performances);

    return statementData;
}

module.exports = createStatementData;