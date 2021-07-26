export interface Userinfo {
       id: string;
       uid: string;
       kycid: string;
       creationdate: string;
       name: string;
       image: string;
       phoneCountryCode: string; 
       country: string; 
       nationalId: string; 

       network: string; 

       productiontestnet: string; 
       termsagreed: boolean ; 
       datetermsagreed: string;

       activebitcoinwalletid: string;
       activebitcoinwalletaddress: string;
       activedashcoinwalletid: string;
       activedashcoinwalletaddress: string;
       activeplanname: string;
       activeplandescription: string;
       planstartdate: string;
       activeplanfixesfees: string;
       activeplanvariabefees: string;
       plandays: number;
       plantransactions: number;

       walletscreated: boolean ; 
       changelytermsagreed: boolean ; 
       walletpasswordset: boolean ; 
       passwordchecksum: string;
       changelydatetermsagreed: string;

       feestermsagreed: boolean ; 
       feesdatetermsagreed: string;
      
       encryption: string;

       email: string; 
       phoneNo: string; 
       kycstatus: boolean; 
       subscriptionStatus: string; 
       userStatus: string; 
  
       testnetbitcoinpartneraddress: string;
       livenetbitcoinpartneraddress: string;
       livenetbitcoinvendoraddress: string;
       testnetbitcoinvendoraddress: string;

       testnetdashcoinpartneraddress: string;
       livenetdashcoinpartneraddress: string;
       livenetdashcoinvendoraddress: string;
       testnetdashcoinvendoraddress: string;

}
