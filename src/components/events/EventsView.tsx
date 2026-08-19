'use client';

import React, { useState } from 'react';

export interface FamilyEvent {
  id: string;
  title: string;
  type: 'birthday' | 'reunion' | 'commemoration' | 'meeting';
  date: string;
  time?: string;
  location: string;
  description: string;
  organizer: string;
}

const INITIAL_EVENTS: FamilyEvent[] = [
  {
    id: 'evt_1',
    title: 'Ulang Tahun Li Wei (32 Tahun)',
    type: 'birthday',
    date: '2026-04-07',
    time: '19:00 WIB',
    location: 'Kediaman Utama Li Wei, Jakarta',
    description: 'Syukuran ulang tahun Li Wei bersama keluarga besar generasi ke-2.',
    organizer: 'Chen Ting',
  },
  {
    id: 'evt_2',
    title: 'Reuni Akbar & Arisan Trah Li 2026',
    type: 'reunion',
    date: '2026-05-15',
    time: '10:00 WIB',
    location: 'Pendopo Sanggar Heritage, Bandung',
    description: 'Kumpul tahunan silaturahmi antar generasi 1, 2, dan 3. Pembacaan Zupu dan makan bersama.',
    organizer: 'Li Jianhua',
  },
  {
    id: 'evt_3',
    title: 'Ziarah & Haul Peringatan Leluhur',
    type: 'commemoration',
    date: '2026-08-22',
    time: '08:00 WIB',
    location: 'Kawasan Makam Keluarga Trah Li',
    description: 'Doa bersama dan ziarah kubur mengenang jasa para pendahulu silsilah.',
    organizer: 'Wang Xiu Ying',
  },
];

