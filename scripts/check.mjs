import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.join(root,'dist');
const context={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(dist,'content.js'),'utf8'),context);
const data=context.window.PORTFOLIO;
assert.equal(data.name,'Usman Dev');
assert.equal(data.email,'usmandev234@gmail.com');
assert.equal(data.whatsapp,'+923157543808');
assert.ok(fs.existsSync(path.join(dist,data.resume)),'Missing downloadable CV');
for(const css of ['style.css','editor.css']) assert.ok(!fs.readFileSync(path.join(dist,css),'utf8').includes('fonts.googleapis.com'),'External font loading returned');
for(const asset of [data.photo,data.logo]) assert.ok(fs.existsSync(path.join(dist,asset)),`Missing branding asset: ${asset}`);
let galleryCount=0;
for(const door of data.doors) for(const project of door.projects){
  for(const url of [project.github,project.url].filter(Boolean)) assert.ok(['http:','https:'].includes(new URL(url).protocol));
  for(const image of [project.image,...(project.gallery||[]).map(x=>x.src)].filter(Boolean)){
    if(image.startsWith('images/')){assert.ok(!image.includes('..'));assert.ok(fs.existsSync(path.join(dist,image)),`Missing image: ${image}`);}
    else assert.ok(['http:','https:'].includes(new URL(image).protocol));
  }
  if(project.gallery?.length){assert.equal(project.gallery.length,5);galleryCount+=project.gallery.length;}
}
assert.equal(galleryCount,20);
assert.ok(data.doors.some(door=>door.title==='Video Editing'));
for(const file of ['app.js','editor.js','content.js']) new vm.Script(fs.readFileSync(path.join(dist,file),'utf8'),{filename:file});
for(const file of ['index.html','editor.html']){
  const html=fs.readFileSync(path.join(dist,file),'utf8');
  for(const [,asset] of html.matchAll(/(?:src|href)="([^"#]+)"/g)) if(!/^(?:https?:|mailto:)/.test(asset))assert.ok(fs.existsSync(path.join(dist,asset)),`Missing ${file} asset: ${asset}`);
}
assert.equal(JSON.parse(fs.readFileSync(path.join(root,'vercel.json'),'utf8')).outputDirectory,'dist');
console.log('PASS: source syntax, branding/contact data, local references, twenty gallery assets and static deployment settings.');
