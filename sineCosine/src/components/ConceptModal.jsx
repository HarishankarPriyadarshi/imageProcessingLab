import { useState } from "react";
import steps from "../data/steps";
import { useMatrix } from "../context/MatrixContext";
import InputImage from "./steps/InputImage";
import ImageBlocking from "./steps/ImageBlocking";
import BasisMatrix from "./steps/BasisMatrix";
import TransformComputation from "./steps/TransformComputation";
import Quantization from "./steps/Quantization";
import ZigZagScan from "./steps/ZigZagScan";
import Encoding from "./steps/Encoding";
import InverseTransform from "./steps/InverseTransform";
import Comparison from "./steps/Comparison";

function ConceptModal({ onClose }) {


const { selectedMatrix, blockCreated, popupMessage, setPopupMessage } = useMatrix();

const nextStep = () => {
  if (!started) return;

  if (activeStep === 1 && !selectedMatrix) {
    setPopupMessage("Please select a matrix first before proceeding to the next step.");
    return;
  }

  if (activeStep === 2 && !blockCreated) {
    setPopupMessage("Please select a block (B1-B4) and click 'Create Processing Block' first.");
    return;
  }

  if (activeStep < steps.length) {
    setActiveStep(prev => prev + 1);
  }
};

const prevStep = () => {
  if (!started) return;

  if (activeStep > 1) {
    setActiveStep(prev => prev - 1);
  }
};


const [started, setStarted] = useState(true);

const [activeStep, setActiveStep] = useState(1);


const startSimulation = () => {
  setStarted(true);
  setActiveStep(1);
};

  

  return (

    
    <div className="overlay">

      <div className="modal">

{popupMessage && (
  <div className="centerPopupOverlay">
    <div className="centerPopupBox">
      <p>{popupMessage}</p>
      <button onClick={() => setPopupMessage("")}>OK</button>
    </div>
  </div>
)}

<div className="headerBar">
  <div className="headerTitle">Sine & Cosine Compression Visualizer</div>
  <div className="headerActions">
    <button className="closeHeaderBtn" onClick={() => onClose && onClose()}>CLOSE</button>
  </div>
</div>

        <div className="contentArea">


<div className="leftPanel">

  <h2 className="stepsHeading">Steps</h2>

  <ul className="stepsList">
    {steps.map((step) => (
      <li
        key={step.id}
        className={
          step.id === activeStep
            ? "currentStep"
            : step.id < activeStep
            ? "completedStep"
            : "lockedStep"
        }
      >
        <span className="stepCircle">
          {step.id}
        </span>

        {step.title}
      </li>
    ))}
  </ul>

  <div className="controlButtons">

    <button
      onClick={prevStep}
      disabled={!started || activeStep === 1}
    >
      Prev
    </button>

    <button
      onClick={nextStep}
      disabled={!started}
    >
      Next
    </button>

    <button
      onClick={startSimulation}
      disabled={started}
    >
      Start
    </button>


  </div>

  

</div>
<div className="visualPanel">

  
<div className="stepWorkspace">

  
  


<div className="ioContainer">

{activeStep === 1 ? (

  



<InputImage />





) 

: activeStep === 2 ? (

<ImageBlocking />

)

: activeStep === 3 ? (

<BasisMatrix />

)

: activeStep === 4 ? (

<TransformComputation />

)

: activeStep === 5 ? (

<Quantization />

)

: activeStep === 6 ? (

<ZigZagScan />

)

: activeStep === 7 ? (

<Encoding />

)

: activeStep === 8 ? (

<InverseTransform />

)

: activeStep === 9 ? (

<Comparison />

)

: (

<div className="ioContainer">

Output Data Here

</div>

)}


</div>




  <div className="explanationBox">

<h3>Explanation</h3>

{activeStep === 1 ? (

<p>
A digital image can be represented as a matrix
of pixel intensity values. Each element stores
brightness information ranging from 0 to 255.

Image compression works by identifying and
removing less important information while
preserving the visual appearance of the image.

In the compressed matrix, several values are
reduced or discarded, resulting in a significant
reduction in storage requirements.
</p>




) : (

  

<p>
{steps[activeStep - 1]?.description}
</p>

)}




</div>


</div>
</div>
</div>

       

      </div>

    </div>
  );
}

export default ConceptModal;