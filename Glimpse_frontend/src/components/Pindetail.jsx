import { useEffect, useState } from 'react';
import { BsArrowUpRightCircleFill } from 'react-icons/bs';
import { MdDownloadForOffline } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';

import { urlFor } from '../api/client';
import { addComment, deleteComment, getPinDetails } from '../utils/api';
import { isGuestUser } from '../utils/fetchuser';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const PinDetail = ({ user }) => {
  const { pinId } = useParams();
  const [pins, setPins] = useState([]);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const imageUrl = urlFor(pinDetail?.image);
  const guest = isGuestUser(user);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getPinDetails(pinId);
        setPinDetail(data.pin);
        setPins(data.relatedPins || []);
      } catch (error) {
        console.error('Error fetching pin details', error);
      }
    };

    fetchDetails();
  }, [pinId]);

  const handleAddComment = async () => {
    if (guest) {
      window.location.assign('/login');
      return;
    }

    if (!comment.trim() || !user?._id) {
      return;
    }

    try {
      setAddingComment(true);
      const updatedPin = await addComment(pinId, { comment, userId: user._id });
      setPinDetail(updatedPin);
      setComment('');
    } catch (error) {
      console.error('Error adding comment', error);
    } finally {
      setAddingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const updatedPin = await deleteComment(pinId, commentId, user._id);
      setPinDetail(updatedPin);
    } catch (error) {
      console.error('Error deleting comment', error);
    }
  };

  if (!pinDetail) {
    return <Spinner message="Showing pin" />;
  }

  return (
    <>
      <div className="glass-panel mx-auto hero-grid max-w-[1220px] overflow-hidden rounded-[28px] p-3 md:rounded-[32px] md:p-4">
        <div className="relative min-h-[220px] bg-gradient-to-br from-[#131722] via-[#20273a] to-[#2a3146] p-3 md:p-4">
          {imageUrl ? (
            <img
              className="h-full min-h-[320px] w-full rounded-[24px] object-cover shadow-2xl md:min-h-[420px]"
              src={imageUrl}
              alt="user-post"
            />
          ) : (
            <div className="flex h-full min-h-[420px] w-full items-center justify-center rounded-[24px] border border-white/10 bg-white/5 p-8 text-center text-slate-300">
              Pin image is missing for this post.
            </div>
          )}
          <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded-[24px] bg-gradient-to-t from-black/45 to-transparent md:inset-x-4" />
        </div>

        <div className="flex w-full min-w-0 flex-col p-4 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <a
              href={imageUrl ? `${imageUrl}?dl=` : undefined}
              download
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg text-slate-700 shadow-md ring-1 ring-black/5 transition hover:scale-105 hover:text-black"
            >
              <MdDownloadForOffline />
            </a>
            <a
              href={pinDetail.destination || '#'}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#ff315c] px-4 py-2.5 text-sm font-bold text-white shadow-lg transition hover:scale-[1.02] hover:bg-[#e42951]"
            >
              <BsArrowUpRightCircleFill className="text-sm" />
              Visit
            </a>
          </div>

          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">{pinDetail.category}</p>
            <h1 className="mt-2 text-2xl font-bold break-words text-slate-900 sm:text-3xl md:text-[2.1rem]">{pinDetail.title}</h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-600">{pinDetail.about}</p>
          </div>

          <Link
            to={`/user-profile/${pinDetail?.postedBy?._id}`}
            className="mt-5 flex w-fit items-center gap-3 rounded-[22px] bg-white px-4 py-3 shadow-md ring-1 ring-black/5"
          >
            <img src={pinDetail?.postedBy?.image} className="h-11 w-11 rounded-2xl object-cover" alt="user-profile" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Posted by</p>
              <p className="font-bold text-slate-900">{pinDetail?.postedBy?.userName}</p>
            </div>
          </Link>

          <div className="mt-7 border-t border-slate-200 pt-5">
            <h2 className="text-[1.7rem] font-bold text-slate-900 md:text-[2rem]">Comments</h2>
          </div>

          <div className="mt-2 max-h-[280px] overflow-y-auto pr-1">
            {pinDetail?.comments?.map((item) => (
              <div className="mt-3 flex items-start gap-3 rounded-[22px] bg-white px-4 py-3 shadow-sm ring-1 ring-black/5" key={item._key}>
                <img src={item.postedBy?.image} className="h-10 w-10 rounded-2xl object-cover" alt="user-profile" />
                <div className="flex flex-1 flex-col">
                  <p className="font-bold text-slate-900">{item.postedBy?.userName}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.comment}</p>
                </div>
                {item.postedBy?._id === user?._id && (
                  <button
                    className="ml-auto text-sm font-semibold text-red-600 transition hover:text-red-700"
                    onClick={() => handleDeleteComment(item._key)}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>

          {user && (
            <div className="mt-5 flex flex-col gap-3 rounded-[24px] bg-white px-4 py-4 shadow-md ring-1 ring-black/5 sm:flex-row sm:items-center">
              <Link to={`/user-profile/${user._id}`}>
                <img src={user.image} className="h-11 w-11 rounded-2xl object-cover cursor-pointer" alt="user-profile" />
              </Link>
              {guest ? (
                <div className="min-w-0 flex-1 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  Sign in with Google to comment on pins.
                </div>
              ) : (
                <input
                  className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
                  type="text"
                  placeholder="Add a comment"
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                />
              )}
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full bg-[#111827] px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                onClick={guest ? () => window.location.assign('/login') : handleAddComment}
                disabled={!guest && (addingComment || !comment.trim())}
              >
                {guest ? 'Login to comment' : addingComment ? 'Posting...' : 'Post'}
              </button>
            </div>
          )}
        </div>
      </div>
      {pins.length > 0 ? (
        <div className="px-2">
          <h2 className="text-center text-2xl font-bold mt-8 mb-4">More like this</h2>
          <MasonryLayout pins={pins} />
        </div>
      ) : null}
    </>
  );
};

export default PinDetail;
