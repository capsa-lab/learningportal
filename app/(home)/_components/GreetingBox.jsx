import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, CloudSun, Moon } from 'lucide-react';

const GreetingBox = ({ agent }) => {
  const [greeting, setGreeting] = useState("");
  const [icon, setIcon] = useState(null);
  const [isVisible, setIsVisible] = useState(false); 

  useEffect(() => {
    checkGreetingDisplay();
  }, []);

  // Function to Check if Greeting Can Be Shown
  const checkGreetingDisplay = () => {
    const lastShown = localStorage.getItem("lastGreetingTime");
    const now = Date.now();

    if (!lastShown || now - lastShown > 3600) { // 1 hour = 3,600,000 ms
      setIsVisible(true);
      localStorage.setItem("lastGreetingTime", now); // save timestamp in localStorage

      // Auto-hide after 6 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 6000);
    }
  };

  // Function to Determine Greeting & Icon Based on Time of Day
  const setDynamicGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      setGreeting("Good morning");
      setIcon(<Sun className="text-[#ffd700ff]" size={20} />);
    } else if (currentHour >= 12 && currentHour < 18) {
      setGreeting("Good afternoon");
      setIcon(<CloudSun className="text-[#ffd700ff]" size={20} />);
    } else {
      setGreeting("Good evening");
      setIcon(<Moon className="text-blue-400" size={20} />);
    }
  };

  useEffect(() => {
    if (isVisible) {
      setDynamicGreeting();
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="absolute top-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -50 }}
          transition={{ 
            duration: 0.8, 
            ease: "easeInOut", 
            delay: 0.3 
          }}
        >
          <motion.div 
            className="text-white shadow-md py-2 px-4 rounded-md inline-flex items-center gap-2 border border-gray-100"
            style={{
              background: "linear-gradient(90deg, #009688 0%, #1e3a5f 100%)",
            }}
          >
            {/* Greeting Text */}
            <h2 className="text-[14px] font-dmsans font-medium">
              {agent?.firstName ? `${greeting}, ${agent.firstName}!` : `${greeting}!`}
            </h2>

            {/* Animated Icon */}
            <motion.div 
              initial={{ y: -5 }}
              animate={{ y: 5 }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.2, 
                repeatType: "reverse", 
                ease: "easeInOut" 
              }}
            >
              {icon}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GreetingBox;
