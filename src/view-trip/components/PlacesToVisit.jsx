import React from 'react'
import PlaceCardItem from './PlaceCardItem';
// const a=4;
function PlacesToVisit({trip}) {
  // Get the days (day1, day2, day3) from itinerary
  const itineraryDays = trip?.tripData?.itinerary || {};
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className='font-medium text-xl mb-4 text-gray-800'>Places to Visit</h2>
      <div className='space-y-6'>
        {Object.keys(itineraryDays).sort().map((day, index) => (
          <div key={index} className='bg-white rounded-lg shadow-sm p-5 border border-gray-100'>
            <div className='mb-3'>
              <h2 className='font-medium text-lg text-gray-700'>{day}</h2>
              <p className='text-sm font-medium text-emerald-600'>Best time to explore: {itineraryDays[day].bestTimeToVisit}</p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              {itineraryDays[day].places?.map((place, placeIndex) => (
                <div key={placeIndex} className='transform transition-all duration-200 hover:scale-[1.01]'>
                  <h2 className='font-medium text-sm text-orange-600 mb-2'>Stop {placeIndex + 1}</h2>
                  <PlaceCardItem place={place}/>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PlacesToVisit 

