'use client';

import React, { useState } from 'react';

export interface FamilyEvent {
  id: string;
  title: string;
  type: 'birthday' | 'reunion' | 'commemoration' | 'meeting';
  date: string; // YYYY-MM-DD
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
  {
    id: 'evt_4',
    title: 'Syukuran Kelahiran Keturunan Gen-3',
    type: 'meeting',
    date: '2026-08-10',
    time: '11:00 WIB',
    location: 'Rumah Besar Trah Li',
    description: 'Kumpul keluarga menyambut anggota keluarga baru keturunan generasi 3.',
    organizer: 'Wang Xiu Ying',
  },
];

export const EventsView: React.FC = () => {
  const [events, setEvents] = useState<FamilyEvent[]>(INITIAL_EVENTS);
  const [filterType, setFilterType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  // Calendar State: default to August 2026 (or current date)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(7); // 0-indexed: 7 = August, 3 = April
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedEventDetail, setSelectedEventDetail] = useState<FamilyEvent | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Event Form State
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'birthday' | 'reunion' | 'commemoration' | 'meeting'>('reunion');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newOrganizer, setNewOrganizer] = useState('Panitia Keluarga');

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const daysOfWeek = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  // Calendar calculations
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDay(null);
  };

  // Helper to format date string YYYY-MM-DD
  const formatDateStr = (year: number, month: number, day: number) => {
    const m = (month + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  // Get events for a specific day cell
  const getEventsForDay = (day: number) => {
    const targetDate = formatDateStr(currentYear, currentMonth, day);
    return events.filter((evt) => evt.date === targetDate);
  };

  // Filtered events for list view or selected date
  const filteredEvents = events.filter((evt) => {
    const matchesType = filterType === 'all' || evt.type === filterType;
    if (selectedDay) {
      const selectedDateStr = formatDateStr(currentYear, currentMonth, selectedDay);
      return matchesType && evt.date === selectedDateStr;
    }
    return matchesType;
  });

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const eventDate = newDate || formatDateStr(currentYear, currentMonth, selectedDay || 15);

    const newEvt: FamilyEvent = {
      id: 'evt_' + Date.now(),
      title: newTitle,
      type: newType,
      date: eventDate,
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
              Kalender Interaktif Keluarga
            </h1>
            <p className="text-xs text-[#59413e] mt-1">
              Klik pada tanggal di lembar kalender untuk melihat atau menambahkan agenda reuni, ultah, dan haul.
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

        {/* Mode Selector & Category Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#fbf9f5] border border-[#e8dfd5] p-3 rounded-lg">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
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

          {/* View Mode Toggle Switch */}
          <div className="flex bg-[#eae8e4] p-1 rounded border border-[#e8dfd5] text-xs font-semibold shrink-0">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 rounded flex items-center gap-1 transition-colors cursor-pointer ${
                viewMode === 'calendar' ? 'bg-[#8e1616] text-white shadow-sm' : 'text-[#59413e]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">calendar_view_month</span>
              Lembar Kalender
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded flex items-center gap-1 transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-[#8e1616] text-white shadow-sm' : 'text-[#59413e]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">format_list_bulleted</span>
              Daftar List
            </button>
          </div>
        </div>

        {/* 📅 VISUAL INTERACTIVE CALENDAR GRID VIEW */}
        {viewMode === 'calendar' && (
          <div className="bg-[#fbf9f5] border-2 border-[#8e1616] rounded-xl shadow-lg p-5 space-y-4">
            {/* Calendar Header Month Control */}
            <div className="flex justify-between items-center bg-[#efeeea] border border-[#e8dfd5] px-4 py-3 rounded-lg">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-full bg-[#fbf9f5] border border-[#e8dfd5] text-[#8e1616] hover:bg-[#8e1616] hover:text-white transition-colors cursor-pointer"
                title="Bulan Sebelumnya"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>

              <div className="text-center">
                <h2 className="text-lg font-bold text-[#8e1616] font-['Plus_Jakarta_Sans'] uppercase tracking-widest">
                  {monthNames[currentMonth]} {currentYear}
                </h2>
                {selectedDay && (
                  <button
                    onClick={() => setSelectedDay(null)}
                    className="text-[11px] text-[#735c00] underline font-semibold hover:text-[#8e1616] cursor-pointer"
                  >
                    Tampilkan Semua Tanggal Bulan Ini (Klik untuk Reset Filter Tanggal)
                  </button>
                )}
              </div>

              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-full bg-[#fbf9f5] border border-[#e8dfd5] text-[#8e1616] hover:bg-[#8e1616] hover:text-white transition-colors cursor-pointer"
                title="Bulan Berikutnya"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>

            {/* Day Names Grid Header */}
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-[#8e1616] bg-[#eae8e4] py-2 rounded">
              {daysOfWeek.map((dayName, idx) => (
                <div key={idx} className={idx === 0 ? 'text-[#ba1a1a]' : ''}>
                  {dayName}
                </div>
              ))}
            </div>

            {/* Days Grid Cells (7 columns) */}
            <div className="grid grid-cols-7 gap-1.5">
              {/* Empty padding slots before first day */}
              {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
                <div key={`empty_${idx}`} className="h-24 bg-[#fbf9f5]/50 border border-[#e8dfd5]/40 rounded opacity-40"></div>
              ))}

              {/* Day Cells 1..daysInMonth */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const isSelected = selectedDay === dayNum;
                const dayEvents = getEventsForDay(dayNum);
                const hasEvents = dayEvents.length > 0;

                return (
                  <div
                    key={`day_${dayNum}`}
                    onClick={() => setSelectedDay(isSelected ? null : dayNum)}
                    className={`h-24 p-1.5 border rounded-lg flex flex-col justify-between transition-all duration-150 cursor-pointer overflow-hidden relative ${
                      isSelected
                        ? 'bg-[#8e1616] text-white border-2 border-[#fed65b] shadow-md scale-105 z-10'
                        : hasEvents
                        ? 'bg-[#efeeea] border-2 border-[#8e1616]/70 hover:bg-[#e4e2de]'
                        : 'bg-[#fbf9f5] border-[#e8dfd5] hover:bg-[#eae8e4]'
                    }`}
                  >
                    {/* Day Number Header */}
                    <div className="flex justify-between items-center">
                      <span className={`font-bold text-xs ${isSelected ? 'text-[#fed65b]' : 'text-[#1f1d1d]'}`}>
                        {dayNum}
                      </span>
                      {hasEvents && !isSelected && (
                        <span className="w-2 h-2 rounded-full bg-[#8e1616] animate-pulse"></span>
                      )}
                    </div>

                    {/* Events Badges inside Day Cell */}
                    <div className="space-y-1 overflow-y-auto max-h-[60px] text-[10px]">
                      {dayEvents.map((evt) => {
                        const badge = getEventBadge(evt.type);
                        return (
                          <div
                            key={evt.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEventDetail(evt);
                            }}
                            className={`p-1 rounded font-semibold truncate cursor-pointer hover:opacity-90 transition-opacity ${
                              isSelected ? 'bg-[#fed65b] text-[#745c00]' : badge.bg
                            }`}
                            title={`${evt.title} - ${evt.time}`}
                          >
                            {evt.title}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected Date Filter Indicator */}
        {selectedDay && (
          <div className="bg-[#fed65b]/20 border border-[#fed65b] p-3 rounded-lg flex justify-between items-center text-xs text-[#745c00]">
            <span>
              Menampilkan agenda untuk tanggal: <strong>{selectedDay} {monthNames[currentMonth]} {currentYear}</strong>
            </span>
            <button
              onClick={() => setSelectedDay(null)}
              className="text-[#8e1616] underline font-bold cursor-pointer"
            >
              Lihat Semua Tanggal
            </button>
          </div>
        )}

        {/* Events Timeline / Detailed Card List */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-[#8e1616] uppercase tracking-wider font-['Plus_Jakarta_Sans']">
            📋 Daftar Rincian Agenda & Event
          </h2>

          {filteredEvents.map((evt) => {
            const badge = getEventBadge(evt.type);
            return (
              <div
                key={evt.id}
                onClick={() => setSelectedEventDetail(evt)}
                className="bg-[#fbf9f5] border border-[#e8dfd5] rounded-lg p-5 shadow-sm hover:shadow transition-all flex flex-col md:flex-row gap-5 items-start border-l-4 border-l-[#8e1616] cursor-pointer"
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
              <p className="mt-2 font-bold text-sm text-[#8e1616]">Belum ada agenda pada kriteria ini</p>
              <p className="text-xs mt-1">Klik "Tambah Agenda Baru" atau pilih tanggal lain di kalender.</p>
            </div>
          )}
        </div>
      </div>

      {/* Event Detail Popup Modal */}
      {selectedEventDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#fbf9f5] border-2 border-[#8e1616] rounded-lg shadow-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setSelectedEventDetail(null)}
              className="absolute top-4 right-4 text-[#59413e] hover:text-[#8e1616] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="flex items-center gap-3 mb-4 border-b border-[#e8dfd5] pb-3">
              <div className="w-10 h-10 rounded-full bg-[#8e1616] text-[#fed65b] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">event</span>
              </div>
              <div>
                <h3 className="font-bold text-base text-[#8e1616] font-['Plus_Jakarta_Sans']">
                  Rincian Agenda Keluarga
                </h3>
                <p className="text-xs text-[#59413e]">{selectedEventDetail.date}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <h2 className="text-lg font-bold text-[#8e1616] font-['Plus_Jakarta_Sans']">
                {selectedEventDetail.title}
              </h2>

              <p className="text-[#1f1d1d] bg-[#eae8e4] p-3 rounded border border-[#e8dfd5] leading-relaxed">
                {selectedEventDetail.description}
              </p>

              <div className="space-y-1.5 text-[#59413e] pt-1">
                <div>🕒 Waktu: <strong>{selectedEventDetail.time}</strong></div>
                <div>📍 Lokasi: <strong>{selectedEventDetail.location}</strong></div>
                <div>👤 Penyelenggara: <strong>{selectedEventDetail.organizer}</strong></div>
              </div>

              <div className="flex justify-end pt-3 border-t border-[#e8dfd5]">
                <button
                  type="button"
                  onClick={() => setSelectedEventDetail(null)}
                  className="px-4 py-2 bg-[#8e1616] text-white font-bold text-xs uppercase rounded"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
