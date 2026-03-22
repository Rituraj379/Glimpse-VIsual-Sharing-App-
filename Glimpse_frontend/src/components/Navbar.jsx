import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdAdd, IoMdSearch } from 'react-icons/io';
import { isGuestUser } from '../utils/fetchuser';

function Navbar({ searchTerm, setSearchTerm, user }) {
  const navigate = useNavigate();
  const avatarFallback = 'https://api.dicebear.com/9.x/initials/svg?seed=Glimpse';
  const guest = isGuestUser(user);

  return (
    <div className="glass-panel sticky top-3 z-10 mb-5 flex w-full items-center gap-3 rounded-[24px] px-3 py-3 md:mb-7 md:rounded-[28px] md:px-5 md:py-4">
      <div className="flex min-w-0 flex-1 items-center rounded-2xl bg-white/90 px-3 py-2.5 shadow-sm ring-1 ring-black/5 md:px-4 md:py-3">
        <IoMdSearch fontSize={21} className="mr-2 text-slate-500" />
        <input
          type="text"
          placeholder="Search ideas, moodboards, styles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => navigate('/search')}
          className="w-full bg-transparent text-[15px] outline-none placeholder:text-slate-400"
        />
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        {guest ? <span className="hidden rounded-full bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-800 md:inline-flex">Guest mode</span> : null}
        <Link to={user?._id ? `/user-profile/${user._id}` : '/login'} className="block">
          <img
            src={user?.image || avatarFallback}
            alt="user profile"
            className="h-11 w-11 rounded-2xl object-cover ring-2 ring-white shadow-md md:h-12 md:w-12"
          />
        </Link>
        <Link
          to={user?._id && !guest ? '/create-pin' : '/login'}
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111827] text-white shadow-lg transition hover:scale-[1.03] hover:bg-black md:h-12 md:w-14"
          title={guest ? 'Sign in with Google to create pins' : 'Create pin'}
        >
          <IoMdAdd />
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
