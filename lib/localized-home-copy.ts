import truth from '@/public/.well-known/csc-commercial-truth.json';

export type LocalizedHomeLocale = 'es'|'de'|'ja'|'ar'|'pt-br'|'ru';
const screening=truth.price.card_usd;
const rfq=truth.live_rfq.price_usd;

// Offer hierarchy is shared with the English home. Prices project the existing
// contract; these words never decide current runtime sales admission.
export const localizedHomeCopy = {
  es: {
    heading:'Proveedores de China. Cotizaciones confirmadas.',
    lead:`USD ${screening}: candidatos, especificaciones, MOQ y precios publicados. USD ${rfq}: contactamos proveedores y comparamos sus cotizaciones actuales confirmadas.`,
    rfqAction:'Preparar RFQ gratis · EN',
    cscAction:`Filtrar proveedores — USD ${screening}`,
    scope:`Preparación gratuita · Servicios independientes, de pago único · RFQ no requiere comprar primero el servicio de USD ${screening}.`,
  },
  de: {
    heading:'Lieferanten aus China. Bestätigte Angebote.',
    lead:`USD ${screening}: Kandidaten, Spezifikationen, MOQ und öffentliche Listenpreise. USD ${rfq}: Wir kontaktieren Lieferanten und vergleichen ihre aktuell bestätigten Angebote.`,
    rfqAction:'RFQ kostenlos vorbereiten · EN',
    cscAction:`Kandidaten finden — USD ${screening}`,
    scope:`Kostenlose Vorbereitung · Eigenständige Services, einmalige Zahlung · Für RFQ ist kein vorheriger Kauf für USD ${screening} nötig.`,
  },
  ja: {
    heading:'中国のサプライヤー候補と、確認済みの見積もり。',
    lead:`USD ${screening}：候補、仕様、MOQ、公開掲載価格の根拠を比較。USD ${rfq}：サプライヤーに連絡し、確認済みの最新見積もりを比較します。`,
    rfqAction:'RFQ を無料で準備 · EN',
    cscAction:`候補を絞り込む — USD ${screening}`,
    scope:`準備は無料 · 独立したサービス、各1回払い · RFQ に USD ${screening} の事前購入は不要です。`,
  },
  ar: {
    heading:'مورّدون من الصين. وعروض أسعار مؤكدة.',
    lead:`USD ${screening}: مرشّحون ومواصفات وحد أدنى للطلب وأدلة الأسعار المنشورة. USD ${rfq}: نتواصل مع المورّدين ونقارن عروض أسعارهم الحالية المؤكدة.`,
    rfqAction:'تحضير RFQ مجاناً · EN',
    cscAction:`فحص المرشّحين — USD ${screening}`,
    scope:`التحضير مجاني · خدمتان مستقلتان، بدفعة واحدة لكل خدمة · لا تتطلب RFQ شراء خدمة USD ${screening} أولاً.`,
  },
  'pt-br': {
    heading:'Fornecedores na China. Cotações confirmadas.',
    lead:`USD ${screening}: candidatos, especificações, MOQ e preços públicos de anúncios. USD ${rfq}: contatamos fornecedores e comparamos suas cotações atuais confirmadas.`,
    rfqAction:'Preparar RFQ grátis · EN',
    cscAction:`Filtrar fornecedores — USD ${screening}`,
    scope:`Preparação gratuita · Serviços independentes, pagamento único · RFQ não exige a compra prévia do serviço de USD ${screening}.`,
  },
  ru: {
    heading:'Поставщики из Китая. Подтверждённые предложения.',
    lead:`USD ${screening} — кандидаты, характеристики, MOQ и открытые цены. USD ${rfq} — связь с поставщиками и сравнение актуальных подтверждённых предложений.`,
    rfqAction:'Подготовить RFQ бесплатно · EN',
    cscAction:`Отобрать кандидатов — USD ${screening}`,
    scope:`Подготовка бесплатна · Отдельные услуги, разовая оплата · Для RFQ не нужна предварительная покупка за USD ${screening}.`,
  },
} satisfies Record<LocalizedHomeLocale,{heading:string;lead:string;rfqAction:string;cscAction:string;scope:string}>;
