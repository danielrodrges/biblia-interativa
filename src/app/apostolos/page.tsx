'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';
import { apostles, getPlansByApostle } from '@/lib/apostles-data';

export default function ApostolosPage() {
  const [selectedApostle, setSelectedApostle] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-3xl font-serif font-bold text-stone-800 mb-2">Estudos por Apóstolos</h1>
        <p className="text-stone-600">
          Aprenda com os ensinamentos dos apóstolos de Jesus
        </p>
      </div>

      {/* Lista de Apóstolos */}
      <div className="px-4 space-y-4">
        {apostles.map((apostle) => {
          const plans = getPlansByApostle(apostle.id);
          const isExpanded = selectedApostle === apostle.id;

          return (
            <div key={apostle.id} className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden transition-all duration-300">
              {/* Card do Apóstolo */}
              <button
                onClick={() => setSelectedApostle(isExpanded ? null : apostle.id)}
                className="w-full p-5 flex items-start gap-4 hover:bg-stone-50 transition-colors"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: `${apostle.color}20` }}
                >
                  {apostle.icon}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-serif font-bold text-stone-800 mb-1">
                    {apostle.name}
                  </h3>
                  <p className="text-sm text-stone-600 mb-2 leading-relaxed">
                    {apostle.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs font-medium text-stone-500">
                    <BookOpen className="w-4 h-4" />
                    <span>{plans.length} planos de leitura</span>
                  </div>
                </div>
                <ArrowRight
                  className={`w-5 h-5 text-stone-400 flex-shrink-0 transition-transform duration-300 ${
                    isExpanded ? 'rotate-90' : ''
                  }`}
                />
              </button>

              {/* Planos de Leitura (expandido) */}
              {isExpanded && (
                <div className="border-t border-stone-100 bg-stone-50/50 p-4 space-y-3 animate-in slide-in-from-top-2 fade-in duration-200">
                  {plans.map((plan) => (
                    <Link
                      key={plan.id}
                      href={`/apostolos/${apostle.id}/${plan.id}`}
                      className="block bg-white rounded-xl p-4 border border-stone-100 hover:border-stone-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="font-serif font-bold text-stone-800 mb-1">
                            {plan.title}
                          </h4>
                          <p className="text-sm text-stone-600 mb-3 line-clamp-2 leading-relaxed">
                            {plan.introduction}
                          </p>
                          <div className="flex items-center gap-4 text-xs font-medium text-stone-500">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{plan.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>{plan.passages.length} trecho(s)</span>
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-stone-400 flex-shrink-0 mt-1" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Dica */}
      <div className="mx-4 mt-6 mb-6 bg-stone-100 border border-stone-200 rounded-xl p-4">
        <p className="text-sm text-stone-700 leading-relaxed">
          💡 <strong className="font-serif text-stone-900">Dica:</strong> Cada plano leva cerca de 20-30 minutos. Ao concluir a leitura, você fará exercícios para fixar o aprendizado!
        </p>
      </div>
    </div>
  );
}
