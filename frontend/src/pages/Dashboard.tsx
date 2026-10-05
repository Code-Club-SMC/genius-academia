import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Users,
  AlertCircle,
  FlaskConical,
  Wallet,
  DollarSign,
  FileText,
  HandCoins,
  ClipboardCheck,
  ClipboardList,
  Armchair,
  GraduationCap,
  Loader2,
  CreditCard,
  CheckCircle2,
  TrendingUp,
  HelpCircle,
  UserPlus,
  Clock,
  BookOpen,
  CalendarDays,
  MapPin,
  BarChart3,
  Download,
  Printer,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  TrendingDown,
  Briefcase,
  ArrowRight,
  Search,
  Calendar,
  Lock,
  Unlock,
  ShieldAlert,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";

// API Base URL - Auto-detect Codespaces
const getApiBaseUrl = () => {
  if (
    typeof window !== "undefined" &&
    window.location.hostname.includes(".app.github.dev")
  ) {
    const hostname = window.location.hostname;
    const codespaceBase = hostname.replace(/-\d+\.app\.github\.dev$/, "");
    return `https://${codespaceBase}-5000.app.github.dev/api`;
  }
  return import.meta.env.VITE_API_URL ?? "/api";
};
const API_BASE_URL = getApiBaseUrl();

// ========================================
// 👑 OWNER DASHBOARD COMPONENT
// ========================================
const CHART_COLORS = [
  "#0EA5E9",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
];

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState("7d");
  const [isClosing, setIsClosing] = useState(false);
  const [closeConfirmOpen, setCloseConfirmOpen] = useState(false);

  // Real stats from API
  const [stats, setStats] = useState({
    chemistryRevenue: 0,
    pendingReimbursements: 0,
    poolRevenue: 0,
    floatingCash: 0,
    ownerNetRevenue: 0,
  });

  // Analytics data
  const [analytics, setAnalytics] = useState<any>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  // System admin name from Configuration
  const [systemAdminName, setSystemAdminName] = useState("");
  const [ownerName, setOwnerName] = useState("");

  // Report modal
  const [reportOpen, setReportOpen] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportPeriod, setReportPeriod] = useState("");

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/finance/dashboard-stats`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  // Fetch analytics data
  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const res = await fetch(`${API_BASE_URL}/finance/analytics-dashboard`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (err) {
      console.error("Error fetching analytics:", err);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Generate report
  const generateReport = async (period: string) => {
    try {
      setReportPeriod(period);
      setReportLoading(true);
      setReportOpen(true);
      const res = await fetch(
        `${API_BASE_URL}/finance/generate-report?period=${period}`,
        { credentials: "include" },
      );
      const data = await res.json();
      if (data.success) {
        setReportData(data.data);
      }
    } catch (err) {
      console.error("Error generating report:", err);
    } finally {
      setReportLoading(false);
    }
  };

  // Print report
  const printReport = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow || !reportData) return;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${reportData.period} Financial Report — Genius Islamian's Academy</title>
        <style>
          body { font-family: 'Segoe UI', sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #1e293b; }
          h1 { color: #0f172a; border-bottom: 3px solid #0EA5E9; padding-bottom: 12px; }
          h2 { color: #334155; margin-top: 30px; }
          .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 20px 0; }
          .stat-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center; }
          .stat-box .label { font-size: 13px; color: #64748b; margin-bottom: 4px; }
          .stat-box .value { font-size: 24px; font-weight: 700; }
          .revenue { color: #059669; }
          .expense { color: #dc2626; }
          .profit { color: #0EA5E9; }
          table { width: 100%; border-collapse: collapse; margin: 16px 0; }
          th, td { padding: 10px 14px; text-align: left; border-bottom: 1px solid #e2e8f0; }
          th { background: #f1f5f9; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
          .footer { margin-top: 40px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 16px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <h1>📊 ${reportData.period} Financial Report</h1>
        <p style="color: #64748b;">Genius Islamian's Academy — Generated on ${new Date(reportData.generatedAt).toLocaleString()}</p>
        
        <div class="summary">
          <div class="stat-box">
            <div class="label">Total Revenue</div>
            <div class="value revenue">PKR ${reportData.totalRevenue?.toLocaleString()}</div>
          </div>
          <div class="stat-box">
            <div class="label">Total Expenses</div>
            <div class="value expense">PKR ${reportData.totalExpenses?.toLocaleString()}</div>
          </div>
          <div class="stat-box">
            <div class="label">Net Profit</div>
            <div class="value profit">PKR ${reportData.netProfit?.toLocaleString()}</div>
          </div>
        </div>

        <h2>Revenue Breakdown</h2>
        <table>
          <thead><tr><th>Category</th><th>Amount (PKR)</th><th>Transactions</th></tr></thead>
          <tbody>
            ${reportData.revenueByCategory?.map((r: any) => `<tr><td>${r.category}</td><td>${r.amount?.toLocaleString()}</td><td>${r.transactions}</td></tr>`).join("") || '<tr><td colspan="3" style="text-align:center;color:#94a3b8;">No revenue data</td></tr>'}
          </tbody>
        </table>

        <h2>Expense Breakdown</h2>
        <table>
          <thead><tr><th>Category</th><th>Amount (PKR)</th><th>Transactions</th></tr></thead>
          <tbody>
            ${reportData.expenseByCategory?.map((e: any) => `<tr><td>${e.category}</td><td>${e.amount?.toLocaleString()}</td><td>${e.transactions}</td></tr>`).join("") || '<tr><td colspan="3" style="text-align:center;color:#94a3b8;">No expense data</td></tr>'}
          </tbody>
        </table>

        <h2>Fee Collection</h2>
        <p>Total Fees Collected: <strong>PKR ${reportData.feesCollected?.total?.toLocaleString() || 0}</strong> (${reportData.feesCollected?.count || 0} records)</p>

        <div class="footer">
          <p>Genius Islamian's Academy — Confidential Financial Report</p>
        </div>
      </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  const handleCloseDay = () => {
    setCloseConfirmOpen(true);
  };

  const confirmCloseDay = async () => {
    setIsClosing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/finance/close-day`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage(data.message);
        fetchStats(); // Refresh stats after closing day
      } else {
        setError(data.message || "Failed to close day.");
      }
    } catch (err) {
      console.error("Error closing day:", err);
      setError("Failed to connect to server for closing day.");
    } finally {
      setIsClosing(false);
      setCloseConfirmOpen(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch students
        const studentsRes = await fetch(`${API_BASE_URL}/students`, {
          credentials: "include",
        });
        const studentsData = await studentsRes.json();
        if (studentsData.success) {
          setStudents(studentsData.data);
        }

        // Fetch financial stats
        await fetchStats();

        // Fetch analytics
        await fetchAnalytics();

        // Fetch system admin name from config
        try {
          const configRes = await fetch(`${API_BASE_URL}/config`, {
            credentials: "include",
          });
          const configData = await configRes.json();
          if (configData.success && configData.data?.systemAdminName) {
            setSystemAdminName(configData.data.systemAdminName);
          }
          if (configData.success && configData.data?.ownerName) {
            setOwnerName(configData.data.ownerName);
          }
        } catch (e) {
          // Non-critical, fallback to user name
        }

        setLoading(false);
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to load data from server");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeStudents = students.filter(
    (s: any) => s.status === "active",
  ).length;

  if (loading) {
    return (
      <DashboardLayout title="Owner Dashboard">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground">
              Loading dashboard data...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <TooltipProvider>
      <DashboardLayout title="Owner Dashboard">
        {/* Header */}
        <div className="relative overflow-hidden rounded-md border border-border bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 p-4 sm:p-5 shadow-none">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2djRoNHYtNGgtNHptMC0yaDZ2Nmgtdi02eiIvPjwvZz48L2c+PC9zdmc+')] opacity-15 pointer-events-none"></div>
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Welcome back,{" "}
                <span className="text-red-400">
                  {ownerName || systemAdminName || user?.fullName || "Owner"}
                </span>
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-0.5">
                Genius Islamian's Academy — Management Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Success/Error Alerts */}
        {successMessage && (
          <div className="mt-4 bg-green-50 border border-green-300 rounded-md p-3 shadow-none">
            <div className="flex items-start gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white text-xs">
                ✓
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-green-900">Success!</p>
                <p className="text-xs text-green-800">{successMessage}</p>
              </div>
              <button
                onClick={() => setSuccessMessage(null)}
                className="text-green-600 hover:text-green-800 text-sm"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-50 border border-red-300 rounded-md p-3 shadow-none">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-bold text-red-900">Error</p>
                <p className="text-xs text-red-800">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Quick Stats Row */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-md border border-border bg-card p-3.5 shadow-none transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Net Revenue
                </p>
                <p className="text-lg sm:text-xl font-bold text-foreground mt-0.5">
                  PKR{" "}
                  {(
                    analytics?.quickStats?.monthlyRevenue ||
                    stats.ownerNetRevenue ||
                    0
                  ).toLocaleString()}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">This month</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400 shrink-0">
                <Wallet className="h-4.5 w-4.5" />
              </div>
            </div>
          </div>

          <div className="rounded-md border border-border bg-card p-3.5 shadow-none transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Today's Revenue
                </p>
                <p className="text-lg sm:text-xl font-bold text-foreground mt-0.5">
                  PKR{" "}
                  {(analytics?.quickStats?.todayRevenue || 0).toLocaleString()}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Today so far</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-sky-100 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400 shrink-0">
                <DollarSign className="h-4.5 w-4.5" />
              </div>
            </div>
          </div>

          <div className="rounded-md border border-border bg-card p-3.5 shadow-none transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Total Students
                </p>
                <p className="text-lg sm:text-xl font-bold text-foreground mt-0.5">
                  {analytics?.quickStats?.totalStudents || activeStudents || 0}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Enrolled</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 shrink-0">
                <GraduationCap className="h-4.5 w-4.5" />
              </div>
            </div>
          </div>

          <div className="rounded-md border border-border bg-card p-3.5 shadow-none transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Total Teachers
                </p>
                <p className="text-lg sm:text-xl font-bold text-foreground mt-0.5">
                  {analytics?.quickStats?.totalTeachers || 0}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">On payroll</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-violet-100 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400 shrink-0">
                <Users className="h-4.5 w-4.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        {analyticsLoading ? (
          <div className="mt-8 flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-sky-500 mx-auto mb-3" />
              <p className="text-sm text-slate-500">Loading analytics...</p>
            </div>
          </div>
        ) : analytics ? (
          <>
            {/* Revenue vs Expenses Chart */}
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <Card className="border border-border bg-card shadow-none rounded-md">
                <CardHeader className="p-3.5 pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base font-semibold">
                    <BarChart3 className="h-4 w-4 text-sky-500" />
                    Revenue vs Expenses
                  </CardTitle>
                  <CardDescription className="text-xs">Last 6 months comparison</CardDescription>
                </CardHeader>
                <CardContent className="p-3.5 pt-0">
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={analytics.revenueVsExpenses}
                        margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis
                          dataKey="month"
                          tick={{ fontSize: 11, fill: "#64748b" }}
                        />
                        <YAxis
                          tick={{ fontSize: 11, fill: "#64748b" }}
                          tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                        />
                        <RechartsTooltip
                          contentStyle={{
                            borderRadius: "6px",
                            border: "1px solid #e2e8f0",
                            boxShadow: "none",
                            fontSize: "12px",
                            padding: "6px 10px",
                          }}
                          formatter={(value: number) => [
                            `PKR ${value.toLocaleString()}`,
                            undefined,
                          ]}
                        />
                        <Legend wrapperStyle={{ fontSize: "11px" }} />
                        <Bar
                          dataKey="revenue"
                          name="Revenue"
                          fill="#10B981"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="expenses"
                          name="Expenses"
                          fill="#EF4444"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Student Growth Chart */}
              <Card className="border border-border bg-card shadow-none rounded-md">
                <CardHeader className="p-3.5 pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base font-semibold">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    Student Growth
                  </CardTitle>
                  <CardDescription className="text-xs">Enrollment over 6 months</CardDescription>
                </CardHeader>
                <CardContent className="p-3.5 pt-0">
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={analytics.enrollmentData}
                        margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                      >
                        <defs>
                          <linearGradient
                            id="colorStudents"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#0EA5E9"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor="#0EA5E9"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis
                          dataKey="month"
                          tick={{ fontSize: 11, fill: "#64748b" }}
                        />
                        <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                        <RechartsTooltip
                          contentStyle={{
                            borderRadius: "6px",
                            border: "1px solid #e2e8f0",
                            boxShadow: "none",
                            fontSize: "12px",
                            padding: "6px 10px",
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: "11px" }} />
                        <Area
                          type="monotone"
                          dataKey="totalStudents"
                          name="Total Students"
                          stroke="#0EA5E9"
                          fill="url(#colorStudents)"
                          strokeWidth={2}
                        />
                        <Bar
                          dataKey="newStudents"
                          name="New Enrollments"
                          fill="#8B5CF6"
                          radius={[4, 4, 0, 0]}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profit Trend + Fee Collection + Expense Breakdown */}
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              {/* Profit Trend */}
              <Card className="border border-border bg-card shadow-none rounded-md">
                <CardHeader className="p-3.5 pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base font-semibold">
                    <Activity className="h-4 w-4 text-violet-500" />
                    Profit Trend
                  </CardTitle>
                  <CardDescription className="text-xs">Monthly net income</CardDescription>
                </CardHeader>
                <CardContent className="p-3.5 pt-0">
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={analytics.revenueVsExpenses}
                        margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis
                          dataKey="month"
                          tick={{ fontSize: 11, fill: "#64748b" }}
                        />
                        <YAxis
                          tick={{ fontSize: 11, fill: "#64748b" }}
                          tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                        />
                        <RechartsTooltip
                          contentStyle={{
                            borderRadius: "6px",
                            border: "1px solid #e2e8f0",
                            boxShadow: "none",
                            fontSize: "12px",
                            padding: "6px 10px",
                          }}
                          formatter={(value: number) => [
                            `PKR ${value.toLocaleString()}`,
                            "Profit",
                          ]}
                        />
                        <Line
                          type="monotone"
                          dataKey="profit"
                          name="Profit"
                          stroke="#8B5CF6"
                          strokeWidth={2.5}
                          dot={{ fill: "#8B5CF6", r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Fee Collection Status */}
              <Card className="border border-border bg-card shadow-none rounded-md">
                <CardHeader className="p-3.5 pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base font-semibold">
                    <CreditCard className="h-4 w-4 text-sky-500" />
                    Fee Collection
                  </CardTitle>
                  <CardDescription className="text-xs">Current month status</CardDescription>
                </CardHeader>
                <CardContent className="p-3.5 pt-0">
                  <div className="space-y-2 mt-1">
                    <div className="flex items-center justify-between p-2.5 rounded-md bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-600"></div>
                        <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                          Paid
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs sm:text-sm font-bold text-emerald-900 dark:text-emerald-200">
                          PKR{" "}
                          {(
                            analytics.feeCollection?.paid?.amount || 0
                          ).toLocaleString()}
                        </p>
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                          {analytics.feeCollection?.paid?.count || 0} students
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-md bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-amber-600"></div>
                        <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                          Pending
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-200">
                          PKR{" "}
                          {(
                            analytics.feeCollection?.pending?.amount || 0
                          ).toLocaleString()}
                        </p>
                        <p className="text-[11px] text-amber-700 dark:text-amber-400">
                          {analytics.feeCollection?.pending?.count || 0}{" "}
                          students
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Expense Breakdown */}
              <Card className="border border-border bg-card shadow-none rounded-md">
                <CardHeader className="p-3.5 pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base font-semibold">
                    <PieChart className="h-4 w-4 text-amber-500" />
                    Expense Breakdown
                  </CardTitle>
                  <CardDescription className="text-xs">This month by category</CardDescription>
                </CardHeader>
                <CardContent className="p-3.5 pt-0">
                  {analytics.expenseCategories &&
                  analytics.expenseCategories.length > 0 ? (
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={analytics.expenseCategories}
                            cx="50%"
                            cy="50%"
                            innerRadius={35}
                            outerRadius={60}
                            dataKey="amount"
                            nameKey="category"
                            paddingAngle={3}
                          >
                            {analytics.expenseCategories.map(
                              (_: any, idx: number) => (
                                <Cell
                                  key={idx}
                                  fill={CHART_COLORS[idx % CHART_COLORS.length]}
                                />
                              ),
                            )}
                          </Pie>
                          <RechartsTooltip
                            contentStyle={{
                              borderRadius: "6px",
                              border: "1px solid #e2e8f0",
                              boxShadow: "none",
                              fontSize: "12px",
                              padding: "6px 10px",
                            }}
                            formatter={(value: number) => [
                              `PKR ${value.toLocaleString()}`,
                              undefined,
                            ]}
                          />
                          <Legend wrapperStyle={{ fontSize: "11px" }} />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-48 flex items-center justify-center text-xs text-muted-foreground">
                      No expenses recorded this month
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        ) : null}

        {/* Financial Reports Section */}
        <Card className="mt-4 border border-border bg-card shadow-none rounded-md">
          <CardHeader className="p-3.5 pb-2">
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base font-semibold">
              <FileText className="h-4.5 w-4.5 text-primary" />
              Generate Financial Reports
            </CardTitle>
            <CardDescription className="text-xs">
              One-click reports for any period — printable & downloadable
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3.5 pt-0">
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              <Button
                variant="outline"
                className="h-11 border border-border bg-background hover:bg-muted font-medium text-xs sm:text-sm shadow-none"
                onClick={() => generateReport("today")}
              >
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-emerald-600" />
                  <div className="text-left">
                    <p className="font-semibold text-foreground leading-none">Today's Sale</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Daily Report</p>
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-11 border border-border bg-background hover:bg-muted font-medium text-xs sm:text-sm shadow-none"
                onClick={() => generateReport("week")}
              >
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-sky-600" />
                  <div className="text-left">
                    <p className="font-semibold text-foreground leading-none">Week's Sale</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Weekly Report</p>
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-11 border border-border bg-background hover:bg-muted font-medium text-xs sm:text-sm shadow-none"
                onClick={() => generateReport("month")}
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-violet-600" />
                  <div className="text-left">
                    <p className="font-semibold text-foreground leading-none">Month's Sale</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Monthly Report</p>
                  </div>
                </div>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-11 border border-border bg-background hover:bg-muted font-medium text-xs sm:text-sm shadow-none"
              >
                <Link to="/finance">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <div className="text-left">
                      <p className="font-semibold text-foreground leading-none">Full Finance</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Detailed Ledger</p>
                    </div>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mt-4 border border-border bg-card shadow-none rounded-md">
          <CardHeader className="p-3.5 pb-2">
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base font-semibold">
              <ClipboardCheck className="h-4.5 w-4.5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription className="text-xs">
              Manage daily operations
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3.5 pt-0">
            <div className="grid gap-2.5 sm:grid-cols-3">
              <Button
                asChild
                variant="default"
                className="h-9.5 text-xs sm:text-sm font-medium shadow-none cursor-pointer"
              >
                <Link to="/finance?tab=expenses">
                  <FileText className="mr-1.5 h-4 w-4" />
                  Record Expense
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-9.5 text-xs sm:text-sm font-medium border-primary/40 text-primary hover:bg-primary/10 shadow-none cursor-pointer"
              >
                <Link to="/admissions">
                  <UserPlus className="mr-1.5 h-4 w-4" />
                  New Admission
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-9.5 text-xs sm:text-sm font-medium border-violet-400 text-violet-700 dark:text-violet-400 hover:bg-violet-50 shadow-none cursor-pointer"
              >
                <Link to="/payroll">
                  <HandCoins className="mr-1.5 h-4 w-4" />
                  Payroll
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Report Modal */}
        <Dialog open={reportOpen} onOpenChange={setReportOpen}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <FileText className="h-5 w-5 text-sky-500" />
                {reportData?.period || "Financial"} Report
              </DialogTitle>
              <DialogDescription>
                {reportData
                  ? `Generated on ${new Date(reportData.generatedAt).toLocaleString()}`
                  : "Generating report..."}
              </DialogDescription>
            </DialogHeader>

            {reportLoading ? (
              <div className="flex items-center justify-center h-48">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-sky-500 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">Crunching numbers...</p>
                </div>
              </div>
            ) : reportData ? (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center">
                    <p className="text-xs font-semibold text-emerald-600 uppercase">
                      Revenue
                    </p>
                    <p className="text-xl font-bold text-emerald-900 mt-1">
                      PKR {reportData.totalRevenue?.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-center">
                    <p className="text-xs font-semibold text-red-600 uppercase">
                      Expenses
                    </p>
                    <p className="text-xl font-bold text-red-900 mt-1">
                      PKR {reportData.totalExpenses?.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-xl bg-sky-50 border border-sky-200 p-4 text-center">
                    <p className="text-xs font-semibold text-sky-600 uppercase">
                      Net Profit
                    </p>
                    <p
                      className={`text-xl font-bold mt-1 ${reportData.netProfit >= 0 ? "text-emerald-900" : "text-red-900"}`}
                    >
                      PKR {reportData.netProfit?.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Revenue Breakdown */}
                {reportData.revenueByCategory?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                      Revenue Breakdown
                    </h3>
                    <div className="space-y-2">
                      {reportData.revenueByCategory.map((r: any, i: number) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-50"
                        >
                          <span className="text-sm text-slate-700">
                            {r.category}
                          </span>
                          <div className="text-right">
                            <span className="text-sm font-semibold text-emerald-700">
                              PKR {r.amount?.toLocaleString()}
                            </span>
                            <span className="text-xs text-slate-400 ml-2">
                              ({r.transactions} txn)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Expense Breakdown */}
                {reportData.expenseByCategory?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                      Expense Breakdown
                    </h3>
                    <div className="space-y-2">
                      {reportData.expenseByCategory.map((e: any, i: number) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-50"
                        >
                          <span className="text-sm text-slate-700">
                            {e.category}
                          </span>
                          <div className="text-right">
                            <span className="text-sm font-semibold text-red-700">
                              PKR {e.amount?.toLocaleString()}
                            </span>
                            <span className="text-xs text-slate-400 ml-2">
                              ({e.transactions} txn)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fee Collection */}
                <div className="rounded-xl bg-sky-50 border border-sky-200 p-4">
                  <h3 className="text-sm font-semibold text-sky-800 mb-1">
                    Fee Collection
                  </h3>
                  <p className="text-sm text-sky-700">
                    Collected{" "}
                    <strong>
                      PKR{" "}
                      {reportData.feesCollected?.total?.toLocaleString() || 0}
                    </strong>{" "}
                    from <strong>{reportData.feesCollected?.count || 0}</strong>{" "}
                    fee records
                  </p>
                </div>
              </div>
            ) : null}

            <DialogFooter className="gap-2 mt-4">
              <Button variant="outline" onClick={() => setReportOpen(false)}>
                Close
              </Button>
              {reportData && (
                <Button
                  className="bg-sky-600 hover:bg-sky-700 text-white"
                  onClick={printReport}
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Print Report
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* --- DAILY CLOSING DIALOG --- */}
        <AlertDialog open={closeConfirmOpen} onOpenChange={setCloseConfirmOpen}>
          <AlertDialogContent className="max-w-md border-2 border-emerald-100 shadow-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Lock className="h-6 w-6 text-emerald-600" />
                Daily Closing Confirmation
              </AlertDialogTitle>
              <AlertDialogDescription className="text-slate-600 py-3 text-lg">
                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 mb-6 shadow-inner">
                  <p className="text-xs uppercase tracking-[0.2em] font-bold text-emerald-700 mb-1">
                    Cash to be Vaulted
                  </p>
                  <p className="text-4xl font-black text-emerald-950">
                    PKR {(stats.floatingCash || 0).toLocaleString()}
                  </p>
                </div>
                Are you sure you want to move your floating cash to the{" "}
                <span className="font-bold text-slate-900 underline">
                  Verified Accounts
                </span>
                ?
                <br />
                <br />
                This will lock the amount for today's session.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-3">
              <AlertDialogCancel className="h-12 text-slate-500 font-semibold uppercase tracking-wider text-xs">
                Review Cash
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmCloseDay}
                className="h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest shadow-lg shadow-emerald-200"
              >
                🔒 Close Day
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DashboardLayout>
    </TooltipProvider>
  );
};

// ========================================
// 🤝 PARTNER DASHBOARD COMPONENT
// ========================================
const PartnerDashboard = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [closeConfirmOpen, setCloseConfirmOpen] = useState(false);

  // Real stats from API
  const [stats, setStats] = useState({
    floatingCash: 0,
    tuitionRevenue: 0,
    expenseDebt: 0,
    hasExpenseDebt: false,
    expenseDebtDetails: [] as any[],
  });

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      // Fetch general stats (SRS 3.0 - includes expense debt from Expense shares)
      const res = await fetch(`${API_BASE_URL}/finance/dashboard-stats`, {
        credentials: "include",
      });
      const data = await res.json();

      if (data.success) {
        setStats({
          floatingCash: data.data.floatingCash || 0,
          tuitionRevenue: data.data.tuitionRevenue || 0,
          expenseDebt: data.data.expenseDebt || 0,
          hasExpenseDebt: data.data.hasExpenseDebt || false,
          expenseDebtDetails: data.data.expenseDebtDetails || [],
        });
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const studentsRes = await fetch(`${API_BASE_URL}/students`, {
          credentials: "include",
        });
        const studentsData = await studentsRes.json();
        if (studentsData.success) {
          setStudents(studentsData.data);
        }
        await fetchStats();
        setLoading(false);
      } catch (err) {
        console.error("Error:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle End of Day Closing
  const handleCloseDay = async () => {
    const floatingAmount = stats.floatingCash || 0;

    if (floatingAmount === 0) {
      toast({
        title: "Nothing to close",
        description: "No floating cash available to close at this time.",
        variant: "destructive",
      });
      return;
    }

    setCloseConfirmOpen(true);
  };

  const confirmCloseDay = async () => {
    const floatingAmount = stats.floatingCash || 0;
    try {
      setIsClosing(true);
      setError(null);
      setSuccessMessage(null);

      const res = await fetch(`${API_BASE_URL}/finance/close-day`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notes: `Daily closing by ${user?.fullName}`,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccessMessage(data.message || "✅ Day closed successfully!");
        await fetchStats();
      } else {
        setError(data.message || "Failed to close day");
      }
    } catch (err: any) {
      console.error("Error closing day:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsClosing(false);
      setCloseConfirmOpen(false);
    }
  };

  // Handle Record Payment (Debt Repayment to Owner)
  const handleRecordPayment = async () => {
    const amount = parseInt(paymentAmount) || 0;

    if (amount <= 0) {
      setError("Please enter a valid payment amount greater than 0");
      return;
    }

    if (amount > stats.expenseDebt) {
      setError(
        `Cannot pay more than your outstanding debt of PKR ${stats.expenseDebt.toLocaleString()}`,
      );
      return;
    }

    try {
      setIsProcessingPayment(true);
      setError(null);

      const res = await fetch(`${API_BASE_URL}/finance/repay-debt`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          notes: paymentNotes || undefined,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccessMessage(
          data.message ||
            `✅ Payment of PKR ${amount.toLocaleString()} recorded successfully!`,
        );
        setPaymentModalOpen(false);
        setPaymentAmount("");
        setPaymentNotes("");
        await fetchStats(); // Refresh stats to show updated debt
      } else {
        setError(data.message || "Failed to record payment");
      }
    } catch (err: any) {
      console.error("Error recording payment:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const activeStudents = students.filter(
    (s: any) => s.status === "active",
  ).length;

  if (loading) {
    return (
      <DashboardLayout title="Partner Dashboard">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Partner Dashboard">
      {/* Header */}
      <div className="relative overflow-hidden rounded-md border border-border bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 p-4 sm:p-5 shadow-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2djRoNHYtNGgtNHptMC0yaDZ2Nmgtdi02eiIvPjwvZz48L2c+PC9zdmc+')] opacity-15 pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Welcome,{" "}
            <span className="text-amber-400">
              {user?.fullName || "Partner"}
            </span>
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-0.5">
            Track your collections and manage your teaching revenue
          </p>
        </div>
      </div>

      {/* Success/Error Alerts */}
      {successMessage && (
        <div className="mt-4 bg-green-50 border border-green-300 rounded-md p-3 shadow-none">
          <div className="flex items-start gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white text-xs">
              ✓
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-green-900">Success!</p>
              <p className="text-xs text-green-800">{successMessage}</p>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-green-600 hover:text-green-800 text-sm"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 bg-red-50 border border-red-300 rounded-md p-3 shadow-none">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-bold text-red-900">Error</p>
              <p className="text-xs text-red-800">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Partner KPI Cards */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Floating Cash (Orange - Needs Closing) */}
        <div className="rounded-md border border-border bg-card p-3.5 shadow-none transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Cash in Hand
              </p>
              <p className="text-lg sm:text-xl font-bold text-foreground mt-0.5">
                PKR{" "}
                {stats.floatingCash > 0
                  ? Math.round(stats.floatingCash / 1000)
                  : 0}
                K
              </p>
              <p className="text-[11px] text-amber-600 font-medium mt-0.5">
                ⚠️ Needs Closing
              </p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 shrink-0">
              <Wallet className="h-4.5 w-4.5" />
            </div>
          </div>
        </div>

        {/* 2. Tuition Revenue (Green) */}
        <div className="rounded-md border border-border bg-card p-3.5 shadow-none transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Total Tuition Revenue
              </p>
              <p className="text-lg sm:text-xl font-bold text-foreground mt-0.5">
                PKR{" "}
                {stats.tuitionRevenue > 0
                  ? Math.round(stats.tuitionRevenue / 1000)
                  : 0}
                K
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Verified collections</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 shrink-0">
              <GraduationCap className="h-4.5 w-4.5" />
            </div>
          </div>
        </div>

        {/* 3. Expense Debt (Red - Warning) */}
        <div
          className={`rounded-md border p-3.5 shadow-none transition-colors ${
            stats.expenseDebt > 0
              ? "bg-red-50/50 border-red-200 dark:bg-red-950/20 dark:border-red-900/40"
              : "border-border bg-card"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Expense Payable
              </p>
              <p
                className={`text-lg sm:text-xl font-bold mt-0.5 ${stats.expenseDebt > 0 ? "text-red-600" : "text-foreground"}`}
              >
                PKR{" "}
                {stats.expenseDebt > 0 ? stats.expenseDebt.toLocaleString() : 0}
              </p>
              <p
                className={`text-[11px] font-medium mt-0.5 ${stats.expenseDebt > 0 ? "text-red-500" : "text-emerald-600"}`}
              >
                {stats.expenseDebt > 0
                  ? `Outstanding balance`
                  : "✓ All Caught Up!"}
              </p>
              {/* Record Payment Button - Only shown when there's debt */}
              {stats.expenseDebt > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPaymentModalOpen(true)}
                  className="mt-2 h-7 px-2 text-xs bg-card hover:bg-red-50 border-red-300 text-red-700 font-medium"
                >
                  <CreditCard className="h-3 w-3 mr-1" />
                  Record Payment
                </Button>
              )}
            </div>
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-md shrink-0 ${
                stats.expenseDebt > 0
                  ? "bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400"
                  : "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
              }`}
            >
              {stats.expenseDebt > 0 ? (
                <AlertCircle className="h-4.5 w-4.5" />
              ) : (
                <CheckCircle2 className="h-4.5 w-4.5" />
              )}
            </div>
          </div>
        </div>

        {/* 4. My Students */}
        <div className="rounded-md border border-border bg-card p-3.5 shadow-none transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Enrolled in Subjects
              </p>
              <p className="text-lg sm:text-xl font-bold text-foreground mt-0.5">
                {activeStudents > 0 ? activeStudents : "0"}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Active students</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 shrink-0">
              <Users className="h-4.5 w-4.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Partner Quick Actions - ONLY End of Day Closing */}
      <Card className="mt-4 border border-border bg-card shadow-none rounded-md">
        <CardHeader className="p-3.5 pb-2">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base font-semibold">
            <ClipboardCheck className="h-4.5 w-4.5 text-blue-600" />
            Quick Actions
          </CardTitle>
          <CardDescription className="text-xs">
            Close your daily collections to verify your cash
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3.5 pt-0">
          <div className="max-w-md">
            <Button
              size="default"
              onClick={handleCloseDay}
              disabled={isClosing}
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm shadow-none rounded-md disabled:opacity-50"
            >
              <DollarSign className="mr-1.5 h-4 w-4" />
              {isClosing ? "Closing..." : "End of Day Closing"}
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Lock your floating cash of{" "}
              <span className="font-semibold text-foreground">
                PKR {stats.floatingCash.toLocaleString()}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* --- DAILY CLOSING DIALOG --- */}
      <AlertDialog open={closeConfirmOpen} onOpenChange={setCloseConfirmOpen}>
        <AlertDialogContent className="max-w-md border border-border shadow-md rounded-md p-5">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
              <Lock className="h-5 w-5 text-blue-600" />
              Partner Daily Closing
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground py-2 text-sm">
              <div className="bg-blue-50/70 dark:bg-blue-950/20 p-4 rounded-md border border-blue-200 dark:border-blue-900/40 mb-3">
                <p className="text-[11px] uppercase tracking-wider font-semibold text-blue-700 dark:text-blue-300 mb-1">
                  Cash to be Reported
                </p>
                <p className="text-2xl font-bold text-foreground">
                  PKR {(stats.floatingCash || 0).toLocaleString()}
                </p>
              </div>
              Lock this amount into the verified balance? This will finalize
              your collections for today.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="h-9 text-xs font-medium rounded-md">
              Go Back
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCloseDay}
              className="h-12 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest shadow-lg shadow-blue-200"
            >
              🔒 Verify & Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Payment Recording Modal */}
    </DashboardLayout>
  );
};

// ========================================
// 🧑‍🏫 TEACHER DASHBOARD COMPONENT
// ========================================
const TeacherDashboard = () => {
  const { user } = useAuth();
  const [teacherProfile, setTeacherProfile] = useState<any>(null);
  const [timetable, setTimetable] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const dayOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        setLoading(true);

        // Fetch teacher profile details
        if (user?.teacherId) {
          const profileRes = await fetch(
            `${API_BASE_URL}/teachers/${user.teacherId}`,
            {
              credentials: "include",
            },
          );
          const profileData = await profileRes.json();
          if (profileData.success) {
            setTeacherProfile(profileData.data);
          }
        }

        // Fetch timetable (auto-filtered by backend for TEACHER role)
        const ttRes = await fetch(`${API_BASE_URL}/timetable`, {
          credentials: "include",
        });
        const ttData = await ttRes.json();
        if (ttData.success) {
          // Sort by day order then by time
          const sorted = (ttData.data || []).sort((a: any, b: any) => {
            const dayDiff = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
            if (dayDiff !== 0) return dayDiff;
            return (a.startTime || "").localeCompare(b.startTime || "");
          });
          setTimetable(sorted);
        }
      } catch (err) {
        console.error("Error fetching teacher data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeacherData();
  }, [user]);

  const capitalizeSubject = (s: string) => {
    const map: Record<string, string> = {
      biology: "Biology",
      chemistry: "Chemistry",
      physics: "Physics",
      math: "Mathematics",
      english: "English",
      urdu: "Urdu",
      islamiat: "Islamiat",
      computer: "Computer Science",
    };
    return (
      map[s?.toLowerCase()] ||
      (s ? s.charAt(0).toUpperCase() + s.slice(1) : "N/A")
    );
  };

  // Get today's day name
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todayClasses = timetable.filter((t: any) => t.day === today);

  // Group timetable by day
  const groupedByDay = timetable.reduce((acc: any, entry: any) => {
    if (!acc[entry.day]) acc[entry.day] = [];
    acc[entry.day].push(entry);
    return acc;
  }, {});

  if (loading) {
    return (
      <DashboardLayout title="Teacher Dashboard">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">
              Loading your dashboard...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Teacher Dashboard">
      {/* Hero Header with Teacher Info */}
      <div className="relative overflow-hidden rounded-md border border-border bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-4 sm:p-5 shadow-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2djRoNHYtNGgtNHptMC0yaDZ2Nmgtdi02eiIvPjwvZz48L2c+PC9zdmc+')] opacity-15 pointer-events-none"></div>
        <div className="relative z-10 flex items-center gap-4">
          {/* Teacher Avatar */}
          <div className="flex-shrink-0">
            {teacherProfile?.profileImage || user?.profileImage ? (
              <img
                src={teacherProfile?.profileImage || user?.profileImage}
                alt={user?.fullName}
                className="h-14 w-14 rounded-md object-cover border border-emerald-400/40"
              />
            ) : (
              <div className="h-14 w-14 rounded-md bg-emerald-700 flex items-center justify-center border border-emerald-400/30">
                <span className="text-xl font-bold text-white">
                  {user?.fullName?.charAt(0) || "T"}
                </span>
              </div>
            )}
          </div>
          {/* Teacher Info */}
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-0.5">
              Welcome,{" "}
              <span className="text-emerald-400">
                {user?.fullName || "Teacher"}
              </span>
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-500/30">
                <BookOpen className="h-3.5 w-3.5" />
                {capitalizeSubject(teacherProfile?.subject || "")}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-500/20 text-slate-300 text-xs font-medium border border-slate-500/30">
                <GraduationCap className="h-3.5 w-3.5" />
                {teacherProfile?.status === "active"
                  ? "Active Teacher"
                  : "Teacher"}
              </span>
              {user?.phone && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-500/20 text-slate-300 text-xs font-medium border border-slate-500/30">
                  📞 {user.phone}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-md border border-border bg-card p-3.5 shadow-none transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Today's Classes
              </p>
              <p className="text-lg sm:text-xl font-bold text-foreground mt-0.5">
                {todayClasses.length}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{today}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 shrink-0">
              <CalendarDays className="h-4.5 w-4.5" />
            </div>
          </div>
        </div>

        <div className="rounded-md border border-border bg-card p-3.5 shadow-none transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Weekly Classes
              </p>
              <p className="text-lg sm:text-xl font-bold text-foreground mt-0.5">
                {timetable.length}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Classes per week</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 shrink-0">
              <Clock className="h-4.5 w-4.5" />
            </div>
          </div>
        </div>

        <div className="rounded-md border border-border bg-card p-3.5 shadow-none transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Subject</p>
              <p className="text-lg sm:text-xl font-bold text-foreground mt-0.5">
                {capitalizeSubject(teacherProfile?.subject || "")}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Assigned subject</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 shrink-0">
              <BookOpen className="h-4.5 w-4.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Today's Schedule - Highlighted */}
      {todayClasses.length > 0 && (
        <Card className="mt-4 border border-border bg-card shadow-none rounded-md">
          <CardHeader className="p-3.5 pb-2">
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base font-semibold">
              <CalendarDays className="h-4 w-4 text-emerald-600" />
              Today's Schedule — {today}
            </CardTitle>
            <CardDescription className="text-xs">
              Your classes for today
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3.5 pt-0">
            <div className="space-y-2">
              {todayClasses.map((entry: any, idx: number) => (
                <div
                  key={entry._id || idx}
                  className="flex items-center gap-3 p-2.5 rounded-md bg-muted/40 border border-border/60"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">
                      {entry.classId?.classTitle ||
                        entry.classId?.className ||
                        entry.subject ||
                        "Class"}
                      {entry.classId?.gradeLevel
                        ? ` — ${entry.classId.gradeLevel}`
                        : entry.classId?.section
                          ? ` — ${entry.classId.section}`
                          : ""}
                    </p>
                    <p className="text-sm text-slate-500">
                      {capitalizeSubject(entry.subject)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-emerald-700">
                      {entry.startTime} — {entry.endTime}
                    </p>
                    {entry.room && (
                      <p className="text-xs text-slate-500 flex items-center justify-end gap-1 mt-1">
                        <MapPin className="h-3 w-3" /> {entry.room}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full Week Timetable */}
      <Card className="mt-8 border-slate-200 bg-white/95 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl text-slate-900">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white">
              <Clock className="h-5 w-5" />
            </div>
            Weekly Timetable
          </CardTitle>
          <CardDescription className="text-slate-600">
            Your complete teaching schedule
          </CardDescription>
        </CardHeader>
        <CardContent>
          {timetable.length === 0 ? (
            <div className="text-center py-12">
              <CalendarDays className="h-16 w-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">
                No Timetable Set
              </h3>
              <p className="text-slate-500">
                Your timetable hasn't been assigned yet. Please contact the
                admin.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {dayOrder
                .filter((day) => groupedByDay[day])
                .map((day) => (
                  <div key={day}>
                    <div className="flex items-center gap-3 mb-3">
                      <h3
                        className={`text-sm font-bold uppercase tracking-wider ${day === today ? "text-emerald-600" : "text-slate-500"}`}
                      >
                        {day}
                      </h3>
                      {day === today && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                          Today
                        </span>
                      )}
                      <div className="flex-1 h-px bg-slate-200" />
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {groupedByDay[day].map((entry: any, idx: number) => (
                        <div
                          key={entry._id || idx}
                          className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                            day === today
                              ? "bg-emerald-50 border-emerald-200"
                              : "bg-slate-50 border-slate-200"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={`text-sm font-bold ${day === today ? "text-emerald-700" : "text-slate-700"}`}
                            >
                              {entry.startTime} — {entry.endTime}
                            </span>
                            {entry.room && (
                              <span className="text-xs text-slate-500 flex items-center gap-1">
                                <MapPin className="h-3 w-3" /> {entry.room}
                              </span>
                            )}
                          </div>
                          <p className="font-medium text-slate-900">
                            {entry.classId?.classTitle ||
                              entry.classId?.className ||
                              "Class"}
                            {entry.classId?.gradeLevel
                              ? ` (${entry.classId.gradeLevel})`
                              : entry.classId?.section
                                ? ` (${entry.classId.section})`
                                : ""}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {capitalizeSubject(entry.subject)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

// ========================================
// 👨‍💼 STAFF DASHBOARD COMPONENT
// ========================================
const StaffDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [staffStats, setStaffStats] = useState<any>({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    todayAdmissions: 0,
    recentInquiries: 0,
  });
  const [loading, setLoading] = useState(true);

  const perms = user?.permissions || ["dashboard"];
  const hasPerm = (p: string) => perms.includes(p);

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        setLoading(true);

        // Fetch basic counts based on permissions
        const promises: Promise<any>[] = [];

        if (hasPerm("students") || hasPerm("admissions")) {
          promises.push(
            fetch(`${API_BASE_URL}/students`, { credentials: "include" })
              .then((r) => r.json())
              .catch(() => ({ success: false })),
          );
        } else {
          promises.push(Promise.resolve(null));
        }

        if (hasPerm("teachers")) {
          promises.push(
            fetch(`${API_BASE_URL}/teachers`, { credentials: "include" })
              .then((r) => r.json())
              .catch(() => ({ success: false })),
          );
        } else {
          promises.push(Promise.resolve(null));
        }

        if (hasPerm("classes")) {
          promises.push(
            fetch(`${API_BASE_URL}/classes`, { credentials: "include" })
              .then((r) => r.json())
              .catch(() => ({ success: false })),
          );
        } else {
          promises.push(Promise.resolve(null));
        }

        const [studentsData, teachersData, classesData] =
          await Promise.all(promises);

        setStaffStats({
          totalStudents:
            studentsData?.data?.length || studentsData?.students?.length || 0,
          totalTeachers:
            teachersData?.data?.length || teachersData?.teachers?.length || 0,
          totalClasses:
            classesData?.data?.length || classesData?.classes?.length || 0,
        });
      } catch (err) {
        console.error("Staff dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStaffData();
  }, []);

  // Quick action items based on permissions
  const quickActions = [
    {
      perm: "admissions",
      label: "New Admission",
      icon: UserPlus,
      href: "/admissions",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      perm: "registrations",
      label: "Registrations",
      icon: ClipboardList,
      href: "/registrations",
      color: "from-cyan-500 to-cyan-600",
    },
    {
      perm: "students",
      label: "View Students",
      icon: GraduationCap,
      href: "/students",
      color: "from-sky-500 to-sky-600",
    },
    {
      perm: "teachers",
      label: "View Teachers",
      icon: Users,
      href: "/teachers",
      color: "from-violet-500 to-violet-600",
    },
    {
      perm: "finance",
      label: "Finance",
      icon: DollarSign,
      href: "/finance",
      color: "from-amber-500 to-amber-600",
    },
    {
      perm: "classes",
      label: "Classes",
      icon: BookOpen,
      href: "/classes",
      color: "from-rose-500 to-rose-600",
    },
    {
      perm: "seat_management",
      label: "Seat Management",
      icon: Armchair,
      href: "/seat-management",
      color: "from-fuchsia-500 to-fuchsia-600",
    },
    {
      perm: "timetable",
      label: "Timetable",
      icon: CalendarDays,
      href: "/timetable",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      perm: "sessions",
      label: "Sessions",
      icon: Clock,
      href: "/sessions",
      color: "from-teal-500 to-teal-600",
    },
    {
      perm: "inquiries",
      label: "Inquiries",
      icon: ClipboardCheck,
      href: "/leads",
      color: "from-orange-500 to-orange-600",
    },
  ].filter((a) => hasPerm(a.perm));

  if (loading) {
    return (
      <DashboardLayout title="Staff Dashboard">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground">
              Loading your dashboard...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Staff Dashboard">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-md border border-border bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 p-4 sm:p-5 shadow-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2djRoNHYtNGgtNHptMC0yaDZ2Nmgtdi02eiIvPjwvZz48L2c+PC9zdmc+')] opacity-15 pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Welcome back,{" "}
            <span className="text-sky-400">{user?.fullName || "Staff"}</span>
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-0.5">
            Genius Islamian's Academy — Staff Panel
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 text-xs font-medium border border-sky-500/30">
              {perms.length} Module{perms.length !== 1 ? "s" : ""} Accessible
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-500/30">
              ● Online
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards - Permission Based */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {hasPerm("students") && (
          <Link to="/students" className="block">
            <div className="rounded-md border border-border bg-card p-3.5 shadow-none transition-colors hover:border-slate-300 cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Total Students
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-foreground mt-0.5">
                    {staffStats.totalStudents}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Enrolled students</p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-sky-100 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400 shrink-0">
                  <GraduationCap className="h-4.5 w-4.5" />
                </div>
              </div>
            </div>
          </Link>
        )}

        {hasPerm("teachers") && (
          <Link to="/teachers" className="block">
            <div className="rounded-md border border-border bg-card p-3.5 shadow-none transition-colors hover:border-slate-300 cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Total Teachers
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-foreground mt-0.5">
                    {staffStats.totalTeachers}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Active teachers</p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-violet-100 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400 shrink-0">
                  <Users className="h-4.5 w-4.5" />
                </div>
              </div>
            </div>
          </Link>
        )}

        {hasPerm("classes") && (
          <Link to="/classes" className="block">
            <div className="rounded-md border border-border bg-card p-3.5 shadow-none transition-colors hover:border-slate-300 cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Total Classes
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-foreground mt-0.5">
                    {staffStats.totalClasses}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Active classes</p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 shrink-0">
                  <BookOpen className="h-4.5 w-4.5" />
                </div>
              </div>
            </div>
          </Link>
        )}
      </div>

      {/* Quick Actions */}
      {quickActions.length > 0 && (
        <Card className="mt-4 border border-border bg-card shadow-none rounded-md">
          <CardHeader className="p-3.5 pb-2">
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base font-semibold">
              <ClipboardCheck className="h-4.5 w-4.5 text-sky-600" />
              Quick Actions
            </CardTitle>
            <CardDescription className="text-xs">
              Navigate to your assigned modules
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3.5 pt-0">
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((action) => (
                <Button
                  key={action.perm}
                  asChild
                  variant="outline"
                  className="h-10 border border-border bg-background hover:bg-muted font-medium text-xs sm:text-sm shadow-none cursor-pointer"
                >
                  <Link to={action.href}>
                    <action.icon className="mr-1.5 h-4 w-4" />
                    {action.label}
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Your Permissions */}
      <Card className="mt-4 border border-border bg-card shadow-none rounded-md">
        <CardHeader className="p-3.5 pb-2">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base font-semibold">
            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />
            Your Access Permissions
          </CardTitle>
          <CardDescription className="text-xs">
            Modules assigned to your account by the administrator
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3.5 pt-0">
          <div className="flex flex-wrap gap-1.5">
            {perms.map((p: string) => (
              <span
                key={p}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-muted text-xs font-medium text-foreground border border-border"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

// ========================================
// 🛡️ MAIN DASHBOARD COMPONENT (GATEKEEPER)
// ========================================
const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();

  // Safety guard: Wait for auth to load
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Safety guard: User must exist
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-muted-foreground">Loading user data...</p>
      </div>
    );
  }

  // 🛡️ ROLE-BASED GATEKEEPER
  if (user.role === "OWNER") {
    return <OwnerDashboard />;
  }

  if (user.role === "PARTNER") {
    return <PartnerDashboard />;
  }

  if (user.role === "TEACHER") {
    return <TeacherDashboard />;
  }

  // Fallback for STAFF or other roles
  return <StaffDashboard />;
};

export default Dashboard;
