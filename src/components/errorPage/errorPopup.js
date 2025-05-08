import React, { useState, useEffect } from "react";
import { Alert } from "reactstrap";

const ErrorComponent = ({ children, isSuccess = false }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Alert
      color={isSuccess ? "info" : "danger"}
      isOpen={visible}
      toggle={() => setVisible(false)}
      style={{
        position: "fixed",
        bottom: "10px",
        left: "10px",
        zIndex: 1000, // Adjust the z-index as needed
      }}
    >
      {children}
    </Alert>
  );
};

export default ErrorComponent;
