import React from 'react';
import './DefectPrediction.css';
function DefectPrediction() {
  return (
    <div className="DefectPrediction">
      
      <div className="recent-defects">
        <h3>Today's 3 Most Recent Defects</h3>
        <div className="defects">
          <div className="defect">
            <img src="/hole.jpg" alt="Defect 1" style={{ width: '500px', height: 'auto' }} />
            <p>Hole</p>
            <p>(x,y) 12:34 PM</p>
          </div>
          <div className="defect">
            <img src="/cut.jpg" alt="Defect 2" style={{ width: '500px', height: 'auto' }} />
            <p>Cut</p>
            <p>(x,y) 01:03 PM</p>
          </div>
          <div className="defect">
            <img src="/stain.jpg" alt="Defect 3" style={{ width: '500px', height: 'auto' }} />
            <p>Oil Stain</p>
            <p>(x,y) 04:51 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DefectPrediction;
