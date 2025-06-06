'use client';

import React from 'react';
import SearchBar from './SearchBar';
import { UserButton, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { usePoints } from '@/app/_context/PointsContext';
import { Star } from 'lucide-react';

function Header() {
  const { isLoaded, isSignedIn } = useUser(); // Destructure useUser
  const { points, agent } = usePoints(); // Points and agent data, including subtractPoints

  const router = useRouter();

  if (!isLoaded) {
    // Return a loading state while user is being fetched
    return <div>Loading...</div>;
  }

  return (
    <div className="header ml-64 p-6 border-b flex items-center justify-between h-[88px]">
      <SearchBar />
      <div className="flex items-center user-points-avatar">
        <p className="mr-4 flex items-center">
          <Star className="text-[#ffd700ff] mr-1" /> {points}
        </p>
        {!isSignedIn ? (
          <button onClick={() => router.push('/sign-in')}>Login</button> // Show login button if not signed in
        ) : (
          <UserButton /> // Show user button if signed in
        )}
      </div>
    </div>
  );
}

export default Header;
