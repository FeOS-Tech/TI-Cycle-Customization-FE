

// import React, { useEffect, useRef, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";

// const THEME_API_BASE = "http://localhost:5000/api/theme-config/slug";
// const CUSTOM_API = "http://localhost:5000/api/customizations";

// // ---------- Font ready cache (only once) ----------
// let fontsReadyPromise = null;
// function waitForFontsOnce() {
//   if (!document.fonts?.ready) return Promise.resolve();
//   if (!fontsReadyPromise) {
//     fontsReadyPromise = document.fonts.ready.catch(() => {});
//   }
//   return fontsReadyPromise;
// }

// function SportyCustomize() {
//   const { slug } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const previewRef = useRef(null);
//   const nameRef = useRef(null);
//   const taglineRef = useRef(null);
//   const imageCacheRef = useRef(new Map()); // cache for images

//   // We expect these from Customization page
//   const fromState = location.state || {};
//   const initialCustomization = fromState.customization || null;
//   const customizationIdFromState =
//     fromState.customizationId || initialCustomization?._id || null;

//   const [custom, setCustom] = useState(initialCustomization);
//   const [customizationId] = useState(customizationIdFromState);

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

//   // ---------- Sticker colours in CMYK (source of truth) ----------
//   // If backend only has HEX, convert once for initial state
//   const initialPaintHex =
//     initialCustomization?.stickerColors?.carPaintHex || "#ffffff";
//   const initialDecalHex =
//     initialCustomization?.stickerColors?.carDecalHex || "#ffffff";
//   const initialHighlightHex =
//     initialCustomization?.stickerColors?.highlightHex || "#ffffff";

//   const [paintCmyk, setPaintCmyk] = useState(hexToCmyk(initialPaintHex));
//   const [decalCmyk, setDecalCmyk] = useState(hexToCmyk(initialDecalHex));
//   const [highlightCmyk, setHighlightCmyk] = useState(
//     hexToCmyk(initialHighlightHex)
//   );

//   // Derived HEX from CMYK (for rendering & saving)
//   const paintHex = cmykToHex(paintCmyk.c, paintCmyk.m, paintCmyk.y, paintCmyk.k);
//   const decalHex = cmykToHex(decalCmyk.c, decalCmyk.m, decalCmyk.y, decalCmyk.k);
//   const highlightHex = cmykToHex(
//     highlightCmyk.c,
//     highlightCmyk.m,
//     highlightCmyk.y,
//     highlightCmyk.k
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

//         const pHex = data.stickerColors?.carPaintHex || "#ffffff";
//         const dHex = data.stickerColors?.carDecalHex || "#ffffff";
//         const hHex = data.stickerColors?.highlightHex || "#ffffff";

//         setPaintCmyk(hexToCmyk(pHex));
//         setDecalCmyk(hexToCmyk(dHex));
//         setHighlightCmyk(hexToCmyk(hHex));
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

//   // ---------------- Canvas helpers (cached images) ----------------
//   const loadImage = (src) =>
//     new Promise((resolve) => {
//       if (!src) return resolve(null);

//       const cache = imageCacheRef.current;
//       if (cache.has(src)) {
//         return resolve(cache.get(src));
//       }

//       const img = new Image();
//       img.crossOrigin = "anonymous";
//       img.onload = () => {
//         cache.set(src, img);
//         resolve(img);
//       };
//       img.onerror = (err) => {
//         console.error("Image load failed:", src, err);
//         resolve(null); // fail-soft
//       };
//       img.src = src;
//     });

//   const canvasToBlob = (canvas) =>
//     new Promise((resolve) => {
//       canvas.toBlob((blob) => resolve(blob), "image/png");
//     });

//   const buildCanvasFromState = async () => {
//     if (!previewRef.current || !baseBikeImage) return null;

//     await waitForFontsOnce();

//     const [
//       baseImgEl,
//       frameImg,
//       mudguardImg,
//       gripImg,
//       brakeImg,
//       carBaseImg,
//       carPaintImg,
//       carDecalImg,
//       highlightImg,
//       logoImg,
//     ] = await Promise.all([
//       loadImage(baseBikeImage),
//       loadImage(frameOverlay),
//       loadImage(mudguardOverlay),
//       loadImage(gripOverlay),
//       loadImage(brakeOverlay),
//       loadImage(carBase),
//       loadImage(carPaint),
//       loadImage(carDecal),
//       loadImage(activeHighlightImage),
//       loadImage(logo),
//     ]);

//     if (!baseImgEl) {
//       console.error("Base image not available for download");
//       return null;
//     }

//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");

//     const nativeW = baseImgEl.naturalWidth || baseImgEl.width;
//     const nativeH = baseImgEl.naturalHeight || baseImgEl.height;

