"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

interface FeatureCard {
  title: string;
  description: string;
  gifSrc: string;
  gifAlt: string;
}

const features: FeatureCard[] = [
  {
    title: "Ready-to-Use Systems",
    description: "Browse complete systems built for real projects and businesses.",
    gifSrc: "/gifs/system-solid-1388-grid-bento-hover-pinch.gif",
    gifAlt: "Ready to use systems modular catalog illustration",
  },
  {
    title: "Made for Any Screen",
    description: "Clean, responsive experiences across desktop, tablet and mobile.",
    gifSrc: "/gifs/system-solid-478-desktop-hover-pinch.gif",
    gifAlt: "Responsive screens and multi-device display illustration",
  },
  {
    title: "Built Around Your Needs",
    description: "Customize features, branding and workflows to match your requirements.",
    gifSrc: "/gifs/system-solid-409-wrench-hover-pinch.gif",
    gifAlt: "System customization and configuration tool illustration",
  },
  {
    title: "Secure Cloud Data",
    description: "Modern authentication, databases and secure cloud-based storage.",
    gifSrc: "/gifs/system-solid-1-cloud-hover-pinch.gif",
    gifAlt: "Secure cloud database and modern storage illustration",
  },
  {
    title: "Fast Project Delivery",
    description: "Go from an idea to a working system without starting from zero.",
    gifSrc: "/gifs/system-solid-45-clock-loop-cycle.gif",
    gifAlt: "Rapid project delivery and turnaround illustration",
  },
  {
    title: "Support That’s Human",
    description: "Get direct help before, during and after your system is delivered.",
    gifSrc: "/gifs/system-solid-27-globe-loop-cycle.gif",
    gifAlt: "Human-centric technical support and reach illustration",
  },
];

export function AnimatedFeaturesSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="animated-features-heading"
      className="border-b border-slate-200/80 bg-[#FAFAFC] py-14 sm:py-18 lg:py-24 font-sans text-slate-900 overflow-hidden"
    >
      <div className="mx-auto w-[min(calc(100%-32px),1280px)] md:w-[min(calc(100%-64px),1280px)]">
        {/* Section Header */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl will-change-transform"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50/80 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
            <span className="text-blue-600" aria-hidden="true">✦</span>
            Platform Advantages
          </div>
          <h2
            id="animated-features-heading"
            className="mt-3 font-heading text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl lg:text-4xl leading-[1.15]"
          >
            Everything you need to get started.
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-slate-600 sm:mt-3.5 sm:text-base md:text-lg max-w-xl">
            From ready-made systems to custom development and ongoing support, we make building your next system simpler.
          </p>
        </motion.div>

        {/* 6 Animated Feature Cards Grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 lg:mt-12">
          {features.map((feature, index) => (
            <motion.article
              key={feature.title}
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
                delay: reduceMotion ? 0 : index * 0.08,
              }}
              className="group flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none will-change-transform"
            >
              {/* Illustration Frame */}
              <div className="relative flex h-40 sm:h-44 w-full items-center justify-center rounded-xl sm:rounded-2xl border border-slate-100 bg-slate-50/80 p-5 transition-colors duration-200 group-hover:bg-slate-50">
                <div className="relative size-20 sm:size-22 transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none">
                  <Image
                    src={feature.gifSrc}
                    alt={feature.gifAlt}
                    fill
                    unoptimized
                    sizes="96px"
                    className="object-contain select-none pointer-events-none"
                  />
                </div>
              </div>

              {/* Title and Description */}
              <div className="mt-5 sm:mt-6">
                <h3 className="font-heading text-base sm:text-lg font-bold tracking-tight text-slate-950">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-600">
                  {feature.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
