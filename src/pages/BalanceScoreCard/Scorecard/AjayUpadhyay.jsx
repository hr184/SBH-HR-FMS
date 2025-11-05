import { useState } from "react";

export const AjayUpadhyay = () => {
  const [scores, setScores] = useState({
    // Job Assessment Scores
    costControl1: '',
    costControl2: '',
    costControl3: '',
    riskAssessment: '',
    budgeting1: '',
    budgeting2: '',
    reportingToManagement: '',
    banking: '',
    commercial1: '',
    commercial2: '',
    commercial3: '',
    financialExcellence1: '',
    financialExcellence2: '',
    financialExcellence3: '',
    financialExcellence4: '',
    financialExcellence5: '',
    financialExcellence6: '',
    financialExcellence7: '',
    financialExcellence8: '',
    assetManagement: '',
    audit: '',
    salary: '',
    compliances: '',
    developSecondLine: '',
    trainings: '',
    
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
    
    const jobAssessmentTargets = [5, 5, 5, 4, 4, 4, 3, 3, 3, 3, 3, 3, 4, 4, 2, 2, 3, 2, 2, 3, 3, 3, 3, 2, 2];
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
    const employeeName = "Ajay Upadhyay";

    const rowData = [
      timestamp, // Column A (index-0) - Timestamp
      currentMonth, // Column B (index-1) - Current Month
      employeeName, // Column C (index-2) - Employee Name
      "", // Column D (index-3) - Empty column
      scores.costControl1 || 0, // Column E (index-4)
      scores.costControl2 || 0, // Column F (index-5)
      scores.costControl3 || 0, // Column G (index-6)
      scores.riskAssessment || 0, // Column H (index-7)
      scores.budgeting1 || 0, // Column I (index-8)
      scores.budgeting2 || 0, // Column J (index-9)
      scores.reportingToManagement || 0, // Column K (index-10)
      scores.banking || 0, // Column L (index-11)
      scores.commercial1 || 0, // Column M (index-12)
      scores.commercial2 || 0, // Column N (index-13)
      scores.commercial3 || 0, // Column O (index-14)
      scores.financialExcellence1 || 0, // Column P (index-15)
      scores.financialExcellence2 || 0, // Column Q (index-16)
      scores.financialExcellence3 || 0, // Column R (index-17)
      scores.financialExcellence4 || 0, // Column S (index-18)
      scores.financialExcellence5 || 0, // Column T (index-19)
      scores.financialExcellence6 || 0, // Column U (index-20)
      scores.financialExcellence7 || 0, // Column V (index-21)
      scores.financialExcellence8 || 0, // Column W (index-22)
      scores.assetManagement || 0, // Column X (index-23)
      scores.audit || 0, // Column Y (index-24)
      scores.salary || 0, // Column Z (index-25)
      scores.compliances || 0, // Column AA (index-26)
      scores.developSecondLine || 0, // Column AB (index-27)
      scores.trainings || 0, // Column AC (index-28)
      scores.qualityOfWork || 0, // Column AD (index-29)
      scores.planningExecution || 0, // Column AE (index-30)
      scores.timeResources || 0, // Column AF (index-31)
      scores.interpersonalRelations || 0, // Column AG (index-32)
      scores.flexibilityAdaptability || 0, // Column AH (index-33)
      scores.communication || 0, // Column AI (index-34)
      scores.integrity || 0, // Column AJ (index-35)
      scores.leadership || 0, // Column AK (index-36)
      scores.discipline || 0, // Column AL (index-37)
      scores.punctuality || 0 // Column AM (index-38)
    ];

    const scriptURL = "https://script.google.com/macros/s/AKfycbw6xeabQpVzEnNMhLWfMAwLJ0hFZxA2L89aX17-p4b-caM4SdpsETrtq5GT4Lwk84qL/exec";
    const sheetId = "162o34BXqnJvmJjjtIoQpcBGo8orn2ZO5Jf0p8MgoUCs";
    const sheetName = "Ajay Upadhyay";

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

            {/* Cost Control KRA */}
            <tr style={{ border: '2px solid #000' }}>
              <td rowSpan={3} style={{ borderRight: '2px solid #000' }}><strong>Cost Control</strong></td>
              <td>Zero Penalty /interest due to non-submission of Statutory Returns/challans timely</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.costControl1}
                  onChange={(e) => handleScoreChange('costControl1', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Outstanding control as per monthly target collection</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.costControl2}
                  onChange={(e) => handleScoreChange('costControl2', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>100% calculation of ROI & IRR for all Hospitals</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.costControl3}
                  onChange={(e) => handleScoreChange('costControl3', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                />
              </td>
            </tr>

            {/* Risk Assessment KRA */}
            <tr style={{ border: '2px solid #000' }}>
              <td style={{ borderRight: '2px solid #000' }}><strong>Risk Assessment</strong></td>
              <td>crash cost of projects and operations through Risk Modelling, Insurance zero debtors (TPA, DBCS, RSBY)</td>
              <td>4</td>
              <td>
                <input 
                  type="number" 
                  value={scores.riskAssessment}
                  onChange={(e) => handleScoreChange('riskAssessment', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="4"
                />
              </td>
            </tr>

            {/* Budgeting KRA */}
            <tr style={{ border: '2px solid #000' }}>
              <td rowSpan={2} style={{ borderRight: '2px solid #000' }}><strong>Budgeting</strong></td>
              <td>100% preparation & compliance of quarter cash flow forecast for the organization</td>
              <td>4</td>
              <td>
                <input 
                  type="number" 
                  value={scores.budgeting1}
                  onChange={(e) => handleScoreChange('budgeting1', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="4"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>100% compliance to timeliness in Fund raising as per Quarter Business Plan</td>
              <td>4</td>
              <td>
                <input 
                  type="number" 
                  value={scores.budgeting2}
                  onChange={(e) => handleScoreChange('budgeting2', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="4"
                />
              </td>
            </tr>

            {/* Reporting to Management KRA */}
            <tr style={{ border: '2px solid #000' }}>
            <td style={{ borderRight: '2px solid #000' }}><strong>Reporting to Management</strong></td>
              <td>100% adherence to timeline for submission of monthly, quarterly reports, Working Capital requirements/ Status (1st week of every month)</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.reportingToManagement}
                  onChange={(e) => handleScoreChange('reportingToManagement', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>

            {/* Banking KRA */}
            <tr style={{ border: '2px solid #000' }}>
            <td style={{ borderRight: '2px solid #000' }}><strong>Banking</strong></td>
              <td>100% adherence to timelines for bank reconciliation statement and bank advice preparation</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.banking}
                  onChange={(e) => handleScoreChange('banking', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>

            {/* Commercial KRA */}
            <tr style={{ border: '2px solid #000' }}>
            <td rowSpan={3} style={{ borderRight: '2px solid #000' }}><strong>Commercial</strong></td>
              <td>Store & Purchase Audit- Checking Store Material /Stationary General goods Auditing as per EHMS</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.commercial1}
                  onChange={(e) => handleScoreChange('commercial1', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>100% compliances of Vendor payment-T&C and post delivery service as per agreements</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.commercial2}
                  onChange={(e) => handleScoreChange('commercial2', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Follow SOP for Purchase</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.commercial3}
                  onChange={(e) => handleScoreChange('commercial3', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>

            {/* Financial Excellence */}
            <tr style={{ border: '2px solid #000' }}>
            <td rowSpan={8} style={{ borderRight: '2px solid #000' }}><strong>Financial Excellence</strong></td>
              <td>Current Ratio analysis (account receivables, current liabilities & accounts payable), Debt Equity Ratio and NAV of company </td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.financialExcellence1}
                  onChange={(e) => handleScoreChange('financialExcellence1', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Zero error in fund disbursement</td>
              <td>4</td>
              <td>
                <input 
                  type="number" 
                  value={scores.financialExcellence2}
                  onChange={(e) => handleScoreChange('financialExcellence2', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="4"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>100 % adherence to timelines with zero error for book keeping and maintenance of accounts.</td>
              <td>4</td>
              <td>
                <input 
                  type="number" 
                  value={scores.financialExcellence3}
                  onChange={(e) => handleScoreChange('financialExcellence3', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="4"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Submission of P & L, monthly trial balance analysis, Management information EHMS, Maintain NWC </td>
              <td>2</td>
              <td>
                <input 
                  type="number" 
                  value={scores.financialExcellence4}
                  onChange={(e) => handleScoreChange('financialExcellence4', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="2"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>100% Adherence to monthly timelines for closure of finacial statements. </td>
              <td>2</td>
              <td>
                <input 
                  type="number" 
                  value={scores.financialExcellence5}
                  onChange={(e) => handleScoreChange('financialExcellence5', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="2"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>0 error in sales reciept, purchase bill entry, Journal entry & cash entry</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.financialExcellence6}
                  onChange={(e) => handleScoreChange('financialExcellence6', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Timely payment of all visiting consultants</td>
              <td>2</td>
              <td>
                <input 
                  type="number" 
                  value={scores.financialExcellence7}
                  onChange={(e) => handleScoreChange('financialExcellence7', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="2"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>To track & clear dicounts/refunds</td>
              <td>2</td>
              <td>
                <input 
                  type="number" 
                  value={scores.financialExcellence8}
                  onChange={(e) => handleScoreChange('financialExcellence8', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="2"
                />
              </td>
            </tr>

            {/* Asset Management */}
            <tr style={{ border: '2px solid #000' }}>
            <td style={{ borderRight: '2px solid #000' }}><strong>Asset Management</strong></td>
              <td>Updated Asset Register Maintenance </td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.assetManagement}
                  onChange={(e) => handleScoreChange('assetManagement', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>
            
            {/* Audit */}
            <tr style={{ border: '2px solid #000' }}>
            <td style={{ borderRight: '2px solid #000' }}><strong>Audit</strong></td>
              <td>Closure of all NCs within 72 hours identified in the External Financial Audit</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.audit}
                  onChange={(e) => handleScoreChange('audit', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>
            
            {/* Salary */}
            <tr style={{ border: '2px solid #000' }}>
            <td style={{ borderRight: '2px solid #000' }}><strong>Salary</strong></td>
              <td>Timely disbursement of salary to staff (By 3rd of the next month)</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.salary}
                  onChange={(e) => handleScoreChange('salary', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>
            
            {/* Compliances */}
            <tr style={{ border: '2px solid #000' }}>
            <td style={{ borderRight: '2px solid #000' }}><strong>Compliances</strong></td>
              <td>100% Compliances of  Statutory, regulatory & Other requirements</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.compliances}
                  onChange={(e) => handleScoreChange('compliances', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                />
              </td>
            </tr>

            {/* Develop Second Line */}
            <tr style={{ border: '2px solid #000' }}>
            <td style={{ borderRight: '2px solid #000' }}><strong>Develop Second Line</strong></td>
              <td>0</td>
              <td>2</td>
              <td>
                <input 
                  type="number" 
                  value={scores.developSecondLine}
                  onChange={(e) => handleScoreChange('developSecondLine', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="2"
                />
              </td>
            </tr>
            
            {/* Trainings */}
            <tr style={{ border: '2px solid #000' }}>
            <td style={{ borderRight: '2px solid #000' }}><strong>Trainings</strong></td>
              <td>100% attendence in training session for Leaders</td>
              <td>2</td>
              <td>
                <input 
                  type="number" 
                  value={scores.trainings}
                  onChange={(e) => handleScoreChange('trainings', e.target.value)}
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

      {/* Behavioral Assessment Section */}
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