//     const SCALE = 1;
//     canvas.width = nativeW * SCALE;
//     canvas.height = nativeH * SCALE;

//     // Base + component overlays (order same as UI)
//     ctx.filter = "none";
//     ctx.drawImage(baseImgEl, 0, 0, canvas.width, canvas.height);

//     if (frameImg) ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
//     if (mudguardImg)
//       ctx.drawImage(mudguardImg, 0, 0, canvas.width, canvas.height);
//     if (gripImg) ctx.drawImage(gripImg, 0, 0, canvas.width, canvas.height);
//     if (brakeImg) ctx.drawImage(brakeImg, 0, 0, canvas.width, canvas.height);

//     // Stickers (tinted by CMYK→HEX)
//     if (carBaseImg)
//       ctx.drawImage(carBaseImg, 0, 0, canvas.width, canvas.height);

//     if (carPaintImg) {
//       drawTintedImage(ctx, carPaintImg, paintHex, canvas.width, canvas.height);
//     }

//     if (carDecalImg) {
//       drawTintedImage(ctx, carDecalImg, decalHex, canvas.width, canvas.height);
//     }

//     if (highlightImg) {
//       drawTintedImage(
//         ctx,
//         highlightImg,
//         highlightHex,
//         canvas.width,
//         canvas.height
//       );
//     }

//     if (logoImg) {
//       ctx.drawImage(logoImg, 0, 0, canvas.width, canvas.height);
//     }

//     // ---- Text from DOM (same placement as browser) ----
//     const previewRect = previewRef.current.getBoundingClientRect();

//     const drawTextFromDom = (elRef, text, angleDeg) => {
//       if (!elRef.current || !text) return;

//       const rect = elRef.current.getBoundingClientRect();
//       const centerX = rect.left - previewRect.left + rect.width / 2;
//       const centerY = rect.top - previewRect.top + rect.height / 2;

//       const scaleX = canvas.width / previewRect.width;
//       const scaleY = canvas.height / previewRect.height;
//       const x = centerX * scaleX;
//       const y = centerY * scaleY;

//       const computed = window.getComputedStyle(elRef.current);
//       const fontSizePx = parseFloat(computed.fontSize || "14");
//       const fontSizeCanvas = fontSizePx * scaleX;

//       ctx.save();
//       ctx.translate(x, y);
//       ctx.rotate((angleDeg * Math.PI) / 180);
//       ctx.textAlign = "center";
//       ctx.textBaseline = "middle";

//       ctx.font = `${fontSizeCanvas}px "Tigershark Bold Italic", sans-serif`;
//       ctx.lineWidth = fontSizeCanvas * 0.12;
//       ctx.strokeStyle = "rgba(0,0,0,1)";
//       ctx.fillStyle = "#ffffff";
//       ctx.strokeText(text, 0, 0);
//       ctx.fillText(text, 0, 0);
//       ctx.restore();
//     };

//     drawTextFromDom(nameRef, name, -22);
//     drawTextFromDom(taglineRef, tagline, 48.8);

//     return canvas;
//   };

//   const handleDownload = async () => {
//     try {
//       const canvas = await buildCanvasFromState();
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
//       const canvas = await buildCanvasFromState();
//       if (!canvas) return;
//       const blob = await canvasToBlob(canvas);
//       if (!blob) return;

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
//             colorName: frameColor.colorName,
//             colorCode: frameColor.colorCode,
//             imageUrl: frameColor.imageUrl,
//             fileName: frameColor.fileName,
//           }
//         : undefined,
//       componentColors: {
//         frame: frameColor,
//         grip: gripColor,
//         mudguard: mudguardColor,
//         brakeLever: brakeColor,
//       },
//       // Store HEX (for front-end) and you can also store CMYK separately if backend updated
//       stickerColors: {
//         carPaintHex: paintHex,
//         carDecalHex: decalHex,
//         highlightHex: highlightHex,
//         // optional: CMYK breakdown if you change backend schema:
//         // carPaintCmyk: paintCmyk,
//         // carDecalCmyk: decalCmyk,
//         // highlightCmyk: highlightCmyk,
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

//           {/* Masked paint in CMYK→HEX */}
//           {carPaint && (
//             <div
//               style={{
//                 ...overlayImg,
//                 backgroundColor: paintHex,
//                 WebkitMaskImage: `url(${carPaint})`,
//                 maskImage: `url(${carPaint})`,
//                 WebkitMaskRepeat: "no-repeat",
//                 maskRepeat: "no-repeat",
//                 WebkitMaskSize: "contain",
//                 maskSize: "contain",
//                 WebkitMaskPosition: "center",
//                 maskPosition: "center",
//               }}
//             />
//           )}

