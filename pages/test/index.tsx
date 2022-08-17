import { Link, ETHTokenType } from '@imtbl/imx-sdk'

const Test = () => {
  const tramite = ""
  const link = new Link('https://link.ropsten.x.immutable.com')

  const handleLogIn = async () => {
    const setupResponsePayload= await link.setup({ providerPreference: "none" })
  }


  return (
  <div>
      <div>Hola</div>
      <button onClick={handleLogIn}>Log in</button>
      </div>
  );
}

export default Test;
