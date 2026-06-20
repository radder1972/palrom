export const metadata = {
  title: "Beukenhouten Blanks & Halffabrikaten | PALROM Products",
  description: "Fijnbezaagde beukenhouten blanks en meubelcomponenten rechtstreeks van onze zagerij. Kammergedroogd (8-12%) of vers gezaagd.",
};

export default function BlanksLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Beukenhouten Blanks & Halffabrikaten",
    "image": "https://palromproducts.com/images/beechwood_blanks.png",
    "description": "Fijnbezaagde beukenhouten blanks en halffabrikaten rechtstreeks uit onze eigen zagerij. Gedroogd tot 8-12% vochtigheid en geschikt voor meubelonderdelen.",
    "brand": {
      "@type": "Brand",
      "name": "PALROM Products"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "EUR",
      "lowPrice": "0.10",
      "priceVal": "B2B Wholesale / Request Quote"
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
