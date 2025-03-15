import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button";
import { IoIosSend } from "react-icons/io";
import axios from 'axios';

function InfoSection({ trip }) {
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        trip && GetPlacePhoto();
    }, [trip]);

    const GetPlacePhoto = async () => {
        const apiKey = '49351436-84fdc946648a30862fdebf9a9';
        const query = trip?.userSelection?.location?.label;
        const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo`;

        try {
            const response = await axios.get(url);
            setPhotos(response.data.hits);
            console.log(response.data.hits);
        } catch (error) {
            console.error('Error fetching photos:', error);
        }
    };

    const shareOnWhatsApp = () => {
        let message = `Check out my ${trip?.userSelection?.noOfDays}-day trip to ${trip?.userSelection?.location?.label}! 🌍✈️\n\n`;
        message += `🎯 Budget: ${trip?.userSelection?.budget}\n`;
        message += `👥 Travelers: ${trip?.userSelection?.traveler}\n\n`;
        
        if (trip?.tripData?.itinerary) {
            message += "📍 Itinerary Highlights:\n";
            Object.entries(trip.tripData.itinerary).forEach(([day, places]) => {
                if (Array.isArray(places)) {
                    message += `\nDay ${day}:\n`;
                    places.forEach(place => {
                        message += `• ${place.placeName} (${place.time})\n`;
                    });
                }
            });
        }
        
        message += "\nPlan your trip now at: plan-go-jade.vercel.app";

        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const renderItinerary = () => {
        if (!trip?.tripData?.itinerary) return null;

        return Object.entries(trip.tripData.itinerary).map(([day, places]) => {
            if (!Array.isArray(places)) return null;
            
            return (
                <div key={day} className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">Day {day}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {places.map((place, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                <div className="relative h-48">
                                    <img 
                                        src={photos[index % photos.length]?.webformatURL || '/placeholder.jpg'} 
                                        className="h-full w-full object-cover"
                                        alt={place.placeName}
                                        onError={(e) => {
                                            e.target.src = '/placeholder.jpg';
                                        }}
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                        <h4 className="font-semibold text-lg text-white">{place.placeName}</h4>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                                        <span className="font-medium">🕒</span>
                                        <span>{place.time}</span>
                                    </div>
                                    {place.bestTimeToVisit && (
                                        <div className="flex items-center gap-2 text-emerald-600 text-sm">
                                            <span className="font-medium">✨</span>
                                            <span>Best time: {place.bestTimeToVisit}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        });
    };

    return (
        <div className="space-y-6">
            {/* Hero section with main image */}
            <div className="relative rounded-xl overflow-hidden">
                <img 
                    src={photos[0]?.webformatURL || '/placeholder.jpg'} 
                    className="h-[340px] w-full object-cover"
                    alt={trip?.userSelection?.location?.label}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                    <h2 className="font-bold text-3xl text-white mb-3">{trip?.userSelection?.location?.label}</h2>
                    <div className="flex flex-wrap gap-3">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm">
                            📅 {trip?.userSelection?.noOfDays} Days
                        </span>
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm">
                            💰 {trip?.userSelection?.budget}
                        </span>
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm">
                            👥 {trip?.userSelection?.traveler} Travelers
                        </span>
                    </div>
                </div>
                <Button 
                    onClick={shareOnWhatsApp} 
                    className="absolute top-4 right-4 rounded-full p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30"
                >
                    <IoIosSend className="h-5 w-5 text-white" />
                </Button>
            </div>

            {/* Itinerary section */}
            <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6">Your Itinerary</h2>
                {renderItinerary()}
            </div>
        </div>
    );
}

export default InfoSection;