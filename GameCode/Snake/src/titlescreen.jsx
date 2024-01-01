import "./Board.css"
import { useState } from "react";
import BlockDescription from "./Blockdescription"


function TitleScreen({ setGameStatus, title, handleStart, inputcolor, inputname }) {
  const [color, setColor] = useState(inputcolor); // Default color is red
  const [name, setName] = useState(inputname);
  const handleColorChange = (event) => {
      setColor(event.target.value);
  }
  const handleNameChange = (event) => {
    setName(event.target.value);
  }
   // Default name is "Player 1"

  const handleStartClick = () => {
      handleStart(color, name); // Pass the color to handleStart
  }
  let usingcolor = color || inputcolor || "#48CFAD"
  
  return (
    <div className="title-screen">
      <div className="title">{title}</div>
      <BlockDescription color = {usingcolor}/>
      <div className="select-box">
      <h2>Choose your color:</h2>
      <div className="selection-box">
      <input type="color" value={usingcolor} onChange={handleColorChange} />
      </div>
      <h2>Choose your name:</h2>
      <div className="selection-box">
      <input type="text" value={name} onChange={handleNameChange} />
      </div>
      </div>
      <button className="btn-pink button-23" onClick={handleStartClick}>Play</button>
    </div>
  )
}
  
  export default TitleScreen