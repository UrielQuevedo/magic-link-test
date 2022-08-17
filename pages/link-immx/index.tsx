import type { NextPage } from "next";
import { useState, useEffect } from "react";
import { Link, ETHTokenType, ImmutableXClient } from "@imtbl/imx-sdk";

const LinkImmx: NextPage = () => {
  const [address, setAddress] = useState("");
  const [infoSell, setInfoSell] = useState({});
  const [infoCancel, setInfoCancel] = useState({});
  const [clientInfo, setClientInfo] = useState({});
  const [orderIdsold, setOrderIdsold] = useState({});
  const [orderInfo, setOrderInfo] = useState({});
  const [getOrderId, setGetOrderId] = useState(0);
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
    getClientInfo();
  }, [address]);

  const sdkExample = async () => {
    // Register user, you can persist address to local storage etc.
    const { address } = await link.setup({});
    localStorage.setItem("address", address);

    // Deposit ETH into IMX
    link.deposit({
      type: ETHTokenType.ETH,
      amount: "0.01",
    });

    // View transaction history
    link.history({});

    // Create a sell order for token id 123 for 0.01 ETH
    link.sell({
      amount: "0.01",
      tokenId: "123",
      tokenAddress: "0x2ca7e3fa937cae708c32bc2713c20740f3c4fc3b",
    });

    // Cancel a sell order
    link.cancel({
      orderId: "1",
    });

    // Create a buy flow:
    link.buy({
      orderIds: ["1", "2", "3"],
    });

    // Prepare withdrawal, you will need to wait some time before completing the withdrawal
    link.prepareWithdrawal({
      type: ETHTokenType.ETH,
      amount: "0.01",
    });

    // Complete withdrawal
    link.completeWithdrawal({
      type: ETHTokenType.ETH,
    });
  };

  const setWallet = async () => {
    try {
      const info = await link.setup({ providerPreference: "none" });
      console.log({ info });
      setAddress(info.address);
    } catch (error) {
      console.log(error);
    }
  };

  const showHistory = async () => {
    try {
      link.history({});
    } catch (error) {
      console.log(error);
    }
  };

  const sell = async () => {
    console.log({ infoSell });
    // Create a sell order for token id 123 for 0.01 ETH
    try {
      const sellData = await link.sell(infoSell);
      console.log(sellData);
      setOrderIdsold(sellData);
      getClientInfo();
    } catch (error) {
      console.log(error);
    }
  };

  const getInfoOrder = async () => {
    if (address) {
      const client = await ImmutableXClient.build({
        publicApiUrl: "https://api.ropsten.x.immutable.com/v1",
      });
      const order = await client.getOrder({
        orderId: Number.parseInt(getOrderId),
      });
      setOrderInfo(order);
    }
    getClientInfo();
  };

  const cancelCell = async () => {
    console.log({ infoCancel });
    // Cancel a sell order
    link.cancel(infoCancel);

    getClientInfo();
  };

  const handleCancerOrder = ({ target }) => {
    setInfoCancel({ [target.name]: target.value });
  };

  const handleSell = ({ target }) => {
    setInfoSell({ ...infoSell, [target.name]: target.value });
  };

  const handleOrderInfoId = ({ target }) => {
    setGetOrderId(target.value);
  };

  return (
    <div>
      <h2>Address:</h2>
      <h3>{address}</h3>
      <div style={{ marginTop: "10px" }}>
        <button onClick={setWallet}>Iniciar Sesion</button>
      </div>
      <div style={{ marginTop: "10px" }}>
        <button onClick={showHistory}>Historial de Transacciones</button>
      </div>
      <div style={{ border: "1px solid", marginTop: "10px" }}></div>
      <h2>Vender</h2>
      <div>
        <span>Token Id: </span>
        <input
          style={{ marginTop: "10px" }}
          name="tokenId"
          type="number"
          onChange={handleSell}
        />
      </div>
      <div>
        <span>Amount: </span>
        <input
          style={{ marginTop: "10px" }}
          name="amount"
          onChange={handleSell}
          type="number"
        />
      </div>
      <div>
        <span>Token Address: </span>
        <input
          style={{ marginTop: "10px" }}
          name="tokenAddress"
          onChange={handleSell}
          type="text"
        />
      </div>
      <div>
        <h2 style={{ color: "green" }}>
          Order Id: {JSON.stringify(orderIdsold, null, 2)}
        </h2>
      </div>
      <div style={{ marginTop: "10px" }}>
        <button onClick={sell}>Vender</button>
      </div>
      <div style={{ border: "1px solid", marginTop: "10px" }}></div>
      <h2>Cancelar Order</h2>
      <div>
        <span>Order Id: </span>
        <input
          onChange={handleCancerOrder}
          name="orderId"
          style={{ marginTop: "10px" }}
          type="text"
        />
      </div>
      <div style={{ marginTop: "10px" }}>
        <button onClick={cancelCell}>Cancelar</button>
      </div>
      <div style={{ border: "1px solid", marginTop: "10px" }}></div>
      <h3>Order Info</h3>
      <p>{JSON.stringify(orderInfo, null, 1)}</p>
      <div>
        <span>Order Id: </span>
        <input
          onChange={handleOrderInfoId}
          name="orderId"
          style={{ marginTop: "10px" }}
          type="text"
        />
      </div>
      <div style={{ marginTop: "10px" }}>
        <button onClick={getInfoOrder}>Get Info</button>
      </div>
      <h3>Assets</h3>
      <p>{JSON.stringify(clientInfo.assets, null, 1)}</p>
      <h3>Balances</h3>
      <p>{JSON.stringify(clientInfo.balances, null, 1)}</p>
      <h3>Orders</h3>
      <p>{JSON.stringify(clientInfo.orders, null, 1)}</p>
    </div>
  );
};

export default LinkImmx;
