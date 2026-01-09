import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { CUSTOM_API,THEME_API_BASE,BACKEND_URL } from "../config/api";
import AppModal from "../Components/AppModal";
import { toast } from "react-hot-toast";
import Wheel from '@uiw/react-color-wheel'
import LoaderOverlay from "../Components/LoaderOverlay";
// import ShareIcon from '@mui/icons-material/Share';
// import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
// import "@uiw/react-color-wheel/dist/index.css";
import { FaDownload, FaShareAlt } from 'react-icons/fa'


// ---------- Font ready cache (only once) ----------
let fontsReadyPromise = null
function waitForFontsOnce () {
  if (!document.fonts?.ready) return Promise.resolve()
  if (!fontsReadyPromise) {
    fontsReadyPromise = document.fonts.ready.catch(() => {})
  }
  return fontsReadyPromise
}

function SportyCustomize () {
  const { slug } = useParams()
  const { customId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const previewRef = useRef(null)
  const nameRef = useRef(null)
  const taglineRef = useRef(null)
  const imageCacheRef = useRef(new Map()) // cache for images
  const [baseImageLoaded, setBaseImageLoaded] = useState(false)
  // We expect these from Customization page
  const fromState = location.state || {}
  const initialCustomization = fromState.customization || null
  const customizationIdFromState =
    fromState.customizationId || initialCustomization?._id || customId || null

  const [custom, setCustom] = useState(initialCustomization)
  const [customizationId] = useState(customizationIdFromState)

  const [theme, setTheme] = useState(null)
  const [loading, setLoading] = useState(!initialCustomization)
  const [saving, setSaving] = useState(false)

  // --------- User editable fields ----------
  const [name, setName] = useState(initialCustomization?.userName || '')
  const [tagline, setTagline] = useState(
    initialCustomization?.tagline || ''
  )

  // Part selections (indices)
  const [frameIdx, setFrameIdx] = useState(
    Number.isInteger(initialCustomization?.frameColorIndex)
      ? initialCustomization.frameColorIndex
      : null
  )
  const [gripIdx, setGripIdx] = useState(
    Number.isInteger(initialCustomization?.gripColorIndex)
      ? initialCustomization.gripColorIndex
      : null
  )
  const [mudguardIdx, setMudguardIdx] = useState(
    Number.isInteger(initialCustomization?.mudguardColorIndex)
      ? initialCustomization.mudguardColorIndex
      : null
  )
  const [brakeIdx, setBrakeIdx] = useState(
    Number.isInteger(initialCustomization?.brakeColorIndex)
      ? initialCustomization.brakeColorIndex
      : null
  )

  // Which component panel is open
  const [openPanel, setOpenPanel] = useState('frame')

  // ✅ RGB picker values (source of truth)
  // IMPORTANT: use "" when not chosen -> no auto-white
  const [baseHex, setBaseHex] = useState(
    initialCustomization?.stickerColors?.baseHex || ''
  )
  const [paintHex, setPaintHex] = useState(
    initialCustomization?.stickerColors?.carPaintHex || ''
  )
  const [decalHex, setDecalHex] = useState(
    initialCustomization?.stickerColors?.carDecalHex || ''
  )
  const [primaryHex, setPrimaryHex] = useState(
    initialCustomization?.stickerColors?.primaryHex || ''
  )
  const [secondaryHex, setSecondaryHex] = useState(
    initialCustomization?.stickerColors?.secondaryHex || ''
  )

  // ✅ enabled flags: tint ONLY after user picks color
  const [baseEnabled, setBaseEnabled] = useState(
    !!initialCustomization?.stickerColors?.baseHex
  )
  const [paintEnabled, setPaintEnabled] = useState(
    !!initialCustomization?.stickerColors?.carPaintHex
  )
  const [decalEnabled, setDecalEnabled] = useState(
    !!initialCustomization?.stickerColors?.carDecalHex
  )
  const [primaryEnabled, setPrimaryEnabled] = useState(
    !!initialCustomization?.stickerColors?.primaryHex
  )
  const [secondaryEnabled, setSecondaryEnabled] = useState(
    !!initialCustomization?.stickerColors?.secondaryHex
  )

  // CMYK derived (for saving)
  const baseCmyk = useMemo(
    () => (baseHex ? hexToCmyk(baseHex) : null),
    [baseHex]
  )
  const paintCmyk = useMemo(
    () => (paintHex ? hexToCmyk(paintHex) : null),
    [paintHex]
  )
  const decalCmyk = useMemo(
    () => (decalHex ? hexToCmyk(decalHex) : null),
    [decalHex]
  )
  const primaryCmyk = useMemo(
    () => (primaryHex ? hexToCmyk(primaryHex) : null),
    [primaryHex]
  )
  const secondaryCmyk = useMemo(
    () => (secondaryHex ? hexToCmyk(secondaryHex) : null),
    [secondaryHex]
  )

  //to check img is edited
  const [isSaved, setIsSaved] = useState(false); // initially NOT saved
  const [isEditing, setIsEditing] = useState(true); // initially editing
  const [firstRenderAllowed, setFirstRenderAllowed] = useState(false);
  const [secondRenderAllowed, setSecondRenderAllowed] = useState(false);
  const [isPreparingImage, setIsPreparingImage] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({});


  // ---------------- Helper: get part by code ----------------
  const getPartByCode = code => {
    return (
      theme?.assets?.parts?.find(p => p.partCode === code) || {
        colors: []
      }
    )
  }

  // ---------------- Fetch customization from backend if needed -------------
  useEffect(() => {
    const fetchCustomization = async () => {
      if (!customizationId || initialCustomization) return

      try {
        setLoading(true)
        const res = await fetch(`${CUSTOM_API}/${customizationId}`)
        if (!res.ok) throw new Error('Failed to fetch customization')
        const data = await res.json()
        setCustom(data)

        setName(data.userName || '')
        setTagline(data.tagline || '')

        setFrameIdx(
          Number.isInteger(data.frameColorIndex) ? data.frameColorIndex : null
        )
        setGripIdx(
          Number.isInteger(data.gripColorIndex) ? data.gripColorIndex : null
        )
        setMudguardIdx(
          Number.isInteger(data.mudguardColorIndex)
            ? data.mudguardColorIndex
            : null
        )
        setBrakeIdx(
          Number.isInteger(data.brakeColorIndex) ? data.brakeColorIndex : null
        )

        // restore saved colors if present
        const b = data.stickerColors?.baseHex || ''
        const p = data.stickerColors?.paintHex || ''
        const d = data.stickerColors?.decalHex || ''
        const pr = data.stickerColors?.primaryHex || ''
        const s = data.stickerColors?.secondaryHex || ''

        setBaseHex(b)
        setPaintHex(p)
        setDecalHex(d)
        setPrimaryHex(pr)
        setSecondaryHex(s)

        setBaseEnabled(!!b)
        setPaintEnabled(!!p)
        setDecalEnabled(!!d)
        setPrimaryEnabled(!!pr)
        setSecondaryEnabled(!!s)
      } catch (err) {
        console.error('Customization load error:', err)
      } finally {
        setLoading(false)
        setTimeout(() => {
          setFirstRenderAllowed(true);
        }, 3000);
      }
    }

    fetchCustomization()
  }, [customizationId, initialCustomization])

  // ---------------- Fetch theme-config to get all parts ----------------
  useEffect(() => {
    const fetchTheme = async () => {
      if (!slug) return
      try {
        const res = await fetch(`${THEME_API_BASE}/${slug}`)
        if (!res.ok) throw new Error('Theme not found')
        const data = await res.json()
        setTheme(data)
      } catch (err) {
        console.error('Theme load error:', err)
      }
    }

    fetchTheme()
  }, [slug])

  useEffect(() => {  
    setIsEditing(true);
    setIsSaved(false);
  }, [frameIdx, gripIdx, mudguardIdx, brakeIdx, paintHex, decalHex, primaryHex, secondaryHex, baseHex]);

  // ---------------- Early guards ----------------
  if (!custom && loading) {
    return <div style={pageWrapper}>Loading...</div>
  }

  if (!custom) {
    return (
      <div style={pageWrapper}>
        <div>
          Missing customization details. Please go back to previous page and
          click <b>CUSTOMIZE</b> again.
        </div>
      </div>
    )
  }

  // ✅ Stickers MUST be locked from DB (stickersRaw preferred)
  const stickers = custom.stickersRaw || custom.images || {}

  const baseBikeImage =
    stickers.selectedBaseImage || custom.images?.baseBikeImage || null

  const carBase = stickers.carBase || null
  const carPaintMask = stickers.carPaint || null
  const carDecalMask = stickers.carDecal || null
  const primaryMask = stickers.primaryColour || null
  const secondaryMask = stickers.secondaryColour || null
  const logo = stickers.logo || null

  //apply colour in stickers 
  const isBaseStickerColorAllowed =
  stickers?.isBaseStickerColorAllowed ?? false;

  const isPaintStickerColorAllowed =
  stickers?.isPaintStickerColorAllowed ?? false;

  const isDecalStickerColorAllowed =
  stickers?.isDecalStickerColorAllowed ?? false;

  const isPrimaryStickerColorAllowed =
  stickers?.isPrimaryStickerColorAllowed ?? false;

  const isSecondaryStickerColorAllowed =
  stickers?.isSecondaryStickerColorAllowed ?? false;


  // ---------------- Parts from theme-config (frame / grip / mudguard / brake) ----------------
  const framePart = getPartByCode('F01')
  const gripPart = getPartByCode('C05')
  const mudguardPart = getPartByCode('C02')
  const brakePart = getPartByCode('C06')

  // const frameOverlay = framePart.colors?.[frameIdx]?.imageUrl || null
  // const gripOverlay = gripPart.colors?.[gripIdx]?.imageUrl || null
  // const mudguardOverlay = mudguardPart.colors?.[mudguardIdx]?.imageUrl || null
  // const brakeOverlay = brakePart.colors?.[brakeIdx]?.imageUrl || null

  const frameOverlay =
    frameIdx !== null ? framePart.colors?.[frameIdx]?.imageUrl : null

  const gripOverlay =
    gripIdx !== null ? gripPart.colors?.[gripIdx]?.imageUrl : null

  const mudguardOverlay =
    mudguardIdx !== null ? mudguardPart.colors?.[mudguardIdx]?.imageUrl : null

  const brakeOverlay =
    brakeIdx !== null ? brakePart.colors?.[brakeIdx]?.imageUrl : null

  // ---------------- Canvas helpers (cached images) ----------------
  const loadImage = src =>
    new Promise(resolve => {
      if (!src) return resolve(null)

      const cache = imageCacheRef.current
      if (cache.has(src)) return resolve(cache.get(src))

      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        cache.set(src, img)
        resolve(img)
      }
      img.onerror = err => {
        console.error('Image load failed:', src, err)
        resolve(null)
      }
      img.src = src
    })

  const canvasToBlob = canvas =>
    new Promise(resolve => {
      canvas.toBlob(blob => resolve(blob), 'image/png')
    })

  const buildCanvasFromState = async () => {
    if (!previewRef.current || !baseBikeImage) return null

    await waitForFontsOnce()

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
      logoImg
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
      loadImage(logo)
    ])

    if (!baseImgEl) return null

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    // const w = baseImgEl.naturalWidth || baseImgEl.width
    // const h = baseImgEl.naturalHeight || baseImgEl.height
    // canvas.width = w
    // canvas.height = h
    const maxWidth = 1920
    const maxHeight = 1080

    let w = baseImgEl.naturalWidth || baseImgEl.width
    let h = baseImgEl.naturalHeight || baseImgEl.height

    const scale = Math.min(
      maxWidth / w,
      maxHeight / h,
      1 // never upscale
    )

    canvas.width = Math.round(w * scale)
    canvas.height = Math.round(h * scale)

    ctx.scale(scale, scale)


    // ✅ Correct stack order
    ctx.drawImage(baseImgEl, 0, 0, w, h)

    if (frameImg) ctx.drawImage(frameImg, 0, 0, w, h)
    if (mudguardImg) ctx.drawImage(mudguardImg, 0, 0, w, h)
    if (gripImg) ctx.drawImage(gripImg, 0, 0, w, h)
    if (brakeImg) ctx.drawImage(brakeImg, 0, 0, w, h)

    // Stickers base ALWAYS
    // if (carBaseImg) ctx.drawImage(carBaseImg, 0, 0, w, h)

    // ✅ Tint ONLY if enabled, else draw original mask image
    if (carBaseImg) {
      if (baseEnabled && baseHex)
        drawTintedMask(ctx, carBaseImg, baseHex, w, h)
      else ctx.drawImage(carBaseImg, 0, 0, w, h)
    }

    if (carPaintImg) {
      if (paintEnabled && paintHex)
        drawTintedMask(ctx, carPaintImg, paintHex, w, h)
      else ctx.drawImage(carPaintImg, 0, 0, w, h)
    }

    if (carDecalImg) {
      if (decalEnabled && decalHex)
        drawTintedMask(ctx, carDecalImg, decalHex, w, h)
      else ctx.drawImage(carDecalImg, 0, 0, w, h)
    }

    // ✅ BOTH primary + secondary always
    if (primaryImg) {
      if (primaryEnabled && primaryHex)
        drawTintedMask(ctx, primaryImg, primaryHex, w, h)
      else ctx.drawImage(primaryImg, 0, 0, w, h)
    }

    if (secondaryImg) {
      if (secondaryEnabled && secondaryHex)
        drawTintedMask(ctx, secondaryImg, secondaryHex, w, h)
      else ctx.drawImage(secondaryImg, 0, 0, w, h)
    }

    if (logoImg) ctx.drawImage(logoImg, 0, 0, w, h)

    // ---- Text from DOM ----
    const previewRect = previewRef.current.getBoundingClientRect()
    const domToCanvasScale = w / previewRect.width


    // const drawTextFromDom = (elRef, text, angleDeg) => {
    //   if (!elRef.current || !text) return

    //   const rect = elRef.current.getBoundingClientRect()
    //   const centerX = rect.left - previewRect.left + rect.width / 2
    //   const centerY = rect.top - previewRect.top + rect.height / 2

    //   const scaleX = canvas.width / previewRect.width
    //   const x = centerX * scaleX
    //   const y = centerY * scaleX

    //   const computed = window.getComputedStyle(elRef.current)
    //   const fontSizePx = parseFloat(computed.fontSize || '14')
    //   const fontSizeCanvas = fontSizePx * scaleX

    //   ctx.save()
    //   ctx.translate(x, y)
    //   ctx.rotate((angleDeg * Math.PI) / 180)
    //   ctx.textAlign = 'center'
    //   ctx.textBaseline = 'middle'

    //   ctx.font = `${fontSizeCanvas}px "Tigershark Bold Italic", sans-serif`
    //   ctx.lineWidth = fontSizeCanvas * 0.12
    //   ctx.strokeStyle = 'rgba(0,0,0,1)'
    //   ctx.fillStyle = '#ffffff'
    //   ctx.strokeText(text, 0, 0)
    //   ctx.fillText(text, 0, 0)
    //   ctx.restore()
    // }

    const drawTextFromDom = (elRef, text, angleDeg) => {
      if (!elRef.current || !text) return

      const rect = elRef.current.getBoundingClientRect()

      // Center relative to preview
      const centerX =
      rect.left - previewRect.left + rect.width / 2
      const centerY =
      rect.top - previewRect.top + rect.height / 2

  // 🔥 MAP DOM → ORIGINAL CANVAS SPACE
      const x = centerX * domToCanvasScale
      const y = centerY * domToCanvasScale

      const computed = window.getComputedStyle(elRef.current)
      const fontSizePx = parseFloat(computed.fontSize || '14')
      const fontSizeCanvas = fontSizePx * domToCanvasScale

      ctx.save()
      ctx.translate(x, y)
      ctx.rotate((angleDeg * Math.PI) / 180)
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      ctx.font = `${fontSizeCanvas}px "Tigershark Bold Italic", sans-serif`
      ctx.lineWidth = fontSizeCanvas * 0.12
      ctx.strokeStyle = 'rgba(0,0,0,1)'
      ctx.fillStyle = '#ffffff'

      ctx.strokeText(text, 0, 0)
      ctx.fillText(text, 0, 0)
      ctx.restore()
    }


    drawTextFromDom(nameRef, name, -22)
    drawTextFromDom(taglineRef, tagline, 48.8)

    return canvas
  }

  async function generateAndUploadImage({
    customizationId,
    custom,
    buildCanvasFromState,
  }) {
    const id = customizationId || custom?._id;
    if (!id) throw new Error("Customization ID missing");

    // Build canvas
    const canvas = await buildCanvasFromState();
    if (!canvas) throw new Error("Canvas build failed");

    // Canvas → Blob
    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject("Blob creation failed")),
        "image/png"
      );
    });

    // Get presigned URL
    const res = await fetch(
      `${BACKEND_URL}/api/s3/${id}?fileType=image/png`
    );
    if (!res.ok) throw new Error("Failed to get presigned URL");

    const { uploadUrl, fileUrl } = await res.json();
    if (!uploadUrl || !fileUrl) {
      throw new Error("Invalid presigned URL response");
    }

    // Upload to S3
    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      body: blob,
      headers: {
        "Content-Type": "image/png",
      },
    });

    if (!uploadRes.ok) throw new Error("S3 upload failed");

    return fileUrl; // ONLY responsibility of this function
  }

  async function updateCustomizationImage(id, imageUrl) {
    if (!id || !imageUrl) {
      throw new Error("id or imageUrl missing");
    }

    const res = await fetch(
      `${CUSTOM_API}/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image_url: imageUrl,
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`DB update failed: ${err}`);
    }

    return res.json();
  }

  const handleDownload = async () => {
    const id = customizationId || custom._id;
    let imageUrl = custom?.image_url;
    
    try {
      
      if (isEditing && !isSaved) {
        setIsPreparingImage(true);
        // 1️⃣ Generate + upload
        imageUrl = await generateAndUploadImage({
          id,
          custom,
          buildCanvasFromState,
        });
        
        // 2️⃣ Update backend
        await updateCustomizationImage(id, imageUrl);

        setCustom((prev) => ({
          ...prev,
          image_url: imageUrl,
        }));

        setIsSaved(true);
        setIsEditing(false);
        setIsPreparingImage(false);
      }

      setModalConfig({
        title: "Image Ready",
        message: "Your customization image is ready to download.",
        actions: [
          {
            label: "Download",
            className: "bg-green-600 text-white",
            onClick: () => {
              window.open(imageUrl, "_blank", "noopener,noreferrer");
              setModalOpen(false);
            }
          }
        ]
      });

      setModalOpen(true);

      return imageUrl;
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while preparing the image.");
    }
  };

  const showCopyLinkAlert = async (imageUrl) => {
    setModalConfig({
      title: "Share Link",
      message: "Click the button below to copy the link.",
      actions: [
        {
          label: "Copy Link",
          className: "bg-blue-600 text-white",
          onClick: async () => {
            try {
              await navigator.clipboard.writeText(imageUrl);
              toast.success("Copied to clipboard");
              setModalOpen(false);
            } catch (e) {
              toast.error("Failed to copy");
            }
          }
        }
      ]
    });

    setModalOpen(true);

  };

  const handleShare = async () => {
    const id = customizationId || custom._id;

    

    try {
      let imageUrl = custom?.image_url;

      if (isEditing && !isSaved) {
        setIsPreparingImage(true);
        // 1️⃣ Generate + upload image
        const imageUrl = await generateAndUploadImage({
          id,
          custom,
          buildCanvasFromState,
        });

        // 2️⃣ Update backend
        await updateCustomizationImage(id, imageUrl);

        setCustom((prev) => ({
          ...prev,
          image_url: imageUrl,
        }));

        setIsSaved(true);
        setIsEditing(false);
        setIsPreparingImage(false);
      }
      // 3️⃣ Try native share
      if (navigator.share) {
        try {
          await navigator.share({
            title: "My Custom Cycle",
            text: "Check out my customized bike!",
            url: imageUrl,
          });
          return; // ✅ success, stop here
        } catch (err) {
          if (err.name === "AbortError") return; // user cancelled
          console.error("Share error:", err);
        }
      }

      // 4️⃣ Fallback → copy link alert
      await showCopyLinkAlert(imageUrl);

      console.log("Customization image saved:", imageUrl);
    } catch (err) {
      console.error(err);
      toast.error("Saving or sharing failed. Please try again.");
    }
  };

  // ---------------- Save back to backend ----------------
  const handleSave = async () => {
    const id = customizationId || custom._id
    if (!id) return alert('Missing customization id')

    let imageUrl = custom?.image_url;
    
    const payload = {
      userName: name,
      tagline,
      // image_url:imageUrl,
      // frameColorIndex: frameIdx,
      // gripColorIndex: gripIdx,
      // mudguardColorIndex: mudguardIdx,
      // brakeColorIndex: brakeIdx,
      ...(frameIdx !== null && { frameColorIndex: frameIdx }),
      ...(gripIdx !== null && { gripColorIndex: gripIdx }),
      ...(mudguardIdx !== null && { mudguardColorIndex: mudguardIdx }),
      ...(brakeIdx !== null && { brakeColorIndex: brakeIdx }),

      stickerColors: {
        ...(baseEnabled && baseHex
          ? { baseHex: baseHex, baseCmyk: baseCmyk }
          : {}),
        ...(paintEnabled && paintHex
          ? { paintHex: paintHex, paintCmyk: paintCmyk }
          : {}),
        ...(decalEnabled && decalHex
          ? { decalHex: decalHex, decalCmyk: decalCmyk }
          : {}),
        ...(primaryEnabled && primaryHex
          ? { primaryHex, primaryCmyk: primaryCmyk }
          : {}),
        ...(secondaryEnabled && secondaryHex
          ? { secondaryHex, secondaryCmyk: secondaryCmyk }
          : {})
      }
    }

    try {
      setSaving(true)
      const res = await fetch(`${CUSTOM_API}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error('Failed to update')

      const updated = await res.json()
      setCustom(updated)
      toast.success("Saved successfully");
    } catch (err) {
      console.error(err)
      toast.error("Error saving sporty customization.");
    } finally {
      setSaving(false)
    }

    if (isEditing && !isSaved) {
      // toast.success("Generating image...");
      
      setTimeout(async () => {
        try {
          const imageUrl = await generateAndUploadImage({
            id,
            custom,
            buildCanvasFromState,
          });
          
          await updateCustomizationImage(id, imageUrl);
          
          setCustom(prev => ({ ...prev, image_url: imageUrl }));
          setIsSaved(true);
          setIsEditing(false);
          
          // toast.success("Image generated successfully!");
        } catch (err) {
          console.error("Background image generation failed:", err);
          toast.error("Image generation failed, but data was saved");
        }
      }, 100); // Small delay to let UI update
    }
  }

  // ---------------- UI ----------------
  return (
    // <div style={pageWrapper}>
    <div style={pageWrapper} className="sporty-page">

      {(!firstRenderAllowed || isPreparingImage) && (
        <LoaderOverlay />
      )}
      <style>
        {`
          @font-face {
            font-family: 'Tigershark Bold Italic';
            src: url('/fonts/tigersharkboldital.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
          }

          /* ===== DEFAULT: Laptop & above ===== */
          .sporty-page {
            display: flex;
            flex-direction: row;
          }

          /* ===== BELOW LAPTOP (Tablet & Mobile) ===== */
          @media (max-width: 1023px) {
            .sporty-page {
              flex-direction: column;
            }

            // .sporty-left,
            // .sporty-right {
            //   width: 100%;
            // }

            // .sporty-right {
            //   margin-top: 16px;
            // }
            .sporty-left {
              min-height: 30vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }

          .sporty-left > div {
            margin-left: auto;
            margin-right: auto;
          }

          /* Controls stay compact */
          // .sporty-right {
          //   display: flex;
          //   justify-content: center;
          // }

          /* Center the card content */
          // .sporty-right > div {
          //   align-items: center;
          //   text-align: center;
          // }

          /* Inputs & buttons should not stretch weirdly */
          // .sporty-right input,
          // .sporty-right button {
          //   max-width: 320px;
          // }

          /* Wrap groups nicely */
          // .sporty-right div {
          //   justify-content: center;
          // }
        `}
      </style>


      {/* LEFT: Preview */}
      <div style={leftPanel} className="sporty-left">
        <div style={iconBar}>
          <button style={iconButton} onClick={handleDownload} title='Download'>
            <FaDownload size={20} />
          </button>
          <button style={iconButton} onClick={handleShare} title='Share'>
            <FaShareAlt size={20} />
          </button>
        </div>

        <div ref={previewRef} style={cycleWrapper}>
          {/* Base */}
          {baseBikeImage && (
            <img
              src={baseBikeImage}
              alt='Sporty base'
              style={baseImg}
              crossOrigin='anonymous'
              onLoad={() => setBaseImageLoaded(true)}
            />
          )}

          {/* Components in order */}
          {frameOverlay && firstRenderAllowed && (
            <img
              src={frameOverlay}
              alt='Frame'
              style={overlayImg}
              crossOrigin='anonymous'
            />
          )}
          {mudguardOverlay && firstRenderAllowed && (
            <img
              src={mudguardOverlay}
              alt='Mudguard'
              style={overlayImg}
              crossOrigin='anonymous'
            />
          )}
          {gripOverlay && firstRenderAllowed && (
            <img
              src={gripOverlay}
              alt='Grip'
              style={overlayImg}
              crossOrigin='anonymous'
            />
          )}
          {brakeOverlay && firstRenderAllowed && (
            <img
              src={brakeOverlay}
              alt='Brake lever'
              style={overlayImg}
              crossOrigin='anonymous'
            />
          )}

          {/* Stickers base */}
           {carBase && firstRenderAllowed &&
            (baseEnabled && baseHex ? (
              <TintMaskLayer src={carBase} colorHex={baseHex} />
            ) : (
              <img
                src={carBase}
                alt='Car Base'
                style={overlayImg}
                crossOrigin='anonymous'
              />
            ))}

          {/* ✅ Tint ONLY after pick, else keep original */}
          {carPaintMask && firstRenderAllowed &&
            (paintEnabled && paintHex ? (
              <TintMaskLayer src={carPaintMask} colorHex={paintHex} />
            ) : (
              <img
                src={carPaintMask}
                alt='Car paint raw'
                style={overlayImg}
                crossOrigin='anonymous'
              />
            ))}

          {carDecalMask && firstRenderAllowed &&
            (decalEnabled && decalHex ? (
              <TintMaskLayer src={carDecalMask} colorHex={decalHex} />
            ) : (
              <img
                src={carDecalMask}
                alt='Car decal raw'
                style={overlayImg}
                crossOrigin='anonymous'
              />
            ))}

          {/* ✅ BOTH always */}
          {primaryMask && firstRenderAllowed &&
            (primaryEnabled && primaryHex ? (
              <TintMaskLayer src={primaryMask} colorHex={primaryHex} />
            ) : (
              <img
                src={primaryMask}
                alt='Primary raw'
                style={overlayImg}
                crossOrigin='anonymous'
              />
            ))}

          {secondaryMask && firstRenderAllowed &&
            (secondaryEnabled && secondaryHex ? (
              <TintMaskLayer src={secondaryMask} colorHex={secondaryHex} />
            ) : (
              <img
                src={secondaryMask}
                alt='Secondary raw'
                style={overlayImg}
                crossOrigin='anonymous'
              />
            ))}

          {logo && firstRenderAllowed && (
            <img
              src={logo}
              alt='Logo'
              style={overlayImg}
              crossOrigin='anonymous'
            />
          )}

          {/* Text overlays */}
          {/* <div ref={nameRef} style={nameStyle}>
            {name}
          </div>
          <div ref={taglineRef} style={taglineStyle}>
            {tagline}
          </div> */}
          {baseImageLoaded && firstRenderAllowed &&(
            <>
              <div
                ref={nameRef}
                style={{
                  ...nameStyle,
                  opacity: 1,
                  transition: 'opacity 0.3s ease'
                }}
              >
                {name}
              </div>

              <div
                ref={taglineRef}
                style={{
                  ...taglineStyle,
                  opacity: 1,
                  transition: 'opacity 0.3s ease'
                }}
              >
                {tagline}
              </div>
            </>
          )}
        </div>
      </div>

      {/* RIGHT: Controls */}
      <div style={rightPanel} className="sporty-right">
        <div style={rightCard}>
          {/* Header */}
          <div>
            <h2 style={{ margin: 0, fontSize: 18 }}>
              {custom.brand}{name ? ` – ${name}` : ""}
            </h2>
            <div style={{ fontSize: 12, color: '#777' }}>Sporty</div>
          </div>

          {/* Component accordions */}
          {renderComponentSection({
            title: 'Frame colour',
            isOpen: openPanel === 'frame',
            onToggle: () =>
              setOpenPanel(openPanel === 'frame' ? null : 'frame'),
            colors: framePart.colors || [],
            activeIndex: frameIdx,
            onSelect: setFrameIdx
          })}

          {renderComponentSection({
            title: 'Grip colour',
            isOpen: openPanel === 'grip',
            onToggle: () => setOpenPanel(openPanel === 'grip' ? null : 'grip'),
            colors: gripPart.colors || [],
            activeIndex: gripIdx,
            onSelect: setGripIdx
          })}

          {renderComponentSection({
            title: 'Mudguard colour',
            isOpen: openPanel === 'mudguard',
            onToggle: () =>
              setOpenPanel(openPanel === 'mudguard' ? null : 'mudguard'),
            colors: mudguardPart.colors || [],
            activeIndex: mudguardIdx,
            onSelect: setMudguardIdx
          })}

          {renderComponentSection({
            title: 'Brake lever colour',
            isOpen: openPanel === 'brake',
            onToggle: () =>
              setOpenPanel(openPanel === 'brake' ? null : 'brake'),
            colors: brakePart.colors || [],
            activeIndex: brakeIdx,
            onSelect: setBrakeIdx
          })}

          {/* Sticker pickers (RGB UI -> save CMYK too) */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
              Sticker colours
            </div>
            <div
              style={{
                display: 'flex',
                gap: '12px',
                overflowX: 'auto',
                paddingBottom: '6px'
              }}
            >
              {isBaseStickerColorAllowed && firstRenderAllowed && (
                <StickerRgbPicker
                  label="Car Base"
                  hex={baseHex}
                  onChange={h => {
                    setBaseHex(h)
                    setBaseEnabled(true)
                  }}
                  cmyk={baseCmyk}
                  enabled={baseEnabled}
                  onEnable={() => setBaseEnabled(true)}
                />
              )}

              {isPaintStickerColorAllowed && firstRenderAllowed &&(
                <StickerRgbPicker
                  label='Car paint'
                  hex={paintHex}
                  onChange={h => {
                    setPaintHex(h)
                    setPaintEnabled(true)
                  }}
                  cmyk={paintCmyk}
                  enabled={paintEnabled}
                  onEnable={() => setPaintEnabled(true)}
                />
              )}

              {isDecalStickerColorAllowed && firstRenderAllowed &&(
                <StickerRgbPicker
                  label='Car decal'
                  hex={decalHex}
                  onChange={h => {
                    setDecalHex(h)
                    setDecalEnabled(true)
                  }}
                  cmyk={decalCmyk}
                  enabled={decalEnabled}
                  onEnable={() => setDecalEnabled(true)}
                />
              )}

              {isPrimaryStickerColorAllowed && firstRenderAllowed && (
                <StickerRgbPicker
                  label='Primary colour'
                  hex={primaryHex}
                  onChange={h => {
                    setPrimaryHex(h)
                    setPrimaryEnabled(true)
                  }}
                  cmyk={primaryCmyk}
                  enabled={primaryEnabled}
                  onEnable={() => setPrimaryEnabled(true)}
                />
              )}

              {isSecondaryStickerColorAllowed && firstRenderAllowed && (
                <StickerRgbPicker
                  label='Secondary colour'
                  hex={secondaryHex}
                  onChange={h => {
                    setSecondaryHex(h)
                    setSecondaryEnabled(true)
                  }}
                  cmyk={secondaryCmyk}
                  enabled={secondaryEnabled}
                  onEnable={() => setSecondaryEnabled(true)}
                />
              )}
            </div>
          </div>

          {/* Actions */}
          <button
            type='button'
            style={primaryButton}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'SAVING...' : 'SAVE SPORTY CUSTOMIZATION'}
          </button>

          <button
            type='button'
            style={{ ...primaryButton, background: '#555', marginTop: 6 }}
            onClick={() => navigate(-1)}
          >
            BACK
          </button>
        </div>
      </div>
      <AppModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        {...modalConfig}
      />
    </div>
  )
}

