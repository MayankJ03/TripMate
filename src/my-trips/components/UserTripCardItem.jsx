import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UserTripCardItem({ trip }) {
    const [placeImage, setPlaceImage] = useState(null);
    const navigate = useNavigate();

    const fetchPlacePhoto = async () => {
        const apiKey = '49351436-84fdc946648a30862fdebf9a9';
        const query = trip?.userSelection?.location?.label || 'travel';
        const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo`;

        try {
            const response = await axios.get(url);
            if (response.data.hits.length > 0) {
                setPlaceImage(response.data.hits[0].webformatURL);
            }
        } catch (error) {
            console.error('Error fetching photo:', error);
        }
    };

    useEffect(() => {
        if (trip?.userSelection?.location?.label) {
            fetchPlacePhoto();
        }
    }, [trip?.userSelection?.location?.label]);

    return (
        
        <div 
            className="bg-white rounded-xl overflow-hidden shadow hover:shadow-md transition-all cursor-pointer"
            onClick={() => navigate(`/view-trip/${trip.id}`)}
        >
            {/* Image */}
            <div className="w-full h-[160px]">
                <img 
                    src={placeImage || '/placeholder.jpg'}
                    className="w-full h-full object-cover"
                    alt={trip?.userSelection?.location?.label}
                    onError={(e) => {
                        e.target.src = '/placeholder.jpg';
                        e.target.onerror = null;
                    }}
                />
            </div>

            {/* Content */}
            <div className="p-4">
                <h2 className="font-bold text-lg mb-3 truncate">
                    {trip?.userSelection?.location?.label || 'Unnamed Location'}
                </h2>
                
                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                        <span>📅</span>
                        <span>{trip?.userSelection?.noOfDays} Days</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span>💰</span>
                        <span>{trip?.userSelection?.budget}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span>👥</span>
                        <span>{trip?.userSelection?.traveler}</span>
                    </div>
                </div>
            </div>
        </div>
        
    );
}

export default UserTripCardItem;