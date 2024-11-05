import { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { motion, AnimatePresence } from 'framer-motion'

interface Completion {
  id: string
  userId: string
  moduleId: number
  courseId: number
  completedAt: string
  user: {
    name: string
  }
}

interface Module {
  courses: {
    title: string;
    // outros campos necessários
  }[];
}

interface RecentCompletionsProps {
  modules: Module[];
}

const pulseAnimation = {
  animate: {
    opacity: [1, 0, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  },
}

export function RecentCompletions({ modules }: RecentCompletionsProps) {
  const [recentCompletions, setRecentCompletions] = useState<Completion[]>([])

  useEffect(() => {
    fetchRecentCompletions()
  }, [])

  const fetchRecentCompletions = async () => {
    try {
      const response = await fetch('/api/recent-completions')
      const data = await response.json()
      setRecentCompletions(data)
    } catch (error) {
      console.error('Error fetching recent completions:', error)
    }
  }

  const getFirstName = (name: string | null) => {
    if (!name) return 'Usuário'
    return name.split(' ')[0]
  }

  const getCourseTitle = (moduleId: number, courseId: number) => {
    if (modules[moduleId]?.courses[courseId]) {
      return modules[moduleId].courses[courseId].title;
    }
    return 'Aula não encontrada';
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-200 text-base sm:text-xl">
          Atividade Recente
        </h2>

        <div className="flex items-center text-xs text-gray-400">
          <span>Atualizando em tempo real</span>
          <motion.span
            className="ml-1 text-green-500"
            {...pulseAnimation}
          >
            •
          </motion.span>
        </div>
      </div>

      <AnimatePresence>
        <div className="space-y-3">
          {recentCompletions.map((completion) => (
            <motion.div
              key={completion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col text-gray-300 text-sm sm:text-base"
            >
              <div className="flex items-center">
                <span className="font-semibold text-indigo-400">
                  {getFirstName(completion.user.name)}
                </span>
                <span className="mx-2">terminou</span>
                <span className="font-medium truncate">
                  {getCourseTitle(completion.moduleId, completion.courseId)}
                </span>
              </div>
              <span className="mx-2 text-gray-400">
                há {formatDistanceToNow(new Date(completion.completedAt), { 
                  locale: ptBR,
                  addSuffix: false 
                })}
              </span>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  )
}