//           {/* Masked decal */}
//           {carDecal && (
//             <div
//               style={{
//                 ...overlayImg,
//                 backgroundColor: decalHex,
//                 WebkitMaskImage: `url(${carDecal})`,
//                 maskImage: `url(${carDecal})`,
//                 WebkitMaskRepeat: "no-repeat",
//                 maskRepeat: "no-repeat",
//                 WebkitMaskSize: "contain",
//                 maskSize: "contain",
//                 WebkitMaskPosition: "center",
//                 maskPosition: "center",
//               }}
//             />
//           )}

//           {/* Masked highlight */}
//           {activeHighlightImage && (
//             <div
//               style={{
//                 ...overlayImg,
//                 backgroundColor: highlightHex,
//                 WebkitMaskImage: `url(${activeHighlightImage})`,
//                 maskImage: `url(${activeHighlightImage})`,
//                 WebkitMaskRepeat: "no-repeat",
//                 maskRepeat: "no-repeat",
//                 WebkitMaskSize: "contain",
//                 maskSize: "contain",
//                 WebkitMaskPosition: "center",
//                 maskPosition: "center",
//               }}
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
//           <div ref={nameRef} style={nameStyle}>
//             {name}
//           </div>
//           <div ref={taglineRef} style={taglineStyle}>
//             {tagline}
//           </div>
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

//           {/* Sticker colour pickers (CMYK-driven) */}
//           <div>
//             <div
//               style={{
//                 fontSize: 12,
//                 fontWeight: 600,
//                 marginBottom: 6,
//               }}
//             >
//               Sticker colours (CMYK)
//             </div>

//             <StickerColorPicker
//               label="Car paint (Sticker 03)"
//               cmyk={paintCmyk}
//               onChange={setPaintCmyk}
//             />
//             <StickerColorPicker
//               label="Car decal (Sticker 04)"
//               cmyk={decalCmyk}
//               onChange={setDecalCmyk}
//             />
//             <StickerColorPicker
//               label="Primary / Secondary highlight"
//               cmyk={highlightCmyk}
//               onChange={setHighlightCmyk}
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

// function StickerColorPicker({ label, cmyk, onChange }) {
//   const hexPreview = cmykToHex(cmyk.c, cmyk.m, cmyk.y, cmyk.k);

//   const handleFieldChange = (key, value) => {
//     const num = Math.max(0, Math.min(100, Number(value) || 0));
//     onChange({ ...cmyk, [key]: num });
//   };

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
//             background: hexPreview,
//           }}
//         />
//       </div>

//       <div
//         style={{
//           marginTop: 6,
//           display: "grid",
//           gridTemplateColumns: "repeat(4, 1fr)",
//           gap: 6,
//           fontSize: 11,
//           alignItems: "center",
//         }}
//       >
//         {["c", "m", "y", "k"].map((key) => (
//           <div key={key}>
//             <div style={{ textTransform: "uppercase", marginBottom: 2 }}>
//               {key}
//             </div>
//             <input
//               type="number"
//               min={0}
//               max={100}
//               value={cmyk[key]}
//               onChange={(e) => handleFieldChange(key, e.target.value)}
//               style={{
//                 width: "100%",
//                 padding: "2px 4px",
//                 fontSize: 11,
//                 boxSizing: "border-box",
//               }}
//             />
//           </div>
//         ))}
//       </div>

//       <div style={{ marginTop: 4, fontSize: 10, color: "#555" }}>
//         HEX preview: {hexPreview.toUpperCase()}
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

// /* ---------------- Colour + canvas helpers ---------------- */

// // Hex → RGB
// function hexToRgb(hex) {
//   const clean = hex.replace("#", "");
//   let r = 0,
//     g = 0,
//     b = 0;
//   if (clean.length === 3) {
//     r = parseInt(clean[0] + clean[0], 16);
//     g = parseInt(clean[1] + clean[1], 16);
//     b = parseInt(clean[2] + clean[2], 16);
//   } else if (clean.length === 6) {
//     r = parseInt(clean.substring(0, 2), 16);
//     g = parseInt(clean.substring(2, 4), 16);
//     b = parseInt(clean.substring(4, 6), 16);
//   }
//   return { r, g, b };
// }

// // Draw image tinted with a given hex (using luminance and alpha)
// function drawTintedImage(ctx, img, hex, width, height) {
//   const { r: tr, g: tg, b: tb } = hexToRgb(hex || "#ffffff");
//   const off = document.createElement("canvas");
//   off.width = width;
//   off.height = height;
//   const octx = off.getContext("2d");

