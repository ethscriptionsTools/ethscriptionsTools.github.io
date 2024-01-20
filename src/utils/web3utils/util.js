import {BigNumber as BNumber} from "bignumber.js";
import {UsdtContractABI, UsdtContractAddress} from "./contract/UsdtContract";
import {Notification} from 'element-ui'
import {gasMargin, number_e2c} from "../util";
import {ethers} from "ethers";
import dotenv from "dotenv";

dotenv.config();
let web3Utils = {};

let str = process.env.VUE_APP_TARGET_CHAIN_INFO || "{\"name\":\"Ethereum Mainnet\",\"chainId\":1,\"shortName\":\"eth\",\"chain\":\"ETH\",\"network\":\"mainnet\",\"networkId\":1,\"nativeCurrency\":{\"name\":\"Ether\",\"symbol\":\"ETH\",\"decimals\":18},\"rpc\":[\"https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161\",\"wss://mainnet.infura.io/ws/v3/9aa3d95b3bc440fa88ea12eaa4456161\",\"https://api.mycryptoapi.com/eth\",\"https://cloudflare-eth.com\"],\"faucets\":[],\"infoURL\":\"https://ethereum.org\"}"
console.log(JSON.parse(str));
let chainInfo = JSON.parse(str)
web3Utils.init = async () => {
    console.log("web3Utils Init", web3Utils);
    const VUE_APP_PROVIDER_URL = process.env.VUE_APP_PROVIDER_URL || "";

    var web3Provider;
    if (window.ethereum) {
        web3Provider = window.ethereum;
        try {
            window.ethereum.enable();
        } catch (error) {
            console.log(error)
        }
    } else if (window.web3) {// old MetaMask Legacy dapp browsers...
        web3Provider = window.web3.currentProvider;
    } else {
        web3Provider = new Web3.providers.HttpProvider(VUE_APP_PROVIDER_URL);
        console.log("Non-Ethereum browser detected. You should consider trying MetaMask!")
    }
    try {
        web3Utils.ethereum = web3Provider;
        console.log(web3Provider);
        web3Utils.web3 = new Web3(web3Provider);
        web3Utils.target_web3 = new Web3(new Web3.providers.HttpProvider(VUE_APP_PROVIDER_URL));
        console.log("web3Utils Init", web3Utils);
    } catch (error) {
        console.log(error);
    }

    let provider = new ethers.providers.JsonRpcProvider(VUE_APP_PROVIDER_URL)
    web3Utils.ethers_provider = provider;
}
web3Utils.init();

function handleChainChanged(chainId) {
    // We recommend reloading the page, unless you must do otherwise.
    window.location.reload();
}

web3Utils.networkChanged = async (func) => {
    web3Utils.ethereum.on('chainChanged', handleChainChanged);
}

web3Utils.accountsChanged = async (func) => {
    web3Utils.ethereum.on('accountsChanged', func);
}

web3Utils.switchEthereumChain = async (chain, addError_func, addSuccess_func) => {
    try {
        console.log(chain, chain.chainId, '0x' + Number(chain.chainId).toString(16));
        await web3Utils.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{chainId: '0x' + Number(chain.chainId).toString(16)}],
        });
        await addSuccess_func();
    } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
            try {
                await web3Utils.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: '0x' + Number(chain.chainId).toString(16),
                            chainName: chain.name,
                            rpcUrls: chain.rpc /* ... */,
                            nativeCurrency: chain.nativeCurrency,
                            blockExplorerUrls: chain.explore,
                        },
                    ],
                });
                await addSuccess_func();
            } catch (addError) {
                addError_func();
                // handle "add" error
                console.log("addError", addError);
            }
        } else {
            console.log("switchError", switchError);
        }
        // handle other "switch" errors
    }
}

web3Utils.getAccount = async (func) => {
    try {
        const chainId = await web3Utils.web3.eth.getChainId();
        console.log("getAccount", chainId.toString());
        if (chainId.toString() == '1') {
            console.log(chainId.toString());
            let accounts = await web3Utils.web3.eth.getAccounts();
            console.log(" web3Utils.accounts", accounts);
            web3Utils.account = {address: '', balance: ''}
            if (accounts != null && accounts.length > 0) {
                web3Utils.account.address = accounts[0];
                func(web3Utils.account.address || '');
                return web3Utils.account.address || ''
            }
            Notification.error({
                title: "Connect Error", message: "Please check if the wallet is unlocked", type: "error",
            });
        } else {
            Notification.error({
                title: "Network Error", message: "Please check switch network and try again", type: "error",
            });
        }
        return "";
    } catch (err) {
        console.error(err);
    }
}

