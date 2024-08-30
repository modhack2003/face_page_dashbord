import { useState } from 'react';
import FacebookLoginButton from './components/FacebookLogin';
import Pages from './components/pages';

const App = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [profile, setProfile] = useState(null);

  const handleLogout = () => {
    setAccessToken(null);
    setProfile(null);
  };

  return (
    <div className='min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex flex-col justify-center items-center p-4'>
      <div className='bg-white rounded-lg shadow-lg p-4 md:p-8 w-full md:w-3/4 lg:w-1/2 xl:w-1/3'>
        {!accessToken ? (
          <>
            <h1 className='text-xl md:text-2xl font-bold mb-4 text-center text-gray-800'>Connect with Facebook</h1>
            <FacebookLoginButton setAccessToken={setAccessToken} setProfile={setProfile} />
          </>
        ) : (
          <>
            {profile && (
              <div className='flex flex-col md:flex-row items-center mb-6'>
                <img
                  src={profile.picture}
                  alt={profile.name}
                  className='w-24 h-24 md:w-12 md:h-12 rounded-full border border-gray-300'
                />
                <div className='mt-4 md:mt-0 md:ml-4'>
                  <p className='text-lg font-semibold'>{profile.name}</p>
                  <p className='text-gray-600'>{profile.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className='mt-4 md:mt-0 md:ml-auto bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded'
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