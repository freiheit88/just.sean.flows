/**
 * [JSF HAUTE SALON] 700GSM BLACK COTTON & 24K HOT-STAMPED GOLD FOIL PASS QR ENGINE
 * - Renders the candid Leica 35mm Walnut Table + Bordeaux Wine Glass + Black Cotton Card
 *   (/assets/salon_concepts/intro_walnut_wine_pass_card.jpg) at native 976:1095 proportion.
 * - Encodes the live reachable Salon URL (?from=qr) via ISO/IEC 18004 ECC Level M (chunky,
 *   architectural gold-foil bars) and projects it + Maison foil typography onto the exact
 *   3D perspective plane of the tilted black cotton card via 3x3 Projective Homography,
 *   complete with blind-debossed letterpress well, candlelit specular foil gradient, and
 *   real cotton paper fiber micro-texture multiplication.
 * - Automatically skipped when opened from QR (?from=qr) on the guest's smartphone.
 */
(function () {
  'use strict';

  const params = new URLSearchParams(window.location.search);
  if (params.get('from') === 'qr' || params.get('skip_qr') === '1') {
    return;
  }

  /* ========================================================================
     1. ISO/IEC 18004 QR ENCODER — ECC LEVEL M (15% RECOVERY, CHUNKY FOIL BARS)
     ======================================================================== */
  const GF_EXP = new Uint8Array(512);
  const GF_LOG = new Uint8Array(256);
  (function initGF() {
    let x = 1;
    for (let i = 0; i < 255; i++) {
      GF_EXP[i] = x;
      GF_LOG[x] = i;
      x <<= 1;
      if (x & 0x100) x ^= 0x11d;
    }
    for (let i = 255; i < 512; i++) GF_EXP[i] = GF_EXP[i - 255];
  })();

  function gfMul(a, b) {
    return a === 0 || b === 0 ? 0 : GF_EXP[GF_LOG[a] + GF_LOG[b]];
  }

  function rsGeneratorPoly(degree) {
    let poly = [1];
    for (let i = 0; i < degree; i++) {
      const next = new Array(poly.length + 1).fill(0);
      const root = GF_EXP[i];
      for (let j = 0; j < poly.length; j++) {
        next[j] ^= poly[j];
        next[j + 1] ^= gfMul(poly[j], root);
      }
      poly = next;
    }
    return poly;
  }

  function rsRemainder(data, ecLen) {
    const gen = rsGeneratorPoly(ecLen);
    const rem = new Uint8Array(ecLen);
    for (let i = 0; i < data.length; i++) {
      const factor = data[i] ^ rem[0];
      for (let j = 0; j < ecLen - 1; j++) rem[j] = rem[j + 1];
      rem[ecLen - 1] = 0;
      if (factor !== 0) {
        for (let j = 0; j < ecLen; j++) {
          rem[j] ^= gfMul(gen[j + 1], factor);
        }
      }
    }
    return rem;
  }

  // ISO/IEC 18004 Table 9 — ECC Level M (15%, ecFormatBits = 0b00 = 0)
  // [ver, ecPerBlock, g1Blocks, g1Data, g2Blocks, g2Data, alignCenters]
  const V_TABLE_M = [
    null,
    [1, 10, 1, 16, 0, 0, []],
    [2, 16, 1, 28, 0, 0, [6, 18]],
    [3, 26, 1, 44, 0, 0, [6, 22]],
    [4, 18, 2, 32, 0, 0, [6, 26]],
    [5, 24, 2, 43, 0, 0, [6, 30]],
    [6, 16, 4, 27, 0, 0, [6, 34]],
    [7, 18, 4, 31, 0, 0, [6, 22, 38]],
    [8, 22, 2, 38, 2, 39, [6, 24, 42]],
  ];

  function encodeQrMatrixM(text) {
    const utf8 = new TextEncoder().encode(text);
    const len = utf8.length;

    let spec = null;
    let totalDataCap = 0;
    for (let v = 3; v <= 8; v++) {
      const s = V_TABLE_M[v];
      const dataCap = s[2] * s[3] + s[4] * s[5];
      if (len + 2 <= dataCap) {
        spec = s;
        totalDataCap = dataCap;
        break;
      }
    }
    if (!spec) throw new Error('QR payload exceeds V8-M capacity');

    const [ver, ecPerBlock, g1Blocks, g1Data, g2Blocks, g2Data, align] = spec;
    const size = 17 + ver * 4;

    const bits = [];
    const pushBits = (val, count) => {
      for (let i = count - 1; i >= 0; i--) bits.push((val >>> i) & 1);
    };

    pushBits(0b0100, 4);
    pushBits(len, 8);
    for (let i = 0; i < len; i++) pushBits(utf8[i], 8);

    const maxDataBits = totalDataCap * 8;
    pushBits(0, Math.min(4, maxDataBits - bits.length));
    while (bits.length % 8 !== 0) bits.push(0);

    const dataBytes = new Uint8Array(totalDataCap);
    for (let i = 0; i < bits.length / 8; i++) {
      let b = 0;
      for (let j = 0; j < 8; j++) b = (b << 1) | bits[i * 8 + j];
      dataBytes[i] = b;
    }
    const pads = [0xec, 0x11];
    for (let i = bits.length / 8, p = 0; i < totalDataCap; i++, p ^= 1) {
      dataBytes[i] = pads[p];
    }

    const dataBlocks = [];
    const ecBlocks = [];
    let offset = 0;
    for (let b = 0; b < g1Blocks; b++) {
      const slice = dataBytes.subarray(offset, offset + g1Data);
      offset += g1Data;
      dataBlocks.push(slice);
      ecBlocks.push(rsRemainder(slice, ecPerBlock));
    }
    for (let b = 0; b < g2Blocks; b++) {
      const slice = dataBytes.subarray(offset, offset + g2Data);
      offset += g2Data;
      dataBlocks.push(slice);
      ecBlocks.push(rsRemainder(slice, ecPerBlock));
    }

    const interleaved = [];
    const maxBlockData = g2Blocks > 0 ? g2Data : g1Data;
    const totalBlocks = dataBlocks.length;
    for (let col = 0; col < maxBlockData; col++) {
      for (let b = 0; b < totalBlocks; b++) {
        if (col < dataBlocks[b].length) interleaved.push(dataBlocks[b][col]);
      }
    }
    for (let col = 0; col < ecPerBlock; col++) {
      for (let b = 0; b < totalBlocks; b++) {
        interleaved.push(ecBlocks[b][col]);
      }
    }

    const modules = Array.from({ length: size }, () => new Array(size).fill(false));
    const isFunc = Array.from({ length: size }, () => new Array(size).fill(false));
    const roleMap = Array.from({ length: size }, () => new Uint8Array(size));

    const setFunc = (x, y, dark, role) => {
      if (x < 0 || y < 0 || x >= size || y >= size) return;
      modules[y][x] = dark;
      isFunc[y][x] = true;
      roleMap[y][x] = role || 4;
    };

    const drawFinder = (ox, oy) => {
      for (let dy = -1; dy <= 7; dy++) {
        for (let dx = -1; dx <= 7; dx++) {
          const x = ox + dx;
          const y = oy + dy;
          if (dx >= 0 && dx <= 6 && dy >= 0 && dy <= 6) {
            const onOuter = dx === 0 || dx === 6 || dy === 0 || dy === 6;
            const onCore = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
            setFunc(x, y, onOuter || onCore, 1);
          } else {
            setFunc(x, y, false, 2);
          }
        }
      }
    };
    drawFinder(0, 0);
    drawFinder(size - 7, 0);
    drawFinder(0, size - 7);

    for (let i = 8; i < size - 8; i++) {
      if (!isFunc[6][i]) setFunc(i, 6, i % 2 === 0, 4);
      if (!isFunc[i][6]) setFunc(6, i, i % 2 === 0, 4);
    }

    for (let i = 0; i < align.length; i++) {
      for (let j = 0; j < align.length; j++) {
        if (
          (i === 0 && j === 0) ||
          (i === 0 && j === align.length - 1) ||
          (i === align.length - 1 && j === 0)
        ) {
          continue;
        }
        const cx = align[j];
        const cy = align[i];
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            const dist = Math.max(Math.abs(dx), Math.abs(dy));
            setFunc(cx + dx, cy + dy, dist !== 1, 3);
          }
        }
      }
    }

    for (let i = 0; i <= 8; i++) {
      if (i !== 6) {
        if (!isFunc[8][i]) setFunc(i, 8, false, 4);
        if (!isFunc[i][8]) setFunc(8, i, false, 4);
      }
    }
    for (let i = 0; i < 8; i++) {
      if (!isFunc[8][size - 1 - i]) setFunc(size - 1 - i, 8, false, 4);
      if (!isFunc[size - 1 - i][8]) setFunc(8, size - 1 - i, false, 4);
    }
    setFunc(8, size - 8, true, 4);

    if (ver >= 7) {
      let rem = ver << 12;
      for (let i = 17; i >= 12; i--) {
        if ((rem >>> i) & 1) rem ^= 0x1f25 << (i - 12);
      }
      const vBits = (ver << 12) | rem;
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 3; j++) {
          const dark = ((vBits >>> (i * 3 + j)) & 1) === 1;
          setFunc(size - 11 + j, i, dark, 4);
          setFunc(i, size - 11 + j, dark, 4);
        }
      }
    }

    let bitIdx = 0;
    const totalBits = interleaved.length * 8;
    let upward = true;
    for (let right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (let vert = 0; vert < size; vert++) {
        const y = upward ? size - 1 - vert : vert;
        for (let j = 0; j < 2; j++) {
          const x = right - j;
          if (!isFunc[y][x]) {
            let dark = false;
            if (bitIdx < totalBits) {
              dark = ((interleaved[bitIdx >>> 3] >>> (7 - (bitIdx & 7))) & 1) === 1;
              bitIdx++;
            }
            modules[y][x] = dark;
          }
        }
      }
      upward = !upward;
    }

    const maskFn = (m, x, y) => {
      switch (m) {
        case 0: return (x + y) % 2 === 0;
        case 1: return y % 2 === 0;
        case 2: return x % 3 === 0;
        case 3: return (x + y) % 3 === 0;
        case 4: return (Math.floor(y / 2) + Math.floor(x / 3)) % 2 === 0;
        case 5: return ((x * y) % 2) + ((x * y) % 3) === 0;
        case 6: return (((x * y) % 2) + ((x * y) % 3)) % 2 === 0;
        default: return (((x + y) % 2) + ((x * y) % 3)) % 2 === 0;
      }
    };

    const drawFormat = (mat, mask) => {
      // ECC Level M format indicator = 0b00 (0) per ISO/IEC 18004 Table 12
      const data5 = (0 << 3) | mask;
      let rem = data5 << 10;
      for (let i = 14; i >= 10; i--) {
        if ((rem >>> i) & 1) rem ^= 0x537 << (i - 10);
      }
      const bits15 = ((data5 << 10) | rem) ^ 0x5412;
      const bit = (idx) => ((bits15 >>> idx) & 1) === 1;

      // Copy 1: Top-left around finder (LSB bit(0) at (x=8, y=0) .. MSB bit(14) at (x=0, y=8))
      for (let i = 0; i <= 5; i++) mat[i][8] = bit(i);
      mat[7][8] = bit(6);
      mat[8][8] = bit(7);
      mat[8][7] = bit(8);
      for (let i = 9; i <= 14; i++) mat[8][14 - i] = bit(i);

      // Copy 2: Top-right (y=8, x=size-1..size-8) & Bottom-left (x=8, y=size-7..size-1)
      for (let i = 0; i <= 7; i++) mat[8][size - 1 - i] = bit(i);
      for (let i = 8; i <= 14; i++) mat[size - 15 + i][8] = bit(22 - i);
      mat[size - 8][8] = true;
    };

    const scorePenalty = (mat) => {
      let p = 0;
      for (let y = 0; y < size; y++) {
        let runX = 1;
        let runY = 1;
        for (let x = 1; x < size; x++) {
          if (mat[y][x] === mat[y][x - 1]) {
            runX++;
            if (runX === 5) p += 3;
            else if (runX > 5) p += 1;
          } else runX = 1;
          if (mat[x][y] === mat[x - 1][y]) {
            runY++;
            if (runY === 5) p += 3;
            else if (runY > 5) p += 1;
          } else runY = 1;
        }
      }
      for (let y = 0; y < size - 1; y++) {
        for (let x = 0; x < size - 1; x++) {
          const c = mat[y][x];
          if (c === mat[y][x + 1] && c === mat[y + 1][x] && c === mat[y + 1][x + 1]) p += 3;
        }
      }
      return p;
    };

    let bestMat = null;
    let bestScore = Infinity;
    for (let m = 0; m < 8; m++) {
      const candidate = modules.map((row, y) =>
        row.map((val, x) => (!isFunc[y][x] && maskFn(m, x, y) ? !val : val))
      );
      drawFormat(candidate, m);
      const sc = scorePenalty(candidate);
      if (sc < bestScore) {
        bestScore = sc;
        bestMat = candidate;
      }
    }
    return { mat: bestMat, roleMap, size };
  }

  /* ========================================================================
     2. EXACT 3x3 PROJECTIVE HOMOGRAPHY SOLVER (IMAGE PIXEL -> FLAT PLATE)
     ======================================================================== */
  // Normalized 4 corners (TL, TR, BR, BL) of the 24K gold hairline border
  // inside /assets/salon_concepts/intro_walnut_wine_pass_card.jpg (976 x 1095)
  const CARD_NORM_QUAD = [
    [0.13883, 0.40183], // Top-Left
    [0.51844, 0.30685], // Top-Right
    [0.87193, 0.64932], // Bottom-Right
    [0.38217, 0.86484], // Bottom-Left
  ];

  function solveLinear8(A, b) {
    const n = 8;
    const M = A.map((row, i) => [...row, b[i]]);
    for (let col = 0; col < n; col++) {
      let pivot = col;
      for (let r = col + 1; r < n; r++) {
        if (Math.abs(M[r][col]) > Math.abs(M[pivot][col])) pivot = r;
      }
      const tmp = M[col];
      M[col] = M[pivot];
      M[pivot] = tmp;

      const div = M[col][col] || 1e-12;
      for (let c = col; c <= n; c++) M[col][c] /= div;
      for (let r = 0; r < n; r++) {
        if (r === col) continue;
        const factor = M[r][col];
        for (let c = col; c <= n; c++) M[r][c] -= factor * M[col][c];
      }
    }
    return M.map((row) => row[n]);
  }

  // Maps image pixel (x, y) -> canonical flat plate coordinate (u, v)
  function computeInverseHomography(imgQuad, plateW, plateH) {
    const dst = [
      [0, 0],
      [plateW, 0],
      [plateW, plateH],
      [0, plateH],
    ];
    const A = [];
    const b = [];
    for (let i = 0; i < 4; i++) {
      const [x, y] = imgQuad[i];
      const [u, v] = dst[i];
      A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]);
      b.push(u);
      A.push([0, 0, 0, x, y, 1, -v * x, -v * y]);
      b.push(v);
    }
    const h = solveLinear8(A, b);
    return [h[0], h[1], h[2], h[3], h[4], h[5], h[6], h[7], 1.0];
  }

  /* ========================================================================
     3. 24K HOT-STAMPED GOLD FOIL PRINT PLATE & WALNUT COMPOSITOR
     ======================================================================== */
  const PLATE_W = 720;
  const PLATE_H = 936;
  const WELL_X0 = 96;
  const WELL_Y0 = 102;
  const WELL_SIZE = 528; // 73.3% of card width — bold, prominent & instant scan!

  const walnutCardImg = new Image();
  walnutCardImg.crossOrigin = 'anonymous';
  let bgLoaded = false;

  walnutCardImg.onload = function () {
    bgLoaded = true;
    renderPassCardCanvas();
  };
  walnutCardImg.src = '/assets/salon_concepts/intro_walnut_wine_pass_card.jpg';

  function buildGoldFoilPrintPlate(url, mode) {
    const isIg = mode === 'instagram';
    const { mat, roleMap, size } = encodeQrMatrixM(url);

    const plate = document.createElement('canvas');
    plate.width = PLATE_W;
    plate.height = PLATE_H;
    const pctx = plate.getContext('2d', { willReadFrequently: true });
    pctx.clearRect(0, 0, PLATE_W, PLATE_H);

    // 4.0-module pure matte black cotton quiet zone inside the 528x528 blind-debossed well
    const quietMods = 3.9;
    const totalMods = size + quietMods * 2;
    const cellPx = WELL_SIZE / totalMods;
    const originX = WELL_X0 + quietMods * cellPx;
    const originY = WELL_Y0 + quietMods * cellPx;

    pctx.fillStyle = '#ffffff';

    // Draw crisp brass-die Finder Patterns (7x7 outer ring + 3x3 inner block, matching Concept 03!)
    const drawBrassFinder = (mx0, my0) => {
      const fx = originX + mx0 * cellPx;
      const fy = originY + my0 * cellPx;
      const outerS = cellPx * 7;
      const innerHoleS = cellPx * 5;
      const coreS = cellPx * 3;

      pctx.save();
      pctx.beginPath();
      pctx.rect(fx, fy, outerS, outerS);
      pctx.rect(fx + cellPx, fy + cellPx, innerHoleS, innerHoleS);
      pctx.fill('evenodd');

      pctx.fillRect(fx + cellPx * 2, fy + cellPx * 2, coreS, coreS);
      pctx.restore();
    };
    drawBrassFinder(0, 0);
    drawBrassFinder(size - 7, 0);
    drawBrassFinder(0, size - 7);

    // Draw connected architectural 24K gold foil bars (0.35px overlap between neighbors so metal bars fuse seamlessly)
    for (let my = 0; my < size; my++) {
      for (let mx = 0; mx < size; mx++) {
        if (roleMap[my][mx] === 1 || roleMap[my][mx] === 2) continue;
        if (!mat[my][mx]) continue;

        const hasR = mx + 1 < size && mat[my][mx + 1];
        const hasB = my + 1 < size && mat[my + 1][mx];
        const inset = cellPx * 0.045;
        const x = originX + mx * cellPx + (mx > 0 && mat[my][mx - 1] ? 0 : inset);
        const y = originY + my * cellPx + (my > 0 && mat[my - 1][mx] ? 0 : inset);
        const x2 = originX + (mx + 1) * cellPx - (hasR ? -0.4 : inset);
        const y2 = originY + (my + 1) * cellPx - (hasB ? -0.4 : inset);
        pctx.fillRect(x, y, Math.max(1, x2 - x), Math.max(1, y2 - y));
      }
    }

    // Crisp Hot-Stamped Maison Typography below the Blind-Debossed QR Well
    pctx.textAlign = 'center';
    pctx.textBaseline = 'middle';

    if (isIg) {
      // Minimal 24K Gold-Foil Instagram Camera Crest + @JUST.SEAN.FLOWS
      pctx.save();
      pctx.strokeStyle = 'rgba(255, 255, 255, 0.96)';
      pctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
      pctx.lineWidth = 2.4;
      const igX = PLATE_W * 0.5 - 176;
      const igY = 691;
      pctx.beginPath();
      pctx.roundRect(igX, igY, 24, 24, 6.5);
      pctx.stroke();
      pctx.beginPath();
      pctx.arc(igX + 12, igY + 12, 5.5, 0, Math.PI * 2);
      pctx.stroke();
      pctx.beginPath();
      pctx.arc(igX + 18.6, igY + 5.6, 1.5, 0, Math.PI * 2);
      pctx.fill();
      pctx.restore();

      pctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
      pctx.font = "700 23.5px 'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif";
      if ('letterSpacing' in pctx) pctx.letterSpacing = '4.2px';
      pctx.fillText('@JUST.SEAN.FLOWS', PLATE_W * 0.5 + 20, 704);
    } else {
      // Line 1: @JUST.SEAN.FLOWS
      pctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
      pctx.font = "700 24px 'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif";
      if ('letterSpacing' in pctx) pctx.letterSpacing = '4.5px';
      pctx.fillText('@JUST.SEAN.FLOWS', PLATE_W * 0.5, 704);
    }

    // Delicate 24K gold foil ornament rule
    pctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
    pctx.fillRect(PLATE_W * 0.5 - 68, 742, 54, 1.5);
    pctx.fillRect(PLATE_W * 0.5 + 14, 742, 54, 1.5);
    pctx.save();
    pctx.translate(PLATE_W * 0.5, 742.75);
    pctx.rotate(Math.PI / 4);
    pctx.fillRect(-3.2, -3.2, 6.4, 6.4);
    pctx.restore();

    // Line 2 & Line 3 adapt cleanly between Live Web Salon Pass & Official Instagram Pass
    pctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
    pctx.font = "600 15.5px 'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif";
    if ('letterSpacing' in pctx) pctx.letterSpacing = '3.6px';
    pctx.fillText(
      isIg ? 'INSTAGRAM OFFICIAL · FOLLOW & DM' : 'MUSIC SALON · FRANKFURT AM MAIN',
      PLATE_W * 0.5,
      778
    );

    pctx.fillStyle = 'rgba(255, 255, 255, 0.76)';
    pctx.font = "600 12.5px 'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif";
    if ('letterSpacing' in pctx) pctx.letterSpacing = '3.2px';
    pctx.fillText(
      isIg ? 'SCAN FOR PRIVATE REELS & INVITATION' : 'LIVE WEB SALON PASS  ·  SCAN TO ENTER',
      PLATE_W * 0.5,
      814
    );

    const pData = pctx.getImageData(0, 0, PLATE_W, PLATE_H).data;
    const alpha = new Float32Array(PLATE_W * PLATE_H);
    for (let i = 0, p = 3; i < alpha.length; i++, p += 4) {
      alpha[i] = pData[p] / 255.0;
    }
    return alpha;
  }

  function samplePlateBilinear(alpha, u, v) {
    if (u < 0 || v < 0 || u >= PLATE_W - 1 || v >= PLATE_H - 1) return 0;
    const x0 = u | 0;
    const y0 = v | 0;
    const fx = u - x0;
    const fy = v - y0;
    const row0 = y0 * PLATE_W + x0;
    const row1 = row0 + PLATE_W;
    const top = alpha[row0] + (alpha[row0 + 1] - alpha[row0]) * fx;
    const bot = alpha[row1] + (alpha[row1 + 1] - alpha[row1]) * fx;
    return top + (bot - top) * fy;
  }

  function renderWalnutPassCardToCanvas(canvas, url, mode) {
    const CW = 976;
    const CH = 1095;
    if (canvas.width !== CW || canvas.height !== CH) {
      canvas.width = CW;
      canvas.height = CH;
    }
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    // Fallback dark walnut gradient until photo finishes loading
    if (!bgLoaded || !walnutCardImg.naturalWidth) {
      const g = ctx.createRadialGradient(CW * 0.52, CH * 0.48, 40, CW * 0.5, CH * 0.5, CW * 0.8);
      g.addColorStop(0, '#2a1c12');
      g.addColorStop(1, '#0c0806');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, CW, CH);
    } else {
      ctx.drawImage(walnutCardImg, 0, 0, CW, CH);
    }

    const foilAlpha = buildGoldFoilPrintPlate(url, mode);
    const imgQuad = CARD_NORM_QUAD.map(([nx, ny]) => [nx * CW, ny * CH]);
    const Hinv = computeInverseHomography(imgQuad, PLATE_W, PLATE_H);

    const minX = Math.max(0, Math.floor(Math.min(imgQuad[0][0], imgQuad[3][0]) - 2));
    const maxX = Math.min(CW - 1, Math.ceil(Math.max(imgQuad[1][0], imgQuad[2][0]) + 2));
    const minY = Math.max(0, Math.floor(Math.min(imgQuad[0][1], imgQuad[1][1]) - 2));
    const maxY = Math.min(CH - 1, Math.ceil(Math.max(imgQuad[2][1], imgQuad[3][1]) + 2));

    const frame = ctx.getImageData(0, 0, CW, CH);
    const pxData = frame.data;

    const wellX1 = WELL_X0 + WELL_SIZE;
    const wellY1 = WELL_Y0 + WELL_SIZE;

    const h0 = Hinv[0], h1 = Hinv[1], h2 = Hinv[2];
    const h3 = Hinv[3], h4 = Hinv[4], h5 = Hinv[5];
    const h6 = Hinv[6], h7 = Hinv[7], h8 = Hinv[8];

    for (let py = minY; py <= maxY; py++) {
      const rowBase = py * CW;
      const ry0 = h1 * py + h2;
      const ry1 = h4 * py + h5;
      const ry2 = h7 * py + h8;

      for (let px = minX; px <= maxX; px++) {
        const w = h6 * px + ry2;
        if (w <= 1e-5) continue;
        const invW = 1.0 / w;
        const u = (h0 * px + ry0) * invW;
        const v = (h3 * px + ry1) * invW;

        // Stay strictly inside the card's photographed gold hairline border!
        if (u < 20 || u > PLATE_W - 20 || v < 20 || v > PLATE_H - 20) continue;

        const idx = (rowBase + px) * 4;
        let r = pxData[idx];
        let g = pxData[idx + 1];
        let b = pxData[idx + 2];

        // Preserve real cotton paper fiber texture from the base photograph
        const baseLum = 0.299 * r + 0.587 * g + 0.114 * b;
        const fiberDelta = Math.max(-14, Math.min(18, (baseLum - 30) * 1.15));

        // 1) Blind-Debossed Recessed QR Square Well (matches Sean's Concept 03 reference!)
        if (u >= WELL_X0 && u <= wellX1 && v >= WELL_Y0 && v <= wellY1) {
          // Deepen matte cotton black inside the recessed well so phone cameras get >9:1 contrast
          r *= 0.56;
          g *= 0.56;
          b *= 0.58;

          // Physical 0.6mm letterpress step-down crease along the 4 edges of the well
          const dTop = v - WELL_Y0;
          const dRight = wellX1 - u;
          const dLeft = u - WELL_X0;
          const dBot = wellY1 - v;
          if (dTop < 3.4 || dRight < 3.4) {
            // Cast shadow from upper-right candlelight along top & right inner wall
            r *= 0.38;
            g *= 0.38;
            b *= 0.40;
          } else if (dLeft < 2.6 || dBot < 2.6) {
            // Subtle warm cotton paper catch-light on opposite inner lip
            r = Math.min(255, r + 15);
            g = Math.min(255, g + 12);
            b = Math.min(255, b + 8);
          }
        }

        // 2) Hot-Stamped 24K Champagne-Gold Foil + Letterpress Indentation Rim
        const aFoil = samplePlateBilinear(foilAlpha, u, v);
        // Light comes from upper-right (candles + ruby wine glass), casting micro-indentation down-left
        const aShadow = samplePlateBilinear(foilAlpha, u + 2.1, v - 2.1);

        if (aShadow > aFoil) {
          const indent = Math.min(1, (aShadow - aFoil) * 0.85);
          const darken = 1.0 - 0.54 * indent;
          r *= darken;
          g *= darken;
          b *= darken;
        }

        if (aFoil > 0.01) {
          // Directional 2700K candlelit specular sheen across the metallic 24K gold leaf:
          // Brightest champagne-ivory near upper-right candle glow, warm antique gold toward bottom-left
          const nu = u / PLATE_W;
          const nv = v / PLATE_H;
          const candleSpec = Math.max(0, Math.min(1, 0.62 * nu + 0.38 * (1.0 - nv)));
          const shimmer = Math.sin((u * 0.045 + v * 0.032)) * 0.04;
          const spec = Math.max(0, Math.min(1, candleSpec + shimmer));

          const foilR = Math.min(255, Math.max(195, 232 + spec * 23 + fiberDelta * 0.85));
          const foilG = Math.min(252, Math.max(162, 194 + spec * 44 + fiberDelta * 0.78));
          const foilB = Math.min(220, Math.max(92,  112 + spec * 68 + fiberDelta * 0.62));

          r = r + (foilR - r) * aFoil;
          g = g + (foilG - g) * aFoil;
          b = b + (foilB - b) * aFoil;
        }

        pxData[idx] = r;
        pxData[idx + 1] = g;
        pxData[idx + 2] = b;
      }
    }

    ctx.putImageData(frame, 0, 0);
  }

  /* ========================================================================
     4. LIVE PRODUCTION SERVER & INSTAGRAM DUAL QR PASS ENGINE
     ======================================================================== */
  const LIVE_PRODUCTION_ORIGIN = 'https://just-sean-flows.vercel.app';
  const INSTAGRAM_OFFICIAL_URL = 'https://instagram.com/just.sean.flows';

  const isLocalEnv =
    window.location.protocol === 'file:' ||
    /^(localhost|127\.0\.0\.1|\[::1\])$/i.test(window.location.hostname);

  const forceLocalLanQr = params.get('qr_local') === '1';
  let qrPassMode = params.get('qr') === 'ig' ? 'instagram' : 'salon';
  let tunnelBase = '';
  let lanBase = '';
  let currentUrl = '';

  function computeQrUrl() {
    if (qrPassMode === 'instagram') {
      return INSTAGRAM_OFFICIAL_URL;
    }
    if (!isLocalEnv) {
      return `${window.location.origin}/?from=qr`;
    }
    if (forceLocalLanQr) {
      const pagePath = /launch_fresh\.html/i.test(window.location.pathname) ? '/launch_fresh.html' : '/';
      if (tunnelBase) return `${tunnelBase.replace(/\/+$/, '')}${pagePath}?from=qr`;
      if (lanBase) return `${lanBase.replace(/\/+$/, '')}${pagePath}?from=qr`;
    }
    return `${LIVE_PRODUCTION_ORIGIN}/?from=qr`;
  }

  function updateModeSwitcherUi() {
    const bar = document.getElementById('jsf-qr-mode-switcher');
    if (!bar) return;
    const btns = bar.querySelectorAll('[data-qr-mode]');
    btns.forEach((b) => {
      b.classList.toggle('active', b.getAttribute('data-qr-mode') === qrPassMode);
    });
  }

  function renderPassCardCanvas() {
    const canvas = document.getElementById('jsf-illusion-qr-canvas');
    if (!canvas) return;
    currentUrl = computeQrUrl();
    renderWalnutPassCardToCanvas(canvas, currentUrl, qrPassMode);
    updateModeSwitcherUi();
  }

  window.__setJsfQrPassMode = function (nextMode) {
    qrPassMode = nextMode === 'instagram' ? 'instagram' : 'salon';
    renderPassCardCanvas();
  };

  window.__getJsfQrPassInfo = function () {
    return { mode: qrPassMode, url: currentUrl };
  };

  async function syncLocalReachableUrl() {
    if (!isLocalEnv || !forceLocalLanQr || window.location.protocol === 'file:') return;
    const endpoints = [`/__live_qr_info.json?t=${Date.now()}`, `/assets/live_tunnel_url.json?t=${Date.now()}`];
    for (const ep of endpoints) {
      try {
        const r = await fetch(ep, { cache: 'no-store' });
        if (!r.ok) continue;
        const data = await r.json();
        if (data && typeof data === 'object') {
          let changed = false;
          if (data.tunnelBase && String(data.tunnelBase).trim() !== tunnelBase) {
            tunnelBase = String(data.tunnelBase).trim();
            changed = true;
          }
          const nextLan = data.lanIp && window.location.port
            ? `http://${data.lanIp}:${window.location.port}`
            : (data.lanBase ? String(data.lanBase).trim() : '');
          if (nextLan && nextLan !== lanBase) {
            lanBase = nextLan;
            changed = true;
          }
          if (changed) renderPassCardCanvas();
          return;
        }
      } catch (_) {}
    }
  }

  function mountWalnutPassQr() {
    if (document.getElementById('jsf-pure-qr-float')) return;
    const host =
      document.getElementById('noir-signature-reveal') ||
      document.getElementById('noir-preload-curtain') ||
      document.body;

    const tile = document.createElement('div');
    tile.id = 'jsf-pure-qr-float';
    if (host === document.body) {
      tile.style.position = 'fixed';
      tile.style.zIndex = '250000';
      tile.style.width = 'min(86vw, 420px)';
      tile.style.aspectRatio = '976 / 1095';
      tile.style.height = 'auto';
    } else if (host.id === 'noir-signature-reveal') {
      host.classList.add('noir-has-illusion-qr');
    }

    const canvas = document.createElement('canvas');
    canvas.id = 'jsf-illusion-qr-canvas';
    tile.appendChild(canvas);

    // Subtle Museum Brass Pill Switcher (WEB SALON <-> INSTAGRAM + PNG Save)
    const switcher = document.createElement('div');
    switcher.id = 'jsf-qr-mode-switcher';
    switcher.className = 'jsf-qr-mode-switcher';
    switcher.innerHTML =
      '<button type="button" class="jsf-qr-mode-btn active" data-qr-mode="salon">✦ WEB SALON</button>' +
      '<button type="button" class="jsf-qr-mode-btn" data-qr-mode="instagram">◎ INSTAGRAM</button>' +
      '<button type="button" class="jsf-qr-dl-btn" title="Save 24K Gold Pass PNG" aria-label="Download QR Card PNG">↓</button>';

    switcher.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const modeBtn = ev.target.closest('[data-qr-mode]');
      if (modeBtn) {
        qrPassMode = modeBtn.getAttribute('data-qr-mode') === 'instagram' ? 'instagram' : 'salon';
        renderPassCardCanvas();
        return;
      }
      if (ev.target.closest('.jsf-qr-dl-btn')) {
        try {
          const a = document.createElement('a');
          a.download = qrPassMode === 'instagram' ? 'jsf_qr_pass_instagram.png' : 'jsf_qr_pass_web_salon.png';
          a.href = canvas.toDataURL('image/png');
          a.click();
        } catch (_) {}
      }
    });
    switcher.addEventListener('pointerdown', (ev) => ev.stopPropagation());
    switcher.addEventListener('mousedown', (ev) => ev.stopPropagation());
    switcher.addEventListener('touchstart', (ev) => ev.stopPropagation(), { passive: true });
    tile.appendChild(switcher);

    // Clicking the card on PC smoothly enters the Salon (bubbles to #noir-preload-curtain)!
    host.appendChild(tile);
    renderPassCardCanvas();

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        renderPassCardCanvas();
      }).catch(() => {});
    }

    if (isLocalEnv && forceLocalLanQr) {
      syncLocalReachableUrl();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountWalnutPassQr);
  } else {
    mountWalnutPassQr();
  }
})();
