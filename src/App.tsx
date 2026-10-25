import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';

/**
 * The portfolio is a single scrolling page; Index composes the sections.
 * The dashboard pages were removed when the project became a portfolio, so
 * their routes and the Layout wrapper they needed are gone too.
 */
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
