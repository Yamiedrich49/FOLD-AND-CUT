/* FOLD & CUT: deterministic 5–10-fold geometric generator. Do not edit individual folds without checking the inverse unfolding. */
window.__generateMasterPuzzle = function generateMasterPuzzle(seed,foldCount=6){
 const EPS=1e-5,R=x=>+x.toFixed(2);let rng=(seed>>>0)||1;const random=()=>((rng=Math.imul(rng,1664525)+1013904223>>>0)/4294967296);
 const area=p=>p.reduce((s,a,i)=>{let b=p[(i+1)%p.length];return s+a[0]*b[1]-b[0]*a[1]},0)/2;
 const normalize=p=>area(p)<0?p.slice().reverse():p;
 const clean=p=>{const a=[];for(const x of p)if(!a.length||Math.hypot(x[0]-a.at(-1)[0],x[1]-a.at(-1)[1])>EPS)a.push(x);if(a.length>2&&Math.hypot(a[0][0]-a.at(-1)[0],a[0][1]-a.at(-1)[1])<EPS)a.pop();return a.length>=3&&Math.abs(area(a))>.01?a:[]};
 const clip=(p,l,positive=false)=>{const a=[];for(let i=0;i<p.length;i++){let x=p[i],y=p[(i+1)%p.length],dx=x[0]*l.n[0]+x[1]*l.n[1]-l.d,dy=y[0]*l.n[0]+y[1]*l.n[1]-l.d,ix=positive?dx>=-EPS:dx<=EPS,iy=positive?dy>=-EPS:dy<=EPS;if(ix)a.push(x);if(ix!==iy){let t=dx/(dx-dy);a.push([x[0]+t*(y[0]-x[0]),x[1]+t*(y[1]-x[1])])}}return clean(a)};
 const reflect=(p,l)=>{let t=2*(p[0]*l.n[0]+p[1]*l.n[1]-l.d)/(l.n[0]**2+l.n[1]**2);return[p[0]-t*l.n[0],p[1]-t*l.n[1]]};
 const svgPoly=p=>{const poly=clean(p);return poly.length?'M'+poly.map(v=>v.map(R).join(',')).join(' L')+' Z':''};
 const svgPolys=polys=>polys.map(p=>svgPoly(normalize(p))).filter(Boolean).join(' ');
 const inPoly=(poly,p)=>{let v=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){let a=poly[i],b=poly[j];if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])v=!v}return v};
 const bounds=p=>{let v=p.flat();return {x1:Math.min(...v.map(q=>q[0])),x2:Math.max(...v.map(q=>q[0])),y1:Math.min(...v.map(q=>q[1])),y2:Math.max(...v.map(q=>q[1]))}};
 const endpoints=l=>{let v=[],[nx,ny]=l.n;for(const x of [0,320])if(Math.abs(ny)>EPS){let y=(l.d-nx*x)/ny;if(y>=-1&&y<=321)v.push([x,y])}for(const y of [0,320])if(Math.abs(nx)>EPS){let x=(l.d-ny*y)/nx;if(x>=-1&&x<=321)v.push([x,y])}v=v.filter((p,i)=>v.findIndex(q=>Math.hypot(p[0]-q[0],p[1]-q[1])<1e-4)===i);return[v[0]||[0,0],v.at(-1)||[320,320]]};
 const newLine=(k,b)=>{let w=b.x2-b.x1,h=b.y2-b.y1,f=.29+(random()-.5)*.06;switch(k%8){case 0:case 4:return{n:[1,0],d:b.x2-f*w};case 1:case 5:return{n:[0,1],d:b.y2-f*h};case 2:case 6:return{n:[-1,0],d:-(b.x1+f*w)};default:return{n:[0,-1],d:-(b.y1+f*h)}}};
 const original=[[0,0],[320,0],[320,320],[0,320]],n=Math.max(5,Math.min(10,foldCount));
 let pieces=[{poly:original,h:[]}],lines=[],folds=[],stages=[svgPolys([original])],foldMovie=[];
 for(let k=0;k<n;k++){
  const line=newLine(k,bounds(pieces.map(p=>p.poly))),fixed=[],moving=[],next=[];
  for(const part of pieces){
   let a=clip(part.poly,line),b=clip(part.poly,line,true);
   if(a.length){fixed.push(a);next.push({poly:a,h:part.h.concat(0)})}
   if(b.length){moving.push(b);next.push({poly:b.map(p=>reflect(p,line)),h:part.h.concat(1)})}
  }
  if(!moving.length||!fixed.length)throw Error('Fold has no two sides: '+k);
  let cx=0,cy=0,total=0;for(const p of moving){let a=Math.abs(area(p));cx+=p.reduce((s,v)=>s+v[0],0)/p.length*a;cy+=p.reduce((s,v)=>s+v[1],0)/p.length*a;total+=a}
  let start=[cx/total,cy/total],end=reflect(start,line),pts=endpoints(line);
  folds.push({label:'青い点から、紙を重ねよう',p:pts[0].map(v=>v/320),q:pts[1].map(v=>v/320),arrow:[start.map(v=>v/320),end.map(v=>v/320)]});
  const frames=[];for(let f=0;f<=8;f++){let t=f/8;frames.push([svgPolys(fixed),svgPolys(moving.map(poly=>poly.map(p=>{let r=reflect(p,line);return[p[0]+(r[0]-p[0])*t,p[1]+(r[1]-p[1])*t]})))])}
  foldMovie.push(frames);pieces=next;lines.push(line);stages.push(svgPolys(pieces.map(p=>p.poly)));
 }
 const box=bounds(pieces.map(p=>p.poly)),width=box.x2-box.x1,height=box.y2-box.y1,radius=Math.min(13,Math.max(5,Math.min(width,height)*.085));
 const candidates=[];for(let i=1;i<=14;i++)for(let j=1;j<=14;j++){
  let at=[box.x1+width*i/15,box.y1+height*j/15],cover=pieces.filter(p=>inPoly(p.poly,at)).length;
  let clearance=Math.min(at[0]-box.x1,box.x2-at[0],at[1]-box.y1,box.y2-at[1]);
  if(cover>=2&&clearance>radius*1.2)candidates.push({at,score:cover*2+clearance*.03+random()*3});
 }
 candidates.sort((a,b)=>b.score-a.score);if(!candidates.length)throw Error('No viable cut position');
 const cuts=[];for(let k=0;k<(n<7?2:3);k++){
  let found=candidates.find(v=>cuts.every(z=>Math.hypot(z.center[0]-v.at[0],z.center[1]-v.at[1])>radius*3.3));if(!found)break;
  let[x,y]=found.at,r=radius*(.78+.1*k),poly=k%3===0?[[x-r,y],[x,y-r],[x+r,y],[x,y+r]]:k%3===1?[[x-r,y-r*.7],[x+r,y-r*.7],[x+r,y+r*.7],[x-r,y+r*.7]]:[[x,y-r],[x+r,y+r],[x-r,y+r]];
  cuts.push({center:found.at,poly});
 }
 const intersection=(p,cutPoly)=>{let out=p.slice(),ring=normalize(cutPoly);for(let i=0;i<ring.length;i++){
  let a=ring[i],b=ring[(i+1)%ring.length],nx=b[1]-a[1],ny=a[0]-b[0],d=nx*a[0]+ny*a[1];
  out=clip(out,{n:[nx,ny],d});if(!out.length)break;
 }return out};
 const originalCoords=(poly,h)=>{let out=poly.map(p=>p.slice());for(let k=n-1;k>=0;k--)if(h[k])out=out.map(p=>reflect(p,lines[k]));return out};
 const finalPieces=pieces.map(p=>{
  let holes=cuts.map(c=>intersection(p.poly,c.poly)).filter(x=>x.length);
  return {...p,original:originalCoords(p.poly,p.h),holes,originalHoles:holes.map(h=>originalCoords(h,p.h))};
 });
 const material=polys=>polys.map(p=>svgPoly(normalize(p.poly))+' '+(p.holes||[]).map(h=>svgPoly(normalize(h).reverse())).join(' ')).join(' ');
 const foldedCut=material(finalPieces),allHoles=finalPieces.flatMap(p=>p.originalHoles);
 if(!allHoles.length)throw Error('No cut holes');
 const finalFrom=holes=>svgPoly(original)+' '+holes.map(svgPoly).join(' ');
 const final=finalFrom(allHoles),toStage=(poly,h,count)=>{let out=poly.map(p=>p.slice());for(let k=0;k<count;k++)if(h[k])out=out.map(p=>reflect(p,lines[k]));return out};
 const unfoldMovie=[];
 for(let k=n-1;k>=0;k--){
  const frames=[];for(let f=0;f<=8;f++){
   let t=f/8,base=[],flap=[];
   for(const p of finalPieces){
    let a=toStage(p.original,p.h,k+1),b=toStage(p.original,p.h,k);
    let mix=(x,y)=>x.map((v,i)=>[v[0]+(y[i][0]-v[0])*t,v[1]+(y[i][1]-v[1])*t]);
    let poly=mix(a,b),holes=p.originalHoles.map(h=>mix(toStage(h,p.h,k+1),toStage(h,p.h,k)));
    (p.h[k]?flap:base).push({poly,holes});
   }
   frames.push([material(base),material(flap)]);
  }
  unfoldMovie.push(frames);
 }
 const mutate=(p,kind)=>p.map(([x,y])=>{
  if(kind===0)return[320-x,y];if(kind===1)return[x,320-y];if(kind===2)return[320-x,320-y];
  if(kind===3)return[320-y,x];if(kind===4)return[y,320-x];
  if(kind===5)return[Math.max(3,Math.min(317,x+28)),y];
  if(kind===6)return[x,Math.max(3,Math.min(317,y-32))];
  return[Math.max(3,Math.min(317,x-39)),Math.max(3,Math.min(317,y+21))];
 });
 let wrong=[];for(let i=0;i<8;i++){let c=finalFrom(allHoles.map(h=>mutate(h,i)));if(c!==final&&!wrong.includes(c))wrong.push(c)}
 const howMany=n>=7?8:n>=6?6:4;
 for(let i=0;wrong.length<howMany-1&&i<10;i++){let c=finalFrom(allHoles.filter((_,j)=>j%(i+2)!==0));if(c!==final&&!wrong.includes(c))wrong.push(c)}
 if(wrong.length<howMany-1)throw Error('Not enough choice variants');
 const correct=(seed*3+n)%howMany,choices=wrong.slice(0,howMany-1);choices.splice(correct,0,final);
 return {title:`折り目の迷宮 · ${n}回`,difficulty:n>=8?'超マスター':n>=7?'達人':'上級',foldsCount:n,cuts:cuts.length,folds,foldMovie,stages,camera:Array.from({length:n+1},()=>[1,0,0]),cutPath:svgPolys(cuts.map(c=>c.poly)),foldedCut,final,unfoldMovie,choices,correct,comparison:choices.map(()=>({extra:'',missing:''})),hint:'折った順番を逆にたどり、切り口がどこに映るか考えよう。',intro:false,advanced:true,advancedBounds:box,skills:['多重の対称','逆順展開'],explanation:'折り目を戻すと、重なった紙の枚数だけ切り口が広がる。'};
};
