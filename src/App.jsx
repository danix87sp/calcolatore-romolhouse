import { useState } from "react";

export default function App() {
  const [tab, setTab] = useState("airbnb");

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const [persons, setPersons] = useState("");
  const [price, setPrice] = useState("");

  const p = Number(price) || 0;
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

  const touristTax =
    people * nightsForTax * cityTax;

  // =====================
  // AIRBNB OSPITE
  // =====================
  const guestFee =
    p * airbnbGuestFeeRate;

  const airbnbGuestTotal =
    p + guestFee + touristTax;

  // =====================
  // AIRBNB HOST
  // =====================
  const hostFee =
    p * hostFeeRate;

  const vat =
    hostFee * vatRate;

  const cedolareAirbnb =
    p * taxRate;

  const airbnbHostNet =
    p - hostFee - vat - cedolareAirbnb;

  // =====================
  // DIRETTA OSPITE
  // =====================
  const directGuestTotal =
    p + touristTax;

  // =====================
  // DIRETTA HOST
  // =====================
  const cedolareDirect =
    p * taxRate;

  const directHostNet =
    p - cedolareDirect;

  // HEADER
  function HeaderTitle() {
    switch (tab) {
      case "airbnb":
        return "Airbnb";
      case "direct":
        return "Diretta";
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

          <label>Prezzo soggiorno (€)</label>
          <input
            type="number"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value)
            }
            style={{ width: "100%", padding: 10 }}
          />
        </div>

        {/* AIRBNB */}
        <div style={cardStyle}>
          <div style={{ fontWeight: 700 }}>AIRBNB</div>

          <div style={{ marginTop: 10 }}>
            <b>OSPITE</b>
            <div>Prezzo: €{p.toFixed(2)}</div>
            <div>Commissioni Airbnb: €{guestFee.toFixed(2)}</div>
            <div>Tassa soggiorno: €{touristTax.toFixed(2)}</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>
              Totale: €{airbnbGuestTotal.toFixed(2)}
            </div>
          </div>

          <div style={{ marginTop: 10 }}>
            <b>HOST</b>
            <div>Commissioni host: €{hostFee.toFixed(2)}</div>
            <div>IVA 22%: €{vat.toFixed(2)}</div>
            <div>Cedolare 21%: €{cedolareAirbnb.toFixed(2)}</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>
              Netto: €{airbnbHostNet.toFixed(2)}
            </div>
          </div>
        </div>

        {/* DIRETTA */}
        <div style={cardStyle}>
          <div style={{ fontWeight: 700 }}>DIRETTA</div>

          <div style={{ marginTop: 10 }}>
            <b>OSPITE</b>
            <div>Prezzo: €{p.toFixed(2)}</div>
            <div>Tassa soggiorno: €{touristTax.toFixed(2)}</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>
              Totale: €{directGuestTotal.toFixed(2)}
            </div>
          </div>

          <div style={{ marginTop: 10 }}>
            <b>HOST</b>
            <div>Cedolare 21%: €{cedolareDirect.toFixed(2)}</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>
              Netto: €{directHostNet.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* TAB */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "white", padding: 14, display: "flex", gap: 8 }}>
        <button onClick={() => setTab("airbnb")} style={buttonStyle(tab === "airbnb")}>Airbnb</button>
        <button onClick={() => setTab("direct")} style={buttonStyle(tab === "direct")}>Diretta</button>
      </div>
    </div>
  );
}
