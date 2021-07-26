import { firebaseconfig } from '../../config/firebaseconfig';


let myenv = "testprod"; //liveprod, testprod, testdev, livedev

let myprod = (myenv == "liveprod" || myenv == "testprod")? true: false;
let mynet = (myenv == "testdev" || myenv == "testprod")? "testnet": "livenet";



export const environment = {
    production: myprod,
    hosteddomain : 'https://grand2.belavaditech.com', 
    network : 'livenet',
    storageuniq: 'andr',
    termsurl: "https://goo.gl/forms/dOx41nN6hPfwU0T32",
    supportcontact: "support@thepaybox.biz",
    payPalEnvironmentSandbox : '',
    payPalEnvironmentProduction : '',
    paypalnetwork : 'production', //
    bitcointype: "bitpay", //blockcypher
    dashcointype: "dashaeo",
    bitcoinbitpaytestneturl: "https://test-insight.bitpay.com/api",
    bitcoinbitpayliveneturl: "https://insight.bitpay.com/api",
    dashcoinliveneturl: "https://insight.dashevo.org",
    dashcointestneturl: "https://testnet-insight.dashevo.org",
    sandboxfirebaseconfig : firebaseconfig.sandboxfirebaseconfig,
    hostingfirebaseconfig : firebaseconfig.hostingfirebaseconfig,
    productionfirebaseconfig : firebaseconfig.productionfirebaseconfig,
    productionshortlink: firebaseconfig.productionshortlink,
    sandboxshortlink: firebaseconfig.sandboxshortlink,
    logging: {
     	info:false,
     	log:false,
     	error:false,
    }, 

    alertdelay : 5000,
    tmenutitle : 'tDash Spaceship',
    menutitle : 'Dash Spaceship',
    dummy: 'dhdhd',
     fallbackaddress : {
        ethereumaddress: '0x190a458737a764ad4B99290aB10b13147A43000e',
        bitcoinaddress: '1NbGeHF7z1Xose2ZxK9VciNjfy8Qb2NbyD',
        stellaraddress: '',
        bitcoincashaddress: '3JTYAfjWq2N3xL5kUTQrrfKGNPiwTTgjvX',
        rippleaddress: '',
        tronaddress: '',
        eosaddress: '',
        bitcoingoldaddress: '',
        trueusdaddress: '',
        omgaddress: '',
        kyberaddress: '',
        everipediaaddress: '',
        bataddress: '',
        golemaddress: '',
        litecoinaddress: '3D5sQ6hHgM3fQS9nWvkhSUpUMmTFWvN2i7',
    },
  err: {
    'W1230': { code: "W1230", dir: "tab4wallet", function: "localsave " },
    'W1231': { code: "W1231", dir: "tab4wallet", function: "wiftoaddress    " },
    'W1232': { code: "W1232", dir: "tab4wallet", function: "savewif " },
    'W1233': { code: "W1233", dir: "tab4wallet", function: "getaccount " },
    'W1234': { code: "W1234", dir: "tab4wallet", function: "getwalletbalance " },
    'W1220': { code: "W1220", dir: "tab1receive", function: "getwalletbalance " },
    'W1221': { code: "W1221", dir: "tab1receive", function: "consumemessage " },
    'W1222': { code: "W1222", dir: "tab1receive", function: "loadwalletwif " },
    'W1223': { code: "W1223", dir: "tab1receive", function: "wiftoaddress " },
    'W1224': { code: "W1224", dir: "tab1receive", function: "decryptcontract " },
    'W1225': { code: "W1223", dir: "tab1receive", function: "wiftoaddress " },
  }
};
