'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ContactSection from '@/components/ContactSection';
import { useInquiry } from '@/components/InquiryContext';

export default function Home() {
  const [activeFilter, setActiveFilter] = useState('all');
  const { lang } = useInquiry();

  const products = [
    {
      id: 'dowels',
      category: 'dowels',
      name: lang === 'nl' ? 'Beukenhouten Deuvels & Pluggen' : 'Beechwood Dowels & Pins',
      description: lang === 'nl' 
        ? 'Verkrijgbaar in diameters van 3 mm tot 60 mm. Kies tussen gladde houten pennen of spiraalvormig gegroefde deuvels voor een optimale lijmhechting.'
        : 'Available in diameters from 3 mm to 60 mm. Choose between smooth wooden pins or spiral grooved dowels for optimal glue adhesion.',
      image: '/images/dowels.png',
      link: '/dowels',
      specs: [
        { label: lang === 'nl' ? 'Diameter' : 'Diameter', value: lang === 'nl' ? '3mm tot 60mm' : '3mm to 60mm' },
        { label: lang === 'nl' ? 'Afwerking' : 'Finish', value: lang === 'nl' ? 'Glad / Gegroefd (6mm tot 20mm)' : 'Smooth / Grooved (6mm to 20mm)' },
        { label: lang === 'nl' ? 'Houtsoort' : 'Wood Type', value: lang === 'nl' ? 'Gestoomd of ongestoomd beuken' : 'Steamed or unsteamed beech' },
      ],
      tag: lang === 'nl' ? 'Deuvels' : 'Dowels',
    },
    {
      id: 'planed',
      category: 'planed',
      name: lang === 'nl' ? 'Vierzijdig Geschaafd Hout' : 'Four-Sides Planed Timber',
      description: lang === 'nl'
        ? 'Geschaafd tot op de millimeter nauwkeurig. Verkrijgbaar in diverse rechthoekige en vierkante secties, gekalibreerd voor timmerfabrieken en de meubelindustrie.'
        : 'Planed to millimeter precision. Available in various rectangular and square sections, calibrated for joinery factories and the furniture industry.',
      image: '/images/planed_wood.png',
      link: '/four-sides-planed',
      specs: [
        { label: lang === 'nl' ? 'Secties' : 'Sections', value: lang === 'nl' ? 'Vierkant & Rechthoekig' : 'Square & Rectangular' },
        { label: lang === 'nl' ? 'Randen' : 'Edges', value: lang === 'nl' ? 'Scherp, Radius 3 of Radius 6' : 'Sharp, Radius 3 or Radius 6' },
        { label: lang === 'nl' ? 'Vochtigheid' : 'Moisture', value: lang === 'nl' ? 'Oven-gedroogd tot 8-12%' : 'Kiln-dried to 8-12%' },
      ],
      tag: lang === 'nl' ? 'Geschaafd' : 'Planed',
    },
    {
      id: 'profiles',
      category: 'profiles',
      name: lang === 'nl' ? 'Houten Profielen & Lijsten' : 'Wooden Profiles & Mouldings',
      description: lang === 'nl'
        ? 'Groot assortiment decoratieve profielen, plinten en lijsten voor interieurafwerking en meubelproductie. Klantspecifieke profielen beschikbaar op aanvraag.'
        : 'Large assortment of decorative mouldings, skirtings, and profiles for interior finishing and furniture production. Custom profiles available upon request.',
      image: '/images/profiles.png',
      link: '/profiles',
      specs: [
        { label: lang === 'nl' ? 'Vormen' : 'Shapes', value: lang === 'nl' ? 'Halfrond, Kwartrond, Plinten' : 'Half-round, Quarter-round, Skirtings' },
        { label: lang === 'nl' ? 'Maatwerk' : 'Customization', value: lang === 'nl' ? 'Hoekprofielen, draadsnijden, inkepingen' : 'Corner profiles, threading, notches' },
        { label: lang === 'nl' ? 'Retail' : 'Retail', value: lang === 'nl' ? 'EAN-barcode etikettering beschikbaar' : 'EAN barcode labeling available' },
      ],
      tag: lang === 'nl' ? 'Profielen' : 'Profiles',
    },
    {
      id: 'specials',
      category: 'specials',
      name: lang === 'nl' ? 'Speciale Componenten & Halffabrikaten' : 'Special Components & Semi-Finished Products',
      description: lang === 'nl'
        ? 'Halffabrikaten en op maat gemaakte houten onderdelen voor meubels, keukengerei, speelgoed en specifieke industriële toepassingen.'
        : 'Semi-finished and custom-made wooden parts for furniture, kitchen utensils, toys, and specific industrial applications.',
      image: '/images/specials.png',
      link: '/specials',
      specs: [
        { label: lang === 'nl' ? 'Toepassingen' : 'Applications', value: lang === 'nl' ? 'Meubelindustrie / Keukengerei / DIY' : 'Furniture industry / Kitchen utensils / DIY' },
        { label: lang === 'nl' ? 'FSC Gecertificeerd' : 'FSC Certified', value: lang === 'nl' ? 'Beschikbaar op aanvraag' : 'Available upon request' },
        { label: lang === 'nl' ? 'Verpakking' : 'Packaging', value: lang === 'nl' ? 'Bulk of op maat verpakt' : 'Bulk or custom packaged' },
      ],
      tag: lang === 'nl' ? 'Specials' : 'Specials',
    },
  ];

  const filteredProducts =
    activeFilter === 'all'
      ? products
      : products.filter((p) => p.category === activeFilter);

  const handleDownloadBrochure = (e) => {
    e.preventDefault();
    alert(
      lang === 'nl'
        ? 'Download van de Palrom Products productbrochure is gestart (voorbeeld).'
        : 'Palrom Products Corporate Brochure download started (Sample).'
    );
  };

  return (
    <>
      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <span className="hero-badge animate-fade-in">
            {lang === 'nl' ? 'FSC®-Gecertificeerde Houtindustrie' : 'FSC®-Certified Wood Industry'}
          </span>
          <h1 className="hero-title animate-slide-up">
            {lang === 'nl' ? 'Fabrikant van Beukenhouten Deuvels en Profielen' : 'Manufacturer of Beechwood Dowels and Profiles'}
          </h1>
          <p className="hero-subtitle animate-slide-up-delay">
            {lang === 'nl'
              ? 'Palrom Products combineert decennia aan ervaring met een moderne zagerij en droogovens. Wij leveren hoogwaardige beukenhouten deuvels, profielen en geschaafde meubelcomponenten rechtstreeks aan de internationale meubel- en houtindustrie.'
              : 'Palrom Products combines decades of experience with a modern sawmill and drying kilns. We supply high-quality beechwood dowels, profiles, and planed furniture components directly to the international furniture and wood industry.'}
          </p>
          <div className="hero-buttons animate-slide-up-delay-2">
            <Link href="/configurator" className="btn btn-primary">
              {lang === 'nl' ? 'Offerte Aanvragen' : 'Request a Quote'}
            </Link>
            <Link href="/products" className="btn btn-secondary">
              {lang === 'nl' ? 'Producten Bekijken' : 'View Products'}
            </Link>
          </div>
        </div>

        {/* Hiring Stamp on Hero Photo */}
        <Link href="/careers" className="hiring-stamp-hero" title={lang === 'nl' ? 'We zoeken personeel! Bekijk onze vacatures' : 'We are hiring! View our vacancies'}>
          <img src="/images/hiring_stamp.png" alt={lang === 'nl' ? 'Vacatures bij Palrom Products - Solliciteer nu' : 'Vacancies at Palrom Products - Apply now'} />
        </Link>

        <div className="scroll-indicator">
          <span>{lang === 'nl' ? 'Scroll naar beneden' : 'Scroll Down'}</span>
          <i className="fa-solid fa-chevron-down scroll-arrow"></i>
        </div>
      </section>

      {/* Introduction & Values Section */}
      <section className="intro-section section-padding">
        <div className="container">
          <div className="grid grid-2">
            <div className="intro-text-column animate-on-scroll">
              <span className="section-badge">
                {lang === 'nl' ? 'Welkom bij PALROM' : 'Welcome to PALROM'}
              </span>
              <h2 className="section-title">
                {lang === 'nl' ? 'FSC®-Gecertificeerd Beukenhout' : 'FSC®-Certified Beechwood'}
              </h2>
              <p className="section-description">
                {lang === 'nl'
                  ? 'Gevestigd in de bosrijke regio Brad (Hunedoara, Roemenië), exploiteert Palrom Products SRL een geavanceerde zagerij, moderne droogovens en een professionele schaverij. Wij leveren hoogwaardig hout en meubelcomponenten rechtstreeks vanaf de bron.'
                  : 'Based in the forested region of Brad (Hunedoara, Romania), Palrom Products SRL operates an advanced sawmill, modern drying kilns, and a professional planing mill. We deliver high-quality lumber and furniture components directly from the source.'}
              </p>
              <p className="section-description">
                {lang === 'nl'
                  ? 'Dankzij onze verticale integratie beheren we het gehele productieproces. We oogsten lokaal FSC®-gecertificeerd beukenhout, verwerken het met precisie, drogen het tot het optimale vochtgehalte en schaven het volgens de exacte specificaties van onze B2B-klanten in de Europese houtindustrie.'
                  : 'Thanks to our vertical integration, we control the entire production process. We harvest local FSC®-certified beechwood, process it with precision, dry it to the optimal moisture content, and plane it according to the exact specifications of our B2B customers in the European wood industry.'}
              </p>
              <div className="intro-features">
                <div className="feature-item">
                  <div className="feature-icon">
                    <i className="fa-solid fa-tree"></i>
                  </div>
                  <div>
                    <h4>{lang === 'nl' ? '100% Duurzaam' : '100% Sustainable'}</h4>
                    <p>
                      {lang === 'nl'
                        ? 'Ons beukenhout is 100% FSC®-gecertificeerd en afkomstig uit verantwoord beheerde lokale bossen.'
                        : 'Our beechwood is 100% FSC®-certified and sourced from responsibly managed local forests.'}
                    </p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <i className="fa-solid fa-award"></i>
                  </div>
                  <div>
                    <h4>{lang === 'nl' ? 'Componenten op Maat' : 'Custom Components'}</h4>
                    <p>
                      {lang === 'nl'
                        ? 'Zagen, drogen, schaven en profileren gebeurt volledig volgens uw gewenste afmetingen.'
                        : 'Sawing, drying, planing, and profiling are done entirely according to your desired dimensions.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="intro-image-column animate-on-scroll">
              <div className="image-wrapper-decorative">
                <img
                  src="/images/sawmill.png"
                  alt="Automated wood processing Palrom"
                  className="img-responsive rounded-lg shadow-lg"
                />
                <div className="stats-badge">
                  <span className="stat-number">25+</span>
                  <span className="stat-text">{lang === 'nl' ? 'Jaar Ervaring' : 'Years Experience'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section (Interactive Features Grid) */}
      <section className="why-us-section section-padding bg-light">
        <div className="container">
          <div className="text-center max-w-xl mx-auto mb-5">
            <span className="section-badge">
              {lang === 'nl' ? 'Waarom PALROM?' : 'Why PALROM?'}
            </span>
            <h2 className="section-title">
              {lang === 'nl' ? 'Grootschalige Productie & Maatwerk' : 'Large-Scale Production & Customization'}
            </h2>
            <p className="section-subtitle">
              {lang === 'nl'
                ? 'Wij leveren niet alleen hout; wij ontwerpen oplossingen op maat die het rendement verhogen en de productiekosten verlagen voor meubelfabrikanten en houtbewerkers.'
                : 'We do not just deliver timber; we design custom solutions that increase yield and lower production costs for furniture manufacturers and woodworkers.'}
            </p>
          </div>

          <div className="grid grid-3">
            <div className="card card-hover animate-on-scroll">
              <div className="card-icon">
                <i className="fa-solid fa-warehouse"></i>
              </div>
              <h3>{lang === 'nl' ? 'Moderne Droogkamers' : 'Modern Drying Kilns'}</h3>
              <p>
                {lang === 'nl'
                  ? 'Onze droogcapaciteit garandeert een stabiel vochtgehalte van 8-12%, wat kromtrekken of scheuren in uw meubelcomponenten voorkomt.'
                  : 'Our drying capacity guarantees a stable moisture content of 8-12%, preventing warping or cracking in your furniture components.'}
              </p>
            </div>
            <div className="card card-hover animate-on-scroll">
              <div className="card-icon">
                <i className="fa-solid fa-tag"></i>
              </div>
              <h3>{lang === 'nl' ? 'Winkelklare Etikettering' : 'Retail-Ready Labeling'}</h3>
              <p>
                {lang === 'nl'
                  ? 'Voor de doe-het-zelfmarkt leveren we individueel gelabelde bundels met EAN-barcodes en verpakkingen op maat.'
                  : 'For DIY markets, we deliver individually labeled bundles with EAN barcodes and custom packaging.'}
              </p>
            </div>
            <div className="card card-hover animate-on-scroll">
              <div className="card-icon">
                <i className="fa-solid fa-globe"></i>
              </div>
              <h3>{lang === 'nl' ? 'Internationale Logistiek' : 'International Logistics'}</h3>
              <p>
                {lang === 'nl'
                  ? 'Export naar Duitsland, Frankrijk, Oostenrijk en Japan. Inclusief B2B-distributie en opslag via Van Soest International in Nederland.'
                  : 'Export to Germany, France, Austria, and Japan. Including B2B distribution and warehousing via Van Soest International in the Netherlands.'}
              </p>
            </div>
          </div>

          <div className="brochure-download-container animate-on-scroll">
            <div className="brochure-content">
              <i className="fa-solid fa-file-pdf pdf-large-icon"></i>
              <div>
                <h3>{lang === 'nl' ? 'Wilt u technische afmetingen en specificaties bekijken?' : 'Want to view technical dimensions and specifications?'}</h3>
                <p>
                  {lang === 'nl'
                    ? 'Download onze officiële productbrochure met maattabellen, kwaliteitsklassen en verpakkingsopties.'
                    : 'Download our official product brochure with size tables, quality grades, and packaging options.'}
                </p>
              </div>
            </div>
            <a href="#" className="btn btn-dark" onClick={handleDownloadBrochure}>
              <i className="fa-solid fa-download icon-left"></i> {lang === 'nl' ? 'Productbrochure Downloaden' : 'Download Product Brochure'}
            </a>
          </div>
        </div>
      </section>

      {/* Products Catalogue Section */}
      <section id="products" className="products-section section-padding">
        <div className="container">
          <div className="text-center max-w-xl mx-auto mb-4">
            <span className="section-badge">
              {lang === 'nl' ? 'Productassortiment' : 'Product Range'}
            </span>
            <h2 className="section-title">
              {lang === 'nl' ? 'Beukenhouten Deuvels & Meubelcomponenten' : 'Beech Dowels & Furniture Components'}
            </h2>
            <p className="section-subtitle">
              {lang === 'nl'
                ? 'Ontdek onze kernproducten, met uiterste precisie vervaardigd uit FSC®-gecertificeerd Roemeens beukenhout.'
                : 'Discover our core products, crafted with extreme precision from FSC®-certified Romanian beechwood.'}
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="product-filters">
            <button
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              {lang === 'nl' ? 'Alles' : 'All'}
            </button>
            <button
              className={`filter-btn ${activeFilter === 'dowels' ? 'active' : ''}`}
              onClick={() => setActiveFilter('dowels')}
            >
              {lang === 'nl' ? 'Beukenhouten Deuvels' : 'Beechwood Dowels'}
            </button>
            <button
              className={`filter-btn ${activeFilter === 'planed' ? 'active' : ''}`}
              onClick={() => setActiveFilter('planed')}
            >
              {lang === 'nl' ? 'Vierzijdig Geschaafd' : 'Four-Sides Planed'}
            </button>
            <button
              className={`filter-btn ${activeFilter === 'profiles' ? 'active' : ''}`}
              onClick={() => setActiveFilter('profiles')}
            >
              {lang === 'nl' ? 'Houten Profielen' : 'Wooden Profiles'}
            </button>
            <button
              className={`filter-btn ${activeFilter === 'specials' ? 'active' : ''}`}
              onClick={() => setActiveFilter('specials')}
            >
              {lang === 'nl' ? 'Speciale Componenten' : 'Special Components'}
            </button>
          </div>

          {/* Product Grid */}
          <div className="grid grid-3 product-grid">
            {filteredProducts.map((p) => (
              <div className="product-card" key={p.id} data-category={p.category}>
                <div className="product-img-wrapper">
                  <Link href={p.link} className="product-img-link">
                    <img src={p.image} alt={p.name} />
                  </Link>
                  <span className="product-tag">{p.tag}</span>
                </div>
                <div className="product-info">
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>
                  <ul className="product-specs">
                    {p.specs.map((spec, i) => (
                      <li key={i}>
                        <strong>{spec.label}:</strong> {spec.value}
                      </li>
                    ))}
                  </ul>
                  <Link href={p.link} className="product-link">
                    {activeFilter === 'all' 
                      ? (lang === 'nl' ? `Ontdek ${p.tag}` : `Discover ${p.tag}`)
                      : (lang === 'nl' ? 'Bekijk details' : 'View details')}{' '}
                    <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reusable Contact & Team Section */}
      <ContactSection />
    </>
  );
}
