import React, { useEffect } from 'react'
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const PoorwaGajbhiye = () => {
  const [scores, setScores] = useState({
    // Job Assessment Scores
    newJoinings: '',
    planningExecution1: '',
    planningExecution2: '',
    planningExecution3: '',
    planningExecution4: '',
    planningExecution5: '',
    planningExecution6: '',
    planningExecution7: '',
    inductionTraining1: '',
    inductionTraining2: '',
    auditingAndProcess1: '',
    employeeEngagement1: '',
    employeeEngagement2: '',
    employeeEngagement3: '',
    employeeEngagement4: '',
    employeeEngagement5: '',
    
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

  const [userData, setUserData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
                  const fetchUserData = async () => {
                    try {
                      const scriptURL = "https://script.google.com/macros/s/AKfycbw6xeabQpVzEnNMhLWfMAwLJ0hFZxA2L89aX17-p4b-caM4SdpsETrtq5GT4Lwk84qL/exec";
                      const sheetId = "162o34BXqnJvmJjjtIoQpcBGo8orn2ZO5Jf0p8MgoUCs";
                      const sheetName = "Poorwa Gajbhiye";
                
                      const response = await fetch(`${scriptURL}?sheetId=${encodeURIComponent(sheetId)}&sheetName=${encodeURIComponent(sheetName)}&action=getData`);
                      
                      if (response.ok) {
                        const data = await response.json();
                        if (data && data.data && data.data.length > 0) {
                          // Data starts from row 5, so we slice from index 4 (row 5) onwards
                          const dataRows = data.data.slice(4);
                          
                          // Filter rows where column C (index 2) has "User" value
                          const userRows = dataRows.filter(row => row[2] === "User");
                          
                          if (userRows.length > 0) {
                            // Find the latest row based on timestamp in Column A (index 0)
                            const latestUserRow = userRows.reduce((latest, current) => {
                              const latestTimestamp = new Date(latest[0]);
                              const currentTimestamp = new Date(current[0]);
                              return currentTimestamp > latestTimestamp ? current : latest;
                            });
                
                            setUserData({
                              newJoinings: latestUserRow[4] || "",
                              planningExecution1: latestUserRow[5] || "",
                              planningExecution2: latestUserRow[6] || "",
                              planningExecution3: latestUserRow[7] || "",
                              planningExecution4: latestUserRow[8] || "",
                              planningExecution5: latestUserRow[9] || "",
                              planningExecution6: latestUserRow[10] || "",
                              planningExecution7: latestUserRow[11] || "",
                              inductionTraining1: latestUserRow[12] || "",
                              inductionTraining2: latestUserRow[13] || "",
                              auditingAndProcess1: latestUserRow[14] || "",
                              employeeEngagement1: latestUserRow[15] || "",
                              employeeEngagement2: latestUserRow[16] || "",
                              employeeEngagement3: latestUserRow[17] || "",
                              employeeEngagement4: latestUserRow[18] || "",
                              employeeEngagement5: latestUserRow[19] || "",
                            });
                          } else {
                            console.log('No row with "User" value found in column C');
                          }
                        }
                      }
                    } catch (error) {
                      console.error('Error fetching user data:', error);
                    }
                  };
                
                  fetchUserData();
                }, []);

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
    const jobAssessmentTargets = [6, 4, 7, 5, 3, 4, 6, 5, 4, 3, 7, 5, 4, 7, 4, 6];
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
        scores.newJoinings || 0, // Column E (index-4)
        scores.planningExecution1 || 0, // Column F (index-5)
        scores.planningExecution2 || 0, // Column G (index-6)
        scores.planningExecution3 || 0, // Column H (index-7)
        scores.planningExecution4 || 0, // Column I (index-8)
        scores.planningExecution5 || 0, // Column J (index-9)
        scores.planningExecution6 || 0, // Column K (index-10)
        scores.planningExecution7 || 0, // Column L (index-11)
        scores.inductionTraining1 || 0, // Column M (index-12)
        scores.inductionTraining2 || 0, // Column N (index-13)
        scores.auditingAndProcess1 || 0, // Column O (index-14)
        scores.employeeEngagement1 || 0, // Column P (index-15)
        scores.employeeEngagement2 || 0, // Column Q (index-16)
        scores.employeeEngagement3 || 0, // Column R (index-17)
        scores.employeeEngagement4 || 0, // Column S (index-18)
        scores.employeeEngagement5 || 0, // Column T (index-19)
        scores.qualityOfWork || 0, // Column U (index-20)
        scores.planningExecution || 0, // Column V (index-21)
        scores.timeResources || 0, // Column W (index-22)
        scores.interpersonalRelations || 0, // Column X (index-23)
        scores.flexibilityAdaptability || 0, // Column Y (index-24)
        scores.communication || 0, // Column Z (index-25)
        scores.integrity || 0, // Column AA (index-26)
        scores.leadership || 0, // Column AB (index-27)
        scores.discipline || 0, // Column AC (index-28)
        scores.punctuality || 0 // Column AD (index-29)
      ];

      const scriptURL = "https://script.google.com/macros/s/AKfycbw6xeabQpVzEnNMhLWfMAwLJ0hFZxA2L89aX17-p4b-caM4SdpsETrtq5GT4Lwk84qL/exec";
      const sheetId = "162o34BXqnJvmJjjtIoQpcBGo8orn2ZO5Jf0p8MgoUCs";
      const sheetName = "Poorwa Gajbhiye";

      // Use fetch with form data to properly submit to Google Apps Script
      const formData = new FormData();
      formData.append('sheetId', sheetId);
      formData.append('sheetName', sheetName);
      formData.append('payload', JSON.stringify(rowData));

      const response = await fetch(scriptURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `sheetId=${encodeURIComponent(sheetId)}&sheetName=${encodeURIComponent(sheetName)}&payload=${encodeURIComponent(JSON.stringify(rowData))}`
    });

    // Check if the response is successful
    if (response.ok) {
      console.log('Submitted Scores:', scores);
      console.log('Row Data sent to sheet:', rowData);
      
      // Show success message
      toast.success('Scores submitted successfully!');
      
      // Optional: You can also open the sheet URL to verify data was stored
      const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/edit#gid=0`;
      console.log('Check your Google Sheet here:', sheetUrl);
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
      <div style={{ marginBottom: '30px', backgroundColor: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 6px 10px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ color: '#1e3a8a', borderBottom: '3px solid #1e3a8a', paddingBottom: '10px', marginBottom: '20px' }}>JOB ASSESSMENT</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: '8px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ backgroundColor: '#1e3a8a', color: 'white' }}>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #1e40af' }}>KRA</th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #1e40af' }}>KPI</th>
              <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #1e40af', width: '100px' }}>Out of</th>
              <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #1e40af', width: '100px' }}>User</th>
              <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #1e40af', width: '120px' }}>VP</th>
            </tr>
          </thead>
          <tbody>
            {/* New Joining & File Upadation KRA */}
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff', verticalAlign: 'top' }}>New Joinings & File Updations</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>New Joinings Cycle and File Updations</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>6</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.newJoinings || '-'}
              </td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.newJoinings}
                  onChange={(e) => handleScoreChange('newJoinings', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-6"
                  min="0"
                  max="6"
                  step="0.1"
                />
              </td>
            </tr>

              {/* Planning & Execution L & D (Plain vs Done) KRA */}
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td rowSpan="7" style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff', verticalAlign: 'top' }}>Induction & Documentation</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Manage stakeholders in the region to understand and generate training needs </td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>4</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.planningExecution1 || '-'}
              </td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.planningExecution1}
                  onChange={(e) => handleScoreChange('planningExecution1', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-4"
                  min="0"
                  max="4"
                  step="0.1"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Maintenance of Learning SOPs </td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>7</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.planningExecution2 || '-'}
              </td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.planningExecution2}
                  onChange={(e) => handleScoreChange('planningExecution2', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-7"
                  min="0"
                  max="7"
                  step="0.1"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Piloting new learning Interventions or program deliveries based on evolving needs </td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>5</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.planningExecution3 || '-'}
              </td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.planningExecution3}
                  onChange={(e) => handleScoreChange('planningExecution3', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-5"
                  min="0"
                  max="5"
                  step="0.1"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Capability development of the process/SBU trainer’s/Channel partners </td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>3</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.planningExecution4 || '-'}
              </td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.planningExecution4}
                  onChange={(e) => handleScoreChange('planningExecution4', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-3"
                  min="0"
                  max="3"
                  step="0.1"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Maintain MIS & reports as per defined SOP</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>4</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.planningExecution5 || '-'}
              </td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.planningExecution5}
                  onChange={(e) => handleScoreChange('planningExecution5', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-4"
                  min="0"
                  max="4"
                  step="0.1"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Develop self-expertise in at least one domain of products </td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>6</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.planningExecution6 || '-'}
              </td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.planningExecution6}
                  onChange={(e) => handleScoreChange('planningExecution6', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-6"
                  min="0"
                  max="6"
                  step="0.1"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Contribute to the People Function agenda through HO organized drives and initiatives</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>5</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.planningExecution7 || '-'}
              </td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.planningExecution7}
                  onChange={(e) => handleScoreChange('planningExecution7', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-5"
                  min="0"
                  max="5"
                  step="0.1"
                />
              </td>
            </tr>
            
            {/* Induction Training KRA */}
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td rowSpan="2" style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff', verticalAlign: 'top' }}>Induction Training</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Batch training for the new employees in the contact center</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>4</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.inductionTraining1 || '-'}
              </td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.inductionTraining1}
                  onChange={(e) => handleScoreChange('inductionTraining1', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-4"
                  min="0"
                  max="4"
                  step="0.1"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Conduct refresher sessions for the sales & service calling team</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>3</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.inductionTraining2 || '-'}
              </td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.inductionTraining2}
                  onChange={(e) => handleScoreChange('inductionTraining2', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-3"
                  min="0"
                  max="3"
                  step="0.1"
                />
              </td>
            </tr>
            
            {/* Auditing & Process Improvement KRA */}
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff', verticalAlign: 'top' }}>Auditing & Process Improvement</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Attend various departmental meetings on the assigned tasks</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>7</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.auditingAndProcess1 || '-'}
              </td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.auditingAndProcess1}
                  onChange={(e) => handleScoreChange('auditingAndProcess1', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-7"
                  min="0"
                  max="7"
                  step="0.1"
                />
              </td>
            </tr>


            {/* Employee Engagement	 KRA */}
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td rowSpan="5" style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff', verticalAlign: 'top' }}>Employee Engagement	</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Develop content for the training as per the latest trend of the market</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>5</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.employeeEngagement1 || '-'}
              </td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.employeeEngagement1}
                  onChange={(e) => handleScoreChange('employeeEngagement1', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-5"
                  min="0"
                  max="5"
                  step="0.1"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Payroll management</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>4</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.employeeEngagement2 || '-'}
              </td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.employeeEngagement2}
                  onChange={(e) => handleScoreChange('employeeEngagement2', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-4"
                  min="0"
                  max="4"
                  step="0.1"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Recruitment - Junior staff</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>7</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.employeeEngagement3 || '-'}
              </td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.employeeEngagement3}
                  onChange={(e) => handleScoreChange('employeeEngagement3', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-7"
                  min="0"
                  max="7"
                  step="0.1"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Conduct employee engagement activities</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>4</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.employeeEngagement4 || '-'}
              </td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.employeeEngagement4}
                  onChange={(e) => handleScoreChange('employeeEngagement4', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-4"
                  min="0"
                  max="4"
                  step="0.1"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Assist in employee engagement activities</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>6</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.employeeEngagement5 || '-'}
              </td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.employeeEngagement5}
                  onChange={(e) => handleScoreChange('employeeEngagement5', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-6"
                  min="0"
                  max="6"
                  step="0.1"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ marginTop: '15px', fontWeight: 'bold', padding: '12px', backgroundColor: '#eff6ff', borderRadius: '6px', borderLeft: '4px solid #1e3a8a' }}>
          Job Assessment Total: {totals.jobAssessmentTotal.toFixed(1)} / {totals.jobAssessmentTargetTotal.toFixed(1)}
        </div>
      </div>

      {/* Behavioral Assessment Section */}
      <div style={{ marginBottom: '30px', backgroundColor: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ color: '#1e3a8a', borderBottom: '3px solid #1e3a8a', paddingBottom: '10px', marginBottom: '20px' }}>BEHAVIORAL ASSESSMENT</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: '8px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ backgroundColor: '#1e3a8a', color: 'white' }}>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #1e40af' }}>Behavioral Factor</th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #1e40af' }}>Description</th>
              <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #1e40af', width: '100px' }}>Out of</th>
              <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #1e40af', width: '120px' }}>Score</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', fontWeight: '500' }}>Quality Of Work Performed</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Effectively and efficiently performs job</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>1</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.qualityOfWork}
                  onChange={(e) => handleScoreChange('qualityOfWork', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-1"
                  min="0"
                  max="1"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', fontWeight: '500' }}>Planning & Execution Of Assignments</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Do Plan in advance and execute without deviation</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>2</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.planningExecution}
                  onChange={(e) => handleScoreChange('planningExecution', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-2"
                  min="0"
                  max="2"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', fontWeight: '500' }}>Use Of Time & Resources</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Conserve Company resources and meet deadlines</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>2</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.timeResources}
                  onChange={(e) => handleScoreChange('timeResources', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-2"
                  min="0"
                  max="2"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', fontWeight: '500' }}>Interpersonal Relations</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Have healthy work relation with peers and superiors</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>2</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.interpersonalRelations}
                  onChange={(e) => handleScoreChange('interpersonalRelations', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-2"
                  min="0"
                  max="2"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', fontWeight: '500' }}>Flexibility & Adaptability</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Flexible in taking additional tasks and adaptable to change</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>2</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.flexibilityAdaptability}
                  onChange={(e) => handleScoreChange('flexibilityAdaptability', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-2"
                  min="0"
                  max="2"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', fontWeight: '500' }}>Communication</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Exchange of information desired through effective means</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>2</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.communication}
                  onChange={(e) => handleScoreChange('communication', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-2"
                  min="0"
                  max="2"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', fontWeight: '500' }}>Integrity</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>High integrity towards company</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>2</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.integrity}
                  onChange={(e) => handleScoreChange('integrity', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-2"
                  min="0"
                  max="2"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', fontWeight: '500' }}>Leadership</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Ability to Inspire and take initiatives</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>2</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.leadership}
                  onChange={(e) => handleScoreChange('leadership', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-2"
                  min="0"
                  max="2"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', fontWeight: '500' }}>Discipline</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Follow rules and code of conduct</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>2</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.discipline}
                  onChange={(e) => handleScoreChange('discipline', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-2"
                  min="0"
                  max="2"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', fontWeight: '500' }}>Punctuality</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Adherence to time and attendance</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>3</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.punctuality}
                  onChange={(e) => handleScoreChange('punctuality', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-3"
                  min="0"
                  max="3"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ marginTop: '15px', fontWeight: 'bold', padding: '12px', backgroundColor: '#eff6ff', borderRadius: '6px', borderLeft: '4px solid #1e3a8a' }}>
          Behavioral Assessment Total: {totals.behavioralTotal.toFixed(1)} / {totals.behavioralTargetTotal.toFixed(1)}
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
            <strong style={{ color: '#1e3a8a' }}>Behavioral Assessment:</strong><br />
            {totals.behavioralTotal.toFixed(1)} / {totals.behavioralTargetTotal.toFixed(1)}
          </div>
          <div style={{ padding: '12px', backgroundColor: '#eff6ff', borderRadius: '6px', minWidth: '200px', border: '1px solid #bfdbfe' }}>
            <strong style={{ color: '#1e3a8a' }}>Overall Total:</strong><br />
            {totals.overallTotal.toFixed(1)} / {totals.overallTargetTotal.toFixed(1)}
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