'use client';
import { FormEvent, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const companyOptions=[['sourcing','寻源与询价'],['supplier-communication','供应商沟通'],['sample-npi','样品与新产品导入'],['quality-production','质量与生产跟进'],['compliance','中国合规路径'],['trademark','商标与品牌保护'],['product-registration','产品注册与备案'],['customs','海关与出口文件'],['logistics','物流报价与运输监控'],['warehousing','仓储与库存管理'],['market-entry','进入中国市场'],['returns-claims','退货、返工与索赔'],['trouble-recovery','异常恢复'],['delivery','交付协调'],['china-desk','常驻中国事务台']];
const agentOptions=['AH01 联系供应商','AH02 寻源与资格核验','AH03 执行询价','AH04 样品与 NPI 跟进','AH05 现场核验协调','AH06 质量与异常恢复','AH07 交付、物流与仓储','AH08 合规研究与人工核验'];

export function ZhStartForm(){
  const params=useSearchParams();
  const [audience,setAudience]=useState<'company'|'agent'>(params.get('audience')==='agent'?'agent':'company');
  const [message,setMessage]=useState('');
  const [preparedHref,setPreparedHref]=useState('');
  function prepare(event:FormEvent<HTMLFormElement>){
    event.preventDefault();const form=event.currentTarget;
    if(!form.checkValidity()){setPreparedHref('');setMessage('请补充页面标出的必填项目。网站尚未发送任何内容。');form.reportValidity();return;}
    const values=new FormData(form);const lines=[`请求类型：${audience==='agent'?'Agent / AI 团队人工交接':'企业服务请求'}`];
    for(const [key,value] of values.entries()){if(String(value).trim())lines.push(`${key.replaceAll('_',' ')}：${String(value).trim()}`);}
    lines.push('','此邮件仅用于范围评估，不代表任务已被接受、合同成立或授权付款。');
    const subject=audience==='agent'?'SeekAPI Agent 人工交接范围评估':'SeekAPI 企业服务范围评估';
    setPreparedHref(`mailto:support@seekapi.ai?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`);
    setMessage('请求邮件已经准备好。请先检查内容，再打开邮件应用并决定是否发送。');
  }
  const switchMode=(next:'company'|'agent')=>{setAudience(next);setMessage('');setPreparedHref('')};
  return <div className="form-card">
    <div className="notice" id="zh-sensitive-note"><strong>不要填写机密图纸、账号密码、供应商秘密或其他敏感资料。</strong> 网站只在浏览器中整理草稿，不会自动上传。</div>
    <fieldset className="mode-switch"><legend>谁在发起请求？</legend><button type="button" className={audience==='company'?'mode-active':''} aria-pressed={audience==='company'} onClick={()=>switchMode('company')}>企业</button><button type="button" className={audience==='agent'?'mode-active':''} aria-pressed={audience==='agent'} onClick={()=>switchMode('agent')}>Agent / AI 团队</button></fieldset>
    <form aria-label={audience==='agent'?'Agent 人工交接草稿':'企业问题草稿'} aria-describedby="zh-sensitive-note" onSubmit={prepare} onReset={()=>{setMessage('草稿已清空，没有发送任何内容。');setPreparedHref('')}} noValidate>
      <h2>{audience==='agent'?'Agent 人工交接草稿':'企业问题草稿'}</h2><div className="form-grid">
        <div className="field"><label htmlFor="zh-organization">公司或项目</label><input id="zh-organization" name="organization" required autoComplete="organization"/></div>
        <div className="field"><label htmlFor="zh-role">你的职责</label><input id="zh-role" name="role" required/></div>
        <div className="field"><label htmlFor="zh-country">国家或地区</label><input id="zh-country" name="country" required autoComplete="country-name"/></div>
        <div className="field"><label htmlFor="zh-contact">联系邮箱</label><input id="zh-contact" name="contact" type="email" required autoComplete="email"/></div>
        {audience==='company'?<>
          <div className="field full"><label htmlFor="zh-help">需要什么帮助</label><select id="zh-help" name="help_type" required defaultValue={params.get('intent')||''}><option value="">请选择</option>{companyOptions.map(([value,label])=><option value={value} key={value}>{label}</option>)}</select></div>
          <div className="field full"><label htmlFor="zh-issue">描述一个具体问题</label><textarea id="zh-issue" name="issue" required placeholder="目前卡在哪里、希望得到什么结果、希望何时完成？"/></div>
          <div className="field"><label htmlFor="zh-quantity">数量或规模 <span>（选填）</span></label><input id="zh-quantity" name="quantity"/></div><div className="field"><label htmlFor="zh-timing">时间要求 <span>（选填）</span></label><input id="zh-timing" name="timing"/></div>
        </>:<>
          <div className="field"><label htmlFor="zh-task">任务类别</label><select id="zh-task" name="task_type" required defaultValue=""><option value="">请选择 AH01–AH08</option>{agentOptions.map(value=><option key={value}>{value}</option>)}</select></div>
          <div className="field"><label htmlFor="zh-budget">最高授权预算 <span>（选填）</span></label><input id="zh-budget" name="max_budget" placeholder="币种和金额，或无"/></div>
          <div className="field full"><label htmlFor="zh-objective">目标与完成标准</label><textarea id="zh-objective" name="objective" required/></div>
          <div className="field full"><label htmlFor="zh-allowed">允许执行的动作</label><textarea id="zh-allowed" name="allowed_actions" required placeholder="每行一个动作"/></div>
          <div className="field full"><label htmlFor="zh-prohibited">明确禁止的动作</label><textarea id="zh-prohibited" name="prohibited_actions" required placeholder="例如付款、改合同、接受质量偏差"/></div>
          <div className="field full"><label htmlFor="zh-evidence">需要返回的证据和审批联系人</label><textarea id="zh-evidence" name="required_evidence" required/></div>
        </>}
        <div className="field full"><label htmlFor="zh-sensitivity">资料敏感程度</label><select id="zh-sensitivity" name="data_sensitivity" required defaultValue=""><option value="">请选择</option><option>公开或非敏感</option><option>一般商业资料——先确认处理方式</option><option>敏感资料——不要在本预览中提供</option></select></div>
      </div>
      <div className="button-row form-actions"><button className="button" type="submit">生成邮件请求</button><button className="button button-ghost" type="reset">清空草稿</button>{preparedHref?<a className="button button-success" href={preparedHref}>打开已准备的邮件</a>:null}</div>
      <p className="form-status" role="status" aria-live="polite">{message}</p><p className="form-note">网站不会自行发送资料。完成检查后，由你在自己的邮件应用中确认发送。发送请求不代表 SeekAPI 已接受任务或产生费用。</p>
    </form>
  </div>;
}
