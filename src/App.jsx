import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  X,
  ArrowUpRight,
  MapPin,
  Phone,
  Sparkles,
  Check,
  SlidersHorizontal,
  Zap,
  Sun,
  ShieldCheck,
  Send,
  Store,
  Truck,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Layers,
  MoveHorizontal,
} from 'lucide-react';

// ============================================================================
// CONSTANTES OFICIAIS — INOVARE ILUMINAÇÃO (SANTA INÊS - MA)
// ============================================================================
const WHATSAPP_NUMBER = '559881972518';
const PHONE_DISPLAY = '+55 98 8197-2518';
const INSTAGRAM_URL = 'https://www.instagram.com/inovareprojetados/';
const INSTAGRAM_HANDLE = '@inovareprojetados';
const ADDRESS_LINE = 'Rua São Benedito, Santa Inês - MA';
const CEP_LINE = 'CEP 6500300';
const MOVEIS_SITE_URL = 'https://john-herbeth-licar.github.io/a-inovare-projetados/';

// ============================================================================
// 1. REACT BITS: SCANNER BACKGROUND (Hero Atmospheric LED Beam Scanner)
// ============================================================================
const ScannerBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    const particles = Array.from({ length: 42 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.45 + 0.1,
    }));

    let scanX = 0;
    let direction = 1;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle architectural grid
      ctx.strokeStyle = 'rgba(212, 150, 59, 0.045)';
      ctx.lineWidth = 1;
      const gridSize = 48;
      for (let gx = 0; gx < width; gx += gridSize) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
        ctx.stroke();
      }
      for (let gy = 0; gy < height; gy += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
        ctx.stroke();
      }

      // Scanner sweep beam
      scanX += 1.65 * direction;
      if (scanX > width + 120) direction = -1;
      if (scanX < -120) direction = 1;

      const beamGradient = ctx.createLinearGradient(scanX - 140, 0, scanX + 140, 0);
      beamGradient.addColorStop(0, 'rgba(212, 150, 59, 0)');
      beamGradient.addColorStop(0.5, 'rgba(245, 184, 65, 0.14)');
      beamGradient.addColorStop(1, 'rgba(212, 150, 59, 0)');

      ctx.fillStyle = beamGradient;
      ctx.fillRect(scanX - 140, 0, 280, height);

      // Laser core line
      ctx.strokeStyle = 'rgba(245, 184, 65, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(scanX, 0);
      ctx.lineTo(scanX, height);
      ctx.stroke();

      // Illuminated dust nodes
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const dist = Math.abs(p.x - scanX);
        const boost = dist < 110 ? (1 - dist / 110) * 0.75 : 0;

        ctx.fillStyle = `rgba(245, 184, 65, ${Math.min(1, p.alpha + boost)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + boost * 1.3, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-85"
    />
  );
};

// ============================================================================
// 2. REACT BITS: BORDER GLOW (Mouse-reactive perimeter illumination)
// ============================================================================
const BorderGlow = ({ children, className = '' }) => {
  const cardRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setPos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-sm p-[1px] overflow-hidden bg-white/10 ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: pos.opacity,
          background: `radial-gradient(360px circle at ${pos.x}px ${pos.y}px, rgba(245, 184, 65, 0.75), rgba(212, 150, 59, 0.15) 45%, transparent 75%)`,
        }}
      />
      <div className="relative h-full w-full rounded-sm bg-[#151515]">{children}</div>
    </div>
  );
};

// ============================================================================
// 3. REACT BITS: TILTED CARD (3D interactive product perspective)
// ============================================================================
const TiltedCard = ({ children, className = '' }) => {
  const ref = useRef(null);
  const [transform, setTransform] = useState(
    'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
  );
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const pctX = x / rect.width;
    const pctY = y / rect.height;

    const rotateY = (pctX - 0.5) * 9;
    const rotateX = (0.5 - pctY) * 9;

    setTransform(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(
        2
      )}deg) scale3d(1.015, 1.015, 1.015)`
    );
    setGlare({ x: pctX * 100, y: pctY * 100, opacity: 0.16 });
  };

  const handleLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transform, transition: 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)' }}
      className={`relative will-change-transform ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 z-20 rounded-sm transition-opacity duration-300"
        style={{
          opacity: glare.opacity,
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(245, 184, 65, 0.8), transparent 60%)`,
        }}
      />
      {children}
    </div>
  );
};

// ============================================================================
// 4. REACT BITS: INFINITE MENU (Interactive Orbital Category Explorer)
// ============================================================================
const INFINITE_MENU_ITEMS = [
  {
    id: 'perfis',
    title: 'Perfis de LED',
    subtitle: 'Embutir, Sobrepor & Canto 45°',
    image:
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'fitas',
    title: 'Fitas COB 12V',
    subtitle: 'Linha contínua sem pontos',
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'fitas',
    title: 'Fontes Slim',
    subtitle: '12V 5A, 10A & 20A Bivolt',
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'spots',
    title: 'Spots Recuados',
    subtitle: 'Anti-ofuscamento arquitetônico',
    image:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'spots',
    title: 'Trilhos LED',
    subtitle: 'Kits eletrificados direcionáveis',
    image:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'decorativa',
    title: 'Pendentes',
    subtitle: 'Design linear para mesas e ilhas',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'decorativa',
    title: 'Arandelas IP65',
    subtitle: 'Duplo facho interno e externo',
    image:
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=700&q=80',
  },
];