/* ---------------- Sub-components ---------------- */

function TintMaskLayer ({ src, colorHex }) {
  return (
    <div
      style={{
        ...overlayImg,
        backgroundColor: colorHex,
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskPosition: 'center',
        maskPosition: 'center'
      }}
    />
  )
}

function StickerRgbPicker ({ label, hex, onChange, cmyk, enabled, onEnable }) {
  const hexToHsva = hex => {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const d = max - min

    let h = 0
    if (d !== 0) {
      if (max === r) h = ((g - b) / d) % 6
      else if (max === g) h = (b - r) / d + 2
      else h = (r - g) / d + 4
      h *= 60
      if (h < 0) h += 360
    }

    const s = max === 0 ? 0 : (d / max) * 100
    const v = max * 100

    return { h, s, v, a: 1 }
  }

  const hsvaToHex = ({ h, s, v }) => {
    s /= 100
    v /= 100

    const c = v * s
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
    const m = v - c

    let r = 0,
      g = 0,
      b = 0
    if (h < 60) [r, g, b] = [c, x, 0]
    else if (h < 120) [r, g, b] = [x, c, 0]
    else if (h < 180) [r, g, b] = [0, c, x]
    else if (h < 240) [r, g, b] = [0, x, c]
    else if (h < 300) [r, g, b] = [x, 0, c]
    else [r, g, b] = [c, 0, x]

    const toHex = n =>
      Math.round((n + m) * 255)
        .toString(16)
        .padStart(2, '0')

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  }
  const [hsva, setHsva] = React.useState(
    hex ? hexToHsva(hex) : { h: 0, s: 100, v: 100, a: 1 }
  )

  useEffect(() => {
    if (hex) setHsva(hexToHsva(hex))
  }, [hex])

  return (
    <div style={stickerPickerCard}>
      <Wheel
        color={hsva}
        width={81}
        height={81}
        onChange={color => {
          onEnable()
          setHsva(color.hsva)
          onChange(hsvaToHex(color.hsva))
        }}
      />
    </div>
  )
}

