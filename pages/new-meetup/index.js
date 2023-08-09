//our-domain.com/new-meetup

import NewMeetupForm from '../../components/meetups/NewMeetupForm';
import { useRouter } from 'next/router';
function NewMeetupPage() {

    const router = useRouter();
    async function addMeetupHandler(enteredMeetupData) {
        console.log(enteredMeetupData);

        //this fetch call will request to the new-meetup.js file
        //and that will make NextJs trigger the handle function in that file.
        const response = await fetch('/api/new-meetup',{
            method: 'POST',
            body: JSON.stringify(enteredMeetupData),
            headers: {
                'Content-Type' : 'application/json'
            }
        });

        const data = await response.json();
        console.log(data);
        router.push('/');
    }
    return <NewMeetupForm onAddMeetup={addMeetupHandler} />
}

export default NewMeetupPage;