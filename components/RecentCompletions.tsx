import { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { motion, AnimatePresence } from 'framer-motion'

interface Course {
  title: string;
}

interface Module {
  courses: Course[];
}

interface Activity {
  id: string
  type: 'completion' | 'session'
  userId: string
  moduleId?: number
  courseId?: number
  timestamp: string
  user: {
    name: string
  }
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
  const [recentActivities, setRecentActivities] = useState<Activity[]>([])

  useEffect(() => {
    fetchRecentActivities()
  }, [])

  const fetchRecentActivities = async () => {
    try {
      const response = await fetch('/api/recent-completions')
      const data = await response.json()
      setRecentActivities(data)
    } catch (error) {
      console.error('Error fetching recent activities:', error)
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

  const renderActivityText = (activity: Activity) => {
    if (activity.type === 'completion') {
      return (
        <>
          <span className="mx-2">terminou</span>
          <span className="font-medium truncate">
            {getCourseTitle(activity.moduleId!, activity.courseId!)}
          </span>
        </>
      )
    } else {
      return <span className="mx-2">entrou na plataforma</span>
    }
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
        <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
          {recentActivities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col text-gray-300 text-sm sm:text-base"
            >
              <div className="flex items-center">
                <span className="font-semibold text-indigo-400">
                  {getFirstName(activity.user.name)}
                </span>
                {renderActivityText(activity)}
              </div>
              <span className="mx-2 text-gray-400">
                há {formatDistanceToNow(new Date(activity.timestamp), { 
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