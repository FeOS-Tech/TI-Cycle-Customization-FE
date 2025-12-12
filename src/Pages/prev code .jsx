// import React, { useEffect, useRef, useState } from "react";
// import html2canvas from "html2canvas";

// const API_BASE = "http://localhost:5000/api/theme-config/slug"; // your backend path

// function CarDecalStep1() {
//   const [theme, setTheme] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Name & Tagline
//   const [name, setName] = useState("NAMENAME");
//   const [tagline, setTagline] = useState("TAGLINE HERE");

//   // Sporty / Fun
//   const [mode, setMode] = useState("sporty"); // 'sporty' | 'fun'

//   // Selected frame colour index
//   const [frameColorIndex, setFrameColorIndex] = useState(0);

//   // Primary / Secondary sticker
//   const [stickerType, setStickerType] = useState("primary"); // 'primary' | 'secondary'

//   // For download / share capture
//   const previewRef = useRef(null);

//   // ---------- STYLES ----------
//   const pageWrapper = {
//     padding: "20px",
//     color: "#fff",
//     background: "#111",
//     minHeight: "100vh",
//     display: "flex",
//     gap: "24px",
//     boxSizing: "border-box",
//   };

//   const leftPanel = {
//     flex: 2,
//     position: "relative",
//   };

//   const rightPanel = {
//     flex: 1,
//     display: "flex",
//     flexDirection: "column",
//     gap: "16px",
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
//     textShadow: "0 0 3px rgba(0,0,0,0.9)",
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

//   const card = {
//     border: "1px solid #333",
//     borderRadius: "8px",
//     padding: "12px",
//     background: "#181818",
//   };

//   const label = {
//     marginBottom: "5px",
//     display: "block",
//     fontSize: "14px",
//   };

//   const input = {
//     padding: "8px 10px",
//     background: "#000",
//     color: "#fff",
//     border: "1px solid #444",
//     borderRadius: "4px",
//     marginBottom: "10px",
//     width: "100%",
//     boxSizing: "border-box",
//   };

//   const pillButton = (active) => ({
//     padding: "6px 12px",
//     borderRadius: "999px",
//     border: active ? "1px solid #fff" : "1px solid #555",
//     background: active ? "#fff" : "transparent",
//     color: active ? "#000" : "#fff",
//     cursor: "pointer",
//     fontSize: "13px",
//   });

//   const colorDot = (hex, selected) => ({
//     width: "22px",
//     height: "22px",
//     borderRadius: "50%",
//     background: hex || "#ffffff",
//     border: selected ? "2px solid #fff" : "1px solid #444",
//     cursor: "pointer",
//     boxShadow: selected ? "0 0 4px rgba(255,255,255,0.8)" : "none",
//   });

//   const iconBar = {
//     position: "absolute",
//     top: "10px",
//     right: "10px",
//     display: "flex",
//     gap: "8px",
//     zIndex: 20,
//   };

//   const iconButton = {
//     width: "32px",
//     height: "32px",
//     borderRadius: "50%",
//     border: "1px solid #fff",
//     background: "rgba(0,0,0,0.6)",
//     color: "#fff",
//     fontSize: "16px",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   };

//   // ---------- FETCH THEME ----------
//   useEffect(() => {
//     const fetchTheme = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`${API_BASE}/car-decal`);
//         if (!res.ok) throw new Error("Failed to load theme");
//         const data = await res.json();
//         setTheme(data);

//         // Default frame colour -> Black if present
//         const framePart = (data.assets?.parts || []).find(
//           (p) => p.partCode === "F01"
//         );
//         if (framePart?.colors?.length) {
//           const blackIdx = framePart.colors.findIndex(
//             (c) => c.colorName?.toLowerCase() === "black"
//           );
//           setFrameColorIndex(blackIdx >= 0 ? blackIdx : 0);
//         }
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTheme();
//   }, []);

//   if (loading) {
//     return (
//       <div style={pageWrapper}>
//         <div>Loading...</div>
//       </div>
//     );
//   }

//   if (!theme) {
//     return (
//       <div style={pageWrapper}>
//         <div>Theme not found</div>
//       </div>
//     );
//   }

//   const brandName = theme.brand || "BSA";

//   const parts = theme.assets?.parts || [];
//   const framePart = parts.find((p) => p.partCode === "F01");
//   const frameColors = framePart?.colors || [];
//   const activeFrameColor = frameColors[frameColorIndex] || frameColors[0] || {};

//   const stickers = activeFrameColor.stickers || {};

//   // ---------- FULL FRAME IMAGE (SPORTY / FUN) ----------
//   let baseBikeImage = "";

//   if (mode === "sporty") {
//     baseBikeImage =
//       stickers.sportyFrameComponent ||
//       stickers.sportyImage ||
//       activeFrameColor.imageUrl;
//   } else {
//     baseBikeImage =
//       stickers.funFrameComponent ||
//       stickers.funImage ||
//       activeFrameColor.imageUrl;
//   }

//   // ---------- THEME STICKER LAYERS ----------
//   // Order: base -> car colour -> car decal -> primary/secondary -> brand logo
//   const carBaseUrl = stickers.carBase || null;
//   const carColourUrl = stickers.carPaint || null; // "car color" in data is stored as carPaint
//   const carDecalUrl = stickers.carDecal || null;
//   const primaryUrl = stickers.primaryColour || null;
//   const secondaryUrl = stickers.secondaryColour || null;
//   const logoUrl = stickers.logo || null;

//   const activeHighlightUrl =
//     stickerType === "primary" ? primaryUrl || secondaryUrl : secondaryUrl || primaryUrl;

//   // ---------- DOWNLOAD / SHARE ----------
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
//       link.download = "custom-cycle.png";
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
//       const file = new File([blob], "custom-cycle.png", {
//         type: "image/png",
//       });

//       if (navigator.share && navigator.canShare?.({ files: [file] })) {
//         await navigator.share({
//           files: [file],
//           title: "My Custom Cycle",
//           text: "Check out my customized bike!",
//         });
//       } else {
//         alert("Share is not supported on this device. Please use Download.");
//       }
//     } catch (err) {
//       console.error("Share failed", err);
//       alert("Share failed. Please use Download instead.");
//     }
//   };

//   return (
//     <div style={pageWrapper}>
//       {/* Font face for Tigershark */}
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

//       {/* LEFT: Cycle Preview + buttons */}
//       <div style={leftPanel}>
//         <div style={iconBar}>
//           <button
//             type="button"
//             style={iconButton}
//             onClick={handleDownload}
//             title="Download"
//           >
//             ⬇
//           </button>
//           <button
//             type="button"
//             style={iconButton}
//             onClick={handleShare}
//             title="Share"
//           >
//             ✉
//           </button>
//         </div>

//         <div ref={previewRef} style={cycleWrapper}>
//           {/* Full sporty/fun frame image */}
//           {baseBikeImage && (
//             <img
//               src={baseBikeImage}
//               alt={mode === "sporty" ? "Sporty cycle" : "Fun cycle"}
//               style={baseImg}
//               crossOrigin="anonymous"
//             />
//           )}

//           {/* Sticker layering:
//               1. Base
//               2. Car colour
//               3. Car decal
//               4. Primary / Secondary
//               5. Brand logo
//           */}
//           {carBaseUrl && (
//             <img
//               src={carBaseUrl}
//               alt="Car base"
//               style={overlayImg}
//               crossOrigin="anonymous"
//             />
//           )}

//           {carColourUrl && (
//             <img
//               src={carColourUrl}
//               alt="Car colour"
//               style={overlayImg}
//               crossOrigin="anonymous"
//             />
//           )}

//           {carDecalUrl && (
//             <img
//               src={carDecalUrl}
//               alt="Car decal"
//               style={overlayImg}
//               crossOrigin="anonymous"
//             />
//           )}

//           {activeHighlightUrl && (
//             <img
//               src={activeHighlightUrl}
//               alt={
//                 stickerType === "primary"
//                   ? "Primary sticker"
//                   : "Secondary sticker"
//               }
//               style={overlayImg}
//               crossOrigin="anonymous"
//             />
//           )}

//           {logoUrl && (
//             <img
//               src={logoUrl}
//               alt="Brand logo"
//               style={overlayImg}
//               crossOrigin="anonymous"
//             />
//           )}

//           {/* Name + Tagline text on top */}
//           <div style={nameStyle}>{name}</div>
//           <div style={taglineStyle}>{tagline}</div>
//         </div>
//       </div>

//       {/* RIGHT: Controls */}
//       <div style={rightPanel}>
//         {/* Brand + Bike Preference */}
//         <div style={card}>
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               marginBottom: "8px",
//             }}
//           >
//             <h2 style={{ margin: 0, fontSize: "18px" }}>{brandName}</h2>
//           </div>

//           <div style={{ fontSize: "13px", marginBottom: "4px" }}>
//             Bike preference
//           </div>
//           <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
//             <button
//               type="button"
//               style={pillButton(mode === "sporty")}
//               onClick={() => setMode("sporty")}
//             >
//               Sporty
//             </button>
//             <button
//               type="button"
//               style={pillButton(mode === "fun")}
//               onClick={() => setMode("fun")}
//             >
//               Fun
//             </button>
//           </div>

//           {/* Primary / Secondary sticker toggle */}
//           <div style={{ fontSize: "13px", marginBottom: "4px" }}>
//             Sticker type
//           </div>
//           <div style={{ display: "flex", gap: "8px" }}>
//             <button
//               type="button"
//               style={pillButton(stickerType === "primary")}
//               onClick={() => setStickerType("primary")}
//             >
//               Primary
//             </button>
//             <button
//               type="button"
//               style={pillButton(stickerType === "secondary")}
//               onClick={() => setStickerType("secondary")}
//             >
//               Secondary
//             </button>
//           </div>
//         </div>

//         {/* Name & Tagline */}
//         <div style={card}>
//           <label style={label}>Name</label>
//           <input
//             style={input}
//             type="text"
//             value={name}
//             maxLength={15}
//             onChange={(e) => setName(e.target.value.toUpperCase())}
//             placeholder="Enter name"
//           />

//           <label style={label}>Tagline</label>
//           <input
//             style={input}
//             type="text"
//             value={tagline}
//             maxLength={25}
//             onChange={(e) => setTagline(e.target.value.toUpperCase())}
//             placeholder="Enter tagline"
//           />
//         </div>

//         {/* Frame colour palette (from F01.colors[].colorCode) */}
//         <div style={card}>
//           <div style={{ fontSize: "14px", marginBottom: "6px" }}>
//             Frame colour
//           </div>
//           <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
//             {frameColors.map((c, idx) => (
//               <div
//                 key={c.fileName || idx}
//                 style={colorDot(c.colorCode || "#ffffff", idx === frameColorIndex)}
//                 title={c.colorName}
//                 onClick={() => setFrameColorIndex(idx)}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CarDecalStep1;

// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import html2canvas from "html2canvas";

// const THEME_API = "http://localhost:5000/api/theme-config/slug";
// const SAVE_CUSTOM_API = "http://localhost:5000/api/customizations";

// function CarDecalStep1() {
//   const [theme, setTheme] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Name & Tagline
//   const [name, setName] = useState("NAMENAME");
//   const [tagline, setTagline] = useState("TAGLINE HERE");

//   // Sporty / Fun
//   const [mode, setMode] = useState("sporty");

//   // Sticker theme: primary / secondary
//   const [themeVariant, setThemeVariant] = useState("primary");

//   // Selected frame colour index
//   const [frameColorIndex, setFrameColorIndex] = useState(0);

//   // Bike size
//   const [bikeSize, setBikeSize] = useState("20T");

//   const previewRef = useRef(null);
//   const navigate = useNavigate();

//   // ---------- STYLES (same as previous version, shortened a bit) ----------
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

//   const label = {
//     fontSize: "13px",
//     color: "#777",
//     marginBottom: "4px",
//     display: "block",
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

//   const colorDot = (hex, selected) => ({
//     width: "22px",
//     height: "22px",
//     borderRadius: "50%",
//     background: hex || "#ffffff",
//     border: selected ? "3px solid #000" : "1px solid #ccc",
//     cursor: "pointer",
//     boxShadow: selected ? "0 0 4px rgba(0, 0, 0, 0.7)" : "none",
//   });

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

//   const selectStyle = {
//     padding: "6px 8px",
//     borderRadius: "6px",
//     border: "1px solid #ddd",
//     fontSize: "13px",
//     background: "#fafafa",
//   };

//   const findSizeLink = {
//     fontSize: "12px",
//     color: "#2196F3",
//     cursor: "pointer",
//     textDecoration: "underline",
//     marginLeft: "8px",
//   };

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

//   const checkboxLabel = {
//     display: "flex",
//     alignItems: "center",
//     gap: "6px",
//     fontSize: "13px",
//     color: "#555",
//   };

//   // ---------- FETCH THEME ----------
//   useEffect(() => {
//     const fetchTheme = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`${THEME_API}/car-decal`);
//         if (!res.ok) throw new Error("Failed to load theme");
//         const data = await res.json();
//         setTheme(data);

//         const framePart = (data.assets?.parts || []).find(
//           (p) => p.partCode === "F01"
//         );
//         if (framePart?.colors?.length) {
//           const blackIdx = framePart.colors.findIndex(
//             (c) => c.colorName?.toLowerCase() === "black"
//           );
//           setFrameColorIndex(blackIdx >= 0 ? blackIdx : 0);
//         }
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTheme();
//   }, []);

//   if (loading) {
//     return (
//       <div style={pageWrapper}>
//         <div>Loading...</div>
//       </div>
//     );
//   }

//   if (!theme) {
//     return (
//       <div style={pageWrapper}>
//         <div>Theme not found</div>
//       </div>
//     );
//   }

//   // ---------- THEME / CYCLE INFO FROM BACKEND ----------
//   const brandName = theme.brand || "BSA";
//   const themeName = theme.themeName || "CAR DECAL";
//   const cycleId = theme.cycleId || "";
//   const modelId = theme.modelId || "";
//   const cycleName = theme.cycleName || ""; // make sure backend sends this
//   const modelNo = theme.modelNo || "";     // make sure backend sends this

//   const parts = theme.assets?.parts || [];
//   const framePart = parts.find((p) => p.partCode === "F01");
//   const frameColors = framePart?.colors || [];
//   const activeFrameColor = frameColors[frameColorIndex] || frameColors[0] || {};
//   const stickers = activeFrameColor.stickers || {};

//   // ---------- BASE FRAME IMAGE (SPORTY / FUN) ----------
//   let baseBikeImage = "";
//   if (mode === "sporty") {
//     baseBikeImage =
//       stickers.sportyFrameComponent ||
//       stickers.sportyImage ||
//       activeFrameColor.imageUrl;
//   } else {
//     baseBikeImage =
//       stickers.funFrameComponent ||
//       stickers.funImage ||
//       activeFrameColor.imageUrl;
//   }

//   // ---------- STICKER LAYERS ----------
//   const carBaseUrl = stickers.carBase || null;
//   const carColourUrl = stickers.carPaint || null;
//   const carDecalUrl = stickers.carDecal || null;
//   const primaryUrl = stickers.primaryColour || null;
//   const secondaryUrl = stickers.secondaryColour || null;
//   const logoUrl = stickers.logo || null;

