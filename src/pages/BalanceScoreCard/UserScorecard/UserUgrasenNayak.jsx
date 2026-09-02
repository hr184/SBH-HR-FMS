import React from 'react'
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchScorecardSheetData, extractDataRows, extractAvailableMonths, getDefaultSelectedMonth, findUserSubmission } from '../scorecardHelper';

export const UserUgrasenNayak = () => {
  const initialScores = {
    budgetTracking: '',
    vendorPayments: '',
    billCollection: '',
    patientRoomCleaning: '',
    roomService: '',
    patientFeedback: '',
    staffCounselling: '',
    staffMobilization: '',
    sopAuditScore: '',
    bmwChecklist: '',
    wasteSegregation: '',
    stpEtpManagement: '',
    spillManagement: '',
    cleaningChecklist: '',
    mgpsChecking: '',
    hygienicAtmosphere: '',
    amcCmcTracking: '',
    reportSubmission: '',
    staffTraining: '',
    managementTraining: '',
    additionalWorks: '',
  };

  const [scores, setScores] = useState(initialScores);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [allDataRows, setAllDataRows] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [existingSubmissionInfo, setExistingSubmissionInfo] = useState(null);

  const scriptURL = "https://script.google.com/macros/s/AKfycbw6xeabQpVzEnNMhLWfMAwLJ0hFZxA2L89aX17-p4b-caM4SdpsETrtq5GT4Lwk84qL/exec";
  const sheetId = "162o34BXqnJvmJjjtIoQpcBGo8orn2ZO5Jf0p8MgoUCs";
  const sheetName = "Ugrasen Nayak";

  const parseScoresFromRow = (row) => {
    return {
      budgetTracking: row[4] !== undefined && row[4] !== "" ? row[4] : "",
      vendorPayments: row[5] !== undefined && row[5] !== "" ? row[5] : "",
      billCollection: row[6] !== undefined && row[6] !== "" ? row[6] : "",
      patientRoomCleaning: row[7] !== undefined && row[7] !== "" ? row[7] : "",
      roomService: row[8] !== undefined && row[8] !== "" ? row[8] : "",
      patientFeedback: row[9] !== undefined && row[9] !== "" ? row[9] : "",
      staffCounselling: row[10] !== undefined && row[10] !== "" ? row[10] : "",
      staffMobilization: row[11] !== undefined && row[11] !== "" ? row[11] : "",
      sopAuditScore: row[12] !== undefined && row[12] !== "" ? row[12] : "",
      bmwChecklist: row[13] !== undefined && row[13] !== "" ? row[13] : "",
      wasteSegregation: row[14] !== undefined && row[14] !== "" ? row[14] : "",
      stpEtpManagement: row[15] !== undefined && row[15] !== "" ? row[15] : "",
      spillManagement: row[16] !== undefined && row[16] !== "" ? row[16] : "",
      cleaningChecklist: row[17] !== undefined && row[17] !== "" ? row[17] : "",
      mgpsChecking: row[18] !== undefined && row[18] !== "" ? row[18] : "",
      hygienicAtmosphere: row[19] !== undefined && row[19] !== "" ? row[19] : "",
      amcCmcTracking: row[20] !== undefined && row[20] !== "" ? row[20] : "",
      reportSubmission: row[21] !== undefined && row[21] !== "" ? row[21] : "",
      staffTraining: row[22] !== undefined && row[22] !== "" ? row[22] : "",
      managementTraining: row[23] !== undefined && row[23] !== "" ? row[23] : "",
      additionalWorks: row[24] !== undefined && row[24] !== "" ? row[24] : "",
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

  const fetchUserData = async () => {
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
      console.error('Error fetching user data:', error);
      toast.error('Failed to load scorecard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleMonthChange = (e) => {
    const newMonth = e.target.value;
    setSelectedMonth(newMonth);
    applyMonthData(newMonth, allDataRows);
  };

  const handleScoreChange = (kpi, value) => {
    // Ensure value is within range
    const numValue = parseFloat(value);
    if (numValue < 0) return;

    setScores(prev => ({
      ...prev,
      [kpi]: value
    }));
  };

  const calculateTotals = () => {
    const jobAssessmentTotal = Object.values(scores).reduce((a, b) => a + (parseFloat(b) || 0), 0);

    // Calculate target totals (out of values)
    const jobAssessmentTargets = [3, 3, 3, 6, 5, 5, 2, 3, 6, 4, 4, 3, 5, 3, 5, 2, 3, 5, 6, 2, 2];

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

    // Validate if all required scores are filled
    const requiredScores = Object.values(scores).filter(score => score === '');
    if (requiredScores.length > 0) {
      if (!confirm('Some scores are empty. Do you want to submit anyway?')) {
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Prepare data according to column structure
      const currentDate = new Date();

      // Format timestamp as dd/mm/yyyy hh:mm:ss
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
        timestamp, // Column A (index-0) - Timestamp
        submissionMonth, // Column B (index-1) - Current Month (e.g. August 2026)
        employeeName, // Column C (index-2) - Employee Name
        "", // Column D (index-3) - Empty column
        scores.budgetTracking || 0, // Column E (index-4) - Tracking the monthly budget vs expenses of HK department
        scores.vendorPayments || 0, // Column F (index-5) - Tracking the pending payments of vendor and complete it within the TAT
        scores.billCollection || 0, // Column G (index-6) - Timely collect & checking the bills of vendor and submit to store and accounts department
        scores.patientRoomCleaning || 0, // Column H (index-7) - Cleaning the patient rooms properly as per the cleaning checklist
        scores.roomService || 0, // Column I (index-8) - Ensure for the room service as per the patient call bell
        scores.patientFeedback || 0, // Column J (index-9) - Patient feedback <80%
        scores.staffCounselling || 0, // Column K (index-10) - Counselling the staff as per the need
        scores.staffMobilization || 0, // Column L (index-11) - Monthly wise staff mobilization, Duty alertment
        scores.sopAuditScore || 0, // Column M (index-12) - Monthly SOP Audit score by HOD >= 80%
        scores.bmwChecklist || 0, // Column N (index-13) - Maintain the BMW checklist on daily basis
        scores.wasteSegregation || 0, // Column O (index-14) - Maintain the waste segregation as per the BMW act
        scores.stpEtpManagement || 0, // Column P (index-15) - Maintain the STP and ETP Management as per the pollution control act
        scores.spillManagement || 0, // Column Q (index-16) - Control the spill management within the TAT
        scores.cleaningChecklist || 0, // Column R (index-17) - Follow the checklist of Daily, Weekly and Monthly cleaning floor wise
        scores.mgpsChecking || 0, // Column S (index-18) - Checking of MGPS on daily and weekly basis with record keeping
        scores.hygienicAtmosphere || 0, // Column T (index-19) - Maintain the hygienic and ecofriendly atmosphere within the building
        scores.amcCmcTracking || 0, // Column U (index-20) - Tracking of AMC and CMC of departmental machineries on periodically
        scores.reportSubmission || 0, // Column V (index-21) - 100% adherence to timeline for submission of reports to management and ensure timely update reports by subordinates
        scores.staffTraining || 0, // Column W (index-22) - Impart per month (6 hr) Training to subordinates regarding new policies, Cleaning method, Fire Mock Drill and Emergency codes
        scores.managementTraining || 0, // Column X (index-23) - Attend Training conducted by management (Departmental / Cross functional)
        scores.additionalWorks || 0, // Column Y (index-24) - Laundary, Paste Control, Construction, Renovation and Compliances
      ];

      const response = await fetch(scriptURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `sheetId=${encodeURIComponent(sheetId)}&sheetName=${encodeURIComponent(sheetName)}&payload=${encodeURIComponent(JSON.stringify(rowData))}`
      });

      if (response.ok) {
        toast.success(`Scores for ${submissionMonth} submitted successfully!`);
        fetchUserData();
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

      {/* Month Selector & Submission Status Banner */}
      <div style={{
        marginBottom: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        padding: '16px 20px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '15px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <label style={{ fontWeight: 'bold', color: '#1e3a8a', fontSize: '15px' }}>
            Select Month:
          </label>
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              border: '2px solid #1e3a8a',
              fontWeight: 'bold',
              color: '#1e3a8a',
              backgroundColor: '#f8fafc',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {availableMonths.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <button
            onClick={fetchUserData}
            disabled={isLoading}
            style={{
              padding: '8px 12px',
              backgroundColor: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              color: '#475569',
              fontWeight: '500'
            }}
          >
            {isLoading ? 'Loading...' : '🔄 Refresh Data'}
          </button>
        </div>

        <div>
          {existingSubmissionInfo ? (
            <div style={{
              backgroundColor: '#dcfce7',
              border: '1px solid #86efac',
              color: '#166534',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '600'
            }}>
              ✅ Submitted on: {existingSubmissionInfo.timestamp} | Your Score: {existingSubmissionInfo.totalScore} / {existingSubmissionInfo.targetScore} ({existingSubmissionInfo.percentage}%)
            </div>
          ) : (
            <div style={{
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#1e40af',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '600'
            }}>
              📝 Enter your scores for {selectedMonth} below
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '30px', backgroundColor: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 6px 10px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ color: '#1e3a8a', borderBottom: '3px solid #1e3a8a', paddingBottom: '10px', marginBottom: '20px' }}>JOB ASSESSMENT</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: '8px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ backgroundColor: '#1e3a8a', color: 'white' }}>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #1e40af' }}>KRA</th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #1e40af' }}>KPI</th>
              <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #1e40af', width: '100px' }}>Out of</th>
              <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #1e40af', width: '120px' }}>Score</th>
            </tr>
          </thead>
          <tbody>

            {/* Expenses KRA */}
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td rowSpan="2" style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff', verticalAlign: 'top' }}>Expenses</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Tracking the monthly budget vs expenses of HK department</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>3</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input
                  type="number"
                  value={scores.budgetTracking}
                  onChange={(e) => handleScoreChange('budgetTracking', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-3"
                  min="0"
                  max="3"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Tracking the pending payments of vendor and complete it within the TAT</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>3</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input
                  type="number"
                  value={scores.vendorPayments}
                  onChange={(e) => handleScoreChange('vendorPayments', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-3"
                  min="0"
                  max="3"
                />
              </td>
            </tr>

            {/* Checking KRA */}
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff' }}>Checking</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Timely collect & checking the bills of vendor and submit to store and accounts department</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>3</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input
                  type="number"
                  value={scores.billCollection}
                  onChange={(e) => handleScoreChange('billCollection', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-3"
                  min="0"
                  max="3"
                />
              </td>
            </tr>

            {/* Patient Satisfaction KRA */}
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td rowSpan="3" style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff', verticalAlign: 'top' }}>Patient Satisfaction</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Cleaning the patient rooms properly as per the cleaning checklist</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>6</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input
                  type="number"
                  value={scores.patientRoomCleaning}
                  onChange={(e) => handleScoreChange('patientRoomCleaning', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-6"
                  min="0"
                  max="6"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Ensure for the room service as per the patient call bell</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>5</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input
                  type="number"
                  value={scores.roomService}
                  onChange={(e) => handleScoreChange('roomService', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-5"
                  min="0"
                  max="5"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Patient feedback {'<'}80%</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>5</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input
                  type="number"
                  value={scores.patientFeedback}
                  onChange={(e) => handleScoreChange('patientFeedback', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-5"
                  min="0"
                  max="5"
                />
              </td>
            </tr>

            {/* Employee Satisfaction KRA */}
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td rowSpan="2" style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff', verticalAlign: 'top' }}>Employee Satisfaction</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Counselling the staff as per the need</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>2</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input
                  type="number"
                  value={scores.staffCounselling}
                  onChange={(e) => handleScoreChange('staffCounselling', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-2"
                  min="0"
                  max="2"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Monthly wise staff mobilization, Duty alertment</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>3</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input
                  type="number"
                  value={scores.staffMobilization}
                  onChange={(e) => handleScoreChange('staffMobilization', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-3"
                  min="0"
                  max="3"
                />
              </td>
            </tr>

            {/* SOP KRA */}
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff' }}>SOP</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Monthly SOP Audit score by HOD {'>='} 80%</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>6</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input
                  type="number"
                  value={scores.sopAuditScore}
                  onChange={(e) => handleScoreChange('sopAuditScore', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-6"
                  min="0"
                  max="6"
                />
              </td>
            </tr>

            {/* Operational KRA */}
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td rowSpan="8" style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff', verticalAlign: 'top' }}>Operational</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Maintain the BMW checklist on daily basis</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>4</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input
                  type="number"
                  value={scores.bmwChecklist}
                  onChange={(e) => handleScoreChange('bmwChecklist', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-4"
                  min="0"
                  max="4"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Maintain the waste segregation as per the BMW act</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>4</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input
                  type="number"
                  value={scores.wasteSegregation}
                  onChange={(e) => handleScoreChange('wasteSegregation', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-4"
                  min="0"
                  max="4"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Maintain the STP and ETP Management as per the pollution control act</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>3</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input
                  type="number"
                  value={scores.stpEtpManagement}
                  onChange={(e) => handleScoreChange('stpEtpManagement', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-3"
                  min="0"
                  max="3"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Control the spill management within the TAT</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>5</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input
                  type="number"
                  value={scores.spillManagement}
                  onChange={(e) => handleScoreChange('spillManagement', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-5"
                  min="0"
                  max="5"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Follow the checklist of Daily, Weekly and Monthly cleaning floor wise</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>3</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input
                  type="number"
                  value={scores.cleaningChecklist}
                  onChange={(e) => handleScoreChange('cleaningChecklist', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-3"
                  min="0"
                  max="3"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Checking of MGPS on daily and weekly basis with record keeping</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>5</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input
                  type="number"
                  value={scores.mgpsChecking}
                  onChange={(e) => handleScoreChange('mgpsChecking', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-5"
                  min="0"
                  max="5"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Maintain the hygienic and ecofriendly atmosphere within the building</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>2</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input
                  type="number"
                  value={scores.hygienicAtmosphere}
                  onChange={(e) => handleScoreChange('hygienicAtmosphere', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-2"
                  min="0"
                  max="2"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Tracking of AMC and CMC of departmental machineries on periodically</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>3</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input
                  type="number"
                  value={scores.amcCmcTracking}
                  onChange={(e) => handleScoreChange('amcCmcTracking', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-3"
                  min="0"
                  max="3"
                />
              </td>
            </tr>
            {/* Reports KRA */}
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff' }}>Reports</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>100% adherence to timeline for submission of reports to management and ensure timely update reports by subordinates</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>5</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input
                  type="number"
                  value={scores.reportSubmission}
                  onChange={(e) => handleScoreChange('reportSubmission', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-5"
                  min="0"
                  max="5"
                />
              </td>
            </tr>

            {/* Training & Development KRA */}
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td rowSpan="2" style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff', verticalAlign: 'top' }}>Training & Development</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Impart per month (6 hr) Training to subordinates regarding new policies, Cleaning method, Fire Mock Drill and Emergency codes</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>6</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input
                  type="number"
                  value={scores.staffTraining}
                  onChange={(e) => handleScoreChange('staffTraining', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-6"
                  min="0"
                  max="6"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Attend Training conducted by management (Departmental / Cross functional)</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>2</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input
                  type="number"
                  value={scores.managementTraining}
                  onChange={(e) => handleScoreChange('managementTraining', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-2"
                  min="0"
                  max="2"
                />
              </td>
            </tr>

            {/* Additional Responsibilities KRA */}
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td rowSpan="2" style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff', verticalAlign: 'top' }}>Additional Responsibilities</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Laundary, Paste Control, Construction, Renovation and Compliances</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>2</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input
                  type="number"
                  value={scores.additionalWorks}
                  onChange={(e) => handleScoreChange('additionalWorks', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-2"
                  min="0"
                  max="2"
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
          {isSubmitting ? 'Submitting...' : 'Submit Scores'}
        </button>
      </div>
    </div>
  );
};
