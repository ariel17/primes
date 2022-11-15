const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

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

for (let i = 2; ; i++) {
    let isDivisible = false;
    for (let j = 2; j < i; j++) {
        if (i % j == 0) {
            isDivisible = true;
            break;
        }
    }

    if (!isDivisible) {
        logger.info(`${i} is a prime number`);
    }
}