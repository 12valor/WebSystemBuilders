export function HowItWorksSection() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto w-[min(calc(100%-40px),1280px)] md:w-[min(calc(100%-64px),1280px)] xl:w-[min(calc(100%-96px),1280px)]">
        <div className="text-center">
          <span className="text-xs font-semibold tracking-wider text-[#2563EB] uppercase">Simple Step-by-Step</span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl lg:text-5xl">
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[#6B7280] sm:text-lg">
            From initial exploration to secure file delivery and post-purchase technical support, our process is simple and transparent.
          </p>
        </div>

        {/* Horizontal Timeline Process Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {steps.map((step, index) => (
            <div
              key={step.num}
              className="relative flex flex-col justify-between rounded-[20px] border border-[#E5E7EB] bg-white p-6 shadow-xs transition-all hover:border-[#2563EB]/40 hover:shadow-md"
            >
              {/* Step Number Circle */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-base font-bold text-[#2563EB]">
                    {step.num}
                  </span>
                  {index < steps.length - 1 && (
                    <span className="hidden text-gray-300 xl:block" aria-hidden="true">
                      &rarr;
                    </span>
                  )}
                </div>

                <h3 className="mt-5 text-lg font-bold text-[#111827]">{step.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-[#6B7280]">{step.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F1F5F9] text-[0.7rem] font-semibold text-[#2563EB]">
                Step {step.num} of 6
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  {
    num: "1",
    title: "Browse",
    desc: "Explore ready-made software or select custom development tailored for students or business.",
  },
  {
    num: "2",
    title: "Preview",
    desc: "Review screenshots, features, requirements, database inclusions, and demo details.",
  },
  {
    num: "3",
    title: "Purchase / Quote",
    desc: "Checkout securely via PayMongo or submit a detailed custom development quote request.",
  },
  {
    num: "4",
    title: "Development",
    desc: "Instant file generation for ready-made systems or milestone development for custom builds.",
  },
  {
    num: "5",
    title: "Delivery",
    desc: "Receive encrypted, expiring download access for source code and documentation.",
  },
  {
    num: "6",
    title: "Support",
    desc: "Access 30 calendar days of installation support, bug fixes, and setup guidance.",
  },
];
