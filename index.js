const express = require('express');
const bodyParser = require('body-parser');
const credit = require('./credit');
const MongoUtil = require('./mongoUtil');

const app = express();
const port = 3000;

let db;


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

app.get('/ping', (req, res) => {
    res.send('pong!')
});

app.post('/credit/add', async (req, res) => { 
    try{
        await credit.Add(db, req.body.refId, req.body.credit);
        res.status(200).send("Success!!");
    }
    catch(ex){
        res.status(500).send(ex);
    }
});

app.post('/credit/substract', async(req, res) => { 
    try{
        await credit.Substract(db, req.body.refId, req.body.credit);
        res.status(200).send("Success!!");
    }
    catch(ex){
        res.status(500).send(ex);
    }
    
});

app.listen(port, async () => {
    console.log(`The application is listening at http://localhost:${port}`);
    let mongoUtil = new MongoUtil("mongodb+srv://admin:Newpass1@cluster0.ryoc1.mongodb.net/credit?retryWrites=true&w=majority", "credit");
    db = await mongoUtil.GetDb();
});