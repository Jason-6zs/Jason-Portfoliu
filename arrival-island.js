// A seeded block landscape: consistent between visits, irregular rather than ring-planted.
export function arrivalIsland({B,box,group,animations}){
 let seed=731;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const shore=(x,z)=>Math.hypot(x,z)<26+2*Math.sin(Math.atan2(z,x)*3)+1.3*Math.cos(Math.atan2(z,x)*5);
 const river=(x,z)=>Math.abs(x+12)<1.7&&z>=-8&&z<=9;
 const height=(x,z)=>x<=-8&&x>=-18&&z<=-8&&z>=-18?8:x<-6&&z<-6&&Math.hypot(x+13,z+13)<10?4:z<-12?Math.max(0,Math.floor((7-Math.hypot(x-8,z+18))*.6))*2:0;
 for(let x=-28;x<=28;x+=2)for(let z=-28;z<=28;z+=2){if(!shore(x,z))continue;const h=height(x,z),sand=!shore(x*1.09,z*1.09),wet=river(x,z)||Math.hypot(x+12,(z-10)*1.2)<3.8;const top=wet?-.4:h;B(x,top-1,z,2,2,2,sand?0xd0c59a:0x8fa978);if(h>0)B(x,h/2-2.5,z,2,h+1,2,0x979275);if(sand)B(x,-2.5,z,2,1.3,2,0x979275);}
 function house(x,z,w=4,d=4){const y=height(x,z);B(x,y+.22,z,w+.5,.45,d+.5,0xb4b9a6);B(x,y+1.8,z,w,3,d,0x9c7954);for(const dx of [-w/2,w/2])for(const dz of [-d/2,d/2])B(x+dx,y+1.9,z+dz,.45,3.5,.45,0x795032);B(x,y+1.35,z+d/2+.05,.9,2.2,.12,0x65513c);B(x+.26,y+1.2,z+d/2+.15,.1,.12,.1,0xd7ad62);for(const dx of [-1.3,1.3]){B(x+dx,y+2.1,z+d/2+.07,.7,.85,.07,0x80b1b7);B(x+dx,y+2.1,z+d/2+.13,.06,.9,.025,0xe4ddbd);B(x+dx,y+2.1,z+d/2+.14,.75,.06,.025,0xe4ddbd);}for(let r=0;r<4;r++)for(const side of [-1,1])B(x+side*(w/2+.35-r*.65),y+3.6+r*.4,z,.85,.45,d+1,0x795032);B(x,y+5.15,z,.7,.35,d+1,0x9c7954);for(let r=0;r<3;r++)B(x,y+3.5+r*.4,z+d/2,w-r*1.3,.4,.15,0x9c7954);B(x,y+.14,z+d/2+.8,1.5,.25,1,0xb4b9a6);}
 for(const [x,z,w] of [[5,8,4],[5,-3,4],[-4,2,4]])house(x,z,w,4);
 // Village paths and a covered well; keep the landing corridor open.
 for(let z=-8;z<=22;z++)B(0,.045,z,2,.12,1.1,0xb8aa87);for(let x=-6;x<=13;x++)B(x,.05,5,1.1,.12,1.6,0xb8aa87);
 B(5,.4,3,2,.8,2,0xb4b9a6);B(5,.82,3,1.45,.03,1.45,0x438fa7);for(const x of [4,6])B(x,1.65,3,.18,2.4,.18,0x795032);B(5,2.9,3,3,.35,2.7,0x9c7954);
 // Village vegetable plots, furrows and a central irrigation channel.
 for(const [cx,cz] of [[-5,11],[10,10]]){B(cx,.1,cz,5,.25,5,0x65513c);B(cx,.25,cz,.6,.06,4.8,0x438fa7);for(let ix=-2;ix<=2;ix++)for(let iz=-2;iz<=2;iz++){if(!ix)continue;B(cx+ix,.31,cz+iz,.75,.1,.7,0x795032);for(const d of [-.15,.15]){B(cx+ix+d,.65,cz+iz,.07,.6,.07,0x779443);B(cx+ix+d,.96,cz+iz,.17,.2,.15,0xd5b954);}}}
 // Water begins on the cliff, drops into the stream and collects in a shallow cove.
 B(-12,8.1,-11,3.8,.12,5.8,0x438fa7);B(-12,4,-7.05,2.2,8,.32,0x438fa7);B(-12,.03,1,2.4,.14,16,0x438fa7);B(-12,-.02,10,6,.13,4,0x438fa7);
 const flow=[];for(let i=0;i<16;i++){const p=group(-12+(i%4-.5)*.4,0,-6.84);box(p,0,0,0,.1,.4,.03,0xa1d8dd,0,0,0,true);flow.push(p);}animations.push(t=>flow.forEach((p,i)=>{p.position.y=8-((t*2.3+i*.51)%8);p.position.x=-12+Math.sin(i*3)*.85;}));
 for(let i=0;i<12;i++)B(-12+Math.sin(i*2)*1.1,.12,-6.5+Math.cos(i*2)*.7,.4,.08,.35,0xc8e4dd);
 // A plank bridge, side rails and a west-bank path.
 B(-12,.55,5,6,.25,2,0x9c7954);for(const z of [4.1,5.9]){B(-12,1.25,z,6,.12,.12,0x9c7954);for(const x of [-14.5,-12,-9.5])B(x,.9,z,.15,1.5,.15,0x795032);}for(let x=-19;x<=-2;x++)B(x,.05,5,1.1,.1,1.3,0xb8aa87);
 const planted=[];function tree(x,z,type){const y=height(x,z),h=type===2?5.5:3.5+rand()*1.7;B(x,y+h/2,z,.7,h,.7,type===1?0xe4ddbd:0x795032);if(type===1)for(let j=0;j<5;j++)B(x+.36,y+.5+j*.8,z,.015,.15,.4,0x65513c);if(type===2){for(let j=0;j<4;j++)B(x,y+h-1+j*.85,z,4-j*.85,1.2,4-j*.85,0x557450);}else{B(x,y+h,z,3.5,1.6,3.5,0x6a895c);B(x+.3,y+h+1.1,z-.2,2.3,1,2.5,type===1?0x91a56b:0x78975e);B(x-.8,y+h-.4,z+.6,2,1.2,2,0x799465);}}
 for(let i=0;i<200;i++){const x=Math.round((rand()-.5)*49),z=Math.round((rand()-.5)*47);if(!shore(x*1.08,z*1.08)||river(x,z)||Math.abs(x)<3||z>16&&Math.abs(x)<10||Math.abs(x+12)<4&&z<12&&z>-12)continue;if([[5,8],[12,2],[5,-3],[-4,2],[13,-8],[-5,11],[10,10],[5,3]].some(([a,b])=>Math.hypot(x-a,z-b)<4.6))continue;if(planted.some(([a,b])=>Math.hypot(x-a,z-b)<3.3))continue;planted.push([x,z]);tree(x,z,Math.floor(rand()*3));if(planted.length>=38)break;}
 for(let i=0;i<150;i++){const x=(rand()-.5)*45,z=(rand()-.5)*43;if(!shore(x*1.1,z*1.1)||river(x,z)||Math.abs(x)<2||Math.abs(z-5)<1||planted.some(([a,b])=>Math.hypot(x-a,z-b)<1))continue;if([[5,8],[12,2],[5,-3],[-4,2],[13,-8],[-5,11],[10,10]].some(([a,b])=>Math.hypot(x-a,z-b)<3.7))continue;const y=height(x,z);B(x,y+.25,z,.045,.5,.045,0x6d8954);B(x,y+.48,z,.28,.13,.28,[0xd8b844,0xb9574c,0xe4ddbd,0xb899cc][i%4]);}
}
