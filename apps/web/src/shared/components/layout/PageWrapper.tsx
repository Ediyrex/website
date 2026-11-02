'use client'

import { motion, AnimatePresence } from 'motion/react'
import { usePathname } from 'next/navigation'

interface PageWrapperProps {
  children: React.ReactNode
}

const variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

export function PageWrapper({ children }: PageWrapperProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{
          duration: 0.3,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

