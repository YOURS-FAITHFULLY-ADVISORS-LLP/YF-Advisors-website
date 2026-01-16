"use client";

import React, { useRef, useEffect, useState } from "react";
import { Renderer, Camera, Transform, Plane, Mesh, Program, Texture } from "ogl";
// import { motion } from "framer-motion";
import { 
  PieChart, Cpu, Share2, Search, Banknote, 
  FileText, Headphones, UserMinus, Settings, UserCheck, 
  LucideIcon 
} from "lucide-react";

// --- Types ---
type GL = Renderer["gl"];

interface Service {
  title: string;
  icon: LucideIcon;
  color: string;
  description: string;
}

interface TitleProps {
  gl: GL;
  plane: Mesh;
  renderer: Renderer;
  text: string;
  textColor?: string;
  font?: string;
}

interface MediaProps {
  geometry: Plane;
  gl: GL;
  service: Service;
  index: number;
  length: number;
  renderer: Renderer;
  scene: Transform;
  screen: { width: number; height: number };
  viewport: { width: number; height: number };
  bend: number;
}

interface AppConfig {
  bend?: number;
  scrollSpeed?: number;
  scrollEase?: number;
}

interface CircularGalleryProps {
  bend?: number;
  scrollSpeed?: number;
  scrollEase?: number;
}

// --- Data ---
const services: Service[] = [
  { 
    title: "Finance Consulting", 
    icon: PieChart, 
    color: "#0AA8A3",
    description: "Expert guidance to reduce costs, boost profitability, and navigate complex financial landscapes."
  },
  { 
    title: "Back Office Automation", 
    icon: Cpu, 
    color: "#0F172A",
    description: "Streamline operations using AI & RPA to automate repetitive tasks like data entry and invoice processing."
  },
  { 
    title: "Functional Outsourcing", 
    icon: Share2, 
    color: "#0AA8A3",
    description: "Delegate specific functions like HR and Accounts Payable to specialized experts to improve efficiency."
  },
  { 
    title: "Mystery Audits", 
    icon: Search, 
    color: "#0F172A",
    description: "Gain unfiltered insights into customer experience and compliance through discreet evaluations."
  },
  { 
    title: "Payroll Management", 
    icon: Banknote, 
    color: "#0AA8A3",
    description: "End-to-end cloud-based payroll processing ensuring 100% accuracy and strict compliance."
  },
  { 
    title: "Bookkeeping Services", 
    icon: FileText, 
    color: "#0F172A",
    description: "Accurate tracking of financial transactions to keep your business audit-ready at all times."
  },
  { 
    title: "Virtual Assistant", 
    icon: Headphones, 
    color: "#0AA8A3",
    description: "Dedicated remote administrative support for email management, scheduling, and coordination."
  },
  { 
    title: "Attrition Management", 
    icon: UserMinus, 
    color: "#0F172A",
    description: "Strategic solutions to retain top talent and significantly reduce workforce turnover rates."
  },
  { 
    title: "Process Outsourcing", 
    icon: Settings, 
    color: "#0AA8A3",
    description: "Optimize non-core activities like procurement and supply chain to focus entirely on growth."
  },
  { 
    title: "Manpower Outsourcing", 
    icon: UserCheck, 
    color: "#0F172A",
    description: "Flexible staffing solutions ranging from temporary project-based hires to permanent recruitment."
  },
];

// =========================================
// 1. MOBILE VIEW COMPONENT (Horizontal Manual Slide)
// =========================================

const MobileServices = () => {
  return (
    <div className="w-full overflow-x-auto pb-10 pt-4 px-6 scrollbar-hide snap-x snap-mandatory flex gap-6">
      {services.map((service, index) => {
        const Icon = service.icon;
        return (
          <div
            key={index}
            className="snap-center shrink-0 w-[85vw] max-w-[320px] bg-white rounded-2xl p-8 shadow-lg border border-slate-100 relative overflow-hidden group"
          >
            {/* Background Number */}
            <span className="absolute -top-4 -right-2 text-[8rem] font-bold text-slate-50 opacity-50 select-none z-0">
              {(index + 1).toString().padStart(2, '0')}
            </span>

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                {/* Icon Container */}
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm"
                  style={{ backgroundColor: service.color + "15" }} 
                >
                  <Icon size={28} color={service.color} strokeWidth={2} />
                </div>

                {/* Text Content */}
                <h3 className="text-2xl font-bold text-slate-900 mb-3 leading-tight">
                  {service.title}
                </h3>
                <p className="text-base text-slate-600 font-medium leading-relaxed line-clamp-4">
                  {service.description}
                </p>
              </div>

              {/* Bottom Decorative Line */}
              <div 
                className="w-16 h-1.5 mt-6 rounded-full opacity-80"
                style={{ backgroundColor: service.color }}
              />
            </div>
          </div>
        );
      })}
      {/* Spacer for right padding */}
      <div className="w-2 shrink-0" />
    </div>
  );
};

