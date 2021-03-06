const { MongoClient, Admin } = require("mongodb");
const Objectid=require('mongodb').ObjectId;
const express=require('express');
const cors=require('cors');
require("dotenv").config();


const app=(express())




const port =process.env.PORT || 9000;


app.use(express.json())
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0qtlc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
      await client.connect();
      console.log("Connected");
      const database = client.db('Sports-db');
      const matchesCollection = database.collection('matches');
      const purchaseCollection = database.collection('purchases');
      const UsersCollection = database.collection('users');
      const ratingsCollection = database.collection('ratngs');


          

      // Add New to Data base //
      app.post("/matches",async(req,res)=>{

        const product=req.body;

        const result=await matchesCollection.insertOne(product);
        console.log(result);
        res.send(result)
    })

      //  Store Purchase Data ///
      app.post('/orders',async(req,res)=>{
           const order=req.body;

           const result=await purchaseCollection.insertOne(order);
res.send(result)
      });



        // POst Ratings By users //
        app.post('/reviews',async(req,res)=>{

          const data=req.body;
          console.log( "recieved data" ,data);

          const result =await ratingsCollection.insertOne(data);

          res.send(result)
        })
                    // Store Users ///


       app.post('/users',async (req,res)=>{
         console.log('user Post api hit');
        const user=req.body;

        const result=await UsersCollection.insertOne(user);

        res.send(result)
       
       });

        // Get Single Game by id
        app.get(`/sport/:id`,async(req,res)=>{
          const id=req.params.id;
          console.log("id", id);
          const query={_id: Objectid(id)}
          console.log(id);
          const result=await matchesCollection.findOne(query);
          res.json(result);
        })


    
      //  Update For Google USers///
      app.post('/users',async(req,res)=>{

        const user=req.body;

        const filter = { email:user.email};
        console.log(user);
        const options = { upsert: true };
        const updateDoc = {$set:user};
      const result= await  UsersCollection.updateOne(filter,updateDoc,options);

       res.json(result)
      })




            //  Delete Products ///

            app.delete('/cars/:carId',async(req,res)=>{
              console.log("api hit");

              const id=req.params.carId;
              console.log("delte Product",id);
              const query={_id: Objectid(id)}
              const result = await matchesCollection.deleteOne(query);
              res.send(result)

            })
         //  Delete User Purchase //

         app.delete("/order/:email",async(req,res)=>{
          const id=req.params.email

          const query={_id: Objectid(id)}
          const result = await purchaseCollection.deleteOne(query);
          res.send(result)
       })
                
                  // get Ratings ///

                  app.get('/reviews',async(req,res)=>{

                    const cursor=ratingsCollection.find({});

                    const result=await cursor.toArray()
                    res.json(result);
                    
                  })

            //  Get User Orders //

            app.get("/order/:email",async(req,res)=>{
               const userEmail=req.params.email;

               const query = {email: userEmail};
               const cursor= purchaseCollection.find(query);
               const result=await cursor.toArray()
               res.json(result);
            })


         
      // Get All USers //

      app.get('/users',async(req,res)=>{

        const cursor =UsersCollection.find({});

          const result=await cursor.toArray()

          res.json(result)
      })
      // GEt All Cars ///
                
         app.get('/matches',async(req,res)=>{
            const cursor=matchesCollection.find({});

            const result=await cursor.toArray()

        res.json(result)
      })
    } finally {
      // Ensures that the client will close when you finish/error
    //   await client.close();
    }
  }
  run().catch(console.dir);


 
  app.get('/',async(req,res)=>{
           
   res.send("server Running")
         

  })

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })