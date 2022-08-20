const { expect, assert } = require("chai")
const { deployments, ethers, network } = require("hardhat")

describe("NftProject Unit Test", function () {
    let nftProject, whiteList, deployer, user
    beforeEach(async () => {
        const accounts = await ethers.getSigners()
        deployer = accounts[0]
        user = accounts[1]
        await deployments.fixture(["all"])
        nftProject = await ethers.getContract("NftProject")
        whiteList = await ethers.getContract("WhiteList")
        const userWhiteList = await whiteList.connect(user)
        await userWhiteList.addToWhiteList()
    })

    describe("Should start the presale", function () {
        it("construction", async () => {
            await nftProject.startPresale()
            assert(nftProject.presaleStarted)
        })
    })

    describe("Presale mint", function () {
        it("should not let in, contract paused", async () => {
            await nftProject.setPaused(true)
            await expect(nftProject.presaleMint()).to.be.revertedWith("Contract currently paused.")
        })

        it("should not let in, presale ended", async () => {
            const tx = await nftProject.startPresale()
            await ethers.provider.send("evm_increaseTime", [400])
            await ethers.provider.send("evm_mine")
            await expect(nftProject.presaleMint()).to.be.revertedWith("Presale is not running.")
        })

        it("not whitelisted", async () => {
            const tx = await nftProject.startPresale()
            await expect(nftProject.presaleMint()).to.be.revertedWith("You are not whitelisted.")
        })

        it("maximum supply exeded", async () => {
            const tx = await nftProject.startPresale()
            const userTx = await nftProject.connect(user)
            const tx2 = await userTx.presaleMint({ value: ethers.utils.parseEther("0.1") })
            const tx3 = await userTx.presaleMint({ value: ethers.utils.parseEther("0.1") })
            await expect(
                userTx.presaleMint({ value: ethers.utils.parseEther("0.1") })
            ).to.be.revertedWith("Exceded maximum NftProject supply")
        })

        it("not enaugh money", async () => {
            const tx = await nftProject.startPresale()
            const userTx = await nftProject.connect(user)
            await expect(userTx.presaleMint()).to.be.revertedWith("Not enough money.")
        })

        it("token id should exist", async () => {
            const tx = await nftProject.startPresale()
            const userTx = await nftProject.connect(user)
            await userTx.presaleMint({ value: ethers.utils.parseEther("0.1") })
            const isExists = await userTx.isTokenExist(1)
            assert(isExists)
        })
    })

    describe("withdrawing the money", function () {
        it("only the owner must withdraw the money", async () => {
            const userTx = await nftProject.connect(user)
            await expect(userTx.withdraw()).to.be.revertedWith("Ownable: caller is not the owner")
        })

        it("should be able to withdraw the money", async () => {
            const tx = await nftProject.startPresale()
            await ethers.provider.send("evm_increaseTime", [400])
            await ethers.provider.send("evm_mine")

            const userContract = await nftProject.connect(user)
            await userContract.mint({ value: ethers.utils.parseEther("0.01") })
            const beforeWithdrawal = await deployer.getBalance()
            const txResponse = await nftProject.withdraw()
            const txReceipt = await txResponse.wait()
            const { gasUsed, effectiveGasPrice } = txReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)
            const afterWithdrawal = await deployer.getBalance()
            assert(afterWithdrawal.add(gasCost).toString() == beforeWithdrawal.add(ethers.utils.parseEther("0.01")).toString())
        })
    })
})
