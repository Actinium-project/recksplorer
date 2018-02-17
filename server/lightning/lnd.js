// app/lightning.js
const grpc = require("grpc");
const fs = require("fs");

// expose the routes to our app with module.exports
module.exports = function (protoPath, lndHost, lndCertPath, macaroonPath) {

	const lnrpcDescriptor = grpc.load(protoPath);
	const lndCert = fs.readFileSync(lndCertPath);
	const sslCreds = grpc.credentials.createSsl(lndCert);
	const lnrpc = lnrpcDescriptor.lnrpc;

	var macaroonCreds = grpc.credentials.createFromMetadataGenerator(function (args, callback) {
	        const adminMacaroon = fs.readFileSync(macaroonPath);
	        const metadata = new grpc.Metadata();
	        metadata.add("macaroon", adminMacaroon.toString("hex"));
	        callback(null, metadata);
	});
	credentials = grpc.credentials.combineChannelCredentials(sslCreds, macaroonCreds);

	// test of rpc to lnd
	var lightning = new lnrpc.Lightning('localhost:10009', credentials);
	call = lightning.walletBalance({}, function(err, response) {
	    console.log('WalletBalance error: ');
            console.log(err);
	    console.log('WalletBalance: ');
	    console.log(response);
	  })

	return new lnrpcDescriptor.lnrpc.Lightning(lndHost, credentials);
};
