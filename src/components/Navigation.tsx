
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="fixed right-12 top-1/2 -translate-y-1/2 flex flex-col items-end space-y-6">
      <Link to="/" className="nav-link">Home</Link>
      <Link to="/pontos" className="nav-link">Pontos</Link>
      <Link to="/historia" className="nav-link">História</Link>
    </nav>
  );
};

export default Navigation;
