const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());

//  const dbUser = process.env.DB_USER;
//  const pass = process.env.DB_PASS;
//  const uri = `mongodb+srv://${dbUser}:${pass}@cluster0.h1oeh.mongodb.net/<dbname>?retryWrites=true&w=majority`;
const uri = process.env.DB_PATH
let client = new MongoClient(uri, { useNewUrlParser: true });



// const rootCall = (req, res) => res.send("Thank You Very Much")
app.get("/products", (req, res) => {
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("OnlineMarket").collection("products");
        collection.find().toArray((err, documents) => {
              if(err){
                  console.log(err)
                  res.status(500).send({message:err})
              }
              else{
                    res.send(documents)
                  }
              })
        client.close();
      });
})

app.get("/fruits/banana", (req, res) => {
    res.send({ fruit: "banana", Quantity: 200, price: 10000 })
})

const user = ["Asad", "Sabed", "Sohana", "Sharif", "Arif", "Al-amin"];
app.get("/products/:key", (req, res) => {
    const key = req.params.key;
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("OnlineMarket").collection("products");
        collection.find({key}).toArray((err, documents) => {
              if(err){
                  console.log(err)
                  res.status(500).send({message:err})
              }
              else{
                    res.send(documents)
                  }
              })
        client.close();
      });
})
app.post("/getProductsByKey", (req, res) => {
    const productKeys = req.body;
    console.log(productKeys)
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("OnlineMarket").collection("products");
        collection.find({key: { $in: productKeys}}).toArray((err, documents) => {
              if(err){
                  console.log(err)
                  res.status(500).send({message:err})
              }
              else{
                    res.send(documents)
                  }
              })
        client.close();
      });
    })

//post
app.post("/addProduct", (req, res) => {
   
    const product = req.body;
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("OnlineMarket").collection("products");
        collection.insert(product,(err, result)=>{
              if(err){
                  console.log(err)
                  res.status(500).send({message:err})
              }
              else{
                    res.send(result.ops[0])
                  }
              })
        client.close();
      });
})

app.post("/orderPlaced", (req, res) => {
   
    const orderDetail = req.body;
    orderDetail.orderTime = new Date();
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("OnlineMarket").collection("orders");
        collection.insertOne(orderDetail,(err, result)=>{
              if(err){
                  console.log(err)
                  res.status(500).send({message:err})
              }
              else{
                    res.send(result.ops[0])
                  }
              })
        client.close();
      });
})

const port = process.env.PORT
app.listen(port, () => console.log("Listening to port 4000"));