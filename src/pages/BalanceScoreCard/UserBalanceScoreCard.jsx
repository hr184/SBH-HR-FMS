import { Activity } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAjayUpadhyay } from './UserScorecard/UserAjayUpadhyay';
import { UserAlokPandey } from './UserScorecard/UserAlokUpadhyay';
import { UserDeepmalaPatil } from './UserScorecard/UserDeepmalaPatil';
import { UserDeepuMourya } from './UserScorecard/UserDeepuMourya';
import { UserGeetanjaliDeep } from './UserScorecard/UserGeetanjaliDeep';
import { UserUgrasenNayak } from './UserScorecard/UserUgrasenNayak';
import { UserIshaShrivastava } from './UserScorecard/UserIshaShrivastava';
import { UserHarshRai } from './UserScorecard/UserHarshRai';
import { UserJharnaAmbulkar } from './UserScorecard/UserJharnaAmbulkar';
//import { UserLalitMohanBisht } from './UserScorecard/UserLalitMohanBisht';
import { UserMangeshSahu } from './UserScorecard/UserMangeshSahu';
import { UserNeeluSahu } from './UserScorecard/UserNeeluSahu';
import { UserNighatParveen } from './UserScorecard/UserNighatParveen';
import { UserPannaSenani } from './UserScorecard/UserPannaSenani';
import { UserPoorwaGajbhiye } from './UserScorecard/UserPoorwaGajbhiye';
import { UserPratimaVarthi } from './UserScorecard/UserPratimaVarthi';
import { UserPraveenGupta } from './UserScorecard/UserPraveenGupta';
import { UserSumanBalaSahu } from './UserScorecard/UserSumanBalaSahu';
// import { UserSurbhiNetam } from './UserScorecard/UserSurbhiNetam';
import { UserUmeshDhakkad } from './UserScorecard/UserUmeshDhakkad';
// import { UserSumanGoud } from './UserScorecard/UserSumanGoud';   
import { UserNikhileshDavda } from './UserScorecard/UserNikhileshDavda';
import { UserAlkaDas } from './UserScorecard/UserAlkaDas';
import { AjayUpadhyayScorecardHistory } from './ScorecardHistory/AjayUpadhyayScorecardHistory'
import { AlokPandeyScorecardHistory } from './ScorecardHistory/AlokPandeyScorecardHistory'
import { DeepmalaPatilScorecardHistory } from './ScorecardHistory/DeepmalaPatilScorecardHistory'
import { DeepuMouryaScorecardHistory } from './ScorecardHistory/DeepuMouryaScorecardHistory'
import { GeetanjaliDeepScorecardHistory } from './ScorecardHistory/GeetanjaliDeepScorecardHistory'
import { UgrasenNayakScorecardHistory } from './ScorecardHistory/UgrasenNayakScorecardHistory'
import { HarshRaiScorecardHistory } from './ScorecardHistory/HarshRaiScorecardHistory';
import { JharnaAmbulkarScorecardHistory } from './ScorecardHistory/JharnaAmbulkarScorecardHistory'
import { AlkaDasScorecardHistory } from './ScorecardHistory/AlkaDasScorecardHistory';
import { NeeluSahuScorecardHistory } from './ScorecardHistory/NeeluSahuScorecardHistory'
import { PoorwaGajbhiyeScorecardHistory } from './ScorecardHistory/PoorwaGajbhiyeScorecardHistory'
import { PratimaVarthiScorecardHistory } from './ScorecardHistory/PratimaVarthiScorecardHistory'
import { PraveenGuptaScorecardHistory } from './ScorecardHistory/PraveenGuptaScorecardHistory'
import { SumanBalaSahuScorecardHistory } from './ScorecardHistory/SumanBalaSahuScorecardHistory'
import { UmeshDhakkadScorecardHistory } from './ScorecardHistory/UmeshDhakkadScorecardHistory'
import { MangeshSahuScorecardHistory } from './ScorecardHistory/MangeshSahuScorecardHistory';
import { NighatParveenScorecardHistory } from './ScorecardHistory/NighatParveenScorecardHistory';
import { PannaSenaniScorecardHistory } from './ScorecardHistory/PannaSenaniScorecardHistory';
import { NikhileshDavdaScorecardHistory } from './ScorecardHistory/NikhileshDavdaScorecardHistory';

