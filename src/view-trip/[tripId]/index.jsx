import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner';
import { db } from '../../service/firebaseConfig';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/PlacesToVisit';
import Footer from '../components/Footer';

function Viewtrip() {
    const {tripId} = useParams();
    const [trip,setTrip]=useState([]);

    // Used to get Trip info from firebase
    const GetTripData = useCallback(async() => {
        const docRef = doc(db,'AITrips',tripId)
        const docSnap = await getDoc(docRef)

        if(docSnap.exists()){
            console.log("DOcument:",docSnap.data());
            setTrip(docSnap.data());
        }
        else{
            console.log("No such Document");
            toast("No trip found");
        }
    }, [tripId]);

    useEffect(() => {
        tripId && GetTripData();
    }, [tripId, GetTripData])

    return (
        <div className='p-10 md:px-20 lg: px-44 xl:px-56'>
            {/* Information Section */}
            <InfoSection trip={trip}/>
            {/* Recommended hotels */}
            <Hotels trip={trip}/>
            {/* Daily plans */}
            <PlacesToVisit trip={trip}/>
            {/* Footer */}
            <Footer trip={trip}/>
        </div>
    )
}

export default Viewtrip
