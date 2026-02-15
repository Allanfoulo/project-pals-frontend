import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Layers, Zap, Shield, Globe } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white overflow-hidden relative">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Nav */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-8 max-w-7xl mx-auto animate-fade-in">
        <div className="flex items-center space-x-2 group cursor-pointer">
          <div className="bg-primary/20 p-2 rounded-xl group-hover:scale-110 transition-transform">
            <Layers className="h-6 w-6 text-primary" />
          </div>
          <span className="text-2xl font-bold tracking-tight">ProjectPals</span>
        </div>
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-400">
          <a href="#" className="hover:text-white transition-colors">Features</a>
          <a href="#" className="hover:text-white transition-colors">Solutions</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
          <a href="#" className="hover:text-white transition-colors">About</a>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/auth/login" className="text-sm font-medium hover:text-primary transition-colors">Sign In</Link>
          <Link to="/auth/signup">
            <Button className="rounded-full px-6 bg-white text-black hover:bg-gray-200">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 grid lg:grid-cols-2 gap-12 items-center">
        <div className="animate-slide-in">
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs font-medium text-primary mb-8 animate-float">
            <Zap className="h-3 w-3 fill-primary" />
            <span>Next-gen project management</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-tight mb-8">
            Manage projects with <span className="bg-gradient-to-r from-primary via-blue-400 to-cyan-400 bg-clip-text text-transparent">precision.</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-xl">
            The all-in-one workspace for modern teams. Streamline your workflow, collaborate in real-time, and ship faster than ever.
          </p>
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/auth/signup" className="w-full sm:w-auto">
              <Button size="lg" className="w-full rounded-2xl px-8 h-14 text-lg font-semibold group shadow-xl shadow-primary/20">
                Start building
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/auth/login" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full rounded-2xl px-8 h-14 text-lg font-semibold border-white/10 hover:bg-white/5">
                View demo
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex items-center space-x-6 text-gray-500">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm">No credit card</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm">Unlimited collaborators</span>
            </div>
          </div>
        </div>

        <div className="relative animate-scale-in">
          <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
          <div className="relative bg-[#16161a]/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 shadow-2xl">
            {/* Mock UI */}
            <div className="bg-[#0a0a0c] rounded-2xl overflow-hidden border border-white/5">
              <div className="flex items-center px-4 py-3 border-b border-white/5 bg-white/5">
                <div className="flex space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                </div>
                <div className="mx-auto text-[10px] text-gray-500 font-mono tracking-widest">PROJECT_DASHBOARD_V2</div>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 bg-white/5 rounded-xl border border-white/5 animate-pulse" />
                  <div className="h-24 bg-white/5 rounded-xl border border-white/5 animate-pulse" style={{ animationDelay: '0.2s' }} />
                </div>
                <div className="space-y-3">
                  <div className="h-4 w-1/3 bg-white/10 rounded-full" />
                  <div className="h-32 bg-white/5 rounded-xl border border-white/5" />
                </div>
              </div>
            </div>
          </div>

          {/* Floating cards */}
          <div className="absolute -top-6 -right-6 bg-primary p-4 rounded-2xl shadow-xl shadow-primary/30 animate-float">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-blue-600 p-4 rounded-2xl shadow-xl shadow-blue-600/30 animate-float" style={{ animationDelay: '1.5s' }}>
            <Globe className="h-6 w-6 text-white" />
          </div>
        </div>
      </main>

      {/* Features strip */}
      <section className="relative z-10 border-y border-white/5 bg-white/[0.02] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Secure by default</h3>
              <p className="text-gray-400">Enterprise-grade security and RLS policies protect your sensitive project data.</p>
            </div>
            <div className="space-y-4">
              <div className="bg-blue-600/10 w-12 h-12 rounded-xl flex items-center justify-center">
                <Zap className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold">Blazing fast</h3>
              <p className="text-gray-400">Built with Vite and React for near-instant interactions and real-time updates.</p>
            </div>
            <div className="space-y-4">
              <div className="bg-cyan-600/10 w-12 h-12 rounded-xl flex items-center justify-center">
                <Globe className="h-6 w-6 text-cyan-500" />
              </div>
              <h3 className="text-xl font-bold">Collaborative</h3>
              <p className="text-gray-400">Bring your entire team together in a unified workspace designed for productivity.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
