import {DecisionGuide} from '@/components/decision-guide';
import guides from '@/data/sourcing-decisions.json';
import {pageMetadata} from '@/lib/site';
const guide=guides.find(g=>g.id==="quotes")!;
export const metadata=pageMetadata(guide.title,guide.direct_answer,guide.canonical_path);
export default function Page(){return <DecisionGuide guide={guide}/>;}
