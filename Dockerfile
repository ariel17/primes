FROM node:latest

WORKDIR /app
COPY primes.js package*.json .

RUN ["npm", "install"]

CMD [ "node", "primes.js" ]
