# Interaction Exercise for Ethereum Blockchain Course
- interact with the InteractionChannel smart contract deployed on Ropsten Network using Metamask or locally running client (localhost:8545)
- uses NodeJS, npm, ReactJS, Web3JS

## Features
- detects web3 object on the browser to switch between Metamask or local client
- detects the main account from the web3 object to be used for sending transactions
- send the input as a transaction to the smart contract, which changes the value of name
- watch for events emitted when the value of name is permanently changed in the smart contract