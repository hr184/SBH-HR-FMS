import React, { useState, useEffect } from 'react';
import { fetchScorecardSheetData, extractDataRows } from '../scorecardHelper';

export const ManaswiMaityScorecardHistory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRowDetails, setSelectedRowDetails] = useState(null);

  const primarySheetName = 'Manaswi Maity';
  const fallbackSheetName = 'Poorwa Gajbhiye';

  const KPI_DEFINITIONS = [
    { kra: "Recruitment", kpi: "Timely closure of New Joinings as per MRF within standard TAT", outOf: 6, index: 4 },
    { kra: "Planning & Execution", kpi: "Background Verification (BGV) to be done for all new joiners within 15 days", outOf: 4, index: 5 },
    { kra: "Planning & Execution", kpi: "Preparation of ID Cards of the new joiners within 2 days of joining", outOf: 7, index: 6 },
    { kra: "Planning & Execution", kpi: "New joiners file opening within 3 days of joining (Checklist maintained)", outOf: 5, index: 7 },
    { kra: "Planning & Execution", kpi: "Biometric Punch Registration of new joiners on Day 1 of joining", outOf: 3, index: 8 },
    { kra: "Planning & Execution", kpi: "Updation of Master Data within 7 days of joining", outOf: 4, index: 9 },
    { kra: "Planning & Execution", kpi: "Timely release of Appointment Letters to new joiners within 30 days", outOf: 6, index: 10 },
    { kra: "Planning & Execution", kpi: "Timely processing of Full & Final (F&F) Settlement within 45 days of exit", outOf: 5, index: 11 },
    { kra: "Induction & Training", kpi: "Conducting HR Induction for new joiners on Day 1 (Checklist maintained)", outOf: 4, index: 12 },
    { kra: "Induction & Training", kpi: "Hospital Induction coordination and compliance", outOf: 3, index: 13 },
    { kra: "Auditing & Process", kpi: "Monthly Personal File Audit compliance", outOf: 7, index: 14 },
    { kra: "Employee Engagement", kpi: "Conducting Monthly Birthday Celebration as per calendar", outOf: 5, index: 15 },
    { kra: "Employee Engagement", kpi: "Organizing Employee Engagement activity/festival celebration", outOf: 4, index: 16 },
    { kra: "Employee Engagement", kpi: "Employee Grievance Redressal within TAT (<48h ack, <7d resolution)", outOf: 7, index: 17 },
    { kra: "Employee Engagement", kpi: "Exit Interview coordination and analysis report submission by 5th", outOf: 4, index: 18 },
    { kra: "Employee Engagement", kpi: "Monthly MIS & HR Dashboard submission by 3rd of every month", outOf: 6, index: 19 }
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await fetchScorecardSheetData(primarySheetName, fallbackSheetName);

      if (result.success && result.data && result.data.length > 0) {
        const validRows = extractDataRows(result.data);

        validRows.sort((a, b) => {
          const timeA = new Date(a[0]).getTime() || 0;
          const timeB = new Date(b[0]).getTime() || 0;
          return timeB - timeA;
        });

        setData(validRows);
      } else {
        throw new Error(result.message || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      if (typeof dateString === 'string' && dateString.match(/^\d{1,2}\/\d{1,2}\/\d{4}/)) {
        return dateString;
      }
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? dateString : date.toLocaleString();
    } catch {
      return dateString;
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
          <div className="text-lg font-semibold mb-4">Manaswi Maity Scorecard History</div>
          <div className="text-gray-600">Loading data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-center">
          <div className="text-lg font-semibold mb-4">Manaswi Maity Scorecard History</div>
          <div className="text-red-600 bg-red-100 p-3 rounded-md">Error: {error}</div>
          <button onClick={fetchData} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {data.length === 0 ? (
        <div className="text-center text-gray-600 bg-gray-100 p-8 rounded-lg">No data available</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-blue-800 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase border">Timestamp</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase border">Month</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase border">Employee / Role</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase border">Target Score</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase border">Actual Score</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase border">Opportunity Loss</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase border">Overall Target</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase border">Overall Actual</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase border">Overall Percentage</th>
                <th className="px-4 py-3 text-center text-sm font-semibold uppercase border">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}>
                  <td className="px-4 py-3 text-sm text-gray-900 border whitespace-nowrap">{formatDate(row[0])}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 border font-medium">{row[1] || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 border">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${row[2] === "User" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>
                      {row[2] || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 border text-right">{formatNumber(row[35])}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 border text-right font-bold text-blue-700">{formatNumber(row[36])}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 border text-right">{formatNumber(row[37])}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 border text-right">{formatNumber(row[41])}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 border text-right font-bold">{formatNumber(row[42])}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 border text-right font-bold text-green-600">{formatPercentage(row[44])}</td>
                  <td className="px-4 py-3 text-sm text-center border">
                    <button
                      onClick={() => setSelectedRowDetails(row)}
                      className="px-3 py-1 bg-purple-600 text-white rounded text-xs font-semibold hover:bg-purple-700"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedRowDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <div>
                <h3 className="text-xl font-bold text-blue-900">
                  Detailed KPI Scores - {selectedRowDetails[1]}
                </h3>
                <p className="text-sm text-gray-500">
                  Submitted by: <strong className="text-gray-800">{selectedRowDetails[2]}</strong> | Timestamp: {selectedRowDetails[0]}
                </p>
              </div>
              <button onClick={() => setSelectedRowDetails(null)} className="text-gray-500 hover:text-gray-800 font-bold text-2xl">
                &times;
              </button>
            </div>

            <div className="mb-4 bg-blue-50 p-3 rounded-lg flex justify-between items-center">
              <div>
                <span className="text-sm text-blue-800">Total Score: </span>
                <strong className="text-lg text-blue-900">{selectedRowDetails[36]} / {selectedRowDetails[35] || 80}</strong>
              </div>
              <div>
                <span className="text-sm text-blue-800">Percentage: </span>
                <strong className="text-lg text-green-700">{selectedRowDetails[44]}%</strong>
              </div>
            </div>

            <table className="min-w-full table-auto border border-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 border text-left">KRA</th>
                  <th className="px-3 py-2 border text-left">KPI Description</th>
                  <th className="px-3 py-2 border text-center">Out of</th>
                  <th className="px-3 py-2 border text-center">Given Score</th>
                </tr>
              </thead>
              <tbody>
                {KPI_DEFINITIONS.map((def, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-3 py-2 border font-medium text-gray-700">{def.kra}</td>
                    <td className="px-3 py-2 border text-gray-600">{def.kpi}</td>
                    <td className="px-3 py-2 border text-center font-bold text-gray-500">{def.outOf}</td>
                    <td className="px-3 py-2 border text-center font-bold text-blue-700 bg-blue-50/50">
                      {selectedRowDetails[def.index] !== undefined && selectedRowDetails[def.index] !== "" ? selectedRowDetails[def.index] : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-6 text-right">
              <button onClick={() => setSelectedRowDetails(null)} className="px-5 py-2 bg-blue-800 text-white rounded font-medium hover:bg-blue-700">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p>Total Records: {data.length}</p>
      </div>

      <div className="mt-6 text-center">
        <button onClick={fetchData} className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
          Refresh Data
        </button>
      </div>
    </div>
  );
};

export const PoorwaGajbhiyeScorecardHistory = ManaswiMaityScorecardHistory;
