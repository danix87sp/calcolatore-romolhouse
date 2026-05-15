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

  return (
    <div style={app}>
      <div style={header}>{current.title}</div>

      <div style={{ padding: 16 }}>
        {/* INPUT */}
        <div style={card}>
          <Label>Check-in</Label>
          <DateInput value={checkIn} onChange={setCheckIn} formatDate={formatDate} />

          <Label>Check-out</Label>
          <DateInput value={checkOut} onChange={setCheckOut} formatDate={formatDate} />

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

        <Section title="OSPITE" obj={current.ospite} eur={eur} />
        <Section title="HOST" obj={current.host} eur={eur} />
      </div>

      {/* TAB BAR */}
      <div style={tabBar}>
        <Tab label="Airbnb" active={tab==="airbnb"} onClick={() => setTab("airbnb")} />
        <Tab label="Diretta" active={tab==="direct"} onClick={() => setTab("direct")} />
        <Tab label={"Airbnb\nAll-in"} active={tab==="airbnb_ai"} onClick={() => setTab("airbnb_ai")} />
        <Tab label={"Diretta\nAll-in"} active={tab==="direct_ai"} onClick={() => setTab("direct_ai")} />
      </div>
    </div>
  );
}

/* COMPONENTI */

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
        fontSize: 12,
        whiteSpace: "pre-line",
        lineHeight: 1.1,
        borderBottom: active ? "3px solid white" : "3px solid transparent"
      }}
    >
      {label}
    </button>
  );
}

/* (resto del codice identico: Input, DateInput, Section, styles...) */
