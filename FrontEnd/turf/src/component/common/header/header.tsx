import logo from "../../../assets/turf_logo.png";

const Header = () => {
  return (
    <div className="app-logo">
    <img src={logo} alt="logo" />

    <div className="logo-text">
        <h3>Field-Go</h3>
        <span>Turf Management</span>
    </div>
    </div>
  );
};

export default Header;