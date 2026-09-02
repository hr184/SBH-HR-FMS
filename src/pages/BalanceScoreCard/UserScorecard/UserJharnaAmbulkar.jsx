import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MonthSelectorBanner } from '../MonthSelectorBanner';
import { fetchScorecardSheetData, extractDataRows, extractAvailableMonths, getDefaultSelectedMonth, findUserSubmission } from '../scorecardHelper';

export const UserJharnaAmbulkar = () => {
  const initialScores = {
    dataCleansingValidation: '',
    misMaintenance: '',
    dataQualityIssues: '',
    misRequirements: '',
    monthlyMISPreparation: '',
    revenueReview: '',
    debtorsAnalysis: '',
    statisticalDataPreparation: '',
    prepareMarketing: '',
    misCollaboration: '',
    statisticalDataReview: '',
    misActivities: '',
    sapEntries: '',
    overheadsReview: '',
    provisionsAnalysis: '',
    plBalanceSheet: '',
    headcountReview: '',
    prepareMonthly: '',
    checkSocial: '',
    financialPlanning: '',
    monthlyConsolidation: '',
    globalCollaboration: '',
  };

  const [scores, setScores] = useState(initialScores);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [allDataRows, setAllDataRows] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [existingSubmissionInfo, setExistingSubmissionInfo] = useState(null);

  const sheetName = "Jharna Ambulkar";

  const parseScoresFromRow = (row) => {
    return {
      dataCleansingValidation: row[4] !== undefined && row[4] !== "" ? row[4] : "",
      misMaintenance: row[5] !== undefined && row[5] !== "" ? row[5] : "",
      dataQualityIssues: row[6] !== undefined && row[6] !== "" ? row[6] : "",
      misRequirements: row[7] !== undefined && row[7] !== "" ? row[7] : "",
      monthlyMISPreparation: row[8] !== undefined && row[8] !== "" ? row[8] : "",
      revenueReview: row[9] !== undefined && row[9] !== "" ? row[9] : "",
      debtorsAnalysis: row[10] !== undefined && row[10] !== "" ? row[10] : "",
      statisticalDataPreparation: row[11] !== undefined && row[11] !== "" ? row[11] : "",
      prepareMarketing: row[12] !== undefined && row[12] !== "" ? row[12] : "",
      misCollaboration: row[13] !== undefined && row[13] !== "" ? row[13] : "",
      statisticalDataReview: row[14] !== undefined && row[14] !== "" ? row[14] : "",
      misActivities: row[15] !== undefined && row[15] !== "" ? row[15] : "",
      sapEntries: row[16] !== undefined && row[16] !== "" ? row[16] : "",
      overheadsReview: row[17] !== undefined && row[17] !== "" ? row[17] : "",
      provisionsAnalysis: row[18] !== undefined && row[18] !== "" ? row[18] : "",
      plBalanceSheet: row[19] !== undefined && row[19] !== "" ? row[19] : "",
      headcountReview: row[20] !== undefined && row[20] !== "" ? row[20] : "",
      prepareMonthly: row[21] !== undefined && row[21] !== "" ? row[21] : "",
      checkSocial: row[22] !== undefined && row[22] !== "" ? row[22] : "",
      financialPlanning: row[23] !== undefined && row[23] !== "" ? row[23] : "",
      monthlyConsolidation: row[24] !== undefined && row[24] !== "" ? row[24] : "",
      globalCollaboration: row[25] !== undefined && row[25] !== "" ? row[25] : "",
    };
  };

  const applyMonthData = (targetMonth, rows) => {
    const userRow = findUserSubmission(rows, targetMonth);
    if (userRow) {
      const parsed = parseScoresFromRow(userRow);
      setScores(parsed);

      const totalScore = parseFloat(userRow[36]) || Object.values(parsed).reduce((a, b) => a + (parseFloat(b) || 0), 0);
      const targetScore = parseFloat(userRow[35]) || 80;
      const percentage = parseFloat(userRow[44]) || (targetScore > 0 ? (totalScore / targetScore) * 100 : 0);

      setExistingSubmissionInfo({
        timestamp: userRow[0],
        month: userRow[1],
        totalScore,
        targetScore,
        percentage
      });
    } else {
      setScores(initialScores);
      setExistingSubmissionInfo(null);
    }
  };

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const result = await fetchScorecardSheetData(sheetName);
      if (result && result.data && result.data.length > 0) {
        const dataRows = extractDataRows(result.data);
        setAllDataRows(dataRows);

        const months = extractAvailableMonths(dataRows);
        setAvailableMonths(months);

        const defaultMonth = getDefaultSelectedMonth(dataRows, months);
        setSelectedMonth(defaultMonth);
        applyMonthData(defaultMonth, dataRows);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load previous scorecard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    applyMonthData(month, allDataRows);
  };

  const handleScoreChange = (kpi, value) => {
    const numValue = parseFloat(value);
    if (numValue < 0) return;
    
    setScores(prev => ({
      ...prev,
      [kpi]: value
    }));
  };

  const calculateTotals = () => {
    const jobAssessmentTotal = Object.values(scores).reduce((a, b) => a + (parseFloat(b) || 0), 0);
    const jobAssessmentTargets = [6, 4, 3, 6, 4, 2, 3, 4, 3, 5, 4, 3, 2, 4, 4, 2, 3, 3, 3, 4, 5, 3];
    const jobAssessmentTargetTotal = jobAssessmentTargets.reduce((a, b) => a + b, 0);
    
    return {
      jobAssessmentTotal,
      jobAssessmentTargetTotal,
      overallPercentage: jobAssessmentTotal > 0 ? (jobAssessmentTotal / jobAssessmentTargetTotal) * 100 : 0
    };
  };

  const totals = calculateTotals();

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const requiredScores = Object.values(scores).filter(score => score === '');
    if (requiredScores.length > 0) {
      if (!confirm('Some scores are empty. Do you want to submit anyway?')) {
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const currentDate = new Date();
      const day = String(currentDate.getDate()).padStart(2, '0');
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const year = currentDate.getFullYear();
      const hours = String(currentDate.getHours()).padStart(2, '0');
      const minutes = String(currentDate.getMinutes()).padStart(2, '0');
      const seconds = String(currentDate.getSeconds()).padStart(2, '0');
      
      const timestamp = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
      const submissionMonth = selectedMonth || currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
      const employeeName = "User";

      const rowData = [
        timestamp,
        submissionMonth, 
        employeeName, 
        "", 
        scores.dataCleansingValidation || 0,
        scores.misMaintenance || 0,
        scores.dataQualityIssues || 0,
        scores.misRequirements || 0,
        scores.monthlyMISPreparation || 0,
        scores.revenueReview || 0,
        scores.debtorsAnalysis || 0,
        scores.statisticalDataPreparation || 0,
        scores.prepareMarketing || 0,
        scores.misCollaboration || 0,
        scores.statisticalDataReview || 0,
        scores.misActivities || 0,
        scores.sapEntries || 0,
        scores.overheadsReview || 0,
        scores.provisionsAnalysis || 0,
        scores.plBalanceSheet || 0,
        scores.headcountReview || 0,
        scores.prepareMonthly || 0,
        scores.checkSocial || 0,
        scores.financialPlanning || 0,
        scores.monthlyConsolidation || 0,
        scores.globalCollaboration || 0,
      ];

      const scriptURL = "https://script.google.com/macros/s/AKfycbw6xeabQpVzEnNMhLWfMAwLJ0hFZxA2L89aX17-p4b-caM4SdpsETrtq5GT4Lwk84qL/exec";
      const sheetId = "162o34BXqnJvmJjjtIoQpcBGo8orn2ZO5Jf0p8MgoUCs";

      const response = await fetch(scriptURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `sheetId=${encodeURIComponent(sheetId)}&sheetName=${encodeURIComponent(sheetName)}&payload=${encodeURIComponent(JSON.stringify(rowData))}`
      });

      if (response.ok) {
        toast.success(`Scores for ${submissionMonth} submitted successfully!`);
        loadUserData();
      } else {
        throw new Error(`Server responded with status: ${response.status}`);
      }

    } catch (error) {
      console.error('Error submitting scores:', error);
      toast.error('Failed to submit scores. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', minHeight: '100vh' }}>      
      <ToastContainer />
      <MonthSelectorBanner
        selectedMonth={selectedMonth}
        onMonthChange={handleMonthChange}
        availableMonths={availableMonths}
        onRefresh={loadUserData}
        isLoading={isLoading}
        submissionInfo={existingSubmissionInfo}
        isUserView={true}
        employeeName="Jharna Ambulkar"
      />
      <div style={{ marginBottom: '30px', backgroundColor: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 6px 10px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ color: '#1e3a8a', borderBottom: '3px solid #1e3a8a', paddingBottom: '10px', marginBottom: '20px' }}>JOB ASSESSMENT</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: '8px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ backgroundColor: '#1e3a8a', color: 'white' }}>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #1e40af' }}>KRA</th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #1e40af' }}>KPI</th>
              <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #1e40af', width: '100px' }}>Out of</th>
              <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #1e40af', width: '100px' }}>Scores</th>
            </tr>
          </thead>
          <tbody>
            {/* Validation and Maintaining data Accuracy KRA */}
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td rowSpan="4" style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff', verticalAlign: 'top' }}>Validation and Maintaining data Accuracy			</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Support data cleansing and validation activities using Excel to ensure data accuracy and consistency.</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>6</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.dataCleansingValidation}
                  onChange={(e) => handleScoreChange('dataCleansingValidation', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-6"
                  min="0"
                  max="6"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Maintain the organization's MIS using Excel, ensuring accurate and timely reporting of data.</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>4</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.misMaintenance}
                  onChange={(e) => handleScoreChange('misMaintenance', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-4"
                  min="0"
                  max="4"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Identifying and resolving data quality issues, collaborating with team members to maintain data integrity.</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>3</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.dataQualityIssues}
                  onChange={(e) => handleScoreChange('dataQualityIssues', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-3"
                  min="0"
                  max="3"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Collaborate with team members to gather data requirements and implement Excel-based solutions to meet their MIS needs.</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>6</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.misRequirements}
                  onChange={(e) => handleScoreChange('misRequirements', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-6"
                  min="0"
                  max="6"
                />
              </td>
            </tr>

            {/* MIS KRA */}
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td rowSpan="8" style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff', verticalAlign: 'top' }}>MIS</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Monthly MIS preparation and various activities related to MIS.</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>4</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.monthlyMISPreparation}
                  onChange={(e) => handleScoreChange('monthlyMISPreparation', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-4"
                  min="0"
                  max="4"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Timely Completion of PPT Presentations with accurate Checking of OPD Numbers Procedure data and IPD Counts.</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>2</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.revenueReview}
                  onChange={(e) => handleScoreChange('revenueReview', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-2"
                  min="0"
                  max="2"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Analyse and prepare reports on debtors, WIP, provisions, and prepaid entries.</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>3</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.debtorsAnalysis}
                  onChange={(e) => handleScoreChange('debtorsAnalysis', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-3"
                  min="0"
                  max="3"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Daily Tracking of digital patient inflow and revenue accross all branches, with monthly consolidated reporting.</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>4</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.statisticalDataPreparation}
                  onChange={(e) => handleScoreChange('statisticalDataPreparation', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-4"
                  min="0"
                  max="4"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Prapare marketing petient data and mandatoryily share it with the director on time at the end of every month.</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>3</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.prepareMarketing}
                  onChange={(e) => handleScoreChange('prepareMarketing', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-3"
                  min="0"
                  max="3"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Collaborate with seniors, business and enabling area teams for MIS-related tasks.</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>5</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.misCollaboration}
                  onChange={(e) => handleScoreChange('misCollaboration', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-5"
                  min="0"
                  max="5"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Preparation and review of statistical data</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>4</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.statisticalDataReview}
                  onChange={(e) => handleScoreChange('statisticalDataReview', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-4"
                  min="0"
                  max="4"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Monthly MIS preparation and various activities related to MIS.</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>3</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.misActivities}
                  onChange={(e) => handleScoreChange('misActivities', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-3"
                  min="0"
                  max="3"
                />
              </td>
            </tr>

            {/* Preparations and analizing the Prepare on reports KRA */}
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td rowSpan="7" style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff', verticalAlign: 'top' }}>Preparations and analizing the Prepare on reports</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Monitor all leader tasks assigned by AM Sir, follow up on their completion, and keep the task sheet updated.</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>2</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.sapEntries}
                  onChange={(e) => handleScoreChange('sapEntries', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-2"
                  min="0"
                  max="2"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Check all leaders' monthly reporting checklist daily and ensure their everyday task updates are filled and verified on time.</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>4</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.overheadsReview}
                  onChange={(e) => handleScoreChange('overheadsReview', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-4"
                  min="0"
                  max="4"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Send WhatsApp blasts as instructed, using both Green Tick and Grey Tick panels as required.</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>4</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.provisionsAnalysis}
                  onChange={(e) => handleScoreChange('provisionsAnalysis', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-4"
                  min="0"
                  max="4"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>For Eye and Women departments, check and follow up monthly on their video posting targets to ensure timely updates.</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>2</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.plBalanceSheet}
                  onChange={(e) => handleScoreChange('plBalanceSheet', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-2"
                  min="0"
                  max="2"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Manage the LinkedIn accounts of Sir and Ma'am by checking their profiles, creating posts, and handling overall LinkedIn activity.</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>3</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.headcountReview}
                  onChange={(e) => handleScoreChange('headcountReview', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-3"
                  min="0"
                  max="3"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Prepare monthly individual marketing contribution data for all team members and share it with the Director.</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>3</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.prepareMonthly}
                  onChange={(e) => handleScoreChange('prepareMonthly', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-3"
                  min="0"
                  max="3"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Check social media leads daily and share them in the group on a regular basis.</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>3</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.checkSocial}
                  onChange={(e) => handleScoreChange('checkSocial', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-3"
                  min="0"
                  max="3"
                />
              </td>
            </tr>

            {/* Preparation and consolidation of monthly reports KRA */}
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td rowSpan="3" style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff', verticalAlign: 'top' }}>Preparation and consolidation of monthly reports</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Assist in various process related to financial planning, analysis, and forecasting.</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>4</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.financialPlanning}
                  onChange={(e) => handleScoreChange('financialPlanning', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-4"
                  min="0"
                  max="4"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>The preparation and consolidation of reports for monthly global submission, including cash flow statements, forecast reports, and financial condition assessments.</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>5</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.monthlyConsolidation}
                  onChange={(e) => handleScoreChange('monthlyConsolidation', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-5"
                  min="0"
                  max="5"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Collaborate with seniors, business and enabling area teams for MIS-related tasks.</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>3</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.globalCollaboration}
                  onChange={(e) => handleScoreChange('globalCollaboration', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-3"
                  min="0"
                  max="3"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ marginTop: '15px', fontWeight: 'bold', padding: '12px', backgroundColor: '#eff6ff', borderRadius: '6px', borderLeft: '4px solid #1e3a8a' }}>
          Job Assessment Total: {totals.jobAssessmentTotal.toFixed(1)} / {totals.jobAssessmentTargetTotal.toFixed(1)}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px', padding: '20px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <h3 style={{ color: '#1e3a8a', marginBottom: '15px' }}>Overall Summary</h3>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px', flexWrap: 'wrap', gap: '15px' }}>
          <div style={{ padding: '12px', backgroundColor: '#eff6ff', borderRadius: '6px', minWidth: '200px', border: '1px solid #bfdbfe' }}>
            <strong style={{ color: '#1e3a8a' }}>Job Assessment:</strong><br />
            {totals.jobAssessmentTotal.toFixed(1)} / {totals.jobAssessmentTargetTotal.toFixed(1)}
          </div>
          <div style={{ padding: '12px', backgroundColor: '#eff6ff', borderRadius: '6px', minWidth: '200px', border: '1px solid #bfdbfe' }}>
            <strong style={{ color: '#1e3a8a' }}>Overall Percentage:</strong><br />
            {totals.overallPercentage.toFixed(1)}%
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{
            padding: '12px 40px',
            fontSize: '16px',
            backgroundColor: isSubmitting ? '#9ca3af' : '#1e3a8a',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            fontWeight: '600'
          }}
        >
          {isSubmitting ? 'Submitting...' : existingSubmissionInfo ? `Update & Re-Submit for ${selectedMonth}` : `Submit Scores for ${selectedMonth}`}
        </button>
      </div>
    </div>
  );
};
