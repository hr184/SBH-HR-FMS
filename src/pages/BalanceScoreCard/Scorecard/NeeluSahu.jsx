import React, { useEffect } from 'react';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const NeeluSahu = () => {
  const [scores, setScores] = useState({
    // Job Assessment Scores - Updated according to your data
    patientsExperience1: '',
    patientsExperience2: '',
    patientsExperience3: '',
    patientsExperience4: '',
    patientsExperience5: '',
    patientsExperience6: '',
    nps1: '',
    nps2: '',
    nps3: '',
    nps4: '',
    nps5: '',
    nps6: '',
    other1: '',
    other2: '',
    other3: '',
    other4: '',

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

  const [userData, setUserData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const scriptURL = "https://script.google.com/macros/s/AKfycbw6xeabQpVzEnNMhLWfMAwLJ0hFZxA2L89aX17-p4b-caM4SdpsETrtq5GT4Lwk84qL/exec";
        const sheetId = "162o34BXqnJvmJjjtIoQpcBGo8orn2ZO5Jf0p8MgoUCs";
        const sheetName = "Neelu Sahu";

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
                patientsExperience1: latestUserRow[4] || "",
                patientsExperience2: latestUserRow[5] || "",
                patientsExperience3: latestUserRow[6] || "",
                patientsExperience4: latestUserRow[7] || "",
                patientsExperience5: latestUserRow[8] || "",
                patientsExperience6: latestUserRow[9] || "",
                nps1: latestUserRow[10] || "",
                nps2: latestUserRow[11] || "",
                nps3: latestUserRow[12] || "",
                nps4: latestUserRow[13] || "",
                nps5: latestUserRow[14] || "",
                nps6: latestUserRow[15] || "",
                other1: latestUserRow[16] || "",
                other2: latestUserRow[17] || "",
                other3: latestUserRow[18] || "",
                other4: latestUserRow[19] || "",
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

    // Calculate target totals (out of values) - Updated according to your data
    const jobAssessmentTargets = [6, 5, 4, 7, 6, 5, 4, 6, 5, 4, 7, 6, 5, 4, 2, 4];
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
        scores.patientsExperience1 || 0, // Column E (index-4) - Patients Experience / Procedures / Credit Billing Co-ordination
        scores.patientsExperience2 || 0, // Column F (index-5) - NPS/IPD Rounds / Cash tally / Automation
        scores.patientsExperience3 || 0, // Column G (index-6) - Other
        scores.patientsExperience4 || 0, // Column H (index-7) - Execute the SOP as per the guidelines - Front Office / OPD staff / Billings TAT / Counselling etc...
        scores.patientsExperience5 || 0, // Column I (index-8) - To foster peer support; provide training to others regarding the hospital wide policies and processes. - On job training and monitoring the reporting staff
        scores.patientsExperience6 || 0, // Column J (index-9) - Responsible for all other principal duties and key tasks assigned by the management from time to time.
        scores.nps1 || 0, // Column K (index-10) - To constantly interact with respective departments to negotiate and expedite scheduling and completion of tests, procedures, and consultations. - TAT Monitoring of Advise vs Done
        scores.nps2 || 0, // Column L (index-11) - To extend support and coordinate services in line with the Clinical Team's & Nursing Team's requirement.
        scores.nps3 || 0, // Column M (index-12) - Coordinating with Credit Helpdesk/Billing Team for credit patients and updating the patients/patient family members regarding their approval status at periodic interval.
        scores.nps4 || 0, // Column N (index-13) - To achieve 90% and above score in patient satisfaction index on a monthly basis - Daily monitoring on Google Reviews & Feedback forms/Complaints etc...
        scores.nps5 || 0, // Column O (index-14) - Investigate and resolved customer inquiries and complaints in a timely and empathetic manner - Closure Remarks
        scores.nps6 || 0, // Column P (index-15) - To make inpatient rounds, ask open-ended questions to assess patient needs and ensure the services provided delight the patient and patient family members.
        scores.other1 || 0, // Column Q (index-16) - Provide prompt, courteous, efficient and personalized service to all patients. - Ensure Patient Experience delight
        scores.other2 || 0, // Column R (index-17) - Responsible for Daily Cash Tally - Cash/Card/wallet
        scores.other3 || 0, // Column S (index-18) - Task management of self and team - Automations updation
        scores.other4 || 0, // Column T (index-19) - Monthly submission of doctors incentive to  vp sir & Account department.
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
      const sheetName = "Neelu Sahu";

      const response = await fetch(scriptURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `sheetId=${encodeURIComponent(sheetId)}&sheetName=${encodeURIComponent(sheetName)}&payload=${encodeURIComponent(JSON.stringify(rowData))}`
      });

      if (response.ok) {
        console.log('Submitted Scores:', scores);
        console.log('Row Data sent to sheet:', rowData);

        toast.success('Scores submitted successfully!');

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

      {/* Updated Job Assessment Section */}
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

            {/* Patients Experince /Procedures/Credit Billing Co-ordination KRA */}
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td rowSpan={6} style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff' }}>Patients Experince /Procedures/Credit Billing Co-ordination</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Execute the SOP as per the guidelines - Front Office / Opd staff/Billings TAT / Counselling etc...</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>6</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.patientsExperience1 || '-'}
              </td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input
                  type="number"
                  value={scores.patientsExperience1}
                  onChange={(e) => handleScoreChange('patientsExperience1', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-6"
                  min="0"
                  max="6"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>To foster peer support; provide training to others regarding the hospital wide policies and processes.  - On job training and monitering the reporting staff</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>5</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.patientsExperience2 || '-'}
              </td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input
                  type="number"
                  value={scores.patientsExperience2}
                  onChange={(e) => handleScoreChange('patientsExperience2', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-5"
                  min="0"
                  max="5"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Responsible for all other principal duties and key tasks assigned by the management from time to time.</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>4</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.patientsExperience3 || '-'}
              </td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input
                  type="number"
                  value={scores.patientsExperience3}
                  onChange={(e) => handleScoreChange('patientsExperience3', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-4"
                  min="0"
                  max="4"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>To constantly interact with respective departments to negotiate and expedite scheduling and completion of tests, procedures, and consultations. - TAT Monitering of Advise vs Done</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>7</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.patientsExperience4 || '-'}
              </td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input
                  type="number"
                  value={scores.patientsExperience4}
                  onChange={(e) => handleScoreChange('patientsExperience4', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-7"
                  min="0"
                  max="7"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>To extend support and coordinate services in line with the Clinical Team s & Nursing Team s requirement. </td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>6</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.patientsExperience5 || '-'}
              </td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input
                  type="number"
                  value={scores.patientsExperience5}
                  onChange={(e) => handleScoreChange('patientsExperience5', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-6"
                  min="0"
                  max="6"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Coordinating with Credit Helpdesk/Billing Team for credit patients and updating the patients/patient family members regarding their approval status at periodic interval.</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>5</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.patientsExperience6 || '-'}
              </td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input
                  type="number"
                  value={scores.patientsExperience6}
                  onChange={(e) => handleScoreChange('patientsExperience6', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-5"
                  min="0"
                  max="5"
                />
              </td>
            </tr>

            {/* NPS/IPD Rounds /Cash tally/Automation KRA */}
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td rowSpan={6} style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff' }}>NPS/IPD Rounds /Cash tally/Automation</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>To achieve 90% and above score in patient satisfaction index on a monthly basis - Daily moniteting on Google Reviews& Feedback forms/Complaints etc…</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>4</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.nps1 || '-'}
              </td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input
                  type="number"
                  value={scores.nps1}
                  onChange={(e) => handleScoreChange('nps1', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-4"
                  min="0"
                  max="4"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Investigate and resolved customer inquiries and complaints in a timely and empathetic manner - Closure Remarks </td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>6</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.nps2 || '-'}
              </td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input
                  type="number"
                  value={scores.nps2}
                  onChange={(e) => handleScoreChange('nps2', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-6"
                  min="0"
                  max="6"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>To make inpatient rounds, ask open-ended questions to assess patient needs and ensure the services provided delight the patient and patient family members. </td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>5</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.nps3 || '-'}
              </td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input
                  type="number"
                  value={scores.nps3}
                  onChange={(e) => handleScoreChange('nps3', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-5"
                  min="0"
                  max="5"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Provide prompt, courteous, efficient and personalized service to all patients.- Ensure Patient Experince delight</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>4</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.nps4 || '-'}
              </td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input
                  type="number"
                  value={scores.nps4}
                  onChange={(e) => handleScoreChange('nps4', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-4"
                  min="0"
                  max="4"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Responsible for Daily Cash Tally - Cash/Card/wallet </td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>7</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.nps5 || '-'}
              </td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input
                  type="number"
                  value={scores.nps5}
                  onChange={(e) => handleScoreChange('nps5', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-7"
                  min="0"
                  max="7"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Task management of self and team - Automations updation</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>6</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.nps6 || '-'}
              </td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input
                  type="number"
                  value={scores.nps6}
                  onChange={(e) => handleScoreChange('nps6', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-6"
                  min="0"
                  max="6"
                />
              </td>
            </tr>

            {/* Other KRA */}
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td rowSpan={4} style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff' }}>Other</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Finally repsosibile for the Hospitals Business targets - Monthly targets given by management ( Not less than  90% Ach is acceptable).  - NEW FF / REVIEW FF</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>5</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.other1 || '-'}
              </td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input
                  type="number"
                  value={scores.other1}
                  onChange={(e) => handleScoreChange('other1', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-5"
                  min="0"
                  max="5"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Responsible for additional tasks assigned by the reporting HOD & Directors - Updation on same through mail or whatsapp to the concern people</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>4</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.other2 || '-'}
              </td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input
                  type="number"
                  value={scores.other2}
                  onChange={(e) => handleScoreChange('other2', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-4"
                  min="0"
                  max="4"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>IPD - Admission status / Discharge status  - Daily track & Update …</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>2</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.other3 || '-'}
              </td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input
                  type="number"
                  value={scores.other3}
                  onChange={(e) => handleScoreChange('other3', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-2"
                  min="0"
                  max="2"
                />
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Monthly submission of doctors incentive to  vp sir & Account department.</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>4</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.other4 || '-'}
              </td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input
                  type="number"
                  value={scores.other4}
                  onChange={(e) => handleScoreChange('other4', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-4"
                  min="0"
                  max="4"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ marginTop: '15px', fontWeight: 'bold', padding: '12px', backgroundColor: '#eff6ff', borderRadius: '6px', borderLeft: '4px solid #1e3a8a' }}>
          Job Assessment Total: {totals.jobAssessmentTotal.toFixed(1)} / {totals.jobAssessmentTargetTotal.toFixed(1)}
        </div>
      </div>

      {/* Behavioral Assessment Section - UNCHANGED */}
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