

const Board = ({gameboard, snakeCells, foodCell, teleportationCell, foodShouldReverseDirection, foodShouldTeleport}) => {

return (
  <>
  {gameboard.map((row, rowIdx) => (
    <div key={rowIdx} className="row">
      {row.map((cellValue, cellIdx) => {
        const cellColor = getCellColor(
        cellValue,
        foodCell,
        teleportationCell,
        foodShouldReverseDirection,
        foodShouldTeleport,
        snakeCells,       
      );  
        return <div key={cellIdx} className="cell" style={{backgroundColor: cellColor}}></div>;
       })}
      </div>
    ))}  
  </>
    )};         
  const getCellColor = (
    cellValue,
    foodCell,
    teleportationCell,
    foodShouldReverseDirection,
    foodShouldTeleport,
    snakeCells,
  ) => {
    if (cellValue === teleportationCell) {
      return 'rgb(79,193,233)';
    }
    
    if (cellValue === foodCell) {
      if (foodShouldReverseDirection) {
        return 'rgb(255, 186, 84)';
      }
      if (foodShouldTeleport) {
        return 'rgb(252,110,81)';
      }
      return 'rgb(237, 85, 101)';
    }
    
    if (cellValue in snakeCells) {
      return snakeCells[cellValue];
    }
  
    return 'rgb(50,49,51)';
  };
   export default Board