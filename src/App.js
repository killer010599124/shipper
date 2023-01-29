import * as React from "react";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";
import { fakeAuthProvider } from "./auth";
import './App.css';
import ScanerPage from './pages/ScanerPage';
import AppBar from './pages/AppBar';
import Login from './pages/Login';
import AdminPage from './pages/AdminPage';
import ReportPage from './pages/ReportPage';
import PalletPage from "./pages/PalletPage";


export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route >
          <Route path="/" element={<RequireAuth>
            <AuthStatus />
            <div className="App">
              <ScanerPage />
            </div>
          </RequireAuth>} />
          <Route path="/pallet" element={<RequireAuth>
            <AuthStatus />
            <div className="App">
              <PalletPage />
            </div>
          </RequireAuth>} />
          <Route path="/admin" element={<RequireAuth>
            <AuthStatus />
            <div className="App">
              <AdminPage />
            </div>
          </RequireAuth>} />
          <Route path="/reporting" element={<RequireAuth>
            <AuthStatus />
            <div className="App">
              <ReportPage />
            </div>
          </RequireAuth>} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/protected"
            element={
              <RequireAuth>
                <ScanerPage />
              </RequireAuth>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
}


function Layout() {
  return (
    <div>
      <AuthStatus />

      <ul>
        <li>
          <Link to="/">Public Page</Link>
        </li>
        <li>
          <Link to="/protected">Protected Page</Link>
        </li>
      </ul>

      <Outlet />
    </div>
  );
}


let AuthContext = React.createContext();

function AuthProvider({ children }) {
  let [user, setUser] = React.useState(null);

  let signin = (newUser, callback) => {
    return fakeAuthProvider.signin(() => {
      setUser(newUser);
      callback();
    });
  };

  let signout = (callback) => {
    return fakeAuthProvider.signout(() => {
      setUser(null);
      callback();
    });
  };

  let value = { user, signin, signout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  return React.useContext(AuthContext);
}

function AuthStatus() {
  let auth = useAuth();
  let navigate = useNavigate();

  if (!auth.user) {
    return <Login />;
  }

  return (
    <div>
      <AppBar userName={auth.user} handleSignout={() => {auth.signout(() => navigate("/"));}} />
      
    </div>
  );
}

function RequireAuth({ children }) {
  let auth = useAuth();
  let location = useLocation();

  if (!auth.user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function LoginPage() {
  let navigate = useNavigate();
  let location = useLocation();
  let auth = useAuth();

  let from = location.state ?.from ?.pathname || "/";

  function handleSubmit(event) {
    event.preventDefault();

    let formData = new FormData(event.currentTarget);
    let username = formData.get("username");
    if(username.toLowerCase() === 'admin'){
      from = '/admin';
    }
    if(username.toLowerCase() === 'reporting'){
      from = '/reporting';
    }
    auth.signin(username, () => {
      // Send them back to the page they tried to visit when they were
      // redirected to the login page. Use { replace: true } so we don't create
      // another entry in the history stack for the login page.  This means that
      // when they get to the protected page and click the back button, they
      // won't end up back on the login page, which is also really nice for the
      // user experience.
      navigate(from, { replace: true });
    });
  }

  return (
    <Login handleSubmit={handleSubmit} />
  );
}

function PublicPage() {
  return <h3>Public</h3>;
}

function ProtectedPage() {
  return <h3>Protected</h3>;
}



function App1() {
  return (
    <div className="App">
      <ScanerPage />
    </div>
  );
}

//export default App;
