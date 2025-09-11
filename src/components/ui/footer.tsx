import { Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';

export function Footer() {
  const footerLinks = {
    Product: ['Features', 'Pricing', 'Documentation', 'API'],
    Company: ['About', 'Blog', 'Careers', 'Contact'],
    Resources: ['Help Center', 'Community', 'Tutorials', 'Status'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Security', 'Compliance']
  };

  return (
    <footer className="py-16 px-4 sm:px-6 lg:px-8 border-t border-cyan-500/20 bg-black/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                FinanceAI
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">
              Transforming financial data into actionable insights with the power of artificial intelligence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a 
                      href="#" 
                      className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center text-gray-400 text-sm mb-4 md:mb-0">
            <span>© 2024 FinanceAI. Made with</span>
            <Heart className="mx-1 text-red-400" size={14} />
            <span>for financial innovation.</span>
          </div>
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <span>🔒 SOC 2 Compliant</span>
            <span>🛡️ GDPR Ready</span>
            <span>⚡ 99.9% Uptime</span>
          </div>
        </div>
      </div>
    </footer>
  );
}