import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Home() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Set target date to August 15, 2026 (from the original card)
    const targetDate = new Date('2026-08-15T09:00:00');

    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  return (
    <>
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
              U
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              UniversityConf
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-text-secondary hover:text-primary font-medium transition-colors">Home</a>
            <a href="#conferences" className="text-text-secondary hover:text-primary font-medium transition-colors">Conferences</a>
            <a href="#about" onClick={(e) => { e.preventDefault(); const element = document.getElementById('about'); if (element) { element.scrollIntoView({ behavior: 'smooth' }); } }} className="text-text-secondary hover:text-primary font-medium transition-colors">About Us</a>
            {user?.role === 'Admin' && (
              <Link to="/admin" className="text-primary font-bold hover:text-secondary transition-colors">Dashboard</Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            {!user ? (
              <>
                <Link to="/login" className="hidden md:block text-primary font-semibold hover:text-secondary transition-colors">
                  Log In
                </Link>
                <Link to="/register" className="btn btn-primary py-2 px-6 text-sm">
                  Register Now
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-zinc-600">Hi, {user.username}</span>
                <button
                  onClick={() => { localStorage.clear(); window.location.reload(); }}
                  className="text-xs font-bold text-zinc-400 hover:text-red-500 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 lg:pt-32 lg:pb-20 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl opacity-40 pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <div className="animate-fade-in-up max-w-4xl mx-auto">
            <div className="inline-block px-4 py-2 mb-6 rounded-full bg-blue-50 text-primary font-semibold text-sm tracking-wide border border-blue-100 mx-auto">
              🎓 Official Conference Portal
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 text-text-primary">
              Advancing Knowledge at <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Grand University</span>
            </h1>
            <p className="text-base md:text-lg text-text-secondary mb-8 leading-relaxed max-w-2xl mx-auto">
              Join leading researchers, scholars, and students in our annual academic gatherings.
              Explore upcoming conferences, submit your papers, and be part of the innovation.
            </p>

            {/* Countdown Timer */}
            <div className="mb-8">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Next Major Event Starts In</p>
              <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                <TimeBox label="Days" value={timeLeft.days} />
                <TimeBox label="Hours" value={timeLeft.hours} />
                <TimeBox label="Minutes" value={timeLeft.minutes} />
                <TimeBox label="Seconds" value={timeLeft.seconds} />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#conferences" className="btn btn-primary text-lg px-10 py-4 shadow-xl shadow-blue-500/20">
                View Upcoming Events
              </a>
              <a href="#about" className="btn btn-secondary text-lg px-10 py-4 bg-white hover:bg-gray-50">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Highlight Section */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -ml-16 -mb-16"></div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-8 relative z-10">
              <div className="p-10 lg:p-12 lg:col-span-2 text-white">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Major Event</span>
                  <span className="bg-green-400/20 backdrop-blur-sm text-green-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-green-400/30">Registration Open</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">International Science Summit 2026</h2>
                <p className="text-blue-100 text-lg mb-8 max-w-xl">
                  Join us for the premier science event of the year. Featuring keynote speakers from around the globe, workshops, and networking opportunities.
                </p>
                <div className="flex flex-col md:flex-row gap-6 text-sm text-blue-50 mb-8">
                  <div className="flex items-center gap-2">
                    <span className="bg-white/10 p-2 rounded-lg">📅</span>
                    <span>August 15-18, 2026</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-white/10 p-2 rounded-lg">📍</span>
                    <span>Main Campus Auditorium</span>
                  </div>
                </div>
              </div>
              <div className="bg-black/10 backdrop-blur-sm p-10 lg:p-12 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-white/10">
                <h3 className="text-white font-bold text-lg mb-6">Topics Covered</h3>
                <div className="flex flex-wrap gap-2 mb-8">
                  <span className="px-3 py-1 rounded-md bg-white/10 text-white text-sm hover:bg-white/20 transition cursor-default">Artificial Intelligence</span>
                  <span className="px-3 py-1 rounded-md bg-white/10 text-white text-sm hover:bg-white/20 transition cursor-default">Robotics</span>
                  <span className="px-3 py-1 rounded-md bg-white/10 text-white text-sm hover:bg-white/20 transition cursor-default">Ethics</span>
                  <span className="px-3 py-1 rounded-md bg-white/10 text-white text-sm hover:bg-white/20 transition cursor-default">Biotech</span>
                </div>
                <button className="w-full py-3 bg-white text-primary font-bold rounded-xl hover:bg-blue-50 transition shadow-lg">
                  Register Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Highlights (Additional Content) */}
      <section className="py-20 bg-gray-50 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary mb-4">Why Attend?</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">Discover the benefits of participating in our academic conferences.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <HighlightCard
              icon="🎯"
              title="Call for Papers"
              description="Submit your research and get reviewed by top academics in your field."
            />
            <HighlightCard
              icon="🤝"
              title="Global Networking"
              description="Connect with peers, mentors, and industry leaders from around the world."
            />
            <HighlightCard
              icon="💡"
              title="Innovation Workshops"
              description="Participate in hands-on workshops to learn the latest technologies and methods."
            />
          </div>
        </div>
      </section>

      {/* Featured Conferences Section */}
      <section id="conferences" className="py-24 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-text-primary">
              Upcoming <span className="text-primary">Academic Events</span>
            </h2>
            <p className="text-text-secondary text-lg">
              Discover and participate in the diverse range of conferences hosted by our faculties.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ConferenceCard
              date="Oct 12, 2026"
              title="Annual Technology Symposium"
              dept="Dept. of Computer Science"
              status="Call for Papers"
            />
            <ConferenceCard
              date="Nov 05, 2026"
              title="Global Humanities Conference"
              dept="Dept. of Arts & Humanities"
              status="Registration Open"
            />
            <ConferenceCard
              date="Dec 10, 2026"
              title="Future of Medicine Summit"
              dept="School of Medicine"
              status="Coming Soon"
            />
          </div>

        </div>
      </section>


      {/* Footer */}
      <footer id="about" className="bg-bg-dark text-white pt-20 pb-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-gray-800 pb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg">
                  C
                </div>
                <span className="text-xl font-bold">AcademicConf</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Empowering academic communities to organize impactful events with ease and efficiency.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Product</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Testimonials</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Resources</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Community</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Company</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="text-center text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} AcademicConf Management System. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  )
}

function TimeBox({ label, value }) {
  return (
    <div className="flex flex-col items-center p-3 md:p-4 bg-white rounded-xl shadow-lg border border-gray-100 min-w-[70px] md:min-w-[100px] backdrop-blur-sm bg-white/90">
      <span className="text-2xl md:text-4xl font-bold text-primary mb-1 font-mono tracking-tighter">{String(value).padStart(2, '0')}</span>
      <span className="text-[10px] md:text-xs text-gray-500 uppercase font-bold tracking-widest">{label}</span>
    </div>
  )
}

function HighlightCard({ icon, title, description }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-2xl mb-6 text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-text-primary mb-3">{title}</h3>
      <p className="text-text-secondary leading-relaxed">{description}</p>
    </div>
  )
}

function ConferenceCard({ date, title, dept, status }) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <span className="text-sm font-bold text-primary bg-blue-50 px-3 py-1 rounded-full">{date}</span>
        <span className={`text-xs font-semibold px-2 py-1 rounded ${status === 'Registration Open' ? 'bg-green-100 text-green-700' :
            status === 'Call for Papers' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
          }`}>
          {status}
        </span>
      </div>
      <h3 className="text-xl font-bold mb-2 text-text-primary group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-text-secondary text-sm mb-4">{dept}</p>
      <div className="flex items-center text-primary font-semibold text-sm group-hover:underline">
        View Details <span>→</span>
      </div>
    </div>
  )
}

export default Home;
