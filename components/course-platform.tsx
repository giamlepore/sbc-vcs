'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Home, BookOpen, CheckSquare, BarChart2, ChevronRight, ChevronLeft, ChevronDown, Play, Check, X, Gamepad2 } from 'lucide-react'
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { useSession, signIn, signOut } from "next-auth/react"
import prisma from "@/lib/prisma"
import { Session } from 'next-auth';
import { SessionProvider } from "next-auth/react"
import { Leaderboard } from "@/components/leaderboard"
import { UserStats } from "@/components/UserStats"
import TechQuestions from "@/components/tech-questions"
import { RecentCompletions } from "@/components/RecentCompletions"
interface CustomSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

interface Task {
  title: string;
  completed: boolean;
  link?: string;
}

const modules = [
  {
    title: '(VCs) Módulo 01: O básico de tech para Venture Capital',
    courses: [
      { title: 'Aula #01 - Expectativas e quem é o professor?', image: '/m01intro.png', video: 'https://player.vimeo.com/video/1022894607?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #02 - Planejamento do curso', image: '/m01intro.png', video: 'https://player.vimeo.com/video/1022894767?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #03 - Análise de Pitch Deck, Tempo para Leitura', image: '/m01intro.png', video: 'https://player.vimeo.com/video/1022894865?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #04 - Discussão do Deck', image: '/m01intro.png', video: 'https://player.vimeo.com/video/1022895087?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #05 - Tech + Inovação', image: '/m01intro.png', video: 'https://player.vimeo.com/video/1022895342?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #06 - Tech + Escalonamento', image: '/m01intro.png', video: 'https://player.vimeo.com/video/1022898317?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #07 - Diferentes Tipos de Empresas Tech', image: '/m01intro.png', video: 'https://player.vimeo.com/video/1022909242?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #08 - Valuation + Tech', image: '/m01intro.png', video: 'https://player.vimeo.com/video/1022909121?badge=0&amp;autopause=0&amp;player_id=0&amp' },
    ],
    tasks: [
      { title: 'Acesse o pitch deck clicando aqui', link: 'https://drive.google.com/file/d/16N0rvwNy2ggcp0zK2ivGwZWQjntuTChw/view?usp=drive_link', completed: false },
      { title: 'Mande suas perguntas técnicas do deck clicando aqui', link: 'https://tally.so/r/w8pZEo', completed: false },
      { title: 'Avalie a aula clicando aqui', link: 'https://tally.so/r/w4NJAr', completed: false },
      { title: 'Leia o artigo "50 conceitos técnicos para VCs" na seção Articles na Home', completed: false },


    ]
  },

  {
    title: '(VCs) Módulo 02: O Stack Tecnológico',
    courses: [
      { title: 'Aula #09 | Introdução Stack Tecnológico', image: '/m2-stack.png', video: 'https://player.vimeo.com/video/1025445109?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #10 | Bancos de Dados Intro', image: '/m2-stack.png', video: 'https://player.vimeo.com/video/1025445243?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #11 | Testes, Versionamento e Containers', image: '/m2-stack.png', video: 'https://player.vimeo.com/video/1025445456?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #12 | Dinâmica e Stacks Comuns', image: '/m2-stack.png', video: 'https://player.vimeo.com/video/1025446364?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #13 | Frameworks e Stacks em Grandes Empresas', image: '/m2-stack.png', video: 'https://player.vimeo.com/video/1025449190?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #14 | Influência da Stack na Startup', image: '/m2-stack.png', video: 'https://player.vimeo.com/video/1025452190?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #15 | Planilha de Questões e Flags', image: '/m2-stack.png', video: 'https://player.vimeo.com/video/1025454014?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #16 | Ferramentas para o dia a dia do VC', image: '/m2-stack.png', video: 'https://player.vimeo.com/video/1025455338?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #17 | Conclusão e Encerramento', image: '/m2-stack.png', video: 'https://player.vimeo.com/video/1025468744?badge=0&amp;autopause=0&amp;player_id=0&amp' },
    ],
    tasks: [
      { title: 'Busque startups do seu portfólio (investidas ou não), e investigue as escolhas de tecnologia. Por que foram feitas? Tiveram impacto positivo ou negativo para o crescimento da startup?', completed: false },
      { title: 'Agora faça uma análise das tecnologias com as perguntas do Tech Questions por estágio, para evidenciar green, yellow e red flagas, e a qualidade das tecnologias escolhidas.', completed: false },
      { title: 'Clique no botão acima: (Beta) Tech Questions por estágio, e aprofunde', completed: false },
      { title: 'Avalie o módulo 2 clicando aqui', link: 'https://tally.so/r/nPB8QV', completed: false },
      { title: 'Leia o artigo "Backend" na seção Articles na Home', completed: false },
      { title: 'Acesse a apresentação do Módulo 02. Ao abrir, clique novamente em "Abra o documento diretamente"', link: 'https://drive.google.com/file/d/1Jg_2QJB7ro0nsmeknIt3JkaWTj8jYfY3/view?usp=sharing', completed: false },


    ]
  },

  {
    title: '(VCs) Módulo 03: Produtos, Análises de Roadmap e Tecnologia',
    courses: [
      { title: 'Aula #18 | Como a tecnologia apoia o processo de busca pelo PMF?', image: '/m3-vcs.png', video: 'https://player.vimeo.com/video/1030829584?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #19 | O que é o processo de desenvolvimento?', image: '/m3-vcs.png', video: 'https://player.vimeo.com/video/1030832775?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #20 | Como avaliar valor para o usuário', image: '/m3-vcs.png', video: 'https://player.vimeo.com/video/1030835186?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #21 | Análise de Roadmap', image: '/m3-vcs.png', video: 'https://player.vimeo.com/video/1030841045?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #22 | Diferença entre must-have e nice-to-have', image: '/m3-vcs.png', video: 'https://player.vimeo.com/video/1030839262?badge=0&amp;autopause=0&amp;player_id=0&amp' },
    ],
    tasks: [
      { title: 'No tasks', completed: false },


    ]
  },
  

  {
    title: 'Bônus (Tech PM) | Módulo 01: Como a Internet Funciona?',
    courses: [
      { title: 'Aula #01 - O que é esperado aqui nesse módulo? Qual a expectativa?', image: '/m1.png', video: 'https://player.vimeo.com/video/1016265685?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #02 - O que é a internet?', image: '/m1.png', video: 'https://player.vimeo.com/video/1016265764?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #03 - Tecnologias por trás da internet', image: '/m1.png', video: 'https://player.vimeo.com/video/1016265897?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #04 - Banda e Latência', image: '/m1.png', video: 'https://player.vimeo.com/video/1016266097?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #05 - Web além do endereço de browser', image: '/m1.png', video: 'https://player.vimeo.com/video/1016266177?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #06 (Prática) - DNS na prática com Google DNS', image: '/m1.png', video: 'https://player.vimeo.com/video/1016266528?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #07 (Prática) - Por que é útil saber disso tudo?', image: '/m1.png', video: 'https://player.vimeo.com/video/1016266562?badge=0&amp;autopause=0&amp;player_id=0&amp' },
    ],
    tasks: [
      { title: 'Em breve', completed: false },
    ]
  },
  {
    title: 'Bônus (Tech PM) | Módulo 02: Construindo Software',
    courses: [
      { title: 'Aula #08 - Introdução Módulo 2', image: '/m2.png', video: 'https://player.vimeo.com/video/1016266732?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #09 - O ciclo de desenvolvimento de software', image: '/m2.png', video: 'https://player.vimeo.com/video/1016266810?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #10 - O projeto que vamos criar do zero', image: '/m2.png', video: 'https://player.vimeo.com/video/1016266955?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #11 - Especificação e refinamento (parte 1)', image: '/m2.png', video: 'https://player.vimeo.com/video/1016267057?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #12 - Especificação e Refinamento (Parte 2)', image: '/m2.png', video: 'https://player.vimeo.com/video/1016807202?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #13 - Configurando o ambiente de desenvolvimento (parte 01)', image: '/m2.png', video: 'https://player.vimeo.com/video/1016267183?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #14 - Configurando o ambiente de desenvolvimento (parte 02)', image: '/m2.png', video: 'https://player.vimeo.com/video/1016267548?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #15 - VSCode + Docker', image: '/m2.png', video: 'https://player.vimeo.com/video/1016267999?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #16 - Solucionando bugs na prática', image: '/m2.png', video: 'https://player.vimeo.com/video/1016268288?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #17 - Sistema de Controle de Versão (Parte 01)', image: '/m2.png', video: 'https://player.vimeo.com/video/1016268870?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #18 - Sistema de Controle de Versão (Parte 02)', image: '/m2.png', video: 'https://player.vimeo.com/video/1016269079?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #19 - Testes Automatizados (Parte 01)', image: '/m2.png', video: 'https://player.vimeo.com/video/1016269241?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #20 - Testes Automatizados (Parte 02)', image: '/m2.png', video: 'https://player.vimeo.com/video/1016269463?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #21 - Integração e Implantação', image: '/m2.png', video: 'https://player.vimeo.com/video/1016270242?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #22 - Operação e Manutenção', image: '/m2.png', video: 'https://player.vimeo.com/video/1016270419?badge=0&amp;autopause=0&amp;player_id=0&amp' },
    ],
    tasks: [
      { title: 'Sem tarefas, por enquanto', completed: false },
    ]
  },
  
  {
    title: 'Bônus (Tech PM) | Módulo 03: Conceitos de básicos de programação para se tornar um "PM full-stack"',
    courses: [
      { title: 'Aula #23 - Pontos importantes em Programação', image: '/m3.png', video: 'https://player.vimeo.com/video/1016270619?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #24 - Você realmente entende o que é "front-end"?', image: '/m3.png', video: 'https://player.vimeo.com/video/1016270903?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #25 - HTML Fundamentos e por que é importante?', image: '/m3.png', video: 'https://player.vimeo.com/video/1016271213?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #26 - HTML Fundamentos II', image: '/m3.png', video: 'https://player.vimeo.com/video/1016271382?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #27 - HTML Fundamentos Final', image: '/m3.png', video: 'https://player.vimeo.com/video/1016271583?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #28 - CSS Parte I', image: '/m3.png', video: 'https://player.vimeo.com/video/1016272033?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #29 - CSS Parte II', image: '/m3.png', video: 'https://player.vimeo.com/video/1016272246?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #30 - CSS Prática I', image: '/m3.png', video: 'https://player.vimeo.com/video/1016272358?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #31 - CSS Prática II', image: '/m3.png', video: 'https://player.vimeo.com/video/1016272479?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #32 - CSS Prática III', image: '/m3.png', video: 'https://player.vimeo.com/video/1016272627?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #33 - CSS Prática IV', image: '/m3.png', video: 'https://player.vimeo.com/video/1016272780?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #34 - JavaScript Parte I', image: '/m3.png', video: 'https://player.vimeo.com/video/1016272918?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #35 - JavaScript Parte II', image: '/m3.png', video: 'https://player.vimeo.com/video/1016273016?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #36 - JavaScript Parte III', image: '/m3.png', video: 'https://player.vimeo.com/video/1016273258?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #37 - JavaScript Parte IV', image: '/m3.png', video: 'https://player.vimeo.com/video/1016273354?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #38 - JavaScript Parte V', image: '/m3.png', video: 'https://player.vimeo.com/video/1016275226?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #39 - JavaScript Parte VI', image: '/m3.png', video: 'https://player.vimeo.com/video/1016276385?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #40 - JavaScript Final', image: '/m3.png', video: 'https://player.vimeo.com/video/1016276541?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #41 - Compartilhamento (Extra)', image: '/m3.png', video: 'https://player.vimeo.com/video/1016276753?badge=0&amp;autopause=0&amp;player_id=0&amp' },
    ],
    tasks: [
      { title: 'Sem tarefas, por enquanto', completed: false },
    ]
  },
  {
    title: 'Bônus (Tech PM) | Módulo 04: Bancos de Dados',
    courses: [
      { title: 'Aula #042 - Bancos de Dados, o básico', image: '/m4.png', video: 'https://player.vimeo.com/video/1016276876?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #043 - Tipos de Bancos de Dados I', image: '/m4.png', video: 'https://player.vimeo.com/video/1016276967?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #044 - Tipos de Bancos de Dados II', image: '/m4.png', video: 'https://player.vimeo.com/video/1016277061?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #045 - Modelagem de Dados I', image: '/m4.png', video: 'https://player.vimeo.com/video/1016277311?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #046 - Modelagem de Dados II', image: '/m4.png', video: 'https://player.vimeo.com/video/1016277459?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #047 - Modelagem de Dados III', image: '/m4.png', video: 'https://player.vimeo.com/video/1016277556?badge=0&amp;autopause=0&amp;player_id=0&amp' },
    ],
    tasks: [
      { title: 'Sem tarefas, por enquanto', completed: false },
    ]
  },
  {
    title: 'Bônus (Tech PM) | Módulo 05: APIs',
    courses: [
      { title: 'Aula #050 - Introdução a APIs', image: '/m5.png', video: 'https://player.vimeo.com/video/1027817537?badge=0&amp;autopause=0&amp;player_id=0&amp' }, 
      { title: 'Aula #051 - Pra que serve uma API? E sua relação com Organizações', image: '/m5.png', video: 'https://player.vimeo.com/video/1027821623?badge=0&amp;autopause=0&amp;player_id=0&amp' }, 
      { title: 'Aula #052 - Funcionamentos das APIs', image: '/m5.png', video: 'https://player.vimeo.com/video/1027823880?badge=0&amp;autopause=0&amp;player_id=0&amp' }, 
      { title: 'Aula #053 - Refatorando um Monolito', image: '/m5.png', video: 'https://player.vimeo.com/video/1027824176?badge=0&amp;autopause=0&amp;player_id=0&amp' }, 
      { title: 'Aula #054 - Aprofundando um pouco mais', image: '/m5.png', video: 'https://player.vimeo.com/video/1027839704?badge=0&amp;autopause=0&amp;player_id=0&amp' }, 
      { title: 'Aula #055 - Tipos de APIs', image: '/m5.png', video: 'https://player.vimeo.com/video/1029441260?badge=0&amp;autopause=0&amp;player_id=0&amp' }, 
      { title: 'Aula #056 - Tecnologias e Ferramentas relevantes', image: '/m5.png', video: 'https://player.vimeo.com/video/1029705931?badge=0&amp;autopause=0&amp;player_id=0&amp' }, 
    ],
    tasks: [
      { title: 'Sem tarefas, por enquanto', completed: false },
    ]
  },
]

