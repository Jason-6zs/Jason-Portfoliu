import * as THREE from './vendor/three.module.js';
// Original 16×16 pixel artwork generated locally; no external game assets.
const maps=new Map(),cache=new Map();
const clamp=(x)=>Math.max(0,Math.min(255,Math.round(x)));
function noise(x,y,s=0){let n=Math.imul(x+17,374761393)^Math.imul(y+31,668265263)^Math.imul(s+3,1274126177);n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)/4294967295;}
function texture(kind,tint=0xffffff){const key=kind+':'+tint;if(maps.has(key))return maps.get(key);const data=new Uint8Array(16*16*4);const base=[tint>>16&255,tint>>8&255,tint&255];
 for(let y=0;y<16;y++)for(let x=0;x<16;x++){let rgb=[...base],v=(noise(x,y)-.5)*.15;
  if(kind==='plank'){const row=Math.floor(y/4),joint=(x+(row%2)*8)%16===0;v+=(y%4===0?-.30:y%4===1?.1:0)+(joint?-.26:0);if(y%4===2&&noise(Math.floor(x/3),row,4)>.6)v-=.17;}
  if(kind==='bark'){v+=(Math.floor(x/2)%3===0?-.29:.07);if(noise(Math.floor(x/2),Math.floor(y/4),5)>.7)v-=.2;}
  if(kind==='endgrain'){const ring=Math.floor(Math.max(Math.abs(x-7.5),Math.abs(y-7.5)));v+=ring%2===0?-.23:.09;}
  if(kind==='brick'){const row=Math.floor(y/8),edge=y%8===0||(x+(row%2)*8)%16===0;v+=edge?-.38:y%8===1?.18:0;if(noise(Math.floor(x/3),Math.floor(y/2),4)>.6)v-=.12;}
  if(kind==='stone'){v+=(noise(Math.floor(x/3),Math.floor(y/3),7)-.5)*.32;if((x+Math.floor(y/5)*3)%9===0&&y%7<3)v-=.2;}
  if(kind==='grass'){v+=(noise(Math.floor(x/2),Math.floor(y/2),3)-.5)*.34;if(noise(x,y,5)>.92)v+=.14;}
  if(kind==='dirt'||kind==='grass-side'){rgb=[125,87,54];v+=(noise(Math.floor(x/2),Math.floor(y/2),6)-.5)*.35;if(noise(x,y,7)>.91)rgb=[155,147,121];if(kind==='grass-side'&&y>12-Math.floor(noise(x,0,9)*3)){rgb=[91,146,54];v+=.05;}}
  if(kind==='leaves'){v+=(noise(Math.floor(x/2),Math.floor(y/2),2)-.5)*.60;if((x+y)%5===0)v-=.25;if(noise(x,y,8)>.86)v+=.2;}
  if(kind==='sand'){v+=(noise(x,y,10)-.5)*.15;if(noise(x,y,12)>.96)v-=.16;}
  if(kind==='cloth'){v=(noise(Math.floor(x/2),Math.floor(y/2),2)-.5)*.11;if(x===0||y===0)v-=.08;}
  if(kind==='metal'){v=(noise(x,y)-.5)*.035;if(x===0||y===0)v+=.16;if(x===15||y===15)v-=.21;}
  if(kind==='plain')v=(noise(x,y)-.5)*.07;
  const i=(y*16+x)*4;data[i]=clamp(rgb[0]*(1+v));data[i+1]=clamp(rgb[1]*(1+v));data[i+2]=clamp(rgb[2]*(1+v));data[i+3]=255;
 }
 const tx=new THREE.DataTexture(data,16,16);tx.colorSpace=THREE.SRGBColorSpace;tx.magFilter=THREE.NearestFilter;tx.minFilter=THREE.NearestMipmapLinearFilter;tx.generateMipmaps=true;tx.wrapS=tx.wrapT=THREE.RepeatWrapping;tx.needsUpdate=true;tx.name=key;maps.set(key,tx);return tx;
}
const wood=new Set([0x9c7954,0x65513c,0xc2a271,0x68523b,0x5f4936,0x775e3d,0x71583b,0x947d56,0x795032]);
const foliage=new Set([0x6a895c,0x91a56b,0x78975e,0x799465]);
const stone=new Set([0xb4b9a6,0xb8b79b,0x979275,0x748b7b,0x637d75]);
const cloth=new Set([0x469b9e,0x479da0,0x45999d,0x4f548a,0x161b25,0x121822,0x1d2030]);
const metal=new Set([0xd7ad62,0xcda65d,0xabb9af,0xa1ada0,0xcbd0bf]);
function single(color,kind='plain',glow=false){const k=color+kind+glow;if(cache.has(k))return cache.get(k);const m=new THREE.MeshStandardMaterial({color:0xffffff,map:texture(kind,color),roughness:kind==='metal'?.48:1,metalness:kind==='metal'?.25:0,flatShading:true});if(glow){m.emissive.set(color);m.emissiveIntensity=.65;}m.name=kind;cache.set(k,m);return m;}
export function material(color,emissive=false){if(emissive)return single(color,'plain',true);let kind=wood.has(color)?'plank':foliage.has(color)?'leaves':stone.has(color)?'brick':cloth.has(color)?'cloth':metal.has(color)?'metal':color===0xd0c59a?'sand':'plain';return single(color,kind);}
export function blockMaterial(color,glow=false){if(glow)return material(color,true);const key='block'+color;if(cache.has(key))return cache.get(key);let result;
 if(color===0x8fa978||color===0x76905b){const side=single(0xffffff,'grass-side');result=[side,side,single(color===0x8fa978?0x689d3d:0x5c8b37,'grass'),single(0xffffff,'dirt'),side,side];}
 else if(color===0x795032){const side=single(color,'bark'),cap=single(0xba914f,'endgrain');result=[side,side,cap,cap,side,side];}
 else result=material(color);cache.set(key,result);return result;
}