// =========================================
// 2. DESKTOP VIEW COMPONENT (WebGL Gallery)
// =========================================

function generateServiceCardTexture(gl: GL, service: Service, index: number) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  const width = 600; 
  const height = 900; 
  canvas.width = width;
  canvas.height = height;

  if (ctx) {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(0, 0, width, height, 40);
    ctx.fill();
    
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 6; 
    ctx.stroke();

    ctx.font = 'bold 100px sans-serif';
    ctx.fillStyle = '#f1f5f9'; 
    ctx.textAlign = 'right';
    ctx.fillText((index + 1).toString().padStart(2, '0'), width - 40, 130);

    ctx.fillStyle = service.color + '20'; 
    ctx.beginPath();
    ctx.roundRect(40, 50, 90, 90, 20);
    ctx.fill();
    
    ctx.font = 'bold 40px sans-serif';
    ctx.fillStyle = service.color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✦', 85, 95);

    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.font = 'bold 52px sans-serif';
    ctx.fillStyle = '#0f172a';
    
    const words = service.title.split(' ');
    let lineY = 260;
    words.forEach(word => {
        ctx.fillText(word, 40, lineY);
        lineY += 65;
    });

    ctx.font = '500 30px sans-serif';
    ctx.fillStyle = '#64748b'; 
    const maxWidth = width - 80;
    const lineHeight = 42;
    const x = 40;
    let y = lineY + 20; 
    
    const descWords = service.description.split(' ');
    let line = '';

    for(let n = 0; n < descWords.length; n++) {
      const testLine = line + descWords[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = descWords[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);

    ctx.fillStyle = service.color;
    ctx.fillRect(40, height - 60, 100, 10);
    
    ctx.font = 'bold 20px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('PROFESSIONAL SERVICES', 160, height - 50);
  }

  const texture = new Texture(gl, { generateMipmaps: true });
  texture.image = canvas;
  
  return { texture, width, height, aspect: width/height };
}

function debounce<T extends (...args: unknown[]) => void>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return function (this: unknown, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function lerp(p1: number, p2: number, t: number): number {
  return p1 + (p2 - p1) * t;
}

function autoBind(instance: object): void {
  const proto = Object.getPrototypeOf(instance);
  Object.getOwnPropertyNames(proto).forEach((key) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = (instance as any)[key];
    if (key !== "constructor" && typeof value === "function") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (instance as any)[key] = value.bind(instance);
    }
  });
}

function getFontSize(font: string): number {
  const match = font.match(/(\d+)px/);
  return match ? parseInt(match[1], 10) : 30;
}

function createTextTexture(
  gl: GL,
  text: string,
  font: string = "bold 30px monospace",
  color: string = "black"
): { texture: Texture; width: number; height: number } {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not get 2d context");

  context.font = font;
  const metrics = context.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const fontSize = getFontSize(font);
  const textHeight = Math.ceil(fontSize * 1.2);

  canvas.width = textWidth + 20;
  canvas.height = textHeight + 20;

  context.font = font;
  context.fillStyle = color;
  context.textBaseline = "middle";
  context.textAlign = "center";
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: canvas.width, height: canvas.height };
}

// --- WebGL Classes ---

class Title {
  gl: GL;
  plane: Mesh;
  renderer: Renderer;
  text: string;
  textColor: string;
  font: string;
  mesh!: Mesh;

  constructor({
    gl,
    plane,
    renderer,
    text,
    textColor = "#545050",
    font = "30px sans-serif",
  }: TitleProps) {
    autoBind(this);
    this.gl = gl;
    this.plane = plane;
    this.renderer = renderer;
    this.text = text;
    this.textColor = textColor;
    this.font = font;
    this.createMesh();
  }

  createMesh() {
    const { texture, width, height } = createTextTexture(
      this.gl,
      this.text,
      this.font,
      this.textColor
    );
    const geometry = new Plane(this.gl);
    const program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true,
    });
    this.mesh = new Mesh(this.gl, { geometry, program });
    const aspect = width / height;
    const textHeightScaled = this.plane.scale.y * 0.15;
    const textWidthScaled = textHeightScaled * aspect;
    this.mesh.scale.set(textWidthScaled, textHeightScaled, 1);
    this.mesh.position.y =
      -this.plane.scale.y * 0.5 - textHeightScaled * 0.5 - 0.05;
    this.mesh.setParent(this.plane);
  }
}

