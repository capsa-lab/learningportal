'use client';

import React, { useState, useEffect } from 'react';
import { SearchProvider } from '../../_context/SearchContext';
import SideBarNav from '../_components/SideBarNav';
import Header from '../_components/Header';
import { PointsProvider } from '@/app/_context/PointsContext';
import Joyride from 'react-joyride';
import { usePathname } from 'next/navigation';

function HomeLayout({ children }) {
  const [isClient, setIsClient] = useState(false);
  const [runTutorial, setRunTutorial] = useState(false);
  const pathname = usePathname();

  const steps = [
    {
      target: '.sidebar',
      content: `👋 Welcome aboard! 
              Here, you can access different sections of the Training Hub. 
              Click on any section to explore!`,
      placement: 'right',
    },
    {
      target: '.sidebar-all-courses',
      placement: 'right',
      content: `📚 Looking to start learning? 
              Click here to explore all available training courses!`,
    },
    {
      target: '.my-courses',
      placement: 'right',
      content: `📌 This is your dashboard! You can view your enrolled courses and see your progress here.`,
    },
    {
      target: '.redeem',
      placement: 'right',
      content: `🎁 Check out the rewards section to see what rewards you can redeem with your points!`,
    },
    {
      target: '.search-bar',
      content: `🔎 Use the search bar to quickly find the training courses you need.`,
    },
    {
      target: '.user-points-avatar',
      content: `⭐ Here you can view your points earned and access profile settings via your avatar.`,
    },
    {
      target: '.category-filter',
      content: `🎯 Looking for specific topics? Use these category filters to narrow down your search. `,
    },
    {
      target: '.course-list',
      content: `📚 Here you'll find the list of available courses. 
              Click on a course to see more information!`,
    },
    {
      target: 'body',
      placement: 'center',
      content: `🎉 You're all set!  
            Dive in, explore, and make the most of your learning journey.  
            Good luck—you're going to do great! 🚀`,
    },
  ];

  // Prevent hydration issues by setting a client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setRunTutorial(false); // Ensure tutorial doesn't start on load
  }, [pathname]);

  const handleStartTutorial = () => {
    setRunTutorial(true);
  };

  if (!isClient) {
    return null;
  }

  return (
    <PointsProvider>
      <SearchProvider>
        <div>
          <Joyride
            steps={steps}
            continuous
            scrollToFirstStep
            showProgress
            run={runTutorial}
            callback={({ status }) => {
              if (status === 'finished' || status === 'skipped') {
                setRunTutorial(false);
              }
            }}
            styles={{
              options: {
                arrowColor: '#ffffff',
                backgroundColor: '#ffffff',
                textColor: '#333333',
                overlayColor: 'rgba(0, 0, 0, 0.6)',
                primaryColor: '#1E3A5F',
                width: 350,
                zIndex: 1000,
              },
              tooltip: {
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0px 50px 35px rgba(0, 0, 0, 0.25)',
                border: '2px solid #1E3A5F',
              },
              tooltipContent: {
                fontFamily: '"Inter", sans-serif',
                fontSize: '15px',
                fontWeight: '500',
                color: '#333333',
                lineHeight: '1.6',
              },
              tooltipFooter: {
                display: 'flex',
                justifyContent: 'space-between',
              },
            }}
            locale={{ back: '← Previous', next: 'Next' }}
          />

          <div className="h-full w-64 flex flex-col fixed inset-y-0 z-50 sidebar">
            <SideBarNav
              handleStartTutorial={handleStartTutorial}
              pathname={pathname}
            />
          </div>
          <Header />
          <div className="ml-64 p-5">{children}</div>
        </div>
      </SearchProvider>
    </PointsProvider>
  );
}

export default HomeLayout;
