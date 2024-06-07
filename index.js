const express = require('express');
const app=express()
const cors = require('cors');
require('dotenv').config()
const port=process.env.PORT||5000

//-----------------set the middleware-----------
app.use(cors())
app.use(express.json())

app.get('/',async(req,res)=>{
  res.send('tourist guide running')
})

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pnsxsk9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    //-----------all collection of database--------------
    const placesCollection=client.db('TourisGuide').collection("places")
    const guideCollection=client.db('TourisGuide').collection("ourGuides")
    const reviewCollection=client.db('TourisGuide').collection("review")
    const bookingsCollection=client.db('TourisGuide').collection("bookings")
    const wishlistCollection=client.db('TourisGuide').collection("wishlist")

    //---------------all restAPI for website------------
    app.get('/places',async(req,res)=>{
      const result=await placesCollection.find().toArray()
      res.send(result)
    })
      app.get('/guides',async(req,res)=>{
        const result=await guideCollection.find().toArray()
        res.send(result)
      })

      app.get('/places/:id',async(req,res)=>{
        const id=req.params.id
        const query={_id:new ObjectId(id)}
        const result=await placesCollection.findOne(query)
        res.send(result)
      })

      app.get('/guide/:id',async(req,res)=>{
        const id=req.params.id
        const query={_id:new ObjectId(id)}
        const result=await guideCollection.findOne(query)
        res.send(result)
      })

      app.post('/review',async(req,res)=>{
        const review=req.body
        const result=await reviewCollection.insertOne(review)
        res.send(result)
      })
      app.get('/review/:id',async(req,res)=>{
        const id=req.params.id
        console.log(id);
        const query={id:id}
        const result=await reviewCollection.find(query).toArray()
        res.send(result)
      })

      app.post('/bookings',async(req,res)=>{
        const bookingInfo=req.body
        const result=await bookingsCollection.insertOne(bookingInfo)
        res.send(result)
      })
      app.post('/wishList',async(req,res)=>{
        const item=req.body
        const result=await wishlistCollection.insertOne(item)
        res.send(result)
      })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.listen(port,()=>{
    'server running'
})