const InfiniteMenu = ({ onSelectCategory }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const dragStartX = useRef(null);

  const count = INFINITE_MENU_ITEMS.length;

  const step = (dir) => {
    setActiveIndex((prev) => (prev + dir + count) % count);
  };

  const handlePointerDown = (e) => {
    dragStartX.current = e.clientX;
  };

  const handlePointerUp = (e) => {
    if (dragStartX.current === null) return;
    const diff = e.clientX - dragStartX.current;
    if (Math.abs(diff) > 35) {
      step(diff < 0 ? 1 : -1);
    }
    dragStartX.current = null;
  };

  const currentItem = INFINITE_MENU_ITEMS[activeIndex];

  return (
    <section className="border-b border-white/10 bg-[#0A0A0A] py-12 px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[11px] uppercase tracking-[0.22em] text-[#D4963B] font-semibold">
              Navegação Orbital • Linhas Técnicas
            </span>
            <h2 className="mt-1 font-serif text-3xl text-[#F4F1EA]">
              Explore por família de iluminação
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#F4F1EA]/55">
            <MoveHorizontal className="w-4 h-4 text-[#D4963B]" />
            <span>Arraste ou clique nas esferas para filtrar</span>
          </div>
        </div>

        {/* Orbital Interactive Discs */}
        <div
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          className="relative h-64 sm:h-72 flex items-center justify-center cursor-grab active:cursor-grabbing"
        >
          {INFINITE_MENU_ITEMS.map((item, idx) => {
            let offset = idx - activeIndex;
            if (offset > Math.floor(count / 2)) offset -= count;
            if (offset < -Math.floor(count / 2)) offset += count;

            const abs = Math.abs(offset);
            const isCenter = offset === 0;
            const translateX = offset * 145;
            const scale = isCenter ? 1.15 : Math.max(0.58, 1 - abs * 0.22);
            const opacity = abs > 2 ? 0 : isCenter ? 1 : Math.max(0.35, 0.85 - abs * 0.25);
            const zIndex = 20 - abs;

            return (
              <button
                key={`${item.title}-${idx}`}
                type="button"
                onClick={() => {
                  if (isCenter) {
                    onSelectCategory(item.id);
                  } else {
                    setActiveIndex(idx);
                  }
                }}
                style={{
                  transform: `translateX(${translateX}px) scale(${scale})`,
                  opacity,
                  zIndex,
                  transition: 'all 420ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}
                className="absolute flex flex-col items-center group cursor-pointer focus:outline-none"
              >
                <div
                  className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-2 transition-colors ${
                    isCenter
                      ? 'border-[#F5B841] shadow-[0_0_45px_rgba(212,150,59,0.4)]'
                      : 'border-white/20 group-hover:border-[#D4963B]/70'
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    draggable={false}
                    className="w-full h-full object-cover"
                  />
                </div>
              </button>
            );
          })}

          {/* Side quick arrows */}
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Anterior"
            className="absolute left-0 sm:left-4 z-30 w-10 h-10 rounded-full bg-[#151515]/90 border border-white/15 flex items-center justify-center text-[#F4F1EA] hover:border-[#D4963B] hover:text-[#F5B841] cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Próximo"
            className="absolute right-0 sm:right-4 z-30 w-10 h-10 rounded-full bg-[#151515]/90 border border-white/15 flex items-center justify-center text-[#F4F1EA] hover:border-[#D4963B] hover:text-[#F5B841] cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Active Item Caption & Action */}
        <div className="mt-3 text-center space-y-2">
          <h3 className="font-serif text-2xl sm:text-3xl text-[#F4F1EA]">
            {currentItem.title}
          </h3>
          <p className="text-xs text-[#F4F1EA]/65">{currentItem.subtitle}</p>
          <div className="pt-1">
            <button
              type="button"
              onClick={() => onSelectCategory(currentItem.id)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#D4963B]/15 border border-[#D4963B]/50 text-[11px] uppercase tracking-[0.16em] text-[#F5B841] hover:bg-[#D4963B] hover:text-[#0E0E0E] transition-colors cursor-pointer"
            >
              <span>Filtrar {currentItem.title}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// LOGO OFICIAL ADAPTADA — INOVARE ILUMINAÇÃO
// ============================================================================
const InovareIluminacaoLogo = ({ size = 'md' }) => {
  const iconBox = size === 'sm' ? 'w-9 h-9' : 'w-11 h-11';
  const titleSize =
    size === 'sm'
      ? 'text-xs tracking-[0.2em]'
      : 'text-sm md:text-base tracking-[0.22em]';

  return (
    <div className="inline-flex items-center gap-3 select-none group">
      <div className={`${iconBox} relative flex items-center justify-center shrink-0`}>
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full overflow-visible transition-transform duration-500 group-hover:scale-[1.03]"
          aria-label="Monograma IA - Inovare Iluminação"
        >
          <defs>
            <linearGradient id="inovareLightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5B841" />
              <stop offset="55%" stopColor="#D4963B" />
              <stop offset="100%" stopColor="#B87624" />
            </linearGradient>
          </defs>
          <circle cx="24" cy="21" r="10.5" fill="url(#inovareLightGrad)" />
          <rect
            x="14.5"
            y="40"
            width="19"
            height="64"
            rx="1.5"
            fill="url(#inovareLightGrad)"
          />
          <polygon
            points="66,18 106,104 85.5,104 66,60.5 46.5,104 26,104"
            fill="url(#inovareLightGrad)"
          />
          <polygon
            points="66,74 77.5,99 54.5,99"
            fill="url(#inovareLightGrad)"
          />
        </svg>
      </div>

      <div className="text-left leading-none">
        <div className={`font-serif font-medium text-[#F4F1EA] uppercase ${titleSize}`}>
          INOVARE
        </div>
        <div className="mt-1 text-[10px] uppercase tracking-[0.24em] text-[#D4963B] font-semibold">
          iluminação & led
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// APLICAÇÕES REAIS POR AMBIENTE (PARA O CAROUSEL)
// ============================================================================
const ROOM_APPLICATIONS = [
  {
    id: 'marcenaria',
    room: 'Marcenaria & Nichos',
    tempBadge: '2700K — 3000K Âmbar Quente',
    title: 'Destaque elegante em painéis, cristaleiras e closets planejados',
    description:
      'O Perfil Slim de Embutir 17×7mm combinado com a Fita LED COB Contínua elimina pontos marcados no MDF e cria profundidade sem ofuscamento.',
    recommendedCategory: 'perfis',
    recommendedLabel: 'Perfil Embutir 17×7mm + Fita COB 3000K',
    image:
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'sala-sanca',
    room: 'Sala de Estar & Sancas',
    tempBadge: '3000K Luz Indireta + Focal',
    title: 'Conforto visual com luz indireta no forro e foco em quadros',
    description:
      'Sancas iluminadas com Fita COB 12W/m aquecem o ambiente, enquanto Spots Recuados 7W direcionam luz limpa sobre texturas e decoração.',
    recommendedCategory: 'spots',
    recommendedLabel: 'Spot Recuado Anti-Ofuscamento 7W + Fita COB',
    image:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'cozinha-bancada',
    room: 'Cozinha & Bancada Gourmet',
    tempBadge: '4000K Branco Neutro',
    title: 'Precisão de cor no preparo sem sombras sob os armários superiores',
    description:
      'O Perfil de Canto 45° projeta o facho diretamente sobre a bancada em 4000K, preservando as cores reais dos alimentos e revestimentos.',
    recommendedCategory: 'perfis',
    recommendedLabel: 'Perfil de Canto 45° + Fita COB 4000K',
    image:
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'jantar-fachada',
    room: 'Sala de Jantar & Fachada',
    tempBadge: '3000K Decorativo & IP65',
    title: 'Protagonismo sobre a mesa e marcação arquitetônica em muros',
    description:
      'O Pendente Linear 1,20m cria uma linha de luz limpa sobre mesas e ilhas, enquanto Arandelas IP65 desenham fachadas resistentes à chuva.',
    recommendedCategory: 'decorativa',
    recommendedLabel: 'Pendente Linear 1,20m + Arandela IP65',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
  },
];

// ============================================================================
// 5. REACT BITS: CAROUSEL (Interactive Room Applications Showcase)
// ============================================================================
const ApplicationsCarousel = ({ onApplyFilter }) => {
  const [index, setIndex] = useState(0);
  const touchStart = useRef(null);

  const total = ROOM_APPLICATIONS.length;
  const next = () => setIndex((prev) => (prev + 1) % total);
  const prev = () => setIndex((prev) => (prev - 1 + total) % total);

  const current = ROOM_APPLICATIONS[index];

  return (
    <section
      id="aplicacoes"
      className="border-b border-white/10 bg-[#0C0C0C] py-14 sm:py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#D4963B] font-semibold">
              <Layers className="w-3.5 h-3.5" />
              <span>Aplicações Reais • Guia de Temperatura & Efeito</span>
            </div>
            <h2 className="mt-1.5 font-serif text-3xl sm:text-4xl text-[#F4F1EA]">
              Como cada iluminação transforma o ambiente
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prev}
              aria-label="Ambiente anterior"
              className="w-10 h-10 rounded-full border border-white/15 bg-[#151515] flex items-center justify-center text-[#F4F1EA] hover:border-[#D4963B] hover:text-[#F5B841] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Próximo ambiente"
              className="w-10 h-10 rounded-full border border-white/15 bg-[#151515] flex items-center justify-center text-[#F4F1EA] hover:border-[#D4963B] hover:text-[#F5B841] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Viewport */}
        <div
          onTouchStart={(e) => {
            touchStart.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchStart.current === null) return;
            const delta = e.changedTouches[0].clientX - touchStart.current;
            if (Math.abs(delta) > 40) {
              delta < 0 ? next() : prev();
            }
            touchStart.current = null;
          }}
          className="bg-[#151515] border border-white/10 rounded-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12"
        >
          <div className="lg:col-span-7 relative min-h-[280px] sm:min-h-[380px] overflow-hidden bg-[#090909]">
            <img
              key={current.id}
              src={current.image}
              alt={current.room}
              className="w-full h-full object-cover transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E]/85 via-transparent to-transparent" />
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#0E0E0E]/85 border border-[#D4963B]/45 text-[11px] uppercase tracking-[0.16em] text-[#F5B841] font-medium">
              {current.tempBadge}
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-[#F4F1EA]/80">
              <span className="font-serif text-xl text-[#F4F1EA]">{current.room}</span>
              <span className="font-mono text-[11px] bg-[#0E0E0E]/80 px-2.5 py-1 rounded border border-white/10">
                0{index + 1} / 0{total}
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#D4963B]">
                Cena Luminotécnica
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#F4F1EA] leading-snug">
                {current.title}
              </h3>
              <p className="text-sm text-[#F4F1EA]/70 leading-relaxed">
                {current.description}
              </p>

              <div className="bg-[#0E0E0E] border border-white/10 p-4 rounded-sm">
                <span className="block text-[10px] uppercase tracking-[0.16em] text-[#F4F1EA]/50">
                  Combinação Recomendada
                </span>
                <strong className="mt-1 block text-xs sm:text-sm text-[#F5B841]">
                  {current.recommendedLabel}
                </strong>
              </div>
            </div>

            <div className="space-y-4">
              <button
                type="button"
                onClick={() => onApplyFilter(current.recommendedCategory)}
                className="w-full py-3 px-5 rounded-full bg-[#D4963B] text-[#0E0E0E] text-xs font-semibold uppercase tracking-[0.15em] hover:bg-[#F5B841] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Ver produtos indicados no catálogo</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              {/* Dots Indicator */}
              <div className="flex items-center justify-center gap-2">
                {ROOM_APPLICATIONS.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setIndex(idx)}
                    aria-label={`Ir para ${item.room}`}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === index
                        ? 'w-8 bg-[#F5B841]'
                        : 'w-2 bg-white/25 hover:bg-white/45'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// CATÁLOGO DE PRODUTOS — LINHA TÉCNICA & DECORATIVA
// ============================================================================
const CATEGORIES = [
  { id: 'todos', label: 'Todos os Produtos' },
  { id: 'perfis', label: 'Perfis de LED' },
  { id: 'fitas', label: 'Fitas & Fontes' },
  { id: 'spots', label: 'Spots & Trilhos' },
  { id: 'decorativa', label: 'Pendentes & Arandelas' },
];

const PRODUCTS = [
  {
    id: 'prf-emb-1707',
    sku: 'INV-PRF-01',
    category: 'perfis',
    categoryLabel: 'Perfis de LED',
    name: 'Perfil de Alumínio Embutir Slim 17x7mm (Barra 2m)',
    shortDesc: 'Ideal para marcenaria, nichos, armários planejados e sancas de gesso.',
    unit: 'barra 2m',
    price: 42.90,
    badge: 'Mais Vendido',
    power: 'Compatível até 20W/m',
    voltage: '12V / 24V (requer fita)',
    protection: 'IP20 — Uso Interno',
    dimensions: '2000 × 17 × 7 mm (nicho 12mm)',
    image:
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=85',
    variants: [
      { id: 'preto', label: 'Preto Fosco + Difusor Leitoso', swatch: '#1C1C1C' },
      { id: 'branco', label: 'Branco Microtexturizado', swatch: '#ECEAE4' },
      { id: 'anodizado', label: 'Alumínio Natural', swatch: '#9E9E9E' },
    ],
  },
  {
    id: 'prf-canto-45',
    sku: 'INV-PRF-02',
    category: 'perfis',
    categoryLabel: 'Perfis de LED',
    name: 'Perfil de Canto 45° para Armários e Bancadas (Barra 2m)',
    shortDesc: 'Direciona o facho de luz a 45° sem ofuscamento sobre bancadas de cozinha.',
    unit: 'barra 2m',
    price: 49.90,
    badge: 'Marcenaria',
    power: 'Compatível até 20W/m',
    voltage: '12V / 24V (requer fita)',
    protection: 'IP20 — Uso Interno',
    dimensions: '2000 × 16 × 16 mm',
    image:
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=85',
    variants: [
      { id: 'preto', label: 'Preto Fosco', swatch: '#1C1C1C' },
      { id: 'anodizado', label: 'Alumínio Anodizado', swatch: '#A3A3A3' },
    ],
  },
  {
    id: 'fita-cob-12w',
    sku: 'INV-LED-10',
    category: 'fitas',
    categoryLabel: 'Fitas & Fontes',
    name: 'Fita LED COB Contínua 12W/m — Sem Pontos Visíveis (Rolo 5m)',
    shortDesc: 'Linha de luz uniforme e contínua com alto índice de reprodução de cor (IRC >90).',
    unit: 'rolo 5m',
    price: 89.00,
    badge: 'Linha Contínua',
    power: '12W/m (60W total)',
    voltage: '12V DC',
    protection: 'IP20 — Uso Interno',
    dimensions: '5000 × 8 mm (corte a cada 2,5cm)',
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85',
    variants: [
      { id: '2700k', label: '2700K — Âmbar Aconchegante', swatch: '#F5A623' },
      { id: '3000k', label: '3000K — Branco Quente', swatch: '#FFD27D' },
      { id: '4000k', label: '4000K — Branco Neutro', swatch: '#FFF3D6' },
      { id: '6500k', label: '6500K — Branco Frio', swatch: '#E8F4FF' },
    ],
  },
  {
    id: 'fonte-slim-120w',
    sku: 'INV-FNT-05',
    category: 'fitas',
    categoryLabel: 'Fitas & Fontes',
    name: 'Fonte Chaveada Slim Colmeia 12V 10A (120W) Bivolt',
    shortDesc: 'Perfil ultrafino para ocultar atrás de painéis de TV, forros e fundos de armários.',
    unit: 'unidade',
    price: 68.00,
    badge: 'Silenciosa',
    power: '120W Reais (10A)',
    voltage: 'Entrada 110V–220V / Saída 12V DC',
    protection: 'IP20 — Proteção contra curto',
    dimensions: '185 × 45 × 22 mm',
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=85',
    variants: [
      { id: '12v-10a', label: '12V — 10A (120W)', swatch: '#D4963B' },
      { id: '12v-5a', label: '12V — 5A (60W)', swatch: '#9E9E9E' },
    ],
  },
  {
    id: 'spot-noframe-7w',
    sku: 'INV-SPT-21',
    category: 'spots',
    categoryLabel: 'Spots & Trilhos',
    name: 'Spot Embutir Recuado Anti-Ofuscamento 7W Quadrado',
    shortDesc: 'Facho direcionável com recuo profundo que elimina o brilho direto nos olhos.',
    unit: 'unidade',
    price: 34.50,
    badge: 'Arquitetônico',
    power: '7W (560 lúmens)',
    voltage: 'Bivolt Automático (100–240V)',
    protection: 'IP20 — Uso Interno',
    dimensions: '90 × 90 mm (nicho 75×75mm)',
    image:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85',
    variants: [
      { id: '3000k-pt', label: 'Preto • 3000K (Quente)', swatch: '#FFD27D' },
      { id: '4000k-pt', label: 'Preto • 4000K (Neutro)', swatch: '#FFF3D6' },
      { id: '3000k-br', label: 'Branco • 3000K (Quente)', swatch: '#ECEAE4' },
    ],
  },
  {
    id: 'trilho-kit-15m',
    sku: 'INV-TRL-08',
    category: 'spots',
    categoryLabel: 'Spots & Trilhos',
    name: 'Kit Trilho Eletrificado 1,5m + 4 Spots LED 10W Direcionáveis',
    shortDesc: 'Solução versátil para salas, lojas e áreas gourmet sem necessidade de rebaixamento.',
    unit: 'kit completo',
    price: 219.00,
    badge: 'Pronto p/ Instalar',
    power: '40W Total (4 × 10W)',
    voltage: 'Bivolt (110V–220V)',
    protection: 'IP20 — Uso Interno',
    dimensions: 'Trilho 1500mm • Spots Ø55mm',
    image:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=85',
    variants: [
      { id: 'preto-3000k', label: 'Preto Fosco • Luz 3000K', swatch: '#1C1C1C' },
      { id: 'preto-4000k', label: 'Preto Fosco • Luz 4000K', swatch: '#4A4A4A' },
      { id: 'branco-3000k', label: 'Branco • Luz 3000K', swatch: '#ECEAE4' },
    ],
  },
  {
    id: 'pendente-linear-120',
    sku: 'INV-PND-14',
    category: 'decorativa',
    categoryLabel: 'Pendentes & Arandelas',
    name: 'Pendente Linear Minimalista 1,20m para Mesa de Jantar & Ilha',
    shortDesc: 'Design esguio em alumínio com cabo ajustável até 1,5m e luz difusa confortável.',
    unit: 'unidade',
    price: 389.00,
    badge: 'Destaque',
    power: '24W LED Integrado (1920 lm)',
    voltage: 'Bivolt Automático',
    protection: 'IP20 — Uso Interno',
    dimensions: '1200 × 25 × 35 mm (cabo 1,5m)',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85',
    variants: [
      { id: 'preto-3000k', label: 'Preto Fosco • 3000K', swatch: '#1C1C1C' },
      { id: 'dourado-3000k', label: 'Dourado Escovado • 3000K', swatch: '#D4963B' },
    ],
  },
  {
    id: 'arandela-duplo-facho',
    sku: 'INV-ARN-03',
    category: 'decorativa',
    categoryLabel: 'Pendentes & Arandelas',
    name: 'Arandela Colonial Moderna Duplo Facho IP65 (Interno / Externo)',
    shortDesc: 'Efeito de luz superior e inferior para fachadas, muros, corredores e lavabos.',
    unit: 'unidade',
    price: 64.90,
    badge: 'Área Externa IP65',
    power: '6W LED Integrado (2 × 3W)',
    voltage: 'Bivolt Automático',
    protection: 'IP65 — Resistente a chuva',
    dimensions: '120 × 80 × 45 mm',
    image:
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=85',
    variants: [
      { id: 'preto-3000k', label: 'Preto • 3000K (Âmbar Quente)', swatch: '#1C1C1C' },
      { id: 'marrom-3000k', label: 'Marrom Corten • 3000K', swatch: '#5C3A21' },
    ],
  },
];

const formatBRL = (value) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// ============================================================================
// APLICAÇÃO PRINCIPAL — CATÁLOGO INOVARE ILUMINAÇÃO
// ============================================================================
export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVariants, setSelectedVariants] = useState(() => {
    const initial = {};
    PRODUCTS.forEach((p) => {
      initial[p.id] = p.variants[0];
    });
    return initial;
  });

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeProductModal, setActiveProductModal] = useState(null);
  const [addedToast, setAddedToast] = useState(null);

  // Calculadora rápida de fita LED + fonte
  const [metersInput, setMetersInput] = useState(6);
  const [stripWattsPerMeter, setStripWattsPerMeter] = useState(12);

  // Dados de finalização no carrinho
  const [customerName, setCustomerName] = useState('');
  const [deliveryMode, setDeliveryMode] = useState('Retirar na loja (Rua São Benedito)');
  const [paymentMethod, setPaymentMethod] = useState('PIX');
  const [orderNotes, setOrderNotes] = useState('');

  const catalogRef = useRef(null);

  const jumpToCatalogWithCategory = (catId) => {
    setSelectedCategory(catId);
    setSearchQuery('');
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategory === 'todos' || product.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.shortDesc.toLowerCase().includes(q) ||
        product.sku.toLowerCase().includes(q) ||
        product.categoryLabel.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const calcSummary = useMemo(() => {
    const meters = Math.max(1, Number(metersInput) || 1);
    const totalWatts = meters * stripWattsPerMeter;
    const recommendedWatts = Math.ceil(totalWatts * 1.2); // 20% safety margin
    const recommendedAmps = Math.ceil(recommendedWatts / 12);
    const rollsNeeded = Math.ceil(meters / 5);
    const barsNeeded = Math.ceil(meters / 2);
    return {
      meters,
      totalWatts,
      recommendedWatts,
      recommendedAmps,
      rollsNeeded,
      barsNeeded,
    };
  }, [metersInput, stripWattsPerMeter]);

  const handleSelectVariant = (productId, variant) => {
    setSelectedVariants((prev) => ({ ...prev, [productId]: variant }));
  };

  const addToCart = (product, qty = 1) => {
    const chosenVariant = selectedVariants[product.id] || product.variants[0];
    const cartKey = `${product.id}__${chosenVariant.id}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.key === cartKey);
      if (existing) {
        return prev.map((item) =>
          item.key === cartKey ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [
        ...prev,
        {
          key: cartKey,
          productId: product.id,
          sku: product.sku,
          name: product.name,
          unit: product.unit,
          price: product.price,
          image: product.image,
          variantLabel: chosenVariant.label,
          quantity: qty,
        },
      ];
    });

    setAddedToast(`${product.name} adicionado ao pedido`);
    setTimeout(() => setAddedToast(null), 2600);
  };

  const addCalculatedKitToCart = () => {
    const profileProd = PRODUCTS.find((p) => p.id === 'prf-emb-1707');
    const stripProd = PRODUCTS.find((p) => p.id === 'fita-cob-12w');
    const powerProd = PRODUCTS.find((p) => p.id === 'fonte-slim-120w');

    if (profileProd) addToCart(profileProd, calcSummary.barsNeeded);
    if (stripProd) addToCart(stripProd, calcSummary.rollsNeeded);
    if (powerProd) addToCart(powerProd, 1);

    setAddedToast(
      `Kit calculado (${calcSummary.barsNeeded} perfis + ${calcSummary.rollsNeeded} rolos + fonte) adicionado!`
    );
    setTimeout(() => setAddedToast(null), 3200);
  };

  const updateCartQty = (key, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (key) => {
    setCart((prev) => prev.filter((item) => item.key !== key));
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckoutWhatsApp = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const lines = cart.map(
      (item, i) =>
        `${i + 1}. *${item.name}* (${item.sku})\n   • Opção: ${
          item.variantLabel
        }\n   • Qtd: ${item.quantity} ${item.unit} × ${formatBRL(
          item.price
        )} = *${formatBRL(item.price * item.quantity)}*`
    );

    const message = [
      `Olá, equipe *INOVARE Iluminação*! Gostaria de finalizar o seguinte pedido pelo catálogo:`,
      ``,
      `*Cliente:* ${customerName || 'Não informado'}`,
      `*Recebimento:* ${deliveryMode}`,
      `*Pagamento:* ${paymentMethod}`,
      ``,
      `*ITENS DO PEDIDO:*`,
      ...lines,
      ``,
      `*Total Estimado:* ${formatBRL(subtotal)}`,
      orderNotes ? `*Observações:* ${orderNotes}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className="min-h-screen bg-[#0E0E0E] text-[#F4F1EA] selection:bg-[#D4963B]/30 selection:text-[#F5B841]"
    >
      <style>{`
        .font-serif {
          font-family: 'Cormorant Garamond', Georgia, serif;
        }
      `}</style>

      {/* ====================================================================
          HEADER FIXO COM BUSCA E BOTÃO DO CARRINHO
         ==================================================================== */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0E0E0E]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <a href="#topo" className="shrink-0">
            <InovareIluminacaoLogo size="md" />
          </a>

          {/* Campo de busca rápida no desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-[#F4F1EA]/40 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar perfil LED, fita 3000K, spot, trilho..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-[#151515] border border-white/10 text-xs text-[#F4F1EA] placeholder:text-white/35 focus:outline-none focus:border-[#D4963B]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-white/40 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Ações direita */}
          <div className="flex items-center gap-3">
            <a
              href={MOVEIS_SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-white/15 text-xs text-[#F4F1EA]/75 hover:border-[#D4963B] hover:text-[#F5B841] transition-colors"
            >
              <span>Móveis Planejados</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#D4963B] text-[#0E0E0E] text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#F5B841] transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Pedido</span>
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[#0E0E0E] text-[#F5B841] text-[11px] font-bold">
                {totalItems}
              </span>
            </button>
          </div>
        </div>

        {/* Busca no mobile */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#F4F1EA]/40 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar perfil, fita LED, spot..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-[#151515] border border-white/10 text-xs text-[#F4F1EA] placeholder:text-white/35 focus:outline-none focus:border-[#D4963B]"
            />
          </div>
        </div>
      </header>

      {/* ====================================================================
          HERO EDITORIAL COM SCANNER BACKGROUND
         ==================================================================== */}
      <section
        id="topo"
        className="relative border-b border-white/10 overflow-hidden py-14 sm:py-20 px-4 sm:px-6 lg:px-8"
      >
        <ScannerBackground />

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151515]/90 border border-[#D4963B]/40 text-[11px] uppercase tracking-[0.2em] text-[#F5B841]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Catálogo Online • Pronta Entrega em Santa Inês - MA</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl text-[#F4F1EA] leading-[1.06]">
              Iluminação arquitetônica para valorizar{' '}
              <span className="italic text-[#F5B841]">cada detalhe</span>.
            </h1>

            <p className="max-w-2xl text-sm sm:text-base text-[#F4F1EA]/75 leading-relaxed">
              Perfis de alumínio, fitas LED contínuas, spots anti-ofuscamento, trilhos
              eletrificados e pendentes. Escolha a temperatura de cor ideal, monte sua
              lista e finalize direto pelo WhatsApp da loja.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-[#F4F1EA]/75">
              <span className="inline-flex items-center gap-2">
                <Sun className="w-4 h-4 text-[#D4963B]" /> 2700K, 3000K, 4000K e 6500K
              </span>
              <span className="inline-flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#D4963B]" /> Linha completa 12V e Bivolt
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D4963B]" /> Orientação técnica na loja
              </span>
            </div>
          </div>

          {/* Card destaque com Border Glow */}
          <div className="lg:col-span-5">
            <BorderGlow>
              <div className="p-6 sm:p-7 space-y-4">
                <div className="text-xs uppercase tracking-[0.2em] text-[#D4963B] font-medium">
                  Como comprar pelo catálogo
                </div>
                <ol className="space-y-3 text-sm text-[#F4F1EA]/80">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#D4963B]/20 text-[#F5B841] text-xs font-bold flex items-center justify-center shrink-0">
                      1
                    </span>
                    <span>
                      Selecione a <strong>cor da luz (K)</strong> ou acabamento desejado em
                      cada produto.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#D4963B]/20 text-[#F5B841] text-xs font-bold flex items-center justify-center shrink-0">
                      2
                    </span>
                    <span>
                      Adicione os itens ao carrinho para calcular o{' '}
                      <strong>valor total estimado</strong> automaticamente.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#D4963B]/20 text-[#F5B841] text-xs font-bold flex items-center justify-center shrink-0">
                      3
                    </span>
                    <span>
                      Clique em <strong>Finalizar no WhatsApp</strong> para reservar para
                      retirada na Rua São Benedito ou entrega.
                    </span>
                  </li>
                </ol>
              </div>
            </BorderGlow>
          </div>
        </div>
      </section>

      {/* ====================================================================
          INFINITE MENU — EXPLORADOR ORBITAL DE LINHAS
         ==================================================================== */}
      <InfiniteMenu onSelectCategory={jumpToCatalogWithCategory} />

      {/* ====================================================================
          CAROUSEL — APLICAÇÕES REAIS POR AMBIENTE
         ==================================================================== */}
      <ApplicationsCarousel onApplyFilter={jumpToCatalogWithCategory} />

      {/* ====================================================================
          BARRA DE CATEGORIAS + GRADE DE PRODUTOS (TILTED CARD)
         ==================================================================== */}
      <main
        ref={catalogRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16"
      >
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              <SlidersHorizontal className="w-4 h-4 text-[#D4963B] shrink-0 mr-1" />
              {CATEGORIES.map((cat) => {
                const active = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.14em] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#D4963B] text-[#0E0E0E] font-semibold'
                        : 'bg-[#151515] text-[#F4F1EA]/75 border border-white/10 hover:border-[#D4963B]/50'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            <div className="text-xs text-[#F4F1EA]/55 shrink-0">
              Exibindo <strong className="text-[#F4F1EA]">{filteredProducts.length}</strong>{' '}
              {filteredProducts.length === 1 ? 'item' : 'itens'}
            </div>
          </div>

          {/* Grade de Produtos com Tilted Card */}
          {filteredProducts.length === 0 ? (
            <div className="bg-[#151515] border border-white/10 rounded-sm p-12 text-center space-y-3">
              <p className="font-serif text-2xl text-[#F4F1EA]">
                Nenhum produto encontrado para "{searchQuery}"
              </p>
              <p className="text-xs text-[#F4F1EA]/60">
                Tente limpar o filtro ou falar diretamente com nossa equipe no WhatsApp.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('todos');
                }}
                className="mt-2 px-5 py-2.5 rounded-full bg-[#D4963B] text-[#0E0E0E] text-xs font-semibold uppercase tracking-[0.15em] cursor-pointer"
              >
                Ver todo o catálogo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const currentVariant =
                  selectedVariants[product.id] || product.variants[0];

                return (
                  <TiltedCard key={product.id} className="h-full">
                    <article className="h-full flex flex-col bg-[#151515] border border-white/10 rounded-sm overflow-hidden hover:border-[#D4963B]/55 transition-colors group">
                      {/* Imagem do produto */}
                      <div
                        onClick={() => setActiveProductModal(product)}
                        className="relative aspect-[4/3] w-full overflow-hidden bg-[#0A0A0A] cursor-pointer"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-transparent to-transparent opacity-80" />

                        {product.badge && (
                          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-sm bg-[#0E0E0E]/85 border border-[#D4963B]/40 text-[10px] uppercase tracking-[0.16em] text-[#F5B841] font-medium">
                            {product.badge}
                          </span>
                        )}

                        <span className="absolute bottom-2.5 right-3 text-[10px] font-mono text-[#F4F1EA]/65 bg-[#0E0E0E]/75 px-2 py-0.5 rounded">
                          {product.sku}
                        </span>
                      </div>

                      {/* Corpo do Card */}
                      <div className="flex-1 flex flex-col p-5">
                        <span className="text-[10px] uppercase tracking-[0.18em] text-[#D4963B]">
                          {product.categoryLabel}
                        </span>

                        <h2
                          onClick={() => setActiveProductModal(product)}
                          className="mt-1.5 font-serif text-xl text-[#F4F1EA] leading-snug hover:text-[#F5B841] transition-colors cursor-pointer"
                        >
                          {product.name}
                        </h2>

                        <p className="mt-2 text-xs text-[#F4F1EA]/65 line-clamp-2 leading-relaxed">
                          {product.shortDesc}
                        </p>

                        {/* Seletor de Temperatura de Cor / Acabamento */}
                        <div className="mt-4 pt-3 border-t border-white/10">
                          <div className="text-[10px] uppercase tracking-[0.15em] text-[#F4F1EA]/50 mb-2">
                            Opção:{' '}
                            <span className="text-[#F4F1EA]">{currentVariant.label}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {product.variants.map((v) => {
                              const isSelected = currentVariant.id === v.id;
                              return (
                                <button
                                  key={v.id}
                                  type="button"
                                  onClick={() => handleSelectVariant(product.id, v)}
                                  title={v.label}
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] border transition-all cursor-pointer ${
                                    isSelected
                                      ? 'border-[#D4963B] bg-[#D4963B]/15 text-[#F5B841]'
                                      : 'border-white/15 bg-[#0E0E0E] text-[#F4F1EA]/65 hover:border-white/30'
                                  }`}
                                >
                                  <span
                                    style={{ backgroundColor: v.swatch }}
                                    className="w-2.5 h-2.5 rounded-full border border-white/30 shrink-0"
                                  />
                                  <span className="truncate max-w-[115px]">
                                    {v.label.split('—')[0].split('•')[0].trim()}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Preço + Ações */}
                        <div className="mt-auto pt-5">
                          <div className="flex items-baseline justify-between gap-2 mb-3">
                            <div>
                              <span className="text-lg font-bold text-[#F4F1EA]">
                                {formatBRL(product.price)}
                              </span>
                              <span className="text-[11px] text-[#F4F1EA]/50 ml-1">
                                / {product.unit}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => setActiveProductModal(product)}
                              className="text-[11px] text-[#D4963B] hover:underline cursor-pointer"
                            >
                              Ficha técnica
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => addToCart(product, 1)}
                            className="w-full py-2.5 px-4 rounded-full bg-[#D4963B] text-[#0E0E0E] text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#F5B841] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Adicionar ao Pedido</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  </TiltedCard>
                );
              })}
            </div>
          )}
        </div>

        {/* ====================================================================
            CALCULADORA RÁPIDA DE FITA LED & FONTE COM BORDER GLOW
           ==================================================================== */}
        <BorderGlow>
          <section className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-3">
              <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#D4963B] font-semibold">
                <Calculator className="w-4 h-4" />
                <span>Dimensionamento Técnico</span>
              </div>
              <h2 className="font-serif text-3xl text-[#F4F1EA]">
                Calculadora rápida de Fita LED & Fonte
              </h2>
              <p className="text-xs sm:text-sm text-[#F4F1EA]/70 leading-relaxed">
                Informe a metragem total da sanca ou marcenaria para descobrir a potência
                segura da fonte 12V e a quantidade exata de barras de perfil e rolos de fita.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
              <div className="space-y-4 bg-[#0E0E0E] border border-white/10 p-5 rounded-sm">
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.15em] text-[#F4F1EA]/65 mb-2">
                    Metragem linear total (metros)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={metersInput}
                    onChange={(e) => setMetersInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-sm bg-[#151515] border border-white/15 text-sm font-semibold text-[#F4F1EA] focus:outline-none focus:border-[#D4963B]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-[0.15em] text-[#F4F1EA]/65 mb-2">
                    Potência da fita LED
                  </label>
                  <select
                    value={stripWattsPerMeter}
                    onChange={(e) => setStripWattsPerMeter(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-sm bg-[#151515] border border-white/15 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#D4963B]"
                  >
                    <option value={10}>10W/m — Luz decorativa suave</option>
                    <option value={12}>12W/m — Fita COB Padrão (Recomendada)</option>
                    <option value={14.4}>14,4W/m — Alta luminosidade</option>
                  </select>
                </div>
              </div>

              <div className="bg-[#0E0E0E] border border-[#D4963B]/35 p-5 rounded-sm space-y-3">
                <div className="text-[11px] uppercase tracking-[0.16em] text-[#F5B841] font-semibold">
                  Especificação Recomendada
                </div>
                <ul className="space-y-1.5 text-xs text-[#F4F1EA]/80">
                  <li>
                    • Consumo total: <strong>{calcSummary.totalWatts}W</strong>
                  </li>
                  <li>
                    • Fonte 12V ideal (com folga 20%):{' '}
                    <strong className="text-[#F5B841]">
                      mín. {calcSummary.recommendedWatts}W ({calcSummary.recommendedAmps}A)
                    </strong>
                  </li>
                  <li>
                    • Rolos de Fita (5m):{' '}
                    <strong>
                      {calcSummary.rollsNeeded}{' '}
                      {calcSummary.rollsNeeded === 1 ? 'rolo' : 'rolos'}
                    </strong>
                  </li>
                  <li>
                    • Barras de Perfil (2m):{' '}
                    <strong>
                      {calcSummary.barsNeeded}{' '}
                      {calcSummary.barsNeeded === 1 ? 'barra' : 'barras'}
                    </strong>
                  </li>
                </ul>

                <button
                  type="button"
                  onClick={addCalculatedKitToCart}
                  className="w-full mt-2 py-2.5 px-4 rounded-full bg-[#D4963B] text-[#0E0E0E] text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#F5B841] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Kit Calculado</span>
                </button>
              </div>
            </div>
          </section>
        </BorderGlow>
      </main>

      {/* ====================================================================
          RODAPÉ INTEGRADO COM A LOJA FÍSICA & MÓVEIS PLANEJADOS
         ==================================================================== */}
      <footer className="border-t border-white/10 bg-[#0A0A0A] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-xs text-[#F4F1EA]/65">
          <div>
            <InovareIluminacaoLogo size="sm" />
            <p className="mt-3 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#D4963B] shrink-0" />
              <span>
                {ADDRESS_LINE} • {CEP_LINE}
              </span>
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-[#F4F1EA] font-medium uppercase tracking-[0.16em]">
              Atendimento & Orçamentos
            </div>
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#D4963B]" />
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#F5B841]"
              >
                {PHONE_DISPLAY}
              </a>
            </p>
            <p>
              Instagram:{' '}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4963B] hover:underline"
              >
                {INSTAGRAM_HANDLE}
              </a>
            </p>
          </div>

          <div className="md:text-right space-y-2">
            <div className="text-[#F4F1EA] font-medium uppercase tracking-[0.16em]">
              Conheça também
            </div>
            <a
              href={MOVEIS_SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#F5B841] hover:underline"
            >
              <span>Inovare Ambientes Projetados</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </footer>

      {/* ====================================================================
          NOTIFICAÇÃO RÁPIDA (TOAST) AO ADICIONAR ITEM
         ==================================================================== */}
      {addedToast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-full bg-[#181818] border border-[#D4963B]/60 shadow-2xl text-xs text-[#F4F1EA]">
          <span className="w-5 h-5 rounded-full bg-[#D4963B] text-[#0E0E0E] flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5" />
          </span>
          <span className="line-clamp-1 max-w-[240px] sm:max-w-xs">{addedToast}</span>
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="text-[#F5B841] font-semibold uppercase tracking-wider hover:underline cursor-pointer shrink-0"
          >
            Ver sacola
          </button>
        </div>
      )}

      {/* ====================================================================
          MODAL DE FICHA TÉCNICA DO PRODUTO
         ==================================================================== */}
      {activeProductModal && (
        <div
          onClick={() => setActiveProductModal(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-[#151515] border border-white/15 rounded-sm overflow-hidden shadow-2xl"
          >
            <div className="relative h-60 sm:h-72">
              <img
                src={activeProductModal.image}
                alt={activeProductModal.name}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setActiveProductModal(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#0E0E0E]/85 border border-white/15 flex items-center justify-center text-[#F4F1EA] hover:text-[#F5B841] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-5">
              <div>
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-[#D4963B]">
                  <span>{activeProductModal.categoryLabel}</span>
                  <span>Cód. {activeProductModal.sku}</span>
                </div>
                <h3 className="mt-1 font-serif text-2xl sm:text-3xl text-[#F4F1EA]">
                  {activeProductModal.name}
                </h3>
                <p className="mt-2 text-sm text-[#F4F1EA]/75">
                  {activeProductModal.shortDesc}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#0E0E0E] border border-white/10 p-4 rounded-sm text-xs">
                <div>
                  <span className="text-[#F4F1EA]/50 block">Potência / Consumo</span>
                  <strong className="text-[#F4F1EA]">{activeProductModal.power}</strong>
                </div>
                <div>
                  <span className="text-[#F4F1EA]/50 block">Tensão / Alimentação</span>
                  <strong className="text-[#F4F1EA]">{activeProductModal.voltage}</strong>
                </div>
                <div>
                  <span className="text-[#F4F1EA]/50 block">Índice de Proteção</span>
                  <strong className="text-[#F4F1EA]">
                    {activeProductModal.protection}
                  </strong>
                </div>
                <div>
                  <span className="text-[#F4F1EA]/50 block">Dimensões / Corte</span>
                  <strong className="text-[#F4F1EA]">
                    {activeProductModal.dimensions}
                  </strong>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-white/10">
                <div>
                  <span className="text-2xl font-bold text-[#F4F1EA]">
                    {formatBRL(activeProductModal.price)}
                  </span>
                  <span className="text-xs text-[#F4F1EA]/55 ml-1">
                    / {activeProductModal.unit}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    addToCart(activeProductModal, 1);
                    setActiveProductModal(null);
                  }}
                  className="px-6 py-3 rounded-full bg-[#D4963B] text-[#0E0E0E] text-xs font-semibold uppercase tracking-[0.15em] hover:bg-[#F5B841] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar ao Pedido</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          GAVETA LATERAL DO CARRINHO & CHECKOUT WHATSAPP
         ==================================================================== */}
      {isCartOpen && (
        <div
          onClick={() => setIsCartOpen(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#121212] border-l border-white/15 h-full flex flex-col shadow-2xl"
          >
            {/* Topo da Gaveta */}
            <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-[#D4963B]" />
                <h2 className="font-serif text-2xl text-[#F4F1EA]">Seu Pedido</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-[#F4F1EA]/75 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Lista de Itens + Formulário de Envio */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <p className="font-serif text-2xl text-[#F4F1EA]/85">
                    Sua sacola está vazia
                  </p>
                  <p className="text-xs text-[#F4F1EA]/55">
                    Adicione perfis, fitas LED, spots ou pendentes do catálogo para
                    montar seu orçamento.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.key}
                        className="flex gap-3.5 bg-[#181818] border border-white/10 p-3.5 rounded-sm"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-sm object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-[#F4F1EA] line-clamp-2">
                            {item.name}
                          </div>
                          <div className="mt-0.5 text-[11px] text-[#D4963B]">
                            {item.variantLabel}
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="inline-flex items-center border border-white/15 rounded-full bg-[#0E0E0E]">
                              <button
                                type="button"
                                onClick={() => updateCartQty(item.key, -1)}
                                className="p-1.5 text-[#F4F1EA]/75 hover:text-white cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2.5 text-xs font-semibold">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateCartQty(item.key, 1)}
                                className="p-1.5 text-[#F4F1EA]/75 hover:text-white cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#F4F1EA]">
                                {formatBRL(item.price * item.quantity)}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeFromCart(item.key)}
                                aria-label="Remover item"
                                className="text-white/35 hover:text-red-400 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Dados rápidos do cliente */}
                  <form
                    id="checkout-form"
                    onSubmit={handleCheckoutWhatsApp}
                    className="space-y-4 pt-4 border-t border-white/10"
                  >
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.15em] text-[#F4F1EA]/65 mb-1.5">
                        Seu Nome
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Digite seu nome"
                        className="w-full px-3.5 py-2.5 rounded-sm bg-[#0E0E0E] border border-white/15 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#D4963B]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.15em] text-[#F4F1EA]/65 mb-1.5">
                        Como deseja receber?
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          {
                            value: 'Retirar na loja (Rua São Benedito)',
                            label: 'Retirar na Loja',
                            icon: Store,
                          },
                          {
                            value: 'Entrega em Santa Inês - MA',
                            label: 'Entrega Local',
                            icon: Truck,
                          },
                        ].map((opt) => {
                          const Icon = opt.icon;
                          const active = deliveryMode === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setDeliveryMode(opt.value)}
                              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-sm border text-xs cursor-pointer ${
                                active
                                  ? 'border-[#D4963B] bg-[#D4963B]/15 text-[#F5B841]'
                                  : 'border-white/15 bg-[#0E0E0E] text-[#F4F1EA]/70'
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                              <span>{opt.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.15em] text-[#F4F1EA]/65 mb-1.5">
                        Forma de Pagamento
                      </label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-sm bg-[#0E0E0E] border border-white/15 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#D4963B]"
                      >
                        <option>PIX</option>
                        <option>Cartão de Crédito</option>
                        <option>Cartão de Débito</option>
                        <option>Dinheiro na Retirada / Entrega</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.15em] text-[#F4F1EA]/65 mb-1.5">
                        Observações (Opcional)
                      </label>
                      <textarea
                        rows={2}
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        placeholder="Ex.: Preciso de ajuda para dimensionar a fonte para 8 metros de fita..."
                        className="w-full px-3.5 py-2 rounded-sm bg-[#0E0E0E] border border-white/15 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#D4963B]"
                      />
                    </div>
                  </form>
                </>
              )}
            </div>

            {/* Rodapé da Gaveta com Border Glow */}
            {cart.length > 0 && (
              <div className="p-4 border-t border-white/10 bg-[#0E0E0E]">
                <BorderGlow>
                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-[0.16em] text-[#F4F1EA]/65">
                        Total Estimado ({totalItems}{' '}
                        {totalItems === 1 ? 'item' : 'itens'})
                      </span>
                      <span className="text-xl font-bold text-[#F5B841]">
                        {formatBRL(subtotal)}
                      </span>
                    </div>

                    <button
                      type="submit"
                      form="checkout-form"
                      className="w-full py-3.5 px-6 rounded-full bg-[#D4963B] text-[#0E0E0E] text-xs font-semibold uppercase tracking-[0.16em] hover:bg-[#F5B841] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Enviar Pedido no WhatsApp</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </BorderGlow>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}