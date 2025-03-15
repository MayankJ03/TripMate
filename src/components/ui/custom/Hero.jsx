import React from 'react';
import { Button } from '../button';
import { Link } from 'react-router-dom';
import Footer from '@/view-trip/components/Footer';

function Hero() {
    return (
        <div className="min-h-[calc(100vh-80px)] flex flex-col">
            <div className="flex-1 flex flex-col items-center px-4 sm:px-8 md:px-16 lg:px-24 gap-8 md:gap-10 py-12 md:py-16">
                <div className="text-center max-w-4xl mx-auto">
                    <h1 className="font-extrabold text-4xl sm:text-5xl md:text-6xl leading-tight">
                        <span className="text-[#f56551] block mb-2">
                            Discover Your Next Adventure
                        </span>
                        <span className="text-gray-800">
                            with AI-Powered Travel Planning
                        </span>
                    </h1>
                    <p className="mt-6 text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                        Your personal trip planner and travel curator, creating custom itineraries 
                        tailored to your interests and budget in seconds.
                    </p>
                </div>

                <Link to="/create-trip">
                    <Button className="text-lg px-8 py-6 bg-[#f56551] hover:bg-[#e54535] transition-colors">
                        Start Planning Your Trip
                    </Button>
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-4xl mx-auto">
                    <div className="text-center p-6 rounded-lg border border-gray-200 hover:border-[#f56551] transition-colors">
                        <div className="text-4xl mb-4">🎯</div>
                        <h3 className="font-bold text-xl mb-2">Personalized Plans</h3>
                        <p className="text-gray-600">Customized itineraries based on your preferences</p>
                    </div>
                    <div className="text-center p-6 rounded-lg border border-gray-200 hover:border-[#f56551] transition-colors">
                        <div className="text-4xl mb-4">⚡</div>
                        <h3 className="font-bold text-xl mb-2">Instant Results</h3>
                        <p className="text-gray-600">Get your travel plan in seconds with AI</p>
                    </div>
                    <div className="text-center p-6 rounded-lg border border-gray-200 hover:border-[#f56551] transition-colors">
                        <div className="text-4xl mb-4">💰</div>
                        <h3 className="font-bold text-xl mb-2">Budget Friendly</h3>
                        <p className="text-gray-600">Options for every budget range</p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Hero; 