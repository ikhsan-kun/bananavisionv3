import React, { useState, useEffect } from "react";
import {
  Camera,
  Activity,
  AlertCircle,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { getToken } from "../utils/token";
import {
  getAnalyses,
  getDashboardStats,
  getDashboardTrends,
} from "../hooks/data";

export default function DashboardPage({ setCurrentPage, user }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [stats, setStats] = useState({
    totalAnalyses: 0,
    diseasePrevalence: 0,
    healthyCount: 0,
    avgConfidence: 98.5,
  });
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [trends, setTrends] = useState([]);
  const [trendsPeriod, setTrendsPeriod] = useState("7d");

  // Fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = getToken();

        if (!token) {
          setError("Please login to view dashboard");
          return;
        }

        const [statsData, analysesData, trendsData] = await Promise.all([
          getDashboardStats(token),
          getAnalyses(token, { limit: 5 }),
          getDashboardTrends(token, trendsPeriod),
        ]);

        setStats(statsData);
        setRecentAnalyses(Array.isArray(analysesData) ? analysesData : []);
        setTrends(Array.isArray(trendsData) ? trendsData : []);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [trendsPeriod]);

  const getStatusColor = (disease) => {
    const isHealthy =
      disease?.toLowerCase() === "healthy" ||
      disease?.toLowerCase() === "sehat" ||
      disease?.toLowerCase() === "healthy leaf";
    if (isHealthy)
      return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
    return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
  };

  const getProgressColor = (disease) => {
    const isHealthy =
      disease?.toLowerCase() === "healthy" ||
      disease?.toLowerCase() === "sehat" ||
      disease?.toLowerCase() === "healthy leaf";
    return isHealthy ? "bg-green-500" : "bg-red-500";
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const maxCount =
    trends.length > 0 ? Math.max(...trends.map((t) => t.count)) : 1;

  if (loading) {
    return (
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-gray-50">
        <main className="flex-1 px-4 py-8 md:px-10 lg:px-20 max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-green-500"></div>
              <p className="mt-4 text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-gray-50">
        <main className="flex-1 px-4 py-8 md:px-10 lg:px-20 max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-900 mb-2">Error</p>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-gray-50">
      <main className="flex-1 px-4 py-8 md:px-10 lg:px-20 max-w-7xl mx-auto w-full">
        {/* Hero / Greeting Section */}
        <section className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
                Selamat Datang, {user?.name || user?.email || "Researcher"}
              </h1>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <p className="text-base font-normal">
                  Sistem berjalan normal. Tanaman Anda sehat hari ini.
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                setCurrentPage ? setCurrentPage("analyze") : null
              }
              className="btn-primary flex items-center gap-2"
            >
              <Camera className="w-5 h-5" />
              Mulai Analisis
            </button>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Total Analyses */}
          <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-green-500/30">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                  <Activity className="w-6 h-6" />
                </div>
                {stats.totalAnalyses > 0 && (
                  <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    Active
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Analyses
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.totalAnalyses}
                </p>
              </div>
            </div>
          </div>

          {/* Disease Prevalence */}
          <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-green-500/30">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-amber-100 p-2 text-amber-600">
                  <AlertCircle className="w-6 h-6" />
                </div>
                {stats.diseasePrevalence > 0 && (
                  <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                    Monitor
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Disease Prevalence
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.diseasePrevalence}%
                </p>
              </div>
            </div>
          </div>

          {/* Model Accuracy */}
          <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-green-500/30">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-green-100 p-2 text-green-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  Stable
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Model Accuracy
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.avgConfidence}%
                </p>
              </div>
            </div>
          </div>

          {/* Healthy Plants */}
          <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-green-500/30">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-green-100 p-2 text-green-600">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  Healthy
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Healthy Plants
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.healthyCount}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Trends Chart */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                  Disease Detection Trends
                </h3>
                <select
                  value={trendsPeriod}
                  onChange={(e) => setTrendsPeriod(e.target.value)}
                  className="bg-gray-50 border-none text-sm font-medium rounded-lg text-gray-600 focus:ring-green-500 cursor-pointer px-3 py-2"
                >
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </select>
              </div>

              <div className="h-64 flex items-end justify-between gap-2 md:gap-4 px-2">
                {trends.length === 0 ? (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <p>No data available for the selected period</p>
                  </div>
                ) : (
                  trends.map((item, idx) => {
                    const heightPercent =
                      maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                    return (
                      <div
                        key={idx}
                        className="flex flex-col items-center gap-2 flex-1 group cursor-pointer"
                      >
                        <div
                          className="w-full bg-green-100 rounded-t-lg relative group-hover:bg-green-200 transition-all overflow-hidden"
                          style={{
                            height: `${heightPercent}%`,
                            minHeight: item.count > 0 ? "8px" : "0",
                          }}
                        >
                          <div
                            className="absolute bottom-0 w-full bg-green-500 rounded-t-lg transition-all"
                            style={{ height: "100%" }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-600">
                          {item.day}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                  Recent Analyses
                </h3>
                <button
                  onClick={() =>
                    setCurrentPage ? setCurrentPage("history") : null
                  }
                  className="text-sm font-medium text-green-600 hover:text-green-700"
                >
                  View All
                </button>
              </div>

              {recentAnalyses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Belum ada riwayat analisis</p>
                  <p className="text-sm mt-1">
                    Mulai scan tanaman Anda sekarang!
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-gray-100">
                      <tr>
                        <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider pb-4">
                          Image
                        </th>
                        <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider pb-4">
                          Status
                        </th>
                        <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider pb-4">
                          Confidence
                        </th>
                        <th className="text-right text-xs font-semibold text-gray-600 uppercase tracking-wider pb-4">
                          Time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {recentAnalyses.map((item) => (
                        <tr
                          key={item.id}
                          className="group hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-4 pr-4">
                            <div className="flex items-center gap-3">
                              {item.imageUrl ? (
                                <img
                                  src={item.imageUrl}
                                  alt={item.detectedDisease}
                                  className="h-10 w-10 rounded-lg object-cover border border-gray-200"
                                />
                              ) : (
                                <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-lg border border-gray-200 ${
                                  item.detectedDisease?.toLowerCase().includes("healthy")
                                    ? "bg-green-50"
                                    : "bg-red-50"
                                }`}>
                                  {item.detectedDisease?.toLowerCase().includes("healthy") ? "🍃" : "🍂"}
                                </div>
                              )}
                              <span className="font-medium text-sm text-gray-900">
                                Analysis #{item.id.slice(-6)}
                              </span>
                            </div>
                          </td>
                          <td className="py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(item.detectedDisease)}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  item.detectedDisease?.toLowerCase() ===
                                    "healthy" ||
                                  item.detectedDisease?.toLowerCase() ===
                                    "sehat" ||
                                  item.detectedDisease?.toLowerCase() ===
                                    "healthy leaf"
                                    ? "bg-green-600"
                                    : "bg-red-600"
                                }`}
                              ></span>
                              {item.detectedDisease}
                            </span>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-16 rounded-full bg-gray-200 overflow-hidden">
                                <div
                                  className={`h-full ${getProgressColor(item.detectedDisease)}`}
                                  style={{ width: `${item.confidence}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-bold text-gray-900">
                                {item.confidence.toFixed(0)}%
                              </span>
                            </div>
                          </td>
                          <td className="py-4 text-right text-sm text-gray-600">
                            {formatTime(item.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-8">
            {/* Quick Actions */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 h-fit">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() =>
                    setCurrentPage ? setCurrentPage("analyze") : null
                  }
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all group text-left"
                >
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                      New Diagnosis
                    </p>
                    <p className="text-xs text-gray-600">
                      Analyze a fresh leaf sample
                    </p>
                  </div>
                </button>

                <button
                  onClick={() =>
                    setCurrentPage ? setCurrentPage("diseases") : null
                  }
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all group text-left"
                >
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      Disease Library
                    </p>
                    <p className="text-xs text-gray-600">
                      Learn about symptoms
                    </p>
                  </div>
                </button>

                <button
                  onClick={() =>
                    setCurrentPage ? setCurrentPage("history") : null
                  }
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all group text-left"
                >
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                      View History
                    </p>
                    <p className="text-xs text-gray-600">See all analyses</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200 bg-white py-6 px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600">
            © 2024 BananaVision AI. All rights reserved.
          </p>
          <div className="flex gap-6">
            <button className="text-sm text-gray-600 hover:text-green-600 transition-colors">
              Privacy Policy
            </button>
            <button className="text-sm text-gray-600 hover:text-green-600 transition-colors">
              Terms of Service
            </button>
            <button className="text-sm text-gray-600 hover:text-green-600 transition-colors">
              Support
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
