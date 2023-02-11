import { ethers } from './ethers-5.6.esm.min.js'
import { abi, contractAddress } from './constants.js'

const connectButton = document.getElementById('connectButton')
const stakeButton = document.getElementById('stake')
const unstakeButton = document.getElementById('unstake')
const showAccount = document.getElementById('showAccount')
const showBalance = document.getElementById('showBalance')
const rewardsButton = document.getElementById('reward')

unstakeButton.onclick = unstake
connectButton.onclick = connect
rewardsButton.onclick = reward

//need to fix so when there is address input, only then referral stake is selected
if (document.getElementById('address') == ""){
   stakeButton.onclick = stake
} else {
   stakeButton.onclick = referralStake
}

const tokenContract = '0x32A6362B6A31C951760f14d6a2542B6896684780'

console.log(ethers)

async function connect() {
  if (typeof window.ethereum !== 'undefined') {
    let provider = window.ethereum
    const chainid = await provider.request({
      method: 'eth_chainId',
    })

    console.log('This is Chain ID: ', chainid)
    if ((typeof window.ethereum !== 'undefined', chainid === '0x38'|| '0x61')) {
      try {
        await ethereum.request({ method: 'eth_requestAccounts' })
      } catch (error) {
        console.log(error)
      }
      connectButton.innerHTML = 'Connected'
      const accounts = await ethereum.request({ method: 'eth_accounts' })
      showAccount.innerHTML = accounts
      console.log(accounts)
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(tokenContract, testAbi, signer)
      try {
        const accounts = await ethereum.request({ method: 'eth_accounts' })
        const balance = await contract.balanceOf(accounts.toString())
        showBalance.innerHTML = `${Math.round(ethers.utils.formatUnits(balance))} Sevi tokens`
        console.log(balance)
        console.log('Done!')
      } catch (error) {
        console.log(error)
      }
    } else {
      connectButton.innerHTML = 'Please switch to Binance Testnet'
    }
  } else {
    connectButton.innerHTML = 'Please install MetaMask'
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`)
  //listen for transaction to finish
  //Promise tells only finish this function once resolved
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReciept) => {
      console.log(
        `Completed with ${transactionReciept.confirmations} confirmations`,
      )
      resolve()
    })
  })
}

async function stake() {
  const amount = document.getElementById('amount').value;
  if (amount == 0) {
    alert('Please input amount first')
  }
  if ((typeof window.ethereum !== 'undefined', amount >= 1)) {
    const new_amount = ethers.utils.parseUnits(amount.toString(), 18)
    const days = 45;
    console.log(`Funding with ${amount}...`)
    console.log('staking...')
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    const testTokenContract = new ethers.Contract(
      tokenContract,
      testAbi,
      signer,
    )
    try {
      const tokenContract = testTokenContract.connect(signer)
      const approve = await tokenContract.approve(
        contractAddress,
        new_amount,
      )
      await approve.wait()
      const transactionResponse = await contract.stake(new_amount, days)
      await listenForTransactionMine(transactionResponse, provider)
      console.log('Done!')
      alert('You have staked the tokens Successfuly!')
    } catch (error) {
      console.log(error)
      alert('You have already staked! or insufficient balance')
    }
  }
}

async function referralStake() {
   const amount = document.getElementById('amount').value;
   const referralAddress = document.getElementById('address').value
   if (amount == 0) {
     alert('Please input amount first')
   }
   if ((typeof window.ethereum !== 'undefined', amount >= 1)) {
     const new_amount = ethers.utils.parseUnits(amount.toString(), 18)
     const days = 45;
     console.log(`Funding with ${amount}...`)
     console.log('staking...')
     const provider = new ethers.providers.Web3Provider(window.ethereum)
     const signer = provider.getSigner()
     const contract = new ethers.Contract(contractAddress, abi, signer)
     const testTokenContract = new ethers.Contract(
       tokenContract,
       testAbi,
       signer,
     )
     try {
       const tokenContract = testTokenContract.connect(signer)
       const approve = await tokenContract.approve(
         contractAddress,
         new_amount,
       )
       await approve.wait()
       const transactionResponse = await contract.referredStake(referralAddress, new_amount, days)
       await listenForTransactionMine(transactionResponse, provider)
       console.log('Done!')
       alert('You have staked the tokens Successfuly!')
     } catch (error) {
       console.log(error)
       alert('You have already staked! or insufficient balance')
     }
   }
 }

async function unstake() {
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const transactionResponse = await contract.UnStaking()
      await listenForTransactionMine(transactionResponse, provider)
      console.log('Done!')
      alert('You have unstaked the tokens Successfuly!')
    } catch (error) {
      alert(
        'Please first stake Tokens to unstake'
      )
      console.log(error)
    }
  }
}

async function reward() {
   if (typeof window.ethereum !== 'undefined') {
     const provider = new ethers.providers.Web3Provider(window.ethereum)
     const signer = provider.getSigner()
     const contract = new ethers.Contract(contractAddress, abi, signer)
     try {
       const transactionResponse = await contract.claimRewards()
       await listenForTransactionMine(transactionResponse, provider)
       console.log('Done!')
       alert('Rewards sent to your wallet!')
     } catch (error) {
       alert(
         'Error'
       )
       console.log(error)
     }
   }
 }




const testAbi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "subtractedValue",
				"type": "uint256"
			}
		],
		"name": "decreaseAllowance",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "addedValue",
				"type": "uint256"
			}
		],
		"name": "increaseAllowance",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "mint",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
