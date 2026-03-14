"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

interface CustomDatePickerProps {
    value: string; // ISO string or empty
    onChange: (date: string) => void;
}

export function CustomDatePicker({ value, onChange }: CustomDatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(value ? new Date(value) : new Date());
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

    const handlePrevMonth = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const handleSelectDate = (day: number) => {
        const selectedDate = new Date(Date.UTC(currentMonth.getFullYear(), currentMonth.getMonth(), day));
        // Format as YYYY-MM-DD to match the previous native input structure
        const formattedDate = selectedDate.toISOString().split('T')[0];
        onChange(formattedDate);
        setIsOpen(false);
    };

    const isSelected = (day: number) => {
        if (!value) return false;
        const valDate = new Date(value);
        return (
            valDate.getUTCFullYear() === currentMonth.getFullYear() &&
            valDate.getUTCMonth() === currentMonth.getMonth() &&
            valDate.getUTCDate() === day
        );
    };

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const displayValue = value ? new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }) : "Select Race Date";

    return (
        <div className="relative group w-full" ref={dropdownRef}>
            <CalendarDays className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 z-10 transition-colors pointer-events-none ${isOpen ? 'text-brand-lime' : 'text-gray-500 group-hover:text-brand-lime'}`} />
            
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full bg-brand-midnight/50 hover:bg-brand-midnight rounded-xl border px-3 py-2.5 pl-10 text-sm outline-none transition-all text-left ${isOpen ? 'border-brand-lime text-white' : 'border-brand-surface-light text-gray-300'}`}
            >
                {displayValue}
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-full min-w-[300px] z-[99] bg-[#111116] border border-brand-surface-light rounded-2xl shadow-2xl p-4 animate-in fade-in slide-in-from-top-2">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <button onClick={handlePrevMonth} className="p-1 hover:bg-brand-surface-light rounded-lg text-gray-400 hover:text-white transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="text-white font-medium text-sm">
                            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </div>
                        <button onClick={handleNextMonth} className="p-1 hover:bg-brand-surface-light rounded-lg text-gray-400 hover:text-white transition-colors">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Days of Week */}
                    <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs text-gray-500 font-medium">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                            <div key={day}>{day}</div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {blanks.map(blank => (
                            <div key={`blank-${blank}`} className="p-2" />
                        ))}
                        {days.map(day => {
                            const selected = isSelected(day);
                            return (
                                <button
                                    key={day}
                                    onClick={() => handleSelectDate(day)}
                                    className={`
                                        p-2 rounded-lg text-sm w-full h-full aspect-square flex items-center justify-center transition-all
                                        ${selected 
                                            ? 'bg-brand-lime text-black font-bold shadow-[0_0_12px_rgba(204,255,0,0.5)]' 
                                            : 'text-gray-300 hover:bg-brand-surface-light hover:text-white'}
                                    `}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
