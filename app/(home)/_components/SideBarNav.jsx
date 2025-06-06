'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Book, BookCheck, Gift, BadgeHelp } from 'lucide-react';

function SideBarNav({ handleStartTutorial, pathname }) {
  const router = useRouter();

  const menuList = [
    { id: 1, name: 'All Courses', icon: Book, path: '/browse', className: 'sidebar-all-courses' },
    { id: 2, name: 'My Courses', icon: BookCheck, path: '/dashboard', className: 'my-courses' },
    { id: 3, name: 'Redeem', icon: Gift, path: '/redeem', className: 'redeem' },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (index, path, isExternal) => {
    setActiveIndex(index);
    if (isExternal) {
      window.open(path, '_blank');
    } else {
      router.push(path);
    }
  };

  return (
    <div className="sidebar h-full bg-white border-r flex flex-col overflow-y-auto shadow-md">
      {/* Logo Section */}
      <div
        className="p-6 border-b cursor-pointer flex justify-center items-center h-[88px]"
        onClick={() => router.push('/browse')}
      >
        <div className="relative w-full h-full">
          <Image src="/logo.png" alt="logo" fill className="object-contain" />
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col mt-3 flex-1">
        {menuList.map((item, index) => (
          <div
            key={item.id}
            className={`group flex gap-3 items-center p-4 px-6 cursor-pointer transition duration-300 ease-in-out ${
              pathname === item.path
                ? 'text-[#1e3a5fff] bg-[#7195c583] border-[#1e3a5fff] border-l-4 shadow-md'
                : 'text-[#1e3a5fff] hover:bg-[#f5f5f5]'
            } ${item.className}`}
            onClick={() => handleClick(index, item.path, item.external)}
          >
            <div className={`h-10 w-10 flex items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110 ${
              pathname === item.path ? 'bg-[#1e3a5fff]' : 'bg-[#7195c583]'
            }`}>
              <item.icon size={20} className={`${pathname === item.path ? 'text-[#fff]' : 'text-[#1e3a5fff]'}`} />
            </div>

            <h2>{item.name}</h2>
          </div>
        ))}
      </div>

      {/* Tutorial Button */}
      {pathname === '/browse' && (
        <div className="mt-auto p-4">
          <button
            onClick={handleStartTutorial}
            className="w-full flex items-center justify-center gap-2 text-[#1e3a5fff] text-[14px] bg-[#f5f5f5] py-3 rounded-lg transition duration-200 hover:bg-[#e2e2e2]"
          >
            <BadgeHelp size={16} />
            Run Tutorial
          </button>
        </div>
      )}
    </div>
  );
}

export default SideBarNav;
