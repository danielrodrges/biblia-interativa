'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';
import { apostles, getPlansByApostle } from '@/lib/apostles-data';

export default function ApostolosPage() {
  const [selectedApostle, setSelectedApostle] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-8 safe-area-top">
        <h1 className="text-2xl font-bold mb-2">Estudos por Apóstolos</h1>
        <p className="text-blue-100 text-sm">
          Aprenda com os ensinamentos dos apóstolos de Jesus
        </p>
      </div>

      {/* Lista de Apóstolos */}
      <div className="px-4 py-6 space-y-4">
        {apostles.map((apostle) => {
          const plans = getPlansByApostle(apostle.id);
          const isExpanded = selectedApostle === apostle.id;

          return (
            <div key={apostle.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Card do Apóstolo */}
              <button
                onClick={() => setSelectedApostle(isExpanded ? null : apostle.id)}
                className="w-full p-5 flex items-start gap-4 hover:bg-gray-50 transition-colors"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: `${apostle.color}20` }}
                >
                  {apostle.icon}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {apostle.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {apostle.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <BookOpen className="w-4 h-4" />
                    <span>{plans.length} planos de leitura</span>
                  </div>
                </div>
                <ArrowRight
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                    isExpanded ? 'rotate-90' : ''
                  }`}
                />
              </button>

              {/* Planos de Leitura (expandido) */}
              {isExpanded && (
                <div className="border-t border-gray-100 bg-gray-50 p-4 space-y-3">
                  {plans.map((plan) => (
                    <Link
                      key={plan.id}
                      href={`/apostolos/${apostle.id}/${plan.id}`}
                      className="block bg-white rounded-xl p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {plan.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {plan.introduction}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
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
                        <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
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
      <div className="mx-4 mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-900">
          💡 <strong>Dica:</strong> Cada plano leva cerca de 20-30 minutos. Ao concluir a leitura, você fará exercícios para fixar o aprendizado!
        </p>
      </div>
    </div>
  );
}
