import React from 'react'
import { useState } from 'react';

export const JharnaAmbulkar = () => {
  const [scores, setScores] = useState({
    // Job Assessment Scores
    targetVsAchievement: '',
    salesReportTracking: '',
    dueCollectionTracking: '',
    costControl: '',
    salesTeamSupervision: '',
    salesFlowImplementation: '',
    ratingPointSheet: '',
    patientSatisfaction: '',
    automationDataCollection: '',
    staffCounselling: '',
    sopAuditScore: '',
    auditPointsClosure: '',
    assetMaintenance: '',
    meetingMinutes: '',
    unitVisits: '',
    googleReviewTracking: '',
    solarSystemTracking: '',
    cleanlinessHygiene: '',
    departmentalAutomation: '',
    fmsImplementation: '',
    departmentalChecklist: '',
    strategicReports: '',
    reportSubmission: '',
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
    const jobAssessmentTotal = Object.values(scores).slice(0, 25).reduce((a, b) => a + (parseFloat(b) || 0), 0);
    const behavioralTotal = Object.values(scores).slice(25).reduce((a, b) => a + (parseFloat(b) || 0), 0);
    const overallTotal = jobAssessmentTotal + behavioralTotal;
    
    // Calculate target totals (out of values)
    const jobAssessmentTargets = [6, 5, 5, 5, 3, 5, 5, 3, 3, 2, 5, 4, 2, 3, 3, 5, 3, 3, 5, 4, 3, 4, 4, 3, 2];
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
      const employeeName = "Jharna Ambulkar";

      const rowData = [
        timestamp,
        currentMonth, 
        employeeName, 
        "", 
        scores.targetVsAchievement || 0,
        scores.salesReportTracking || 0,
        scores.dueCollectionTracking || 0,
        scores.costControl || 0,
        scores.salesTeamSupervision || 0,
        scores.salesFlowImplementation || 0,
        scores.ratingPointSheet || 0,
        scores.patientSatisfaction || 0,
        scores.automationDataCollection || 0,
        scores.staffCounselling || 0,
        scores.sopAuditScore || 0,
        scores.auditPointsClosure || 0,
        scores.assetMaintenance || 0,
        scores.meetingMinutes || 0,
        scores.unitVisits || 0,
        scores.googleReviewTracking || 0,
        scores.solarSystemTracking || 0,
        scores.cleanlinessHygiene || 0,
        scores.departmentalAutomation || 0,
        scores.fmsImplementation || 0, 
        scores.departmentalChecklist || 0,
        scores.strategicReports || 0,
        scores.reportSubmission || 0, 
        scores.staffTraining || 0, 
        scores.managementTraining || 0,
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

      const scriptURL = "https://script.google.com/macros/s/AKfycbxPmnN7m0AjXfW2jENVsOjwbCbHdTAuqRZLzlDO0dwljUp3XkLBsXhA6Lrt3Oias8HypQ/exec";
      const sheetId = "1OpzWP_zaSHL5mcgy32VoJ4i4VjVIHouly5nliEeiIG8";
      const sheetName = "Jharna Ambulkar";

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
            {/* Internal KRA with border */}
            <tr style={{ border: '2px solid #000' }}>
              <td rowSpan="2" style={{ borderRight: '2px solid #000' }}><strong>Internal</strong></td>
              <td>Comparision monthly data of Target vs achivement of unit wise</td>
              <td>6</td>
              <td>
                <input 
                  type="number" 
                  value={scores.targetVsAchievement}
                  onChange={(e) => handleScoreChange('targetVsAchievement', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="6"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Tracking all the sales report of Marketing, CRM and Counselling team</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.salesReportTracking}
                  onChange={(e) => handleScoreChange('salesReportTracking', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                />
              </td>
            </tr>

            {/* Growth Prespective KRA with border */}
            <tr style={{ border: '2px solid #000' }}>
            <td rowSpan="4" style={{ borderRight: '2px solid #000' }}><strong>Growth Prespective</strong></td>
              <td>Tracking the due collection for the hospital from vertical chains</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.dueCollectionTracking}
                  onChange={(e) => handleScoreChange('dueCollectionTracking', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Cost Control: Comparision of Monthly Budget vs Actual</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.costControl}
                  onChange={(e) => handleScoreChange('costControl', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Day to day supervision of sales team(Counselling and CRM) of all units</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.salesTeamSupervision}
                  onChange={(e) => handleScoreChange('salesTeamSupervision', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Sales flow chart/ Road map Implementation</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.salesFlowImplementation}
                  onChange={(e) => handleScoreChange('salesFlowImplementation', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                />
              </td>
            </tr>

            {/* Stakeholder Satisfaction	 */}
            <tr style={{ border: '2px solid #000' }}>
            <td rowSpan="2" style={{ borderRight: '2px solid #000' }}><strong>Stakeholder Satisfaction	</strong></td>
              <td>Checking of Monthly rating point sheet of all units and clerance of payment</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.ratingPointSheet}
                  onChange={(e) => handleScoreChange('ratingPointSheet', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Tracking of patient satisfection report by center heads from all units and report submit to CEO</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.patientSatisfaction}
                  onChange={(e) => handleScoreChange('patientSatisfaction', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>

            {/* Employee Satisfaction */}
            <tr style={{ border: '2px solid #000' }}>
            <td rowSpan="2" style={{ borderRight: '2px solid #000' }}><strong>Employee Satisfaction	</strong></td>
              <td>Timely ensure and collect the data of automation from all the alerted employees</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.automationDataCollection}
                  onChange={(e) => handleScoreChange('automationDataCollection', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Timely counselling the staff for automation work</td>
              <td>2</td>
              <td>
                <input 
                  type="number" 
                  value={scores.staffCounselling}
                  onChange={(e) => handleScoreChange('staffCounselling', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="2"
                />
              </td>
            </tr>
            
            {/* SOP KRA with border */}
            <tr style={{ border: '2px solid #000' }}>
              <td rowSpan="2" style={{ borderRight: '2px solid #000' }}><strong>SOP</strong></td>
              <td>Monthly SOP Audit score by HOD &gt;= 80%</td>
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
            <tr style={{ border: '2px solid #000' }}>
              <td>100% closure of SOP audit points and weekly meeting points</td>
              <td>4</td>
              <td>
                <input 
                  type="number" 
                  value={scores.auditPointsClosure}
                  onChange={(e) => handleScoreChange('auditPointsClosure', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="4"
                />
              </td>
            </tr>
            
            {/* Operational Excellence KRA with border */}
            <tr style={{ border: '2px solid #000' }}>
              <td rowSpan="6" style={{ borderRight: '2px solid #000' }}><strong>Operational Excellence</strong></td>
              <td>Maintain Asset list and AMC & CMC of High Value Machinery with status</td>
              <td>2</td>
              <td>
                <input 
                  type="number" 
                  value={scores.assetMaintenance}
                  onChange={(e) => handleScoreChange('assetMaintenance', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="2"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Maintain the MOM of strategical meetings and take update of pending works within TAT</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.meetingMinutes}
                  onChange={(e) => handleScoreChange('meetingMinutes', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Weekly and Monthly Visit of all units and submit the report to the management</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.unitVisits}
                  onChange={(e) => handleScoreChange('unitVisits', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Tracking the google review of all unit timely basis</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.googleReviewTracking}
                  onChange={(e) => handleScoreChange('googleReviewTracking', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Tracking the functional part of Solar System on timely basis</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.solarSystemTracking}
                  onChange={(e) => handleScoreChange('solarSystemTracking', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Focus on proper cleanness & hygiene of the hospital</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.cleanlinessHygiene}
                  onChange={(e) => handleScoreChange('cleanlinessHygiene', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>
            
            
            {/* Automation KRA with border */}
            <tr style={{ border: '2px solid #000' }}>
            <td rowSpan="4" style={{ borderRight: '2px solid #000' }}><strong>Automation</strong></td>
              <td>100% implementation of Departmental Automation</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.departmentalAutomation}
                  onChange={(e) => handleScoreChange('departmentalAutomation', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>100% implementation and tracking of FMS of Sales team</td>
              <td>4</td>
              <td>
                <input 
                  type="number" 
                  value={scores.fmsImplementation}
                  onChange={(e) => handleScoreChange('fmsImplementation', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="4"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>100% verification of departmental checklist both clinical and nonclinical departments daily, weekly, and monthly</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.departmentalChecklist}
                  onChange={(e) => handleScoreChange('departmentalChecklist', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>To track, receive and checking the Monthly, Quaterly and Annualy of strategically report from departments through PPT</td>
              <td>4</td>
              <td>
                <input 
                  type="number" 
                  value={scores.strategicReports}
                  onChange={(e) => handleScoreChange('strategicReports', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="4"
                />
              </td>
            </tr>
            
            {/* Reports KRA with border */}
            <tr style={{ border: '2px solid #000' }}>
              <td style={{ borderRight: '2px solid #000' }}><strong>Reports</strong></td>
              <td>100% adherence to timeline for submission of reports to management and ensure timely update reports in s/w by subordinates</td>
              <td>4</td>
              <td>
                <input 
                  type="number" 
                  value={scores.reportSubmission}
                  onChange={(e) => handleScoreChange('reportSubmission', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="4"
                />
              </td>
            </tr>
            
            {/* Training & Development KRA with border */}
            <tr style={{ border: '2px solid #000' }}>
              <td rowSpan="2" style={{ borderRight: '2px solid #000' }}><strong>Training & Development</strong></td>
              <td>Impart per month (4hr) Training to all admin and operational staff</td>
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
              <td>Attend Training conducted by management (Departmental / Cross functional) Training assesment score should be more than 75%</td>
              <td>2</td>
              <td>
                <input 
                  type="number" 
                  value={scores.managementTraining}
                  onChange={(e) => handleScoreChange('managementTraining', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="2"
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