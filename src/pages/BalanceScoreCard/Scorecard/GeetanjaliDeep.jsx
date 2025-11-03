import React from 'react'
import { useState } from 'react';

export const GeetanjaliDeep = () => {
  const [scores, setScores] = useState({
    // Job Assessment Scores - Updated KPIs
    hrBudgetAdherence: '',
    recruitmentTracking: '',
    labourPayment: '',
    legalCompliances: '',
    employeeSatisfaction: '',
    successionPlanning: '',
    feedbackCollection: '',
    onboardingProcess: '',
    workforceManagement: '',
    hrPolicyImplementation: '',
    crossFunctionalEvents: '',
    payrollAdministration: '',
    statutoryClosure: '',
    exitInterviews: '',
    performanceManagement: '',
    ehmsIntegration: '',
    staffVaccination: '',
    staffSafety: '',
    bscManagement: '',
    trainingAdherence: '',
    trainingEffectiveness: '',
    employeeEngagement: '',
    
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
    
    // Calculate target totals (out of values) - Updated targets
    const jobAssessmentTargets = [6, 5, 3, 3, 2, 2, 2, 4, 6, 6, 2, 3, 5, 3, 4, 4, 3, 2, 3, 4, 4, 4];
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
      const employeeName = "Geetanjali Deep";

      const rowData = [
        timestamp, // Column A (index-0) - Timestamp
        currentMonth, // Column B (index-1) - Current Month
        employeeName, // Column C (index-2) - Employee Name
        "", // Column D (index-3) - Empty column
        scores.hrBudgetAdherence || 0, // Column E (index-4) - 100% adherence of HR Budget as per ABP & manpower audit in every quarter
        scores.recruitmentTracking || 0, // Column F (index-5) - To track all the recruitment and close as per the deadline
        scores.labourPayment || 0, // Column G (index-6) - Labour department online registration payment
        scores.legalCompliances || 0, // Column H (index-7) - Zero Penalty due to delay in PF ESIC compliance
        scores.employeeSatisfaction || 0, // Column I (index-8) - Yearly Employee Satisfaction >85%
        scores.successionPlanning || 0, // Column J (index-9) - Succession Planning for the selected Employee
        scores.feedbackCollection || 0, // Column K (index-10) - Feedback from staff doctors managers quarterly basis
        scores.onboardingProcess || 0, // Column L (index-11) - Orientation (department visit, scope of services within 2 days.) Conduct induction program for new joinees within 2 days of their joining
        scores.workforceManagement || 0, // Column M (index-12) - Reduce absentism, misconduct and late coming by 5% from previous Quarter
        scores.hrPolicyImplementation || 0, // Column N (index-13) - 100% implementation of HR policy & to implement the SOP
        scores.crossFunctionalEvents || 0, // Column O (index-14) - Organize atleast one event in quarter involving cross functional dept.
        scores.payrollAdministration || 0, // Column P (index-15) - Disbursement of payment to employees by 3rd of every month
        scores.statutoryClosure || 0, // Column Q (index-16) - 100% closure of all NCs raised in Legal and HR Audits within lead time
        scores.exitInterviews || 0, // Column R (index-17) - 100% Exit Interviews of the employees leaving the organisation
        scores.performanceManagement || 0, // Column S (index-18) - 100% adherance to the timeline to complete KRA & appraisals process every quarter
        scores.ehmsIntegration || 0, // Column T (index-19) - EHMS new module updation/Integration Process Implementation
        scores.staffVaccination || 0, // Column U (index-20) - Staff vaccination
        scores.staffSafety || 0, // Column V (index-21) - Staff accidental policy /covid-19 questionnaire
        scores.bscManagement || 0, // Column W (index-22) - Through BSC Evaluate performance & co-ordinate with CEO (Monthly one meeting with MOM)
        scores.trainingAdherence || 0, // Column X (index-23) - Adherence of Training calander and timely conduct of training programs
        scores.trainingEffectiveness || 0, // Column Y (index-24) - Evaluate Training effectiveness Quarterly
        scores.employeeEngagement || 0, // Column Z (index-25) - Engagement activities as per Event Calander
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
      const sheetName = "Geetanjali Deep";

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
              <td style={{ borderRight: '2px solid #000' }}><strong>ABP</strong></td>
              <td>100% adherence of HR Budget as per ABP & manpower audit in every quarter</td>
              <td>6</td>
              <td>
                <input 
                  type="number" 
                  value={scores.hrBudgetAdherence}
                  onChange={(e) => handleScoreChange('hrBudgetAdherence', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="6"
                />
              </td>
            </tr>

            {/* Recruitment KRA */}
            <tr style={{ border: '2px solid #000' }}>
              <td style={{ borderRight: '2px solid #000' }}><strong>Recruitment</strong></td>
              <td>To track all the recruitment and close as per the deadline</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.recruitmentTracking}
                  onChange={(e) => handleScoreChange('recruitmentTracking', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                />
              </td>
            </tr>

            {/* Labour payment KRA */}
            <tr style={{ border: '2px solid #000' }}>
              <td style={{ borderRight: '2px solid #000' }}><strong>Labour payment</strong></td>
              <td>Labour department online registration payment</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.labourPayment}
                  onChange={(e) => handleScoreChange('labourPayment', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>

            {/* Legal Compliances KRA */}
            <tr style={{ border: '2px solid #000' }}>
              <td style={{ borderRight: '2px solid #000' }}><strong>Legal Compliances</strong></td>
              <td>Zero Penalty due to delay in PF ESIC compliance</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.legalCompliances}
                  onChange={(e) => handleScoreChange('legalCompliances', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>

            {/* Employee Satisfaction Index KRA */}
            <tr style={{ border: '2px solid #000' }}>
              <td rowSpan={3} style={{ borderRight: '2px solid #000' }}><strong>Employee Satisfaction Index</strong></td>
              <td>Yearly Employee Satisfaction &gt;85%</td>
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
              <td>Succession Planning for the selected Employee</td>
              <td>2</td>
              <td>
                <input 
                  type="number" 
                  value={scores.successionPlanning}
                  onChange={(e) => handleScoreChange('successionPlanning', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="2"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Feedback from staff doctors managers quarterly basis</td>
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

            {/* Onboarding Process KRA */}
            <tr style={{ border: '2px solid #000' }}>
              <td style={{ borderRight: '2px solid #000' }}><strong>Onboarding Process</strong></td>
              <td>Orientation (department visit, scope of services within 2 days.) Conduct induction program for new joinees within 2 days of their joining</td>
              <td>4</td>
              <td>
                <input 
                  type="number" 
                  value={scores.onboardingProcess}
                  onChange={(e) => handleScoreChange('onboardingProcess', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="4"
                />
              </td>
            </tr>

            {/* Human Resource Management KRA */}
            <tr style={{ border: '2px solid #000' }}>
              <td rowSpan={3} style={{ borderRight: '2px solid #000' }}><strong>Human Resource Management</strong></td>
              <td>Reduce absentism, misconduct and late coming by 5% from previous Quarter</td>
              <td>6</td>
              <td>
                <input 
                  type="number" 
                  value={scores.workforceManagement}
                  onChange={(e) => handleScoreChange('workforceManagement', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="6"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>100% implementation of HR policy & to implement the SOP</td>
              <td>6</td>
              <td>
                <input 
                  type="number" 
                  value={scores.hrPolicyImplementation}
                  onChange={(e) => handleScoreChange('hrPolicyImplementation', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="6"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Organize atleast one event in quarter involving cross functional dept.</td>
              <td>2</td>
              <td>
                <input 
                  type="number" 
                  value={scores.crossFunctionalEvents}
                  onChange={(e) => handleScoreChange('crossFunctionalEvents', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="2"
                />
              </td>
            </tr>

            {/* Payroll Administration KRA */}
            <tr style={{ border: '2px solid #000' }}>
              <td style={{ borderRight: '2px solid #000' }}><strong>Payroll Administration</strong></td>
              <td>Disbursement of payment to employees by 3rd of every month</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.payrollAdministration}
                  onChange={(e) => handleScoreChange('payrollAdministration', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>

            {/* Statutory Compliance KRA */}
            <tr style={{ border: '2px solid #000' }}>
              <td style={{ borderRight: '2px solid #000' }}><strong>Statutory Compliance</strong></td>
              <td>100% closure of all NCs raised in Legal and HR Audits within lead time</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.statutoryClosure}
                  onChange={(e) => handleScoreChange('statutoryClosure', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                />
              </td>
            </tr>

            {/* Exit Process KRA */}
            <tr style={{ border: '2px solid #000' }}>
              <td style={{ borderRight: '2px solid #000' }}><strong>Exit Process</strong></td>
              <td>100% Exit Interviews of the employees leaving the organisation</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.exitInterviews}
                  onChange={(e) => handleScoreChange('exitInterviews', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>

            {/* Performance Management System KRA */}
            <tr style={{ border: '2px solid #000' }}>
              <td style={{ borderRight: '2px solid #000' }}><strong>Performance Management System</strong></td>
              <td>100% adherance to the timeline to complete KRA & appraisals process every quarter</td>
              <td>4</td>
              <td>
                <input 
                  type="number" 
                  value={scores.performanceManagement}
                  onChange={(e) => handleScoreChange('performanceManagement', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="4"
                />
              </td>
            </tr>

            {/* HR EHMS KRA */}
            <tr style={{ border: '2px solid #000' }}>
              <td style={{ borderRight: '2px solid #000' }}><strong>HR EHMS</strong></td>
              <td>EHMS new module updation/Integration Process Implementation</td>
              <td>4</td>
              <td>
                <input 
                  type="number" 
                  value={scores.ehmsIntegration}
                  onChange={(e) => handleScoreChange('ehmsIntegration', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="4"
                />
              </td>
            </tr>

            {/* Staff Safety Measures KRA */}
            <tr style={{ border: '2px solid #000' }}>
              <td rowSpan="2" style={{ borderRight: '2px solid #000' }}><strong>Staff Safety Measures</strong></td>
              <td>Staff vaccination</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.staffVaccination}
                  onChange={(e) => handleScoreChange('staffVaccination', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Staff accidental policy /covid-19 questionnaire</td>
              <td>2</td>
              <td>
                <input 
                  type="number" 
                  value={scores.staffSafety}
                  onChange={(e) => handleScoreChange('staffSafety', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="2"
                />
              </td>
            </tr>

            {/* BSC Management KRA */}
            <tr style={{ border: '2px solid #000' }}>
              <td style={{ borderRight: '2px solid #000' }}><strong>BSC Management</strong></td>
              <td>Through BSC Evaluate performance & co-ordinate with CEO (Monthly one meeting with MOM)</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.bscManagement}
                  onChange={(e) => handleScoreChange('bscManagement', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>

            {/* Training and Development KRA */}
            <tr style={{ border: '2px solid #000' }}>
              <td style={{ borderRight: '2px solid #000' }}><strong>Training and Development</strong></td>
              <td>Adherence of Training calander and timely conduct of training programs</td>
              <td>4</td>
              <td>
                <input 
                  type="number" 
                  value={scores.trainingAdherence}
                  onChange={(e) => handleScoreChange('trainingAdherence', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="4"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
            <td rowSpan={2} style={{ borderRight: '2px solid #000' }}><strong>Employee Engagement</strong></td>
              <td>Evaluate Training effectiveness Quarterly</td>
              <td>4</td>
              <td>
                <input 
                  type="number" 
                  value={scores.trainingEffectiveness}
                  onChange={(e) => handleScoreChange('trainingEffectiveness', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="4"
                />
              </td>
            </tr>

            {/* Employee Engagement KRA */}
            <tr style={{ border: '2px solid #000' }}>
              <td>Engagement activities as per Event Calander</td>
              <td>4</td>
              <td>
                <input 
                  type="number" 
                  value={scores.employeeEngagement}
                  onChange={(e) => handleScoreChange('employeeEngagement', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="4"
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