import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import { Navbar, Search } from '../components';

const Feed = lazy(() => import('../components/Feed'));
const Pindetail = lazy(() => import('../components/Pindetail'));
const Createpin = lazy(() => import('../components/Createpin'));

function Pins({ user }) {
  const [searchTerm, setSearchTerm] = useState('');
  const scrollRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-w-0 px-1.5 pt-3 md:px-4 md:pt-4" ref={scrollRef}>
      <div>
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} user={user} />
      </div>

      <div className="h-full min-w-0">
        <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Feed searchTerm="" />} />
            <Route path="/category/:categoryId" element={<Feed searchTerm="" />} />
            <Route path="/pin-detail/:pinId" element={<Pindetail user={user} />} />
            <Route path="/create-pin" element={<Createpin user={user} />} />
            <Route path="/search" element={<Search searchTerm={searchTerm} user={user} />} />
            <Route path="*" element={<Feed searchTerm="" />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}

export default Pins;
