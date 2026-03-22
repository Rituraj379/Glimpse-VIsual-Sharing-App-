import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getPins } from '../utils/api';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

function Feed({ searchTerm = '' }) {
  const [loading, setLoading] = useState(true);
  const [pins, setPins] = useState([]);
  const { categoryId } = useParams();

  useEffect(() => {
    let isMounted = true;

    const fetchPins = async () => {
      try {
        setLoading(true);
        const data = await getPins({
          category: categoryId,
          search: categoryId ? '' : searchTerm.trim(),
        });

        if (isMounted) {
          setPins(data || []);
        }
      } catch (error) {
        console.error('Error fetching pins', error);
        if (isMounted) {
          setPins([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPins();

    return () => {
      isMounted = false;
    };
  }, [categoryId, searchTerm]);

  if (loading) {
    return <Spinner message="We are adding new ideas to your feed!" />;
  }

  if (!pins.length) {
    return (
      <div className="glass-panel mt-3 rounded-[28px] p-8 text-center md:mt-4 md:rounded-[32px] md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Nothing here yet</p>
        <h2 className="mt-3 text-2xl font-bold text-slate-900 md:text-3xl">No pins available</h2>
        <p className="mx-auto mt-3 max-w-xl text-slate-500">
          This category is still empty. Create a fresh pin or switch to another collection to start building your visual feed.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel overflow-hidden rounded-[28px] p-3 md:rounded-[32px] md:p-5">
      <MasonryLayout pins={pins} />
    </div>
  );
}

export default Feed;
