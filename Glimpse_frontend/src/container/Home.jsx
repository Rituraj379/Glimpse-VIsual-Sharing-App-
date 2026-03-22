import { useEffect, useRef, useState } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';
import { HiMenu } from 'react-icons/hi';
import { Link, Route, Routes } from 'react-router-dom';

import { Chatbot, Sidebar, UserProfile } from '../components';
import logo from '../Assets0/logo.png';
import { ensureUserExists, getUser } from '../utils/api';
import { fetchUser, persistUser } from '../utils/fetchuser';
import Pins from './Pins';

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState(() => fetchUser());
  const scrollRef = useRef(null);

  useEffect(() => {
    const loadUser = async () => {
      const localUser = fetchUser();

      if (!localUser?._id) {
        return;
      }

      try {
        const profile = await getUser(localUser._id);
        const resolvedProfile = localUser.isGuest ? { ...profile, isGuest: true } : profile;
        setUser(resolvedProfile);
        persistUser(resolvedProfile);
      } catch (error) {
        console.error('Error fetching user', error);
        if (error.status === 404) {
          try {
            const restoredUser = await ensureUserExists({
              googleId: localUser.googleId || localUser._id,
              userName: localUser.userName,
              image: localUser.image,
            });

            if (restoredUser) {
              setUser(restoredUser);
              persistUser(restoredUser);
              return;
            }
          } catch (restoreError) {
            console.error('Error restoring missing user', restoreError);
          }
        }

        setUser(localUser);
        persistUser(localUser);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, []);

  return (
    <div className="app-shell flex min-h-screen flex-col md:flex-row">
      <div className="hidden md:flex md:flex-initial">
        <Sidebar user={user} />
      </div>

      <div className="flex flex-row md:hidden">
        <div className="glass-panel m-3 flex w-full flex-row items-center justify-between rounded-[24px] px-3 py-3">
          <HiMenu fontSize={40} className="cursor-pointer" onClick={() => setToggleSidebar(true)} />
          <Link to="/">
            <img src={logo} alt="logo" className="h-9 w-auto object-contain" />
          </Link>
          <Link to={`/user-profile/${user?._id}`}>
            <img
              src={user?.image || 'https://i.stack.imgur.com/l60Hf.png'}
              alt="user-pic"
              className="h-10 w-10 rounded-2xl object-cover"
            />
          </Link>
        </div>

        {toggleSidebar && (
          <div className="fixed inset-y-0 left-0 z-20 w-[88%] animate-slide-in overflow-y-auto">
            <div className="absolute right-6 top-6 z-30 flex items-center justify-end">
              <AiFillCloseCircle fontSize={30} className="cursor-pointer" onClick={() => setToggleSidebar(false)} />
            </div>
            <Sidebar closeToggle={setToggleSidebar} user={user} />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 overflow-y-auto px-3 pb-3 md:px-4 md:pb-4" ref={scrollRef}>
        <Routes>
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          <Route path="/*" element={<Pins user={user} />} />
        </Routes>
      </div>

      <Chatbot />
    </div>
  );
};

export default Home;
