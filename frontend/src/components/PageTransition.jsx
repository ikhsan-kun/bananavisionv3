import { useLocation } from "react-router-dom";

/**
 * PageTransition wraps page content with an animated entrance
 * whenever the route changes. Uses location.pathname as key so
 * React remounts (and re-animates) the wrapper on each navigation.
 */
export default function PageTransition({ children }) {
  const location = useLocation();

  return (
    <div key={location.pathname} className="page-enter">
      {children}
    </div>
  );
}
