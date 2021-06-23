const form = document.querySelector("form");
const submit = document.querySelector("[type=submit]");
const outputPanel = document.querySelector("output");
const SERVER_URL = "https://fiatmerch.herokuapp.com";
//const SERVER_URL = "http://127.0.0.1:4300";

const getClientToken = async () => {
  const res = await fetch(`${SERVER_URL}/api/v1/client_token`);
  return await res.json();
};

const checkout = async () => {
  // Clear panel
  outputPanel.textContent = "";

  const { clientToken } = await getClientToken();

  braintree.client.create({ authorization: clientToken }, (err, instance) => {
    if (err) {
      console.error(err);
      return;
    }

    braintree.hostedFields.create(
      {
        client: instance,
        styles: {
          input: {},
          "input.invalid": {
            color: "red",
          },
          "input.valid": {
            color: "green",
          },
        },
        fields: {
          number: {
            selector: "#card-number",
            placeholder: "4111 1111 1111 1111",
          },
          cvv: {
            selector: "#cvv",
            placeholder: "123",
          },
          expirationDate: {
            selector: "#expiration-date",
            placeholder: "10/2022",
          },
        },
      },
      (err, instance) => {
        if (err) {
          console.error(err);
          return;
        }

        // Show amount input
        document.querySelector("#amount").classList.remove("hide");
        document.querySelector("#amount").classList.add("amount");
        // Hide spinner
        document.querySelector(".is-loading").classList.remove("is-loading");

        submit.removeAttribute("disabled");
        form.addEventListener(
          "submit",
          (e) => {
            e.preventDefault();

            instance.tokenize(async (err, payload) => {
              if (err) {
                console.error(err);
                return;
              }

              // Disable submit button again
              submit.setAttribute("disabled", true);
              submit.textContent = "Making payment...";

              // Send nonce to server
              const res = await fetch(`${SERVER_URL}/api/v1/checkout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  paymentNonce: payload.nonce,
                  amount: document.querySelector("#amount").value,
                }),
              });
              const data = await res.json();
              console.log(data);
              const {
                result: {
                  transaction: {
                    amount,
                    id,
                    status,
                    currencyIsoCode,
                    createdAt,
                    processorResponseText,
                  },
                  success,
                },
              } = data;

              const output = {
                id,
                status,
                success,
                currencyIsoCode,
                amount,
                createdAt,
                processorResponseText,
              };

              outputPanel.textContent = JSON.stringify(output, null, 2);
              submit.textContent = "Make payment";
              submit.removeAttribute("disabled");
            });
          },
          false
        );
      }
    );
  });
};

checkout();
