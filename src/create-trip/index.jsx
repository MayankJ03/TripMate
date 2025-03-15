import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import React, { useState, useEffect } from 'react';
import { Input } from '../components/ui/input';
import { AI_PROMPT, SelectBudgetOptions, SelectTravelList } from '../constants/options';
import { Button } from '../components/ui/button';
import { Toaster } from 'sonner';
import { toast } from 'sonner';
import { chatSession } from '../service/AIModal';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../service/firebaseConfig';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';

function CreateTrip() {
  const [place, setPlace] = useState(null);
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mapsLoaded, setMapsLoaded] = useState(false);

  const navigate=useNavigate();

  const resetForm = () => {
    setPlace(null);
    setFormData({});
  };

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    // Load Google Maps script
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapsLoaded(true);
      document.head.appendChild(script);
    } else {
      setMapsLoaded(true);
    }
  }, []);

  const login = useGoogleLogin({
    onSuccess: (tokenInfo) => GetUserProfile(tokenInfo),
    onError: (error) => console.error("Google Login Error:", error)
  });

  const GetUserProfile = (tokenInfo) => {
    axios
      .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
        headers: {
          Authorization: `Bearer ${tokenInfo?.access_token}`,
          Accept: "application/json",
        },
      })
      .then((resp) => {
        console.log(resp);
        localStorage.setItem("user", JSON.stringify(resp.data));
        setUser(resp.data);
        console.log("Closing dialog");
        setOpenDialog(false); // Close the dialog
        OnGenerateTrip(); // Continue with trip generation
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
        toast.error("Failed to sign in. Please try again.");
      });
  };

  const OnGenerateTrip = async () => {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      setOpenDialog(true);
      return;
    }

    const days = parseInt(formData?.noOfDays, 10);
    if (!days || days > 5 || !formData?.location || !formData?.budget || !formData?.traveler) {
      toast("Please fill all details");
      return;
    }
    setLoading(true);

    const FINAL_PROMPT = AI_PROMPT
      .replace('{location}', formData?.location?.label)
      .replace('{totalDays}', formData?.noOfDays)
      .replace('{traveler}', formData?.traveler)
      .replace('{budget}', formData?.budget)
      .replace('{totalDays}', formData?.noOfDays);

    console.log(FINAL_PROMPT);
    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      console.log(result?.response?.text());
      toast.success("Trip generated successfully!");
      if (result?.response?.text()) {
        await SaveAiTrip(result.response.text());
      }
    } catch (error) {
      console.error("Error generating trip:", error);
      toast.error("Failed to generate trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const SaveAiTrip = async(TripData) => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      const docId = Date.now().toString();

      await setDoc(doc(db, "AITrips", docId), {
        userSelection: formData,
        tripData: JSON.parse(TripData),
        userEmail: user.email,
        id: docId
      });
      toast.success("Trip saved successfully!");
      navigate('/view-trip/'+docId);
    } catch (error) {
      console.error("Error saving trip:", error);
      toast.error("Failed to save trip. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Toaster />
      <div className='sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10'>
        <h2 className='font-bold text-3xl'>Tell us your travel preferences 🏕️🌴</h2>
        <p className='mt-3 text-gray-500 text-xl'>Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.</p>
        <div className='mt-20 flex flex-col gap-10'>
          <div>
            <h2 className='text-xl my-3 font-medium'>What is your destination of choice?</h2>
            {mapsLoaded ? (
              <GooglePlacesAutocomplete
                apiKey={import.meta.env.VITE_GOOGLE_PLACES_API_KEY}
                selectProps={{
                  value: place,
                  onChange: (v) => { setPlace(v); handleInputChange('location', v) }
                }}
                onLoadFailed={(error) => {
                  console.error("Google Places API failed to load:", error);
                  toast.error("Failed to load location suggestions. Please try again later.");
                }}
              />
            ) : (
              <div className="flex items-center justify-center p-4 bg-gray-100 rounded">
                <AiOutlineLoading3Quarters className="h-5 w-5 animate-spin mr-2" />
                <span>Loading location search...</span>
              </div>
            )}
          </div>

          <div>
            <h2 className='text-xl my-3 font-medium'>How many days are you planning your trip?</h2>
            <Input
              placeholder={'Ex. 3'}
              type="number"
              min="1"
              max="5"
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value >= 1 && value <= 5) {
                  handleInputChange('noOfDays', value);
                }
              }}
            />
          </div>
        </div>
        <div>
          <h2 className='text-xl my-3 font-medium'>What is your Budget?</h2>
          <div className='grid grid-cols-3 gap-5 mt-5'>
            {SelectBudgetOptions.map((item, index) => (
              <div key={index}
                onClick={() => handleInputChange('budget', item.title)}
                className={`p-4 border cursor-pointer
              rounded-lg hover:shadow-lg 
              ${formData?.budget === item.title && 'shadow-lg border-black'}
              `}>
                <h2 className='text-4xl'>{item.icon}</h2>
                <h2 className='font-bold text-lg'>{item.title}</h2>
                <h2 className='text-sm text-gray-500'>{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className='text-xl my-3 font-medium'>Who do you plan to travel with on your next adventure?</h2>
          <div className='grid grid-cols-3 gap-5 mt-5'>
            {SelectTravelList.map((item, index) => (
              <div key={index}
                onClick={() => handleInputChange('traveler', item.people)}
                className={`p-4 border cursor-pointer rounded-lg
             hover:shadow-lg
             ${formData?.traveler === item.people && 'shadow-lg border-black'}
             `}>
                <h2 className='text-4xl'>{item.icon}</h2>
                <h2 className='font-bold text-lg'>{item.title}</h2>
                <h2 className='text-sm text-gray-500'>{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>
        <div className='my-10 justify-end flex'>
          <Button disabled={loading} onClick={OnGenerateTrip}>
            {loading ? (
              <div className="flex items-center gap-2">
                <AiOutlineLoading3Quarters className='h-5 w-5 animate-spin'/>
                <span>Generating...</span>
              </div>
            ) : (
              'Generate Trip'
            )}
          </Button>
        </div>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sign in</DialogTitle>
              <DialogDescription>
                You need to sign in to generate a trip.
              </DialogDescription>
            </DialogHeader>
            <div className="justify-center flex flex-col items-center mt-4">
              <Button
                disabled={loading}
                onClick={() => login()} 
                variant="outline">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <AiOutlineLoading3Quarters className='h-5 w-5 animate-spin'/>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <>
                    <FcGoogle className="h-7 w-7 mr-2" />
                    Sign in with Google
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}

export default CreateTrip