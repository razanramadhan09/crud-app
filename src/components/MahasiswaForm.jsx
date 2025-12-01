import React, { useState } from 'react';

const MahasiswaForm = ({ mahasiswa, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    id: mahasiswa?.id || '',
    nama: mahasiswa?.nama || '',
    nim: mahasiswa?.nim || '',
    jurusan: mahasiswa?.jurusan || '',
    angkatan: mahasiswa?.angkatan || '',
    email: mahasiswa?.email || '',
    alamat: mahasiswa?.alamat || '',
    jenisKelamin: mahasiswa?.jenisKelamin || 'Laki-laki',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto slide-in">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {mahasiswa ? 'Edit Data Mahasiswa' : 'Tambah Data Mahasiswa'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  NIM <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nim"
                  value={formData.nim}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Masukkan NIM"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Jurusan <span className="text-red-500">*</span>
                </label>
                <select
                  name="jurusan"
                  value={formData.jurusan}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                >
                  <option value="">Pilih Jurusan</option>
                  <option value="Teknik Informatika">Teknik Informatika</option>
                  <option value="Sistem Informasi">Sistem Informasi</option>
                  <option value="Teknik Komputer">Teknik Komputer</option>
                  <option value="Manajemen Informatika">Manajemen Informatika</option>
                  <option value="Ilmu Komputer">Ilmu Komputer</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Angkatan <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="angkatan"
                  value={formData.angkatan}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Tahun angkatan"
                  min="2000"
                  max="2024"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="email@example.com"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Jenis Kelamin <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="jenisKelamin"
                      value="Laki-laki"
                      checked={formData.jenisKelamin === 'Laki-laki'}
                      onChange={handleChange}
                      className="mr-2 text-blue-600"
                    />
                    <span>Laki-laki</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="jenisKelamin"
                      value="Perempuan"
                      checked={formData.jenisKelamin === 'Perempuan'}
                      onChange={handleChange}
                      className="mr-2 text-blue-600"
                    />
                    <span>Perempuan</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Alamat Lengkap
              </label>
              <textarea
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                rows="3"
                placeholder="Masukkan alamat lengkap"
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition flex items-center"
              >
                <i className="fas fa-save mr-2"></i>
                {mahasiswa ? 'Perbarui Data' : 'Simpan Data'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MahasiswaForm;