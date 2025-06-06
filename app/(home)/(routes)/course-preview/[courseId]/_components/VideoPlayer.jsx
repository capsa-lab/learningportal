import React from 'react';

function VideoPlayer({ videoUrl, courseName }) {
  return (
    <div className="border rounded-lg p-3">
      <h2 className="text-[#1E3A5F] font-semibold mb-3 uppercase">{courseName}</h2>
      <div
        className="video-container"
        style={{
          position: 'relative',
          paddingBottom: '56.25%',
          height: 0,
          overflow: 'hidden',
          maxWidth: '100%',
          background: '#000',
        }}
      >
        <iframe
          width="100%"
          height="100%"
          style={{ position: 'absolute', top: 0, left: 0 }}
          src={videoUrl} // Directly using the embed URL passed as a prop
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

export default VideoPlayer;
