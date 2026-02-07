const hre = require("hardhat");

async function main() {
  const TimeStamp = await hre.ethers.getContractFactory("TimeStamp");
  const timeStamp = await TimeStamp.deploy();

  await timeStamp.deployed();

  console.log("TimeStamp deployed to:", timeStamp.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