function renderComponentSection ({
  title,
  isOpen,
  onToggle,
  colors,
  activeIndex,
  onSelect
}) {
  return (
    <div style={accordionCard}>
      <div style={accordionHeader} onClick={onToggle}>
        <span>{title}</span>
        <span>{isOpen ? '−' : '+'}</span>
      </div>

      {isOpen && (
        <div
          style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}
        >
          {colors.map((c, idx) => (
            <div
              key={c.fileName || idx}
              style={colorDotStyle(
                c.colorCode || '#ffffff',
                idx === activeIndex
              )}
              title={c.colorName}
              onClick={() => onSelect(idx)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* ---------------- Canvas tint helpers ---------------- */

function hexToRgb (hex) {
  const clean = (hex || '#ffffff').replace('#', '')
  let r = 255,
    g = 255,
    b = 255
  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16)
    g = parseInt(clean[1] + clean[1], 16)
    b = parseInt(clean[2] + clean[2], 16)
  } else if (clean.length === 6) {
    r = parseInt(clean.substring(0, 2), 16)
    g = parseInt(clean.substring(2, 4), 16)
    b = parseInt(clean.substring(4, 6), 16)
  }
  return { r, g, b }
}

// function drawTintedMask (ctx, img, hex, width, height) {
//   const { r: tr, g: tg, b: tb } = hexToRgb(hex)

//   const off = document.createElement('canvas')
  
//   off.width = width
//   off.height = height
//   const octx = off.getContext('2d')

//   octx.clearRect(0, 0, width, height)
//   octx.drawImage(img, 0, 0, width, height)

//   const imageData = octx.getImageData(0, 0, width, height)
//   const data = imageData.data

//   for (let i = 0; i < data.length; i += 4) {
//     const a = data[i + 3]
//     if (a === 0) continue
//     const lum = (data[i] + data[i + 1] + data[i + 2]) / (3 * 255)
//     data[i] = tr * lum
//     data[i + 1] = tg * lum
//     data[i + 2] = tb * lum
//   }

//   octx.putImageData(imageData, 0, 0)
//   ctx.drawImage(off, 0, 0, width, height)
// }
  function drawTintedMask(ctx, img, hex, width, height) {
    if (!hex) {
      ctx.drawImage(img, 0, 0, width, height)
      return
    }

    const offscreenCanvas = document.createElement('canvas')
    const offscreenCtx = offscreenCanvas.getContext('2d')


    offscreenCanvas.width = width
    offscreenCanvas.height = height

    offscreenCtx.clearRect(0, 0, width, height)
    offscreenCtx.drawImage(img, 0, 0, width, height)

    const imageData = offscreenCtx.getImageData(0, 0, width, height)
    const data = imageData.data

    const { r, g, b } = hexToRgb(hex)

    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] === 0) continue
      const lum = (data[i] + data[i + 1] + data[i + 2]) / (3 * 255)
      data[i] = r * lum
      data[i + 1] = g * lum
      data[i + 2] = b * lum
    }

    offscreenCtx.putImageData(imageData, 0, 0)
    ctx.drawImage(offscreenCanvas, 0, 0, width, height)
  }

/* ---------------- Colour conversion ---------------- */

function hexToCmyk (hex) {
  if (!hex) return null
  let r = 0,
    g = 0,
    b = 0
  const clean = (hex || '#ffffff').replace('#', '')
  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16)
    g = parseInt(clean[1] + clean[1], 16)
    b = parseInt(clean[2] + clean[2], 16)
  } else if (clean.length === 6) {
    r = parseInt(clean.substring(0, 2), 16)
    g = parseInt(clean.substring(2, 4), 16)
    b = parseInt(clean.substring(4, 6), 16)
  }

  const rP = r / 255,
    gP = g / 255,
    bP = b / 255
  const k = 1 - Math.max(rP, gP, bP)
  if (k >= 1) return { c: 0, m: 0, y: 0, k: 100 }

  const c = (1 - rP - k) / (1 - k)
  const m = (1 - gP - k) / (1 - k)
  const y = (1 - bP - k) / (1 - k)

  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100)
  }
}

