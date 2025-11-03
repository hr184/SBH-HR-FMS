import { Activity } from 'lucide-react';
import React, { useState } from 'react';
import { AjayUpadhyay } from './Scorecard/AjayUpadhyay';
import { AjayUpadhyayScorecardHistory } from './ScorecardHistory/AjayUpadhyayScorecardHistory'
import { AlokPandey } from './Scorecard/AlokPandey';
import { AlokPandeyScorecardHistory } from './ScorecardHistory/AlokPandeyScorecardHistory'
import { DeepmalaPatil } from './Scorecard/DeepmalaPatil';
import { DeepmalaPatilScorecardHistory } from './ScorecardHistory/DeepmalaPatilScorecardHistory'
import { DeepuMourya } from './Scorecard/DeepuMourya';
import { DeepuMouryaScorecardHistory } from './ScorecardHistory/DeepuMouryaScorecardHistory'
import {GeetanjaliDeep } from './Scorecard/GeetanjaliDeep';
import { GeetanjaliDeepScorecardHistory } from './ScorecardHistory/GeetanjaliDeepScorecardHistory'
import { HansrajSingh } from './Scorecard/HansrajSingh';
import { HansrajSinghScorecardHistory } from './ScorecardHistory/HansrajSinghScorecardHistory'
import { JharnaAmbulkar } from './Scorecard/JharnaAmbulkar';
import { JharnaAmbulkarScorecardHistory } from './ScorecardHistory/JharnaAmbulkarScorecardHistory'
import { LalitMohanBisht } from './Scorecard/LalitMohanBisht';
import { LalitMohanBishtScorecardHistory } from './ScorecardHistory/LalitMohanBishtScorecardHistory'
import { NeeluSahu } from './Scorecard/NeeluSahu';
import { NeeluSahuScorecardHistory } from './ScorecardHistory/NeeluSahuScorecardHistory'
import { PoorwaGajbhiye } from './Scorecard/PoorwaGajbhiye';
import { PoorwaGajbhiyeScorecardHistory } from './ScorecardHistory/PoorwaGajbhiyeScorecardHistory'
import { PratimaVarthi } from './Scorecard/PratimaVarthi';
import { PratimaVarthiScorecardHistory } from './ScorecardHistory/PratimaVarthiScorecardHistory'
import { PraveenGupta } from './Scorecard/PraveenGupta';
import { PraveenGuptaScorecardHistory } from './ScorecardHistory/PraveenGuptaScorecardHistory'
import { SumanBalaSahu } from './Scorecard/SumanBalaSahu';
import { SumanBalaSahuScorecardHistory } from './ScorecardHistory/SumanBalaSahuScorecardHistory'
import { UmeshDhakkad } from './Scorecard/UmeshDhakkad';
import { UmeshDhakkadScorecardHistory } from './ScorecardHistory/UmeshDhakkadScorecardHistory'

