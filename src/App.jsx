import { useState } from "react";

export default function App() {
  const [tab, setTab] = useState("airbnb");

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  // 🔥 CAMPI VUOTI (FIX UX)
  const [persons, setPersons] = useState("");
  const [price, setPrice] = useState("");
  const [finalPrice, setFinalPrice] = useState("");

  // COSTANTI
  const serviceFeeHost = 0.03;
  const airbnbGuestFeeRate = 0.14117427;
  const taxRate = 0.21;
  const vatRate = 0.22;
  const cityTax = 9.5;
  const maxNightsTax = 14;

  // SAFE NUMBERS
  const p = Number(price) || 0;
  const f = Number(finalPrice) || 0;
  const people = Number(persons) || 0;

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
  // AIRBNB STANDARD
  // =====================
  const guestFee = p * airbnbGuestFeeRate;
  const totalGuest = p + guestFee + touristTax;

  const hostFee = p * serviceFeeHost;
  const vat = hostFee * vatRate;
  const cedolare = p * taxRate;

  const netAirbnb = p - hostFee - vat - cedolare;

  // =====================
  // DIRETTA STANDARD
  // =====================
  const directTotal = p + touristTax;
  const directNet = (p - touristTax) * (1 - taxRate);

  // =====================
  // AIRBNB ALL-IN
  // =====================
  const priceWithoutTaxAirbnb = f - touristTax;

  const baseAirbnb =
    priceWithoutTaxAirbnb /
    (1 + airbnbGuestFeeRate);

  const hostFeeAI = baseAirbnb * serviceFeeHost;
  const vatAI = hostFeeAI * vatRate;
  const cedolareAI = baseAirbnb * taxRate;

  const netAirbnbAI =
    baseAirbnb - hostFeeAI - vatAI - cedolareAI;

  // =====================
  // DIRETTA ALL-IN
  // =====================
  const baseDirectAI = f - touristTax;

  const netDirectAI =
    baseDirectAI * (1 - taxRate);

  // =====================
  // MODALITÀ
  // =====================
  const isAllIn =
    tab === "airbnb_ai" ||
    tab === "direct_ai";

  // =====================
  // CONFRONTO
  // =====================
  const compareAirbnb =
    isAllIn
      ? netAirbnbAI
      : netAirbnb;

  const compareDirect =
    isAllIn
      ? netDirectAI
      : directNet;

  const difference =
    compareAirbnb -
    compareDirect;

  const percent =
    compareDirect !== 0
      ? (difference /
          compareDirect) *
        100
      : 0;

  const best =
    difference > 0
      ? "Airbnb"
      : "Diretta";

  const bestColor =
    difference > 0
      ? "#70AC76"
      : "#b91c1c";

  // =====================
  // PREZZO OTTIMALE
  // =====================
  const airbnbCostRate =
    airbnbGuestFeeRate +
    serviceFeeHost +
    vatRate * serviceFeeHost +
    taxRate;

  const directCostRate = taxRate;

  const suggestedAirbnbPrice =
    p / (1 - airbnbCostRate) +
    touristTax;

  const suggestedDirectPrice =
    p / (1 - directCostRate) +
    touristTax;

  const breakEvenPrice =
    (touristTax +
      p * (1 - airbnbCostRate)) /
    (1 - airbnbCostRate);

  // HEADER
  function HeaderTitle() {
    switch (tab) {
      case "airbnb":
        return "Offerta Airbnb";
      case "direct":
        return "Offerta Diretta";
      case "airbnb_ai":
        return "Airbnb All-in";
      case "direct_ai":
        return "Diretta All-in";
      default:
        return "Calcolatore Romolhouse";
    }
  }

  const buttonStyle = (active) => ({
    flex: 1,
    padding: "12px",
    borderRadius: "14px",
    border: "none",
    background: active
      ? "#70AC76"
      : "#f3f4f6",
    color: active
      ? "white"
      : "#111827",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "13px"
  });

  const cardStyle = {
    background: "white",
    borderRadius: "22px",
    padding: "20px",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.06)"
  };

  return (
    <div
      style={{
        background: "#f7f7f7",
        minHeight: "100vh",
        paddingBottom: "110px",
        fontFamily:
          "'Inter', system-ui, sans-serif"
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: "#70AC76",
          color: "white",
          padding: "22px",
          textAlign: "center",
          fontWeight: "700",
          fontSize: "20px"
        }}
      >
        {HeaderTitle()}
      </div>

      <div
        style={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }}
      >
        {/* FORM */}
        <div style={cardStyle}>
          <label>Check-in</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) =>
              setCheckIn(e.target.value)
            }
            style={{ width: "100%", padding: 10 }}
          />

          <label>Check-out</label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) =>
              setCheckOut(e.target.value)
            }
            style={{ width: "100%", padding: 10 }}
          />

          <label>Notti</label>
          <div style={{ padding: 10, background: "#f3f4f6" }}>
            {nights}
          </div>

          <label>Persone</label>
          <input
            type="number"
            value={persons}
            onChange={(e) =>
              setPersons(e.target.value)
            }
            style={{ width: "100%", padding: 10 }}
          />

          {isAllIn ? (
            <>
              <label>Prezzo finale cliente (€)</label>
              <input
                type="number"
                value={finalPrice}
                onChange={(e) =>
                  setFinalPrice(e.target.value)
                }
                style={{ width: "100%", padding: 10 }}
              />
            </>
          ) : (
            <>
              <label>Prezzo soggiorno (€)</label>
              <input
                type="number"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value)
                }
                style={{ width: "100%", padding: 10 }}
              />
            </>
          )}
        </div>

        {/* OSPITE */}
        <div style={cardStyle}>
          <div style={{ fontWeight: 700 }}>OSPITE</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>
            €
            {(
              isAllIn
                ? f
                : tab === "direct"
                ? directTotal
                : totalGuest
            ).toFixed(2)}
          </div>
        </div>

        {/* HOST */}
        <div style={cardStyle}>
          <div style={{ fontWeight: 700 }}>HOST</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>
            €
            {(
              tab === "airbnb_ai"
                ? netAirbnbAI
                : tab === "direct_ai"
                ? netDirectAI
                : tab === "direct"
                ? directNet
                : netAirbnb
            ).toFixed(2)}
          </div>
        </div>

        {/* CONFRONTO */}
        <div style={cardStyle}>
          <div style={{ fontWeight: 700 }}>CONFRONTO</div>

          <div>Airbnb: €{compareAirbnb.toFixed(2)}</div>
          <div>Diretta: €{compareDirect.toFixed(2)}</div>

          <div style={{ fontSize: 20, fontWeight: 800, marginTop: 10 }}>
            Differenza: €{difference.toFixed(2)}
          </div>

          <div style={{ color: bestColor, fontWeight: 700 }}>
            Conviene: {best}
          </div>

          <div>Vantaggio: {percent.toFixed(1)}%</div>
        </div>

        {/* PREZZO OTTIMALE */}
        <div style={cardStyle}>
          <div style={{ fontWeight: 700 }}>PREZZO CONSIGLIATO</div>

          <div>Airbnb: €{suggestedAirbnbPrice.toFixed(2)}</div>
          <div>Diretta: €{suggestedDirectPrice.toFixed(2)}</div>

          <div style={{ fontSize: 18, fontWeight: 800, marginTop: 10 }}>
            Break-even: €{breakEvenPrice.toFixed(2)}
          </div>
        </div>
      </div>

      {/* TAB */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "white", padding: 14, display: "flex", gap: 8 }}>
        <button onClick={() => setTab("airbnb")} style={buttonStyle(tab === "airbnb")}>Airbnb</button>
        <button onClick={() => setTab("direct")} style={buttonStyle(tab === "direct")}>Diretta</button>
        <button onClick={() => setTab("airbnb_ai")} style={buttonStyle(tab === "airbnb_ai")}>Airbnb All-in</button>
        <button onClick={() => setTab("direct_ai")} style={buttonStyle(tab === "direct_ai")}>Diretta All-in</button>
      </div>
    </div>
  );
}