//   let activeHighlightUrl = null;
//   if (themeVariant === "primary") {
//     activeHighlightUrl = primaryUrl || secondaryUrl;
//   } else {
//     activeHighlightUrl = secondaryUrl || primaryUrl;
//   }

//   // ---------- DOWNLOAD / SHARE ----------
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
//       link.download = "custom-cycle.png";
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
//       const file = new File([blob], "custom-cycle.png", {
//         type: "image/png",
//       });

//       if (navigator.share && navigator.canShare?.({ files: [file] })) {
//         await navigator.share({
//           files: [file],
//           title: "My Custom Cycle",
//           text: "Check out my customized bike!",
//         });
//       } else {
//         alert("Share is not supported on this device. Please use Download.");
//       }
//     } catch (err) {
//       console.error("Share failed", err);
//       alert("Share failed. Please use Download instead.");
//     }
//   };

//   // ---------- SAVE TO BACKEND + NAVIGATE ----------
//   const handleCustomize = async () => {
//     const payload = {
//       // high level ids
//       brand: brandName,
//       themeId: theme.themeId,
//       themeSlug: theme.themeSlug,
//       themeName,  // 👈 NEW
//       cycleId,
//       modelId,
//       cycleName,  // 👈 NEW
//       modelNo,    // 👈 NEW

//       // user choices
//       userName: name,
//       tagline,
//       bikeSize,
//       mode,
//       themeVariant,
//       frameColorIndex,

//       frameColor: {
//         colorName: activeFrameColor.colorName,
//         colorCode: activeFrameColor.colorCode,
//         imageUrl: activeFrameColor.imageUrl,
//         fileName: activeFrameColor.fileName,
//       },

//       images: {
//         baseBikeImage,
//         carBase: carBaseUrl,
//         carPaint: carColourUrl,
//         carDecal: carDecalUrl,
//         primaryColour: primaryUrl,
//         secondaryColour: secondaryUrl,
//         logo: logoUrl,
//       },

//       stickersRaw: stickers,
//     };

//     try {
//       const res = await fetch(SAVE_CUSTOM_API, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         console.error("Save failed", res.status);
//         alert("Failed to save configuration");
//         return;
//       }

//       const saved = await res.json();
//       const navState = {
//         customizationId: saved._id,
//         ...saved,
//       };

//       if (mode === "sporty") {
//         navigate("/car-decal/customize/sporty", { state: navState });
//       } else {
//         navigate("/car-decal/customize/fun", { state: navState });
//       }
//     } catch (err) {
//       console.error("Error saving customization", err);
//       alert("Error saving customization");
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
//               alt={mode === "sporty" ? "Sporty cycle" : "Fun cycle"}
//               style={baseImg}
//               crossOrigin="anonymous"
//             />
//           )}

//           {carBaseUrl && (
//             <img
//               src={carBaseUrl}
//               alt="Car base"
//               style={overlayImg}
//               crossOrigin="anonymous"
//             />
//           )}
//           {carColourUrl && (
//             <img
//               src={carColourUrl}
//               alt="Car colour"
//               style={overlayImg}
//               crossOrigin="anonymous"
//             />
//           )}
//           {carDecalUrl && (
//             <img
//               src={carDecalUrl}
//               alt="Car decal"
//               style={overlayImg}
//               crossOrigin="anonymous"
//             />
//           )}
//           {activeHighlightUrl && (
//             <img
//               src={activeHighlightUrl}
//               alt="Sticker theme"
//               style={overlayImg}
//               crossOrigin="anonymous"
//             />
//           )}
//           {logoUrl && (
//             <img
//               src={logoUrl}
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
//           {/* Brand + theme / model info */}
//           <div>
//             <h2 style={{ margin: "0 0 4px", fontSize: "18px", color: "#333" }}>
//               {brandName}
//             </h2>
//             <div style={{ fontSize: "12px", color: "#777" }}>
//               {themeName}
//               {cycleName ? ` • ${cycleName}` : ""}
//               {modelNo ? ` • ${modelNo}` : ""}
//             </div>
//           </div>

//           {/* Name + Tagline */}
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

//           {/* Bike Size */}
//           <div>
//             <span style={label}>Bike size</span>
//             <div style={{ display: "flex", alignItems: "center" }}>
//               <select
//                 value={bikeSize}
//                 onChange={(e) => setBikeSize(e.target.value)}
//                 style={selectStyle}
//               >
//                 <option value="16T">16T</option>
//                 <option value="18T">18T</option>
//                 <option value="20T">20T</option>
//                 <option value="24T">24T</option>
//               </select>
//               <span
//                 style={findSizeLink}
//                 onClick={() => alert("Size guide popup coming soon")}
//               >
//                 Find your size
//               </span>
//             </div>
//           </div>

//           {/* Bike preference */}
//           <div>
//             <span style={label}>Bike preference</span>
//             <div style={{ display: "flex", gap: "16px" }}>
//               <label style={checkboxLabel}>
//                 <input
//                   type="checkbox"
//                   checked={mode === "sporty"}
//                   onChange={() => setMode("sporty")}
//                 />
//                 Sporty
//               </label>
//               <label style={checkboxLabel}>
//                 <input
//                   type="checkbox"
//                   checked={mode === "fun"}
//                   onChange={() => setMode("fun")}
//                 />
//                 Fun
//               </label>
//             </div>
//           </div>

//           {/* Frame colour */}
//           <div>
//             <span style={label}>Frame colour</span>
//             <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
//               {frameColors.map((c, idx) => (
//                 <div
//                   key={c.fileName || idx}
//                   style={colorDot(
//                     c.colorCode || "#ffffff",
//                     idx === frameColorIndex
//                   )}
//                   title={c.colorName}
//                   onClick={() => setFrameColorIndex(idx)}
//                 />
//               ))}
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

//           {/* Customize */}
//           <button type="button" style={primaryButton} onClick={handleCustomize}>
//             CUSTOMIZE
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CarDecalStep1;

// // src/Pages/SportyCustomize.jsx
// import React, { useEffect, useRef, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import html2canvas from "html2canvas";

// const CUSTOM_API = "http://localhost:5000/api/customizations";
// const THEME_API_BASE = "http://localhost:5000/api/theme-config/slug";

// /* ---------- Reusable collapsible colour section ---------- */
// function ColourSection({
//   title,
//   colors = [],
//   selectedIndex,
//   onSelect,
//   isOpen,
//   onToggle,
// }) {
//   const sectionCard = {
//     border: "1px solid #e0e0e0",
//     borderRadius: "10px",
//     padding: "10px 12px",
//     background: "#ffffff",
//     boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08)",
//   };

//   const sectionHeader = {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     cursor: "pointer",
//     fontSize: "14px",
//     fontWeight: 600,
//     color: "#444",
//   };

//   const plusIcon = {
//     fontSize: "18px",
//     fontWeight: 600,
//     color: "#888",
//     marginLeft: "8px",
//   };

//   const paletteRow = {
//     marginTop: "10px",
//     display: "flex",
//     gap: "8px",
//     flexWrap: "wrap",
//   };

//   const colorDot = (hex, selected) => ({
//     width: "22px",
//     height: "22px",
//     borderRadius: "50%",
//     background: hex || "#ffffff",
//     border: selected ? "2px solid #000" : "1px solid #ccc",
//     cursor: "pointer",
//     boxShadow: selected ? "0 0 4px rgba(0, 0, 0, 0.5)" : "none",
//   });

//   return (
//     <div style={sectionCard}>
//       <div style={sectionHeader} onClick={onToggle}>
//         <span>{title}</span>
//         <span style={plusIcon}>{isOpen ? "−" : "+"}</span>
//       </div>

//       {isOpen && (
//         <div style={paletteRow}>
//           {colors.map((c, idx) => (
//             <div
//               key={c.fileName || c.colorName || idx}
//               style={colorDot(c.colorCode || "#ffffff", idx === selectedIndex)}
//               title={c.colorName}
//               onClick={() => onSelect && onSelect(idx)}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// /* ======================= MAIN PAGE ======================= */

// function SportyCustomize() {
//   const { slug } = useParams(); // /kids/:slug/customize/sporty
//   const location = useLocation();
//   const navigate = useNavigate();
//   const previewRef = useRef(null);

//   // Data passed from CarDecal step (name, tagline, images, etc.)
//   const initialData = location.state || {};

//   const [custom, setCustom] = useState(initialData);
//   const [loading, setLoading] = useState(false);

//   const [theme, setTheme] = useState(null);

//   // Component colour lists from theme config
//   const [frameColors, setFrameColors] = useState([]);      // F01
//   const [gripColors, setGripColors] = useState([]);        // C05
//   const [mudguardColors, setMudguardColors] = useState([]); // C02
//   const [brakeLeverColors, setBrakeLeverColors] = useState([]); // C06

//   // Name & tagline are read-only here (from previous page/backend)
//   const [name] = useState(initialData.userName || "NAMENAME");
//   const [tagline] = useState(initialData.tagline || "TAGLINE HERE");

//   // Which accordion section is open
//   const [activeSection, setActiveSection] = useState("frame");

//   // Component selection indices
//   const [frameColorIndex, setFrameColorIndex] = useState(
//     initialData.frameColorIndex ?? 0
//   );
//   const [gripColorIndex, setGripColorIndex] = useState(
//     initialData.gripColorIndex ?? 0
//   );
//   const [mudguardColorIndex, setMudguardColorIndex] = useState(
//     initialData.mudguardColorIndex ?? 0
//   );
//   const [brakeLeverColorIndex, setBrakeLeverColorIndex] = useState(
//     initialData.brakeLeverColorIndex ?? 0
//   );

//   /* ---------- STYLES ---------- */
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
//     gap: "14px",
//   };

//   const cycleWrapper = {
//     position: "relative",
//     width: "100%",
//     maxWidth: "1024px",
//     margin: "0 auto",
//   };

//   const baseImg = { width: "100%", display: "block" };

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

//   const label = {
//     fontSize: "13px",
//     color: "#777",
//     marginBottom: "4px",
//     display: "block",
//   };

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

//   /* ---------- Fetch theme (for component palettes) ---------- */
//   useEffect(() => {
//     const fetchTheme = async () => {
//       if (!slug) return;
//       try {
//         const res = await fetch(`${THEME_API_BASE}/${slug}`);
//         if (!res.ok) throw new Error("Failed to load theme");
//         const data = await res.json();
//         setTheme(data);

//         const parts = data.assets?.parts || [];

//         const framePart = parts.find((p) => p.partCode === "F01");
//         const frameList = framePart?.colors || [];
//         setFrameColors(frameList);

//         const gripPart = parts.find((p) => p.partCode === "C05");
//         const gripList = gripPart?.colors || [];
//         setGripColors(gripList);

//         const mudguardPart = parts.find((p) => p.partCode === "C02");
//         const mudguardList = mudguardPart?.colors || [];
//         setMudguardColors(mudguardList);

//         const brakePart = parts.find((p) => p.partCode === "C06");
//         const brakeList = brakePart?.colors || [];
//         setBrakeLeverColors(brakeList);

//         // If indices not provided from previous state, set defaults
//         if (initialData.frameColorIndex == null && frameList.length) {
//           const blackIdx = frameList.findIndex(
//             (c) => c.colorName?.toLowerCase() === "black"
//           );
//           setFrameColorIndex(blackIdx >= 0 ? blackIdx : 0);
//         }
//         if (initialData.gripColorIndex == null && gripList.length) {
//           setGripColorIndex(0);
//         }
//         if (initialData.mudguardColorIndex == null && mudguardList.length) {
//           setMudguardColorIndex(0);
//         }
//         if (
//           initialData.brakeLeverColorIndex == null &&
//           brakeList.length
//         ) {
//           setBrakeLeverColorIndex(0);
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchTheme();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [slug]);

//   /* ---------- Load customization from backend if opened directly ---------- */
//   useEffect(() => {
//     // If we have full state from previous page, no need to refetch
//     if (location.state && Object.keys(initialData).length > 0) return;

//     const id = initialData.customizationId || initialData._id;
//     if (!id) return;

//     const fetchFromBackend = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`${CUSTOM_API}/${id}`);
//         if (!res.ok) throw new Error("Failed to fetch customization");
//         const data = await res.json();
//         setCustom(data);

//         if (data.frameColorIndex != null)
//           setFrameColorIndex(data.frameColorIndex);
//         if (data.gripColorIndex != null)
//           setGripColorIndex(data.gripColorIndex);
//         if (data.mudguardColorIndex != null)
//           setMudguardColorIndex(data.mudguardColorIndex);
//         if (data.brakeLeverColorIndex != null)
//           setBrakeLeverColorIndex(data.brakeLeverColorIndex);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFromBackend();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   if (loading) {
//     return (
//       <div style={pageWrapper}>
//         <div>Loading...</div>
//       </div>
//     );
//   }

//   if (!custom || !custom.images) {
//     return (
//       <div style={pageWrapper}>
//         <div>
//           <h2>No customization data found</h2>
//           <p>Please go back to the previous page and configure your bike.</p>
//         </div>
//       </div>
//     );
//   }

//   /* ---------- Extract data ---------- */
//   const {
//     brand: customBrand,
//     themeName: customThemeName,
//     cycleName,
//     modelNo,
//     images = {},
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

//   const brand = customBrand || theme?.brand || "BSA";
//   const themeName = customThemeName || theme?.themeName || "Car Decal";

//   // Use themeVariant chosen in previous step (do not edit here)
//   const highlightVariant =
//     custom.themeVariant || initialData.themeVariant || "primary";

//   const activeHighlight =
//     highlightVariant === "primary"
//       ? primaryColour || secondaryColour
//       : secondaryColour || primaryColour;

//   // Component overlays (from DB)
//   const frameOverlay =
//     frameColors[frameColorIndex]?.imageUrl || frameColors[0]?.imageUrl || null;
//   const gripOverlay =
//     gripColors[gripColorIndex]?.imageUrl || gripColors[0]?.imageUrl || null;
//   const mudguardOverlay =
//     mudguardColors[mudguardColorIndex]?.imageUrl ||
//     mudguardColors[0]?.imageUrl ||
//     null;
//   const brakeLeverOverlay =
//     brakeLeverColors[brakeLeverColorIndex]?.imageUrl ||
//     brakeLeverColors[0]?.imageUrl ||
//     null;

//   /* ---------- Handlers ---------- */

//   const handleFrameColourChange = (idx) => {
//     setFrameColorIndex(idx);
//     setCustom((prev) => ({
//       ...prev,
//       frameColorIndex: idx,
//     }));
//   };

//   const handleGripColourChange = (idx) => {
//     setGripColorIndex(idx);
//     setCustom((prev) => ({
//       ...prev,
//       gripColorIndex: idx,
//     }));
//   };

//   const handleMudguardColourChange = (idx) => {
//     setMudguardColorIndex(idx);
//     setCustom((prev) => ({
//       ...prev,
//       mudguardColorIndex: idx,
//     }));
//   };

