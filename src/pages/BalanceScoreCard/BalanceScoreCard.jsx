import { Activity } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { AjayUpadhyay } from './Scorecard/AjayUpadhyay';
import { AjayUpadhyayScorecardHistory } from './ScorecardHistory/AjayUpadhyayScorecardHistory'
import { AlokPandey } from './Scorecard/AlokPandey';
import { AlokPandeyScorecardHistory } from './ScorecardHistory/AlokPandeyScorecardHistory'
import { DeepmalaPatil } from './Scorecard/DeepmalaPatil';
import { DeepmalaPatilScorecardHistory } from './ScorecardHistory/DeepmalaPatilScorecardHistory'
import { DeepuMourya } from './Scorecard/DeepuMourya';
import { DeepuMouryaScorecardHistory } from './ScorecardHistory/DeepuMouryaScorecardHistory'
import { GeetanjaliDeep } from './Scorecard/GeetanjaliDeep';
import { GeetanjaliDeepScorecardHistory } from './ScorecardHistory/GeetanjaliDeepScorecardHistory'
import { UgrasenNayak } from './Scorecard/UgrasenNayak';
import { UgrasenNayakScorecardHistory } from './ScorecardHistory/UgrasenNayakScorecardHistory'
import { HarshRai } from './Scorecard/HarshRai';
import { HarshRaiScorecardHistory } from './ScorecardHistory/HarshRaiScorecardHistory';
import { JharnaAmbulkar } from './Scorecard/JharnaAmbulkar';
import { JharnaAmbulkarScorecardHistory } from './ScorecardHistory/JharnaAmbulkarScorecardHistory'
//import { LalitMohanBisht } from './Scorecard/LalitMohanBisht';
//import { LalitMohanBishtScorecardHistory } from './ScorecardHistory/LalitMohanBishtScorecardHistory'
import { AlkaDas } from './Scorecard/AlkaDas';
import { AlkaDasScorecardHistory } from './ScorecardHistory/AlkaDasScorecardHistory';
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
//import { IshaShrivastava } from './Scorecard/IshaShrivastava';
//import { IshaShrivastavaScorecardHistory } from './ScorecardHistory/IshaShrivastavaScorecardHistory';
import { MangeshSahu } from './Scorecard/MangeshSahu';
import { MangeshSahuScorecardHistory } from './ScorecardHistory/MangeshSahuScorecardHistory';
import { NighatParveen } from './Scorecard/NighatParveen';
import { NighatParveenScorecardHistory } from './ScorecardHistory/NighatParveenScorecardHistory';
import { PannaSenani } from './Scorecard/PannaSenani';
import { PannaSenaniScorecardHistory } from './ScorecardHistory/PannaSenaniScorecardHistory';
// import { SurbhiNetam } from './Scorecard/SurbhiNetam';
//import { SurbhiNetamScorecardHistory } from './ScorecardHistory/SurbhiNetamScorecardHistory';
//import { SumanGoud } from './Scorecard/SumanGoud';
import { NikhileshDavda } from './Scorecard/NikhileshDavda';
import { NikhileshDavdaScorecardHistory } from './ScorecardHistory/NikhileshDavdaScorecardHistory';
//import { SumanGoudScorecardHistory } from './ScorecardHistory/SumanGoudScorecardHistory';

export const BalanceScoreCard = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.Admin && user.Admin.trim().toLowerCase() === 'yes') {
          setIsAdmin(true);
        } else {
          navigate('/userBalanceScoreCard', { replace: true });
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/login', { replace: true });
      }
    } else {
      navigate('/login', { replace: true });
    }
    setIsLoading(false);
  }, [navigate]);

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
    //{ id: 10, name: "Lalit Mohan Bisht", department: "Operations" },
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
    //{ id: 20, name: "Suman Goud Kuntla", department: "COO- Operations" },
    //{ id: 21, name: "Surbhi Netam", department: "Marketing" },
    { id: 22, name: "Umesh Dhakkad", department: "Pharmacy" }
  ]);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewType, setViewType] = useState(''); // 'scorecard' or 'history'
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  // Date Range selections
  const years = ["2025", "2026", "2027"];
  const monthsList = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const [startMonth, setStartMonth] = useState("January");
  const [startYear, setStartYear] = useState("2026");
  const [endMonth, setEndMonth] = useState("December");
  const [endYear, setEndYear] = useState("2026");

  const downloadAllReports = async () => {
    setIsDownloadingAll(true);
    try {
      const sheetId = '162o34BXqnJvmJjjtIoQpcBGo8orn2ZO5Jf0p8MgoUCs';
      const appScriptUrl = 'https://script.google.com/macros/s/AKfycbw6xeabQpVzEnNMhLWfMAwLJ0hFZxA2L89aX17-p4b-caM4SdpsETrtq5GT4Lwk84qL/exec';
      const workbook = XLSX.utils.book_new();

      // Generate selected range of months
      const startIndex = monthsList.indexOf(startMonth);
      const endIndex = monthsList.indexOf(endMonth);
      const startYearVal = parseInt(startYear);
      const endYearVal = parseInt(endYear);

      const allMonths = [];
      for (let y = startYearVal; y <= endYearVal; y++) {
        const mStart = (y === startYearVal) ? startIndex : 0;
        const mEnd = (y === endYearVal) ? endIndex : 11;
        for (let m = mStart; m <= mEnd; m++) {
          allMonths.push(`${monthsList[m]} ${y}`);
        }
      }

      if (allMonths.length === 0) {
        alert("Invalid Date Range Selected!");
        setIsDownloadingAll(false);
        return;
      }

      // Fetch in parallel with limit or sequentially
      for (const emp of employees) {
        try {
          const response = await fetch(
            `${appScriptUrl}?sheetId=${sheetId}&sheetName=${encodeURIComponent(emp.name)}`
          );
          if (!response.ok) continue;
          const result = await response.json();
          if (result.success && result.data && result.data.length > 5) {
            const dataRows = result.data.slice(5);

            // Let's find the header row index
            let headerRowIdx = 5;
            for (let i = 0; i < Math.min(result.data.length, 10); i++) {
              if (result.data[i] && result.data[i][0] && result.data[i][0].toString().toLowerCase().trim() === 'timestamp') {
                headerRowIdx = i;
                break;
              }
            }
            const headers = result.data[headerRowIdx] || [];
            
            // Helper variable to find indices dynamically
            let targetScoreIdx = -1;
            let actualScoreIdx = -1;
            let oppLossIdx = -1;
            let overallTargetIdx = -1;
            let overallActualIdx = -1;
            let overallOppLossIdx = -1;
            let overallPercentageIdx = -1;

            headers.forEach((h, idx) => {
              const txt = h.toString().toLowerCase().trim();
              if (txt === 'target score') {
                targetScoreIdx = idx;
              } else if (txt === 'actual score') {
                actualScoreIdx = idx;
              } else if (txt === 'overall target') {
                overallTargetIdx = idx;
              } else if (txt === 'overall actual') {
                overallActualIdx = idx;
              } else if (txt === 'overall opportunity loss' || txt === 'overall opp loss' || txt === 'overall opp. loss') {
                overallOppLossIdx = idx;
              } else if (txt === 'overall percentage') {
                overallPercentageIdx = idx;
              }
            });

            // Opportunity loss column is trickier because there might be multiple (job opp loss and delegation opp loss).
            // Usually, job opp loss is the first "opportunity loss" column.
            for (let idx = 0; idx < headers.length; idx++) {
              const txt = headers[idx].toString().toLowerCase().trim();
              if (txt === 'opportunity loss') {
                oppLossIdx = idx;
                break;
              }
            }

            // Fallback to end-of-row offsets if not found dynamically
            const len = headers.length || 72; // default length
            if (targetScoreIdx === -1) {
              const hasDelegation = headers.some(h => h.toString().toLowerCase().includes('delegation'));
              if (hasDelegation) {
                targetScoreIdx = len - 10;
                actualScoreIdx = len - 9;
                oppLossIdx = len - 8;
              } else {
                targetScoreIdx = len - 9;
                actualScoreIdx = len - 8;
                oppLossIdx = len - 7;
              }
            }
            if (overallTargetIdx === -1) overallTargetIdx = len - 4;
            if (overallActualIdx === -1) overallActualIdx = len - 3;
            if (overallOppLossIdx === -1) overallOppLossIdx = len - 2;
            if (overallPercentageIdx === -1) overallPercentageIdx = len - 1;

            // Helper function to normalize month formatting (handling strings like 'November 2025' and Dates alike)
            const normalizeMonth = (monthString) => {
              if (!monthString) return "";
              try {
                const str = monthString.toString().trim();
                if (str.match(/^[A-Za-z]+\s\d{4}$/)) {
                  return str.toLowerCase();
                }
                const date = new Date(str);
                if (!isNaN(date.getTime())) {
                  return date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  }).toLowerCase();
                }
                return str.toLowerCase();
              } catch {
                return monthString.toString().toLowerCase();
              }
            };

            // Build history sheet structure matching the dashboard history view
            const reportRows = [
              [`Employee Balance Scorecard Report (${startMonth} ${startYear} to ${endMonth} ${endYear})`],
              ["Employee Name:", emp.name, "Department:", emp.department],
              [],
              ["Timestamp", "Month", "Employee Name", "Target Score", "Actual Score", "Opportunity Loss", "Overall Target", "Overall Actual", "Overall Opportunity Loss", "Overall Percentage", "Submission Status"]
            ];

            allMonths.forEach(month => {
              const matchingRows = dataRows.filter(row => row[1] && normalizeMonth(row[1]) === month.toLowerCase());
              
              if (matchingRows.length > 0) {
                matchingRows.forEach(row => {
                  const submittedBy = row[2] === "User" ? "User" : "COO";
                  const status = submittedBy === "User" ? "Pending COO Evaluation" : "Fully Completed";
                  
                  reportRows.push([
                    row[0] || "-", // Timestamp
                    month, // Month
                    emp.name, // Employee Name
                    row[targetScoreIdx] !== undefined && row[targetScoreIdx] !== "" ? row[targetScoreIdx] : "-",
                    row[actualScoreIdx] !== undefined && row[actualScoreIdx] !== "" ? row[actualScoreIdx] : "-",
                    row[oppLossIdx] !== undefined && row[oppLossIdx] !== "" ? row[oppLossIdx] : "-",
                    row[overallTargetIdx] !== undefined && row[overallTargetIdx] !== "" ? row[overallTargetIdx] : "-",
                    row[overallActualIdx] !== undefined && row[overallActualIdx] !== "" ? row[overallActualIdx] : "-",
                    row[overallOppLossIdx] !== undefined && row[overallOppLossIdx] !== "" ? row[overallOppLossIdx] : "-",
                    row[overallPercentageIdx] !== undefined && row[overallPercentageIdx] !== "" ? (typeof row[overallPercentageIdx] === 'number' ? `${row[overallPercentageIdx]}%` : row[overallPercentageIdx]) : "-",
                    status
                  ]);
                });
              } else {
                reportRows.push([
                  "-", // Timestamp
                  month, // Month
                  emp.name, // Employee Name
                  "-", // Target Score
                  "-", // Actual Score
                  "-", // Opportunity Loss
                  "-", // Overall Target
                  "-", // Overall Actual
                  "-", // Overall Opportunity Loss
                  "-", // Overall Percentage
                  "Not Filled" // Submission Status
                ]);
              }
            });

            const worksheet = XLSX.utils.aoa_to_sheet(reportRows);
            XLSX.utils.book_append_sheet(workbook, worksheet, emp.name.substring(0, 31));
          } else {
            const reportRows = [
              [`Employee Balance Scorecard Report (${startMonth} ${startYear} to ${endMonth} ${endYear})`],
              ["Employee Name:", emp.name, "Department:", emp.department],
              [],
              ["Month", "Status", "Overall Target", "Overall Actual", "Overall Percentage", "Submission Status"]
            ];
            allMonths.forEach(month => {
              reportRows.push([month, "Pending", "-", "-", "-", "Not Filled"]);
            });
            const worksheet = XLSX.utils.aoa_to_sheet(reportRows);
            XLSX.utils.book_append_sheet(workbook, worksheet, emp.name.substring(0, 31));
          }
        } catch (error) {
          console.error(`Error generating report for ${emp.name}:`, error);
        }
      }

      XLSX.writeFile(workbook, `All_Employees_Balance_Scorecard_Report_${startYear}_${endYear}.xlsx`);
      alert("Consolidated reports downloaded successfully!");
    } catch (error) {
      console.error("Error downloading consolidated reports:", error);
      alert("Failed to download reports.");
    } finally {
      setIsDownloadingAll(false);
    }
  };

  const handleEmployeeClick = (employeeName, type) => {
    setSelectedEmployee(employeeName);
    setViewType(type);
  };

  const handleBackClick = () => {
    setSelectedEmployee(null);
    setViewType('');
  };

  if (isLoading || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
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
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-white p-1 rounded border shadow-sm text-xs">
                <span className="text-gray-500 font-medium px-1">From:</span>
                <select 
                  value={startMonth} 
                  onChange={(e) => setStartMonth(e.target.value)}
                  className="bg-transparent outline-none cursor-pointer text-gray-700 font-semibold"
                >
                  {monthsList.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <select 
                  value={startYear} 
                  onChange={(e) => setStartYear(e.target.value)}
                  className="bg-transparent outline-none cursor-pointer text-gray-700 font-semibold border-l pl-1"
                >
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-1 bg-white p-1 rounded border shadow-sm text-xs">
                <span className="text-gray-500 font-medium px-1">To:</span>
                <select 
                  value={endMonth} 
                  onChange={(e) => setEndMonth(e.target.value)}
                  className="bg-transparent outline-none cursor-pointer text-gray-700 font-semibold"
                >
                  {monthsList.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <select 
                  value={endYear} 
                  onChange={(e) => setEndYear(e.target.value)}
                  className="bg-transparent outline-none cursor-pointer text-gray-700 font-semibold border-l pl-1"
                >
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              <button 
                onClick={downloadAllReports}
                disabled={isDownloadingAll}
                className={`px-4 py-2 text-white rounded flex items-center text-sm md:text-base font-semibold shadow-md ${isDownloadingAll ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
              >
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
                <span>{isDownloadingAll ? 'Downloading...' : 'Download Report'}</span>
              </button>
            </div>
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
            {/* {viewType === "scorecard" &&
              selectedEmployee === "Alka Das" && <LalitMohanBisht />}
            {viewType === "history" &&
              selectedEmployee === "Alka Das" && (
                <LalitMohanBishtScorecardHistory />
              )} */}
            {viewType === "scorecard" &&
              selectedEmployee === "Alka Das" && <AlkaDas />}
            {viewType === "history" && selectedEmployee === "Alka Das" && (
              <AlkaDasScorecardHistory />
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
              selectedEmployee === "Ugrasen Nayak" && <UgrasenNayak />}
            {viewType === "history" && selectedEmployee === "Ugrasen Nayak" && (
              <UgrasenNayakScorecardHistory />
            )}
            {viewType === "scorecard" &&
              selectedEmployee === "Harsh Rai" && <HarshRai />}
            {viewType === "history" && selectedEmployee === "Harsh Rai" && (
              <HarshRaiScorecardHistory />
            )}
            {/* {viewType === "scorecard" &&
              selectedEmployee === "Isha Shrivastava" && <IshaShrivastava />}
            {viewType === "history" && selectedEmployee === "Isha Shrivastava" && (
              <IshaShrivastavaScorecardHistory />
            )} */}
            {viewType === "scorecard" &&
              selectedEmployee === "Mangesh Sahu" && <MangeshSahu />}
            {viewType === "history" && selectedEmployee === "Mangesh Sahu" && (
              <MangeshSahuScorecardHistory />
            )}
            {viewType === "scorecard" &&
              selectedEmployee === "Nighat Parveen" && <NighatParveen />}
            {viewType === "history" && selectedEmployee === "Nighat Parveen" && (
              <NighatParveenScorecardHistory />
            )}
            {viewType === "scorecard" &&
              selectedEmployee === "Panna Senani" && <PannaSenani />}
            {viewType === "history" && selectedEmployee === "Panna Senani" && (
              <PannaSenaniScorecardHistory />
            )}
            {viewType === "scorecard" &&
              selectedEmployee === "Praveen Gupta" && <PraveenGupta />}
            {viewType === "history" && selectedEmployee === "Praveen Gupta" && (
              <PraveenGuptaScorecardHistory />
            )}
            {/* {viewType === "scorecard" &&
              selectedEmployee === "Surbhi Netam" && <SurbhiNetam />}
            {viewType === "history" && selectedEmployee === "Surbhi Netam" && (
              <SurbhiNetamScorecardHistory />
            )} */}
            {/* {viewType === "scorecard" &&
              selectedEmployee === "Suman Goud Kuntla" && <SumanGoud />}
            {viewType === "history" && selectedEmployee === "Suman Goud Kuntla" && (
              <SumanGoudScorecardHistory />
            )} */}
            {viewType === "scorecard" && selectedEmployee === "Nikhilesh Davda" && (
              <NikhileshDavda />
            )}
            {viewType === "history" && selectedEmployee === "Nikhilesh Davda" && (
              <NikhileshDavdaScorecardHistory />
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
              "Ajay Upadhyay",
              "Poorwa Gajbhiye",
              "Geetanjali Deep",
              "Deepmala Patil",
              // "Alka Das",
              "Alka Das",
              "Deepu Mourya",
              "Pratima Varthi",
              "Jharna Ambulkar",
              "Suman Bala Sahu",
              "Umesh Dhakkad",
              "Ugrasen Nayak",
              "Harsh Rai",
              //"Surbhi Netam",
              //"Isha Shrivastava",
              "Panna Senani",
              "Alok Pandey",
              "Mangesh Sahu",
              "Nighat Parveen",
              "Praveen Gupta",
              //"Suman Goud Kuntla",
              "Nikhilesh Davda",
              "Neelu Sahu",
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
                    {employees.length > 0 ? (
                      employees.map((employee, index) => (
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
                {employees.length > 0 ? (
                  <div className="space-y-0">
                    {employees.map((employee, index) => (
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

export default BalanceScoreCard;
