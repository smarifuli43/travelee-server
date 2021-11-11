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
    const orderCollection = database.collection('booking');


    // GET API
    app.get('/services', async (req, res) => {
      const cursor = serviceCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    })

    // GET SINGLE SERVICE API 
    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.json(service);
    })

    // GET MY ORDER
    app.get('/myorder', async (req, res) => {
      const email = req.query.email;
      const query = { email: email }
      const cursor = orderCollection.find(query);
      const orders = await cursor.toArray();
      console.log(orders);
      res.json(orders);
    })

   // GET ALL ORDER
  app.get('/orders', async (req, res) => {
    const cursor = orderCollection.find({});
    const services = await cursor.toArray();
    console.log(services);
    res.send(services);
  });
// DELETE ORDERS
    app.delete('/booking/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.json(result);
    });

    // POST SERVICE API
    app.post('/services', async (req, res) => {
      const service = req.body;
      const result = await serviceCollection.insertOne(service);
      res.json(result);
    })

//  POST BOOKING INFO
    app.post('/booking', async (req, res) => {
      const service = req.body;
      const result = await orderCollection.insertOne(service);
      res.json(result);
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
