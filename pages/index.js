import { useState, useEffect } from 'react';
import cn from 'classnames'

import styles from '../styles/Home.module.css'
import BgTriangle from '../public/images/bg-triangle.svg';
import Paper from '../public/images/icon-paper.svg';
import Scissors from '../public/images/icon-scissors.svg';
import Rock from '../public/images/icon-rock.svg';
import Rules from '../public/images/image-rules.svg';
import Close from '../public/images/icon-close.svg';

import Header from '../components/Header';

const types = {
  rock: 'rock', // 0
  scissors: 'scissors', //1
  paper: 'paper', // 2
}

const winners = {
  you: 'you',
  computer: 'computer',
  draw:'draw',
}

const selectionList = {
  scissors: Scissors,
  paper: Paper,
  rock: Rock,
}

const pickWinner = (userSelection, computerSelection) => {
  if(userSelection === computerSelection){
    return winners.draw;
  }

  const userSelectionIndex = Object.keys(types).indexOf(userSelection);
  const computerSelectionIndex = Object.keys(types).indexOf(computerSelection);

  if(Math.abs(userSelectionIndex-computerSelectionIndex)===1){
    return userSelectionIndex<computerSelectionIndex? winners.you: winners.computer;
  }

  return userSelectionIndex<computerSelectionIndex? winners.computer: winners.you;

}

const Game = ({ setUserSelection }) => {
  return (
    <div className={styles.game}>
      <BgTriangle />
      <div className={cn(styles.gameItem, styles.paper)} onClick={()=>setUserSelection(types.paper)}>
        <Paper />
      </div>
      <div className={cn(styles.gameItem, styles.scissors)} onClick={()=>setUserSelection(types.scissors)}>
        <Scissors/>
      </div>
      <div className={cn(styles.gameItem, styles.rock)} onClick={()=>setUserSelection(types.rock)}>
        <Rock/>
      </div>
    </div>
  )
}

const GameResult = ({userSelection, computerSelection,replay, isFinished, setScore }) => {
  const [winner, setWinner] = useState('');

  useEffect(() => {
    if(!isFinished){
      return;
    }
    const winner = pickWinner(userSelection,computerSelection);
    setWinner(winner);

    setScore(score => 
      winner === winners.you ? score+1 :
      winner === winners.computer ? score-1 : score);

  }, [isFinished, userSelection, computerSelection]);

  const UserSelectionComponent = selectionList[userSelection];
  const ComputerSelectionComponent = selectionList[computerSelection];

  const resetGame = () => {
    setWinner('');
    replay();
  }

  return (
    <div className={styles.gameResult}>
          <div className={styles.resultPanel}>
            <div className={styles.resultTitle}>YOU PICKED</div>
            <div className={cn(styles[userSelection])}>
                {UserSelectionComponent && <UserSelectionComponent />}
            </div>
          </div>
          <div className={cn(styles.winnerPanel,isFinished?styles.winnerPanelShow : null)}>
            <div className={styles.resultTitle}>
              {winner===winners.you ? 'YOU WIN' : winner === winners.computer ? 'COMPUTER WIN' : 'DRAW'}
            </div>
            <div className={styles.replayButtonPanel}>
              <button onClick={resetGame} className={styles.replayButton}>PLAY AGAIN</button>
            </div>
          </div>
          <div className={styles.resultPanel}>
            <div className={styles.resultTitle}>{computerSelection ? 'THE HOUSE PICKED' : 'THE HOUSE THINKING...'}</div>
            <div className={cn(styles[computerSelection])}>
                {ComputerSelectionComponent && <ComputerSelectionComponent />}
            </div>
          </div>
       </div>
  )
};

const RulesModal = ({}) => {
  const [isRulesOpen, setRulesOpen] = useState(false);

  return (
    <>
      <div className={styles.footer}>
        <button onClick={()=>setRulesOpen(v => !v)} className={styles.rulesButton}>RULES</button>
      </div>
      {isRulesOpen && <div className={styles.modalContainer}>
        <div className={styles.rulesModal} >
          <div className={styles.rulesModalHeader} >
            <div className={styles.modalTitle}>RULES</div>
            <div className={styles.modalClose}><Close onClick={()=>setRulesOpen(v => !v)} /></div>
          </div>
          <Rules />
        </div>
      </div>}
    </>
  )
};

const Home = () => {
  const [score, setScore] = useState(0);
  const [userSelection, setUserSelection] = useState('');
  const [computerSelection, setComputerSelection] = useState('');
  const [isFinished, setFinished] = useState(false);

  const replay = ()=> {
    setFinished(false);
    setUserSelection('');
    setComputerSelection('');
  }

  useEffect(() => {
    if(userSelection){
        const interval = setInterval(()=>{
          const randomIndex = Math.floor(Math.random() * 3)
          setComputerSelection(Object.keys(selectionList)[randomIndex]);
        },200);

        const timeout = setTimeout(()=>{
          clearInterval(interval);
          setFinished(true);
        },3000);

        return () => {
          interval && clearInterval(interval);
          timeout && clearTimeout(interval);
        }
    }
  }, [userSelection]);





  return (
    <div className={styles.wrapper}>
      <Header score={score}/>
      {userSelection === '' ? 
        <Game setUserSelection={setUserSelection} /> :
        <GameResult 
          userSelection={userSelection} 
          computerSelection={computerSelection}
          replay={replay}
          isFinished={isFinished}
          setScore={setScore}
        />
      }
      <RulesModal />
    </div>
  )
}

export default  Home;