//   const handleBrakeLeverColourChange = (idx) => {
//     setBrakeLeverColorIndex(idx);
//     setCustom((prev) => ({
//       ...prev,
//       brakeLeverColorIndex: idx,
//     }));
//   };

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
//       link.download = "custom-cycle-sporty.png";
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
//       const file = new File([blob], "custom-cycle-sporty.png", {
//         type: "image/png",
//       });

//       if (navigator.share && navigator.canShare?.({ files: [file] })) {
//         await navigator.share({
//           files: [file],
//           title: "My Sporty Custom Cycle",
//           text: "Check out my sporty bike!",
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
//       frameColorIndex,
//       gripColorIndex,
//       mudguardColorIndex,
//       brakeLeverColorIndex,
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
//       alert("Sporty customization updated");
//     } catch (err) {
//       console.error("Error updating customization", err);
//       alert("Error updating customization");
//     }
//   };

//   /* ---------- Render ---------- */

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

//       {/* LEFT – preview */}
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

//           {/* LAYER ORDER:
//               1. Base bike
//               2. Component overlays (frame / mudguard / grip / brake lever)
//               3. Theme stickers (carBase, carPaint, carDecal, highlight, logo)
//               4. Text (name + tagline)
//           */}

//           {/* 1. Base */}
//           {baseBikeImage && (
//             <img
//               src={baseBikeImage}
//               alt="Sporty cycle"
//               style={baseImg}
//               crossOrigin="anonymous"
//             />
//           )}

//           {/* 2. Component overlays */}
//           {frameOverlay && (
//             <img
//               src={frameOverlay}
//               alt="Frame colour"
//               style={overlayImg}
//               crossOrigin="anonymous"
//             />
//           )}
//           {mudguardOverlay && (
//             <img
//               src={mudguardOverlay}
//               alt="Mudguard colour"
//               style={overlayImg}
//               crossOrigin="anonymous"
//             />
//           )}
//           {gripOverlay && (
//             <img
//               src={gripOverlay}
//               alt="Grip colour"
//               style={overlayImg}
//               crossOrigin="anonymous"
//             />
//           )}
//           {brakeLeverOverlay && (
//             <img
//               src={brakeLeverOverlay}
//               alt="Brake lever colour"
//               style={overlayImg}
//               crossOrigin="anonymous"
//             />
//           )}

//           {/* 3. Stickers – always on top of components */}
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

//           {/* 4. Name + Tagline */}
//           <div style={nameStyle}>{name}</div>
//           <div style={taglineStyle}>{tagline}</div>
//         </div>
//       </div>

//       {/* RIGHT – controls */}
//       <div style={rightPanel}>
//         <div style={rightCard}>
//           {/* Header info */}
//           <div>
//             <h2 style={{ margin: "0 0 4px", fontSize: "18px", color: "#333" }}>
//               {brand} – Sporty
//             </h2>
//             <div style={{ fontSize: "12px", color: "#777" }}>
//               {themeName}
//               {cycleName ? ` • ${cycleName}` : ""}
//               {modelNo ? ` • ${modelNo}` : ""}
//             </div>
//             <div style={{ fontSize: "12px", color: "#999", marginTop: "4px" }}>
//               Name: <strong>{name}</strong> &nbsp; | &nbsp; Tagline:{" "}
//               <strong>{tagline}</strong>
//             </div>
//           </div>

//           {/* Components – accordion style, only one open at a time */}
//           <div>
//             <span style={label}>Component colours</span>
//             <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
//               <ColourSection
//                 title="Frame colour"
//                 colors={frameColors}
//                 selectedIndex={frameColorIndex}
//                 onSelect={handleFrameColourChange}
//                 isOpen={activeSection === "frame"}
//                 onToggle={() =>
//                   setActiveSection((prev) => (prev === "frame" ? "" : "frame"))
//                 }
//               />

//               <ColourSection
//                 title="Grip colour"
//                 colors={gripColors}
//                 selectedIndex={gripColorIndex}
//                 onSelect={handleGripColourChange}
//                 isOpen={activeSection === "grip"}
//                 onToggle={() =>
//                   setActiveSection((prev) => (prev === "grip" ? "" : "grip"))
//                 }
//               />

//               <ColourSection
//                 title="Mudguard colour"
//                 colors={mudguardColors}
//                 selectedIndex={mudguardColorIndex}
//                 onSelect={handleMudguardColourChange}
//                 isOpen={activeSection === "mudguard"}
//                 onToggle={() =>
//                   setActiveSection((prev) =>
//                     prev === "mudguard" ? "" : "mudguard"
//                   )
//                 }
//               />

//               <ColourSection
//                 title="Brake lever colour"
//                 colors={brakeLeverColors}
//                 selectedIndex={brakeLeverColorIndex}
//                 onSelect={handleBrakeLeverColourChange}
//                 isOpen={activeSection === "brake"}
//                 onToggle={() =>
//                   setActiveSection((prev) => (prev === "brake" ? "" : "brake"))
//                 }
//               />
//             </div>
//           </div>

//           {/* Buttons */}
//           <button type="button" style={primaryButton} onClick={handleSave}>
//             SAVE SPORTY CUSTOMIZATION
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

// export default SportyCustomize;



// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import html2canvas from "html2canvas";

// const THEME_API_BASE = "http://localhost:5000/api/theme-config/slug";
// const CUSTOM_API = "http://localhost:5000/api/customizations";

// function Customization() {
//   const { slug } = useParams(); // /kids/:slug  -> car-decal
//   const navigate = useNavigate();
//   const previewRef = useRef(null);

//   const [theme, setTheme] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   // User selections
//   const [name, setName] = useState("NAMENAME");
//   const [tagline, setTagline] = useState("TAGLINE HERE");
//   const [bikeSize, setBikeSize] = useState("24T");
//   const [mode, setMode] = useState("sporty"); // sporty / fun
//   const [frameColorIndex, setFrameColorIndex] = useState(0);
//   const [themeVariant, setThemeVariant] = useState("primary"); // primary / secondary

//   // --------------------- Styles ---------------------
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
//     boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
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
//     boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
//     padding: "16px 18px",
//     display: "flex",
//     flexDirection: "column",
//     gap: "14px",
//   };

//   const cycleWrapper = {
//     position: "relative",
//     width: "100%",
//     maxWidth: "1024px",
//     margin: "0 auto",
//   };

//   const baseImg = { width: "100%", display: "block" };

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
//     textShadow: "0 0 3px rgba(0,0,0,0.9)",
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

//   const label = { fontSize: "13px", color: "#777", marginBottom: "4px" };

//   const input = {
//     padding: "8px 10px",
//     background: "#fafafa",
//     color: "#333",
//     border: "1px solid #ddd",
//     borderRadius: "6px",
//     width: "100%",
//     fontSize: "13px",
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

//   const sizePill = (active) => ({
//     padding: "6px 12px",
//     borderRadius: "999px",
//     border: active ? "1px solid #333" : "1px solid #ccc",
//     background: active ? "#333" : "#f7f7f7",
//     color: active ? "#fff" : "#333",
//     cursor: "pointer",
//     fontSize: "13px",
//     fontWeight: 500,
//   });

//   const colorDot = (hex, selected) => ({
//     width: "22px",
//     height: "22px",
//     borderRadius: "50%",
//     background: hex || "#ffffff",
//     border: selected ? "2px solid #000" : "1px solid #bbb",
//     cursor: "pointer",
//     boxShadow: selected ? "0 0 4px rgba(0,0,0,0.8)" : "none",
//   });

//   const primaryButton = {
//     width: "100%",
//     padding: "12px",
//     borderRadius: "8px",
//     border: "none",
//     background: "#000",
//     color: "#fff",
//     fontWeight: 600,
//     cursor: "pointer",
//     fontSize: "14px",
//     letterSpacing: "0.05em",
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
//     border: "1px solid rgba(0,0,0,0.2)",
//     background: "rgba(255,255,255,0.9)",
//     color: "#333",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
//   };

//   // --------------------- Fetch theme data ---------------------
//   useEffect(() => {
//     const fetchTheme = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`${THEME_API_BASE}/${slug}`);
//         const data = await res.json();
//         setTheme(data);

//         // default frame color → Black if present
//         const framePart = data.assets?.parts?.find(
//           (p) => p.partCode === "F01"
//         );
//         if (framePart?.colors?.length) {
//           const idx = framePart.colors.findIndex(
//             (c) => c.colorName?.toLowerCase() === "black"
//           );
//           setFrameColorIndex(idx >= 0 ? idx : 0);
//         }
//       } catch (err) {
//         console.error("Failed to load theme", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (slug) fetchTheme();
//   }, [slug]);

//   if (!slug) {
//     return (
//       <div style={pageWrapper}>
//         <div>No slug in URL</div>
//       </div>
//     );
//   }

//   if (loading) return <div style={pageWrapper}>Loading...</div>;
//   if (!theme) return <div style={pageWrapper}>Theme not found</div>;

//   // --------------------- Theme values ---------------------
//   const brandName = theme.brand || "BSA";
//   const cycleName = theme.cycleName || "";
//   const modelNo = theme.modelNo || theme.modelId || "";

//   const parts = theme.assets?.parts || [];
//   const framePart = parts.find((p) => p.partCode === "F01") || {};
//   const frameColors = framePart.colors || [];
//   const activeFrameColor =
//     frameColors[frameColorIndex] || frameColors[0] || {};

//   const stickers = activeFrameColor.stickers || {};

//   // Full base image changes with Sporty / Fun
//   const baseBikeImage =
//     mode === "sporty"
//       ? stickers.sportyFrameComponent ||
//         stickers.sportyImage ||
//         activeFrameColor.imageUrl
//       : stickers.funFrameComponent ||
//         stickers.funImage ||
//         activeFrameColor.imageUrl;

//   const carBase = stickers.carBase;
//   const carPaint = stickers.carPaint;
//   const carDecal = stickers.carDecal;
//   const primarySticker = stickers.primaryColour;
//   const secondarySticker = stickers.secondaryColour;
//   const logo = stickers.logo;

//   const activeHighlight =
//     themeVariant === "primary"
//       ? primarySticker || secondarySticker
//       : secondarySticker || primarySticker;

//   // --------------------- Download / Share ---------------------
//   const captureCanvas = async () => {
//     if (!previewRef.current) return null;
//     const canvas = await html2canvas(previewRef.current, {
//       useCORS: true,
//       scale: 2,
//       backgroundColor: null,
//     });
//     return canvas;
//   };

//   const handleDownload = async () => {
//     try {
//       const canvas = await captureCanvas();
//       if (!canvas) return;
//       const url = canvas.toDataURL("image/png");
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = "custom-cycle.png";
//       a.click();
//     } catch (e) {
//       console.error(e);
//       alert("Download failed");
//     }
//   };

//   const handleShare = async () => {
//     try {
//       const canvas = await captureCanvas();
//       if (!canvas) return;
//       const url = canvas.toDataURL("image/png");
//       const blob = await (await fetch(url)).blob();
//       const file = new File([blob], "custom-cycle.png", { type: "image/png" });

//       if (navigator.share && navigator.canShare?.({ files: [file] })) {
//         await navigator.share({
//           files: [file],
//           title: "My Custom Cycle",
//           text: "Check out my customized bike!",
//         });
//       } else {
//         alert("Share not supported on this device");
//       }
//     } catch (e) {
//       console.error(e);
//       alert("Share failed");
//     }
//   };

//   // --------------------- CREATE + NAVIGATE ---------------------
//   const handleCustomize = async () => {
//     try {
//       setSaving(true);

//       const payload = {
//         brand: brandName,
//         themeId: theme.themeId,
//         themeSlug: theme.themeSlug,
//         themeName: theme.themeName,
//         cycleId: theme.cycleId,
//         modelId: theme.modelId,
//         cycleName,
//         modelNo,

//         userName: name,
//         tagline,
//         bikeSize,

//         mode,
//         themeVariant,

//         frameColorIndex,
//         frameColor: activeFrameColor,

//         images: {
//           baseBikeImage,
//           carBase,
//           carPaint,
//           carDecal,
//           primaryColour: primarySticker,
//           secondaryColour: secondarySticker,
//           logo,
//         },

//         stickersRaw: stickers,
//       };

//       const res = await fetch(CUSTOM_API, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) throw new Error("Failed to save customization");

//       const saved = await res.json();
//       const customizationId = saved._id;

//       const target =
//         mode === "sporty"
//           ? `/kids/${slug}/customize/sporty`
//           : `/kids/${slug}/customize/fun`;

//       navigate(target, {
//         state: {
//           customizationId,
//           customization: saved,
//         },
//       });
//     } catch (err) {
//       console.error(err);
//       alert("Error saving customization");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // --------------------- UI ---------------------
//   return (
//     <div style={pageWrapper}>
//       <style>
//         {`
//         @font-face {
//           font-family: 'Tigershark Bold Italic';
//           src: url('/fonts/tigersharkboldital.ttf') format('truetype');
//           font-weight: normal;
//           font-style: normal;
//         }
//       `}
//       </style>

//       {/* LEFT PREVIEW */}
//       <div style={leftPanel}>
//         <div style={iconBar}>
//           <button style={iconButton} onClick={handleDownload} title="Download">
//             ⬇
//           </button>
//           <button style={iconButton} onClick={handleShare} title="Share">
//             ✉
//           </button>
//         </div>

//         <div ref={previewRef} style={cycleWrapper}>
//           {baseBikeImage && (
//             <img
//               src={baseBikeImage}
//               style={baseImg}
//               alt="Cycle base"
//               crossOrigin="anonymous"
//             />
//           )}

//           {carBase && (
//             <img
//               src={carBase}
//               style={overlayImg}
//               alt="Car base"
//               crossOrigin="anonymous"
//             />
//           )}
//           {carPaint && (
//             <img
//               src={carPaint}
//               style={overlayImg}
//               alt="Car paint"
//               crossOrigin="anonymous"
//             />
//           )}
//           {carDecal && (
//             <img
//               src={carDecal}
//               style={overlayImg}
//               alt="Car decal"
//               crossOrigin="anonymous"
//             />
//           )}
//           {activeHighlight && (
//             <img
//               src={activeHighlight}
//               style={overlayImg}
//               alt="Theme highlight"
//               crossOrigin="anonymous"
//             />
//           )}
//           {logo && (
//             <img
//               src={logo}
//               style={overlayImg}
//               alt="Logo"
//               crossOrigin="anonymous"
//             />
//           )}

//           <div style={nameStyle}>{name}</div>
//           <div style={taglineStyle}>{tagline}</div>
//         </div>
//       </div>

//       {/* RIGHT PANEL */}
//       <div style={rightPanel}>
//         <div style={rightCard}>
//           {/* Brand + Theme / Cycle / Model */}
//           <h2 style={{ margin: 0 }}>{brandName}</h2>
//           <div style={{ fontSize: "12px", color: "#777" }}>
//             {theme.themeName}
//             {cycleName ? ` • ${cycleName}` : ""}
//             {modelNo ? ` • ${modelNo}` : ""}
//           </div>

