import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, 
  Download, 
  CheckSquare, 
  Square, 
  Search, 
  RefreshCw, 
  Filter, 
  Award, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  FileSpreadsheet,
  Users,
  Eye,
  History
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { SCRIPT_URL, SHEET_ID, extractAvailableMonths, getCurrentMonthString } from './scorecardHelper';

export const MonthlyScorecardReport = ({ employees = [], onOpenScorecard, onOpenHistory }) => {
  // Available Months
  const availableMonths = useMemo(() => extractAvailableMonths([]), []);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    // Default to latest month or December 2025 if current has no data
    return availableMonths[0] || getCurrentMonthString();
  });

  // State
  const [employeeData, setEmployeeData] = useState({});
  const [loadingProgress, setLoadingProgress] = useState({ loading: false, loaded: 0, total: 0 });
  const [selectedEmpIds, setSelectedEmpIds] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All'); // All, Completed, Pending, NotFilled, Outstanding, Good, Average, Below
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);

  // Initialize all employees selected by default
  useEffect(() => {
    if (employees.length > 0 && selectedEmpIds.size === 0) {
      setSelectedEmpIds(new Set(employees.map(e => e.id)));
    }
  }, [employees]);

  // Unique departments for filter
  const departments = useMemo(() => {
    const deps = new Set(employees.map(e => e.department).filter(Boolean));
    return ['All', ...Array.from(deps).sort()];
  }, [employees]);

  // Helper to normalize month string for comparisons
  const normalizeMonth = (monthString) => {
    if (!monthString) return "";
    try {
      const str = monthString.toString().trim();
      if (str.match(/^[A-Za-z]+\s\d{4}$/)) {
        return str.toLowerCase();
      }
      const date = new Date(str);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        }).toLowerCase();
      }
      return str.toLowerCase();
    } catch {
      return monthString.toString().toLowerCase();
    }
  };

  // Parse scorecard row data to extract metrics
  const parseEmployeeMetricsForMonth = (rawData, targetMonth, empName = "") => {
    if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
      return {
        status: "Not Filled",
        targetScore: "-",
        actualScore: "-",
        oppLoss: "-",
        overallTarget: "-",
        overallActual: "-",
        overallOppLoss: "-",
        overallPercentage: null,
        timestamp: "-",
        evaluator: "-"
      };
    }

    // Find header row
    let headerRowIdx = 5;
    for (let i = 0; i < Math.min(rawData.length, 10); i++) {
      if (rawData[i] && rawData[i][0] && rawData[i][0].toString().toLowerCase().trim() === 'timestamp') {
        headerRowIdx = i;
        break;
      }
    }

    const headers = rawData[headerRowIdx] || [];
    const dataRows = rawData.slice(headerRowIdx + 1);

    // Column Index resolution
    let targetScoreIdx = -1;
    let actualScoreIdx = -1;
    let oppLossIdx = -1;
    let overallTargetIdx = -1;
    let overallActualIdx = -1;
    let overallOppLossIdx = -1;
    let overallPercentageIdx = -1;

    headers.forEach((h, idx) => {
      const txt = (h || '').toString().toLowerCase().trim();
      if (txt === 'target score') targetScoreIdx = idx;
      else if (txt === 'actual score') actualScoreIdx = idx;
      else if (txt === 'overall target') overallTargetIdx = idx;
      else if (txt === 'overall actual') overallActualIdx = idx;
      else if (txt === 'overall opportunity loss' || txt === 'overall opp loss' || txt === 'overall opp. loss') overallOppLossIdx = idx;
      else if (txt === 'overall percentage') overallPercentageIdx = idx;
    });

    for (let idx = 0; idx < headers.length; idx++) {
      const txt = (headers[idx] || '').toString().toLowerCase().trim();
      if (txt === 'opportunity loss') {
        oppLossIdx = idx;
        break;
      }
    }

    // Fallbacks if not found by name
    const len = headers.length || 72;
    if (targetScoreIdx === -1) {
      const hasDelegation = headers.some(h => (h || '').toString().toLowerCase().includes('delegation'));
      if (hasDelegation) {
        targetScoreIdx = len - 10;
        actualScoreIdx = len - 9;
        oppLossIdx = len - 8;
      } else {
        targetScoreIdx = len - 9;
        actualScoreIdx = len - 8;
        oppLossIdx = len - 7;
      }
    }
    if (overallTargetIdx === -1) overallTargetIdx = len - 4;
    if (overallActualIdx === -1) overallActualIdx = len - 3;
    if (overallOppLossIdx === -1) overallOppLossIdx = len - 2;
    if (overallPercentageIdx === -1) overallPercentageIdx = len - 1;

    // Filter matching rows for the selected month
    const matchingRows = dataRows.filter(row => row && row[1] && normalizeMonth(row[1]) === normalizeMonth(targetMonth));

    if (matchingRows.length === 0) {
      return {
        status: "Not Filled",
        targetScore: "-",
        actualScore: "-",
        oppLoss: "-",
        overallTarget: "-",
        overallActual: "-",
        overallOppLoss: "-",
        overallPercentage: null,
        timestamp: "-",
        evaluator: "-"
      };
    }

    // Check if there is an evaluator/COO/Director evaluation row
    // Note: Ajay Upadhyay legacy self-submission had row[2] = 'Ajay Upadhyay' and row[49] empty
    const cooRow = matchingRows.find(row => {
      if (row[2] === "User") return false;
      if (row[2] === "Ajay Upadhyay" && (!row[49] || row[49] === "")) return false;
      return true;
    });

    const userRow = matchingRows.find(row => {
      return row[2] === "User" || (row[2] === "Ajay Upadhyay" && (!row[49] || row[49] === ""));
    });

    // The primary row to show metrics from (prefer evaluator row if available, else user row)
    const activeRow = cooRow || userRow || matchingRows[matchingRows.length - 1];
    const isCompleted = !!cooRow;
    const isPendingEvaluation = !cooRow && !!userRow;

    const isNikhilesh = empName && (empName === "Nikhilesh Davda" || empName.toLowerCase().includes("nikhilesh"));
    const pendingLabel = isNikhilesh ? "Pending from Director" : "Pending COO Evaluation";
    const evaluatorLabel = isCompleted 
      ? (activeRow[2] || (isNikhilesh ? "Director Sir" : "COO / Evaluator")) 
      : isPendingEvaluation ? "User (Self)" : "-";

    const rawPct = activeRow[overallPercentageIdx];
    let percentageNum = null;
    if (rawPct !== undefined && rawPct !== null && rawPct !== '') {
      const parsed = parseFloat(rawPct.toString().replace('%', ''));
      if (!isNaN(parsed)) {
        percentageNum = Math.round(parsed * 10) / 10;
      }
    }

    return {
      status: isCompleted ? "Fully Completed" : isPendingEvaluation ? pendingLabel : "Not Filled",
      targetScore: activeRow[targetScoreIdx] !== undefined && activeRow[targetScoreIdx] !== "" ? activeRow[targetScoreIdx] : "-",
      actualScore: activeRow[actualScoreIdx] !== undefined && activeRow[actualScoreIdx] !== "" ? activeRow[actualScoreIdx] : "-",
      oppLoss: activeRow[oppLossIdx] !== undefined && activeRow[oppLossIdx] !== "" ? activeRow[oppLossIdx] : "-",
      overallTarget: activeRow[overallTargetIdx] !== undefined && activeRow[overallTargetIdx] !== "" ? activeRow[overallTargetIdx] : "-",
      overallActual: activeRow[overallActualIdx] !== undefined && activeRow[overallActualIdx] !== "" ? activeRow[overallActualIdx] : "-",
      overallOppLoss: activeRow[overallOppLossIdx] !== undefined && activeRow[overallOppLossIdx] !== "" ? activeRow[overallOppLossIdx] : "-",
      overallPercentage: percentageNum,
      timestamp: activeRow[0] || "-",
      evaluator: evaluatorLabel
    };
  };

  // Fetch all employee scorecards data for the selected month
  const fetchAllEmployeesData = async (forceRefresh = false) => {
    if (employees.length === 0) return;

    setLoadingProgress({ loading: true, loaded: 0, total: employees.length });
    const results = {};

    // Process in batches of 4 to prevent network throttling while staying fast
    const batchSize = 4;
    for (let i = 0; i < employees.length; i += batchSize) {
      const batch = employees.slice(i, i + batchSize);
      await Promise.all(
        batch.map(async (emp) => {
          try {
            // Check cache if not forceRefresh
            if (!forceRefresh && employeeData[emp.name]?.rawData) {
              const metrics = parseEmployeeMetricsForMonth(employeeData[emp.name].rawData, selectedMonth, emp.name);
              results[emp.name] = {
                rawData: employeeData[emp.name].rawData,
                metrics
              };
              return;
            }

            const url = `${SCRIPT_URL}?sheetId=${encodeURIComponent(SHEET_ID)}&sheetName=${encodeURIComponent(emp.name)}&action=getData`;
            const response = await fetch(url, { credentials: 'omit' });
            if (!response.ok) throw new Error("HTTP error " + response.status);
            const res = await response.json();

            if (res.success && Array.isArray(res.data)) {
              const metrics = parseEmployeeMetricsForMonth(res.data, selectedMonth, emp.name);
              results[emp.name] = {
                rawData: res.data,
                metrics
              };
            } else {
              results[emp.name] = {
                rawData: [],
                metrics: parseEmployeeMetricsForMonth([], selectedMonth, emp.name)
              };
            }
          } catch (err) {
            console.error(`Error loading report for ${emp.name}:`, err);
            results[emp.name] = {
              rawData: [],
              metrics: parseEmployeeMetricsForMonth([], selectedMonth, emp.name)
            };
          } finally {
            setLoadingProgress(prev => ({ ...prev, loaded: Math.min(prev.loaded + 1, prev.total) }));
          }
        })
      );
    }

    setEmployeeData(prev => ({ ...prev, ...results }));
    setLoadingProgress({ loading: false, loaded: employees.length, total: employees.length });
  };

  // Load when month or employee list changes
  useEffect(() => {
    fetchAllEmployeesData(false);
  }, [selectedMonth, employees]);

  // Combined Employee List with calculated metrics
  const enrichedEmployees = useMemo(() => {
    return employees.map(emp => {
      const empInfo = employeeData[emp.name];
      const metrics = empInfo?.metrics || parseEmployeeMetricsForMonth(empInfo?.rawData, selectedMonth, emp.name);

      // Determine Performance Category & Theme
      let ratingCategory = "Not Filled";
      let badgeTheme = {
        bg: "bg-gray-100",
        text: "text-gray-700",
        border: "border-gray-300",
        accent: "#6B7280",
        label: "Not Filled",
        star: ""
      };

      if (metrics.overallPercentage !== null) {
        const pct = metrics.overallPercentage;
        if (pct >= 90) {
          ratingCategory = "Outstanding";
          badgeTheme = {
            bg: "bg-emerald-50",
            text: "text-emerald-800",
            border: "border-emerald-300",
            accent: "#059669",
            barColor: "bg-emerald-600",
            label: "Outstanding (90%+)",
            star: "★"
          };
        } else if (pct >= 75) {
          ratingCategory = "Good";
          badgeTheme = {
            bg: "bg-blue-50",
            text: "text-blue-800",
            border: "border-blue-300",
            accent: "#2563EB",
            barColor: "bg-blue-600",
            label: "Good (75-89%)",
            star: "●"
          };
        } else if (pct >= 60) {
          ratingCategory = "Average";
          badgeTheme = {
            bg: "bg-amber-50",
            text: "text-amber-800",
            border: "border-amber-300",
            accent: "#D97706",
            barColor: "bg-amber-500",
            label: "Average (60-74%)",
            star: "▲"
          };
        } else {
          ratingCategory = "Below Target";
          badgeTheme = {
            bg: "bg-rose-50",
            text: "text-rose-800",
            border: "border-rose-300",
            accent: "#DC2626",
            barColor: "bg-rose-600",
            label: "Below Target (<60%)",
            star: "▼"
          };
        }
      }

      return {
        ...emp,
        metrics,
        ratingCategory,
        badgeTheme,
        isSelected: selectedEmpIds.has(emp.id)
      };
    });
  }, [employees, employeeData, selectedMonth, selectedEmpIds]);

  // Filtered List based on search, department, and status filters
  const filteredEmployees = useMemo(() => {
    return enrichedEmployees.filter(emp => {
      const matchesSearch = 
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDept = selectedDepartment === 'All' || emp.department === selectedDepartment;

      let matchesStatus = true;
      if (statusFilter === 'Completed') matchesStatus = emp.metrics.status === 'Fully Completed';
      else if (statusFilter === 'Pending') matchesStatus = emp.metrics.status.includes('Pending');
      else if (statusFilter === 'PendingDirector') matchesStatus = emp.metrics.status === 'Pending from Director';
      else if (statusFilter === 'PendingCoo') matchesStatus = emp.metrics.status === 'Pending COO Evaluation';
      else if (statusFilter === 'NotFilled') matchesStatus = emp.metrics.status === 'Not Filled';
      else if (statusFilter === 'Outstanding') matchesStatus = emp.ratingCategory === 'Outstanding';
      else if (statusFilter === 'Good') matchesStatus = emp.ratingCategory === 'Good';
      else if (statusFilter === 'Average') matchesStatus = emp.ratingCategory === 'Average';
      else if (statusFilter === 'Below') matchesStatus = emp.ratingCategory === 'Below Target';
      else if (statusFilter === 'SelectedOnly') matchesStatus = emp.isSelected;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [enrichedEmployees, searchQuery, selectedDepartment, statusFilter]);

  // Executive KPI Summary Stats (Calculated on selected employees)
  const summaryStats = useMemo(() => {
    const selectedList = enrichedEmployees.filter(e => e.isSelected);
    const totalSelected = selectedList.length;
    const completedCount = selectedList.filter(e => e.metrics.status === 'Fully Completed').length;
    const pendingCooCount = selectedList.filter(e => e.metrics.status === 'Pending COO Evaluation').length;
    const pendingDirectorCount = selectedList.filter(e => e.metrics.status === 'Pending from Director').length;
    const notFilledCount = selectedList.filter(e => e.metrics.status === 'Not Filled').length;

    const scoredList = selectedList.filter(e => e.metrics.overallPercentage !== null);
    const avgScore = scoredList.length > 0 
      ? (scoredList.reduce((acc, e) => acc + e.metrics.overallPercentage, 0) / scoredList.length).toFixed(1)
      : '0.0';

    return {
      totalSelected,
      completedCount,
      pendingCooCount,
      pendingDirectorCount,
      pendingTotal: pendingCooCount + pendingDirectorCount,
      notFilledCount,
      avgScore,
      scoredCount: scoredList.length
    };
  }, [enrichedEmployees]);

  // Selection Handlers
  const handleToggleSelectAll = () => {
    if (selectedEmpIds.size === employees.length) {
      setSelectedEmpIds(new Set());
    } else {
      setSelectedEmpIds(new Set(employees.map(e => e.id)));
    }
  };

  const handleToggleSelectEmployee = (id) => {
    setSelectedEmpIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isAllSelected = employees.length > 0 && selectedEmpIds.size === employees.length;
  const isPartiallySelected = selectedEmpIds.size > 0 && selectedEmpIds.size < employees.length;

  // ==========================================
  // CONSOLIDATED PDF GENERATION (Landscape A4)
  // ==========================================
  const handleDownloadPdf = async () => {
    const empsToDownload = enrichedEmployees.filter(e => e.isSelected);
    if (empsToDownload.length === 0) {
      alert("Please select at least one employee to generate the PDF report.");
      return;
    }

    setIsGeneratingPdf(true);

    try {
      // Create Landscape A4 document
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Top Hospital Banner & Title
      doc.setFillColor(24, 43, 73); // Deep Navy Primary
      doc.rect(0, 0, pageWidth, 24, 'F');

      // Golden accent stripe
      doc.setFillColor(217, 119, 6);
      doc.rect(0, 24, pageWidth, 1.8, 'F');

      // Header Texts
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text("SBH GROUP OF HOSPITALS", 14, 10);

      doc.setFontSize(10.5);
      doc.setFont('helvetica', 'normal');
      doc.text(`BALANCE SCORE CARD - MONTHLY PERFORMANCE REPORT`, 14, 17);

      // Month & Generation Info on the Right
      doc.setFontSize(9);
      doc.text(`Month: ${selectedMonth}`, pageWidth - 14, 10, { align: 'right' });
      doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`, pageWidth - 14, 16, { align: 'right' });

      // KPI Summary Banner Cards
      const startY = 31;
      const cardWidth = (pageWidth - 28 - 12) / 5;
      const cardHeight = 15;

      const kpis = [
        { label: "Total Selected", value: `${empsToDownload.length}`, color: [24, 43, 73], bg: [241, 245, 249] },
        { label: "Avg Performance", value: `${summaryStats.avgScore}%`, color: [16, 185, 129], bg: [236, 253, 245] },
        { label: "Fully Completed", value: `${summaryStats.completedCount}`, color: [5, 150, 105], bg: [236, 253, 245] },
        { label: "Pending Review", value: `${summaryStats.pendingCooCount}`, color: [217, 119, 6], bg: [254, 243, 199] },
        { label: "Not Filled", value: `${summaryStats.notFilledCount}`, color: [220, 38, 38], bg: [254, 242, 242] },
      ];

      kpis.forEach((kpi, idx) => {
        const x = 14 + idx * (cardWidth + 3);
        doc.setFillColor(kpi.bg[0], kpi.bg[1], kpi.bg[2]);
        doc.roundedRect(x, startY, cardWidth, cardHeight, 1.5, 1.5, 'F');
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(x, startY, cardWidth, cardHeight, 1.5, 1.5, 'S');

        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text(kpi.label, x + cardWidth / 2, startY + 5, { align: 'center' });

        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(kpi.color[0], kpi.color[1], kpi.color[2]);
        doc.text(kpi.value, x + cardWidth / 2, startY + 12, { align: 'center' });
      });

      // Prepare Table Data
      const headers = [
        ["#", "Employee Name", "Department", "Job Target", "Job Actual", "Opp Loss", "Overall Target", "Overall Actual", "Overall Opp Loss", "Total Performance %", "Rating", "Status"]
      ];

      const bodyData = empsToDownload.map((emp, index) => {
        const m = emp.metrics;
        const pctStr = m.overallPercentage !== null ? `${m.overallPercentage}%` : "-";
        return [
          index + 1,
          emp.name,
          emp.department || "-",
          m.targetScore,
          m.actualScore,
          m.oppLoss,
          m.overallTarget,
          m.overallActual,
          m.overallOppLoss,
          pctStr,
          emp.ratingCategory,
          m.status
        ];
      });

      // Build Table using jspdf-autotable
      autoTable(doc, {
        head: headers,
        body: bodyData,
        startY: 50,
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 2,
          valign: 'middle',
          font: 'helvetica',
          lineColor: [226, 232, 240],
          lineWidth: 0.2
        },
        headStyles: {
          fillColor: [24, 43, 73],
          textColor: [255, 255, 255],
          fontSize: 8,
          fontStyle: 'bold',
          halign: 'center'
        },
        columnStyles: {
          0: { halign: 'center', cellWidth: 10 },
          1: { fontStyle: 'bold', cellWidth: 42 },
          2: { cellWidth: 26 },
          3: { halign: 'center', cellWidth: 18 },
          4: { halign: 'center', cellWidth: 18 },
          5: { halign: 'center', cellWidth: 18 },
          6: { halign: 'center', cellWidth: 20 },
          7: { halign: 'center', cellWidth: 20 },
          8: { halign: 'center', cellWidth: 20 },
          9: { halign: 'center', cellWidth: 30, fontStyle: 'bold' },
          10: { halign: 'center', cellWidth: 26, fontStyle: 'bold' },
          11: { halign: 'center', cellWidth: 22 }
        },
        // Color-code the Total Performance % and Rating cells
        didParseCell: (data) => {
          if (data.section === 'body') {
            const rowIndex = data.row.index;
            const empItem = empsToDownload[rowIndex];
            const pct = empItem?.metrics?.overallPercentage;

            // Highlight Performance column (col 9) and Rating column (col 10)
            if (data.column.index === 9 || data.column.index === 10) {
              if (pct !== null && pct !== undefined) {
                if (pct >= 90) {
                  data.cell.styles.fillColor = [220, 252, 231]; // Soft Green
                  data.cell.styles.textColor = [22, 101, 52];   // Deep Emerald
                } else if (pct >= 75) {
                  data.cell.styles.fillColor = [224, 242, 254]; // Soft Blue
                  data.cell.styles.textColor = [3, 105, 161];   // Deep Blue
                } else if (pct >= 60) {
                  data.cell.styles.fillColor = [254, 243, 199]; // Soft Amber
                  data.cell.styles.textColor = [180, 83, 9];    // Deep Amber
                } else {
                  data.cell.styles.fillColor = [254, 226, 226]; // Soft Red
                  data.cell.styles.textColor = [185, 28, 28];   // Deep Red
                }
              } else {
                data.cell.styles.fillColor = [243, 244, 246];
                data.cell.styles.textColor = [107, 114, 128];
              }
            }

            // Status Column (col 11)
            if (data.column.index === 11) {
              const status = empItem?.metrics?.status;
              if (status === 'Fully Completed') {
                data.cell.styles.textColor = [22, 101, 52];
              } else if (status === 'Pending from Director') {
                data.cell.styles.textColor = [126, 34, 206]; // Purple for Director Sir
                data.cell.styles.fontStyle = 'bold';
              } else if (status === 'Pending COO Evaluation') {
                data.cell.styles.textColor = [180, 83, 9];
              } else {
                data.cell.styles.textColor = [156, 163, 175];
              }
            }
          }
        },
        margin: { left: 14, right: 14, bottom: 25 },
        didDrawPage: (data) => {
          // Bottom Footer on each page
          doc.setFontSize(7.5);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(148, 163, 184);

          // Left Footer
          doc.text("Confidential - SBH Group of Hospitals | Balance Scorecard Management System", 14, pageHeight - 10);

          // Right Footer: Page Numbers
          const pageNum = doc.internal.getCurrentPageInfo().pageNumber;
          const pageCount = doc.internal.getNumberOfPages();
          doc.text(`Page ${pageNum} of ${pageCount}`, pageWidth - 14, pageHeight - 10, { align: 'right' });
        }
      });

      // Authorization / Signature Block at end of document
      const finalY = doc.lastAutoTable.finalY + 12;
      const sigY = (finalY + 20 < pageHeight - 15) ? finalY : 30;
      if (finalY + 20 >= pageHeight - 15) {
        doc.addPage();
      }

      const sigColWidth = (pageWidth - 28) / 3;
      const signatures = [
        { title: "Prepared By", sub: "HR Operations / System" },
        { title: "Reviewed By", sub: "Chief Operating Officer (COO)" },
        { title: "Approved By", sub: "Director / Management" }
      ];

      signatures.forEach((sig, idx) => {
        const sigX = 14 + idx * sigColWidth;
        doc.setDrawColor(148, 163, 184);
        doc.line(sigX + 10, sigY + 10, sigX + sigColWidth - 10, sigY + 10);
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 41, 59);
        doc.text(sig.title, sigX + sigColWidth / 2, sigY + 15, { align: 'center' });
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text(sig.sub, sigX + sigColWidth / 2, sigY + 19, { align: 'center' });
      });

      // Save PDF File
      const sanitizedMonth = selectedMonth.replace(/[\s/\\:]/g, '_');
      doc.save(`Balance_Score_Card_Report_${sanitizedMonth}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Failed to generate PDF. Check console for details.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // ==========================================
  // EXCEL EXPORT (Selected or All Employees)
  // ==========================================
  const handleExportExcel = () => {
    const empsToDownload = enrichedEmployees.filter(e => e.isSelected);
    if (empsToDownload.length === 0) {
      alert("Please select at least one employee to export.");
      return;
    }

    setIsExportingExcel(true);
    try {
      const workbook = XLSX.utils.book_new();

      const excelRows = [
        [`SBH Group of Hospitals - Balance Scorecard Report`],
        [`Month: ${selectedMonth}`, `Generated On: ${new Date().toLocaleString()}`, `Selected Employees: ${empsToDownload.length}`],
        [],
        ["S.No", "Employee Name", "Department", "Job Target", "Job Actual", "Opportunity Loss", "Overall Target", "Overall Actual", "Overall Opp Loss", "Total Performance %", "Performance Rating", "Evaluation Status", "Last Evaluator", "Timestamp"]
      ];

      empsToDownload.forEach((emp, index) => {
        const m = emp.metrics;
        excelRows.push([
          index + 1,
          emp.name,
          emp.department || "-",
          m.targetScore,
          m.actualScore,
          m.oppLoss,
          m.overallTarget,
          m.overallActual,
          m.overallOppLoss,
          m.overallPercentage !== null ? `${m.overallPercentage}%` : "-",
          emp.ratingCategory,
          m.status,
          m.evaluator,
          m.timestamp
        ]);
      });

      const worksheet = XLSX.utils.aoa_to_sheet(excelRows);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Scorecard_Summary");
      const sanitizedMonth = selectedMonth.replace(/[\s/\\:]/g, '_');
      XLSX.writeFile(workbook, `Balance_Score_Card_Report_${sanitizedMonth}.xlsx`);
    } catch (err) {
      console.error("Error exporting Excel:", err);
      alert("Failed to export Excel.");
    } finally {
      setIsExportingExcel(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ======================================================== */}
      {/* TOP HEADER: BRANDING & CONTROLS                          */}
      {/* ======================================================== */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        {/* Decorative Top Accent Bar */}
        <div className="h-1.5 bg-gradient-to-r from-blue-700 via-indigo-600 to-amber-500"></div>

        <div className="p-4 md:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Title & Hospital Branding */}
            <div>
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-blue-100 text-blue-800 rounded-lg">
                  <Award className="w-6 h-6 text-blue-800" />
                </span>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                    Balance Score Card
                  </h1>
                  <p className="text-xs md:text-sm text-gray-500 font-medium">
                    SBH Group of Hospitals • Monthly Performance & Evaluation Report
                  </p>
                </div>
              </div>
            </div>

            {/* Actions & Month Selector */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Month Selector Dropdown */}
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-sm shadow-sm">
                <Calendar className="w-4 h-4 text-blue-700" />
                <span className="text-blue-900 font-semibold">Month:</span>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-transparent font-bold text-blue-950 outline-none cursor-pointer pr-1"
                >
                  {availableMonths.map((m) => (
                    <option key={m} value={m} className="bg-white text-gray-800 font-medium">
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Refresh Button */}
              <button
                onClick={() => fetchAllEmployeesData(true)}
                disabled={loadingProgress.loading}
                title="Refresh Google Sheet Data"
                className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-300 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loadingProgress.loading ? 'animate-spin text-blue-600' : ''}`} />
              </button>

              {/* Export Excel Button */}
              <button
                onClick={handleExportExcel}
                disabled={isExportingExcel || selectedEmpIds.size === 0}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span className="hidden sm:inline">Excel</span>
              </button>

              {/* DOWNLOAD CONSOLIDATED PDF BUTTON */}
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf || selectedEmpIds.size === 0 || loadingProgress.loading}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
              >
                <Download className={`w-4 h-4 ${isGeneratingPdf ? 'animate-bounce' : ''}`} />
                <span>
                  {isGeneratingPdf 
                    ? "Generating PDF..." 
                    : isAllSelected 
                      ? "Download All PDF" 
                      : `Download Selected PDF (${selectedEmpIds.size})`}
                </span>
              </button>
            </div>
          </div>

          {/* Progress bar during fetching */}
          {loadingProgress.loading && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs text-blue-700 font-semibold mb-1">
                <span>Fetching live scorecard data from Google Sheet...</span>
                <span>{loadingProgress.loaded} / {loadingProgress.total} Loaded</span>
              </div>
              <div className="w-full bg-blue-100 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-blue-600 h-1.5 transition-all duration-300"
                  style={{ width: `${(loadingProgress.loaded / (loadingProgress.total || 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* EXECUTIVE SUMMARY KPI CARDS                              */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {/* Total Selected */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Selected For Report</p>
            <p className="text-lg md:text-xl font-bold text-gray-900">
              {summaryStats.totalSelected} <span className="text-xs font-normal text-gray-500">/ {employees.length}</span>
            </p>
          </div>
        </div>

        {/* Avg Performance Score */}
        <div className="bg-white rounded-xl p-4 border border-emerald-200 shadow-sm bg-gradient-to-br from-white to-emerald-50/40 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-emerald-800 font-medium">Average Performance</p>
            <p className="text-lg md:text-xl font-extrabold text-emerald-700">
              {summaryStats.avgScore}%
            </p>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Fully Completed</p>
            <p className="text-lg md:text-xl font-bold text-gray-900">
              {summaryStats.completedCount}
            </p>
          </div>
        </div>

        {/* Pending Review */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Pending Review</p>
            <p className="text-lg md:text-xl font-bold text-amber-700 flex items-baseline">
              {summaryStats.pendingTotal || (summaryStats.pendingCooCount + summaryStats.pendingDirectorCount)}
              {summaryStats.pendingDirectorCount > 0 && (
                <span className="text-[11px] font-bold text-purple-700 ml-1.5 bg-purple-100 px-1.5 py-0.5 rounded border border-purple-200">
                  {summaryStats.pendingDirectorCount} Director
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Not Filled */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm col-span-2 sm:col-span-1 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Not Filled</p>
            <p className="text-lg md:text-xl font-bold text-rose-700">
              {summaryStats.notFilledCount}
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SELECTION BAR & FILTERS                                  */}
      {/* ======================================================== */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Select All / Deselect All Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleSelectAll}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold text-gray-800 transition-colors"
            >
              {isAllSelected ? (
                <CheckSquare className="w-4 h-4 text-blue-700" />
              ) : isPartiallySelected ? (
                <span className="w-4 h-4 rounded bg-blue-700 text-white flex items-center justify-center text-xs font-bold leading-none">-</span>
              ) : (
                <Square className="w-4 h-4 text-gray-400" />
              )}
              <span>{isAllSelected ? "Deselect All" : "Select All"}</span>
            </button>

            <span className="text-xs md:text-sm font-medium text-gray-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
              <strong className="text-blue-700">{selectedEmpIds.size}</strong> of {employees.length} selected for export
            </span>
          </div>

          {/* Search & Department Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search employee or department..."
                className="w-full pl-9 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-blue-600 focus:bg-white transition-all"
              />
            </div>

            {/* Department Filter */}
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-2.5 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-blue-600 font-medium text-gray-700 cursor-pointer"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === 'All' ? 'All Depts' : dept}
                </option>
              ))}
            </select>

            {/* Performance Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-blue-600 font-medium text-gray-700 cursor-pointer"
            >
              <option value="All">All Ratings</option>
              <option value="Outstanding">🌟 Outstanding (90%+)</option>
              <option value="Good">🟢 Good (75-89%)</option>
              <option value="Average">🟡 Average (60-74%)</option>
              <option value="Below">🔴 Below Target (&lt;60%)</option>
              <option value="Completed">✓ Fully Completed</option>
              <option value="Pending">⏳ Pending Review (All)</option>
              <option value="PendingDirector">👑 Pending from Director</option>
              <option value="PendingCoo">⏱ Pending COO</option>
              <option value="NotFilled">✕ Not Filled</option>
              <option value="SelectedOnly">☑ Selected Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* PERFORMANCE REPORT TABLE (DESKTOP)                      */}
      {/* ======================================================== */}
      <div className="hidden md:block bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left">
            <thead className="bg-gray-800 text-white text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3 text-center w-12">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={el => { if (el) el.indeterminate = isPartiallySelected; }}
                    onChange={handleToggleSelectAll}
                    className="w-4 h-4 rounded text-blue-600 cursor-pointer accent-blue-600"
                  />
                </th>
                <th className="px-4 py-3">Employee Name</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-3 py-3 text-center">Job Target</th>
                <th className="px-3 py-3 text-center">Job Actual</th>
                <th className="px-3 py-3 text-center">Opp Loss</th>
                <th className="px-3 py-3 text-center">Overall Target</th>
                <th className="px-3 py-3 text-center">Overall Actual</th>
                <th className="px-4 py-3 text-center">Total Performance %</th>
                <th className="px-3 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp, idx) => {
                  const m = emp.metrics;
                  return (
                    <tr 
                      key={emp.id}
                      className={`hover:bg-blue-50/40 transition-colors ${
                        emp.isSelected ? 'bg-blue-50/20' : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={emp.isSelected}
                          onChange={() => handleToggleSelectEmployee(emp.id)}
                          className="w-4 h-4 rounded text-blue-600 cursor-pointer accent-blue-600"
                        />
                      </td>

                      {/* Employee Name */}
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: emp.badgeTheme.accent }}></span>
                          <span>{emp.name}</span>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="px-4 py-3 text-gray-600 font-medium">
                        <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs">
                          {emp.department || "-"}
                        </span>
                      </td>

                      {/* Job Target */}
                      <td className="px-3 py-3 text-center font-medium text-gray-600">
                        {m.targetScore}
                      </td>

                      {/* Job Actual */}
                      <td className="px-3 py-3 text-center font-semibold text-gray-900">
                        {m.actualScore}
                      </td>

                      {/* Opportunity Loss */}
                      <td className="px-3 py-3 text-center font-medium text-rose-600">
                        {m.oppLoss !== "-" && parseFloat(m.oppLoss) > 0 ? `-${m.oppLoss}` : m.oppLoss}
                      </td>

                      {/* Overall Target */}
                      <td className="px-3 py-3 text-center font-medium text-gray-600">
                        {m.overallTarget}
                      </td>

                      {/* Overall Actual */}
                      <td className="px-3 py-3 text-center font-semibold text-gray-900">
                        {m.overallActual}
                      </td>

                      {/* TOTAL PERFORMANCE SCORE (COLOUR-CODED PROMINENTLY) */}
                      <td className="px-4 py-3 text-center">
                        {m.overallPercentage !== null ? (
                          <div className="inline-flex flex-col items-center">
                            {/* Color-Coded Pill Badge */}
                            <div className={`px-3 py-1 rounded-full border text-xs font-bold shadow-sm flex items-center gap-1.5 ${emp.badgeTheme.bg} ${emp.badgeTheme.text} ${emp.badgeTheme.border}`}>
                              <span>{emp.badgeTheme.star}</span>
                              <span className="text-sm font-extrabold">{m.overallPercentage}%</span>
                              <span className="text-[11px] opacity-90">({emp.ratingCategory})</span>
                            </div>

                            {/* Mini Progress Bar */}
                            <div className="w-24 bg-gray-200 rounded-full h-1.5 mt-1 overflow-hidden">
                              <div 
                                className={`h-1.5 rounded-full ${emp.badgeTheme.barColor || 'bg-blue-600'}`}
                                style={{ width: `${Math.min(m.overallPercentage, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200">
                            Not Filled
                          </span>
                        )}
                      </td>

                      {/* Evaluation Status */}
                      <td className="px-3 py-3 text-center">
                        {m.status === 'Fully Completed' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Completed
                          </span>
                        ) : m.status === 'Pending from Director' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 shadow-sm" title="Pending evaluation from Director Sir">
                            <Clock className="w-3 h-3 text-purple-600" />
                            Pending Director
                          </span>
                        ) : m.status === 'Pending COO Evaluation' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Pending COO
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200">
                            Not Filled
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {onOpenScorecard && (
                            <button
                              onClick={() => onOpenScorecard(emp.name)}
                              title="Open Employee Scorecard"
                              className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-xs font-semibold transition-colors flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Scorecard
                            </button>
                          )}
                          {onOpenHistory && (
                            <button
                              onClick={() => onOpenHistory(emp.name)}
                              title="View History"
                              className="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded text-xs font-semibold transition-colors flex items-center gap-1"
                            >
                              <History className="w-3.5 h-3.5" />
                              History
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="11" className="px-6 py-12 text-center text-gray-500">
                    <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="font-semibold text-gray-700">No employees match your filter</p>
                    <p className="text-xs text-gray-500 mt-1">Try resetting the search or filter options</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* PERFORMANCE REPORT CARDS (MOBILE VIEW)                   */}
      {/* ======================================================== */}
      <div className="md:hidden space-y-3">
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((emp) => {
            const m = emp.metrics;
            return (
              <div 
                key={emp.id} 
                className={`bg-white rounded-xl p-4 border shadow-sm transition-all ${
                  emp.isSelected ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'
                }`}
              >
                {/* Header: Checkbox + Name + Total Performance */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={emp.isSelected}
                      onChange={() => handleToggleSelectEmployee(emp.id)}
                      className="w-5 h-5 mt-0.5 rounded text-blue-600 cursor-pointer accent-blue-600"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">{emp.name}</h3>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                        {emp.department || "-"}
                      </span>
                    </div>
                  </div>

                  {/* Total Performance Badge */}
                  <div className="text-right">
                    {m.overallPercentage !== null ? (
                      <div className={`px-2.5 py-1 rounded-full border text-xs font-bold inline-flex items-center gap-1 ${emp.badgeTheme.bg} ${emp.badgeTheme.text} ${emp.badgeTheme.border}`}>
                        <span>{emp.badgeTheme.star}</span>
                        <span className="text-sm font-extrabold">{m.overallPercentage}%</span>
                      </div>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-500 font-medium">
                        Not Filled
                      </span>
                    )}
                  </div>
                </div>

                {/* Score Breakdown Grid */}
                <div className="grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded-lg my-3 text-center text-xs">
                  <div>
                    <span className="text-gray-500 block">Job Score</span>
                    <span className="font-bold text-gray-900">{m.actualScore} / {m.targetScore}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Overall Score</span>
                    <span className="font-bold text-gray-900">{m.overallActual} / {m.overallTarget}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Opp Loss</span>
                    <span className="font-bold text-rose-600">{m.overallOppLoss}</span>
                  </div>
                </div>

                {/* Status & Action Buttons */}
                <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                  <div>
                    {m.status === 'Fully Completed' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                      </span>
                    ) : m.status === 'Pending from Director' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                        <Clock className="w-3.5 h-3.5 text-purple-600" /> Pending Director
                      </span>
                    ) : m.status === 'Pending COO Evaluation' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700">
                        <Clock className="w-3.5 h-3.5" /> Pending COO
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-gray-400">Not Filled</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {onOpenScorecard && (
                      <button
                        onClick={() => onOpenScorecard(emp.name)}
                        className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded text-xs font-semibold"
                      >
                        Scorecard
                      </button>
                    )}
                    {onOpenHistory && (
                      <button
                        onClick={() => onOpenHistory(emp.name)}
                        className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded text-xs font-semibold"
                      >
                        History
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
            No employees match the current filter
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyScorecardReport;