/* ---------------- Styles (UNCHANGED from your UI) ---------------- */

const pageWrapper = {
  padding: '24px 32px',
  color: '#333',
  background: '#f4f4f4',
  minHeight: '100vh',
  display: 'flex',
  gap: '24px',
  boxSizing: 'border-box'
}

const leftPanel = {
  flex: 2,
  position: 'relative',
  background: '#fff',
  borderRadius: '12px',
  boxShadow: '0 8px 20px rgba(0,0,0,0.18)',
  padding: '16px'
}

const rightPanel = {
  flex: 1.2,
  display: 'flex'
}

const rightCard = {
  flex: 1,
  background: '#fff',
  borderRadius: '12px',
  boxShadow: '0 6px 18px rgba(0,0,0,0.18)',
  padding: '16px 18px',
  display: 'flex',
  flexDirection: 'column',
  gap: '14px'
}

const cycleWrapper = {
  position: 'relative',
  width: '100%',
  maxWidth: '1024px',
  margin: '0 auto'
}

const baseImg = { width: '100%', display: 'block' }

const overlayImg = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  pointerEvents: 'none'
}

const baseText = {
  position: 'absolute',
  color: '#ffffff',
  fontFamily: "'Tigershark Bold Italic', sans-serif",
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
  letterSpacing: '0.08em',
  textShadow: '0 0 3px rgba(0,0,0,0.9)',
  pointerEvents: 'none'
}

