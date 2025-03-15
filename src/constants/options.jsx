export const SelectTravelList = [
    {
        id: 1,
        title: 'Solo Trip',
        desc: 'Travel alone and explore at your own pace.',
        icon: '🦅',
        people: '1 person'
    },
    {
        id: 2,
        title: 'Couple Trip',
        desc: 'A trip for two, perfect for shared experiences.',
        icon: '🥂',
        people: '2 people'
    },
    {
        id: 3,
        title: 'Family Trip',
        desc: 'A vacation suited for families with shared activities.',
        icon: '🏡',
        people: '3 to 5 people'
    },
    {
        id: 4,
        title: 'Friends’ Trip',
        desc: 'A group trip for fun and adventure.',
        icon: '🍻',
        people: '5 to 10 people'
    }
];

export const SelectBudgetOptions = [
    {
        id: 1,
        title: 'Budget',
        desc: 'Cost-effective travel with essential experiences.',
        icon: '💵'
    },
    {
        id: 2,
        title: 'Standard',
        desc: 'A balanced option with comfort and affordability.',
        icon: '💰'
    },
    {
        id: 3,
        title: 'Luxury',
        desc: 'A high-end travel experience with premium options.',
        icon: '💸'
    }
];

export const AI_PROMPT='Generate Travel Plan for Location : {location} for {totalDays} Days for {traveler} with a {budget} budget, Give me a Hotels options list with HotelName,Hotel address,Price, hotel image url,geo coordinates,rating,descriptions and suggest itinerary with placeName,Place Details,Place Image Url, Geo Coordinates,ticket Pricing,rating,Time travel each of the location for {totalDays} days with each day plan with best time to visit in JSON format.'