const plays = require('../data/plays.json');

function playFor(perf) {
    return plays[perf.playID];
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
    const calculator = new PerformanceCalculator(aPerformance, playFor(aPerformance));
    const result = Object.assign({}, aPerformance);

    result.play = calculator.play;
    result.amount = calculator.amount;
    result.volumeCredits = calculator.volumeCredits;

    return result;
}

class PerformanceCalculator {
    constructor(aPerformance, aPlay) {
        this.performance = aPerformance;
        this.play = aPlay;
    }

    get amount() {
        let result = 0;

        switch (this.play.type) {
            case 'tragedy':
                result = 40000;

                if (this.performance.audience > 30) {
                    result += 1000 * (this.performance.audience - 30);
                }

                break;

            case 'comedy':
                result = 30000;

                if (this.performance.audience > 20) {
                    result += 10000 + 500 * (this.performance.audience - 20);
                }

                result += 300 * this.performance.audience;
                break;

            default:
                throw new Error(`unknown type: ${this.play.type}`);
        }

        return result;

    }

    get volumeCredits() {
        let result = Math.max(this.performance.audience - 30, 0);

        if ('comedy' === this.play.type) result += Math.floor(this.performance.audience / 5);

        return result;

    }
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