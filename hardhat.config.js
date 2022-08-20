require("@nomiclabs/hardhat-waffle")
require("hardhat-deploy")
require("solidity-coverage")
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config()

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL
console.log(RINKEBY_RPC_URL)

const PRIVATE_KEY = process.env.PRIVATE_KEY

module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
        },
    },
    rinkeby: {
        url: RINKEBY_RPC_URL,
        accounts: [PRIVATE_KEY],
        chainId: 4,
        blockConfrimations: 6,
    },
    solidity: {
        compilers: [{ version: "0.8.4" }],
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    namedAccounts: {
        deployer: {
            default: 0,
            1: 0,
        },
    },
}
