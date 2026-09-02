import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MonthSelectorBanner } from '../MonthSelectorBanner';
import { fetchScorecardSheetData, extractDataRows, extractAvailableMonths, getDefaultSelectedMonth, findUserSubmission, findCooEvaluation } from '../scorecardHelper';

export const AlokPandey = () => {
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
    performanceMarketing: '',
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
  };

  const [scores, setScores] = useState(initialScores);
  const [userData, setUserData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [allDataRows, setAllDataRows] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [userSubmissionInfo, setUserSubmissionInfo] = useState(null);

  const sheetName = "Alok Pandey";

  const parseJobScores = (row) => {
    if (!row) return {};
    return {
      digitalStrategy: row[4] || '',
      contenMarketing: row[5] || '',
      socialMediaManament: row[6] || '',
      analyticsAndReport: row[7] || '',
      collaboration: row[8] || '',
      developingCampaigns: row[9] || '',
      partnerManagement: row[10] || '',
      reputationManagement: row[11] || '',
      budgetManagement: row[12] || '',
      brandGuidelines: row[13] || '',
      seoAndSem: row[14] || '',
      websiteManagement: row[15] || '',
      performanceMarketing: row[16] || ''
    };
  };

  const applyMonthData = (targetMonth, rows) => {
    const userRow = findUserSubmission(rows, targetMonth);
    if (userRow) {
      const parsed = parseJobScores(userRow);
      setUserData(parsed);

      const totalScore = parseFloat(userRow[36]) || Object.values(parsed).reduce((a, b) => a + (parseFloat(b) || 0), 0);
      const targetScore = parseFloat(userRow[35]) || 80;
      const percentage = parseFloat(userRow[44]) || (targetScore > 0 ? (totalScore / targetScore) * 100 : 0);

      setUserSubmissionInfo({
        timestamp: userRow[0],
        month: userRow[1],
        totalScore,
        targetScore,
        percentage
      });
    } else {
      setUserData({});
      setUserSubmissionInfo(null);
    }

    const cooRow = findCooEvaluation(rows, targetMonth);
    if (cooRow) {
      setScores({
        ...parseJobScores(cooRow),
        qualityOfWork: cooRow[17] || '',
        planningExecution: cooRow[18] || '',
        timeResources: cooRow[19] || '',
        interpersonalRelations: cooRow[20] || '',
        flexibilityAdaptability: cooRow[21] || '',
        communication: cooRow[22] || '',
        integrity: cooRow[23] || '',
        leadership: cooRow[24] || '',
        discipline: cooRow[25] || '',
        punctuality: cooRow[26] || ''
      });
    } else {
      setScores(initialScores);
    }
  };

  const loadData = async () => {
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
    } catch (err) {
      console.error('Error loading data:', err);
      toast.error('Failed to load scorecard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    applyMonthData(month, allDataRows);
  };

  const handleCopyUserScores = () => {
    if (!userData || Object.keys(userData).length === 0) {
      toast.warning('No user scores available to copy for this month.');
      return;
    }
    setScores(prev => ({
      ...prev,
      ...userData
    }));
    toast.success('User scores copied into COO fields!');
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
    const jobAssessmentTotal = Object.values(scores).slice(0, 13).reduce((a, b) => a + (parseFloat(b) || 0), 0);
    const behavioralTotal = Object.values(scores).slice(13).reduce((a, b) => a + (parseFloat(b) || 0), 0);
    const overallTotal = jobAssessmentTotal + behavioralTotal;

    const jobAssessmentTargets = [5, 7, 6, 4, 8, 3, 9, 4, 5, 6, 7, 8, 8];
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
      const evaluationMonth = selectedMonth || currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

      let evaluatorName = "Hansraj Singh";
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          evaluatorName = parsed.Name || parsed.Username || "Hansraj Singh";
        }
      } catch (e) {
        console.error(e);
      }

      const rowData = [
        timestamp,
        evaluationMonth,
        evaluatorName,
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
        scores.performanceMarketing || 0,
        scores.qualityOfWork || 0,
        scores.planningExecution || 0,
        scores.timeResources || 0,
        scores.interpersonalRelations || 0,
        scores.flexibilityAdaptability || 0,
        scores.communication || 0,
        scores.integrity || 0,
        scores.leadership || 0,
        scores.discipline || 0,
        scores.punctuality || 0
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
        toast.success(`Scores for ${evaluationMonth} submitted successfully!`);
        loadData();
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
        onRefresh={loadData}
        isLoading={isLoading}
        submissionInfo={userSubmissionInfo}
        isUserView={false}
        onCopyUserScores={handleCopyUserScores}
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
              <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #1e40af', width: '120px' }}>User</th>
              <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #1e40af', width: '120px' }}>COO</th>
            </tr>
          </thead>
          <tbody>
            {/* Digital Strategy KRA */}
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', fontFamily: 'Poppins Regular', fontWeight: 'bold', backgroundColor: '#eff6ff', verticalAlign: 'top' }}>Digital Strategy</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Develop and implement comprehensive digital marketing strategies to promote the hospital services, specialities, and brand, with a focus on patient acquisition, engagement, and retention.</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>5</td>
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.digitalStrategy || '-'}
              </td>
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
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.contenMarketing || '-'}
              </td>
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
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.socialMediaManament || '-'}
              </td>
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
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.analyticsAndReport || '-'}
              </td>
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
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.collaboration || '-'}
              </td>
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
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.developingCampaigns || '-'}
              </td>
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
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.partnerManagement || '-'}
              </td>
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
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.reputationManagement || '-'}
              </td>
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
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.budgetManagement || '-'}
              </td>
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
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.brandGuidelines || '-'}
              </td>
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
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.seoAndSem || '-'}
              </td>
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
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.websiteManagement || '-'}
              </td>
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
              <td style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#666' }}>
                {userData.performanceMarketing || '-'}
              </td>
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
