import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Tooltip } from 'react-tooltip'
import { Loader2 } from 'lucide-react'

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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        setLeaderboard(data)
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Error fetching leaderboard:', error)
        setIsLoading(false)
      })
  }, [])

  const formatName = (name: string | null): string => {
    if (!name || name.length <= 6) return name || 'Anonymous';
    return `${name.slice(0, 3)}...${name.slice(-3)}`;
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg relative min-h-[200px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg relative">
      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      <div className="flex items-center mb-4">
        <h2 className="text-2xl font-bold text-indigo-400 font-sans tracking-tight sm:text-xl">Leaderboard</h2>
      </div>
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
      
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-4 text-indigo-400 hover:text-indigo-300 transition-colors"
      >
        🤔 Não entendeu como funciona?
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md">
            <h3 className="text-xl font-bold text-indigo-400 mb-4">Como funciona o Leaderboard?</h3>
            <div className="text-gray-300 mb-4">
                <p>→ Você ganha pontos ao apertar o botão de "Mark as completed" embaixo de cada aula.</p>
                
                <p>→ Você ganha mais pontos se estiver em uma sequência. </p>
                    
                <p>→ Por exemplo, se você estiver em uma sequência 2 dias, ao invés de 5 pontos, você ganha 6 pontos.</p>

                <p>→ O limite é 15 pontos (ou seja, uma sequência de 16 dias). A partir disso, se você mantiver a sua sequência, continuará ganhando 15 pontos por aula concluída.</p>
            
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
