import React from 'react';

const testimonials = [
  {
    name: 'Alex Rivera',
    handle: '@alex_codes',
    quote: "The easiest way to split our office's software subscriptions. The setup was instant and completely secure. Highly recommended for any team.",
    avatarGradient: 'from-blue-400 to-indigo-500',
  },
  {
    name: 'Samantha Lee',
    handle: '@samantha',
    quote: "Finally, no more chasing friends for money or sharing passwords. Splitup handles everything. It's a total game-changer for our friend group!",
    avatarGradient: 'from-green-400 to-cyan-500',
  },
  {
    name: 'David Chen',
    handle: '@david_chen',
    quote: "I was skeptical at first, but the process is incredibly smooth and transparent. We're saving a ton on family streaming plans.",
    avatarGradient: 'from-amber-400 to-orange-500',
  },
  {
    name: 'Maria Garcia',
    handle: '@mariag',
    quote: "As a student, every dollar counts. Splitup lets me access premium tools for a fraction of the cost. It's brilliant and so simple to use.",
    avatarGradient: 'from-pink-500 to-rose-500',
  },
  {
    name: 'Jordan Smith',
    handle: '@j_smith',
    quote: 'The security is top-notch. I feel much safer using this than sending my password over a text. The interface is super clean, too.',
    avatarGradient: 'from-violet-500 to-purple-600',
  }
];

// Duplicate testimonials for a seamless loop
const extendedTestimonials = [...testimonials, ...testimonials];

function Marquee() {
  return (
    <section id="testimonials" className="w-full bg-white py-20 sm:py-24">
      <div className="max-w-6xl mx-auto text-center mb-12 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Trusted by Thousands of Users</h2>
        <p className="text-lg text-slate-600 mt-3">Read what our members are saying about their experience.</p>
      </div>
      <div className="w-full overflow-hidden relative group">
        <div className="flex animate-marquee-slow md:group-hover:[animation-play-state:paused]">
          {extendedTestimonials.map((testimonial, index) => (
            <div key={index} className="flex-shrink-0 w-[80vw] sm:w-[24rem] mx-3 sm:mx-4 p-5 sm:p-6 bg-white border border-slate-200 rounded-2xl flex flex-col items-start shadow-sm">
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${testimonial.avatarGradient} flex-shrink-0`} />
                <div>
                  <p className="font-semibold text-slate-900 text-sm sm:text-base">{testimonial.name}</p>
                  <p className="text-slate-500 text-xs sm:text-sm">{testimonial.handle}</p>
                </div>
              </div>
              <p className="text-slate-600 text-sm sm:text-base">{testimonial.quote}</p>
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute top-0 bottom-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute top-0 bottom-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-white to-transparent" />
      </div>
    </section>
  );
}

export default Marquee; 