//   // Draw original sticker
//   octx.drawImage(img, 0, 0, width, height);
//   const imageData = octx.getImageData(0, 0, width, height);
//   const data = imageData.data;

//   for (let i = 0; i < data.length; i += 4) {
//     const r = data[i];
//     const g = data[i + 1];
//     const b = data[i + 2];
//     const a = data[i + 3];

//     if (a === 0) continue; // fully transparent pixel

//     // Use original luminance as shading, but colour from target hex
//     const lum = (r + g + b) / (3 * 255); // 0–1
//     data[i] = tr * lum;
//     data[i + 1] = tg * lum;
//     data[i + 2] = tb * lum;
//     // alpha unchanged
//   }

//   octx.putImageData(imageData, 0, 0);
//   ctx.drawImage(off, 0, 0, width, height);
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

// // CMYK (0–100) → HEX
// function cmykToHex(c, m, y, k) {
//   const cF = (c || 0) / 100;
//   const mF = (m || 0) / 100;
//   const yF = (y || 0) / 100;
//   const kF = (k || 0) / 100;

//   const r = 255 * (1 - cF) * (1 - kF);
//   const g = 255 * (1 - mF) * (1 - kF);
//   const b = 255 * (1 - yF) * (1 - kF);

//   const toHex = (v) => {
//     const h = Math.round(v).toString(16).padStart(2, "0");
//     return h;
//   };

//   return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
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

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const THEME_API_BASE = "http://localhost:5000/api/theme-config/slug";
const CUSTOM_API = "http://localhost:5000/api/customizations";

// ---------- Font ready cache (only once) ----------
let fontsReadyPromise = null;
function waitForFontsOnce() {
  if (!document.fonts?.ready) return Promise.resolve();
  if (!fontsReadyPromise) {
    fontsReadyPromise = document.fonts.ready.catch(() => {});
  }
  return fontsReadyPromise;
}

