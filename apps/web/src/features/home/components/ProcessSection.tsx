import { SectionHeading } from '@/shared/components/ui'

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Discover & Strategize',
    subtitle: 'Clarity before execution',
    description:
      'We deconstruct your domain requirements, target customer psychographics, and technical constraints to establish a razor-sharp tactical roadmap.',
  },
  {
    step: '02',
    title: 'Architect & Design',
    subtitle: 'Form follows intelligence',
    description:
      'Wireframing interactive flows, structuring high-integrity systems, and designing cinema-grade visual treatments with comprehensive token design systems.',
  },
  {
    step: '03',
    title: 'Engineer & Produce',
    subtitle: 'Zero compromise craft',
    description:
      'Pixel-level frontend engineering, resilient database architecture, multi-agent AI pipeline builds, and calibrated 4K/6K production shoots.',
  },
  {
    step: '04',
    title: 'Deploy & Accelerate',
    subtitle: 'Measured real-world impact',
    description:
      'Systematic testing, multi-environment deployment, telemetry monitoring, and ongoing optimization cycles designed to generate qualified business results.',
  },
] as const

export function ProcessSection() {
  return (
    <section id="process" className="section-gap relative bg-[#08090B]">
      <div className="container-main">
        <SectionHeading
          label="Our Delivery Philosophy"
          title="Engineered for Precision and Repeatable Quality"
          titleHighlight="Precision and Repeatable"
          description="A structured four-step methodology that unites conceptual ingenuity with strict technical rigor."
          align="center"
        />

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PROCESS_STEPS.map((step) => (
            <div
              key={step.step}
              className="relative p-6 rounded-xl bg-[#12151A] border border-[#252A33] flex flex-col justify-between"
            >
              {/* Step Counter */}
              <div>
                <span className="font-mono text-3xl font-bold text-[#D6B77A]/40 block mb-4">
                  {step.step}
                </span>
                <h3 className="font-heading font-bold text-lg text-[#F0EDE8]">
                  {step.title}
                </h3>
                <p className="text-xs font-mono text-[#D6B77A] mt-1 mb-3">
                  {step.subtitle}
                </p>
                <p className="text-xs text-[#9AA0AB] leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Indicator bar */}
              <div className="mt-6 pt-4 border-t border-[#1C2028]">
                <div className="w-8 h-1 bg-[#D6B77A]/30 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

