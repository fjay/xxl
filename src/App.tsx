import { useEffect, useState } from 'react'
import './App.css'
import GameBoard from './components/GameBoard'

function App() {
  const [level, setLevel] = useState<number>(() => {
    const savedLevel = localStorage.getItem('mathGameLevel');
    return savedLevel ? parseInt(savedLevel) : 1;
  });

  useEffect(() => {
    localStorage.setItem('mathGameLevel', level.toString());
  }, [level]);

  const handleLevelSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLevel = Number(e.target.value);
    setLevel(newLevel);
    
    // 保存到localStorage
    localStorage.setItem('mathGameLevel', newLevel.toString());
  };

  return (
    <div className="app">
      <div className="level-selector">
        <label htmlFor="level-select">难度等级：</label>
        <select 
          id="level-select" 
          value={level} 
          onChange={handleLevelSelect}
          className="level-select"
        >
          <option value="1">1级 - 10以内加减法</option>
          <option value="2">2级 - 20以内加减法</option>
          <option value="3">3级 - 乘法表</option>
          <option value="4">4级 - 混合运算</option>
        </select>
      </div>
      <GameBoard level={level} />
    </div>
  )
}

export default App
