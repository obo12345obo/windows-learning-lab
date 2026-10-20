const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const output = path.join(root, '_site');
const pages = ['index.html', 'lessons.html', 'update.html', 'cleanup.html', 'lab.html'];
const queue = [...pages];
const files = new Set();
function enqueue(from, value) {
  const clean=value.split(/[?#]/)[0];
  if (!clean || /^(?:https?:|mailto:|tel:|data:)/i.test(clean)) return;
  if (/^(?:file:|[a-z]:[\\/]|\/)/i.test(clean)) throw Error(`Non-portable URL in ${from}: ${clean}`);
  const absolute=path.resolve(root,path.dirname(from),clean);
  const relative=path.relative(root,absolute);
  if(relative.startsWith('..')||path.isAbsolute(relative)) throw Error(`Asset outside website: ${from}`);
  queue.push(relative.split(path.sep).join('/'));
}
while(queue.length) {
  const file=queue.shift();
  if(files.has(file))continue;
  const absolute=path.join(root,file);
  if(!fs.existsSync(absolute)||!fs.statSync(absolute).isFile())throw Error(`Missing asset: ${file}`);
  files.add(file);
  const ext=path.extname(file);
  if(!['.html','.css','.js'].includes(ext))continue;
  const content=fs.readFileSync(absolute,'utf8');
  if(ext==='.js')new vm.Script(content,{filename:file});
  if(ext==='.html') {
    if(!content.includes('width=device-width'))throw Error(`Missing viewport: ${file}`);
    for(const match of content.matchAll(/(?:src|href)="([^"]+)"/g))enqueue(file,match[1]);
    for(const match of content.matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(match[1],{filename:file});
  }
  if(ext==='.css')for(const match of content.matchAll(/url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/g))enqueue(file,match[1]);
}
// Never delete a computed directory outside this checkout.
if(path.dirname(output)!==root||path.basename(output)!=='_site')throw Error('Invalid output path');
fs.rmSync(output,{recursive:true,force:true});
fs.mkdirSync(output,{recursive:true});
for(const file of files) {
  const destination=path.join(output,file);
  fs.mkdirSync(path.dirname(destination),{recursive:true});
  fs.copyFileSync(path.join(root,file),destination);
}
fs.writeFileSync(path.join(output,'.nojekyll'),'');
console.log(`Prepared ${files.size} website files in _site/. Entry point: index.html`);