//           {/* Name + Tagline */}
//           <div>
//             <span
//               style={{
//                 fontSize: "12px",
//                 fontWeight: 600,
//                 color: "#4CAF50",
//               }}
//             >
//               Rider name & Tagline (Max 15 Char)
//             </span>
//             <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
//               <input
//                 style={input}
//                 value={name}
//                 maxLength={15}
//                 onChange={(e) => setName(e.target.value.toUpperCase())}
//                 placeholder="Name"
//               />
//               <input
//                 style={input}
//                 value={tagline}
//                 maxLength={15}
//                 onChange={(e) => setTagline(e.target.value.toUpperCase())}
//                 placeholder="Tagline"
//               />
//             </div>
//           </div>

//           {/* Bike size */}
//           <div>
//             <span style={label}>Bike size</span>
//             <div style={{ display: "flex", gap: "8px" }}>
//               {["20T", "24T", "26T"].map((sz) => (
//                 <button
//                   key={sz}
//                   style={sizePill(sz === bikeSize)}
//                   onClick={() => setBikeSize(sz)}
//                 >
//                   {sz}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Bike preference (Sporty / Fun) */}
//           <div>
//             <span style={label}>Bike preference</span>
//             <div style={{ display: "flex", gap: "8px" }}>
//               <button
//                 style={pillButton(mode === "sporty")}
//                 onClick={() => setMode("sporty")}
//               >
//                 Sporty
//               </button>
//               <button
//                 style={pillButton(mode === "fun")}
//                 onClick={() => setMode("fun")}
//               >
//                 Fun
//               </button>
//             </div>
//           </div>

//           {/* Frame colour */}
//           <div>
//             <span style={label}>Frame colour</span>
//             <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
//               {frameColors.map((c, idx) => (
//                 <div
//                   key={c.fileName || idx}
//                   style={colorDot(c.colorCode, idx === frameColorIndex)}
//                   title={c.colorName}
//                   onClick={() => setFrameColorIndex(idx)}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* Sticker theme (Primary / Secondary) */}
//           <div>
//             <span style={label}>Sticker theme</span>
//             <div style={{ display: "flex", gap: "8px" }}>
//               <button
//                 style={pillButton(themeVariant === "primary")}
//                 onClick={() => setThemeVariant("primary")}
//               >
//                 Primary
//               </button>
//               <button
//                 style={pillButton(themeVariant === "secondary")}
//                 onClick={() => setThemeVariant("secondary")}
//               >
//                 Secondary
//               </button>
//             </div>
//           </div>

//           {/* Customize button */}
//           <button
//             style={primaryButton}
//             onClick={handleCustomize}
//             disabled={saving}
//           >
//             {saving ? "SAVING..." : "CUSTOMIZE"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Customization;

// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import html2canvas from "html2canvas";

// const THEME_API_BASE = "http://localhost:5000/api/theme-config/slug";
// const CUSTOM_API = "http://localhost:5000/api/customizations";

// function Customization() {
//   const { slug } = useParams(); // /kids/:slug  -> car-decal
//   const navigate = useNavigate();
//   const previewRef = useRef(null);
//   const baseImgRef = useRef(null); 

//   const [theme, setTheme] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   // User selections
//   const [name, setName] = useState("NAMENAME");
//   const [tagline, setTagline] = useState("TAGLINE HERE");
//   const [bikeSize, setBikeSize] = useState("24T");
//   const [mode, setMode] = useState("sporty"); // sporty / fun
//   const [frameColorIndex, setFrameColorIndex] = useState(0);
//   const [themeVariant, setThemeVariant] = useState("primary"); // primary / secondary

//   // --------------------- Styles ---------------------
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
//     boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
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
//     boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
//     padding: "16px 18px",
//     display: "flex",
//     flexDirection: "column",
//     gap: "14px",
//   };

//   const cycleWrapper = {
//     position: "relative",
//     width: "100%",
//     maxWidth: "1024px",
//     margin: "0 auto",
//   };

//   const baseImg = { width: "100%", display: "block" };

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
//     textShadow: "0 0 3px rgba(0,0,0,0.9)",
//     pointerEvents: "none",
//   };

//   const nameStyle = {
//     ...baseText,
//     left: "57.4%",
//     top: "42.27%",
//     transform: "translate(-50%, -50%) rotate(-22deg)",
//     fontSize: "15px",
//   };

//   const taglineStyle = {
//     ...baseText,
//     left: "33.73%",
//     top: "50.26%",
//     transform: "translate(-50%, -50%) rotate(48.8deg)",
//     fontSize: "8px",
//   };

//   const label = { fontSize: "13px", color: "#777", marginBottom: "4px" };

//   const input = {
//     padding: "8px 10px",
//     background: "#fafafa",
//     color: "#333",
//     border: "1px solid #ddd",
//     borderRadius: "6px",
//     width: "100%",
//     fontSize: "13px",
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

//   const sizePill = (active) => ({
//     padding: "6px 12px",
//     borderRadius: "999px",
//     border: active ? "1px solid #333" : "1px solid #ccc",
//     background: active ? "#333" : "#f7f7f7",
//     color: active ? "#fff" : "#333",
//     cursor: "pointer",
//     fontSize: "13px",
//     fontWeight: 500,
//   });

//   const colorDot = (hex, selected) => ({
//     width: "22px",
//     height: "22px",
//     borderRadius: "50%",
//     background: hex || "#ffffff",
//     border: selected ? "2px solid #000" : "1px solid #bbb",
//     cursor: "pointer",
//     boxShadow: selected ? "0 0 4px rgba(0,0,0,0.8)" : "none",
//   });

//   const primaryButton = {
//     width: "100%",
//     padding: "12px",
//     borderRadius: "8px",
//     border: "none",
//     background: "#000",
//     color: "#fff",
//     fontWeight: 600,
//     cursor: "pointer",
//     fontSize: "14px",
//     letterSpacing: "0.05em",
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
//     border: "1px solid rgba(0,0,0,0.2)",
//     background: "rgba(255,255,255,0.9)",
//     color: "#333",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
//   };

//   // --------------------- Fetch theme data ---------------------
//   useEffect(() => {
//     const fetchTheme = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`${THEME_API_BASE}/${slug}`);
//         const data = await res.json();
//         setTheme(data);

//         // default frame color → Black if present
//         const framePart = data.assets?.parts?.find(
//           (p) => p.partCode === "F01"
//         );
//         if (framePart?.colors?.length) {
//           const idx = framePart.colors.findIndex(
//             (c) => c.colorName?.toLowerCase() === "black"
//           );
//           setFrameColorIndex(idx >= 0 ? idx : 0);
//         }
//       } catch (err) {
//         console.error("Failed to load theme", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (slug) fetchTheme();
//   }, [slug]);

//   if (!slug) {
//     return (
//       <div style={pageWrapper}>
//         <div>No slug in URL</div>
//       </div>
//     );
//   }

//   if (loading) return <div style={pageWrapper}>Loading...</div>;
//   if (!theme) return <div style={pageWrapper}>Theme not found</div>;

//   // --------------------- Theme values ---------------------
//   const brandName = theme.brand || "BSA";
//   const cycleName = theme.cycleName || "";
//   const modelNo = theme.modelNo || theme.modelId || "";

//   const parts = theme.assets?.parts || [];
//   const framePart = parts.find((p) => p.partCode === "F01") || {};
//   const frameColors = framePart.colors || [];
//   const activeFrameColor =
//     frameColors[frameColorIndex] || frameColors[0] || {};

//   const stickers = activeFrameColor.stickers || {};

//   // Full base image changes with Sporty / Fun
//   const baseBikeImage =
//     mode === "sporty"
//       ? stickers.sportyFrameComponent ||
//         stickers.sportyImage ||
//         activeFrameColor.imageUrl
//       : stickers.funFrameComponent ||
//         stickers.funImage ||
//         activeFrameColor.imageUrl;

//   const carBase = stickers.carBase;
//   const carPaint = stickers.carPaint;
//   const carDecal = stickers.carDecal;
//   const primarySticker = stickers.primaryColour;
//   const secondarySticker = stickers.secondaryColour;
//   const logo = stickers.logo;

//   const activeHighlight =
//     themeVariant === "primary"
//       ? primarySticker || secondarySticker
//       : secondarySticker || primarySticker;

//   // --------------------- Download / Share ---------------------
//   // const captureCanvas = async () => {
//   //   if (!previewRef.current) return null;
//   //   const canvas = await html2canvas(previewRef.current, {
//   //     useCORS: true,
//   //     scale: 2,
//   //     backgroundColor: null,
//   //   });
//   //   return canvas;
//   // };
//   const captureCanvas = async () => {
//   if (!previewRef.current) return null;

//   if (document.fonts?.ready) {
//     try {
//       await document.fonts.ready;
//     } catch {}
//   }

//   const node = previewRef.current;
//   const rect = node.getBoundingClientRect();

//   const canvas = await html2canvas(node, {
//     useCORS: true,
//     backgroundColor: null,
    
//     // scrollX: 0,
//     // scrollY: 0,
//     scale: 2,
//   });
//   return canvas;
// };



//   // const handleDownload = async () => {
//   //   try {
//   //     const canvas = await captureCanvas();
//   //     if (!canvas) return;
//   //      // Get the original frame size (2048x1365 for the image you shared)
//   //   let targetWidth = canvas.width;
//   //   let targetHeight = canvas.height;

//   //   const resizedCanvas = resizeCanvas(canvas, outputWidth, outputHeight);

//   //     const url = resizedCanvas.toDataURL("image/png");
//   //     const a = document.createElement("a");
//   //     a.href = url;
//   //     a.download = "custom-cycle.png";
//   //     a.click();
//   //   } catch (e) {
//   //     console.error(e);
//   //     alert("Download failed");
//   //   }
//   // };
//   const handleDownload = async () => {
//   try {
//     const canvas = await captureCanvas();
//     if (!canvas) return;

//     // Get the original frame size (2048x1365 for the image you shared)
//     let targetWidth = canvas.width;
//     let targetHeight = canvas.height;

//     if (baseImgRef.current) {
//       const naturalW = baseImgRef.current.naturalWidth;
//       const naturalH = baseImgRef.current.naturalHeight;

//       if (naturalW && naturalH) {
//         targetWidth = naturalW;
//         targetHeight = naturalH;
//       }
//     }

//     // Now force the download to that size
//     const outputCanvas = resizeCanvas(canvas, targetWidth, targetHeight);

//     const url = outputCanvas.toDataURL("image/png");
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "custom-cycle.png";
//     a.click();
//   } catch (e) {
//     console.error(e);
//     alert("Download failed");
//   }
// };


//   // const handleShare = async () => {
//   //   try {
//   //     const canvas = await captureCanvas();
//   //     if (!canvas) return;
//   //     const url = canvas.toDataURL("image/png");
//   //     const blob = await (await fetch(url)).blob();
//   //     const file = new File([blob], "custom-cycle.png", { type: "image/png" });

//   //     // if (navigator.share && navigator.canShare?.({ files: [file] })) {
//   //     //   await navigator.share({
//   //     //     files: [file],
//   //     //     title: "My Custom Cycle",
//   //     //     text: "Check out my customized bike!",
//   //     //   });
//   //     // } else {
//   //     //   alert("Share not supported on this device");
//   //     // }
//   //     if (navigator.share) {
//   //     if (navigator.canShare?.({ files: [file] })) {
//   //       await navigator.share({
//   //         files: [file],
//   //         title: "My Custom Cycle",
//   //         text: "Check out my customized bike!",
//   //       });
//   //     } else {
//   //       // Fallback: share just the data URL or text link
//   //       await navigator.share({
//   //         title: "My Custom Cycle",
//   //         text: "Check out my customized bike!",
//   //         url: dataUrl,
//   //       });
//   //     }
//   //   } else {
//   //     alert("Share is not supported on this device / browser");
//   //   }
//   //   } catch (e) {
//   //     console.error(e);
//   //     alert("Share failed");
//   //   }
//   // };
//   const handleShare = async () => {
//   const shareUrl = window.location.href; // or any URL you want to share

//   // Basic Web Share support?
//   if (typeof navigator === "undefined" || !navigator.share) {
//     // Fallback: copy link to clipboard
//     try {
//       await navigator.clipboard?.writeText(shareUrl);
//       alert("Share is not supported here. Link copied to clipboard 👍");
//     } catch {
//       alert("Share is not supported on this browser. Please copy the URL manually.");
//     }
//     return;
//   }

//   try {
//     await navigator.share({
//       title: "My Custom Cycle",
//       text: "Check out my customized bike!",
//       url: shareUrl,
//     });
//     // user either shared or cancelled – no need to do anything else
//   } catch (err) {
//     // If user cancels, we just ignore
//     if (err.name !== "AbortError") {
//       console.error("Share error:", err);
//       alert("Unable to open share options on this browser.");
//     }
//   }
// };


//   // --------------------- CREATE + NAVIGATE (Method B) ---------------------
//   const handleCustomize = async () => {
//     try {
//       setSaving(true);

//       const payload = {
//         brand: brandName,
//         themeId: theme.themeId,
//         themeSlug: theme.themeSlug,
//         themeName: theme.themeName,
//         cycleId: theme.cycleId,
//         modelId: theme.modelId,
//         cycleName,
//         modelNo,

//         userName: name,
//         tagline,
//         bikeSize,

//         mode,
//         themeVariant,

//         frameColorIndex,
//         frameColor: activeFrameColor,

//         images: {
//           baseBikeImage,
//           carBase,
//           carPaint,
//           carDecal,
//           primaryColour: primarySticker,
//           secondaryColour: secondarySticker,
//           logo,
//         },

//         stickersRaw: stickers,
//       };

//       const res = await fetch(CUSTOM_API, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) throw new Error("Failed to save customization");

//       const saved = await res.json();
//       const customizationId = saved._id;

//       // ✅ Now include customizationId in URL for Method B
//       const target =
//         mode === "sporty"
//           ? `/kids/${slug}/customize/sporty/${customizationId}`
//           : `/kids/${slug}/customize/fun/${customizationId}`;

//       navigate(target, {
//       state: {
//         customizationId,
//       },
//     });
//     } catch (err) {
//       console.error(err);
//       alert("Error saving customization");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // --------------------- UI ---------------------
//   return (
//     <div style={pageWrapper}>
//       <style>
//         {`
//         @font-face {
//           font-family: 'Tigershark Bold Italic';
//           src: url('/fonts/tigersharkboldital.ttf') format('truetype');
//           font-weight: normal;
//           font-style: normal;
//         }
//       `}
//       </style>

//       {/* LEFT PREVIEW */}
//       <div style={leftPanel}>
//         <div style={iconBar}>
//           <button style={iconButton} onClick={handleDownload} title="Download">
//             ⬇
//           </button>
//           <button style={iconButton} onClick={handleShare} title="Share">
//             ✉
//           </button>
//         </div>

//         <div ref={previewRef} style={cycleWrapper}>
//           {baseBikeImage && (
//             <img
//               ref={baseImgRef}
//               src={baseBikeImage}
//               style={baseImg}
//               alt="Cycle base"
//               crossOrigin="anonymous"
//             />
//           )}

