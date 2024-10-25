import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { Calendar } from '@/components/ui/calendar';

interface CourseCompletion {
  completedAt: string;
}

export function UserStats() {
  const { data: session } = useSession();
  const [streak, setStreak] = useState(0);
  const [completionDates, setCompletionDates] = useState<Date[]>([]);
  const [lastCompletionDate, setLastCompletionDate] = useState<Date | null>(null);

  useEffect(() => {
    if (session?.user?.email) {
      fetchUserStats();
    }
  }, [session]);

  const fetchUserStats = async () => {
    const response = await fetch(`/api/user-stats?userEmail=${session?.user?.email}`);
    const data = await response.json();
    calculateStreak(data.completions);
    setCompletionDates(data.completions.map((completion: CourseCompletion) => new Date(completion.completedAt)));
    setLastCompletionDate(data.completions.length > 0 ? new Date(data.completions[0].completedAt) : null);
  };

  const calculateStreak = (completions: CourseCompletion[]) => {
    let currentStreak = 0;
    let maxStreak = 0;
    let lastDate: Date | null = null;

    completions.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

    for (const completion of completions) {
      const currentDate = new Date(completion.completedAt);
      
      if (!lastDate || isConsecutiveDay(currentDate, lastDate)) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }

      lastDate = currentDate;
    }

    setStreak(maxStreak);
  };

  const isConsecutiveDay = (date1: Date, date2: Date) => {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1;
  };

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-white">Your Stats</h2>
      <div className="mb-4 sm:mb-6">
        <p className="text-base sm:text-lg text-white">Current Streak: <span className="font-bold text-indigo-400">{streak} days</span></p>
        {lastCompletionDate && (
          <p className="text-sm text-gray-400 mt-2">
            Last lesson completed: {lastCompletionDate.toLocaleDateString()} at {lastCompletionDate.toLocaleTimeString()}
          </p>
        )}
      </div>
      <div className="w-full">
  <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">Days with lessons completed</h3>
  <div className="w-full">
          <Calendar
            mode="multiple"
            selected={completionDates}
            className="rounded-md border w-full"
    />
  </div>
</div>
    </div>
  );
}