import React, { useEffect, useState } from 'react';
import { Button } from '../button';
import { FcGoogle } from 'react-icons/fc';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

function Header() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => getUserProfile(codeResponse),
        onError: (error) => console.log('Login Failed:', error),
    });

    const getUserProfile = async (tokenInfo) => {
        try {
            const response = await axios.get(
                `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
                {
                    headers: {
                        Authorization: `Bearer ${tokenInfo?.access_token}`,
                        Accept: 'Application/json',
                    },
                }
            );
            localStorage.setItem('user', JSON.stringify(response.data));
            setUser(response.data);
            toast.success('Signed in successfully!');
        } catch (error) {
            console.error('Error fetching user profile:', error);
            toast.error('Failed to sign in. Please try again.');
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem('user');
        setUser(null);
        toast('You have been signed out.');
        navigate('/');
    };

    return (
        <div className="p-4 shadow-md flex flex-wrap justify-between items-center px-6 md:px-8 lg:px-12 bg-white">
            <div 
                className="flex items-center gap-2 cursor-pointer" 
                onClick={() => navigate('/')}
            >
                <h1 className="text-xl md:text-2xl font-bold text-[#f56551]">TripMate</h1>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
                {user ? (
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">
                                Welcome, {user.name}
                            </span>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/create-trip')}
                            className="text-sm rounded-full hover:bg-[#f56551] hover:text-white transition-colors"
                        >
                            Create Trip
                        </Button>
                        <a href='/my-trips'>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/my-trips')}
                            className="text-sm rounded-full hover:bg-[#f56551] hover:text-white transition-colors"
                        >
                            My Trips
                        </Button>
                        </a>
                        <Button
                            variant="outline"
                            onClick={handleSignOut}
                            className="text-sm hover:bg-red-500 hover:text-white transition-colors"
                        >
                            Sign Out
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="outline"
                        onClick={() => login()}
                        className="flex items-center gap-2 text-sm hover:bg-[#f56551] hover:text-white transition-colors"
                    >
                        <FcGoogle className="h-5 w-5" />
                        Sign In with Google
                    </Button>
                )}
            </div>
        </div>
    );
}

export default Header; 