

# Facebook Page Insights Dashboard

A React application that integrates with Facebook's Graph API to allow users to log in with their Facebook account, view pages they manage, and fetch various insights for those pages.

## Features

- **Facebook Login:** Users can log in with their Facebook account to access their managed pages.
- **Page Selection:** After logging in, users can select a page from their list of managed pages.
- **Page Insights:** View various insights for the selected page, including followers, impressions, and reactions.

## Technologies Used

- React
- React Facebook Login
- Tailwind CSS
- Axios for API requests
- Facebook Graph API

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/facebook-page-insights-dashboard.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd facebook-page-insights-dashboard
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Create a `.env` file** in the root directory and add your Facebook App ID:

   ```env
   REACT_APP_FACEBOOK_APP_ID=your_facebook_app_id
   ```

5. **Start the development server:**

   ```bash
   npm start
   ```

   The app will be available at `http://localhost:3000`.

## Usage

1. **Login with Facebook:** Click the "Login with Facebook" button to authenticate and authorize the app.
2. **Select a Page:** After logging in, select a page from the list of pages you manage.
3. **View Insights:** Insights for the selected page will be displayed, including followers, impressions, and reactions.

## Components

- **App.js:** Main application component that handles authentication and rendering of the `Pages` component.
- **FacebookLoginButton.js:** Component for Facebook login button using `react-facebook-login`.
- **Pages.js:** Component for displaying the list of pages and insights.

## Contributing

Feel free to submit issues or pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any inquiries, you can reach out to [your-email@example.com](mailto:your-email@example.com).

