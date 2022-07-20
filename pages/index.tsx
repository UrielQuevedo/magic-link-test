import type { NextPage } from "next";

import { useState, useEffect } from "react";
import { Magic } from "magic-sdk";
import { ConnectExtension } from "@magic-ext/connect";
import Web3 from "web3";

const Home: NextPage = () => {
  const [account, setAccount] = useState(null);
  const [magic, setMagic] = useState();
  const [web3, setWeb3] = useState();

  useEffect(() => {
    const magic = new Magic("pk_live_E7E27D428EC8F840", {
      network: "rinkeby",
      extensions: [new ConnectExtension()],
    });
    //const did = await magic.auth.loginWithMagicLink({ email: "uriel.quevedo@globant.com" });
    const web3 = new Web3(magic.rpcProvider);

    setMagic(magic);
    setWeb3(web3);
  }, []);

  const sendTransaction = async () => {
    const publicAddress = (await web3.eth.getAccounts())[0];
    const txnParams = {
      from: publicAddress,
      to: publicAddress,
      value: web3.utils.toWei("0.01", "ether"),
      gasPrice: web3.utils.toWei("30", "gwei"),
    };
    web3.eth
      .sendTransaction(txnParams as any)
      .on("transactionHash", (hash) => {
        console.log("the txn hash that was returned to the sdk:", hash);
      })
      .then((receipt) => {
        console.log("the txn receipt that was returned to the sdk:", receipt);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const signMessage = async () => {
    const publicAddress = (await web3.eth.getAccounts())[0];
    const signedMessage = await web3.eth.personal
      .sign("My Message", publicAddress, "")
      .catch((e) => console.log(e));
    console.log(signedMessage);
  };

  const showWallet = () => {
    magic.connect.showWallet().catch((e) => {
      console.log(e);
    });
  };

  const disconnect = async () => {
    await magic.connect.disconnect().catch((e) => {
      console.log(e);
    });
    setAccount(null);
  };

  const login = async () => {
    const magic = new Magic("pk_live_E7E27D428EC8F840", {
      network: "rinkeby",
      extensions: [new ConnectExtension()],
    });
    //const did = await magic.auth.loginWithMagicLink({ email: "uriel.quevedo@globant.com" });
    const web3 = new Web3(magic.rpcProvider);

    web3.eth
      .getAccounts()
      .then((accounts) => {
        console.log(accounts);
        setAccount(accounts?.[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="magicContainer">
      <h2>Magic Connect</h2>
      <p>This is a test page for creating a wallet with magic.link</p>
      {!account && (
        <button onClick={login} className="magicButton">
          Sign In
        </button>
      )}

      {account && (
        <>
          <h3>methods: </h3>
          <button onClick={showWallet} className="button-row">
            Show Wallet
          </button>
          <button onClick={sendTransaction} className="button-row">
            Send Transaction
          </button>
          <button onClick={signMessage} className="button-row">
            Sign Message
          </button>
          <button onClick={disconnect} className="button-row">
            Disconnect
          </button>
        </>
      )}
    </div>
  );
};

export default Home;
