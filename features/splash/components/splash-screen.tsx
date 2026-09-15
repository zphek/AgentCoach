"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import { APP_NAME, APP_TAGLINE, APP_FOOTER } from "@/lib/constants";
import { Heart } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

export function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/home");
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
      {/* Subtle Top Gradient */}
      <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-edge relative z-10">
        {/* Logo Container */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="w-32 h-32 bg-white rounded-3xl shadow-[0_8px_24px_rgba(0,0,0,0.04)] flex items-center justify-center mb-stack-lg"
        >
          <Logo size={64} />
        </motion.div>

        {/* Brand Name */}
        <motion.h1
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={0.1}
          className="text-[40px] leading-[48px] tracking-[-0.02em] font-bold text-primary text-center mb-stack-sm"
        >
          {APP_NAME}
        </motion.h1>

        {/* Tagline */}
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={0.2}
          className="text-[18px] leading-[28px] text-outline text-center"
        >
          {APP_TAGLINE}
        </motion.p>

        {/* Loading Dots */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={0.3}
          className="mt-stack-xl flex space-x-2"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-primary/20"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={0.4}
        className="pb-10 pt-4 px-edge w-full flex justify-center relative z-10"
      >
        <p className="text-[12px] leading-[16px] font-semibold text-secondary flex items-center opacity-70">
          Made with{" "}
          <Heart
            size={14}
            className="mx-1 text-tertiary-fixed-dim fill-tertiary-fixed-dim"
          />{" "}
          by Bernardo
        </p>
      </motion.div>

      {/* Subtle Bottom Gradient */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-surface to-transparent pointer-events-none" />
    </>
  );
}
