import fs from 'fs'
import path from 'path'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"

// Adicione esta importação para o componente de imagem do Next.js
import Image from 'next/image'


export default function ArticlePage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const articlePath = path.join(process.cwd(), 'articles', `${slug}.md`)

  if (!fs.existsSync(articlePath)) {
    notFound()
  }

  const content = fs.readFileSync(articlePath, 'utf8')

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <Link href="/" passHref>
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              <ChevronLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Button>
          </Link>
          {/* Adicione um botão de compartilhamento ou outras ações aqui */}
        </div>
      </header>
      <main className="flex-grow py-12">
        <article className="max-w-3xl mx-auto px-4">
          <ReactMarkdown 
            className="prose prose-lg max-w-none"
            components={{
              h1: ({node, ...props}) => <h1 className="text-4xl font-bold mb-4 mt-8" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-3xl font-semibold mb-3 mt-6" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-2xl font-medium mb-2 mt-4" {...props} />,
              p: ({node, ...props}) => <p className="mb-4 leading-relaxed" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 pl-4" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 pl-4" {...props} />,
              img: ({node, ...props}) => (
                <div className="my-8">
                  <Image
                    src={props.src || ''}
                    alt={props.alt || ''}
                    width={700}
                    height={400}
                    className="rounded-lg"
                  />
                  {props.alt && <p className="text-sm text-gray-600 mt-2 text-center">{props.alt}</p>}
                </div>
              ),
              blockquote: ({node, ...props}) => (
                <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />
              ),
              code: ({node, ...props}) => (
                <code className="bg-gray-100 rounded px-1 py-0.5" {...props} />
              ),
              pre: ({node, ...props}) => (
                <pre className="bg-gray-100 rounded p-4 overflow-x-auto my-4" {...props} />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </article>
      </main>
      <footer className="bg-gray-100 py-8 mt-12">
        <div className="max-w-3xl mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2024 SBC SCHOOL. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}