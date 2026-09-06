import Nav from '../components/ui/Nav';
import Footer from '../components/ui/Footer';
import Hero from '../components/sections/Hero';
import Marquee from '../components/sections/Marquee';
import Manifesto from '../components/sections/Manifesto';
import SelectedWork from '../components/sections/SelectedWork';
import PhotoStrip from '../components/sections/PhotoStrip';
import Expertise from '../components/sections/Expertise';
import LabTeaser from '../components/sections/LabTeaser';
import Clients from '../components/sections/Clients';
import ContactCta from '../components/sections/ContactCta';
import {
  getFeaturedProjects, getIndexProjects, getPhotos, getLabs, getSite,
  expertise, clients,
} from '../lib/content';

export const revalidate = 60;

export default async function Home() {
  const [featured, index, photos, labs, site] = await Promise.all([
    getFeaturedProjects(), getIndexProjects(), getPhotos(), getLabs(), getSite(),
  ]);

  return (
    <>
      <Nav />
      <main>
        <Hero site={site} />
        <Marquee />
        <Manifesto site={site} />
        <SelectedWork featured={featured} index={index} />
        <PhotoStrip photos={photos} />
        <Expertise items={expertise} />
        <LabTeaser labs={labs} />
        <Clients names={clients} />
        <ContactCta site={site} />
      </main>
      <Footer site={site} />
    </>
  );
}
