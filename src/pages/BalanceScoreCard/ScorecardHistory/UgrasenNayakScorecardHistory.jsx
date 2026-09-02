import React from 'react'
import { useState, useEffect } from 'react';

export const UgrasenNayakScorecardHistory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRowDetails, setSelectedRowDetails] = useState(null);

  const sheetId = '162o34BXqnJvmJjjtIoQpcBGo8orn2ZO5Jf0p8MgoUCs';
  const sheetName = 'Ugrasen Nayak';
  const appScriptUrl = 'https://script.google.com/macros/s/AKfycbw6xeabQpVzEnNMhLWfMAwLJ0hFZxA2L89aX17-p4b-caM4SdpsETrtq5GT4Lwk84qL/exec';

  const KPI_DEFINITIONS = [
    { kra: "Expenses", kpi: "Tracking the monthly budget vs expenses of HK department", outOf: 3, index: 4 },
    { kra: "Expenses", kpi: "Tracking the pending payments of vendor and complete it within the TAT", outOf: 3, index: 5 },
    { kra: "Checking", kpi: "Timely collect & checking the bills of vendor and submit to store and accounts department", outOf: 3, index: 6 },
    { kra: "Patient Satisfaction", kpi: "Cleaning the patient rooms properly as per the cleaning checklist", outOf: 6, index: 7 },
    { kra: "Patient Satisfaction", kpi: "Ensure for the room service as per the patient call bell", outOf: 5, index: 8 },
    { kra: "Patient Satisfaction", kpi: "Patient feedback <80%", outOf: 5, index: 9 },
    { kra: "Employee Satisfaction", kpi: "Counselling the staff as per the need", outOf: 2, index: 10 },
    { kra: "Employee Satisfaction", kpi: "Monthly wise staff mobilization, Duty alertment", outOf: 3, index: 11 },
    { kra: "SOP", kpi: "Monthly SOP Audit score by HOD >= 80%", outOf: 6, index: 12 },
    { kra: "Operational", kpi: "Maintain the BMW checklist on daily basis", outOf: 4, index: 13 },
    { kra: "Operational", kpi: "Maintain the waste segregation as per the BMW act", outOf: 4, index: 14 },
    { kra: "Operational", kpi: "Maintain the STP and ETP Management as per the pollution control act", outOf: 3, index: 15 },
    { kra: "Operational", kpi: "Control the spill management within the TAT", outOf: 5, index: 16 },
    { kra: "Operational", kpi: "Follow the checklist of Daily, Weekly and Monthly cleaning floor wise", outOf: 3, index: 17 },
    { kra: "Operational", kpi: "Checking of MGPS on daily and weekly basis with record keeping", outOf: 5, index: 18 },
    { kra: "Operational", kpi: "Maintain the hygienic and ecofriendly atmosphere within the building", outOf: 2, index: 19 },
    { kra: "Operational", kpi: "Tracking of AMC and CMC of departmental machineries on periodically", outOf: 3, index: 20 },
    { kra: "Reports", kpi: "100% adherence to timeline for submission of reports to management and ensure timely update reports by subordinates", outOf: 5, index: 21 },
    { kra: "Training & Development", kpi: "Impart per month (6 hr) Training to subordinates regarding new policies, Cleaning method, Fire Mock Drill and Emergency codes", outOf: 6, index: 22 },
    { kra: "Training & Development", kpi: "Attend Training conducted by management (Departmental / Cross functional)", outOf: 2, index: 23 },
    { kra: "Additional Responsibilities", kpi: "Laundary, Paste Control, Construction, Renovation and Compliances", outOf: 2, index: 24 }
  ];

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

      if (result.success && result.data && result.data.length > 0) {
        // Find header row dynamically
        let headerRowIdx = 3;
        for (let i = 0; i < Math.min(result.data.length, 10); i++) {
          if (result.data[i] && result.data[i][0] && result.data[i][0].toString().toLowerCase().trim() === 'timestamp') {
            headerRowIdx = i;
            break;
          }
        }

        const validRows = result.data.slice(headerRowIdx + 1).filter(r => r[0] && r[1]);

        // Sort descending (latest timestamp on top) so August 2026 appears first
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

  const formatMonth = (monthString) => {
    if (!monthString) return "-";

    try {
      if (
        typeof monthString === "string" &&
        monthString.match(/^[A-Za-z]+\s\d{4}$/)
      ) {
        return monthString;
      }

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
          <div className="text-lg font-semibold mb-4">Ugrasen Nayak Scorecard History</div>
          <div className="text-gray-600">Loading data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-center">
          <div className="text-lg font-semibold mb-4">Ugrasen Nayak Scorecard History</div>
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
                  Employee / Role
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
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider border">
                  Overall Target
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider border">
                  Overall Actual
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider border">
                  Overall Percentage
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold uppercase tracking-wider border">
                  Action
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
                  <td className="px-4 py-3 text-sm text-gray-900 border font-medium">
                    {formatMonth(row[1])}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 border">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${row[2] === "User" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>
                      {row[2] || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 border text-right">
                    {formatNumber(row[35])}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 border text-right font-bold text-blue-700">
                    {formatNumber(row[36])}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 border text-right">
                    {formatNumber(row[37])}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 border text-right">
                    {formatNumber(row[41])}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 border text-right font-bold">
                    {formatNumber(row[42])}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 border text-right font-bold text-green-600">
                    {formatPercentage(row[44])}
                  </td>
                  <td className="px-4 py-3 text-sm text-center border">
                    <button
                      onClick={() => setSelectedRowDetails(row)}
                      className="px-3 py-1 bg-purple-600 text-white rounded text-xs font-semibold hover:bg-purple-700 shadow-sm"
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

      {/* KPI Details Modal */}
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
              <button
                onClick={() => setSelectedRowDetails(null)}
                className="text-gray-500 hover:text-gray-800 font-bold text-2xl"
              >
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
              <button
                onClick={() => setSelectedRowDetails(null)}
                className="px-5 py-2 bg-blue-800 text-white rounded font-medium hover:bg-blue-700"
              >
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
        <button
          onClick={fetchData}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
};
