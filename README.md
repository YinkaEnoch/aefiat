## AEFIAT

AEFIAT is a suite of oracles that provides details about fiat transactions to the blockchain. Fiat transaction remains the most common way of payment while exchanging goods and services, hence the blockchain requires a means of confirming these transactions so that smart contracts can easily verify payments and carry out their expected instructions.

> The current oracle can be used to confirm credit cards transactions. More oracles for other fiat transactions (Paypal, Venmo, Google Pay, Apple pay etc.) would be able soon.

The project was bootstrapped using aeproject cli.

- Run `npm install` to install the necessary dependencies
- Run `mkdir .data` in the project root directory
- Run `npm start` to start the oracle
- Run `npm run start:sdk` to run the user JavaScript SDK code
- Run `aeproject test` to run unit tests for the contract (WIP)
