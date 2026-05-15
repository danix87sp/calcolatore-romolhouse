import { useState } from "react";

export default function App() {
  const [tab, setTab] = useState("airbnb");

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [persons, setPersons] = useState(1);
  const [price, setPrice] = useState(250);

  // COSTANTI
  const serviceFeeHost = 0.03;
  const airbnbGuestFeeRate = 0.14117427;
  const taxRate = 0.21;
  const vatRate = 0.22;
  const cityTax = 9.5;
  const maxNightsTax = 14;

  // CALCOLO NOTTI
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

  // AIRBNB
  const guestFee = price * airbnbGuestFeeRate;
  const totalGuest = price + guestFee + touristTax;

  const hostFee = price * serviceFeeHost;
  const vat = hostFee * vatRate;
  const cedolare = price * taxRate;

  const netAirbnb =
    price - hostFee - vat - cedolare;

  // DIRETTA
  const directTotal = price + touristTax;

  const directNet =
    (price - touristTax) * (1 - taxRate);

  function HeaderTitle() {
    switch (tab) {
      case "airbnb":
        return "Offerta Airbnb";
      case "direct":
        return "Offerta Diretta";
      case "airbnb_ai":
        return "Airbnb (All-inclusive)";
      case "direct_ai":
        return "Diretta (All-inclusive)";
      default:
        return "Calcolatore Romolhouse";
    }
  }

  const buttonStyle = (active) => ({
    flex: 1,
    padding: "12px",
    borderRadius: "14px",
    border: "none",
    background: active ? "#166534" : "#f3f4f6",
    color: active ? "white" : "#111827",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "13px"
  });

  const cardStyle = {
    background: "white",
    borderRadius: "22px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
  };

  return (
    <div
      style={{
        background: "#f7f7f7",
        minHeight: "100vh",
        paddingBottom: "110px",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, sans-serif"
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: "#166534",
          color: "white",
          padding: "22px",
          textAlign: "center",
          fontWeight: "700",
          fontSize: "20px"
        }}
      >
        {HeaderTitle()}
      </div>

      {/* FORM */}
      <div
        style={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }}
      >
        <div style={cardStyle}>
          <div style={{ marginBottom: 12 }}>
            <label>Check-in</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) =>
                setCheckIn(e.target.value)
              }
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                border: "1px solid #ddd",
                marginTop: 6
              }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Check-out</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) =>
                setCheckOut(e.target.value)
              }
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                border: "1px solid #ddd",
                marginTop: 6
              }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Notti</label>
            <div
              style={{
                padding: "12px",
                background: "#f3f4f6",
                borderRadius: "12px",
                marginTop: 6
              }}
            >
              {nights}
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Persone</label>
            <input
              type="number"
              value={persons}
              onChange={(e) =>
                setPersons(Number(e.target.value))
              }
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                border: "1px solid #ddd",
                marginTop: 6
              }}
            />
          </div>

          <div>
            <label>Prezzo soggiorno (€)</label>
            <input
              type="number"
              value={price}
              onChange={(e) =>
                setPrice(Number(e.target.value))
              }
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                border: "1px solid #ddd",
                marginTop: 6
              }}
            />
          </div>
        </div>

        {/* OSPITE */}
        <div style={cardStyle}>
          <div
            style={{
              fontWeight: 700,
              marginBottom: 10
            }}
          >
            OSPITE
          </div>

          <div
            style={{
              fontSize: 30,
              fontWeight: 800
            }}
          >
            €
            {(tab.includes("direct")
              ? directTotal
              : totalGuest
            ).toFixed(2)}
          </div>

          {!tab.includes("direct") && (
            <>
              <p>
                Commissioni Airbnb: €
                {guestFee.toFixed(2)}
              </p>
            </>
          )}

          <p>
            Tassa soggiorno: €
            {touristTax.toFixed(2)}
          </p>
        </div>

        {/* HOST */}
        <div style={cardStyle}>
          <div
            style={{
              fontWeight: 700,
              marginBottom: 10
            }}
          >
            HOST
          </div>

          <div
            style={{
              fontSize: 30,
              fontWeight: 800
            }}
          >
            €
            {(tab.includes("direct")
              ? directNet
              : netAirbnb
            ).toFixed(2)}
          </div>

          {!tab.includes("direct") && (
            <>
              <p>
                Fee host: €
                {hostFee.toFixed(2)}
              </p>
              <p>
                IVA fee: €
                {vat.toFixed(2)}
              </p>
            </>
          )}

          <p>
            Cedolare: €
            {cedolare.toFixed(2)}
          </p>
        </div>
      </div>

      {/* TAB BAR */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "white",
          padding: "14px",
          borderTop: "1px solid #eee",
          display: "flex",
          gap: "8px"
        }}
      >
        <button
          onClick={() => setTab("airbnb")}
          style={buttonStyle(
            tab === "airbnb"
          )}
        >
          Airbnb
        </button>

        <button
          onClick={() => setTab("direct")}
          style={buttonStyle(
            tab === "direct"
          )}
        >
          Diretta
        </button>

        <button
  onClick={() =>
    setTab("airbnb_ai")
  }
  style={buttonStyle(
    tab === "airbnb_ai"
  )}
>
  Airbnb All-in
</button>

<button
  onClick={() =>
    setTab("direct_ai")
  }
  style={buttonStyle(
    tab === "direct_ai"
  )}
>
  Diretta All-in
</button>
      </div>
    </div>
  );
}
