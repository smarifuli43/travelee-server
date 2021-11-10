const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.razkq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


async function run() {
  try {
    await client.connect();
    console.log('database connected');
    const database = client.db('travelee');
    const serviceCollection = database.collection('services');
    const bookingCollection = database.collection('booking');


    // GET API
    app.get('/services', async (req, res) => {
      const cursor = serviceCollection.find({});
      const services = await cursor.toArray();
      // console.log(services);
      res.send(services);
    })

    // GET SINGLE SERVICE API 
    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.json(service);
    })

    // POST SERVICE API
    app.post('/services', async (req, res) => {
      const service = req.body;
      const result = await serviceCollection.insertOne(service);
      res.json(result);
    })

//  POST BOOKING INFO
    app.post('/booking', async (req, res) => {
      const service = req.body;
      console.log(service);
      const result = await bookingCollection.insertOne(service);
      res.send('result');
    });
  }
  finally {
    
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Travelee server running');
})
app.listen(port, () => {
  console.log('Running on port', port);
})
