import Masonry from 'react-masonry-css';

import Pin from './Pin';

const breakpointColumnsObj = {
  default: 4,
  3000: 5,
  2000: 4,
  1200: 3,
  1000: 2,
  700: 2,
  500: 1,
};

function MasonryLayout({ pins, onDelete }) {
  if (!Array.isArray(pins) || !pins.length) {
    return <div className="text-center font-bold text-xl mt-2">No Pins Found!</div>;
  }

  return (
    <Masonry
      className="flex w-full animate-slide-fwd"
      breakpointCols={breakpointColumnsObj}
      columnClassName="masonry-column"
    >
      {pins.map((pin) => (
        <Pin key={pin._id} pin={pin} onDelete={onDelete} />
      ))}
    </Masonry>
  );
}

export default MasonryLayout;
