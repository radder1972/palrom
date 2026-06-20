export const metadata = {
  title: "Beukenhouten Bestekken & Specials | PALROM Products",
  description: "Halffabrikaten en op maat gemaakte beukenhouten onderdelen voor meubels, huishoudelijke artikelen, speelgoed en industriële toepassingen.",
};

export default function SpecialsLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Beukenhouten Bestekken & Specials",
    "image": "https://palromproducts.com/images/specials.png",
    "description": "Op maat gemaakte halffabrikaten en speciale onderdelen van beukenhout voor industriële doeleinden, huishoudelijk gereedschap en speelgoed.",
    "brand": {
      "@type": "Brand",
      "name": "PALROM Products"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "EUR",
      "lowPrice": "0.30",
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
