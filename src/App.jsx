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
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const diff =
      (outDate.getTime() - inDate.getTime()) /
      (1000 * 60 * 60 * 24);
    return diff > 0 ? diff : 0;
  })();

  const nightsForTax = Math.min(nights, maxNightsTax);
  const touristTax = persons * nightsForTax * cityTax;

  const isAllIn = tab.includes("ai");
  const basePrice = isAllIn ? finalPrice : price;

  // =========================
  // AIRBNB STANDARD
  // =========================
  const guestFee = price * airbnbGuestFeeRate;
  const totalGuest = price + guestFee + touristTax;

  const hostFee = price * serviceFeeHost;
  const vat = hostFee * vatRate;
  const cedolare = price * taxRate;

  const netAirbnb = price - hostFee - vat - cedolare;

  // =========================
  // DIRETTA STANDARD
  // =========================
  const directTotal = price + touristTax;
  const directNet = (price - touristTax) * (1 - taxRate);

  // =========================
  // ALL-IN AIRBNB
  // =========================
  const priceWithoutTaxAirbnb = finalPrice - touristTax;
  const baseAirbnb =
    priceWithoutTaxAirbnb / (1 + airbnbGuestFeeRate);

  const hostFeeAI = baseAirbnb * serviceFeeHost;
  const vatAI = hostFeeAI * vatRate;
  const cedolareAI = baseAirbnb * taxRate;

  const netAirbnbAI =
    baseAirbnb - hostFeeAI - vatAI - cedolareAI;

  // =========================
  // ALL-IN DIRETTA
  // =========================
  const baseDirectAI = finalPrice - touristTax;
  const netDirectAI = baseDirectAI * (1 - taxRate);

  // DATA SWITCH
  const data = {
    airbnb: {
      ospite: totalGuest,
      host: netAirbnb,
      breakdown: {
        "Commissioni Ospite": guestFee,
        "Tassa soggiorno": touristTax,
        "Commissioni Host": hostFee,
        "IVA 22%": vat,
        "Cedolare 21%": cedolare,
      },
    },
    direct: {
      ospite: directTotal,
      host: directNet,
      breakdown: {
        "Tassa soggiorno": touristTax,
      },
    },
    airbnb_ai: {
      ospite: finalPrice,
      host: netAirbnbAI,
      breakdown: {
        "Tassa soggiorno": touristTax,
      },
    },
    direct_ai: {
      ospite: finalPrice,
      host: netDirectAI,
      breakdown: {
        "Tassa soggiorno": touristTax,
      },
    },
  };

  const current = data[tab];

  const buttonStyle = (active) => ({
    flex: 1,
    padding: "12px",
    borderRadius: "14px",
    border: "none",
    background: active ? "#166534" : "#f3f4f6",
    color: active ? "white" : "#111827",
    fontWeight: "600",
    fontSize: "12px",
  });

  const card = {
    background: "white",
    borderRadius: "18px",
    padding: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  };

  const row = {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #eee",
    fontSize: "14px",
  };

  return (
    <div style={{ background: "#f7f7f7", minHeight: "100vh", fontFamily: "system-ui" }}>

      {/* HEADER */}
      <div style={{ background: "#166534", color: "white", padding: 18, textAlign: "center", fontWeight: 700 }}>
        {tab === "airbnb" && "Offerta Airbnb"}
        {tab === "direct" && "Offerta Diretta"}
        {tab === "airbnb_ai" && "Airbnb All-in"}
        {tab === "direct_ai" && "Diretta All-in"}
      </div>

      {/* FORM */}
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>

        <div style={card}>
          <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} style={{ width: "100%", marginBottom: 10 }} />
          <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} style={{ width: "100%", marginBottom: 10 }} />
          <input type="number" value={persons} onChange={(e) => setPersons(Number(e.target.value))} style={{ width: "100%", marginBottom: 10 }} />

          {tab.includes("ai") ? (
            <input
              type="number"
              value={finalPrice}
              onChange={(e) => setFinalPrice(Number(e.target.value))}
              placeholder="Prezzo finale cliente"
              style={{ width: "100%" }}
            />
          ) : (
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="Prezzo soggiorno"
              style={{ width: "100%" }}
            />
          )}
        </div>

        {/* OSPITE */}
        <div style={card}>
          <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 10 }}>OSPITE</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#166534" }}>
            €{current.ospite.toFixed(2)}
          </div>
        </div>

        {/* HOST */}
        <div style={card}>
          <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 10 }}>HOST</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>
            €{current.host.toFixed(2)}
          </div>

          <div style={{ marginTop: 10 }}>
            {Object.entries(current.breakdown).map(([k, v]) => (
              <div key={k} style={row}>
                <span>{k}</span>
                <span>€{v.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TAB */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "white",
        padding: 12,
        display: "flex",
        gap: 6,
        borderTop: "1px solid #eee"
      }}>
        <button onClick={() => setTab("airbnb")} style={buttonStyle(tab === "airbnb")}>Airbnb</button>
        <button onClick={() => setTab("direct")} style={buttonStyle(tab === "direct")}>Diretta</button>
        <button onClick={() => setTab("airbnb_ai")} style={buttonStyle(tab === "airbnb_ai")}>Airbnb All-in</button>
        <button onClick={() => setTab("direct_ai")} style={buttonStyle(tab === "direct_ai")}>Diretta All-in</button>
      </div>
    </div>
  );
}