//           {carBase && (
//             <img
//               src={carBase}
//               style={overlayImg}
//               alt="Car base"
//               crossOrigin="anonymous"
//             />
//           )}
//           {carPaint && (
//             <img
//               src={carPaint}
//               style={overlayImg}
//               alt="Car paint"
//               crossOrigin="anonymous"
//             />
//           )}
//           {carDecal && (
//             <img
//               src={carDecal}
//               style={overlayImg}
//               alt="Car decal"
//               crossOrigin="anonymous"
//             />
//           )}
//           {activeHighlight && (
//             <img
//               src={activeHighlight}
//               style={overlayImg}
//               alt="Theme highlight"
//               crossOrigin="anonymous"
//             />
//           )}
//           {logo && (
//             <img
//               src={logo}
//               style={overlayImg}
//               alt="Logo"
//               crossOrigin="anonymous"
//             />
//           )}

//           <div style={nameStyle}>{name}</div>
//           <div style={taglineStyle}>{tagline}</div>
//         </div>
//       </div>

//       {/* RIGHT PANEL */}
//       <div style={rightPanel}>
//         <div style={rightCard}>
//           {/* Brand + Theme / Cycle / Model */}
//           <h2 style={{ margin: 0 }}>{brandName}</h2>
//           <div style={{ fontSize: "12px", color: "#777" }}>
//             {theme.themeName}
//             {cycleName ? ` • ${cycleName}` : ""}
//             {modelNo ? ` • ${modelNo}` : ""}
//           </div>

//           {/* Name + Tagline */}
//           <div>
//             <span
//               style={{
//                 fontSize: "12px",
//                 fontWeight: 600,
//                 color: "#4CAF50",
//               }}
//             >
//               Rider name (Max 8 char) & Tagline (Max 15 Char)
//             </span>
//             <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
//               <input
//                 style={input}
//                 value={name}
//                 maxLength={15}
//                 onChange={(e) => setName(e.target.value.toUpperCase())}
//                 placeholder="Name"
//               />
//               <input
//                 style={input}
//                 value={tagline}
//                 maxLength={15}
//                 onChange={(e) => setTagline(e.target.value.toUpperCase())}
//                 placeholder="Tagline"
//               />
//             </div>
//           </div>

//           {/* Bike size */}
//           <div>
//             <span style={label}>Bike size</span>
//             <div style={{ display: "flex", gap: "8px" }}>
//               {["20T", "24T", "26T"].map((sz) => (
//                 <button
//                   key={sz}
//                   style={sizePill(sz === bikeSize)}
//                   onClick={() => setBikeSize(sz)}
//                 >
//                   {sz}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Bike preference (Sporty / Fun) */}
//           <div>
//             <span style={label}>Bike preference</span>
//             <div style={{ display: "flex", gap: "8px" }}>
//               <button
//                 style={pillButton(mode === "sporty")}
//                 onClick={() => setMode("sporty")}
//               >
//                 Sporty
//               </button>
//               <button
//                 style={pillButton(mode === "fun")}
//                 onClick={() => setMode("fun")}
//               >
//                 Fun
//               </button>
//             </div>
//           </div>

//           {/* Frame colour */}
//           <div>
//             <span style={label}>Frame colour</span>
//             <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
//               {frameColors.map((c, idx) => (
//                 <div
//                   key={c.fileName || idx}
//                   style={colorDot(c.colorCode, idx === frameColorIndex)}
//                   title={c.colorName}
//                   onClick={() => setFrameColorIndex(idx)}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* Sticker theme (Primary / Secondary) */}
//           <div>
//             <span style={label}>Sticker theme</span>
//             <div style={{ display: "flex", gap: "8px" }}>
//               <button
//                 style={pillButton(themeVariant === "primary")}
//                 onClick={() => setThemeVariant("primary")}
//               >
//                 Primary
//               </button>
//               <button
//                 style={pillButton(themeVariant === "secondary")}
//                 onClick={() => setThemeVariant("secondary")}
//               >
//                 Secondary
//               </button>
//             </div>
//           </div>

//           {/* Customize button */}
//           <button
//             style={primaryButton}
//             onClick={handleCustomize}
//             disabled={saving}
//           >
//             {saving ? "SAVING..." : "CUSTOMIZE"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Customization;


// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";

// const THEME_API_BASE = "http://localhost:5000/api/theme-config/slug";
// const CUSTOM_API = "http://localhost:5000/api/customizations";

// function Customization() {
//   const { slug } = useParams(); // /kids/:slug  -> car-decal
//   const navigate = useNavigate();
//   const previewRef = useRef(null);
//   const baseImgRef = useRef(null);
//   const nameRef = useRef(null);
//   const taglineRef = useRef(null);

//   const [theme, setTheme] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   // User selections
//   const [name, setName] = useState("NAMENAME");
//   const [tagline, setTagline] = useState("TAGLINE HERE");
//   const [bikeSize, setBikeSize] = useState("24T");
//   const [mode, setMode] = useState("sporty"); // sporty / fun
//   const [frameColorIndex, setFrameColorIndex] = useState(0);
//   const [themeVariant, setThemeVariant] = useState("primary"); // primary / secondary

//   // --------------------- Styles ---------------------
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
//     boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
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
//     boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
//     padding: "16px 18px",
//     display: "flex",
//     flexDirection: "column",
//     gap: "14px",
//   };

//   const cycleWrapper = {
//     position: "relative",
//     width: "100%",
//     maxWidth: "1024px",
//     margin: "0 auto",
//   };

//   const baseImg = { width: "100%", display: "block" };

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
//     textShadow: "0 0 3px rgba(0,0,0,0.9)",
//     pointerEvents: "none",
//   };

//   // Keep the geometry you want in the browser
//   const nameStyle = {
//     ...baseText,
//     left: "57.4%",
//     top: "42.27%",
//     transform: "translate(-50%, -50%) rotate(-22deg)",
//     fontSize: "15px",
//   };

//   const taglineStyle = {
//     ...baseText,
//     left: "33.73%",
//     top: "50.26%",
//     transform: "translate(-50%, -50%) rotate(48.8deg)",
//     fontSize: "8px",
//   };

//   const label = { fontSize: "13px", color: "#777", marginBottom: "4px" };

//   const input = {
//     padding: "8px 10px",
//     background: "#fafafa",
//     color: "#333",
//     border: "1px solid #ddd",
//     borderRadius: "6px",
//     width: "100%",
//     fontSize: "13px",
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

//   const sizePill = (active) => ({
//     padding: "6px 12px",
//     borderRadius: "999px",
//     border: active ? "1px solid #333" : "1px solid #ccc",
//     background: active ? "#333" : "#f7f7f7",
//     color: active ? "#fff" : "#333",
//     cursor: "pointer",
//     fontSize: "13px",
//     fontWeight: 500,
//   });

//   const colorDot = (hex, selected) => ({
//     width: "22px",
//     height: "22px",
//     borderRadius: "50%",
//     background: hex || "#ffffff",
//     border: selected ? "2px solid #000" : "1px solid #bbb",
//     cursor: "pointer",
//     boxShadow: selected ? "0 0 4px rgba(0,0,0,0.8)" : "none",
//   });

//   const primaryButton = {
//     width: "100%",
//     padding: "12px",
//     borderRadius: "8px",
//     border: "none",
//     background: "#000",
//     color: "#fff",
//     fontWeight: 600,
//     cursor: "pointer",
//     fontSize: "14px",
//     letterSpacing: "0.05em",
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
//     border: "1px solid rgba(0,0,0,0.2)",
//     background: "rgba(255,255,255,0.9)",
//     color: "#333",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
//   };

//   // --------------------- Fetch theme data ---------------------
//   useEffect(() => {
//     const fetchTheme = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`${THEME_API_BASE}/${slug}`);
//         const data = await res.json();
//         setTheme(data);

//         const framePart = data.assets?.parts?.find(
//           (p) => p.partCode === "F01"
//         );
//         if (framePart?.colors?.length) {
//           const idx = framePart.colors.findIndex(
//             (c) => c.colorName?.toLowerCase() === "black"
//           );
//           setFrameColorIndex(idx >= 0 ? idx : 0);
//         }
//       } catch (err) {
//         console.error("Failed to load theme", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (slug) fetchTheme();
//   }, [slug]);

//   if (!slug) {
//     return (
//       <div style={pageWrapper}>
//         <div>No slug in URL</div>
//       </div>
//     );
//   }

//   if (loading) return <div style={pageWrapper}>Loading...</div>;
//   if (!theme) return <div style={pageWrapper}>Theme not found</div>;

//   // --------------------- Theme values ---------------------
//   const brandName = theme.brand || "BSA";
//   const cycleName = theme.cycleName || "";
//   const modelNo = theme.modelNo || theme.modelId || "";

//   const parts = theme.assets?.parts || [];
//   const framePart = parts.find((p) => p.partCode === "F01") || {};
//   const frameColors = framePart.colors || [];
//   const activeFrameColor =
//     frameColors[frameColorIndex] || frameColors[0] || {};

//   const stickers = activeFrameColor.stickers || {};

//   const baseBikeImage =
//     mode === "sporty"
//       ? stickers.sportyFrameComponent ||
//         stickers.sportyImage ||
//         activeFrameColor.imageUrl
//       : stickers.funFrameComponent ||
//         stickers.funImage ||
//         activeFrameColor.imageUrl;

//   const carBase = stickers.carBase;
//   const carPaint = stickers.carPaint;
//   const carDecal = stickers.carDecal;
//   const primarySticker = stickers.primaryColour;
//   const secondarySticker = stickers.secondaryColour;
//   const logo = stickers.logo;

//   const activeHighlight =
//     themeVariant === "primary"
//       ? primarySticker || secondarySticker
//       : secondarySticker || primarySticker;

//   // --------------------- Canvas Download (no html2canvas) ---------------------

//   const loadImage = (src) =>
//     new Promise((resolve, reject) => {
//       if (!src) return resolve(null);
//       const img = new Image();
//       img.crossOrigin = "anonymous";
//       img.onload = () => resolve(img);
//       img.onerror = reject;
//       img.src = src;
//     });

//   const handleDownload = async () => {
//     try {
//       if (!previewRef.current || !baseBikeImage) return;

//       // Ensure Tigershark font is loaded
//       if (document.fonts?.ready) {
//         try {
//           await document.fonts.ready;
//         } catch (e) {}
//       }

//       // Load all image layers
//       const [baseImgEl, carBaseImg, carPaintImg, carDecalImg, highlightImg, logoImg] =
//         await Promise.all([
//           loadImage(baseBikeImage),
//           loadImage(carBase),
//           loadImage(carPaint),
//           loadImage(carDecal),
//           loadImage(activeHighlight),
//           loadImage(logo),
//         ]);

//       if (!baseImgEl) return;

//       const canvas = document.createElement("canvas");
//       const ctx = canvas.getContext("2d");

//       // Use the original base image size for high quality
//       canvas.width = baseImgEl.naturalWidth || baseImgEl.width;
//       canvas.height = baseImgEl.naturalHeight || baseImgEl.height;

//       // Draw all image layers in order
//       ctx.drawImage(baseImgEl, 0, 0, canvas.width, canvas.height);
//       if (carBaseImg) ctx.drawImage(carBaseImg, 0, 0, canvas.width, canvas.height);
//       if (carPaintImg) ctx.drawImage(carPaintImg, 0, 0, canvas.width, canvas.height);
//       if (carDecalImg) ctx.drawImage(carDecalImg, 0, 0, canvas.width, canvas.height);
//       if (highlightImg) ctx.drawImage(highlightImg, 0, 0, canvas.width, canvas.height);
//       if (logoImg) ctx.drawImage(logoImg, 0, 0, canvas.width, canvas.height);

//       // Now draw NAME and TAGLINE based on actual DOM positions
//       const previewRect = previewRef.current.getBoundingClientRect();

//       const drawTextFromDom = (elRef, text, angleDeg) => {
//         if (!elRef.current || !text) return;

//         const rect = elRef.current.getBoundingClientRect();
//         const centerX = rect.left - previewRect.left + rect.width / 2;
//         const centerY = rect.top - previewRect.top + rect.height / 2;

//         // Map DOM coordinates -> canvas coordinates
//         const scaleX = canvas.width / previewRect.width;
//         const scaleY = canvas.height / previewRect.height;
//         const x = centerX * scaleX;
//         const y = centerY * scaleY;

//         // Scale font size
//         const computed = window.getComputedStyle(elRef.current);
//         const fontSizePx = parseFloat(computed.fontSize || "14");
//         const fontSizeCanvas = fontSizePx * scaleX;

//         ctx.save();
//         ctx.translate(x, y);
//         ctx.rotate((angleDeg * Math.PI) / 180);
//         ctx.textAlign = "center";
//         ctx.textBaseline = "middle";

//         // Tigershark font
//         ctx.font = `${fontSizeCanvas}px "Tigershark Bold Italic", sans-serif`;

//         // Stroke + Fill to mimic textShadow ⬇
//         ctx.lineWidth = fontSizeCanvas * 0.12; // adjust if needed
//         ctx.strokeStyle = "rgba(0,0,0,1)";
//         ctx.fillStyle = "#ffffff";
//         ctx.strokeText(text, 0, 0);
//         ctx.fillText(text, 0, 0);

//         ctx.restore();
//       };

//       // Draw them with the same angles you use in CSS
//       drawTextFromDom(nameRef, name, -22);
//       drawTextFromDom(taglineRef, tagline, 48.8);

//       const url = canvas.toDataURL("image/png");
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = "custom-cycle.png";
//       a.click();
//     } catch (e) {
//       console.error(e);
//       alert("Download failed");
//     }
//   };

//   // --------------------- Share (link only) ---------------------
//   const handleShare = async () => {
//     const shareUrl = window.location.href;

//     if (typeof navigator === "undefined" || !navigator.share) {
//       try {
//         await navigator.clipboard?.writeText(shareUrl);
//         alert("Share is not supported here. Link copied to clipboard 👍");
//       } catch {
//         alert(
//           "Share is not supported on this browser. Please copy the URL manually."
//         );
//       }
//       return;
//     }

//     try {
//       await navigator.share({
//         title: "My Custom Cycle",
//         text: "Check out my customized bike!",
//         url: shareUrl,
//       });
//     } catch (err) {
//       if (err.name !== "AbortError") {
//         console.error("Share error:", err);
//         alert("Unable to open share options on this browser.");
//       }
//     }
//   };

//   // --------------------- CREATE + NAVIGATE (Method B) ---------------------
//   const handleCustomize = async () => {
//     try {
//       setSaving(true);

//       const payload = {
//         brand: brandName,
//         themeId: theme.themeId,
//         themeSlug: theme.themeSlug,
//         themeName: theme.themeName,
//         cycleId: theme.cycleId,
//         modelId: theme.modelId,
//         cycleName,
//         modelNo,

//         userName: name,
//         tagline,
//         bikeSize,

//         mode,
//         themeVariant,

//         frameColorIndex,
//         frameColor: activeFrameColor,

//         images: {
//           baseBikeImage,
//           carBase,
//           carPaint,
//           carDecal,
//           primaryColour: primarySticker,
//           secondaryColour: secondarySticker,
//           logo,
//         },

//         stickersRaw: stickers,
//       };

//       const res = await fetch(CUSTOM_API, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) throw new Error("Failed to save customization");

//       const saved = await res.json();
//       const customizationId = saved._id;

