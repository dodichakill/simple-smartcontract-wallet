const { ethers } = require("hardhat");

async function main() {
  const [owner, wallet2] = await ethers.getSigners();
  console.log("Owner : " + owner.address + "\nWallet2 : " + wallet2.address);

  const DODIFactory = await ethers.getContractFactory("DODI", owner);
  const DODI = await DODIFactory.deploy();
  const DODITokenAddress = await DODI.getAddress();
  console.log("DODI Token Address : " + DODITokenAddress);

  const WalletFactory = await ethers.getContractFactory("MySmartWallet", owner);
  const Wallet = await WalletFactory.deploy();
  const WalletAddress = await Wallet.getAddress();
  console.log("Wallet Address : " + WalletAddress);

  await DODI.connect(owner).mint(owner.address, ethers.parseEther("1000"));

  console.log(
    "Owner DODI Token Balance : " +
      ethers.formatEther(await DODI.balanceOf(owner.address))
  );

  await DODI.connect(owner).transfer(WalletAddress, ethers.parseEther("100"));

  console.log("transferred 100 $DODI to MySmartWallet...");
  console.log(
    "Owner's DODI Token Balance: ",
    ethers.formatEther(await DODI.balanceOf(owner.address))
  );
  console.log(
    "Owner's DODI Token Balance: ",
    ethers.formatEther(await DODI.balanceOf(WalletAddress))
  );

  console.log(
    "Test getTokenBalance: ",
    await Wallet.getTokenBalance(DODITokenAddress)
  );

  console.log();
  await Wallet.withdrawToOwner(DODITokenAddress, ethers.parseEther("50"));
  console.log("Withdrawin 50 $DODI ....");
  console.log(
    "Owner's DODI Token Balance: ",
    ethers.formatEther(await DODI.balanceOf(owner.address))
  );
  console.log(
    "Owner's DODI Token Balance: ",
    ethers.formatEther(await DODI.balanceOf(WalletAddress))
  );

  const sendEth = await owner.sendTransaction({
    to: WalletAddress,
    value: ethers.parseEther("1"),
  });
  console.log("\nSending 1 ETH to MySmartWallet...");

  console.log("Tx Hash: ", sendEth.hash);
  console.log(
    "My Smart Wallet ETH balance: ",
    await ethers.formatEther(await Wallet.getETHBalance())
  );
  console.log(
    "Owner's ETH Balance: ",
    ethers.formatEther(await ethers.provider.getBalance(owner.address))
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
