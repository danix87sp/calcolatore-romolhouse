import { useState } from "react";

export default function App() {
  const [tab, setTab] = useState("airbnb_base");

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const [persons, setPersons] = useState("");
  const [price, setPrice] = useState("");
  const [finalPrice, setFinalPrice] = useState("");

  const p = Number(price) || 0;
  const f = Number(finalPrice) || 0;
  const people = Number(persons) || 0;

  // COSTANTI
  const airbnbGuestFeeRate = 0.14117427;
  const hostFeeRate = 0.03;
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
  const touristTax = people * nightsForTax * cityTax;

  // =====================
  // AIRBNB BASE
  // =====================
  const airbnbGuestFee = p * airbnbGuestFeeRate;
  const airbnbHostFee = p * hostFeeRate;
  const airbnbVat = airbnbHostFee * vatRate;
  const airbnbTax = p * taxRate;

  const airbnbGuestTotal =
    p + airbnbGuestFee + touristTax;

  const airbnbHostNet =
    p - airbnbHostFee - airbnbVat - airbnbTax;

  // =====================
  // AIRBNB ALL-IN (scorporo)
  // =====================
  const baseAirbnbFromFinal =
    f - touristTax;

  const baseAirbnb =
    baseAirbnbFromFinal /
    (1 + airbnbGuestFeeRate);

  const airbnbHostNetAI =
    baseAirbnb -
    baseAirbnb * hostFeeRate -
    (baseAirbnb * hostFeeRate) * vatRate -
    baseAirbnb * taxRate;

  // =====================
  // DIRETTA BASE
  // =====================
  const directGuestTotal =
    p + touristTax;

  const directHostNet =
    p - p * taxRate;

  // =====================
  // DIRETTA ALL-IN
  // =====================
  const baseDirectFromFinal =
    f - touristTax;

  const directHostNetAI =
    baseDirectFromFinal -
    baseDirectFromFinal * taxRate;

  // HEADER
  function HeaderTitle() {
    switch (tab) {
      case "airbnb_base":
        return "Airbnb - Base";
      case "airbnb_ai":
        return "Airbnb - All-in";
      case "direct_base":
        return "Diretta - Base";
      case "direct_ai":
        return "Diretta - All-in";
      default:
        return "Calcolatore";
    }
  }

  const buttonStyle = (active) => ({
    flex: 1,
    padding: "10px",
    borderRadius: "12px",
    border: "none",
    background: active
      ? "#70AC76"
      : "#f3f4f6",
    color: active
      ? "white"
      : "#111827",
    fontSize: "12px",
    fontWeight: "600"
  });

  const cardStyle = {
    background: "white",
    padding: "18px",
    borderRadius: "18px",
    marginBottom: "12px"
  };

  return (
    <div style={{ fontFamily: "Inter", paddingBottom: 100 }}>
      {/* HEADER */}
      <div style={{ background: "#70AC76", color: "white", padding: 20, textAlign: "center" }}>
        {HeaderTitle()}
      </div>

      <div style={{ padding: 12 }}>
        {/* INPUT */}
        <div style={cardStyle}>
          <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
          <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} />

          <input placeholder="Persone" value={persons} onChange={e => setPersons(e.target.value)} />

          {tab.includes("ai") ? (
            <input
              placeholder="Prezzo finale cliente"
              value={finalPrice}
              onChange={e => setFinalPrice(e.target.value)}
            />
          ) : (
            <input
              placeholder="Prezzo soggiorno"
              value={price}
              onChange={e => setPrice(e.target.value)}
            />
          )}

          <div>Notti: {nights}</div>
        </div>

        {/* OUTPUT */}
        <div style={cardStyle}>
          {tab === "airbnb_base" && (
            <>
              <div>Ospite: €{airbnbGuestTotal.toFixed(2)}</div>
              <div>Host netto: €{airbnbHostNet.toFixed(2)}</div>
            </>
          )}

          {tab === "airbnb_ai" && (
            <div>Host netto: €{airbnbHostNetAI.toFixed(2)}</div>
          )}

          {tab === "direct_base" && (
            <>
              <div>Ospite: €{directGuestTotal.toFixed(2)}</div>
              <div>Host netto: €{directHostNet.toFixed(2)}</div>
            </>
          )}

          {tab === "direct_ai" && (
            <div>Host netto: €{directHostNetAI.toFixed(2)}</div>
          )}
        </div>
      </div>

      {/* TAB */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, display: "flex" }}>
        <button onClick={() => setTab("airbnb_base")} style={buttonStyle(tab === "airbnb_base")}>Airbnb Base</button>
        <button onClick={() => setTab("airbnb_ai")} style={buttonStyle(tab === "airbnb_ai")}>Airbnb All-in</button>
        <button onClick={() => setTab("direct_base")} style={buttonStyle(tab === "direct_base")}>Diretta Base</button>
        <button onClick={() => setTab("direct_ai")} style={buttonStyle(tab === "direct_ai")}>Diretta All-in</button>
      </div>
    </div>
  );
}