//       const target =
//         mode === "sporty"
//           ? `/kids/${slug}/customize/sporty/${customizationId}`
//           : `/kids/${slug}/customize/fun/${customizationId}`;

//       navigate(target, {
//         state: {
//           customizationId,
//         },
//       });
//     } catch (err) {
//       console.error(err);
//       alert("Error saving customization");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // --------------------- UI ---------------------
//   return (
//     <div style={pageWrapper}>
//       <style>
//         {`
//         @font-face {
//           font-family: 'Tigershark Bold Italic';
//           src: url('/fonts/tigersharkboldital.ttf') format('truetype');
//           font-weight: normal;
//           font-style: normal;
//         }
//       `}
//       </style>

//       {/* LEFT PREVIEW */}
//       <div style={leftPanel}>
//         <div style={iconBar}>
//           <button style={iconButton} onClick={handleDownload} title="Download">
//             ⬇
//           </button>
//           <button style={iconButton} onClick={handleShare} title="Share">
//             ✉
//           </button>
//         </div>

//         <div ref={previewRef} style={cycleWrapper}>
//           {baseBikeImage && (
//             <img
//               ref={baseImgRef}
//               src={baseBikeImage}
//               style={baseImg}
//               alt="Cycle base"
//               crossOrigin="anonymous"
//             />
//           )}

//           {carBase && (
//             <img
//               src={carBase}
//               style={overlayImg}
//               alt="Car base"
//               crossOrigin="anonymous"
//             />
//           )}
//           {carPaint && (
//             <img
//               src={carPaint}
//               style={overlayImg}
//               alt="Car paint"
//               crossOrigin="anonymous"
//             />
//           )}
//           {carDecal && (
//             <img
//               src={carDecal}
//               style={overlayImg}
//               alt="Car decal"
//               crossOrigin="anonymous"
//             />
//           )}
//           {activeHighlight && (
//             <img
//               src={activeHighlight}
//               style={overlayImg}
//               alt="Theme highlight"
//               crossOrigin="anonymous"
//             />
//           )}
//           {logo && (
//             <img
//               src={logo}
//               style={overlayImg}
//               alt="Logo"
//               crossOrigin="anonymous"
//             />
//           )}

//           {/* DOM text, exactly as you see in browser */}
//           <div ref={nameRef} style={nameStyle}>
//             {name}
//           </div>
//           <div ref={taglineRef} style={taglineStyle}>
//             {tagline}
//           </div>
//         </div>
//       </div>

//       {/* RIGHT PANEL */}
//       <div style={rightPanel}>
//         <div style={rightCard}>
//           <h2 style={{ margin: 0 }}>{brandName}</h2>
//           <div style={{ fontSize: "12px", color: "#777" }}>
//             {theme.themeName}
//             {cycleName ? ` • ${cycleName}` : ""}
//             {modelNo ? ` • ${modelNo}` : ""}
//           </div>

//           <div>
//             <span
//               style={{
//                 fontSize: "12px",
//                 fontWeight: 600,
//                 color: "#4CAF50",
//               }}
//             >
//               Rider name (Max 8 char) & Tagline (Max 15 Char)
//             </span>
//             <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
//               <input
//                 style={input}
//                 value={name}
//                 maxLength={8}
//                 onChange={(e) => setName(e.target.value.toUpperCase())}
//                 placeholder="Name"
//               />
//               <input
//                 style={input}
//                 value={tagline}
//                 maxLength={15}
//                 onChange={(e) => setTagline(e.target.value.toUpperCase())}
//                 placeholder="Tagline"
//               />
//             </div>
//           </div>

//           <div>
//             <span style={label}>Bike size</span>
//             <div style={{ display: "flex", gap: "8px" }}>
//               {["20T", "24T", "26T"].map((sz) => (
//                 <button
//                   key={sz}
//                   style={sizePill(sz === bikeSize)}
//                   onClick={() => setBikeSize(sz)}
//                 >
//                   {sz}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div>
//             <span style={label}>Bike preference</span>
//             <div style={{ display: "flex", gap: "8px" }}>
//               <button
//                 style={pillButton(mode === "sporty")}
//                 onClick={() => setMode("sporty")}
//               >
//                 Sporty
//               </button>
//               <button
//                 style={pillButton(mode === "fun")}
//                 onClick={() => setMode("fun")}
//               >
//                 Fun
//               </button>
//             </div>
//           </div>

//           <div>
//             <span style={label}>Frame colour</span>
//             <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
//               {frameColors.map((c, idx) => (
//                 <div
//                   key={c.fileName || idx}
//                   style={colorDot(c.colorCode, idx === frameColorIndex)}
//                   title={c.colorName}
//                   onClick={() => setFrameColorIndex(idx)}
//                 />
//               ))}
//             </div>
//           </div>

//           <div>
//             <span style={label}>Sticker theme</span>
//             <div style={{ display: "flex", gap: "8px" }}>
//               <button
//                 style={pillButton(themeVariant === "primary")}
//                 onClick={() => setThemeVariant("primary")}
//               >
//                 Primary
//               </button>
//               <button
//                 style={pillButton(themeVariant === "secondary")}
//                 onClick={() => setThemeVariant("secondary")}
//               >
//                 Secondary
//               </button>
//             </div>
//           </div>

//           <button
//             style={primaryButton}
//             onClick={handleCustomize}
//             disabled={saving}
//           >
//             {saving ? "SAVING..." : "CUSTOMIZE"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Customization;


// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";

// const THEME_API_BASE = "http://localhost:5000/api/theme-config/slug";
// const CUSTOM_API = "http://localhost:5000/api/customizations";

// function Customization() {
//   const { slug } = useParams(); // /kids/:slug  -> car-decal
//   const navigate = useNavigate();
//   const previewRef = useRef(null);
//   const baseImgRef = useRef(null);
//   const nameRef = useRef(null);
//   const taglineRef = useRef(null);

//   const [theme, setTheme] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   // User selections
//   const [name, setName] = useState("");
//   const [tagline, setTagline] = useState("");
//   const [bikeSize, setBikeSize] = useState("24T");
//   const [mode, setMode] = useState("sporty"); // sporty / fun
//   const [frameColorIndex, setFrameColorIndex] = useState(0);
//   const [themeVariant, setThemeVariant] = useState("primary"); // primary / secondary

//   // --------------------- Styles ---------------------
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
//     boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
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
//     boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
//     padding: "16px 18px",
//     display: "flex",
//     flexDirection: "column",
//     gap: "14px",
//   };

//   const cycleWrapper = {
//     position: "relative",
//     width: "100%",
//     maxWidth: "1024px",
//     margin: "0 auto",
//   };

//   const baseImg = { width: "100%", display: "block" };

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
//     textShadow: "0 0 3px rgba(0,0,0,0.9)",
//     pointerEvents: "none",
//   };

//   // Keep the geometry you want in the browser
//   const nameStyle = {
//     ...baseText,
//     left: "57.4%",
//     top: "42.27%",
//     transform: "translate(-50%, -50%) rotate(-22deg)",
//     fontSize: "15px",
//   };

//   const taglineStyle = {
//     ...baseText,
//     left: "33.73%",
//     top: "50.26%",
//     transform: "translate(-50%, -50%) rotate(48.8deg)",
//     fontSize: "8px",
//   };

//   const label = { fontSize: "13px", color: "#777", marginBottom: "4px" };

//   const input = {
//     padding: "8px 10px",
//     background: "#fafafa",
//     color: "#333",
//     border: "1px solid #ddd",
//     borderRadius: "6px",
//     width: "100%",
//     fontSize: "13px",
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

//   const sizePill = (active) => ({
//     padding: "6px 12px",
//     borderRadius: "999px",
//     border: active ? "1px solid #333" : "1px solid #ccc",
//     background: active ? "#333" : "#f7f7f7",
//     color: active ? "#fff" : "#333",
//     cursor: "pointer",
//     fontSize: "13px",
//     fontWeight: 500,
//   });

//   const colorDot = (hex, selected) => ({
//     width: "22px",
//     height: "22px",
//     borderRadius: "50%",
//     background: hex || "#ffffff",
//     border: selected ? "2px solid #000" : "1px solid #bbb",
//     cursor: "pointer",
//     boxShadow: selected ? "0 0 4px rgba(0,0,0,0.8)" : "none",
//   });

//   const primaryButton = {
//     width: "100%",
//     padding: "12px",
//     borderRadius: "8px",
//     border: "none",
//     background: "#000",
//     color: "#fff",
//     fontWeight: 600,
//     cursor: "pointer",
//     fontSize: "14px",
//     letterSpacing: "0.05em",
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
//     border: "1px solid rgba(0,0,0,0.2)",
//     background: "rgba(255,255,255,0.9)",
//     color: "#333",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
//   };

//   // --------------------- Fetch theme data ---------------------
//   useEffect(() => {
//     const fetchTheme = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`${THEME_API_BASE}/${slug}`);
//         const data = await res.json();
//         setTheme(data);

//         const framePart = data.assets?.parts?.find(
//           (p) => p.partCode === "F01"
//         );
//         if (framePart?.colors?.length) {
//           const idx = framePart.colors.findIndex(
//             (c) => c.colorName?.toLowerCase() === "black"
//           );
//           setFrameColorIndex(idx >= 0 ? idx : 0);
//         }
//       } catch (err) {
//         console.error("Failed to load theme", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (slug) fetchTheme();
//   }, [slug]);

//   if (!slug) {
//     return (
//       <div style={pageWrapper}>
//         <div>No slug in URL</div>
//       </div>
//     );
//   }

//   if (loading) return <div style={pageWrapper}>Loading...</div>;
//   if (!theme) return <div style={pageWrapper}>Theme not found</div>;

//   // --------------------- Theme values ---------------------
//   const brandName = theme.brand || "BSA";
//   const cycleName = theme.cycleName || "";
//   const modelNo = theme.modelNo || theme.modelId || "";

//   const parts = theme.assets?.parts || [];
//   const framePart = parts.find((p) => p.partCode === "F01") || {};
//   const frameColors = framePart.colors || [];
//   const activeFrameColor =
//     frameColors[frameColorIndex] || frameColors[0] || {};

//   const stickers = activeFrameColor.stickers || {};

//   const baseBikeImage =
//     mode === "sporty"
//       ? stickers.sportyFrameComponent ||
//         stickers.sportyImage ||
//         activeFrameColor.imageUrl
//       : stickers.funFrameComponent ||
//         stickers.funImage ||
//         activeFrameColor.imageUrl;

//   const carBase = stickers.carBase;
//   const carPaint = stickers.carPaint;
//   const carDecal = stickers.carDecal;
//   const primarySticker = stickers.primaryColour;
//   const secondarySticker = stickers.secondaryColour;
//   const logo = stickers.logo;

//   const activeHighlight =
//     themeVariant === "primary"
//       ? primarySticker || secondarySticker
//       : secondarySticker || primarySticker;

//   // --------------------- Canvas Download (no html2canvas) ---------------------

//   const loadImage = (src) =>
//     new Promise((resolve, reject) => {
//       if (!src) return resolve(null);
//       const img = new Image();
//       img.crossOrigin = "anonymous";
//       img.onload = () => resolve(img);
//       img.onerror = reject;
//       img.src = src;
//     });

//   const handleDownload = async () => {
//     try {
//       if (!previewRef.current || !baseBikeImage) return;

//       // Ensure Tigershark font is loaded
//       if (document.fonts?.ready) {
//         try {
//           await document.fonts.ready;
//         } catch (e) {}
//       }

//       // Load all image layers
//       const [baseImgEl, carBaseImg, carPaintImg, carDecalImg, highlightImg, logoImg] =
//         await Promise.all([
//           loadImage(baseBikeImage),
//           loadImage(carBase),
//           loadImage(carPaint),
//           loadImage(carDecal),
//           loadImage(activeHighlight),
//           loadImage(logo),
//         ]);

//       if (!baseImgEl) return;

//       const canvas = document.createElement("canvas");
//       const ctx = canvas.getContext("2d");

//       // Use the original base image size for high quality
//       canvas.width = baseImgEl.naturalWidth || baseImgEl.width;
//       canvas.height = baseImgEl.naturalHeight || baseImgEl.height;

//       // Draw all image layers in order
//       ctx.drawImage(baseImgEl, 0, 0, canvas.width, canvas.height);
//       if (carBaseImg) ctx.drawImage(carBaseImg, 0, 0, canvas.width, canvas.height);
//       if (carPaintImg) ctx.drawImage(carPaintImg, 0, 0, canvas.width, canvas.height);
//       if (carDecalImg) ctx.drawImage(carDecalImg, 0, 0, canvas.width, canvas.height);
//       if (highlightImg) ctx.drawImage(highlightImg, 0, 0, canvas.width, canvas.height);
//       if (logoImg) ctx.drawImage(logoImg, 0, 0, canvas.width, canvas.height);

//       // Now draw NAME and TAGLINE based on actual DOM positions
//       const previewRect = previewRef.current.getBoundingClientRect();

//       const drawTextFromDom = (elRef, text, angleDeg) => {
//         if (!elRef.current || !text) return;

//         const rect = elRef.current.getBoundingClientRect();
//         const centerX = rect.left - previewRect.left + rect.width / 2;
//         const centerY = rect.top - previewRect.top + rect.height / 2;

//         // Map DOM coordinates -> canvas coordinates
//         const scaleX = canvas.width / previewRect.width;
//         const scaleY = canvas.height / previewRect.height;
//         const x = centerX * scaleX;
//         const y = centerY * scaleY;

//         // Scale font size
//         const computed = window.getComputedStyle(elRef.current);
//         const fontSizePx = parseFloat(computed.fontSize || "14");
//         const fontSizeCanvas = fontSizePx * scaleX;

//         ctx.save();
//         ctx.translate(x, y);
//         ctx.rotate((angleDeg * Math.PI) / 180);
//         ctx.textAlign = "center";
//         ctx.textBaseline = "middle";

//         // Tigershark font
//         ctx.font = `${fontSizeCanvas}px "Tigershark Bold Italic", sans-serif`;

//         // Stroke + Fill to mimic textShadow ⬇
//         ctx.lineWidth = fontSizeCanvas * 0.12; // adjust if needed
//         ctx.strokeStyle = "rgba(0,0,0,1)";
//         ctx.fillStyle = "#ffffff";
//         ctx.strokeText(text, 0, 0);
//         ctx.fillText(text, 0, 0);

//         ctx.restore();
//       };

//       // Draw them with the same angles you use in CSS
//       drawTextFromDom(nameRef, name, -22);
//       drawTextFromDom(taglineRef, tagline, 48.8);

//       const url = canvas.toDataURL("image/png");
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = "custom-cycle.png";
//       a.click();
//     } catch (e) {
//       console.error(e);
//       alert("Download failed");
//     }
//   };

//   // --------------------- Share (link only) ---------------------
//   const handleShare = async () => {
//     const shareUrl = window.location.href;

//     if (typeof navigator === "undefined" || !navigator.share) {
//       try {
//         await navigator.clipboard?.writeText(shareUrl);
//         alert("Share is not supported here. Link copied to clipboard 👍");
//       } catch {
//         alert(
//           "Share is not supported on this browser. Please copy the URL manually."
//         );
//       }
//       return;
//     }

