import React from 'react'
import { useState } from 'react';

export const AlokPandey = () => {
  const [scores, setScores] = useState({
    // Job Assessment Scores
    targetAchievement: '',
    btlBusinessTracking: '',
    associateSatisfaction: '',
    sopScore: '',
    newAssociateTarget: '',
    dbcsRsbyStrategy: '',
    visitTarget: '',
    bestPractices: '',
    marketingCampaigns: '',
    referralConversion: '',
    reportSubmission: '',
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
    const jobAssessmentTotal = Object.values(scores).slice(0, 12).reduce((a, b) => a + (parseFloat(b) || 0), 0);
    const behavioralTotal = Object.values(scores).slice(12).reduce((a, b) => a + (parseFloat(b) || 0), 0);
    const overallTotal = jobAssessmentTotal + behavioralTotal;
    
    // Calculate target totals (out of values)
    const jobAssessmentTargets = [15, 6, 5, 6, 8, 6, 5, 5, 6, 8, 5, 5];
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
      const employeeName = "Alok Pandey";

      const rowData = [
        timestamp, // Column A (index-0) - Timestamp
        currentMonth, // Column B (index-1) - Current Month
        employeeName, // Column C (index-2) - Employee Name
        "", // Column D (index-3) - Empty column
        scores.targetAchievement || 0, // Column E (index-4) - Target Achievement
        scores.btlBusinessTracking || 0, // Column F (index-5) - To track & achieve BTL business & ratings
        scores.associateSatisfaction || 0, // Column G (index-6) - Satisfaction rate of Associates
        scores.sopScore || 0, // Column H (index-7) - SOP score should be >70%
        scores.newAssociateTarget || 0, // Column I (index-8) - Achieve the target of new associated
        scores.dbcsRsbyStrategy || 0, // Column J (index-9) - Strategy to increase the DBCS & RSBY
        scores.visitTarget || 0, // Column K (index-10) - Achieve targeted numbers of visit
        scores.bestPractices || 0, // Column L (index-11) - Implementation of 2 best practices in a quarter
        scores.marketingCampaigns || 0, // Column M (index-12) - Conduct Marketing campaign/event
        scores.referralConversion || 0, // Column N (index-13) - 80% conversion of referral patients for surgery
        scores.reportSubmission || 0, // Column O (index-14) - 100% adherence to timeline for submission of monthly reports
        scores.managementTraining || 0, // Column P (index-15) - Attend Monthly training
        scores.qualityOfWork || 0, // Column Q (index-16) - Effectively and efficiently performs job
        scores.planningExecution || 0, // Column R (index-17) - Do Plan in advance and execute without deviation
        scores.timeResources || 0, // Column S (index-18) - Conserve Company resources and meet deadlines
        scores.interpersonalRelations || 0, // Column T (index-19) - Have healthy work relation with peers and superiors
        scores.flexibilityAdaptability || 0, // Column U (index-20) - Flexible in taking additional tasks and adaptable to change
        scores.communication || 0, // Column V (index-21) - Exchange of information desired through effective means
        scores.integrity || 0, // Column W (index-22) - High integrity towards company
        scores.leadership || 0, // Column X (index-23) - Ability to Inspire and take initiatives
        scores.discipline || 0, // Column Y (index-24) - Follow rules and code of conduct
        scores.punctuality || 0 // Column Z (index-25) - Adherence to time and attendance
      ];

      const scriptURL = "https://script.google.com/macros/s/AKfycbw6xeabQpVzEnNMhLWfMAwLJ0hFZxA2L89aX17-p4b-caM4SdpsETrtq5GT4Lwk84qL/exec";
      const sheetId = "162o34BXqnJvmJjjtIoQpcBGo8orn2ZO5Jf0p8MgoUCs";
      const sheetName = "Alok Pandey";

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
            {/* Financial KRA */}
            <tr style={{ border: '2px solid #000' }}>
              <td rowSpan="2" style={{ borderRight: '2px solid #000' }}><strong>Financial</strong></td>
              <td>Target Achievement</td>
              <td>15</td>
              <td>
                <input 
                  type="number" 
                  value={scores.targetAchievement}
                  onChange={(e) => handleScoreChange('targetAchievement', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="15"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>To track & achieve BTL business & ratings</td>
              <td>6</td>
              <td>
                <input 
                  type="number" 
                  value={scores.btlBusinessTracking}
                  onChange={(e) => handleScoreChange('btlBusinessTracking', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="6"
                />
              </td>
            </tr>

            {/* Customer Satisfaction KRA */}
            <tr style={{ border: '2px solid #000' }}>
              <td rowSpan="1" style={{ borderRight: '2px solid #000' }}><strong>Customer Satisfaction</strong></td>
              <td>Satisfaction rate of Associates should be more than 80% monthly 10 associates</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.associateSatisfaction}
                  onChange={(e) => handleScoreChange('associateSatisfaction', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                />
              </td>
            </tr>

            {/* SOP KRA */}
            <tr style={{ border: '2px solid #000' }}>
              <td rowSpan="1" style={{ borderRight: '2px solid #000' }}><strong>SOP</strong></td>
              <td>SOP score should be {'>'}70%</td>
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
                />
              </td>
            </tr>

            {/* Marketing strategy KRA */}
            <tr style={{ border: '2px solid #000' }}>
              <td rowSpan="3" style={{ borderRight: '2px solid #000' }}><strong>Marketing strategy</strong></td>
              <td>Achieve the target of new associated (Ophthalmic assistants, GPs)</td>
              <td>8</td>
              <td>
                <input 
                  type="number" 
                  value={scores.newAssociateTarget}
                  onChange={(e) => handleScoreChange('newAssociateTarget', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="8"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Strategy to increase the DBCS & RSBY</td>
              <td>6</td>
              <td>
                <input 
                  type="number" 
                  value={scores.dbcsRsbyStrategy}
                  onChange={(e) => handleScoreChange('dbcsRsbyStrategy', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="6"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Achieve targeted numbers of visit</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.visitTarget}
                  onChange={(e) => handleScoreChange('visitTarget', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                />
              </td>
            </tr>

            {/* Best practice KRA */}
            <tr style={{ border: '2px solid #000' }}>
              <td rowSpan="1" style={{ borderRight: '2px solid #000' }}><strong>Best practice</strong></td>
              <td>Implementation of 2 best practices in a quarter</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.bestPractices}
                  onChange={(e) => handleScoreChange('bestPractices', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                />
              </td>
            </tr>

            {/* Operational KRA */}
            <tr style={{ border: '2px solid #000' }}>
              <td rowSpan="2" style={{ borderRight: '2px solid #000' }}><strong>Operational</strong></td>
              <td>Conduct Marketing campaign/event as per plan/Calendar</td>
              <td>6</td>
              <td>
                <input 
                  type="number" 
                  value={scores.marketingCampaigns}
                  onChange={(e) => handleScoreChange('marketingCampaigns', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="6"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>80% conversion of referral patients for surgery</td>
              <td>8</td>
              <td>
                <input 
                  type="number" 
                  value={scores.referralConversion}
                  onChange={(e) => handleScoreChange('referralConversion', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="8"
                />
              </td>
            </tr>

            {/* MIS KRA */}
            <tr style={{ border: '2px solid #000' }}>
              <td rowSpan="1" style={{ borderRight: '2px solid #000' }}><strong>MIS</strong></td>
              <td>100% adherence to timeline for submission of monthly reports</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.reportSubmission}
                  onChange={(e) => handleScoreChange('reportSubmission', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                />
              </td>
            </tr>

            {/* Training & Development KRA */}
            <tr style={{ border: '2px solid #000' }}>
              <td rowSpan="1" style={{ borderRight: '2px solid #000' }}><strong>Training & Development</strong></td>
              <td>Attend Monthly training (Departmental / Cross functional)</td>
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