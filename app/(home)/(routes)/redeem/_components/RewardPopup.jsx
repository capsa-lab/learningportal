import React, { useEffect, useRef, useState } from 'react';
import emailjs from 'emailjs-com';
import { usePoints } from '@/app/_context/PointsContext';

const RewardPopup = ({ reward, onClose, onRedeem }) => {
  const popupRef = useRef(null);
  const [quantity, setQuantity] = useState(1);
  const [totalCost, setTotalCost] = useState(reward?.price || 0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { points, agent } = usePoints();

  useEffect(() => {
    setTotalCost((reward?.price || 0) * quantity);
  }, [quantity, reward]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleRedeemClick = () => {
    setShowConfirmation(true);
  };

  const confirmRedeem = async () => {
    // Redeem the reward
    onRedeem(reward, quantity);
    let pointsAfterPurchase = points - totalCost;

    // Send the email via EmailJS
    const emailData = {
      rewardName: reward?.name,
      quantity,
      totalCost,
      toEmail: process.env.NEXT_PUBLIC_EMAILJS_TO_EMAIL, // Recipient email
      userPoints: pointsAfterPurchase,
      userEmail: agent?.userEmail,
      firstName: agent?.firstName,
      lastName: agent?.lastName,
      purchaseDate: new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      monthDay: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
      }),
    };

    try {
      // Send the email using EmailJS
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        emailData,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_ID
      );
      console.log('Email sent successfully!');

      setShowConfirmation(false);
      onClose();
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black font-poppins bg-opacity-50 flex justify-center items-center z-50">
      <div ref={popupRef} className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-[17px] font-semibold text-[#009688ff] mb-4">
          {reward?.name}
        </h2>
        <p className="text-[13px] text-gray-700 mb-2">{reward?.description}</p>
        <p className="text-[14px] font-medium text-yellow-600 mb-5 ml-1">
          {reward?.price} Points
        </p>
        <div className="mb-4">
          <h1 className="text-[13px] text-gray-500 mb-1">Select Quantity:</h1>
          <input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, parseInt(e.target.value, 10)))
            }
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#009688ff]"
          />
        </div>
        <p className="text-[13px] font-semibold text-[#1e3a5fff] mb-4">
          Total Cost: {totalCost} Points
        </p>

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-[13px] text-white rounded-md hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleRedeemClick}
            className="px-4 py-2 bg-[#1e3a5fff] text-[13px] text-white rounded-md hover:opacity-80"
          >
            Redeem
          </button>
        </div>

        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
              <h2 className="text-medium font-medium text-[#333333]">
                Confirm Redemption
              </h2>
              <p className="text-[13px] text-gray-600 my-4">
                Are you sure you want to redeem <br />{' '}
                <span className="font-semibold text-[#009688ff]">
                  {reward?.name} - {quantity}x
                </span>{' '}
                for <br />
                <span className="font-semibold text-yellow-600">
                  {' '}
                  {totalCost} Points
                </span>
                ?
              </p>
              <div className="flex justify-center gap-4 text-[13px]">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRedeem}
                  className="px-4 py-2 bg-[#1e3a5fff] text-white rounded-md hover:opacity-80"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardPopup;
