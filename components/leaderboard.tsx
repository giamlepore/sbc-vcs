import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface LeaderboardEntry {
  id: string
  name: string | null
  points: number
}

interface LeaderboardProps {
  currentUserId?: string
}

export function Leaderboard({ currentUserId }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => setLeaderboard(data))
  }, [])

  const formatName = (name: string | null): string => {
    if (!name || name.length <= 6) return name || 'Anonymous';
    return `${name.slice(0, 3)}...${name.slice(-3)}`;
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-indigo-400 font-sans tracking-tight sm:text-xl">Leaderboard</h2>
      <ul className="space-y-2">
        {leaderboard.map((entry, index) => (
          <motion.li
            key={entry.id}
            className={`flex items-center justify-between p-2 rounded-lg ${
              entry.id === currentUserId ? 'bg-green-700' : 'bg-gray-700'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center">
              <span className="text-2xl font-bold text-indigo-300 mr-4">{index + 1}</span>
              <span className={`${entry.id === currentUserId ? 'text-white' : 'text-gray-200'}`}>
                {formatName(entry.name)}
              </span>
            </div>
            <span className={`font-bold ${entry.id === currentUserId ? 'text-white' : 'text-indigo-400'}`}>
              {entry.points} points
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