web3Utils.connect = async (func) => {
    try {
        const chainId = await web3Utils.web3.eth.getChainId();
        console.log(chainId.toString());
        if (chainId.toString() != '56') {
            await web3Utils.switchEthereumChain(chainInfo, () => {
                Notification.error({
                    title: "Add Chain Error", message: "Please check and try again", type: "error",
                });
            }, () => {
                web3Utils.getAccount(func)
            });
        } else {
            await web3Utils.getAccount(func)
        }
    } catch (err) {
        console.error(err);
    }
}

web3Utils.getWalletBalance = (address, callback) => {
    if (address != null && address !== "") {
        web3Utils.web3.eth.getBalance(address, (err, wei) => {
            if (!err) {
                web3Utils.account.balance = web3Utils.web3.utils.fromWei(wei, 'ether');
                console.log('getWalletBalance', web3Utils.account.balance);
                callback(web3Utils.account.balance);
            } else console.log(err)
        });
    } else {
        return "Account Not Empty"
    }
}

web3Utils.getUsdtBalance = (account, callback) => {
    this.info = new web3Utils.web3.eth.Contract(UsdtContractABI, UsdtContractAddress, {
        from: account
    });
    this.info.methods.balanceOf(account).call().then((result) => {
        console.log('getUsdtBalance', result);
        callback(result);
    });
}

web3Utils.getUsdtDecimals = (account, callback) => {
    this.info = new web3Utils.web3.eth.Contract(UsdtContractABI, UsdtContractAddress, {
        from: account
    });
    this.info.methods.decimals().call().then((result) => {
        console.log('decimals', result);
        callback(result);
    });
}

/**
 * deploy
 * @param account
 * @param tick
 * @param name
 * @param cap
 * @param limitPerMint
 * @param maxMintSize
 * @param freezeTime
 * @param onlyContractAddress
 * @param onlyMinQuantity
 * @param crowdFundingRate
 * @param crowdFundingAddress
 * @param crowdLpAddress
 * @param lpRate
 * @param callback1
 * @param callback2
 */
web3Utils.deploy = async (account, tick, name, cap, limitPerMint, maxMintSize, freezeTime, onlyContractAddress, onlyMinQuantity, crowdFundingRate, crowdFundingAddress, crowdLpAddress, lpRate, callback1, callback2) => {
    console.log(account, tick, name, cap, limitPerMint, maxMintSize, freezeTime, onlyContractAddress, onlyMinQuantity, crowdFundingRate, crowdFundingAddress, crowdLpAddress, lpRate);
    const CONTRACT_ADDRESS = process.env.VUE_APP_FACTORY_CONTRACT_ADDRESS || "";
    let info = new web3Utils.web3.eth.Contract(InscriptionFactoryAbi.abi, CONTRACT_ADDRESS, {
        from: account
    });

    let newVar = await web3Utils.ethers_provider.getGasPrice();
    console.log("deployErc20", tick, name, number_e2c(Number(cap) * 1e18, 0), number_e2c(Number(limitPerMint) * 1e18, 0), maxMintSize, freezeTime, onlyContractAddress, onlyMinQuantity, Number(crowdFundingRate) * 1e18, crowdFundingAddress, lpRate, {
        from: account,
        value: ethers.utils.parseEther("0.1") + "",
        gas: gasMargin("8017207", 1.1).toFixed(0),
        gasPrice: gasMargin(newVar.toString(), 1.1).toFixed(0)
    });
    var hashCode;
    info.methods.deployErc20(tick, name, number_e2c(Number(cap) * 1e18, 0), number_e2c(Number(limitPerMint) * 1e18, 0), maxMintSize, freezeTime, onlyContractAddress, onlyMinQuantity, Number(crowdFundingRate) * 1e18, crowdFundingAddress, crowdLpAddress, lpRate)
        .send({
            from: account,
            value: ethers.utils.parseEther("0.1") + "",
            gas: gasMargin("8017207", 1.1).toFixed(0),
            gasPrice: gasMargin(newVar.toString(), 1.1).toFixed(0)
        }, function (error, transactionHash) {
            callback1(true);
            if (!error) {
                console.log("transfer hash: ", transactionHash)
                hashCode = transactionHash;
            } else {
                callback1(false);
                console.log(error)
            }
        }).then((result) => {
        hashCode = result.transactionHash;
        console.log('deployErc20 Run end');
        console.log("Transfer Status : ", result.status)
        callback1(false);
        callback2(result, true);
    }).catch((e) => {
        callback1(false);
        callback2({}, false);
    });
}

