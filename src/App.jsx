import { useState } from "react";

const tabs = [
  { id: "airbnb", label: "Airbnb" },
  { id: "direct", label: "Diretta" },
  { id: "airbnb_ai", label: "Airbnb\nAll-in" },
  { id: "direct_ai", label: "Diretta\nAll-in" },
];

export default function App() {
  const [tab, setTab] = useState("airbnb");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [persons, setPersons] = useState("");
  const [price, setPrice] = useState("");
  const [finalPrice, setFinalPrice] = useState("");

  const resetForm = () => {
    setCheckIn("");
    setCheckOut("");
    setPersons("");
    setPrice("");
    setFinalPrice("");
  };

  const addDays = (dateString, days) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toISOString().split("T")[0];
  };

  const handleCheckIn = (value) => {
    setCheckIn(value);
    if (checkOut && value && checkOut <= value) {
      setCheckOut("");
    }
  };

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

  const formatDate = (value) => {
    if (!value) return "";
    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
  };

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
  const isAllIn = tab === "airbnb_ai" || tab === "direct_ai";

  const guestFee = priceNumber * airbnbGuestFeeRate;
  const totalGuest = priceNumber + guestFee + touristTax;
  const hostFee = priceNumber * serviceFeeHost;
  const vat = hostFee * vatRate;
  const cedolare = totalGuest * taxRate;
  const netAirbnb = priceNumber - hostFee - vat - cedolare;

  const directTotal = priceNumber + touristTax;
  const directCedolare = priceNumber * taxRate;
  const directNet = priceNumber - directCedolare;

  const baseAirbnb = finalPriceNumber - touristTax;
  const soggiornoAirbnb = baseAirbnb / (1 + airbnbGuestFeeRate);
  const guestFeeAI = baseAirbnb - soggiornoAirbnb;
  const hostFeeAI = soggiornoAirbnb * serviceFeeHost;
  const vatAI = hostFeeAI * vatRate;
  const cedolareAI = finalPriceNumber * taxRate;
  const netAirbnbAI = soggiornoAirbnb - hostFeeAI - vatAI - cedolareAI;

  const baseDirectAI = finalPriceNumber - touristTax;
  const netDirectAI = baseDirectAI * (1 - taxRate);
  const cedolareDirectAI = netDirectAI * taxRate;

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
  const activeIndex = tabs.findIndex((item) => item.id === tab);
  const checkOutMin = addDays(checkIn, 1);

  return (
    <div style={app}>
      <div style={header}>{current.title}</div>

      <div key={tab} style={content}>
        <div style={card}>
          <Label>Check-in</Label>
          <DateInput value={checkIn} onChange={handleCheckIn} formatDate={formatDate} />

          <Label>Check-out</Label>
          <DateInput
            value={checkOut}
            onChange={setCheckOut}
            formatDate={formatDate}
            min={checkOutMin}
          />

          <div style={nightsStyle}>Notti: {nights}</div>

          <Label>Persone</Label>
          <Input value={persons} onChange={setPersons} />

          <Label>{isAllIn ? "Prezzo forfait" : "Prezzo soggiorno"}</Label>

          {isAllIn ? (
            <Input value={finalPrice} onChange={setFinalPrice} />
          ) : (
            <Input value={price} onChange={setPrice} />
          )}

          <button style={resetButton} onClick={resetForm}>
            Nuovo preventivo
          </button>
        </div>

        <Section title="OSPITE" obj={current.ospite} eur={eur} />
        <Section title="HOST" obj={current.host} eur={eur} />
      </div>

      <div style={tabBar}>
        <div
          style={{
            ...activePill,
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />

        {tabs.map((item) => (
          <Tab
            key={item.id}
            label={item.label}
            active={tab === item.id}
            onClick={() => setTab(item.id)}
          />
        ))}
      </div>
    </div>
  );
}

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

function DateInput({ value, onChange, formatDate, min }) {
  return (
    <div style={dateWrapper}>
      <div style={{ ...dateText, color: value ? "#111827" : "#9ca3af" }}>
        {value ? formatDate(value) : "gg/mm/aaaa"}
      </div>

      <input
        type="date"
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        style={hiddenDateInput}
      />
    </div>
  );
}

function Section({ title, obj, eur }) {
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
}

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...tabButton,
        color: active ? "#5c8f6a" : "#dbeadd",
        transform: active ? "scale(1.03)" : "scale(1)",
      }}
    >
      {label}
    </button>
  );
}

const app = {
  fontFamily: "system-ui",
  background: "#f4f5f6",
  minHeight: "100vh",
  paddingBottom: 92,
};

const header = {
  background: "#5c8f6a",
  color: "white",
  textAlign: "center",
  padding: 18,
  fontWeight: 700,
  fontSize: 18,
};

const content = {
  padding: 16,
  animation: "fadeIn 220ms ease",
};

const card = {
  background: "white",
  borderRadius: 20,
  padding: 16,
  marginBottom: 16,
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
};

const label = {
  fontSize: 14,
  fontWeight: 700,
  marginTop: 12,
  marginBottom: 6,
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
  appearance: "none",
};

const dateWrapper = {
  position: "relative",
  width: "100%",
  maxWidth: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #ddd",
  fontSize: 16,
  background: "#f9fafb",
  minHeight: 46,
};

const dateText = {
  lineHeight: "22px",
  fontSize: 16,
  fontWeight: 500,
};

const hiddenDateInput = {
  position: "absolute",
  inset: 0,
  opacity: 0,
  width: "100%",
  height: "100%",
  cursor: "pointer",
};

const nightsStyle = {
  marginTop: 10,
  marginBottom: 6,
  fontWeight: 700,
};

const resetButton = {
  width: "100%",
  marginTop: 18,
  padding: "13px 14px",
  borderRadius: 14,
  border: "none",
  background: "#eef5f0",
  color: "#5c8f6a",
  fontWeight: 800,
  fontSize: 15,
  cursor: "pointer",
};

const sectionTitle = {
  textAlign: "center",
  fontWeight: 800,
  fontSize: 20,
};

const bigNumber = {
  fontSize: 32,
  fontWeight: 800,
  marginTop: 10,
};

const subLabel = {
  fontSize: 12,
  color: "#5c8f6a",
  fontWeight: 700,
  marginBottom: 12,
  textTransform: "uppercase",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 10,
};

const box = {
  background: "#f3f4f6",
  padding: 10,
  borderRadius: 12,
};

const boxLabel = {
  fontSize: 11,
};

const boxValue = {
  fontWeight: 700,
};

const tabBar = {
  position: "fixed",
  bottom: 10,
  left: 10,
  right: 10,
  height: 64,
  display: "flex",
  alignItems: "center",
  background: "#5c8f6a",
  borderRadius: 22,
  padding: 6,
  boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
  overflow: "hidden",
};

const activePill = {
  position: "absolute",
  top: 6,
  left: 6,
  width: "calc((100% - 12px) / 4)",
  height: "calc(100% - 12px)",
  background: "white",
  borderRadius: 16,
  transition: "transform 260ms ease",
  zIndex: 0,
};

const tabButton = {
  flex: 1,
  height: "100%",
  border: "none",
  background: "transparent",
  fontWeight: 800,
  fontSize: 11,
  whiteSpace: "pre-line",
  lineHeight: 1.1,
  position: "relative",
  zIndex: 1,
  transition: "color 220ms ease, transform 140ms ease",
};
