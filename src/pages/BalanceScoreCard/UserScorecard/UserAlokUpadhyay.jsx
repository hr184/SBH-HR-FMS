import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MonthSelectorBanner } from '../MonthSelectorBanner';
import { fetchScorecardSheetData, extractDataRows, extractAvailableMonths, getDefaultSelectedMonth, findUserSubmission } from '../scorecardHelper';

export const UserAlokPandey = () => {
  const initialScores = {
    digitalStrategy: '',
    contenMarketing: '',
    socialMediaManament: '',
    analyticsAndReport: '',
    collaboration: '',
    developingCampaigns: '',
    partnerManagement: '',
    reputationManagement: '',
    budgetManagement: '',
    brandGuidelines: '',
    seoAndSem: '',
    websiteManagement: '',
    performanceMarketing: ''
  };

  const [scores, setScores] = useState(initialScores);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [allDataRows, setAllDataRows] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [existingSubmissionInfo, setExistingSubmissionInfo] = useState(null);

  const sheetName = "Alok Pandey";

  const parseScoresFromRow = (row) => {
    return {
      digitalStrategy: row[4] !== undefined && row[4] !== "" ? row[4] : "",
      contenMarketing: row[5] !== undefined && row[5] !== "" ? row[5] : "",
      socialMediaManament: row[6] !== undefined && row[6] !== "" ? row[6] : "",
      analyticsAndReport: row[7] !== undefined && row[7] !== "" ? row[7] : "",
      collaboration: row[8] !== undefined && row[8] !== "" ? row[8] : "",
      developingCampaigns: row[9] !== undefined && row[9] !== "" ? row[9] : "",
      partnerManagement: row[10] !== undefined && row[10] !== "" ? row[10] : "",
      reputationManagement: row[11] !== undefined && row[11] !== "" ? row[11] : "",
      budgetManagement: row[12] !== undefined && row[12] !== "" ? row[12] : "",
      brandGuidelines: row[13] !== undefined && row[13] !== "" ? row[13] : "",
      seoAndSem: row[14] !== undefined && row[14] !== "" ? row[14] : "",
      websiteManagement: row[15] !== undefined && row[15] !== "" ? row[15] : "",
      performanceMarketing: row[16] !== undefined && row[16] !== "" ? row[16] : "",
    };
  };

  const applyMonthData = (targetMonth, rows) => {
    const userRow = findUserSubmission(rows, targetMonth);
    if (userRow) {
      const parsed = parseScoresFromRow(userRow);
      setScores(parsed);

      const totalScore = parseFloat(userRow[36]) || Object.values(parsed).reduce((a, b) => a + (parseFloat(b) || 0), 0);
      const targetScore = parseFloat(userRow[35]) || 80;
      const percentage = parseFloat(userRow[44]) || (targetScore > 0 ? (totalScore / targetScore) * 100 : 0);

      setExistingSubmissionInfo({
        timestamp: userRow[0],
        month: userRow[1],
        totalScore,
        targetScore,
        percentage
      });
    } else {
      setScores(initialScores);
      setExistingSubmissionInfo(null);
    }
  };

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const result = await fetchScorecardSheetData(sheetName);
      if (result && result.data && result.data.length > 0) {
        const dataRows = extractDataRows(result.data);
        setAllDataRows(dataRows);

        const months = extractAvailableMonths(dataRows);
        setAvailableMonths(months);

        const defaultMonth = getDefaultSelectedMonth(dataRows, months);
        setSelectedMonth(defaultMonth);
        applyMonthData(defaultMonth, dataRows);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load previous scorecard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    applyMonthData(month, allDataRows);
  };

  const handleScoreChange = (kpi, value) => {
    const numValue = parseFloat(value);
    if (numValue < 0) return;
    
    setScores(prev => ({
      ...prev,
      [kpi]: value
    }));
  };

  const calculateTotals = () => {
    const jobAssessmentTotal = Object.values(scores).reduce((a, b) => a + (parseFloat(b) || 0), 0);
    const jobAssessmentTargets = [5, 7, 6, 4, 8, 3, 9, 4, 5, 6, 7, 8, 8];
    const jobAssessmentTargetTotal = jobAssessmentTargets.reduce((a, b) => a + b, 0);
    
    return {
      jobAssessmentTotal,
      jobAssessmentTargetTotal,
      overallPercentage: jobAssessmentTotal > 0 ? (jobAssessmentTotal / jobAssessmentTargetTotal) * 100 : 0
    };
  };

  const totals = calculateTotals();

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const requiredScores = Object.values(scores).filter(score => score === '');
    if (requiredScores.length > 0) {
      if (!confirm('Some scores are empty. Do you want to submit anyway?')) {
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const currentDate = new Date();
      const day = String(currentDate.getDate()).padStart(2, '0');
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const year = currentDate.getFullYear();
      const hours = String(currentDate.getHours()).padStart(2, '0');
      const minutes = String(currentDate.getMinutes()).padStart(2, '0');
      const seconds = String(currentDate.getSeconds()).padStart(2, '0');
      
      const timestamp = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
      const submissionMonth = selectedMonth || currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
      const employeeName = "User";

      const rowData = [
        timestamp,
        submissionMonth,
        employeeName,
        "",
        scores.digitalStrategy || 0,
        scores.contenMarketing || 0,
        scores.socialMediaManament || 0,
        scores.analyticsAndReport || 0,
        scores.collaboration || 0,
        scores.developingCampaigns || 0,
        scores.partnerManagement || 0,
        scores.reputationManagement || 0,
        scores.budgetManagement || 0,
        scores.brandGuidelines || 0,
        scores.seoAndSem || 0,
        scores.websiteManagement || 0,
        scores.performanceMarketing || 0
      ];

      const scriptURL = "https://script.google.com/macros/s/AKfycbw6xeabQpVzEnNMhLWfMAwLJ0hFZxA2L89aX17-p4b-caM4SdpsETrtq5GT4Lwk84qL/exec";
      const sheetId = "162o34BXqnJvmJjjtIoQpcBGo8orn2ZO5Jf0p8MgoUCs";

      const response = await fetch(scriptURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `sheetId=${encodeURIComponent(sheetId)}&sheetName=${encodeURIComponent(sheetName)}&payload=${encodeURIComponent(JSON.stringify(rowData))}`
      });

      if (response.ok) {
        toast.success(`Scores for ${submissionMonth} submitted successfully!`);
        loadUserData();
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

      <MonthSelectorBanner
        selectedMonth={selectedMonth}
        onMonthChange={handleMonthChange}
        availableMonths={availableMonths}
        onRefresh={loadUserData}
        isLoading={isLoading}
        submissionInfo={existingSubmissionInfo}
        isUserView={true}
        employeeName="Alok Pandey"
      />

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
            {/* Digital Strategy KRA */}
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff', verticalAlign: 'top' }}>Digital Strategy</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Develop and implement comprehensive digital marketing strategies to promote the hospital services, specialities, and brand, with a focus on patient acquisition, engagement, and retention.</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>5</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.digitalStrategy}
                  onChange={(e) => handleScoreChange('digitalStrategy', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-5"
                  min="0"
                  max="5"
                />
              </td>
            </tr>

            {/* Content Marketing KRA */}
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff', verticalAlign: 'top' }}>Content Marketing</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Oversee the creation of high-quality content, including blogs, social media posts, videos, and newsletters, that highlight the hospital s specialties, patient success stories, and health tips.</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>7</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.contenMarketing}
                  onChange={(e) => handleScoreChange('contenMarketing', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-7"
                  min="0"
                  max="7"
                />
              </td>
            </tr>

            {/* Social Media Management KRA */}
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff', verticalAlign: 'top' }}>Social Media Management</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}> Manage and grow the hospital s presence on social media platforms such as Facebook, Instagram, LinkedIn, and YouTube through engaging and informative posts and campaigns.</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>6</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.socialMediaManament}
                  onChange={(e) => handleScoreChange('socialMediaManament', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-6"
                  min="0"
                  max="6"
                />
              </td>
            </tr>

            {/* Analytics & Reporting KRA */}
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff', verticalAlign: 'top' }}>Analytics & Reporting</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Use tools like Google Analytics and other performance tracking tools to measure the effectiveness of digital marketing campaigns. Provide actionable insights to optimize future campaigns.</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>4</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.analyticsAndReport}
                  onChange={(e) => handleScoreChange('analyticsAndReport', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-4"
                  min="0"
                  max="4"
                />
              </td>
            </tr>

            {/* Collaboration KRA */}
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff', verticalAlign: 'top' }}>Collaboration</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Work closely with doctors and external agencies to ensure alignment on all marketing initiatives.</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>8</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.collaboration}
                  onChange={(e) => handleScoreChange('collaboration', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-8"
                  min="0"
                  max="8"
                />
              </td>
            </tr>

            {/* Developing Campaigns KRA */}
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff', verticalAlign: 'top' }}>Developing Campaigns</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Design and execute health awareness campaigns related to various specialties such as Women, IVF, EYE , Physicians , etc.</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>3</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.developingCampaigns}
                  onChange={(e) => handleScoreChange('developingCampaigns', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-3"
                  min="0"
                  max="3"
                />
              </td>
            </tr>

            {/* Partner Management KRA */}
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff', verticalAlign: 'top' }}>Partner Management</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Act as the primary liaison between the hospital and external digital marketing partners. Ensure alignment with business goals.</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>9</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.partnerManagement}
                  onChange={(e) => handleScoreChange('partnerManagement', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-9"
                  min="0"
                  max="9"
                />
              </td>
            </tr>

            {/* Reputation Management KRA */}
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff', verticalAlign: 'top' }}>Reputation Management</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Monitor and manage the hospital s online reputation on platforms such as Google Reviews, Practo, Just-dial, etc. Respond to reviews and inquiries in a professional manner</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>4</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.reputationManagement}
                  onChange={(e) => handleScoreChange('reputationManagement', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-4"
                  min="0"
                  max="4"
                />
              </td>
            </tr>

            {/* Budget Management KRA */}
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff', verticalAlign: 'top' }}>Budget Management</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Allocate and manage digital marketing budgets effectively to maximize ROI across paid advertising and other digital initiatives.</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>5</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.budgetManagement}
                  onChange={(e) => handleScoreChange('budgetManagement', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-5"
                  min="0"
                  max="5"
                />
              </td>
            </tr>

            {/* Brand Guidelines KRA */}
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff', verticalAlign: 'top' }}>Brand Guidelines</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Ensuring that all internal and external communications are consistent with the hospital s brand guidelines, and provide guidance to internal stakeholders on maintaining brand integrity.</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>6</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.brandGuidelines}
                  onChange={(e) => handleScoreChange('brandGuidelines', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-6"
                  min="0"
                  max="6"
                />
              </td>
            </tr>

            {/* SEO & SEM KRA */}
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff', verticalAlign: 'top' }}>SEO & SEM</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Collaborate with external agencies and partners to develop and execute SEO and SEM strategies. Monitor performance to increase organic search visibility and optimize SEM campaigns (Google Ads, Facebook Ads) for patient acquisition.</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>7</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.seoAndSem}
                  onChange={(e) => handleScoreChange('seoAndSem', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-7"
                  min="0"
                  max="7"
                />
              </td>
            </tr>

            {/* Website Management KRA */}
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff', verticalAlign: 'top' }}>Website Management</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Work with website management partners to ensure the hospital s website is up-to-date, user-friendly, and optimized for conversions (appointments, inquiries). Ensure regular updates and performance tracking</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>8</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.websiteManagement}
                  onChange={(e) => handleScoreChange('websiteManagement', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-8"
                  min="0"
                  max="8"
                />
              </td>
            </tr>

            {/* Performance Marketing KRA */}
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff', verticalAlign: 'top' }}>Performance Marketing</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Manage external partners to run performance marketing campaigns, including display ads, re-marketing, and paid search, ensuring they meet predefined KPIs and maximize ROI . </td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>8</td>
              <td style={{ padding: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <input 
                  type="number" 
                  value={scores.performanceMarketing}
                  onChange={(e) => handleScoreChange('performanceMarketing', e.target.value)}
                  style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
                  placeholder="0-8"
                  min="0"
                  max="8"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ marginTop: '15px', fontWeight: 'bold', padding: '12px', backgroundColor: '#eff6ff', borderRadius: '6px', borderLeft: '4px solid #1e3a8a' }}>
          Job Assessment Total: {totals.jobAssessmentTotal.toFixed(1)} / {totals.jobAssessmentTargetTotal.toFixed(1)}
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
          {isSubmitting ? 'Submitting...' : existingSubmissionInfo ? `Update & Re-Submit for ${selectedMonth}` : `Submit Scores for ${selectedMonth}`}
        </button>
      </div>
    </div>
  );
};
