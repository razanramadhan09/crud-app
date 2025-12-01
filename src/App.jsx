import React, { useState, useEffect } from 'react';
import MahasiswaForm from './components/MahasiswaForm';

const App = () => {
  const [mahasiswaList, setMahasiswaList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMahasiswa, setEditingMahasiswa] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState(null);
  const [selectedJurusan, setSelectedJurusan] = useState('');

  // Inisialisasi data saat pertama kali load
  useEffect(() => {
    const savedData = localStorage.getItem('mahasiswaData');
    if (savedData) {
      setMahasiswaList(JSON.parse(savedData));
    } 
  }, []);

  // Simpan data ke localStorage setiap kali ada perubahan
  useEffect(() => {
    localStorage.setItem('mahasiswaData', JSON.stringify(mahasiswaList));
  }, [mahasiswaList]);

  // Tampilkan notifikasi
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Tambah data mahasiswa
  const handleAddMahasiswa = (mahasiswa) => {
    if (editingMahasiswa) {
      // Update data yang sudah ada
      const updatedList = mahasiswaList.map((item) =>
        item.id === editingMahasiswa.id ? { ...mahasiswa, id: editingMahasiswa.id } : item
      );
      setMahasiswaList(updatedList);
      showNotification('Data mahasiswa berhasil diperbarui!', 'success');
    } else {
      // Tambah data baru
      const newId = mahasiswaList.length > 0 ? Math.max(...mahasiswaList.map(m => m.id)) + 1 : 1;
      const newMahasiswa = { ...mahasiswa, id: newId };
      setMahasiswaList([...mahasiswaList, newMahasiswa]);
      showNotification('Data mahasiswa berhasil ditambahkan!', 'success');
    }
    setShowForm(false);
    setEditingMahasiswa(null);
  };

  // Edit data mahasiswa
  const handleEditMahasiswa = (mahasiswa) => {
    setEditingMahasiswa(mahasiswa);
    setShowForm(true);
  };

  // Hapus data mahasiswa
  const handleDeleteMahasiswa = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data mahasiswa ini?')) {
      const updatedList = mahasiswaList.filter((mahasiswa) => mahasiswa.id !== id);
      setMahasiswaList(updatedList);
      showNotification('Data mahasiswa berhasil dihapus!', 'success');
    }
  };

  // Filter data berdasarkan pencarian dan jurusan
  const filteredMahasiswa = mahasiswaList.filter((mahasiswa) => {
    const matchesSearch = mahasiswa.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mahasiswa.nim.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mahasiswa.jurusan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesJurusan = !selectedJurusan || mahasiswa.jurusan === selectedJurusan;
    return matchesSearch && matchesJurusan;
  });

  // Reset form
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingMahasiswa(null);
  };

  // Dapatkan daftar jurusan unik untuk filter
  const jurusanList = [...new Set(mahasiswaList.map((m) => m.jurusan))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            <i className="fas fa-graduation-cap text-blue-600 mr-3"></i>
            Sistem CRUD Data Mahasiswa
          </h1>
          <p className="text-gray-600">
            Kelola data mahasiswa dengan mudah - Tambah, Edit, Hapus, dan Lihat data
          </p>
        </header>

        {/* Notifikasi */}
        {notification && (
          <div className={`mb-6 p-4 rounded-lg fade-in ${notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
            <div className="flex items-center">
              <i className={`fas ${notification.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-3`}></i>
              <span>{notification.message}</span>
              <button
                className="ml-auto text-gray-500 hover:text-gray-700"
                onClick={() => setNotification(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        )}

        {/* Konten utama */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Toolbar */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
                <div className="relative flex-grow md:flex-grow-0">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-search text-gray-400"></i>
                  </div>
                  <input
                    type="text"
                    placeholder="Cari berdasarkan nama, NIM, atau jurusan..."
                    className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center space-x-4">
                  <select
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    value={selectedJurusan}
                    onChange={(e) => setSelectedJurusan(e.target.value)}
                  >
                    <option value="">Semua Jurusan</option>
                    {jurusanList.map((jurusan) => (
                      <option key={jurusan} value={jurusan}>
                        {jurusan}
                      </option>
                    ))}
                  </select>
                  
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedJurusan('');
                    }}
                    className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center"
                  >
                    <i className="fas fa-redo mr-2"></i>
                    Reset
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  setEditingMahasiswa(null);
                  setShowForm(true);
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition flex items-center shadow-md"
              >
                <i className="fas fa-user-plus mr-2"></i>
                Tambah Mahasiswa
              </button>
            </div>
          </div>

          {/* Statistik */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg mr-4">
                    <i className="fas fa-users text-blue-600 text-xl"></i>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Total Mahasiswa</p>
                    <p className="text-2xl font-bold text-gray-800">{mahasiswaList.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg mr-4">
                    <i className="fas fa-male text-green-600 text-xl"></i>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Laki-laki</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {mahasiswaList.filter(m => m.jenisKelamin === 'Laki-laki').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-pink-100 rounded-lg mr-4">
                    <i className="fas fa-female text-pink-600 text-xl"></i>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Perempuan</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {mahasiswaList.filter(m => m.jenisKelamin === 'Perempuan').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg mr-4">
                    <i className="fas fa-filter text-purple-600 text-xl"></i>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Tertampil</p>
                    <p className="text-2xl font-bold text-gray-800">{filteredMahasiswa.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabel data mahasiswa */}
          <div className="overflow-x-auto">
            {filteredMahasiswa.length === 0 ? (
              <div className="p-12 text-center">
                <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
                  <i className="fas fa-user-slash text-gray-400 text-4xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Data tidak ditemukan</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || selectedJurusan 
                    ? 'Tidak ada data yang sesuai dengan pencarian Anda.' 
                    : 'Belum ada data mahasiswa. Tambah data baru dengan menekan tombol "Tambah Mahasiswa".'}
                </p>
                {!searchTerm && !selectedJurusan && (
                  <button
                    onClick={() => {
                      setEditingMahasiswa(null);
                      setShowForm(true);
                    }}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition flex items-center mx-auto"
                  >
                    <i className="fas fa-user-plus mr-2"></i>
                    Tambah Mahasiswa Pertama
                  </button>
                )}
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Mahasiswa
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      NIM & Jurusan
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kontak
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Detail
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMahasiswa.map((mahasiswa) => (
                    <tr key={mahasiswa.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center mr-4">
                            <i className="fas fa-user text-blue-600"></i>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{mahasiswa.nama}</div>
                            <div className="text-sm text-gray-500 capitalize">
                              <i className="fas fa-venus-mars mr-1"></i>
                              {mahasiswa.jenisKelamin}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm font-semibold text-gray-900">{mahasiswa.nim}</div>
                        <div className="text-sm text-gray-500">{mahasiswa.jurusan}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          Angkatan {mahasiswa.angkatan}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm text-gray-900">
                          <i className="fas fa-envelope mr-2 text-blue-500"></i>
                          {mahasiswa.email}
                        </div>
                        <div className="text-sm text-gray-500 mt-1 truncate max-w-xs">
                          <i className="fas fa-map-marker-alt mr-2 text-green-500"></i>
                          {mahasiswa.alamat}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <i className="fas fa-university mr-1"></i>
                          {mahasiswa.jurusan}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditMahasiswa(mahasiswa)}
                            className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition flex items-center"
                          >
                            <i className="fas fa-edit mr-2"></i>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteMahasiswa(mahasiswa.id)}
                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition flex items-center"
                          >
                            <i className="fas fa-trash-alt mr-2"></i>
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer tabel */}
          {filteredMahasiswa.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm text-gray-500 mb-2 md:mb-0">
                Menampilkan <span className="font-semibold">{filteredMahasiswa.length}</span> dari <span className="font-semibold">{mahasiswaList.length}</span> data mahasiswa
              </div>
              <div className="text-sm text-gray-500">
                <i className="fas fa-info-circle mr-2 text-blue-500"></i>
                Klik tombol Edit atau Hapus untuk mengelola data
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>
            Sistem CRUD Data Mahasiswa &copy; {new Date().getFullYear()} - Dibuat dengan React.js dan Tailwind CSS
          </p>
          <p className="mt-1">
            <i className="fas fa-code mr-1"></i>
            Semua data disimpan di localStorage browser Anda
          </p>
        </footer>
      </div>

      {/* Form modal */}
      {showForm && (
        <MahasiswaForm
          mahasiswa={editingMahasiswa}
          onSubmit={handleAddMahasiswa}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  );
};

export default App;