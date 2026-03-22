import React from 'react';
import { ClipLoader } from 'react-spinners';

function Spinner({ message = "Loading..." }) {
  return (
    <div className='flex flex-col justify-center items-center w-full h-full'>
      <ClipLoader
        size={50}
        color="#00BFFF"
      />
      <p className='text-lg text-gray-500 mt-4'>{message}</p>
    </div>
  );
}

export default Spinner;
