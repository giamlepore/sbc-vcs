import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

interface CourseCompletion {
  completedAt: Date;
  moduleId: number;
  courseId: number;
}

function calculateStreak(completions: CourseCompletion[]): number {
  let currentStreak = 0;
  let lastCompletionDate: Date | null = null;

  completions.sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const completion of completions) {
    const completionDate = new Date(completion.completedAt);
    completionDate.setHours(0, 0, 0, 0);

    if (!lastCompletionDate) {
      currentStreak = 1;
      lastCompletionDate = completionDate;
    } else {
      const dayDifference = (lastCompletionDate.getTime() - completionDate.getTime()) / (1000 * 3600 * 24);

      if (dayDifference === 1) {
        currentStreak++;
        lastCompletionDate = completionDate;
      } else if (dayDifference > 1) {
        break;
      }
    }
  }

  const daysSinceLastCompletion = lastCompletionDate
    ? (today.getTime() - lastCompletionDate.getTime()) / (1000 * 3600 * 24)
    : Infinity;

  if (daysSinceLastCompletion > 1) {
    currentStreak = 0;
  }

  return currentStreak;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        courseCompletions: {
          select: {
            completedAt: true,
            moduleId: true,
            courseId: true
          },
          orderBy: {
            completedAt: 'desc'
          }
        }
      },
    });

    const leaderboardWithPoints = await Promise.all(users.map(async user => {
      const streak = calculateStreak(user.courseCompletions);
      let points = 0;

      // Create a Set of unique course completions
      const uniqueCompletions = new Set(user.courseCompletions.map(completion => 
        `${completion.moduleId}-${completion.courseId}`
      ));

      uniqueCompletions.forEach(() => {
        if (streak < 2) {
          // 5 points per unique course for no streak or streak < 2
          points += 5;
        } else if (streak >= 2 && streak < 10) {
          // Additional points for streaks between 2 and 9
          points += 5 + streak - 1;
        } else if (streak >= 10) {
          // Maximum 15 points per course for streaks of 10 or more
          points += 15;
        }
      });

      // Cap at 20 points per completed course
      const maxPointsPerCourse = 20;
      points = Math.min(points, uniqueCompletions.size * maxPointsPerCourse);

      return {
        id: user.id,
        name: user.name,
        points: points
      };
    }));

    const sortedLeaderboard = leaderboardWithPoints
      .sort((a, b) => b.points - a.points)
      .slice(0, 10);

    res.status(200).json(sortedLeaderboard);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}