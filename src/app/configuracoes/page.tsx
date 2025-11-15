'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  Globe, 
  BookOpen, 
  Type, 
  Bell, 
  Smartphone,
  ChevronRight,
  Check
} from 'lucide-react';
import { getPreferences, savePreferences, clearPreferences } from '@/lib/preferences';
import { availableLanguages, bibleVersions } from '@/lib/data';
import { UserPreferences, Language, BibleVersion } from '@/lib/types';

export default function ConfiguracoesPage() {
  const router = useRouter();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [showFontModal, setShowFontModal] = useState(false);
  const [showIPhoneHelp, setShowIPhoneHelp] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState<'native' | 'learning' | null>(null);
  const [editingVersion, setEditingVersion] = useState<'native' | 'learning' | null>(null);

  useEffect(() => {
    const prefs = getPreferences();
    if (!prefs.onboardingCompleted) {
      router.push('/onboarding');
      return;
    }
    setPreferences(prefs);
  }, [router]);

  const handleLanguageChange = (language: Language) => {
    if (!editingLanguage) return;
    
    const updates: Partial<UserPreferences> = {};
    if (editingLanguage === 'native') {
      updates.nativeLanguage = language;
      updates.nativeVersion = null; // Reset version when language changes
    } else {
      updates.learningLanguage = language;
      updates.learningVersion = null;
    }
    
    savePreferences(updates);
    setPreferences({ ...preferences!, ...updates });
    setShowLanguageModal(false);
    setEditingLanguage(null);
  };

  const handleVersionChange = (version: BibleVersion) => {
    if (!editingVersion) return;
    
    const updates: Partial<UserPreferences> = {};
    if (editingVersion === 'native') {
      updates.nativeVersion = version;
    } else {
      updates.learningVersion = version;
    }
    
    savePreferences(updates);
    setPreferences({ ...preferences!, ...updates });
    setShowVersionModal(false);
    setEditingVersion(null);
  };

  const handleFontSizeChange = (size: 'small' | 'medium' | 'large') => {
    savePreferences({ fontSize: size });
    setPreferences({ ...preferences!, fontSize: size });
    setShowFontModal(false);
  };

  const handleResetApp = () => {
    if (confirm('Tem certeza que deseja resetar todas as configurações?')) {
      clearPreferences();
      router.push('/onboarding');
    }
  };

  if (!preferences) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const nativeVersions = bibleVersions.filter(v => v.languageCode === preferences.nativeLanguage?.code);
  const learningVersions = bibleVersions.filter(v => v.languageCode === preferences.learningLanguage?.code);

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/inicio')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              Configurações
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 py-6">
        {/* Languages Section */}
        <div className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-gray-800">Idiomas</h2>
            </div>
          </div>

          <button
            onClick={() => {
              setEditingLanguage('native');
              setShowLanguageModal(true);
            }}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100"
          >
            <div className="text-left">
              <div className="text-sm text-gray-500 mb-1">Idioma que domina</div>
              <div className="flex items-center gap-2">
                <span className="text-xl">{preferences.nativeLanguage?.flag}</span>
                <span className="font-medium text-gray-800">
                  {preferences.nativeLanguage?.name}
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button
            onClick={() => {
              setEditingLanguage('learning');
              setShowLanguageModal(true);
            }}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="text-left">
              <div className="text-sm text-gray-500 mb-1">Idioma que deseja aprender</div>
              <div className="flex items-center gap-2">
                <span className="text-xl">{preferences.learningLanguage?.flag}</span>
                <span className="font-medium text-gray-800">
                  {preferences.learningLanguage?.name}
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Bible Versions Section */}
        <div className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-gray-800">Versões da Bíblia</h2>
            </div>
          </div>

          <button
            onClick={() => {
              setEditingVersion('native');
              setShowVersionModal(true);
            }}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100"
          >
            <div className="text-left">
              <div className="text-sm text-gray-500 mb-1">
                Versão em {preferences.nativeLanguage?.name}
              </div>
              <div className="font-medium text-gray-800">
                {preferences.nativeVersion?.abbreviation} - {preferences.nativeVersion?.name}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button
            onClick={() => {
              setEditingVersion('learning');
              setShowVersionModal(true);
            }}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="text-left">
              <div className="text-sm text-gray-500 mb-1">
                Versão em {preferences.learningLanguage?.name}
              </div>
              <div className="font-medium text-gray-800">
                {preferences.learningVersion?.abbreviation} - {preferences.learningVersion?.name}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Reading Settings */}
        <div className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Type className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-gray-800">Leitura</h2>
            </div>
          </div>

          <button
            onClick={() => setShowFontModal(true)}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="text-left">
              <div className="text-sm text-gray-500 mb-1">Tamanho da fonte</div>
              <div className="font-medium text-gray-800 capitalize">
                {preferences.fontSize === 'small' && 'Pequeno'}
                {preferences.fontSize === 'medium' && 'Médio'}
                {preferences.fontSize === 'large' && 'Grande'}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* App Settings */}
        <div className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-gray-800">Aplicativo</h2>
            </div>
          </div>

          <button
            onClick={() => setShowIPhoneHelp(true)}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100"
          >
            <div className="text-left">
              <div className="font-medium text-gray-800">
                Adicionar à tela inicial (iPhone)
              </div>
              <div className="text-sm text-gray-500">
                Use como um app nativo
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button
            onClick={handleResetApp}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-red-50 transition-colors"
          >
            <div className="text-left">
              <div className="font-medium text-red-600">
                Resetar aplicativo
              </div>
              <div className="text-sm text-gray-500">
                Apagar todas as configurações
              </div>
            </div>
          </button>
        </div>

        {/* About */}
        <div className="text-center text-sm text-gray-500 mt-8">
          <p>Bíblia Multilíngue Interativa</p>
          <p className="mt-1">Versão 1.0.0</p>
        </div>
      </div>

      {/* Language Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white rounded-t-3xl w-full max-h-[70vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">
                  Escolher idioma
                </h3>
                <button
                  onClick={() => {
                    setShowLanguageModal(false);
                    setEditingLanguage(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-3">
              {availableLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang)}
                  className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-gray-200 hover:border-blue-300 hover:bg-gray-50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{lang.flag}</span>
                    <span className="text-lg font-medium text-gray-800">
                      {lang.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Version Modal */}
      {showVersionModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white rounded-t-3xl w-full max-h-[70vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">
                  Escolher versão
                </h3>
                <button
                  onClick={() => {
                    setShowVersionModal(false);
                    setEditingVersion(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-3">
              {(editingVersion === 'native' ? nativeVersions : learningVersions).map((version) => (
                <button
                  key={version.id}
                  onClick={() => handleVersionChange(version)}
                  className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-gray-200 hover:border-blue-300 hover:bg-gray-50 transition-all"
                >
                  <div className="text-left">
                    <div className="text-lg font-medium text-gray-800">
                      {version.abbreviation}
                    </div>
                    <div className="text-sm text-gray-600">
                      {version.name}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Font Size Modal */}
      {showFontModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white rounded-t-3xl w-full">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">
                  Tamanho da fonte
                </h3>
                <button
                  onClick={() => setShowFontModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-3">
              {[
                { value: 'small' as const, label: 'Pequeno', example: 'text-base' },
                { value: 'medium' as const, label: 'Médio', example: 'text-lg' },
                { value: 'large' as const, label: 'Grande', example: 'text-xl' },
              ].map((size) => (
                <button
                  key={size.value}
                  onClick={() => handleFontSizeChange(size.value)}
                  className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                    preferences.fontSize === size.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800 mb-1">
                        {size.label}
                      </div>
                      <div className={`${size.example} text-gray-600`}>
                        Exemplo de texto
                      </div>
                    </div>
                    {preferences.fontSize === size.value && (
                      <Check className="w-6 h-6 text-blue-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* iPhone Help Modal */}
      {showIPhoneHelp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">
                  Adicionar à Tela Inicial
                </h3>
                <button
                  onClick={() => setShowIPhoneHelp(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Siga estes passos para usar o site como um aplicativo no seu iPhone:
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 mb-2">
                      Abra este site no Safari
                    </p>
                    <p className="text-sm text-gray-600">
                      Certifique-se de estar usando o navegador Safari do iPhone
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 mb-2">
                      Toque no ícone de compartilhamento
                    </p>
                    <p className="text-sm text-gray-600">
                      É o quadrado com uma seta para cima, na parte inferior da tela
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 mb-2">
                      Role para baixo
                    </p>
                    <p className="text-sm text-gray-600">
                      Procure a opção "Adicionar à Tela de Início"
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 mb-2">
                      Confirme
                    </p>
                    <p className="text-sm text-gray-600">
                      Escolha o nome (ex: "Bíblia Multilíngue") e toque em "Adicionar"
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 mb-2">
                      Pronto!
                    </p>
                    <p className="text-sm text-gray-600">
                      O atalho aparecerá na sua tela inicial como um aplicativo
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIPhoneHelp(false)}
                className="w-full mt-8 bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-2xl font-bold transition-all"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