function SportyCustomize() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const previewRef = useRef(null);
  const nameRef = useRef(null);
  const taglineRef = useRef(null);
  const imageCacheRef = useRef(new Map()); // cache for images

  // We expect these from Customization page
  const fromState = location.state || {};
  const initialCustomization = fromState.customization || null;
  const customizationIdFromState =
    fromState.customizationId || initialCustomization?._id || null;

  const [custom, setCustom] = useState(initialCustomization);
  const [customizationId] = useState(customizationIdFromState);

  const [theme, setTheme] = useState(null);
  const [loading, setLoading] = useState(!initialCustomization);
  const [saving, setSaving] = useState(false);

  // --------- User editable fields ----------
  const [name, setName] = useState(initialCustomization?.userName || "NAMENAME");
  const [tagline, setTagline] = useState(
    initialCustomization?.tagline || "TAGLINE HERE"
  );

  // Part selections (indices)
  const [frameIdx, setFrameIdx] = useState(
    Number.isInteger(initialCustomization?.frameColorIndex)
      ? initialCustomization.frameColorIndex
      : 0
  );
  const [gripIdx, setGripIdx] = useState(
    Number.isInteger(initialCustomization?.gripColorIndex)
      ? initialCustomization.gripColorIndex
      : 0
  );
  const [mudguardIdx, setMudguardIdx] = useState(
    Number.isInteger(initialCustomization?.mudguardColorIndex)
      ? initialCustomization.mudguardColorIndex
      : 0
  );
  const [brakeIdx, setBrakeIdx] = useState(
    Number.isInteger(initialCustomization?.brakeColorIndex)
      ? initialCustomization.brakeColorIndex
      : 0
  );

  // Which component panel is open
  const [openPanel, setOpenPanel] = useState("frame");

  // ✅ RGB picker values (source of truth)
  // IMPORTANT: use "" when not chosen -> no auto-white
  const [paintHex, setPaintHex] = useState(
    initialCustomization?.stickerColors?.carPaintHex || ""
  );
  const [decalHex, setDecalHex] = useState(
    initialCustomization?.stickerColors?.carDecalHex || ""
  );
  const [primaryHex, setPrimaryHex] = useState(
    initialCustomization?.stickerColors?.primaryHex || ""
  );
  const [secondaryHex, setSecondaryHex] = useState(
    initialCustomization?.stickerColors?.secondaryHex || ""
  );

  // ✅ enabled flags: tint ONLY after user picks color
  const [paintEnabled, setPaintEnabled] = useState(
    !!initialCustomization?.stickerColors?.carPaintHex
  );
  const [decalEnabled, setDecalEnabled] = useState(
    !!initialCustomization?.stickerColors?.carDecalHex
  );
  const [primaryEnabled, setPrimaryEnabled] = useState(
    !!initialCustomization?.stickerColors?.primaryHex
  );
  const [secondaryEnabled, setSecondaryEnabled] = useState(
    !!initialCustomization?.stickerColors?.secondaryHex
  );

  // CMYK derived (for saving)
  const paintCmyk = useMemo(() => (paintHex ? hexToCmyk(paintHex) : null), [paintHex]);
  const decalCmyk = useMemo(() => (decalHex ? hexToCmyk(decalHex) : null), [decalHex]);
  const primaryCmyk = useMemo(() => (primaryHex ? hexToCmyk(primaryHex) : null), [primaryHex]);
  const secondaryCmyk = useMemo(() => (secondaryHex ? hexToCmyk(secondaryHex) : null), [secondaryHex]);

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

        setFrameIdx(Number.isInteger(data.frameColorIndex) ? data.frameColorIndex : 0);
        setGripIdx(Number.isInteger(data.gripColorIndex) ? data.gripColorIndex : 0);
        setMudguardIdx(Number.isInteger(data.mudguardColorIndex) ? data.mudguardColorIndex : 0);
        setBrakeIdx(Number.isInteger(data.brakeColorIndex) ? data.brakeColorIndex : 0);

        // restore saved colors if present
        const p = data.stickerColors?.carPaintHex || "";
        const d = data.stickerColors?.carDecalHex || "";
        const pr = data.stickerColors?.primaryHex || "";
        const s = data.stickerColors?.secondaryHex || "";

        setPaintHex(p);
        setDecalHex(d);
        setPrimaryHex(pr);
        setSecondaryHex(s);

        setPaintEnabled(!!p);
        setDecalEnabled(!!d);
        setPrimaryEnabled(!!pr);
        setSecondaryEnabled(!!s);
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

  // ✅ Stickers MUST be locked from DB (stickersRaw preferred)
  const stickers = custom.stickersRaw || custom.images || {};

  const baseBikeImage =
    stickers.selectedBaseImage || custom.images?.baseBikeImage || null;

  const carBase = stickers.carBase || null;
  const carPaintMask = stickers.carPaint || null;
  const carDecalMask = stickers.carDecal || null;
  const primaryMask = stickers.primaryColour || null;
  const secondaryMask = stickers.secondaryColour || null;
  const logo = stickers.logo || null;

  // ---------------- Parts from theme-config (frame / grip / mudguard / brake) ----------------
  const framePart = getPartByCode("F01");
  const gripPart = getPartByCode("C05");
  const mudguardPart = getPartByCode("C02");
  const brakePart = getPartByCode("C06");

  const frameOverlay = framePart.colors?.[frameIdx]?.imageUrl || null;
  const gripOverlay = gripPart.colors?.[gripIdx]?.imageUrl || null;
  const mudguardOverlay = mudguardPart.colors?.[mudguardIdx]?.imageUrl || null;
  const brakeOverlay = brakePart.colors?.[brakeIdx]?.imageUrl || null;

  // ---------------- Canvas helpers (cached images) ----------------
  const loadImage = (src) =>
    new Promise((resolve) => {
      if (!src) return resolve(null);

      const cache = imageCacheRef.current;
      if (cache.has(src)) return resolve(cache.get(src));

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        cache.set(src, img);
        resolve(img);
      };
      img.onerror = (err) => {
        console.error("Image load failed:", src, err);
        resolve(null);
      };
      img.src = src;
    });

  const canvasToBlob = (canvas) =>
    new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/png");
    });

  const buildCanvasFromState = async () => {
    if (!previewRef.current || !baseBikeImage) return null;

    await waitForFontsOnce();

    const [
      baseImgEl,
      frameImg,
      mudguardImg,
      gripImg,
      brakeImg,
      carBaseImg,
      carPaintImg,
      carDecalImg,
      primaryImg,
      secondaryImg,
      logoImg,
    ] = await Promise.all([
      loadImage(baseBikeImage),
      loadImage(frameOverlay),
      loadImage(mudguardOverlay),
      loadImage(gripOverlay),
      loadImage(brakeOverlay),
      loadImage(carBase),
      loadImage(carPaintMask),
      loadImage(carDecalMask),
      loadImage(primaryMask),
      loadImage(secondaryMask),
      loadImage(logo),
    ]);

    if (!baseImgEl) return null;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const w = baseImgEl.naturalWidth || baseImgEl.width;
    const h = baseImgEl.naturalHeight || baseImgEl.height;
    canvas.width = w;
    canvas.height = h;

    // ✅ Correct stack order
    ctx.drawImage(baseImgEl, 0, 0, w, h);

    if (frameImg) ctx.drawImage(frameImg, 0, 0, w, h);
    if (mudguardImg) ctx.drawImage(mudguardImg, 0, 0, w, h);
    if (gripImg) ctx.drawImage(gripImg, 0, 0, w, h);
    if (brakeImg) ctx.drawImage(brakeImg, 0, 0, w, h);

    // Stickers base ALWAYS
    if (carBaseImg) ctx.drawImage(carBaseImg, 0, 0, w, h);

    // ✅ Tint ONLY if enabled, else draw original mask image
    if (carPaintImg) {
      if (paintEnabled && paintHex) drawTintedMask(ctx, carPaintImg, paintHex, w, h);
      else ctx.drawImage(carPaintImg, 0, 0, w, h);
    }

    if (carDecalImg) {
      if (decalEnabled && decalHex) drawTintedMask(ctx, carDecalImg, decalHex, w, h);
      else ctx.drawImage(carDecalImg, 0, 0, w, h);
    }

    // ✅ BOTH primary + secondary always
    if (primaryImg) {
      if (primaryEnabled && primaryHex) drawTintedMask(ctx, primaryImg, primaryHex, w, h);
      else ctx.drawImage(primaryImg, 0, 0, w, h);
    }

    if (secondaryImg) {
      if (secondaryEnabled && secondaryHex) drawTintedMask(ctx, secondaryImg, secondaryHex, w, h);
      else ctx.drawImage(secondaryImg, 0, 0, w, h);
    }

    if (logoImg) ctx.drawImage(logoImg, 0, 0, w, h);

    // ---- Text from DOM ----
    const previewRect = previewRef.current.getBoundingClientRect();

    const drawTextFromDom = (elRef, text, angleDeg) => {
      if (!elRef.current || !text) return;

      const rect = elRef.current.getBoundingClientRect();
      const centerX = rect.left - previewRect.left + rect.width / 2;
      const centerY = rect.top - previewRect.top + rect.height / 2;

      const scaleX = canvas.width / previewRect.width;
      const x = centerX * scaleX;
      const y = centerY * scaleX;

      const computed = window.getComputedStyle(elRef.current);
      const fontSizePx = parseFloat(computed.fontSize || "14");
      const fontSizeCanvas = fontSizePx * scaleX;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((angleDeg * Math.PI) / 180);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.font = `${fontSizeCanvas}px "Tigershark Bold Italic", sans-serif`;
      ctx.lineWidth = fontSizeCanvas * 0.12;
      ctx.strokeStyle = "rgba(0,0,0,1)";
      ctx.fillStyle = "#ffffff";
      ctx.strokeText(text, 0, 0);
      ctx.fillText(text, 0, 0);
      ctx.restore();
    };

    drawTextFromDom(nameRef, name, -22);
    drawTextFromDom(taglineRef, tagline, 48.8);

    return canvas;
  };

  const handleDownload = async () => {
    try {
      const canvas = await buildCanvasFromState();
      if (!canvas) return;
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = "custom-cycle-sporty.png";
      a.click();
    } catch (err) {
      console.error(err);
      alert("Download failed");
    }
  };

  const handleShare = async () => {
    try {
      const canvas = await buildCanvasFromState();
      if (!canvas) return;
      const blob = await canvasToBlob(canvas);
      if (!blob) return;

      const file = new File([blob], "custom-cycle-sporty.png", {
        type: "image/png",
      });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "My Sporty Custom Cycle",
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
    const id = customizationId || custom._id;
    if (!id) return alert("Missing customization id");

    const payload = {
      userName: name,
      tagline,

      frameColorIndex: frameIdx,
      gripColorIndex: gripIdx,
      mudguardColorIndex: mudguardIdx,
      brakeColorIndex: brakeIdx,

      stickerColors: {
        ...(paintEnabled && paintHex
          ? { carPaintHex: paintHex, carPaintCmyk: paintCmyk }
          : {}),
        ...(decalEnabled && decalHex
          ? { carDecalHex: decalHex, carDecalCmyk: decalCmyk }
          : {}),
        ...(primaryEnabled && primaryHex
          ? { primaryHex, primaryCmyk: primaryCmyk }
          : {}),
        ...(secondaryEnabled && secondaryHex
          ? { secondaryHex, secondaryCmyk: secondaryCmyk }
          : {}),
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
      alert("Sporty customization saved");
    } catch (err) {
      console.error(err);
      alert("Error saving sporty customization");
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
          {/* Base */}
          {baseBikeImage && (
            <img
              src={baseBikeImage}
              alt="Sporty base"
              style={baseImg}
              crossOrigin="anonymous"
            />
          )}

          {/* Components in order */}
          {frameOverlay && (
            <img src={frameOverlay} alt="Frame" style={overlayImg} crossOrigin="anonymous" />
          )}
          {mudguardOverlay && (
            <img src={mudguardOverlay} alt="Mudguard" style={overlayImg} crossOrigin="anonymous" />
          )}
          {gripOverlay && (
            <img src={gripOverlay} alt="Grip" style={overlayImg} crossOrigin="anonymous" />
          )}
          {brakeOverlay && (
            <img src={brakeOverlay} alt="Brake lever" style={overlayImg} crossOrigin="anonymous" />
          )}

          {/* Stickers base */}
          {carBase && <img src={carBase} alt="Car base" style={overlayImg} crossOrigin="anonymous" />}

          {/* ✅ Tint ONLY after pick, else keep original */}
          {carPaintMask &&
            (paintEnabled && paintHex ? (
              <TintMaskLayer src={carPaintMask} colorHex={paintHex} />
            ) : (
              <img src={carPaintMask} alt="Car paint raw" style={overlayImg} crossOrigin="anonymous" />
            ))}

          {carDecalMask &&
            (decalEnabled && decalHex ? (
              <TintMaskLayer src={carDecalMask} colorHex={decalHex} />
            ) : (
              <img src={carDecalMask} alt="Car decal raw" style={overlayImg} crossOrigin="anonymous" />
            ))}

          {/* ✅ BOTH always */}
          {primaryMask &&
            (primaryEnabled && primaryHex ? (
              <TintMaskLayer src={primaryMask} colorHex={primaryHex} />
            ) : (
              <img src={primaryMask} alt="Primary raw" style={overlayImg} crossOrigin="anonymous" />
            ))}

          {secondaryMask &&
            (secondaryEnabled && secondaryHex ? (
              <TintMaskLayer src={secondaryMask} colorHex={secondaryHex} />
            ) : (
              <img src={secondaryMask} alt="Secondary raw" style={overlayImg} crossOrigin="anonymous" />
            ))}

          {logo && <img src={logo} alt="Logo" style={overlayImg} crossOrigin="anonymous" />}

          {/* Text overlays */}
          <div ref={nameRef} style={nameStyle}>
            {name}
          </div>
          <div ref={taglineRef} style={taglineStyle}>
            {tagline}
          </div>
        </div>
      </div>

      {/* RIGHT: Controls */}
      <div style={rightPanel}>
        <div style={rightCard}>
          {/* Header */}
          <div>
            <h2 style={{ margin: 0, fontSize: 18 }}>{custom.brand || "BSA"} – Sporty</h2>
            <div style={{ fontSize: 12, color: "#777" }}>{custom.themeName || "Car Decal"}</div>
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

          {/* Component accordions */}
          {renderComponentSection({
            title: "Frame colour",
            isOpen: openPanel === "frame",
            onToggle: () => setOpenPanel(openPanel === "frame" ? null : "frame"),
            colors: framePart.colors || [],
            activeIndex: frameIdx,
            onSelect: setFrameIdx,
          })}

          {renderComponentSection({
            title: "Grip colour",
            isOpen: openPanel === "grip",
            onToggle: () => setOpenPanel(openPanel === "grip" ? null : "grip"),
            colors: gripPart.colors || [],
            activeIndex: gripIdx,
            onSelect: setGripIdx,
          })}

          {renderComponentSection({
            title: "Mudguard colour",
            isOpen: openPanel === "mudguard",
            onToggle: () => setOpenPanel(openPanel === "mudguard" ? null : "mudguard"),
            colors: mudguardPart.colors || [],
            activeIndex: mudguardIdx,
            onSelect: setMudguardIdx,
          })}

          {renderComponentSection({
            title: "Brake lever colour",
            isOpen: openPanel === "brake",
            onToggle: () => setOpenPanel(openPanel === "brake" ? null : "brake"),
            colors: brakePart.colors || [],
            activeIndex: brakeIdx,
            onSelect: setBrakeIdx,
          })}

          {/* Sticker pickers (RGB UI -> save CMYK too) */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
              Sticker colours (RGB picker • saved as CMYK too)
            </div>

            <StickerRgbPicker
              label="Car paint"
              hex={paintHex || "#000000"}
              onChange={(h) => {
                setPaintHex(h);
                setPaintEnabled(true);
              }}
              cmyk={paintCmyk}
              enabled={paintEnabled}
              onEnable={() => setPaintEnabled(true)}
            />

            <StickerRgbPicker
              label="Car decal"
              hex={decalHex || "#000000"}
              onChange={(h) => {
                setDecalHex(h);
                setDecalEnabled(true);
              }}
              cmyk={decalCmyk}
              enabled={decalEnabled}
              onEnable={() => setDecalEnabled(true)}
            />

            <StickerRgbPicker
              label="Primary colour"
              hex={primaryHex || "#000000"}
              onChange={(h) => {
                setPrimaryHex(h);
                setPrimaryEnabled(true);
              }}
              cmyk={primaryCmyk}
              enabled={primaryEnabled}
              onEnable={() => setPrimaryEnabled(true)}
            />

            <StickerRgbPicker
              label="Secondary colour"
              hex={secondaryHex || "#000000"}
              onChange={(h) => {
                setSecondaryHex(h);
                setSecondaryEnabled(true);
              }}
              cmyk={secondaryCmyk}
              enabled={secondaryEnabled}
              onEnable={() => setSecondaryEnabled(true)}
            />
          </div>

          {/* Actions */}
          <button type="button" style={primaryButton} onClick={handleSave} disabled={saving}>
            {saving ? "SAVING..." : "SAVE SPORTY CUSTOMIZATION"}
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

/* ---------------- Sub-components ---------------- */

function TintMaskLayer({ src, colorHex }) {
  return (
    <div
      style={{
        ...overlayImg,
        backgroundColor: colorHex,
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}

function StickerRgbPicker({ label, hex, onChange, cmyk, enabled, onEnable }) {
  return (
    <div style={stickerPickerCard}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, fontWeight: 500 }}>{label}</span>
        <div style={{ width: 20, height: 20, borderRadius: 4, border: "1px solid #ddd", background: enabled ? hex : "#fff" }} />
      </div>

      <div style={{ marginTop: 6, display: "flex", alignItems: "center" }}>
        <input
          type="color"
          value={hex}
          onChange={(e) => {
            onEnable();
            onChange(e.target.value);
          }}
          style={{
            width: 44,
            height: 34,
            border: "none",
            background: "transparent",
            padding: 0,
            marginRight: 10,
            cursor: "pointer",
          }}
        />
        <div style={{ fontSize: 11, color: "#555" }}>
          <div>HEX: {hex.toUpperCase()}</div>
          {cmyk ? (
            <div>
              CMYK: C {cmyk.c}% • M {cmyk.m}% • Y {cmyk.y}% • K {cmyk.k}%
            </div>
          ) : (
            <div>CMYK: (pick colour)</div>
          )}
        </div>
      </div>

      {!enabled && (
        <div style={{ marginTop: 6, fontSize: 11, color: "#b00" }}>
          * Sticker keeps original until you pick a color
        </div>
      )}
    </div>
  );
}

function renderComponentSection({ title, isOpen, onToggle, colors, activeIndex, onSelect }) {
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

/* ---------------- Canvas tint helpers ---------------- */

function hexToRgb(hex) {
  const clean = (hex || "#ffffff").replace("#", "");
  let r = 255, g = 255, b = 255;
  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16);
    g = parseInt(clean[1] + clean[1], 16);
    b = parseInt(clean[2] + clean[2], 16);
  } else if (clean.length === 6) {
    r = parseInt(clean.substring(0, 2), 16);
    g = parseInt(clean.substring(2, 4), 16);
    b = parseInt(clean.substring(4, 6), 16);
  }
  return { r, g, b };
}

function drawTintedMask(ctx, img, hex, width, height) {
  const { r: tr, g: tg, b: tb } = hexToRgb(hex);

  const off = document.createElement("canvas");
  off.width = width;
  off.height = height;
  const octx = off.getContext("2d");

  octx.clearRect(0, 0, width, height);
  octx.drawImage(img, 0, 0, width, height);

  const imageData = octx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a === 0) continue;
    const lum = (data[i] + data[i + 1] + data[i + 2]) / (3 * 255);
    data[i] = tr * lum;
    data[i + 1] = tg * lum;
    data[i + 2] = tb * lum;
  }

  octx.putImageData(imageData, 0, 0);
  ctx.drawImage(off, 0, 0, width, height);
}

/* ---------------- Colour conversion ---------------- */

function hexToCmyk(hex) {
  if (!hex) return null;
  let r = 0, g = 0, b = 0;
  const clean = (hex || "#ffffff").replace("#", "");
  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16);
    g = parseInt(clean[1] + clean[1], 16);
    b = parseInt(clean[2] + clean[2], 16);
  } else if (clean.length === 6) {
    r = parseInt(clean.substring(0, 2), 16);
    g = parseInt(clean.substring(2, 4), 16);
    b = parseInt(clean.substring(4, 6), 16);
  }

  const rP = r / 255, gP = g / 255, bP = b / 255;
  const k = 1 - Math.max(rP, gP, bP);
  if (k >= 1) return { c: 0, m: 0, y: 0, k: 100 };

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

/* ---------------- Styles (UNCHANGED from your UI) ---------------- */

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

export default SportyCustomize;
