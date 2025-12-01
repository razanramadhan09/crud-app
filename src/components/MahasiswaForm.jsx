import React, { useState } from "react";

const jurusanList = [
  "Teknik Informatika",
  "Sistem Informasi",
  "Manajemen",
];

const MahasiswaForm = ({ mahasiswa, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nama: mahasiswa?.nama || "",
    jurusan: mahasiswa?.jurusan || "",
    nilai: mahasiswa?.nilai || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Hapus ID supaya tidak error Firebase
    const cleanData = { ...formData };
    onSubmit(cleanData);
  };

  return (
    <div className="modal">
      <h2>{mahasiswa ? "Edit Mahasiswa" : "Tambah Mahasiswa"}</h2>

      <form onSubmit={handleSubmit}>
        <label>Nama:</label>
        <input
          type="text"
          value={formData.nama}
          onChange={(e) =>
            setFormData({ ...formData, nama: e.target.value })
          }
          required
        />

        <label>Jurusan:</label>
        <select
          value={formData.jurusan}
          onChange={(e) =>
            setFormData({ ...formData, jurusan: e.target.value })
          }
          required
        >
          <option value="">-- Pilih Jurusan --</option>
          {jurusanList.map((j, index) => (
            <option key={index} value={j}>
              {j}
            </option>
          ))}
        </select>

        <label>Nilai:</label>
        <input
          type="number"
          value={formData.nilai}
          onChange={(e) =>
            setFormData({ ...formData, nilai: e.target.value })
          }
          required
        />

        <button type="submit">
          {mahasiswa ? "Update" : "Tambah"}
        </button>

        <button type="button" onClick={onCancel}>
          Batal
        </button>
      </form>
    </div>
  );
};

export default MahasiswaForm;
