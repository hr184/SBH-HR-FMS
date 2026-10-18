import { Activity, FileText, Users, Search, CheckCircle, XCircle, Sliders, Settings, RefreshCw, X, ShieldAlert } from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { MonthlyScorecardReport } from './MonthlyScorecardReport';
import { AjayUpadhyay } from './Scorecard/AjayUpadhyay';
import { AjayUpadhyayScorecardHistory } from './ScorecardHistory/AjayUpadhyayScorecardHistory';
import { AlokPandey } from './Scorecard/AlokPandey';
import { AlokPandeyScorecardHistory } from './ScorecardHistory/AlokPandeyScorecardHistory';
import { DeepmalaPatil } from './Scorecard/DeepmalaPatil';
import { DeepmalaPatilScorecardHistory } from './ScorecardHistory/DeepmalaPatilScorecardHistory';
import { DeepuMourya } from './Scorecard/DeepuMourya';
import { DeepuMouryaScorecardHistory } from './ScorecardHistory/DeepuMouryaScorecardHistory';
import { GeetanjaliDeep } from './Scorecard/GeetanjaliDeep';
import { GeetanjaliDeepScorecardHistory } from './ScorecardHistory/GeetanjaliDeepScorecardHistory';
import { UgrasenNayak } from './Scorecard/UgrasenNayak';
import { UgrasenNayakScorecardHistory } from './ScorecardHistory/UgrasenNayakScorecardHistory';
import { HarshRai } from './Scorecard/HarshRai';
import { HarshRaiScorecardHistory } from './ScorecardHistory/HarshRaiScorecardHistory';
import { JharnaAmbulkar } from './Scorecard/JharnaAmbulkar';
import { JharnaAmbulkarScorecardHistory } from './ScorecardHistory/JharnaAmbulkarScorecardHistory';
import { LalitMohanBisht } from './Scorecard/LalitMohanBisht';
import { LalitMohanBishtScorecardHistory } from './ScorecardHistory/LalitMohanBishtScorecardHistory';
import { SwapnilJain, AlkaDas } from './Scorecard/SwapnilJain';
import { SwapnilJainScorecardHistory, AlkaDasScorecardHistory } from './ScorecardHistory/SwapnilJainScorecardHistory';
import { NeeluSahu } from './Scorecard/NeeluSahu';
import { NeeluSahuScorecardHistory } from './ScorecardHistory/NeeluSahuScorecardHistory';
import { ManaswiMaity, PoorwaGajbhiye } from './Scorecard/ManaswiMaity';
import { ManaswiMaityScorecardHistory, PoorwaGajbhiyeScorecardHistory } from './ScorecardHistory/ManaswiMaityScorecardHistory';
import { PratimaVarthi } from './Scorecard/PratimaVarthi';
import { PratimaVarthiScorecardHistory } from './ScorecardHistory/PratimaVarthiScorecardHistory';
import { PraveenGupta } from './Scorecard/PraveenGupta';
import { PraveenGuptaScorecardHistory } from './ScorecardHistory/PraveenGuptaScorecardHistory';
import { SumanBalaSahu } from './Scorecard/SumanBalaSahu';
import { SumanBalaSahuScorecardHistory } from './ScorecardHistory/SumanBalaSahuScorecardHistory';
import { UmeshDhakkad } from './Scorecard/UmeshDhakkad';
import { UmeshDhakkadScorecardHistory } from './ScorecardHistory/UmeshDhakkadScorecardHistory';
import { IshaShrivastava } from './Scorecard/IshaShrivastava';
import { IshaShrivastavaScorecardHistory } from './ScorecardHistory/IshaShrivastavaScorecardHistory';
import { MangeshSahu } from './Scorecard/MangeshSahu';
import { MangeshSahuScorecardHistory } from './ScorecardHistory/MangeshSahuScorecardHistory';
import { NighatParveen } from './Scorecard/NighatParveen';
import { NighatParveenScorecardHistory } from './ScorecardHistory/NighatParveenScorecardHistory';
import { PannaSenani } from './Scorecard/PannaSenani';
import { PannaSenaniScorecardHistory } from './ScorecardHistory/PannaSenaniScorecardHistory';
import { SurbhiNetam } from './Scorecard/SurbhiNetam';
import { SurbhiNetamScorecardHistory } from './ScorecardHistory/SurbhiNetamScorecardHistory';
import { SumanGoud } from './Scorecard/SumanGoud';
import { SumanGoudScorecardHistory } from './ScorecardHistory/SumanGoudScorecardHistory';
import { NikhileshDavda } from './Scorecard/NikhileshDavda';
import { NikhileshDavdaScorecardHistory } from './ScorecardHistory/NikhileshDavdaScorecardHistory';

