import { useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { createPin as createPinRequest } from '../utils/api';
import { categories } from '../utils/data';
import { isGuestUser } from '../utils/fetchuser';
import Spinner from './Spinner';

function Createpin({ user }) {
  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(false);
  const [category, setCategory] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [wrongImageType, setWrongImageType] = useState(false);
  const navigate = useNavigate();
  const guest = isGuestUser(user);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setWrongImageType(true);
      return;
    }

    setWrongImageType(false);
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (guest) {
      navigate('/login');
      return;
    }

    if (!title || !about || !destination || !imageFile || !category || !user?._id) {
      setFields(true);
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', title);
      formData.append('about', about);
      formData.append('destination', destination);
      formData.append('category', category);
      formData.append('userId', user._id);
      formData.append('image', imageFile);

      await createPinRequest(formData);
      navigate('/');
    } catch (error) {
      console.error('Error saving pin', error);
      alert('Error saving pin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-2 flex w-full max-w-6xl flex-col md:mt-4">
      {guest && (
        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          Guest mode is view-only. Sign in with Google to create and publish pins.
        </div>
      )}
      {fields && (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          Please fill in all the fields before publishing your pin.
        </div>
      )}

      <div className="glass-panel overflow-hidden rounded-[28px] p-3 md:rounded-[36px] md:p-6">
        <div className="grid gap-4 lg:grid-cols-[1.02fr_1.08fr] lg:gap-6">
          <div className="rounded-[28px] bg-gradient-to-br from-[#fffaf5] via-white to-[#eef6ff] p-4 shadow-inner md:rounded-[32px]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Visual</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900">Upload cover</h2>
              </div>
              <div className="rounded-2xl bg-white px-3 py-2 text-xs font-semibold text-slate-500 shadow-sm ring-1 ring-black/5">
                JPG, PNG, WEBP
              </div>
            </div>

            <div className="relative min-h-[320px] md:min-h-[420px]">
              <div className="absolute inset-0 rounded-[28px] bg-[radial-gradient(circle_at_top,_rgba(255,122,89,0.16),transparent_40%),radial-gradient(circle_at_bottom,_rgba(59,130,246,0.14),transparent_35%)]" />
              <div className="relative flex h-full min-h-[320px] flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-slate-300/80 bg-white/80 p-5 text-center md:min-h-[420px]">
          {loading && <Spinner />}
          {!previewUrl ? (
                <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-[#111827] text-white shadow-xl">
                    <AiOutlineCloudUpload className="text-5xl" />
                  </div>
                  <p className="mt-6 text-2xl font-semibold text-slate-800 md:text-3xl">Drop your hero image here</p>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
                    Choose a bold visual with strong contrast. Portrait images work especially well for this layout.
                  </p>
                  <div className="mt-6 rounded-full bg-[#ff5a5f] px-5 py-3 text-sm font-semibold text-white shadow-lg">
                    Click to upload
                  </div>
                  <input type="file" name="upload-image" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              ) : (
                <div className="relative flex h-full w-full flex-col justify-center items-center">
                  <img src={previewUrl} alt="uploaded-pic" className="h-full max-h-[320px] w-full rounded-[28px] object-cover shadow-2xl md:max-h-[420px]" />
                  <div className="absolute left-4 top-4 rounded-full bg-black/65 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white">
                    Ready to publish
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setPreviewUrl('');
                    }}
                    className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-red-500 shadow-lg transition hover:scale-105 hover:bg-red-50"
                  >
                    <MdDelete />
                  </button>
                </div>
              )}
              </div>
            </div>
            {wrongImageType && <p className="mt-3 text-sm font-medium text-red-500">Please upload a valid image file.</p>}
          </div>

          <div className="flex min-w-0 flex-col gap-5 rounded-[28px] bg-white/70 p-4 md:rounded-[32px] md:p-6">
            <div className="rounded-[24px] bg-[#111827] p-4 text-white shadow-xl md:rounded-[28px] md:p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                  <img
                    src={user?.image}
                    alt="user-profile"
                    className="h-16 w-16 rounded-[22px] object-cover ring-2 ring-white/20"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Creator</p>
                    <h3 className="mt-1 truncate text-xl font-bold md:text-2xl">{user?.userName || 'Your profile'}</h3>
                    <p className="mt-1 text-sm text-slate-300">Craft a striking pin cover and a clear destination story.</p>
                  </div>
                </div>
                <div className="hidden rounded-2xl bg-white/10 p-3 text-white md:flex">
                  <HiOutlineSparkles className="text-2xl" />
                </div>
              </div>
            </div>

            <div className="grid gap-5">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">Title</span>
                <input
                  type="text"
                  placeholder="Give your idea a magnetic title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="w-full rounded-[22px] border border-slate-200 bg-white px-4 py-3.5 text-xl font-semibold text-slate-800 outline-none transition focus:border-slate-400 focus:shadow-sm md:rounded-[24px] md:px-5 md:py-4 md:text-2xl"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">About</span>
                <textarea
                  placeholder="Tell people what makes this pin worth saving."
                  value={about}
                  onChange={(event) => setAbout(event.target.value)}
                  rows={4}
                  className="w-full resize-none rounded-[22px] border border-slate-200 bg-white px-4 py-3.5 text-base text-slate-700 outline-none transition focus:border-slate-400 focus:shadow-sm md:rounded-[24px] md:px-5 md:py-4"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">Destination link</span>
                <input
                  type="url"
                  placeholder="https://your-link.com"
                  value={destination}
                  onChange={(event) => setDestination(event.target.value)}
                  className="w-full rounded-[22px] border border-slate-200 bg-white px-4 py-3.5 text-base text-slate-700 outline-none transition focus:border-slate-400 focus:shadow-sm md:rounded-[24px] md:px-5 md:py-4"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">Category</span>
                <select
                  onChange={(event) => setCategory(event.target.value)}
                  className="w-full rounded-[22px] border border-slate-200 bg-white px-4 py-3.5 text-base text-slate-800 outline-none transition focus:border-slate-400 focus:shadow-sm md:rounded-[24px] md:px-5 md:py-4"
                  value={category}
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {categories.map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex flex-col items-start justify-between gap-4 rounded-[22px] bg-slate-50 px-4 py-4 md:flex-row md:items-center md:rounded-[24px]">
                <p className="max-w-sm text-sm leading-6 text-slate-500">
                  Strong pins usually combine a short title, a clear link, and one image with a single focal point.
                </p>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex min-w-[144px] items-center justify-center rounded-full bg-[#ff2d55] px-6 py-3 text-base font-bold text-white shadow-lg transition hover:scale-[1.02] hover:bg-[#e0264c] md:text-lg"
                >
                  {guest ? 'Login to post' : loading ? 'Saving...' : 'Save Pin'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Createpin;
