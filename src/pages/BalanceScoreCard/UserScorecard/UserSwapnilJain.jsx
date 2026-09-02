import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MonthSelectorBanner } from '../MonthSelectorBanner';
import { fetchScorecardSheetData, extractDataRows, extractAvailableMonths, getDefaultSelectedMonth, findUserSubmission } from '../scorecardHelper';

export const UserSwapnilJain = () => {
  const initialScores = {
    teamWorkAttitude: '',
    resourceUtilization: '',
    statisticalReports: '',
    patientWelfarePrograms: '',
    staffManagement: '',
    nabhQualityStandards: '',
    hospitalLicenses: '',
    empanelmentOwnership: '',
    corporateEmpanelment: '',
    tpaCoordination: '',
    incidentReporting: '',
    grievanceHandling: '',
    qualitySafetyConsciousness: '',
    concessionReporting: '',
    ipBillingCollections: '',
    wardInspection: '',
    dailyOperations: '',
    patientFlow: '',
    facilityUpkeep: '',
    resourcePlanning: '',
    customerExperience: '',
    vipHandling: '',
    problemSolving: '',
    automationUpdation: '',
    taskManagement: '',
    businessTargets: '',
    additionalTasks: '',
    doctorIncentive: '',
  };

  const [scores, setScores] = useState(initialScores);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [allDataRows, setAllDataRows] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [existingSubmissionInfo, setExistingSubmissionInfo] = useState(null);

  const primarySheetName = "Swapnil Jain";
  const fallbackSheetName = "Alka Das";

  const parseScoresFromRow = (row) => {
    return {
      teamWorkAttitude: row[4] !== undefined && row[4] !== "" ? row[4] : "",
      resourceUtilization: row[5] !== undefined && row[5] !== "" ? row[5] : "",
      statisticalReports: row[6] !== undefined && row[6] !== "" ? row[6] : "",
      patientWelfarePrograms: row[7] !== undefined && row[7] !== "" ? row[7] : "",
      staffManagement: row[8] !== undefined && row[8] !== "" ? row[8] : "",
      nabhQualityStandards: row[9] !== undefined && row[9] !== "" ? row[9] : "",
      hospitalLicenses: row[10] !== undefined && row[10] !== "" ? row[10] : "",
      empanelmentOwnership: row[11] !== undefined && row[11] !== "" ? row[11] : "",
      corporateEmpanelment: row[12] !== undefined && row[12] !== "" ? row[12] : "",
      tpaCoordination: row[13] !== undefined && row[13] !== "" ? row[13] : "",
      incidentReporting: row[14] !== undefined && row[14] !== "" ? row[14] : "",
      grievanceHandling: row[15] !== undefined && row[15] !== "" ? row[15] : "",
      qualitySafetyConsciousness: row[16] !== undefined && row[16] !== "" ? row[16] : "",
      concessionReporting: row[17] !== undefined && row[17] !== "" ? row[17] : "",
      ipBillingCollections: row[18] !== undefined && row[18] !== "" ? row[18] : "",
      wardInspection: row[19] !== undefined && row[19] !== "" ? row[19] : "",
      dailyOperations: row[20] !== undefined && row[20] !== "" ? row[20] : "",
      patientFlow: row[21] !== undefined && row[21] !== "" ? row[21] : "",
      facilityUpkeep: row[22] !== undefined && row[22] !== "" ? row[22] : "",
      resourcePlanning: row[23] !== undefined && row[23] !== "" ? row[23] : "",
      customerExperience: row[24] !== undefined && row[24] !== "" ? row[24] : "",
      vipHandling: row[25] !== undefined && row[25] !== "" ? row[25] : "",
      problemSolving: row[26] !== undefined && row[26] !== "" ? row[26] : "",
      automationUpdation: row[27] !== undefined && row[27] !== "" ? row[27] : "",
      taskManagement: row[28] !== undefined && row[28] !== "" ? row[28] : "",
      businessTargets: row[29] !== undefined && row[29] !== "" ? row[29] : "",
      additionalTasks: row[30] !== undefined && row[30] !== "" ? row[30] : "",
      doctorIncentive: row[31] !== undefined && row[31] !== "" ? row[31] : "",
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
    const jobAssessmentTargets = [4, 3, 2, 4, 3, 2, 3, 4, 3, 2, 3, 3, 4, 2, 3, 3, 3, 4, 3, 2, 3, 1, 4, 2, 3, 3, 2, 2];
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
        timestamp, submissionMonth, employeeName, "",
        scores.teamWorkAttitude || 0, scores.resourceUtilization || 0, scores.statisticalReports || 0, scores.patientWelfarePrograms || 0,
        scores.staffManagement || 0, scores.nabhQualityStandards || 0, scores.hospitalLicenses || 0, scores.empanelmentOwnership || 0,
        scores.corporateEmpanelment || 0, scores.tpaCoordination || 0, scores.incidentReporting || 0, scores.grievanceHandling || 0,
        scores.qualitySafetyConsciousness || 0, scores.concessionReporting || 0, scores.ipBillingCollections || 0, scores.wardInspection || 0,
        scores.dailyOperations || 0, scores.patientFlow || 0, scores.facilityUpkeep || 0, scores.resourcePlanning || 0,
        scores.customerExperience || 0, scores.vipHandling || 0, scores.problemSolving || 0, scores.automationUpdation || 0,
        scores.taskManagement || 0, scores.businessTargets || 0, scores.additionalTasks || 0, scores.doctorIncentive || 0,
      ];

      const scriptURL = "https://script.google.com/macros/s/AKfycbw6xeabQpVzEnNMhLWfMAwLJ0hFZxA2L89aX17-p4b-caM4SdpsETrtq5GT4Lwk84qL/exec";
      const sheetId = "162o34BXqnJvmJjjtIoQpcBGo8orn2ZO5Jf0p8MgoUCs";

      let response = await fetch(scriptURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `sheetId=${encodeURIComponent(sheetId)}&sheetName=${encodeURIComponent(primarySheetName)}&payload=${encodeURIComponent(JSON.stringify(rowData))}`
      });

      if (!response.ok) {
        response = await fetch(scriptURL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `sheetId=${encodeURIComponent(sheetId)}&sheetName=${encodeURIComponent(fallbackSheetName)}&payload=${encodeURIComponent(JSON.stringify(rowData))}`
        });
      }

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

  const jobKpis = [
    { kra: 'Operations', kpi: 'Promote team work and attitude towards growth of the organization', outOf: 4, key: 'teamWorkAttitude' },
    { kra: 'Operations', kpi: 'Optimum utilisation of all the available resources and avoid duplication of work', outOf: 3, key: 'resourceUtilization' },
    { kra: 'Operations', kpi: 'Statistical, financial and other required MIS data to be submitted on 2nd of every month', outOf: 2, key: 'statisticalReports' },
    { kra: 'Operations', kpi: 'Ensuring seamless workflow of all patient welfare and CSR programs', outOf: 4, key: 'patientWelfarePrograms' },
    { kra: 'Operations', kpi: 'Efficient staff management and department roaster compliance', outOf: 3, key: 'staffManagement' },
    { kra: 'Operations', kpi: 'NABH quality standards compliance and regular documentation', outOf: 2, key: 'nabhQualityStandards' },
    { kra: 'Operations', kpi: 'Timely renewal and tracking of hospital licenses and statutory approvals', outOf: 3, key: 'hospitalLicenses' },
    { kra: 'Empanelment', kpi: 'Complete ownership and renewal of institutional/corporate empanelments', outOf: 4, key: 'empanelmentOwnership' },
    { kra: 'Empanelment', kpi: 'Adding new corporate clients and maintaining good business relations', outOf: 3, key: 'corporateEmpanelment' },
    { kra: 'TPA', kpi: 'Coordinating with TPA desk for minimizing query turnaround time and rejections', outOf: 2, key: 'tpaCoordination' },
    { kra: 'Quality', kpi: 'Daily incident reporting, root cause analysis and corrective action implementation', outOf: 3, key: 'incidentReporting' },
    { kra: 'Quality', kpi: 'Patient grievance handling and resolving disputes within specified TAT', outOf: 3, key: 'grievanceHandling' },
    { kra: 'Quality', kpi: 'Promoting quality and safety consciousness across all operational areas', outOf: 4, key: 'qualitySafetyConsciousness' },
    { kra: 'Billing', kpi: 'Timely reporting and tracking of concessions and discounts given', outOf: 2, key: 'concessionReporting' },
    { kra: 'Billing', kpi: 'Overseeing IP billing collections and minimizing outstanding balance at discharge', outOf: 3, key: 'ipBillingCollections' },
    { kra: 'Hospital Floor', kpi: 'Regular daily ward and floor inspection for cleanliness, safety and comfort', outOf: 3, key: 'wardInspection' },
    { kra: 'Hospital Floor', kpi: 'Smooth coordination between clinical and non-clinical departments', outOf: 3, key: 'dailyOperations' },
    { kra: 'Hospital Floor', kpi: 'Streamlining OPD and IPD patient flow to minimize waiting time', outOf: 4, key: 'patientFlow' },
    { kra: 'Hospital Floor', kpi: 'Ensuring proper maintenance and upkeep of all physical facilities', outOf: 3, key: 'facilityUpkeep' },
    { kra: 'Planning', kpi: 'Resource planning, duty allocation and contingency management', outOf: 2, key: 'resourcePlanning' },
    { kra: 'Patient Care', kpi: 'Delivering exceptional customer experience and positive patient feedback', outOf: 3, key: 'customerExperience' },
    { kra: 'Patient Care', kpi: 'Special assistance and priority management for VIP and emergency cases', outOf: 1, key: 'vipHandling' },
    { kra: 'Management', kpi: 'Prompt problem solving and escalating critical concerns to leadership', outOf: 4, key: 'problemSolving' },
    { kra: 'Management', kpi: 'Active participation in hospital automation and HIS updates', outOf: 2, key: 'automationUpdation' },
    { kra: 'Management', kpi: 'Effective task management and meeting operational KPIs set by management', outOf: 3, key: 'taskManagement' },
    { kra: 'Targets', kpi: 'Supporting department heads in achieving monthly operational and revenue targets', outOf: 3, key: 'businessTargets' },
    { kra: 'Targets', kpi: 'Handling special projects and additional assignments delegated by management', outOf: 2, key: 'additionalTasks' },
    { kra: 'Targets', kpi: 'Verifying doctor incentive data and operational reconciliation reports', outOf: 2, key: 'doctorIncentive' }
  ];

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
        employeeName="Swapnil Jain"
      />

      <div style={{ marginBottom: '30px', backgroundColor: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 6px 10px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ color: '#1e3a8a', borderBottom: '3px solid #1e3a8a', paddingBottom: '10px', marginBottom: '20px' }}>JOB ASSESSMENT (Operations Scorecard)</h2>
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
            {jobKpis.map((kpi, idx) => (
              <tr key={kpi.key} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                <td style={{ padding: '12px', border: '1px solid #e2e8f0', fontWeight: 'bold', color: '#1e3a8a' }}>{kpi.kra}</td>
                <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>{kpi.kpi}</td>
                <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>{kpi.outOf}</td>
                <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <input type="number" min="0" max={kpi.outOf} value={scores[kpi.key]} onChange={(e) => handleScoreChange(kpi.key, e.target.value)} style={{ width: '60px', padding: '6px', textAlign: 'center', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                </td>
              </tr>
            ))}
            <tr style={{ backgroundColor: '#1e3a8a', color: 'white', fontWeight: 'bold' }}>
              <td colSpan="2" style={{ padding: '12px', border: '1px solid #1e40af', textAlign: 'right' }}>Total Score:</td>
              <td style={{ padding: '12px', border: '1px solid #1e40af', textAlign: 'center' }}>{totals.jobAssessmentTargetTotal}</td>
              <td style={{ padding: '12px', border: '1px solid #1e40af', textAlign: 'center' }}>{totals.jobAssessmentTotal}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 6px 10px rgba(0, 0, 0, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <span style={{ fontSize: '16px', color: '#1e3a8a', fontWeight: 'bold' }}>
            Overall Percentage: {totals.overallPercentage.toFixed(2)}%
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
          {isSubmitting ? 'Submitting...' : existingSubmissionInfo ? `Update & Re-Submit for ${selectedMonth}` : `Submit Scores for ${selectedMonth}`}
        </button>
      </div>
    </div>
  );
};

export const UserAlkaDas = UserSwapnilJain;
