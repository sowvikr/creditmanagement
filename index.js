const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');


const credit = require('./credit');
const MongoUtil = require('./mongoUtil');
const app = express();
const port = parseInt(process.env.PORT || '3000');
app.set('port', port);

let db;


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/ping', (req, res) => {
    res.send('pong!')
});

app.post('/credit/add', async (req, res) => {
    try {
        let refId = req.body.refId;
        let credit = req.body.credit;
        if(!refId || (credit && credit <= 0)){
            res.status(400).send("Invalid Input");
            return;
        }
        await credit.Add(db, req.body.refId, req.body.credit);
        res.status(200).send("Success!!");
    }
    catch (ex) {
        res.status(500).send(ex);
    }
});

app.post('/credit/substract', async (req, res) => {
    try {
        let refId = req.body.refId;
        let credit = req.body.credit;
        if(!refId || (credit && credit <= 0)){
            res.status(400).send("Invalid Input");
            return;
        }
        await credit.Substract(db, req.body.refId, req.body.credit);
        res.status(200).send("Success!!");
    }
    catch (ex) {
        res.status(500).send(ex);
    }

});

const server = http.createServer(app);
server.listen(port);
server.on('error', (error)=> {
    if (error['syscall'] !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error['code']) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
});
server.on('listening', async () => {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log(`The application is listening at ${bind}`);

    let mongoUtil = new MongoUtil("mongodb+srv://admin:Newpass1@cluster0.ryoc1.mongodb.net/credit?retryWrites=true&w=majority", "credit");
    db = await mongoUtil.GetDb();
});

module.exports.server = server;
