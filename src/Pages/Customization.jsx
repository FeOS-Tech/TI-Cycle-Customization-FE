import React, { useEffect, useRef, useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CUSTOM_API, THEME_API_BASE } from '../config/api'
import { FaDownload, FaShareAlt } from 'react-icons/fa'
import { toast } from "react-hot-toast";
import loader from "../assets/loader.png";

function Customization () {
  const { slug } = useParams() // /kids/:slug  -> car-decal
  const navigate = useNavigate()
  const previewRef = useRef(null)
  const baseImgRef = useRef(null)
  const nameRef = useRef(null)
  const taglineRef = useRef(null)
  const lastImageRef = useRef(null)

  const [selectedInternalTheme, setSelectedInternalTheme] = useState(null)

  const [theme, setTheme] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // User selections
  const [name, setName] = useState('')
  const [tagline, setTagline] = useState('')
  const [bikeSize, setBikeSize] = useState('24T')
  const [mode, setMode] = useState('sporty') // sporty / fun
  const [frameColorIndex, setFrameColorIndex] = useState(0)
  const [themeVariant, setThemeVariant] = useState('primary') // primary / secondary

  // Loader for main WebP image
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [showName, setShowName] = useState(true);

  // ---------- Helpers ----------
  const preloadImage = src => {
    if (!src) return
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = src
  }

  const normalizeUrl = url => (typeof url === 'string' ? url.trim() : '')

  // ---------- Styles ----------
  const pageWrapper = {
    padding: '24px 32px',
    color: '#333',
    // background: '#f4f4f4',
    minHeight: '100vh',
    display: 'flex',
    gap: '24px',
    boxSizing: 'border-box',
    // background: 'linear-gradient(90deg,rgba(251, 106, 67, 0.7) 0%, rgba(251, 106, 67, 0.3) 2%, rgba(255, 255, 255, 1) 4%, rgba(255, 255, 255, 1) 97%, rgba(152, 198, 248, 0.6) 100%)'
  }

  const leftPanel = {
    flex: 2,
    position: 'relative',
    // background: '#fff',
    borderRadius: '5px',
    // boxShadow: '0 8px 20px rgba(0,0,0,0.18)',
    // padding: '16px'
    background:
    "radial-gradient(circle,rgba(255, 255, 255, 0.94) 30%, rgba(201, 201, 201, 0.32) 100%)",
  }

  const rightPanel = {
    flex: 1.2,
    display: 'flex'
  }

  const rightCard = {
    flex: 1,
    // background: '#fff',
    // borderRadius: '12px',
    // boxShadow: '0 6px 18px rgba(0,0,0,0.18)',
    padding: '10px 18px',
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
    fontSize: '15px'
  }

  const taglineStyle = {
    ...baseText,
    left: '33.73%',
    top: '50.26%',
    transform: 'translate(-50%, -50%) rotate(48.8deg)',
    fontSize: '8px'
  }

  const label = { fontSize: '14px', color: '#070707', marginBottom: '4px' }

  const input = {
    padding: '8px 10px',
    background: '#fafafa',
    color: '#333',
    border: '1px solid #ddd',
    borderRadius: '6px',
    width: '100%',
    fontSize: '13px'
  }

  const pillButton = active => ({
    padding: '6px 14px',
    borderRadius: '999px',
    border: active ? '1px solid #4CAF50' : '1px solid #ccc',
    background: active ? '#8BC34A' : '#ffffff',
    color: active ? '#fff' : '#333',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500
  })

  const sizePill = active => ({
    padding: '6px 12px',
    borderRadius: '999px',
    border: active ? '1px solid #333' : '1px solid #ccc',
    background: active ? '#333' : '#f7f7f7',
    color: active ? '#fff' : '#333',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500
  })

  const colorDot = (hex, selected) => ({
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    background: hex || '#ffffff',
    // border: selected ? "2px solid #000" : "1px solid #bbb",
    // cursor: "pointer",
    // boxShadow: selected ? "0 0 4px rgba(0,0,0,0.8)" : "none",
    cursor: 'pointer',
    border: selected ? '2px solid #00e676' : '2px solid #ddd',
    boxShadow: selected
      ? `
        0 0 0 3px #ffffff,
        0 0 0 5px #00e676
      `
      : `
        0 0 0 3px #ffffff,
        0 0 0 5px #e0e0e0
      `,
    transition: 'all 0.15s ease'
  })

  const primaryButton = {
    width: '100%',
    paddingTop: '1rem',
    paddingBottom: '1rem',
    borderRadius: '1rem',
    border: 'none',
    background: '#000',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '1rem',
    letterSpacing: '0.05em',
    marginTop: '8px',
  }

  const iconBar = {
    position: 'absolute',
    top: '12px',
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

  // const loaderOverlay = {
  //   position: 'absolute',
  //   inset: 0,
  //   background: 'rgba(255,255,255,0.7)',
  //   display: 'flex',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   zIndex: 30
  // }
  const loaderOverlay = {
    position: 'absolute',
    inset: 0, // ✅ cover parent fully
    background: 'rgba(255,255,255,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
    pointerEvents: 'none'
  }

  const loaderGif = {
    width: '96px',
    height: '96px',
    objectFit: 'contain'
  }
  

  // ---------- Fetch theme ----------
  useEffect(() => {
    const fetchTheme = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${THEME_API_BASE}/${slug}`)
        const data = await res.json()
        setTheme(data)
      } catch (err) {
        console.error('Failed to load theme', err)
      } finally {
        setLoading(false)
      }
    }

    if (slug) fetchTheme()
  }, [slug])

  // ---------- for theme ----------

  useEffect(() => {
    if (theme?.internalThemes?.length && !selectedInternalTheme) {
      setSelectedInternalTheme(theme.internalThemes[0])
    }
  }, [theme, selectedInternalTheme])

  // ---------- Theme values ----------
  const brandName = theme?.brand || 'BSA'
  const cycleName = theme?.cycleName || ''
  const modelNo = theme?.modelNo || theme?.modelId || ''

  const parts = useMemo(() => theme?.assets?.parts || [], [theme])

  const framePart = useMemo(
    () => parts.find(p => p.partCode === 'F01') || {},
    [parts]
  )

  const frameColors = framePart.colors || []

  // Only colours that actually have sportyImage/funImage
  const filteredFrameColors = useMemo(() => {
    if (!frameColors.length) return []
    return frameColors.filter(c => {
      const s = c.stickers || {}
      const url = mode === 'sporty' ? s.sportyImage : s.funImage
      return !!normalizeUrl(url)
    })
  }, [frameColors, mode])

  // Ensure frameColorIndex valid & prefer Black when mode changes
  useEffect(() => {
    if (!filteredFrameColors.length) {
      setFrameColorIndex(0)
      return
    }

    if (frameColorIndex < filteredFrameColors.length) return

    const idxBlack = filteredFrameColors.findIndex(c =>
      c.colorName?.toLowerCase().includes('black')
    )
    setFrameColorIndex(idxBlack >= 0 ? idxBlack : 0)
  }, [filteredFrameColors, frameColorIndex])

  const activeFrameColor = useMemo(
    () => filteredFrameColors[frameColorIndex] || filteredFrameColors[0] || {},
    [filteredFrameColors, frameColorIndex]
  )

  // ✅✅ FIX: NO FREEZE. Always use selected frame color stickers.
  const stickers = activeFrameColor.stickers || {}

  // ✅✅ FIX: base image changes with frameColorIndex
  const baseBikeImage = useMemo(() => {
    const url = mode === 'sporty' ? stickers.sportyImage : stickers.funImage
    return normalizeUrl(url)
  }, [mode, stickers])

  // For payload only
  const primarySticker = stickers.primaryColour
  const secondarySticker = stickers.secondaryColour
  const logo = stickers.logo

  // ---------- Preload only WebP images (optional) ----------
  useEffect(() => {
    if (!theme) return

    const p = theme.assets?.parts || []
    const fp = p.find(part => part.partCode === 'F01')
    if (!fp?.colors?.length) return

    const urls = new Set()
    fp.colors.forEach(color => {
      const s = color?.stickers || {}
      if (s.sportyImage) urls.add(normalizeUrl(s.sportyImage))
      if (s.funImage) urls.add(normalizeUrl(s.funImage))
    })
    urls.forEach(u => u && preloadImage(u))
  }, [theme])

  // ---------- Loader ----------
  // useEffect(() => {
  //   if (!baseBikeImage) {
  //     setIsImageLoading(false)
  //     return
  //   }
  //   setIsImageLoading(true)
  // }, [baseBikeImage])

  // useEffect(() => {
  //   if (!baseBikeImage) {
  //     setIsImageLoading(false)
  //     return
  //   }

  //   const img = new Image()
  //   img.src = baseBikeImage

  //   // ✅ image already cached → don't show loader
  //   if (img.complete) {
  //     setIsImageLoading(false)
  //   } else {
  //     setIsImageLoading(true)
  //   }
  // }, [baseBikeImage])

  useEffect(() => {
    if (!baseBikeImage) return

    if (lastImageRef.current === baseBikeImage) {
      // same image → no loader
      setIsImageLoading(false)
      return
    }
    lastImageRef.current = baseBikeImage

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = baseBikeImage

    // ✅ If already cached → NEVER show loader
    if (img.complete && img.naturalWidth > 0) {
      setIsImageLoading(false)
      return
    }

    setIsImageLoading(true)

    img.onload = () => {
      setIsImageLoading(false)
    }

    img.onerror = () => {
      setIsImageLoading(false)
    }
  }, [baseBikeImage])

  // const handleImgLoaded = () => setIsImageLoading(false)
  const handleImgLoaded = () => {
    setIsImageLoading(prev => (prev ? false : prev))
  }

  const handleImgError = e => {
    console.error('Base bike image failed:', baseBikeImage, e)
    setIsImageLoading(false)
  }

  // ---------- Guards ----------
  if (!slug) return <div style={pageWrapper}>No slug in URL</div>
  if (loading) return <div style={pageWrapper}>Loading...</div>
  if (!theme) return <div style={pageWrapper}>Theme not found</div>
  if (!filteredFrameColors.length)
    return (
      <div style={pageWrapper}>
        No colours found with {mode} images. Please check data.
      </div>
    )

  // ---------- Canvas download ----------
  const loadImage = src =>
    new Promise(resolve => {
      const s = normalizeUrl(src)
      if (!s) return resolve(null)
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = e => {
        console.error('Image failed to load for canvas:', s, e)
        resolve(null)
      }
      img.src = s
    })

  const handleDownload = async () => {
    try {
      if (!previewRef.current || !baseBikeImage) return

      if (document.fonts?.ready) {
        try {
          await document.fonts.ready
        } catch {}
      }

      const baseImgEl = await loadImage(baseBikeImage)
      if (!baseImgEl) return toast.error('Unable to load base image for download')

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      canvas.width = baseImgEl.naturalWidth || baseImgEl.width
      canvas.height = baseImgEl.naturalHeight || baseImgEl.height

      ctx.drawImage(baseImgEl, 0, 0, canvas.width, canvas.height)

      const previewRect = previewRef.current.getBoundingClientRect()

      const drawTextFromDom = (elRef, text, angleDeg) => {
        if (!elRef.current || !text) return

        const rect = elRef.current.getBoundingClientRect()
        const centerX = rect.left - previewRect.left + rect.width / 2
        const centerY = rect.top - previewRect.top + rect.height / 2

        const scaleX = canvas.width / previewRect.width
        const scaleY = canvas.height / previewRect.height
        const x = centerX * scaleX
        const y = centerY * scaleY

        const computed = window.getComputedStyle(elRef.current)
        const fontSizePx = parseFloat(computed.fontSize || '14')
        const fontSizeCanvas = fontSizePx * scaleX

        ctx.save()
        ctx.translate(x, y)
        ctx.rotate((angleDeg * Math.PI) / 180)
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.font = `${fontSizeCanvas}px "Tigershark Bold Italic", sans-serif`

        ctx.lineWidth = fontSizeCanvas * 0.1
        ctx.strokeStyle = 'rgba(0,0,0,1)'
        ctx.fillStyle = '#ffffff'
        ctx.strokeText(text, 0, 0)
        ctx.fillText(text, 0, 0)
        ctx.restore()
      }

      drawTextFromDom(nameRef, name, -22)
      drawTextFromDom(taglineRef, tagline, 48.8)

      const url = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = 'custom-cycle.png'
      a.click()
    } catch (e) {
      console.error(e)
      toast.error('Download failed')
    }
  }

  // ---------- Share ----------
  const handleShare = async () => {
    const shareUrl = window.location.href

    if (!navigator?.share) {
      try {
        await navigator.clipboard?.writeText(shareUrl)
        toast.error('Share is not supported here. Link copied to clipboard 👍')
      } catch {
        toast.error('Share is not supported. Please copy the URL manually.')
      }
      return
    }

    try {
      await navigator.share({
        title: 'My Custom Cycle',
        text: 'Check out my customized bike!',
        url: shareUrl
      })
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Share error:', err)
        toast.error('Unable to open share options on this browser.')
      }
    }
  }

  // ---------- Save + navigate ----------
  const handleCustomize = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem("userData") || "{}");
      setSaving(true)

      // ✅ SAME PAYLOAD AS YOUR FREEZE CODE (but now stickers/baseBikeImage are current selection)
      const payload = {
        brand: brandName,
        themeId: theme.themeId,
        themeSlug: theme.themeSlug,
        themeName: theme.themeName,
        cycleId: theme.cycleId,
        modelId: theme.modelId,
        internalTheme: selectedInternalTheme,
        cycleName,
        modelNo,

        image_url: null,

        userName: name,
        tagline,
        bikeSize,

        mode,
        themeVariant,

        frameColorIndex,
        frameColor: activeFrameColor,

        images: {
          baseBikeImage,
          primaryColour: primarySticker,
          secondaryColour: secondarySticker,
          logo,
          carBase: stickers.carBase,
          carPaint: stickers.carPaint,
          carDecal: stickers.carDecal
        },

        stickersRaw: {
          ...stickers,
          selectedBaseImage: baseBikeImage
        },
        user
      }

      const res = await fetch(CUSTOM_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error('Failed to save customization')

      const saved = await res.json()
      const customizationId = saved._id

      const target =
        mode === 'sporty'
          ? `/kids/${slug}/customize/sporty/${customizationId}`
          : `/kids/${slug}/customize/fun/${customizationId}`

      navigate(target, { state: { customizationId } })
    } catch (err) {
      console.error(err)
      const backendError =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Something went wrong";
      
      toast.error(backendError);
    } finally {
      setSaving(false)
    }
  }

  // ---------- UI ----------
  return (
    <div style={pageWrapper} className="custom-page">
      <style>
        {`
          @font-face {
            font-family: 'Tigershark Bold Italic';
            src: url('/fonts/tigersharkboldital.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
          }
           /* ===== DEFAULT: Laptop & above ===== */
          .custom-page {
            display: flex;
            flex-direction: row;
          }

          /* ===== BELOW LAPTOP (Tablet & Mobile) ===== */
          @media (max-width: 1023px) {
            .custom-page {
              flex-direction: column;
            }

            .custom-left,
            .custom-right {
              width: 100%;
            }

            .custom-right {
              margin-top: 16px;
            }
          }
        `}
      </style>

      {/* LEFT PREVIEW */}
      {/* <div style={leftPanel}> */}
      <div style={leftPanel} className="custom-left">
        <div style={iconBar}>
          <button style={iconButton} onClick={handleDownload} title='Download'>
            <FaDownload size={20} />
          </button>
          <button style={iconButton} onClick={handleShare} title='Share'>
            <FaShareAlt size={20} />
          </button>
        </div>

        {/* <div ref={previewRef} style={cycleWrapper}> */}
        <div
          ref={previewRef}
          style={{
            ...cycleWrapper,
            minHeight: '500px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {baseBikeImage && (
            <img
              key={baseBikeImage} // ✅ helps if browser caches aggressively
              ref={baseImgRef}
              src={baseBikeImage}
              style={baseImg}
              alt='Cycle base'
              crossOrigin='anonymous'
              onLoad={handleImgLoaded}
              onError={handleImgError}
            />
          )}

          {/* Text */}
            {!isImageLoading && showName && (
              <>
                <div ref={nameRef} style={nameStyle}>
                  {name}
                </div>

                <div ref={taglineRef} style={taglineStyle}>
                  {tagline}
                </div>
              </>
            )}

          {/* Loader */}
          {isImageLoading && (
            // <div style={loaderOverlay}>
            <div style={{ ...loaderOverlay, opacity: isImageLoading ? 1 : 0 }}>
              {/* <span className="loader"></span> */}
              {/* <img src='/cycle.gif' alt='Loading' style={loaderGif} /> */}
              <img src={loader} />
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={rightPanel} className='custom-right'>
        <div style={rightCard}>
          <h2 style={{ margin: 0 }}>{brandName}</h2>
          {/* <div style={{ fontSize: '12px', color: '#777' }}>
            {theme.themeName}
            {cycleName ? ` • ${cycleName}` : ''}
            {modelNo ? ` • ${modelNo}` : ''}
          </div> */}

          <div>
            {/* <span
              style={{ fontSize: '12px', fontWeight: 600, color: '#4CAF50' }}
            >
              Rider name (Max 8 char) & Tagline (Max 15 Char)
            </span> */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <input
                style={input}
                value={name}
                maxLength={8}
                onChange={e => setName(e.target.value.toUpperCase())}
                placeholder='Name (max 8 char)'
              />
              <input
                style={input}
                value={tagline}
                maxLength={15}
                onChange={e => setTagline(e.target.value.toUpperCase())}
                placeholder='Tagline (max 15 char)'
              />
            </div>
          </div>

          <div>
            <span style={label}>Bike size</span>
            <div style={{ display: 'flex', gap: '12px' ,marginTop:'8px' }}>
              {['16T', '20T'].map(sz => (
                <button
                  key={sz}
                  style={sizePill(sz === bikeSize)}
                  onClick={() => setBikeSize(sz)}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span style={label}>Bike preference</span>
            <div style={{ display: 'flex', gap: '12px'  ,marginTop:'8px' }}>
              <button
                style={pillButton(mode === 'sporty')}
                onClick={() => setMode('sporty')}
              >
                Sporty
              </button>
              <button
                style={pillButton(mode === 'fun')}
                onClick={() => setMode('fun')}
              >
                Fun
              </button>
            </div>
          </div>

          {/* for theme */}
          {theme?.internalThemes?.length > 0 && (
            <div>
              <span
                style={{
                  fontSize: '14px',
                  color: 'rgb(7, 7, 7)',
                  marginBottom: '6px',
                  display: 'inline-block'
                }}
              >
                Theme
              </span>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' , marginTop: '8px' }}>
                {theme.internalThemes.map(t => {
                  const isActive = selectedInternalTheme?.id === t.id

                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedInternalTheme(t)}
                      style={{
                        width: '100px',
                        height: '64px',
                        borderRadius: '10px',
                        padding: '3px',
                        cursor: 'pointer',
                        border: isActive
                          ? '2px solid #00e676'
                          : '2px solid #ddd',
                        boxShadow: isActive
                          ? '0 0 0 2px #ffffff, 0 0 0 4px #00e676'
                          : '0 0 0 2px #ffffff'
                      }}
                    >
                      <img
                        src={t.image}
                        alt={t.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '8px',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div>
            <span
              style={{ ...label, marginBottom: '5px', display: 'inline-block' }}
            >
              Frame colour
            </span>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' ,marginTop:'8px'  }}>
              {filteredFrameColors.map((c, idx) => (
                <div
                  key={c.fileName || idx}
                  style={colorDot(c.colorCode, idx === frameColorIndex)}
                  title={c.colorName}
                  onClick={() => {
                    if (idx !== frameColorIndex) {
                      setFrameColorIndex(idx);
                      setShowName(false);
                       setTimeout(() => {
                        setShowName(true);
                      }, 300);
                    }
                  }}
                />
              ))}
            </div>
          </div>

          <button
            style={primaryButton}
            onClick={handleCustomize}
            disabled={saving}
          >
            {saving ? 'SAVING...' : 'Enter My Studio'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Customization
