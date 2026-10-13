import type {PublicSamplePublication} from '@/lib/public-agent-sample';
/** The governance producer supplies escaped, digest-bound, passive markup. */
export function QualifiedPublicSample({publication}:{publication:PublicSamplePublication}){
 return <section className="section"><div className="container public-qualified-sample" dangerouslySetInnerHTML={{__html:publication.body_html}} /></section>;
}
