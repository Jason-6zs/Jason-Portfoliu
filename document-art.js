import * as THREE from './vendor/three.module.js';
// Readable graphic identities for the in-world props. Figures are illustrations.
export function documentSurface({parent,kind='report',title='REPORT',x=0,y=0,z=0,w=1,h=1.4,flat=false,enabled=true,resources=[]}){
 if(!enabled)return null;
 const c=document.createElement('canvas');c.width=512;c.height=640;const g=c.getContext('2d');g.fillStyle='#f2e6c6';g.fillRect(0,0,512,640);
 const rect=(x,y,w,h,color)=>{g.fillStyle=color;g.fillRect(x,y,w,h)},txt=(t,x,y,size=28,color='#334b43')=>{g.fillStyle=color;g.font=`bold ${size}px monospace`;g.fillText(t,x,y,450)};
 const lines=(x,y,n=4,width=180)=>{for(let i=0;i<n;i++)rect(x,y+i*22,width-(i%3)*23,6,'#9aa58d')};
 rect(16,16,480,608,'#dfd3b3');rect(21,21,470,598,'#f2e6c6');rect(40,42,432,12,'#476b5d');
 txt(title,40,101,34);rect(40,122,432,3,'#b2ad90');
 if(kind==='cover'){
  rect(0,0,512,640,'#31584d');rect(15,0,18,640,'#24443c');rect(46,38,420,3,'#d5b76c');rect(46,600,420,3,'#d5b76c');txt('LIU ZESHENG',56,100,32,'#eed9a0');title.split(' / ').forEach((t,i)=>txt(t,56,210+i*57,43,'#f3e8c9'));rect(200,365,110,125,'#ddc284');rect(211,376,39,102,'#eee5cd');rect(260,376,39,102,'#eee5cd');rect(252,371,6,114,'#6c795d');txt('A JOURNEY OF LEARNING',55,555,23,'#d8d9b3');
 }else if(kind==='academic-hku'||kind==='academic-must'){
  const pg=kind==='academic-hku';txt(pg?'HKU':'MUST',40,205,70);txt(pg?'POSTGRADUATE':'UNDERGRADUATE',40,253,26);rect(40,285,432,3,'#b2ad90');
  txt(pg?'GLOBAL':'INTERNATIONAL',40,346,33);txt(pg?'MANAGEMENT':'TOURISM MANAGEMENT',40,392,pg?33:25);txt(pg?'MASTER OF SCIENCE':'BACHELOR OF SCIENCE',40,460,23);lines(40,492,2,350);txt(pg?'HONG KONG':'MACAO · GPA 3.75 / 4.0',40,588,23);
 }else if(kind==='academic'){
  txt('HKU',40,182,55);txt('GLOBAL MANAGEMENT',40,222,24);lines(40,254,3,360);rect(40,337,432,3,'#b2ad90');txt('MUST',40,404,51);txt('TOURISM MANAGEMENT',40,445,24);lines(40,476,3,360);txt('LEARNING / RESEARCH',40,582,22);
 }else if(kind==='order'){
  txt('TRAVEL ORDER',40,182,36);rect(40,212,432,74,'#d9ddba');txt('BOOKING / ROUTE',55,258,29);txt('DEPARTURE',40,336,23);lines(240,315,1,210);txt('PASSENGERS',40,383,23);lines(240,362,1,210);txt('ORDER VALUE',40,430,23);lines(240,409,1,210);for(let i=0;i<40;i++)rect(42+i*6,495,i%3===0?4:2,58,'#476b5d');txt('WORKFLOW SAMPLE',40,599,21);
 }else if(kind==='cv'){
  rect(40,154,112,126,'#c2ceb2');rect(77,169,39,43,'#778d76');rect(59,218,77,46,'#778d76');txt('CANDIDATE',176,181,28);lines(176,211,3,270);for(const [name,yy] of [['EDUCATION',330],['EXPERIENCE',440],['SKILLS',550]]){txt(name,40,yy,24);lines(40,yy+18,2,385)}
 }else if(kind==='survey'){
  txt('DESTINATION CHOICE',40,179,27);for(let row=0;row<4;row++){lines(40,216+row*87,1,340);for(let k=0;k<5;k++){rect(50+k*82,240+row*87,27,27,'#879b83');rect(54+k*82,244+row*87,19,19,'#f2e6c6')}}txt('1    2    3    4    5',42,600,25);
 }else{
  txt(kind==='research'?'INDUSTRY RESEARCH':'MONTHLY ANALYSIS',40,174,29);lines(40,207,3,420);
  rect(40,300,432,211,'#e0dec0');rect(64,482,385,3,'#748a73');for(let i=0;i<5;i++){const hh=45+[23,51,37,85,107][i];rect(78+i*72,480-hh,44,hh,i%2?'#c4a15a':'#5a8c79')}
  txt('ILLUSTRATIVE CHART',60,536,21);lines(40,565,2,400);
 }
 const tx=new THREE.CanvasTexture(c);tx.colorSpace=THREE.SRGBColorSpace;tx.magFilter=THREE.LinearFilter;tx.minFilter=THREE.LinearMipmapLinearFilter;
 const mat=new THREE.MeshStandardMaterial({map:tx,roughness:1,side:THREE.DoubleSide});const geo=new THREE.PlaneGeometry(w,h),mesh=new THREE.Mesh(geo,mat);mesh.position.set(x,y,z);if(flat)mesh.rotation.x=-Math.PI/2;parent.add(mesh);resources.push(tx,mat,geo);return mesh;
}
