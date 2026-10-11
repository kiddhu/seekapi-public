import observations from '@/public/china-supply-check-source-observations.json';

const dataset = {
  '@context': 'https://schema.org', '@type': 'Dataset',
  name: 'Public source observations with UNKNOWN qualification',
  description: observations.disclaimer,
  url: 'https://seekapi.ai/china-supply-check/sample',
  dateModified: observations.benchmark_observed_at,
  distribution: { '@type': 'DataDownload', encodingFormat: 'application/json', contentUrl: 'https://seekapi.ai/china-supply-check-source-observations.json' },
  variableMeasured: [
    { '@type': 'PropertyValue', name: 'Strict product/model/material confirmation', value: '0/3' },
    { '@type': 'PropertyValue', name: 'Observed specification signals', value: '3/3' },
    { '@type': 'PropertyValue', name: 'Final qualification', value: '3/3 UNKNOWN' },
    { '@type': 'PropertyValue', name: 'Five-case benchmark overall', value: 'NOT_PASS' },
  ],
};
function SourceLink({url,label}:{url:string;label:string}) {
  return url === 'UNKNOWN' ? <span>UNKNOWN — no public shop source was recorded.</span> : <a className="text-link" href={url} target="_blank" rel="noopener noreferrer">{label}</a>;
}
export function PublicSourceObservations() {
  return <section className="section" aria-labelledby="public-source-observations-title"><div className="container">
    <h2 id="public-source-observations-title">Three public source observations. Qualification remains UNKNOWN.</h2>
    <p role="note"><strong>{observations.disclaimer}</strong></p>
    <div className="definition"><p>strict product/model/material confirmation: <strong>0 / 3</strong></p>
      <p>observed specification signals: <strong>3 / 3</strong></p>
      <p>final qualification: <strong>3 / 3 UNKNOWN</strong></p>
      <p>five-case benchmark overall: <strong>NOT_PASS</strong></p></div>
    <p>Recorded observations are not confirmed matches. Rows retain their recorded order, without a recommendation or ranking. Public shop identifiers distinguish platform shops; company and manufacturer identities remain unconfirmed.</p>
    <div className="grid-3">{observations.rows.map((row,index) => <article className="feature-card" key={row.product.public_id} style={{overflowWrap:'anywhere'}}>
      <h3>Public source observation {index+1}</h3>
      <p><strong>Final qualification: {row.qualification_status}</strong></p><p>Evidence status: {row.evidence_status}</p>
      <p>Original public short title: {row.product.short_title}</p><p>Public product identifier: {row.product.public_id}</p>
      <p><SourceLink url={row.product.source_url} label="Open public product source" /></p>
      <p>Public shop display name: {row.shop.display_name}</p><p>Public shop identifier: {row.shop.public_id}</p>
      <p><SourceLink url={row.shop.source_url} label="Open public shop source" /></p>
      <p>Observed: <time dateTime={row.observed_at}>{row.observed_at}</time>. This is a historical observation, not a current price, stock or availability check.</p>
      <p>Observed listing price: {row.observed_facts.observed_listing_price.amount} {row.observed_facts.observed_listing_price.currency} / {row.observed_facts.observed_listing_price.unit}. Supplier confirmation: UNKNOWN.</p>
      <p>Observed minimum order quantity: {row.observed_facts.observed_minimum_order_quantity.quantity} {row.observed_facts.observed_minimum_order_quantity.unit} (recorded listing MOQ).</p>
      <h4>Observed specification signals</h4><ul>{row.observed_specification_signals.map(signal => <li key={signal.attribute}>{signal.attribute}: {signal.observation}. Confirmation: <strong>{signal.confirmation_status}</strong>.</li>)}</ul>
      <h4>Missing evidence</h4><ul>{row.missing_evidence.map(field=><li key={field}>{field.replaceAll('_',' ').toLowerCase()}: UNKNOWN</li>)}</ul>
    </article>)}</div>
    <p><a className="text-link" href="/china-supply-check-source-observations.json">Download public source observations and machine-readable qualification states</a></p>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(dataset).replaceAll('<','\\u003c')}} />
  </div></section>;
}
