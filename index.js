const express = require("express")
const axios = require("axios")
const { Readable } = require("stream");

const PORT = process.env.PORT || 5000
const app = express()

const { PinataSDK } = require("pinata-web3")
const fs = require("fs");
const FormData = require('form-data');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' });

const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,
   optionSuccessStatus:200,
}
app.use(cors(corsOptions))
require("dotenv").config()

const pinata = new PinataSDK({
  pinataJwt: '..',
  pinataGateway: ''
})

app.get("/", (req, res) => {
  res.send("Welcome to your App!")
})

// File Upload Endpoint
// I can't get this file upload working. 
app.post('/upload', function(req, res) {
  const pinata_key = "";
	const pinata_secret = "";
	const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

	console.log(req)

	const data = new FormData();    
	data.append('file', req)

    const pin = axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", data, {
      maxBodyLength: "Infinity",
      headers: {
          'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
          pinata_api_key: pinata_key,
          pinata_secret_api_key: pinata_secret
      }
    });

    console.log(pin.data);
	res.send(pin)
});

// JSON Upload Endpoint
app.post('/json_upload', function(req, res) {
	const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  const pinata_key = "";
	const pinata_secret = "";

    const ax = axios 
        .post(url, req, {
            headers: {
                pinata_api_key: pinata_key,
                pinata_secret_api_key: pinata_secret,
            }
        })
        .then(function (response) {
            console.log("json uploaded", response.data.IpfsHash)
            return "" + response.data.IpfsHash
        })
		.catch(function (error) {
            console.log(error)
		})

	res.send(ax);

});

app.listen(PORT, function () {
  console.log(`Express server listening on port ${PORT}`)
})

