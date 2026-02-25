"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Send, Mail, MapPin, Phone, Github, Linkedin } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { useSound } from "./SoundManager";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "ashikdeyrupak03@gmail.com",
    href: "mailto:ashikdeyrupak03@gmail.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "660-229-3900",
    href: "tel:6602293900",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Kirksville, MO",
    href: null,
  },
];

const socials = [
  { icon: Github, label: "GitHub", href: "https://github.com/Ashikvk18" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/ashik-dey-rupak-2ba866229" },
];

export default function Contact() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const { playHover, playClick, playSpell } = useSound();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio Contact from ${formData.name}`);
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`);
    window.open(`mailto:ashikdeyrupak03@gmail.com?subject=${subject}&body=${body}`);
    playSpell();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="contact" className="relative py-16 sm:py-28 lg:py-36">
      <div className="section-divider mb-14 sm:mb-28" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/[0.02] rounded-full blur-[180px]" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          tag="Contact"
          title="Reach Out"
          subtitle="I'd love to hear from you, whatever it may be"
        />

        <div ref={ref} className="grid lg:grid-cols-5 gap-8 sm:gap-10">
          {/* Contact info side */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
            className="lg:col-span-2 space-y-8"
          >
            <div className="space-y-5">
              {contactInfo.map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/[0.02] text-accent/35">
                    <item.icon size={15} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5">{item.label}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-gray-300 text-xs hover:text-accent/80 transition-colors duration-500"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-gray-300 text-xs">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-5 border-t border-white/[0.03]">
              <p className="text-gray-500 text-[10px] mb-3 uppercase tracking-[0.2em] font-mono">Find me</p>
              <div className="flex gap-3">
                {socials.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -2 }}
                    onMouseEnter={playHover}
                    onClick={playClick}
                    className="flex items-center gap-2 px-4 py-2 glass-dark rounded-lg glass-dark-hover text-xs text-gray-400 hover:text-accent/70"
                  >
                    <social.icon size={13} strokeWidth={1.5} />
                    {social.label}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="glass-dark rounded-2xl p-6 sm:p-8 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-400 text-[10px] uppercase tracking-wider mb-2.5">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.04] rounded-xl text-white/80 text-sm placeholder-gray-700 focus:outline-none focus:border-accent/20 transition-all duration-500"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-[10px] uppercase tracking-wider mb-2.5">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.04] rounded-xl text-white/80 text-sm placeholder-gray-700 focus:outline-none focus:border-accent/20 transition-all duration-500"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-400 text-[10px] uppercase tracking-wider mb-2.5">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.04] rounded-xl text-white/80 text-sm placeholder-gray-700 focus:outline-none focus:border-accent/20 transition-all duration-500 resize-none"
                  placeholder="What's on your mind..."
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-3 bg-white/[0.04] border border-white/[0.06] text-gray-300 text-sm font-medium rounded-xl flex items-center justify-center gap-2 hover:border-accent/25 hover:text-accent transition-all duration-500 text-pop"
              >
                {submitted ? (
                  <span className="text-accent/60">Opening Email Client...</span>
                ) : (
                  <>
                    Send Message
                    <Send size={13} strokeWidth={1.5} />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
