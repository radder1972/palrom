export const metadata = {
  title: "Beukenhouten Latten & Geschaafd Hout | PALROM Products",
  description: "Viersijdig geschaafde beukenhouten latten en regels. Op de millimeter nauwkeurig gekalibreerd voor timmerfabrieken en de meubelindustrie.",
};

export default function FourSidesPlanedLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Beukenhouten Latten & Geschaafd Hout (S4S)",
    "image": "https://palromproducts.com/images/planed_wood.png",
    "description": "Viersijdig geschaafde beukenhouten latten en regels, op de millimeter nauwkeurig gekalibreerd voor meubelproductie en houtbouw.",
    "brand": {
      "@type": "Brand",
      "name": "PALROM Products"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "EUR",
      "lowPrice": "0.15",
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
