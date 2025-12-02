import React from 'react'
import { useState, useEffect } from 'react';

export const SumanGoudScorecardHistory = () => {
   const [data, setData] = useState([]);
                  const [loading, setLoading] = useState(true);
                  const [error, setError] = useState(null);
                
                  const sheetId = '162o34BXqnJvmJjjtIoQpcBGo8orn2ZO5Jf0p8MgoUCs';
                  const sheetName = 'Suman Goud Kuntla';
                  const appScriptUrl = 'https://script.google.com/macros/s/AKfycbw6xeabQpVzEnNMhLWfMAwLJ0hFZxA2L89aX17-p4b-caM4SdpsETrtq5GT4Lwk84qL/exec';
                
                  useEffect(() => {
                    fetchData();
                  }, []);
                
                  const fetchData = async () => {
                    try {
                      setLoading(true);
                      const response = await fetch(
                        `${appScriptUrl}?sheetId=${sheetId}&sheetName=${encodeURIComponent(sheetName)}`
                      );
                      
                      if (!response.ok) {
                        throw new Error('Failed to fetch data');
                      }
                      
                      const result = await response.json();
                      
                      if (result.success) {
                        // Skip header row if needed, or use all data
                        setData(result.data.slice(5));
                      } else {
                        throw new Error(result.message || 'Failed to fetch data');
                      }
                    } catch (err) {
                      setError(err.message);
                    } finally {
                      setLoading(false);
                    }
                  };
                
const formatDate = (dateString) => {
  if (!dateString) return '-';
  
  try {
    // If it's already in the correct format (10/31/2025), return as is
    if (typeof dateString === 'string' && dateString.match(/^\d{1,2}\/\d{1,2}\/\d{4}/)) {
      // Extract just the date part if there's time included
      const datePart = dateString.split(' ')[0];
      return datePart;
    }
    
    // Handle Date objects and other string formats
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? dateString : date.toLocaleDateString();
  } catch {
    return dateString;
  }
};

const formatMonth = (monthString) => {
  if (!monthString) return "-";

  try {
    // If it's already in "October 2025" format, return as is
    if (
      typeof monthString === "string" &&
      monthString.match(/^[A-Za-z]+\s\d{4}$/)
    ) {
      return monthString;
    }

    // Handle Date objects and convert to "Month Year" format
    const date = new Date(monthString);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    }

    return monthString;
  } catch {
    return monthString;
  }
};
                
                  const formatNumber = (value) => {
                    if (value === null || value === undefined || value === '') return '-';
                    const num = parseFloat(value);
                    return isNaN(num) ? value : num;
                  };
                
                  const formatPercentage = (value) => {
                    if (value === null || value === undefined || value === '') return '-';
                    const num = parseFloat(value);
                    return isNaN(num) ? value : `${num}%`;
                  };
                
                  if (loading) {
                    return (
                      <div className="p-4">
                        <div className="text-center">
                          <div className="text-lg font-semibold mb-4">Suman Bala Sahu Scorecard History</div>
                          <div className="text-gray-600">Loading data...</div>
                        </div>
                      </div>
                    );
                  }
                
                  if (error) {
                    return (
                      <div className="p-4">
                        <div className="text-center">
                          <div className="text-lg font-semibold mb-4">Suman Bala Sahu Scorecard History</div>
                          <div className="text-red-600 bg-red-100 p-3 rounded-md">
                            Error: {error}
                          </div>
                          <button
                            onClick={fetchData}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            Retry
                          </button>
                        </div>
                      </div>
                    );
                  }
                
                  return (
                    <div className="p-4">
                
                      {data.length === 0 ? (
                        <div className="text-center text-gray-600 bg-gray-100 p-8 rounded-lg">
                          No data available
                        </div>
                      ) : (
                        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
                          <table className="min-w-full table-auto border-collapse">
                            <thead className="bg-blue-800 text-white">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider border">
                                  Timestamp
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider border">
                                  Month
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider border">
                                  Employee Name
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider border">
                                  Target Score
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider border">
                                  Actual Score
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider border">
                                  Opportunity Loss
                                </th>
                                {/* <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider border">
                                  Target (Delegation)
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider border">
                                  Actual (Delegation)
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider border">
                                  Opportunity Loss (Delegation)
                                </th> */}
                                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider border">
                                  Overall Target
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider border">
                                  Overall Actual
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider border">
                                  Overall Opportunity Loss
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider border">
                                  Overall Percentage
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {data.map((row, index) => (
                                <tr 
                                  key={index} 
                                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}
                                >
                                  <td className="px-4 py-3 text-sm text-gray-900 border whitespace-nowrap">
                                    {formatDate(row[0])}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 border">
                                    {formatMonth(row[1])}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 border">
                                    {row[2] || '-'}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 border text-right">
                                    {formatNumber(row[58])}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 border text-right">
                                    {formatNumber(row[59])}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 border text-right">
                                    {formatNumber(row[60])}
                                  </td>
                                  {/* <td className="px-4 py-3 text-sm text-gray-900 border text-right">
                                    {formatNumber(row[61])}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 border text-right">
                                    {formatNumber(row[62])}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 border text-right">
                                    {formatNumber(row[63])}
                                  </td> */}
                                  <td className="px-4 py-3 text-sm text-gray-900 border text-right">
                                    {formatNumber(row[64])}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 border text-right">
                                    {formatNumber(row[65])}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 border text-right">
                                    {formatNumber(row[66])}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 border text-right">
                                    {formatPercentage(row[67])}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                
                      <div className="mt-4 text-sm text-gray-600">
                        <p>Total Records: {data.length}</p>
                      </div>
                
                      <div className="mt-6 text-center">
                        <button
                          onClick={fetchData}
                          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                          Refresh Data
                        </button>
                      </div>
                    </div>
                  );
}
