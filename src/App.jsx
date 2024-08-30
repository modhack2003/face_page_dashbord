import { useState } from 'react';
import FacebookLoginButton from './components/FacebookLogin';
import Pages from './components/Pages';

const App = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [profile, setProfile] = useState(null);

  const handleLogout = () => {
    setAccessToken(null);
    setProfile(null);
  };

  return (
    <div className='min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex flex-col justify-center items-center p-4 px-80'>
      <div className='bg-white rounded-lg shadow-lg p-8 w-full'>
        {!accessToken ? (
          <>
            <h1 className='text-2xl font-bold mb-4 text-center text-gray-800'>Connect with Facebook</h1>
            <FacebookLoginButton setAccessToken={setAccessToken} setProfile={setProfile} />
          </>
        ) : (
          <>
            {profile && (
              <div className='flex items-center mb-6'>
                <img
                  src={profile.picture}
                  alt={profile.name}
                  className='w-12 h-12 rounded-full border border-gray-300'
                />
                <div className='ml-4'>
                  <p className='text-lg font-semibold'>{profile.name}</p>
                  <p className='text-gray-600'>{profile.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className='ml-auto bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded'
                >
                  Logout
                </button>
              </div>
            )}
            <Pages accessToken={accessToken} profile={profile} setAccessToken={setAccessToken} />
          </>
        )}
      </div>
    </div>
  );
};

export default App;
