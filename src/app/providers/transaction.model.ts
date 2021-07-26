export interface Transaction {
            id: string;
            paymentid: string;
            transactiondate: string;
            revertabledate: string;
            reverteddate: string;
            revertedby: string;
            paymenttxid: string;
            paymentaddress: string;
            senderaddress: string;
            receiveraddress: string;
            payeename: string;
            currency: string;
            paymentstring: string;
            paymentpin: string;
            paymentconfirmation:number;
            paymentvalue: number;
            finalvalue: number;

}
