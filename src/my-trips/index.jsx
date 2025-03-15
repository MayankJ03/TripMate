import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../service/firebaseConfig';
import UserTripCardItem from './components/UserTripCardItem';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { Skeleton } from "../components/ui/skeleton"; // Updated import path

function MyTrips() {
    const navigate = useNavigate();
    const [userTrips, setUserTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        GetUserTrips();
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem('user');
        toast('You have been signed out.');
        navigate('/');
    };

    const GetUserTrips = async () => {
        setLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                navigate('/');
                return;
            }
            setUserTrips([]);

            const q = query(collection(db, "AITrips"), where("userEmail", "==", user?.email));
            const querySnapshot = await getDocs(q);
            const trips = [];
            querySnapshot.forEach((doc) => {
                trips.push({ ...doc.data(), id: doc.id });
            });
            setUserTrips(trips);
        } catch (error) {
            console.error("Error fetching trips:", error);
            toast.error("Failed to load trips");
        } finally {
            setLoading(false);
        }
    }

    // Skeleton loading component
    const TripCardSkeleton = () => (
        <div className="border rounded-lg p-4 space-y-4">
            <Skeleton className="h-[200px] w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <div className="space-y-2">
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
            </div>
        </div>
    );

    return (
        <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
            <div className="flex justify-between items-center mb-8">
                <h2 className='font-bold text-3xl'>My Trips</h2>
                <div className="flex gap-4">
                    <Button
                        onClick={() => navigate('/create-trip')}
                        className="bg-[#f56551] hover:bg-[#e54535] text-white transition-colors"
                    >
                        Create Trip
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleSignOut}
                        className="text-sm hover:bg-red-500 hover:text-white transition-colors"
                    >
                        Sign Out
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((index) => (
                        <TripCardSkeleton key={index} />
                    ))}
                </div>
            ) : userTrips?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {userTrips.map((trip, index) => (
                        <UserTripCardItem 
                            key={trip.id || index} 
                            trip={trip}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10">
                    <p className="text-gray-500 text-lg">No trips found</p>
                </div>
            )}
        </div>
    );
}

export default MyTrips;