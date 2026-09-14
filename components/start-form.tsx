'use client';
import { FormEvent, useState } from 'react';
import { useSearchParams } from 'next/navigation';
export function StartForm() {
  const params = useSearchParams();
  const initialAudience = params.get('audience') === 'agent' ? 'agent' : 'company';
  const initialIntent = params.get('intent') || '';
  const [audience, setAudience] = useState<'company'|'agent'>(initialAudience);
  const [message, setMessage] = useState('');
  function validate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) { setMessage('Complete the required fields shown below. Nothing has been sent.'); form.reportValidity(); return; }
    setMessage('Preview draft validated locally — nothing has been sent or accepted.');
  }
  return <div className="form-card">
    <div className="notice" id="sensitive-note"><strong>Do not include confidential drawings, credentials or supplier secrets.</strong> This preview validates a draft in your browser and sends nothing.</div>
    <fieldset className="mode-switch"><legend>Who is starting the request?</legend>
      <button type="button" className={audience === 'company' ? 'mode-active' : ''} aria-pressed={audience === 'company'} onClick={() => {setAudience('company');setMessage('')}}>Company</button>
      <button type="button" className={audience === 'agent' ? 'mode-active' : ''} aria-pressed={audience === 'agent'} onClick={() => {setAudience('agent');setMessage('')}}>Agent / AI team</button>
    </fieldset>
    <form aria-label={audience === 'agent' ? 'Agent handoff draft' : 'Company issue draft'} aria-describedby="sensitive-note" onSubmit={validate} onReset={() => setMessage('Draft cleared. Nothing was sent.')} noValidate>
      <h2>{audience === 'agent' ? 'Agent handoff draft' : 'Company issue draft'}</h2>
      <div className="form-grid">
        <div className="field"><label htmlFor="organization">Company or project</label><input id="organization" name="organization" required autoComplete="organization" /></div>
        <div className="field"><label htmlFor="role">Your role</label><input id="role" name="role" required /></div>
        <div className="field"><label htmlFor="country">Country</label><input id="country" name="country" required autoComplete="country-name" /></div>
        <div className="field"><label htmlFor="contact">Contact email</label><input id="contact" name="contact" type="email" required autoComplete="email" /></div>
        {audience === 'company' ? <>
          <div className="field full"><label htmlFor="help_type">Help needed</label><select id="help_type" name="help_type" defaultValue={initialIntent} required><option value="">Select one</option><option value="sourcing">Sourcing and RFQ</option><option value="supplier-communication">Supplier communication</option><option value="sample-npi">Sample / NPI</option><option value="quality-production">Quality / production</option><option value="compliance">China compliance path</option><option value="trademark">Trademark / brand protection</option><option value="product-registration">Product registration / filing</option><option value="customs">Customs / export documentation</option><option value="logistics">Logistics quote and shipment monitoring</option><option value="warehousing">Warehousing and inventory control</option><option value="market-entry">China market entry</option><option value="returns-claims">Returns / rework / claims</option><option value="trouble-recovery">Trouble recovery</option><option value="delivery">Delivery coordination</option><option value="china-desk">Ongoing China Desk</option></select></div>
          <div className="field full"><label htmlFor="issue">Describe one issue</label><textarea id="issue" name="issue" required placeholder="What is stuck, what outcome do you need, and by when?" /></div>
          <div className="field"><label htmlFor="quantity">Quantity or scale <span>(optional)</span></label><input id="quantity" name="quantity" /></div>
          <div className="field"><label htmlFor="timing">Timing <span>(optional)</span></label><input id="timing" name="timing" /></div>
        </> : <>
          <div className="field"><label htmlFor="task_type">Task class</label><select id="task_type" name="task_type" required defaultValue=""><option value="">Select AH01–AH08</option>{['AH01 Supplier contact','AH02 Discovery & qualification','AH03 RFQ execution','AH04 Sample / NPI follow-up','AH05 Physical verification coordination','AH06 Quality / exception recovery','AH07 Delivery, logistics & warehousing','AH08 Compliance research + human verification'].map(value => <option key={value}>{value}</option>)}</select></div>
          <div className="field"><label htmlFor="max_budget">Maximum authorized budget <span>(optional)</span></label><input id="max_budget" name="max_budget" placeholder="Currency and amount, or none" /></div>
          <div className="field full"><label htmlFor="objective">Objective and completion definition</label><textarea id="objective" name="objective" required /></div>
          <div className="field full"><label htmlFor="allowed_actions">Allowed actions</label><textarea id="allowed_actions" name="allowed_actions" required placeholder="One action per line" /></div>
          <div className="field full"><label htmlFor="prohibited_actions">Prohibited actions</label><textarea id="prohibited_actions" name="prohibited_actions" required placeholder="Payments, contract changes, quality deviations…" /></div>
          <div className="field full"><label htmlFor="required_evidence">Required evidence and approval contact</label><textarea id="required_evidence" name="required_evidence" required /></div>
        </>}
        <div className="field full"><label htmlFor="data_sensitivity">Data sensitivity</label><select id="data_sensitivity" name="data_sensitivity" required defaultValue=""><option value="">Select one</option><option>Public / non-sensitive</option><option>Business information — discuss handling first</option><option>Sensitive — do not share in this preview</option></select></div>
      </div>
      <div className="button-row form-actions"><button className="button" type="submit">Validate preview draft</button><button className="button button-ghost" type="reset">Clear draft</button><a className="button button-ghost" href="mailto:support@seekapi.ai?subject=SeekAPI%20scope%20review%20request">Email SeekAPI</a></div>
      <p className="form-status" role="status" aria-live="polite">{message}</p>
      <p className="form-note">Email opens your mail application. Form fields are not transmitted by this preview. Sending a request does not mean the task is accepted or that a fee is due.</p>
    </form>
  </div>;
}
