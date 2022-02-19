require("@nomiclabs/hardhat-waffle");
require("hardhat-deploy");
require("@nomiclabs/hardhat-ethers")

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

  const defaultNetwork = "localhost";

 module.exports = {
   defaultNetwork,
  solidity: "0.8.4",
  namedAccounts: {
    deployer: {
      default: 0,
    }
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    localhost: {
      url: "http://localhost:8545",
    },
    /*
    rinkeby: {
      url: secret.url,
      accounts: [secret.key],
    },
    */
  }
};