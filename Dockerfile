FROM node:latest

WORKDIR /app
COPY primes.js package*.json ./

EXPOSE 8080

RUN ["npm", "install"]

CMD [ "node", "primes.js" ]
