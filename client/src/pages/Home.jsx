import { Link } from 'react-router-dom';

function Home() {
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
            <a href="#about" onClick={(e) => { e.preventDefault(); const element = document.getElementById('about'); if(element) { element.scrollIntoView({ behavior: 'smooth' }); } }} className="text-text-secondary hover:text-primary font-medium transition-colors">About Us</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden md:block text-primary font-semibold hover:text-secondary transition-colors">
              Log In
            </Link>
            <Link to="/register" className="btn btn-primary py-2 px-6 text-sm">
              Register Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl opacity-40 pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up">
            <div className="inline-block px-4 py-2 mb-6 rounded-full bg-blue-50 text-primary font-semibold text-sm tracking-wide border border-blue-100">
              🎓 Official Conference Portal
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-text-primary">
              Advancing Knowledge at <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Grand University</span>
            </h1>
            <p className="text-lg md:text-xl text-text-secondary mb-10 leading-relaxed max-w-lg">
              Join leading researchers, scholars, and students in our annual academic gatherings. 
              Explore upcoming conferences, submit your papers, and be part of the innovation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#conferences" className="btn btn-primary text-lg px-8 py-4 shadow-lg shadow-blue-500/30">
                View Upcoming Events
              </a>
              <Link to="/about" className="btn btn-secondary text-lg px-8 py-4 bg-white hover:bg-gray-50">
                Learn More
              </Link>
            </div>
          </div>
          
          <div className="relative animate-float lg:pl-10">
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                 {/* Placeholder for University Image */}
                 <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-4xl">🏛️</div>
              </div>
              <div className="p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Next Major Event</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-bold">Open for Registration</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">International Science Summit 2026</h3>
                    <p className="text-gray-500 text-sm">August 15-18, 2026 • Main Campus Auditorium</p>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">Artificial Intelligence</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">Robotics</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">Ethics</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative elements behind the card */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary to-secondary opacity-10 blur-xl -z-10 rounded-3xl"></div>
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

function ConferenceCard({ date, title, dept, status }) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <span className="text-sm font-bold text-primary bg-blue-50 px-3 py-1 rounded-full">{date}</span>
        <span className={`text-xs font-semibold px-2 py-1 rounded ${
          status === 'Registration Open' ? 'bg-green-100 text-green-700' : 
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
