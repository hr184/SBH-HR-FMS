import React from 'react'
import { useState } from 'react';

export const DeepuMourya = () => {
  const [scores, setScores] = useState({
    // Job Assessment Scores
    insuranceTarget: '',
    customerProblemSolving: '',
    sopAuditScore: '',
    auditPointsClosure: '',
    ipdDischargeDocs: '',
    billApprovalPendencies: '',
    managerialSystemInspection: '',
    patientRecordMaintenance: '',
    enrollmentVerification: '',
    prePostApproval: '',
    cashPaymentCases: '',
    extraBillingCases: '',
    tpaCorporateTieups: '',
    reportSubmission: '',
    subordinateTraining: '',
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
    const jobAssessmentTotal = Object.values(scores).slice(0, 16).reduce((a, b) => a + (parseFloat(b) || 0), 0);
    const behavioralTotal = Object.values(scores).slice(16).reduce((a, b) => a + (parseFloat(b) || 0), 0);
    const overallTotal = jobAssessmentTotal + behavioralTotal;
    
    // Calculate target totals (out of values)
    const jobAssessmentTargets = [8, 5, 5, 6, 5, 5, 5, 5, 5, 6, 3, 3, 7, 6, 3, 3];
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
      const employeeName = "Deepu Mourya";

      const rowData = [
        timestamp, // Column A (index-0) - Timestamp
        currentMonth, // Column B (index-1) - Current Month
        employeeName, // Column C (index-2) - Employee Name
        "", // Column D (index-3) - Empty column
        scores.insuranceTarget || 0, // Column E (index-4) - 100% Achievement of Insurance target through effective councelling
        scores.customerProblemSolving || 0, // Column F (index-5) - Identify and solve the customer regarding policy terms and conditions
        scores.sopAuditScore || 0, // Column G (index-6) - Monthly SOP Audit score by HOD >=80%
        scores.auditPointsClosure || 0, // Column H (index-7) - 100% Closure of Audit points regarding quality of work offering to patients
        scores.ipdDischargeDocs || 0, // Column I (index-8) - Zero Delay in submission of IPD and Discharge docs. to third party regarding reimburishment
        scores.billApprovalPendencies || 0, // Column J (index-9) - Zero pendencies on approval and passing bills to Front Office
        scores.managerialSystemInspection || 0, // Column K (index-10) - Montly Inspection of managerial system & patient documentation
        scores.patientRecordMaintenance || 0, // Column L (index-11) - 100% Maintain complete record of of hospital / patients to the Society/Insurer or representative
        scores.enrollmentVerification || 0, // Column M (index-12) - 100% verification of Enrollment process of the patients to avail the benefits
        scores.prePostApproval || 0, // Column N (index-13) - 100% Adherence for Post & Pre approval and upload the documents in Portal
        scores.cashPaymentCases || 0, // Column O (index-14) - Zero Illegal cases of cash payments by beneficiary
        scores.extraBillingCases || 0, // Column P (index-15) - Zero cases of Extra Billing for services not provided
        scores.tpaCorporateTieups || 0, // Column Q (index-16) - TPA and Corporate tie ups, and organising camps
        scores.reportSubmission || 0, // Column R (index-17) - 100% adherence to timeline for submission of reports to management and ensure timely update reports in s/w by subordinates
        scores.subordinateTraining || 0, // Column S (index-18) - Impart per month (2hr) Training to subordinates regarding new policies, new empanelments, rates & other things to billing, CRM & Counsellors
        scores.managementTraining || 0, // Column T (index-19) - Attend Training conducted by management (Departmental / Cross functional)
        scores.qualityOfWork || 0, // Column U (index-20) - Effectively and efficiently performs job
        scores.planningExecution || 0, // Column V (index-21) - Do Plan in advance and execute without deviation
        scores.timeResources || 0, // Column W (index-22) - Conserve Company resources and meet deadlines
        scores.interpersonalRelations || 0, // Column X (index-23) - Have healthy work relation with peers and superiors
        scores.flexibilityAdaptability || 0, // Column Y (index-24) - Flexible in taking additional tasks and adaptable to change
        scores.communication || 0, // Column Z (index-25) - Exchange of information desired through effective means
        scores.integrity || 0, // Column AA (index-26) - High integrity towards company
        scores.leadership || 0, // Column AB (index-27) - Ability to Inspire and take initiatives
        scores.discipline || 0, // Column AC (index-28) - Follow rules and code of conduct
        scores.punctuality || 0 // Column AD (index-29) - Adherence to time and attendance
      ];

      const scriptURL = "https://script.google.com/macros/s/AKfycbw6xeabQpVzEnNMhLWfMAwLJ0hFZxA2L89aX17-p4b-caM4SdpsETrtq5GT4Lwk84qL/exec";
      const sheetId = "162o34BXqnJvmJjjtIoQpcBGo8orn2ZO5Jf0p8MgoUCs";
      const sheetName = "Deepu Mourya";

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
            {/* Profitability KRA with border */}
            <tr style={{ border: '2px solid #000' }}>
              <td style={{ borderRight: '2px solid #000' }}><strong>Profitability</strong></td>
              <td>100% Achievement of Insurance target through effective councelling</td>
              <td>8</td>
              <td>
                <input 
                  type="number" 
                  value={scores.insuranceTarget}
                  onChange={(e) => handleScoreChange('insuranceTarget', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="8"
                />
              </td>
            </tr>
            
            {/* Internal Customer Satisfaction KRA with border */}
            <tr style={{ border: '2px solid #000' }}>
              <td style={{ borderRight: '2px solid #000' }}><strong>Internal Customer Satisfaction</strong></td>
              <td>Identify and solve the customer regarding policy terms and conditions</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.customerProblemSolving}
                  onChange={(e) => handleScoreChange('customerProblemSolving', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                />
              </td>
            </tr>
            
            {/* SOP KRA with border */}
            <tr style={{ border: '2px solid #000' }}>
              <td style={{ borderRight: '2px solid #000' }}><strong>SOP</strong></td>
              <td>Monthly SOP Audit score by HOD &gt;=80%</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.sopAuditScore}
                  onChange={(e) => handleScoreChange('sopAuditScore', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                />
              </td>
            </tr>
            
            {/* Operational Excellence KRA with border */}
            <tr style={{ border: '2px solid #000' }}>
              <td rowSpan="9" style={{ borderRight: '2px solid #000' }}><strong>Operational Excellence</strong></td>
              <td>100% Closure of Audit points regarding quality of work offering to patients</td>
              <td>6</td>
              <td>
                <input 
                  type="number" 
                  value={scores.auditPointsClosure}
                  onChange={(e) => handleScoreChange('auditPointsClosure', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="6"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Zero Delay in submission of IPD and Discharge docs. to third party regarding reimburishment</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.ipdDischargeDocs}
                  onChange={(e) => handleScoreChange('ipdDischargeDocs', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Zero pendencies on approval and passing bills to Front Office</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.billApprovalPendencies}
                  onChange={(e) => handleScoreChange('billApprovalPendencies', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Montly Inspection of managerial system & patient documentation</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.managerialSystemInspection}
                  onChange={(e) => handleScoreChange('managerialSystemInspection', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>100% Maintain complete record of of hospital / patients to the Society/Insurer or representative</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.patientRecordMaintenance}
                  onChange={(e) => handleScoreChange('patientRecordMaintenance', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>100% verification of Enrollment process of the patients to avail the benefits</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.enrollmentVerification}
                  onChange={(e) => handleScoreChange('enrollmentVerification', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>100% Adherence for Post & Pre approval and upload the documents in Portal</td>
              <td>6</td>
              <td>
                <input 
                  type="number" 
                  value={scores.prePostApproval}
                  onChange={(e) => handleScoreChange('prePostApproval', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="6"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Zero Illegal cases of cash payments by beneficiary</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.cashPaymentCases}
                  onChange={(e) => handleScoreChange('cashPaymentCases', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Zero cases of Extra Billing for services not provided</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.extraBillingCases}
                  onChange={(e) => handleScoreChange('extraBillingCases', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>
            
            {/* Tieups KRA with border */}
            <tr style={{ border: '2px solid #000' }}>
              <td style={{ borderRight: '2px solid #000' }}><strong>Tieups</strong></td>
              <td>TPA and Corporate tie ups, and organising camps</td>
              <td>7</td>
              <td>
                <input 
                  type="number" 
                  value={scores.tpaCorporateTieups}
                  onChange={(e) => handleScoreChange('tpaCorporateTieups', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="7"
                />
              </td>
            </tr>
            
            {/* Reports KRA with border */}
            <tr style={{ border: '2px solid #000' }}>
              <td style={{ borderRight: '2px solid #000' }}><strong>Reports</strong></td>
              <td>100% adherence to timeline for submission of reports to management and ensure timely update reports in s/w by subordinates</td>
              <td>6</td>
              <td>
                <input 
                  type="number" 
                  value={scores.reportSubmission}
                  onChange={(e) => handleScoreChange('reportSubmission', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="6"
                />
              </td>
            </tr>
            
            {/* Training & Development KRA with border */}
            <tr style={{ border: '2px solid #000' }}>
              <td rowSpan="2" style={{ borderRight: '2px solid #000' }}><strong>Training & Development</strong></td>
              <td>Impart per month (2hr) Training to subordinates regarding new policies, new empanelments, rates & other things to billing, CRM & Counsellors</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.subordinateTraining}
                  onChange={(e) => handleScoreChange('subordinateTraining', e.target.value)}
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