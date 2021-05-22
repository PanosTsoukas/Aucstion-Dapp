import React, { Component } from "react";
import AuctionContract from "./contracts/Auction.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { WinnerBid: 0, web3: null, accounts: null, contract: null, input: "", Winner: 0, getContractBalance: 0, accountbalance: 0 };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = AuctionContract.networks[networkId];
      const instance = new web3.eth.Contract(
        AuctionContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      const response = await instance.methods.WinnerBid().call();
      const response2 = await instance.methods.Winner().call();
      const response3 = await instance.methods.getContractBalance().call();
      const response4 = await instance.methods.ParticipentBalances(accounts[0]).call();
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance, WinnerBid: response, Winner: response2, getContractBalance: response3, accountbalance: response4});
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  bid = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.bid().send({ from: accounts[0], value: this.state.input });

    // Get the value from the contract to prove it worked.
    //const response = await contract.methods.get().call();
    const response = await contract.methods.WinnerBid().call();
  	const response2 = await contract.methods.Winner().call();
 	const response3 = await contract.methods.getContractBalance().call();
 	const response4 = await contract.methods.ParticipentBalances(accounts[0]).call();
    // Update state with the result.
    this.setState({ WinnerBid: response, Winner: response2, getContractBalance: response3, accountbalance: response4});
  };

  withdraw = async () => {
	const { accounts, contract } = this.state;

	// Stores a given value, 5 by default.
	await contract.methods.withdraw().send({from: accounts[0]});

	// Get the value from the contract to prove it worked.
	//const response = await contract.methods.get().call();
	const response = await contract.methods.WinnerBid().call();
    const response2 = await contract.methods.Winner().call();
    const response3 = await contract.methods.getContractBalance().call();
    const response4 = await contract.methods.ParticipentBalances(accounts[0]).call();
	// Update state with the result.
	this.setState({ WinnerBid: response, Winner: response2, getContractBalance: response3, accountbalance: response4});
  };
  myChangeHandler = (event) => {
    this.setState({input: event.target.value}, () => {
    console.log(this.state.input)
	});
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Auction App!</h1>
        <div>The Winner Bid is: {this.state.WinnerBid}</div>
        <div>The Winner until now is: {this.state.Winner}</div>
        <p></p>
        <div>Total Value on Wallet: {this.state.getContractBalance}</div>
        <p></p>
        <h1>Auction Options</h1>
        <div>Bid</div>
        <p></p>
        <input type="text" onChange={this.myChangeHandler} />
        <button onClick = {this.bid}> Click Me!</button>
      	<p></p>
      	<div>Withdraw</div>
      	<p></p>
      	<div>Available Withdraw Amount: {this.state.accountbalance}</div>
      	<p></p>
        <button onClick = {this.withdraw}> Click Me!</button>
      </div>
    );
  }
}

export default App;
