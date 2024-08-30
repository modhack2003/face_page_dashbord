import FacebookLogin from 'react-facebook-login';

const FacebookLoginButton = ({ setAccessToken, setProfile }) => {
  const handleLogin = (response) => {
    if (response.accessToken) {
      setAccessToken(response.accessToken);
      setProfile({
        name: response.name,
        email: response.email,
        picture: response.picture.data.url,
      });
    } else {
      console.error('Login failed:', response);
    }
  };

  return (
    <div className='flex justify-center'>
      <FacebookLogin
        appId="1219424022424873"
        autoLoad={false}
        fields="name,email,picture"
        scope="pages_read_engagement,pages_show_list,pages_manage_metadata,pages_read_user_content"
        callback={handleLogin}
        textButton="Login with Facebook"
        cssClass="facebook-button bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded flex items-center w-full md:w-auto"
        icon="fa-facebook"
      />
    </div>
  );
};

export default FacebookLoginButton;