// Simple preview without external dependencies
export default function Preview() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-slate-100">
      <main className="flex min-h-screen items-center justify-center px-8">
        <div className="max-w-4xl text-center">
          <div className="mb-16">
            <h1 className="text-8xl md:text-9xl font-extralight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 mb-8">
              Attom
            </h1>
            <p className="text-2xl md:text-3xl text-slate-300 font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
              Automated Website Creation System
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto mb-16">
            <a
              href="https://github.com/josmito93-debug/attom"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/30 hover:border-purple-500/30
                       p-12 transition-all duration-500 hover:bg-gradient-to-br hover:from-purple-900/20 hover:to-slate-800/50 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 rounded-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              <div className="relative text-5xl mb-6 group-hover:scale-110 transition-transform duration-500">
                ⚙️
              </div>
              <h2 className="text-2xl font-light text-slate-100 mb-3 tracking-tight group-hover:text-purple-200 transition-colors">
                View Source Code
              </h2>
              <p className="text-slate-400 font-light tracking-wide text-sm group-hover:text-slate-300 transition-colors">
                GitHub Repository
              </p>
            </a>

            <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/30
                     p-12 transition-all duration-500 rounded-2xl">
              <div className="relative text-5xl mb-6">
                🎨
              </div>
              <h2 className="text-2xl font-light text-slate-100 mb-3 tracking-tight">
                Figma Integration
              </h2>
              <p className="text-slate-400 font-light tracking-wide text-sm">
                Design System Extraction
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-center gap-2 text-slate-500 text-sm font-light tracking-wide">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                Powered by AI
              </span>
              <span className="text-slate-600">•</span>
              <span>OpenAI</span>
              <span className="text-slate-600">•</span>
              <span>GitHub</span>
              <span className="text-slate-600">•</span>
              <span>Figma</span>
            </div>
            <p className="text-slate-600 text-xs font-light tracking-wider uppercase">
              © 2024 Universa Agency
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}