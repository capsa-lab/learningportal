import React from 'react';
import { PointsProvider } from '../_context/PointsContext';
import { ToastContainer } from 'react-toastify';

function WatchCourseLayout({ children }) {
  return (
    <PointsProvider>
      <ToastContainer />
      <div>{children}</div>
    </PointsProvider>
  );
}

export default WatchCourseLayout;
