import { useState, useEffect } from "react";
import { getAdminDiseases, createAdminDisease, updateAdminDisease, deleteAdminDisease, toggleAdminDisease } from "../../hooks/data";
import LoadingSpinner from "../../components/LoadingSpinner";
import { AlertDialog } from "../../components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter } from "../../components/ui/dialog";
import { useToast } from "../../hooks/useToast";
import { Plus, Edit2, Trash2, Eye, EyeOff, Check, AlertCircle, Leaf, Search, Sparkles } from "lucide-react";

export default function AdminDiseasesPage({ token }) {
  const { success: toastSuccess, error: toastError, warning: toastWarning } = useToast();

  const [diseases, setDiseases] = useState([]);
  const [filteredDiseases, setFilteredDiseases] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [formData, setFormData] = useState({
    name: "", category: "Jamur", severity: "Sedang",
    description: "", symptoms: "", prevention: "", treatment: "", isActive: true,
  });
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  // Dialogs
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, name: "" });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toggleDialog, setToggleDialog] = useState({ open: false, id: null, name: "", currentStatus: false });
  const [toggleLoading, setToggleLoading] = useState(false);

  useEffect(() => { loadDiseases(); }, [token]);

  useEffect(() => {
    if (!diseases) return;
    const filtered = diseases.filter((d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.severity.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDiseases(filtered);
  }, [searchQuery, diseases]);

  async function loadDiseases() {
    try {
      setLoading(true);
      const data = await getAdminDiseases(token);
      setDiseases(data ?? []);
      setFilteredDiseases(data ?? []);
    } catch (err) {
      setError(err.message || "Gagal memuat daftar penyakit");
    } finally {
      setLoading(false);
    }
  }

  const openCreateModal = () => {
    setFormData({ name: "", category: "Jamur", severity: "Sedang", description: "", symptoms: "", prevention: "", treatment: "", isActive: true });
    setFormError(null); setModalType("create"); setModalOpen(true);
  };

  const openEditModal = (d) => {
    setSelectedDisease(d);
    setFormData({
      name: d.name, category: d.category, severity: d.severity, description: d.description,
      symptoms: d.symptoms ? d.symptoms.join("\n") : "",
      prevention: d.prevention ? d.prevention.join("\n") : "",
      treatment: d.treatment ? d.treatment.join("\n") : "",
      isActive: d.isActive,
    });
    setFormError(null); setModalType("edit"); setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.category || !formData.severity) {
      setFormError("Mohon isi semua bidang utama yang wajib!"); return;
    }
    const cleanArray = (str) => str.split("\n").map((s) => s.trim()).filter(Boolean);
    const payload = { ...formData, symptoms: cleanArray(formData.symptoms), prevention: cleanArray(formData.prevention), treatment: cleanArray(formData.treatment) };
    try {
      setFormSubmitLoading(true); setFormError(null);
      if (modalType === "create") {
        await createAdminDisease(token, payload);
        toastSuccess(`Penyakit "${formData.name}" berhasil ditambahkan!`);
      } else {
        await updateAdminDisease(token, selectedDisease.id, payload);
        toastSuccess(`Perubahan pada "${formData.name}" berhasil disimpan!`);
      }
      setModalOpen(false); loadDiseases();
    } catch (err) {
      setFormError(err.message || "Gagal menyimpan data penyakit");
    } finally {
      setFormSubmitLoading(false);
    }
  };

  const requestToggle = (d) => setToggleDialog({ open: true, id: d.id, name: d.name, currentStatus: d.isActive });
  const confirmToggle = async () => {
    const { id, name, currentStatus } = toggleDialog;
    try {
      setToggleLoading(true);
      await toggleAdminDisease(token, id, !currentStatus);
      setDiseases((prev) => prev.map((d) => (d.id === id ? { ...d, isActive: !currentStatus } : d)));
      toastSuccess(`"${name}" berhasil ${!currentStatus ? "diaktifkan" : "dinonaktifkan"}.`);
    } catch (err) { toastError("Gagal memperbarui status: " + err.message); }
    finally { setToggleLoading(false); setToggleDialog({ open: false, id: null, name: "", currentStatus: false }); }
  };

  const requestDelete = (d) => setDeleteDialog({ open: true, id: d.id, name: d.name });
  const confirmDelete = async () => {
    const { id, name } = deleteDialog;
    try {
      setDeleteLoading(true);
      await deleteAdminDisease(token, id, false);
      setDiseases((prev) => prev.filter((d) => d.id !== id));
      toastWarning(`Penyakit "${name}" telah dihapus.`);
    } catch (err) { toastError("Gagal menghapus: " + err.message); }
    finally { setDeleteLoading(false); setDeleteDialog({ open: false, id: null, name: "" }); }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <LoadingSpinner size="lg" color="white" />
        <p className="text-gray-500 text-sm">Memuat data katalog penyakit...</p>
      </div>
    );
  }

  const inputCls = "w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all text-sm admin-select";
  const labelCls = "text-xs font-bold text-gray-500 uppercase tracking-wider";

  return (
    <div className="flex flex-col gap-6 sm:gap-8 animate-fade-in pb-12">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Database Model
          </p>
          <h1 className="text-3xl font-extrabold text-white tracking-tight leading-none">Kelola Penyakit</h1>
          <p className="text-gray-500 text-sm mt-2">Tambahkan, ubah, atau hapus jenis penyakit yang didukung sistem BananaVision.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold px-5 py-3 rounded-xl text-sm transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98] w-full sm:w-auto justify-center"
        >
          <Plus className="w-4.5 h-4.5" />
          Tambah Penyakit
        </button>
      </div>

      {/* ── Search & Filter Bar ── */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari penyakit berdasarkan nama, kategori, keparahan..."
          className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/25 transition-all text-sm"
        />
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-center max-w-lg mx-auto">
          <p className="text-red-400 font-medium mb-3">{error}</p>
          <button onClick={loadDiseases} className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 text-xs px-4 py-2 rounded-lg font-medium transition-all">
            Coba Lagi
          </button>
        </div>
      )}

      {/* ── Table Container ── */}
      {!error && (
        <div className="bg-white/[0.015] border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
          {filteredDiseases.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/5">
                <Leaf className="w-6 h-6 text-gray-600 animate-pulse" />
              </div>
              <p className="text-gray-500 text-sm">Tidak menemukan kecocokan data penyakit.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <th className="px-6 py-4.5 text-gray-400 text-xs font-bold uppercase tracking-wider">Nama Penyakit</th>
                    <th className="px-6 py-4.5 text-gray-400 text-xs font-bold uppercase tracking-wider">Kategori</th>
                    <th className="px-6 py-4.5 text-gray-400 text-xs font-bold uppercase tracking-wider">Tingkat Keparahan</th>
                    <th className="px-6 py-4.5 text-gray-400 text-xs font-bold uppercase tracking-wider">Status di Portal</th>
                    <th className="px-6 py-4.5 text-gray-400 text-xs font-bold uppercase tracking-wider text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredDiseases.map((d) => (
                    <tr key={d.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4.5 font-bold text-white text-sm whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <span className="w-1 h-4 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span>{d.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <span className="bg-white/5 border border-white/5 text-gray-300 text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                          {d.category}
                        </span>
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase border ${
                          d.severity === "Berat"
                            ? "bg-red-500/10 border-red-500/20 text-red-400"
                            : d.severity === "Sedang"
                            ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                            : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        }`}>
                          {d.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <button
                          onClick={() => requestToggle(d)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all hover:scale-105 active:scale-95 ${
                            d.isActive
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                              : "bg-white/5 border-white/5 text-gray-500 hover:bg-white/10"
                          }`}
                        >
                          {d.isActive ? (
                            <>
                              <Eye className="w-3.5 h-3.5" />
                              <span>Tampil Publik</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>Tersembunyi</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2.5">
                          <button
                            onClick={() => openEditModal(d)}
                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-gray-300 hover:text-white transition-all active:scale-95"
                            title="Edit Penyakit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => requestDelete(d)}
                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/10 hover:border-red-500/20 text-red-400 hover:text-red-300 transition-all active:scale-95"
                            title="Hapus Penyakit"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── CREATE / EDIT MODAL ── */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl bg-[#0d1a14] border-white/10">
          <DialogHeader className="border-white/8">
            <DialogTitle className="text-white">
              {modalType === "create" ? "Tambah Data Penyakit Baru" : `Edit: ${selectedDisease?.name}`}
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              {modalType === "create"
                ? "Isi formulir untuk menambahkan penyakit baru ke katalog sistem."
                : "Perbarui informasi penyakit yang sudah ada di katalog."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
            <DialogBody className="flex flex-col gap-5 bg-[#0d1a14]">
              {formError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-start gap-2 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" /><span>{formError}</span>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls}>Nama Penyakit *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                    placeholder="Nama ilmiah/umum" className={inputCls} required />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls}>Kategori *</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className={inputCls}>
                    <option value="Jamur">Jamur</option>
                    <option value="Bakteri">Bakteri</option>
                    <option value="Virus">Virus</option>
                    <option value="Hama">Hama</option>
                    <option value="Sehat">Sehat</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls}>Keparahan *</label>
                  <select name="severity" value={formData.severity} onChange={handleInputChange} className={inputCls}>
                    <option value="Ringan">Ringan (Mild)</option>
                    <option value="Sedang">Sedang (Moderate)</option>
                    <option value="Berat">Berat (Severe)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Deskripsi *</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange}
                  placeholder="Berikan deskripsi lengkap mengenai penyakit ini..." rows={3}
                  className={`${inputCls} resize-none`} required />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-baseline">
                  <label className={labelCls}>Gejala-Gejala</label>
                  <span className="text-[10px] text-gray-600">Satu gejala per baris</span>
                </div>
                <textarea name="symptoms" value={formData.symptoms} onChange={handleInputChange}
                  placeholder={"Garis-garis hitam di pelepah daun\nDaun layu menguning..."} rows={3}
                  className={`${inputCls} font-mono text-xs resize-none`} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-baseline">
                    <label className={labelCls}>Langkah Pencegahan</label>
                    <span className="text-[10px] text-gray-600">Per baris</span>
                  </div>
                  <textarea name="prevention" value={formData.prevention} onChange={handleInputChange}
                    placeholder={"Gunakan varietas tahan jamur\nAtur drainase air..."} rows={3}
                    className={`${inputCls} font-mono text-xs resize-none`} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-baseline">
                    <label className={labelCls}>Penanganan & Terapi</label>
                    <span className="text-[10px] text-gray-600">Per baris</span>
                  </div>
                  <textarea name="treatment" value={formData.treatment} onChange={handleInputChange}
                    placeholder={"Pangkas bagian yang terinfeksi\nSemprot fungisida..."} rows={3}
                    className={`${inputCls} font-mono text-xs resize-none`} />
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/3 border border-white/5 p-4 rounded-xl">
                <input type="checkbox" name="isActive" id="isActiveForm" checked={formData.isActive} onChange={handleInputChange}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer" />
                <label htmlFor="isActiveForm" className="text-sm font-medium text-gray-400 cursor-pointer leading-relaxed">
                  Aktifkan di portal publik — dapat dicocokkan dengan deteksi AI
                </label>
              </div>
            </DialogBody>

            <DialogFooter className="border-white/8 bg-[#0d1a14]">
              <button type="button" onClick={() => setModalOpen(false)} disabled={formSubmitLoading}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all">
                Batal
              </button>
              <button type="submit" disabled={formSubmitLoading}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold px-5 py-2.5 rounded-xl text-sm transition-all disabled:opacity-50 active:scale-[0.98]">
                {formSubmitLoading ? (
                  <><span className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" /><span>Menyimpan…</span></>
                ) : (
                  <><Check className="w-4 h-4" /><span>{modalType === "create" ? "Tambahkan Penyakit" : "Simpan Perubahan"}</span></>
                )}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── AlertDialogs ── */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(v) => !deleteLoading && setDeleteDialog((p) => ({ ...p, open: v }))}
        variant="destructive"
        title="Hapus Penyakit?"
        description={`"${deleteDialog.name}" akan dihapus dari sistem (soft delete). Anda masih dapat memulihkannya dari database jika diperlukan.`}
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
        onConfirm={confirmDelete}
        loading={deleteLoading}
      />
      <AlertDialog
        open={toggleDialog.open}
        onOpenChange={(v) => !toggleLoading && setToggleDialog((p) => ({ ...p, open: v }))}
        variant={toggleDialog.currentStatus ? "warning" : "success"}
        title={toggleDialog.currentStatus ? "Non-aktifkan Penyakit?" : "Aktifkan Penyakit?"}
        description={
          toggleDialog.currentStatus
            ? `"${toggleDialog.name}" akan disembunyikan dari portal publik dan tidak dapat dideteksi AI.`
            : `"${toggleDialog.name}" akan tampil di portal publik dan siap dideteksi AI.`
        }
        confirmLabel={toggleDialog.currentStatus ? "Ya, Non-aktifkan" : "Ya, Aktifkan"}
        cancelLabel="Batal"
        onConfirm={confirmToggle}
        loading={toggleLoading}
      />
    </div>
  );
}
