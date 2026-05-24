// src/pages/Login/index.js
import { html } from '../../shared/lib/html.js';
const React = window.React;

export const LoginPage = ({ setCurrentPage, setCurrentUser }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setIsLoading(true);
    
    // Simulate luxury authentication network latency
    setTimeout(() => {
      setIsLoading(false);
      
      if (email === 'admin@mahathi.com' && password === 'admin123') {
        setCurrentUser({ name: 'Santhosh Kumar', email: 'admin@mahathi.com', role: 'admin' });
        setCurrentPage('admin');
        window.scrollTo(0, 0);
      } else if (email === 'priya@gmail.com') {
        setCurrentUser({ name: 'Priya Dharshini', email: 'priya@gmail.com', role: 'customer' });
        setCurrentPage('home');
        window.scrollTo(0, 0);
      } else {
        // Fallback user creation
        setCurrentUser({ name: email.split('@')[0], email, role: 'customer' });
        setCurrentPage('home');
        window.scrollTo(0, 0);
      }
    }, 1000);
  };

  const bypassAdmin = () => {
    setEmail('admin@mahathi.com');
    setPassword('admin123');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentUser({ name: 'Santhosh Kumar', email: 'admin@mahathi.com', role: 'admin' });
      setCurrentPage('admin');
      window.scrollTo(0, 0);
    }, 800);
  };

  const bypassClient = () => {
    setEmail('priya@gmail.com');
    setPassword('priya123');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentUser({ name: 'Priya Dharshini', email: 'priya@gmail.com', role: 'customer' });
      setCurrentPage('home');
      window.scrollTo(0, 0);
    }, 800);
  };

  return html`
    <section className="py-24 bg-cream/10 min-h-screen pt-[120px] flex items-center justify-center animate-fade-in">
      <div className="max-w-md w-full px-4">
        
        <div className="bg-white rounded-3xl p-8 border border-maroon/5 shadow-luxury space-y-8 relative overflow-hidden">
          
          <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-gold via-maroon to-gold"></div>

          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center font-playfair font-bold text-gold mx-auto text-xl">M</div>
            <h2 className="font-playfair text-2xl font-bold text-maroon">Studio Login</h2>
            <p className="font-poppins text-xs text-maroon/60">Access your measurement files or dashboard</p>
          </div>

          <form onSubmit=${handleLogin} className="space-y-4">
            
            {error && html`
              <p className="bg-red-50 border border-red-200 text-red-700 text-xs font-poppins p-3 rounded-lg text-center animate-pulse">
                ${error}
              </p>
            `}

            <div>
              <label className="block font-poppins text-[10px] uppercase tracking-widest text-maroon font-semibold mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value=${email}
                onChange=${(e) => setEmail(e.target.value)}
                className="w-full bg-cream/30 border border-maroon/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-gold"
                required
              />
            </div>

            <div>
              <label className="block font-poppins text-[10px] uppercase tracking-widest text-maroon font-semibold mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value=${password}
                onChange=${(e) => setPassword(e.target.value)}
                className="w-full bg-cream/30 border border-maroon/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-gold"
                required
              />
            </div>

            <button
              type="submit"
              disabled=${isLoading}
              className="w-full font-poppins text-xs uppercase tracking-widest font-bold bg-maroon hover:bg-gold text-gold hover:text-maroon py-4 rounded-full border border-maroon hover:border-gold transition-all duration-300 disabled:opacity-50"
            >
              ${isLoading ? 'Authenticating...' : 'Sign In'}
            </button>

          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-maroon/5"></div>
            <span className="flex-shrink mx-4 font-poppins text-[10px] uppercase tracking-wider text-maroon/40 font-bold">Quick Bypass</span>
            <div className="flex-grow border-t border-maroon/5"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            
            <button 
              onClick=${bypassAdmin}
              disabled=${isLoading}
              className="font-poppins text-[10px] uppercase tracking-widest font-bold bg-gold/15 text-gold-dark hover:bg-gold hover:text-maroon px-4 py-3.5 rounded-full border border-gold/30 transition-all duration-300 text-center"
            >
              Owner Portal
            </button>

            <button 
              onClick=${bypassClient}
              disabled=${isLoading}
              className="font-poppins text-[10px] uppercase tracking-widest font-bold bg-maroon-soft text-maroon hover:bg-maroon hover:text-gold px-4 py-3.5 rounded-full border border-maroon/15 transition-all duration-300 text-center"
            >
              Client File
            </button>

          </div>

        </div>

      </div>
    </section>
  `;
};
export default LoginPage;

