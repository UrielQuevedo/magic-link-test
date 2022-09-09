import type { NextPage } from "next";
import { Link, ETHTokenType, ImmutableXClient } from "@imtbl/imx-sdk";
import { useEffect, useState } from "react";

type IframePositionKeys = "left" | "right" | "top" | "bottom";

type IframePositionOptions = {
  [key in IframePositionKeys]?: string;
};

type IframeSizeOptions = {
  width: number;
  height: number;
};

type ConfigurableIframeOptions = null | {
  position?: IframePositionOptions;
  className?: string;
  containerElement?: HTMLElement;
  protectAgainstGlobalStyleBleed?: boolean;
};

const Deposit: NextPage = () => {
  const [address, setAddress] = useState("");
  const [clientInfo, setClientInfo] = useState({});

  const linkIframeOptions: ConfigurableIframeOptions = {
    className: "linkStyle",
  };
  const link = new Link("https://link.ropsten.x.immutable.com");

  const getClientInfo = async () => {
    if (address) {
      const client = await ImmutableXClient.build({
        publicApiUrl: "https://api.ropsten.x.immutable.com/v1",
      });

      const balances = await client.listBalances({ user: address });
      const orders = await client.getOrders();
      const assets = await client.getAssets({
        user: address,
      });

      setClientInfo({ balances, assets, orders });
    }
  };

  useEffect(() => {
    if (clientInfo) {
      getClientInfo();
    }
  }, [address]);

  const setWallet = async () => {
    try {
      const info = await link.setup({});
      console.log({ info });
      setAddress(info.address);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDepositWithMoonpay = async () => {
    console.log("handleDepositWithMoonpay");
    try {
      await link.fiatToCrypto({});
    } catch (error) {
      console.log(error);
    }
  };

  const handleDepositWithMetamask = async () => {
    console.log("handleDepositWithMetamask");
    try {
      await link.deposit();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Demo for Deposit</h1>
      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <p style={{ width: "50%" }}>
          Es una demo sobre poder hacer depositos de Eths en immutable, hay dos
          opciones, la principal, es con tajeta de credito y se utiliza una
          integracion con Moonpay. La otra opcion, es depositar pero con
          metamask.
        </p>
      </div>
      {!address ? (
        <button
          style={{
            margin: "20px",
            width: "250px",
            height: "30px",
          }}
          onClick={setWallet}
        >
          Log In
        </button>
      ) : (
        <div>
          <h2>
            <div style={{ fontSize: "27px" }}>Welcome:</div> {address}
          </h2>

          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <div style={{ width: "25%" }}>
              <button
                style={{
                  margin: "20px",
                  width: "250px",
                  height: "30px",
                }}
                onClick={handleDepositWithMoonpay}
              >
                DEPOSIT WITH MOONPAY
              </button>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <p style={{ textAlign: "center", width: "80%" }}>
                  <h3>Test Credit Cards:</h3>
                  <div>
                    <b>CARD:</b> Visa
                  </div>
                  <div>
                    <b>NUMBER:</b> 4000056655665556
                  </div>
                  <div>
                    <b>DATE:</b> any date in the future
                  </div>
                  <div>
                    <b>CVC:</b> 123
                  </div>

                  <br />
                  <br />

                  <div>
                    <b>CARD:</b> Visa
                  </div>
                  <div>
                    <b>NUMBER:</b> 4000020951595032
                  </div>
                  <div>
                    <b>DATE:</b> 12/2022
                  </div>
                  <div>
                    <b>CVC:</b> 123
                  </div>
                </p>
              </div>
            </div>
            <div>
              <button
                style={{
                  margin: "20px",
                  width: "250px",
                  height: "30px",
                }}
                onClick={handleDepositWithMetamask}
              >
                DEPOSIT WITH METAMASK
              </button>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <p style={{ textAlign: "center", width: "70%" }}>
                  Necesitas tener eth en tu wallet para realizar esta operacion
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deposit;
