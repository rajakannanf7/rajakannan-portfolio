import Nav from '../../components/site/Nav';
import Cursor from '../../components/site/Cursor';
import SmoothScroll from '../../components/site/SmoothScroll';
import Motion from '../../components/site/Motion';

export default function SiteLayout({ children }) {
  return (
    <>
      <div className="grain" aria-hidden="true" />
      <Cursor />
      <SmoothScroll />
      <Nav />
      <main id="top">{children}</main>
      <Motion />
    </>
  );
}
