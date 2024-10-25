import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { userEmail } = req.query;

    if (!userEmail || typeof userEmail !== 'string') {
      return res.status(400).json({ error: 'Invalid userEmail' });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email: userEmail },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const completions = await prisma.courseCompletion.findMany({
        where: { userId: user.id },
        select: { completedAt: true },
        orderBy: { completedAt: 'desc' },
      });

      res.status(200).json({ completions });
    } catch (error) {
      console.error('Error fetching user stats:', error);
      res.status(500).json({ error: 'Error fetching user stats' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}