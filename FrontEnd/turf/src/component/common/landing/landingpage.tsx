import { FiArrowRight, FiChevronDown }  from "react-icons/fi";
import { useNavigate }                  from "react-router-dom";
import { LandingService }               from "../../../services/service/common/landingservice";
import logo                             from "../../../assets/turf_logo.png";
import "./landingpage.css";

const LandingPage = () => {
  const { getSports, getSteps } = LandingService();
  const sports = getSports();
  const steps = getSteps();
  const navigate = useNavigate();

  return (
    <main className="landing-page">
      <header className="landing-header">
        <div className="landing-brand">
          <img src={logo} alt="Field Go logo" className="landing-brand-logo" />
          <span>FIELD GO</span>
        </div>

        <nav className="landing-navigation">
          <a href="#sports">Sports</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#about">About</a>
        </nav>

        <div className="landing-actions">
          <button className="landing-login-button" onClick={() => navigate("/login")}>Login</button>
          <button className="landing-signup-button" onClick={() => navigate("/signup")}>Sign Up</button>
        </div>
      </header>

      <section className="landing-hero">
        <div className="landing-hero-overlay"></div>
        <div className="landing-grain"></div>

        <div className="landing-hero-content">
          <div className="landing-hero-logo">
            <span>FIELD GO</span>
          </div>

          <h1>
            YOUR GAME
            <br />
            YOUR GROUND
          </h1>

          <p className="landing-hero-description">
            Find your perfect turf, book your slot, and get ready to play.
            Your next game starts here.
          </p>

          <div className="landing-hero-actions">
            <button className="landing-primary-button">
              {/* onClick={() => navigate("/exploreturfs")} */}
              Explore Turfs
              <FiArrowRight />
            </button>
          </div>
        </div>

        <div className="landing-scroll-indicator">
          <span>SCROLL TO EXPLORE</span>
          <FiChevronDown />
        </div>
      </section>

      <section id="sports" className="landing-section landing-sports-section">
        <div className="landing-container">
          <div className="landing-section-heading">
            <span className="landing-kicker">PICK YOUR GAME</span>
            <h2>
              ONE APP.
              <br />
              EVERY SPORT YOU PLAY.
            </h2>
            <p>
              Grounds and courts across formats — jump straight to the one
              your squad's playing this week.
            </p>
          </div>

          <div className="landing-sports-grid">
            {sports.map((sport) => (
              <div className="landing-sport-card" key={sport.id}>
                <div className="landing-sport-icon">{sport.icon}</div>
                <h3>{sport.name}</h3>
                <span>{sport.count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="landing-section landing-how-section">
        <div className="landing-container">
          <div className="landing-section-heading">
            <span className="landing-kicker">HOW IT WORKS</span>
            <h2>
              KICKOFF IN
              <br />
              THREE STEPS.
            </h2>
          </div>

          <div className="landing-steps-grid">
            {steps.map((step) => (
              <div className="landing-step-card" key={step.id}>
                <span className="landing-step-number">{step.step}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="landing-section landing-cta-section">
        <div className="landing-container">
          <div className="landing-cta-card">
            <span className="landing-kicker">READY TO PLAY?</span>
            <h2>
              YOUR HOME GROUND
              <br />
              IS WAITING.
            </h2>
            <p>
              Join players booking premium turfs on Field Go.
              Create your account and reserve your first slot today.
            </p>
            <button className="landing-primary-button" onClick={() => navigate("/signup")}>
              Create Free Account
              <FiArrowRight />
            </button>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-brand">
          <img src={logo} alt="Field Go logo" className="landing-brand-logo" />
          <span>FIELD GO</span>
        </div>

        <p>© 2026 Field Go. Made for players, by players.</p>
      </footer>
    </main>
  );
};

export default LandingPage;