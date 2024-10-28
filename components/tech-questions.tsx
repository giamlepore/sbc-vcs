'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Flag, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Add these type definitions at the top of the file, after the imports
type Stage = 'early' | 'mid' | 'late'

interface Question {
  question: string
  objective: string
  responses: {
    early: {
      green: string
      yellow: string
      red: string
    }
    mid: {
      green: string
      yellow: string
      red: string
    }
    late: {
      green: string
      yellow: string
      red: string
    }
  }
}

// Update the questions array type
const questions: Question[] = [
  {
    question: "Existe uma stack padrão para cada contexto (frontend, backend, DB, etc)?",
    objective: "Objetivo: Entender se o tech-founder tem consciência de que padronização de stacks é um tradeoff entre inovação contínua e flexibilidade de rotação dos times.",
    responses: {
      early: {
        green: "Não (ok em early-mid stage).",
        yellow: "Ainda estamos decidindo qual stack adotar, ou Preferimos experimentar novas tecnologias o tempo todo.",
        red: "Usamos a tecnologia que achamos legal na hora."
      },
      mid: {
        green: "Não (ok em early-mid stage).",
        yellow: "Usamos stacks diferentes para cada equipe, não há uma padronização, ou Estamos considerando mudar toda a stack para acompanhar tendências de mercado.",
        red: "Não pensamos nisso, cada time define o que quer – ou – Não temos uma visão clara de tradeoffs de padronização."
      },
      late: {
        green: "Sim (ok em mid, esperado em late stage).",
        yellow: "Estamos em processo de padronização, mas ainda não concluímos – ou – Permitimos que alguns times usem stacks diferentes se houver uma justificativa.",
        red: "Não vemos valor em padronizar a stack. – ou Não temos tempo para pensar nisso agora, estamos focados apenas no crescimento."
      }
    }
  },
  {
    question: "Quais são os componentes principais do produto/sistema?",
    objective: "Objetivo: Evidenciar que os founders conseguem explicitar quais são os componentes mais importantes do produto/sistema e que tratam esses componentes com a devida importância.",
    responses: {
      early: {
        green: "Early stage: ainda não há muita clareza, respostas rasas e 'ainda não sabemos' é ok aqui. Uma tecnologia apontada como principal parte do sistema ou vantagem competitiva deve ser vista com ceticismo.",
        yellow: "Early stage: \"A principal parte do nosso sistema é a tecnologia X que usamos para backend/front-end.\" ou \"Ainda não pensamos nisso; estamos apenas construindo rápido.\"",
        red: "Early stage: \"Todo o sistema é importante e usamos uma abordagem única para tudo.\""
      },
      mid: {
        green: "Mid stage: há mais clareza sobre alguns componentes importantes, eles provavelmente vão estar fortemente acoplados ao banco de dados e relacionados a regras de negócio bem específicas.",
        yellow: "Mid stage: \"Os componentes principais mudam conforme crescemos, ainda não estamos certos sobre todos eles.\" ou \"Temos alguns componentes críticos, mas eles ainda estão muito acoplados ao sistema inteiro.\"",
        red: "Mid stage: \"Não temos uma ideia clara dos principais componentes ainda.\" ou \"Tudo é crítico, não há partes mais importantes.\""
      },
      late: {
        green: "Late stage: há muita clareza das partes mais importantes do sistema, devem estar isolados, instrumentados, passado por algumas reescritas/refatoração.",
        yellow: "Late stage: \"Sabemos quais são os componentes principais, mas ainda não isolamos tudo.\" ou \"Refatoramos alguns componentes importantes, mas ainda temos que fazer mais.\"",
        red: "Late stage: \"Não focamos em isolar componentes, ainda estamos crescendo rápido.\" ou \"Ainda não passamos por nenhuma refatoração significativa dos componentes principais.\""
      }
    }
  },
  {
    question: "Utilizam algum tipo de ferramenta No-code / low code em algum componente? Por que?",
    objective: "Objetivo: Evidenciar que os founders fizeram escolhas informadas em relação a ferramentas No-code e low-code, que podem acelerar o ciclo de desenvolvimento de protótipos, MVPs e novas funcionalidades no início, mas podem se tornar um problema em relação a escalabilidade, flexibilidade e custos conforme a empresa continue crescendo rapidamente.",
    responses: {
      early: {
        green: "Early e mid stage: é aceitável e até recomendável que partes não críticas do produto / sistema (como ferramentas internas, landing pages ou páginas institucionais).",
        yellow: "Early stage: \"Estamos utilizando no-code/low-code para partes críticas do sistema.\" ou \"Dependemos muito de plataformas no-code, mas estamos considerando migrar em breve.\"",
        red: "Early stage: \"Nosso sistema inteiro está baseado em ferramentas no-code.\" ou \"Não temos planos de migrar para soluções customizadas; estamos felizes com no-code para tudo.\""
      },
      mid: {
        green: "Early e mid stage: é aceitável e até recomendável que partes não críticas do produto / sistema (como ferramentas internas, landing pages ou páginas institucionais).",
        yellow: "Mid stage: \"Ainda usamos no-code para algumas partes críticas, mas sabemos que precisaremos mudar isso no futuro.\" ou \"Usamos no-code/low-code para muitas ferramentas internas, mas estamos começando a sentir os limites.\"",
        red: "Mid stage: \"Estamos aumentando nossa dependência de no-code para novos desenvolvimentos.\" ou \"Ainda estamos fortemente dependentes de plataformas no-code para funcionalidades críticas.\""
      },
      late: {
        green: "Late stage: a partir de certa escala a interdependência de serviços no-code / low-code começam a se tornar um risco para a flexibilidade, escalabilidade e até custos para a startup, então minimizar o uso dessas ferramentas é o recomendado nessa etapa.",
        yellow: "Late stage: \"Ainda temos algumas partes do sistema em no-code, mas estamos planejando migrar.\" ou \"No-code ainda é usado para muitas ferramentas internas, mas não temos planos claros para otimizar isso.\"",
        red: "Late stage: \"Não temos planos de migrar nossos componentes no-code, pois funciona bem o suficiente.\" ou \"Dependemos de no-code para várias partes do sistema e não vemos problema nisso.\""
      }
    }
  },
  {
    question: "Quais são as linguagens utilizadas nos componentes principais do produto/sistema? Por que essas linguagens foram escolhidas?",
    objective: "Objetivo: Garantir que o tech-founder fez uma escolha informada sobre as linguagens utilizadas em cada componente do sistema, mesmo que o motivo não seja exatamente técnico.",
    responses: {
      early: {
        green: "Early stage: afinidade, simplicidade, popularidade, modernidade são todas respostas válidas nessa etapa, mas o melhor é quando há uma resposta muito específica que possui lastro no valor do produto (ex. Elixir no WhatsApp)",
        yellow: "Early stage: \"Escolhemos as linguagens baseados no que cada desenvolvedor sabia na época.\" ou \"Usamos uma linguagem porque está na moda.\"",
        red: "Early stage: \"Não importa qual linguagem usamos, desde que funcione.\" ou \"Estamos usando uma combinação de várias linguagens que ainda estamos explorando.\""
      },
      mid: {
        green: "Mid stage: linguagens de propósito específico devem ser mais comuns, performance começa a ser algo levado em consideração, facilidade de contratação também, então linguagens conhecidas por serem performáticas e com grande comunidade são boas respostas nessa etapa",
        yellow: "Mid stage: \"Escolhemos linguagens baseadas apenas na afinidade dos desenvolvedores.\" ou \"Estamos pensando em mudar para uma linguagem mais moderna.\"",
        red: "Mid stage: \"Ainda não temos clareza sobre por que escolhemos as linguagens que usamos.\" ou \"Usamos várias linguagens para tudo, não temos um padrão.\""
      },
      late: {
        green: "Late stage: nessa etapa um padrão já deve estar claro (assim como os componentes mais importantes e exceções), a maioria das linguagens tem propósito específico claro e busca-se as melhores participantes da comunidade da linguagem em questão",
        yellow: "Late stage: \"Ainda estamos migrando algumas partes do sistema para uma linguagem mais adequada.\" ou \"Temos algumas linguagens em uso, mas ainda não temos um padrão claro.\"",
        red: "Late stage: \"Ainda usamos linguagens que ninguém mais na equipe domina completamente.\" ou \"Estamos considerando reescrever o sistema todo em uma nova linguagem.\""
      }
    }
  },
  {
    question: "Utilizam algum tipo framework em algum componente? Por que esses framework foram escolhidos / construídos?",
    objective: "Objetivo: Garantir que o tech-founder tenha feito escolhas conscientes em relação a frameworks, sendo 1st ou 3rd party, dependendo do momento e tipo de problema que o produto resolve.",
    responses: {
      early: {
        green: "Early e Mid stage: frameworks open-source, boilerplates com grande apoio de comunidades e frameworks que venceram os testes do tempo são boas respostas aqui, já que a velocidade de lançamento de features são importantes nessas etapas. 1st party frameworks devem ser vistos com extremo ceticismo.",
        yellow: "Early stage: \"Criamos nosso próprio framework desde o início.\" ou \"Estamos testando vários frameworks diferentes para encontrar o melhor.\"",
        red: "Early stage: \"Não usamos frameworks, preferimos construir tudo do zero.\" ou \"Usamos qualquer framework que achamos interessante no momento.\""
      },
      mid: {
        green: "Early e Mid stage: frameworks open-source, boilerplates com grande apoio de comunidades e frameworks que venceram os testes do tempo são boas respostas aqui, já que a velocidade de lançamento de features são importantes nessas etapas. 1st party frameworks devem ser vistos com extremo ceticismo.",
        yellow: "Mid stage: \"Estamos desenvolvendo nosso próprio framework porque achamos que pode ser melhor.\" ou \"Continuamos experimentando com diferentes frameworks em várias partes do sistema.\"",
        red: "Mid stage: \"Cada time usa o framework que quiser.\" ou \"Estamos pensando em construir um novo framework interno para substituir o que usamos atualmente.\""
      },
      late: {
        green: "Late stage: frameworks próprios começam a fazer mais sentido, porém ainda são arriscados. Padronização de frameworks é algo recomendado para possibilitar de rotacionar membros de times e para acelerar onboarding de novos membros. Auditoria e colaboração com frameworks e bibliotecas de terceiros são comuns nessa etapa.",
        yellow: "Late stage: \"Estamos considerando a introdução de nosso próprio framework em partes do sistema.\" ou \"Algumas equipes ainda usam diferentes frameworks, mas estamos tentando padronizar.\"",
        red: "Late stage: \"Ainda usamos frameworks que não são mais mantidos pela comunidade.\" ou \"Não temos nenhum tipo de padronização de frameworks e provavelmente não iremos padronizar.\""
      }
    }
  },
  {
    question: "Quais são os bancos de dados utilizados no produto / sistema? Que papeis cumprem? Por que esses bancos de dados foram escolhidos?",
    objective: "Objetivo: Evidenciar que o tech-founder tenha feito uma escolha consciente sobre o banco de dados que persistem os dados do produto, garantindo que o banco de dados atende ao paradigma dos dados em questão.",
    responses: {
      early: {
        green: "Poquíssimos bancos de dados relacionais (geralmente um), gerais e populares como MySQL, Sqlite, Postgres ou bancos de dados NoSQL populares como MongoDb e Redis (se atender um volume muito grande de requests é necessário). Nesse estágio é aceitável uma arquitetura monolítica em torno do banco de dados, para priorizar a velocidade de iterações rumo ao product-market fit.",
        yellow: "\"Estamos testando alguns bancos de dados diferentes para ver qual funciona melhor.\" ou \"Escolhemos o banco de dados X porque era fácil de configurar, mas não pensamos muito no futuro.\"",
        red: "\"Usamos vários bancos de dados desde o início.\" ou \"Escolhemos o banco de dados sem pesquisar as opções.\""
      },
      mid: {
        green: "Poucos bancos de dados relacionais, gerais e populares. Maior uso de bancos nao-relacionais como MongoDb, Redis e Couchdb para cache e isolamento de partes do produto. Nesse estágio é importante que o time esteja consciente dos problemas de escalabilidade e uma estratégia para quebra do monolito sem afetar a velocidade de inovação deve estar clara.",
        yellow: "\"Ainda estamos usando apenas um banco de dados relacional, não pensamos em escalar isso ainda.\" ou \"Adicionamos mais bancos de dados, mas sem uma estratégia clara.\"",
        red: "\"Continuamos com uma arquitetura monolítica sem problemas, mesmo com o aumento de escala.\" ou \"Estamos migrando entre bancos de dados sem uma estratégia clara.\""
      },
      late: {
        green: "Bancos single-purpose de vários tipos para resolver problemas específicos, isolados e se comunicando por meio de microserviços com poucas e simples regras de negócio.",
        yellow: "\"Ainda estamos considerando a separação de bancos de dados para diferentes partes do sistema.\" ou \"Usamos bancos de dados relacionais para tudo, mas estamos começando a considerar outras opções.\"",
        red: "\"Ainda usamos um banco de dados único para todos os nossos dados, independentemente do tipo.\" ou \"Não temos uma estratégia clara para gerenciar diferentes tipos de dados.\""
      }
    }
  },
  {
    question: "Quais são as ferramentas de teste unitários, integração e funcionais utilizadas?",
    objective: "Objetivo: Garantir que decisões conscientes estão sendo tomadas em relação à qualidade do código no produto / sistema.",
    responses: {
      early: {
        green: "Poucos testes e baixa cobertura de código é aceitável aqui em nome da velocidade de iteração rumo ao product-market fit (já que é comum partes do produto serem jogadas durante esse processo), mas alguma estrutura de testes é esperada (pelo menos integração e funcionais), assim como alguma estratégia para melhoria de contínua de qualidade (tem que ser incutido na cultura de engenharia).",
        yellow: "\"Planejamos adicionar testes mais tarde, mas agora não estamos priorizando isso.\"",
        red: "\"Não usamos nenhuma ferramenta de teste no momento.\" ou \"Confiamos nos desenvolvedores para testar manualmente.\""
      },
      mid: {
        green: "Alta cobertura de código (unit e integration) dos componentes mais importantes do produto é esperado, assim como uma cultura de responsabilidade sobre a qualidade do código entregue dos times de engenharia. Uma cobertura de código entre 40% e 60% é aceitável aqui.",
        yellow: "\"Temos testes unitários, mas a cobertura é baixa, por volta de 20%.\" ou \"Só fazemos testes de integração e funcionais, não focamos em testes unitários.\"",
        red: "\"Ainda não temos uma estratégia de testes bem definida.\" ou \"Não priorizamos testes; apenas lançamos rápido e corrigimos bugs em produção.\""
      },
      late: {
        green: "Cultura forte de responsabilidade e qualidade de código. Acima de 80% de cobertura de código em todos os componentes é esperado para garantir que o time continue evoluindo o sistema sem medo de introduzir bugs em produção.",
        yellow: "\"Estamos aumentando nossa cobertura de testes, mas ainda está em torno de 50%\"",
        red: "\"Confiamos muito em testes manuais para garantir a qualidade.\" ou \"Não monitoramos nossa cobertura de testes.\" ou \"Ainda estamos implementando ferramentas de teste.\""
      }
    }
  },
  {
    question: "Utilizam sistema de versionamento de código? Qual?",
    objective: "Objetivo: Garantir que o time de desenvolvimento use ferramentas de versionamento de código para permitir evoluções contínuas e ciclos rápidos com múltiplos desenvolvedores.",
    responses: {
      early: {
        green: "Em qualquer estágio os times devem estar usando alguma combinação como o git e github (ou gitlab, bitbucket). É extremamente importante que o desenvolvimento de simultaneo funcionalidade seja algo simples para qualquer tamanho de time.",
        yellow: "\"Estamos começando a usar o Git, mas nem todos na equipe estão familiarizados com ele ainda.\" ou \"Usamos Git, mas ainda estamos ajustando nosso processo de branch management.\"",
        red: "\"Ainda não usamos controle de versão, confiamos em backups manuais.\" ou \"Não usamos um sistema centralizado, cada desenvolvedor mantém sua própria versão.\""
      },
      mid: {
        green: "Em qualquer estágio os times devem estar usando alguma combinação como o git e github (ou gitlab, bitbucket). É extremamente importante que o desenvolvimento de simultaneo funcionalidade seja algo simples para qualquer tamanho de time.",
        yellow: "\"Usamos Git, mas não temos uma política definida de branches ou revisão de código.\" ou \"Nossa equipe está migrando para um sistema de controle de versão mais robusto.\"",
        red: "\"Ainda usamos o Git localmente, sem uma plataforma como GitHub ou GitLab.\" ou \"Alguns desenvolvedores não seguem o fluxo de versionamento.\""
      },
      late: {
        green: "Em qualquer estágio os times devem estar usando alguma combinação como o git e github (ou gitlab, bitbucket). É extremamente importante que o desenvolvimento de simultaneo funcionalidade seja algo simples para qualquer tamanho de time.",
        yellow: "\"Estamos migrando do Git para um sistema diferente que achamos que será melhor.\" ou \"Usamos Git, mas nem sempre seguimos as melhores práticas de controle de versão.\"",
        red: "\"Ainda não usamos um sistema de controle de versão consistente.\" ou \"Os desenvolvedores podem usar qualquer sistema de versionamento que preferirem.\""
      }
    }
  },
  {
    question: "Os componentes já estão compatíveis e configurados com containers (docker)?",
    objective: "Objetivo: Garantir que o processo de desenvolvimento seja previsível, tendo o comportamento de execução dos componentes reproduzível em qualquer lugar e evitando o famoso 'mas funciona na minha máquina'.",
    responses: {
      early: {
        green: "É aceitável que aplicações não dockerizadas existam no processo de desenvolvimento enquanto o time permanece pequeno e os ambientes de execução são ainda são facilmente gerenciáveis e reproduzíveis.",
        yellow: "\"Ainda não utilizamos Docker para todos os componentes, mas estamos começando a implementar.\" ou \"Usamos Docker em algumas partes, mas ainda dependemos de configurações manuais.\"",
        red: "\"Não usamos Docker, confiamos nas configurações manuais de cada desenvolvedor.\" ou \"Nunca pensamos em usar containers, ainda usamos ambientes locais diferentes.\""
      },
      mid: {
        green: "Componentes dockerizados devem ser um padrão de engenharia bem difundido, 100% dos componentes do sistema devem estar configurados e adaptados para execução containers.",
        yellow: "\"Ainda estamos no processo de migrar todos os componentes para Docker.\" ou \"Usamos Docker, mas não temos uma estratégia definida para todos os componentes.\"",
        red: "\"Ainda não dockerizamos nossos componentes, mas estamos pensando em começar.\" ou \"Cada desenvolvedor configura o ambiente da sua maneira.\""
      },
      late: {
        green: "Componentes dockerizados devem ser um padrão de engenharia bem difundido, 100% dos componentes do sistema devem estar configurados e adaptados para execução containers.",
        yellow: "\"Alguns componentes ainda não estão dockerizados, mas estamos trabalhando nisso.\" ou \"Usamos Docker, mas o processo de deployment ainda é parcialmente manual.\"",
        red: "\"Ainda não usamos Docker para nada.\" ou \"Estamos discutindo a possibilidade de adotar containers no futuro.\""
      }
    }
  },
  {
    question: "Quais ferramentas de BI / análise de dados usam?",
    objective: "Objetivo: Evidenciar as ferramentas utilizadas no processo contínuo de análise de dados e KPIs, para garantir que cada escolha é consciente de acordo com o momento e contexto de cada startup.",
    responses: {
      early: {
        green: "Queries direto nos BDs, análise de dados em planilhas do excel ou gsheet são completamente aceitáveis e até recomendados, já que a velocidade de experimentação, análise dos resultados e pivot são muito importantes nessa etapa.",
        yellow: "\"Fazemos algumas análises de dados, mas ainda não temos um processo estruturado.\" ou \"Dependemos apenas de intuição e experiência para decisões, não analisamos dados diretamente.\"",
        red: "\"Não analisamos dados ou usamos KPIs neste estágio.\" ou \"Ainda não temos acesso aos dados, vamos começar a coletar em breve.\""
      },
      mid: {
        green: "Ferramentas como PowerBI, Looker, Metabase e outros começam a ser recomendados graças ao aumento de demanda de análises e acompanhamento de KPIs das várias áreas de negócio da empresa.",
        yellow: "\"Ainda usamos planilhas para a maioria das análises, mas estamos pensando em adotar uma ferramenta de BI.\" ou \"Só uma equipe tem acesso aos dados, então as análises são limitadas.\"",
        red: "\"Ainda fazemos todas as análises manualmente e não temos planos para automatizar.\" ou \"Não temos uma estratégia clara para análise de dados, fazemos o que dá tempo.\""
      },
      late: {
        green: "Ferramentas como PowerBI, Looker, Metabase e outros começam a ser recomendados graças ao aumento de demanda de análises e acompanhamento de KPIs das várias áreas de negócio da empresa.",
        yellow: "\"Estamos em processo de implementação de ferramentas de BI, mas ainda dependemos de planilhas para boa parte das análises.\" ou \"Usamos BI para algumas áreas, mas muitas equipes ainda fazem análises ad hoc.\"",
        red: "\"Ainda não investimos em uma ferramenta de BI, estamos avaliando opções.\" ou \"Não temos um processo estabelecido para acompanhar KPIs regularmente.\""
      }
    }
  }
]

