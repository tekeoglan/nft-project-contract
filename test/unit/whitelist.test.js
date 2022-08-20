const { assert, expect } = require("chai")
const { deployments, ethers } = require("hardhat")

describe("WhiteList Unit Test", function () {
    let whitelistContract, user, user2, user3, userContract, user2Contract, user3Contract
    beforeEach(async () => {
        const accounts = await ethers.getSigners()
        const signer1 = accounts[1]
        const signer2 = accounts[2]
        const signer3 = accounts[3]
        user = signer1.address
        user2 = signer2.address
        user3 = signer3.address
        await deployments.fixture(["whitelist"])
        whitelistContract = await ethers.getContract("WhiteList")
        userContract = await whitelistContract.connect(signer1)
        user2Contract = await whitelistContract.connect(signer2)
        user3Contract = await whitelistContract.connect(signer3)
    })

    describe("contructor", function () {
        it("Construction", async () => {
            const maxList = await whitelistContract.getMaxWhiteList()
            assert.equal(maxList, 2)
        })
    })

    describe("addWhitelist", function () {
        it("Should revert with: 'max participants reached'", async () => {
            const txResponse = await userContract.addToWhiteList()
            await txResponse.wait(1)
            const tx2Response = await user2Contract.addToWhiteList()
            await tx2Response.wait(1)

            await expect(user3Contract.addToWhiteList()).to.be.revertedWith(
                "Max participents reached."
            )
        })

        it("Should revert with: 'user already whitelisted'", async () => {
            const txResponse = await user3Contract.addToWhiteList()
            await txResponse.wait(1)
            await expect(user3Contract.addToWhiteList()).to.be.revertedWith(
                "User already whitelisted."
            )
        })

        it("Should uptdate the state", async () => {
            const txResponse = await userContract.addToWhiteList()
            await txResponse.wait(1)
            const whitelistedCount = await whitelistContract.getNumOfWhiteListed()
            const isWhitelisted = await whitelistContract.isWhiteListed(user)
            assert.equal(whitelistedCount, 1)
            assert(isWhitelisted)
        })
    })
})
