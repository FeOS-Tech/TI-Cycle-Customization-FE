// import React, { useEffect, useRef, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import html2canvas from "html2canvas";

// const CUSTOM_API = "http://localhost:5000/api/customizations";

// function FunCustomize() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const previewRef = useRef(null);

//   const initialData = location.state || {};

//   const [loading, setLoading] = useState(!initialData._id);
//   const [custom, setCustom] = useState(initialData);

//   const [name, setName] = useState(initialData.userName || "NAMENAME");
//   const [tagline, setTagline] = useState(initialData.tagline || "TAGLINE HERE");
//   const [themeVariant, setThemeVariant] = useState(
//     initialData.themeVariant || "primary"
//   );

//   // styles same as sporty
//   const pageWrapper = {
//     padding: "24px 32px",
//     color: "#333",
//     background: "#f4f4f4",
//     minHeight: "100vh",
//     display: "flex",
//     gap: "24px",
//     boxSizing: "border-box",
//   };

//   const leftPanel = {
//     flex: 2,
//     position: "relative",
//     background: "#fff",
//     borderRadius: "12px",
//     boxShadow: "0 8px 18px rgba(0, 0, 0, 0.18)",
//     padding: "16px",
//   };

//   const rightPanel = {
//     flex: 1.2,
//     display: "flex",
//   };

//   const rightCard = {
//     flex: 1,
//     background: "#fff",
//     borderRadius: "12px",
//     boxShadow: "0 6px 18px rgba(0, 0, 0, 0.18)",
//     padding: "16px 18px",
//     display: "flex",
//     flexDirection: "column",
//     gap: "12px",
//   };

//   const cycleWrapper = {
//     position: "relative",
//     width: "100%",
//     maxWidth: "1024px",
//     margin: "0 auto",
//   };

//   const baseImg = {
//     width: "100%",
//     display: "block",
//   };

//   const overlayImg = {
//     position: "absolute",
//     inset: 0,
//     width: "100%",
//     height: "100%",
//     objectFit: "contain",
//     pointerEvents: "none",
//   };

//   const baseText = {
//     position: "absolute",
//     color: "#ffffff",
//     fontFamily: "'Tigershark Bold Italic', sans-serif",
//     textTransform: "uppercase",
//     whiteSpace: "nowrap",
//     letterSpacing: "0.08em",
//     textShadow: "0 0 3px rgba(0, 0, 0, 0.9)",
//     pointerEvents: "none",
//   };

//   const nameStyle = {
//     ...baseText,
//     left: "57.4%",
//     top: "42.27%",
//     transform: "translate(-50%, -50%) rotate(-22deg)",
//     fontSize: "1vw",
//   };

//   const taglineStyle = {
//     ...baseText,
//     left: "33.73%",
//     top: "50.26%",
//     transform: "translate(-50%, -50%) rotate(48.8deg)",
//     fontSize: "0.8vw",
//   };

//   const input = {
//     padding: "8px 10px",
//     background: "#fafafa",
//     color: "#333",
//     border: "1px solid #ddd",
//     borderRadius: "6px",
//     width: "100%",
//     boxSizing: "border-box",
//     fontSize: "13px",
//   };

//   const label = {
//     fontSize: "13px",
//     color: "#777",
//     marginBottom: "4px",
//     display: "block",
//   };

//   const pillButton = (active) => ({
//     padding: "6px 14px",
//     borderRadius: "999px",
//     border: active ? "1px solid #4CAF50" : "1px solid #ccc",
//     background: active ? "#8BC34A" : "#ffffff",
//     color: active ? "#fff" : "#333",
//     cursor: "pointer",
//     fontSize: "13px",
//     fontWeight: 500,
//   });

//   const primaryButton = {
//     width: "100%",
//     marginTop: "8px",
//     padding: "12px 14px",
//     borderRadius: "8px",
//     border: "none",
//     background: "#000000",
//     color: "#ffffff",
//     fontWeight: 600,
//     cursor: "pointer",
//     fontSize: "14px",
//     letterSpacing: "0.06em",
//   };

//   const iconBar = {
//     position: "absolute",
//     top: "10px",
//     right: "12px",
//     display: "flex",
//     gap: "8px",
//     zIndex: 20,
//   };

//   const iconButton = {
//     width: "32px",
//     height: "32px",
//     borderRadius: "50%",
//     border: "1px solid rgba(0, 0, 0, 0.2)",
//     background: "rgba(255, 255, 255, 0.9)",
//     color: "#333",
//     fontSize: "16px",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
//   };

