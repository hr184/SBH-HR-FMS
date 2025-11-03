import { useState } from "react";

export const DeepmalaPatil = () => {
  const [scores, setScores] = useState({
    // Job Assessment Scores - Updated KPIs for Deepmala Patil
    advancePaymentCollection: '',
    targetAchievement: '',
    opdConversion: '',
    paymentClearance: '',
    customerSatisfaction: '',
    complaintClosure: '',
    callTracking: '',
    sopAudit: '',
    managementMeetings: '',
    reminderCalls: '',
    patchPendencies: '',
    riskIdentification: '',
    consentForms: '',
    goggleDistribution: '',
    dutyRoster: '',
    waitingTime: '',
    doctorCoordination: '',
    discountClearance: '',
    consumablesAvailability: '',
    reportTimeline: '',
    subordinateTraining: '',
    trainingAttendance: '',
    
    // Behavioral Assessment Scores (unchanged)
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
    const jobAssessmentTotal = Object.values(scores).slice(0, 22).reduce((a, b) => a + (parseFloat(b) || 0), 0);
    const behavioralTotal = Object.values(scores).slice(22).reduce((a, b) => a + (parseFloat(b) || 0), 0);
    const overallTotal = jobAssessmentTotal + behavioralTotal;
    
    // Calculate target totals (out of values) - Updated targets for Deepmala Patil
    const jobAssessmentTargets = [6, 7, 5, 3, 5, 4, 3, 5, 5, 3, 3, 3, 3, 3, 3, 2, 2, 3, 3, 3, 3, 3];
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
      const employeeName = "Deepmala Patil";

      const rowData = [
        timestamp, // Column A (index-0) - Timestamp
        currentMonth, // Column B (index-1) - Current Month
        employeeName, // Column C (index-2) - Employee Name
        "", // Column D (index-3) - Empty column
        scores.advancePaymentCollection || 0, // Column E (index-4) - 100% Advance payment collection from OPD patients
        scores.targetAchievement || 0, // Column F (index-5) - Periodically Target VS Achievement as per roadmap
        scores.opdConversion || 0, // Column G (index-6) - To track OPD appointment VS footfall conversion & lost patient
        scores.paymentClearance || 0, // Column H (index-7) - 100% payment clearance of all the associate consultants on monthly basis
        scores.customerSatisfaction || 0, // Column I (index-8) - Customer Satisfaction should be >80%
        scores.complaintClosure || 0, // Column J (index-9) - Closure of customer complaints within 24 hours TAT
        scores.callTracking || 0, // Column K (index-10) - Track the call details of CRM & Counsellor on a daily basis
        scores.sopAudit || 0, // Column L (index-11) - Monthly SOP Audit score by HOD >= 75%
        scores.managementMeetings || 0, // Column M (index-12) - Monthly atleast 2 meeting with management for discussing Internal Audit and obstacles faced during OPD
        scores.reminderCalls || 0, // Column N (index-13) - 100% Adherence for reminding call regarding pre and post operation
        scores.patchPendencies || 0, // Column O (index-14) - Zero pendencies in Patch open, follow up and their appointment
        scores.riskIdentification || 0, // Column P (index-15) - 100% identification of risks or emergencies during surgery
        scores.consentForms || 0, // Column Q (index-16) - 100% Filling of consent form from patient and relative before surgery and keep them separately and safely
        scores.goggleDistribution || 0, // Column R (index-17) - 100% distribution of LASIK goggles to the patient after opening temporary/stripe patches
        scores.dutyRoster || 0, // Column S (index-18) - Prepare Duty roster of all staff including consultants
        scores.waitingTime || 0, // Column T (index-19) - To monitor and reduce patient waiting time in optom's and doctor's chamber
        scores.doctorCoordination || 0, // Column U (index-20) - Coordination with visiting doctors & complete arrangements
        scores.discountClearance || 0, // Column V (index-21) - To check and clear all the discounts/refunds of patients in HMIS within TAT
        scores.consumablesAvailability || 0, // Column W (index-22) - 100% availability and maintain the consumables in concerned departments
        scores.reportTimeline || 0, // Column X (index-23) - 100% adherence to timeline for submission of reports to management and ensure timely update reports by subordinates
        scores.subordinateTraining || 0, // Column Y (index-24) - Impart per month (2hr) Training to subordinates
        scores.trainingAttendance || 0, // Column Z (index-25) - Attend Training conducted by management (Departmental / Cross functional)
        scores.qualityOfWork || 0, // Column AA (index-26) - Effectively and efficiently performs job
        scores.planningExecution || 0, // Column AB (index-27) - Do Plan in advance and execute without deviation
        scores.timeResources || 0, // Column AC (index-28) - Conserve Company resources and meet deadlines
        scores.interpersonalRelations || 0, // Column AD (index-29) - Have healthy work relation with peers and superiors
        scores.flexibilityAdaptability || 0, // Column AE (index-30) - Flexible in taking additional tasks and adaptable to change
        scores.communication || 0, // Column AF (index-31) - Exchange of information desired through effective means
        scores.integrity || 0, // Column AG (index-32) - High integrity towards company
        scores.leadership || 0, // Column AH (index-33) - Ability to Inspire and take initiatives
        scores.discipline || 0, // Column AI (index-34) - Follow rules and code of conduct
        scores.punctuality || 0 // Column AJ (index-35) - Adherence to time and attendance
      ];

      const scriptURL = "https://script.google.com/macros/s/AKfycbxPmnN7m0AjXfW2jENVsOjwbCbHdTAuqRZLzlDO0dwljUp3XkLBsXhA6Lrt3Oias8HypQ/exec";
      const sheetId = "1OpzWP_zaSHL5mcgy32VoJ4i4VjVIHouly5nliEeiIG8";
      const sheetName = "Deepmala Patil";

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
            {/* Profitability KRA */}
            <tr style={{ border: '2px solid #000' }}>
              <td rowSpan="4" style={{ borderRight: '2px solid #000' }}><strong>Profitability</strong></td>
              <td>100% Advance payment collection from OPD patients</td>
              <td>6</td>
              <td>
                <input 
                  type="number" 
                  value={scores.advancePaymentCollection}
                  onChange={(e) => handleScoreChange('advancePaymentCollection', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="6"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Periodically Target VS Achievement as per roadmap</td>
              <td>7</td>
              <td>
                <input 
                  type="number" 
                  value={scores.targetAchievement}
                  onChange={(e) => handleScoreChange('targetAchievement', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="7"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>To track OPD appointment VS footfall conversion & lost patient</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.opdConversion}
                  onChange={(e) => handleScoreChange('opdConversion', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>100% payment clearance of all the associate consultants on monthly basis</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.paymentClearance}
                  onChange={(e) => handleScoreChange('paymentClearance', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>

            {/* Customer Satisfaction KRA */}
            <tr style={{ border: '2px solid #000' }}>
              <td rowSpan="3" style={{ borderRight: '2px solid #000' }}><strong>Customer Satisfaction</strong></td>
              <td>Customer Satisfaction should be &gt;80%</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.customerSatisfaction}
                  onChange={(e) => handleScoreChange('customerSatisfaction', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Closure of customer complaints within 24 hours TAT</td>
              <td>4</td>
              <td>
                <input 
                  type="number" 
                  value={scores.complaintClosure}
                  onChange={(e) => handleScoreChange('complaintClosure', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="4"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Track the call details of CRM & Counsellor on a daily basis</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.callTracking}
                  onChange={(e) => handleScoreChange('callTracking', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>

            {/* SOP KRA */}
            <tr style={{ border: '2px solid #000' }}>
              <td style={{ borderRight: '2px solid #000' }}><strong>SOP</strong></td>
              <td>Monthly SOP Audit score by HOD &gt;= 75%</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.sopAudit}
                  onChange={(e) => handleScoreChange('sopAudit', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                />
              </td>
            </tr>

            {/* Operational Excellence KRA */}
            <tr style={{ border: '2px solid #000' }}>
              <td rowSpan="11" style={{ borderRight: '2px solid #000' }}><strong>Operational Excellence</strong></td>
              <td>Monthly atleast 2 meeting with management for discussing Internal Audit and obstacles faced during OPD</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.managementMeetings}
                  onChange={(e) => handleScoreChange('managementMeetings', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>100% Adherence for reminding call regarding pre and post operation</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.reminderCalls}
                  onChange={(e) => handleScoreChange('reminderCalls', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Zero pendencies in Patch open, follow up and their appointment</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.patchPendencies}
                  onChange={(e) => handleScoreChange('patchPendencies', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>100% identification of risks or emergencies during surgery</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.riskIdentification}
                  onChange={(e) => handleScoreChange('riskIdentification', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>100% Filling of consent form from patient and relative before surgery and keep them separately and safely</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.consentForms}
                  onChange={(e) => handleScoreChange('consentForms', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>100% distribution of LASIK goggles to the patient after opening temporary/stripe patches</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.goggleDistribution}
                  onChange={(e) => handleScoreChange('goggleDistribution', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Prepare Duty roster of all staff including consultants</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.dutyRoster}
                  onChange={(e) => handleScoreChange('dutyRoster', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>To monitor and reduce patient waiting time in optom's and doctor's chamber</td>
              <td>2</td>
              <td>
                <input 
                  type="number" 
                  value={scores.waitingTime}
                  onChange={(e) => handleScoreChange('waitingTime', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="2"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Coordination with visiting doctors & complete arrangements</td>
              <td>2</td>
              <td>
                <input 
                  type="number" 
                  value={scores.doctorCoordination}
                  onChange={(e) => handleScoreChange('doctorCoordination', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="2"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>To check and clear all the discounts/refunds of patients in HMIS within TAT</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.discountClearance}
                  onChange={(e) => handleScoreChange('discountClearance', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>100% availability and maintain the consumables in concerned departments</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.consumablesAvailability}
                  onChange={(e) => handleScoreChange('consumablesAvailability', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>

             {/* Reports KRA */}
            <tr style={{ border: '2px solid #000' }}>
            <td style={{ borderRight: '2px solid #000' }}><strong>Reports</strong></td>
              <td>100% adherence to timeline for submission of reports to management and ensure timely update reports by subordinates</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.reportTimeline}
                  onChange={(e) => handleScoreChange('reportTimeline', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>

            {/* Training & Development KRA */}
            <tr style={{ border: '2px solid #000' }}>
              <td rowSpan="2" style={{ borderRight: '2px solid #000' }}><strong>Training & Development</strong></td>
              <td>Impart per month (2hr) Training to subordinates</td>
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
                  value={scores.trainingAttendance}
                  onChange={(e) => handleScoreChange('trainingAttendance', e.target.value)}
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

      {/* Behavioral Assessment Section - UNCHANGED */}
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

      {/* Overall Summary Section - UNCHANGED */}
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
  )
}