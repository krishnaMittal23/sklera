import React from 'react'

const ChapterList = ({ course }) => {
  const Chapters = course?.courseLayout?.chapters || [];

  return (
    <div className='mt-5'>
      <h2 className='font-medium text-xl'>Chapters</h2>
      <div className='mt-3'>
        {Chapters.length > 0 ? (
          Chapters.map((chapter, index) => (
            <div
              key={index}
              className='flex gap-5 items-center p-4 border shadow-md mb-2 rounded-lg cursor-pointer'
            >
              <h2 className='text-2xl'>•</h2>
              <div>
                <h2 className='font-medium'>{chapter?.name}</h2>
                <p className='text-gray-400 text-sm'>{chapter?.summary}</p>
              </div>
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default ChapterList;
