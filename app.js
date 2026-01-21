let data = JSON.parse(localStorage.getItem('tugData')) || {
data.stats[n]=0;
save(); render();
}


function render(){
['kings','warriors'].forEach(team=>{
let div=document.getElementById(team+'Players'); div.innerHTML=''; let t=0;
data[team].forEach((p,i)=>{
let cw=p.weights[p.weights.length-1].w; t+=cw;
div.innerHTML+=`<div class='player'>${p.name} – ${cw}kg</div>`;
});
document.getElementById(team+'Total').innerText='Total: '+t+' kg';
});
buildPlayerSelect(); buildStats(); buildLineup();
}


function markAttendance(){
const today=new Date().toISOString().split('T')[0];
data.attendance[today]=[];
['kings','warriors'].forEach(team=>{
data[team].forEach(p=>{
if(confirm(`Did ${p.name} attend today?`)){
data.attendance[today].push(p.name);
data.stats[p.name]++;
}
});
});
save(); render();
}


function buildStats(){
let d=document.getElementById('attendanceStats'); d.innerHTML='';
for(let p in data.stats){ d.innerHTML+=`${p}: ${data.stats[p]} sessions<br>`; }
}


function buildPlayerSelect(){
let s=document.getElementById('playerSelect'); s.innerHTML='';
['kings','warriors'].forEach(team=>{
data[team].forEach((p,i)=>{
s.innerHTML+=`<option value='${team}-${i}'>${p.name}</option>`;
});
});
}


function drawGraph(){
let v=document.getElementById('playerSelect').value; if(!v) return;
let [team,i]=v.split('-'); let p=data[team][i];
let c=document.getElementById('chart'); let ctx=c.getContext('2d');
ctx.clearRect(0,0,c.width,c.height);
let max=Math.max(...p.weights.map(x=>x.w));
p.weights.forEach((x,idx)=>{
let X=30+idx*40; let Y=180-(x.w/max)*150;
ctx.beginPath(); ctx.arc(X,Y,4,0,6.28); ctx.fill();
if(idx>0){ let px=30+(idx-1)*40; let py=180-(p.weights[idx-1].w/max)*150;
ctx.beginPath(); ctx.moveTo(px,py); ctx.lineTo(X,Y); ctx.stroke(); }
});
}


function renderCalendar(){
let m=document.getElementById('monthPicker').value; if(!m) return;
let d=new Date(m+'-01'); let out='';
while(d.getMonth()+1==Number(m.split('-')[1])){
let k=d.toISOString().split('T')[0];
out+=`${k}: ${data.attendance[k]?.length||0} attended<br>`;
d.setDate(d.getDate()+1);
}
document.getElementById('calendar').innerHTML=out;
}


function buildLineup(){
let div=document.getElementById('lineup'); div.innerHTML='';
let all=[...data.kings,...data.warriors];
all.forEach(p=>{
div.innerHTML+=`<label><input type='checkbox'> ${p.name}</label><br>`;
});
}


render();
