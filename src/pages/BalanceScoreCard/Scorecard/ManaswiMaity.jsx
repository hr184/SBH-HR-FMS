import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MonthSelectorBanner } from '../MonthSelectorBanner';
import { fetchScorecardSheetData, extractDataRows, extractAvailableMonths, getDefaultSelectedMonth, findUserSubmission, findCooEvaluation } from '../scorecardHelper';

export const ManaswiMaity = () => {
  const initialScores = {
    // Job Assessment Scores
    newJoinings: '',
    planningExecution1: '',
    planningExecution2: '',
    planningExecution3: '',
    planningExecution4: '',
    planningExecution5: '',
    planningExecution6: '',
    planningExecution7: '',
    inductionTraining1: '',
    inductionTraining2: '',
    auditingAndProcess1: '',
    employeeEngagement1: '',
    employeeEngagement2: '',
    employeeEngagement3: '',
    employeeEngagement4: '',
    employeeEngagement5: '',

    // Behavioral Assessment Scores
    qualityOfWork: '',
    planningExecution: '',
    timeResources: '',
    interpersonalRelations: '',
    flexibilityAdaptability: '',
    communication: '',
    integrity: '',
    leadership: '',
    discipline: '',
    punctuality: ''
  };

  const [scores, setScores] = useState(initialScores);
  const [userData, setUserData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [allDataRows, setAllDataRows] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [userSubmissionInfo, setUserSubmissionInfo] = useState(null);

  const primarySheetName = "Manaswi Maity";
  const fallbackSheetName = "Poorwa Gajbhiye";

  const parseJobScores = (row) => {
    if (!row) return {};
    return {
      newJoinings: row[4] !== undefined && row[4] !== "" ? row[4] : "",
      planningExecution1: row[5] !== undefined && row[5] !== "" ? row[5] : "",
      planningExecution2: row[6] !== undefined && row[6] !== "" ? row[6] : "",
      planningExecution3: row[7] !== undefined && row[7] !== "" ? row[7] : "",
      planningExecution4: row[8] !== undefined && row[8] !== "" ? row[8] : "",
      planningExecution5: row[9] !== undefined && row[9] !== "" ? row[9] : "",
      planningExecution6: row[10] !== undefined && row[10] !== "" ? row[10] : "",
      planningExecution7: row[11] !== undefined && row[11] !== "" ? row[11] : "",
      inductionTraining1: row[12] !== undefined && row[12] !== "" ? row[12] : "",
      inductionTraining2: row[13] !== undefined && row[13] !== "" ? row[13] : "",
      auditingAndProcess1: row[14] !== undefined && row[14] !== "" ? row[14] : "",
      employeeEngagement1: row[15] !== undefined && row[15] !== "" ? row[15] : "",
      employeeEngagement2: row[16] !== undefined && row[16] !== "" ? row[16] : "",
      employeeEngagement3: row[17] !== undefined && row[17] !== "" ? row[17] : "",
      employeeEngagement4: row[18] !== undefined && row[18] !== "" ? row[18] : "",
      employeeEngagement5: row[19] !== undefined && row[19] !== "" ? row[19] : ""
    };
  };

  const applyMonthData = (targetMonth, rows) => {
    const userRow = findUserSubmission(rows, targetMonth);
    if (userRow) {
      const parsed = parseJobScores(userRow);
      setUserData(parsed);

      const totalScore = parseFloat(userRow[36]) || Object.values(parsed).reduce((a, b) => a + (parseFloat(b) || 0), 0);
      const targetScore = parseFloat(userRow[35]) || 80;
      const percentage = parseFloat(userRow[44]) || (targetScore > 0 ? (totalScore / targetScore) * 100 : 0);

      setUserSubmissionInfo({
        timestamp: userRow[0],
        month: userRow[1],
        totalScore,
        targetScore,
        percentage
      });
    } else {
      setUserData({});
      setUserSubmissionInfo(null);
    }

    const cooRow = findCooEvaluation(rows, targetMonth);
    if (cooRow) {
      setScores({
        newJoinings: cooRow[4] || '',
        planningExecution1: cooRow[5] || '',
        planningExecution2: cooRow[6] || '',
        planningExecution3: cooRow[7] || '',
        planningExecution4: cooRow[8] || '',
        planningExecution5: cooRow[9] || '',
        planningExecution6: cooRow[10] || '',
        planningExecution7: cooRow[11] || '',
        inductionTraining1: cooRow[12] || '',
        inductionTraining2: cooRow[13] || '',
        auditingAndProcess1: cooRow[14] || '',
        employeeEngagement1: cooRow[15] || '',
        employeeEngagement2: cooRow[16] || '',
        employeeEngagement3: cooRow[17] || '',
        employeeEngagement4: cooRow[18] || '',
        employeeEngagement5: cooRow[19] || '',
        qualityOfWork: cooRow[20] || '',
        planningExecution: cooRow[21] || '',
        timeResources: cooRow[22] || '',
        interpersonalRelations: cooRow[23] || '',
        flexibilityAdaptability: cooRow[24] || '',
        communication: cooRow[25] || '',
        integrity: cooRow[26] || '',
        leadership: cooRow[27] || '',
        discipline: cooRow[28] || '',
        punctuality: cooRow[29] || ''
      });
    } else {
      setScores(initialScores);
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const result = await fetchScorecardSheetData(primarySheetName, fallbackSheetName);
      if (result && result.data && result.data.length > 0) {
        const dataRows = extractDataRows(result.data);
        setAllDataRows(dataRows);

        const months = extractAvailableMonths(dataRows);
        setAvailableMonths(months);

        const defaultMonth = getDefaultSelectedMonth(dataRows, months);
        setSelectedMonth(defaultMonth);
        applyMonthData(defaultMonth, dataRows);
      }
    } catch (err) {
      console.error('Error loading data:', err);
      toast.error('Failed to load scorecard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    applyMonthData(month, allDataRows);
  };

  const handleCopyUserScores = () => {
    if (!userData || Object.keys(userData).length === 0) {
      toast.warning('No user scores available to copy for this month.');
      return;
    }
    setScores(prev => ({
      ...prev,
      ...userData
    }));
    toast.success('User scores copied into COO fields!');
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
    const jobAssessmentTotal = Object.values(scores).slice(0, 16).reduce((a, b) => a + (parseFloat(b) || 0), 0);
    const behavioralTotal = Object.values(scores).slice(16).reduce((a, b) => a + (parseFloat(b) || 0), 0);
    const overallTotal = jobAssessmentTotal + behavioralTotal;

    const jobAssessmentTargets = [6, 4, 7, 5, 3, 4, 6, 5, 4, 3, 7, 5, 4, 7, 4, 6];
    const behavioralTargets = [1, 2, 2, 2, 2, 2, 2, 2, 2, 3];

    const jobAssessmentTargetTotal = jobAssessmentTargets.reduce((a, b) => a + b, 0);
    const behavioralTargetTotal = behavioralTargets.reduce((a, b) => a + b, 0);

    return {
      jobAssessmentTotal,
      behavioralTotal,
      overallTotal,
      jobAssessmentTargetTotal,
      behavioralTargetTotal,
      overallTargetTotal: jobAssessmentTargetTotal + behavioralTargetTotal,
      overallPercentage: overallTotal > 0 ? (overallTotal / (jobAssessmentTargetTotal + behavioralTargetTotal)) * 100 : 0
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
      const evaluationMonth = selectedMonth || currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

      let evaluatorName = "Hansraj Singh";
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          evaluatorName = parsed.Name || parsed.Username || "Hansraj Singh";
        }
      } catch (e) {
        console.error(e);
      }

      const rowData = [
        timestamp,
        evaluationMonth,
        evaluatorName,
        "",
        scores.newJoinings || 0,
        scores.planningExecution1 || 0,
        scores.planningExecution2 || 0,
        scores.planningExecution3 || 0,
        scores.planningExecution4 || 0,
        scores.planningExecution5 || 0,
        scores.planningExecution6 || 0,
        scores.planningExecution7 || 0,
        scores.inductionTraining1 || 0,
        scores.inductionTraining2 || 0,
        scores.auditingAndProcess1 || 0,
        scores.employeeEngagement1 || 0,
        scores.employeeEngagement2 || 0,
        scores.employeeEngagement3 || 0,
        scores.employeeEngagement4 || 0,
        scores.employeeEngagement5 || 0,
        scores.qualityOfWork || 0,
        scores.planningExecution || 0,
        scores.timeResources || 0,
        scores.interpersonalRelations || 0,
        scores.flexibilityAdaptability || 0,
        scores.communication || 0,
        scores.integrity || 0,
        scores.leadership || 0,
        scores.discipline || 0,
        scores.punctuality || 0
      ];

      const scriptURL = "https://script.google.com/macros/s/AKfycbw6xeabQpVzEnNMhLWfMAwLJ0hFZxA2L89aX17-p4b-caM4SdpsETrtq5GT4Lwk84qL/exec";
      const sheetId = "162o34BXqnJvmJjjtIoQpcBGo8orn2ZO5Jf0p8MgoUCs";

      let response = await fetch(scriptURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `sheetId=${encodeURIComponent(sheetId)}&sheetName=${encodeURIComponent(primarySheetName)}&payload=${encodeURIComponent(JSON.stringify(rowData))}`
      });

      if (!response.ok) {
        // Try fallback sheet name
        response = await fetch(scriptURL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `sheetId=${encodeURIComponent(sheetId)}&sheetName=${encodeURIComponent(fallbackSheetName)}&payload=${encodeURIComponent(JSON.stringify(rowData))}`
        });
      }

      if (response.ok) {
        toast.success(`Scores for ${evaluationMonth} submitted successfully!`);
        loadData();
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
        onRefresh={loadData}
        isLoading={isLoading}
        submissionInfo={userSubmissionInfo}
        isUserView={false}
        onCopyUserScores={handleCopyUserScores}
        employeeName="Manaswi Maity"
      />

      <div style={{ marginBottom: '30px', backgroundColor: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 6px 10px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ color: '#1e3a8a', borderBottom: '3px solid #1e3a8a', paddingBottom: '10px', marginBottom: '20px' }}>JOB ASSESSMENT (Manaswi Maity - HR)</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: '8px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ backgroundColor: '#1e3a8a', color: 'white' }}>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #1e40af' }}>KRA</th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #1e40af' }}>KPI</th>
              <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #1e40af', width: '100px' }}>Out of</th>
              <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #1e40af', width: '120px' }}>User</th>
              <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #1e40af', width: '120px' }}>COO</th>
            </tr>
          </thead>
          <tbody>
            {/* Recruitment */}
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff', verticalAlign: 'top' }}>Recruitment</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Timely closure of New Joinings as per Manpower Requisition Form (MRF) within standard TAT (Nursing/Paramedical - 15 days, Doctor - 30 days, Other - 20 days)</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>6</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold', color: '#1e40af', backgroundColor: '#f0fdf4' }}>{userData.newJoinings || '-'}</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input type="number" min="0" max="6" value={scores.newJoinings} onChange={(e) => handleScoreChange('newJoinings', e.target.value)} style={{ width: '60px', padding: '6px', textAlign: 'center', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
              </td>
            </tr>

            {/* Planning & Execution */}
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td rowSpan="7" style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff', verticalAlign: 'top' }}>Planning & Execution</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Background Verification (BGV) to be done for all the new joiners within 15 days of joining (Score &gt;= 95% = 4, 90-94% = 3, 85-89% = 2, &lt;85% = 0)</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>4</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold', color: '#1e40af', backgroundColor: '#f0fdf4' }}>{userData.planningExecution1 || '-'}</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input type="number" min="0" max="4" value={scores.planningExecution1} onChange={(e) => handleScoreChange('planningExecution1', e.target.value)} style={{ width: '60px', padding: '6px', textAlign: 'center', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Preparation of ID Cards of the new joiners within 2 days of joining</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>7</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold', color: '#1e40af', backgroundColor: '#f0fdf4' }}>{userData.planningExecution2 || '-'}</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input type="number" min="0" max="7" value={scores.planningExecution2} onChange={(e) => handleScoreChange('planningExecution2', e.target.value)} style={{ width: '60px', padding: '6px', textAlign: 'center', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>New joiners file opening within 3 days of joining (Checklist to be maintained)</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>5</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold', color: '#1e40af', backgroundColor: '#f0fdf4' }}>{userData.planningExecution3 || '-'}</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input type="number" min="0" max="5" value={scores.planningExecution3} onChange={(e) => handleScoreChange('planningExecution3', e.target.value)} style={{ width: '60px', padding: '6px', textAlign: 'center', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Biometric Punch Registration of new joiners on Day 1 of joining</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>3</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold', color: '#1e40af', backgroundColor: '#f0fdf4' }}>{userData.planningExecution4 || '-'}</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input type="number" min="0" max="3" value={scores.planningExecution4} onChange={(e) => handleScoreChange('planningExecution4', e.target.value)} style={{ width: '60px', padding: '6px', textAlign: 'center', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Updation of Master Data within 7 days of joining</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>4</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold', color: '#1e40af', backgroundColor: '#f0fdf4' }}>{userData.planningExecution5 || '-'}</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input type="number" min="0" max="4" value={scores.planningExecution5} onChange={(e) => handleScoreChange('planningExecution5', e.target.value)} style={{ width: '60px', padding: '6px', textAlign: 'center', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Timely release of Appointment Letters to new joiners within 30 days of joining</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>6</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold', color: '#1e40af', backgroundColor: '#f0fdf4' }}>{userData.planningExecution6 || '-'}</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input type="number" min="0" max="6" value={scores.planningExecution6} onChange={(e) => handleScoreChange('planningExecution6', e.target.value)} style={{ width: '60px', padding: '6px', textAlign: 'center', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Timely processing of Full & Final (F&F) Settlement within 45 days of exit</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>5</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold', color: '#1e40af', backgroundColor: '#f0fdf4' }}>{userData.planningExecution7 || '-'}</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input type="number" min="0" max="5" value={scores.planningExecution7} onChange={(e) => handleScoreChange('planningExecution7', e.target.value)} style={{ width: '60px', padding: '6px', textAlign: 'center', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
              </td>
            </tr>

            {/* Induction & Training */}
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td rowSpan="2" style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff', verticalAlign: 'top' }}>Induction & Training</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Conducting HR Induction for new joiners on Day 1 (Induction Checklist to be maintained)</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>4</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold', color: '#1e40af', backgroundColor: '#f0fdf4' }}>{userData.inductionTraining1 || '-'}</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input type="number" min="0" max="4" value={scores.inductionTraining1} onChange={(e) => handleScoreChange('inductionTraining1', e.target.value)} style={{ width: '60px', padding: '6px', textAlign: 'center', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Hospital Induction coordination and compliance (&gt;= 90% attendance = 3, 80-89% = 2, &lt;80% = 0)</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>3</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold', color: '#1e40af', backgroundColor: '#f0fdf4' }}>{userData.inductionTraining2 || '-'}</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input type="number" min="0" max="3" value={scores.inductionTraining2} onChange={(e) => handleScoreChange('inductionTraining2', e.target.value)} style={{ width: '60px', padding: '6px', textAlign: 'center', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
              </td>
            </tr>

            {/* Auditing & Process */}
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff', verticalAlign: 'top' }}>Auditing & Process</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Monthly Personal File Audit compliance (100% compliance = 7, 95-99% = 5, 90-94% = 3, &lt;90% = 0)</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>7</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold', color: '#1e40af', backgroundColor: '#f0fdf4' }}>{userData.auditingAndProcess1 || '-'}</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input type="number" min="0" max="7" value={scores.auditingAndProcess1} onChange={(e) => handleScoreChange('auditingAndProcess1', e.target.value)} style={{ width: '60px', padding: '6px', textAlign: 'center', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
              </td>
            </tr>

            {/* Employee Engagement */}
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td rowSpan="5" style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff', verticalAlign: 'top' }}>Employee Engagement</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Conducting Monthly Birthday Celebration as per calendar</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>5</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold', color: '#1e40af', backgroundColor: '#f0fdf4' }}>{userData.employeeEngagement1 || '-'}</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input type="number" min="0" max="5" value={scores.employeeEngagement1} onChange={(e) => handleScoreChange('employeeEngagement1', e.target.value)} style={{ width: '60px', padding: '6px', textAlign: 'center', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Organizing Employee Engagement activity/festival celebration as per monthly plan</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>4</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold', color: '#1e40af', backgroundColor: '#f0fdf4' }}>{userData.employeeEngagement2 || '-'}</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input type="number" min="0" max="4" value={scores.employeeEngagement2} onChange={(e) => handleScoreChange('employeeEngagement2', e.target.value)} style={{ width: '60px', padding: '6px', textAlign: 'center', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Employee Grievance Redressal within TAT (&lt;48 hrs acknowledgment, &lt;7 days resolution)</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>7</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold', color: '#1e40af', backgroundColor: '#f0fdf4' }}>{userData.employeeEngagement3 || '-'}</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input type="number" min="0" max="7" value={scores.employeeEngagement3} onChange={(e) => handleScoreChange('employeeEngagement3', e.target.value)} style={{ width: '60px', padding: '6px', textAlign: 'center', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Exit Interview coordination and analysis report submission by 5th of every month</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>4</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold', color: '#1e40af', backgroundColor: '#f0fdf4' }}>{userData.employeeEngagement4 || '-'}</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input type="number" min="0" max="4" value={scores.employeeEngagement4} onChange={(e) => handleScoreChange('employeeEngagement4', e.target.value)} style={{ width: '60px', padding: '6px', textAlign: 'center', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Monthly MIS & HR Dashboard submission by 3rd of every month</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>6</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold', color: '#1e40af', backgroundColor: '#f0fdf4' }}>{userData.employeeEngagement5 || '-'}</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input type="number" min="0" max="6" value={scores.employeeEngagement5} onChange={(e) => handleScoreChange('employeeEngagement5', e.target.value)} style={{ width: '60px', padding: '6px', textAlign: 'center', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
              </td>
            </tr>

            {/* Total Row */}
            <tr style={{ backgroundColor: '#1e3a8a', color: 'white', fontWeight: 'bold' }}>
              <td colSpan="2" style={{ padding: '12px', border: '1px solid #1e40af', textAlign: 'right' }}>Total Job Assessment Score:</td>
              <td style={{ padding: '12px', border: '1px solid #1e40af', textAlign: 'center' }}>{totals.jobAssessmentTargetTotal}</td>
              <td style={{ padding: '12px', border: '1px solid #1e40af', textAlign: 'center' }}>{userSubmissionInfo ? userSubmissionInfo.totalScore : '-'}</td>
              <td style={{ padding: '12px', border: '1px solid #1e40af', textAlign: 'center' }}>{totals.jobAssessmentTotal}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Behavioral Assessment */}
      <div style={{ marginBottom: '30px', backgroundColor: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 6px 10px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ color: '#1e3a8a', borderBottom: '3px solid #1e3a8a', paddingBottom: '10px', marginBottom: '20px' }}>BEHAVIORAL ASSESSMENT (Evaluated by COO)</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: '8px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ backgroundColor: '#1e3a8a', color: 'white' }}>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #1e40af' }}>Attributes</th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #1e40af' }}>Description</th>
              <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #1e40af', width: '100px' }}>Out of</th>
              <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #1e40af', width: '120px' }}>COO Score</th>
            </tr>
          </thead>
          <tbody>
            {[
              { key: 'qualityOfWork', label: 'Quality of Work', desc: 'Accuracy, thoroughness, and reliability in all HR tasks', max: 1 },
              { key: 'planningExecution', label: 'Planning & Execution', desc: 'Organizing daily routine, setting realistic targets and deadlines', max: 2 },
              { key: 'timeResources', label: 'Time & Resources', desc: 'Punctuality in deliverables and optimum utilization of hospital assets', max: 2 },
              { key: 'interpersonalRelations', label: 'Interpersonal Relations', desc: 'Cordial behavior with employees, peers, and management', max: 2 },
              { key: 'flexibilityAdaptability', label: 'Flexibility & Adaptability', desc: 'Accepting urgent responsibilities and changing organizational priorities', max: 2 },
              { key: 'communication', label: 'Communication Skills', desc: 'Clarity, conciseness, and effectiveness in verbal and written reports', max: 2 },
              { key: 'integrity', label: 'Integrity & Ethics', desc: 'Honesty, confidentiality of employee data, and high professional standards', max: 2 },
              { key: 'leadership', label: 'Leadership / Initiative', desc: 'Takes ownership, anticipates issues, and suggests positive solutions', max: 2 },
              { key: 'discipline', label: 'Discipline', desc: 'Strict adherence to hospital policies, SOPs, dress code, and decorum', max: 2 },
              { key: 'punctuality', label: 'Punctuality & Attendance', desc: 'Regularity in attendance, timely login, and availability during work hours', max: 3 }
            ].map((item, idx) => (
              <tr key={item.key} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                <td style={{ padding: '12px', border: '1px solid #e2e8f0', fontWeight: 'bold', color: '#1e3a8a' }}>{item.label}</td>
                <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>{item.desc}</td>
                <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>{item.max}</td>
                <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <input type="number" min="0" max={item.max} value={scores[item.key]} onChange={(e) => handleScoreChange(item.key, e.target.value)} style={{ width: '60px', padding: '6px', textAlign: 'center', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                </td>
              </tr>
            ))}
            <tr style={{ backgroundColor: '#1e3a8a', color: 'white', fontWeight: 'bold' }}>
              <td colSpan="2" style={{ padding: '12px', border: '1px solid #1e40af', textAlign: 'right' }}>Total Behavioral Score:</td>
              <td style={{ padding: '12px', border: '1px solid #1e40af', textAlign: 'center' }}>{totals.behavioralTargetTotal}</td>
              <td style={{ padding: '12px', border: '1px solid #1e40af', textAlign: 'center' }}>{totals.behavioralTotal}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Summary and Submit */}
      <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 6px 10px rgba(0, 0, 0, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <span style={{ fontSize: '16px', color: '#1e3a8a', fontWeight: 'bold' }}>
            Overall Score: {totals.overallTotal} / {totals.overallTargetTotal} ({totals.overallPercentage.toFixed(2)}%)
          </span>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{
            padding: '12px 30px',
            backgroundColor: '#1e3a8a',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
        >
          {isSubmitting ? 'Submitting...' : `Submit Evaluation for ${selectedMonth}`}
        </button>
      </div>
    </div>
  );
};

export const PoorwaGajbhiye = ManaswiMaity;
