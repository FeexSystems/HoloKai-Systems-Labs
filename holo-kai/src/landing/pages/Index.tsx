import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  ArrowRight,
  ChevronRight,
  Hexagon,
  Zap,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import { HoloKaiLogo } from "@landing/components/HoloKaiLogo";
import { UnitModal } from "@landing/components/UnitModal";
import { MeetTheVanguard } from "@landing/components/MeetTheVanguard";
import { AnatomySection } from "@landing/components/sections/AnatomySection";
import { IntelligenceSection } from "@landing/components/sections/IntelligenceSection";
import { VisionSection } from "@landing/components/sections/VisionSection";
import { UnitLabViewer } from "@landing/components/lab";
import { units, type Unit } from "@landing/data/units";
import { Hero3DStage } from "@landing/components/Hero3DStage";
import { HolographicIconBar } from "@landing/components/HolographicIconBar";
import { CivilizationPulseChart } from "@landing/components/CivilizationPulseChart";
import { AgentSquadWidget } from "@landing/components/AgentSquadWidget";
import { EpistemicMatrixSection } from "@landing/components/sections/EpistemicMatrixSection";
import { LanguageScriptSelector } from "@landing/components/LanguageScriptSelector";

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    let frame = 0;
    let particles: { x: number; y: number; dx: number; dy: number; size: number }[] = [];
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from(
        { length: Math.min(100, Math.floor((canvas.width * canvas.height) / 16000)) },
        () => ({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          dx: (Math.random() - 0.5) * 0.25,
          dy: (Math.random() - 0.5) * 0.25,
          size: Math.random() * 1.8 + 0.4,
        }),
      );
    };
    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle, index) => {
        particle.x += particle.dx;
        particle.y += particle.dy;
        if (particle.x < 0 || particle.x > canvas.width) particle.dx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.dy *= -1;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fillStyle = "rgba(245, 158, 11, 0.45)";
        context.fill();
        particles.slice(index + 1).forEach((other) => {
          const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
          if (distance < 150) {
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(other.x, other.y);
            context.strokeStyle = `rgba(245, 158, 11, ${0.11 * (1 - distance / 150)})`;
            context.lineWidth = 0.6;
            context.stroke();
          }
        });
      });
      frame = requestAnimationFrame(draw);
    };
    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 opacity-75"
    />
  );
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function Index() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [labUnit, setLabUnit] = useState<Unit | null>(null);

  const closeModal = useCallback(() => setSelectedUnit(null), []);
  const openUnit = useCallback((unit: Unit) => setSelectedUnit(unit), []);
  const closeLab = useCallback(() => setLabUnit(null), []);
  const openLab = useCallback((unit: Unit) => {
    setSelectedUnit(null);
    setLabUnit(unit);
  }, []);
  const openLabDefault = useCallback(() => {
    setSelectedUnit(null);
    setLabUnit(units[0] ?? null);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1150);
    const onScroll = () => setScrolled(window.scrollY > 30);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        e.preventDefault();
        navigate("/landing-admin");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [navigate]);

  return (
    <main className="landing-theme min-h-screen overflow-x-hidden bg-[#020202] text-zinc-100 selection:bg-amber-500 selection:text-black">
      <ParticleField />
      <div className="motif fixed inset-0 z-0 pointer-events-none" />
      <div className="film-grain fixed inset-0 z-[70] pointer-events-none" />

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55 }}
            className="fixed inset-0 z-[100] grid place-items-center bg-[#020202]"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "linear" }}
                className="relative mx-auto mb-7 h-16 w-16"
              >
                <HoloKaiLogo
                  variant="icon"
                  className="h-16 w-16 rounded-sm border border-amber-500/35 object-cover object-top shadow-[0_0_28px_rgba(245,158,11,0.35)]"
                />
              </motion.div>
              <p className="border-r-2 border-amber-500 pr-3 font-mono text-[10px] tracking-[0.35em] text-amber-400 sm:text-xs">
                INITIALIZING CIVILIZATION CORE
              </p>
              <div className="mt-5 h-px w-72 overflow-hidden bg-zinc-800">
                <motion.div
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
                  className="h-full w-1/2 bg-gradient-to-r from-transparent via-amber-400 to-transparent"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-white/5 bg-[#020202]/90 py-2.5 backdrop-blur-2xl"
            : "py-4 sm:py-6"
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 sm:px-6">
          <button
            type="button"
            onClick={() => scrollToSection("top")}
            className="flex items-center shrink-0"
            aria-label="Go to top"
          >
            <HoloKaiLogo
              variant="horizontal"
              className="h-8 w-auto max-w-[150px] sm:h-9 sm:max-w-[200px]"
            />
          </button>
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary navigation">
            {["Vision", "Vanguard", "Anatomy", "Collective", "Intelligence"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-400 transition hover:text-amber-400"
              >
                {item}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => navigate("/oracle-portal")}
              className="flex items-center gap-1.5 border border-amber-500/50 bg-amber-500/25 px-3 py-1.5 sm:px-4 sm:py-2 text-[9px] sm:text-[10px] font-bold tracking-[0.14em] sm:tracking-[0.18em] text-amber-300 transition hover:bg-amber-500/40"
            >
              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-400 shrink-0" />
              <span className="whitespace-nowrap">ORACLE PORTAL</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/core")}
              className="hidden items-center gap-2 border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-[10px] font-bold tracking-[0.18em] text-amber-50 transition hover:bg-amber-500/20 md:flex"
            >
              <Zap className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span className="whitespace-nowrap">ENTER ALKEBULAN</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-center p-2 text-zinc-300 hover:text-amber-400 lg:hidden border border-amber-500/20 bg-zinc-950/80 rounded-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5 text-amber-400" /> : <Menu className="h-5 w-5 text-amber-400" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-b border-amber-500/20 bg-[#020202]/98 px-6 py-5 backdrop-blur-2xl lg:hidden shadow-2xl overflow-hidden"
            >
              <div className="flex flex-col gap-3.5">
                {["Vision", "Vanguard", "Anatomy", "Collective", "Intelligence"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      scrollToSection(item.toLowerCase());
                      setMobileMenuOpen(false);
                    }}
                    className="text-left text-xs font-bold uppercase tracking-[0.24em] text-zinc-300 hover:text-amber-400 py-1 border-b border-white/5"
                  >
                    {item}
                  </button>
                ))}
                <div className="mt-2 pt-2 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigate("/core");
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 border border-amber-500/40 bg-amber-500/15 py-2.5 text-xs font-bold tracking-[0.18em] text-amber-200"
                  >
                    <Zap className="h-4 w-4 text-amber-400" />
                    ENTER ALKEBULAN CORE
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero */}
      <section id="top" className="relative z-10 flex min-h-screen items-center overflow-hidden pt-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_42%,rgba(180,83,9,0.20),transparent_24%),radial-gradient(circle_at_50%_20%,rgba(120,53,15,0.18),transparent_35%),linear-gradient(to_bottom,#020202_0%,rgba(2,2,2,0.72)_45%,#020202_100%)]" />
        <div className="mx-auto grid w-full max-w-[1600px] items-center gap-12 px-6 py-20 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="relative lg:col-span-7"
          >
            <div className="mb-8 inline-flex items-center gap-3 border border-amber-500/25 bg-amber-900/10 px-4 py-2 text-[9px] font-bold tracking-[0.3em] text-amber-300 sm:text-[10px]">
              <Activity className="h-4 w-4" /> FEEXSYSTEMS LABORATORY GENESIS · 2026
            </div>
            <h1 className="max-w-5xl font-display text-4xl sm:text-6xl md:text-8xl lg:text-[7.2rem] font-light leading-[0.88] tracking-[-0.045em] text-white break-words">
              Where Civilization
              <br />
              <span className="bg-gradient-to-r from-amber-100 via-amber-400 to-amber-700 bg-clip-text font-bold italic text-transparent">
                Remembers.
              </span>
            </h1>
            <p className="mt-6 sm:mt-8 max-w-2xl text-sm sm:text-base md:text-xl font-light leading-relaxed text-zinc-400">
              <strong className="font-normal text-zinc-100">HoloKai</strong> is
              Africa&apos;s civilization intelligence platform. Eight ultra-realistic
              humanoid incarnations. One unified consciousness preserving ancestry,
              knowledge, and futures with mathematical and cultural precision.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => scrollToSection("vanguard")}
                className="group flex items-center justify-center gap-3 bg-amber-500 px-6 sm:px-8 py-3.5 sm:py-4 text-xs font-bold tracking-[0.22em] text-black transition hover:bg-amber-300 w-full sm:w-auto"
              >
                WITNESS THE VANGUARD
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                onClick={() => navigate("/lab-spline")}
                className="border border-white/25 px-6 sm:px-8 py-3.5 sm:py-4 text-xs tracking-[0.2em] text-white transition hover:bg-white/5 w-full sm:w-auto text-center"
              >
                ENTER 3D LAB
              </button>
              <button
                type="button"
                onClick={() => navigate("/core")}
                className="border border-amber-500/40 bg-amber-500/10 px-6 sm:px-8 py-3.5 sm:py-4 text-xs tracking-[0.2em] text-amber-200 transition hover:bg-amber-500/20 w-full sm:w-auto text-center"
              >
                CIVILIZATION CORE
              </button>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 border-t border-white/10 pt-6">
              {[
                ["08", "Humanoid units"],
                ["4.29M", "Knowledge nodes"],
                ["2000+", "Languages"],
              ].map(([v, l]) => (
                <div key={l}>
                  <p className="font-display text-2xl text-amber-400">{v}</p>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-600">{l}</p>
                </div>
              ))}
            </div>
          </motion.div>
          {/* Right key-art showcase — hidden on mobile, visible on desktop lg: flex */}
          <div className="hidden lg:col-span-5 lg:flex relative min-h-[420px] xl:min-h-[480px] items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.6 }}
              className="relative w-full h-full flex items-center justify-center"
            >
              <div className="absolute aspect-[1280/698] w-[min(100%,560px)] scale-125 rounded-[50%] border border-dashed border-white/10 animate-[spin_60s_linear_infinite] xl:w-[640px]" />
              <div className="absolute aspect-[1280/698] w-[min(100%,440px)] scale-110 rounded-[50%] border border-dotted border-amber-500/25 animate-[spin_35s_linear_infinite_reverse] xl:w-[520px]" />
              <div className="scanline relative aspect-[1280/698] w-[min(100%,520px)] overflow-hidden border border-amber-500/30 bg-zinc-950/70 shadow-[0_0_80px_rgba(245,158,11,0.18)] backdrop-blur-xl xl:w-[600px]">
                <div className="pointer-events-none absolute inset-3 z-10 border border-amber-500/15 sm:inset-4" />
                <img
                  src="/images/vanguard/oluwa-core-fullbody.png"
                  alt="Oluwa-Core — HoloKai Vanguard humanoid key art"
                  className="absolute inset-0 h-full w-full object-contain object-bottom"
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#020202]/80 via-transparent to-[#020202]/20" />
                <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center sm:bottom-4">
                  <HoloKaiLogo
                    variant="vertical"
                    className="h-16 w-auto opacity-90 xl:h-20"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => scrollToSection("vanguard")}
          className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[9px] font-bold tracking-[0.3em] text-amber-400/70 md:flex"
        >
          DESCEND INTO MEMORY
          <span className="h-12 w-px bg-gradient-to-b from-amber-400 to-transparent" />
        </button>
      </section>

      {/* 3D Constellation & Feature Showcase Container */}
      <section className="relative z-10 mx-auto max-w-[1600px] px-6 py-12 space-y-10">
        <Hero3DStage />
        <HolographicIconBar />
        <CivilizationPulseChart />
        <AgentSquadWidget />
        <EpistemicMatrixSection />
        <LanguageScriptSelector />
      </section>

      {/* Vanguard */}
      <section id="vanguard" className="relative z-10 border-y border-white/10 bg-[#020202] py-24 md:py-32">
        <div className="mx-auto max-w-[1600px] px-6">
          <p className="mb-4 text-xs font-bold tracking-[0.35em] text-amber-500">
            THE VANGUARD / 08 HUMANOID UNITS
          </p>
          <h2 className="font-display text-6xl font-light tracking-tight sm:text-7xl">
            The <span className="font-bold italic text-amber-500">Humanoids Vanguard.</span>
          </h2>
          <p className="mt-5 max-w-lg text-sm uppercase leading-6 tracking-[0.16em] text-zinc-500">
            Eight unique chassis prototypes. Eight masters of memory forged in the
            FexSystems Laboratory. Open any unit for dossier + ultra 3D lab.
          </p>
        </div>
        <div className="scrollbar-none mt-14 flex gap-6 overflow-x-auto px-6 pb-4 md:px-[max(1.5rem,calc((100vw-1600px)/2+1.5rem))]">
          {units.map((unit) => (
            <button
              key={unit.id}
              type="button"
              onClick={() => openUnit(unit)}
              className="group relative h-[530px] w-[82vw] flex-none overflow-hidden border border-amber-900/40 text-left sm:w-[440px]"
            >
              <img
                src={unit.fullbodyImage}
                alt={unit.name}
                className="absolute inset-0 h-full w-full object-cover object-top transition duration-700 group-hover:scale-105"
                style={{ mixBlendMode: 'screen' }}
                loading="lazy"
              />
              <div className="relative flex h-full flex-col justify-between p-7">
                <div className="flex items-start justify-between">
                  <span className="font-display text-5xl font-bold text-amber-500/65">
                    {unit.id}
                  </span>
                  <span className="mt-2 h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_15px_#f59e0b]" />
                </div>
                <div>
                  <h3 className="font-display text-4xl font-bold">{unit.name}</h3>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.28em] text-amber-500">
                    {unit.role}
                  </p>
                  <p className="mt-5 max-w-sm text-sm leading-relaxed text-zinc-300">
                    {unit.description}
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-[10px] tracking-[0.2em] text-amber-300">
                    EXPLORE UNIT <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Vanguard → Core CTA */}
        <div className="mt-12 flex justify-center px-6">
          <button
            type="button"
            onClick={() => { window.location.href = import.meta.env.VITE_CORE_URL || "http://localhost:5000"; }}
            className="group flex items-center gap-3 border border-amber-500/40 bg-amber-500/10 px-10 py-4 text-xs font-bold tracking-[0.22em] text-amber-200 transition hover:bg-amber-500 hover:text-black"
          >
            <Zap className="h-4 w-4 transition-colors group-hover:text-black" />
            ENTER ALKEBULAN — CIVILIZATION CORE
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      <AnatomySection
        onOpenLab={openLabDefault}
        onMeetCollective={() => scrollToSection("collective")}
      />

      <MeetTheVanguard />

      <VisionSection
        onExploreVanguard={() => scrollToSection("vanguard")}
        onExploreIntelligence={() => scrollToSection("intelligence")}
      />

      <IntelligenceSection
        onAccessCore={() => scrollToSection("intelligence")}
        onOpenUnitFeed={openLabDefault}
      />

      <footer className="relative z-10 border-t border-white/10 bg-black px-6 py-12">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-8 text-center sm:flex-row sm:text-left">
          <HoloKaiLogo variant="vertical" className="h-28 w-auto sm:h-32" />
          <div className="flex flex-col items-center gap-2 sm:items-end">
            <p className="max-w-md text-[10px] leading-relaxed tracking-[0.18em] text-zinc-600">
              WHERE CIVILIZATION REMEMBERS · FEEXSYSTEMS LABORATORY NODE · FULL-BODY ORBITAL LAB
            </p>
            <button
              type="button"
              onClick={() => navigate("/landing-admin")}
              className="text-[8px] tracking-[0.3em] text-zinc-700 transition hover:text-amber-500/50"
            >
              [ ADMIN ]
            </button>
          </div>
        </div>
      </footer>

      <AnimatePresence mode="wait">
        {selectedUnit && !labUnit ? (
          <UnitModal
            key={selectedUnit.id}
            unit={selectedUnit}
            onClose={closeModal}
            onOpenLab={openLab}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {labUnit ? (
          <UnitLabViewer
            key={`lab-${labUnit.id}`}
            unit={labUnit}
            onClose={closeLab}
            onChangeUnit={setLabUnit}
            onReturnToLanding={() => {
              closeLab();
              scrollToSection('top');
            }}
            onEnterAlkebulan={() => {
              window.location.href = import.meta.env.VITE_CORE_URL || "http://localhost:5000";
            }}
          />
        ) : null}
      </AnimatePresence>
    </main>
  );
}
