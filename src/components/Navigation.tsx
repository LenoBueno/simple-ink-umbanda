
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="fixed top-12 right-12">
      <ul className="flex space-x-12 items-center">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/pontos" className="nav-link">Pontos</Link>
        <Link to="/historia" className="nav-link">História</Link>
      </ul>
    </nav>
  );
};

export default Navigation;
