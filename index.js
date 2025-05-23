import 'dotenv/config';
import express from 'express'; 
import logger from "./logger.js";
import morgan from "morgan";

const app = express();
const port = process.env.PORT || 3000;
const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

app.use(express.json());

let playerNames = [];
let playerID = 1;

// Add a player
app.post('/players',(req, res) => {
    // logger.info('Player added');
    const {name,jersyNumber} = req.body;
    const team = {id: playerID++, name, jersyNumber};
    playerNames.push(team)
    res.status(201).send(team)
})

// get a player
app.get('/players', (req, res) => {
    res.status(200).send(playerNames);
})

// get a player with id
app.get('/players/:id', (req, res) => {
    const athelete = playerNames.find(t => t.id === parseInt(req.params.id))
    if (!athelete){
        return res.status(404).send('Player not found')
    }else{
        res.status(200).send(athelete)
    }
})

// update a player
app.put('/players/:id', (req, res) => {
    const athelete = playerNames.find(t => t.id === parseInt(req.params.id))
    const {name,jersyNumber} = req.body;
    athelete.name = name;
    athelete.jersyNumber = jersyNumber;
    res.status(200).send(athelete);

    if (!athelete){
        return res.status(404).send('Player not found')
    }
})

//Delete a player

app.delete('/players/:id', (req, res) => {
    const athelete = playerNames.find(t => t.id === parseInt(req.params.id))
    if (!athelete){
        return res.status(404).send('Player not found')
    }else{
        playerNames = playerNames.filter(t => t.id !== parseInt(req.params.id))
        res.status(200).send(athelete)
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
