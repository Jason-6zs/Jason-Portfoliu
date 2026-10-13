// Self-contained original mellow soundtrack, served from the same site.
export class IslandAudio {
 constructor(){this.volume=.35;this.playing=false;this.onstatechange=null;this.media=new Audio(new URL('./assets/island-afternoon.mp3',import.meta.url).href);this.media.loop=true;this.media.preload='auto';this.media.volume=this.volume;this.media.setAttribute('playsinline','');for(const event of ['playing','pause','ended','error'])this.media.addEventListener(event,()=>{this.playing=!this.media.paused&&!this.media.error;this.onstatechange?.()});}
 async start(){this.media.volume=this.volume;await this.media.play();this.playing=true;this.onstatechange?.()}
 stop(){this.media.pause();this.playing=false;this.onstatechange?.()}
 setVolume(value){this.volume=Math.max(0,Math.min(1,value));this.media.volume=this.volume}
 chime(){}
}
