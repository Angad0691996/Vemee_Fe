import React from 'react';
import '../../css/new-style.css'; // Assuming you have a separate CSS file for tooltip styles

const Tooltip = ({ text }) => {
  return (
    <div className="tooltip">
      {text}
    </div>
  );
};

export default Tooltip;
