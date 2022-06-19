import React from 'react';
import styles from './styles.module.css';

export default function Uderline({ children }) {
  return (
    <span className={styles.underLine}>{children}</span>
  )
}