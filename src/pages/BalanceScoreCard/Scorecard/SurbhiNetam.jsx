import React from 'react'
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function SurbhiNetam() {
  const [scores, setScores] = useState({
      // Job Assessment Scores - Updated based on provided data
      visitTarget1: '',
      visitTarget2: '',
      revenueBusinessTarget1: '',
      revenueBusinessTarget2: '',
      coordinatingCampsReports1: '',
      coordinatingCampsReports2: '',
      coordinatingCampsReports3: '',
      conductingCampsBusiness1: '',
      
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
      const jobAssessmentTotal = Object.values(scores).slice(0, 8).reduce((a, b) => a + (parseFloat(b) || 0), 0);
      const behavioralTotal = Object.values(scores).slice(8).reduce((a, b) => a + (parseFloat(b) || 0), 0);
      const overallTotal = jobAssessmentTotal + behavioralTotal;
      
      // Calculate target totals (out of values) - Updated based on provided data
      const jobAssessmentTargets = [12, 7, 9, 10, 14, 11, 8, 9];
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
        const employeeName = "Surbhi Netam";
  
        const rowData = [
          timestamp, // Column A (index-0) - Timestamp
          currentMonth, // Column B (index-1) - Current Month
          employeeName, // Column C (index-2) - Employee Name
          "", // Column D (index-3) - Empty column
          scores.visitTarget1 || 0, // Column E (index-4)
          scores.visitTarget2 || 0, // Column F (index-5)
          scores.revenueBusinessTarget1 || 0, // Column G (index-6)
          scores.revenueBusinessTarget2 || 0, // Column H (index-7)
          scores.coordinatingCampsReports1 || 0, // Column I (index-8)
          scores.coordinatingCampsReports2 || 0, // Column J (index-9)
          scores.coordinatingCampsReports3 || 0, // Column K (index-10)
          scores.conductingCampsBusiness1 || 0, // Column L (index-11)
          // Behavioral Assessment Scores
          scores.qualityOfWork || 0, // Column M (index-12)
          scores.planningExecution || 0, // Column N (index-13)
          scores.timeResources || 0, // Column O (index-14)
          scores.interpersonalRelations || 0, // Column P (index-15)
          scores.flexibilityAdaptability || 0, // Column Q (index-16)
          scores.communication || 0, // Column R (index-17)
          scores.integrity || 0, // Column S (index-18)
          scores.leadership || 0, // Column T (index-19)
          scores.discipline || 0, // Column U (index-20)
          scores.punctuality || 0 // Column V (index-21)
        ];
  
        const scriptURL = "https://script.google.com/macros/s/AKfycbw6xeabQpVzEnNMhLWfMAwLJ0hFZxA2L89aX17-p4b-caM4SdpsETrtq5GT4Lwk84qL/exec";
        const sheetId = "162o34BXqnJvmJjjtIoQpcBGo8orn2ZO5Jf0p8MgoUCs";
        const sheetName = "Surbhi Netam";
  
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
                <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #1e40af', width: '120px' }}>Score</th>
              </tr>
            </thead>
            <tbody>
              {/* Visit Target KRA */}
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <td rowSpan="2" style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff', verticalAlign: 'top' }}>Visit Target</td>
                <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Planning min 8 Outside Camps in a week/month</td>
                <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>12</td>
                <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <input 
                    type="number" 
                    value={scores.visitTarget1}
                    onChange={(e) => handleScoreChange('visitTarget1', e.target.value)}
                    style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                    placeholder="0-12"
                    min="0"
                    max="12"
                  />
                </td>
              </tr>
              <tr style={{ backgroundColor: '#ffffff' }}>
                <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Ensuring 50 new patients a month to the unit</td>
                <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>7</td>
                <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <input 
                    type="number" 
                    value={scores.visitTarget2}
                    onChange={(e) => handleScoreChange('visitTarget2', e.target.value)}
                    style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                    placeholder="0-7"
                    min="0"
                    max="7"
                  />
                </td>
              </tr>
  
              {/* Revenue & Generating Business Target Achieved KRA */}
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <td rowSpan="2" style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff', verticalAlign: 'top' }}>Revenue & Generating Business Target Achieved</td>
                <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Generating a business through cataract surgeries, Retina etc….</td>
                <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>9</td>
                <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <input 
                    type="number" 
                    value={scores.revenueBusinessTarget1}
                    onChange={(e) => handleScoreChange('revenueBusinessTarget1', e.target.value)}
                    style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                    placeholder="0-9"
                    min="0"
                    max="9"
                  />
                </td>
              </tr>
              <tr style={{ backgroundColor: '#ffffff' }}>
                <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Achive a target of min 5 Lacs a month Inclusive of OPD, LASIK, cataract surgery, retina care,  optical services and womens /Cosmetis  services.</td>
                <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>10</td>
                <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <input 
                    type="number" 
                    value={scores.revenueBusinessTarget2}
                    onChange={(e) => handleScoreChange('revenueBusinessTarget2', e.target.value)}
                    style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                    placeholder="0-10"
                    min="0"
                    max="10"
                  />
                </td>
              </tr>
  
              {/* Coordinating Camps and Submission of Reports KRA */}
              <tr style={{ backgroundColor: '#ffffff' }}>
                <td rowSpan="3" style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff', verticalAlign: 'top' }}>Coordinating Camps and Submission of Reports</td>
                <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Daily updation of Patients leads in official whats up Groups & to manager</td>
                <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>14</td>
                <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <input 
                    type="number" 
                    value={scores.coordinatingCampsReports1}
                    onChange={(e) => handleScoreChange('coordinatingCampsReports1', e.target.value)}
                    style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                    placeholder="0-14"
                    min="0"
                    max="14"
                  />
                </td>
              </tr>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Co ordinating with Unit team for business support and to get involved in camps.</td>
                <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>11</td>
                <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <input 
                    type="number" 
                    value={scores.coordinatingCampsReports2}
                    onChange={(e) => handleScoreChange('coordinatingCampsReports2', e.target.value)}
                    style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                    placeholder="0-11"
                    min="0"
                    max="11"
                  />
                </td>
              </tr>
              <tr style={{ backgroundColor: '#ffffff' }}>
                <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Submission of rating sheets to manager and team on weekly basis</td>
                <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>8</td>
                <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <input 
                    type="number" 
                    value={scores.coordinatingCampsReports3}
                    onChange={(e) => handleScoreChange('coordinatingCampsReports3', e.target.value)}
                    style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                    placeholder="0-8"
                    min="0"
                    max="8"
                  />
                </td>
              </tr>
  
              
  
              {/* Conducting Camps and Generating business KRA */}
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <td style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff', verticalAlign: 'top' }}>Conducting Camps and Generating business</td>
                <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Min 2 Inhouse camps on Sunday's or Public Holidays to drive more Newer Footfalls and generate business.</td>
                <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>9</td>
                <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <input 
                    type="number" 
                    value={scores.conductingCampsBusiness1}
                    onChange={(e) => handleScoreChange('conductingCampsBusiness1', e.target.value)}
                    style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                    placeholder="0-9"
                    min="0"
                    max="9"
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
}