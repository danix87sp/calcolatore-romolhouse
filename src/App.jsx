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

  const isAllIn =
    tab === "airbnb_ai" || tab === "direct_ai";

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
  const directNet = price * (1 - taxRate);

  // =========================
  // AIRBNB ALL-IN
  // =========================
  const baseAirbnb = finalPrice - touristTax;
  const soggiornoAirbnb =
    baseAirbnb / (1 + airbnbGuestFeeRate);

  const guestFeeAI =
    soggiornoAirbnb * airbnbGuestFeeRate;

  const hostFeeAI = soggiornoAirbnb * serviceFeeHost;
  const vatAI = hostFeeAI * vatRate;
  const cedolareAI = soggiornoAirbnb * taxRate;

  const netAirbnbAI =
    soggiornoAirbnb - hostFeeAI - vatAI - cedolareAI;

  // =========================
  // DIRETTA ALL-IN
  // =========================
  const baseDirectAI = finalPrice - touristTax;
  const netDirectAI = baseDirectAI * (1 - taxRate);

  // =========================
  // DATA SWITCH
  // =========================
  const data = {
    airbnb: {
      ospite: {
        soggiorno: price,
        commissioni: guestFee,
        tassa: touristTax,
        totale: totalGuest,
      },
      host: {
        commissioni: hostFee,
        iva: vat,
        cedolare,
        netto: netAirbnb,
      },
    },

    direct: {
      ospite: {
        soggiorno: price,
        tassa: touristTax,
        totale: directTotal,
      },
      host: {
        cedolare: price * taxRate,
        netto: directNet,
      },
    },

    airbnb_ai: {
      ospite: {
        soggiorno: soggiornoAirbnb,
        commissioni: guestFeeAI,
        tassa: touristTax,
        totale: finalPrice,
      },
      host: {
        commissioni: hostFeeAI,
        iva: vatAI,
        cedolare: cedolareAI,
        netto: netAirbnbAI,
      },
    },

    direct_ai: {
      ospite: {
        tassa: touristTax,
        totale: finalPrice,
      },
      host: {
        cedolare: baseDirectAI * taxRate,
        netto: netDirectAI,
      },
    },
  };

  const current = data[tab];

  const box = (label, value) => (
    <div style={{
      background: "#f3f4f6",
      padding: 10,
      borderRadius: 12
    }}>
      <div style={{ fontSize: 12 }}>{label}</div>
      <div style={{ fontWeight: 700 }}>€{value.toFixed(2)}</div>
    </div>
  );

  const section = (title, obj) => (
    <div style={{
      background: "white",
      borderRadius: 16,
      padding: 16,
      marginBottom: 12
    }}>
      <div style={{
        fontSize: 22,
        fontWeight: 800,
        textAlign: "center"
      }}>
        {title}
      </div>

      <div style={{ fontSize: 28, fontWeight: 800, marginTop: 10 }}>
        €{obj.totale.toFixed(2)}
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 10,
        marginTop: 12
      }}>
        {Object.entries(obj)
          .filter(([k]) => k !== "totale")
          .map(([k, v]) => box(k, v))}
      </div>
    </div>
  );

  return (
    <div style={{
      fontFamily: "system-ui",
      background: "#f6f6f6",
      minHeight: "100vh",
      paddingBottom: 90
    }}>

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

      {/* INPUT */}
      <div style={{ padding: 16 }}>
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
            style={{ width: "100%" }} />

          <div style={{ marginTop: 10 }}>
            Notti: <b>{nights}</b>
          </div>

          {isAllIn && (
            <input
              type="number"
              value={finalPrice}
              onChange={(e) => setFinalPrice(Number(e.target.value))}
              style={{ width: "100%", marginTop: 10 }}
              placeholder="Prezzo finale"
            />
          )}

          {!isAllIn && (
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              style={{ width: "100%", marginTop: 10 }}
              placeholder="Prezzo soggiorno"
            />
          )}
        </div>

        {/* OUTPUT */}
        {section("OSPITE", current.ospite)}
        {section("HOST", current.host)}
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
        <Tab label="Airbnb" active={tab==="airbnb"} onClick={() => setTab("airbnb")} />
        <Tab label="Diretta" active={tab==="direct"} onClick={() => setTab("direct")} />
        <Tab label="Airbnb All-in" active={tab==="airbnb_ai"} onClick={() => setTab("airbnb_ai")} />
        <Tab label="Diretta All-in" active={tab==="direct_ai"} onClick={() => setTab("direct_ai")} />
      </div>
    </div>
  );
}

function Tab({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      flex: 1,
      padding: 10,
      fontSize: 11,
      border: "none",
      background: active ? "#e6f3ea" : "white",
      fontWeight: 600
    }}>
      {label}
    </button>
  );
}
