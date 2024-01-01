import BlockDescription from './Blockdescription';

function Dispbox({ color, score, visib }) {
  return (
    <div className="nav" style={{visibility: visib}}>
     {<h2>Score: {score}</h2>}
      <BlockDescription color={color} />
      
    </div>
  );
}

export default Dispbox;