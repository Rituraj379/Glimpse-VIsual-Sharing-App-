import { useEffect, useState } from 'react';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import { MdDownloadForOffline } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';

import { urlFor } from '../api/client';
import { deletePin as deletePinRequest, savePin as savePinRequest } from '../utils/api';
import { fetchUser, isGuestUser } from '../utils/fetchuser';

const Pin = ({ pin, onDelete }) => {
  const { image, postedBy, destination, _id } = pin;
  const [postHovered, setPostHovered] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const [saveList, setSaveList] = useState(pin.save || []);
  const navigate = useNavigate();
  const user = fetchUser();
  const guest = isGuestUser(user);

  useEffect(() => {
    setSaveList(pin.save || []);
  }, [pin.save]);

  if (!user) {
    return null;
  }

  const userId = user._id;
  const posterId = postedBy?._id;
  const alreadySaved = saveList.some((item) => item?.postedBy?._id === userId);

  const handleSave = async () => {
    if (guest) {
      navigate('/login');
      return;
    }

    if (alreadySaved) {
      return;
    }

    try {
      setSavingPost(true);
      const updatedPin = await savePinRequest(_id, userId);
      setSaveList(updatedPin.save || []);
    } catch (error) {
      console.error('Error saving pin', error);
    } finally {
      setSavingPost(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePinRequest(_id, userId);
      onDelete?.(_id);
    } catch (error) {
      console.error('Error deleting pin', error);
    }
  };

  return (
    <div className="mb-5">
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className="group relative cursor-zoom-in overflow-hidden rounded-[24px] bg-white shadow-md ring-1 ring-black/5 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl"
      >
        <img
          className="h-auto max-h-[520px] min-h-[240px] w-full object-cover"
          loading="lazy"
          alt="user-post"
          src={urlFor(image)}
        />

        {(postHovered || typeof window !== 'undefined') && (
          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between bg-gradient-to-t from-black/45 via-black/10 to-black/10 p-3 opacity-100 transition md:opacity-0 md:group-hover:opacity-100">
            <div className="flex items-center justify-between">
              <a
                href={`${urlFor(image)}?dl=`}
                download
                onClick={(event) => event.stopPropagation()}
                className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-md outline-none transition hover:scale-105"
              >
                <MdDownloadForOffline />
              </a>

              {alreadySaved ? (
                <button
                  type="button"
                  className="pointer-events-auto rounded-full bg-[#ff315c] px-4 py-2 text-sm font-bold text-white shadow-md outline-none"
                >
                  {saveList.length} Saved
                </button>
              ) : (
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    handleSave();
                  }}
                  type="button"
                  className="pointer-events-auto rounded-full bg-[#ff315c] px-4 py-2 text-sm font-bold text-white shadow-md outline-none transition hover:scale-[1.02]"
                >
                  {guest ? 'Login to save' : savingPost ? 'Saving...' : 'Save'}
                </button>
              )}
            </div>

            <div className="flex items-center justify-between gap-2">
              {destination && (
                <a
                  href={destination}
                  target="_blank"
                  rel="noreferrer"
                  className="pointer-events-auto inline-flex max-w-[72%] items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-bold text-black shadow-md outline-none"
                  onClick={(event) => event.stopPropagation()}
                >
                  <BsFillArrowUpRightCircleFill />
                  <span className="truncate">
                    {destination.length > 20 ? `${destination.slice(0, 20)}...` : destination}
                  </span>
                </a>
              )}
              {posterId === userId && (
                <button
                  type="button"
                  className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-dark shadow-md outline-none"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleDelete();
                  }}
                >
                  <AiTwotoneDelete />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <Link to={`/user-profile/${postedBy?._id}`} className="mt-3 flex items-center gap-2 px-1">
        <img className="h-9 w-9 rounded-2xl object-cover" src={postedBy?.image} alt="user-profile" />
        <p className="truncate font-semibold capitalize text-slate-800">{postedBy?.userName || 'Unknown User'}</p>
      </Link>
    </div>
  );
};

export default Pin;