class Media {
  extra: number = 0;
  geometry: Plane;
  gl: GL;
  service: Service;
  index: number;
  length: number;
  renderer: Renderer;
  scene: Transform;
  screen: { width: number; height: number };
  viewport: { width: number; height: number };
  bend: number;
  program!: Program;
  plane!: Mesh;
  title!: Title;
  scale!: number;
  padding!: number;
  width!: number;
  widthTotal!: number;
  x!: number;
  speed: number = 0;
  isBefore: boolean = false;
  isAfter: boolean = false;

  constructor({ geometry, gl, service, index, length, renderer, scene, screen, viewport, bend }: MediaProps) {
    this.geometry = geometry;
    this.gl = gl;
    this.service = service;
    this.index = index;
    this.length = length;
    this.renderer = renderer;
    this.scene = scene;
    this.screen = screen;
    this.viewport = viewport;
    this.bend = bend;
    this.createShader();
    this.createMesh();
    this.createTitle();
    this.onResize();
  }

  createShader() {
    const { texture } = generateServiceCardTexture(this.gl, this.service, this.index);

    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (0.1 + uSpeed * 0.5);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          gl_FragColor = color;
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uTime: { value: 100 * Math.random() },
        uSpeed: { value: 0 },
      },
      transparent: true,
    });
  }

  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });
    this.plane.setParent(this.scene);
  }

  createTitle() {
    this.title = new Title({
      gl: this.gl,
      plane: this.plane,
      renderer: this.renderer,
      text: "", // Title is baked into texture now
      textColor: "#000",
    });
  }

  update(scroll: { current: number; last: number }, direction: "right" | "left") {
    this.plane.position.x = this.x - scroll.current - this.extra;

    const x = this.plane.position.x;
    const H = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const B_abs = Math.abs(this.bend);
      const R = (H * H + B_abs * B_abs) / (2 * B_abs);
      const effectiveX = Math.min(Math.abs(x), H);

      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
      if (this.bend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R);
      }
    }

    this.speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = this.speed;

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;
    
    if (direction === "right" && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
    if (direction === "left" && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
  }

  onResize({ screen, viewport }: { screen?: { width: number; height: number }; viewport?: { width: number; height: number } } = {}) {
    if (screen) this.screen = screen;
    if (viewport) this.viewport = viewport;

    // Desktop logic only here
    this.plane.scale.x = (this.viewport.width * 400) / this.screen.width;
    this.plane.scale.y = this.plane.scale.x / (600 / 900); 

    this.padding = this.plane.scale.x * 0.2; 
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }
}

class App {
  container: HTMLElement;
  scrollSpeed: number;
  scroll: { ease: number; current: number; target: number; last: number; position?: number };
  onCheckDebounce: (...args: unknown[]) => void;
  renderer!: Renderer;
  gl!: GL;
  camera!: Camera;
  scene!: Transform;
  planeGeometry!: Plane;
  medias: Media[] = [];
  screen!: { width: number; height: number };
  viewport!: { width: number; height: number };
  raf: number = 0;

  isDown: boolean = false;
  start: number = 0;

  boundOnResize!: () => void;
  boundOnWheel!: (e: Event) => void;
  boundOnTouchDown!: (e: MouseEvent | TouchEvent) => void;
  boundOnTouchMove!: (e: MouseEvent | TouchEvent) => void;
  boundOnTouchUp!: () => void;

  constructor(container: HTMLElement, { bend = 1, scrollSpeed = 2, scrollEase = 0.05 }: AppConfig) {
    this.container = container;
    this.scrollSpeed = scrollSpeed;
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
    this.onCheckDebounce = debounce(this.onCheck.bind(this), 200);
    
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.createGeometry();
    this.onResize();
    this.createMedias(bend);
    this.update();
    this.addEventListeners();
  }

  createRenderer() {
    try {
      this.renderer = new Renderer({
        alpha: true,
        antialias: true,
        dpr: Math.min(window.devicePixelRatio || 1, 2),
      });
      this.gl = this.renderer.gl;
      this.gl.clearColor(0, 0, 0, 0);
      
      if (!this.container.querySelector('canvas')) {
        this.container.appendChild(this.renderer.gl.canvas as HTMLCanvasElement);
      }
    } catch (e) {
      console.error("WebGL init failed", e);
    }
  }

  createCamera() {
    if(!this.gl) return;
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }

  createScene() {
    this.scene = new Transform();
  }

  createGeometry() {
    if(!this.gl) return;
    this.planeGeometry = new Plane(this.gl, { heightSegments: 50, widthSegments: 100 });
  }