export const EventsView: React.FC = () => {
  const [events, setEvents] = useState<FamilyEvent[]>(INITIAL_EVENTS);
  const [filterType, setFilterType] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Event Form State
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'birthday' | 'reunion' | 'commemoration' | 'meeting'>('reunion');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newOrganizer, setNewOrganizer] = useState('Panitia Keluarga');

  const filteredEvents = events.filter((evt) => {
    if (filterType === 'all') return true;
    return evt.type === filterType;
  });

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newEvt: FamilyEvent = {
      id: 'evt_' + Date.now(),
      title: newTitle,
      type: newType,
      date: newDate || new Date().toISOString().split('T')[0],
      time: newTime || '10:00 WIB',
      location: newLocation || 'Kediaman Keluarga',
      description: newDescription,
      organizer: newOrganizer,
    };

    setEvents([...events, newEvt]);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewDescription('');
    setNewLocation('');
  };

  const getEventBadge = (type: FamilyEvent['type']) => {
    switch (type) {
      case 'birthday':
        return { label: 'Ulang Tahun', bg: 'bg-[#fed65b] text-[#745c00]', icon: 'cake' };
      case 'reunion':
        return { label: 'Reuni / Arisan', bg: 'bg-[#8e1616] text-white', icon: 'groups' };
      case 'commemoration':
        return { label: 'Haul / Ziarah', bg: 'bg-[#003921] text-white', icon: 'sentiment_satisfied' };
      default:
        return { label: 'Pertemuan', bg: 'bg-[#eae8e4] text-[#1f1d1d]', icon: 'event' };
    }
  };

  return (
    <div className="flex-1 min-h-[calc(100vh-4rem)] bg-[#fbf9f5] parchment-grid p-6 md:p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#efeeea] border border-[#e8dfd5] p-5 rounded-lg shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-[#8e1616] font-bold text-xs uppercase tracking-widest mb-1">
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
              <span>Agenda & Peringatan Silaturahmi</span>
            </div>
            <h1 className="text-2xl font-bold text-[#8e1616] font-['Plus_Jakarta_Sans']">
              Kalender Agenda Keluarga
            </h1>
            <p className="text-xs text-[#59413e] mt-1">
              Jadwal reuni keluarga, arisan trah, peringatan hari ulang tahun, serta haul/ziarah ziarah leluhur.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-[#8e1616] text-white font-bold text-xs uppercase tracking-wider rounded hover:bg-[#731010] transition-colors shadow flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">edit_calendar</span>
            Tambah Agenda Baru
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap gap-2 bg-[#fbf9f5] border border-[#e8dfd5] p-3 rounded-lg">
          {[
            { id: 'all', label: 'Semua Agenda', icon: 'event_note' },
            { id: 'reunion', label: 'Reuni & Arisan', icon: 'groups' },
            { id: 'birthday', label: 'Ulang Tahun', icon: 'cake' },
            { id: 'commemoration', label: 'Haul & Ziarah', icon: 'diversity_1' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterType(cat.id)}
              className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                filterType === cat.id
                  ? 'bg-[#8e1616] text-white shadow-sm'
                  : 'bg-[#eae8e4] text-[#59413e] hover:bg-[#e4e2de]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Events Timeline / Card List */}
        <div className="space-y-4">
          {filteredEvents.map((evt) => {
            const badge = getEventBadge(evt.type);
            return (
              <div
                key={evt.id}
                className="bg-[#fbf9f5] border border-[#e8dfd5] rounded-lg p-5 shadow-sm hover:shadow transition-shadow flex flex-col md:flex-row gap-5 items-start border-l-4 border-l-[#8e1616]"
              >
                {/* Date Badge Box */}
                <div className="bg-[#efeeea] border border-[#e8dfd5] p-3 rounded text-center shrink-0 min-w-[100px]">
                  <div className="text-[11px] font-bold text-[#8e1616] uppercase tracking-wider">
                    {new Date(evt.date).toLocaleDateString('id-ID', { month: 'short' })}
                  </div>
                  <div className="text-2xl font-bold text-[#8e1616] font-['Plus_Jakarta_Sans']">
                    {new Date(evt.date).getDate()}
                  </div>
                  <div className="text-[10px] text-[#59413e] font-semibold mt-0.5">
                    {new Date(evt.date).getFullYear()}
                  </div>
                </div>

                {/* Event Information */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-bold text-base text-[#8e1616] font-['Plus_Jakarta_Sans']">
                      {evt.title}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold flex items-center gap-1 ${badge.bg}`}>
                      <span className="material-symbols-outlined text-[13px]">{badge.icon}</span>
                      {badge.label}
                    </span>
                  </div>

                  <p className="text-xs text-[#59413e] leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-xs text-[#59413e] pt-2 border-t border-[#e8dfd5]/60 font-semibold">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[#8e1616] text-[16px]">schedule</span>
                      <span>{evt.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[#8e1616] text-[16px]">location_on</span>
                      <span>{evt.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[#8e1616] text-[16px]">person</span>
                      <span>Penyelenggara: {evt.organizer}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredEvents.length === 0 && (
            <div className="bg-[#fbf9f5] border border-[#e8dfd5] rounded-lg p-12 text-center text-[#59413e]">
              <span className="material-symbols-outlined text-[48px] text-[#8e1616]">
                event_busy
              </span>
              <p className="mt-2 font-bold text-sm text-[#8e1616]">Belum ada agenda pada kategori ini</p>
              <p className="text-xs mt-1">Klik "Tambah Agenda Baru" untuk menjadwalkan reuni atau peringatan keluarga.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Event Modal */}
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
                <span className="material-symbols-outlined text-[24px]">edit_calendar</span>
              </div>
              <div>
                <h3 className="font-bold text-base text-[#8e1616] font-['Plus_Jakarta_Sans']">
                  Tambah Agenda / Peringatan Baru
                </h3>
                <p className="text-xs text-[#59413e]">
                  Jadwalkan reuni, arisan, atau peringatan ulang tahun/haul.
                </p>
              </div>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#59413e] uppercase tracking-wider mb-1">
                  Nama Agenda / Event *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Misal: Reuni Akbar Trah Li 2026"
                  className="w-full px-3 py-2 bg-white border border-[#e8dfd5] rounded text-sm text-[#1f1d1d] focus:outline-none focus:border-[#8e1616]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#59413e] uppercase tracking-wider mb-1">
                    Jenis Agenda
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-[#e8dfd5] rounded text-sm text-[#1f1d1d] focus:outline-none focus:border-[#8e1616]"
                  >
                    <option value="reunion">Reuni & Arisan</option>
                    <option value="birthday">Ulang Tahun</option>
                    <option value="commemoration">Haul & Ziarah</option>
                    <option value="meeting">Pertemuan Rutin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#59413e] uppercase tracking-wider mb-1">
                    Tanggal Execution *
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#e8dfd5] rounded text-sm text-[#1f1d1d] focus:outline-none focus:border-[#8e1616]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#59413e] uppercase tracking-wider mb-1">
                    Waktu / Jam
                  </label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="e.g. 10:00 WIB"
                    className="w-full px-3 py-2 bg-white border border-[#e8dfd5] rounded text-sm text-[#1f1d1d] focus:outline-none focus:border-[#8e1616]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#59413e] uppercase tracking-wider mb-1">
                    Lokasi Acara
                  </label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="Lokasi / Alamat"
                    className="w-full px-3 py-2 bg-white border border-[#e8dfd5] rounded text-sm text-[#1f1d1d] focus:outline-none focus:border-[#8e1616]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#59413e] uppercase tracking-wider mb-1">
                  Penyelenggara / Penanggung Jawab
                </label>
                <input
                  type="text"
                  value={newOrganizer}
                  onChange={(e) => setNewOrganizer(e.target.value)}
                  placeholder="Nama penyelenggara"
                  className="w-full px-3 py-2 bg-white border border-[#e8dfd5] rounded text-sm text-[#1f1d1d] focus:outline-none focus:border-[#8e1616]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#59413e] uppercase tracking-wider mb-1">
                  Keterangan / Rincian Acara
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Penjelasan singkat mengenai acara..."
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
                  Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
