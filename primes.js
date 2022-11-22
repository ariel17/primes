const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
const client = require('prom-client');
const express = require('express');

// Logger formatting
const customFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});
const logger = createLogger({
  format: combine(
    timestamp(),
    customFormat,
  ),
  transports: [new transports.Console()]
});

// Metrics registry
const register = new client.Registry();
register.setDefaultLabels({
  app: 'primes-nodejs'
});

client.collectDefaultMetrics({ register });
const found = new client.Counter({
    name: 'found',
    help: 'Amount of primes found',
});
register.registerMetric(found);

const notFound = new client.Counter({
    name: 'not_found',
    help: 'Amount of primes not found',
});
register.registerMetric(notFound);

const searchTime = new client.Gauge({
    name: 'search_time',
    help: 'Time taken to evaluate a number for prime',
});
register.registerMetric(searchTime);

// HTTP server exposing metrics
var app = express();
app.use(express.json());
app.get('/metrics', async function(_, res) {
    res.setHeader('Content-Type', register.contentType);
    const metrics = await register.metrics();
    res.send(metrics);
});

// Accepts JSON body: {"from": 2, "to": 1000}
app.post('/start', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.send(`Started! ${JSON.stringify(req.body)}`);
    foundPrimes(req.body.from, req.body.to);
});

app.listen(8080, () => {
    logger.info("Server listening on port 8080");
});

function foundPrimes(from, to) {
    for (let i = from; i <= to; i++) {
        const end = searchTime.startTimer();
        if (i <= 1) {
            notFound.inc();
            logger.warn(`${i} is NOT a prime number`);
            continue;
        }
        if (i == 2) {
            found.inc();
            logger.info(`${i} is a prime number`);
            continue;
        }

        let isDivisible = false;
        for (let j = 2; j < i; j++) {
            if (i % j == 0) {
                isDivisible = true;
                break;
            }
        }
        end();

        if (!isDivisible) {
            found.inc();
            logger.info(`${i} is a prime number`);
        } else {
            notFound.inc();
            logger.warn(`${i} is NOT a prime number`);
        }
    }
}