//     try {
//       await navigator.share({
//         title: "My Custom Cycle",
//         text: "Check out my customized bike!",
//         url: shareUrl,
//       });
//     } catch (err) {
//       if (err.name !== "AbortError") {
//         console.error("Share error:", err);
//         alert("Unable to open share options on this browser.");
//       }
//     }
//   };

//   // --------------------- CREATE + NAVIGATE (Method B) ---------------------
//   const handleCustomize = async () => {
//     try {
//       setSaving(true);

//       const payload = {
//         brand: brandName,
//         themeId: theme.themeId,
//         themeSlug: theme.themeSlug,
//         themeName: theme.themeName,
//         cycleId: theme.cycleId,
//         modelId: theme.modelId,
//         cycleName,
//         modelNo,

//         userName: name,
//         tagline,
//         bikeSize,

//         mode,
//         themeVariant,

//         frameColorIndex,
//         frameColor: activeFrameColor,

//         images: {
//           baseBikeImage,
//           carBase,
//           carPaint,
//           carDecal,
//           primaryColour: primarySticker,
//           secondaryColour: secondarySticker,
//           logo,
//         },

//         stickersRaw: stickers,
//       };

//       const res = await fetch(CUSTOM_API, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) throw new Error("Failed to save customization");

//       const saved = await res.json();
//       const customizationId = saved._id;

//       const target =
//         mode === "sporty"
//           ? `/kids/${slug}/customize/sporty/${customizationId}`
//           : `/kids/${slug}/customize/fun/${customizationId}`;

//       navigate(target, {
//         state: {
//           customizationId,
//         },
//       });
//     } catch (err) {
//       console.error(err);
//       alert("Error saving customization");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // --------------------- UI ---------------------
//   return (
//     <div style={pageWrapper}>
//       <style>
//         {`
//         @font-face {
//           font-family: 'Tigershark Bold Italic';
//           src: url('/fonts/tigersharkboldital.ttf') format('truetype');
//           font-weight: normal;
//           font-style: normal;
//         }
//       `}
//       </style>

//       {/* LEFT PREVIEW */}
//       <div style={leftPanel}>
//         <div style={iconBar}>
//           <button style={iconButton} onClick={handleDownload} title="Download">
//             ⬇
//           </button>
//           <button style={iconButton} onClick={handleShare} title="Share">
//             ✉
//           </button>
//         </div>

//         <div ref={previewRef} style={cycleWrapper}>
//           {baseBikeImage && (
//             <img
//               ref={baseImgRef}
//               src={baseBikeImage}
//               style={baseImg}
//               alt="Cycle base"
//               crossOrigin="anonymous"
//             />
//           )}

//           {carBase && (
//             <img
//               src={carBase}
//               style={overlayImg}
//               alt="Car base"
//               crossOrigin="anonymous"
//             />
//           )}
//           {carPaint && (
//             <img
//               src={carPaint}
//               style={overlayImg}
//               alt="Car paint"
//               crossOrigin="anonymous"
//             />
//           )}
//           {carDecal && (
//             <img
//               src={carDecal}
//               style={overlayImg}
//               alt="Car decal"
//               crossOrigin="anonymous"
//             />
//           )}
//           {activeHighlight && (
//             <img
//               src={activeHighlight}
//               style={overlayImg}
//               alt="Theme highlight"
//               crossOrigin="anonymous"
//             />
//           )}
//           {logo && (
//             <img
//               src={logo}
//               style={overlayImg}
//               alt="Logo"
//               crossOrigin="anonymous"
//             />
//           )}

//           {/* DOM text, exactly as you see in browser */}
//           <div ref={nameRef} style={nameStyle}>
//             {name}
//           </div>
//           <div ref={taglineRef} style={taglineStyle}>
//             {tagline}
//           </div>
//         </div>
//       </div>

//       {/* RIGHT PANEL */}
//       <div style={rightPanel}>
//         <div style={rightCard}>
//           <h2 style={{ margin: 0 }}>{brandName}</h2>
//           <div style={{ fontSize: "12px", color: "#777" }}>
//             {theme.themeName}
//             {cycleName ? ` • ${cycleName}` : ""}
//             {modelNo ? ` • ${modelNo}` : ""}
//           </div>

//           <div>
//             <span
//               style={{
//                 fontSize: "12px",
//                 fontWeight: 600,
//                 color: "#4CAF50",
//               }}
//             >
//               Rider name (Max 8 char) & Tagline (Max 15 Char)
//             </span>
//             <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
//               <input
//                 style={input}
//                 value={name}
//                 maxLength={8}
//                 onChange={(e) => setName(e.target.value.toUpperCase())}
//                 placeholder="Name"
//               />
//               <input
//                 style={input}
//                 value={tagline}
//                 maxLength={15}
//                 onChange={(e) => setTagline(e.target.value.toUpperCase())}
//                 placeholder="Tagline"
//               />
//             </div>
//           </div>

//           <div>
//             <span style={label}>Bike size</span>
//             <div style={{ display: "flex", gap: "8px" }}>
//               {["20T", "24T", "26T"].map((sz) => (
//                 <button
//                   key={sz}
//                   style={sizePill(sz === bikeSize)}
//                   onClick={() => setBikeSize(sz)}
//                 >
//                   {sz}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div>
//             <span style={label}>Bike preference</span>
//             <div style={{ display: "flex", gap: "8px" }}>
//               <button
//                 style={pillButton(mode === "sporty")}
//                 onClick={() => setMode("sporty")}
//               >
//                 Sporty
//               </button>
//               <button
//                 style={pillButton(mode === "fun")}
//                 onClick={() => setMode("fun")}
//               >
//                 Fun
//               </button>
//             </div>
//           </div>

//           <div>
//             <span style={label}>Frame colour</span>
//             <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
//               {frameColors.map((c, idx) => (
//                 <div
//                   key={c.fileName || idx}
//                   style={colorDot(c.colorCode, idx === frameColorIndex)}
//                   title={c.colorName}
//                   onClick={() => setFrameColorIndex(idx)}
//                 />
//               ))}
//             </div>
//           </div>

//           <div>
//             <span style={label}>Sticker theme</span>
//             <div style={{ display: "flex", gap: "8px" }}>
//               <button
//                 style={pillButton(themeVariant === "primary")}
//                 onClick={() => setThemeVariant("primary")}
//               >
//                 Primary
//               </button>
//               <button
//                 style={pillButton(themeVariant === "secondary")}
//                 onClick={() => setThemeVariant("secondary")}
//               >
//                 Secondary
//               </button>
//             </div>
//           </div>

//           <button
//             style={primaryButton}
//             onClick={handleCustomize}
//             disabled={saving}
//           >
//             {saving ? "SAVING..." : "CUSTOMIZE"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Customization;

// import React, { useEffect, useRef, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import html2canvas from "html2canvas";

// const THEME_API_BASE = "http://localhost:5000/api/theme-config/slug";
// const CUSTOM_API = "http://localhost:5000/api/customizations";

// function SportyCustomize() {
//   const { slug } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const previewRef = useRef(null);

//   // We expect these from Customization page
//   const fromState = location.state || {};
//   const initialCustomization = fromState.customization || null;
//   const customizationIdFromState =
//     fromState.customizationId || initialCustomization?._id || null;

//   const [custom, setCustom] = useState(initialCustomization);
//   const [customizationId, setCustomizationId] = useState(
//     customizationIdFromState
//   );

//   const [theme, setTheme] = useState(null);
//   const [loading, setLoading] = useState(!initialCustomization);
//   const [saving, setSaving] = useState(false);

//   // --------- User editable fields ----------
//   const [name, setName] = useState(initialCustomization?.userName || "NAMENAME");
//   const [tagline, setTagline] = useState(
//     initialCustomization?.tagline || "TAGLINE HERE"
//   );
//   const [themeVariant, setThemeVariant] = useState(
//     initialCustomization?.themeVariant || "primary"
//   ); // primary / secondary

//   // Part selections (indices)
//   const [frameIdx, setFrameIdx] = useState(
//     initialCustomization?.frameColorIndex || 0
//   );
//   const [gripIdx, setGripIdx] = useState(0);
//   const [mudguardIdx, setMudguardIdx] = useState(0);
//   const [brakeIdx, setBrakeIdx] = useState(0);

//   // Which component panel is open: "frame" | "grip" | "mudguard" | "brake" | null
//   const [openPanel, setOpenPanel] = useState("frame");

//   // Sticker colour hex values (for hue / filter recolour)
//   const [paintHex, setPaintHex] = useState(
//     initialCustomization?.stickerColors?.carPaintHex || "#ffffff"
//   );
//   const [decalHex, setDecalHex] = useState(
//     initialCustomization?.stickerColors?.carDecalHex || "#ffffff"
//   );
//   const [highlightHex, setHighlightHex] = useState(
//     initialCustomization?.stickerColors?.highlightHex || "#ffffff"
//   );

//   // ---------------- Helper: get part by code ----------------
//   const getPartByCode = (code) => {
//     return theme?.assets?.parts?.find((p) => p.partCode === code) || {
//       colors: [],
//     };
//   };

//   // ---------------- Fetch customization from backend if needed -------------
//   useEffect(() => {
//     const fetchCustomization = async () => {
//       if (!customizationId || initialCustomization) return;

//       try {
//         setLoading(true);
//         const res = await fetch(`${CUSTOM_API}/${customizationId}`);
//         if (!res.ok) throw new Error("Failed to fetch customization");
//         const data = await res.json();
//         setCustom(data);

//         setName(data.userName || "NAMENAME");
//         setTagline(data.tagline || "TAGLINE HERE");
//         setThemeVariant(data.themeVariant || "primary");
//         setFrameIdx(data.frameColorIndex || 0);

//         setPaintHex(data.stickerColors?.carPaintHex || "#ffffff");
//         setDecalHex(data.stickerColors?.carDecalHex || "#ffffff");
//         setHighlightHex(data.stickerColors?.highlightHex || "#ffffff");
//       } catch (err) {
//         console.error("Customization load error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCustomization();
//   }, [customizationId, initialCustomization]);

//   // ---------------- Fetch theme-config to get all parts ----------------
//   useEffect(() => {
//     const fetchTheme = async () => {
//       if (!slug) return;
//       try {
//         const res = await fetch(`${THEME_API_BASE}/${slug}`);
//         if (!res.ok) throw new Error("Theme not found");
//         const data = await res.json();
//         setTheme(data);
//       } catch (err) {
//         console.error("Theme load error:", err);
//       }
//     };

//     fetchTheme();
//   }, [slug]);

//   // ---------------- Early guards ----------------
//   if (!custom && loading) {
//     return <div style={pageWrapper}>Loading...</div>;
//   }

//   if (!custom) {
//     return (
//       <div style={pageWrapper}>
//         <div>
//           Missing customization details. Please go back to previous page and
//           click <b>CUSTOMIZE</b> again.
//         </div>
//       </div>
//     );
//   }

//   // ---------------- Extract base data from customization ----------------
//   const {
//     brand,
//     themeName,
//     cycleName,
//     modelNo,
//     images = {},
//     mode = "sporty",
//   } = custom;

//   const baseBikeImage = images.baseBikeImage;
//   const carBase = images.carBase;
//   const carPaint = images.carPaint;
//   const carDecal = images.carDecal;
//   const primarySticker = images.primaryColour;
//   const secondarySticker = images.secondaryColour;
//   const logo = images.logo;

//   const activeHighlightImage =
//     themeVariant === "primary"
//       ? primarySticker || secondarySticker
//       : secondarySticker || primarySticker;

//   // ---------------- Parts from theme-config (frame / grip / mudguard / brake) ----------------
//   const framePart = getPartByCode("F01");
//   const gripPart = getPartByCode("C05");
//   const mudguardPart = getPartByCode("C02");
//   const brakePart = getPartByCode("C06");

//   const frameColor =
//     framePart.colors?.[frameIdx] || framePart.colors?.[0] || null;
//   const gripColor =
//     gripPart.colors?.[gripIdx] || gripPart.colors?.[0] || null;
//   const mudguardColor =
//     mudguardPart.colors?.[mudguardIdx] || mudguardPart.colors?.[0] || null;
//   const brakeColor =
//     brakePart.colors?.[brakeIdx] || brakePart.colors?.[0] || null;

//   const frameOverlay = frameColor?.imageUrl || null;
//   const gripOverlay = gripColor?.imageUrl || null;
//   const mudguardOverlay = mudguardColor?.imageUrl || null;
//   const brakeOverlay = brakeColor?.imageUrl || null;

//   // ---------------- Filters from hex (for live recolour) ----------------
//   const paintFilter = hexToCssFilter(paintHex);
//   const decalFilter = hexToCssFilter(decalHex);
//   const highlightFilter = hexToCssFilter(highlightHex);

//   const paintCmyk = hexToCmyk(paintHex);
//   const decalCmyk = hexToCmyk(decalHex);
//   const highlightCmyk = hexToCmyk(highlightHex);

//   // ---------------- Download / Share ----------------
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
//       const url = canvas.toDataURL("image/png");
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = "custom-cycle-sporty.png";
//       a.click();
//     } catch (err) {
//       console.error(err);
//       alert("Download failed");
//     }
//   };

//   const handleShare = async () => {
//     try {
//       const canvas = await captureCanvas();
//       if (!canvas) return;
//       const url = canvas.toDataURL("image/png");
//       const blob = await (await fetch(url)).blob();
//       const file = new File([blob], "custom-cycle-sporty.png", {
//         type: "image/png",
//       });

//       if (navigator.share && navigator.canShare?.({ files: [file] })) {
//         await navigator.share({
//           files: [file],
//           title: "My Sporty Custom Cycle",
//           text: "Check out my sporty bike!",
//         });
//       } else {
//         alert("Share not supported on this device");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Share failed");
//     }
//   };

//   // ---------------- Save back to backend ----------------
//   const handleSave = async () => {
//     if (!customizationId && !custom._id) {
//       alert("Missing customization id");
//       return;
//     }
//     const id = customizationId || custom._id;

//     const payload = {
//       userName: name,
//       tagline,
//       themeVariant,
//       frameColorIndex: frameIdx,
//       frameColor: frameColor
//         ? {
//           colorName: frameColor.colorName,
//           colorCode: frameColor.colorCode,
//           imageUrl: frameColor.imageUrl,
//           fileName: frameColor.fileName,
//         }
//         : undefined,
//       componentColors: {
//         frame: frameColor,
//         grip: gripColor,
//         mudguard: mudguardColor,
//         brakeLever: brakeColor,
//       },
//       stickerColors: {
//         carPaintHex: paintHex,
//         carDecalHex: decalHex,
//         highlightHex: highlightHex,
//       },
//     };

//     try {
//       setSaving(true);
//       const res = await fetch(`${CUSTOM_API}/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) throw new Error("Failed to update");

//       const updated = await res.json();
//       setCustom(updated);
//       alert("Sporty customization saved");
//     } catch (err) {
//       console.error(err);
//       alert("Error saving sporty customization");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ---------------- UI ----------------
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
//         <div style={iconBar}>
//           <button style={iconButton} onClick={handleDownload} title="Download">
//             ⬇
//           </button>
//           <button style={iconButton} onClick={handleShare} title="Share">
//             ✉
//           </button>
//         </div>

