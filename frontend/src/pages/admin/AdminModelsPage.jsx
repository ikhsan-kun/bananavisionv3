import { useState, useEffect, useRef } from "react";
import { getAdminModels, activateAdminModel, deleteAdminModel, uploadAdminModel, getAdminModelsHealth } from "../../hooks/data";
import LoadingSpinner from "../../components/LoadingSpinner";
import { AlertDialog } from "../../components/ui/alert-dialog";
import { useToast } from "../../hooks/useToast";
import { 
  Upload, Trash2, CheckCircle, AlertTriangle, Activity, Database, Check, 
  CloudUpload, FileCheck2, Cpu, Wifi, WifiOff, Sparkles, RefreshCw 
} from "lucide-react";

export default function AdminModelsPage({ token }) {
  const { success: toastSuccess, error: toastError, info: toastInfo } = useToast();

  const [models, setModels] = useState([]);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [name, setName] = useState("");
  const [modelType, setModelType] = useState("mobilenetv2");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const [activateDialog, setActivateDialog] = useState({ open: false, id: null, name: "" });
  const [activateLoading, setActivateLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, name: "" });
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => { loadData(); }, [token]);

  async function loadData(isSilent = false) {
    try {
      if (!isSilent) setLoading(true);
      else setRefreshing(true);
      setError(null);
      const modelsData = await getAdminModels(token);
      setModels(modelsData ?? []);
      try {
        const healthData = await getAdminModelsHealth(token);
        setHealth(healthData);
      } catch (e) {
        setHealth({ online: false, message: e.message });
      }
    } catch (err) {
      setError(err.message || "Gagal memuat sistem model");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      if (!f.name.endsWith(".keras")) {
        setUploadError("Hanya file model dengan ekstensi .keras yang diperbolehkan!");
        setFile(null); return;
      }
      setFile(f); setUploadError(null);
      if (!name) setName(f.name.replace(".keras", "").replace(/_/g, " "));
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file || !name || !modelType) { setUploadError("Semua bidang formulir wajib diisi!"); return; }
    const formData = new FormData();
    formData.append("modelFile", file); formData.append("name", name); formData.append("modelType", modelType);
    try {
      setUploading(true); setUploadError(null); setUploadSuccess(false);
      await uploadAdminModel(token, formData);
      setUploadSuccess(true); setName(""); setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      toastSuccess(`Model "${name}" berhasil diunggah!`);
      const updated = await getAdminModels(token);
      setModels(updated);
    } catch (err) {
      setUploadError(err.message || "Gagal mengunggah file model");
    } finally {
      setUploading(false);
    }
  };

  const requestActivate = (model) => setActivateDialog({ open: true, id: model.id, name: model.name });
  const confirmActivate = async () => {
    const { id, name: n } = activateDialog;
    try {
      setActivateLoading(true);
      await activateAdminModel(token, id);
      toastSuccess(`Model "${n}" berhasil diaktifkan!`);
      await loadData(true);
    } catch (err) { toastError("Gagal mengaktifkan model: " + err.message); }
    finally { setActivateLoading(false); setActivateDialog({ open: false, id: null, name: "" }); }
  };

  const requestDelete = (model) => setDeleteDialog({ open: true, id: model.id, name: model.name });
  const confirmDelete = async () => {
    const { id, name: n } = deleteDialog;
    try {
      setDeleteLoading(true);
      await deleteAdminModel(token, id);
      setModels((prev) => prev.filter((m) => m.id !== id));
      toastInfo(`Model "${n}" telah dihapus dari sistem.`);
    } catch (err) { toastError("Gagal menghapus model: " + err.message); }
    finally { setDeleteLoading(false); setDeleteDialog({ open: false, id: null, name: "" }); }
  };

  const formatBytes = (bytes, d = 2) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024, s = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(d)) + " " + s[i];
  };

  if (loading && models.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <LoadingSpinner size="lg" color="white" />
        <p className="text-gray-500 text-sm">Menghubungkan ke microservice model AI...</p>
      </div>
    );
  }

  const activeModel = models.find((m) => m.isActive);
  const inputCls = "w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all text-sm admin-select";

  return (
    <div className="flex flex-col gap-6 sm:gap-8 animate-fade-in pb-12">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Core AI
          </p>
          <h1 className="text-3xl font-extrabold text-white tracking-tight leading-none">Sistem Model AI</h1>
          <p className="text-gray-500 text-sm mt-2">
            Unggah bobot model deep learning (.keras) dan ganti model aktif untuk klasifikasi penyakit tanaman pisang.
          </p>
        </div>

        <button
          onClick={() => loadData(true)}
          disabled={refreshing}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 active:scale-[0.97]"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-emerald-400' : ''}`} />
          <span>{refreshing ? 'Memperbarui...' : 'Perbarui Status'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">

        {/* ─── Left: AI Server & Table List ─── */}
        <div className="lg:col-span-8 flex flex-col gap-6 sm:gap-8">

          {/* Server Health Card */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 sm:p-6 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/15 border border-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Status AI Server</h2>
                  <p className="text-gray-500 text-xs mt-0.5">Koneksi backend ke FastAPI microservice</p>
                </div>
              </div>
              <span className={`self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-black tracking-wider ${
                health?.online
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                  : "bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse"
              }`}>
                {health?.online ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                {health?.online ? "FASTAPI ACTIVE" : "FASTAPI OFFLINE"}
              </span>
            </div>

            {health?.online ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-xl">
                {[
                  { label: "Model Aktif", val: activeModel?.name || "Bawaan Sistem", color: "text-white" },
                  { label: "Arsitektur", val: health.details?.model_type || "Unknown", color: "text-emerald-400 uppercase" },
                  { label: "Gatekeeper ImageNet", val: health.details?.gatekeeper_loaded ? "READY" : "DISABLED", color: "text-gray-400" },
                ].map(({ label, val, color }) => (
                  <div key={label}>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">{label}</p>
                    <p className={`font-bold mt-1.5 text-sm ${color}`}>{val}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-start gap-3 bg-red-500/5 border border-red-500/10 p-4 rounded-xl text-red-400 text-sm">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Koneksi AI Server Gagal</p>
                  <p className="text-xs text-red-500/60 mt-1 leading-relaxed">
                    Pastikan server Python (<code className="font-mono bg-black/30 px-1 py-0.5 rounded">python/server.py</code>) sudah berjalan pada port yang tepat dan periksa konfigurasi URL pada backend.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Model Weights List (TABLE FORMAT) */}
          <div className="bg-white/[0.015] border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
            <div className="px-6 py-5 border-b border-white/5 bg-white/[0.01] flex items-center gap-2.5">
              <Database className="w-4.5 h-4.5 text-gray-500" />
              <h2 className="text-base font-bold text-white">Daftar Bobot Model (.keras)</h2>
            </div>

            {models.length === 0 ? (
              <div className="flex flex-col items-center py-20 gap-3">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/5">
                  <Cpu className="w-6 h-6 text-gray-600 animate-pulse" />
                </div>
                <p className="text-gray-500 text-sm">Belum ada file bobot model terdeteksi di server.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.01]">
                      <th className="px-6 py-4 text-gray-400 text-xs font-bold uppercase tracking-wider">Nama Model</th>
                      <th className="px-6 py-4 text-gray-400 text-xs font-bold uppercase tracking-wider">Nama File</th>
                      <th className="px-6 py-4 text-gray-400 text-xs font-bold uppercase tracking-wider">Arsitektur</th>
                      <th className="px-6 py-4 text-gray-400 text-xs font-bold uppercase tracking-wider">Ukuran</th>
                      <th className="px-6 py-4 text-gray-400 text-xs font-bold uppercase tracking-wider">Tanggal Unggah</th>
                      <th className="px-6 py-4 text-gray-400 text-xs font-bold uppercase tracking-wider text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {models.map((model) => (
                      <tr 
                        key={model.id} 
                        className={`hover:bg-white/[0.02] transition-colors group ${
                          model.isActive ? "bg-emerald-500/[0.02]" : ""
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <span className="font-bold text-white text-sm">{model.name}</span>
                            {model.isActive && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-black bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md uppercase tracking-wide">
                                <Check className="w-2.5 h-2.5" /> Aktif
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-xs font-mono text-gray-500 block max-w-[150px] truncate" title={model.filename}>
                            {model.filename}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="bg-white/5 border border-white/5 text-gray-300 text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider">
                            {model.modelType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400">
                          {formatBytes(model.fileSize)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                          {new Date(model.uploadedAt).toLocaleDateString("id-ID", {
                            day: "2-digit", month: "short", year: "numeric"
                          })}
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2.5">
                            {!model.isActive ? (
                              <>
                                <button
                                  onClick={() => requestActivate(model)}
                                  className="flex items-center gap-1 bg-white/5 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/20 text-gray-400 hover:text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-xl transition-all active:scale-95"
                                >
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  <span>Gunakan</span>
                                </button>
                                <button
                                  onClick={() => requestDelete(model)}
                                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/10 hover:border-red-500/20 text-red-400 hover:text-red-300 transition-all active:scale-95"
                                  title="Hapus Model"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            ) : (
                              <span className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-xl cursor-default">
                                <Check className="w-3.5 h-3.5" />
                                <span>Digunakan</span>
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ─── Right: Upload Form ─── */}
        <div className="lg:col-span-4">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 sm:p-6 lg:sticky lg:top-6 backdrop-blur-sm shadow-xl">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <CloudUpload className="w-4.5 h-4.5 text-gray-500" />
              Unggah File Model
            </h2>

            <form onSubmit={handleUploadSubmit} className="flex flex-col gap-4">
              {uploadError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" /><span>{uploadError}</span>
                </div>
              )}
              {uploadSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-xs flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 flex-shrink-0" /><span>Model berhasil diunggah!</span>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Tampilan</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: MobileNetV2 Epoch 150" className={inputCls} required />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Arsitektur Dasar</label>
                <select value={modelType} onChange={(e) => setModelType(e.target.value)} className={inputCls}>
                  <option value="mobilenetv2">MobileNetV2 (Default)</option>
                  <option value="resnet50">ResNet50</option>
                  <option value="custom">Arsitektur Kustom</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">File Model (.keras)</label>
                <input
                  type="file" accept=".keras" onChange={handleFileChange} ref={fileInputRef}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 text-xs
                    file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-semibold
                    file:bg-emerald-500/10 file:text-emerald-400 hover:file:bg-emerald-500/20 file:cursor-pointer cursor-pointer
                    focus:outline-none focus:border-emerald-500/50 transition-all"
                  required
                />
                <span className="text-[9px] text-gray-600 leading-normal">Maksimum ukuran file: 250MB. Hanya format file ekstensi .keras.</span>
              </div>

              {uploading && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-gray-500">Mengunggah file…</span>
                    <span className="text-emerald-400 animate-pulse">Mohon tunggu</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full animate-pulse w-3/4 animate-pulse-slow" />
                  </div>
                  <p className="text-[9px] text-gray-600 leading-relaxed">Jangan keluar dari panel atau menutup halaman selama proses upload.</p>
                </div>
              )}

              <button
                type="submit"
                disabled={uploading || !file}
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold rounded-xl py-3 mt-1 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-emerald-500/25 active:scale-[0.98]"
              >
                {uploading ? (
                  <><span className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" /><span>Mengunggah…</span></>
                ) : (
                  <><Upload className="w-4 h-4" /><span>Unggah File Model</span></>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Dialogs ── */}
      <AlertDialog
        open={activateDialog.open}
        onOpenChange={(v) => !activateLoading && setActivateDialog((p) => ({ ...p, open: v }))}
        variant="success"
        title="Aktifkan Model AI?"
        description={`Model "${activateDialog.name}" akan langsung digunakan oleh sistem deteksi AI untuk klasifikasi gambar baru.`}
        confirmLabel="Ya, Aktifkan Model"
        cancelLabel="Batal"
        onConfirm={confirmActivate}
        loading={activateLoading}
      />
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(v) => !deleteLoading && setDeleteDialog((p) => ({ ...p, open: v }))}
        variant="destructive"
        title="Hapus Model Ini?"
        description={`Model "${deleteDialog.name}" akan dihapus permanen dari server. File weights model akan dihapus selamanya.`}
        confirmLabel="Ya, Hapus Permanen"
        cancelLabel="Batal"
        onConfirm={confirmDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
