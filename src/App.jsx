import { useState } from "react";

export default function App() {
  const [tab, setTab] = useState("airbnb");

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [persons, setPersons] = useState(1);

  const price = 250;

  // COSTANTI
  const airbnbFee = 0.14117427;
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
      (outDate - inDate) / (1000 * 60 * 60 * 24);
    return diff > 0 ? diff : 0;
  })();

  const nightsTax = Math.min(nights, maxNightsTax);
  const touristTax = persons * nightsTax * cityTax;

  // =========================
  // AIRBNB STANDARD
  // =========================
  const guestFee = price * airbnbFee;

  const ospiteTotal = price + guestFee + touristTax;

  const hostCommission = price * hostFeeRate;
  const hostVat = hostCommission * vatRate;
  const hostTax = price * taxRate;

  const hostNet =
    price - hostCommission - hostVat - hostTax;

  // =========================
  // UI HELP
  // =========================
  const TabButton = ({ id, label }) => (
    <button
      onClick={() => setTab(id)}
      style={{
        flex: 1,
        padding: 10,
        border: "none",
        background: tab === id ? "#5c8f6a" : "#fff",
        color: tab === id ? "white" : "black",
        fontSize: 11,
        fontWeight: 600,
      }}
    >
      {label}
    </button>
  );

  const Box = ({ label, value }) => (
    <div style={{
      background: "#f6f6f6",
      padding: 10,
      borderRadius: 12
    }}>
      <div style={{ fontSize: 12 }}>{label}</div>
      <div style={{ fontWeight: 700 }}>{value}</div>
    </div>
  );

  return (
    <div style={{ fontFamily: "system-ui", background: "#f5f5f5", minHeight: "100vh" }}>

      {/* HEADER */}
      <div style={{
        background: "#5c8f6a",
        color: "white",
        textAlign: "center",
        padding: 18,
        fontWeight: 700
      }}>
        Offerta Airbnb
      </div>

      <div style={{ padding: 16 }}>

        {/* INPUTS */}
        <div style={{
          background: "white",
          padding: 16,
          borderRadius: 16,
          marginBottom: 12
        }}>

          <input type="date" value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            style={{ width: "100%", marginBottom: 8 }} />

          <input type="date" value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            style={{ width: "100%", marginBottom: 8 }} />

          <input type="number" value={persons}
            onChange={(e) => setPersons(Number(e.target.value))}
            placeholder="Persone"
            style={{ width: "100%" }} />

          <div style={{ marginTop: 10 }}>
            Notti: <strong>{nights}</strong>
          </div>

        </div>

        {/* OSPITE */}
        <div style={{
          background: "white",
          borderRadius: 16,
          padding: 16,
          marginBottom: 12
        }}>
          <div style={{ fontSize: 22, fontWeight: 800, textAlign: "center" }}>
            OSPITE
          </div>

          <div style={{ fontSize: 28, fontWeight: 800 }}>
            €{ospiteTotal.toFixed(2)}
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginTop: 12
          }}>
            <Box label="Commissioni Ospite" value={guestFee.toFixed(2)} />
            <Box label="Tassa soggiorno" value={touristTax.toFixed(2)} />
          </div>
        </div>

        {/* HOST */}
        <div style={{
          background: "white",
          borderRadius: 16,
          padding: 16
        }}>
          <div style={{ fontSize: 22, fontWeight: 800, textAlign: "center" }}>
            HOST
          </div>

          <div style={{ fontSize: 28, fontWeight: 800 }}>
            €{hostNet.toFixed(2)}
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginTop: 12
          }}>
            <Box label="Commissioni Host" value={hostCommission.toFixed(2)} />
            <Box label="IVA 22%" value={hostVat.toFixed(2)} />
            <Box label="Cedolare 21%" value={hostTax.toFixed(2)} />
          </div>
        </div>
      </div>

      {/* TAB */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        background: "white",
        borderTop: "1px solid #ddd"
      }}>
        <TabButton id="airbnb" label="Airbnb" />
        <TabButton id="direct" label="Diretta" />
        <TabButton id="airbnb_ai" label="Airbnb All-in" />
        <TabButton id="direct_ai" label="Diretta All-in" />
      </div>

    </div>
  );
}
