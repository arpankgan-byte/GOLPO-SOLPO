'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion';
import ghost from './ghost-404.png';

const ease = [0.43, 0.13, 0.23, 0.96] as const;

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease, delayChildren: 0.1, staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const numberVariants: Variants = {
  hidden: (direction: number) => ({ opacity: 0, x: direction * 40, y: 15, rotate: direction * 5 }),
  visible: { opacity: 0.7, x: 0, y: 0, rotate: 0, transition: { duration: 0.8, ease } },
};

const ghostVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0, y: 15, rotate: -5 },
  visible: { scale: 1, opacity: 1, y: 0, rotate: 0, transition: { duration: 0.6, ease } },
  floating: {
    y: [-5, 5],
    transition: { y: { duration: 2, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' } },
  },
};

function GhostIllustration() {
  return (
    <Image
      src={ghost}
      alt="Ghost"
      width={120}
      height={120}
      className="h-20 w-20 select-none object-contain md:h-[120px] md:w-[120px]"
      draggable={false}
      priority
    />
  );
}

export function NotFound() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-10 text-center text-[#222222]">
      <AnimatePresence mode="wait">
        <motion.main
          className="w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <div className="mb-8 flex items-center justify-center gap-4 md:mb-12 md:gap-6" aria-label="404">
            <motion.span className="select-none text-[80px] font-bold leading-none text-[#222222] opacity-70 md:text-[120px]" variants={numberVariants} custom={-1}>
              4
            </motion.span>
            <motion.div
              variants={ghostVariants}
              initial="hidden"
              animate={reduceMotion ? 'visible' : ['visible', 'floating']}
              whileHover={reduceMotion ? undefined : { scale: 1.1, y: -10, rotate: [0, -5, 5, -5, 0] }}
            >
              <GhostIllustration />
            </motion.div>
            <motion.span className="select-none text-[80px] font-bold leading-none text-[#222222] opacity-70 md:text-[120px]" variants={numberVariants} custom={1}>
              4
            </motion.span>
          </div>

          <motion.h1 className="mb-4 text-3xl font-bold text-[#222222] opacity-70 md:mb-6 md:text-5xl" variants={itemVariants}>
            Boo! Page missing!
          </motion.h1>
          <motion.p className="mb-8 text-lg text-[#222222] opacity-50 md:mb-12 md:text-xl" variants={itemVariants}>
            Whoops! This page must be a ghost — it’s not here!
          </motion.p>

          <motion.div variants={itemVariants} whileHover={reduceMotion ? undefined : { scale: 1.05, transition: { duration: 0.3, ease } }}>
            <Link href="/" className="inline-block rounded-full bg-[#222222] px-8 py-3 text-lg font-medium text-white transition-colors hover:bg-black">
              Find shelter
            </Link>
          </motion.div>

          <motion.details className="mx-auto mt-12 text-sm text-[#222222] opacity-50" variants={itemVariants}>
            <summary className="inline-block cursor-pointer underline underline-offset-4 hover:opacity-80">What means 404?</summary>
            <p className="mx-auto mt-3 max-w-lg">A 404 means the address doesn’t point to a page on this site. It may be mistyped or the page may have been removed.</p>
            <p className="mt-2">
              <Link className="underline underline-offset-4" href="/home">Explore the menu</Link>
              {' · '}
              <Link className="underline underline-offset-4" href="/order/">Order online</Link>
            </p>
          </motion.details>
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