const nameStyle = {
  ...baseText,
  left: '57.4%',
  top: '42.27%',
  transform: 'translate(-50%, -50%) rotate(-22deg)',
  fontSize: '1vw'
}

const taglineStyle = {
  ...baseText,
  left: '33.73%',
  top: '50.26%',
  transform: 'translate(-50%, -50%) rotate(48.8deg)',
  fontSize: '0.8vw'
}

const input = {
  padding: '8px 10px',
  background: '#fafafa',
  color: '#333',
  border: '1px solid #ddd',
  borderRadius: '6px',
  width: '100%',
  boxSizing: 'border-box',
  fontSize: '13px'
}

const primaryButton = {
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  border: 'none',
  background: '#000',
  color: '#fff',
  fontWeight: 600,
  cursor: 'pointer',
  fontSize: '14px',
  letterSpacing: '0.05em'
}

const iconBar = {
  position: 'absolute',
  top: '10px',
  right: '12px',
  display: 'flex',
  gap: '8px',
  zIndex: 20
}

const iconButton = {
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  border: '1px solid rgba(0,0,0,0.2)',
  background: 'rgba(255,255,255,0.9)',
  color: '#86bc22',
  fontSize: '16px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
  padding:'8px'
}

const accordionCard = {
  borderRadius: '8px',
  border: '1px solid #eee',
  padding: '8px 10px',
  background: '#fafafa'
}

const accordionHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '13px',
  fontWeight: 500,
  cursor: 'pointer'
}

const colorDotStyle = (hex, selected) => ({
  width: 22,
  height: 22,
  borderRadius: '50%',
  background: hex || '#ffffff',
  margin: 6,
  // border: selected ? "2px solid #000" : "1px solid #bbb",
  // cursor: "pointer",
  // boxShadow: selected ? "0 0 4px rgba(0,0,0,0.8)" : "none",
  border: selected ? '2px solid #00e676' : '2px solid #ddd',
  boxShadow: selected
    ? `
        0 0 0 3px #ffffff,   /* gap */
        0 0 0 5px #00e676    /* outer green ring */
      `
    : `
        0 0 0 3px #ffffff,   /* gap */
        0 0 0 5px #e0e0e0    /* light grey outer ring */
      `,
  transition: 'all 0.15s ease'
})

const stickerPickerCard = {
  // borderRadius: '8px',
  // border: '1px solid #eee',
  padding: '2px 2px'
  // background: "#fafafa",
  // marginBottom: 8
}

export default SportyCustomize
