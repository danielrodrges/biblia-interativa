import Link from 'next/link';
import { Lock, ArrowLeft } from 'lucide-react';

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF9F6] via-stone-50 to-stone-100">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/welcome" 
            className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-8 h-8 text-stone-900" />
            <h1 className="text-4xl font-serif font-bold text-stone-900">
              Política de Privacidade
            </h1>
          </div>
          
          <p className="text-stone-600">
            Última atualização: 19 de dezembro de 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-8 space-y-8">
          
          <section>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              1. Introdução
            </h2>
            <p className="text-stone-700 leading-relaxed">
              A Bíblia Interativa ("nós", "nosso" ou "nos") está comprometida em proteger sua privacidade. 
              Esta política explica como coletamos, usamos, divulgamos e protegemos suas informações quando 
              você usa nosso serviço. Esta política está em conformidade com a Lei Geral de Proteção de 
              Dados (LGPD - Lei nº 13.709/2018).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              2. Informações que Coletamos
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-stone-900 mb-2">
                  2.1 Informações Fornecidas por Você
                </h3>
                <ul className="list-disc list-inside space-y-2 text-stone-700 ml-4">
                  <li>Nome e endereço de e-mail (ao criar conta)</li>
                  <li>Informações de pagamento (processadas pelo Stripe)</li>
                  <li>Preferências de leitura e configurações</li>
                  <li>Conteúdo que você cria (anotações, marcadores)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-stone-900 mb-2">
                  2.2 Informações Coletadas Automaticamente
                </h3>
                <ul className="list-disc list-inside space-y-2 text-stone-700 ml-4">
                  <li>Dados de uso (páginas visitadas, tempo de leitura)</li>
                  <li>Informações do dispositivo (tipo, sistema operacional)</li>
                  <li>Endereço IP e dados de localização aproximada</li>
                  <li>Cookies e tecnologias similares</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              3. Como Usamos suas Informações
            </h2>
            <p className="text-stone-700 leading-relaxed mb-3">
              Usamos suas informações para:
            </p>
            <ul className="list-disc list-inside space-y-2 text-stone-700 ml-4">
              <li>Fornecer, manter e melhorar nossos serviços</li>
              <li>Processar pagamentos e gerenciar assinaturas</li>
              <li>Enviar notificações importantes sobre sua conta</li>
              <li>Personalizar sua experiência de leitura</li>
              <li>Analisar o uso e desenvolver novos recursos</li>
              <li>Prevenir fraudes e garantir a segurança</li>
              <li>Cumprir obrigações legais</li>
              <li>Enviar comunicações de marketing (com seu consentimento)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              4. Compartilhamento de Informações
            </h2>
            <p className="text-stone-700 leading-relaxed mb-3">
              Não vendemos suas informações pessoais. Podemos compartilhar suas informações com:
            </p>
            <ul className="list-disc list-inside space-y-2 text-stone-700 ml-4">
              <li><strong>Prestadores de Serviços:</strong> Stripe (pagamentos), Supabase (armazenamento), Vercel (hospedagem)</li>
              <li><strong>Conformidade Legal:</strong> Quando exigido por lei ou para proteger nossos direitos</li>
              <li><strong>Transferência de Negócios:</strong> Em caso de fusão, venda ou transferência de ativos</li>
            </ul>
            <p className="text-stone-700 leading-relaxed mt-3">
              Todos os prestadores de serviços são obrigados a proteger suas informações e usá-las apenas 
              para os fins especificados.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              5. Cookies e Tecnologias Similares
            </h2>
            <p className="text-stone-700 leading-relaxed mb-3">
              Usamos cookies e tecnologias similares para:
            </p>
            <ul className="list-disc list-inside space-y-2 text-stone-700 ml-4">
              <li>Manter você conectado à sua conta</li>
              <li>Lembrar suas preferências</li>
              <li>Analisar o uso do serviço</li>
              <li>Melhorar a segurança</li>
            </ul>
            <p className="text-stone-700 leading-relaxed mt-3">
              Você pode controlar cookies através das configurações do seu navegador, mas isso pode afetar 
              a funcionalidade do serviço.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              6. Seus Direitos (LGPD)
            </h2>
            <p className="text-stone-700 leading-relaxed mb-3">
              De acordo com a LGPD, você tem direito a:
            </p>
            <ul className="list-disc list-inside space-y-2 text-stone-700 ml-4">
              <li><strong>Confirmação e Acesso:</strong> Confirmar se processamos seus dados e acessá-los</li>
              <li><strong>Correção:</strong> Corrigir dados incompletos, inexatos ou desatualizados</li>
              <li><strong>Anonimização, Bloqueio ou Eliminação:</strong> Solicitar anonimização, bloqueio ou eliminação</li>
              <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
              <li><strong>Revogação de Consentimento:</strong> Retirar seu consentimento a qualquer momento</li>
              <li><strong>Oposição:</strong> Opor-se ao tratamento de dados</li>
              <li><strong>Revisão de Decisões Automatizadas:</strong> Solicitar revisão de decisões baseadas em processamento automatizado</li>
            </ul>
            <p className="text-stone-700 leading-relaxed mt-3">
              Para exercer seus direitos, entre em contato através de: <strong>privacidade@bibliainterativa.com</strong>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              7. Segurança dos Dados
            </h2>
            <p className="text-stone-700 leading-relaxed">
              Implementamos medidas técnicas e organizacionais apropriadas para proteger suas informações, 
              incluindo criptografia, controle de acesso e monitoramento de segurança. No entanto, nenhum 
              método de transmissão pela internet é 100% seguro.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              8. Retenção de Dados
            </h2>
            <p className="text-stone-700 leading-relaxed">
              Mantemos suas informações pessoais pelo tempo necessário para cumprir os propósitos descritos 
              nesta política, a menos que um período de retenção mais longo seja exigido ou permitido por lei. 
              Ao excluir sua conta, seus dados serão removidos dentro de 30 dias, exceto quando precisarmos 
              mantê-los para cumprir obrigações legais.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              9. Transferência Internacional de Dados
            </h2>
            <p className="text-stone-700 leading-relaxed">
              Seus dados podem ser transferidos e processados em servidores localizados fora do Brasil. 
              Garantimos que tais transferências são feitas em conformidade com a LGPD e com garantias 
              adequadas de proteção.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              10. Privacidade de Crianças
            </h2>
            <p className="text-stone-700 leading-relaxed">
              Nosso serviço não é direcionado a menores de 13 anos. Não coletamos intencionalmente 
              informações de crianças. Se você é pai/mãe/responsável e acredita que seu filho nos 
              forneceu informações, entre em contato conosco.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              11. Alterações nesta Política
            </h2>
            <p className="text-stone-700 leading-relaxed">
              Podemos atualizar esta política periodicamente. Notificaremos sobre alterações significativas 
              por e-mail ou através de aviso no serviço. A data da "Última atualização" no topo desta 
              página indica quando a política foi revisada pela última vez.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              12. Encarregado de Proteção de Dados (DPO)
            </h2>
            <p className="text-stone-700 leading-relaxed">
              Para questões relacionadas à proteção de dados, entre em contato com nosso DPO:
            </p>
            <div className="mt-3 p-4 bg-stone-50 rounded-lg">
              <p className="text-stone-700">
                <strong>Email:</strong> dpo@bibliainterativa.com
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              13. Contato
            </h2>
            <p className="text-stone-700 leading-relaxed mb-3">
              Para dúvidas sobre esta política de privacidade:
            </p>
            <div className="p-4 bg-stone-50 rounded-lg space-y-2">
              <p className="text-stone-700">
                <strong>Email:</strong> privacidade@bibliainterativa.com
              </p>
              <p className="text-stone-700">
                <strong>Suporte:</strong> suporte@bibliainterativa.com
              </p>
            </div>
          </section>

          <div className="pt-6 border-t border-stone-200">
            <p className="text-sm text-stone-500 text-center">
              Ao usar a Bíblia Interativa, você concorda com esta Política de Privacidade e nossos{' '}
              <Link href="/termos" className="text-stone-900 hover:underline font-medium">
                Termos de Uso
              </Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
