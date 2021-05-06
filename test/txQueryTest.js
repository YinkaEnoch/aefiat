const Deployer = require("aeproject-lib").Deployer;
const TX_QUERY_CONTRACT = "./contracts/txQuery.aes";

describe("Query aefiat Oracle", () => {
	let deployer;
	let instance;
	let ownerKeyPair = wallets[2];
	let queryId;
	let failedQueryId;

	before(async () => {
		deployer = new Deployer("local", ownerKeyPair.secretKey);

		console.log(wallets[3]);
	});

	it("Deploying query contract", async () => {
		const deployedPromise = deployer.deploy(TX_QUERY_CONTRACT, [
			"ok_26QSujxMBhg67YhbgvjQvsFfGdBrK9ddG4rENEGUq2EdsyfMTC",
		]);
		await assert.isFulfilled(
			deployedPromise,
			"Failed to deploy smart contract"
		);
		instance = await Promise.resolve(deployedPromise);
	});
	/*
	it("Query oracle for a successful transaction record", async () => {
		let id = "ep7rardw";
		queryId = (
			await instance.queryTx(id, {
				queryFee: "200000000000000",
				fee: "200000000000000",
				amount: "200000000000000",
				queryTtl: { type: "delta", value: 20 },
				responseTtl: { type: "delta", value: 20 },
			})
		).decodedResult;
		console.log("Query ID: ", queryId);
	});*/
});
