import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ReactTable from 'react-table'
import "react-table/react-table.css";

const Web3 = require('web3');
const ContractAddress = '0x6d5dd261cad88ccc53990abd78cf527520a5522d';
const InteractionABI = require('./contract/InteractionChannel.json');

var event;

function LoadWeb3() {
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(window.web3.currentProvider);
    return new Promise((resolve, reject) => {
      window.web3.eth.getAccounts((err, accounts) => {
        accounts ? resolve(accounts[0]) : reject(err);
      });
    });
  } 
  else {
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    return new Promise((resolve, reject) => {
      window.web3.eth.getAccounts((err, accounts) => {
        accounts ? resolve(accounts[0]) : reject(err);
      });
    });
  }
}

const columns = [{
  Header: 'Name',
  accessor: 'name'
}, {
  Header: 'Date',
  accessor: 'date'
}, {
  Header: 'Address',
  accessor: 'address'
}];


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contractAddress: ContractAddress,
      accountAddress: "Your public key - if not showing unlock metamask and reload.",
      input: "",
      data: []
    };
  }

  componentDidMount() {

    LoadWeb3().then(account => {
      if(account) {
        this.setState({accountAddress:account});
      }
      else {
        console.log("No Web3 found");
      }
    });

    if(window.web3 && window.web3.isConnected()) {
      console.log("Web3 Connected");
    }

    if(event) {
      event.stopWatching();
      event = undefined;
    }

    let contract = window.web3.eth.contract(InteractionABI);
    let instance = contract.at(this.state.contractAddress);
    event = instance.Interaction({fromBlock: 0, toBlock: 'latest'});
    event.watch((error, response) => {
      if(!error) {
        var eventData = {"name":window.web3.toAscii(response.args.name).replace(/[^a-zA-Z ]/g, ""), "date": (new Date(1000*window.web3.toDecimal(response.args.timeUpdated)).toString()), "address":response.args.addr};
        console.log(eventData);
        this.setState({
          data: [...this.state.data, eventData]
        });
      }
      else {
        console.log(error);
      }
    });

    // filterWatch = window.web3.eth.filter({fromBlock: 'latest', address: this.state.contractAddress});
    // filterWatch.watch((error, result) => {
    //   if(!error) {
    //     console.log(result);
    //     console.log(window.web3.toAscii(result.topics[0]));
    //   }
    //   else {
    //     console.log(error);
    //   }
    // });
  }

  handleContractChange = (event) => {
    this.setState({contractAddress: event.target.value});
  }

  handleInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  handleSubmit = (event) => {
    if(!this.state.accountAddress.includes("unlock metamask")) {
      var contract = window.web3.eth.contract(InteractionABI);
      var instance = contract.at(this.state.contractAddress);
      instance.interact.sendTransaction(this.state.input, {from: this.state.accountAddress, gas: '470000'}, function(err, result) {
        if(!err) {
          console.log(result);
        }
        else {
          console.log(err);
        }
      });
    }
    else {
      alert("Error: no account address");
    }
    event.preventDefault();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Interact Exercise</h1>
        </header>
        {/* <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p> */}
        <br/>
        <br/>
        <label>Contract Address</label>
        &nbsp;
        <input type="text" className="form-text long-input" value={this.state.contractAddress} onChange={this.handleContractChange} />
        <br/>
        <br/>
        <label>Your Account</label>
        &nbsp;
        <input type="text" className="form-text longer-input" value={this.state.accountAddress} disabled />
        <br/>
        <br/>
        <label>Input Something</label>
        &nbsp;
        <input type="text" className="form-text long-input" onChange={this.handleInputChange} />
        &nbsp;
        <button className="form-button" onClick={this.handleSubmit}>Submit</button>
        <br/>
        <br/>
        <div style={{width:'1000px', marginLeft:'auto', marginRight:'auto'}}>
          <ReactTable data={this.state.data} columns={columns} className="-striped -highlight" />
        </div>
      </div>
    );
  }
}

export default App;
