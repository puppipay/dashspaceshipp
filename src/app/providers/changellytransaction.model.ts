export interface ChangellyTransaction {
            id: string;		
            changellyid: string;		// id returned by 
            uid: string;  	// user making request
            payoutAddress: string; // target output
            payinAddress: string; // user payment
            refundAddress: string; // refund output
            amountExpectedFrom: string;
            createdAt: string;
            currencyFrom: string;
            currencyTo: string;
            transactiondate: string;

}
