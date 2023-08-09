//api/new-meetup

import { MongoClient } from 'mongodb';

//This function will be triggered by NextJS when 
//fetch method will be called from addMeetupHandler
//in new-meetup/index.js
async function handler(req, res) {
    if(req.method === 'POST'){
        const data = req.body;

        //object destructuring
        const { title, image, address, description}  = data;

        const client = await MongoClient.connect('mongodb+srv://Viral_user:Viralreact@cluster0.nxrzdzw.mongodb.net/meetupsDatabase?retryWrites=true&w=majority');

        const db = client.db();
        const meetupsCollection = db.collection('meetupsCollection');
        const result = await meetupsCollection.insertOne(data);

        console.log("Log after inserting: " + result);
     client.close();

        res.status(201).json({message: 'Meetup inserted'});
    }
}

export default handler;