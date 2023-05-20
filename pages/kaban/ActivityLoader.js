import React from 'react';
import styles from '@/styles/ActivityLoader.module.css';

const ActivityLoader = () => {
  return (
    <div className={styles.loader}>
      <div className={styles.inner}></div>
    </div>
  );
};

export default ActivityLoader;
