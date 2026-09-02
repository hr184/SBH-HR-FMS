import React from 'react';

export const MonthSelectorBanner = ({
  selectedMonth,
  onMonthChange,
  availableMonths = [],
  onRefresh,
  isLoading = false,
  submissionInfo = null,
  isUserView = false,
  onCopyUserScores = null,
  employeeName = ''
}) => {
  return (
    <div
      style={{
        marginBottom: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        padding: '16px 20px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '15px'
      }}
    >
      {/* Left side: Month dropdown and refresh */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <label style={{ fontWeight: 'bold', color: '#1e3a8a', fontSize: '15px' }}>
          {isUserView ? 'Select Month:' : 'Evaluating Month:'}
        </label>
        <select
          value={selectedMonth}
          onChange={(e) => onMonthChange(e.target.value)}
          style={{
            padding: '8px 14px',
            borderRadius: '6px',
            border: '2px solid #1e3a8a',
            fontWeight: 'bold',
            color: '#1e3a8a',
            backgroundColor: '#f8fafc',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {availableMonths.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isLoading}
            style={{
              padding: '8px 14px',
              backgroundColor: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '13px',
              color: '#475569',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>{isLoading ? '⏳' : '🔄'}</span>
            <span>{isLoading ? 'Loading...' : 'Refresh Data'}</span>
          </button>
        )}
      </div>

      {/* Right side: Status and actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {submissionInfo ? (
          <div
            style={{
              backgroundColor: '#dcfce7',
              border: '1px solid #86efac',
              color: '#166534',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '600'
            }}
          >
            {isUserView
              ? `✅ Submitted on: ${submissionInfo.timestamp} | Your Score: ${submissionInfo.totalScore} / ${submissionInfo.targetScore} (${submissionInfo.percentage}%)`
              : `✅ User Submitted on: ${submissionInfo.timestamp} | Score: ${submissionInfo.totalScore} / ${submissionInfo.targetScore} (${submissionInfo.percentage}%)`}
          </div>
        ) : (
          <div
            style={{
              backgroundColor: isUserView ? '#eff6ff' : '#fef3c7',
              border: `1px solid ${isUserView ? '#bfdbfe' : '#fde68a'}`,
              color: isUserView ? '#1e40af' : '#92400e',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '600'
            }}
          >
            {isUserView
              ? `📝 Enter your scores for ${selectedMonth} below`
              : `⚠️ No User Scorecard submitted for ${selectedMonth}`}
          </div>
        )}

        {!isUserView && submissionInfo && onCopyUserScores && (
          <button
            onClick={onCopyUserScores}
            style={{
              padding: '7px 14px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}
          >
            📋 Copy User Scores
          </button>
        )}
      </div>
    </div>
  );
};
