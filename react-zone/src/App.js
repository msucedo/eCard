import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import deployedContracts from "./contracts/hello_world.json";
import Address from "./components/Address.jsx";

export default function App() {

  const [winner, setWinner] = useState("");
  const [votingOption, setVotingOption] = useState("");
  const [listVoptions, setListVoptions] = useState("");
  const [isGoingToVote, setIsGoingToVote] = useState(false);
  const [currentCaller, setCurrentCaller] = useState("");

  const chainId = 1337; // for localhost
  // const chainId = 4; // for rinkeby
  const contractABI = deployedContracts[chainId][0].contracts["MyContract"].abi;
  const contractAddress = deployedContracts[chainId][0].contracts["MyContract"].address;

  useEffect(() => {
    console.log("CONTRACT ADDRESS: ", contractAddress);
    checkIfWalletIsConnected();
  }, [])

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("make sure you have metamask");
      } else {
        console.log("we have the ethereum object", ethereum);
      }
      /*check authorization to access user wallet*/
      const accounts = await ethereum.request({method: "eth_accounts"});
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Connected account:", account);
        setCurrentCaller(account)
      } else {
        console.log("No authorized account found")
      } 
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Connect to metamask wallet
  */
   const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentCaller(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  // GET
  const getWinner = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        console.log("PROVIDER: ", provider);

        const myContract = new ethers.Contract(contractAddress, contractABI, provider);
        // actual call to function from contract
        let textTxn = await myContract.getWinnerName();
        console.log("WINNER: ",textTxn);
        await textTxn.wait;

        const signer = provider.getSigner();
        const myContractSigned = myContract.connect(signer);

        let textTxnToCloseVoting = await myContractSigned.closeVoting();
        await textTxnToCloseVoting.wait();
        console.log("CLOSING VOTING...");
        setWinner(textTxn);
        setIsGoingToVote(false);
        setListVoptions("");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  // POST
  const addOne = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const myContractSigned = new ethers.Contract(contractAddress, contractABI, signer);
        console.log("SIGNER: ", signer);
        let addTx = await myContractSigned.vote(votingOption);
        await addTx.wait;
        console.log("voted: ", votingOption);
      } else {
        console.log("Ethereum object doesn't exists");
      }
    } catch (error) {
      console.log("ERROR:", error);
    }
  }

  // GET
  const getVotingOptions = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        let voptions="";
        const provider = new ethers.providers.Web3Provider(ethereum);
        console.log("PROVIDER: ", provider);
        
        const myContract = new ethers.Contract(contractAddress, contractABI, provider);
        
        let textTxn = await myContract.getVotingOptions();
        console.log("VOPTIONS: ",textTxn);
        await textTxn.wait;
        for(let i = 0; i < textTxn.length; i++) {
          voptions += "- " + textTxn[i].name + "  ";
        }
        setListVoptions(voptions);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="App">
      <h1 className="titlemain">president elections</h1>
      <div className="Appmain">
        {isGoingToVote==false?<button className="showVote" onClick={()  => {setIsGoingToVote(true)}}>vote</button>:""}
        {isGoingToVote?<p>add your voting option: </p>:""}

        {isGoingToVote?<input value={votingOption} onInput={(e) => setVotingOption(e.target.value)}/>:""}
        {isGoingToVote?<button className="vote" onClick={()  => addOne()}>vote</button>:""}
        
        <button className="getWinner" onClick={()  => getWinner()}>get winner</button>

        <button className="getOptions" onClick={()  => getVotingOptions()}>get options</button>

        {winner!=""?<p>winner: {winner}</p>:""}

        {listVoptions.length>0?<p>voting options: {listVoptions}</p>:""}
      </div>
      <Address
        address={currentCaller}
        fontSize={18}
      />
    </div>
  );
}
