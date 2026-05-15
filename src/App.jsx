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
  const vatRate = 0.22;
  const taxRate = 0.21;
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

  // =========================
  // AIRBNB BASE
  // =========================
  const airbnbGuestFee = p * airbnbGuestFeeRate;
  const airbnbHostFee = p * hostFeeRate;
  const airbnbVat = airbnbHostFee * vatRate;
  const airbnbCedolare = p * taxRate;

  const airbnbGuestTotal =
    p + airbnbGuestFee + touristTax;

  const airbnbHostNet =
    p -
    airbnbHostFee -
    airbnbVat -
    airbnbCedolare;

  // =========================
  // AIRBNB ALL-IN (scorporo)
  // =========================
  const baseAirbnb =
    (f - touristTax) /
    (1 + airbnbGuestFeeRate);

  const airbnbHostNetAI =
    baseAirbnb -
    baseAirbnb * hostFeeRate -
    (baseAirbnb * hostFeeRate) * vatRate -
    baseAirbnb * taxRate;

  const airbnbGuestFeeAI =
    baseAirbnb * airbnbGuestFeeRate;

  // =========================
  // DIRETTA BASE
  // =========================
  const directGuestTotal =
    p + touristTax;

  const directCedolare =
    p * taxRate;

  const directHostNet =
    p - directCedolare;

  // =========================
  // DIRETTA ALL-IN
  // =========================
  const baseDirect =
    f - touristTax;

  const directHostNetAI =
    baseDirect -
    baseDirect * taxRate;

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
        return "Calcolatore Romolhouse";
    }
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
    borderRadius: "18px",
    padding: "18px",
    marginBottom: "12px"
  };

  return (
    <div style={{ fontFamily: "Inter", paddingBottom: 100 }}>
      {/* HEADER */}
      <div style={{ background: "#70AC76", color: "white", padding: 20, textAlign: "center" }}>
        {HeaderTitle()}
      </div>

      {/* FORM */}
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

        {/* AIRBNB BASE */}
        {tab === "airbnb_base" && (
          <>
            <div><b>OSPITE</b></div>
            <div>Prezzo: €{p.toFixed(2)}</div>
            <div>Commissioni Airbnb: €{airbnbGuestFee.toFixed(2)}</div>
            <div>Tassa soggiorno: €{touristTax.toFixed(2)}</div>
            <div style={{ fontWeight: 700 }}>
              Totale: €{airbnbGuestTotal.toFixed(2)}
            </div>

            <br />

            <div><b>HOST</b></div>
            <div>Fee host: €{airbnbHostFee.toFixed(2)}</div>
            <div>IVA 22%: €{airbnbVat.toFixed(2)}</div>
            <div>Cedolare 21%: €{airbnbCedolare.toFixed(2)}</div>
            <div style={{ fontWeight: 700 }}>
              Netto: €{airbnbHostNet.toFixed(2)}
            </div>
          </>
        )}

        {/* AIRBNB ALL-IN */}
        {tab === "airbnb_ai" && (
          <>
            <div>Base reale: €{baseAirbnb.toFixed(2)}</div>
            <div>Commissioni Airbnb: €{airbnbGuestFeeAI.toFixed(2)}</div>
            <div>Netto host: €{airbnbHostNetAI.toFixed(2)}</div>
          </>
        )}

        {/* DIRETTA BASE */}
        {tab === "direct_base" && (
          <>
            <div><b>OSPITE</b></div>
            <div>Prezzo: €{p.toFixed(2)}</div>
            <div>Tassa soggiorno: €{touristTax.toFixed(2)}</div>
            <div style={{ fontWeight: 700 }}>
              Totale: €{directGuestTotal.toFixed(2)}
            </div>

            <br />

            <div><b>HOST</b></div>
            <div>Cedolare 21%: €{directCedolare.toFixed(2)}</div>
            <div style={{ fontWeight: 700 }}>
              Netto: €{directHostNet.toFixed(2)}
            </div>
          </>
        )}

        {/* DIRETTA ALL-IN */}
        {tab === "direct_ai" && (
          <>
            <div>Base reale: €{baseDirect.toFixed(2)}</div>
            <div>Cedolare: €{(baseDirect * taxRate).toFixed(2)}</div>
            <div>Netto host: €{directHostNetAI.toFixed(2)}</div>
          </>
        )}

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