export const UserBalanceScoreCard = () => {
  const navigate = useNavigate();
  const [employees] = useState([
    { id: 1, name: "Ajay Upadhyay", department: "Account" },
    { id: 2, name: "Alok Pandey", department: "Marketing" },
    { id: 3, name: "Deepmala Patil", department: "OPD" },
    { id: 4, name: "Deepu Mourya", department: "TPA" },
    { id: 5, name: "Geetanjali Deep", department: "HR" },
    { id: 6, name: "Ugrasen Nayak", department: "Housekeeping" },
    { id: 7, name: "Harsh Rai", department: "Marketing" },
    { id: 8, name: "Isha Shrivastava", department: "Marketing" },
    { id: 9, name: "Jharna Ambulkar", department: "Admin" },
    { id: 10, name: "Alka Das", department: "Operations" },
    { id: 11, name: "Mangesh Sahu", department: "Marketing" },
    { id: 12, name: "Neelu Sahu", department: "Operation" },
    { id: 13, name: "Nighat Parveen", department: "Marketing" },
    { id: 14, name: "Panna Senani", department: "Accounts" },
    { id: 15, name: "Poorwa Gajbhiye", department: "HR" },
    { id: 16, name: "Pratima Varthi", department: "Store" },
    { id: 17, name: "Praveen Gupta", department: "IT" },
    { id: 18, name: "Suman Bala Sahu", department: "Admin" },
    { id: 19, name: "Nikhilesh Davda", department: "COO" },
    // { id: 20, name: "Suman Goud Kuntla", department: "COO- Operations" },
    // { id: 21, name: "Surbhi Netam", department: "Marketing" },
    { id: 22, name: "Umesh Dhakkad", department: "Pharmacy" }
  ]);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewType, setViewType] = useState(''); // 'scorecard' or 'history'
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Get logged-in user from localStorage
      const userDataString = localStorage.getItem('user');
      if (!userDataString) {
        setError("Please log in to view your scorecard.");
        setIsLoading(false);
        return;
      }

      try {
        const user = JSON.parse(userDataString);
        
        // Find admin property case-insensitively
        const adminKey = Object.keys(user).find(k => k.toLowerCase() === 'admin');
        const isAdmin = user[adminKey]?.toString().toLowerCase() === 'yes';

        // If user is admin, redirect to admin scorecard view
        if (isAdmin) {
          navigate('/balanceScoreCard', { replace: true });
          return;
        }

        // Find the name property dynamically (look for "Name", "User", "Employee", etc.)
        const nameKey = Object.keys(user).find(k => 
          k.toLowerCase().includes('name') || 
          k.toLowerCase().includes('user')
        );
        const loggedInUserName = nameKey ? user[nameKey] : (user.Name || user.Username || '');

        if (!loggedInUserName) {
          setError("Could not identify your name from your profile. Please contact HR.");
          setIsLoading(false);
          return;
        }

        // Find matching employee with flexible comparison
        const sheetName = loggedInUserName.toString().toLowerCase().trim();
        
        // 1. Try exact match first
        let matchedEmployee = employees.find(emp =>
          emp.name.toLowerCase().trim() === sheetName
        );

        // 2. If no exact match, try partial match (fuzzy)
        if (!matchedEmployee && sheetName.length > 3) {
          matchedEmployee = employees.find(emp => {
            const registryName = emp.name.toLowerCase().trim();
            return registryName.includes(sheetName) || sheetName.includes(registryName);
          });
        }

        if (matchedEmployee) {
          // Filter to show only this employee in the list
          setFilteredEmployees([matchedEmployee]);
          // Reset selection so the user sees the list first
          setSelectedEmployee(null);
          setViewType('');
          setError(null);
        } else {
          // User not found in employee list
          setFilteredEmployees([]);
          setError(`Your employee profile ("${loggedInUserName}") was not found in the scorecard registry. Please contact HR to ensure your name matches.`);
        }
      } catch (error) {
        console.error('Error processing user data:', error);
        setError("Session error. Please log in again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [employees, navigate]);

  const handleEmployeeClick = (employeeName, type) => {
    setSelectedEmployee(employeeName);
    setViewType(type);
  };

  const handleBackClick = () => {
    setSelectedEmployee(null);
    setViewType('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center border-t-4 border-red-500">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-6 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col mb-4 md:mb-6 sticky top-0 bg-gray-50 z-10 py-2 space-y-3">
          {/* Top Row - Buttons */}
          <div className="flex justify-between items-center w-full">
            {selectedEmployee && (
              <button
                onClick={handleBackClick}
                className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-700 flex items-center text-sm md:text-base"
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
            <div className="flex-1"></div> {/* Spacer */}
            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center text-sm md:text-base">
              <svg
                className="w-4 h-4 mr-2"
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

          {/* Bottom Row - Title and View Type */}
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
            <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center md:text-left">
                {selectedEmployee ? selectedEmployee : "Balanced Scorecard"}
              </h1>
              {selectedEmployee && (
                <span className="ml-0 md:ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm md:text-base text-center md:text-left mt-1 md:mt-0">
                  {viewType === "scorecard"
                    ? "Score Card View"
                    : "History View"}
                </span>
              )}
            </div>
          </div>
        </div>

        {selectedEmployee ? (
          <div>
            {viewType === "scorecard" &&
              selectedEmployee === "Ajay Upadhyay" && <UserAjayUpadhyay />}
            {viewType === "scorecard" &&
              selectedEmployee === "Alok Pandey" && <UserAlokPandey />}
            {viewType === "scorecard" &&
              selectedEmployee === "Deepmala Patil" && <UserDeepmalaPatil />}
            {viewType === "scorecard" &&
              selectedEmployee === "Deepu Mourya" && <UserDeepuMourya />}
            {viewType === "scorecard" &&
              selectedEmployee === "Geetanjali Deep" && <UserGeetanjaliDeep />}
            {viewType === "scorecard" &&
              selectedEmployee === "Ugrasen Nayak" && <UserUgrasenNayak />}
            {viewType === "scorecard" &&
              selectedEmployee === "Harsh Rai" && <UserHarshRai />}
            {/* {viewType === "scorecard" &&
              selectedEmployee === "Isha Shrivastava" && <UserIshaShrivastava />} */}
            {viewType === "scorecard" &&
              selectedEmployee === "Jharna Ambulkar" && <UserJharnaAmbulkar />}
            {/* {viewType === "scorecard" &&
              selectedEmployee === "Lalit Mohan Bisht" && <UserLalitMohanBisht />} */}
            {viewType === "scorecard" &&
              selectedEmployee === "Alka Das" && <UserAlkaDas />}
            {viewType === "scorecard" &&
              selectedEmployee === "Mangesh Sahu" && <UserMangeshSahu />}
            {viewType === "scorecard" &&
              selectedEmployee === "Neelu Sahu" && <UserNeeluSahu />}
            {viewType === "scorecard" &&
              selectedEmployee === "Nighat Parveen" && <UserNighatParveen />}
            {viewType === "scorecard" &&
              selectedEmployee === "Panna Senani" && <UserPannaSenani />}
            {viewType === "scorecard" &&
              selectedEmployee === "Poorwa Gajbhiye" && <UserPoorwaGajbhiye />}
            {viewType === "scorecard" &&
              selectedEmployee === "Pratima Varthi" && <UserPratimaVarthi />}
            {viewType === "scorecard" &&
              selectedEmployee === "Praveen Gupta" && <UserPraveenGupta />}
            {viewType === "scorecard" &&
              selectedEmployee === "Suman Bala Sahu" && <UserSumanBalaSahu />}
            {/* {viewType === "scorecard" &&
              selectedEmployee === "Suman Goud Kuntla" && <UserSumanGoud />} */}
            {viewType === "scorecard" &&
              selectedEmployee === "Nikhilesh Davda" && <UserNikhileshDavda />}
            {/* {viewType === "scorecard" &&
              selectedEmployee === "Surbhi Netam" && <UserSurbhiNetam />} */}
            {viewType === "scorecard" &&
              selectedEmployee === "Umesh Dhakkad" && <UserUmeshDhakkad />}
            
            {/* History Views */}
            {viewType === "history" && selectedEmployee === "Ajay Upadhyay" && <AjayUpadhyayScorecardHistory />}
            {viewType === "history" && selectedEmployee === "Alok Pandey" && <AlokPandeyScorecardHistory />}
            {viewType === "history" && selectedEmployee === "Deepmala Patil" && <DeepmalaPatilScorecardHistory />}
            {viewType === "history" && selectedEmployee === "Deepu Mourya" && <DeepuMouryaScorecardHistory />}
            {viewType === "history" && selectedEmployee === "Geetanjali Deep" && <GeetanjaliDeepScorecardHistory />}
            {viewType === "history" && selectedEmployee === "Ugrasen Nayak" && <UgrasenNayakScorecardHistory />}
            {viewType === "history" && selectedEmployee === "Harsh Rai" && <HarshRaiScorecardHistory />}
            {viewType === "history" && selectedEmployee === "Jharna Ambulkar" && <JharnaAmbulkarScorecardHistory />}
            {viewType === "history" && selectedEmployee === "Alka Das" && <AlkaDasScorecardHistory />}
            {viewType === "history" && selectedEmployee === "Mangesh Sahu" && <MangeshSahuScorecardHistory />}
            {viewType === "history" && selectedEmployee === "Neelu Sahu" && <NeeluSahuScorecardHistory />}
            {viewType === "history" && selectedEmployee === "Nighat Parveen" && <NighatParveenScorecardHistory />}
            {viewType === "history" && selectedEmployee === "Panna Senani" && <PannaSenaniScorecardHistory />}
            {viewType === "history" && selectedEmployee === "Poorwa Gajbhiye" && <PoorwaGajbhiyeScorecardHistory />}
            {viewType === "history" && selectedEmployee === "Pratima Varthi" && <PratimaVarthiScorecardHistory />}
            {viewType === "history" && selectedEmployee === "Praveen Gupta" && <PraveenGuptaScorecardHistory />}
            {viewType === "history" && selectedEmployee === "Suman Bala Sahu" && <SumanBalaSahuScorecardHistory />}
            {viewType === "history" && selectedEmployee === "Umesh Dhakkad" && <UmeshDhakkadScorecardHistory />}
            {viewType === "history" && selectedEmployee === "Nikhilesh Davda" && <NikhileshDavdaScorecardHistory />}
            {![
              "Ajay Upadhyay",
              "Alok Pandey",
              "Deepmala Patil",
              "Deepu Mourya",
              "Geetanjali Deep",
              "Ugrasen Nayak",
              "Harsh Rai",
              //"Isha Shrivastava",
              "Jharna Ambulkar",
              "Alka Das",
              "Mangesh Sahu",
              "Neelu Sahu",
              "Nighat Parveen",
              "Panna Senani",
              "Poorwa Gajbhiye",
              "Pratima Varthi",
              "Praveen Gupta",
              "Suman Bala Sahu",
              // "Suman Goud Kuntla",
              "Nikhilesh Davda",
              //"Surbhi Netam",
              "Umesh Dhakkad",
            ].includes(selectedEmployee) && (
                <div className="bg-white rounded-lg shadow p-4 md:p-6">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
                    Employee Details
                  </h2>
                  <p className="text-gray-600">
                    Details for {selectedEmployee} will be displayed here.
                  </p>
                </div>
              )}
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
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
                        Balance Scorecard
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEmployees.length > 0 ? (
                      filteredEmployees.map((employee, index) => (
                        <tr
                          key={employee.id}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center justify-center">
                              <div className="ml-4">
                                <button
                                  onClick={() =>
                                    handleEmployeeClick(
                                      employee.name,
                                      "history"
                                    )
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

            {/* Mobile Card View */}
            <div className="md:hidden bg-white rounded-lg shadow overflow-hidden">
              <div className="p-0">
                {filteredEmployees.length > 0 ? (
                  <div className="space-y-0">
                    {filteredEmployees.map((employee, index) => (
                      <div
                        key={employee.id}
                        className={`p-4 border-b border-gray-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-500 mr-3">
                              {index + 1}.
                            </span>
                            <button
                              onClick={() =>
                                handleEmployeeClick(employee.name, "history")
                              }
                              className="text-base font-semibold text-blue-600 hover:text-blue-800 focus:outline-none text-left"
                            >
                              {employee.name}
                            </button>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-sm text-gray-600">
                              Department :
                            </span>
                            <span className="text-sm font-medium text-gray-800 ml-2">
                              {employee.department}
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              handleEmployeeClick(employee.name, "scorecard")
                            }
                            className="text-sm font-medium px-4 py-2 rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none"
                          >
                            Scorecard
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    No employees available
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