web3Utils.mintToken = async (account, tick, callback1, callback2) => {
    console.log(account, tick);
    const VUE_APP_FACTORY_CONTRACT_ADDRESS = process.env.VUE_APP_FACTORY_CONTRACT_ADDRESS || "";
    // Initialise contract instance
    const factory_contract = new ethers.Contract(VUE_APP_FACTORY_CONTRACT_ADDRESS, InscriptionFactoryAbi.abi, web3Utils.ethers_provider);

    let project = await factory_contract.getIncriptionByTick(tick);
    let token_address = project[0]['addr'];
    console.log(project, token_address);
    let info = new web3Utils.web3.eth.Contract(InscriptionAbi.abi, token_address, {
        from: account
    });

    web3Utils.getFee(account, token_address, async (fee) => {
        let nextMintFee = new BNumber((fee['nextMintFee'] + "").slice(0, (fee['nextMintFee'] + "").length)).dividedBy(1e18);
        console.log("getFee", fee, fee['nextMintFee'], nextMintFee);
        let newVar = await web3Utils.ethers_provider.getGasPrice();
        var hashCode;
        info.methods.mint(account)
            .send({
                from: account,
                value: ethers.utils.parseEther(nextMintFee.toFixed()) + "",
                gas: gasMargin("217207", 1.1).toFixed(0),
                gasPrice: gasMargin(newVar.toString(), 1.1).toFixed(0)
            }, function (error, transactionHash) {
                callback1(true);
                if (!error) {
                    console.log("transfer hash: ", transactionHash)
                    hashCode = transactionHash;
                } else {
                    callback1(true);
                    console.log(error)
                }
            }).then((result) => {
            console.log('mintToken Run end');
            console.log("Transfer Status : ", result.status)
            callback1(false);
            callback2(result, true);
        }).catch((e) => {
            callback1(true);
            callback2({}, false);
        });
    })
}

web3Utils.userBatchMint = async (account, tick, amount, callback1, callback2) => {
    amount = Math.floor(amount);
    console.log(account, tick);
    const VUE_APP_FACTORY_CONTRACT_ADDRESS = process.env.VUE_APP_FACTORY_CONTRACT_ADDRESS || "";
    // Initialise contract instance
    const factory_contract = new ethers.Contract(VUE_APP_FACTORY_CONTRACT_ADDRESS, InscriptionFactoryAbi.abi, web3Utils.ethers_provider);

    let project = await factory_contract.getIncriptionByTick(tick);
    let token_address = project[0]['addr'];
    let maxMintSize = (project[0]['maxMintSize'] + '').slice(0, (project[0]['maxMintSize'] + '').length);

    if (maxMintSize <= 1) {
        callback1(true);
        Notification({
            title: 'Batch Mint Error',
            message: 'Batch Mint failed, this project does not support batch mint',
            type: 'error',
            duration: 5000
        })
        return;
    }
    if (amount > maxMintSize) {
        callback1(true);
        Notification({
            title: 'Batch Mint Error',
            message: 'Batch Mint failed, The maximum batch mint of this project is: ' + maxMintSize,
            type: 'error',
            duration: 5000
        })
        return;
    }
    let fee = new BNumber((project[0]['crowdFundingRate'] + '').slice(0, (project[0]['crowdFundingRate'] + '').length)).dividedBy(1e18)
    console.log(project, token_address);
    let info = new web3Utils.web3.eth.Contract(InscriptionAbi.abi, token_address, {
        from: account
    });

    let newVar = await web3Utils.ethers_provider.getGasPrice();
    var hashCode;
    info.methods.batchMint(account, amount)
        .send({
            from: account,
            value: ethers.utils.parseEther(fee.multipliedBy(amount).toFixed()) + "",
            gas: gasMargin(150000 + amount * 12000, 1.1).toFixed(0),
            gasPrice: gasMargin(newVar.toString(), 1).toFixed(0)
        }, function (error, transactionHash) {
            callback1(true);
            if (!error) {
                console.log("transfer hash: ", transactionHash)
                hashCode = transactionHash;
            } else {
                callback1(true);
                console.log(error)
            }
        }).then((result) => {
        console.log('batchMint Run end');
        console.log("Transfer Status : ", result.status)
        callback1(false);
        callback2(result, true);
    }).catch((e) => {
        callback1(true);
        callback2({}, false);
    });
}