export default function TechQuestions() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [stage, setStage] = useState<Stage>('early')
  const [showTopics, setShowTopics] = useState(false) // Add this state

  // Add this handler function for topic selection
  const handleTopicSelect = (index: number) => {
    setCurrentQuestion(index)
  }

  // Add this handler function
  const handleStageChange = (value: string) => {
    setStage(value as Stage)
  }

  const handlePrevious = () => {
    setCurrentQuestion((prev) => (prev > 0 ? prev - 1 : prev))
  }

  const handleNext = () => {
    setCurrentQuestion((prev) => (prev < questions.length - 1 ? prev + 1 : prev))
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4 space-y-4">
      {/* Topics Section */}
      <div className="w-full max-w-4xl">
        <Button 
          onClick={() => setShowTopics(!showTopics)}
          className="w-full bg-gray-700 hover:bg-gray-600 mb-2 flex items-center justify-between"
        >
          <span>Navegue pelas perguntas ou escolha uma</span>
          {showTopics ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
        </Button>

        {showTopics && (
          <div className="bg-gray-700 p-4 rounded-lg mb-4">
            <div className="grid gap-2 md:grid-cols-2">
              {questions.map((q, index) => (
                <Button
                  key={index}
                  variant={currentQuestion === index ? "default" : "secondary"}
                  className={`text-left h-auto py-2 px-3 whitespace-normal ${
                    currentQuestion === index ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                  onClick={() => {
                    handleTopicSelect(index)
                    setShowTopics(false)
                  }}
                >
                  <span className="text-sm line-clamp-2">{index + 1}. {q.question}</span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Questionnaire Section */}
      <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-xl p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-green-400">Tech Stack Questionnaire</h2>
          <Select value={stage} onValueChange={handleStageChange}>
            <SelectTrigger className="w-[180px] bg-gray-700 border-gray-600">
              <SelectValue placeholder="Select stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="early">Early Stage</SelectItem>
              <SelectItem value="mid">Mid Stage</SelectItem>
              <SelectItem value="late">Late Stage</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">{questions[currentQuestion].question}</h3>
          <p className="text-gray-400 text-sm">{questions[currentQuestion].objective}</p>
          <div className="space-y-3">
            <div className="bg-gray-700 p-4 rounded-md">
              <div className="flex items-center space-x-2">
                <Flag className="text-green-400" />
                <span className="font-medium">Green Flag</span>
              </div>
              <p className="mt-2">{questions[currentQuestion].responses[stage].green}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-md">
              <div className="flex items-center space-x-2">
                <Flag className="text-yellow-400" />
                <span className="font-medium">Yellow Flag</span>
              </div>
              <p className="mt-2">{questions[currentQuestion].responses[stage].yellow}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-md">
              <div className="flex items-center space-x-2">
                <Flag className="text-red-400" />
                <span className="font-medium">Red Flag</span>
              </div>
              <p className="mt-2">{questions[currentQuestion].responses[stage].red}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="bg-gray-700 hover:bg-gray-600"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentQuestion === questions.length - 1}
            className="bg-green-600 hover:bg-green-500"
          >
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="text-center text-gray-400">
          Question {currentQuestion + 1} of {questions.length}
        </div>
      </div>
    </div>
  )
}
