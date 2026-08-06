import "./BasisMatrix.css";
import React,{useState} from "react";
import { useMatrix } from "../../context/MatrixContext";

function BasisMatrix(){

const { selectedMatrix, selectedBlock, transform, setTransform, basisMatrix, setBasisMatrix, basisGenerated, setBasisGenerated } = useMatrix();

if(!selectedMatrix){
   return null;
}

let rowStart=0;
let colStart=0;

switch(selectedBlock){

case 1:
rowStart=0;
colStart=0;
break;

case 2:
rowStart=0;
colStart=8;
break;

case 3:
rowStart=8;
colStart=0;
break;

case 4:
rowStart=8;
colStart=8;
break;

default:
rowStart=0;
colStart=0;

}

const processingBlock=
selectedMatrix.data
.slice(rowStart,rowStart+8)
.map(row=>row.slice(colStart,colStart+8));



const [selectedCell,setSelectedCell]=useState(null);

const [calcStep,setCalcStep]=useState(0);

const computeValue=(u,x)=>{
const N=8;
if(transform==="DCT"){
const alpha=u===0?Math.sqrt(1/N):Math.sqrt(2/N);
return alpha*Math.cos(((2*x+1)*u*Math.PI)/(2*N));
}
return Math.sqrt(2/(N+1))*Math.sin(((u+1)*(x+1)*Math.PI)/(N+1));
};

const generateBasisMatrix=()=>{
if(!transform || basisGenerated) return;
const N=8;
const matrix=Array.from({length:N},()=>Array(N).fill(null));
setBasisMatrix(matrix.map(r=>[...r]));
let u=0,x=0;
const interval=setInterval(()=>{
matrix[u][x]=computeValue(u,x).toFixed(4);
setBasisMatrix(matrix.map(r=>[...r]));
x++;
if(x>=N){x=0;u++;}
if(u>=N){
clearInterval(interval);
setBasisGenerated(true);
}
},60);
};

const cellSteps=(u,x)=>{
if(transform==="DCT"){
const num=(2*x+1)*u;
const angle=(num*Math.PI)/16;
const cosVal=Math.cos(angle);
const alpha=u===0?Math.sqrt(1/8):Math.sqrt(2/8);
return [
`Step 1 — Formula: C(${u},${x}) = α(u) · cos[ (2x+1)uπ / 2N ]`,
`Step 2 — Plug in u=${u}, x=${x}: numerator = (2×${x}+1)×${u} = ${num}`,
`Step 3 — Angle = ${num}π / 16 = ${angle.toFixed(4)} radians`,
`Step 4 — cos(${angle.toFixed(4)}) = ${cosVal.toFixed(4)}`,
`Step 5 — Normalization α(u): u=${u} → α = ${u===0?"√(1/8)":"√(2/8)"} = ${alpha.toFixed(4)}`,
`Step 6 — Final: ${alpha.toFixed(4)} × ${cosVal.toFixed(4)} = ${(alpha*cosVal).toFixed(4)}`
];
}
const angle=((u+1)*(x+1)*Math.PI)/9;
const sinVal=Math.sin(angle);
const coeff=Math.sqrt(2/9);
return [
`Step 1 — Formula: S(${u},${x}) = √(2/(N+1)) · sin[ (u+1)(x+1)π / (N+1) ]`,
`Step 2 — Plug in u=${u}, x=${x}: (${u}+1)×(${x}+1) = ${(u+1)*(x+1)}`,
`Step 3 — Angle = ${(u+1)*(x+1)}π / 9 = ${angle.toFixed(4)} radians`,
`Step 4 — sin(${angle.toFixed(4)}) = ${sinVal.toFixed(4)}`,
`Step 5 — Coefficient √(2/9) = ${coeff.toFixed(4)}`,
`Step 6 — Final: ${coeff.toFixed(4)} × ${sinVal.toFixed(4)} = ${(coeff*sinVal).toFixed(4)}`
];
};

const playCalc=()=>{
if(!selectedCell) return;
setCalcStep(0);
let step=0;
const total=cellSteps((selectedCell?.row??0),selectedCell.col).length;
const interval=setInterval(()=>{
step++;
setCalcStep(step);
if(step>=total){clearInterval(interval);}
},700);
};

const fastForwardCalc=()=>{
if(!selectedCell) return;
setCalcStep(cellSteps((selectedCell?.row??0),selectedCell.col).length);
};


return(

<div className="basisContainer">

<div className="basisHeading">

<h2>Generate Basis Matrix</h2>

<p>

Generate the orthogonal basis matrix required for
the selected transform before performing image compression.

</p>

</div>


<div className="topControls">

<div className="controlCard">

<h3>Transform</h3>

<div className="toggleButtons">

<button

disabled={basisGenerated}

className={
transform==="DCT"
?
"activeBtn"
:
""
}

onClick={()=>setTransform("DCT")}

>

DCT

</button>

<button

disabled={basisGenerated}

className={
transform==="DST"
?
"activeBtn"
:
""
}

onClick={()=>setTransform("DST")}

>

DST

</button>

</div>

<div className="miniFormulaText">
{!transform ? "Select DCT or DST above" : (
<div className="equation">
<div className="leftPart">
{transform==="DCT" ? "C(u,x) = α(u)·cos" : "S(u,x) = √(2/(N+1))·sin"}
</div>
<div className="fraction">
<div className="numerator">{transform==="DCT" ? "(2x+1)uπ" : "(u+1)(x+1)π"}</div>
<div className="line"></div>
<div className="denominator">{transform==="DCT" ? "2N" : "N+1"}</div>
</div>
</div>
)}
</div>

</div>

</div>


<div className="basisLayout">



<div className="basisCard blockCard">

<h3>Selected Processing Block</h3>

<div className="selectedBlockPreview" style={{display:"grid",gridTemplateColumns:"repeat(8,54px)",gap:"4px",width:"fit-content",margin:"20px auto"}}>

{processingBlock.map((row,rowIndex)=>

row.map((value,colIndex)=>(

<div
key={rowIndex+"-"+colIndex}
className="blockPixel"
style={{background:`rgb(${value},${value},${value})`,width:"54px",height:"54px"}}
>
</div>

))

)}

</div>

</div>

<div className="basisArrow">

➜

</div>

<div className="basisCard orthoMatrixCard">

<h3>

Orthogonal Basis Matrix ( C )

</h3>

<div className="basisGrid">

    <div></div>

{

Array.from({length:8}).map((_,i)=>(

<div
key={"head"+i}
className="matrixHeader"
>

x={i}

</div>

))

}

{

basisMatrix.length===0

?

null

:

basisMatrix.map((row,rowIndex)=>(
<React.Fragment key={rowIndex}>


<div className="matrixHeader">

u={rowIndex}

</div>

{

row.map((value,colIndex)=>(

<span

key={rowIndex+"-"+colIndex}

className={
selectedCell && (selectedCell?.row??0)===rowIndex && selectedCell.col===colIndex
?
"activeVector"
:
""
}

onClick={()=>{setSelectedCell({row:rowIndex,col:colIndex});setCalcStep(0);}}

>

{value}

</span>

))

}

</React.Fragment>

))



}

</div>

</div>

</div>

<button

className="generateButton"

disabled={!transform || basisGenerated}

onClick={generateBasisMatrix}

>

Generate Basis Matrix

</button>


<div className="currentCalculation">

<h3>Current Basis Calculation</h3>

{!selectedCell ? (

<p>Click any cell in the matrix above to see its calculation.</p>

) : (

<>

<p>Selected Cell : <b>u = {(selectedCell?.row??0)}, x = {selectedCell.col}</b></p>

<div className="playControls">

<button className="generateButton" onClick={playCalc}>▶ Play</button>

<button className="generateButton fastForward" onClick={fastForwardCalc}>⏩ Fast Forward</button>

</div>

<div className="calcSteps">

{cellSteps((selectedCell?.row??0),selectedCell.col).slice(0,calcStep).map((line,i)=>(

<p key={i} className="calcStepLine">{line}</p>

))}

</div>

</>

)}

</div>

<div className="waveCard">

<h3>Basis Function Visualization</h3>

<svg
className="waveSvg"
viewBox="0 0 520 220"
>

<line
x1="40"
y1="110"
x2="490"
y2="110"
className="axisLine"
/>

<line
x1="40"
y1="20"
x2="40"
y2="190"
className="axisLine"
/>

<polyline

fill="none"

stroke="#2563eb"

strokeWidth="4"

strokeLinecap="round"

strokeLinejoin="round"

points={

Array.from({length:8}).map((_,x)=>{

let value;

if(transform==="DCT"){

const alpha=

(selectedCell?.row??0)===0

?

Math.sqrt(1/8)

:

Math.sqrt(2/8);

value=

alpha*

Math.cos(

((2*x+1)*(selectedCell?.row??0)*Math.PI)/16

);

}

else{

value=

Math.sqrt(2/9)

*

Math.sin(

(((selectedCell?.row??0)+1)*(x+1)*Math.PI)/9

);

}

return `${40+x*60},${110-value*70}`;

}).join(" ")

}

/>

{

Array.from({length:8}).map((_,x)=>{

let value;

if(transform==="DCT"){

const alpha=

(selectedCell?.row??0)===0

?

Math.sqrt(1/8)

:

Math.sqrt(2/8);

value=

alpha*

Math.cos(

((2*x+1)*(selectedCell?.row??0)*Math.PI)/16

);

}

else{

value=

Math.sqrt(2/9)

*

Math.sin(

(((selectedCell?.row??0)+1)*(x+1)*Math.PI)/9

);

}

return(

<g key={x}>

<circle

cx={40+x*60}

cy={110-value*70}

r="5"

className="wavePoint"

/>

<text

x={34+x*60}

y="205"

className="waveLabel"

>

{x}

</text>

</g>

);

})

}

</svg>

<div className="waveLegend">

<div>

🔵

Amplitude

</div>

<div>

x = Pixel Position

</div>

<div>

u = {(selectedCell?.row??0)}

</div>

</div>

</div>

<div className="waveDescription">

{

(selectedCell?.row??0)===0

?

"Flat basis vector. Represents the DC component (average intensity)."

:

(selectedCell?.row??0)<=2

?

"Low-frequency basis vector. Captures smooth brightness changes."

:

(selectedCell?.row??0)<=5

?

"Medium-frequency basis vector. Represents image texture."

:

"High-frequency basis vector. Represents edges and fine details."

}

</div>

<div className="relationCard">

<h3>

Relation With Selected Block

</h3>

<p>

Selected Block :

<b>

B{selectedBlock}

</b>

</p>

<p>

The basis matrix is generated only once because it depends on the block size (8 × 8).

The selected block supplies the pixel values.

During the next step, this basis matrix will be multiplied with the selected block to generate frequency coefficients.

</p>

</div>



<div className="basisInfo">

<div>

<b>Selected Block</b>

<span>

B{selectedBlock}

</span>

</div>

<div>

<b>Transform</b>

<span>

{transform}

</span>

</div>

<div>

<b>Matrix Size</b>

<span>

8 × 8

</span>

</div>

<div>

<b>Orthogonal</b>

<span>

YES

</span>

</div>

<div>

<b>Normalization</b>

<span>

Enabled

</span>

</div>

<div>

<b>Basis Vectors</b>

<span>

8

</span>

</div>

</div>

<div className="conceptCard">

<h3>

Concept Explanation

</h3>

<p>

The selected processing block is

<b>

B{selectedBlock}

</b>

.

However, the generated

<b>

{transform}

Basis Matrix

</b>

does not change.

</p>

<p>

This is because the basis matrix depends only on

the block size

<b>

(8 × 8)

</b>

and not on the pixel values.

Every processing block uses the same orthogonal

basis vectors during transform coding.

</p>

</div>

<div className="equationCard">

<h3>

Transform Equation

</h3>

{

transform==="DCT"

?

<p>

F = C × A × Cᵀ

</p>

:

<p>

F = S × A × Sᵀ

</p>

}

<p>

Where,

</p>

<ul>

<li>

A → Selected 8 × 8 Image Block

</li>

<li>

{

transform==="DCT"

?

"C"

:

"S"

}

→ Basis Matrix

</li>

<li>

{

transform==="DCT"

?

"Cᵀ"

:

"Sᵀ"

}

→ Transpose Basis Matrix

</li>

<li>

F → Frequency Coefficient Matrix

</li>

</ul>

</div>




</div>



);

}

export default BasisMatrix;