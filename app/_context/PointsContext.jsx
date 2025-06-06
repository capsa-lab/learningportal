'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { getAgentByEmail, updateAgentPoints } from '../_services/index';

// Create the PointsContext
export const PointsContext = createContext();

// Provider component for PointsContext
export const PointsProvider = ({ children }) => {
  const [points, setPoints] = useState(0); // Starting points
  const [agent, setAgent] = useState(null); // State to store agent data
  const { user } = useUser(); // Get the current user from Clerk

  // Function to fetch agent data
  const getAgentData = async () => {
    if (user) {
      try {
        const response = await getAgentByEmail(
          user.primaryEmailAddress?.emailAddress
        );
        if (response) {
          const fetchedAgent = response.agent;
          setAgent(fetchedAgent);
          setPoints(fetchedAgent.cumulativePoints || 0); // Initialize points with agent's cumulativePoints
        }
      } catch (error) {
        console.error('Error fetching agent data:', error);
      }
    }
  };

  // Fetch agent data when the user changes
  useEffect(() => {
    getAgentData();
  }, [user]);

  // Add points and update the backend
  const addPoints = async (newPoints) => {
    const updatedPoints = points + newPoints;
    await updateAgentPoints(agent.userEmail, updatedPoints);
    setPoints(updatedPoints);
  };

  // Subtract points and update the backend
  const subtractPoints = async (pointsToSubtract) => {
    const updatedPoints = points - pointsToSubtract;
    await updateAgentPoints(agent.userEmail, updatedPoints);
    setPoints(updatedPoints);
  };

  return (
    <PointsContext.Provider
      value={{ points, addPoints, subtractPoints, agent, setPoints }}
    >
      {children}
    </PointsContext.Provider>
  );
};

export const usePoints = () => useContext(PointsContext);
