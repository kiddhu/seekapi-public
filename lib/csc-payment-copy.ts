import truth from '@/public/.well-known/csc-commercial-truth.json';

type PaymentLocale = 'en' | 'es' | 'de' | 'ja' | 'ar' | 'pt-br' | 'ru';
const copy: Record<PaymentLocale, { labels: string[]; admission: string; preparation: string; rfq: string }> = {
  en: {
    labels: ['Image Stripe', 'Image x402', 'Text/model Stripe', 'Text/model x402'],
    admission: 'New purchases depend on current availability and may be paused.',
    preparation: 'Review and edit your brief for free before payment.',
    rfq: 'Verified RFQ Basic is a separate $19.90 USD service for supplier contact and current supplier-confirmed quotes. No $2.99 purchase is required.',
  },
  es: {
    labels: ['Stripe para imágenes', 'x402 para imágenes', 'Stripe para texto/modelo', 'x402 para texto/modelo'],
    admission: 'Las compras nuevas dependen de la disponibilidad actual y pueden estar pausadas.',
    preparation: 'Revisa y edita tu solicitud gratis antes de pagar.',
    rfq: 'Verified RFQ Basic es un servicio independiente de USD 19.90 para contactar proveedores y comparar sus cotizaciones confirmadas. No requiere comprar primero el servicio de USD 2.99.',
  },
  de: {
    labels: ['Bild-Stripe', 'Bild-x402', 'Text/Modell-Stripe', 'Text/Modell-x402'],
    admission: 'Neue Käufe hängen von der aktuellen Verfügbarkeit ab und können pausiert sein.',
    preparation: 'Anforderung vor der Zahlung kostenlos prüfen und bearbeiten.',
    rfq: 'Verified RFQ Basic ist ein eigenständiger Service für USD 19.90: Lieferantenkontakt und Vergleich aktuell bestätigter Angebote. Ein vorheriger Kauf für USD 2.99 ist nicht erforderlich.',
  },
  ja: {
    labels: ['画像 Stripe', '画像 x402', 'テキスト／型番 Stripe', 'テキスト／型番 x402'],
    admission: '新規購入は現在の受付状況に従い、一時停止の場合があります。',
    preparation: '支払い前に無料で依頼内容を確認・編集できます。',
    rfq: 'Verified RFQ Basic は USD 19.90 の独立したサービスです。サプライヤーに連絡し、確認済みの最新見積もりを比較します。USD 2.99 の事前購入は不要です。',
  },
  ar: {
    labels: ['Stripe للصور', 'x402 للصور', 'Stripe للنص أو الطراز', 'x402 للنص أو الطراز'],
    admission: 'تعتمد المشتريات الجديدة على التوفر الحالي وقد تكون متوقفة مؤقتاً.',
    preparation: 'يمكنك مراجعة الطلب وتعديله مجاناً قبل الدفع.',
    rfq: 'Verified RFQ Basic خدمة مستقلة بسعر USD 19.90 للتواصل مع المورّدين ومقارنة عروض أسعارهم الحالية المؤكدة. لا تتطلب شراء خدمة USD 2.99 أولاً.',
  },
  'pt-br': {
    labels: ['Stripe para imagens', 'x402 para imagens', 'Stripe para texto/modelo', 'x402 para texto/modelo'],
    admission: 'Novas compras dependem da disponibilidade atual e podem estar pausadas.',
    preparation: 'Revise e edite sua solicitação gratuitamente antes de pagar.',
    rfq: 'Verified RFQ Basic é um serviço independente de USD 19.90 para contatar fornecedores e comparar cotações atuais confirmadas por eles. Não exige a compra prévia do serviço de USD 2.99.',
  },
  ru: {
    labels: ['Stripe для изображений', 'x402 для изображений', 'Stripe для текста/модели', 'x402 для текста/модели'],
    admission: 'Новые покупки зависят от текущей доступности и могут быть приостановлены.',
    preparation: 'Перед оплатой бесплатно проверьте и отредактируйте запрос.',
    rfq: 'Verified RFQ Basic — отдельная услуга за USD 19.90: связь с поставщиками и сравнение их текущих подтверждённых предложений. Предварительная покупка услуги за USD 2.99 не требуется.',
  },
};

// These are published contract states, never a cached admission decision.
export function cscPaymentStatement(locale: PaymentLocale) {
  const {labels, admission, preparation} = copy[locale];
  return [
    `${labels[0]}: ${truth.payments.image_first.stripe.status} · USD ${truth.price.card_usd}.`,
    `${labels[1]}: ${truth.payments.image_first.x402.status}.`,
    `${labels[2]}: ${truth.payments.text_model_legacy.stripe.status}.`,
    `${labels[3]}: ${truth.payments.text_model_legacy.x402.status} · ${truth.price.amount} USDC · Base.`,
    admission, preparation,
  ].join(' ');
}
export function cscAdmissionNotice(locale: PaymentLocale) { return copy[locale].admission; }
export function independentRfqStatement(locale: PaymentLocale) { return copy[locale].rfq; }
