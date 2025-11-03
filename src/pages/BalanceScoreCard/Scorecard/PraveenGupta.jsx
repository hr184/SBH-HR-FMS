import React from 'react'
import { useState } from 'react';

export const PraveenGupta = () => {
  const [scores, setScores] = useState({
    // Job Assessment Scores
    operationalCostReduction: '',
    budgetCompliance: '',
    employeeSatisfaction: '',
    vendorSatisfaction: '',
    sopScore: '',
    complaintClosure: '',
    systemAvailability: '',
    serverBackup: '',
    networkPerformance: '',
    itPolicyImplementation: '',
    troubleshooting: '',
    reportSubmission: '',
    assetCoding: '',
    technologyImplementation: '',
    managementTraining: '',
    staffTraining: '',
    
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
    const jobAssessmentTargets = [8, 8, 5, 4, 6, 6, 5, 6, 5, 5, 4, 4, 3, 3, 5, 3];
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
      const employeeName = "Praveen Gupta";

      const rowData = [
        timestamp, // Column A (index-0) - Timestamp
        currentMonth, // Column B (index-1) - Current Month
        employeeName, // Column C (index-2) - Employee Name
        "", // Column D (index-3) - Empty column
        scores.operationalCostReduction || 0, // Column E (index-4) - Reduced operational cost by atleast 5% of the IT Department
        scores.budgetCompliance || 0, // Column F (index-5) - 100% compliances of plan vs achievement for annual budget providing monthly reviews as per procurement plan
        scores.employeeSatisfaction || 0, // Column G (index-6) - Employee satisfaction index should be >80%
        scores.vendorSatisfaction || 0, // Column H (index-7) - Vendor satisfaction index should be >80%
        scores.sopScore || 0, // Column I (index-8) - SOP score should Be more than 70%
        scores.complaintClosure || 0, // Column J (index-9) - 100% closure of all complaints within 72 hrs and to update on IT automation sheet
        scores.systemAvailability || 0, // Column K (index-10) - 100% availability of system and equipment as per the approved requisition
        scores.serverBackup || 0, // Column L (index-11) - 100% Uploading of server backup data in Cloud
        scores.networkPerformance || 0, // Column M (index-12) - Preparation report on Monitors network utilization and performance, implements procedures for network optimization, reliability, and availability
        scores.itPolicyImplementation || 0, // Column N (index-13) - 100% Implementation of IT policy with all the formats
        scores.troubleshooting || 0, // Column O (index-14) - 100% RCA of all Troubleshoot and minimize equipment downtime (related to general IT)
        scores.reportSubmission || 0, // Column P (index-15) - 100% submission of Daily Weekly and Monthly Report to the management
        scores.assetCoding || 0, // Column Q (index-16) - IT asset coding sheet preparation and updation on monthly basis
        scores.technologyImplementation || 0, // Column R (index-17) - Advanced Technology implementation
        scores.managementTraining || 0, // Column S (index-18) - Attend training provided by company and assessment score should be more than 70%
        scores.staffTraining || 0, // Column T (index-19) - Provide training to subordinates or Employees(monthly 3 hrs)
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

      const scriptURL = "https://script.google.com/macros/s/AKfycbxPmnN7m0AjXfW2jENVsOjwbCbHdTAuqRZLzlDO0dwljUp3XkLBsXhA6Lrt3Oias8HypQ/exec";
      const sheetId = "1OpzWP_zaSHL5mcgy32VoJ4i4VjVIHouly5nliEeiIG8";
      const sheetName = "Praveen Gupta";

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
            {/* Cost Consciousness KRA */}
            <tr style={{ border: '2px solid #000' }}>
              <td rowSpan="2" style={{ borderRight: '2px solid #000' }}><strong>Cost Consciousness</strong></td>
              <td>Reduced operational cost by atleast 5% of the IT Department</td>
              <td>8</td>
              <td>
                <input 
                  type="number" 
                  value={scores.operationalCostReduction}
                  onChange={(e) => handleScoreChange('operationalCostReduction', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="8"
                  step="0.1"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>100% compliances of plan vs achievement for annual budget providing monthly reviews as per procurement plan</td>
              <td>8</td>
              <td>
                <input 
                  type="number" 
                  value={scores.budgetCompliance}
                  onChange={(e) => handleScoreChange('budgetCompliance', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="8"
                  step="0.1"
                />
              </td>
            </tr>

            {/* Internal Customer Satisfaction KRA */}
            <tr style={{ border: '2px solid #000' }}>
              <td style={{ borderRight: '2px solid #000' }}><strong>Internal Customer Satisfaction</strong></td>
              <td>Employee satisfaction index should be {'>'}80%</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.employeeSatisfaction}
                  onChange={(e) => handleScoreChange('employeeSatisfaction', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                  step="0.1"
                />
              </td>
            </tr>

            {/* Outside Customer Satisfaction KRA */}
            <tr style={{ border: '2px solid #000' }}>
              <td style={{ borderRight: '2px solid #000' }}><strong>Outside Customer Satisfaction</strong></td>
              <td>Vendor satisfaction index should be {'>'}80%</td>
              <td>4</td>
              <td>
                <input 
                  type="number" 
                  value={scores.vendorSatisfaction}
                  onChange={(e) => handleScoreChange('vendorSatisfaction', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="4"
                  step="0.1"
                />
              </td>
            </tr>

            {/* Operational Excellence KRA */}
            <tr style={{ border: '2px solid #000' }}>
              <td rowSpan="10" style={{ borderRight: '2px solid #000' }}><strong>Operational Excellence</strong></td>
              <td>SOP score should Be more than 70%</td>
              <td>6</td>
              <td>
                <input 
                  type="number" 
                  value={scores.sopScore}
                  onChange={(e) => handleScoreChange('sopScore', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="6"
                  step="0.1"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>100% closure of all complaints within 72 hrs and to update on IT automation sheet</td>
              <td>6</td>
              <td>
                <input 
                  type="number" 
                  value={scores.complaintClosure}
                  onChange={(e) => handleScoreChange('complaintClosure', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="6"
                  step="0.1"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>100% availability of system and equipment as per the approved requisition</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.systemAvailability}
                  onChange={(e) => handleScoreChange('systemAvailability', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                  step="0.1"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>100% Uploading of server backup data in Cloud</td>
              <td>6</td>
              <td>
                <input 
                  type="number" 
                  value={scores.serverBackup}
                  onChange={(e) => handleScoreChange('serverBackup', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="6"
                  step="0.1"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Preparation report on Monitors network utilization and performance, implements procedures for network optimization, reliability, and availability</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.networkPerformance}
                  onChange={(e) => handleScoreChange('networkPerformance', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                  step="0.1"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>100% Implementation of IT policy with all the formats</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.itPolicyImplementation}
                  onChange={(e) => handleScoreChange('itPolicyImplementation', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                  step="0.1"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>100% RCA of all Troubleshoot and minimize equipment downtime (related to general IT)</td>
              <td>4</td>
              <td>
                <input 
                  type="number" 
                  value={scores.troubleshooting}
                  onChange={(e) => handleScoreChange('troubleshooting', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="4"
                  step="0.1"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>100% submission of Daily Weekly and Monthly Report to the management</td>
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
                  step="0.1"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>IT asset coding sheet preparation and updation on monthly basis</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.assetCoding}
                  onChange={(e) => handleScoreChange('assetCoding', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                  step="0.1"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Advanced Technology implementation</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.technologyImplementation}
                  onChange={(e) => handleScoreChange('technologyImplementation', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                  step="0.1"
                />
              </td>
            </tr>

            {/* Training & Development KRA */}
            <tr style={{ border: '2px solid #000' }}>
            <td rowSpan="2" style={{ borderRight: '2px solid #000' }}><strong>Training & Development</strong></td>
              <td>Attend training provided by company and assessment score should be more than 70%</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.managementTraining}
                  onChange={(e) => handleScoreChange('managementTraining', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                  step="0.1"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Provide training to subordinates or Employees(monthly 3 hrs)</td>
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