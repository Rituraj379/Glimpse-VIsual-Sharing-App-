import { Link, NavLink } from 'react-router-dom';
import { IoHome } from 'react-icons/io5';
import { HiSparkles } from 'react-icons/hi2';

import logo from '../Assets0/logo.png';
import { categories } from '../utils/data';

const isNotActiveStyle =
  'group flex items-center rounded-2xl px-4 py-3 gap-3 text-slate-500 hover:text-slate-900 hover:bg-white/80 transition-all duration-200 ease-in-out capitalize';
const isActiveStyle =
  'group flex items-center rounded-2xl px-4 py-3 gap-3 font-bold bg-[#1f2937] text-white shadow-lg transition-all duration-200 ease-in-out capitalize';

function Sidebar({ user, closeToggle }) {
  const handleCloseSidebar = () => {
    if (closeToggle) {
      closeToggle(false);
    }
  };

  return (
    <div className="glass-panel mx-3 my-3 flex h-[calc(100vh-1.5rem)] w-[258px] flex-col justify-between overflow-y-scroll rounded-[28px] px-3 py-4 hide-scrollbar md:mx-4 md:my-4 md:w-[280px] md:rounded-[32px] md:px-4 md:py-5">
      <div className="flex flex-col">
        <Link to="/" className="flex items-center gap-3 px-2 py-2 md:px-3" onClick={handleCloseSidebar}>
          <div className="rounded-2xl bg-gradient-to-br from-[#ff7a59] via-[#ff4d6d] to-[#d7263d] p-3 shadow-lg">
            <HiSparkles className="text-xl text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Discover</p>
            <img src={logo} alt="logo" className="mt-1 h-9 w-auto object-contain" />
          </div>
        </Link>

        <div className="mt-5 rounded-[24px] bg-white/70 p-3 md:mt-6 md:rounded-[28px] md:p-4">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? isActiveStyle : isNotActiveStyle)}
            onClick={handleCloseSidebar}
          >
            <IoHome />
            Home
          </NavLink>

          <div className="mt-5 md:mt-6">
            <div className="mb-3 px-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Collections</p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">Discover categories</h3>
            </div>
            <div className="flex flex-col gap-1.5">
              {categories.map((category) => (
                <NavLink
                  key={category.name}
                  to={`/category/${category.name}`}
                  className={({ isActive }) => (isActive ? isActiveStyle : isNotActiveStyle)}
                  onClick={handleCloseSidebar}
                >
                  <img src={category.image} className="h-10 w-10 rounded-2xl object-cover shadow-sm" alt={category.name} />
                  <span>{category.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </div>

      {user && (
        <Link
          to={`/user-profile/${user._id}`}
          className="mt-4 flex items-center gap-3 rounded-[22px] bg-[#111827] px-4 py-3.5 text-white shadow-xl md:mt-5 md:rounded-[24px] md:py-4"
          onClick={handleCloseSidebar}
        >
          <img src={user.image} className="h-12 w-12 rounded-2xl object-cover" alt="user-profile" />
          <div className="min-w-0">
            <p className="truncate text-sm text-slate-300">Signed in as</p>
            <p className="truncate font-bold">{user.userName}</p>
          </div>
        </Link>
      )}
    </div>
  );
}

export default Sidebar;
