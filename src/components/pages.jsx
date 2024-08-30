import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Pages = ({ accessToken }) => {
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [insights, setInsights] = useState({});
  const [loadingPages, setLoadingPages] = useState(true);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [error, setError] = useState(null);
  const [since, setSince] = useState('2024-07-01'); // Default start date
  const [until, setUntil] = useState(today); // Default end date set to today's date
  const [dateError, setDateError] = useState(null);

  useEffect(() => {
    if (accessToken) {
      // Fetch the list of pages the user manages
      axios.get('https://graph.facebook.com/v20.0/me/accounts', {
        params: {
          access_token: accessToken
        }
      })
        .then(response => {
          setPages(response.data.data);
          setLoadingPages(false);
        })
        .catch(error => {
          console.error('Error fetching pages:', error);
          setError('Failed to load pages.');
          setLoadingPages(false);
        });
    }
  }, [accessToken]);

  const handlePageSelect = (page) => {
    setSelectedPage(page);
    fetchInsights(page, since, until);
  };

  const fetchInsights = async (page, startDate, endDate) => {
    setLoadingInsights(true);
    setInsights({});
    const pageAccessToken = page.access_token;

    try {
      const metrics = [
        { metric: 'page_fans', period: 'total_over_range' },
        { metric: 'page_impressions', period: 'total_over_range' },
        { metric: 'page_actions_post_reactions_total', period: 'total_over_range' },
        { metric: 'page_post_engagements', period: 'total_over_range' }
      ];

      const insightsData = {};

      for (const { metric, period } of metrics) {
        const response = await axios.get(`https://graph.facebook.com/v20.0/${page.id}/insights`, {
          params: {
            metric,
            period,
            since: startDate,
            until: endDate,
            access_token: pageAccessToken
          }
        });

        if (response.data.data && response.data.data.length > 0) {
          insightsData[`${metric}_${period}`] = response.data.data[0].values[0].value;
        } else {
          insightsData[`${metric}_${period}`] = 0; // Set to 0 if the response is an empty object
        }
      }

      setInsights(insightsData);
    } catch (error) {
      console.error('Error fetching insights:', error);
      setError('Failed to load insights.');
    } finally {
      setLoadingInsights(false);
    }
  };

  const handleDateChange = (setter) => (event) => {
    const selectedDate = event.target.value;
    if (new Date(selectedDate) > new Date(today)) {
      setDateError('You cannot select a future date.');
    } else {
      setter(selectedDate);
      setDateError(null); // Clear any previous error when valid dates are selected
    }
  };

  const handleApplyDateRange = () => {
    const sinceDate = new Date(since);
    const untilDate = new Date(until);
    const diffTime = Math.abs(untilDate - sinceDate);
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays > 93) {
      setDateError('There cannot be more than 93 days (8,035,200 seconds) between "since" and "until".');
    } else if (sinceDate > untilDate) {
      setDateError('"Since" date cannot be later than "Until" date.');
    } else {
      setDateError(null); // Clear any previous error
      if (selectedPage) {
        fetchInsights(selectedPage, since, until);
      }
    }
  };

  if (loadingPages) {
    return (
      <div className='flex justify-center items-center'>
        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <span className='ml-2 text-blue-600'>Loading Pages...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-red-500 text-center'>
        {error}
      </div>
    );
  }

  return (
    <div className='mt-6 w-full'>
      <h2 className='text-xl font-semibold mb-4 text-gray-800'>Select a Page:</h2>
      <ul className='space-y-2'>
        {pages.map(page => (
          <li key={page.id}>
            <button
              onClick={() => handlePageSelect(page)}
              className={`w-full text-left px-4 py-2 rounded-lg border ${selectedPage && selectedPage.id === page.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                } transition-colors duration-200`}
            >
              {page.name}
            </button>
          </li>
        ))}
      </ul>
      {selectedPage && (
        <div className='mt-8'>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Insights for {selectedPage.name}:</h2>
          <div className='flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4'>
            <div>
              <label htmlFor="since" className='block text-gray-700'>From:</label>
              <input
                type="date"
                id="since"
                value={since}
                onChange={handleDateChange(setSince)}
                max={today} // Prevent selecting a future date
                className='border rounded-lg px-4 py-2 w-full md:w-auto'
              />
            </div>
            <div>
              <label htmlFor="until" className='block text-gray-700'>Until:</label>
              <input
                type="date"
                id="until"
                value={until}
                onChange={handleDateChange(setUntil)}
                max={today} // Prevent selecting a future date
                className='border rounded-lg px-4 py-2 w-full md:w-auto'
              />
            </div>
            <button
              onClick={handleApplyDateRange}
              className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200'
            >
              Apply Date Range
            </button>
          </div>
          {dateError && (
            <div className='text-red-500 mt-2'>
              {dateError}
            </div>
          )}
          {loadingInsights ? (
            <div className='flex items-center mt-4'>
              <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span className='ml-2 text-blue-600'>Loading Insights...</span>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4'>
              <div className='bg-white p-4 rounded-lg shadow'>
                <h3 className='text-lg font-medium text-gray-700'>Total Followers</h3>
                <p className='mt-2 text-2xl font-bold text-blue-600'>
                  {typeof insights['page_fans_total_over_range'] === 'object' ? '0' : insights['page_fans_total_over_range']}
                </p>
              </div>
              <div className='bg-white p-4 rounded-lg shadow'>
                <h3 className='text-[1rem] font-medium text-gray-700'>Total Engagements</h3>
                <p className='mt-2 text-2xl font-bold text-blue-600'>
                  {typeof insights['page_post_engagements_total_over_range'] === 'object' ? '0' : insights['page_post_engagements_total_over_range']}
                </p>
              </div>
              <div className='bg-white p-4 rounded-lg shadow'>
                <h3 className='text-lg font-medium text-gray-700'>Total Impressions</h3>
                <p className='mt-2 text-2xl font-bold text-blue-600'>
                  {typeof insights['page_impressions_total_over_range'] === 'object' ? '0' : insights['page_impressions_total_over_range']}
                </p>
              </div>
              <div className='bg-white p-4 rounded-lg shadow'>
                <h3 className='text-lg font-medium text-gray-700'>Total Reactions</h3>
                <p className='mt-2 text-2xl font-bold text-blue-600'>
                  {typeof insights['page_actions_post_reactions_total_total_over_range'] === 'object' ? '0' : insights['page_actions_post_reactions_total_total_over_range']}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Pages;
