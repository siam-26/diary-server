const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
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

        //send uploaded posts on database
        app.post('/upload', async (req, res) => {
            const uploadedPosts = req.body;
            const result = await upload_posts.insertOne(uploadedPosts);
            res.send(result);
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