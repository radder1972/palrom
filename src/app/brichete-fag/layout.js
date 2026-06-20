export const metadata = {
  title: "Beukenhouten Briketten (Wholesale) | PALROM Products",
  description: "Hoogwaardige beukenhouten briketten (brichete fag) voor groothandel. 100% natuurlijk en chemicaliënvrij geperst uit eigen zaagsel.",
};

export default function BricheteFagLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Beukenhouten Briketten (Brichete Fag)",
    "image": "https://palromproducts.com/images/brichete.png",
    "description": "Geperste beukenhouten briketten voor kachels en haarden. 100% ecologisch, geproduceerd uit schoon zaagsel zonder bindmiddelen.",
    "brand": {
      "@type": "Brand",
      "name": "PALROM Products"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "EUR",
      "lowPrice": "300.00",
      "priceVal": "B2B Wholesale / Price per Pallet"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
