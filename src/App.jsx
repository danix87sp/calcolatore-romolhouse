import { useState } from "react";

export default function App() {
  const [tab, setTab] = useState("airbnb");

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [persons, setPersons] = useState("");

  const [price, setPrice] = useState("");
  const [finalPrice, setFinalPrice] = useState("");

  const personsNumber = Number(persons) || 0;
  const priceNumber = Number(price) || 0;
  const finalPriceNumber = Number(finalPrice) || 0;

  const serviceFeeHost = 0.03;
  const airbnbGuestFeeRate = 0.14117427;
  const taxRate = 0.21;
  const vatRate = 0.22;
  const cityTax = 9.5;
  const maxNightsTax = 14;

  const eur = (v) =>
    v.toLocaleString("it-IT", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

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
  const touristTax = personsNumber * nightsForTax * cityTax;

  const isAllIn =
    tab === "airbnb_ai" || tab === "direct_ai";

  // CALCOLI
  const guestFee = priceNumber * airbnbGuestFeeRate;
  const totalGuest = priceNumber + guestFee + touristTax;

  const hostFee = priceNumber * serviceFeeHost;
  const vat = hostFee * vatRate;
  const cedolare = totalGuest * taxRate;
  const netAirbnb =
    priceNumber - hostFee - vat - cedolare;

  const directTotal = priceNumber + touristTax;
  const directCedolare = priceNumber * taxRate;
  const directNet = priceNumber - directCedolare;

  const baseAirbnb = finalPriceNumber - touristTax;
  const soggiornoAirbnb =
    baseAirbnb / (1 + airbnbGuestFeeRate);
  const guestFeeAI =
    baseAirbnb - soggiornoAirbnb;

  const hostFeeAI =
    soggiornoAirbnb * serviceFeeHost;
  const vatAI = hostFeeAI * vatRate;
  const cedolareAI =
    finalPriceNumber * taxRate;

  const netAirbnbAI =
    soggiornoAirbnb -
    hostFeeAI -
    vatAI -
    cedolareAI;

  const baseDirectAI =
    finalPriceNumber - touristTax;
  const netDirectAI =
    baseDirectAI * (1 - taxRate);
  const cedolareDirectAI =
    netDirectAI * taxRate;

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
      title: "Offerta Airbnb All-in",
      ospite: {
        "Prezzo soggiorno": soggiornoAirbnb,
        "Commissioni ospite": guestFeeAI,
        "Tassa soggiorno": touristTax,
        Totale: finalPriceNumber,
      },
      host: {
        Netto: netAirbnbAI,
        "Commissioni host": hostFeeAI,
        IVA: vatAI,
        "Cedolare 21%": cedolareAI,
      },
    },

    direct_ai: {
      title: "Offerta Diretta All-in",
      ospite: {
        Totale: finalPriceNumber,
        "Tassa soggiorno": touristTax,
      },
      host: {
        Netto: netDirectAI,
        "Cedolare 21%": cedolareDirectAI,
      },
    },
  };

  const current = data[tab];

  const section = (title, obj) => {
    const isGuest = title === "OSPITE";
    const mainLabel = isGuest ? "Totale" : "Netto";
    const mainValue = obj[mainLabel] ?? 0;

    return (
      <div style={card}>
        <div style={sectionTitle}>{title}</div>
        <div style={bigNumber}>€{eur(mainValue)}</div>
        <div style={subLabel}>{mainLabel}</div>

        <div style={grid}>
          {Object.entries(obj)
            .filter(([k]) => k !== "Totale" && k !== "Netto")
            .map(([k, v]) => (
              <div key={k} style={box}>
                <div style={boxLabel}>{k}</div>
                <div style={boxValue}>€{eur(v)}</div>
              </div>
            ))}
        </div>
      </div>
    );
  };

  return (
    <div style={app}>
      <div style={header}>{current.title}</div>

      <div style={{ padding: 16 }}>
        <div style={card}>
          <Label>Check-in</Label>
          <Input type="date" value={checkIn} onChange={setCheckIn} />

          <Label>Check-out</Label>
          <Input type="date" value={checkOut} onChange={setCheckOut} />

          <div style={nightsStyle}>Notti: {nights}</div>

          <Label>Persone</Label>
          <Input value={persons} onChange={setPersons} />

          <Label>
            {isAllIn ? "Prezzo forfait" : "Prezzo soggiorno"}
          </Label>

          {isAllIn ? (
            <Input value={finalPrice} onChange={setFinalPrice} />
          ) : (
            <Input value={price} onChange={setPrice} />
          )}
        </div>

        {section("OSPITE", current.ospite)}
        {section("HOST", current.host)}
      </div>

      <div style={tabBar}>
        <Tab label="Airbnb" active={tab==="airbnb"} onClick={() => setTab("airbnb")} />
        <Tab label="Diretta" active={tab==="direct"} onClick={() => setTab("direct")} />
        <Tab label="Airbnb All-in" active={tab==="airbnb_ai"} onClick={() => setTab("airbnb_ai")} />
        <Tab label="Diretta All-in" active={tab==="direct_ai"} onClick={() => setTab("direct_ai")} />
      </div>
    </div>
  );
}

/* COMPONENTI */

function Label({ children }) {
  return <div style={label}>{children}</div>;
}

function Input({ value, onChange, type = "number" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={input}
    />
  );
}

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: 12,
        border: "none",
        background: "transparent",
        color: active ? "white" : "#cfe3d6",
        fontWeight: 700,
        fontSize: 12
      }}
    >
      {label}
    </button>
  );
}

/* STILI */

const app = {
  fontFamily: "system-ui",
  background: "#f4f5f6",
  minHeight: "100vh",
  paddingBottom: 80
};

const header = {
  background: "#5c8f6a",
  color: "white",
  textAlign: "center",
  padding: 18,
  fontWeight: 700,
  fontSize: 18
};

const card = {
  background: "white",
  borderRadius: 20,
  padding: 16,
  marginBottom: 16,
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
};

const label = {
  fontSize: 14,
  fontWeight: 700,
  marginTop: 12,
  marginBottom: 6
};

const input = {
  width: "100%",
  maxWidth: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #ddd",
  fontSize: 16,
  background: "#f9fafb",
  outline: "none",
  appearance: "none"
};

const nightsStyle = {
  marginTop: 10,
  marginBottom: 6,
  fontWeight: 700
};

const sectionTitle = {
  textAlign: "center",
  fontWeight: 800,
  fontSize: 20
};

const bigNumber = {
  fontSize: 32,
  fontWeight: 800,
  marginTop: 10
};

const subLabel = {
  fontSize: 12,
  color: "#5c8f6a",
  fontWeight: 700,
  marginBottom: 12
};

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 10
};

const box = {
  background: "#f3f4f6",
  padding: 10,
  borderRadius: 12
};

const boxLabel = {
  fontSize: 11
};

const boxValue = {
  fontWeight: 700
};

const tabBar = {
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  display: "flex",
  background: "#5c8f6a"
};
