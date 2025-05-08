import React, { useState } from "react";
import styles from "../css/translate-styles.module.css";

const TranslateModal = ({ closeModal, applyTranslate }) => {
  const [src, setSrc] = useState("auto");
  const [tgt, setTgt] = useState("en");
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Translate</h3>
        <button onClick={() => closeModal(false)}>x</button>
      </div>
      <div className={styles.target}>
        <p>Select target language</p>
        <select
          className={styles.selectGrp}
          name="target"
          id="target"
          value={tgt}
          onChange={(e) => setTgt(e.target.value)}
        >
          <option value="en">English</option>
          {/* <option value="hi">Hindi</option> */}
          <option value="ja">Japanese</option>
          <option value="hi">Hindi</option>
        </select>
      </div>
      {/* <div className={styles.source}>
        <p>Select source language</p>
        <select
          name="source"
          className={styles.selectGrp}
          id="source"
          value={src}
          onChange={(e) => setSrc(e.target.value)}
        >
          <option value="auto">Auto detect</option>
          <option value="en">English</option>
          <option value="ja">Japanese</option>
        </select>
      </div> */}
      <div className={styles.btnGrp}>
        <button className={styles.cancelBtn} onClick={() => closeModal(false)}>
          Cancel
        </button>
        <button
          className={styles.copyBtn}
          onClick={() => applyTranslate(src, tgt)}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default TranslateModal;
