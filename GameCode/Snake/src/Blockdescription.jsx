import "./blockdescription.css"
function BlockDescription({color}) {
  

    return (
        <>
        <div className="box">
          <div className="description">
            <div className="cell" style={{backgroundColor: color}}></div>
            <h5>Is you</h5>
          </div>
        <div className="description">
            <div className="cell-red cell"></div>
            <h5>Is food</h5>
        </div>
        <div className="description">
            <div className="cell-purple cell"></div>
            <h5>Is food that reverses you</h5>
        </div>
        <div className="description">
            <div className="cellbox">
              <div className="cell-orange cell"></div>
              <div className="cell-blue cell"></div>
            </div>
            <h5>Is food that teleports you</h5>
        </div>
        </div>
      
        </>
    )
        
  }
  
  export default BlockDescription