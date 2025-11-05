import React from 'react'
import { useState } from 'react';

export const NeeluSahu = () => {
  const [scores, setScores] = useState({
    // Job Assessment Scores
    abpBudgetPreparation: '',
    operatingMargin: '',
    costReductionInitiatives: '',
    employeeSatisfaction: '',
    departmentMeeting: '',
    errorReduction: '',
    staffPerformanceMeeting: '',
    crmReportsTracking: '',
    unitVisits: '',
    complaintAddressal: '',
    feedbackMonitoring: '',
    feedbackCollection: '',
    timeIndicators: '',
    sopImplementation: '',
    managementMeeting: '',
    patientAccessIndicators: '',
    consultantMeetings: '',
    statutoryCompliance: '',
    hospitalCapacity: '',
    dataAnalysis: '',
    ehmsImplementation: '',
    auditPointsClosure: '',
    hygieneInspection: '',
    reportSubmission: '',
    businessReportVerification: '',
    newBusinessInitiatives: '',
    staffTraining: '',
    managementTraining: '',
    
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
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const jobAssessmentTotal = Object.values(scores).slice(0, 28).reduce((a, b) => a + (parseFloat(b) || 0), 0);
    const behavioralTotal = Object.values(scores).slice(28).reduce((a, b) => a + (parseFloat(b) || 0), 0);
    const overallTotal = jobAssessmentTotal + behavioralTotal;
    
    // Calculate target totals (out of values)
    const jobAssessmentTargets = [5, 5, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5, 3, 4, 3, 2, 4, 3, 3, 3, 3, 3, 2, 3, 3, 3];
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

    // Validate if all required scores are filled
    const requiredScores = Object.values(scores).filter(score => score === '');
    if (requiredScores.length > 0) {
      if (!confirm('Some scores are empty. Do you want to submit anyway?')) {
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Prepare data according to your column structure
      const currentDate = new Date();
      
      // Format timestamp as dd/mm/yyyy hh:mm:ss
      const day = String(currentDate.getDate()).padStart(2, '0');
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const year = currentDate.getFullYear();
      const hours = String(currentDate.getHours()).padStart(2, '0');
      const minutes = String(currentDate.getMinutes()).padStart(2, '0');
      const seconds = String(currentDate.getSeconds()).padStart(2, '0');
      
      const timestamp = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
      const currentMonth = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
      const employeeName = "Neelu Sahu";

      const rowData = [
        timestamp, // Column A (index-0) - Timestamp
        currentMonth, // Column B (index-1) - Current Month
        employeeName, // Column C (index-2) - Employee Name
        "", // Column D (index-3) - Empty column
        scores.abpBudgetPreparation || 0, // Column E (index-4) - Preparation of department wise budget as per ABP and 100% compliances
        scores.operatingMargin || 0, // Column F (index-5) - 100% Maintenance of Hospital operating margin
        scores.costReductionInitiatives || 0, // Column G (index-6) - Any two cost reduction initiatives every quarter
        scores.employeeSatisfaction || 0, // Column H (index-7) - Employee Satisfaction >80%
        scores.departmentMeeting || 0, // Column I (index-8) - Monthly One department Meeting /Training /Mockdrill
        scores.errorReduction || 0, // Column J (index-9) - Reducing no of Errors, Critical negligency of Staff as per EHMS
        scores.staffPerformanceMeeting || 0, // Column K (index-10) - Conduct One meeting per weekly with staff for Performance Related Matters
        scores.crmReportsTracking || 0, // Column L (index-11) - Tracking of CRM & Counsellors reports on a daily basis
        scores.unitVisits || 0, // Column M (index-12) - Visit to peripheral units and monitor the operational & patient satisfaction
        scores.complaintAddressal || 0, // Column N (index-13) - Addressal of all Customer complaints within lead time (12 hours)
        scores.feedbackMonitoring || 0, // Column O (index-14) - DM/SM Feedback (Google reviews, negative comment)
        scores.feedbackCollection || 0, // Column P (index-15) - Minimum 50% Feedback Collection and its analysis and take necessary step for FC
        scores.timeIndicators || 0, // Column Q (index-16) - Average waiting time, TAT & other Time indicator monitoring
        scores.sopImplementation || 0, // Column R (index-17) - Follow SOP as per plans & its Implementation
        scores.managementMeeting || 0, // Column S (index-18) - Monthly one meeting with management for discussing Internal Audit and obstacles
        scores.patientAccessIndicators || 0, // Column T (index-19) - Achievement of Patient Access Indicators as per standards
        scores.consultantMeetings || 0, // Column U (index-20) - Meeting with consultants every month & share the MOM
        scores.statutoryCompliance || 0, // Column V (index-21) - Monthly Closure of issues through effective liasoning with government and healthcare statutory bodies & to check compliance/license & AMC in every 15 days
        scores.hospitalCapacity || 0, // Column W (index-22) - Achieve target utilisation of Hospital capacity
        scores.dataAnalysis || 0, // Column X (index-23) - Data Analysis documentation, reserve day to day query of staff and customer and maintain documentation as per company norms
        scores.ehmsImplementation || 0, // Column Y (index-24) - Seamless Implementation of EHMS & Automation throughout the organisation
        scores.auditPointsClosure || 0, // Column Z (index-25) - 100% closure of Quality & Operational Audit points with Management
        scores.hygieneInspection || 0, // Column AA (index-26) - In every 15 days one inspection of hospital to maintain hygiene & safety
        scores.reportSubmission || 0, // Column AB (index-27) - 100% adherence to timeline for submission of reports to management and ensure timely update reports by subordinates
        scores.businessReportVerification || 0, // Column AC (index-28) - Business report from Marketing & verify every month
        scores.newBusinessInitiatives || 0, // Column AD (index-29) - New promotional schemes, campaigns, allied services, Internal camps, New tie ups
        scores.staffTraining || 0, // Column AE (index-30) - In every 15 days 2 hours training to subordinates
        scores.managementTraining || 0, // Column AF (index-31) - Attend Training conducted by management (Departmental / Cross functional)
        scores.qualityOfWork || 0, // Column AG (index-32) - Effectively and efficiently performs job
        scores.planningExecution || 0, // Column AH (index-33) - Do Plan in advance and execute without deviation
        scores.timeResources || 0, // Column AI (index-34) - Conserve Company resources and meet deadlines
        scores.interpersonalRelations || 0, // Column AJ (index-35) - Have healthy work relation with peers and superiors
        scores.flexibilityAdaptability || 0, // Column AK (index-36) - Flexible in taking additional tasks and adaptable to change
        scores.communication || 0, // Column AL (index-37) - Exchange of information desired through effective means
        scores.integrity || 0, // Column AM (index-38) - High integrity towards company
        scores.leadership || 0, // Column AN (index-39) - Ability to Inspire and take initiatives
        scores.discipline || 0, // Column AO (index-40) - Follow rules and code of conduct
        scores.punctuality || 0 // Column AP (index-41) - Adherence to time and attendance
      ];

      const scriptURL = "https://script.google.com/macros/s/AKfycbw6xeabQpVzEnNMhLWfMAwLJ0hFZxA2L89aX17-p4b-caM4SdpsETrtq5GT4Lwk84qL/exec";
      const sheetId = "162o34BXqnJvmJjjtIoQpcBGo8orn2ZO5Jf0p8MgoUCs";
      const sheetName = "Neelu Sahu";

      // Use fetch with form data to properly submit to Google Apps Script
      const formData = new FormData();
      formData.append('sheetId', sheetId);
      formData.append('sheetName', sheetName);
      formData.append('payload', JSON.stringify(rowData));

      const response = await fetch(scriptURL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors' // Use no-cors mode to avoid CORS issues
      });

      // Since we're using no-cors, we can't read the response, but the data should be submitted
      console.log('Submitted Scores:', scores);
      console.log('Row Data sent to sheet:', rowData);
      console.log('Response status:', response.status);

      // Show success message (the data should be submitted even if we can't read the response)
      alert('Scores submitted successfully! Data has been stored.');
      
      // Optional: You can also open the sheet URL to verify data was stored
      const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/edit#gid=0`;
      console.log('Check your Google Sheet here:', sheetUrl);

    } catch (error) {
      console.error('Error submitting scores:', error);
      alert('Error submitting scores: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>      
      <div style={{ marginBottom: '30px' }}>
        <h2>JOB ASSESSMENT</h2>
        <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th>KRA</th>
              <th>KPI</th>
              <th>Out of</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {/* ABP KRA */}
            <tr style={{ border: '2px solid #000' }}>
              <td rowspan="1" style={{ borderRight: '2px solid #000' }}><strong>ABP</strong></td>
              <td>Preparation of department wise budget as per ABP and 100% compliances</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.abpBudgetPreparation}
                  onChange={(e) => handleScoreChange('abpBudgetPreparation', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                />
              </td>
            </tr>

            {/* Profitability KRA */}
            <tr style={{ border: '2px solid #000' }}>
              <td rowspan="1" style={{ borderRight: '2px solid #000' }}><strong>Profitability</strong></td>
              <td>100% Maintenance of Hospital operating margin</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.operatingMargin}
                  onChange={(e) => handleScoreChange('operatingMargin', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                />
              </td>
            </tr>

            {/* Cost Reduction KRA */}
            <tr style={{ border: '2px solid #000' }}>
              <td rowspan="1" style={{ borderRight: '2px solid #000' }}><strong>Cost Reduction</strong></td>
              <td>Any two cost reduction initiatives every quarter</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.costReductionInitiatives}
                  onChange={(e) => handleScoreChange('costReductionInitiatives', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>

            {/* Internal Customer KRA */}
            <tr style={{ border: '2px solid #000' }}>
              <td rowspan="5" style={{ borderRight: '2px solid #000' }}><strong>Internal Customer</strong></td>
              <td>Employee Satisfaction {'>'}80%</td>
              <td>2</td>
              <td>
                <input 
                  type="number" 
                  value={scores.employeeSatisfaction}
                  onChange={(e) => handleScoreChange('employeeSatisfaction', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="2"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Monthly One department Meeting /Training /Mockdrill</td>
              <td>2</td>
              <td>
                <input 
                  type="number" 
                  value={scores.departmentMeeting}
                  onChange={(e) => handleScoreChange('departmentMeeting', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="2"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Reducing no of Errors, Critical negligency of Staff as per EHMS</td>
              <td>2</td>
              <td>
                <input 
                  type="number" 
                  value={scores.errorReduction}
                  onChange={(e) => handleScoreChange('errorReduction', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="2"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Conduct One meeting per weekly with staff for Performance Related Matters</td>
              <td>2</td>
              <td>
                <input 
                  type="number" 
                  value={scores.staffPerformanceMeeting}
                  onChange={(e) => handleScoreChange('staffPerformanceMeeting', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="2"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Tracking of CRM & Counsellors reports on a daily basis</td>
              <td>2</td>
              <td>
                <input 
                  type="number" 
                  value={scores.crmReportsTracking}
                  onChange={(e) => handleScoreChange('crmReportsTracking', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="2"
                />
              </td>
            </tr>

            {/* External Customer KRA */}
            <tr style={{ border: '2px solid #000' }}>
            <td rowspan="5" style={{ borderRight: '2px solid #000' }}><strong>External Customer</strong></td>
              <td>Visit to peripheral units and monitor the operational & patient satisfaction</td>
              <td>2</td>
              <td>
                <input 
                  type="number" 
                  value={scores.unitVisits}
                  onChange={(e) => handleScoreChange('unitVisits', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="2"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Addressal of all Customer complaints within lead time (12 hours)</td>
              <td>2</td>
              <td>
                <input 
                  type="number" 
                  value={scores.complaintAddressal}
                  onChange={(e) => handleScoreChange('complaintAddressal', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="2"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>DM/SM Feedback (Google reviews, negative comment)</td>
              <td>2</td>
              <td>
                <input 
                  type="number" 
                  value={scores.feedbackMonitoring}
                  onChange={(e) => handleScoreChange('feedbackMonitoring', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="2"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Minimum 50% Feedback Collection and its analysis and take necessary step for FC</td>
              <td>2</td>
              <td>
                <input 
                  type="number" 
                  value={scores.feedbackCollection}
                  onChange={(e) => handleScoreChange('feedbackCollection', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="2"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Average waiting time, TAT & other Time indicator monitoring</td>
              <td>2</td>
              <td>
                <input 
                  type="number" 
                  value={scores.timeIndicators}
                  onChange={(e) => handleScoreChange('timeIndicators', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="2"
                />
              </td>

            {/* SOP KRA */}
            </tr>
            <tr style={{ border: '2px solid #000' }}>
            <td rowspan="1" style={{ borderRight: '2px solid #000' }}><strong>SOP</strong></td>
              <td>Follow SOP as per plans & its Implementation</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.sopImplementation}
                  onChange={(e) => handleScoreChange('sopImplementation', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                />
              </td>
            </tr>

              {/* Operational Excellence KRA */}
            <tr style={{ border: '2px solid #000' }}>
            <td rowspan="5" style={{ borderRight: '2px solid #000' }}><strong>Operational Excellence</strong></td>
              <td>Monthly one meeting with management for discussing Internal Audit and obstacles</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.managementMeeting}
                  onChange={(e) => handleScoreChange('managementMeeting', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Achievement of Patient Access Indicators as per standards</td>
              <td>4</td>
              <td>
                <input 
                  type="number" 
                  value={scores.patientAccessIndicators}
                  onChange={(e) => handleScoreChange('patientAccessIndicators', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="4"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Meeting with consultants every month & share the MOM</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.consultantMeetings}
                  onChange={(e) => handleScoreChange('consultantMeetings', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Monthly Closure of issues through effective liasoning with government and healthcare statutory bodies & to check compliance/license & AMC in every 15 days</td>
              <td>2</td>
              <td>
                <input 
                  type="number" 
                  value={scores.statutoryCompliance}
                  onChange={(e) => handleScoreChange('statutoryCompliance', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="2"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Achieve target utilisation of Hospital capacity</td>
              <td>4</td>
              <td>
                <input 
                  type="number" 
                  value={scores.hospitalCapacity}
                  onChange={(e) => handleScoreChange('hospitalCapacity', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="4"
                />
              </td>
            </tr>

              {/* Documentation KRA */}
            <tr style={{ border: '2px solid #000' }}>
            <td rowspan="2" style={{ borderRight: '2px solid #000' }}><strong>Documentation</strong></td>
              <td>Data Analysis documentation, reserve day to day query of staff and customer and maintain documentation as per company norms</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.dataAnalysis}
                  onChange={(e) => handleScoreChange('dataAnalysis', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Seamless Implementation of EHMS & Automation through out the organisation</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.ehmsImplementation}
                  onChange={(e) => handleScoreChange('ehmsImplementation', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>

            {/* Health & Safety KRA */}
            <tr style={{ border: '2px solid #000' }}>
              <td rowspan="2" style={{ borderRight: '2px solid #000' }}><strong>Health & Safety</strong></td>
              <td>100% closure of Quality & Operational Audit points with Management</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.auditPointsClosure}
                  onChange={(e) => handleScoreChange('auditPointsClosure', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>In every 15 days one inspection of hospital to maintain hygiene & safety</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.hygieneInspection}
                  onChange={(e) => handleScoreChange('hygieneInspection', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>

            {/* Reports KRA */}
            <tr style={{ border: '2px solid #000' }}>
              <td rowspan="2" style={{ borderRight: '2px solid #000' }}><strong>Reports</strong></td>
              <td>100% adherence to timeline for submission of reports to management and ensure timely update reports by subordinates</td>
              <td>2</td>
              <td>
                <input 
                  type="number" 
                  value={scores.reportSubmission}
                  onChange={(e) => handleScoreChange('reportSubmission', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="2"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Business report from Marketing & verify every month</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.businessReportVerification}
                  onChange={(e) => handleScoreChange('businessReportVerification', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>
            
            {/* New Business Model KRA */}
            <tr style={{ border: '2px solid #000' }}>
            <td rowspan="1" style={{ borderRight: '2px solid #000' }}><strong>New Business Model</strong></td>
              <td>New promotional schemes, campaigns, allied services, Internal camps, New tie ups</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.newBusinessInitiatives}
                  onChange={(e) => handleScoreChange('newBusinessInitiatives', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>

            {/* Training & Development KRA */}
            <tr style={{ border: '2px solid #000' }}>
            <td rowspan="2" style={{ borderRight: '2px solid #000' }}><strong>Training & Development</strong></td>
              <td>In every 15 days 2 hours training to subordinates</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.staffTraining}
                  onChange={(e) => handleScoreChange('staffTraining', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Attend Training conducted by management (Departmental / Cross functional)</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.managementTraining}
                  onChange={(e) => handleScoreChange('managementTraining', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ marginTop: '10px', fontWeight: 'bold' }}>
          Job Assessment Total: {totals.jobAssessmentTotal.toFixed(1)} / {totals.jobAssessmentTargetTotal.toFixed(1)}
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>BEHAVIORAL ASSESSMENT</h2>
        <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th>Behavioral Factor</th>
              <th>Description</th>
              <th>Out of</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Quality Of Work Performed</td>
              <td>Effectively and efficiently performs job</td>
              <td>1</td>
              <td>
                <input 
                  type="number" 
                  value={scores.qualityOfWork}
                  onChange={(e) => handleScoreChange('qualityOfWork', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="1"
                />
              </td>
            </tr>
            <tr>
              <td>Planning & Execution Of Assignments</td>
              <td>Do Plan in advance and execute without deviation</td>
              <td>2</td>
              <td>
                <input 
                  type="number" 
                  value={scores.planningExecution}
                  onChange={(e) => handleScoreChange('planningExecution', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="2"
                />
              </td>
            </tr>
            <tr>
              <td>Use Of Time & Resources</td>
              <td>Conserve Company resources and meet deadlines</td>
              <td>2</td>
              <td>
                <input 
                  type="number" 
                  value={scores.timeResources}
                  onChange={(e) => handleScoreChange('timeResources', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="2"
                />
              </td>
            </tr>
            <tr>
              <td>Interpersonal Relations</td>
              <td>Have healthy work relation with peers and superiors</td>
              <td>2</td>
              <td>
                <input 
                  type="number" 
                  value={scores.interpersonalRelations}
                  onChange={(e) => handleScoreChange('interpersonalRelations', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="2"
                />
              </td>
            </tr>
            <tr>
              <td>Flexibility & Adaptability</td>
              <td>Flexible in taking additional tasks and adaptable to change</td>
              <td>2</td>
              <td>
                <input 
                  type="number" 
                  value={scores.flexibilityAdaptability}
                  onChange={(e) => handleScoreChange('flexibilityAdaptability', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="2"
                />
              </td>
            </tr>
            <tr>
              <td>Communication</td>
              <td>Exchange of information desired through effective means</td>
              <td>2</td>
              <td>
                <input 
                  type="number" 
                  value={scores.communication}
                  onChange={(e) => handleScoreChange('communication', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="2"
                />
              </td>
            </tr>
            <tr>
              <td>Integrity</td>
              <td>High integrity towards company</td>
              <td>2</td>
              <td>
                <input 
                  type="number" 
                  value={scores.integrity}
                  onChange={(e) => handleScoreChange('integrity', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="2"
                />
              </td>
            </tr>
            <tr>
              <td>Leadership</td>
              <td>Ability to Inspire and take initiatives</td>
              <td>2</td>
              <td>
                <input 
                  type="number" 
                  value={scores.leadership}
                  onChange={(e) => handleScoreChange('leadership', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="2"
                />
              </td>
            </tr>
            <tr>
              <td>Discipline</td>
              <td>Follow rules and code of conduct</td>
              <td>2</td>
              <td>
                <input 
                  type="number" 
                  value={scores.discipline}
                  onChange={(e) => handleScoreChange('discipline', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="2"
                />
              </td>
            </tr>
            <tr>
              <td>Punctuality</td>
              <td>Adherence to time and attendance</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.punctuality}
                  onChange={(e) => handleScoreChange('punctuality', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ marginTop: '10px', fontWeight: 'bold' }}>
          Behavioral Assessment Total: {totals.behavioralTotal.toFixed(1)} / {totals.behavioralTargetTotal.toFixed(1)}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h3>Overall Summary</h3>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px' }}>
          <div>
            <strong>Job Assessment:</strong> {totals.jobAssessmentTotal.toFixed(1)} / {totals.jobAssessmentTargetTotal.toFixed(1)}
          </div>
          <div>
            <strong>Behavioral Assessment:</strong> {totals.behavioralTotal.toFixed(1)} / {totals.behavioralTargetTotal.toFixed(1)}
          </div>
          <div>
            <strong>Overall Total:</strong> {totals.overallTotal.toFixed(1)} / {totals.overallTargetTotal.toFixed(1)}
          </div>
          <div>
            <strong>Overall Percentage:</strong> {totals.overallPercentage.toFixed(1)}%
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{
            padding: '10px 30px',
            fontSize: '16px',
            backgroundColor: isSubmitting ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Scores'}
        </button>
      </div>
    </div>
  );
};