// Dedicated LocalStorage Key for Balance Score Card Employee Status
const SCORECARD_STATUS_KEY = 'scorecard_employee_status';

// Default Inactive Employees (previously commented out)
const DEFAULT_INACTIVE = [
  "Lalit Mohan Bisht",
  "Suman Goud Kuntla",
  "Surbhi Netam"
];

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
    { id: 10, name: "Lalit Mohan Bisht", department: "Operations" },
    { id: 11, name: "Swapnil Jain", department: "Operations" },
    { id: 12, name: "Mangesh Sahu", department: "Marketing" },
    { id: 13, name: "Neelu Sahu", department: "Operation" },
    { id: 14, name: "Nighat Parveen", department: "Marketing" },
    { id: 15, name: "Panna Senani", department: "Accounts" },
    { id: 16, name: "Manaswi Maity", department: "HR" },
    { id: 17, name: "Pratima Varthi", department: "Store" },
    { id: 18, name: "Praveen Gupta", department: "IT" },
    { id: 19, name: "Suman Bala Sahu", department: "Admin" },
    { id: 20, name: "Nikhilesh Davda", department: "COO" },
    { id: 21, name: "Suman Goud Kuntla", department: "COO- Operations" },
    { id: 22, name: "Surbhi Netam", department: "Marketing" },
    { id: 23, name: "Umesh Dhakkad", department: "Pharmacy" }
  ]);

  // Employee status state: { [employeeName]: boolean (true = active, false = inactive) }
  const [employeeStatus, setEmployeeStatus] = useState(() => {
    try {
      const saved = localStorage.getItem(SCORECARD_STATUS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to parse scorecard_employee_status:", e);
    }
    const initial = {};
    DEFAULT_INACTIVE.forEach(name => {
      initial[name] = false;
    });
    return initial;
  });

  const isEmployeeActive = (empName) => {
    if (employeeStatus[empName] !== undefined) {
      return employeeStatus[empName] === true;
    }
    return !DEFAULT_INACTIVE.includes(empName);
  };

  const toggleEmployeeStatus = (empName, e) => {
    if (e) e.stopPropagation();
    const currentlyActive = isEmployeeActive(empName);
    const newStatus = !currentlyActive;
    setEmployeeStatus(prev => {
      const updated = { ...prev, [empName]: newStatus };
      try {
        localStorage.setItem(SCORECARD_STATUS_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to save scorecard_employee_status:", err);
      }
      return updated;
    });
  };

  const setAllStatus = (shouldBeActive) => {
    const updated = {};
    employees.forEach(emp => {
      updated[emp.name] = shouldBeActive;
    });
    setEmployeeStatus(updated);
    try {
      localStorage.setItem(SCORECARD_STATUS_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  const resetToDefaultStatus = () => {
    const initial = {};
    DEFAULT_INACTIVE.forEach(name => {
      initial[name] = false;
    });
    setEmployeeStatus(initial);
    try {
      localStorage.setItem(SCORECARD_STATUS_KEY, JSON.stringify(initial));
    } catch (err) {
      console.error(err);
    }
  };

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewType, setViewType] = useState(''); // 'scorecard' or 'history'
  const [activeTab, setActiveTab] = useState('report'); // 'report' or 'directory'
  const [directoryStatusTab, setDirectoryStatusTab] = useState('active'); // 'active', 'inactive', 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const [showManageModal, setShowManageModal] = useState(false);
  const [modalSearch, setModalSearch] = useState('');
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

  // Active & Inactive memoized lists
  const activeEmployees = useMemo(() => {
    return employees.filter(emp => isEmployeeActive(emp.name));
  }, [employees, employeeStatus]);

  const inactiveEmployees = useMemo(() => {
    return employees.filter(emp => !isEmployeeActive(emp.name));
  }, [employees, employeeStatus]);

  // Filtered employees for directory view
  const displayedEmployees = useMemo(() => {
    return employees.filter(emp => {
      const active = isEmployeeActive(emp.name);
      if (directoryStatusTab === 'active' && !active) return false;
      if (directoryStatusTab === 'inactive' && active) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = emp.name.toLowerCase().includes(q);
        const matchesDept = emp.department.toLowerCase().includes(q);
        return matchesName || matchesDept;
      }
      return true;
    });
  }, [employees, directoryStatusTab, searchQuery, employeeStatus]);

  // Modal filtered employees
  const modalEmployees = useMemo(() => {
    if (!modalSearch.trim()) return employees;
    const q = modalSearch.toLowerCase().trim();
    return employees.filter(emp => 
      emp.name.toLowerCase().includes(q) || 
      emp.department.toLowerCase().includes(q)
    );
  }, [employees, modalSearch]);

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

      // ONLY DOWNLOAD ACTIVE EMPLOYEES
      const employeesToDownload = activeEmployees;

      if (employeesToDownload.length === 0) {
        alert("No active employees found to download!");
        setIsDownloadingAll(false);
        return;
      }

      for (const emp of employeesToDownload) {
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

            // Opportunity loss column
            for (let idx = 0; idx < headers.length; idx++) {
              const txt = headers[idx].toString().toLowerCase().trim();
              if (txt === 'opportunity loss') {
                oppLossIdx = idx;
                break;
              }
            }

            // Fallback to end-of-row offsets if not found dynamically
            const len = headers.length || 72;
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

            const reportRows = [
              [`Active Employees Balance Scorecard Report (${startMonth} ${startYear} to ${endMonth} ${endYear})`],
              ["Employee Name:", emp.name, "Department:", emp.department, "Status:", "Active"],
              [],
              ["Timestamp", "Month", "Employee Name", "Target Score", "Actual Score", "Opportunity Loss", "Overall Target", "Overall Actual", "Overall Opportunity Loss", "Overall Percentage", "Submission Status"]
            ];

            allMonths.forEach(month => {
              const matchingRows = dataRows.filter(row => row[1] && normalizeMonth(row[1]) === month.toLowerCase());
              
              if (matchingRows.length > 0) {
                matchingRows.forEach(row => {
                  const isNikhilesh = emp.name === "Nikhilesh Davda" || emp.name.toLowerCase().includes("nikhilesh");
                  const submittedBy = row[2] === "User" ? "User" : (isNikhilesh ? (row[2] || "Director Sir") : "COO");
                  const status = submittedBy === "User" 
                    ? (isNikhilesh ? "Pending from Director" : "Pending COO Evaluation") 
                    : "Fully Completed";
                  
                  reportRows.push([
                    row[0] || "-",
                    month,
                    emp.name,
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
                  "-",
                  month,
                  emp.name,
                  "-",
                  "-",
                  "-",
                  "-",
                  "-",
                  "-",
                  "-",
                  "Not Filled"
                ]);
              }
            });

            const worksheet = XLSX.utils.aoa_to_sheet(reportRows);
            XLSX.utils.book_append_sheet(workbook, worksheet, emp.name.substring(0, 31));
          } else {
            const reportRows = [
              [`Active Employees Balance Scorecard Report (${startMonth} ${startYear} to ${endMonth} ${endYear})`],
              ["Employee Name:", emp.name, "Department:", emp.department, "Status:", "Active"],
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

      XLSX.writeFile(workbook, `Active_Employees_Balance_Scorecard_Report_${startYear}_${endYear}.xlsx`);
      alert(`Consolidated reports for ${employeesToDownload.length} active employees downloaded successfully!`);
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
        {/* Header Section for Selected Employee */}
        {selectedEmployee && (
          <div className="flex flex-col mb-4 md:mb-6 sticky top-0 bg-gray-50 z-10 py-2 space-y-3">
            <div className="flex justify-between items-center w-full">
              <button
                onClick={handleBackClick}
                className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-700 flex items-center text-sm md:text-base font-semibold shadow-sm"
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
                Back to Dashboard
              </button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
              <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center md:text-left">
                  {selectedEmployee}
                </h1>
                <span className="ml-0 md:ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm md:text-base text-center md:text-left mt-1 md:mt-0 font-medium">
                  {viewType === "scorecard"
                    ? "Score Card View"
                    : "History View"}
                </span>
                <span className={`ml-0 md:ml-2 px-3 py-1 rounded-full text-xs font-semibold mt-1 md:mt-0 ${
                  isEmployeeActive(selectedEmployee)
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {isEmployeeActive(selectedEmployee) ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        )}

        {selectedEmployee ? (
          <div>
            {viewType === "scorecard" &&
              (selectedEmployee === "Manaswi Maity" || selectedEmployee === "Poorwa Gajbhiye") && <ManaswiMaity />}
            {viewType === "history" &&
              (selectedEmployee === "Manaswi Maity" || selectedEmployee === "Poorwa Gajbhiye") && (
                <ManaswiMaityScorecardHistory />
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
              (selectedEmployee === "Swapnil Jain" || selectedEmployee === "Alka Das") && <SwapnilJain />}
            {viewType === "history" && (selectedEmployee === "Swapnil Jain" || selectedEmployee === "Alka Das") && (
              <SwapnilJainScorecardHistory />
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
            {viewType === "scorecard" &&
              selectedEmployee === "Isha Shrivastava" && <IshaShrivastava />}
            {viewType === "history" && selectedEmployee === "Isha Shrivastava" && (
              <IshaShrivastavaScorecardHistory />
            )}
            {viewType === "scorecard" &&
              selectedEmployee === "Lalit Mohan Bisht" && <LalitMohanBisht />}
            {viewType === "history" && selectedEmployee === "Lalit Mohan Bisht" && (
              <LalitMohanBishtScorecardHistory />
            )}
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
            {viewType === "scorecard" &&
              selectedEmployee === "Surbhi Netam" && <SurbhiNetam />}
            {viewType === "history" && selectedEmployee === "Surbhi Netam" && (
              <SurbhiNetamScorecardHistory />
            )}
            {viewType === "scorecard" &&
              selectedEmployee === "Suman Goud Kuntla" && <SumanGoud />}
            {viewType === "history" && selectedEmployee === "Suman Goud Kuntla" && (
              <SumanGoudScorecardHistory />
            )}
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
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top Navigation Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('report')}
                  className={`px-4 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${
                    activeTab === 'report' 
                      ? 'bg-blue-800 text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Monthly Report &amp; PDF Export
                </button>
                <button
                  onClick={() => setActiveTab('directory')}
                  className={`px-4 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${
                    activeTab === 'directory' 
                      ? 'bg-blue-800 text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Employee Directory
                </button>
              </div>

              {activeTab === 'directory' && (
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
                    title="Export all reports for active employees"
                    className={`px-3 py-1.5 text-white rounded flex items-center text-xs font-semibold shadow-sm ${isDownloadingAll ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                  >
                    <span>{isDownloadingAll ? 'Downloading...' : `Excel Export (${activeEmployees.length} Active)`}</span>
                  </button>

                  <button
                    onClick={() => setShowManageModal(true)}
                    className="px-3 py-1.5 bg-gray-800 text-white rounded flex items-center text-xs font-semibold shadow-sm hover:bg-gray-900 gap-1.5"
                    title="Manage Active/Inactive Scorecard Status"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Manage Status</span>
                  </button>
                </div>
              )}
            </div>

            {/* TAB 1: MONTHLY REPORT & PDF EXPORT */}
            {activeTab === 'report' && (
              <MonthlyScorecardReport
                employees={activeEmployees}
                onOpenScorecard={(name) => handleEmployeeClick(name, "scorecard")}
                onOpenHistory={(name) => handleEmployeeClick(name, "history")}
              />
            )}

            {/* TAB 2: EMPLOYEE DIRECTORY */}
            {activeTab === 'directory' && (
              <>
                {/* Status Sub-Navigation & Search Filter */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                  {/* Status Tabs: Active, Inactive, All */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setDirectoryStatusTab('active')}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        directoryStatusTab === 'active'
                          ? 'bg-green-600 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-green-300"></span>
                      Active ({activeEmployees.length})
                    </button>
                    
                    <button
                      onClick={() => setDirectoryStatusTab('inactive')}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        directoryStatusTab === 'inactive'
                          ? 'bg-gray-800 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                      Inactive ({inactiveEmployees.length})
                    </button>

                    <button
                      onClick={() => setDirectoryStatusTab('all')}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        directoryStatusTab === 'all'
                          ? 'bg-blue-800 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      All ({employees.length})
                    </button>
                  </div>

                  {/* Search Box */}
                  <div className="relative min-w-[220px]">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search name or dept..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
                  <div
                    className="overflow-x-auto"
                    style={{ maxHeight: "calc(100vh - 240px)" }}
                  >
                    <table className="min-w-full">
                      <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                        <tr>
                          <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0 text-center">
                            SN
                          </th>
                          <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0 text-left">
                            Employee Name
                          </th>
                          <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0 text-center">
                            Department
                          </th>
                          <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0 text-center">
                            Status
                          </th>
                          <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0 text-center">
                            Balance Scorecard
                          </th>
                          <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0 text-center">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {displayedEmployees.length > 0 ? (
                          displayedEmployees.map((employee, index) => {
                            const active = isEmployeeActive(employee.name);
                            return (
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
                                  <div className="flex items-center">
                                    <button
                                      onClick={() =>
                                        handleEmployeeClick(
                                          employee.name,
                                          "history"
                                        )
                                      }
                                      className="text-sm font-semibold text-blue-600 hover:text-blue-800 focus:outline-none"
                                    >
                                      {employee.name}
                                    </button>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                                  {employee.department}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                      active
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-100 text-gray-600"
                                    }`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${
                                        active ? "bg-green-500" : "bg-gray-400"
                                      }`}
                                    ></span>
                                    {active ? "Active" : "Inactive"}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  <button
                                    onClick={() =>
                                      handleEmployeeClick(
                                        employee.name,
                                        "scorecard"
                                      )
                                    }
                                    className="text-xs font-semibold px-4 py-1.5 rounded-md text-white bg-purple-600 hover:bg-purple-700 shadow-sm focus:outline-none transition-all"
                                  >
                                    Click Here
                                  </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  <button
                                    onClick={(e) => toggleEmployeeStatus(employee.name, e)}
                                    className={`text-xs font-semibold px-3 py-1 rounded border shadow-sm transition-all ${
                                      active
                                        ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                                        : "bg-green-50 text-green-700 border-green-300 hover:bg-green-100"
                                    }`}
                                    title={active ? "Mark as Inactive" : "Mark as Active"}
                                  >
                                    {active ? "Mark Inactive" : "Activate"}
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td
                              colSpan="6"
                              className="px-6 py-8 text-center text-gray-500"
                            >
                              No employees found in this view.
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
                    {displayedEmployees.length > 0 ? (
                      <div className="space-y-0">
                        {displayedEmployees.map((employee, index) => {
                          const active = isEmployeeActive(employee.name);
                          return (
                            <div
                              key={employee.id}
                              className={`p-4 border-b border-gray-200 ${
                                index % 2 === 0 ? "bg-white" : "bg-gray-50"
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center">
                                  <span className="text-sm font-medium text-gray-500 mr-2">
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
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                                    active
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  {active ? "Active" : "Inactive"}
                                </span>
                              </div>

                              <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                                <div>
                                  <span>Dept: </span>
                                  <span className="font-medium text-gray-800">
                                    {employee.department}
                                  </span>
                                </div>
                              </div>

                              <div className="flex justify-between items-center gap-2 pt-2 border-t border-gray-100">
                                <button
                                  onClick={() =>
                                    handleEmployeeClick(employee.name, "scorecard")
                                  }
                                  className="text-xs font-semibold px-4 py-1.5 rounded-md text-white bg-purple-600 hover:bg-purple-700"
                                >
                                  Scorecard
                                </button>
                                <button
                                  onClick={(e) => toggleEmployeeStatus(employee.name, e)}
                                  className={`text-xs font-semibold px-3 py-1.5 rounded border shadow-sm ${
                                    active
                                      ? "bg-red-50 text-red-700 border-red-200"
                                      : "bg-green-50 text-green-700 border-green-300"
                                  }`}
                                >
                                  {active ? "Mark Inactive" : "Activate"}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-gray-500">
                        No employees found in this view.
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* MANAGE STATUS MODAL */}
      {showManageModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="p-4 md:p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Manage Balance Score Card Status
                  </h3>
                  <p className="text-xs text-gray-500">
                    Toggle employee active or inactive for scorecard and reports
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowManageModal(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Controls Bar */}
            <div className="p-4 border-b border-gray-100 bg-white flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter employees..."
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAllStatus(true)}
                  className="px-2.5 py-1 text-xs font-semibold bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 rounded"
                >
                  Activate All
                </button>
                <button
                  onClick={resetToDefaultStatus}
                  className="px-2.5 py-1 text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 rounded flex items-center gap-1"
                  title="Reset to default settings"
                >
                  <RefreshCw className="w-3 h-3" />
                  Reset Defaults
                </button>
              </div>
            </div>

            {/* Modal Employee List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <div className="text-xs text-gray-500 mb-2 flex justify-between">
                <span>Showing {modalEmployees.length} employees</span>
                <span>
                  Active: <strong className="text-green-600">{activeEmployees.length}</strong> | Inactive: <strong className="text-gray-600">{inactiveEmployees.length}</strong>
                </span>
              </div>

              {modalEmployees.map((emp) => {
                const active = isEmployeeActive(emp.name);
                return (
                  <div
                    key={emp.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-300 bg-white transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          active ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {emp.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {emp.department}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {active ? "Active" : "Inactive"}
                      </span>

                      <button
                        onClick={() => toggleEmployeeStatus(emp.name)}
                        className={`px-3 py-1 text-xs font-semibold rounded transition-all shadow-sm ${
                          active
                            ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                            : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                      >
                        {active ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
              <span>Changes are automatically saved.</span>
              <button
                onClick={() => setShowManageModal(false)}
                className="px-4 py-1.5 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BalanceScoreCard;
