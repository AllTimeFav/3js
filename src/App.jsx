import Demo from './pages/Demo';
import Home from './pages/home';
import { BrowserRouter as Router, Routes, Route } from 'react-router'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/demo" element={<Demo />} />
      </Routes>
    </Router>
  );
}

export default App;
