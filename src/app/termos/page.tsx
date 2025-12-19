import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';

export default function TermosPage() {
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
            <Shield className="w-8 h-8 text-stone-900" />
            <h1 className="text-4xl font-serif font-bold text-stone-900">
              Termos de Uso
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
              1. Aceitação dos Termos
            </h2>
            <p className="text-stone-700 leading-relaxed">
              Ao acessar e usar a Bíblia Interativa, você concorda em cumprir e estar vinculado aos 
              seguintes termos e condições de uso. Se você não concordar com alguma parte destes termos, 
              não deverá usar nosso serviço.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              2. Descrição do Serviço
            </h2>
            <p className="text-stone-700 leading-relaxed mb-3">
              A Bíblia Interativa oferece:
            </p>
            <ul className="list-disc list-inside space-y-2 text-stone-700 ml-4">
              <li>Acesso a múltiplas versões da Bíblia Sagrada</li>
              <li>Áudio bíblico em diferentes idiomas</li>
              <li>Tradução em tempo real (plano Premium)</li>
              <li>Exercícios interativos e planos de leitura</li>
              <li>Ferramentas de marcação e anotação</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              3. Conta de Usuário
            </h2>
            <div className="space-y-3 text-stone-700">
              <p className="leading-relaxed">
                Para acessar determinados recursos, você precisará criar uma conta. Você é responsável por:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Manter a confidencialidade de suas credenciais de login</li>
                <li>Todas as atividades que ocorrem em sua conta</li>
                <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
                <li>Fornecer informações precisas e atualizadas</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              4. Planos e Pagamentos
            </h2>
            <div className="space-y-3 text-stone-700">
              <p className="leading-relaxed">
                <strong>Plano Gratuito:</strong> Oferece acesso básico a recursos limitados com possíveis anúncios.
              </p>
              <p className="leading-relaxed">
                <strong>Plano Premium:</strong> Assinatura paga com acesso completo a todos os recursos.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Os pagamentos são processados através do Stripe</li>
                <li>As assinaturas são renovadas automaticamente</li>
                <li>Você pode cancelar a qualquer momento</li>
                <li>Reembolsos seguem nossa política de cancelamento</li>
                <li>Os preços podem ser alterados mediante aviso prévio de 30 dias</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              5. Uso Aceitável
            </h2>
            <p className="text-stone-700 leading-relaxed mb-3">
              Você concorda em NÃO:
            </p>
            <ul className="list-disc list-inside space-y-2 text-stone-700 ml-4">
              <li>Usar o serviço para fins ilegais ou não autorizados</li>
              <li>Tentar obter acesso não autorizado ao sistema</li>
              <li>Interferir ou interromper o serviço</li>
              <li>Copiar, modificar ou distribuir o conteúdo sem permissão</li>
              <li>Usar bots ou scripts automatizados</li>
              <li>Compartilhar sua conta com terceiros</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              6. Propriedade Intelectual
            </h2>
            <p className="text-stone-700 leading-relaxed">
              Todo o conteúdo, design, código e materiais da Bíblia Interativa são protegidos por 
              direitos autorais e outras leis de propriedade intelectual. As versões bíblicas têm seus 
              respectivos direitos autorais conforme indicado.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              7. Limitação de Responsabilidade
            </h2>
            <p className="text-stone-700 leading-relaxed">
              O serviço é fornecido "como está". Não garantimos que o serviço será ininterrupto ou 
              livre de erros. Não nos responsabilizamos por perdas ou danos decorrentes do uso ou 
              incapacidade de usar o serviço.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              8. Cancelamento e Término
            </h2>
            <div className="space-y-3 text-stone-700">
              <p className="leading-relaxed">
                Você pode cancelar sua assinatura a qualquer momento através das configurações da sua conta. 
                Nós reservamos o direito de suspender ou encerrar contas que violem estes termos.
              </p>
              <p className="leading-relaxed">
                Ao cancelar, você manterá acesso aos recursos premium até o final do período pago.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              9. Modificações dos Termos
            </h2>
            <p className="text-stone-700 leading-relaxed">
              Podemos modificar estes termos a qualquer momento. Notificaremos sobre alterações significativas 
              por e-mail ou através do serviço. O uso continuado após as alterações constitui aceitação dos 
              novos termos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              10. Lei Aplicável
            </h2>
            <p className="text-stone-700 leading-relaxed">
              Estes termos são regidos pelas leis do Brasil. Quaisquer disputas serão resolvidas nos 
              tribunais brasileiros competentes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              11. Contato
            </h2>
            <p className="text-stone-700 leading-relaxed">
              Para dúvidas sobre estes termos, entre em contato:
            </p>
            <div className="mt-3 p-4 bg-stone-50 rounded-lg">
              <p className="text-stone-700">
                <strong>Email:</strong> suporte@bibliainterativa.com
              </p>
            </div>
          </section>

          <div className="pt-6 border-t border-stone-200">
            <p className="text-sm text-stone-500 text-center">
              Ao usar a Bíblia Interativa, você concorda com estes Termos de Uso e nossa{' '}
              <Link href="/privacidade" className="text-stone-900 hover:underline font-medium">
                Política de Privacidade
              </Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
