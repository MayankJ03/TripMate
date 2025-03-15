import React, { useState, useEffect } from 'react'
import { FaMapLocation } from "react-icons/fa6";
import { Button } from '@/components/ui/button';
import axios from 'axios';

function PlaceCardItem({ place }) {
  const [placeImage, setPlaceImage] = useState(null);

  const handleViewMap = () => {
    const googleMapsUrl = `https://www.google.com/maps?q=${place.placeName}`;
    window.open(googleMapsUrl, '_blank');
  };

  const fetchPlacePhoto = async () => {
    const apiKey = '49351436-84fdc946648a30862fdebf9a9';
    const query = place.placeName;
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
    fetchPlacePhoto();
  }, [place.placeName]);

  return (
    <div className='border rounded-xl p-3 mt-2 flex gap-5 hover:scale-105 transition-all hover:shadow-md cursor-pointer'>
      <img 
        src={placeImage || '/placeholder.jpg'}
        className='w-[130px] h-[130px] rounded-xl object-cover'
        alt={place.placeName}
        onError={(e) => {
          e.target.src = '/placeholder.jpg';
        }}
      />
      <div className='flex-1'>
        <h2 className='font-bold text-lg'>{place.placeName}</h2>
        <p className='text-sm text-gray-400 line-clamp-2'>{place.placeDetails}</p>
        <h2 className='mt-2 text-sm text-gray-600'>🕗 {place.timeToTravel}</h2>
        <Button 
          className='mt-2' 
          variant="outline" 
          size="sm"
          onClick={handleViewMap}
        >
          <FaMapLocation className='mr-2' /> View on Map
        </Button>
      </div>
    </div>
  )
}

export default PlaceCardItem