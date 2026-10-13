import {readPublicSamplePublication,publicSampleJsonResponse} from '../../../../lib/public-agent-sample';
export const dynamic='force-static';
export async function GET(){return publicSampleJsonResponse(readPublicSamplePublication());}
