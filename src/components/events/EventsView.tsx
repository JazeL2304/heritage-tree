'use client';

import React, { useState, useEffect } from 'react';
import { loadEvents, saveEvent, deleteEvent } from '@/lib/event-service';

export interface FamilyEvent {
  id: string;
  title: string;
  type: 'birthday' | 'reunion' | 'commemoration' | 'meeting';
  date: string; // YYYY-MM-DD
  time?: string;
  timeOfDay?: 'pagi' | 'siang' | 'sore' | 'malam';
  targetGenerations?: number[]; // [1, 2, 3]
  location: string;
  description: string;
  organizer: string;
}

export const EventsView: React.FC = () => {
  const [events, setEvents] = useState<FamilyEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initEvents() {
      setIsLoading(true);
      const data = await loadEvents();
      setEvents(data);
      setIsLoading(false);
    }
    initEvents();
  }, []);
  const [viewMode, setViewMode] = useState<'grid' | 'default' | 'heatmap'>('grid');

  // Active Month & Year (Default to August 2026)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(7); // 7 = August

  // Mini Calendar Selection
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Type Filters Checkbox
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    'birthday',
    'reunion',
    'commemoration',
    'meeting',
  ]);

  // Generation Filters Checkbox
  const [selectedGenerations, setSelectedGenerations] = useState<number[]>([1, 2, 3]);

  // Time of Day Filters Checkbox (24-Hour Coverage: Pagi, Siang, Sore, Malam)
  const [selectedTimeOfDays, setSelectedTimeOfDays] = useState<string[]>(['pagi', 'siang', 'sore', 'malam']);

  const [selectedEventDetail, setSelectedEventDetail] = useState<FamilyEvent | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Editing state for existing events
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  // New Event Form State
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'birthday' | 'reunion' | 'commemoration' | 'meeting'>('reunion');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newTimeOfDay, setNewTimeOfDay] = useState<'pagi' | 'siang' | 'sore' | 'malam'>('pagi');
  const [newTargetGenerations, setNewTargetGenerations] = useState<number[]>([1, 2, 3]);
  const [newLocation, setNewLocation] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newOrganizer, setNewOrganizer] = useState('Panitia Keluarga');

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const shortMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  const daysOfWeek = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Ming'];

  // Calendar calculations (Mon-Sun grid)
  const getFirstDayOfMonthMon = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // convert Sun=0 to Mon=0
  };

  const firstDayOfMonth = getFirstDayOfMonthMon(currentYear, currentMonth);
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

  const formatDateStr = (year: number, month: number, day: number) => {
    const m = (month + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  // Event matching helper function (24-Hour Breakdown: Pagi: 05-11, Siang: 11-15, Sore: 15-18, Malam: 18-05)
  const matchesEvent = (evt: FamilyEvent) => {
    const matchesType = selectedTypes.includes(evt.type);

    // Generation filter overlap check
    const eventGens = evt.targetGenerations && evt.targetGenerations.length > 0 ? evt.targetGenerations : [1, 2, 3];
    const matchesGen = eventGens.some((g) => selectedGenerations.includes(g));

    // Time of Day filter check (24h)
    let tod = evt.timeOfDay;
    if (!tod && evt.time) {
      const hour = parseInt(evt.time.split(':')[0], 10);
      if (!isNaN(hour)) {
        if (hour >= 5 && hour < 11) tod = 'pagi';
        else if (hour >= 11 && hour < 15) tod = 'siang';
        else if (hour >= 15 && hour < 18) tod = 'sore';
        else tod = 'malam';
      }
    }
    const matchesTod = !tod || selectedTimeOfDays.includes(tod);

    return matchesType && matchesGen && matchesTod;
  };

  const getEventsForDay = (day: number) => {
    const targetDate = formatDateStr(currentYear, currentMonth, day);
    return events.filter((evt) => evt.date === targetDate && matchesEvent(evt));
  };

  const toggleTypeFilter = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const toggleGenerationFilter = (gen: number) => {
    if (selectedGenerations.includes(gen)) {
      setSelectedGenerations(selectedGenerations.filter((g) => g !== gen));
    } else {
      setSelectedGenerations([...selectedGenerations, gen]);
    }
  };

  const toggleTimeOfDayFilter = (tod: string) => {
    if (selectedTimeOfDays.includes(tod)) {
      setSelectedTimeOfDays(selectedTimeOfDays.filter((t) => t !== tod));
    } else {
      setSelectedTimeOfDays([...selectedTimeOfDays, tod]);
    }
  };

  const filteredEvents = events.filter((evt) => {
    const matches = matchesEvent(evt);
    if (selectedDay) {
      const selectedDateStr = formatDateStr(currentYear, currentMonth, selectedDay);
      return matches && evt.date === selectedDateStr;
    }
    return matches;
  });

  const handleOpenAddModal = () => {
    setEditingEventId(null);
    setNewTitle('');
    setNewType('reunion');
    setNewDate('');
    setNewTime('');
    setNewTimeOfDay('pagi');
    setNewTargetGenerations([1, 2, 3]);
    setNewLocation('');
    setNewDescription('');
    setNewOrganizer('Panitia Keluarga');
    setIsAddModalOpen(true);
  };

  const handleEditEventClick = (event: FamilyEvent) => {
    setEditingEventId(event.id);
    setNewTitle(event.title);
    setNewType(event.type);
    setNewDate(event.date);
    setNewTime(event.time || '');
    setNewTimeOfDay(event.timeOfDay || 'pagi');
    setNewTargetGenerations(event.targetGenerations || [1, 2, 3]);
    setNewLocation(event.location);
    setNewDescription(event.description);
    setNewOrganizer(event.organizer);
    setSelectedEventDetail(null);
    setIsAddModalOpen(true);
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const eventDate = newDate || formatDateStr(currentYear, currentMonth, selectedDay || 15);

    if (editingEventId) {
      const updatedEvt: FamilyEvent = {
        id: editingEventId,
        title: newTitle,
        type: newType,
        date: eventDate,
        time: newTime || '10:00 WIB',
        timeOfDay: newTimeOfDay,
        targetGenerations: newTargetGenerations,
        location: newLocation || 'Kediaman Keluarga',
        description: newDescription,
        organizer: newOrganizer,
      };

      setEvents(events.map((e) => (e.id === editingEventId ? updatedEvt : e)));
      setIsAddModalOpen(false);
      setEditingEventId(null);
      await saveEvent(updatedEvt);
    } else {
      const newEvt: FamilyEvent = {
        id: 'evt_' + Date.now(),
        title: newTitle,
        type: newType,
        date: eventDate,
        time: newTime || '10:00 WIB',
        timeOfDay: newTimeOfDay,
        targetGenerations: newTargetGenerations,
        location: newLocation || 'Kediaman Keluarga',
        description: newDescription,
        organizer: newOrganizer,
      };

      setEvents([newEvt, ...events]);
      setIsAddModalOpen(false);
      await saveEvent(newEvt);
    }

    setNewTitle('');
    setNewDescription('');
    setNewLocation('');
    setNewDate('');
  };

  const handleDeleteEvent = async (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
    setSelectedEventDetail(null);
    await deleteEvent(id);
  };

  const getEventBadge = (type: FamilyEvent['type']) => {
    switch (type) {
      case 'birthday':
        return { label: 'Ulang Tahun', bg: 'bg-[#fed65b] text-[#745c00]', border: 'border-[#fed65b]', icon: 'cake' };
      case 'reunion':
        return { label: 'Reuni & Arisan', bg: 'bg-[#8e1616] text-white', border: 'border-[#8e1616]', icon: 'groups' };
      case 'commemoration':
        return { label: 'Haul & Ziarah', bg: 'bg-[#003921] text-white', border: 'border-[#003921]', icon: 'diversity_1' };
      default:
        return { label: 'Pertemuan', bg: 'bg-[#eae8e4] text-[#1f1d1d]', border: 'border-[#e8dfd5]', icon: 'event' };
    }
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] bg-[#fbf9f5] parchment-grid p-4 md:p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-5 pb-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#efeeea] border border-[#e8dfd5] p-4 rounded-lg shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-[#8e1616] font-bold text-xs uppercase tracking-widest mb-1">
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
              <span>Calendar Dashboard</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-[#8e1616] font-['Poppins']">
              Kalender & Agenda Keluarga
            </h1>
            <p className="text-xs text-[#59413e]">
              Jadwal kegiatan silaturahmi, reuni trah, ulang tahun, dan haul ziarah leluhur.
            </p>
          </div>

          {/* Top Control Bar & Mode Pills */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex bg-[#eae8e4] p-1 rounded-lg border border-[#e8dfd5] text-xs font-semibold">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'grid' ? 'bg-[#8e1616] text-white shadow-sm' : 'text-[#59413e] hover:text-[#8e1616]'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">calendar_view_month</span>
                Grid Bulanan
              </button>
              <button
                onClick={() => setViewMode('default')}
                className={`px-3 py-1.5 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'default' ? 'bg-[#8e1616] text-white shadow-sm' : 'text-[#59413e] hover:text-[#8e1616]'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">view_timeline</span>
                List Timeline
              </button>
              <button
                onClick={() => setViewMode('heatmap')}
                className={`px-3 py-1.5 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'heatmap' ? 'bg-[#8e1616] text-white shadow-sm' : 'text-[#59413e] hover:text-[#8e1616]'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">grid_on</span>
                Heatmap
              </button>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 bg-[#8e1616] text-white font-bold text-xs uppercase tracking-wider rounded hover:bg-[#731010] transition-colors shadow flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Tambah Agenda
            </button>
          </div>
        </div>

        {/* MAIN CALENDAR DASHBOARD TWO-COLUMN LAYOUT */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT PANEL: MINI CALENDAR PICKER & CHECKLIST FILTERS (Width: 3/12 cols) */}
            <div className="lg:col-span-3 space-y-4">
              {/* Mini Calendar Picker Card */}
              <div className="bg-[#fbf9f5] border border-[#e8dfd5] rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-center mb-3 border-b border-[#e8dfd5] pb-2">
                  <button
                    onClick={handlePrevMonth}
                    className="p-1 rounded text-[#8e1616] hover:bg-[#eae8e4] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  </button>
                  <span className="font-bold text-xs text-[#8e1616] font-['Poppins'] uppercase tracking-wider">
                    {monthNames[currentMonth]} {currentYear}
                  </span>
                  <button
                    onClick={handleNextMonth}
                    className="p-1 rounded text-[#8e1616] hover:bg-[#eae8e4] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                </div>

                {/* Mini Grid Header */}
                <div className="grid grid-cols-7 text-center font-bold text-[10px] text-[#59413e] mb-1">
                  <span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span>
                </div>

                {/* Mini Grid Days */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
                    <div key={`m_empty_${idx}`} className="py-1 text-gray-300"></div>
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, idx) => {
                    const dayNum = idx + 1;
                    const isSelected = selectedDay === dayNum;
                    const hasEvt = getEventsForDay(dayNum).length > 0;

                    return (
                      <button
                        key={`m_day_${dayNum}`}
                        onClick={() => setSelectedDay(isSelected ? null : dayNum)}
                        className={`py-1 rounded font-semibold text-[11px] transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#8e1616] text-[#fed65b] font-bold shadow-sm'
                            : hasEvt
                            ? 'bg-[#fed65b]/40 text-[#8e1616] font-bold border border-[#8e1616]'
                            : 'hover:bg-[#eae8e4] text-[#1f1d1d]'
                        }`}
                      >
                        {dayNum}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status Filter Checklist Panel (Icons instead of emojis) */}
              <div className="bg-[#fbf9f5] border border-[#e8dfd5] rounded-xl p-4 shadow-sm space-y-3">
                <h3 className="font-bold text-xs text-[#8e1616] uppercase tracking-wider font-['Poppins'] border-b border-[#e8dfd5] pb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">filter_list</span>
                  <span>Kategori Agenda</span>
                </h3>

                <div className="space-y-2 text-xs">
                  {[
                    { id: 'birthday', label: 'Ulang Tahun', icon: 'cake', iconColor: 'text-[#d4af37]', count: events.filter(e => e.type === 'birthday').length },
                    { id: 'reunion', label: 'Reuni & Arisan', icon: 'groups', iconColor: 'text-[#8e1616]', count: events.filter(e => e.type === 'reunion').length },
                    { id: 'commemoration', label: 'Haul & Ziarah', icon: 'diversity_1', iconColor: 'text-[#003921]', count: events.filter(e => e.type === 'commemoration').length },
                    { id: 'meeting', label: 'Pertemuan Rutin', icon: 'event', iconColor: 'text-[#59413e]', count: events.filter(e => e.type === 'meeting').length },
                  ].map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center justify-between p-2 rounded bg-white border border-[#e8dfd5] cursor-pointer hover:bg-[#eae8e4] transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes(item.id)}
                          onChange={() => toggleTypeFilter(item.id)}
                          className="accent-[#8e1616]"
                        />
                        <span className={`material-symbols-outlined text-[16px] ${item.iconColor}`}>{item.icon}</span>
                        <span className="font-semibold text-[#1f1d1d]">{item.label}</span>
                      </span>
                      <span className="text-[10px] font-bold bg-[#8e1616] text-white px-1.5 py-0.5 rounded-full">
                        {item.count}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Accordion Filter Options */}
              <div className="bg-[#fbf9f5] border border-[#e8dfd5] rounded-xl p-4 shadow-sm space-y-2 text-xs text-[#59413e]">
                <details className="group border-b border-[#e8dfd5] pb-2" open>
                  <summary className="font-bold cursor-pointer flex justify-between items-center text-[#8e1616]">
                    <span>Generasi (Gen 1 - Gen 3)</span>
                    <span className="material-symbols-outlined text-[16px]">expand_more</span>
                  </summary>
                  <div className="mt-2 pl-2 space-y-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedGenerations.includes(1)}
                        onChange={() => toggleGenerationFilter(1)}
                        className="accent-[#8e1616]"
                      />
                      <span>Generasi 1 (Tetua)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedGenerations.includes(2)}
                        onChange={() => toggleGenerationFilter(2)}
                        className="accent-[#8e1616]"
                      />
                      <span>Generasi 2 (Kepala Branch)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedGenerations.includes(3)}
                        onChange={() => toggleGenerationFilter(3)}
                        className="accent-[#8e1616]"
                      />
                      <span>Generasi 3 (Penerus)</span>
                    </label>
                  </div>
                </details>

                <details className="group border-b border-[#e8dfd5] pb-2 pt-1" open>
                  <summary className="font-bold cursor-pointer flex justify-between items-center text-[#8e1616]">
                    <span>Waktu Pelaksanaan</span>
                    <span className="material-symbols-outlined text-[16px]">expand_more</span>
                  </summary>
                  <div className="mt-2 pl-2 space-y-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTimeOfDays.includes('pagi')}
                        onChange={() => toggleTimeOfDayFilter('pagi')}
                        className="accent-[#8e1616]"
                      />
                      <span>Pagi (05:00 - 11:00)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTimeOfDays.includes('siang')}
                        onChange={() => toggleTimeOfDayFilter('siang')}
                        className="accent-[#8e1616]"
                      />
                      <span>Siang (11:00 - 15:00)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTimeOfDays.includes('sore')}
                        onChange={() => toggleTimeOfDayFilter('sore')}
                        className="accent-[#8e1616]"
                      />
                      <span>Sore (15:00 - 18:00)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTimeOfDays.includes('malam')}
                        onChange={() => toggleTimeOfDayFilter('malam')}
                        className="accent-[#8e1616]"
                      />
                      <span>Malam (18:00 - 05:00)</span>
                    </label>
                  </div>
                </details>
              </div>
            </div>

            {/* RIGHT PANEL: FULL MONTH GRID WITH WEEK NUMBERS (Width: 9/12 cols) */}
            <div className="lg:col-span-9 bg-[#fbf9f5] border-2 border-[#8e1616] rounded-xl p-5 shadow-lg space-y-4">
              {/* Full Grid Controls Header */}
              <div className="flex justify-between items-center bg-[#efeeea] border border-[#e8dfd5] px-4 py-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrevMonth}
                    className="p-1.5 rounded-full bg-[#fbf9f5] border border-[#e8dfd5] text-[#8e1616] hover:bg-[#8e1616] hover:text-white transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                  </button>
                  <h2 className="text-lg font-bold text-[#8e1616] font-['Poppins'] uppercase tracking-widest">
                    {monthNames[currentMonth]} {currentYear}
                  </h2>
                  <button
                    onClick={handleNextMonth}
                    className="p-1.5 rounded-full bg-[#fbf9f5] border border-[#e8dfd5] text-[#8e1616] hover:bg-[#8e1616] hover:text-white transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                  </button>
                </div>

                {selectedDay && (
                  <button
                    onClick={() => setSelectedDay(null)}
                    className="px-3 py-1 bg-[#fed65b] text-[#745c00] rounded font-bold text-xs flex items-center gap-1 shadow-sm hover:opacity-90 cursor-pointer"
                  >
                    <span>Filter: Tanggal {selectedDay}</span>
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                )}
              </div>

              {/* Grid Header with Week Column (W) + Mon-Sun */}
              <div className="grid grid-cols-8 gap-1.5 text-center font-bold text-xs text-[#8e1616] bg-[#eae8e4] py-2 rounded">
                <div className="text-[#59413e]/70">W</div>
                {daysOfWeek.map((dayName, idx) => (
                  <div key={idx} className={idx === 6 ? 'text-[#ba1a1a]' : ''}>
                    {dayName}
                  </div>
                ))}
              </div>

              {/* Large Month Cells Grid (8 columns: W + 7 Days) */}
              <div className="grid grid-cols-8 gap-1.5">
                {/* Week 1 Row */}
                <div className="h-28 bg-[#eae8e4]/60 border border-[#e8dfd5] rounded flex items-center justify-center font-bold text-xs text-[#59413e]">
                  W1
                </div>
                {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
                  <div key={`lg_empty_${idx}`} className="h-28 bg-[#fbf9f5]/50 border border-[#e8dfd5]/40 rounded opacity-40"></div>
                ))}

                {Array.from({ length: daysInMonth }).map((_, idx) => {
                  const dayNum = idx + 1;
                  const isSelected = selectedDay === dayNum;
                  const dayEvents = getEventsForDay(dayNum);
                  const hasEvents = dayEvents.length > 0;

                  return (
                    <React.Fragment key={`lg_cell_frag_${dayNum}`}>
                      {/* Insert Week number badge after every 7 day cells */}
                      {(firstDayOfMonth + idx) % 7 === 0 && idx > 0 && (
                        <div className="h-28 bg-[#eae8e4]/60 border border-[#e8dfd5] rounded flex items-center justify-center font-bold text-xs text-[#59413e]">
                          W{Math.floor((firstDayOfMonth + idx) / 7) + 1}
                        </div>
                      )}

                      <div
                        onClick={() => setSelectedDay(isSelected ? null : dayNum)}
                        className={`h-28 p-2 border rounded-lg flex flex-col justify-between transition-all duration-150 cursor-pointer overflow-hidden relative ${
                          isSelected
                            ? 'bg-[#8e1616] text-white border-2 border-[#fed65b] shadow-md scale-[1.02] z-10'
                            : hasEvents
                            ? 'bg-[#efeeea] border-2 border-[#8e1616]/70 hover:bg-[#e4e2de]'
                            : 'bg-[#fbf9f5] border-[#e8dfd5] hover:bg-[#eae8e4]'
                        }`}
                      >
                        {/* Day Number Header */}
                        <div className="flex justify-between items-center border-b border-[#e8dfd5]/40 pb-1">
                          <span className={`font-bold text-xs ${isSelected ? 'text-[#fed65b]' : 'text-[#1f1d1d]'}`}>
                            {dayNum}
                          </span>
                          {hasEvents && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#8e1616] text-[#fed65b]">
                              {dayEvents.length} Event
                            </span>
                          )}
                        </div>

                        {/* Events Badges inside Day Cell */}
                        <div className="space-y-1 overflow-y-auto max-h-[70px] text-[10px] my-auto">
                          {dayEvents.map((evt) => {
                            const badge = getEventBadge(evt.type);
                            return (
                              <div
                                key={evt.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedEventDetail(evt);
                                }}
                                className={`p-1 rounded font-semibold truncate cursor-pointer hover:opacity-90 transition-opacity flex items-center gap-1 ${
                                  isSelected ? 'bg-[#fed65b] text-[#745c00]' : badge.bg
                                }`}
                                title={`${evt.title} - ${evt.time}`}
                              >
                                <span className="material-symbols-outlined text-[12px] shrink-0">{badge.icon}</span>
                                <span className="truncate">{evt.title}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* DEFAULT VIEW MODE: CLEAN TIMELINE CARDS LIST */}
        {viewMode === 'default' && (
          <div className="space-y-4">
            <div className="bg-[#fbf9f5] border border-[#e8dfd5] p-3 rounded-lg flex justify-between items-center text-xs">
              <span className="font-bold text-[#8e1616] uppercase tracking-wider font-['Poppins'] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
                <span>Daftar List Agenda Timeline</span>
              </span>
              <span className="text-[#59413e]">Menampilkan {filteredEvents.length} Acara</span>
            </div>

            {filteredEvents.map((evt) => {
              const badge = getEventBadge(evt.type);
              return (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEventDetail(evt)}
                  className="bg-[#fbf9f5] border border-[#e8dfd5] rounded-lg p-5 shadow-sm hover:shadow transition-all flex flex-col md:flex-row gap-5 items-start border-l-4 border-l-[#8e1616] cursor-pointer"
                >
                  <div className="bg-[#efeeea] border border-[#e8dfd5] p-3 rounded text-center shrink-0 min-w-[100px]">
                    <div className="text-[11px] font-bold text-[#8e1616] uppercase tracking-wider">
                      {shortMonthNames[new Date(evt.date).getMonth()]}
                    </div>
                    <div className="text-2xl font-bold text-[#8e1616] font-['Poppins']">
                      {new Date(evt.date).getDate()}
                    </div>
                    <div className="text-[10px] text-[#59413e] font-semibold mt-0.5">
                      {new Date(evt.date).getFullYear()}
                    </div>
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-bold text-base text-[#8e1616] font-['Poppins']">
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
          </div>
        )}

        {/* HEATMAP VIEW MODE: DENSITY GRID */}
        {viewMode === 'heatmap' && (
          <div className="bg-[#fbf9f5] border-2 border-[#8e1616] rounded-xl p-6 shadow-lg space-y-4 text-center">
            <h3 className="font-bold text-base text-[#8e1616] font-['Poppins'] uppercase tracking-wider flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[#8e1616]">local_fire_department</span>
              <span>Heatmap Kepadatan Agenda Keluarga {currentYear}</span>
            </h3>
            <p className="text-xs text-[#59413e]">Visualisasi intensitas kegiatan dan pertemuan keluarga sepanjang tahun.</p>

            <div className="grid grid-cols-4 md:grid-cols-6 gap-3 pt-4">
              {monthNames.map((mName, mIdx) => {
                const count = events.filter(e => new Date(e.date).getMonth() === mIdx).length;
                return (
                  <div
                    key={mName}
                    onClick={() => {
                      setCurrentMonth(mIdx);
                      setViewMode('grid');
                    }}
                    className={`p-4 rounded-lg border text-center transition-all cursor-pointer ${
                      count > 2
                        ? 'bg-[#8e1616] text-white border-[#fed65b]'
                        : count > 0
                        ? 'bg-[#fed65b]/40 text-[#8e1616] border-[#8e1616]'
                        : 'bg-[#efeeea] text-[#59413e] border-[#e8dfd5]'
                    }`}
                  >
                    <div className="font-bold text-xs uppercase">{mName}</div>
                    <div className="text-xl font-bold font-['Poppins'] mt-1">{count} Acara</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
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
                <h3 className="font-bold text-base text-[#8e1616] font-['Poppins']">
                  Rincian Agenda Keluarga
                </h3>
                <p className="text-xs text-[#59413e]">{selectedEventDetail.date}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <h2 className="text-lg font-bold text-[#8e1616] font-['Poppins']">
                {selectedEventDetail.title}
              </h2>

              <p className="text-[#1f1d1d] bg-[#eae8e4] p-3 rounded border border-[#e8dfd5] leading-relaxed">
                {selectedEventDetail.description}
              </p>

              <div className="space-y-1.5 text-[#59413e] pt-1 font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#8e1616]">schedule</span>
                  <span>Waktu: <strong>{selectedEventDetail.time} {selectedEventDetail.timeOfDay ? `(${selectedEventDetail.timeOfDay.toUpperCase()})` : ''}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#8e1616]">family_history</span>
                  <span>Target Generasi: <strong>Gen {selectedEventDetail.targetGenerations ? selectedEventDetail.targetGenerations.join(', Gen ') : '1, 2, 3'}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#8e1616]">location_on</span>
                  <span>Lokasi: <strong>{selectedEventDetail.location}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#8e1616]">person</span>
                  <span>Penyelenggara: <strong>{selectedEventDetail.organizer}</strong></span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-[#e8dfd5]">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleEditEventClick(selectedEventDetail)}
                    className="px-3 py-1.5 bg-[#8e1616] text-white font-bold text-xs uppercase rounded flex items-center gap-1 hover:bg-[#6b0f0f] transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">edit</span>
                    <span>Edit Agenda</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteEvent(selectedEventDetail.id)}
                    className="px-3 py-1.5 bg-[#ba1a1a] text-white font-bold text-xs uppercase rounded flex items-center gap-1 hover:bg-[#93000a] transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">delete</span>
                    <span>Hapus</span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedEventDetail(null)}
                  className="px-4 py-1.5 bg-[#eae8e4] text-[#59413e] hover:bg-[#e4e2de] font-bold text-xs uppercase rounded cursor-pointer"
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
                <h3 className="font-bold text-base text-[#8e1616] font-['Poppins']">
                  {editingEventId ? 'Edit Agenda / Peringatan' : 'Tambah Agenda / Peringatan Baru'}
                </h3>
                <p className="text-xs text-[#59413e]">
                  {editingEventId ? 'Ubah rincian acara atau jadwal kegiatan.' : 'Jadwalkan reuni, arisan, atau peringatan ulang tahun/haul.'}
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
                    Waktu Pelaksanaan
                  </label>
                  <select
                    value={newTimeOfDay}
                    onChange={(e) => setNewTimeOfDay(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-[#e8dfd5] rounded text-sm text-[#1f1d1d] focus:outline-none focus:border-[#8e1616]"
                  >
                    <option value="pagi">Pagi (05:00 - 11:00)</option>
                    <option value="siang">Siang (11:00 - 15:00)</option>
                    <option value="sore">Sore (15:00 - 18:00)</option>
                    <option value="malam">Malam (18:00 - 05:00)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
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

                <div>
                  <label className="block font-semibold text-[#59413e] uppercase tracking-wider mb-1">
                    Penyelenggara
                  </label>
                  <input
                    type="text"
                    value={newOrganizer}
                    onChange={(e) => setNewOrganizer(e.target.value)}
                    placeholder="Nama penyelenggara"
                    className="w-full px-3 py-2 bg-white border border-[#e8dfd5] rounded text-sm text-[#1f1d1d] focus:outline-none focus:border-[#8e1616]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#59413e] uppercase tracking-wider mb-1">
                  Target Generasi (Centang yang berlaku)
                </label>
                <div className="flex items-center gap-4 bg-white p-2 border border-[#e8dfd5] rounded">
                  {[1, 2, 3].map((gen) => (
                    <label key={gen} className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold">
                      <input
                        type="checkbox"
                        checked={newTargetGenerations.includes(gen)}
                        onChange={() => {
                          if (newTargetGenerations.includes(gen)) {
                            setNewTargetGenerations(newTargetGenerations.filter((g) => g !== gen));
                          } else {
                            setNewTargetGenerations([...newTargetGenerations, gen]);
                          }
                        }}
                        className="accent-[#8e1616]"
                      />
                      <span>Gen {gen}</span>
                    </label>
                  ))}
                </div>
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
                  {editingEventId ? 'Simpan Perubahan' : 'Simpan Agenda'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
