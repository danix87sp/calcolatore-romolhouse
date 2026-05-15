import { useState } from "react";

export default function App() {
  const [channel, setChannel] = useState("airbnb"); // airbnb | direct
  const [mode, setMode] = useState("base"); // base | allin

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

  const nightsTax = Math.min(nights, maxNightsTax);
  const touristTax = people * nightsTax * cityTax;

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
  // AIRBNB ALL-IN
  // =====================
  const baseAirbnb =
    (f - touristTax) /
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
  const baseDirect = f - touristTax;

  const directHostNetAI =
    baseDirect - baseDirect * taxRate;

  // =====================
  // UI LOGIC
  // =====================
  const isAirbnb = channel === "airbnb";
  const isDirect = channel === "direct";

  const isBase = mode === "base";
  const isAllIn = mode === "allin";

  function HeaderTitle() {
    if (isAirbnb && isBase) return "Airbnb - Base";
    if (isAirbnb && isAllIn) return "Airbnb - All-in";
    if (isDirect && isBase) return "Diretta - Base";
    if (isDirect && isAllIn) return "Diretta - All-in";
    return "Calcolatore";
  }

  const buttonStyle = (active) => ({
    flex: 1,
    padding: "10px",
    borderRadius: "12px",
    border: "none",
    background: active ? "#70AC76" : "#f3f4f6",
    color: active ? "white" : "#111827",
    fontWeight: "600",
    fontSize: "12px"
  });

  const cardStyle = {
    background: "white",
    padding: 18,
    borderRadius: 18,
    marginBottom: 12
  };

  return (
    <div style={{ fontFamily: "Inter", paddingBottom: 100 }}>
      {/* HEADER */}
      <div style={{ background: "#70AC76", color: "white", padding: 20, textAlign: "center" }}>
        {HeaderTitle()}
      </div>

      {/* TOGGLE CHANNEL */}
      <div style={{ display: "flex" }}>
        <button onClick={() => setChannel("airbnb")} style={buttonStyle(isAirbnb)}>
          Airbnb
        </button>
        <button onClick={() => setChannel("direct")} style={buttonStyle(isDirect)}>
          Diretta
        </button>
      </div>

      {/* TOGGLE MODE */}
      <div style={{ display: "flex" }}>
        <button onClick={() => setMode("base")} style={buttonStyle(isBase)}>
          Base
        </button>
        <button onClick={() => setMode("allin")} style={buttonStyle(isAllIn)}>
          All-in
        </button>
      </div>

      {/* INPUT */}
      <div style={cardStyle}>
        <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
        <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
        <input placeholder="Persone" value={persons} onChange={e => setPersons(e.target.value)} />

        {isAllIn ? (
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
        {isAirbnb && isBase && (
          <>
            <div>Ospite: €{airbnbGuestTotal.toFixed(2)}</div>
            <div>Host: €{airbnbHostNet.toFixed(2)}</div>
          </>
        )}

        {isAirbnb && isAllIn && (
          <div>Host: €{airbnbHostNetAI.toFixed(2)}</div>
        )}

        {isDirect && isBase && (
          <>
            <div>Ospite: €{directGuestTotal.toFixed(2)}</div>
            <div>Host: €{directHostNet.toFixed(2)}</div>
          </>
        )}

        {isDirect && isAllIn && (
          <div>Host: €{directHostNetAI.toFixed(2)}</div>
        )}
      </div>
    </div>
  );
}
