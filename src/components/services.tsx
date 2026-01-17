"use client";

import React, { useRef, useEffect, useState } from "react";
import { Renderer, Camera, Transform, Plane, Mesh, Program, Texture, Raycast, Vec2 } from "ogl";
import { ArrowRight, LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";

// --- IMPORT DATA ---
// Ensure this path matches where your data.ts file actually lives.
// Based on your screenshot, it seems to be in src/data/services/data.ts
import { servicesData } from "../data/services/data"; 

// --- Types ---
type GL = Renderer["gl"];

interface Service {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
  description: string;
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

interface CircularGalleryProps {
  bend?: number;
  scrollSpeed?: number;
  scrollEase?: number;
}

// --- NEW: Missing type definitions ---
interface TitleProps {
  gl: GL;
  plane: Mesh;
  renderer: Renderer;
  text: string;
  textColor?: string;
  font?: string;
}

interface AppConfig {
  bend?: number;
  scrollSpeed?: number;
  scrollEase?: number;
}

interface RaycastHit {
  distance: number;
  point: Vec2;
  [key: string]: unknown;
}

// --- DATA MAPPING ---
// Map your rich data to the simple format needed for the slider
const services: Service[] = servicesData.map((s) => ({
  id: s.id,
  title: s.title,
  icon: s.icon,
  color: s.color,
  description: s.shortDescription, 
}));

// =========================================
// 1. MOBILE VIEW COMPONENT
// =========================================

const MobileServices = () => {
  const router = useRouter();

  const handleReadMore = (id: string) => {
    // This string MUST match the folder structure in src/app/
    router.push(`/services/${id}`);
  };

  return (
    <div className="w-full overflow-x-auto pb-10 pt-4 px-6 scrollbar-hide snap-x snap-mandatory flex gap-6">
      {services.map((service, index) => {
        const Icon = service.icon;
        return (
          <div
            key={service.id}
            className="snap-center shrink-0 w-[85vw] max-w-[320px] bg-white rounded-2xl p-8 shadow-lg border border-slate-100 relative overflow-hidden group flex flex-col"
          >
            {/* Background Number */}
            <span className="absolute -top-4 -right-2 text-[8rem] font-bold text-slate-50 opacity-50 select-none z-0">
              {(index + 1).toString().padStart(2, '0')}
            </span>

            <div className="relative z-10 flex flex-col h-full">
              {/* Icon Container */}
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm shrink-0"
                style={{ backgroundColor: service.color + "15" }} 
              >
                <Icon size={28} color={service.color} strokeWidth={2} />
              </div>

              {/* Text Content */}
              <h3 className="text-2xl font-bold text-slate-900 mb-3 leading-tight">
                {service.title}
              </h3>
              <p className="text-base text-slate-600 font-medium leading-relaxed line-clamp-4 mb-6 grow">
                {service.description}
              </p>
              
              {/* Read More Button */}
              <button 
                onClick={() => handleReadMore(service.id)}
                className="group/btn flex items-center gap-2 text-sm font-bold uppercase tracking-wider py-3 px-0 bg-transparent border-none cursor-pointer transition-all hover:gap-3"
                style={{ color: service.color }}
              >
                Read More
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        );
      })}
      <div className="w-2 shrink-0" />
    </div>
  );
};

// =========================================
// 2. DESKTOP VIEW COMPONENT (WebGL Logic)
// =========================================

function generateServiceCardTexture(gl: GL, service: Service, index: number) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  const width = 600; 
  const height = 900; 
  canvas.width = width;
  canvas.height = height;

  if (ctx) {
    // Card Background
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(0, 0, width, height, 40);
    ctx.fill();
    
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 6; 
    ctx.stroke();

    // Big Index Number
    ctx.font = 'bold 100px sans-serif';
    ctx.fillStyle = '#f1f5f9'; 
    ctx.textAlign = 'right';
    ctx.fillText((index + 1).toString().padStart(2, '0'), width - 40, 130);

    // Icon Box Background
    ctx.fillStyle = service.color + '20'; 
    ctx.beginPath();
    ctx.roundRect(40, 50, 90, 90, 20);
    ctx.fill();
    
    // Icon Placeholder
    ctx.font = 'bold 40px sans-serif';
    ctx.fillStyle = service.color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✦', 85, 95);

    // Title
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

    // Description
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

    // "Read More" Button Visuals
    const btnY = height - 120;
    const btnHeight = 60;
    const btnWidth = 220;
    
    ctx.fillStyle = service.color;
    ctx.beginPath();
    ctx.roundRect(40, btnY, btnWidth, btnHeight, 30);
    ctx.fill();

    ctx.font = 'bold 24px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('READ MORE →', 40 + (btnWidth / 2), btnY + (btnHeight / 2));
    
    // Bottom Label
    ctx.textAlign = 'right';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText('PROFESSIONAL SERVICES', width - 40, height - 50);
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

// --- WebGL Helper Classes ---

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
  }
  createMesh() { /* Text is baked into texture, no mesh needed */ }
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
    
    // --- KEY FIX FOR CLICKING ---
    // Attach the ID to the mesh so we can find it when we click
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.plane as any)._serviceId = this.service.id;
    
    this.plane.setParent(this.scene);
  }

  createTitle() {
    this.title = new Title({
      gl: this.gl,
      plane: this.plane,
      renderer: this.renderer,
      text: "",
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
  
  // Router instance
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  router: any;

  // Interaction variables
  raycast!: Raycast;
  mouse!: Vec2;
  clickStart: { x: number, y: number } = { x: 0, y: 0 };
  isDown: boolean = false;
  start: number = 0;

  boundOnResize!: () => void;
  boundOnWheel!: (e: Event) => void;
  boundOnTouchDown!: (e: MouseEvent | TouchEvent) => void;
  boundOnTouchMove!: (e: MouseEvent | TouchEvent) => void;
  boundOnTouchUp!: (e: MouseEvent | TouchEvent) => void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(container: HTMLElement, { bend = 1, scrollSpeed = 2, scrollEase = 0.05 }: AppConfig, router: any) {
    this.container = container;
    this.scrollSpeed = scrollSpeed;
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
    this.onCheckDebounce = debounce(this.onCheck.bind(this), 200);
    this.router = router;
    
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.createGeometry();
    this.createInteraction();
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

  createInteraction() {
    if(!this.gl) return;
    this.raycast = new Raycast();
    this.mouse = new Vec2();
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

  updateMouse(e: MouseEvent | TouchEvent) {
    const x = "touches" in e ? e.touches[0].clientX : e.clientX;
    const y = "touches" in e ? e.touches[0].clientY : e.clientY;
    
    // Normalize mouse coordinates for Raycast (-1 to +1)
    const rect = this.renderer.gl.canvas.getBoundingClientRect();
    const localX = x - rect.left;
    const localY = y - rect.top;

    this.mouse.set(
      (localX / this.renderer.width) * 2 - 1,
      -(localY / this.renderer.height) * 2 + 1
    );
  }

  onTouchDown(e: MouseEvent | TouchEvent) {
    this.isDown = true;
    this.scroll.position = this.scroll.current;
    this.start = "touches" in e ? e.touches[0].clientX : e.clientX;
    const startY = "touches" in e ? e.touches[0].clientY : e.clientY;
    
    // Track click vs drag
    this.clickStart = { x: this.start, y: startY };
    this.updateMouse(e);
  }

  onTouchMove(e: MouseEvent | TouchEvent) {
    if (!this.isDown) return;
    const x = "touches" in e ? e.touches[0].clientX : e.clientX;
    const distance = (this.start - x) * (this.scrollSpeed * 0.02);
    this.scroll.target = (this.scroll.position ?? 0) + distance;
  }

  onTouchUp(e: MouseEvent | TouchEvent) {
    this.isDown = false;
    this.onCheck();
    
    // Calculate if user dragged or clicked
    const endX = "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
    const endY = "changedTouches" in e ? e.changedTouches[0].clientY : e.clientY;
    
    const dist = Math.sqrt(Math.pow(endX - this.clickStart.x, 2) + Math.pow(endY - this.clickStart.y, 2));
    
    // If moved less than 5px, treat as a click
    if (dist < 5) {
        this.handleClick(e);
    }
  }
  
  handleClick(e: MouseEvent | TouchEvent) {
     if(!this.raycast || !this.medias) return;
     
     const x = "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
     const y = "changedTouches" in e ? e.changedTouches[0].clientY : e.clientY;
     const rect = this.renderer.gl.canvas.getBoundingClientRect();
     
     this.mouse.set(
       ((x - rect.left) / this.renderer.width) * 2 - 1,
       -((y - rect.top) / this.renderer.height) * 2 + 1
     );

     this.raycast.castMouse(this.camera, this.mouse);
     
     const meshes = this.medias.map(m => m.plane);
     const hits = this.raycast.intersectBounds(meshes) as unknown as RaycastHit[];

     if(hits && hits.length) {
         hits.sort((a, b) => a.distance - b.distance);
         const hitMesh = hits[0] as unknown as Mesh;
         // Retrieve the ID stored on the mesh
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         const id = (hitMesh as any)._serviceId;
         
         if(id) {
             // --- NAVIGATE ---
             this.router.push(`/services/${id}`);
         }
     }
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
  const router = useRouter(); // Use Router
  
  useEffect(() => {
    if (!containerRef.current) return;
    // Pass router to the App logic
    const app = new App(containerRef.current, { bend, scrollSpeed, scrollEase }, router);
    return () => app.destroy();
  }, [bend, scrollSpeed, scrollEase, router]);

  return <div className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing" ref={containerRef} />;
};

// =========================================
// 3. MAIN EXPORT
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
            {isMobile ? "Swipe to Explore" : "Drag to Explore • Click Card for Details"}
         </p>
      </div>

      {isMobile ? (
        // Mobile Layout
        <div className="mt-24">
          <MobileServices />
        </div>
      ) : (
        // Desktop Layout
        <div style={{ height: "800px", position: "relative" }}>
          <DesktopGallery bend={3} scrollEase={0.05} />
        </div>
      )}
    </section>
  );
}