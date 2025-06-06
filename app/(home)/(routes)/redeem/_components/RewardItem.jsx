import React from 'react';

const RewardItem = ({
  reward,
  rewardStatus,
  onClick,
  isPurchased,
  purchasedAt,
  quantity,
}) => {
  // Function to format the rewardTier string
  const formatRewardTier = (tier) => {
    if (!tier) return ''; // Return empty if no tier is provided
    const formattedTier = tier.replace(/([a-z])([A-Z])/g, '$1 $2'); // Add space between camelCase
    return `Tier ${formattedTier.charAt(tier.length - 1)}`; // Extract the number from the string
  };

  // Function to format the reward status
  const formatRewardStatus = (status) => {
    if (!status) return '';
    return status
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
  };

  // Function to format the purchased date in 24-hour format without seconds
const formatPurchasedDate = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const formattedDate = date.toLocaleDateString(); 
  const formattedTime = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return `${formattedDate} ${formattedTime}`;
};


  // Determine if the reward should be greyed out (either due to "complete" status or being purchased)
  const isGreyedOut = rewardStatus === 'complete';

  // Calculate the total points spent for purchased rewards
  const totalPointsSpent = reward?.price * (quantity || 1);

  return (
    <div
      className={`border rounded-lg px-3 py-3 bg-white shadow-md hover:shadow-xl hover:border-[#009688] transition-all duration-300 cursor-pointer ${
        isGreyedOut ? 'cursor-default opacity-50 text-gray-500' : 'cursor-pointer'
      }`}
      onClick={() => {
        if (!isGreyedOut) onClick();
      }}
    >
      <img
        src={reward?.image?.url}
        alt={reward?.name}
        width={1000}
        height={500}
        className="rounded-lg"
      />

      {/* Reward Name */}
      <h2 className="text-[13px] text-[#1E3A5F] font-poppins font-medium mt-1 ml-1">
        {reward?.name}
      </h2>

      {/* Reward Details */}
      <div className="flex items-center gap-4 mt-1 font-poppins font-normal ml-1">
        <div className="flex items-center gap-1">
          <span className="h-6 w-6 rounded-full bg-[#00968830] flex items-center justify-center">
            ⭐
          </span>
          <h2 className="text-[13px] font-medium text-yellow-600">
          {isPurchased ? totalPointsSpent : reward?.price} Points
          </h2>
        </div>
      </div>


      {/* Quantity Purchased */}
      {quantity && (
        <p className="text-[12px] text-gray-500 mt-1">
          Quantity Purchased: {quantity}
        </p>
      )}

      {/* Purchase Date - Optional */}
      {purchasedAt && (
        <p className="text-[12px] text-gray-500 mt-1">
          Purchased On: {formatPurchasedDate(purchasedAt)}
        </p>
      )}

      {/* Purchase Status - Optional */}
      {purchasedAt && (
        <p className="text-[12px] text-gray-500 mt-1">
          Status: {formatRewardStatus(rewardStatus)}
        </p>
      )}
    </div>

    
  );
};

export default RewardItem;
