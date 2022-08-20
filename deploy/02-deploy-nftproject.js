const { network } = require("hardhat")
const { WHITELIST_ADDRESS, TOKEN_URI } = require("../constant")

module.exports = async ({ deployments, getNamedAccounts }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    let arguments = [
        /**uri, whitelist address */
        TOKEN_URI,
        WHITELIST_ADDRESS,
    ]
    const NftProject = await deploy("NftProject", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
}

module.exports.tags = ["all", "nftproject"]
