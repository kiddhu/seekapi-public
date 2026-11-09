import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {inflateRawSync} from 'node:zlib';

const source=new URL('../public/developers/free-mcp-quickstart/',import.meta.url);
const archive=new URL('../public/developers/free-mcp-quickstart.zip',import.meta.url);
test('the published Node SDK lock uses official HTTPS tarballs with integrity checks',()=>{
  const lock=JSON.parse(readFileSync(new URL('examples/package-lock.json',source),'utf8'));
  for(const [name,pkg] of Object.entries(lock.packages)){
    if(!pkg.resolved)continue;
    const url=new URL(pkg.resolved);
    assert.equal(url.protocol,'https:',name);
    assert.equal(url.hostname,'registry.npmjs.org',name);
    assert.match(pkg.integrity,/^sha512-/,name);
  }
});

function files(root,prefix=''){
  return readdirSync(root,{withFileTypes:true}).flatMap(entry=>{
    if(['node_modules','__pycache__','.venv'].includes(entry.name))return [];
    const relative=prefix+entry.name;
    return entry.isDirectory()?files(join(root,entry.name),relative+'/'):[relative];
  });
}
function crc32(bytes){
  let value=0xffffffff;
  for(const byte of bytes){
    value^=byte;
    for(let bit=0;bit<8;bit++)value=(value>>>1)^((value&1)?0xedb88320:0);
  }
  return (value^0xffffffff)>>>0;
}
test('the downloadable ZIP contains exactly the source examples and valid member bytes',()=>{
  const zip=readFileSync(archive),end=zip.lastIndexOf(Buffer.from([0x50,0x4b,0x05,0x06]));
  assert.ok(end>=0,'ZIP end record');
  const count=zip.readUInt16LE(end+10),found=[];
  let cursor=zip.readUInt32LE(end+16);
  for(let i=0;i<count;i++){
    assert.equal(zip.readUInt32LE(cursor),0x02014b50);
    const method=zip.readUInt16LE(cursor+10),crc=zip.readUInt32LE(cursor+16),size=zip.readUInt32LE(cursor+24);
    const compressed=zip.readUInt32LE(cursor+20),nameLength=zip.readUInt16LE(cursor+28);
    const name=zip.subarray(cursor+46,cursor+46+nameLength).toString('utf8');
    const local=zip.readUInt32LE(cursor+42);
    cursor+=46+nameLength+zip.readUInt16LE(cursor+30)+zip.readUInt16LE(cursor+32);
    assert.ok(name.startsWith('free-mcp-quickstart/')&&!name.split('/').includes('..'),name);
    if(name.endsWith('/'))continue;
    const relative=name.slice('free-mcp-quickstart/'.length);
    assert.ok(files(fileURLToPath(source)).includes(relative),name);
    assert.equal(zip.readUInt32LE(local),0x04034b50);
    const start=local+30+zip.readUInt16LE(local+26)+zip.readUInt16LE(local+28);
    const raw=zip.subarray(start,start+compressed);
    assert.ok(method===0||method===8,'stored or deflated ZIP member');
    const bytes=method===8?inflateRawSync(raw):raw;
    assert.equal(bytes.length,size,name);
    assert.equal(crc32(bytes),crc,name);
    assert.deepEqual(bytes,readFileSync(new URL(relative,source)),name);
    found.push(relative);
  }
  assert.deepEqual(found.sort(),files(fileURLToPath(source)).sort());
});
