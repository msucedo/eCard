// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  await deploy("MyContract", {
    from: deployer,
    log: true,
  });
  // Getting a previously deployed contract
  const YourContract = await ethers.getContract("MyContract", deployer);
};
module.exports.tags = ["MyContract"];