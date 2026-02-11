const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="flex h-screen w-full bg-white overflow-hidden pt-16">
      {/* Left Panel - Professional/Dark */}
      <div className="hidden lg:flex w-2/5 flex-col justify-between bg-zinc-900 p-12 text-white relative overflow-hidden">
        {/* Abstract Architectural Lines */}
        <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(to right, #333 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
        }}></div>
        
        <div className="relative z-10">
           <h1 className="text-2xl font-semibold tracking-wide uppercase text-blue-500">UniversityConf</h1>
        </div>

        <div className="relative z-10 max-w-md">
           <h2 className="text-5xl font-light leading-tight mb-6" dangerouslySetInnerHTML={{ __html: title }} />
           <p className="text-zinc-400 text-lg font-light leading-relaxed">
             {subtitle}
           </p>
        </div>

        <div className="relative z-10 text-xs text-zinc-600 uppercase tracking-widest">
           © 2026 Grand University System
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-3/5 flex flex-col justify-center items-center p-8 lg:p-16 h-full bg-white relative">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
