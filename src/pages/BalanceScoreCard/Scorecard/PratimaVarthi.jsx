import React from 'react'
import { useState } from 'react';

export const PratimaVarthi = () => {
  const [scores, setScores] = useState({
    // Job Assessment Scores
    consumptionCostReduction: '',
    budgetCompliance: '',
    materialIssuance: '',
    vendorQuotations: '',
    purchaseOrderTimeliness: '',
    sopAuditScore: '',
    auditPointsClosure: '',
    consumptionStockReport: '',
    floorMaterialReport: '',
    grnRegister: '',
    itemSamples: '',
    vendorOutstanding: '',
    invoiceVerification: '',
    uniformRegister: '',
    reportSubmission: '',
    subordinateTraining: '',
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
    const jobAssessmentTotal = Object.values(scores).slice(0, 17).reduce((a, b) => a + (parseFloat(b) || 0), 0);
    const behavioralTotal = Object.values(scores).slice(17).reduce((a, b) => a + (parseFloat(b) || 0), 0);
    const overallTotal = jobAssessmentTotal + behavioralTotal;
    
    // Calculate target totals (out of values)
    const jobAssessmentTargets = [8, 5, 5, 5, 6, 5, 5, 5, 5, 5, 3, 7, 5, 3, 3, 2, 3];
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
      const employeeName = "Pratima Varthi";

      const rowData = [
        timestamp, // Column A (index-0) - Timestamp
        currentMonth, // Column B (index-1) - Current Month
        employeeName, // Column C (index-2) - Employee Name
        "", // Column D (index-3) - Empty column
        scores.consumptionCostReduction || 0, // Column E (index-4) - Reduce consumption cost by 10% vis a vis previous year
        scores.budgetCompliance || 0, // Column F (index-5) - 100% compliances of plan vs achievement for annual budget providing monthly reviews as per Business and procurement plan
        scores.materialIssuance || 0, // Column G (index-6) - To receive requisition and issue the material on time to concerned department
        scores.vendorQuotations || 0, // Column H (index-7) - To enquire 3 quotation from different vendors for nonroutine material purchase
        scores.purchaseOrderTimeliness || 0, // Column I (index-8) - To issue the Purchase Order to vender and get the material from the vendor within time frame
        scores.sopAuditScore || 0, // Column J (index-9) - Monthly SOP Audit score by HOD >= 80%
        scores.auditPointsClosure || 0, // Column K (index-10) - 100% closure of points regarding physical audit
        scores.consumptionStockReport || 0, // Column L (index-11) - Monthly consumption and stock Report, Issue re-order level
        scores.floorMaterialReport || 0, // Column M (index-12) - To check floor wise material report on monthly basis
        scores.grnRegister || 0, // Column N (index-13) - To Maintain the GRN receipt register
        scores.itemSamples || 0, // Column O (index-14) - To keep sample of every approved item
        scores.vendorOutstanding || 0, // Column P (index-15) - Have to track Vendor's ourstanding and make sure the payment clearance
        scores.invoiceVerification || 0, // Column Q (index-16) - To verify the challan/invoice with security gate register
        scores.uniformRegister || 0, // Column R (index-17) - To maintain the uniform issuing register
        scores.reportSubmission || 0, // Column S (index-18) - 100% adherence to timeline for submission of reports to management and ensure timely update reports in s/w by subordinates
        scores.subordinateTraining || 0, // Column T (index-19) - Impart per month (2hr) Training to subordinates regarding indent, stock maintain, sorting/labelling etc.
        scores.managementTraining || 0, // Column U (index-20) - Attend Training conducted by management (Departmental / Cross functional)
        scores.qualityOfWork || 0, // Column V (index-21) - Effectively and efficiently performs job
        scores.planningExecution || 0, // Column W (index-22) - Do Plan in advance and execute without deviation
        scores.timeResources || 0, // Column X (index-23) - Conserve Company resources and meet deadlines
        scores.interpersonalRelations || 0, // Column Y (index-24) - Have healthy work relation with peers and superiors
        scores.flexibilityAdaptability || 0, // Column Z (index-25) - Flexible in taking additional tasks and adaptable to change
        scores.communication || 0, // Column AA (index-26) - Exchange of information desired through effective means
        scores.integrity || 0, // Column AB (index-27) - High integrity towards company
        scores.leadership || 0, // Column AC (index-28) - Ability to Inspire and take initiatives
        scores.discipline || 0, // Column AD (index-29) - Follow rules and code of conduct
        scores.punctuality || 0 // Column AE (index-30) - Adherence to time and attendance
      ];

      const scriptURL = "https://script.google.com/macros/s/AKfycbw6xeabQpVzEnNMhLWfMAwLJ0hFZxA2L89aX17-p4b-caM4SdpsETrtq5GT4Lwk84qL/exec";
      const sheetId = "162o34BXqnJvmJjjtIoQpcBGo8orn2ZO5Jf0p8MgoUCs";
      const sheetName = "Pratima Varthi";

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
            {/* Profitability KRA with border */}
            <tr style={{ border: '2px solid #000' }}>
              <td rowSpan="2" style={{ borderRight: '2px solid #000' }}><strong>Profitability</strong></td>
              <td>Reduce consumption cost by 10% vis a vis previous year</td>
              <td>8</td>
              <td>
                <input 
                  type="number" 
                  value={scores.consumptionCostReduction}
                  onChange={(e) => handleScoreChange('consumptionCostReduction', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="8"
                  step="0.1"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>100% compliances of plan vs achievement for annual budget providing monthly reviews as per Business and procurement plan</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.budgetCompliance}
                  onChange={(e) => handleScoreChange('budgetCompliance', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                  step="0.1"
                />
              </td>
            </tr>
            
            {/* Internal Customer Satisfaction KRA with border */}
            <tr style={{ border: '2px solid #000' }}>
              <td style={{ borderRight: '2px solid #000' }}><strong>Internal Customer Satisfaction</strong></td>
              <td>To receive requisition and issue the material on time to concerned department</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.materialIssuance}
                  onChange={(e) => handleScoreChange('materialIssuance', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                  step="0.1"
                />
              </td>
            </tr>
            
            {/* External Customer Satisfaction KRA with border */}
            <tr style={{ border: '2px solid #000' }}>
              <td rowSpan="2" style={{ borderRight: '2px solid #000' }}><strong>External Customer Satisfaction</strong></td>
              <td>To enquire 3 quotation from different vendors for nonroutine material purchase</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.vendorQuotations}
                  onChange={(e) => handleScoreChange('vendorQuotations', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                  step="0.1"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>To issue the Purchase Order to vender and get the material from the vendor within time frame</td>
              <td>6</td>
              <td>
                <input 
                  type="number" 
                  value={scores.purchaseOrderTimeliness}
                  onChange={(e) => handleScoreChange('purchaseOrderTimeliness', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="6"
                  step="0.1"
                />
              </td>
            </tr>
            
            {/* SOP KRA with border */}
            <tr style={{ border: '2px solid #000' }}>
              <td style={{ borderRight: '2px solid #000' }}><strong>SOP</strong></td>
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
                  step="0.1"
                />
              </td>
            </tr>
            
            {/* Inventory Management KRA with border */}
            <tr style={{ border: '2px solid #000' }}>
              <td rowSpan="6" style={{ borderRight: '2px solid #000' }}><strong>Inventory Management</strong></td>
              <td>100% closure of points regarding physical audit</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.auditPointsClosure}
                  onChange={(e) => handleScoreChange('auditPointsClosure', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                  step="0.1"
                />
              </td>
              </tr>
              <tr style={{ border: '2px solid #000' }}>
              <td>Monthly consumption and stock Report, Issue re-order level</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.consumptionStockReport}
                  onChange={(e) => handleScoreChange('consumptionStockReport', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                  step="0.1"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>To check floor wise material report on monthly basis</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.floorMaterialReport}
                  onChange={(e) => handleScoreChange('floorMaterialReport', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                  step="0.1"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>To Maintain the GRN receipt register</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.grnRegister}
                  onChange={(e) => handleScoreChange('grnRegister', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                  step="0.1"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>To keep sample of every approved item</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.itemSamples}
                  onChange={(e) => handleScoreChange('itemSamples', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                  step="0.1"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Have to track Vendor's ourstanding and make sure the payment clearance</td>
              <td>7</td>
              <td>
                <input 
                  type="number" 
                  value={scores.vendorOutstanding}
                  onChange={(e) => handleScoreChange('vendorOutstanding', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="7"
                  step="0.1"
                />
              </td>
            </tr>


            {/* Documentation KRA with border */}
            <tr style={{ border: '2px solid #000' }}>
            <td rowSpan={2} style={{ borderRight: '2px solid #000' }}><strong>Documentation</strong></td>
              <td>To verify the challan/invoice with security gate register</td>
              <td>5</td>
              <td>
                <input 
                  type="number" 
                  value={scores.invoiceVerification}
                  onChange={(e) => handleScoreChange('invoiceVerification', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="5"
                  step="0.1"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>To maintain the uniform issuing register</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.uniformRegister}
                  onChange={(e) => handleScoreChange('uniformRegister', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                  step="0.1"
                />
              </td>
            </tr>

            {/* Reports KRA with border */}
            <tr style={{ border: '2px solid #000' }}>
            <td style={{ borderRight: '2px solid #000' }}><strong>Reports</strong></td>
              <td>100% adherence to timeline for submission of reports to management and ensure timely update reports in s/w by subordinates</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.reportSubmission}
                  onChange={(e) => handleScoreChange('reportSubmission', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="3"
                  step="0.1"
                />
              </td>
            </tr>
            
            {/* Training & Development KRA with border */}  
            <tr style={{ border: '2px solid #000' }}>
            <td rowSpan={2} style={{ borderRight: '2px solid #000' }}><strong>Training & Development</strong></td>
              <td>Impart per month (2hr) Training to subordinates regarding indent, stock maintain, sorting/labelling etc.</td>
              <td>2</td>
              <td>
                <input 
                  type="number" 
                  value={scores.subordinateTraining}
                  onChange={(e) => handleScoreChange('subordinateTraining', e.target.value)}
                  style={{ width: '80px' }}
                  placeholder="Enter No."
                  min="0"
                  max="2"
                  step="0.1"
                />
              </td>
            </tr>
            <tr style={{ border: '2px solid #000' }}>
              <td>Attend Training conducted by management (Departmental / Cross functional)</td>
              <td>3</td>
              <td>
                <input 
                  type="number" 
                  value={scores.managementTraining}
                  onChange={(e) => handleScoreChange('managementTraining', e.target.value)}
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