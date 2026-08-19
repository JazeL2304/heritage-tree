'use client';

import React, { useState, useEffect } from 'react';
import { loadArchives, saveArchive, deleteArchive } from '@/lib/archive-service';

export interface ArchivalItem {
  id: string;
  title: string;
  category: 'events' | 'childhood' | 'photos' | 'other';
  date: string;
  description: string;
  imageUrl: string;
  taggedMembers: string[];
}

export const ArchiveView: React.FC = () => {
  const [items, setItems] = useState<ArchivalItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<ArchivalItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // New archive item form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'events' | 'childhood' | 'photos' | 'other'>('events');
  const [newDate, setNewDate] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploadTab, setUploadTab] = useState<'file' | 'url'>('file');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    async function initArchives() {
      setIsLoading(true);
      const data = await loadArchives();
      setItems(data);
      setIsLoading(false);
    }
    initArchives();
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: ArchivalItem = {
      id: 'arch_' + Date.now(),
      title: newTitle,
      category: newCategory,
      date: newDate || new Date().toISOString().split('T')[0],
      description: newDescription,
      imageUrl: newImageUrl || 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80',
      taggedMembers: ['Keluarga'],
    };

    const updated = [newItem, ...items];
    setItems(updated);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewDescription('');
    setNewImageUrl('');
    setNewDate('');

    await saveArchive(newItem);
  };

  const handleDeleteItem = async (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    setSelectedItem(null);
    await deleteArchive(id);
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] bg-[#fbf9f5] parchment-grid p-6 md:p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6 pb-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#efeeea] border border-[#e8dfd5] p-5 rounded-lg shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-[#8e1616] font-bold text-xs uppercase tracking-widest mb-1">
              <span className="material-symbols-outlined text-[18px]">photo_library</span>
              <span>Arsip & Galeri Dokumen Sejarah</span>
            </div>
            <h1 className="text-2xl font-bold text-[#8e1616] font-['Poppins']">
              Dokumentasi Bersejarah Keluarga
            </h1>
            <p className="text-xs text-[#59413e] mt-1">
              Penyimpanan foto-foto jadul, ijazah tua, sertifikat tanah, akta nikah, dan naskah zupu silsilah.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-[#8e1616] text-white font-bold text-xs uppercase tracking-wider rounded hover:bg-[#731010] transition-colors shadow flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span>
            Tambah Arsip Baru
          </button>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#fbf9f5] border border-[#e8dfd5] p-4 rounded-lg">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {[
              { id: 'all', label: 'Semua Arsip', icon: 'collections' },
              { id: 'events', label: 'Foto Pertemuan & Acara', icon: 'groups' },
              { id: 'childhood', label: 'Foto Masa Kecil', icon: 'child_care' },
              { id: 'photos', label: 'Foto Jadul & Kenangan', icon: 'photo_camera' },
              { id: 'other', label: 'Lainnya', icon: 'folder_open' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#8e1616] text-white shadow-sm'
                    : 'bg-[#eae8e4] text-[#59413e] hover:bg-[#e4e2de]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64 flex items-center">
            <span className="material-symbols-outlined text-[#59413e] text-[18px] absolute left-3 pointer-events-none select-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari arsip..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-[#e8dfd5] rounded text-xs text-[#1f1d1d] focus:outline-none focus:border-[#8e1616] transition-colors"
            />
          </div>
        </div>

        {/* Archival Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="bg-[#fbf9f5] border border-[#e8dfd5] rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer flex flex-col border-t-4 border-t-[#8e1616]"
            >
              {/* Image Thumbnail */}
              <div className="relative h-48 bg-[#eae8e4] overflow-hidden group">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-[#8e1616] text-[#fed65b] text-[10px] uppercase font-bold px-2 py-0.5 rounded shadow">
                  {item.category}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="font-bold text-sm text-[#8e1616] font-['Poppins'] line-clamp-1">
                    {item.title}
                  </h3>
                  <div className="text-[11px] text-[#735c00] font-semibold mt-0.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                    {item.date}
                  </div>
                  <p className="text-xs text-[#59413e] mt-2 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#e8dfd5] flex items-center justify-between text-[11px] text-[#59413e]">
                  <span className="flex items-center gap-1 text-[#8e1616] font-semibold">
                    <span className="material-symbols-outlined text-[14px]">sell</span>
                    {item.taggedMembers.join(', ')}
                  </span>
                  <span className="text-[#8e1616] underline font-bold">Lihat Detail →</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="bg-[#fbf9f5] border border-[#e8dfd5] rounded-lg p-12 text-center text-[#59413e]">
            <span className="material-symbols-outlined text-[48px] text-[#8e1616]">
              search_off
            </span>
            <p className="mt-2 font-bold text-sm text-[#8e1616]">Tidak ada dokumen arsip ditemukan</p>
            <p className="text-xs mt-1">Coba sesuaikan kata kunci pencarian atau kategori filter.</p>
          </div>
        )}
      </div>

      {/* Detail Viewer Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#fbf9f5] border-2 border-[#8e1616] rounded-lg shadow-2xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-[#59413e] hover:text-[#8e1616] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <h2 className="text-lg font-bold text-[#8e1616] font-['Poppins'] mb-1">
              {selectedItem.title}
            </h2>
            <div className="text-xs text-[#735c00] font-semibold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">calendar_month</span>
              Tanggal Dokumen: {selectedItem.date}
            </div>

            <div className="w-full max-h-[400px] bg-black/10 rounded overflow-hidden mb-4 border border-[#e8dfd5]">
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.title}
                className="w-full h-full object-contain max-h-[400px] mx-auto"
              />
            </div>

            <p className="text-xs text-[#1f1d1d] bg-[#eae8e4] p-3 rounded border border-[#e8dfd5] leading-relaxed mb-4">
              {selectedItem.description}
            </p>

            <div className="flex justify-between items-center border-t border-[#e8dfd5] pt-3 text-xs text-[#59413e]">
              <span>Terkait Anggota: <strong>{selectedItem.taggedMembers.join(', ')}</strong></span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDeleteItem(selectedItem.id)}
                  className="px-3 py-1.5 bg-[#ba1a1a] text-white font-bold rounded text-xs uppercase flex items-center gap-1 hover:bg-[#93000a] transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">delete</span>
                  <span>Hapus</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-1.5 bg-[#8e1616] text-white font-bold rounded text-xs uppercase cursor-pointer"
                >
                  Tutup Viewer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Archive Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#fbf9f5] border-2 border-[#8e1616] rounded-lg shadow-2xl max-w-lg w-full p-6 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-[#59413e] hover:text-[#8e1616] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="flex items-center gap-3 mb-4 border-b border-[#e8dfd5] pb-3">
              <div className="w-10 h-10 rounded-full bg-[#8e1616] text-[#fed65b] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">add_photo_alternate</span>
              </div>
              <div>
                <h3 className="font-bold text-base text-[#8e1616] font-['Poppins']">
                  Tambah Dokumen / Foto Arsip
                </h3>
                <p className="text-xs text-[#59413e]">
                  Abadikan dokumen bersejarah atau kenangan keluarga baru.
                </p>
              </div>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#59413e] uppercase tracking-wider mb-1">
                  Judul Arsip *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Misal: Foto Rumah Utama Trah Li (1975)"
                  className="w-full px-3 py-2 bg-white border border-[#e8dfd5] rounded text-sm text-[#1f1d1d] focus:outline-none focus:border-[#8e1616]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#59413e] uppercase tracking-wider mb-1">
                    Kategori
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-[#e8dfd5] rounded text-sm text-[#1f1d1d] focus:outline-none focus:border-[#8e1616]"
                  >
                    <option value="events">Foto Pertemuan & Acara</option>
                    <option value="childhood">Foto Masa Kecil</option>
                    <option value="photos">Foto Jadul & Kenangan</option>
                    <option value="other">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#59413e] uppercase tracking-wider mb-1">
                    Tanggal Dokumen
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#e8dfd5] rounded text-sm text-[#1f1d1d] focus:outline-none focus:border-[#8e1616]"
                  />
                </div>
              </div>

              {/* Photo Input (Upload File or URL) */}
              <div className="space-y-2 border border-[#e8dfd5] bg-white p-3 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-[#59413e] uppercase tracking-wider">
                    Foto / Gambar Dokumen Arsip
                  </label>
                  <div className="flex bg-[#eae8e4] p-0.5 rounded border border-[#e8dfd5] text-[11px]">
                    <button
                      type="button"
                      onClick={() => setUploadTab('file')}
                      className={`px-2.5 py-1 rounded font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                        uploadTab === 'file'
                          ? 'bg-[#8e1616] text-white'
                          : 'bg-transparent text-[#59413e] hover:bg-[#e4e2de]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[13px]">upload_file</span>
                      Unggah Berkas
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadTab('url')}
                      className={`px-2.5 py-1 rounded font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                        uploadTab === 'url'
                          ? 'bg-[#8e1616] text-white'
                          : 'bg-transparent text-[#59413e] hover:bg-[#e4e2de]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[13px]">link</span>
                      URL Foto
                    </button>
                  </div>
                </div>

                {uploadTab === 'file' ? (
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-3 px-4 border-2 border-dashed border-[#8e1616]/40 hover:border-[#8e1616] bg-[#fbf9f5] rounded-lg text-center cursor-pointer transition-colors flex items-center justify-center gap-2 text-[#8e1616] font-semibold text-xs"
                    >
                      <span className="material-symbols-outlined text-[20px]">add_a_photo</span>
                      <span>Pilih Foto Berkas dari Komputer/HP...</span>
                    </button>
                  </div>
                ) : (
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-white border border-[#e8dfd5] rounded text-sm text-[#1f1d1d] focus:outline-none focus:border-[#8e1616]"
                  />
                )}

                {/* Preview Box */}
                {newImageUrl && (
                  <div className="relative mt-2 rounded overflow-hidden border border-[#e8dfd5] h-36 bg-[#eae8e4]">
                    <img src={newImageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setNewImageUrl('')}
                      className="absolute top-2 right-2 bg-[#ba1a1a] text-white p-1 rounded-full shadow hover:bg-[#93000a] cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-[#59413e] uppercase tracking-wider mb-1">
                  Deskripsi / Keterangan Sejarah
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Tuliskan cerita singkat dibalik dokumen ini..."
                  className="w-full px-3 py-2 bg-white border border-[#e8dfd5] rounded text-sm text-[#1f1d1d] focus:outline-none focus:border-[#8e1616]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#e8dfd5]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-[#e8dfd5] text-[#59413e] font-semibold rounded hover:bg-[#eae8e4] transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#8e1616] text-white font-bold uppercase tracking-wider rounded hover:opacity-90 transition-opacity cursor-pointer shadow"
                >
                  Simpan Arsip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
