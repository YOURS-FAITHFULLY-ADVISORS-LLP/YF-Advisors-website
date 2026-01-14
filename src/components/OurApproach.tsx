"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { 
  motion, 
  PanInfo, 
  useMotionValue, 
  useTransform, 
  type MotionValue, 
  type Transition 
} from 'motion/react';
import React, { JSX } from 'react';

// Imported specific icons
import { 
  Users, 
  Lightbulb, 
  Target, 
  Sparkles, 
  Check 
} from 'lucide-react'; // Using lucide-react as requested in your previous snippet context

export interface CarouselItem {
  id: number;
  title: string;
  description?: string; // Optional because some cards have points instead
  points?: string[];    // Added for Vision/Mission
  icon: React.ReactNode;
}

export interface CarouselProps {
  items?: CarouselItem[];
  baseWidth?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
  round?: boolean;
}

// --- UPDATED DATA SECTION ---
const CONTENT_ITEMS: CarouselItem[] = [
  {
    id: 1,
    title: "Who We Are",
    description: "A powerhouse team of 10+ partners and 50+ experts—including Chartered Accountants, Company Secretaries, and Legal Advocates—delivering excellence from India and Dubai.",
    icon: <Users className="h-6 w-6 text-white" />,
  },
  {
    id: 2,
    title: "Our Vision",
    points: [
      "Building seamless 'lean' cultures.",
      "Prioritizing absolute client trust.",
      "Providing flexible, 24/7 global support.",
    ],
    icon: <Lightbulb className="h-6 w-6 text-white" />,
  },
  {
    id: 3,
    title: "Our Mission",
    points: [
      "Turning innovative ideas into reality.",
      "Setting the standard for pro services.",
      "Delivering work teams are proud of.",
    ],
    icon: <Target className="h-6 w-6 text-white" />,
  },
  {
    id: 4,
    title: "Why Choose Us?",
    description: "We offer a fresh, practical approach to tax planning and financial maintenance. Our solutions are customized, innovative, and cost-effective—designed to make your life simpler.",
    icon: <Sparkles className="h-6 w-6 text-white" />,
  }
];

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: 'spring' as const, stiffness: 300, damping: 30 };

interface CarouselItemProps {
  item: CarouselItem;
  index: number;
  itemWidth: number;
  round: boolean;
  trackItemOffset: number;
  x: MotionValue<number>;
  transition: Transition;
}

