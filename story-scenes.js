import * as THREE from './vendor/three.module.js';
const lerp=(a,b,t)=>a+(b-a)*t,ease=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)};
// Deliberate viewpoints: the camera visits the objects, rather than panning from far away.
function tour(t,frames){let i=0;while(i<frames.length-2&&t>frames[i+1][0])i++;const a=frames[i],b=frames[i+1],p=ease((t-a[0])/(b[0]-a[0]));return{eye:a[1].map((v,k)=>lerp(v,b[1][k],p)),look:a[2].map((v,k)=>lerp(v,b[2][k],p))};}
function actor({box,group},x,y,z,{farmer=false,shirt=0x8b653b,skin=0xb89577}={}){
 const g=group(x,y,z),legs=[],arms=[];
 box(g,0,1.02,0,.56,.82,.36,shirt);box(g,0,1.69,0,.53,.58,.5,skin);
 for(const dx of [-.13,.13]){box(g,dx,1.73,.259,.10,.065,.018,0xe5e0c5);box(g,dx,1.73,.272,.042,.059,.015,farmer?0x4b733d:0x353b40);}
 if(farmer){box(g,0,1.57,.34,.16,.28,.21,0xac805f);box(g,0,1.83,.26,.43,.055,.024,0x513827);box(g,0,2,0,.86,.09,.78,0xcdb16a);box(g,0,2.12,0,.57,.18,.52,0xb4934b);box(g,0,2.045,.27,.58,.06,.03,0x715336);box(g,0,.68,.195,.57,.18,.04,0x594638);}else{box(g,0,1.97,0,.55,.09,.51,0x48372d);box(g,0,1.88,-.25,.55,.16,.04,0x48372d);}
 for(const side of [-1,1]){const leg=new THREE.Group();g.add(leg);leg.position.set(side*.16,.62,0);box(leg,0,-.24,0,.23,.5,.25,farmer?0x604a32:0xe4ddbd);box(leg,0,-.51,.065,.25,.13,.36,0x343d38);legs.push(leg);const arm=new THREE.Group();g.add(arm);arm.position.set(side*.38,1.33,0);box(arm,0,-.16,0,.19,.37,.24,shirt);box(arm,0,-.42,0,.18,.2,.22,skin);arms.push(arm);}
 g.userData={legs,arms};return g;
}
export function farmScene(api){
 const {B,box,group,label,dynamic}=api,crops=[];
 // Two equally sized, recognisable nine-block farms. A solid village path separates them.
 B(0,.015,1,3,.12,17,0xb8aa87);
 function fence(x,z){B(x,.75,z,.18,1.45,.18,0x795032);}
 function crop(x,z,n){const moving=x===-5&&z>=1,g=moving?group(x,.4,z):null;const put=(dx,y,dz,w,h,d,c,rx=0,ry=0,rz=0)=>moving?box(g,dx,y,dz,w,h,d,c,rx,ry,rz):B(x+dx,.4+y,z+dz,w,h,d,c,rx,ry,rz);for(let k=0;k<4;k++){const dx=(k%2-.5)*.28,dz=(Math.floor(k/2)-.5)*.28;put(dx,.32,dz,.045,.64,.045,0x8e9e45);put(dx,.68,dz,.13,.24,.10,0xd6b84f);put(dx+.06,.39,dz,.055,.31,.04,0xa9ac46,0,0,-.42);put(dx-.06,.3,dz,.04,.26,.045,0x809340,0,0,.48);}if(g)crops.push({g,n});return g;}
 for(const cx of [-6,6]){
  B(cx,.03,-1,8.6,.5,9.6,0x795032);B(cx,.25,-1,8.2,.08,9.2,0x60472f);
  // Irrigation down the centre, tilled furrows and wheat planted on both banks.
  B(cx,.3,-1,.68,.06,8.8,0x408fab);for(let z=-5;z<=3;z+=1){B(cx,.335,z,.45,.025,.12,0x8ac4cb);for(let ix=-3;ix<=3;ix++){if(ix===0)continue;B(cx+ix,.32,z,.9,.10,.87,0x6b4930);for(let k=0;k<3;k++)B(cx+ix+(k-1)*.24,.38,z,.065,.02,.85,0x4b3928);crop(cx+ix,z,crops.length);}}
  for(const x of [cx-4.3,cx+4.3]){for(let z=-5.7;z<=3.6;z+=1.55)fence(x,z);for(const y of [.55,1.05])B(x,y,-1,.12,.12,9.4,0x9c7954);}
  for(let x=cx-4.3;x<=cx+4.3;x+=1.43)fence(x,-5.7);for(const y of [.55,1.05])B(cx,y,-5.7,8.6,.12,.12,0x9c7954);
  // Raised stepping stones leave irrigation visible beneath them.
  B(cx,.5,-3,1.05,.14,.6,0xb4b9a6);
 }
 label('01  MANUAL FARM',-6,3.25,-5.6,6.8,.6);label('02  VILLAGER AUTO FARM',6,3.25,-5.6,7.6,.6);
 label('ONE ORDER AT A TIME',-6,.75,5,5.8,.38);label('HARVEST > SHARE > COLLECT',6,3.95,-5.6,7.6,.38);
 // Left: an actual farmer, hoe, partly harvested row, seed sack, storage and a water bucket.
 const manual=actor(api,-5,.4,2,{farmer:true});manual.rotation.y=-.4;manual.name="manual-farmer";
 const hoe=new THREE.Group();manual.userData.arms[1].add(hoe);box(hoe,0,-.68,.12,.07,1.05,.07,0x9c7954, .35);box(hoe,.18,-1.14,.28,.42,.10,.17,0x8e9a95);
 const harvested=crops.filter(({g})=>g.position.x===-5&&g.position.z>=1);harvested.forEach(({g})=>g.scale.y=.13);
 // The manual harvest goes home: open doorway, oak frame, stepped gable and a visible interior.
 const hx=-12.4,hz=0;B(hx,.12,hz,4.6,.35,4.4,0xb4b9a6);B(hx,.34,hz,4.1,.12,3.8,0x9c7954);
 B(hx,1.8,-2,4.3,2.9,.24,0xb4b9a6);for(const x of [hx-2.1,hx+2.1]){B(x,1.65,0,.22,2.6,4,0x9c7954);B(x,3,0,.24,.22,4.2,0x795032);}
 for(const x of [hx-2.1,hx+2.1])for(const z of [-2,2])B(x,1.8,z,.3,3,.3,0x795032);
 // Front wall deliberately leaves a real 1.3-block-wide door opening.
 for(const x of [hx-1.43,hx+1.43])B(x,1.55,2,1.4,2.4,.22,0x9c7954);B(hx,2.85,2,4.15,.55,.22,0x9c7954);
 for(const x of [hx-1.42,hx+1.42]){B(x,1.9,2.13,.93,1,.06,0x6396a2);for(const dx of [-.48,0,.48])B(x+dx,1.9,2.19,.065,1.08,.05,0xe4ddbd);for(const y of [1.39,1.9,2.41])B(x,y,2.19,1,.065,.06,0xe4ddbd);B(x,1.3,2.22,1.2,.14,.38,0x795032);}
 for(let r=0;r<6;r++){const offset=2.45-r*.43;for(const side of [-1,1])B(hx+side*offset,3.12+r*.31,0,.55,.35,4.9,0x795032);}B(hx,4.92,0,.45,.28,5,0x9c7954);
 for(let r=0;r<5;r++)B(hx,3.25+r*.3,2,4.05-r*.79,.31,.18,0x9c7954);
 B(hx-1.25,4.6,-1,.65,2,.65,0x979275);B(hx-1.25,5.64,-1,.85,.16,.85,0xb4b9a6);
 const door=group(hx-.65,.4,2.17);door.name="cottage-door";box(door,.65,1.1,0,1.3,2.2,.13,0x9c7954);for(const y of [.55,1.55])box(door,.65,y,.075,1.1,.07,.025,0x65513c);box(door,1.1,1.1,.1,.11,.13,.1,0xd7ad62);
 B(hx,.25,2.55,1.6,.2,.8,0xb4b9a6);B(hx,.13,3.05,1.9,.18,.5,0xb4b9a6);
 // Bed, work table and tied wheat sheaves replace the outdoor box entirely.
 B(hx-1.1,.62,-.9,1.2,.4,1.9,0x795032);B(hx-1.1,.87,-.65,1.17,.12,1.35,0xb9574c);B(hx-1.1,.89,-1.45,1.17,.15,.4,0xe4ddbd);
 B(hx+1.05,.9,-1.2,1.15,.12,.8,0x9c7954);for(const x of [hx+.6,hx+1.5])B(x,.65,-1.2,.12,.5,.65,0x795032);
 const storedWheat=group(hx+.95,.45,.7);for(let i=0;i<6;i++){box(storedWheat,(i%3-.9)*.24,.26+Math.floor(i/3)*.16,0,.18,.53,.6,0xd6b84f);box(storedWheat,(i%3-.9)*.24,.28+Math.floor(i/3)*.16,0,.19,.08,.61,0x9c7954);}
 const bundle=new THREE.Group();bundle.name="harvest-bundle";manual.add(bundle);bundle.position.set(0,1,.48);for(let i=0;i<5;i++){box(bundle,(i-2)*.1,0,0,.065,.65,.065,0xd6b84f,0,0,(i-2)*.07);box(bundle,(i-2)*.11,.37,0,.12,.2,.1,0xe3c76e);}box(bundle,0,-.02,0,.57,.09,.14,0x9c7954);
 for(let x=hx;x<=-5;x+=.6)B(x,.04,4.4,.62,.1,1.05,0xb8aa87);for(let z=2.8;z<=4.4;z+=.55)B(hx,.055,z,1.05,.1,.58,0xb8aa87);
 label('HARVEST > CARRY HOME',hx,2.85,2.25,3.7,.28);
 function manualCycle(t){const k=t%11;let x=-5,z=2,heading=-.4,walking=false;
  if(k<1.5){manual.userData.arms[1].rotation.x=-.3-Math.max(0,Math.sin(t*4))*.55;}
  else if(k<2.4){z=lerp(2,4.4,ease((k-1.5)/.9));heading=0;walking=true;}
  else if(k<5.4){x=lerp(-5,hx,(k-2.4)/3);z=4.4;heading=-Math.PI/2;walking=true;}
  else if(k<6.4){x=hx;z=lerp(4.4,.75,(k-5.4));heading=Math.PI;walking=true;}
  else if(k<7.1){x=hx;z=.75;heading=Math.PI;}
  else if(k<8.1){x=hx;z=lerp(.75,4.4,k-7.1);heading=0;walking=true;}
  else if(k<10.1){x=lerp(hx,-5,(k-8.1)/2);z=4.4;heading=Math.PI/2;walking=true;}
  else{x=-5;z=lerp(4.4,2,(k-10.1)/.9);heading=Math.PI;walking=true;}
  manual.position.set(x,.4,z);manual.rotation.set(0,heading,0);bundle.visible=k>=1.5&&k<6.4;hoe.visible=k<1.5||k>=10.1;
  manual.userData.legs.forEach((leg,i)=>leg.rotation.x=walking?Math.sin(t*9+i*Math.PI)*.4:0);
  if(k>=1.5)manual.userData.arms.forEach((arm,i)=>arm.rotation.x=bundle.visible?-1.1:walking?Math.sin(t*9+i*Math.PI)*.22:0);else manual.userData.arms[0].rotation.x=-.15;
  door.rotation.y=-1.6*ease((k-4.8)/.5)*(1-ease((k-8)/.5));storedWheat.scale.y=k>=6.4?1:.72;
  harvested.forEach(({g},i)=>g.scale.y=k<1.5?lerp(1,.15,ease((k-i*.25)/.45)):k>10?lerp(.15,1,ease((k-10)/.9)):.15);
 }
 // Right: farmer throws surplus food through a narrow opening to a trapped receiver.
 const worker=actor(api,6.9,.4,1.8,{farmer:true}),receiver=actor(api,6,.4,5.05,{shirt:0x906f51});receiver.rotation.y=Math.PI;
 const glass=new THREE.MeshStandardMaterial({color:0xbce8e9,transparent:true,opacity:.12,roughness:.1,depthWrite:false});const pane=new THREE.BoxGeometry(1,1,1);dynamic.push(glass,pane);
 for(const [x,z,w,d] of [[1.8,-1,.04,9],[10.2,-1,.04,9],[6,-5.5,8.4,.04],[5.2,5,.04,1.4],[6.8,5,.04,1.4],[6,5.75,1.6,.04]]){const m=new THREE.Mesh(pane,glass);m.position.set(x,1.5,z);m.scale.set(w,2.4,d);group().add(m);B(x,2.7,z,w===.04?.06:w,.045,d===.04?.06:d,0xb4d4cf);}
 // Trapdoors keep the receiver in place; hopper minecart sits below the sharing gap.
 for(const x of [5.2,6.8]){B(x,1.25,4.15,.13,1.8,.15,0x795032);B(x,2.17,4.15,.5,.12,.65,0x9c7954);}B(6,1.9,4.15,1.4,.1,.12,0x9c7954);
 for(const x of [5.5,6,6.5])B(x,.8,3.8,.09,.06,.85,0x9c7954);for(const z of [3.5,4.05])B(6,.84,z,1.4,.045,.055,0xabb9af);
 const cart=group(6,.95,3.8);box(cart,0,.08,0,1.02,.18,.72,0x344943);for(const x of [-.48,.48])box(cart,x,.28,0,.07,.38,.75,0x889994);for(const z of [-.34,.34])box(cart,0,.28,z,.97,.38,.07,0x889994);box(cart,0,.26,0,.76,.12,.53,0x273d38);for(const x of [-.35,.35])for(const z of [-.36,.36])box(cart,x,-.09,z,.2,.2,.07,0x344943);
 // An exposed side outlet and three hoppers form one continuous route to a double chest.
 for(const [x,z] of [[6,3.8],[7,3.8],[8,3.8],[9,3.8]]){B(x,.63,z,.93,.12,.87,0x596a68);for(const dx of [-.41,.41])B(x+dx,.76,z,.07,.16,.87,0x889994);for(const dz of [-.4,.4])B(x,.76,z+dz,.82,.16,.07,0x889994);B(x,.43,z,.64,.3,.59,0x445551);B(x+.32,.3,z,.7,.15,.2,0x344943);}
 const chest=group(10.15,.1,3.8);box(chest,0,.52,0,1.65,.95,1.1,0x9c7954);box(chest,0,1.03,0,1.75,.17,1.2,0xb38c59);for(const x of [-.75,0,.75])box(chest,x,.55,.565,.07,1.05,.05,0x544234);for(const y of [.12,.95])box(chest,0,y,.58,1.65,.07,.04,0x544234);box(chest,0,.71,.63,.16,.25,.08,0xd3b45f);
 label('HOPPER MINECART',6,.2,4.25,2.4,.24);label('AUTO STORAGE',10,1.65,4.25,2.8,.3);
 // Composter workstation (open top, planked sides), hay bales and lanterns.
 const comp=group(3,.36,-3.8);box(comp,0,.05,0,.8,.12,.8,0x795032);for(const x of [-.37,.37])box(comp,x,.43,0,.09,.8,.8,0x9c7954);for(const z of [-.37,.37])box(comp,0,.43,z,.8,.8,.09,0x9c7954);box(comp,0,.33,0,.64,.08,.64,0x5d5130);
 for(const [x,z] of [[-10,-6.7],[-9,-6.7],[10,-6.7]]){B(x,.5,z,.9,1,.9,0xc7aa58);for(const y of [.22,.72])B(x,y,z,.93,.09,.93,0x987548);}
 const food=group();box(food,0,0,0,.17,.15,.34,0xd7b85a);const cargo=group();box(cargo,0,0,0,.22,.17,.34,0xd7b85a);
 label('MANUAL WORK  /  AUTOMATED WORKFLOW',0,5,-7.3,11,.5);
 return{update(t){const cycle=t%7,p=cycle/7;manualCycle(t);worker.position.set(6.7+Math.sin(t*.45)*.3,.4,1.8+Math.cos(t*.45)*.35);worker.rotation.y=Math.atan2(6-worker.position.x,5-worker.position.z);worker.userData.arms.forEach(a=>a.rotation.x=cycle<2?-.8:-.25);food.visible=cycle<2;food.position.set(lerp(worker.position.x,6,cycle/2),1.6+Math.sin(cycle/2*Math.PI)*.7,lerp(worker.position.z,3.8,cycle/2));food.rotation.y=t;cargo.visible=cycle>=2&&cycle<5;cargo.position.set(lerp(6.2,10,Math.max(0,(cycle-2)/3)),.92,3.8);return tour(t,[[0,[-8.6,6.7,17],[-8.6,1.2,0]],[3,[-8.6,6.7,17],[-8.6,1.2,0]],[5.3,[-11,4.3,11.5],[-11,1.4,1]],[7.8,[-11,4.3,11.5],[-11,1.4,1]],[11.5,[6,5.5,11],[6,1,0]],[16,[8,3.5,10.8],[8,1.05,3.3]],[21,[0,7,19],[0,1,0]],[35,[0,7,19],[0,1,0]]]);}};
}
export function eventScene(api){
 const {B,box,group,label,dynamic}=api,players=[],rooms=[],guests=[];
 B(0,.03,0,29,.2,25,0xb9b49b);
 // Seven hotel floors with five independently illuminated guest rooms per floor.
 const hx=-7,front=1;B(hx,5.9,-2,8.3,11.6,6,0xb4b9a6);B(hx,1.15,front+.1,8.5,2.2,.3,0x9c7954);
 for(const x of [hx-4.2,hx+4.2])B(x,5.9,front+.17,.5,11.8,.55,0x795032);
 for(let row=0;row<7;row++){const y=10.5-row*1.25;B(hx,y-.6,front+.2,8.5,.25,.42,0x9c7954);for(let col=0;col<5;col++){const x=hx-3+col*1.5;B(x,y,front+.19,1.1,.88,.12,0x28404b);const g=group(x,y,front+.265);g.name=`hotel-room-${row*5+col}`;const light=box(g,0,0,0,.95,.73,.025,0xf3cf7d,0,0,0,true);const mat=light.material.clone();light.material=mat;dynamic.push(mat);rooms.push({g,light,mat,row,col});for(const dx of [-.51,0,.51])B(x+dx,y,front+.29,.08,.83,.08,0x9c7954);B(x,y-.44,front+.36,1.2,.18,.35,0x9c7954);}}
 // Oak doors, chunky log supports, lanterns and a stair-block roof instead of a modern lobby.
 for(const x of [hx-.52,hx+.52]){B(x,1.15,front+.35,.95,2,.15,0x9c7954);B(x,1.6,front+.44,.38,.45,.035,0x709fa1);B(x,.95,front+.47,.1,.14,.09,0xd7ad62);}
 for(const x of [hx-2.5,hx+2.5]){B(x,1.45,front+.25,1.25,1.1,.12,0x709fa1);for(const dx of [-.62,0,.62])B(x+dx,1.45,front+.34,.09,1.2,.08,0x795032);B(x,1.45,front+.35,1.25,.08,.09,0x9c7954);}
 for(const x of [hx-1.6,hx+1.6]){B(x,1.15,front+1.6,.32,2.3,.32,0x795032);B(x,1.92,front+1.7,.34,.4,.34,0xe7c47b,0,0,0,true);B(x,2.17,front+1.7,.45,.1,.45,0x65513c);}
 B(hx,2.48,front+.8,4,.35,2.3,0x9c7954);B(hx,.15,front+1.1,4.5,.28,2.1,0xb4b9a6);
 for(let r=0;r<5;r++)for(const side of [-1,1])B(hx+side*(4.3-r*.88),11.9+r*.45,-2,1,.5,6.7,0x795032);B(hx,14.15,-2,.8,.4,6.8,0x9c7954);
 for(let r=0;r<4;r++)B(hx,12.05+r*.43,front,7.5-r*1.76,.44,.25,0x9c7954);
 label('VILLAGER INN',hx,12.5,front+.25,5.8,.55);const occupancy=label('OCCUPANCY / ILLUSTRATION',hx,11.4,front+.4,7.6,.48);let previousCount=-1;
 // A continuous curved rail link ends at the inn's front platform.
 const railPath=new THREE.CatmullRomCurve3([new THREE.Vector3(2,.28,4.6),new THREE.Vector3(-3.5,.28,4.6),new THREE.Vector3(-6.3,.28,4.3),new THREE.Vector3(-7,.28,3.3),new THREE.Vector3(-7,.28,2.3)]);
 for(let i=0;i<100;i++){const p=railPath.getPoint(i/100),q=railPath.getPoint((i+1)/100),v=q.clone().sub(p),mid=p.clone().add(q).multiplyScalar(.5),a=Math.atan2(v.x,v.z),n=new THREE.Vector3(v.z,0,-v.x).normalize();for(const side of [-1,1]){const at=mid.clone().addScaledVector(n,side*.36);B(at.x,at.y,at.z,.065,.065,v.length()+.025,0xabb9af,0,a);}if(i%4===0)B(p.x,.23,p.z,1.05,.1,.15,0x9c7954,0,a);if(i%16===0)B(p.x,.29,p.z,.3,.035,.2,0xd7ad62,0,a);}
 label('STADIUM > VILLAGER INN',-2,1.1,5.5,6.3,.36);
 const cart=group();cart.name='hotel-minecart';box(cart,0,.3,0,1.1,.18,1.5,0x596a68);for(const x of [-.52,.52])box(cart,x,.59,0,.1,.5,1.5,0x889994);for(const z of [-.7,.7])box(cart,0,.59,z,1.1,.5,.1,0x889994);box(cart,0,.42,0,.9,.08,1.25,0x344943);for(const x of [-.47,.47])for(const z of [-.46,.46])box(cart,x,.14,z,.18,.22,.3,0x344943);
 const rider=actor(api,0,0,0,{farmer:true});cart.add(rider);rider.position.set(0,.28,0);rider.scale.setScalar(.67);rider.userData.legs.forEach(l=>l.rotation.x=-Math.PI/2);rider.userData.arms.forEach(a=>a.rotation.x=-.9);guests.push(cart);
 function hotelCycle(t){const k=Math.max(0,t-6)%26,amount=k<10?lerp(7,30,ease(k/10)):k<13?30:k<21?lerp(30,14,ease((k-13)/8)):lerp(14,7,ease((k-21)/5));const count=Math.round(amount);
  rooms.forEach(({light,mat},i)=>{light.visible=i<count;mat.emissiveIntensity=.65+.08*Math.sin(t*.9+Math.floor(i/5)*.7);});
  if(occupancy&&count!==previousCount){previousCount=count;const tx=occupancy.material.map,c=tx.image,ctx=c.getContext('2d');ctx.fillStyle='#243f3b';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='#ecebd0';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`bold ${Math.floor(c.height*.5)}px monospace`;ctx.fillText(`OCCUPANCY ${Math.round(count/35*100)}% · DEMO`,c.width/2,c.height/2,c.width-18);tx.needsUpdate=true;}
  const phase=t*.32,p=.5-.5*Math.cos(phase),tangent=railPath.getTangent(p);cart.position.copy(railPath.getPoint(p));cart.rotation.y=Math.atan2(tangent.x,tangent.z)+(Math.sin(phase)<0?Math.PI:0);

 }
 // Football: an actual miniature stadium with touchlines, grass stripes and recessed nets.
 const cx=7;B(cx,.19,-.5,10,.2,15,0x4e813e);for(let i=0;i<7;i++)B(cx,.3,-6.6+i*2.05,9.8,.025,1.02,0x608f48);
 for(const x of [2.4,11.6])B(x,.33,-.5,.065,.025,13.6,0xf0ead3);for(const z of [-7.3,6.3,-.5])B(cx,.33,z,9.2,.025,.065,0xf0ead3);
 for(let i=0;i<40;i++){const a=i/40*Math.PI*2;B(cx+Math.cos(a)*1.35,.345,-.5+Math.sin(a)*1.35,.13,.025,.07,0xf0ead3,0,-a);}B(7,.35,-.5,.14,.03,.14,0xf0ead3);
 for(const [z,sgn] of [[-7.3,-1],[6.3,1]]){
  for(const x of [5.4,8.6]){B(x,1.23,z,.09,1.8,.09,0xf0ead3);B(x,.45,z+sgn*.85,.07,.15,1.7,0xf0ead3);}B(7,2.12,z,3.3,.09,.09,0xf0ead3);B(7,2.12,z+sgn*.85,3.3,.055,.055,0xd3d8c5);
  for(let i=0;i<=12;i++){const x=5.4+i*3.2/12;B(x,1.22,z+sgn*.85,.014,1.8,.014,0xc3d1be);B(x,2.1,z+sgn*.425,.014,.014,.85,0xc3d1be);}for(let j=0;j<=7;j++){const y=.34+j*1.78/7;B(7,y,z+sgn*.85,3.2,.014,.014,0xc3d1be);for(const x of [5.4,8.6])B(x,y,z+sgn*.425,.014,.014,.85,0xc3d1be);}
  for(const dep of [1.1,2.4]){const w=dep===1.1?4.2:6;B(7,.345,z-sgn*dep,w,.02,.06,0xf0ead3);for(const x of [7-w/2,7+w/2])B(x,.345,z-sgn*dep/2,.06,.02,dep,0xf0ead3);}B(7,.35,z-sgn*1.8,.13,.02,.13,0xf0ead3);
 }
 for(const x of [2.4,11.6])for(const z of [-7.3,6.3]){B(x,.85,z,.035,1.05,.035,0xf0ead3);B(x+.14,1.25,z,.28,.23,.025,0xd7ad62);}
 for(let i=0;i<12;i++){const side=i<6,base=[4+(i%3)*2.6,-4.8+Math.floor(i/3)*2.9];const g=actor(api,base[0],.35,base[1],{shirt:side?0x83c6e8:0xb8433c});g.scale.setScalar(.52);g.rotation.y=side?0:Math.PI;label(String(7+i),0,1.1,-.194,.3,.24,side?'#83c6e8':'#b8433c','#fff',g);players.push({g,base,i});}
 const ball=group(7,.51,0);box(ball,0,0,0,.24,.24,.24,0xf0ead3);for(const x of [-.122,.122])box(ball,x,0,0,.006,.09,.09,0x344943);box(ball,0,.123,0,.1,.005,.1,0x344943);
 // Stands carry individual seats and spectators, with no front wall blocking the pitch.
 for(let r=0;r<4;r++){B(12.25+r*.65,.38+r*.43,-.5,.7,.7+r*.85,16,0xb4b9a6);for(let j=0;j<15;j++){B(12.2+r*.65,.8+r*.85,-7.5+j,.48,.12,.7,0x759cb3);B(12.45+r*.65,1.03+r*.85,-7.5+j,.09,.5,.7,0x759cb3);if((j+r)%3!==0){B(12.18+r*.65,1.15+r*.85,-7.5+j,.34,.62,.32,[0x83c6e8,0xe4ddbd,0x637d75][j%3]);B(12.18+r*.65,1.63+r*.85,-7.5+j,.29,.29,.29,0xb89577);}}}
 for(const x of [2,12]){B(x,4.5,-9,.2,9,.2,0x82978e);B(x,8.8,-9,2,.65,.3,0xe4ddbd);for(let j=0;j<4;j++)B(x-.7+j*.46,8.8,-8.83,.3,.37,.04,0xffe3a5,0,0,0,true);}
 label('MAN CITY / HONG KONG',7,4.3,-8.8,8,.6);label('FRIENDLY MATCH / EVENT CONCEPT',7,3.65,-8.8,8,.35);
 label('EVENTS / HOTEL PERFORMANCE',0,13.5,-12,12,.6);
 return{update(t){hotelCycle(t);players.forEach(({g,base,i})=>{g.position.x=base[0]+Math.sin(t*.5+i)*.35;g.position.z=base[1]+Math.sin(t*.4+i)*.55;g.userData.legs.forEach((l,k)=>l.rotation.x=Math.sin(t*3+i+k*Math.PI)*.35);g.userData.arms.forEach((a,k)=>a.rotation.x=Math.sin(t*3+i+k*Math.PI)*.25);});ball.position.set(7+Math.sin(t*.5)*2,.49+Math.abs(Math.sin(t*2))*.06,-.5+Math.sin(t*.3)*3);ball.rotation.x=t;return tour(t,[[0,[7,8,15],[7,.8,-1]],[4,[7,8,15],[7,.8,-1]],[8,[-7,7,16],[-7,5.8,0]],[13,[-7,7,16],[-7,5.8,0]],[18,[0,9,23],[0,4,0]],[35,[0,9,23],[0,4,0]]]);}};
}
// A displays a local licensed photograph; B rebuilds the landmarks as stepped voxels.
// A labelled painted fallback appears if the photo cannot load.
// Neither is represented as original research footage.
export function harbourScreens({screens,box,label,animations,dynamic,textures}){
 screens.forEach((s,side)=>{
  s.clear();box(s,0,0,0,7.5,4.4,.25,0x273d38);
  if(!side&&textures){const c=paintHarbour();const tx=new THREE.CanvasTexture(c);tx.colorSpace=THREE.SRGBColorSpace;const mat=new THREE.MeshBasicMaterial({map:tx});const geo=new THREE.PlaneGeometry(7.1,4);const m=new THREE.Mesh(geo,mat);m.position.z=.16;s.add(m);dynamic.push(tx,mat,geo);let caption=label('A / REAL-WORLD STYLE · ILLUSTRATION',0,-1.87,.2,6.8,.22,'#142a42','#ecebd0',s);
   if(typeof Image!=='undefined'){const photo=new Image();let active=true;dynamic.push({dispose(){active=false;photo.onload=null;photo.onerror=null;}});photo.onload=()=>{if(!active)return;const real=new THREE.Texture(photo);real.colorSpace=THREE.SRGBColorSpace;real.needsUpdate=true;mat.map=real;mat.needsUpdate=true;real.repeat.y=(photo.width/photo.height)/(7.1/4);real.offset.y=.30;m.scale.set(1,1,1);dynamic.push(real);if(caption)s.remove(caption);caption=label('A / YOUR HARBOUR PHOTOGRAPH',0,-1.87,.2,6.8,.22,'#142a42','#ecebd0',s);};photo.src=new URL('./assets/harbour-user-photo.jpeg',import.meta.url).href;}return;}
  box(s,0,0,.15,7.1,4,.06,0x142341);box(s,0,-1.4,.21,7.0,.85,.05,0x234565);
  const windows=[];for(let i=0;i<18;i++){const x=-3.25+i*.38,h=.45+(Math.sin(i*5.3)+1)*.42;box(s,x,-.8+h/2,.25,.32,h,.08,0x426580);for(let r=0;r<Math.floor(h/.16);r++)for(let col=0;col<2;col++){const w=box(s,x-.08+col*.14,-.7+r*.16,.31,.043,.066,.012,[0xf5d798,0x8ad4dc,0xb5bfd5][i%3],0,0,0,true);windows.push(w);}}
  box(s,2.7,.1,.33,.52,1.9,.12,0x718c9e);for(let r=0;r<10;r++)for(let col=0;col<3;col++)box(s,2.54+col*.16,-.73+r*.18,.402,.045,.09,.012,0xc8dedd,0,0,0,true);box(s,2.7,1.12,.33,.36,.19,.12,0xa6b1bb);for(const x of [2.54,2.86])box(s,x,1.28,.33,.04,.25,.06,0xd9e9e2);
  box(s,-1.35,.03,.32,.53,1.65,.12,0x547b9d);box(s,-1.25,1,.32,.32,.4,.12,0x547b9d);box(s,-1.17,1.34,.32,.025,.44,.025,0xdbeced);for(let k=0;k<3;k++)box(s,-1.35,-.49+k*.49,.392,.025,.69,.016,0xd4eeee,0,0,k%2?.72:-.72);
  // The Central Observation Wheel: stepped rim, 12 cabins, spokes and A-frame support.
  const wheel=new THREE.Group();wheel.position.set(1.9,-.39,.48);s.add(wheel);
  for(let i=0;i<32;i++){const a=i/32*Math.PI*2,x=Math.round(Math.cos(a)*.55/.055)*.055,y=Math.round(Math.sin(a)*.55/.055)*.055;box(wheel,x,y,0,.085,.085,.035,0xf1ddc7,0,0,0,true);}
  for(let i=0;i<12;i++){const a=i/12*Math.PI*2;for(let j=1;j<7;j++)box(wheel,Math.cos(a)*j*.077,Math.sin(a)*j*.077,-.01,.032,.032,.025,0xc9d9df);box(wheel,Math.cos(a)*.57,Math.sin(a)*.57-.055,.03,.12,.14,.08,i%2?0xb9574c:0xe4ddbd);box(wheel,Math.cos(a)*.57,Math.sin(a)*.57-.045,.076,.08,.055,.012,0x698caa);}
  for(const dx of [-.19,.19])box(s,1.9+dx,-.83,.47,.055,.92,.055,0xe4ddbd,0,0,dx>0?.42:-.42);box(s,1.9,-1.25,.44,1.25,.11,.1,0xaeb9b0);
  for(let r=0;r<22;r++)box(s,-3+(r*1.37%6),-1.15-(r%5)*.12,.29,.15+(r%3)*.11,.028,.01,[0xe8c784,0x6b96d2,0x9e7eb7][r%3],0,0,0,true);
  const ferry=new THREE.Group();s.add(ferry);box(ferry,0,0,0,.55,.09,.035,0xe4ddbd);box(ferry,0,.08,0,.34,.1,.035,0x609c7a);ferry.position.set(-2,-1.4,.33);
  label(side?'B / VOXEL VIRTUAL ENVIRONMENT':'A / REAL-WORLD STYLE · ILLUSTRATION',0,-1.87,.54,6.8,.22,'#142341','#ecebd0',s);
  const glowMaterials=new Map();windows.forEach(w=>{const original=w.material;if(!glowMaterials.has(original)){const m=original.clone();glowMaterials.set(original,m);dynamic.push(m);}w.material=glowMaterials.get(original);});animations.push(t=>{[...glowMaterials.values()].forEach((m,i)=>m.emissiveIntensity=.58+.12*Math.sin(t*.65+i*2.1));ferry.position.x=Math.sin(t*.065)*2.6;});
 });
}
export function paintHarbour(){
 const c=document.createElement('canvas');c.width=1400;c.height=790;const x=c.getContext('2d');
 let grad=x.createLinearGradient(0,0,0,600);grad.addColorStop(0,'#17283f');grad.addColorStop(.7,'#375c78');grad.addColorStop(1,'#827789');x.fillStyle=grad;x.fillRect(0,0,1400,790);
 // Atmospheric mountains and dense Central skyline, with continuous edges and reflections.
 x.fillStyle='#324d64';x.beginPath();x.moveTo(0,440);for(let i=0;i<=1400;i+=25)x.lineTo(i,310+Math.sin(i*.007)*32+Math.cos(i*.017)*15);x.lineTo(1400,600);x.lineTo(0,600);x.fill();
 for(let i=0;i<57;i++){const px=i*26-8,h=45+(Math.sin(i*7.3)+1)*57,w=19+(i%4)*3;grad=x.createLinearGradient(px,0,px+w,0);grad.addColorStop(0,'#273c52');grad.addColorStop(1,'#52637b');x.fillStyle=grad;x.fillRect(px,540-h,w,h);for(let r=0;r<h/9-1;r++)for(let col=0;col<3;col++){x.fillStyle=(i+r+col)%4?'#c5ba93':'#7096b7';x.globalAlpha=.5+((i+r)%4)*.12;x.fillRect(px+3+col*6,540-h+6+r*9,2,4);}x.globalAlpha=1;}
 function tower(px,y,w,h){grad=x.createLinearGradient(px,0,px+w,0);grad.addColorStop(0,'#36465a');grad.addColorStop(.48,'#8da2b0');grad.addColorStop(.52,'#587488');grad.addColorStop(1,'#263f56');x.fillStyle=grad;x.fillRect(px,y,w,h);x.strokeStyle='#c7d6d7';x.lineWidth=1;for(let i=3;i<w;i+=6){x.beginPath();x.moveTo(px+i,y);x.lineTo(px+i,540);x.stroke();}for(let r=y+5;r<540;r+=9){x.strokeStyle=r%3?'#8db2c7':'#efd7ab';x.beginPath();x.moveTo(px+2,r);x.lineTo(px+w-2,r);x.stroke();}}
 tower(363,169,88,371);x.fillStyle='#9bb1bc';x.beginPath();x.moveTo(363,169);x.lineTo(376,139);x.lineTo(385,125);x.lineTo(430,125);x.lineTo(440,141);x.lineTo(451,169);x.fill();for(const px of [374,439]){x.fillStyle='#e3e9db';x.fillRect(px,112,3,39);}
 tower(762,247,77,293);x.fillStyle='#6e8ba5';x.beginPath();x.moveTo(762,247);x.lineTo(793,203);x.lineTo(839,231);x.lineTo(839,247);x.fill();x.strokeStyle='#e4ece8';x.lineWidth=3;for(let r=0;r<3;r++){x.beginPath();x.moveTo(765,252+r*94);x.lineTo(836,346+r*94);x.moveTo(836,252+r*94);x.lineTo(765,346+r*94);x.stroke();}x.fillRect(793,170,2,42);
 // Continuous promenade, wheel supports, circular spokes and separately hanging cabins.
 x.fillStyle='#bbc0b5';x.fillRect(0,540,1400,7);x.fillStyle='#eed2a1';x.fillRect(0,548,1400,3);
 const wx=1070,wy=465,rr=77;x.strokeStyle='#d8e3e5';x.lineWidth=5;x.beginPath();x.arc(wx,wy,rr,0,Math.PI*2);x.stroke();x.lineWidth=1;for(let i=0;i<36;i++){let a=i/36*Math.PI*2;x.beginPath();x.moveTo(wx,wy);x.lineTo(wx+Math.cos(a)*rr,wy+Math.sin(a)*rr);x.stroke();}for(let i=0;i<12;i++){let a=i/12*Math.PI*2;const px=wx+Math.cos(a)*rr,py=wy+Math.sin(a)*rr;x.fillStyle='#ad4f46';x.fillRect(px-7,py-1,14,14);x.fillStyle='#c7d8da';x.fillRect(px-5,py+1,10,7);}x.lineWidth=6;x.beginPath();x.moveTo(wx-32,547);x.lineTo(wx,wy);x.lineTo(wx+32,547);x.stroke();
 grad=x.createLinearGradient(0,552,0,790);grad.addColorStop(0,'#305470');grad.addColorStop(1,'#142c48');x.fillStyle=grad;x.fillRect(0,552,1400,238);
 for(let i=0;i<850;i++){const px=(i*73.73)%1400,py=557+(i*31.29)%224;const near=Math.abs(px-405)<70||Math.abs(px-805)<55||Math.abs(px-1070)<85;x.fillStyle=near?['#d9b587','#91b5c9','#d7cccc'][i%3]:['#62849e','#455f7f','#6e7f91'][i%3];x.globalAlpha=.12+(i%5)*.06;x.fillRect(px,py,4+(i%9)*4,1+(i%2));}x.globalAlpha=1;
 x.fillStyle='#d5d6bf';x.beginPath();x.moveTo(145,628);x.lineTo(287,628);x.lineTo(270,642);x.lineTo(160,642);x.fill();x.fillStyle='#618a72';x.fillRect(170,610,98,18);x.fillStyle='#dedbc6';x.fillRect(181,601,67,10);for(let i=0;i<9;i++){x.fillStyle='#f1d5a1';x.fillRect(175+i*10,614,6,7);}return c;
}
