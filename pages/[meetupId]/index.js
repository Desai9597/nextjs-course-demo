import { Fragment } from "react";
import { MongoClient, ObjectId } from 'mongodb';
import MeetupDetail from '../../components/meetups/MeetupDetail';

function MeetupDetails(props){
    return (
        <MeetupDetail 
            image={props.meetupData.image}
            title={props.meetupData.title}
            address={props.meetupData.address}
            description={props.meetupData.description}
         />    
    );
};

export async function getStaticPaths(){
    const client = await MongoClient.connect('mongodb+srv://Viral_user:Viralreact@cluster0.nxrzdzw.mongodb.net/meetupsDatabase?retryWrites=true&w=majority');

    const db = client.db();
    const meetupsCollection = db.collection('meetupsCollection');

    //empty criteria as first argument of find() means no filter of records, 
    //means fetch all records, but second argument says fetch only id field/column
    const meetups = await meetupsCollection.find({}, {_id: 1 }).toArray();

    client.close();
    return {
        /*fallback tells Nextjs whether your paths array contains
        all supported parameter values or just some of them.
        If you set fallback to false, you say that your path
        contains all supported meetupIds values. It means that if 
        the user enters anything not supported here, e.g. m3, then
        user will see 404 error. If we set fallback to true, then 
        nextJs will try to generate the page with this meetupId dynamically
        on the server for the incoming requests.
        This way we can use paths to pre-generate only most frequently visited pages form the paths array,
        and dynamically generate path for less frequently visited pages
        */
        fallback: false,
        paths: 

         //array having one object per one version of ths dynamic page,
            //where params key is again a nested object where key value pairs,
            //that leads to a dynamic page.
            meetups.map(meetup => ({ 
                            params: { 
                                meetupId: meetup._id.toString()
                            },
                        })),       
    };
}

export async function getStaticProps(context){
    
    //params is an object where our identifiers in [] will be the properties 
    //and values is the actual values encoded in the url
    const meetupId = context.params.meetupId;
    
    const client = await MongoClient.connect('mongodb+srv://Viral_user:Viralreact@cluster0.nxrzdzw.mongodb.net/meetupsDatabase?retryWrites=true&w=majority');

    const db = client.db();
    const meetupsCollection = db.collection('meetupsCollection');

    const selectedMeetup = await meetupsCollection.findOne({
        _id: new ObjectId(meetupId),
    });

    client.close();


    //this log will be displayed only in the development server terminal
    // in Visual Studio Code and not in the console of the browser, because
    //getStaticProps is called only during the build process.
    console.log(meetupId);

    return {
        props: {
            meetupData: {
                id: selectedMeetup._id.toString(),
                title: selectedMeetup.title,
                address: selectedMeetup.address,
                image: selectedMeetup.image,
                description: selectedMeetup.description,
            },
        },
    };
}

export default MeetupDetails;

