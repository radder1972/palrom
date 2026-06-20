export const metadata = {
  title: "Beukenhouten Deuvels & Stokken | PALROM Products",
  description: "B2B-fabrikant van gekalibreerde beukenhouten stokken, deuvelstaven en spiraal gegroefde deuvelspelden. FSC®-gecertificeerd op aanvraag.",
};

export default function RodsLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Beukenhouten Deuvels & Stokken",
    "image": "https://palromproducts.com/images/dowels.png",
    "description": "Nauwkeurig gekalibreerde beukenhouten deuvels, staven, pennen en stokken van FSC-gecertificeerd hout voor meubelproductie en timmerwerk.",
    "brand": {
      "@type": "Brand",
      "name": "PALROM Products"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "EUR",
      "lowPrice": "0.01",
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
