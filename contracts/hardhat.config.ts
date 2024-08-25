import {HardhatUserConfig} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@xyrusworx/hardhat-solidity-json";
import "./tasks/whitelist";
import "./tasks/deployments";
import "./tasks/e2e";
import "./tasks/functions";

require('dotenv').config()

const opbnbTestnet = []
if (process.env.PRIVATE_KEY_OPBNB) {
  opbnbTestnet.push(process.env.PRIVATE_KEY_OPBNB)
}
// const localhostPrivateKeys = []
// if (process.env.PRIVATE_KEY_LOCALHOST) {
//   localhostPrivateKeys.push(process.env.PRIVATE_KEY_LOCALHOST)
// }

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      viaIR: true  // Enable the IR optimization to work around the "Stack too deep" error
    }
  },
  networks: {
   
    opbnb: {
      chainId: 5611 ,
      url: "https://opbnb-testnet-rpc.bnbchain.org",
      accounts: opbnbTestnet,
    },
    hardhat: {
      chainId: 1337,
    },
    // localhost: {
    //   chainId: 1337,
    //   url: "http://127.0.0.1:8545",
    //   accounts: "localhostPrivateKeys",
    // }
  },
};

export default config;