function CarouselItem({ item, index, itemWidth, round, trackItemOffset, x, transition }: CarouselItemProps) {
  const range = [-(index + 1) * trackItemOffset, -index * trackItemOffset, -(index - 1) * trackItemOffset];
  const outputRange = [90, 0, -90];
  const rotateY = useTransform(x, range, outputRange, { clamp: false });

  return (
    <motion.div
      key={`${item?.id ?? index}-${index}`}
      className={`relative shrink-0 flex flex-col ${
        round
          ? 'items-center justify-center text-center bg-[#002B49] border-0'
          : 'items-start justify-between bg-[#002B49] border border-[#00A79D]/30 rounded-3xl shadow-xl hover:shadow-[#00A79D]/20 transition-shadow duration-300'
      } overflow-hidden cursor-grab active:cursor-grabbing`}
      style={{
        width: itemWidth,
        height: round ? itemWidth : '100%',
        rotateY: rotateY,
        ...(round && { borderRadius: '50%' })
      }}
      transition={transition}
    >
      <div className={`${round ? 'p-0 m-0' : 'mb-4 p-8 pb-0'}`}>
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00A79D]/20 border border-[#00A79D]/30">
          {item.icon}
        </span>
      </div>
      <div className="p-8 pt-4 w-full">
        <div className="mb-3 font-bold text-xl text-white">{item.title}</div>
        
        {/* Render Description or Bullet Points based on content */}
        {item.points ? (
          <ul className="space-y-3">
            {item.points.map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="mt-1 p-0.5 rounded-full bg-[#00A79D]/20 text-[#00A79D]">
                  <Check size={12} strokeWidth={3} />
                </div>
                <span className="text-sm text-slate-300 leading-snug">{point}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-300 leading-relaxed">
            {item.description}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default function Carousel({
  items = CONTENT_ITEMS,
  baseWidth = 350,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  loop = false,
  round = false
}: CarouselProps): JSX.Element {
  const containerPadding = 16;
  const itemWidth = baseWidth - containerPadding * 2;
  const trackItemOffset = itemWidth + GAP;
  
  const itemsForRender = useMemo(() => {
    if (!loop) return items;
    if (items.length === 0) return [];
    return [items[items.length - 1], ...items, items[0]];
  }, [items, loop]);

  const [position, setPosition] = useState<number>(loop ? 1 : 0);
  
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const startingPosition = loop ? 1 : 0;
    x.set(-startingPosition * trackItemOffset);
  }, [loop, trackItemOffset, x]); 

  useEffect(() => {
    if (pauseOnHover && containerRef.current) {
      const container = containerRef.current;
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [pauseOnHover]);

  useEffect(() => {
    if (!autoplay || itemsForRender.length <= 1) return undefined;
    if (pauseOnHover && isHovered) return undefined;

    const timer = setInterval(() => {
      setPosition(prev => {
        return prev + 1;
      });
    }, autoplayDelay);

    return () => clearInterval(timer);
  }, [autoplay, autoplayDelay, isHovered, pauseOnHover, itemsForRender.length]);

  const effectiveTransition = isJumping ? { duration: 0 } : SPRING_OPTIONS;

  const handleAnimationStart = () => {
    setIsAnimating(true);
  };

  const handleAnimationComplete = () => {
    if (!loop || itemsForRender.length <= 1) {
      setIsAnimating(false);
      return;
    }
    
    const lastCloneIndex = itemsForRender.length - 1;

    if (position >= lastCloneIndex) {
      setIsJumping(true);
      const target = 1;
      setPosition(target);
      x.set(-target * trackItemOffset);
      requestAnimationFrame(() => {
        setIsJumping(false);
        setIsAnimating(false);
      });
      return;
    }

    if (position <= 0) {
      setIsJumping(true);
      const target = items.length;
      setPosition(target);
      x.set(-target * trackItemOffset);
      requestAnimationFrame(() => {
        setIsJumping(false);
        setIsAnimating(false);
      });
      return;
    }

    setIsAnimating(false);
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void => {
    const { offset, velocity } = info;
    const direction =
      offset.x < -DRAG_BUFFER || velocity.x < -VELOCITY_THRESHOLD
        ? 1
        : offset.x > DRAG_BUFFER || velocity.x > VELOCITY_THRESHOLD
          ? -1
          : 0;

    if (direction === 0) return;

    setPosition(prev => {
      return prev + direction;
    });
  };

  const dragProps = loop
    ? {}
    : {
        dragConstraints: {
          left: -trackItemOffset * Math.max(itemsForRender.length - 1, 0),
          right: 0
        }
      };

  const activeIndex =
    items.length === 0 
      ? 0 
      : loop 
        ? (position - 1 + items.length) % items.length 
        : Math.min(Math.max(0, position), items.length - 1);

  return (
    <div className="flex flex-col items-center justify-center w-full py-16 bg-white">
      <div className="text-center mb-10">
        <h3 className="text-sm font-bold tracking-widest text-[#00A79D] uppercase mb-2">
          About YF Advisors
        </h3>
        <h2 className="text-3xl md:text-4xl font-bold text-[#002B49]">
          15+ Years of Excellence
        </h2>
      </div>
      
      <div
        ref={containerRef}
        className={`relative overflow-hidden p-4 ${
          round ? 'rounded-full border border-slate-200' : ''
        }`}
        style={{
          width: `${baseWidth}px`,
          ...(round && { height: `${baseWidth}px` })
        }}
      >
        <motion.div
          className="flex"
          drag={isAnimating ? false : 'x'}
          {...dragProps}
          style={{
            width: itemWidth,
            gap: `${GAP}px`,
            perspective: 1000,
            perspectiveOrigin: `${position * trackItemOffset + itemWidth / 2}px 50%`,
            x
          }}
          onDragEnd={handleDragEnd}
          animate={{ x: -(position * trackItemOffset) }}
          transition={effectiveTransition}
          onAnimationStart={handleAnimationStart}
          onAnimationComplete={handleAnimationComplete}
        >
          {itemsForRender.map((item, index) => (
            <CarouselItem
              key={`${item?.id ?? index}-${index}`}
              item={item}
              index={index}
              itemWidth={itemWidth}
              round={round}
              trackItemOffset={trackItemOffset}
              x={x}
              transition={effectiveTransition}
            />
          ))}
        </motion.div>
      </div>

      {/* Pagination Dots */}
      <div className="flex w-full justify-center mt-8">
        <div className="flex gap-2">
          {items.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2.5 w-2.5 rounded-full cursor-pointer transition-colors duration-200 ${
                activeIndex === index
                  ? 'bg-[#00A79D]'
                  : 'bg-slate-300 hover:bg-slate-400'
              }`}
              animate={{
                scale: activeIndex === index ? 1.2 : 1
              }}
              onClick={() => setPosition(loop ? index + 1 : index)}
              transition={{ duration: 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}