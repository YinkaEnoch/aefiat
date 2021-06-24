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
