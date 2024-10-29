const { express } = require("express")
const { axios } = require("axios")
const { PinataSDK } = require("pinata-web3")
const { fs } = require("fs");
const { FormData } = require('form-data');
const { Readable } = require('stream');
const { multer }  = require('multer')
const { storage } = multer.memoryStorage()
const { upload } = multer({ storage: storage })

const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,
   optionSuccessStatus:200,
}
app.use(cors(corsOptions))
require("dotenv").config()

const pinata = new PinataSDK({
  pinataJwt: '',
  pinataGateway: 'chocolate-large-rabbit-995.mypinata.cloud'
})

const PORT = process.env.PORT || 5000
const app = express()

app.get("/", (req, res) => {
  res.send("Welcome to your App!")
})

// Retrieve list of pinned files on gateway
app.get("/list", async (req, res) => {
	const pinata_key = "";
	const pinata_secret = "";
	
    	const response = await axios({
        	method: "get",
        	url: "https://api.pinata.cloud/data/pinList?status=pinned",
        	headers: {
            	'pinata_api_key': pinata_key,
            	'pinata_secret_api_key': pinata_secret,
        	},
    	});
	res.json(response.data)
});

// File Upload Endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
	const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    	const pinata_key = "";
	const pinata_secret = "";
	const buffer = Buffer.from(req.file.buffer);
    	const stream = Readable.from(buffer);
    	const filename = `an-awesome-file.pdf`;
    	stream.path = filename;

    	const formData = new FormData();
    	formData.append("file", stream);

	const ax = await axios
	.post(url, formData, {
            	headers: {
                	'Content-Type': `multipart/form-data; boundary= ${formData._boundary}`,
                	'pinata_api_key': pinata_key,
                	'pinata_secret_api_key': pinata_secret,
            		}
        }).then( async function (response) {
        	console.log("Success: ", response.data.IpfsHash);
		return response.data.IpfsHash;
    	}).catch(function (error) {
        	console.log("Fail! ", error.response.data);
    	});
	res.json(ax);
});

// JSON Upload Endpoint
app.post('/json_upload', async (req, res) => {
	const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    	const pinata_key = "";
	const pinata_secret = "";
	
    	const ax = await axios 
        .post(url, req, {
            headers: {
                pinata_api_key: pinata_key,
                pinata_secret_api_key: pinata_secret,
            }
        })
        .then(function (response) {
		return response.data.IpfsHash
        })
	.catch(function (error) {
        	console.log(error)
	});
	res.json(ax);
});

app.listen(PORT, function () {
  console.log(`Express server listening on port ${PORT}`)
})


