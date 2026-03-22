import { useEffect, useState } from 'react';

import { getPins } from '../utils/api';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

function Search({ searchTerm }) {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        const data = await getPins({ search: searchTerm.trim() });
        if (isMounted) {
          setPins(data || []);
        }
      } catch (error) {
        console.error('Error searching pins', error);
        if (isMounted) {
          setPins([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSearchResults();

    return () => {
      isMounted = false;
    };
  }, [searchTerm]);

  return (
    <div className="w-full">
      {loading && <Spinner message="Searching for Pins" />}
      {!loading && pins.length > 0 && (
        <div className="glass-panel overflow-hidden rounded-[28px] p-3 md:rounded-[32px] md:p-5">
          <MasonryLayout pins={pins} />
        </div>
      )}
      {!loading && pins.length === 0 && searchTerm !== '' && (
        <div className="glass-panel mt-3 rounded-[28px] p-8 text-center md:mt-4 md:rounded-[32px] md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Search</p>
          <div className="mt-3 text-2xl font-bold text-slate-900">No pins found for "{searchTerm}"</div>
        </div>
      )}
    </div>
  );
}

export default Search;
