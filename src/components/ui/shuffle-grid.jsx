"use client"

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import PropTypes from 'prop-types';

export const ShuffleHero = ({ badge, title, description, buttonText, onButtonClick }) => {
  return (
    <section className="w-full px-8 py-8 md:py-12 grid grid-cols-1 md:grid-cols-2 items-center gap-12 max-w-7xl mx-auto">
      <div>
        <span className="block mb-4 text-xs md:text-sm text-primary font-bold uppercase tracking-widest">
          {badge || "Better every day"}
        </span>
        <h3 className="text-5xl md:text-7xl font-bold text-foreground leading-[1.1] tracking-tight">
          {title || "Let's change it up a bit"}
        </h3>
        <p className="text-lg md:text-xl text-muted-foreground my-6 md:my-8 max-w-lg leading-relaxed">
          {description || "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nam nobis in error repellat voluptatibus ad."}
        </p>
        <button 
          onClick={onButtonClick}
          className={cn(
            "bg-primary text-primary-foreground font-semibold py-4 px-8 rounded-full text-lg",
            "transition-all hover:bg-primary/90 active:scale-95 shadow-lg shadow-primary/20",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
        >
          {buttonText || "Find a class"}
        </button>
      </div>
      <ShuffleGrid />
    </section>
  );
};

ShuffleHero.propTypes = {
  badge: PropTypes.string,
  title: PropTypes.node,
  description: PropTypes.string,
  buttonText: PropTypes.string,
  onButtonClick: PropTypes.func
};

const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

const squareData = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1523050335456-470682773273?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 11,
    src: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 12,
    src: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 13,
    src: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 14,
    src: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 15,
    src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 16,
    src: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80",
  },
];

const generateSquares = () => {
  return shuffle([...squareData]).map((sq) => (
    <motion.div
      key={sq.id}
      layout
      transition={{ duration: 1.5, type: "spring" }}
      className="w-full h-full rounded-2xl overflow-hidden bg-muted border border-border/50"
      style={{
        backgroundImage: `url(${sq.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    ></motion.div>
  ));
};

const ShuffleGrid = () => {
  const timeoutRef = useRef(null);
  const [squares, setSquares] = useState(generateSquares());

  useEffect(() => {
    shuffleSquares();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const shuffleSquares = () => {
    setSquares(generateSquares());
    timeoutRef.current = setTimeout(shuffleSquares, 3000);
  };

  return (
    <div className="grid grid-cols-4 grid-rows-4 h-[450px] md:h-[600px] gap-2">
      {squares.map((sq) => sq)}
    </div>
  );
};
