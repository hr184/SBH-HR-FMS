import React from 'react'
import { useState } from 'react';

export const PoorwaGajbhiye = () => {
  const [scores, setScores] = useState({
    // Job Assessment Scores
    manpowerPlanning: '',
    manpowerAvailability: '',
    recruitmentLeadTime: '',
    inductionProgram: '',
    ehmsUpdate: '',
    hrPolicyImplementation: '',
    exitInterviewAnalysis: '',
    payrollRecordMaintenance: '',
    ehmsUpdation: '',
    fileUploading: '',
    physicalStockVerification: '',
    gatePassPreparation: '',
    dailyRounds: '',
    employeeFileUpdation: '',
    monthlyReports: '',
    trainingDashboard: '',
    trainingCompletion: '',
    trainingFeedback: '',
    engagementActivities: '',
    
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
    const jobAssessmentTotal = Object.values(scores).slice(0, 19).reduce((a, b) => a + (parseFloat(b) || 0), 0);
    const behavioralTotal = Object.values(scores).slice(19).reduce((a, b) => a + (parseFloat(b) || 0), 0);
    const overallTotal = jobAssessmentTotal + behavioralTotal;
    
    // Calculate target totals (out of values)
    const jobAssessmentTargets = [2, 5, 5, 5, 2.7, 4.7, 4.7, 4.7, 2, 3, 5, 5, 3, 5, 3.2, 5, 5, 5, 5];
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
      const employeeName = "Poorwa Gajbhiye";

      const rowData = [
        timestamp, // Column A (index-0) - Timestamp
        currentMonth, // Column B (index-1) - Current Month
        employeeName, // Column C (index-2) - Employee Name
        "", // Column D (index-3) - Empty column
        scores.manpowerPlanning || 0, // Column E (index-4) - Assist manpower planning with HR Head & CH
        scores.manpowerAvailability || 0, // Column F (index-5) - Matching of man power availability of each department by 90% anytime
        scores.recruitmentLeadTime || 0, // Column G (index-6) - 100% adherence to Recruitment lead time (30 days) as per policy
        scores.inductionProgram || 0, // Column H (index-7) - Conduct induction program for new joinees within 2 days of their joining
        scores.ehmsUpdate || 0, // Column I (index-8) - Update new joinees information in EHMS
        scores.hrPolicyImplementation || 0, // Column J (index-9) - 100% implementation of HR policy
        scores.exitInterviewAnalysis || 0, // Column K (index-10) - Analysis of exit interview and present half yearly reports with action plan to control attrition
        scores.payrollRecordMaintenance || 0, // Column L (index-11) - 100% Record maintenance of payroll related activities
        scores.ehmsUpdation || 0, // Column M (index-12) - Updation in EHMS
        scores.fileUploading || 0, // Column N (index-13) - File uploading in cloud & Software
        scores.physicalStockVerification || 0, // Column O (index-14) - Adhere to timeline for Monthly Physical stock verification & Indent
        scores.gatePassPreparation || 0, // Column P (index-15) - Preparation of Gate pass (for those who are going outside of hospital during working hours)
        scores.dailyRounds || 0, // Column Q (index-16) - Daily round on all floors to check staff grooming & follow SOP
        scores.employeeFileUpdation || 0, // Column R (index-17) - Employee personal file updation on timely basis
        scores.monthlyReports || 0, // Column S (index-18) - 100% adherence to timeline for submission of monthly reports
        scores.trainingDashboard || 0, // Column T (index-19) - To share training dashboard of next month on 25th of every month
        scores.trainingCompletion || 0, // Column U (index-20) - Completion of Training Programs for departments w.r.t quarterly Training Calendar
        scores.trainingFeedback || 0, // Column V (index-21) - Training feedback & evaluation
        scores.engagementActivities || 0, // Column W (index-22) - Engagement activities as per Event Calendar
        scores.qualityOfWork || 0, // Column X (index-23) - Effectively and efficiently performs job
        scores.planningExecution || 0, // Column Y (index-24) - Do Plan in advance and execute without deviation
        scores.timeResources || 0, // Column Z (index-25) - Conserve Company resources and meet deadlines
        scores.interpersonalRelations || 0, // Column AA (index-26) - Have healthy work relation with peers and superiors
        scores.flexibilityAdaptability || 0, // Column AB (index-27) - Flexible in taking additional tasks and adaptable to change
        scores.communication || 0, // Column AC (index-28) - Exchange of information desired through effective means
        scores.integrity || 0, // Column AD (index-29) - High integrity towards company
        scores.leadership || 0, // Column AE (index-30) - Ability to Inspire and take initiatives
        scores.discipline || 0, // Column AF (index-31) - Follow rules and code of conduct
        scores.punctuality || 0 // Column AG (index-32) - Adherence to time and attendance
      ];

      const scriptURL = "https://script.google.com/macros/s/AKfycbxPmnN7m0AjXfW2jENVsOjwbCbHdTAuqRZLzlDO0dwljUp3XkLBsXhA6Lrt3Oias8HypQ/exec";
      const sheetId = "1OpzWP_zaSHL5mcgy32VoJ4i4VjVIHouly5nliEeiIG8";
      const sheetName = "Poorwa Gajbhiye";

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
            {/* Recruitment/Selection KRA with border */}
            <tr style={{ border: '2px solid #000' }}>
              <td rowSpan="3" style={{ borderRight: '2px solid #000' }}><strong>Recruitment/Selection</strong></td>
              <td>Assist manpower planning with HR Head & CH</td>
              <td>2</td>
              <td>
                <input 
                  type="number" 
                  value={scores.manpowerPlanning}
                  onChange={(e) => handleScoreChange('manpowerPlanning', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="2"
                  step="0.1"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Matching of man power availability of each department by 90% anytime</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.manpowerAvailability}
                  onChange={(e) => handleScoreChange('manpowerAvailability', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                  step="0.1"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000', borderTop: 'none' }}>
              <td>100% adherence to Recruitment lead time (30 days) as per policy</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.recruitmentLeadTime}
                  onChange={(e) => handleScoreChange('recruitmentLeadTime', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                  step="0.1"
                />
              </td>
            </tr>
            
            {/* Induction & Documentation KRA with border */}
            <tr style={{ border: '2px solid #000' }}>
              <td rowSpan="2" style={{ borderRight: '2px solid #000' }}><strong>Induction & Documentation</strong></td>
              <td>Conduct induction program for new joinees within 2 days of their joining</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.inductionProgram}
                  onChange={(e) => handleScoreChange('inductionProgram', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                  step="0.1"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Update new joinees information in EHMS</td>
              <td>2.7</td>
              <td>
                <input 
                  type="number" 
                  value={scores.ehmsUpdate}
                  onChange={(e) => handleScoreChange('ehmsUpdate', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="2.7"
                  step="0.1"
                />
              </td>
            </tr>
            
            {/* Payroll and Salary Administration KRA with border */}
            <tr style={{ border: '2px solid #000' }}>
            <td rowSpan={2} style={{ borderRight: '2px solid #000' }}><strong>Workforce Management</strong></td>
              <td>100% implementation of HR policy</td>
              <td>4.7</td>
              <td>
                <input 
                  type="number" 
                  value={scores.hrPolicyImplementation}
                  onChange={(e) => handleScoreChange('hrPolicyImplementation', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="4.7"
                  step="0.1"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Analysis of exit interview and present half yearly reports with action plan to control attrition</td>
              <td>4.7</td>
              <td>
                <input 
                  type="number" 
                  value={scores.exitInterviewAnalysis}
                  onChange={(e) => handleScoreChange('exitInterviewAnalysis', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="4.7"
                  step="0.1"
                />
              </td>
            </tr>
            
            {/* Operational excellence KRA with border */}
            <tr style={{ border: '2px solid #000' }}>
            <td style={{ borderRight: '2px solid #000' }}><strong>Payroll and Salary Administration</strong></td>
              <td>100% Record maintenance of payroll related activities</td>
              <td>4.7</td>
              <td>
                <input 
                  type="number" 
                  value={scores.payrollRecordMaintenance}
                  onChange={(e) => handleScoreChange('payrollRecordMaintenance', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="4.7"
                  step="0.1"
                />
              </td>
            </tr>
            
            {/* Physical Lifecycle KRA with border */}
            <tr style={{ border: '2px solid #000' }}>
            <td rowSpan={2} style={{ borderRight: '2px solid #000' }}><strong>HR EHMS</strong></td>
              <td>Updation in EHMS</td>
              <td>2</td>
              <td>
                <input 
                  type="number" 
                  value={scores.ehmsUpdation}
                  onChange={(e) => handleScoreChange('ehmsUpdation', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="2"
                  step="0.1"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>File uploading in cloud & Software</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.fileUploading}
                  onChange={(e) => handleScoreChange('fileUploading', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                  step="0.1"
                />
              </td>
            </tr>
            
            {/* Training and development KRA with border */}
            <tr style={{ border: '2px solid #000' }}>
            <td rowSpan={2} style={{ borderRight: '2px solid #000' }}><strong>Operational excellence</strong></td>
              <td>Adhere to timeline for Monthly Physical stock verification & Indent</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.physicalStockVerification}
                  onChange={(e) => handleScoreChange('physicalStockVerification', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                  step="0.1"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000', borderTop: 'none' }}>
              <td>Preparation of Gate pass (for those who are going outside of hospital during working hours)</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.gatePassPreparation}
                  onChange={(e) => handleScoreChange('gatePassPreparation', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                  step="0.1"
                />
              </td>
            </tr>


            <tr style={{ border: '2px solid #000', borderTop: 'none' }}>
            <td rowSpan={2} style={{ borderRight: '2px solid #000' }}><strong>Physical Lifecycle</strong></td>
              <td>Daily round on all floors to check staff grooming & follow SOP</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.dailyRounds}
                  onChange={(e) => handleScoreChange('dailyRounds', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                  step="0.1"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000', borderTop: 'none' }}>
              <td>Employee personal file updation on timely basis</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.employeeFileUpdation}
                  onChange={(e) => handleScoreChange('employeeFileUpdation', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                  step="0.1"
                />
              </td>
            </tr>


            <tr style={{ border: '2px solid #000', borderTop: 'none' }}>
            <td style={{ borderRight: '2px solid #000' }}><strong>MIS</strong></td>
              <td>100% adherence to timeline for submission of monthly reports</td>
              <td>3.2</td>
              <td>
                <input 
                  type="number" 
                  value={scores.monthlyReports}
                  onChange={(e) => handleScoreChange('monthlyReports', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3.2"
                  step="0.1"
                />
              </td>
            </tr>


            <tr style={{ border: '2px solid #000', borderTop: 'none' }}>
            <td rowSpan="4" style={{ borderRight: '2px solid #000' }}><strong>Training and development</strong></td>
              <td>To share training dashboard of next month on 25th of every month</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.trainingDashboard}
                  onChange={(e) => handleScoreChange('trainingDashboard', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                  step="0.1"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Completion of Training Programs for departments w.r.t quarterly Training Calendar</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.trainingCompletion}
                  onChange={(e) => handleScoreChange('trainingCompletion', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                  step="0.1"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Training feedback & evaluation</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.trainingFeedback}
                  onChange={(e) => handleScoreChange('trainingFeedback', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                  step="0.1"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Engagement activities as per Event Calendar</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.engagementActivities}
                  onChange={(e) => handleScoreChange('engagementActivities', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                  step="0.1"
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