//         <div ref={previewRef} style={cycleWrapper}>
//           {/* Base */}
//           {baseBikeImage && (
//             <img
//               src={baseBikeImage}
//               alt="Sporty base"
//               style={baseImg}
//               crossOrigin="anonymous"
//             />
//           )}

//           {/* Components in order: frame, mudguard, grip, brake */}
//           {frameOverlay && (
//             <img
//               src={frameOverlay}
//               alt="Frame"
//               style={overlayImg}
//               crossOrigin="anonymous"
//             />
//           )}
//           {mudguardOverlay && (
//             <img
//               src={mudguardOverlay}
//               alt="Mudguard"
//               style={overlayImg}
//               crossOrigin="anonymous"
//             />
//           )}
//           {gripOverlay && (
//             <img
//               src={gripOverlay}
//               alt="Grip"
//               style={overlayImg}
//               crossOrigin="anonymous"
//             />
//           )}
//           {brakeOverlay && (
//             <img
//               src={brakeOverlay}
//               alt="Brake lever"
//               style={overlayImg}
//               crossOrigin="anonymous"
//             />
//           )}

//           {/* Stickers in correct stack order */}
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
//               style={{ ...overlayImg, filter: paintFilter }}
//               crossOrigin="anonymous"
//             />
//           )}
//           {carDecal && (
//             <img
//               src={carDecal}
//               alt="Car decal"
//               style={{ ...overlayImg, filter: decalFilter }}
//               crossOrigin="anonymous"
//             />
//           )}
//           {activeHighlightImage && (
//             <img
//               src={activeHighlightImage}
//               alt="Highlight"
//               style={{ ...overlayImg, filter: highlightFilter }}
//               crossOrigin="anonymous"
//             />
//           )}
//           {logo && (
//             <img
//               src={logo}
//               alt="Logo"
//               style={overlayImg}
//               crossOrigin="anonymous"
//             />
//           )}

//           {/* Text overlays */}
//           <div style={nameStyle}>{name}</div>
//           <div style={taglineStyle}>{tagline}</div>
//         </div>
//       </div>

//       {/* RIGHT: Controls */}
//       <div style={rightPanel}>
//         <div style={rightCard}>
//           {/* Header */}
//           <div>
//             <h2 style={{ margin: 0, fontSize: 18 }}>{brand || "BSA"} – Sporty</h2>
//             <div style={{ fontSize: 12, color: "#777" }}>
//               {themeName || "Car Decal"}
//               {cycleName ? ` • ${cycleName}` : ""}
//               {modelNo ? ` • ${modelNo}` : ""}
//             </div>
//           </div>

//           {/* Name & Tagline */}
//           <div>
//             <div
//               style={{
//                 fontSize: 12,
//                 fontWeight: 600,
//                 color: "#4CAF50",
//                 marginBottom: 6,
//               }}
//             >
//               Rider name & Tagline (Max 15 Char)
//             </div>
//             <div style={{ display: "flex", gap: 8 }}>
//               <input
//                 style={input}
//                 value={name}
//                 maxLength={15}
//                 onChange={(e) => setName(e.target.value.toUpperCase())}
//                 placeholder="Name"
//               />
//               <input
//                 style={input}
//                 value={tagline}
//                 maxLength={15}
//                 onChange={(e) => setTagline(e.target.value.toUpperCase())}
//                 placeholder="Tagline"
//               />
//             </div>
//           </div>

//           {/* Sticker theme toggle */}
//           <div>
//             <span style={label}>Sticker theme</span>
//             <div style={{ display: "flex", gap: 8 }}>
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

//           {/* Component accordions */}
//           {renderComponentSection({
//             title: "Frame colour",
//             isOpen: openPanel === "frame",
//             onToggle: () =>
//               setOpenPanel(openPanel === "frame" ? null : "frame"),
//             colors: framePart.colors || [],
//             activeIndex: frameIdx,
//             onSelect: setFrameIdx,
//           })}

//           {renderComponentSection({
//             title: "Grip colour",
//             isOpen: openPanel === "grip",
//             onToggle: () =>
//               setOpenPanel(openPanel === "grip" ? null : "grip"),
//             colors: gripPart.colors || [],
//             activeIndex: gripIdx,
//             onSelect: setGripIdx,
//           })}

//           {renderComponentSection({
//             title: "Mudguard colour",
//             isOpen: openPanel === "mudguard",
//             onToggle: () =>
//               setOpenPanel(openPanel === "mudguard" ? null : "mudguard"),
//             colors: mudguardPart.colors || [],
//             activeIndex: mudguardIdx,
//             onSelect: setMudguardIdx,
//           })}

//           {renderComponentSection({
//             title: "Brake lever colour",
//             isOpen: openPanel === "brake",
//             onToggle: () =>
//               setOpenPanel(openPanel === "brake" ? null : "brake"),
//             colors: brakePart.colors || [],
//             activeIndex: brakeIdx,
//             onSelect: setBrakeIdx,
//           })}

//           {/* Sticker colour pickers */}
//           <div>
//             <div
//               style={{
//                 fontSize: 12,
//                 fontWeight: 600,
//                 marginBottom: 6,
//               }}
//             >
//               Sticker colours (live preview)
//             </div>

//             <StickerColorPicker
//               label="Car paint (Sticker 03)"
//               hex={paintHex}
//               onChange={setPaintHex}
//               cmyk={paintCmyk}
//             />
//             <StickerColorPicker
//               label="Car decal (Sticker 04)"
//               hex={decalHex}
//               onChange={setDecalHex}
//               cmyk={decalCmyk}
//             />
//             <StickerColorPicker
//               label="Primary / Secondary highlight"
//               hex={highlightHex}
//               onChange={setHighlightHex}
//               cmyk={highlightCmyk}
//             />
//           </div>

//           {/* Actions */}
//           <button
//             type="button"
//             style={primaryButton}
//             onClick={handleSave}
//             disabled={saving}
//           >
//             {saving ? "SAVING..." : "SAVE SPORTY CUSTOMIZATION"}
//           </button>
//           <button
//             type="button"
//             style={{ ...primaryButton, background: "#555", marginTop: 6 }}
//             onClick={() => navigate(-1)}
//           >
//             BACK
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ---------------- Small sub-components ---------------- */

// function StickerColorPicker({ label, hex, onChange, cmyk }) {
//   return (
//     <div style={stickerPickerCard}>
//       <div style={{ display: "flex", justifyContent: "space-between" }}>
//         <span style={{ fontSize: 12, fontWeight: 500 }}>{label}</span>
//         <div
//           style={{
//             width: 20,
//             height: 20,
//             borderRadius: 4,
//             border: "1px solid #ddd",
//             background: hex,
//           }}
//         />
//       </div>
//       <div style={{ marginTop: 6, display: "flex", alignItems: "center" }}>
//         <input
//           type="color"
//           value={hex}
//           onChange={(e) => onChange(e.target.value)}
//           style={{
//             width: 40,
//             height: 32,
//             border: "none",
//             background: "transparent",
//             padding: 0,
//             marginRight: 8,
//             cursor: "pointer",
//           }}
//         />
//         <div style={{ fontSize: 11, color: "#555" }}>
//           <div>HEX: {hex.toUpperCase()}</div>
//           <div>
//             CMYK: C {cmyk.c}% • M {cmyk.m}% • Y {cmyk.y}% • K {cmyk.k}%
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function renderComponentSection({
//   title,
//   isOpen,
//   onToggle,
//   colors,
//   activeIndex,
//   onSelect,
// }) {
//   return (
//     <div style={accordionCard}>
//       <div style={accordionHeader} onClick={onToggle}>
//         <span>{title}</span>
//         <span>{isOpen ? "−" : "+"}</span>
//       </div>
//       {isOpen && (
//         <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8 }}>
//           {colors.map((c, idx) => (
//             <div
//               key={c.fileName || idx}
//               style={colorDotStyle(c.colorCode || "#ffffff", idx === activeIndex)}
//               title={c.colorName}
//               onClick={() => onSelect(idx)}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// /* ---------------- Colour helpers ---------------- */

// // Simple hex → HSL based filter approximation
// function hexToCssFilter(hex) {
//   const { h, s, l } = hexToHsl(hex);
//   // base assumption: original sticker is mostly neutral
//   return `saturate(150%) hue-rotate(${h}deg) brightness(${100 + (l - 50) / 2}%)`;
// }

// function hexToHsl(hex) {
//   let r = 0,
//     g = 0,
//     b = 0;
//   const clean = hex.replace("#", "");
//   if (clean.length === 3) {
//     r = parseInt(clean[0] + clean[0], 16);
//     g = parseInt(clean[1] + clean[1], 16);
//     b = parseInt(clean[2] + clean[2], 16);
//   } else if (clean.length === 6) {
//     r = parseInt(clean.substring(0, 2), 16);
//     g = parseInt(clean.substring(2, 4), 16);
//     b = parseInt(clean.substring(4, 6), 16);
//   }

//   r /= 255;
//   g /= 255;
//   b /= 255;

//   const max = Math.max(r, g, b);
//   const min = Math.min(r, g, b);
//   let h = 0,
//     s = 0,
//     l = (max + min) / 2;

//   if (max !== min) {
//     const d = max - min;
//     s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

//     switch (max) {
//       case r:
//         h = (g - b) / d + (g < b ? 6 : 0);
//         break;
//       case g:
//         h = (b - r) / d + 2;
//         break;
//       case b:
//         h = (r - g) / d + 4;
//         break;
//       default:
//         break;
//     }
//     h *= 60;
//   }

//   return { h: Math.round(h), s: s * 100, l: l * 100 };
// }

// // Hex → CMYK (0–100)
// function hexToCmyk(hex) {
//   let r = 0,
//     g = 0,
//     b = 0;
//   const clean = hex.replace("#", "");
//   if (clean.length === 3) {
//     r = parseInt(clean[0] + clean[0], 16);
//     g = parseInt(clean[1] + clean[1], 16);
//     b = parseInt(clean[2] + clean[2], 16);
//   } else if (clean.length === 6) {
//     r = parseInt(clean.substring(0, 2), 16);
//     g = parseInt(clean.substring(2, 4), 16);
//     b = parseInt(clean.substring(4, 6), 16);
//   }

//   const rP = r / 255;
//   const gP = g / 255;
//   const bP = b / 255;

//   const k = 1 - Math.max(rP, gP, bP);
//   if (k === 1) {
//     return { c: 0, m: 0, y: 0, k: 100 };
//   }
//   const c = (1 - rP - k) / (1 - k);
//   const m = (1 - gP - k) / (1 - k);
//   const y = (1 - bP - k) / (1 - k);

//   return {
//     c: Math.round(c * 100),
//     m: Math.round(m * 100),
//     y: Math.round(y * 100),
//     k: Math.round(k * 100),
//   };
// }

// /* ---------------- Styles ---------------- */

// const pageWrapper = {
//   padding: "24px 32px",
//   color: "#333",
//   background: "#f4f4f4",
//   minHeight: "100vh",
//   display: "flex",
//   gap: "24px",
//   boxSizing: "border-box",
// };

// const leftPanel = {
//   flex: 2,
//   position: "relative",
//   background: "#fff",
//   borderRadius: "12px",
//   boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
//   padding: "16px",
// };

// const rightPanel = {
//   flex: 1.2,
//   display: "flex",
// };

// const rightCard = {
//   flex: 1,
//   background: "#fff",
//   borderRadius: "12px",
//   boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
//   padding: "16px 18px",
//   display: "flex",
//   flexDirection: "column",
//   gap: "14px",
// };

// const cycleWrapper = {
//   position: "relative",
//   width: "100%",
//   maxWidth: "1024px",
//   margin: "0 auto",
// };

// const baseImg = { width: "100%", display: "block" };

// const overlayImg = {
//   position: "absolute",
//   inset: 0,
//   width: "100%",
//   height: "100%",
//   objectFit: "contain",
//   pointerEvents: "none",
//   transition: "filter 0.2s ease",
// };

// const baseText = {
//   position: "absolute",
//   color: "#ffffff",
//   fontFamily: "'Tigershark Bold Italic', sans-serif",
//   textTransform: "uppercase",
//   whiteSpace: "nowrap",
//   letterSpacing: "0.08em",
//   textShadow: "0 0 3px rgba(0,0,0,0.9)",
//   pointerEvents: "none",
// };

// const nameStyle = {
//   ...baseText,
//   left: "57.4%",
//   top: "42.27%",
//   transform: "translate(-50%, -50%) rotate(-22deg)",
//   fontSize: "1vw",
// };

// const taglineStyle = {
//   ...baseText,
//   left: "33.73%",
//   top: "50.26%",
//   transform: "translate(-50%, -50%) rotate(48.8deg)",
//   fontSize: "0.8vw",
// };

// const input = {
//   padding: "8px 10px",
//   background: "#fafafa",
//   color: "#333",
//   border: "1px solid #ddd",
//   borderRadius: "6px",
//   width: "100%",
//   boxSizing: "border-box",
//   fontSize: "13px",
// };

// const label = {
//   fontSize: "13px",
//   color: "#777",
//   marginBottom: "4px",
// };

// const pillButton = (active) => ({
//   padding: "6px 14px",
//   borderRadius: "999px",
//   border: active ? "1px solid #4CAF50" : "1px solid #ccc",
//   background: active ? "#8BC34A" : "#ffffff",
//   color: active ? "#fff" : "#333",
//   cursor: "pointer",
//   fontSize: "13px",
//   fontWeight: 500,
// });

// const primaryButton = {
//   width: "100%",
//   padding: "12px",
//   borderRadius: "8px",
//   border: "none",
//   background: "#000",
//   color: "#fff",
//   fontWeight: 600,
//   cursor: "pointer",
//   fontSize: "14px",
//   letterSpacing: "0.05em",
// };

// const iconBar = {
//   position: "absolute",
//   top: "10px",
//   right: "12px",
//   display: "flex",
//   gap: "8px",
//   zIndex: 20,
// };

// const iconButton = {
//   width: "32px",
//   height: "32px",
//   borderRadius: "50%",
//   border: "1px solid rgba(0,0,0,0.2)",
//   background: "rgba(255,255,255,0.9)",
//   color: "#333",
//   fontSize: "16px",
//   cursor: "pointer",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
// };

// const accordionCard = {
//   borderRadius: "8px",
//   border: "1px solid #eee",
//   padding: "8px 10px",
//   background: "#fafafa",
// };

// const accordionHeader = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   fontSize: "13px",
//   fontWeight: 500,
//   cursor: "pointer",
// };

// const colorDotStyle = (hex, selected) => ({
//   width: 22,
//   height: 22,
//   borderRadius: "50%",
//   background: hex || "#ffffff",
//   border: selected ? "2px solid #000" : "1px solid #bbb",
//   cursor: "pointer",
//   boxShadow: selected ? "0 0 4px rgba(0,0,0,0.8)" : "none",
// });

// const stickerPickerCard = {
//   borderRadius: "8px",
//   border: "1px solid #eee",
//   padding: "8px 10px",
//   background: "#fafafa",
//   marginBottom: 8,
// };

// export default SportyCustomize;
