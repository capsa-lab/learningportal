'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { usePoints } from '../../../_context/PointsContext';
import RewardItem from './_components/RewardItem';
import RewardPopup from './_components/RewardPopup';
import TierFilter from './_components/TierFilter';
import {
  getRewardsList,
  getPurchasedRewardsList,
  recordPurchasedReward,
} from '../../../_services/index';

function Redeem() {
  const [selectedReward, setSelectedReward] = useState(null);
  const [filteredTier, setFilteredTier] = useState('all');
  const { points, agent, subtractPoints } = usePoints();
  const [rewards, setRewards] = useState([]);
  const [purchasedRewards, setPurchasedRewards] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1); // Start at page 1
  const perPage = 8; // Set 8 items per page

  // Fetch rewards and purchased rewards
  const fetchRewards = async () => {
    const rewardsList = await getRewardsList();
    const sortedRewards = rewardsList.sort((a, b) => a.price - b.price);
    setRewards(sortedRewards);
  };

  const fetchPurchasedRewards = async () => {
    const purchased = await getPurchasedRewardsList(agent?.userEmail);
    const sortedPurchased = purchased.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setPurchasedRewards(sortedPurchased);
  };

  useEffect(() => {
    if (agent) {
      fetchRewards();
      fetchPurchasedRewards();
    }
  }, [agent, purchasedRewards]);
  useEffect(() => {
    setCurrentPage(1); // Reset pagination to page 1 when the filteredTier changes
  }, [filteredTier]);

  // Handle selected reward change
  const handleOpenPopup = (reward) => {
    setSelectedReward(reward);
  };

  const handleClosePopup = () => {
    setSelectedReward(null);
  };

  // Filter rewards based on selected tier
  const filteredRewards = useMemo(() => {
    if (filteredTier === 'purchased') {
      return purchasedRewards;
    }

    if (filteredTier === 'all') {
      return rewards;
    }

    return rewards.filter((reward) => reward.rewardTier === filteredTier);
  }, [filteredTier, purchasedRewards, rewards]);

  // Paginate filtered rewards
  const startIndex = (currentPage - 1) * perPage;
  const paginatedRewards = filteredRewards.slice(
    startIndex,
    startIndex + perPage
  );

  // Handle redeem action
  const onRedeem = async (reward, quantity) => {
    const totalCost = reward.price * quantity; //Calculate total cost based on quantity
    console.log('Total Cost:', totalCost); //Log the total cost

    if (points >= totalCost) {
      subtractPoints(totalCost); //Deduct total cost
      handleClosePopup();
      await recordPurchasedReward(agent.userEmail, reward.id, quantity);
      fetchPurchasedRewards();
      alert(
        `You have successfully redeemed: ${reward.name} for ${totalCost} points.`
      );
    } else {
      alert('Insufficient points to redeem this reward.');
    }
  };

  // Create pagination controls
  const totalPages = Math.ceil(filteredRewards.length / perPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="ml-4">
      {/* Page Title*/}
      <h2 className="text-[23px] text-[#1E3A5F] mt-1">Redeem Rewards</h2>
      {agent ? (
        <div>
          {/* Tier Filter */}
          <div className="flex justify-start items-center text-[20px] mt-2 text-gray-600 gap-4">
            <TierFilter selectedTier={setFilteredTier} />{' '}
          </div>

          {/* Display Reward Items */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {paginatedRewards.map((reward) => (
              <RewardItem
                key={reward.id || reward.reward?.id}
                reward={reward.reward || reward}
                rewardStatus={reward.rewardStatus}
                purchasedAt={reward.createdAt}
                quantity={reward.quantity}
                onClose={handleClosePopup}
                onClick={
                  filteredTier !== 'purchased'
                    ? () => handleOpenPopup(reward.reward || reward)
                    : () => {}
                }
                onRedeem={
                  filteredTier !== 'purchased'
                    ? () => onRedeem(reward.reward || reward)
                    : () => {}
                }
                isPurchased={purchasedRewards.some(
                  (purchased) => purchased.id === reward.id
                )}
              />
            ))}
          </div>

          {/* Pagination Bar */}
          <div className="mt-5 flex justify-center items-center">
            <button
              className=" rounded-lg px-5 py-2 text-sm mr-4 w-[120px] bg-[#1E3A5F] text-white hover:bg-gray-600 disabled:opacity-50"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <ul className="flex space-x-2">
              {pageNumbers
                .slice(Math.max(0, currentPage - 3), currentPage + 2)
                .map((pageNumber) => (
                  <li
                    key={pageNumber}
                    className={`cursor-pointer w-9 h-9 flex items-center justify-center text-sm font-semibold rounded-lg transition-transform ${
                      pageNumber === currentPage
                        ? 'bg-[#1E3A5F] text-white'
                        : 'bg-gray-300 text-[#1E3A5F] hover:bg-[#1E3A5F80] hover:text-white'
                    }`}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </li>
                ))}
            </ul>

            <button
              className="px-5 py-2 text-sm ml-4 w-[120px] bg-[#1E3A5F] text-white hover:bg-gray-600 disabled:opacity-50 rounded-lg"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <div></div>
      )}

      {/* Reward Popup */}
      {selectedReward && (
        <RewardPopup
          reward={selectedReward}
          onClose={handleClosePopup}
          onRedeem={onRedeem}
        />
      )}
    </div>
  );
}

export default Redeem;
