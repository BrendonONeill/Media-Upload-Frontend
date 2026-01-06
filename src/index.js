import 'dotenv/config'
import express from "express"
import { dirname, join, resolve } from 'path';
import {fileURLToPath} from 'url';
import cors from 'cors'
import errorHandler from "./util/errorHandler.js";


const app = express()
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(__dirname + '/public'));
app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));


var whitelist = ["https://upload.ko-do.dev","http://localhost:3000"]

const  corsOptions = {
    origin: function (origin, callback){

        if(whitelist.indexOf(origin) !== -1 )
        {
            callback(null,true);
        }
        else
        {
            callback(new Error("Not allowed by CORS"));
        }
    },
    method: ['GET','POST'],
    credential: true
};

app.options('*', cors(corsOptions));


app.get("/", (req,res) => { 
    const __dirname = dirname(fileURLToPath(import.meta.url));
    res.sendFile(join(__dirname, 'index.html'));
});

app.post("/fakeuploadsmall", cors(corsOptions), async (req,res) => {
    try {
        await wait(3000);
        let number = randomNumber()
        console.log(number)
        if(number < 7)
        {
            resolve("success")
            console.log("passed")
            res.status(200).json({message: `File was successfully uploaded`});
        }
        else
        {
            let err =  new Error("wasn't able to upload file, Try again.")
            err.status = 400
            err.passKeyFailed = false
            throw err
        }      
    } catch (error) {
        console.log("failed")
        let returnErr = errorHandler(error)
        res.status(returnErr.status).json(returnErr)
    }
})

app.post("/fakeuploadlarge", cors(corsOptions), async (req,res) => {
    
    res.status(200).json({message: `File was successfully uploaded`});
})

app.post("/fakestartmultipartupload", cors(corsOptions), async (req,res) => {
    await wait(1500);
    res.status(200).json({message: `File was successfully uploaded`});
})

app.post("/fakeuploadchunk", async (req,res) => {
        await wait(3000);
        res.status(200).json({message: `File was successfully uploaded`});
})

app.post("/fakefinishmultipartupload", cors(corsOptions), async (req,res) => {
    await wait(1200);
    res.status(200).json({message: `File was successfully uploaded`});
})

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomNumber() {
   return Math.round(Math.random() * 10)
}

app.use((err,req,res,next) => {
  console.error('An error occurred:');
  console.error('Status:', err.status);
  console.error('Message:', err.message);

  if(err.status === 413)
  {
    res.status(413).json({error:"Media was too large", message: "Media was too large", passKeyFailed: "false"});
  }
  if(err.status === 415)
  {
      res.status(415).json({error:err.message, message: err.message, passKeyFailed: "false"});
  }
  next()
})


app.listen("3000" ,() =>{
    console.log("running on 3000")
})
