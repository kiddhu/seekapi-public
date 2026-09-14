export const dynamic='force-static';
export async function GET(){return Response.json({
  provider:'SeekAPI',service_family:'human_execution_china_supply_chain',version:'0.1-preview',status:'manual_review_preview',
  public_api_live:false,intake_enabled:true,intake_mode:'user-reviewed_email',structured_web_submission_live:false,geographic_scope:['China — scope, location and availability reviewed per task'],
  purpose:'Bounded human execution for approved China-side tasks that software cannot safely or completely finish alone.',
  supported_task_types:[],
  proposed_task_types:['AH01_supplier_contact','AH02_supplier_discovery_qualification','AH03_rfq_execution','AH04_sample_npi_followup','AH05_physical_verification_coordination','AH06_quality_exception_recovery','AH07_delivery_local_coordination','AH08_research_human_verification'].map(id=>({id,status:'scope_review_required_unverified'})),
  handoff_requires:['requester_type','requester_identity','organization','objective','task_type','context_summary','allowed_actions','prohibited_actions','recipient_permissions','max_budget','currency','deadline','required_evidence','completion_definition','human_approval_contact'],
  requires_human_approval_for:['RFQ authorization','spending','contracts','production approval','accepting quality deviations'],
  output_states:['NEEDS_INFO','ACCEPTED','HUMAN_REVIEW_REQUIRED','IN_PROGRESS','BLOCKED','APPROVAL_REQUIRED','EVIDENCE_READY','COMPLETED','DECLINED'],
  data_policy_url:'https://seekapi.ai/trust#data-ip',handoff_spec_url:'https://seekapi.ai/for-agents#handoff-spec',start_url:'https://seekapi.ai/start?audience=agent',localized_start_url:'https://seekapi.ai/zh/start?audience=agent',evidence_return_spec_url:'https://seekapi.ai/for-agents#evidence-return',compliance_logistics_url:'https://seekapi.ai/china-compliance-logistics',manual_scope_contact:'mailto:support@seekapi.ai',
  integrations:{task_api:'planned_not_live',mcp:'planned_not_live',webmcp:'planned_not_live'},updated_at:'2026-09-14',
  notes:['SeekAPI-defined preview manifest, not an industry standard.','The website can prepare a user-reviewed email request; it does not transmit data itself. No public task API, automatic acceptance or universal live coverage is claimed.']
});}
