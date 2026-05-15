import { useState } from "react";

export default function App() {
  const [tab, setTab] = useState("airbnb");

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [persons, setPersons] = useState(1);

  const [price, setPrice] = useState(250);
  const [finalPrice, setFinalPrice] = useState(300);

  // COSTANTI
  const serviceFeeHost = 0.03;
  const airbnbGuestFeeRate = 0.14117427;
  const taxRate = 0.21;
  const vatRate = 0.22;
  const cityTax = 9.5;
  const maxNightsTax = 14;

  // NOTTI
  const nights = (() => {
    if (!checkIn || !checkOut) return 0;
    return (
      (new Date(checkOut) - new Date(checkIn)) /
      (1000 * 60 * 60 * 24)
    );
  })();

  const nightsTax = Math.min(nights, maxNightsTax);
  const touristTax = persons * nightsTax * cityTax;

  // =========================
  // 🔵 AIRBNB STANDARD
  // =========================
  const airbnb_guest_fee = price * airbnbGuestFeeRate;

  const airbnb_ospite = {
    soggiorno: price,
    commissioni: airbnb_guest_fee,
    tassa: touristTax,
    totale: price + airbnb_guest_fee + touristTax,
  };

  const airbnb_host_fee = price * serviceFeeHost;
  const airbnb_host_vat = airbnb_host_fee * vatRate;
  const airbnb_host_tax = price * taxRate;

  const airbnb_host = {
    commissioni: airbnb_host_fee,
    iva: airbnb_host_vat,
    cedolare: airbnb_host_tax,
    netto:
      price -
      airbnb_host_fee -
      airbnb_host_vat -
      airbnb_host_tax,
  };

  // =========================
  // 🟣 AIRBNB ALL-IN
  // =========================
  const baseAirbnb = finalPrice - touristTax;
  const soggiornoAirbnb = baseAirbnb / (1 + airbnbGuestFeeRate);
  const airbnbAllFee = soggiornoAirbnb * airbnbGuestFeeRate;

  const airbnb_ai_ospite = {
    soggiorno: soggiornoAirbnb,
    commissioni: airbnbAllFee,
    tassa: touristTax,
    totale: finalPrice,
  };

  const airbnb_ai_host_fee = soggiornoAirbnb * serviceFeeHost;
  const airbnb_ai_host_vat = airbnb_ai_host_fee * vatRate;
  const airbnb_ai_host_tax = soggiornoAirbnb * taxRate;

  const airbnb_ai_host = {
    commissioni: airbnb_ai_host_fee,
    iva: airbnb_ai_host_vat,
    cedolare: airbnb_ai_host_tax,
    netto:
      soggiornoAirbnb -
      airbnb_ai_host_fee -
      airbnb_ai_host_vat -
      airbnb_ai_host_tax,
  };

  // =========================
  // 🟠 DIRETTA
  // =========================
  const direct_ospite = {
    soggiorno: price,
    tassa: touristTax,
    totale: price + touristTax,
  };

  const direct_host = {
    cedolare: price * taxRate,
    netto: price * (1 - taxRate),
  };

  // =========================
  // 🟡 DIRETTA ALL-IN
  // =========================
  const direct_ai_base = finalPrice - touristTax;

  const direct_ai_ospite = {
    tassa: touristTax,
    totale: finalPrice,
  };

  const direct_ai_host = {
    cedolare: direct_ai_base * taxRate,
    netto: direct_ai_base * (1 - taxRate),
  };

  const data = {
    airbnb: { ospite: airbnb_ospite, host: airbnb_host },
    airbnb_ai: { ospite: airbnb_ai_ospite, host: airbnb_ai_host },
    direct: { ospite: direct_ospite, host: direct_host },
    direct_ai: { ospite: direct_ai_ospite, host: direct_ai_host },
  };

  const current = data[tab];

  const renderBlock = (title, obj) => (
    <div style={{ background: "white", padding: 16, borderRadius: 16, marginBottom: 12 }}>
      <div style={{ fontWeight: 800, marginBottom: 10 }}>{title}</div>
      {Object.entries(obj).map(([k, v]) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
          <span>{k}</span>
          <span>€{Number(v).toFixed(2)}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ fontFamily: "system-ui", background: "#f5f5f5", minHeight: "100vh", padding: 16 }}>
      
      <h2>{tab}</h2>

      {renderBlock("OSPITE", current.ospite)}
      {renderBlock("HOST", current.host)}

      <div style={{ display: "flex", gap: 6, position: "fixed", bottom: 10, left: 10, right: 10 }}>
        <button onClick={() => setTab("airbnb")}>Airbnb</button>
        <button onClick={() => setTab("direct")}>Diretta</button>
        <button onClick={() => setTab("airbnb_ai")}>Airbnb All-in</button>
        <button onClick={() => setTab("direct_ai")}>Diretta All-in</button>
      </div>
    </div>
  );
}