/**
 * get Project List
 * @param account
 * @param page page
 * @param size size
 * @param type type 0- all, 1- in-process, 2- ended
 * @param callback
 */
web3Utils.getIncriptionList = (account, page, size, type, callback) => {
    const VUE_APP_FACTORY_CONTRACT_ADDRESS = process.env.VUE_APP_FACTORY_CONTRACT_ADDRESS || "";
    console.log("info", VUE_APP_FACTORY_CONTRACT_ADDRESS);
    let info = new web3Utils.target_web3.eth.Contract(InscriptionFactoryAbi.abi, VUE_APP_FACTORY_CONTRACT_ADDRESS, {
        from: account
    });
    // info.methods.getIncriptions(page, size, type, '').call().then((result) => {
    //     console.log('getIncriptions', result);
    //     callback(result);
    // });
}

/**
 * get Project
 * @param account
 * @param tick tick
 * @param callback
 */
web3Utils.getIncriptionInfo = (account, tick, callback) => {
    const VUE_APP_FACTORY_CONTRACT_ADDRESS = process.env.VUE_APP_FACTORY_CONTRACT_ADDRESS || "";
    this.info = new web3Utils.web3.eth.Contract(InscriptionFactoryAbi.abi, VUE_APP_FACTORY_CONTRACT_ADDRESS, {
        from: account
    });
    this.info.methods.getIncriptionByTick(tick).call().then((result) => {
        console.log('getIncriptionByTick', result);
        callback(result);
    });
}

/**
 * get Fee
 * @param account
 * @param contractAddress
 * @param callback
 */
web3Utils.getFee = (account, contractAddress, callback) => {
    let info = new web3Utils.web3.eth.Contract(InscriptionAbi.abi, contractAddress, {
        from: account
    });
    info.methods.getMintFee(account).call().then((result) => {
        console.log('getMintFee', result);
        callback(result);
    });
}

web3Utils.signMessage = async (signMessage, address, callback, error) => {
    try {
        console.log("Data", signMessage);
        signMessage = web3Utils.web3.utils.utf8ToHex(signMessage);
        web3Utils.web3.eth.personal.sign(signMessage, address, (err, res) => {
            console.log("err:", err)
            console.log("Sign:", res)
            if (res !== undefined) callback(res);
        })
    } catch (err) {
        console.error(err)
        error();
    }
}

web3Utils.getGasPrice = async () => {
    try {
        const gasPrice = await web3Utils.web3.eth.getGasPrice()
        return gasPrice
    } catch (err) {
        console.error(err)
    }
}

/**
 * Sending ETH
 */
web3Utils.sendETH = async (from, to, value, gas, gas_price) => {
    const transactionParameters = {
        nonce: '0x00', // ignored by MetaMask
        gasPrice: gas_price, // customizable by user during MetaMask confirmation.
        gas: gas.toString(16), // customizable by user during MetaMask confirmation.
        to: to, // Required except during contract publications.
        from: from, // must match user's active address.
        value: (value * Math.pow(10, 18)).toString(16), // Only required to send ether to the recipient from the initiating external account.
        data: '', // Optional, but used for defining smart contract creation and interaction.
    };

    // txHash is a hex string
    // As with any RPC call, it may throw an error
    return await web3Utils.ethereum.request({
        method: 'eth_sendTransaction', params: [transactionParameters],
    });
}


export default web3Utils
export const NETWORKS = {
    '1': 'Main Net',
    '2': 'Deprecated Morden test network',
    '3': 'Ropsten test network',
    '4': 'Rinkeby test network',
    '5': 'Goerli test network',
    '42': 'Kovan test network',
    '4447': 'Truffle Develop Network',
    '5777': 'Ganache Blockchain'
}
