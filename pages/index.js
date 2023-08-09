import MeetupList from '../components/meetups/MeetupList';
import {useEffect} from 'react';
import Head from 'next/head';


/*This imported package will not be the part of the client side bundle
So we can import MongoClient code here, which will be executed only on server.
And NextJS will detect this and not include it in client side bundle, 
which is good from bundle size point of view and also security.
So we can use both client side and server side code, and depending 
where we use it , it will be included in different bundles,
which are independent from each other. This is a nice feature provided
by NextJS.
*/
import { MongoClient } from 'mongodb';
import { Fragment } from 'react';

const DUMMY_MEETUPS = [
    {
        id: 'm1',
        title: 'A first meetup',
        image: './officeBuilding',
        address: 'Some address 142, Countrybrook loop',
        description: 'This is first meetup'
    },
    {
        id: 'm2',
        title: 'A second meetup',
        image: './officeBuilding',
        address: 'Some address 142, Countrybrook loop',
        description: 'This is second meetup'
    },
    {
        id: 'm3',
        title: 'A third meetup',
        image: './officeBuilding',
        address: 'Some address 142, Countrybrook loop',
        description: 'This is third meetup'
    }
];

function HomePage(props){
 
    /*  No need to maintain state if we are using getStaticProps() for the data
    const [loadedMeetups, setLoadedMeetups] = useState([]);

    useEffect(() => {
        //send a http request and fetch data
        setLoadedMeetups(DUMMY_MEETUPS);
    },[]);

    return <MeetupList meetups={loadedMeetups} />
    */

    return ( 
    <Fragment>
     <Head>
        <title>My React Meetups</title>
        <meta name="description" 
              content="Browse a huge list of highly active React meetups!"
        />
     </Head>
        <MeetupList meetups={props.meetups} />
    </Fragment>
    );
}

//This is a special function defined in nextjs.
//Nextjs will look for a function with exatcly this name,
//it executes it during the pre-rendering process.
//So it will not call your component  HomePAge() function directly,
//and will not use the returned JSX html content, but
//first will call getStaticProps() before that.
//The job of this function is to prepare props for HomePage()
//So data is loaded first, before the HomePage() is executed, 
//hence nextjs can render component with the required data.
//Any code written here will not be executed on client side.
//This code is executed during the built process, not on the server or client.
//It is not executed for every request, because it is not server side rendering.
//This way we can move data fetching away from the client to the build process.
//Now if we inspect we will get data in list instead of empty.
//Now data is not fecthed on second render cycle on the client,
//but initially when the page is re-rendering during the built process
//This is the key feature of NextJS i.e. data fetching for pre-rendering


export async function getStaticProps() {
    //fetch data from an API

    const client = await MongoClient.connect('mongodb+srv://Viral_user:Viralreact@cluster0.nxrzdzw.mongodb.net/meetupsDatabase?retryWrites=true&w=majority');

    const db = client.db();
    const meetupsCollection = db.collection('meetupsCollection');

    //find() will return all the documents from the collection
    const meetups = await meetupsCollection.find().toArray();

    client.close();

    //always need to return an object with props key only
    return {
        props: {
            meetups: meetups.map(meetup => ({
                title: meetup.title,
                address: meetup.address,
                image: meetup.image,
                id: meetup._id.toString(),                
            }))
        },
        //By using revalidate, we unlock a feature called incremental static generation
        //It is number of seconds the Nextjs will wait,
        //untill it re-generates this page for an incoming request.
        //It means this page will not be only generated in build process,
        //but also (for every seconds specified) on the server.
        //This way newly generated page will replace old generated page.
        //Thus your data will be not older than 10 seconds.
        //Thus it will be re-generated on the server even after deplyment.
        //Hence we dont need to re-deploy and re-built just becuase data changed.
        revalidate: 10
    };
}


/* This is an alternative of using getStaticProps()
The difference is that this function will not run during the build process,
but instead always on the server, after deployment.
The page will be re-generated after every incoming request,
so you want to pre-generate the page dynamically,
on the fly after deployment on the server, not during the build process
or not just every couple of seconds.


export async function getServerSideProps(context){
   
   const req = context.req;
   const res = context.res;

    return {
        props: {
            meetups: DUMMY_MEETUPS
        }
    };
}
*/

export default HomePage;