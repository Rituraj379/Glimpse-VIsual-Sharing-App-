import { useEffect, useState } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { HiSparkles } from 'react-icons/hi2';
import { useNavigate, useParams } from 'react-router-dom';

import { ensureUserExists, getUser, getUserCreatedPins, getUserSavedPins } from '../utils/api';
import { fetchUser, persistUser } from '../utils/fetchuser';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const randomImage = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80';

const activeBtnStyle =
  'rounded-full bg-[#111827] px-5 py-3 text-sm font-bold text-white shadow-lg transition';
const notActiveBtnStyle =
  'rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-600 ring-1 ring-black/5 transition hover:bg-slate-50';

function Userprofile() {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState([]);
  const [activeBtn, setActiveBtn] = useState('created');
  const navigate = useNavigate();
  const { userId } = useParams();
  const loggedInUser = fetchUser();
  const [profileResolved, setProfileResolved] = useState(false);

  const handleLogout = () => {
    persistUser(null);
    navigate('/', { replace: true });
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getUser(userId);
        setUser(profile);
      } catch (error) {
        console.error('Error fetching user', error);

        if (error.status === 404 && loggedInUser?._id === userId) {
          try {
            const restoredUser = await ensureUserExists({
              googleId: loggedInUser.googleId || loggedInUser._id,
              userName: loggedInUser.userName,
              image: loggedInUser.image,
            });

            if (restoredUser) {
              setUser(restoredUser);
              persistUser(restoredUser);
            }
          } catch (restoreError) {
            console.error('Error restoring missing profile', restoreError);
          }
        }
      } finally {
        setProfileResolved(true);
      }
    };

    fetchProfile();
  }, [loggedInUser?._id, loggedInUser?.googleId, loggedInUser?.image, loggedInUser?.userName, userId]);

  useEffect(() => {
    const fetchPins = async () => {
      if (!profileResolved) {
        return;
      }

      try {
        const data = activeBtn === 'created' ? await getUserCreatedPins(userId) : await getUserSavedPins(userId);
        setPins(data || []);
      } catch (error) {
        console.error('Error fetching user pins', error);
        setPins([]);
      }
    };

    fetchPins();
  }, [activeBtn, profileResolved, userId]);

  if (!user) {
    return <Spinner message="Loading profile..." />;
  }

  return (
    <div className="relative h-full pb-2">
      <div className="flex flex-col gap-5 pb-5">
        <div className="glass-panel overflow-hidden rounded-[28px] md:rounded-[36px]">
          <div className="relative">
            <img src={randomImage} className="h-56 w-full object-cover sm:h-64 md:h-80 2xl:h-[420px]" alt="banner-picture" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            <div className="absolute left-4 top-4 rounded-full bg-white/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white backdrop-blur md:left-6 md:top-6 md:px-4 md:text-xs md:tracking-[0.28em]">
              Creator Profile
            </div>
            <div className="absolute right-4 top-4 md:right-6 md:top-6">
              {loggedInUser?._id === userId && (
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg transition hover:scale-105 md:h-12 md:w-12"
                  onClick={handleLogout}
                >
                  <AiOutlineLogout color="red" fontSize={21} />
                </button>
              )}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="flex items-end gap-3 md:gap-4">
                  <img
                    className="h-20 w-20 rounded-[24px] border-4 border-white/80 object-cover shadow-2xl md:h-28 md:w-28 md:rounded-[28px]"
                    src={user.image}
                    alt="user-profile"
                  />
                  <div className="pb-1 text-white">
                    <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">{user.userName}</h1>
                    <p className="mt-2 max-w-xl text-xs text-slate-200 sm:text-sm md:text-base">
                      Curating ideas, references, and visual stories inside Glimpse.
                    </p>
                  </div>
                </div>

                <div className="hidden rounded-[28px] bg-white/12 p-4 text-white backdrop-blur md:block md:min-w-[240px]">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-white/15 p-3">
                      <HiSparkles className="text-2xl" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Profile vibe</p>
                      <p className="mt-1 text-lg font-semibold">Bold visual collector</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-8 md:py-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Library</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">Your pin collection</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setActiveBtn('created')}
                className={activeBtn === 'created' ? activeBtnStyle : notActiveBtnStyle}
              >
                Created
              </button>
              <button
                type="button"
                onClick={() => setActiveBtn('saved')}
                className={activeBtn === 'saved' ? activeBtnStyle : notActiveBtnStyle}
              >
                Saved
              </button>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-[28px] p-3 md:rounded-[32px] md:p-5">
          {pins.length > 0 ? (
            <MasonryLayout pins={pins} />
          ) : (
            <div className="rounded-[28px] bg-white/70 px-6 py-14 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Empty board</p>
              <div className="mt-3 text-3xl font-bold text-slate-900">No pins found yet</div>
              <p className="mx-auto mt-3 max-w-lg text-slate-500">
                Start by uploading a few standout visuals and this profile will feel much more alive.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Userprofile;