const shorts = [
  { title: 'Tech for VCs - Welcome', duration: '0:22', video2: 'https://player.vimeo.com/video/1022247390?autoplay=1&loop=1&muted=1&autopause=0', video: 'https://player.vimeo.com/video/1022247390?autoplay=1' },
]

const articles = [
  { title: 'Entendendo sobre Backend', image: '/backend.png', slug: 'understanding-tech-stacks' },
  { title: '50 conceitos técnicos para VCs', image: '/50-conceitos.png', slug: '50-conceitos' },
  { title: 'ChatGPT Evolução', image: '/chatgptparar.png', slug: 'chatgpt-evolucao' },
  { title: 'Frameworks, o que são?', image: '/frameworks.png', slug: 'frameworks' },
  // { title: 'The Future of AI in VC', image: '/article2.jpg', slug: 'future-of-ai-in-vc' },
  // Add more articles as needed
]

export function CoursePlatform() {
  return (
    <SessionProvider>
      <CoursePlatformContent />
    </SessionProvider>
  )
}

function CoursePlatformContent() {
  const { data: session } = useSession() as { data: CustomSession | null }
  const [currentModule, setCurrentModule] = useState(0)
  const [currentCourse, setCurrentCourse] = useState(0)
  const [completedCourses, setCompletedCourses] = useState<{[key: number]: number[]}>({})
  const [activeTab, setActiveTab] = useState('Home 🏠')
  const [showVideo, setShowVideo] = useState(false)
  const [currentShort, setCurrentShort] = useState(0)
  const [isSwiping, setIsSwiping] = useState(false)
  const [showShortVideo, setShowShortVideo] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const shortsRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [showCheckAnimation, setShowCheckAnimation] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [lastUncompletedCourse, setLastUncompletedCourse] = useState<{ moduleIndex: number, courseIndex: number } | null>(null)
  const [showWebView, setShowWebView] = useState(false)
  const [webViewUrl, setWebViewUrl] = useState('')
  const [showTechQuestions, setShowTechQuestions] = useState(false)
  
  

  useEffect(() => {
    if (session?.user) {
      loadUserProgress()
    }
    setMounted(true)
  }, [session])

  const loadUserProgress = async () => {
    if (session?.user?.id) {
      const progress = await fetch(`/api/progress?userId=${session.user.id}`).then(res => res.json())
      setCompletedCourses(progress)
      findLastUncompletedCourse(progress)
  
      // Atualizar a última sessão do usuário
      await fetch('/api/user-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
        }),
      })
    }
  }

  const findLastUncompletedCourse = (progress: {[key: number]: number[]}) => {
    for (let i = modules.length - 1; i >= 0; i--) {
      const moduleProgress = progress[i] || []
      for (let j = modules[i].courses.length - 1; j >= 0; j--) {
        if (!moduleProgress.includes(j)) {
          setLastUncompletedCourse({ moduleIndex: i, courseIndex: j })
          return
        }
      }
    }
    setLastUncompletedCourse(null)
  }

  const getModuleProgress = (moduleIndex: number) => {
    const moduleCompletedCourses = completedCourses[moduleIndex] || [];
    const totalCoursesInModule = modules[moduleIndex].courses.length;
    return Math.min((moduleCompletedCourses.length / totalCoursesInModule) * 100, 100);
  };

  const handleComplete = async () => {
    setShowCheckAnimation(true)
    if (session?.user?.id) {
      // Registrar o progresso
      await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          moduleId: currentModule,
          courseId: currentCourse,
        }),
      })
  
      // Registrar a conclusão do curso
      await fetch('/api/course-completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          moduleId: currentModule,
          courseId: currentCourse,
        }),
      })
    }
  
    setCompletedCourses(prev => {
      const currentCompleted = new Set(prev[currentModule] || []);
      currentCompleted.add(currentCourse);
      return {
        ...prev,
        [currentModule]: Array.from(currentCompleted)
      };
    })
  
    setTimeout(() => {
      setShowCheckAnimation(false)
      moveToNextLesson()
    }, 1000)
  }

  const moveToNextLesson = () => {
    const currentModuleCourses = modules[currentModule].courses
    if (currentCourse < currentModuleCourses.length - 1) {
      setCurrentCourse(currentCourse + 1)
    } else if (currentModule < modules.length - 1) {
      setCurrentModule(currentModule + 1)
      setCurrentCourse(0)
    } else {
      setShowVideo(false)
      setActiveTab('My Progres ⏳')
    }
    findLastUncompletedCourse(completedCourses)
  }

  const progress = Object.values(completedCourses).flat().length / modules.reduce((acc, module) => acc + module.courses.length, 0) * 100

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'light')
  }

  const renderVideoPlayer = (videoUrl: string) => {
    if (videoUrl.includes('vimeo')) {
      return (
        <iframe
          src={videoUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        ></iframe>
      )
    } else {
      return (
        <video
          className="w-full h-full"
          src={videoUrl}
          controls
        />
      )
    }
  }

  const handleSwipe = (direction: 'up' | 'down') => {
    if (direction === 'up' && currentShort < shorts.length - 1) {
      setIsSwiping(true)
      setTimeout(() => {
        setCurrentShort(currentShort + 1)
        setIsSwiping(false)
      }, 300)
    } else if (direction === 'down' && currentShort > 0) {
      setIsSwiping(true)
      setTimeout(() => {
        setCurrentShort(currentShort - 1)
        setIsSwiping(false)
      }, 300)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      handleSwipe('up')
    }

    if (touchStart - touchEnd < -50) {
      handleSwipe('down')
    }
  }

  const renderCourseVideos = () => {
    const currentModuleCourses = modules[currentModule].courses
    const previousVideos = currentModuleCourses.slice(0, currentCourse)
    const nextVideos = currentModuleCourses.slice(currentCourse + 1)
    
    return (
      <div className="mt-6 space-y-6">
        {nextVideos.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold mb-4 text-gray-200 font-sans">Next in this module:</h3>
            <ul className="space-y-2">
              {nextVideos.map((course, index) => (
                <li key={index} className="flex items-center p-2 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors duration-300" onClick={() => {
                  setCurrentCourse(currentCourse + index + 1)
                }}>
                  <Play className="h-5 w-5 text-blue-500 flex-shrink-0 mr-2" />
                  <span className="text-gray-200 font-sans flex-grow truncate">{course.title}</span>
                  {/* <span className="text-sm text-gray-400 ml-auto font-sans">{course.duration}</span> */}
                  <div className="h-5 w-5 flex-shrink-0 ml-2" /> {/* Placeholder to maintain consistent spacing */}
                </li>
              ))}
            </ul>
          </div>
        )}
        {previousVideos.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold mb-4 text-gray-200 font-sans">Previous in this module:</h3>
            <ul className="space-y-2">
              {previousVideos.map((course, index) => (
                <li key={index} className="flex items-center p-2 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors duration-300" onClick={() => {
                  setCurrentCourse(index)
                }}>
                  <Play className="h-5 w-5 text-blue-500 flex-shrink-0 mr-2" />
                  <span className="text-gray-200 font-sans flex-grow truncate">{course.title}</span>
                  {/* <span className="text-sm text-gray-400 ml-auto font-sans">{course.duration}</span> */}
                  {completedCourses[currentModule]?.includes(index) ? (
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 ml-2" />
                  ) : (
                    <div className="h-5 w-5 flex-shrink-0 ml-2" /> // Placeholder to maintain consistent spacing
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  const renderShorts = () => {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-200 font-sans">Shorts (Beta)</h2>
          <ChevronRight className="h-6 w-6 text-gray-400" />
        </div>
        <div 
          className="flex overflow-x-auto space-x-4 pb-4 cursor-grab"
          ref={shortsRef}
          onMouseDown={(e) => {
            setIsDragging(true)
            setStartX(e.pageX - shortsRef.current!.offsetLeft)
            setScrollLeft(shortsRef.current!.scrollLeft)
          }}
          onMouseLeave={() => setIsDragging(false)}
          onMouseUp={() => setIsDragging(false)}
          onMouseMove={(e) => {
            if (!isDragging) return
            e.preventDefault()
            const x = e.pageX - shortsRef.current!.offsetLeft
            const walk = (x - startX) * 2
            shortsRef.current!.scrollLeft = scrollLeft - walk
          }}
        >
          {shorts.map((short, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-32 bg-gray-800 rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-all duration-300"
              onClick={() => {
                setCurrentShort(index)
                setShowShortVideo(true)
              }}
            >
              <div className="relative aspect-[9/16]">
                <iframe
                src={short.video2}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              ></iframe>
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <Play className="h-8 w-8 text-white" />
                </div>
                <div className="absolute bottom-1 left-1 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded font-sans">
                  {short.duration}
                </div>
              </div>
              <div className="p-2">
                <h3 className="font-semibold text-xs truncate text-gray-200 font-sans">{short.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderAllShorts = () => {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {shorts.map((short, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-all duration-300"
            onClick={() => {
              setCurrentShort(index)
              setShowShortVideo(true)
            }}
          >
            <div className="relative aspect-[9/16]">
              <iframe
                src={short.video2}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              ></iframe>
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <Play className="h-12 w-12 text-white" />
              </div>
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded font-sans">
                {short.duration}
              </div>
            </div>
            <div className="p-2">
              <h3 className="font-semibold text-sm text-gray-200 font-sans">{short.title}</h3>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderArticles = () => {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-200 font-sans">Articles</h2>
          <ChevronRight className="h-6 w-6 text-gray-400" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {articles.map((article, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-all duration-300"
              onClick={() => {
                window.location.href = `/article/${article.slug}`
              }}
            >
              <div className="relative aspect-video">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-2">
                <h3 className="font-semibold text-sm text-gray-200 font-sans">{article.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderNextUncompletedCourse = () => {
    for (let moduleIndex = 0; moduleIndex < modules.length; moduleIndex++) {
      const chapter = modules[moduleIndex];
      for (let courseIndex = 0; courseIndex < chapter.courses.length; courseIndex++) {
        if (!completedCourses[moduleIndex]?.includes(courseIndex)) {
          const course = chapter.courses[courseIndex];
          return (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-200 font-sans">Continue de onde parou</h2>
              <div
                className="bg-gray-800 rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-all duration-300 md:max-w-2xl"
                onClick={() => {
                  setCurrentModule(moduleIndex)
                  setCurrentCourse(courseIndex)
                  setShowVideo(true)
                }}
              >
                <div className="relative aspect-video">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-200 font-sans">{course.title}</h3>
                  <p className="text-sm text-gray-400 font-sans">{chapter.title}</p>
                </div>
              </div>
            </div>
          )
        }
      }
    }
    return null
  }

  const openWebView = (url: string) => {
    setWebViewUrl(url)
    setShowWebView(true)
  }

  const WebViewModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl h-5/6 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">SBC SCHOOL</h3>
          <button onClick={() => setShowWebView(false)} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="flex-grow">
          <iframe src={webViewUrl} className="w-full h-full border-none" title="External Content" />
        </div>
      </div>
    </div>
  )

  if (!mounted) {
    return null
  }

  if (status === "loading") {
    return <div>Loading...</div>
  }
  
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200">
        <h1 className="text-4xl font-bold mb-8">Tech for VCs</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full px-4">
          <div className="bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 flex flex-col justify-between transform hover:scale-105">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Tech for VCs (Emerging + SBC)</h2>
              <p className="text-gray-400 mb-4">O primeiro curso do Brasil de Tech para Venture Capitalists.</p>
            </div>
            <Button 
              onClick={() => signIn('google')} 
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded self-end transition-colors duration-300"
            >
              Acessar curso
            </Button>
          </div>
          <div className="bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 flex flex-col justify-between transform hover:scale-105">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Como criar um produto do zero, sem sorte</h2>
              <p className="text-gray-400 mb-4">Projeto paralelo ou criando produtos do zero em empresas? Esse é o caminho.</p>
            </div>
            <Button 
              onClick={() => window.location.href = 'https://sbc-v6.vercel.app'}
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded self-end transition-colors duration-300"
            >
              Acessar curso
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-200">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center justify-between px-4 py-2">
          <h1 className="text-2xl font-bold text-white text-opacity-80 font-sans">SBC | Tech for VCs</h1>
          <div className="flex-1 mx-4">
            <div className="relative">
              {/* <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" /> */}
              {/* <Input className="pl-8 w-full bg-gray-700 text-gray-200 border-gray-600" placeholder="Search" /> */}
            </div>
          </div>
          {session ? (
            <Avatar onClick={() => signOut()} className="cursor-pointer">
              <AvatarImage src={session.user.image ?? undefined} alt={session.user.name ?? 'User'} />
              <AvatarFallback>{session.user.name?.[0] ?? 'U'}</AvatarFallback>
            </Avatar>
          ) : (
            <Button onClick={() => signIn('google')} className="bg-indigo-600 hover:bg-indigo-700">Sign In</Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 bg-gray-900 text-gray-200">
        {showVideo ? (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 font-sans tracking-tight sm:text-2xl">{modules[currentModule].courses[currentCourse].title}</h2>
            <div className="aspect-video bg-black mb-6 rounded-lg overflow-hidden">
              {renderVideoPlayer(modules[currentModule].courses[currentCourse].video)}
            </div>
            <div className="relative">
              <Button onClick={handleComplete} className="w-full bg-indigo-600 hover:bg-indigo-700">
                Mark as Completed (+5 pontos)
              </Button>
              {showCheckAnimation && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center bg-green-500 bg-opacity-75 rounded"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                >
                  <Check className="h-12 w-12 text-white" />
                </motion.div>
              )}
            </div>
            {renderCourseVideos()}
          </div>
        ) : showShortVideo ? (
          <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
            <div className="relative w-full h-full">
              <iframe
                className="w-full h-full object-cover"
                src={shorts[currentShort].video}
                frameBorder="0"
                allow="autoplay; fullscreen"
                allowFullScreen
                style={{ zIndex: 12 }}
              ></iframe>
              <div className="absolute top-4 right-4" style={{ zIndex: 11 }}>
                <Button variant="ghost" onClick={() => setShowShortVideo(false)}>
                  <X className="h-6 w-6 text-white" />
                </Button>
              </div>
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 animate-pulse" style={{ zIndex: 11 }}>
                <Button variant="ghost" onClick={() => setCurrentShort((currentShort - 1 + shorts.length) % shorts.length)}>
                  <ChevronLeft className="h-6 w-6 text-white bg-gray-800 rounded-full" />
                </Button>
              </div>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 animate-pulse" style={{ zIndex: 11 }}>
                <Button variant="ghost" onClick={() => setCurrentShort((currentShort + 1) % shorts.length)}>
                  <ChevronRight className="h-6 w-6 text-white bg-gray-800 rounded-full" />
                </Button>
              </div>
            </div>
          </div>
        ) : activeTab === 'Home 🏠' ? (
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8">
              <div className="md:col-span-1">
                {renderNextUncompletedCourse()}
              </div>
              <div className="md:col-span-1 flex items-center md:justify-center">
                <div className="w-full">
                  <RecentCompletions modules={modules} />
                </div>
              </div>
            </div>
            {modules.map((moduleItem, moduleIndex) => (
              <div key={moduleIndex} className="mb-4">
                <div 
                  className="flex items-center justify-between mb-4 bg-gray-800 bg-opacity-50 p-4 rounded-lg cursor-pointer"
                  onClick={() => {
                    setCurrentModule(currentModule === moduleIndex ? -1 : moduleIndex)
                    setShowVideo(false)
                  }}
                >
                  <h2 className={`text-lg sm:text-xl md:text-2xl font-bold font-sans tracking-tight ${currentModule === moduleIndex ? 'text-white' : 'text-white text-opacity-80'} ${currentModule === moduleIndex ? '' : 'truncate'} max-w-[70%]`}>
                    {moduleItem.title}
                  </h2>
                  <div className="flex-grow"></div>
                  <ChevronDown
                    className={`h-8 w-8 text-white transition-transform duration-200 ml-4 ${currentModule === moduleIndex ? 'transform rotate-180' : ''}`}
                  />
                </div>
                {currentModule === moduleIndex && (
                  <div className="space-y-4">
                    <motion.div
                      className="bg-blue-900 rounded-lg p-1"
                      initial={{ width: 0 }}
                      animate={{ width: `${getModuleProgress(moduleIndex)}%` }}
                      transition={{ duration: 1 }}
                    >
                      <span className="text-white font-bold">{Math.round(getModuleProgress(moduleIndex))}% Concluído</span>
                    </motion.div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {moduleItem.courses.map((course, courseIndex) => (
                        <div
                          key={courseIndex}
                          className="bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-300"
                          onClick={() => {
                            setCurrentCourse(courseIndex)
                            setShowVideo(true)
                          }}
                        >
                          <div className="relative aspect-video">
                            <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                              <Play className="h-8 w-8 text-white" />
                            </div>
                            {completedCourses[moduleIndex]?.includes(courseIndex) && (
                              <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                                <Check className="h-4 w-4 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="p-2">
                            <h3 className="font-semibold text-sm text-gray-300 font-sans">{course.title}</h3>
                            {/* <p className="text-xs text-gray-400">{course.duration}</p> */}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {renderShorts()}
            {renderArticles()}
          </div>
        ) : activeTab === 'Shorts 🔥' ? (
          <div className="max-w-6xl mx-auto">
            {renderAllShorts()}
          </div>
        ) : activeTab === '🎮' ? (
          <div className="max-w-6xl mx-auto">
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
                <div className="flex-1 md:max-w-md">
                  <UserStats />
                </div>
                <div className="flex-1 md:max-w-md">
                  <Leaderboard currentUserId={session?.user?.id} />
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'Tasks ☑️' ? (
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4 text-indigo-400 font-sans tracking-tight sm:text-xl">Tasks</h2>
              
              {/* Add the new button here */}
              <div className="bg-gray-800 p-4 rounded-lg mb-4">
                <Button 
                  onClick={() => setShowTechQuestions(true)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-300"
                >
                  📝 (Beta) Tech Questions por estágio
                </Button>
              </div>

              {modules.map((moduleItem, moduleIndex) => (
                <div key={moduleIndex} className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-xl font-bold mb-2 text-indigo-300 font-sans tracking-tight sm:text-lg">{moduleItem.title}</h3>
                  <ul className="space-y-2">
                    {moduleItem.tasks.map((task, taskIndex) => (
                      <li key={taskIndex} className="flex items-center space-x-2">
                        <Checkbox id={`task-${moduleIndex}-${taskIndex}`} />
                        <label htmlFor={`task-${moduleIndex}-${taskIndex}`} className="text-sm text-gray-300">
                          {task.link ? (
                            <button
                              onClick={() => openWebView(task.link!)}
                              className="text-blue-400 hover:underline"
                            >
                              {task.title}
                            </button>
                          ) : (
                            task.title
                          )}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'Progress ⏳' ? (
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4 text-white font-sans tracking-tight sm:text-xl">My Progress</h2>
              <div className="bg-gray-800 p-4 rounded-lg mb-6">
                <motion.div
                  className="bg-indigo-500 h-4 rounded-full mb-2"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1 }}
                />
                <p className="text-center text-lg font-semibold text-gray-400">{Math.round(progress)}% do curso concluído</p>
              </div>
            
              {modules.map((moduleItem, moduleIndex) => (
                <div key={moduleIndex} className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-xl font-bold mb-2 text-indigo-300 font-sans tracking-tight sm:text-lg">{moduleItem.title}</h3>
                  <motion.div
                    className="bg-green-300 h-2 rounded-full mb-2 max-w-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${getModuleProgress(moduleIndex)}%` }}
                    transition={{ duration: 1 }}
                  />
                  <p className="text-sm text-gray-400 mb-2">{Math.round(getModuleProgress(moduleIndex))}% Complete</p>
                  <ul className="space-y-2">
                    {moduleItem.courses.map((course, courseIndex) => (
                      <li key={courseIndex} className="flex items-center">
                        <div className="w-6 h-6 flex-shrink-0 mr-2">
                          {completedCourses[moduleIndex]?.includes(courseIndex) ? (
                            <Check className="h-6 w-6 text-green-500" />
                          ) : (
                            <div className="h-6 w-6 border border-gray-600 rounded-full" />
                          )}
                        </div>
                        <span className="text-gray-300 flex-grow">{course.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </main>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 bg-gray-800 border-t border-gray-700">
        <div className="flex justify-around py-2">
          {[
            { icon: Home, label: 'Home 🏠' },
            { icon: BookOpen, label: 'Shorts 🔥' },
            { icon: CheckSquare, label: 'Tasks ☑️' },
            { icon: BarChart2, label: 'Progress ⏳' },
            { icon: Gamepad2, label: '🎮' },
          ].map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className="flex flex-col items-center text-gray-400 hover:text-indigo-400"
              onClick={() => {
                setActiveTab(item.label)
                setShowVideo(false)
                setShowShortVideo(false)
              }}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </Button>
          ))}
        </div>
      </nav>

      {showWebView && <WebViewModal />}
      {showTechQuestions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg w-full max-w-4xl h-5/6 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-gray-200">Questões Para Análise Técnica</h3>
              <button onClick={() => setShowTechQuestions(false)} className="text-gray-400 hover:text-gray-200">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-grow overflow-auto">
              <TechQuestions />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

