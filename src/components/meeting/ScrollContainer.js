import React, { useEffect, useRef, useState } from "react";

const ScrollContainer = ({
  children,
  autoScroll = true,
  onScroll,
  currentPage,
}) => {
  const outerDiv = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (onScroll) {
        onScroll(outerDiv.current.scrollTop);
        //console.log("currentPage", currentPage);
      }
    };

    outerDiv.current.addEventListener("scroll", handleScroll);

    return () => {
      if (outerDiv.current) {
        outerDiv.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [onScroll]);

  useEffect(() => {
    if (currentPage === 0 && autoScroll) {
      // console.log("curernt is 0");
      outerDiv.current.scrollTop = outerDiv.current.scrollHeight;
      //setFirstLoad(false); // Set firstLoad to false after the first scroll
    } else if (autoScroll && currentPage !== 0) {
      // Scroll down by a fixed amount (e.g., 2 messages)
      const scrollDownAmount = 100; /* Height of a single message */
      console.log("curernt is not 0");
      outerDiv.current.scrollTop =
        outerDiv.current.scrollTop + scrollDownAmount;
      outerDiv.current.scrollTo({
        // top: outerDiv.current.scrollTop + scrollDownAmount,
        behavior: "smooth", // Add smooth behavior
      });
    }
  }, [autoScroll, children]);

  return (
    <div
      ref={outerDiv}
      style={{ position: "relative", height: "100%", overflow: "scroll" }}
    >
      <div style={{ position: "relative" }}>{children}</div>
    </div>
  );
};

export default ScrollContainer;