  createMedias(bend: number) {
    if(!this.gl) return;
    this.medias = services.map((service, index) => {
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        service,
        index,
        length: services.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        viewport: this.viewport,
        bend,
      });
    });
  }

  onResize() {
    if (!this.renderer) return;
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight,
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({ aspect: this.screen.width / this.screen.height });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    
    if (this.medias) {
      this.medias.forEach((media) => media.onResize({ screen: this.screen, viewport: this.viewport }));
    }
  }

  onTouchDown(e: MouseEvent | TouchEvent) {
    this.isDown = true;
    this.scroll.position = this.scroll.current;
    this.start = "touches" in e ? e.touches[0].clientX : e.clientX;
  }

  onTouchMove(e: MouseEvent | TouchEvent) {
    if (!this.isDown) return;
    const x = "touches" in e ? e.touches[0].clientX : e.clientX;
    const distance = (this.start - x) * (this.scrollSpeed * 0.02);
    this.scroll.target = (this.scroll.position ?? 0) + distance;
  }

  onTouchUp() {
    this.isDown = false;
    this.onCheck();
  }

  onWheel(e: Event) {
    const wheelEvent = e as WheelEvent;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const delta = wheelEvent.deltaY || (wheelEvent as any).wheelDelta || (wheelEvent as any).detail;
    this.scroll.target += (delta > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2;
    this.onCheckDebounce();
  }

  onCheck() {
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
    const item = width * itemIndex;
    
    if (this.scroll.target < 0) {
        this.scroll.target = -item;
    } else {
        this.scroll.target = item;
    }
  }

  update() {
    if (!this.renderer) return;
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction = this.scroll.current > this.scroll.last ? "right" : "left";
    if (this.medias) {
      this.medias.forEach((media) => media.update(this.scroll, direction));
    }
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.update.bind(this));
  }

  addEventListeners() {
    this.boundOnResize = this.onResize.bind(this);
    this.boundOnWheel = this.onWheel.bind(this);
    this.boundOnTouchDown = this.onTouchDown.bind(this);
    this.boundOnTouchMove = this.onTouchMove.bind(this);
    this.boundOnTouchUp = this.onTouchUp.bind(this);
    
    window.addEventListener("resize", this.boundOnResize);
    window.addEventListener("wheel", this.boundOnWheel);
    window.addEventListener("mousedown", this.boundOnTouchDown);
    window.addEventListener("mousemove", this.boundOnTouchMove);
    window.addEventListener("mouseup", this.boundOnTouchUp);
    window.addEventListener("touchstart", this.boundOnTouchDown);
    window.addEventListener("touchmove", this.boundOnTouchMove);
    window.addEventListener("touchend", this.boundOnTouchUp);
  }

  destroy() {
    window.cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.boundOnResize);
    window.removeEventListener("wheel", this.boundOnWheel);
    window.removeEventListener("mousedown", this.boundOnTouchDown);
    window.removeEventListener("mousemove", this.boundOnTouchMove);
    window.removeEventListener("mouseup", this.boundOnTouchUp);
    window.removeEventListener("touchstart", this.boundOnTouchDown);
    window.removeEventListener("touchmove", this.boundOnTouchMove);
    window.removeEventListener("touchend", this.boundOnTouchUp);
    
    if (this.renderer && this.renderer.gl) {
      const gl = this.renderer.gl;
      const canvas = gl.canvas as HTMLCanvasElement;
      
      const loseContextExt = gl.getExtension('WEBGL_lose_context');
      if (loseContextExt) {
        loseContextExt.loseContext();
      }

      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }
  }
}

// --- Desktop Gallery Component ---
const DesktopGallery = ({ bend = 3, scrollSpeed = 2, scrollEase = 0.05 }: CircularGalleryProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    const app = new App(containerRef.current, { bend, scrollSpeed, scrollEase });
    return () => app.destroy();
  }, [bend, scrollSpeed, scrollEase]);

  return <div className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing" ref={containerRef} />;
};

// =========================================
// 3. MAIN EXPORT (Conditional Rendering)
// =========================================

export default function ServicesSection() {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // Use Mobile View for < 1024px
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section id="services" className="w-full bg-slate-50 relative py-16 md:py-20">
      <div className="absolute top-10 left-0 w-full text-center z-10 pointer-events-none px-4">
         <h2 className="text-4xl md:text-6xl font-black text-black uppercase tracking-widest">Services</h2>
         <p className="text-sm font-bold text-slate-400 mt-2">
            {isMobile ? "Swipe to Explore" : "Drag to Explore"}
         </p>
      </div>

      {isMobile ? (
        // Mobile Layout (Horizontal Manual Slide)
        <div className="mt-24">
          <MobileServices />
        </div>
      ) : (
        // Desktop Layout (WebGL Gallery)
        <div style={{ height: "800px", position: "relative" }}>
          <DesktopGallery bend={3} scrollEase={0.05} />
        </div>
      )}
    </section>
  );
}