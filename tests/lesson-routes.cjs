const fs=require('fs'),vm=require('vm'),assert=require('assert');
function load(file,lesson=''){
 const elements=new Map(),timers=[];let next=0;
 class Element{
  constructor(id=''){this.id=id;this.hidden=false;this.style={};this.dataset={};this.value='';this.checked=false;this.children=[];this.listeners={};this.classList={add(){},remove(){},toggle(){}};this._html='';}
  set innerHTML(html){this._html=html;for(const tag of html.matchAll(/<[^>]+\bid="([^"]+)"[^>]*>/g)){const e=new Element(tag[1]);e.value=(tag[0].match(/\bvalue="([^"]*)"/)||[])[1]||'';e.checked=/\bchecked\b/.test(tag[0]);elements.set(e.id,e);}}
  get innerHTML(){return this._html}set textContent(v){this._text=v}get textContent(){return this._text||''}
  appendChild(e){this.children.push(e)}addEventListener(name,fn){this.listeners[name]=fn}querySelectorAll(){return []}querySelector(){return null}scrollIntoView(){}focus(){}
 }
 const html=fs.readFileSync(file,'utf8');for(const id of html.matchAll(/\bid="([^"]+)"/g))elements.set(id[1],new Element(id[1]));
 if(elements.has('complete'))elements.get('complete').hidden=true;
 const doc={getElementById:id=>elements.get(id)||null,createElement:()=>new Element(),querySelectorAll:()=>[],addEventListener(){}};
 const win={markLessonComplete:id=>{win.completed=id}};
 const context={window:win,document:doc,location:{search:lesson?'?lesson='+lesson:'',pathname:'/'+file},URLSearchParams,setTimeout:fn=>{const id=++next;timers.push([id,fn]);return id},clearTimeout:id=>{const t=timers.find(t=>t[0]===id);if(t)t[1]=()=>{}},console};
 vm.createContext(context);
 if(file==='lab.html'){vm.runInContext(fs.readFileSync('curriculum.js','utf8'),context);vm.runInContext(fs.readFileSync('lab.js','utf8'),context)}
 else if(file==='cleanup.html')vm.runInContext(fs.readFileSync('cleanup.js','utf8'),context);
 else for(const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g))vm.runInContext(match[1],context);
 const run=code=>vm.runInContext(code,context);
 const flush=()=>{let guard=0;while(timers.length){if(++guard>200)throw Error('Timer loop');timers.shift()[1]();}};
 return{run,flush,elements,win,act:a=>run(`handle('${a}')`)};
}
let t=load('update.html');for(const a of ['start','settings','security','windowsupdate','check'])t.run(`action('${a}')`);t.flush();assert.equal(t.run('updateState'),'done');assert.equal(t.win.completed,'update');console.log('PASS Update: source route, automatic installation and restart without manual click');
t=load('lab.html','format');for(const a of ['pc','connect','menu','format','startFormat','confirmFormat'])t.act(a);t.flush();for(const a of ['menu','rename'])t.act(a);t.elements.get('newName').value='STUDENT';t.act('saveName');assert.equal(t.run('usbName'),'STUDENT');assert.equal(t.win.completed,'format');console.log('PASS Flash: connect, context menu, Format, rename');
t=load('lab.html','upgrade');for(const a of ['word','review2013','inspectInk','version2016','review2016','inking'])t.act(a);t.act('conclude');assert.equal(t.run('done'),false);t.elements.get('comparisonAnswer').value='Inking متوفر في النسختين؛ الترقية انتقال لإصدار جديد.';t.act('conclude');assert.equal(t.win.completed,'upgrade');console.log('PASS Word: inspect Review and Inking in both versions; conclusion required');
t=load('lab.html','check');for(const a of ['pc','menu','properties','tools','check','scan'])t.act(a);t.flush();assert.equal(t.win.completed,'check');assert.equal(t.run('page'),'scanresult');console.log('PASS Check Disk: Properties, Tools, Check, Scan drive, result');
t=load('lab.html','defrag');const pc=t.elements.get('pcTarget');pc.dataset.action='pc';const target={closest:()=>pc};t.elements.get('screen').listeners.click({target});assert.equal(t.run('step'),0);pc.listeners.dblclick();assert.equal(t.run('step'),1);for(const a of ['menu','properties','tools','optimize','chooseDrive','runOptimize'])t.act(a);t.flush();t.act('changeSettings');t.elements.get('scheduleOn').checked=true;t.elements.get('frequency').value='Monthly';t.act('saveSchedule');assert.equal(t.win.completed,'defrag');assert.equal(t.run('frequency'),'Monthly');console.log('PASS Defragment: double-click required, Optimize selected partition, schedule Monthly');
t=load('lab.html','storage');for(const a of ['start','settings','system','storage','enableSense'])t.act(a);assert.equal(t.win.completed,'storage');assert.equal(t.run('senseOn'),true);console.log('PASS Storage: Start, Settings, System, Storage, On');
t=load('lab.html','restart');for(const a of ['start','power','restart'])t.act(a);t.flush();assert.equal(t.win.completed,'restart');t.act('scenario');for(const a of ['security','taskmanager','selectApp','endTask','start','power','restart'])t.act(a);t.flush();assert.equal(t.run('appEnded'),true);assert.equal(t.win.completed,'restart');console.log('PASS Restart: Start, Power, Restart and CTRL+ALT+DEL / Task Manager scenario');
t=load('lab.html','review');assert.equal(t.win.reviewItems.length,7);assert(t.win.reviewItems[3].q.includes('إيقاف'));assert(t.win.reviewItems[4].items[0].includes('المزدوج'));console.log('PASS Review: 7 questions in source order, shutdown/restart and double-click covered');

t=load('cleanup.html');t.run("action('search')");t.elements.get('searchInput').value='Disk Cleanup';t.run("renderResults(); action('openCleanup')");t.elements.get('driveSelect').value='C';t.run("action('driveOK'); selectFile('previous',true); action('cleanupOK'); action('deleteFiles')");t.flush();assert.equal(t.win.completed,'cleanup');assert(t.run('cleanedMB')>0);assert.equal(t.run('stage'),5);console.log('PASS Cleanup: search Disk Cleanup, choose drive, Previous Windows installations, confirmation and space recovered');