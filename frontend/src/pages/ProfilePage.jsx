import React, { useState, useEffect } from "react";
import { LogOut, Edit, Bell, Shield, ChevronRight } from "lucide-react";
import { getAnalyses } from "../hooks/data";
import { getToken } from "../utils/token";

export default function ProfilePage({ user, handleLogout }) {
  const [historyData, setHistoryData] = useState([]);
  
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = getToken();
        if (token) {
          const data = await getAnalyses(token, { limit: 5 });
          setHistoryData(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to fetch history:", err);
      }
    };
    fetchHistory();
  }, []);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatus = (disease) => {
    const isHealthy =
      disease?.toLowerCase() === "healthy" ||
      disease?.toLowerCase() === "sehat" ||
      disease?.toLowerCase() === "healthy leaf";
    return isHealthy ? "healthy" : "warning";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Profil</h1>
            <p className="text-gray-600">
              Kelola informasi akun dan preferensi Anda
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-1 bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col items-center text-center">
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || user?.email || 'User')}&background=10b981&color=fff`}
                alt={user?.name || 'User'}
                className="w-28 h-28 rounded-full shadow-md mb-4"
              />
              <div className="font-bold text-lg text-gray-800">
                {user?.name || 'User'}
              </div>
              <div className="text-sm text-gray-500 mb-4">{user?.email || ''}</div>

              <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-lg hover:shadow transition">
                <Edit className="w-4 h-4 text-gray-700" />
                Edit Profil
              </button>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Analisis Terbaru</div>
                  <div className="font-semibold text-gray-800">
                    {historyData.length}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Status</div>
                  <div className="font-semibold text-green-600">Aktif</div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Pengaturan Akun
            </h2>

            <div className="grid gap-3">
              <button className="w-full flex items-center justify-between gap-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-700" />
                  <div>
                    <div className="font-medium text-gray-800">Notifikasi</div>
                    <div className="text-sm text-gray-500">
                      Kelola notifikasi email dan aplikasi
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button className="w-full flex items-center justify-between gap-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-gray-700" />
                  <div>
                    <div className="font-medium text-gray-800">
                      Privasi & Keamanan
                    </div>
                    <div className="text-sm text-gray-500">
                      Atur kata sandi dan opsi keamanan
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <div className="border-t mt-2 pt-3" />

              <div className="text-sm text-gray-600">Tindakan Akun</div>

              <button
                onClick={handleLogout}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition"
              >
                <LogOut className="w-4 h-4" />
                Keluar
              </button>

              <button className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-100 text-sm hover:bg-gray-50 transition text-red-600">
                Hapus Akun
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Riwayat Terbaru
          </h3>
          <div className="space-y-3">
            {historyData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Belum ada riwayat analisis</p>
              </div>
            ) : (
              historyData.map((h) => (
                <div
                  key={h.id}
                  className="flex items-center justify-between gap-4 p-3 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      {h.imageUrl ? (
                        <img
                          src={h.imageUrl}
                          alt={h.detectedDisease}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center text-lg ${
                          getStatus(h.detectedDisease) === "healthy" ? "bg-green-50" : "bg-red-50"
                        }`}>
                          {getStatus(h.detectedDisease) === "healthy" ? "🍃" : "🍂"}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{h.detectedDisease}</div>
                      <div className="text-sm text-gray-500">{formatTime(h.createdAt)}</div>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatus(h.detectedDisease) === "healthy"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                      }`}
                  >
                    {h.confidence.toFixed(0)}%
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="py-12" />
      </div>
    </div>
  );
}
