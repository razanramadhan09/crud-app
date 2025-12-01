// App.js
import React, { useState, useEffect } from 'react';

// FIREBASE
import { db } from "./firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";

// Icons
import {
  Search,
  X,
  Plus,
  Edit2,
  Trash2,
  GraduationCap,
  User,
  Mail,
  Hash,
  Calendar,
  BookOpen,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Smartphone,
  MapPin,
  Eye
} from 'lucide-react';

// Komponen Form Modal
const MahasiswaFormModal = ({ mahasiswa, onSubmit, onCancel, isOpen }) => {
  const [formData, setFormData] = useState({
    nama: '',
    npm: '',
    jurusan: '',
    tahunMasuk: new Date().getFullYear(),
    email: '',
    phone: '',
    alamat: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Jurusan options
  const jurusanOptions = [
    'Teknik Informatika',
    'Sistem Informasi', 
    'Teknik Komputer',
    'Teknik Elektro',
    'Teknik Mesin',
    'Teknik Sipil'
  ];

  // Inisialisasi form data jika edit
  useEffect(() => {
    console.log('Form modal mounted/updated:', { mahasiswa, isOpen });
    
    if (mahasiswa) {
      console.log('Setting form data for edit:', mahasiswa);
      setFormData({
        nama: mahasiswa.nama || '',
        npm: mahasiswa.npm || '',
        jurusan: mahasiswa.jurusan || '',
        tahunMasuk: mahasiswa.tahunMasuk || new Date().getFullYear(),
        email: mahasiswa.email || '',
        phone: mahasiswa.phone || '',
        alamat: mahasiswa.alamat || ''
      });
    } else {
      // Reset form untuk tambah data baru
      setFormData({
        nama: '',
        npm: '',
        jurusan: '',
        tahunMasuk: new Date().getFullYear(),
        email: '',
        phone: '',
        alamat: ''
      });
    }
    setErrors({});
  }, [mahasiswa, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nama.trim()) newErrors.nama = 'Nama harus diisi';
    if (!formData.npm.trim()) newErrors.npm = 'NPM harus diisi';
    if (!formData.jurusan.trim()) newErrors.jurusan = 'Jurusan harus dipilih';
    if (!formData.tahunMasuk) newErrors.tahunMasuk = 'Tahun masuk harus diisi';
    if (!formData.email.trim()) {
      newErrors.email = 'Email harus diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      // Format data sebelum dikirim
      const submitData = {
        ...formData,
        tahunMasuk: parseInt(formData.tahunMasuk),
        updatedAt: new Date().toISOString()
      };
      
      console.log('Submitting data:', submitData);
      console.log('Editing mahasiswa:', mahasiswa);
      
      await onSubmit(submitData);
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              {mahasiswa ? (
                <Edit2 className="w-5 h-5" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {mahasiswa ? `Edit Data: ${mahasiswa.nama}` : 'Tambah Mahasiswa Baru'}
              </h3>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-white/20 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Kolom Kiri */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.nama ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Masukkan nama lengkap"
                />
                {errors.nama && (
                  <p className="mt-1 text-sm text-red-600">{errors.nama}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NPM *
                </label>
                <input
                  type="text"
                  name="npm"
                  value={formData.npm}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.npm ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Contoh: 20210001"
                />
                {errors.npm && (
                  <p className="mt-1 text-sm text-red-600">{errors.npm}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tahun Masuk *
                </label>
                <input
                  type="number"
                  name="tahunMasuk"
                  value={formData.tahunMasuk}
                  onChange={handleChange}
                  min="2000"
                  max={new Date().getFullYear()}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.tahunMasuk ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.tahunMasuk && (
                  <p className="mt-1 text-sm text-red-600">{errors.tahunMasuk}</p>
                )}
              </div>
            </div>

            {/* Kolom Kanan */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jurusan *
                </label>
                <select
                  name="jurusan"
                  value={formData.jurusan}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.jurusan ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Pilih Jurusan</option>
                  {jurusanOptions.map(jurusan => (
                    <option key={jurusan} value={jurusan}>{jurusan}</option>
                  ))}
                </select>
                {errors.jurusan && (
                  <p className="mt-1 text-sm text-red-600">{errors.jurusan}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="contoh@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Contoh: 081234567890"
                />
              </div>
            </div>
          </div>

          {/* Alamat */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat
            </label>
            <textarea
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Masukkan alamat lengkap"
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  {mahasiswa ? 'Perbarui Data' : 'Simpan Data'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const App = () => {
  const [mahasiswaList, setMahasiswaList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMahasiswa, setEditingMahasiswa] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState(null);
  const [selectedJurusan, setSelectedJurusan] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);

  const mahasiswaCollection = collection(db, "mahasiswa");

  // 🔄 Load Data
  const loadData = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(mahasiswaCollection);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Data loaded:', data);
      setMahasiswaList(data);
    } catch (error) {
      console.error('Error loading data:', error);
      showNotification("Gagal memuat data!", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 🔔 Notifikasi
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // ➕ Tambah / Update
  const handleAddMahasiswa = async (mahasiswa) => {
    try {
      console.log('Handling add/update:', { editingMahasiswa, mahasiswa });
      
      if (editingMahasiswa && editingMahasiswa.id) {
        // Update existing document
        console.log('Updating document with ID:', editingMahasiswa.id);
        const { id, ...mahasiswaData } = mahasiswa;
        const docRef = doc(db, "mahasiswa", editingMahasiswa.id);
        await updateDoc(docRef, mahasiswaData);
        showNotification("Data berhasil diperbarui!", "success");
      } else {
        // Add new document
        console.log('Adding new document');
        await addDoc(mahasiswaCollection, {
          ...mahasiswa,
          createdAt: new Date().toISOString()
        });
        showNotification("Data berhasil ditambahkan!", "success");
      }

      loadData();
      setShowForm(false);
      setEditingMahasiswa(null);

    } catch (error) {
      console.error('Error in handleAddMahasiswa:', error);
      showNotification(`Terjadi kesalahan: ${error.message}`, "error");
    }
  };

  // ✏ Edit
  const handleEditMahasiswa = (mhs) => {
    console.log('Edit button clicked:', mhs);
    setEditingMahasiswa(mhs);
    setShowForm(true);
  };

  // 🗑 Delete
  const handleDeleteMahasiswa = async (id) => {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;

    try {
      console.log('Deleting document with ID:', id);
      const docRef = doc(db, "mahasiswa", id);
      await deleteDoc(docRef);

      showNotification("Data berhasil dihapus!", "success");
      loadData();

    } catch (error) {
      console.error('Error deleting:', error);
      showNotification(`Gagal menghapus: ${error.message}`, "error");
    }
  };

  // 🔍 Filter
  const filteredMahasiswa = mahasiswaList.filter((mhs) => {
    const matchSearch =
      mhs.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mhs.npm?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mhs.jurusan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mhs.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchJurusan =
      !selectedJurusan || mhs.jurusan === selectedJurusan;

    return matchSearch && matchJurusan;
  });

  const jurusanList = [...new Set(mahasiswaList.map(m => m.jurusan).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
            notification.type === "success" 
              ? "bg-green-500 text-white" 
              : "bg-red-500 text-white"
          }`}>
            {notification.type === "success" ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span className="text-sm">{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-2 hover:opacity-80"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Data Mahasiswa
              </h1>
              <p className="text-gray-600 text-sm">
                Sistem pengelolaan data mahasiswa sederhana
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              console.log('Add button clicked');
              setEditingMahasiswa(null);
              setShowForm(true);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Tambah Mahasiswa
          </button>
        </div>

        {/* FILTERS */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama, NPM, jurusan, atau email..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <select
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedJurusan}
                onChange={(e) => setSelectedJurusan(e.target.value)}
              >
                <option value="">Semua Jurusan</option>
                {jurusanList.map(j => (
                  <option key={j} value={j}>{j}</option>
                ))}
              </select>

              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedJurusan("");
                }}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-1"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="ml-3 text-gray-600">Memuat data...</p>
            </div>
          ) : filteredMahasiswa.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-gray-900 font-medium mb-1">Data tidak ditemukan</h3>
              <p className="text-gray-600 text-sm">
                Coba ubah kata kunci pencarian atau filter
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mahasiswa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Informasi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kontak
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMahasiswa.map((mhs) => (
                    <tr key={mhs.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{mhs.nama}</div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Hash className="w-3 h-3" />
                              <span>{mhs.npm}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{mhs.jurusan}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">Tahun masuk: {mhs.tahunMasuk}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-sm truncate max-w-[180px]">{mhs.email}</span>
                          </div>
                          {mhs.phone && (
                            <div className="flex items-center gap-2">
                              <Smartphone className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{mhs.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEditMahasiswa(mhs)}
                            className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              console.log('Delete button clicked for ID:', mhs.id);
                              handleDeleteMahasiswa(mhs.id);
                            }}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setSelectedMahasiswa(mhs)}
                            className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-md transition-colors"
                            title="Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Results Info */}
          {filteredMahasiswa.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
              <span>
                Menampilkan {filteredMahasiswa.length} dari {mahasiswaList.length} data
              </span>
              <button
                onClick={loadData}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <footer className="text-center py-6 text-gray-500 text-sm">
          <p>Data Mahasiswa • {new Date().getFullYear()}</p>
        </footer>
      </div>

      {/* FORM MODAL */}
      <MahasiswaFormModal
        mahasiswa={editingMahasiswa}
        onSubmit={handleAddMahasiswa}
        onCancel={() => {
          console.log('Form cancelled');
          setShowForm(false);
          setEditingMahasiswa(null);
        }}
        isOpen={showForm}
      />

      {/* DETAIL MODAL */}
      {selectedMahasiswa && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-600 text-white">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                <h3 className="font-bold">Detail Mahasiswa</h3>
              </div>
              <button
                onClick={() => setSelectedMahasiswa(null)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{selectedMahasiswa.nama}</h4>
                  <p className="text-gray-600">NPM: {selectedMahasiswa.npm}</p>
                  <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                    {selectedMahasiswa.jurusan}
                  </span>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600">Tahun Masuk</p>
                    <p className="font-medium">{selectedMahasiswa.tahunMasuk}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium truncate">{selectedMahasiswa.email}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {selectedMahasiswa.phone && (
                    <div>
                      <p className="text-sm text-gray-600">Telepon</p>
                      <p className="font-medium">{selectedMahasiswa.phone}</p>
                    </div>
                  )}
                  {selectedMahasiswa.alamat && (
                    <div>
                      <p className="text-sm text-gray-600">Alamat</p>
                      <p className="font-medium">{selectedMahasiswa.alamat}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-200 flex gap-3">
                <button
                  onClick={() => {
                    handleEditMahasiswa(selectedMahasiswa);
                    setSelectedMahasiswa(null);
                  }}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Edit Data
                </button>
                <button
                  onClick={() => setSelectedMahasiswa(null)}
                  className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;