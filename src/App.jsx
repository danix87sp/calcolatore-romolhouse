import { useState } from "react";

export default function App() {
  const [tab, setTab] = useState("airbnb");

  const price = 250;
  const guestFee = 35.29;
  const touristTax = 19;

  const hostNet = 176.95;
  const hostFee = 7.5;
  const vat = 1.65;
  const cedolare = 63.9;

  return (
    <div style={{ fontFamily: "system-ui", background: "#f6f6f6", minHeight: "100vh" }}>

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

          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 12, color: "green", fontWeight: 700 }}>TOTALE</div>
            <div style={{ fontSize: 26, fontWeight: 800 }}>
              {(price + guestFee + touristTax).toFixed(2)}
            </div>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginTop: 12
          }}>
            <div style={boxStyle}>
              <div>Commissioni Ospite</div>
              <strong>{guestFee.toFixed(2)}</strong>
            </div>

            <div style={boxStyle}>
              <div>Tassa di soggiorno</div>
              <strong>{touristTax.toFixed(2)}</strong>
            </div>
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

          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 12, color: "green", fontWeight: 700 }}>NETTO</div>
            <div style={{ fontSize: 26, fontWeight: 800 }}>
              {hostNet.toFixed(2)}
            </div>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginTop: 12
          }}>
            <div style={boxStyle}>
              <div>Commissioni Host</div>
              <strong>{hostFee.toFixed(2)}</strong>
            </div>

            <div style={boxStyle}>
              <div>IVA 22%</div>
              <strong>{vat.toFixed(2)}</strong>
            </div>

            <div style={boxStyle}>
              <div>Cedolare 21%</div>
              <strong>{cedolare.toFixed(2)}</strong>
            </div>
          </div>
        </div>

      </div>

      {/* TAB BAR */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "white",
        display: "flex",
        borderTop: "1px solid #ddd"
      }}>
        <Tab onClick={() => setTab("airbnb")} active={tab === "airbnb"} label="Offerta Airbnb" />
        <Tab onClick={() => setTab("direct")} active={tab === "direct"} label="Offerta Diretta" />
        <Tab onClick={() => setTab("airbnb_ai")} active={tab === "airbnb_ai"} label="Airbnb (All-in)" />
        <Tab onClick={() => setTab("direct_ai")} active={tab === "direct_ai"} label="Diretta (All-in)" />
      </div>

    </div>
  );
}

const boxStyle = {
  background: "#f7f7f7",
  borderRadius: 12,
  padding: 10,
  fontSize: 13
};

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: 12,
        border: "none",
        background: active ? "#e6f3ea" : "white",
        fontWeight: 600,
        fontSize: 11
      }}
    >
      {label}
    </button>
  );
}