//   // load from backend if needed
//   useEffect(() => {
//     const fetchFromBackend = async () => {
//       if (!initialData.customizationId && !initialData._id) return;
//       const id = initialData.customizationId || initialData._id;
//       try {
//         setLoading(true);
//         const res = await fetch(`${CUSTOM_API}/${id}`);
//         if (!res.ok) throw new Error("Failed to fetch customization");
//         const data = await res.json();
//         setCustom(data);
//         setName(data.userName || "NAMENAME");
//         setTagline(data.tagline || "TAGLINE HERE");
//         setThemeVariant(data.themeVariant || "primary");
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (!initialData._id) {
//       fetchFromBackend();
//     }
//   }, [initialData]);

//   if (loading || !custom) {
//     return (
//       <div style={pageWrapper}>
//         <div>Loading...</div>
//       </div>
//     );
//   }

//   const {
//     brand,
//     themeName,
//     cycleName,
//     modelNo,
//     images = {},
//     mode = "fun",
//   } = custom;

//   const {
//     baseBikeImage,
//     carBase,
//     carPaint,
//     carDecal,
//     primaryColour,
//     secondaryColour,
//     logo,
//   } = images;

//   const activeHighlight =
//     themeVariant === "primary"
//       ? primaryColour || secondaryColour
//       : secondaryColour || primaryColour;

//   const captureCanvas = async () => {
//     if (!previewRef.current) return null;
//     const canvas = await html2canvas(previewRef.current, {
//       useCORS: true,
//       backgroundColor: null,
//       scale: 2,
//     });
//     return canvas;
//   };

//   const handleDownload = async () => {
//     try {
//       const canvas = await captureCanvas();
//       if (!canvas) return;
//       const dataUrl = canvas.toDataURL("image/png");
//       const link = document.createElement("a");
//       link.href = dataUrl;
//       link.download = "custom-cycle-fun.png";
//       link.click();
//     } catch (err) {
//       console.error("Download failed", err);
//       alert("Download failed. Please check console / CORS.");
//     }
//   };

//   const handleShare = async () => {
//     try {
//       const canvas = await captureCanvas();
//       if (!canvas) return;
//       const dataUrl = canvas.toDataURL("image/png");
//       const res = await fetch(dataUrl);
//       const blob = await res.blob();
//       const file = new File([blob], "custom-cycle-fun.png", {
//         type: "image/png",
//       });

//       if (navigator.share && navigator.canShare?.({ files: [file] })) {
//         await navigator.share({
//           files: [file],
//           title: "My Fun Custom Cycle",
//           text: "Check out my fun bike!",
//         });
//       } else {
//         alert("Share is not supported on this device. Please use Download.");
//       }
//     } catch (err) {
//       console.error("Share failed", err);
//       alert("Share failed. Please use Download instead.");
//     }
//   };

//   const handleSave = async () => {
//     const id = custom._id || custom.customizationId;
//     if (!id) {
//       alert("Missing customization id");
//       return;
//     }

//     const payload = {
//       userName: name,
//       tagline,
//       themeVariant,
//     };

//     try {
//       const res = await fetch(`${CUSTOM_API}/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         console.error("Update failed", res.status);
//         alert("Failed to update customization");
//         return;
//       }

//       const updated = await res.json();
//       setCustom(updated);
//       alert("Fun customization updated");
//     } catch (err) {
//       console.error("Error updating customization", err);
//       alert("Error updating customization");
//     }
//   };

//   return (
//     <div style={pageWrapper}>
//       <style>
//         {`
//           @font-face {
//             font-family: 'Tigershark Bold Italic';
//             src: url('/fonts/tigersharkboldital.ttf') format('truetype');
//             font-weight: normal;
//             font-style: normal;
//           }
//         `}
//       </style>

//       {/* LEFT: Preview */}
//       <div style={leftPanel}>
//         <div ref={previewRef} style={cycleWrapper}>
//           <div style={iconBar}>
//             <button
//               type="button"
//               style={iconButton}
//               onClick={handleDownload}
//               title="Download"
//             >
//               ⬇
//             </button>
//             <button
//               type="button"
//               style={iconButton}
//               onClick={handleShare}
//               title="Share"
//             >
//               ✉
//             </button>
//           </div>

//           {baseBikeImage && (
//             <img
//               src={baseBikeImage}
//               alt="Fun cycle"
//               style={baseImg}
//               crossOrigin="anonymous"
//             />
//           )}

//           {carBase && (
//             <img
//               src={carBase}
//               alt="Car base"
//               style={overlayImg}
//               crossOrigin="anonymous"
//             />
//           )}
//           {carPaint && (
//             <img
//               src={carPaint}
//               alt="Car paint"
//               style={overlayImg}
//               crossOrigin="anonymous"
//             />
//           )}
//           {carDecal && (
//             <img
//               src={carDecal}
//               alt="Car decal"
//               style={overlayImg}
//               crossOrigin="anonymous"
//             />
//           )}
//           {activeHighlight && (
//             <img
//               src={activeHighlight}
//               alt="Highlight"
//               style={overlayImg}
//               crossOrigin="anonymous"
//             />
//           )}
//           {logo && (
//             <img
//               src={logo}
//               alt="Brand logo"
//               style={overlayImg}
//               crossOrigin="anonymous"
//             />
//           )}

//           <div style={nameStyle}>{name}</div>
//           <div style={taglineStyle}>{tagline}</div>
//         </div>
//       </div>

//       {/* RIGHT: Controls */}
//       <div style={rightPanel}>
//         <div style={rightCard}>
//           <div>
//             <h2 style={{ margin: "0 0 4px", fontSize: "18px", color: "#333" }}>
//               {brand || "BSA"} – Fun
//             </h2>
//             <div style={{ fontSize: "12px", color: "#777" }}>
//               {themeName || "Car Decal"}
//               {cycleName ? ` • ${cycleName}` : ""}
//               {modelNo ? ` • ${modelNo}` : ""}
//             </div>
//           </div>

//           {/* Name + tagline */}
//           <div>
//             <div style={{ display: "flex", gap: "8px" }}>
//               <input
//                 style={input}
//                 type="text"
//                 value={name}
//                 maxLength={15}
//                 onChange={(e) => setName(e.target.value.toUpperCase())}
//                 placeholder="Name (Max 15 Char)"
//               />
//               <input
//                 style={input}
//                 type="text"
//                 value={tagline}
//                 maxLength={15}
//                 onChange={(e) => setTagline(e.target.value.toUpperCase())}
//                 placeholder="Tag line"
//               />
//             </div>
//           </div>

//           {/* Sticker theme */}
//           <div>
//             <span style={label}>Sticker theme</span>
//             <div style={{ display: "flex", gap: "8px" }}>
//               <button
//                 type="button"
//                 style={pillButton(themeVariant === "primary")}
//                 onClick={() => setThemeVariant("primary")}
//               >
//                 Primary
//               </button>
//               <button
//                 type="button"
//                 style={pillButton(themeVariant === "secondary")}
//                 onClick={() => setThemeVariant("secondary")}
//               >
//                 Secondary
//               </button>
//             </div>
//           </div>

//           {/* Save / Back */}
//           <button type="button" style={primaryButton} onClick={handleSave}>
//             SAVE FUN CUSTOMIZATION
//           </button>

//           <button
//             type="button"
//             style={{ ...primaryButton, background: "#444", marginTop: "6px" }}
//             onClick={() => navigate(-1)}
//           >
//             BACK
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default FunCustomize;

import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import html2canvas from "html2canvas";

const THEME_API_BASE = "http://localhost:5000/api/theme-config/slug";
const CUSTOM_API = "http://localhost:5000/api/customizations";

function FunCustomize() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const previewRef = useRef(null);

  // From Customization page
  const fromState = location.state || {};
  const initialCustomization = fromState.customization || null;
  const customizationIdFromState =
    fromState.customizationId || initialCustomization?._id || null;

  const [custom, setCustom] = useState(initialCustomization);
  const [customizationId, setCustomizationId] = useState(
    customizationIdFromState
  );

  const [theme, setTheme] = useState(null);
  const [loading, setLoading] = useState(!initialCustomization);
  const [saving, setSaving] = useState(false);

  // --------- User editable fields ----------
  const [name, setName] = useState(initialCustomization?.userName || "NAMENAME");
  const [tagline, setTagline] = useState(
    initialCustomization?.tagline || "TAGLINE HERE"
  );
  const [themeVariant, setThemeVariant] = useState(
    initialCustomization?.themeVariant || "primary"
  ); // primary / secondary

  // Part selections (indices)
  const [frameIdx, setFrameIdx] = useState(
    initialCustomization?.frameColorIndex || 0
  );
  const [gripIdx, setGripIdx] = useState(0);
  const [mudguardIdx, setMudguardIdx] = useState(0);
  const [brakeIdx, setBrakeIdx] = useState(0);
  const [basketIdx, setBasketIdx] = useState(0);
  const [backrestIdx, setBackrestIdx] = useState(0);

  // Which component panel is open
  const [openPanel, setOpenPanel] = useState("frame");

  // Sticker colour hex values (recolour on top of carPaint / carDecal / highlight)
  const [paintHex, setPaintHex] = useState(
    initialCustomization?.stickerColors?.carPaintHex || "#ffffff"
  );
  const [decalHex, setDecalHex] = useState(
    initialCustomization?.stickerColors?.carDecalHex || "#ffffff"
  );
  const [highlightHex, setHighlightHex] = useState(
    initialCustomization?.stickerColors?.highlightHex || "#ffffff"
  );

  // ---------------- Helper: get part by code ----------------
  const getPartByCode = (code) => {
    return theme?.assets?.parts?.find((p) => p.partCode === code) || {
      colors: [],
    };
  };

  // ---------------- Fetch customization from backend if needed -------------
  useEffect(() => {
    const fetchCustomization = async () => {
      if (!customizationId || initialCustomization) return;

      try {
        setLoading(true);
        const res = await fetch(`${CUSTOM_API}/${customizationId}`);
        if (!res.ok) throw new Error("Failed to fetch customization");
        const data = await res.json();
        setCustom(data);

        setName(data.userName || "NAMENAME");
        setTagline(data.tagline || "TAGLINE HERE");
        setThemeVariant(data.themeVariant || "primary");
        setFrameIdx(data.frameColorIndex || 0);

        setPaintHex(data.stickerColors?.carPaintHex || "#ffffff");
        setDecalHex(data.stickerColors?.carDecalHex || "#ffffff");
        setHighlightHex(data.stickerColors?.highlightHex || "#ffffff");
      } catch (err) {
        console.error("Customization load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomization();
  }, [customizationId, initialCustomization]);

  // ---------------- Fetch theme-config to get all parts ----------------
  useEffect(() => {
    const fetchTheme = async () => {
      if (!slug) return;
      try {
        const res = await fetch(`${THEME_API_BASE}/${slug}`);
        if (!res.ok) throw new Error("Theme not found");
        const data = await res.json();
        setTheme(data);
      } catch (err) {
        console.error("Theme load error:", err);
      }
    };

    fetchTheme();
  }, [slug]);

  // ---------------- Early guards ----------------
  if (!custom && loading) {
    return <div style={pageWrapper}>Loading...</div>;
  }

  if (!custom) {
    return (
      <div style={pageWrapper}>
        <div>
          Missing customization details. Please go back to previous page and
          click <b>CUSTOMIZE</b> again.
        </div>
      </div>
    );
  }

  // ---------------- Extract base data from customization ----------------
  const {
    brand,
    themeName,
    cycleName,
    modelNo,
    images = {},
    mode = "fun",
  } = custom;

  const baseBikeImage = images.baseBikeImage;
  const carBase = images.carBase;
  const carPaint = images.carPaint;
  const carDecal = images.carDecal;
  const primarySticker = images.primaryColour;
  const secondarySticker = images.secondaryColour;
  const logo = images.logo;

  const activeHighlightImage =
    themeVariant === "primary"
      ? primarySticker || secondarySticker
      : secondarySticker || primarySticker;

  // ---------------- Parts from theme-config ----------------
  // from your JSON:
  // C02 = Mudguard, C03 = Backrest, C04 = Basket, C05 = Grip, C06 = Brake lever, F01 = Frame
  const framePart = getPartByCode("F01");
  const gripPart = getPartByCode("C05");
  const mudguardPart = getPartByCode("C02");
  const brakePart = getPartByCode("C06");
  const backrestPart = getPartByCode("C03");
  const basketPart = getPartByCode("C04");

  const frameColor =
    framePart.colors?.[frameIdx] || framePart.colors?.[0] || null;
  const gripColor =
    gripPart.colors?.[gripIdx] || gripPart.colors?.[0] || null;
  const mudguardColor =
    mudguardPart.colors?.[mudguardIdx] || mudguardPart.colors?.[0] || null;
  const brakeColor =
    brakePart.colors?.[brakeIdx] || brakePart.colors?.[0] || null;
  const backrestColor =
    backrestPart.colors?.[backrestIdx] || backrestPart.colors?.[0] || null;
  const basketColor =
    basketPart.colors?.[basketIdx] || basketPart.colors?.[0] || null;

  const frameOverlay = frameColor?.imageUrl || null;
  const gripOverlay = gripColor?.imageUrl || null;
  const mudguardOverlay = mudguardColor?.imageUrl || null;
  const brakeOverlay = brakeColor?.imageUrl || null;
  const backrestOverlay = backrestColor?.imageUrl || null;
  const basketOverlay = basketColor?.imageUrl || null;

  // ---------------- Filters from hex (for live recolour) ----------------
  const paintFilter = hexToCssFilter(paintHex);
  const decalFilter = hexToCssFilter(decalHex);
  const highlightFilter = hexToCssFilter(highlightHex);

  const paintCmyk = hexToCmyk(paintHex);
  const decalCmyk = hexToCmyk(decalHex);
  const highlightCmyk = hexToCmyk(highlightHex);

  // ---------------- Download / Share ----------------
  const captureCanvas = async () => {
    if (!previewRef.current) return null;
    const canvas = await html2canvas(previewRef.current, {
      useCORS: true,
      backgroundColor: null,
      scale: 2,
    });
    return canvas;
  };

  const handleDownload = async () => {
    try {
      const canvas = await captureCanvas();
      if (!canvas) return;
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = "custom-cycle-fun.png";
      a.click();
    } catch (err) {
      console.error(err);
      alert("Download failed");
    }
  };

  const handleShare = async () => {
    try {
      const canvas = await captureCanvas();
      if (!canvas) return;
      const url = canvas.toDataURL("image/png");
      const blob = await (await fetch(url)).blob();
      const file = new File([blob], "custom-cycle-fun.png", {
        type: "image/png",
      });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "My Fun Custom Cycle",
          text: "Check out my fun bike!",
        });
      } else {
        alert("Share not supported on this device");
      }
    } catch (err) {
      console.error(err);
      alert("Share failed");
    }
  };

  // ---------------- Save back to backend ----------------
  const handleSave = async () => {
    if (!customizationId && !custom._id) {
      alert("Missing customization id");
      return;
    }
    const id = customizationId || custom._id;

    const payload = {
      userName: name,
      tagline,
      themeVariant,
      frameColorIndex: frameIdx,
      frameColor: frameColor
        ? {
            colorName: frameColor.colorName,
            colorCode: frameColor.colorCode,
            imageUrl: frameColor.imageUrl,
            fileName: frameColor.fileName,
          }
        : undefined,
      componentColors: {
        frame: frameColor,
        grip: gripColor,
        mudguard: mudguardColor,
        brakeLever: brakeColor,
        backrest: backrestColor,
        basket: basketColor,
      },
      stickerColors: {
        carPaintHex: paintHex,
        carDecalHex: decalHex,
        highlightHex: highlightHex,
      },
    };

    try {
      setSaving(true);
      const res = await fetch(`${CUSTOM_API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update");

      const updated = await res.json();
      setCustom(updated);
      alert("Fun customization saved");
    } catch (err) {
      console.error(err);
      alert("Error saving fun customization");
    } finally {
      setSaving(false);
    }
  };

  // ---------------- UI ----------------
  return (
    <div style={pageWrapper}>
      <style>
        {`
          @font-face {
            font-family: 'Tigershark Bold Italic';
            src: url('/fonts/tigersharkboldital.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
          }
        `}
      </style>

      {/* LEFT: Preview */}
      <div style={leftPanel}>
        <div style={iconBar}>
          <button style={iconButton} onClick={handleDownload} title="Download">
            ⬇
          </button>
          <button style={iconButton} onClick={handleShare} title="Share">
            ✉
          </button>
        </div>

        <div ref={previewRef} style={cycleWrapper}>
          {/* Base frame image from Customization (fun mode) */}
          {baseBikeImage && (
            <img
              src={baseBikeImage}
              alt="Fun base"
              style={baseImg}
              crossOrigin="anonymous"
            />
          )}

          {/* Components in order */}
          {mudguardOverlay && (
            <img
              src={mudguardOverlay}
              alt="Mudguard"
              style={overlayImg}
              crossOrigin="anonymous"
            />
          )}
          {frameOverlay && (
            <img
              src={frameOverlay}
              alt="Frame"
              style={overlayImg}
              crossOrigin="anonymous"
            />
          )}
          {backrestOverlay && (
            <img
              src={backrestOverlay}
              alt="Backrest"
              style={overlayImg}
              crossOrigin="anonymous"
            />
          )}
          {basketOverlay && (
            <img
              src={basketOverlay}
              alt="Basket"
              style={overlayImg}
              crossOrigin="anonymous"
            />
          )}
          {gripOverlay && (
            <img
              src={gripOverlay}
              alt="Grip"
              style={overlayImg}
              crossOrigin="anonymous"
            />
          )}
          {brakeOverlay && (
            <img
              src={brakeOverlay}
              alt="Brake lever"
              style={overlayImg}
              crossOrigin="anonymous"
            />
          )}

          {/* Stickers in correct stack order */}
          {carBase && (
            <img
              src={carBase}
              alt="Car base"
              style={overlayImg}
              crossOrigin="anonymous"
            />
          )}
          {carPaint && (
            <img
              src={carPaint}
              alt="Car paint"
              style={{ ...overlayImg, filter: paintFilter }}
              crossOrigin="anonymous"
            />
          )}
          {carDecal && (
            <img
              src={carDecal}
              alt="Car decal"
              style={{ ...overlayImg, filter: decalFilter }}
              crossOrigin="anonymous"
            />
          )}
          {activeHighlightImage && (
            <img
              src={activeHighlightImage}
              alt="Highlight"
              style={{ ...overlayImg, filter: highlightFilter }}
              crossOrigin="anonymous"
            />
          )}
          {logo && (
            <img
              src={logo}
              alt="Logo"
              style={overlayImg}
              crossOrigin="anonymous"
            />
          )}

          {/* Text overlays */}
          <div style={nameStyle}>{name}</div>
          <div style={taglineStyle}>{tagline}</div>
        </div>
      </div>

      {/* RIGHT: Controls */}
      <div style={rightPanel}>
        <div style={rightCard}>
          {/* Header */}
          <div>
            <h2 style={{ margin: 0, fontSize: 18 }}>{brand || "BSA"} – Fun</h2>
            <div style={{ fontSize: 12, color: "#777" }}>
              {themeName || "Car Decal"}
              {cycleName ? ` • ${cycleName}` : ""}
              {modelNo ? ` • ${modelNo}` : ""}
            </div>
          </div>

          {/* Name & Tagline */}
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#4CAF50",
                marginBottom: 6,
              }}
            >
              Rider name & Tagline (Max 15 Char)
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                style={input}
                value={name}
                maxLength={15}
                onChange={(e) => setName(e.target.value.toUpperCase())}
                placeholder="Name"
              />
              <input
                style={input}
                value={tagline}
                maxLength={15}
                onChange={(e) => setTagline(e.target.value.toUpperCase())}
                placeholder="Tagline"
              />
            </div>
          </div>

          {/* Sticker theme toggle */}
          <div>
            <span style={label}>Sticker theme</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                style={pillButton(themeVariant === "primary")}
                onClick={() => setThemeVariant("primary")}
              >
                Primary
              </button>
              <button
                type="button"
                style={pillButton(themeVariant === "secondary")}
                onClick={() => setThemeVariant("secondary")}
              >
                Secondary
              </button>
            </div>
          </div>

          {/* Component accordions */}
          {renderComponentSection({
            title: "Frame colour",
            isOpen: openPanel === "frame",
            onToggle: () =>
              setOpenPanel(openPanel === "frame" ? null : "frame"),
            colors: framePart.colors || [],
            activeIndex: frameIdx,
            onSelect: setFrameIdx,
          })}

          {renderComponentSection({
            title: "Grip colour",
            isOpen: openPanel === "grip",
            onToggle: () =>
              setOpenPanel(openPanel === "grip" ? null : "grip"),
            colors: gripPart.colors || [],
            activeIndex: gripIdx,
            onSelect: setGripIdx,
          })}

          {renderComponentSection({
            title: "Mudguard colour",
            isOpen: openPanel === "mudguard",
            onToggle: () =>
              setOpenPanel(openPanel === "mudguard" ? null : "mudguard"),
            colors: mudguardPart.colors || [],
            activeIndex: mudguardIdx,
            onSelect: setMudguardIdx,
          })}

          {renderComponentSection({
            title: "Brake lever colour",
            isOpen: openPanel === "brake",
            onToggle: () =>
              setOpenPanel(openPanel === "brake" ? null : "brake"),
            colors: brakePart.colors || [],
            activeIndex: brakeIdx,
            onSelect: setBrakeIdx,
          })}

          {renderComponentSection({
            title: "Backrest colour",
            isOpen: openPanel === "backrest",
            onToggle: () =>
              setOpenPanel(openPanel === "backrest" ? null : "backrest"),
            colors: backrestPart.colors || [],
            activeIndex: backrestIdx,
            onSelect: setBackrestIdx,
          })}

          {renderComponentSection({
            title: "Basket colour",
            isOpen: openPanel === "basket",
            onToggle: () =>
              setOpenPanel(openPanel === "basket" ? null : "basket"),
            colors: basketPart.colors || [],
            activeIndex: basketIdx,
            onSelect: setBasketIdx,
          })}

          {/* Sticker colour pickers */}
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              Sticker colours (live preview)
            </div>

            <StickerColorPicker
              label="Car paint (Sticker 03)"
              hex={paintHex}
              onChange={setPaintHex}
              cmyk={paintCmyk}
            />
            <StickerColorPicker
              label="Car decal (Sticker 04)"
              hex={decalHex}
              onChange={setDecalHex}
              cmyk={decalCmyk}
            />
            <StickerColorPicker
              label="Primary / Secondary highlight"
              hex={highlightHex}
              onChange={setHighlightHex}
              cmyk={highlightCmyk}
            />
          </div>

          {/* Actions */}
          <button
            type="button"
            style={primaryButton}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "SAVING..." : "SAVE FUN CUSTOMIZATION"}
          </button>
          <button
            type="button"
            style={{ ...primaryButton, background: "#555", marginTop: 6 }}
            onClick={() => navigate(-1)}
          >
            BACK
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Small sub-components ---------------- */

function StickerColorPicker({ label, hex, onChange, cmyk }) {
  return (
    <div style={stickerPickerCard}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, fontWeight: 500 }}>{label}</span>
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: 4,
            border: "1px solid #ddd",
            background: hex,
          }}
        />
      </div>
      <div style={{ marginTop: 6, display: "flex", alignItems: "center" }}>
        <input
          type="color"
          value={hex}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: 40,
            height: 32,
            border: "none",
            background: "transparent",
            padding: 0,
            marginRight: 8,
            cursor: "pointer",
          }}
        />
        <div style={{ fontSize: 11, color: "#555" }}>
          <div>HEX: {hex.toUpperCase()}</div>
          <div>
            CMYK: C {cmyk.c}% • M {cmyk.m}% • Y {cmyk.y}% • K {cmyk.k}%
          </div>
        </div>
      </div>
    </div>
  );
}

function renderComponentSection({
  title,
  isOpen,
  onToggle,
  colors,
  activeIndex,
  onSelect,
}) {
  return (
    <div style={accordionCard}>
      <div style={accordionHeader} onClick={onToggle}>
        <span>{title}</span>
        <span>{isOpen ? "−" : "+"}</span>
      </div>
      {isOpen && (
        <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8 }}>
          {colors.map((c, idx) => (
            <div
              key={c.fileName || idx}
              style={colorDotStyle(c.colorCode || "#ffffff", idx === activeIndex)}
              title={c.colorName}
              onClick={() => onSelect(idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Colour helpers ---------------- */

// Simple hex → HSL based filter approximation
function hexToCssFilter(hex) {
  const { h, s, l } = hexToHsl(hex);
  return `saturate(150%) hue-rotate(${h}deg) brightness(${100 + (l - 50) / 2}%)`;
}

function hexToHsl(hex) {
  let r = 0,
    g = 0,
    b = 0;
  const clean = hex.replace("#", "");
  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16);
    g = parseInt(clean[1] + clean[1], 16);
    b = parseInt(clean[2] + clean[2], 16);
  } else if (clean.length === 6) {
    r = parseInt(clean.substring(0, 2), 16);
    g = parseInt(clean.substring(2, 4), 16);
    b = parseInt(clean.substring(4, 6), 16);
  }

  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        break;
    }
    h *= 60;
  }

  return { h: Math.round(h), s: s * 100, l: l * 100 };
}

// Hex → CMYK (0–100)
function hexToCmyk(hex) {
  let r = 0,
    g = 0,
    b = 0;
  const clean = hex.replace("#", "");
  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16);
    g = parseInt(clean[1] + clean[1], 16);
    b = parseInt(clean[2] + clean[2], 16);
  } else if (clean.length === 6) {
    r = parseInt(clean.substring(0, 2), 16);
    g = parseInt(clean.substring(2, 4), 16);
    b = parseInt(clean.substring(4, 6), 16);
  }

  const rP = r / 255;
  const gP = g / 255;
  const bP = b / 255;

  const k = 1 - Math.max(rP, gP, bP);
  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }
  const c = (1 - rP - k) / (1 - k);
  const m = (1 - gP - k) / (1 - k);
  const y = (1 - bP - k) / (1 - k);

  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  };
}

/* ---------------- Styles (same as Sporty) ---------------- */

const pageWrapper = {
  padding: "24px 32px",
  color: "#333",
  background: "#f4f4f4",
  minHeight: "100vh",
  display: "flex",
  gap: "24px",
  boxSizing: "border-box",
};

const leftPanel = {
  flex: 2,
  position: "relative",
  background: "#fff",
  borderRadius: "12px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
  padding: "16px",
};

const rightPanel = {
  flex: 1.2,
  display: "flex",
};

const rightCard = {
  flex: 1,
  background: "#fff",
  borderRadius: "12px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
  padding: "16px 18px",
  display: "flex",
  flexDirection: "column",
  gap: "14px",
};

const cycleWrapper = {
  position: "relative",
  width: "100%",
  maxWidth: "1024px",
  margin: "0 auto",
};

const baseImg = { width: "100%", display: "block" };

const overlayImg = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "contain",
  pointerEvents: "none",
  transition: "filter 0.2s ease",
};

const baseText = {
  position: "absolute",
  color: "#ffffff",
  fontFamily: "'Tigershark Bold Italic', sans-serif",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
  letterSpacing: "0.08em",
  textShadow: "0 0 3px rgba(0,0,0,0.9)",
  pointerEvents: "none",
};

const nameStyle = {
  ...baseText,
  left: "57.4%",
  top: "42.27%",
  transform: "translate(-50%, -50%) rotate(-22deg)",
  fontSize: "1vw",
};

const taglineStyle = {
  ...baseText,
  left: "33.73%",
  top: "50.26%",
  transform: "translate(-50%, -50%) rotate(48.8deg)",
  fontSize: "0.8vw",
};

const input = {
  padding: "8px 10px",
  background: "#fafafa",
  color: "#333",
  border: "1px solid #ddd",
  borderRadius: "6px",
  width: "100%",
  boxSizing: "border-box",
  fontSize: "13px",
};

const label = {
  fontSize: "13px",
  color: "#777",
  marginBottom: "4px",
};

const pillButton = (active) => ({
  padding: "6px 14px",
  borderRadius: "999px",
  border: active ? "1px solid #4CAF50" : "1px solid #ccc",
  background: active ? "#8BC34A" : "#ffffff",
  color: active ? "#fff" : "#333",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: 500,
});

const primaryButton = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  background: "#000",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
  fontSize: "14px",
  letterSpacing: "0.05em",
};

const iconBar = {
  position: "absolute",
  top: "10px",
  right: "12px",
  display: "flex",
  gap: "8px",
  zIndex: 20,
};

const iconButton = {
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  border: "1px solid rgba(0,0,0,0.2)",
  background: "rgba(255,255,255,0.9)",
  color: "#333",
  fontSize: "16px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
};

const accordionCard = {
  borderRadius: "8px",
  border: "1px solid #eee",
  padding: "8px 10px",
  background: "#fafafa",
};

const accordionHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: "13px",
  fontWeight: 500,
  cursor: "pointer",
};

const colorDotStyle = (hex, selected) => ({
  width: 22,
  height: 22,
  borderRadius: "50%",
  background: hex || "#ffffff",
  border: selected ? "2px solid #000" : "1px solid #bbb",
  cursor: "pointer",
  boxShadow: selected ? "0 0 4px rgba(0,0,0,0.8)" : "none",
});

const stickerPickerCard = {
  borderRadius: "8px",
  border: "1px solid #eee",
  padding: "8px 10px",
  background: "#fafafa",
  marginBottom: 8,
};

export default FunCustomize;
