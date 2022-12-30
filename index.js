const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('TalkDiary server');
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.iahawou.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        //mongodb collections
        const upload_posts = client.db("TalkDiary").collection("uploadImgPost-collection");
        const new_user_info = client.db("TalkDiary").collection("newUser-info");

        //send uploaded posts on database
        app.post('/upload', async (req, res) => {
            const uploadedPosts = req.body;
            const result = await upload_posts.insertOne(uploadedPosts);
            res.send(result);
        })

        //get all Uploaded Posts
        app.get('/upload', async (req, res) => {
            const query = {};
            const result = await upload_posts.find(query).sort({ $natural: -1 }).toArray();
            res.send(result);
        })

        //get specific Uploaded Posts
        app.get('/upload/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await upload_posts.findOne(query);
            res.send(result);
        })

        //new user info
        app.post('/newUser', async (req, res) => {
            const query = req.body;
            const user = await new_user_info.insertOne(query);
            res.send(user);
        })

        //get new user info
        app.get('/newUser', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await new_user_info.find(query).toArray();
            res.send(user);
        })
    }
    finally {

    }
}
run().catch(error => {
    console.log(error);
})


app.listen(port, () => {
    console.log(`TalkDiary-server listening on port ${port}`)
})