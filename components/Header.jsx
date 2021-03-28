import Logo from '../public/images/logo.svg';

import styles from './Header.module.css';

const Header = ({score}) => {
    return (
      <div className={styles.header}>
        <Logo />
        <div className={styles.score}>
          <div className={styles.scoreTitle}>SCORE</div>
          <div className={styles.scoreNumber}>{score}</div>
        </div>
      </div>
  )
  };

export default Header;