import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

import shareVideo from '../Assets0/share.mp4';
import logo from '../Assets0/logowhite.png';
import { upsertUser } from '../utils/api';
import { persistUser } from '../utils/fetchuser';

const defaultAvatar = 'https://api.dicebear.com/9.x/initials/svg?seed=Glimpse';

function Login() {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const finishLogin = (user) => {
    persistUser(user);
    window.location.replace('/');
  };

  const persistGoogleUser = async (decodedToken) => {
    const userPayload = {
      googleId: decodedToken.sub,
      userName: decodedToken.name || userName.trim() || 'Glimpse User',
      image: decodedToken.picture || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(decodedToken.name || 'Glimpse User')}`,
    };

    try {
      const user = await upsertUser(userPayload);
      finishLogin({ ...user, isGuest: false });
    } catch (loginError) {
      console.error('Google login failed', loginError);
      finishLogin({ ...userPayload, _id: userPayload.googleId, isGuest: false });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setError('');
      const decodedToken = jwtDecode(credentialResponse.credential);
      await persistGoogleUser(decodedToken);
    } catch (googleError) {
      console.error('Unable to complete Google sign-in', googleError);
      setError('Google sign-in failed. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google sign-in was cancelled or failed.');
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setError('');

    const guestPayload = {
      googleId: `guest-${Date.now()}`,
      userName: 'Guest User',
      image: defaultAvatar,
      isGuest: true,
    };

    try {
      const guest = await upsertUser(guestPayload);
      finishLogin({ ...guest, isGuest: true });
    } catch (guestError) {
      console.error('Guest login failed', guestError);
      finishLogin(guestPayload);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />
        <div className="absolute flex flex-col justify-center items-center inset-0 bg-[rgba(0,0,0,0.5)]">
          <div className="p-5">
            <img src={logo} width="130" alt="logo" />
          </div>
          <div className="w-[92%] max-w-md rounded-3xl bg-white/95 p-6 shadow-2xl backdrop-blur">
            <h1 className="text-2xl font-bold text-gray-900">Sign in to Glimpse</h1>
            <p className="mt-2 text-sm text-gray-600">Sign in with Google for full access, or continue as a guest to browse only.</p>

            <div className="mt-5 rounded-3xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">Full access</p>
              <h2 className="mt-2 text-lg font-bold text-gray-900">Google sign-in</h2>
              <p className="mt-2 text-sm text-gray-600">Google users can save pins, comment, and create posts.</p>
              <div className="mt-4 overflow-hidden rounded-2xl bg-white p-2 shadow-sm">
                {googleClientId ? (
                  <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} shape="pill" theme="outline" text="continue_with" />
                ) : (
                  <p className="px-3 py-2 text-sm text-amber-700">Add `VITE_GOOGLE_CLIENT_ID` in frontend `.env` to enable Google sign-in.</p>
                )}
              </div>
            </div>

            <div className="mt-4 rounded-3xl border border-gray-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">Optional guest name</p>
              <input
                type="text"
                placeholder="Guest display name"
                value={userName}
                onChange={(event) => setUserName(event.target.value)}
                className="mt-3 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-gray-400"
              />
              <p className="mt-3 text-sm text-gray-500">Guests can explore the website but cannot save, comment, or post.</p>
            </div>

            {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

            <button
              type="button"
              disabled={loading}
              onClick={handleGuestLogin}
              className="mt-5 w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-800 font-semibold transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Opening...' : `Continue as ${userName.trim() || 'Guest'}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