export const BalanceScoreCard = () => {
  const [employees] = useState([
  { id: 1, name: "Ajay Upadhyay", department: "Account" },
  { id: 2, name: "Alok Pandey", department: "Marketing" },
  { id: 3, name: "Deepmala Patil", department: "OPD" },
  { id: 4, name: "Deepu Mourya", department: "TPA" },
  { id: 5, name: "Geetanjali Deep", department: "HR" },
  { id: 6, name: "Hansraj Singh", department: "Housekeeping" },
  { id: 7, name: "Isha Shrivastava", department: "Marketing" },
  { id: 8, name: "Jharna Ambulkar", department: "Admin" },
  { id: 9, name: "Lalit Mohan Bisht", department: "Operations" },
  { id: 10, name: "Neelu Sahu", department: "Operation" },
  { id: 11, name: "Poorwa Gajbhiye", department: "HR" },
  { id: 12, name: "Pratima Varthi", department: "Store" },
  { id: 13, name: "Praveen Gupta", department: "IT" },
  { id: 14, name: "Suman Bala Sahu", department: "Admin" },
  { id: 15, name: "Surbhi Netam", department: "Marketing" },
  { id: 16, name: "Umesh Dhakkad", department: "Pharmacy" }
]);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewType, setViewType] = useState(''); // 'scorecard' or 'history'

  const handleEmployeeClick = (employeeName, type) => {
    setSelectedEmployee(employeeName);
    setViewType(type);
  };

  const handleBackClick = () => {
    setSelectedEmployee(null);
    setViewType('');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-gray-50 z-10 py-2">
          <div className="flex items-center">
            {selectedEmployee && (
              <button
                onClick={handleBackClick}
                className="mr-4 px-3 py-2 bg-blue-800 text-white rounded hover:bg-gray-600 flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back
              </button>
            )}
            <h1 className="text-2xl font-bold text-gray-900">
              {selectedEmployee
                ? `${selectedEmployee}'s ${
                    viewType === "scorecard"
                      ? "Score Card"
                      : "Score Card History"
                  }`
                : "Balanced Score Card"}
            </h1>
            {selectedEmployee && (
              <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {viewType === "scorecard" ? "Score Card View" : "History View"}
              </span>
            )}
          </div>
          <div className="flex space-x-3">
            <button className="space-x-2 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span>Download</span>
            </button>
          </div>
        </div>

        {selectedEmployee ? (
          <div>
            {viewType === "scorecard" &&
              selectedEmployee === "Poorwa Gajbhiye" && <PoorwaGajbhiye />}
            {viewType === "history" &&
              selectedEmployee === "Poorwa Gajbhiye" && (
                <PoorwaGajbhiyeScorecardHistory />
              )}
            {viewType === "scorecard" &&
              selectedEmployee === "Geetanjali Deep" && <GeetanjaliDeep />}
            {viewType === "history" &&
              selectedEmployee === "Geetanjali Deep" && (
                <GeetanjaliDeepScorecardHistory />
              )}
            {viewType === "scorecard" &&
              selectedEmployee === "Deepmala Patil" && <DeepmalaPatil />}
            {viewType === "history" &&
              selectedEmployee === "Deepmala Patil" && (
                <DeepmalaPatilScorecardHistory />
              )}
            {viewType === "scorecard" &&
              selectedEmployee === "Lalit Mohan Bisht" && <LalitMohanBisht />}
            {viewType === "history" &&
              selectedEmployee === "Lalit Mohan Bisht" && (
                <LalitMohanBishtScorecardHistory />
              )}
            {viewType === "scorecard" &&
              selectedEmployee === "Ajay Upadhyay" && <AjayUpadhyay />}
            {viewType === "history" && selectedEmployee === "Ajay Upadhyay" && (
              <AjayUpadhyayScorecardHistory />
            )}
            {viewType === "scorecard" &&
              selectedEmployee === "Deepu Mourya" && <DeepuMourya />}
            {viewType === "history" && selectedEmployee === "Deepu Mourya" && (
              <DeepuMouryaScorecardHistory />
            )}
            {viewType === "scorecard" &&
              selectedEmployee === "Pratima Varthi" && <PratimaVarthi />}
            {viewType === "history" &&
              selectedEmployee === "Pratima Varthi" && (
                <PratimaVarthiScorecardHistory />
              )}
            {viewType === "scorecard" &&
              selectedEmployee === "Jharna Ambulkar" && <JharnaAmbulkar />}
            {viewType === "history" &&
              selectedEmployee === "Jharna Ambulkar" && (
                <JharnaAmbulkarScorecardHistory />
              )}
            {viewType === "scorecard" &&
              selectedEmployee === "Suman Bala Sahu" && <SumanBalaSahu />}
            {viewType === "history" &&
              selectedEmployee === "Suman Bala Sahu" && (
                <SumanBalaSahuScorecardHistory />
              )}
            {viewType === "scorecard" &&
              selectedEmployee === "Umesh Dhakkad" && <UmeshDhakkad />}
            {viewType === "history" && selectedEmployee === "Umesh Dhakkad" && (
              <UmeshDhakkadScorecardHistory />
            )}
            {viewType === "scorecard" &&
              selectedEmployee === "Hansraj Singh" && <HansrajSingh />}
            {viewType === "history" && selectedEmployee === "Hansraj Singh" && (
              <HansrajSinghScorecardHistory />
            )}
            {viewType === "scorecard" &&
              selectedEmployee === "Praveen Gupta" && <PraveenGupta />}
            {viewType === "history" && selectedEmployee === "Praveen Gupta" && (
              <PraveenGuptaScorecardHistory />
            )}
            {viewType === "scorecard" && selectedEmployee === "Alok Pandey" && (
              <AlokPandey />
            )}
            {viewType === "history" && selectedEmployee === "Alok Pandey" && (
              <AlokPandeyScorecardHistory />
            )}
            {viewType === "scorecard" && selectedEmployee === "Neelu Sahu" && (
              <NeeluSahu />
            )}
            {viewType === "history" && selectedEmployee === "Neelu Sahu" && (
              <NeeluSahuScorecardHistory />
            )}
            {![
              "Poorwa Gajbhiye",
              "Geetanjali Deep",
              "Deepmala Patil",
              "Lalit Mohan Bisht",
              "Ajay Upadhyay",
              "Deepu Mourya",
              "Pratima Varthi",
              "Jharna Ambulkar",
              "Suman Bala Sahu",
              "Umesh Dhakkad",
              "Hansraj Singh",
              "Praveen Gupta",
              "Alok Pandey",
              "Neelu Sahu",
            ].includes(selectedEmployee) && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Employee Details
                </h2>
                <p className="text-gray-600">
                  Details for {selectedEmployee} will be displayed here.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div
              className="overflow-x-auto"
              style={{ maxHeight: "calc(100vh - 180px)" }}
            >
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                  <tr>
                    <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0 text-center">
                      SN
                    </th>
                    <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0 text-center">
                      Employee Name
                    </th>
                    <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0 text-center">
                      Department
                    </th>
                    <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0 text-center">
                      Balance Score Card
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees.length > 0 ? (
                    employees.map((employee, index) => (
                      <tr
                        key={employee.id}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {employee.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center">
                            <div className="ml-4">
                              <button
                                onClick={() =>
                                  handleEmployeeClick(employee.name, "history")
                                }
                                className="text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none"
                              >
                                {employee.name}
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {employee.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center">
                            <div className="ml-4">
                              <button
                                onClick={() =>
                                  handleEmployeeClick(
                                    employee.name,
                                    "scorecard"
                                  )
                                }
                                className="text-sm font-medium px-6 py-2 rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none"
                              >
                                Click Here
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No employees available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BalanceScoreCard;