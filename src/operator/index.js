const TransactionOracle = require("./transaction-oracle.js");

const main = async () => {
	const transactionOracle = new TransactionOracle();
	await transactionOracle.init();
	await transactionOracle.register();
	await transactionOracle.startPolling();
};

main();
