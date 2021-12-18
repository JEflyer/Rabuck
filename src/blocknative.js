import Onboard from "bnc-onboard";
import Web3 from "web3";
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';
import ABI from "./contractABI.json";
import ReactDOM from "react-dom";
import { useState } from "react";


const contractAddress = "0xFbF6003A2310F08452ea62E59ff3f5Feb69bfDD3";

const FORTMATIC_KEY = "pk_test_3F4B0685454D150C";
const RPC_URL = "https://rinkeby.infura.io/v3/31a345975dc8409eb4e7b061b7980f5d";
const INFURA_KEY = "1bf0295a46b34d4783cd7ba2a115deb3";

const wallets = [
    { walletName: "coinbase", preferred: true },
    { walletName: "trust", preferred: true, rpcUrl: RPC_URL },
    { walletName: "metamask", preferred: true },
    { walletName: "authereum" },
    { walletName: "ledger", rpcUrl: RPC_URL },
    { walletName: "fortmatic", apiKey: FORTMATIC_KEY, preferred: true },
    { walletName: "walletConnect", infuraKey: INFURA_KEY },
    { walletName: "opera" },
    { walletName: "operaTouch" },
    { walletName: "torus" },
    { walletName: "status" },
    { walletName: "imToken", rpcUrl: RPC_URL }
];

var web3;

var myContract;

const onboard = Onboard({
    dappId: "d86c8312-381b-48e7-8a3b-dcacb5f6d89b",
    networkId: 4,
    walletSelect: {
        wallets: wallets
    },
    subscriptions: {
        wallet: (wallet) => {
            window.localStorage.setItem("selectedWallet", wallet.name);
            web3 = new Web3(wallet.provider);
            console.log(wallet.name);
            myContract = new web3.eth.Contract(ABI, contractAddress)
        }
    }
});


const BlockNative = () => {

    const [wltAddress, setWltAddress] = useState("Not Connected");

    async function login() {
        const walletSelected = await onboard.walletSelect();
        if (walletSelected !== false) {
            const walletCheck = await onboard.walletCheck();
            setWltAddress(onboard.getState().address);

        }
    }

    return (
        <div>
            <div className="App">
                <button id="connectWallet" onClick={login} class="btn btn-light">
                    Connect wallet
                </button>
                <p>{wltAddress}</p>
            </div>


        </div>
    )
}

const Mint = () => {
    async function buyNFT() {
        const currentState = onboard.getState();
        myContract.methods.mint(value)
            .send({ from: currentState.address, value: value * 10000000000000000 })
            .on("transactionHash", function (hash) {
                console.log(hash);
            })
            .on("confirmation", function (confirmationNumber, reciept) {
                console.log(confirmationNumber);
            })
            .on("receipt", function (receipt) {
                console.log(receipt);
                getPrice();
            })
            .on("error", function (error, receipt) {
                console.log(error);
            })
            .catch(err => {
                console.log(err);
            });
    }

    const [value, setValue] = useState(1);

    const [price, setPrice] = useState(40);

    function getPrice() {
        const currentState = onboard.getState();
        myContract.methods.price()
            .send({ from: currentState.address })
            .then((res) => {
                setPrice(res);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <div>
            <p placeholder="40 Matic">{price * value} Matic</p>
            <button onClick={buyNFT} >
                Mint NFT
            </button>
            <RangeSlider
                value={value}
                onChange={changeEvent => setValue(changeEvent.target.value)}
                min={1}
                max={10}
                step={1}
            />
        </div>
    )
}


export {
    BlockNative,
    Mint
}