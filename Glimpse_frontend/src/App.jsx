import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';

import Login from './components/Login';
import Home from './container/Home';
import { fetchUser, isGuestUser } from './utils/fetchuser';

function App() {
  const user = fetchUser();
  const guest = isGuestUser(user);

  return (
    <Routes>
      <Route path="/login" element={user && !guest ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/*" element={user ? <Home /> : <Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
