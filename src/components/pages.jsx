// src/components/Pages.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Pages = ({ accessToken }) => {
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [insights, setInsights] = useState({});
  const [loadingPages, setLoadingPages] = useState(true);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [error, setError] = useState(null);

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
          console.log(response.data);
          setLoadingPages(false);
          // Automatically select the first page for demonstration
          if (response.data.data.length > 0) {
            handlePageSelect(response.data.data[0]);
          }
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
    setLoadingInsights(true);
    setInsights({});
    const pageAccessToken = page.access_token;

    // Fetch metrics with different periods
    const fetchInsights = async () => {
      try {
        const metrics = [
          { metric: 'page_fans', period: 'day' },
          { metric: 'page_impressions', period: 'day' },
          { metric: 'page_impressions', period: 'week' },
          { metric: 'page_impressions', period: 'days_28' },
          { metric: 'page_actions_post_reactions_total', period: 'day' }
        ];

        const insightsData = {};

        for (const { metric, period } of metrics) {
          const response = await axios.get(`https://graph.facebook.com/v20.0/${page.id}/insights`, {
            params: {
              metric,
              period,
              access_token: pageAccessToken
            }
          });

          if (response.data.data && response.data.data.length > 0) {
            insightsData[`${metric}_${period}`] = response.data.data[0].values[0].value;
          } else {
            insightsData[`${metric}_${period}`] = 'N/A';
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

    fetchInsights();
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
        <div className='mt-8 bg-gray-50 p-2 rounded-lg shadow-md'>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Insights for {selectedPage.name}:</h2>
          {loadingInsights ? (
            <div className='flex items-center'>
              <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span className='ml-2 text-blue-600'>Loading Insights...</span>
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-2'>
              <div className='bg-white p-4 rounded-lg shadow'>
                <h3 className='text-lg font-medium text-gray-700'>Followers</h3>
                <p className='mt-2 text-2xl font-bold text-blue-600'>
                  {typeof insights['page_fans_day'] === 'object' ? JSON.stringify(insights['page_fans_day']) : insights['page_fans_day'] || 'N/A'}
                </p>
              </div>
              <div className='bg-white p-4 rounded-lg shadow'>
                <h3 className='text-lg font-medium text-gray-700'>Impressions (Day)</h3>
                <p className='mt-2 text-2xl font-bold text-blue-600'>
                  {typeof insights['page_impressions_day'] === 'object' ? JSON.stringify(insights['page_impressions_day']) : insights['page_impressions_day'] || 'N/A'}
                </p>
              </div>
              <div className='bg-white p-4 rounded-lg shadow'>
                <h3 className='text-lg font-medium text-gray-700'>Impressions (Week)</h3>
                <p className='mt-2 text-2xl font-bold text-blue-600'>
                  {typeof insights['page_impressions_week'] === 'object' ? JSON.stringify(insights['page_impressions_week']) : insights['page_impressions_week'] || 'N/A'}
                </p>
              </div>
              <div className='bg-white p-4 rounded-lg shadow'>
                <h3 className='text-lg font-medium text-gray-700'>Impressions (28 Days)</h3>
                <p className='mt-2 text-2xl font-bold text-blue-600'>
                  {typeof insights['page_impressions_days_28'] === 'object' ? JSON.stringify(insights['page_impressions_days_28']) : insights['page_impressions_days_28'] || 'N/A'}
                </p>
              </div>
              <div className='bg-white p-4 rounded-lg shadow'>
                <h3 className='text-lg font-medium text-gray-700'>Reactions</h3>
                <p className='mt-2 text-2xl font-bold text-blue-600'>
                  {typeof insights['page_actions_post_reactions_total_day'] === 'object' && Object.keys(insights['page_actions_post_reactions_total_day']).length === 0
                    ? 0
                    : insights['page_actions_post_reactions_total_day'] || 'N/A'}
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
