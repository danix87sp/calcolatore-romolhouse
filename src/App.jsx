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

  // FORMAT €
  const eur = (v) =>
    v.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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
  const cedolare = totalGuest * taxRate;

  const netAirbnb = price - hostFee - vat - cedolare;

  // =========================
  // DIRETTA STANDARD
  // =========================
  const directTotal = price + touristTax;
  const directCedolare = price * taxRate;
  const directNet = price - directCedolare;

  // =========================
  // AIRBNB ALL-IN
  // =========================
  const baseAirbnb = finalPrice - touristTax;

  const soggiornoAirbnb =
    baseAirbnb / (1 + airbnbGuestFeeRate);

  const guestFeeAI =
    baseAirbnb - soggiornoAirbnb;

  const hostFeeAI = soggiornoAirbnb * serviceFeeHost;
  const vatAI = hostFeeAI * vatRate;
  const cedolareAI = finalPrice * taxRate;

  const netAirbnbAI =
    soggiornoAirbnb - hostFeeAI - vatAI - cedolareAI;

  // =========================
  // DIRETTA ALL-IN
  // =========================
  const baseDirectAI = finalPrice - touristTax;
  const netDirectAI = baseDirectAI * (1 - taxRate);
  const cedolareDirectAI = netDirectAI * taxRate;

  // =========================
  // DATA
  // =========================
  const data = {
    airbnb: {
      title: "Offerta Airbnb",
      ospite: {
        Totale: totalGuest,
        "Commissioni ospite": guestFee,
        "Tassa soggiorno": touristTax,
      },
      host: {
        Netto: netAirbnb,
        "Commissioni host": hostFee,
        IVA: vat,
        "Cedolare 21%": cedolare,
      },
    },

    direct: {
      title: "Offerta Diretta",
      ospite: {
        Totale: directTotal,
        "Tassa soggiorno": touristTax,
      },
      host: {
        Netto: directNet,
        "Cedolare 21%": directCedolare,
      },
    },

    airbnb_ai: {
      title: "Airbnb All-in",
      ospite: {
        "Prezzo soggiorno": soggiornoAirbnb,
        "Commissioni ospite": guestFeeAI,
        "Tassa soggiorno": touristTax,
        Totale: finalPrice,
      },
      host: {
        Netto: netAirbnbAI,
        "Commissioni host": hostFeeAI,
        IVA: vatAI,
        "Cedolare 21%": cedolareAI,
      },
    },

    direct_ai: {
      title: "Diretta All-in",
      ospite: {
        Totale: finalPrice,
        "Tassa soggiorno": touristTax,
      },
      host: {
        Netto: netDirectAI,
        "Cedolare 21%": cedolareDirectAI,
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
      <div style={{ fontWeight: 700 }}>€{eur(value)}</div>
    </div>
  );

  const section = (title, obj) => {
    const mainValue =
      obj.Totale ?? obj.Netto ?? 0;

    return (
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

        <div style={{
          fontSize: 28,
          fontWeight: 800,
          marginTop: 10
        }}>
          €{eur(mainValue)}
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginTop: 12
        }}>
          {Object.entries(obj)
            .filter(([k]) => k !== "Totale" && k !== "Netto")
            .map(([k, v]) => box(k, v))}
        </div>
      </div>
    );
  };

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
        {current.title}
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
            style={{ width: "100%", marginBottom: 8 }}
            placeholder="Persone"
          />

          <div style={{ marginTop: 10 }}>
            Notti: <b>{nights}</b>
          </div>

          {isAllIn ? (
            <input
              type="number"
              value={finalPrice}
              onChange={(e) => setFinalPrice(Number(e.target.value))}
              style={{ width: "100%", marginTop: 10 }}
              placeholder="Prezzo finale"
            />
          ) : (
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              style={{ width: "100%", marginTop: 10 }}
              placeholder="Prezzo soggiorno"
            />
          )}
        </div>

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
