'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Clock } from 'lucide-react';
import { getApostleById, getPlanById } from '@/lib/apostles-data';

interface PageProps {
  params: {
    apostolo: string;
    plano: string;
    numero: string;
  };
}

export default function CapituloPage({ params }: PageProps) {
  const router = useRouter();
  const [readingCompleted, setReadingCompleted] = useState(false);
  const [startTime] = useState(new Date());

  const apostle = getApostleById(params.apostolo);
  const plan = getPlanById(params.plano);
  const chapterNumber = parseInt(params.numero);
  const chapter = plan?.chapters.find(ch => ch.number === chapterNumber);

  if (!apostle || !plan || !chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Capítulo não encontrado</p>
      </div>
    );
  }

  const handleCompleteReading = () => {
    // Salvar progresso
    const progressKey = `plan-progress-${params.plano}`;
    const savedProgress = localStorage.getItem(progressKey);
    const progress = savedProgress ? JSON.parse(savedProgress) : {
      completedChapters: [],
      completedExercises: [],
      totalPoints: 0
    };

    if (!progress.completedChapters.includes(chapterNumber)) {
      progress.completedChapters.push(chapterNumber);
      localStorage.setItem(progressKey, JSON.stringify(progress));
    }

    setReadingCompleted(true);
  };

  const handleContinue = () => {
    // Verificar se há exercício após este capítulo
    const hasExercise = plan.exercises.some(ex => ex.afterChapter === chapterNumber);
    
    if (hasExercise) {
      router.push(`/apostolos/${params.apostolo}/${params.plano}/exercicio/${chapterNumber}`);
    } else {
      router.push(`/apostolos/${params.apostolo}/${params.plano}`);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div
        className="text-white px-6 py-6 safe-area-top"
        style={{ backgroundColor: apostle.color }}
      >
        <Link
          href={`/apostolos/${params.apostolo}/${params.plano}`}
          className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Voltar ao Plano</span>
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{apostle.icon}</span>
          <div>
            <div className="text-sm text-white/80 mb-1">Capítulo {chapter.number}</div>
            <h1 className="text-xl font-bold">{chapter.title}</h1>
          </div>
        </div>
      </div>

      {/* Conteúdo da Leitura */}
      <div className="px-6 py-8">
        {/* Info do Capítulo */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-gray-900">
              {chapter.book} {chapter.chapter}:{chapter.verses}
            </h3>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{chapter.duration}</span>
            </div>
          </div>
          <p className="text-sm text-gray-700">{chapter.content}</p>
        </div>

        {/* Texto Bíblico */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="space-y-4">
            {/* Texto simulado - Em produção, virá da API */}
            <p className="text-gray-800 leading-relaxed">
              <span className="font-semibold text-gray-500 mr-2">1</span>
              Ainda que eu fale as línguas dos homens e dos anjos, se não tiver amor, serei como o bronze que soa ou como o címbalo que retine.
            </p>
            <p className="text-gray-800 leading-relaxed">
              <span className="font-semibold text-gray-500 mr-2">2</span>
              Ainda que eu tenha o dom de profecia e conheça todos os mistérios e toda a ciência, e tenha fé capaz de mover montanhas, se não tiver amor, nada serei.
            </p>
            <p className="text-gray-800 leading-relaxed">
              <span className="font-semibold text-gray-500 mr-2">3</span>
              E ainda que eu distribua todos os meus bens entre os pobres e entregue o meu corpo para ser queimado, se não tiver amor, nada disso me valerá.
            </p>
            <p className="text-gray-800 leading-relaxed">
              <span className="font-semibold text-gray-500 mr-2">4</span>
              O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha.
            </p>
            <p className="text-gray-800 leading-relaxed">
              <span className="font-semibold text-gray-500 mr-2">5</span>
              Não maltrata, não procura seus interesses, não se ira facilmente, não guarda rancor.
            </p>
            <p className="text-gray-800 leading-relaxed">
              <span className="font-semibold text-gray-500 mr-2">6</span>
              O amor não se alegra com a injustiça, mas se alegra com a verdade.
            </p>
            <p className="text-gray-800 leading-relaxed">
              <span className="font-semibold text-gray-500 mr-2">7</span>
              Tudo sofre, tudo crê, tudo espera, tudo suporta.
            </p>
          </div>

          <div className="text-center text-sm text-gray-500 italic pt-6 border-t border-gray-200 mt-6">
            Texto bíblico completo será carregado da API
          </div>
        </div>

        {/* Botão de Conclusão */}
        {!readingCompleted ? (
          <button
            onClick={handleCompleteReading}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-6 h-6" />
            Concluir Leitura
          </button>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Capítulo Concluído! 🎉
              </h3>
              <p className="text-gray-600 text-sm">
                Parabéns por completar mais um capítulo do seu estudo!
              </p>
            </div>

            <button
              onClick={handleContinue}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              Continuar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
