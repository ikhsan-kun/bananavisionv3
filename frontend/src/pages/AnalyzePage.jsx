import React, { useRef, useState, useEffect } from "react";
import {
  Upload,
  Camera,
  X,
  Activity,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../utils/token";
import { submitFeedback } from "../hooks/data";

export default function AnalyzePage({
  selectedImage,
  setSelectedImage,
  analyzing,
  result,
  handleImageSelect,
  handleAnalyze,
  setCurrentPage,
}) {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [localProgress, setLocalProgress] = useState(0);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    let id;
    if (analyzing) {
      setLocalProgress(10);
      id = setInterval(() => {
        setLocalProgress((p) => Math.min(95, p + Math.random() * 10));
      }, 300);
    } else {
      setLocalProgress(0);
    }
    return () => clearInterval(id);
  }, [analyzing]);

  const handleFeedbackSubmit = async () => {
    if (feedbackRating === 0) return;
    try {
      const token = getToken();
      await submitFeedback(token, feedbackText, feedbackRating);
      setFeedbackSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Gagal mengirim feedback");
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setFeedbackSubmitted(false);
        setFeedbackRating(0);
        setFeedbackText("");
      };
      reader.readAsDataURL(file);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleSelectImageWrapper = (e) => {
    handleImageSelect(e);
    setFeedbackSubmitted(false);
    setFeedbackRating(0);
    setFeedbackText("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Analisis Penyakit
          </h1>
          <p className="text-gray-600">
            Upload atau foto gambar daun pisang untuk deteksi
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-12">
          {!selectedImage ? (
            <div>
              <div
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={() => setDragOver(false)}
                className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
                  dragOver
                    ? "border-green-400 bg-green-50/40"
                    : "border-gray-300"
                }`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") fileInputRef.current?.click();
                }}
                aria-label="Drop image here or click to select"
              >
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Tarik & Lepas Gambar di Sini
                </h3>
                <p className="text-gray-600 mb-6">
                  Atau pilih file dari perangkat Anda
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleSelectImageWrapper}
                    className="hidden"
                    aria-label="File input untuk upload gambar"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-primary flex items-center gap-2 justify-center"
                  >
                    <Upload className="w-5 h-5" />
                    Pilih File
                  </button>

                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleSelectImageWrapper}
                    className="hidden"
                    aria-label="Camera input untuk capture gambar"
                  />
                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    className="btn-secondary flex items-center gap-2 justify-center"
                  >
                    <Camera className="w-5 h-5" />
                    Buka Kamera
                  </button>
                </div>

                <div className="mt-4 text-sm text-gray-500">
                  Mendukung JPG, PNG. Seret gambar di atas untuk unggah cepat.
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative rounded-2xl overflow-hidden border border-gray-100">
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="w-full max-h-96 object-contain bg-gray-100"
                />
                <button
                  onClick={() => {
                    setSelectedImage(null);
                  }}
                  className="absolute top-4 right-4 bg-white/90 text-gray-800 p-2 rounded-full hover:scale-105 transition-shadow shadow"
                  aria-label="Hapus gambar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!result && !analyzing && (
                <div className="flex gap-3">
                  <button
                    onClick={handleAnalyze}
                    className="btn-primary flex-1 text-lg"
                  >
                    Analisis Sekarang
                  </button>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="btn-secondary w-40"
                  >
                    Pilih Ulang
                  </button>
                </div>
              )}

              {analyzing && (
                <div className="text-center py-6">
                  <div className="mx-auto w-48">
                    <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-green-500 transition-all"
                        style={{ width: `${localProgress}%` }}
                      />
                    </div>
                  </div>
                  <div className="mt-4 text-gray-700 font-semibold">
                    Menganalisis…
                  </div>
                  <div className="text-sm text-gray-500">
                    Proses dapat memakan beberapa detik
                  </div>
                </div>
              )}

              {result && (
                <div
                  className={`rounded-2xl p-6 ${
                    result.severity === "healthy"
                      ? "bg-green-50 border-2 border-green-200"
                      : result.severity === "warning"
                        ? "bg-yellow-50 border-2 border-yellow-200"
                        : result.severity === "error"
                          ? "bg-red-50 border-2 border-red-200"
                          : "bg-red-50 border-2 border-red-200"
                  }`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        result.severity === "healthy"
                          ? "bg-green-500"
                          : result.severity === "warning"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    >
                      {result.severity === "healthy" ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : result.severity === "error" ? (
                        <AlertCircle className="w-6 h-6 text-white" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        {result.disease}
                      </h3>

                      {result.severity === "error" ? (
                        <div className="bg-white rounded-xl p-4 mb-4">
                          <p className="text-red-700">{result.message}</p>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="text-sm text-gray-600">
                              Tingkat Kepercayaan:
                            </div>
                            <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  result.severity === "healthy"
                                    ? "bg-green-500"
                                    : result.severity === "warning"
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                }`}
                                style={{ width: `${result.confidence}%` }}
                              />
                            </div>
                            <div className="font-bold text-gray-800">
                              {result.confidence}%
                            </div>
                          </div>

                          {result.severity !== "healthy" && (
                            <div className="bg-white rounded-xl p-4 mb-4">
                              <h4 className="font-semibold text-gray-800 mb-2">
                                Rekomendasi:
                              </h4>
                              <ul className="space-y-1 text-sm text-gray-700">
                                <li>• Isolasi tanaman yang terinfeksi</li>
                                <li>• Konsultasi dengan ahli pertanian</li>
                                <li>• Terapkan fungisida yang sesuai</li>
                                <li>• Tingkatkan sanitasi kebun</li>
                              </ul>
                            </div>
                          )}

                          {result.predictions &&
                            result.predictions.length > 0 && (
                              <div className="bg-white rounded-xl p-4 mb-4">
                                <h4 className="font-semibold text-gray-800 mb-2">
                                  Prediksi Lainnya:
                                </h4>
                                <div className="space-y-2">
                                  {result.predictions
                                    .slice(0, 3)
                                    .map((pred, index) => (
                                      <div
                                        key={index}
                                        className="flex justify-between items-center text-sm"
                                      >
                                        <span className="text-gray-700">
                                          {pred.disease}
                                        </span>
                                        <span className="font-medium text-gray-800">
                                          {pred.confidence}%
                                        </span>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}

                          <div className="bg-white rounded-xl p-4 mb-4">
                            <h4 className="font-semibold text-gray-800 mb-2">
                              Summary Analisis:
                            </h4>
                            <div className="text-sm text-gray-700 space-y-1">
                              <p>
                                <strong>Penyakit Terdeteksi:</strong>{" "}
                                {result.disease}
                              </p>
                              <p>
                                <strong>Kategori:</strong> {result.category}
                              </p>
                              <p>
                                <strong>Tingkat Keparahan:</strong>{" "}
                                {result.severity === "healthy"
                                  ? "Sehat"
                                  : result.severity === "warning"
                                    ? "Sedang"
                                    : result.severity === "danger"
                                      ? "Berat"
                                      : "Tidak Diketahui"}
                              </p>
                              <p>
                                <strong>Confidence:</strong> {result.confidence}
                                %
                              </p>
                              <p>
                                <strong>Waktu Analisis:</strong>{" "}
                                {new Date().toLocaleString()}
                              </p>
                            </div>
                          </div>

                          {/* Feedback Section */}
                          <div className="bg-white rounded-xl p-4 mb-4">
                            <h4 className="font-semibold text-gray-800 mb-2">
                              Bantu kami berkembang!
                            </h4>
                            <p className="text-sm text-gray-600 mb-3">
                              Apakah hasil deteksi ini akurat menurut Anda?
                            </p>
                            
                            {feedbackSubmitted ? (
                              <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Terima kasih atas masukan Anda!
                              </div>
                            ) : (
                              <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      onClick={() => setFeedbackRating(star)}
                                      className={`p-1 transition-colors ${
                                        star <= feedbackRating
                                          ? "text-yellow-400"
                                          : "text-gray-300 hover:text-gray-400"
                                      }`}
                                    >
                                      <Star
                                        className="w-6 h-6"
                                        fill={star <= feedbackRating ? "currentColor" : "none"}
                                      />
                                    </button>
                                  ))}
                                </div>
                                <textarea
                                  value={feedbackText}
                                  onChange={(e) => setFeedbackText(e.target.value)}
                                  placeholder="Tambahkan catatan opsional..."
                                  className="w-full text-sm p-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                                  rows={2}
                                />
                                <button
                                  onClick={handleFeedbackSubmit}
                                  disabled={feedbackRating === 0}
                                  className="self-start text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 transition-colors font-medium"
                                >
                                  Kirim Masukan
                                </button>
                              </div>
                            )}
                          </div>
                        </>
                      )}

                      <div className="flex gap-3">
                        {result.severity !== "error" && (
                          <button
                            onClick={() => setCurrentPage("diseases")}
                            className="text-green-600 font-semibold hover:text-green-700 flex items-center gap-1 transition-colors"
                          >
                            Pelajari Lebih Lanjut{" "}
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedImage(null)}
                          className="btn-secondary ml-auto"
                        >
                          {result.severity === "error"
                            ? "Coba Lagi"
                            : "Analisis Gambar Baru"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
