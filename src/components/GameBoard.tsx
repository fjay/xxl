import React, { useState, useEffect } from 'react';
import '../styles/GameBoard.css';
import { MathGenerator, MathProblem } from '../utils/mathGenerator';

interface GameBoardProps {
  level: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ level }) => {
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [score, setScore] = useState<number>(() => {
    const savedScore = localStorage.getItem('mathGameScore');
    return savedScore ? parseInt(savedScore) : 0;
  });

  useEffect(() => {
    generateProblems();
  }, []);

  useEffect(() => {
    // 当难度等级变化时，重新生成题目
    generateProblems();
    // 可以考虑在难度变化时重置分数
    // setScore(0);
  }, [level]);

  useEffect(() => {
    localStorage.setItem('mathGameScore', score.toString());
  }, [score]);

  const generateProblems = () => {
    const pairs: MathProblem[] = [];
    for (let i = 0; i < 8; i++) {
      const [prob1, prob2] = MathGenerator.generateProblemPair();
      pairs.push(prob1, prob2);
    }
    // 打乱题目顺序，使答案不再固定在右边
    const shuffledPairs = [...pairs].sort(() => Math.random() - 0.5);
    setProblems(shuffledPairs);
  };

  const handleItemClick = (id: string) => {
    const audio = new Audio('/src/assets/match.mp3');

    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
      return;
    }

    const newSelected = [...selectedItems, id];
    setSelectedItems(newSelected);

    if (newSelected.length === 2) {
      const [first, second] = newSelected;
      const problem1 = problems.find(p => p.id === first);
      const problem2 = problems.find(p => p.id === second);

      if (problem1 && problem2 && problem1.result === problem2.result) {
        const matchedElements = document.querySelectorAll(`[data-id="${first}"], [data-id="${second}"]`);
        matchedElements.forEach(el => el.classList.add('matched'));

        audio.play().catch(error => console.log('音效播放失败:', error));
        
        setScore(prev => prev + 10);
        setTimeout(() => {
          setProblems(problems.filter(p => !newSelected.includes(p.id)));
        }, 600);
      }

      setTimeout(() => setSelectedItems([]), 500);
    }
  };

  const handleRestart = () => {
    if (problems.length === 0) {
      generateProblems();
    }
  };

  return (
    <div className="game-board">
      <div className="score">得分: {score}</div>
      <div className="board-container">
        {problems.map(problem => (
          <div
            key={problem.id}
            data-id={problem.id}
            className={`math-item ${selectedItems.includes(problem.id) ? 'selected' : ''}`}
            onClick={() => handleItemClick(problem.id)}
          >
            {problem.expression}
          </div>
        ))}
      </div>
      <button 
        className={`restart-button ${problems.length === 0 ? 'active' : ''}`}
        onClick={handleRestart}
        disabled={problems.length > 0}
      >
        重新开始
      </button>
    </div>
  );
};

export default GameBoard;