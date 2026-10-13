import * as THREE from './vendor/three.module.js';
import {documentSurface} from './document-art.js';
const cylinder=new THREE.CylinderGeometry(1,1,1,8),cone=new THREE.CylinderGeometry(.7,1,1,8),ring=new THREE.TorusGeometry(1,.15,4,8);
const palette={wood:0x9c7954,dark:0x364b47,cream:0xeee2bc,metal:0xabb9af,gold:0xcda65d,red:0xb8433c,teal:0x599b92};
export function addDetails({index,B,box,group,label,animations,refs,material,textures=true,dynamic=[]}){
 const {wood,dark,cream,metal,gold,red,teal}=palette;
 function child(parent,x=0,y=0,z=0){const g=new THREE.Group();g.position.set(x,y,z);parent.add(g);return g}
 function cyl(p,x,y,z,r,h,c,rx=0,rz=0,taper=false){const m=new THREE.Mesh(taper?cone:cylinder,material(c));m.position.set(x,y,z);m.scale.set(r,h,r);m.rotation.set(rx,0,rz);m.castShadow=true;m.receiveShadow=true;p.add(m);return m}
 function torus(p,x,y,z,r,c,rx=0){const m=new THREE.Mesh(ring,material(c));m.position.set(x,y,z);m.scale.setScalar(r);m.rotation.x=rx;p.add(m);return m}
 function beam(p,a,b,width,c){const aa=new THREE.Vector3(...a),bb=new THREE.Vector3(...b),m=box(p,0,0,0,width,aa.distanceTo(bb),width,c);m.position.copy(aa).add(bb).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),bb.sub(aa).normalize());return m}
 function plaque(p,title,x,y,z,w,h,bg='#294741',fg='#eee5c6'){return label(title,x,y,z,w,h,bg,fg,p)}
 function paperFace(parent,kind,title,x,y,z,w,h,flat=false){return documentSurface({parent,kind,title,x,y,z,w,h,flat,enabled:textures,resources:dynamic})}
 function page(p,x,y,z,w=.8,h=1.05,heading='REPORT'){box(p,x,y,z,w,.025,h,cream);const kind=heading.includes('SURVEY')?'survey':heading.includes('RESEARCH')?'research':'report';paperFace(p,kind,heading,x,y+.014,z,w*.96,h*.96,true);}
 function binder(p,x,y,z,title,kind='report',color=teal){const g=child(p,x,y,z);box(g,0,0,0,1.08,1.42,.17,color);box(g,0,0,.096,.94,1.29,.028,cream);box(g,-.51,0,.02,.12,1.43,.22,color);for(const yy of [-.51,.51])box(g,-.51,yy,.15,.125,.035,.035,gold);paperFace(g,kind,title,.04,0,.115,.86,1.2);for(let j=0;j<6;j++)box(g,.49,-.56+j*.21,.055,.014,.01,.1,0xc0b594);return g;}

 function monitor(p,x,y,z,w=1.2,title='DATA',kind='chart'){
  const g=child(p,x,y,z);box(g,0,.12,0,w*.42,.07,.4,dark);box(g,0,.35,0,.08,.48,.12,metal);box(g,0,.78,0,w,.77,.12,dark);box(g,0,.78,.066,w-.1,.65,.018,0x213c3a);plaque(g,title,0,1.0,.085,w*.84,.14);
  if(kind==='chart'){for(let i=0;i<5;i++)box(g,-w*.34+i*w*.16,.57+i*.02,.087,w*.1,.12+i*.07,.016,[teal,gold,0x92b281][i%3]);box(g,0,.46,.09,w*.8,.016,.02,cream)}else{for(let j=0;j<5;j++){box(g,-w*.32+j%2*.05,.84-j*.07,.087,w*(.48+j%3*.05),.02,.016,j%2?0xb1c598:0x75b0a1)}}return g
 }
 function keyboard(p,x,y,z,w=1){box(p,x,y,z,w,.06,.38,0x5c6b60);for(let row=0;row<3;row++)for(let k=0;k<9;k++)box(p,x-w*.42+k*w*.105,y+.04,z-.12+row*.105,w*.07,.025,.067,0xc5cdb6);box(p,x,y+.04,z+.15,w*.4,.025,.06,cream)}
 function cameraModel(p,x=0,y=0,z=0,scale=1,tripod=true){const g=child(p,x,y,z);g.scale.setScalar(scale);if(tripod){for(const a of [0,2.1,4.2])beam(g,[0,-.22,0],[Math.sin(a)*.55,-1.45,Math.cos(a)*.55],.07,0x51584d);box(g,0,-.2,0,.48,.12,.45,metal)}box(g,0,.15,0,.9,.64,.52,dark);box(g,.48,.13,0,.16,.5,.48,0x687971);cyl(g,0,.15,-.45,.26,.47,0x2b3837,Math.PI/2);cyl(g,0,.15,-.73,.3,.14,metal,Math.PI/2);cyl(g,0,.15,-.815,.24,.015,0x599aaa,Math.PI/2);box(g,-.08,.24,-.827,.055,.055,.008,0xb9e6d7);box(g,0,.57,0,.55,.11,.13,dark);box(g,-.23,.49,0,.1,.23,.1,dark);box(g,.23,.49,0,.1,.23,.1,dark);box(g,-.48,.2,0,.055,.45,.54,dark);box(g,-.516,.2,0,.018,.32,.39,0x84aca2);box(g,.25,.38,.27,.1,.07,.03,red);plaque(g,'REC',0,.22,.275,.5,.19);return g}
 function books(p,x,y,z){const titles=['ENGLISH','MANDARIN','CANTONESE'];for(let i=0;i<3;i++){box(p,x+i*.19,y,z,.16,.64+i*.04,.48,[teal,red,gold][i]);box(p,x+i*.19,y,z+.247,.12,.5,.025,0xd4d9bc);plaque(p,titles[i],x+i*.19,y,z+.265,.13,.32,'#d4d9bc','#425a4e')}}
 function bookDetail(b,title='GLOBAL MANAGEMENT'){if(!b)return;const lid=b.userData.lid;if(lid.children[1])lid.remove(lid.children[1]);if(index===9){b.scale.setScalar(.9);b.rotation.x=.75;}for(let j=0;j<7;j++){box(b,0,.03+j*.022,.488,1.35,.006,.019,0xb5aa8d);box(b,.698,.03+j*.022,0,.015,.006,.96,0xb5aa8d)}box(b,-.7,.105,0,.09,.23,1.08,0x31584d);for(const z of [-.35,.35])box(b,-.75,.12,z,.012,.23,.06,gold);
 paperFace(lid,'cover',index===9?'CURRICULUM / VITAE':'GLOBAL / MANAGEMENT',.73,.047,0,1.44,.99,true);
 for(const x of [.1,1.36])for(const z of [-.44,.44]){box(lid,x,.052,z,.15,.012,.08,gold)}
 paperFace(b,index===9?'cv':'academic-hku',index===9?'LIU ZESHENG':'MY EDUCATION',0,.182,0,1.3,.9,true);
 const inside=paperFace(lid,index===9?'academic':'academic-must','MY JOURNEY',.73,-.043,0,1.33,.9,true);if(inside){inside.rotation.set(Math.PI/2,0,Math.PI);inside.name="education-left-page";}
 for(let i=0;i<5;i++){box(b,-.73,.13,-.4+i*.2,.13,.23,.045,0x9c7954);}box(b,-.61,.189,0,.028,.01,.86,0xb5aa8d);box(b,.33,.19,.54,.1,.012,.36,red);box(b,.33,.177,.7,.1,.033,.045,gold);
}

 function boatDetail(g){if(!g)return;for(let j=0;j<9;j++)box(g,0,.12,-1.65+j*.4,2.05,.04,.023,0x68523b);for(let j=0;j<5;j++){box(g,-1.26,.31,-1.4+j*.7,.025,.15,.05,metal);box(g,1.26,.31,-1.4+j*.7,.025,.15,.05,metal)}box(g,0,.38,-1.1,2.15,.13,.4,wood);box(g,0,-.2,0,.35,.18,3.9,0x5f4936);torus(g,.72,.26,1.15,.21,0xd0b57d,Math.PI/2);for(const o of g.userData.oars||[])box(o,0,0,0,.18,.17,.18,metal)}
 if(index<0){boatDetail(refs.boat);label('WELCOME / START HERE',0,2.9,22.6,4,.42);return}
 if(index===0){
  bookDetail(refs.book);refs.book.scale.setScalar(.68);refs.book.rotation.x=.4;refs.book.name="education-book";const diploma=group(-3.4,0,-6);box(diploma,0,1.85,0,1.8,1.5,.16,wood);box(diploma,0,1.85,.09,1.58,1.28,.02,cream);plaque(diploma,'DEGREE',0,2.22,.12,1.2,.27,'#eee2bc','#46584b');plaque(diploma,'3.75 / 4.0',0,1.88,.12,1.3,.25,'#eee2bc','#46584b');for(let j=0;j<3;j++)box(diploma,0,1.6-j*.1,.12,1.1,.02,.02,0xa2a789);cyl(diploma,.5,1.48,.13,.13,.015,gold,Math.PI/2);B(-3.4,.65,-6,.12,1.3,.12,wood);
  const cap=group(3.8,1.2,-5.5);box(cap,0,0,0,.7,.35,.65,dark);box(cap,0,.22,0,1.15,.07,1.15,dark,0,.2);beam(cap,[0,.27,0],[.5,.29,.45],.025,gold);beam(cap,[.5,.29,.45],[.5,-.25,.45],.025,gold);box(cap,.5,-.33,.45,.09,.18,.09,gold);B(3.8,.5,-5.5,1.5,1,1.5,wood);label('HONOURS & SCHOLARSHIP',3.8,1,-4.72,2.7,.35);
  for(const p of refs.pages||[])for(let j=0;j<4;j++)box(p,0,.02,-.2+j*.13,.32,.006,.016,0x929b7d);
 }else if(index===1){
  // Tracked excavator: treads, cab, hydraulic arm and toothed bucket.
  const digger=group(-2,.15,-3);digger.rotation.y=.35;for(const x of [-.68,.68]){box(digger,x,.22,0,.4,.38,1.85,dark);for(let j=0;j<8;j++)box(digger,x,.02,-.8+j*.23,.43,.09,.1,0x52615a);for(const z of [-.65,-.2,.25,.65])cyl(digger,x,.22,z,.17,.45,metal,0,Math.PI/2)}box(digger,0,.55,0,1.3,.25,1.3,gold);box(digger,-.38,1,-.25,.65,.75,.65,0xd0a745);box(digger,-.38,1.05,.09,.5,.48,.03,0x80b1b7);box(digger,-.73,1.05,-.25,.025,.48,.5,0x759da6);box(digger,.35,.75,-.48,.6,.4,.72,gold);beam(digger,[.35,.9,.1],[.35,1.95,.55],.24,gold);beam(digger,[.35,1.95,.55],[.35,1.15,1.4],.18,gold);beam(digger,[.5,1.12,.16],[.5,1.75,.5],.065,metal);box(digger,.35,1,1.5,.6,.28,.55,dark,-.3);for(let j=0;j<4;j++)box(digger,.12+j*.15,.89,1.76,.08,.1,.2,metal);plaque(digger,'INDUSTRY',0,.6,.71,.85,.18);
  for(const y of [.35,1.05])for(const x of [-.7,.7]){B(-2+x,y,-3,.1,.1,.1,metal);}
  const desk=group(3.8,0,-3.1);box(desk,0,1,0,2.7,.15,1.65,wood);for(const x of [-1.1,1.1])box(desk,x,.5,0,.1,1,.1,dark);monitor(desk,.65,1.08,-.4,1.1,'PEER DATA');keyboard(desk,.65,1.15,.25,.85);page(desk,-.6,1.1,.15,.8,1.1,'RESEARCH');plaque(desk,'40-PAGE REPORT',-.6,1.45,.65,1.2,.24);
  B(.5,.55,-4.4,2.5,1.1,1.15,wood);const heroReport=binder(group(),.5,1.86,-4.35,'ZOOMLION','research');heroReport.rotation.x=-.12;
  for(let j=0;j<4;j++)B(0,.9+j*.55,-6.77,10.3,.012,.012,0x8faaa0);B(0,.45,-6.25,10.8,.06,.06,cream);label('PEER COMPARISON / ILLUSTRATION',0,2.92,-6.74,5.7,.32);for(let i=0;i<5;i++)label(String(i+1),-4+i*2,.28,-6.22,.4,.24);
  if(refs.scope){refs.scope.clear();cyl(refs.scope,0,.5,0,.32,2.5,teal,Math.PI/2);cyl(refs.scope,0,.5,-1.32,.43,.2,gold,Math.PI/2);cyl(refs.scope,0,.5,-1.435,.34,.04,0x568b9c,Math.PI/2);cyl(refs.scope,0,.5,1.38,.16,.3,dark,Math.PI/2)}
 }else if(index===2){
  boatDetail(refs.boat);boatDetail(refs.guideBoat);for(const [i,p] of (refs.parcels||[]).entries()){p.clear();box(p,0,-.2,0,.85,.14,.85,wood);box(p,0,.3,0,.66,.91,.065,cream);box(p,0,.65,.041,.57,.15,.016,teal);paperFace(p,'order','UTOUR',0,.29,.067,.6,.83);for(let j=0;j<4;j++)box(p,-.03,.46-j*.14,.047,.44,.018,.016,0x8d9f8c);box(p,.2,-.02,.05,.11,.07,.018,gold)}
  for(const [x,z,title] of [[-7,9,'01 / TRAVEL ORDERS'],[6,-2,'02 / CLEAN & PROCESS'],[-7,-16,'03 / MONTHLY REPORT']]){B(x,1,z,.16,2,.16,wood);B(x,2.2,z,3.7,.85,.17,wood);label(title,x,2.2,z+.1,3.45,.64);B(x,3.05,z,4.2,.25,2,teal);for(const dx of [-1.7,1.7])B(x+dx,1.5,z-.5,.15,3,.15,wood);}
  const bags=group(-6,.2,9.7);box(bags,0,.42,0,.65,.8,.35,0x947d56);box(bags,0,.9,0,.28,.12,.12,dark);for(const x of [-.22,.22])cyl(bags,x,0,0,.08,.12,dark,Math.PI/2);box(bags,.6,.28,.05,.43,.52,.18,0x426c68);plaque(bags,'PASSPORT',.6,.3,.15,.35,.18);B(-6,0,11,3,.15,3,wood);
  // Oak posts, stepped roof and framed windows echo a crafted voxel village.
  for(const [x,z] of [[-9.95,8.7],[-6.05,8.7],[-9.95,11.3],[-6.05,11.3]])B(x,1.15,z,.28,2.3,.28,0x795032);
  for(let tier=0;tier<3;tier++){B(-8,2.65+tier*.27,10,4.6-tier*.7,.27,3.3-tier*.55,wood);}
  for(const x of [-9.35,-6.65])for(const dx of [-.53,.53]){B(x+dx,1.2,11.44,.09,1.05,.09,wood);}
  for(const [x,z] of [[-5.6,10],[5.5,-2],[-5.6,-15]])for(const dx of [-1.5,1.5]){const post=group(x+dx,1.45,z-1.2);box(post,0,-.45,0,.15,.9,.15,dark);box(post,0,.06,0,.35,.44,.35,0xf2c967,0,0,0,true);for(const k of [-.19,.19]){box(post,k,.06,.19,.035,.5,.035,dark);box(post,k,.06,-.19,.035,.5,.035,dark)}box(post,0,.32,0,.45,.08,.45,dark);box(post,0,-.21,0,.45,.08,.45,dark);}
  // Recognisable travel and reporting stations along the boat's route.
  for(const [x,z] of [[-5.6,10],[5.5,-2],[-5.6,-15]]){for(let j=0;j<9;j++)B(x,.1,z-1.6+j*.4,3.4,.18,.34,wood);for(const dx of [-1.5,1.5]){B(x+dx,.7,z,.15,1.2,.15,wood);B(x+dx,1.18,z,.16,.12,3.5,wood)}for(const dz of [-1.4,1.4])cyl(group(x,.3,z+dz),0,0,0,.16,.7,dark);}
  const terminal=group(-8,0,10);box(terminal,0,1.1,0,4,2.2,2.7,cream);box(terminal,0,2.35,0,4.4,.3,3.2,teal);box(terminal,0,.95,1.37,.85,1.9,.08,dark);for(const x of [-1.35,1.35]){box(terminal,x,1.2,1.39,.95,.9,.05,0x85bcb9);box(terminal,x,1.2,1.44,.03,.9,.03,cream)}plaque(terminal,'UTOUR / TRAVEL ORDERS',0,1.98,1.42,3.6,.28);
  const bus=group(-8,.2,14);box(bus,0,.6,0,2.8,1.05,1.15,teal);box(bus,0,1.25,0,2.55,.35,1.05,cream);for(let j=0;j<4;j++)box(bus,-.93+j*.62,1,.59,.48,.35,.025,0x96c9c5);for(const x of [-.85,.85])for(const z of [-.62,.62])cyl(bus,x,.15,z,.24,.15,dark,Math.PI/2);box(bus,1.42,.75,0,.025,.5,.84,0x96c9c5);plaque(bus,'TRAVEL',0,.55,.6,1.5,.22);
  const gate=group(5.7,0,-2);box(gate,0,1,0,3,.16,1.8,wood);for(const x of [-1.25,1.25])box(gate,x,.5,0,.12,1,.12,dark);monitor(gate,0,1.1,-.3,1.85,'PYTHON / CLEAN DATA','code');keyboard(gate,0,1.15,.4,1.3);page(gate,-1,1.12,.2,.65,.9,'RAW');page(gate,1,1.12,.2,.65,.9,'CLEAN');plaque(gate,'01 RAW  >  02 CLEAN  >  03 REPORT',0,2.5,.3,4.1,.32);
  const output=group(-6,0,-15);box(output,0,1,0,3.8,.18,2,wood);for(const x of [-1.5,1.5])box(output,x,.5,0,.14,1,.14,dark);monitor(output,.8,1.1,-.3,1.65,'MONTHLY GMV');keyboard(output,.8,1.15,.55,1.25);page(output,-.8,1.12,.2,1.15,1.5,'MONTHLY REPORT');plaque(output,'DAYS  >  MINUTES',0,2.65,.4,3.9,.45);plaque(output,'EXCEL / PYTHON / SOP',0,.8,1.04,3.2,.3);
  for(const [x,z] of [[-5.6,10],[5.5,-2],[-5.6,-15]]){const mooring=group(x,.3,z+1.25);for(const dx of [-1.1,1.1]){cyl(mooring,dx,.22,0,.12,.6,dark);for(let j=0;j<3;j++)torus(mooring,dx,.27+j*.065,0,.16,0xc8b280,Math.PI/2)}beam(mooring,[-1.1,.4,0],[1.1,.4,0],.035,0xc8b280);}
  const reportStack=group(-7.15,1.12,-14.9);for(let j=0;j<5;j++)page(reportStack,0,j*.035,0,.7,1,'REPORT');
  for(const p of refs.parcels||[]){const stamp=child(p,.18,.02,.088);beam(stamp,[-.1,.03,0],[-.02,-.04,0],.035,teal);beam(stamp,[-.02,-.04,0],[.12,.12,0],.035,teal);animations.push(()=>stamp.visible=p.position.z<2)}
  const reportBinder=binder(output,-.85,1.82,-.18,'MONTHLY REPORT','report');reportBinder.scale.setScalar(.9);reportBinder.rotation.x=-.12;
  // Reed beds, rope moorings and ripples add scale without crowding the channel.
  for(let j=0;j<20;j++){const z=16-j*1.65,x=Math.sin(z*.1)*2.7;for(const side of [-1,1]){for(let k=0;k<3;k++)B(x+side*(4.4+k*.14),.35+k*.12,z,.055,.7+k*.24,.055,0x809867);B(x+side*4.5,-.05,z,.7,.22,.55,0xa4b5a1)}}
  const wakes=[];for(let j=0;j<8;j++){const w=group();box(w,0,0,0,.75,.018,.035,0xc8e5d5);wakes.push(w)}animations.push(t=>{const boat=refs.boat;if(!boat)return;wakes.forEach((w,j)=>{const age=(t*.6+j/8)%1;w.position.set(boat.position.x+(j%2?1:-1)*(.5+age),-.475,boat.position.z+1+age*3);w.scale.x=.6+age*1.8;w.visible=age<.9})});
  for(const [i,p] of (refs.parcels||[]).entries()){plaque(p,'#'+String(26001+i),0,-.06,.086,.48,.075,'#eee2bc','#425c51');animations.push(()=>{const z=p.position.z;const tint=z>2?gold:z>-10?teal:0x92b281;p.children[2].material=material(tint);p.scale.setScalar(z<-10?.85:1)})}
 }else if(index===3){
  for(const can of refs.cans||[]){can.clear();cyl(can,0,0,0,.24,.73,red);cyl(can,0,.38,0,.22,.055,metal);cyl(can,0,-.38,0,.22,.055,metal);torus(can,0,.415,0,.06,dark,Math.PI/2);box(can,0,.415,-.05,.08,.015,.08,0x677971);plaque(can,'COLA',0,.04,.242,.35,.24,'#b8433c','#fff0ce');for(let i=0;i<3;i++)box(can,-.08+i*.07,-.14+i*.018,.24,.11,.027,.02,cream)}
  refs.cam?.clear();if(refs.cam){const c=cameraModel(refs.cam,0,0,0,1,true);c.rotation.y=-.15}
  if(refs.clapper){plaque(refs.clapper,'B2B / PRODUCTION',0,.19,.086,1.65,.23,'#34433b','#eee2bc');plaque(refs.clapper,'SCENE 01   TAKE 01',0,-.12,.086,1.65,.19,'#34433b','#eee2bc');for(let j=0;j<2;j++)box(refs.clapper,0,-.3+j*.1,.088,1.4,.015,.01,0x91a497)}
  for(const x of [-4]){const softbox=group(x,2,-2);box(softbox,0,.04,-.09,1.32,.92,.12,dark);box(softbox,0,.04,.02,1.14,.75,.02,0xf4e8bf);for(const dx of [-.68,.68])box(softbox,dx,.04,.12,.2,.94,.1,dark,0,dx>0?.5:-.5);for(const a of [0,2.1,4.2])beam(softbox,[0,-1,0],[Math.sin(a)*.5,-1.95,Math.cos(a)*.5],.045,dark)}
  if(refs.cam){const tally=box(refs.cam,.32,.45,.32,.08,.055,.035,red,0,0,0,true);animations.push((t,a)=>{tally.visible=a>0&&Math.sin(t*2.5)>-.25});}
  const storyboard=group(5.4,.15,2);box(storyboard,0,1.8,0,2.2,1.6,.12,cream);for(const x of [-.8,.8])box(storyboard,x,.8,-.12,.08,1.8,.08,dark);plaque(storyboard,'SCRIPT > SHOOT > EDIT',0,2.4,.08,2,.22,'#eee2bc','#456457');for(let i=0;i<3;i++){box(storyboard,-.68+i*.68,1.91,.08,.54,.46,.025,teal);for(let j=0;j<3;j++)box(storyboard,-.68+i*.68,1.54-j*.12,.085,.48,.018,.018,0x81918a);}
  label('MARKETING & CONTENT',2,3.2,-7.54,5.7,.5,'#a3453c');label('B2B FILM SET',2,.85,-2.9,2,.3);label('BEVERAGE INDUSTRY',-4,.72,6.7,2.4,.28);
 }else if(index===4){
  for(const sheet of refs.sheets||[])paperFace(sheet,'cv','RESUME',0,.037,0,.76,1.06,true);
  for(const sheet of refs.sheets||[]){box(sheet,-.23,.021,-.25,.19,.008,.23,0xa8b4a2);box(sheet,-.23,.028,-.28,.075,.006,.08,0x7f9384);box(sheet,-.23,.028,-.2,.12,.006,.07,0x7f9384);for(let j=0;j<3;j++)box(sheet,.1,.02,-.3+j*.075,.24,.007,.014,0x6e8479)}
  const trays=group(0,0,-2);for(const [x,name] of [[-1.1,'TO REVIEW'],[1.1,'REVIEWED']]){box(trays,x,1.16,.05,1.05,.07,1.3,dark);box(trays,x-.52,1.28,.05,.06,.24,1.3,dark);box(trays,x+.52,1.28,.05,.06,.24,1.3,dark);plaque(trays,name,x,1.17,.72,.93,.18)}
  if(refs.stamp){const st=refs.stamp;st.clear();st.name='review-stamp';box(st,0,-.1,0,.64,.15,.56,0x65513c);box(st,0,-.19,0,.57,.04,.49,0x6d3935);box(st,0,.035,0,.5,.12,.42,metal);cyl(st,0,.27,0,.1,.42,wood);cyl(st,0,.52,0,.22,.18,0x65513c);box(st,0,.62,0,.38,.07,.32,wood);plaque(st,'HR',0,-.06,.292,.35,.14,'#65513c');}
  // An open red ink pad and an upright sample make the reviewing task recognisable.
  const pad=group(2,1.15,-2);box(pad,0,.025,0,.66,.08,.6,dark);box(pad,0,.08,0,.54,.03,.49,red);box(pad,0,.27,-.32,.66,.48,.06,dark);plaque(pad,'INK',0,.28,-.28,.5,.17);
  const sample=binder(group(),-2,1.85,-2.7,'EMPLOYEE FILE','cv',teal);sample.rotation.x=-.12;
  for(const x of [-2.45,2.45]){B(x,.48,-2,.25,.95,1.9,0x795032);B(x,1.07,-2,.3,.18,2.55,0x795032);}B(0,.38,-2,4.8,.18,.25,wood);

  for(const [i,sheet] of (refs.sheets||[]).entries()){box(sheet,.32,.025,-.43,.17,.012,.2,[teal,gold,red][i%3]);const checked=child(sheet,.13,.045,.27);checked.rotation.x=-Math.PI/2;plaque(checked,'VERIFIED',0,0,.001,.43,.16,'#eee2bc','#b8433c');animations.push((t,a)=>checked.visible=a>i*.3+1.1);}
  const pc=group(0,1.22,-5.1);B(0,1.1,-5.1,2.4,.18,1.6,wood);monitor(pc,0,0,-.2,1.4,'HR RECORDS','code');keyboard(pc,0,.03,.5,1.1);for(const [x,title] of [[-5,'RECRUITMENT'],[5,'EMPLOYEE FILES']])for(const z of [-4,-1,2]){
   const rack=group(x,0,z);rack.rotation.y=x<0?Math.PI/2:-Math.PI/2;
   for(const dx of [-1.27,1.27])box(rack,dx,2,0,.22,4,.95,0x795032);
   for(let row=0;row<3;row++){const y=.3+row*1.22;box(rack,0,y,0,2.75,.15,1.3,0x65513c);box(rack,0,y+.48,0,2.3,.82,1.05,wood);box(rack,0,y+.95,0,2.4,.15,1.13,0x9c7954);
    for(const dx of [-1.05,0,1.05])box(rack,dx,y+.52,.54,.09,.88,.05,0x65513c);for(const yy of [y+.11,y+.82])box(rack,0,yy,.57,2.3,.07,.035,0x65513c);
    box(rack,0,y+.72,.615,.2,.31,.11,metal);box(rack,0,y+.71,.679,.055,.075,.018,dark);plaque(rack,`${title} / ${row+1}`,0,y+.36,.594,1.85,.2,'#9c7954','#f2e6c6');
   }box(rack,0,4,0,2.75,.22,1.3,0x795032);
  }
  label('REVIEW & ORGANISE',0,3.8,-6.5,4.7,.48);
 }else if(index===5){
  for(let i=0;i<9;i++){const x=-15+i*3.6,z=-13-(i%3)*2;B(x,.6,z+1.36,.64,1.2,.08,dark);B(x,.6,z+1.42,.025,1.2,.025,cream);B(x,1.6,z+1.7,1.9,.17,1,teal);if(i%3===1)label('HOTEL',x,2.1,z+1.45,1.9,.44)}
  const entrance=group(-.6,0,-12);for(const x of [-.55,.55]){box(entrance,x,.65,.5,.48,1.25,.05,0x89b5ac);box(entrance,x,.68,.54,.018,1.3,.018,metal);box(entrance,x+(x<0?.12:-.12),.63,.58,.035,.23,.04,gold)}box(entrance,0,1.42,.7,1.8,.15,.8,teal);plaque(entrance,'WELCOME',0,1.6,.72,1.55,.24);for(const x of [-1.2,1.2]){cyl(entrance,x,.2,.6,.23,.4,wood);box(entrance,x,.67,.6,.46,.66,.46,0x799465)}
  const calendar=group(-3.5,1.3,-2.2);box(calendar,0,.45,0,1.65,1.35,.08,cream);box(calendar,0,1.07,.055,1.65,.2,.04,teal);plaque(calendar,'EVENT CALENDAR',0,1.07,.09,1.5,.17);for(let row=0;row<4;row++)for(let col=0;col<5;col++)box(calendar,-.58+col*.29,.79-row*.22,.055,.2,.15,.02,(row+col)%4?0xb5c0a0:gold);for(const x of [-.6,.6])torus(calendar,x,1.23,0,.08,metal);box(calendar,0,-.3,-.15,1.7,.08,.7,wood);
  const chart=refs.data;if(chart){box(chart,0,.08,0,3.8,.016,1.9,0xe0d9b9);for(let j=0;j<5;j++)box(chart,0,.09,-.8+j*.35,3.5,.008,.014,0xa8b299);for(let j=0;j<12;j++)box(chart,-1.65+j*.3,.095,.8,.016,.008,.18,0x7c9387)}label('MONTHLY OBSERVATIONS',0,1.11,-1.29,3.6,.29);const scope=group(4,1.5,-3);cyl(scope,0,0,0,.09,2,metal);cyl(scope,0,.8,0,.22,1,teal,Math.PI/2);cyl(scope,0,.8,-.52,.27,.1,metal,Math.PI/2);
 }else if(index===6){
  for(const [n,g] of (refs.screens||[]).entries()){for(let i=0;i<5;i++){const px=-2.7+i*1.3,h=1.3+(i%3)*.4;for(let row=0;row<3;row++)for(let col=0;col<2;col++)box(g,px-.19+col*.38,-.9+row*.3,.31,.11,.13,.012,n===0?0xc7dabb:0x95c7bd)}box(g,0,-1.78,.31,6.6,.025,.012,0xc7dabb);box(g,-2.5,-1.78,.33,.11,.1,.03,cream);plaque(g,n===0?'REAL-WORLD / 129':'VIRTUAL / 129',0,-1.54,.34,4.8,.24);if(n===0){box(g,0,-1.14,.29,6.7,.22,.02,0x80aaa3)}else{for(let i=0;i<6;i++)box(g,-2.4+i*.9,1.25,.3,.12,.12,.05,gold,0,0,.7)}}
  if(refs.film){const g=refs.film;cyl(g,0,0,-.58,.28,.45,dark,Math.PI/2);cyl(g,0,0,-.82,.22,.02,0xc3dac1,Math.PI/2);for(const x of [-.4,.4]){cyl(g,x,.63,0,.35,.14,metal,Math.PI/2);for(let j=0;j<5;j++)cyl(g,x+Math.sin(j*1.256)*.21,.63+Math.cos(j*1.256)*.21,.083,.075,.012,dark,Math.PI/2)}box(g,0,1.13,0,.15,.6,.15,dark)}
  for(const z of [0,3,6])for(const x of [-8.4,8.4]){B(x,.2,z,.22,.1,.65,0xd8c482,0,0,0,true);}label('EXIT',8.2,2.1,6,1,.32,'#486e51');
  for(const z of [0,3,6])for(let x=-7;x<=7;x+=2){for(const dx of [-.7,.7]){B(x+dx,.65,z,.1,.25,.85,dark);B(x+dx,.35,z,.09,.65,.12,dark)}label(String((x+9)/2),x,1.28,z+.61,.3,.22)}label('258 PARTICIPANTS / 2 MATCHED GROUPS',0,.6,-7.8,7,.4);
 }else if(index===7){
  const symbols=['INFO','PLATFORM','MARKETING','REPUTATION','VALUE'];for(const [i,g] of (refs.columns||[]).entries()){g.clear();box(g,0,0,0,1.65,1.65,.14,[teal,0xba995f,0x8c739c,0x7e985e,red][i]);box(g,0,.1,.08,1.4,1.22,.02,cream);plaque(g,symbols[i],0,-.63,.1,1.4,.2);if(i===0){for(let j=0;j<5;j++)box(g,0,.5-j*.19,.11,1.08,.065,.025,0x77988b)}else if(i===1){for(let x=-1;x<=1;x++)for(let y=-1;y<=1;y++)box(g,x*.37,.12+y*.3,.11,.25,.2,.02,[teal,gold,red][(x+y+6)%3])}else if(i===2){box(g,-.08,.17,.12,.6,.35,.04,red);box(g,.32,.17,.12,.25,.6,.04,red);box(g,-.2,-.13,.12,.12,.32,.04,dark);for(let j=0;j<3;j++)box(g,.53+j*.08,.17,.12,.025,.17+j*.13,.025,gold)}else if(i===3){for(let j=0;j<5;j++){box(g,-.48+j*.24,.22,.12,.13,.13,.035,gold,0,0,Math.PI/4)}plaque(g,'DESTINATION',0,-.16,.115,1.25,.22,'#eee2bc','#4b695b')}else{plaque(g,'$',0,.17,.13,.7,.75,'#eee2bc','#517769');box(g,.48,-.25,.12,.25,.05,.025,gold)}}
  const survey=group(0,.3,-1.5);box(survey,0,.45,0,1.8,.12,1.2,wood);for(let i=0;i<3;i++)page(survey,-.5+i*.48,.53,0,.4,.8,'SURVEY');label('276 RESPONSES / 5 DIMENSIONS',0,.45,-.86,2.8,.27);
 }else if(index===8){
  for(const [i,g] of (refs.tools||[]).entries()){g.clear();if(i===0){box(g,0,-.35,0,.92,.08,.65,dark);keyboard(g,0,-.29,.07,.78);box(g,0,.06,-.26,.92,.68,.075,dark,-.12);box(g,0,.06,-.205,.8,.54,.02,0x294a40,-.12);plaque(g,'PYTHON',0,.23,-.15,.71,.15);for(let j=0;j<4;j++)box(g,-.02,.09-j*.08,-.14,.6-j*.06,.017,.015,0xafd3a0)}else if(i===1){const m=monitor(g,0,-.5,0,.9,'EXCEL');m.scale.setScalar(.9);for(let j=0;j<5;j++)box(g,0,.16-j*.09,.075,.69,.008,.009,0x85ad97)}else if(i===2){box(g,0,-.03,0,.82,.74,.09,dark);box(g,0,0,.052,.7,.6,.012,0x9dc2b0);box(g,-.15,.1,.066,.27,.21,.025,0xd0ad68);box(g,.16,-.12,.066,.29,.24,.025,0x6e949c);beam(g,[.42,-.3,.1],[.52,.35,.1],.045,dark)}else if(i===3){const c=cameraModel(g,0,0,0,.72,false);c.rotation.y=Math.PI*.8}else{books(g,-.2,0,0)}}
  const notes=group(2.55,1.13,-2.65);page(notes,0,0,0,.72,.98,'FIELD NOTES');beam(notes,[.3,.03,-.3],[.3,.03,.3],.035,gold);box(notes,-.1,.021,.15,.32,.009,.018,teal);
 }else if(index===9){
  const c=refs.chest,lid=refs.lid;if(c){for(let j=0;j<6;j++)box(c,-1+j*.4,.59,.815,.023,1.08,.015,0x71583b);for(const x of [-.85,.85])for(const y of [.16,.5,.9,1.08])cyl(c,x,y,.863,.037,.025,metal,Math.PI/2);box(c,0,.7,.88,.42,.52,.08,gold);cyl(c,0,.78,.932,.075,.018,dark,Math.PI/2);box(c,0,.68,.945,.048,.12,.012,dark);for(const x of [-1.18,1.18]){box(c,x,.64,0,.05,.25,.55,gold);torus(c,x,.61,0,.19,dark);}}
  if(lid){for(let j=0;j<6;j++)box(lid,-1+j*.4,.412,.8,.024,.012,1.6,0x775e3d);for(const x of [-.85,.85])for(const z of [.15,1.35])cyl(lid,x,.47,z,.04,.025,metal)}bookDetail(refs.book,'LIU ZESHENG / RESUME');
 }
}
