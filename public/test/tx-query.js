const contractSource = `
@compiler >= 6

include "String.aes"

contract TxQuery=
  type o = oracle(string, string)
  type oq = oracle_query(string, string)
  
  type state = o
  entrypoint init(oracle: o) = oracle

  entrypoint queryFee() =
    Oracle.query_fee(state)

  payable stateful entrypoint queryTx(id: string) =
    let fee = queryFee()
    require(Call.value == fee, String.concat("AMOUNT_NOT_EQUAL_FEE_", Int.to_str(fee)))
    require(Oracle.check(state), "ORACLE_CHECK_FAILED")
    Oracle.query(state, id, fee, RelativeTTL(20), RelativeTTL(20))

  entrypoint checkQuery(query: oq) =
    Oracle.get_answer(state, query)
`;
const contractAddress = "ct_rnH6Fcog5CNGj8JkpwHLLM2cZ52m6QQWEyxoNkGNCptQJYM8H";

let client = null,
  sdk = null,
  contractInstance = null;

const initSDK = async () => {
  try {
    const node = {
      nodes: [
        {
          name: "aefiat-query",
          instance: await Ae.Node({
            url: "https://mainnet.aeternity.io",
            internalUrl: "https://mainnet.aeternity.io",
          }),
        },
      ],
      compilerUrl: "https://latest.compiler.aepps.com",
    };

    sdk = await Ae.RpcAepp({ ...node, name: "aefiat-query" });

    contractInstance = await sdk.getContractInstance(contractSource, {
      contractAddress,
    });
  } catch (e) {
    console.error(e);
    return 0;
  }
};

const scanForWallets = async () => {
  if (!sdk) throw new Error("SDK not initiated!!");

  const scannerConnection = await Ae.BrowserWindowMessageConnection({
    connectionInfo: { id: "spy" },
  });

  const detector = await Ae.WalletDetector({ connection: scannerConnection });

  return new Promise((resolve, reject) => {
    detector.scan(async ({ newWallet }) => {
      console.log(newWallet);
      if (!newWallet) reject();

      await sdk.connectToWallet(await newWallet.getConnection());
      await sdk.subscribeAddress("subscribe", "current");

      console.log("We got here");
      resolve();
    });
  });
};

const init = async () => {
  await initSDK();
  await scanForWallets();
};
init();

const queryOracle = async (id) => {
  let queryHash = (
    await contractInstance.methods.queryTx(id, { amount: 200000000000000 })
  ).decodedResult;

  return queryHash;
};

const checkQuery = async (qHash) => {
  let oracleRes = (await contractInstance.methods.checkQuery(qHash))
    .decodedResult;

  return oracleRes;
};

/**
 * FORM HANDLER
 * */

const txID = document.querySelector("#tx-id");
const submitBtn = document.querySelector("[type=submit]");
const outputPanel = document.querySelector("output");

document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  submitBtn.setAttribute("disabled", true); // Disable submit button
  submitBtn.classList.add("spinner-body");
  submitBtn.appendChild(spinner);
  outputPanel.textContent = ""; // Clear output panel

  try {
    let queryHash = await queryOracle(txID.value.trim());
    console.log(`QUERY HASH: ${queryHash}`);
    let oracleRes = await checkQuery(queryHash);
    console.log(`ORACLE RESPONSE: ${oracleRes}`);

    if (oracleRes) {
      outputPanel.textContent = oracleRes;
      submitBtn.textContent = "Get Details";
      submitBtn.classList.remove("spinner-body");
      submitBtn.removeAttribute("disabled");
    }
  } catch (e) {
    submitBtn.textContent = "Get Details";
    submitBtn.classList.remove("spinner-body");
    submitBtn.removeAttribute("disabled");
  }
});
