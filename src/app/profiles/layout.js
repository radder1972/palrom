export const metadata = {
  title: "Beukenhouten Profielen, Plinten & Lijsten | PALROM Products",
  description: "Groot assortiment beukenhouten profielen (halfrond, kwartrond, plinten) voor interieurafwerking en meubelproductie. Maatwerk op aanvraag.",
};

export default function ProfilesLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Beukenhouten Profielen, Plinten & Lijsten",
    "image": "https://palromproducts.com/images/profiles.png",
    "description": "Geproduceerde beukenhouten afwerklijsten, plinten en profielen. Leverbaar in vele vormen of op klantspecifiek model.",
    "brand": {
      "@type": "Brand",
      "name": "PALROM Products"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "EUR",
      "lowPrice": "0.20",
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
