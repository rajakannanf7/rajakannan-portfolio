import { Suspense } from 'react';
import Nav from '../../components/ui/Nav';
import Footer from '../../components/ui/Footer';
import ContactForm from './ContactForm';
import Reveal from '../../components/ui/Reveal';
import { SectionLabel, Shell } from '../../components/ui/bits';
import { getSite } from '../../lib/content';

export const metadata = {
  title: 'Contact',
  description: 'Start a project, or book a shoot in Chennai.',
};

function ContactFormFallback() {
  return (
    <div className="rounded-2xl border border-bone/12 bg-bone/[0.02] p-10 text-[15px] text-mute">
      Loading contact form…
    </div>
  );
}

export default async function ContactPage() {
  const site = await getSite();

  return (
    <>
      <Nav />
      <main>
        <Shell className="pb-24 pt-40 md:pt-56">
          <Reveal>
            <SectionLabel className="mb-8">CONTACT</SectionLabel>
            <h1 className="max-w-[1120px] text-[clamp(2.4rem,7vw,5.5rem)] font-light leading-[0.98] tracking-[-0.03em]">
              Have a project in mind?
              <br />
              <span className="font-semibold">Let&apos;s create something memorable.</span>
            </h1>
          </Reveal>

          <div className="mt-20 grid grid-cols-1 gap-14 md:grid-cols-12">
            <Reveal className="md:col-span-7">
              <Suspense fallback={<ContactFormFallback />}>
                <ContactForm />
              </Suspense>
            </Reveal>

            <Reveal className="md:col-span-5 md:pl-8" delay={120}>
              <div className="border-t border-bone/10 pt-8">
                <SectionLabel className="mb-4">EMAIL</SectionLabel>
                <a href={`mailto:${site.email}`} className="text-xl font-light hover:text-halo">
                  {site.email}
                </a>
              </div>
              <div className="mt-10 border-t border-bone/10 pt-8">
                <SectionLabel className="mb-4">SOCIAL</SectionLabel>
                <a href={site.instagram} target="_blank" rel="noreferrer" className="block text-xl font-light hover:text-halo">
                  Instagram
                </a>
              </div>
              <div className="mt-10 border-t border-bone/10 pt-8">
                <SectionLabel className="mb-4">BASED IN</SectionLabel>
                <p className="text-xl font-light">{site.city}</p>
                <p className="mt-3 text-[15px] font-light leading-relaxed text-mute">
                  Studio work out of Magizh, Nerkundram. Remote and travel welcome.
                </p>
              </div>
              <div className="mt-10 border-t border-bone/10 pt-8">
                <SectionLabel className="mb-4">AVAILABILITY</SectionLabel>
                <p className="text-[15px] font-light leading-relaxed text-mute">{site.availability}</p>
              </div>
            </Reveal>
          </div>
        </Shell>
      </main>
      <Footer site={site} />
    </>
  );
}
