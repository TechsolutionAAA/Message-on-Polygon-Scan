import React, { useState } from "react";
import { ethers } from "ethers";
import hex from "string-hex";
function Header() {
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [connButtonText, setConnButtonText] = useState("Connect wallet");

  const [addr, setAddr] = useState("");
  const [data, setData] = useState("");

  async function loadWeb3() {
    if (window.ethereum) {
      window.web3 = new ethers.providers.Web3Provider(window.ethereum);
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      // console.log(chainId);
      if (chainId !== "0x13881") {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x13881" }],
          });
        } catch (switchError) {
          // This error code indicates that the chain has not been added to MetaMask.
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: "0x13881",
                    rpcUrl:
                      // "https://mainnet.infura.io/v3/9f65f2e7dc324b6fba99c874cecfbadd",
                      // "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
                      // "https://goerli.infura.io/v3/c952612719d944c9af94bff453498395",
                      "https://rpc-mumbai.maticvigil.com/",
                  },
                ],
              });
            } catch (addError) {
              // handle "add" error
            }
          }
          // handle other "switch" errors
        }
        window.ethereum.on("chainChanged", handleChainChanged);
        function handleChainChanged(_chainId) {
          // We recommend reloading the page, unless you must do otherwise
          window.location.reload();
        }
      }

      await window.ethereum
        .enable()
        .then((result) => {
          var str = result[0];
          if (typeof result != "undefined" && result.length > 0) {
            var start5 = str.substring(0, 5);
            // var middle5 = ".....";
            // var last5 = str.substring(37, 42);
            // var joined = start5 + middle5 + last5;
            // console.log("myAccount => " + myAccount)
            setConnButtonText(str);
            setDefaultAccount(start5)
            //   setDisShow("block")
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (window.web3) {
      window.web3 = new ethers.providers.Web3Provider(window.ethereum);
      new ethers.providers.Web3Provider(window.ethereum).providers.HttpProvider(
        // "https://mainnet.infura.io/v3/9f65f2e7dc324b6fba99c874cecfbadd"
        // "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
        // "https://goerli.infura.io/v3/c952612719d944c9af94bff453498395",
        "https://rpc-mumbai.maticvigil.com/",
      );
      // alert(2)
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  if (typeof window.ethereum != "undefined") {
    window.ethereum.on("accountsChanged", (accounts) => {
      loadWeb3();
    });
  }

  async function sendTx() {
    console.log(hex("hello world"));
    await window.ethereum.request({ method: "personal_sign", params: [data, window.ethereum.selectedAddress] })
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const gasPrice = await provider.getGasPrice()

    const tx = {
      nonce: '0x00',
      gas: '20000',
      data: `0x${hex(data)}`,
      to: String(addr).trim(),
      from: window.ethereum.selectedAddress,
      gasPrice: gasPrice.toHexString(),
      value: '0x00',
      chainId: window.ethereum.chainId
    }

    try {
      let confirm = await window.ethereum.request({ method: "eth_sendTransaction", params: [tx] })
      console.log(confirm)
    }
    catch (error) {
      console.log(error)
    }

  }

  return (
    <div>
      <h1 style={{ textAlign: "center", margin: "20px" }}>Web3 Blockchain sending Message</h1>
      <div style={{ textAlign: "center", margin: "0 auto" }}><button style={{ borderRadius: "10px", padding: "15px" }} onClick={loadWeb3}>{connButtonText}</button></div>

      {defaultAccount !== null && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "30px", marginTop: "20px" }}>
          <div style={{ display: "flex" }} >To Address: <input type="text" value={addr} onChange={(e) => setAddr(e.target.value)} /></div>
          <div style={{ display: "flex" }}>MessageBox: <input type="text" value={data} onChange={(e) => setData(e.target.value)} /></div>
          <div style={{ textAlign: "center", margin: "0 auto" }}><button style={{ borderRadius: "10px", padding: "15px" }} onClick={sendTx}>Send Message</button></div>
        </div>
      )}
    </div>
  );
}

export default Header;
