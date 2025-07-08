import logo from './logo.svg';
import './App.css';
import Board from './components/board';

function App() {
  return (
    <div className="App">
      <Board rows={12} cols={12} mines={20} />
    </div>
  );
}

export default App;
