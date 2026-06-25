(function () {
  'use strict';

  const STORAGE_KEY = 'archapps_qr_scanner_history';
  const MAX_HISTORY = 100;
  const SCAN_INTERVAL = 200;

  const els = {
    tabs: document.querySelectorAll('.scanner-tab'),
    panels: {
      scan: document.getElementById('scanPanel'),
      manual: document.getElementById('manualPanel'),
      history: document.getElementById('historyPanel')
    },
    video: document.getElementById('cameraView'),
    canvas: document.getElementById('scanCanvas'),
    placeholder: document.getElementById('cameraPlaceholder'),
    error: document.getElementById('cameraError'),
    errorMsg: document.getElementById('cameraErrorMsg'),
    startBtn: document.getElementById('startCameraBtn'),
    retryBtn: document.getElementById('retryCameraBtn'),
    torchBtn: document.getElementById('torchBtn'),
    cameraBtn: document.getElementById('cameraBtn'),
    scanResult: document.getElementById('scanResult'),
    resultType: document.getElementById('resultType'),
    resultContent: document.getElementById('resultContent'),
    resultClose: document.getElementById('resultCloseBtn'),
    copyResult: document.getElementById('copyResultBtn'),
    openUrl: document.getElementById('openUrlBtn'),
    resultToast: document.getElementById('resultToast'),
    manualBarcode: document.getElementById('manualBarcode'),
    manualSubmit: document.getElementById('manualSubmitBtn'),
    manualResult: document.getElementById('manualResult'),
    manualResultNumber: document.getElementById('manualResultNumber'),
    manualResultType: document.getElementById('manualResultType'),
    manualResultPrefixRow: document.getElementById('manualResultPrefixRow'),
    manualResultPrefix: document.getElementById('manualResultPrefix'),
    manualCopy: document.getElementById('manualCopyBtn'),
    historyList: document.getElementById('historyList'),
    historyEmpty: document.getElementById('historyEmpty'),
    historyCount: document.getElementById('historyCount'),
    clearHistory: document.getElementById('clearHistoryBtn')
  };

  var stream = null;
  var scanTimer = null;
  var currentFacing = 'environment';
  var lastScanned = '';
  var scanCooldown = false;

  function loadHistory() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (e) { return []; }
  }

  function saveHistory(entries) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_HISTORY)));
    } catch (e) {}
  }

  function addToHistory(type, value) {
    var entries = loadHistory();
    entries.unshift({ type: type, value: value, time: Date.now() });
    if (entries.length > MAX_HISTORY) entries.length = MAX_HISTORY;
    saveHistory(entries);
    renderHistory();
    updateHistoryCount();
  }

  function updateHistoryCount() {
    var n = loadHistory().length;
    els.historyCount.textContent = n;
    var acts = els.clearHistory.parentElement;
    if (n > 0) acts.removeAttribute('hidden');
    else acts.setAttribute('hidden', '');
  }

  function renderHistory() {
    var entries = loadHistory();
    els.historyList.innerHTML = '';

    if (entries.length === 0) {
      var empty = document.createElement('div');
      empty.className = 'history-empty';
      empty.innerHTML = '<p>No scans yet. Point your camera at a QR code or barcode to start.</p>';
      els.historyList.appendChild(empty);
      return;
    }

    entries.forEach(function (entry, idx) {
      var item = document.createElement('div');
      item.className = 'history-item';

      var info = document.createElement('div');
      info.className = 'history-item-info';

      var type = document.createElement('div');
      type.className = 'history-item-type';
      type.textContent = entry.type;

      var val = document.createElement('div');
      val.className = 'history-item-value';
      val.textContent = entry.value;

      var time = document.createElement('div');
      time.className = 'history-item-time';
      time.textContent = new Date(entry.time).toLocaleString();

      info.appendChild(type);
      info.appendChild(val);
      info.appendChild(time);

      var del = document.createElement('button');
      del.className = 'history-item-delete';
      del.setAttribute('aria-label', 'Delete');
      del.textContent = '\u00D7';
      del.addEventListener('click', function () {
        var entries = loadHistory();
        entries.splice(idx, 1);
        saveHistory(entries);
        renderHistory();
        updateHistoryCount();
      });

      item.appendChild(info);
      item.appendChild(del);

      item.addEventListener('dblclick', function () {
        showScanResult(entry.type, entry.value);
      });

      els.historyList.appendChild(item);
    });
  }

  function showScanResult(type, value) {
    els.scanResult.removeAttribute('hidden');
    els.resultType.textContent = type;

    var parsed = parseQRContent(value);
    if (parsed) {
      els.resultContent.innerHTML = parsed.html;
      if (parsed.url) {
        els.openUrl.removeAttribute('hidden');
        els.openUrl.onclick = function () { window.open(parsed.url, '_blank', 'noopener'); };
      } else {
        els.openUrl.setAttribute('hidden', '');
      }
    } else {
      els.resultContent.textContent = value;
      els.openUrl.setAttribute('hidden', '');
    }

    lastScanned = value;
    scanCooldown = true;
    setTimeout(function () { scanCooldown = false; }, 1500);
  }

  function parseQRContent(text) {
    var urlMatch = text.match(/^(https?:\/\/[^\s]+)$/i);
    if (urlMatch) {
      return {
        html: '<div class="result-field"><span class="result-field-label">URL</span><span class="result-field-value"><a href="' + escapeAttr(urlMatch[0]) + '" target="_blank" rel="noopener">' + escapeHtml(urlMatch[0]) + '</a></span></div>',
        url: urlMatch[0]
      };
    }

    var wifiMatch = text.match(/^WIFI:(?:T:)?([^;]*);?S:([^;]*);?P:([^;]*);?(?:H:([^;]*))?;?/i);
    if (wifiMatch) {
      var auth = wifiMatch[1] || '';
      var authLabel = auth === 'WPA' ? 'WPA/WPA2' : auth === 'WEP' ? 'WEP' : 'Open';
      var html = '<div class="result-field"><span class="result-field-label">Network</span><span class="result-field-value">' + escapeHtml(decodeURIComponent(wifiMatch[2] || '')) + '</span></div>';
      html += '<div class="result-field"><span class="result-field-label">Security</span><span class="result-field-value">' + escapeHtml(authLabel) + '</span></div>';
      if (wifiMatch[3]) {
        html += '<div class="result-field"><span class="result-field-label">Password</span><span class="result-field-value">' + escapeHtml(decodeURIComponent(wifiMatch[3])) + '</span></div>';
      }
      return { html: html, url: null };
    }

    if (text.startsWith('BEGIN:VCARD') || text.startsWith('BEGIN:VCARD\r\n')) {
      return parseVCard(text);
    }

    if (text.startsWith('MATMSG:') || text.startsWith('mailto:')) {
      return parseEmail(text);
    }

    if (text.startsWith('SMSTO:') || text.startsWith('smsto:') || text.startsWith('sms:')) {
      return parseSMS(text);
    }

    if (text.startsWith('tel:')) {
      return {
        html: '<div class="result-field"><span class="result-field-label">Phone</span><span class="result-field-value">' + escapeHtml(text.substring(4)) + '</span></div>',
        url: null
      };
    }

    if (text.startsWith('GEO:')) {
      return {
        html: '<div class="result-field"><span class="result-field-label">Location</span><span class="result-field-value">' + escapeHtml(text) + '</span></div>',
        url: null
      };
    }

    return null;
  }

  function parseVCard(text) {
    var lines = text.split(/[\r\n]+/);
    var fields = {};
    lines.forEach(function (line) {
      var m = line.match(/^(FN|N|TEL|EMAIL|URL|ORG|TITLE|ADR|NOTE):(.*)/i);
      if (m) fields[m[1].toUpperCase()] = m[2].trim();
    });
    var html = '';
    if (fields.FN) html += '<div class="result-field"><span class="result-field-label">Name</span><span class="result-field-value">' + escapeHtml(fields.FN) + '</span></div>';
    if (fields.TEL) html += '<div class="result-field"><span class="result-field-label">Phone</span><span class="result-field-value">' + escapeHtml(fields.TEL) + '</span></div>';
    if (fields.EMAIL) html += '<div class="result-field"><span class="result-field-label">Email</span><span class="result-field-value">' + escapeHtml(fields.EMAIL) + '</span></div>';
    if (fields.URL) html += '<div class="result-field"><span class="result-field-label">Website</span><span class="result-field-value">' + escapeHtml(fields.URL) + '</span></div>';
    if (!html) html = '<span>' + escapeHtml(text) + '</span>';
    return { html: html, url: null };
  }

  function parseEmail(text) {
    var addr = text;
    if (addr.startsWith('MATMSG:TO:')) addr = addr.substring(10).split(';')[0];
    if (addr.startsWith('mailto:')) addr = addr.substring(7);
    return {
      html: '<div class="result-field"><span class="result-field-label">Email</span><span class="result-field-value">' + escapeHtml(addr) + '</span></div>',
      url: null
    };
  }

  function parseSMS(text) {
    var num = text.replace(/^SMS(TO)?:/i, '');
    return {
      html: '<div class="result-field"><span class="result-field-label">SMS</span><span class="result-field-value">' + escapeHtml(num) + '</span></div>',
      url: null
    };
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function escapeAttr(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function showToast(msg) {
    els.resultToast.textContent = msg;
    els.resultToast.classList.add('show');
    setTimeout(function () { els.resultToast.classList.remove('show'); }, 1800);
  }

  els.resultClose.addEventListener('click', function () {
    els.scanResult.setAttribute('hidden', '');
    lastScanned = '';
  });

  els.copyResult.addEventListener('click', function () {
    var val = els.resultContent.textContent.trim();
    if (!val) return;
    navigator.clipboard.writeText(val).then(function () {
      showToast('Copied');
    }).catch(function () {
      showToast('Copy failed');
    });
  });

  els.manualSubmit.addEventListener('click', function () {
    var num = els.manualBarcode.value.trim();
    if (!num) return;
    processManualBarcode(num);
  });

  els.manualBarcode.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      var num = els.manualBarcode.value.trim();
      if (num) processManualBarcode(num);
    }
  });

  function processManualBarcode(num) {
    var type = detectBarcodeType(num);
    els.manualResult.removeAttribute('hidden');
    els.manualResultNumber.textContent = num;
    els.manualResultType.textContent = type;

    var prefix = getCountryPrefix(num);
    if (prefix) {
      els.manualResultPrefixRow.removeAttribute('hidden');
      els.manualResultPrefix.textContent = prefix;
    } else {
      els.manualResultPrefixRow.setAttribute('hidden', '');
    }

    addToHistory(type, num);
  }

  els.manualCopy.addEventListener('click', function () {
    var num = els.manualResultNumber.textContent;
    navigator.clipboard.writeText(num).then(function () {
      showToast('Copied');
    }).catch(function () {
      showToast('Copy failed');
    });
  });

  function detectBarcodeType(num) {
    var len = num.length;
    if (/^\d{12}$/.test(num)) return 'UPC-A';
    if (/^\d{6}$/.test(num)) return 'UPC-E';
    if (/^\d{8}$/.test(num)) return 'EAN-8';
    if (/^\d{13}$/.test(num)) return 'EAN-13';
    if (/^\d{14}$/.test(num)) return 'ITF-14';
    if (/^[0-9A-Za-z\-$:/.+ ]+$/.test(num) && len >= 1 && len <= 48) return 'Code 128';
    if (/^[A-Z0-9\-. $/+%]+$/.test(num) && len >= 1 && len <= 43) return 'Code 39';
    return len <= 8 ? 'Short code' : len <= 14 ? 'Barcode' : 'Unknown format';
  }

  function getCountryPrefix(num) {
    if (!/^\d{12,14}$/.test(num)) return null;
    var prefix3 = num.substring(0, 3);
    var map = {
      '000': 'USA', '001': 'USA', '002': 'USA', '003': 'USA', '004': 'USA',
      '005': 'USA', '006': 'USA', '007': 'USA', '008': 'USA', '009': 'USA',
      '010': 'USA', '011': 'USA', '012': 'USA', '013': 'USA', '019': 'USA',
      '030': 'USA', '031': 'USA', '032': 'USA', '033': 'USA', '034': 'USA',
      '035': 'USA', '036': 'USA', '037': 'USA', '038': 'USA', '039': 'USA',
      '060': 'USA', '061': 'USA', '062': 'USA', '063': 'USA', '064': 'USA',
      '065': 'USA', '066': 'USA', '067': 'USA', '068': 'USA', '069': 'USA',
      '070': 'Norway', '080': 'Italy', '081': 'Italy', '082': 'Italy', '083': 'Italy',
      '084': 'Spain', '200': 'France', '201': 'France', '202': 'France', '203': 'France',
      '204': 'France', '205': 'France', '206': 'France', '207': 'France', '208': 'France',
      '209': 'France', '300': 'France', '301': 'France', '302': 'France', '303': 'France',
      '304': 'France', '305': 'France', '306': 'France', '307': 'France', '308': 'France',
      '309': 'France', '310': 'France', '311': 'France', '312': 'France', '313': 'France',
      '314': 'France', '315': 'France', '316': 'France', '317': 'France', '318': 'France',
      '319': 'France', '320': 'France', '321': 'France', '322': 'France', '323': 'France',
      '324': 'France', '325': 'France', '326': 'France', '327': 'France', '328': 'France',
      '329': 'France', '330': 'France', '331': 'France', '332': 'France', '333': 'France',
      '334': 'France', '335': 'France', '336': 'France', '337': 'France', '338': 'France',
      '339': 'France', '340': 'France', '341': 'France', '342': 'France', '343': 'France',
      '344': 'France', '345': 'France', '346': 'France', '347': 'France', '348': 'France',
      '349': 'France', '350': 'France', '351': 'France', '352': 'France', '353': 'France',
      '354': 'France', '355': 'France', '356': 'France', '357': 'France', '358': 'France',
      '359': 'France', '360': 'France', '361': 'France', '362': 'France', '363': 'France',
      '364': 'France', '365': 'France', '366': 'France', '367': 'France', '368': 'France',
      '369': 'France', '370': 'France', '371': 'France', '372': 'France', '373': 'France',
      '374': 'France', '375': 'France', '376': 'France', '377': 'France', '378': 'France',
      '379': 'France', '380': 'Bulgaria', '383': 'Slovenia', '385': 'Croatia',
      '387': 'Bosnia-Herzegovina', '400': 'Germany', '401': 'Germany', '402': 'Germany',
      '403': 'Germany', '404': 'Germany', '405': 'Germany', '406': 'Germany',
      '407': 'Germany', '408': 'Germany', '409': 'Germany', '410': 'Germany',
      '411': 'Germany', '412': 'Germany', '413': 'Germany', '414': 'Germany',
      '415': 'Germany', '416': 'Germany', '417': 'Germany', '418': 'Germany',
      '419': 'Germany', '420': 'Germany', '421': 'Germany', '422': 'Germany',
      '423': 'Germany', '424': 'Germany', '425': 'Germany', '426': 'Germany',
      '427': 'Germany', '428': 'Germany', '429': 'Germany', '430': 'Germany',
      '431': 'Germany', '432': 'Germany', '433': 'Germany', '434': 'Germany',
      '435': 'Germany', '436': 'Germany', '437': 'Germany', '438': 'Germany',
      '439': 'Germany', '440': 'Germany', '450': 'Japan', '451': 'Japan',
      '452': 'Japan', '453': 'Japan', '454': 'Japan', '455': 'Japan',
      '456': 'Japan', '457': 'Japan', '458': 'Japan', '459': 'Japan',
      '460': 'Russia', '461': 'Russia', '462': 'Russia', '463': 'Russia',
      '464': 'Russia', '465': 'Russia', '466': 'Russia', '467': 'Russia',
      '468': 'Russia', '469': 'Russia', '470': 'Kyrgyzstan', '471': 'Taiwan',
      '474': 'Estonia', '475': 'Latvia', '476': 'Azerbaijan', '477': 'Lithuania',
      '478': 'Uzbekistan', '479': 'Sri Lanka', '480': 'Philippines',
      '481': 'Belarus', '482': 'Ukraine', '484': 'Moldova', '485': 'Armenia',
      '486': 'Georgia', '487': 'Kazakhstan', '489': 'Hong Kong',
      '490': 'Japan', '491': 'Japan', '492': 'Japan', '493': 'Japan',
      '494': 'Japan', '495': 'Japan', '496': 'Japan', '497': 'Japan',
      '498': 'Japan', '499': 'Japan', '500': 'UK', '501': 'UK',
      '502': 'UK', '503': 'UK', '504': 'UK', '505': 'UK', '506': 'UK',
      '507': 'UK', '508': 'UK', '509': 'UK', '520': 'Greece',
      '528': 'Lebanon', '529': 'Cyprus', '531': 'Macedonia', '535': 'Malta',
      '539': 'Ireland', '540': 'Belgium', '541': 'Belgium', '542': 'Belgium',
      '543': 'Belgium', '544': 'Belgium', '545': 'Belgium', '546': 'Belgium',
      '547': 'Belgium', '548': 'Belgium', '549': 'Belgium', '560': 'Portugal',
      '569': 'Iceland', '570': 'Denmark', '571': 'Denmark', '572': 'Denmark',
      '573': 'Denmark', '574': 'Denmark', '575': 'Denmark', '576': 'Denmark',
      '577': 'Denmark', '578': 'Denmark', '579': 'Denmark', '590': 'Poland',
      '594': 'Romania', '599': 'Hungary', '600': 'South Africa',
      '601': 'South Africa', '603': 'Ghana', '608': 'Bahrain', '609': 'Mauritius',
      '611': 'Morocco', '613': 'Algeria', '616': 'Kenya', '619': 'Tunisia',
      '621': 'Syria', '622': 'Egypt', '624': 'Libya', '625': 'Jordan',
      '626': 'Iran', '627': 'Kuwait', '628': 'Saudi Arabia', '629': 'UAE',
      '640': 'Finland', '641': 'Finland', '642': 'Finland', '643': 'Finland',
      '644': 'Finland', '645': 'Finland', '646': 'Finland', '647': 'Finland',
      '648': 'Finland', '649': 'Finland', '690': 'China', '691': 'China',
      '692': 'China', '693': 'China', '694': 'China', '695': 'China',
      '696': 'China', '697': 'China', '698': 'China', '699': 'China',
      '700': 'Norway', '701': 'Norway', '702': 'Norway', '703': 'Norway',
      '704': 'Norway', '705': 'Norway', '706': 'Norway', '707': 'Norway',
      '708': 'Norway', '709': 'Norway', '729': 'Israel', '730': 'Sweden',
      '731': 'Sweden', '732': 'Sweden', '733': 'Sweden', '734': 'Sweden',
      '735': 'Sweden', '736': 'Sweden', '737': 'Sweden', '738': 'Sweden',
      '739': 'Sweden', '740': 'Guatemala', '741': 'El Salvador',
      '742': 'Honduras', '743': 'Nicaragua', '744': 'Costa Rica',
      '745': 'Panama', '746': 'Dominican Rep.', '750': 'Mexico',
      '759': 'Venezuela', '760': 'Switzerland', '761': 'Switzerland',
      '762': 'Switzerland', '763': 'Switzerland', '764': 'Switzerland',
      '765': 'Switzerland', '766': 'Switzerland', '767': 'Switzerland',
      '768': 'Switzerland', '769': 'Switzerland', '770': 'Colombia',
      '773': 'Uruguay', '775': 'Peru', '777': 'Bolivia', '779': 'Argentina',
      '780': 'Chile', '784': 'Paraguay', '786': 'Ecuador', '789': 'Brazil',
      '790': 'Brazil', '800': 'Italy', '801': 'Italy', '802': 'Italy',
      '803': 'Italy', '804': 'Italy', '805': 'Italy', '806': 'Italy',
      '807': 'Italy', '808': 'Italy', '809': 'Italy', '810': 'Italy',
      '811': 'Italy', '812': 'Italy', '813': 'Italy', '814': 'Italy',
      '815': 'Italy', '816': 'Italy', '817': 'Italy', '818': 'Italy',
      '819': 'Italy', '820': 'Italy', '821': 'Italy', '822': 'Italy',
      '823': 'Italy', '824': 'Italy', '825': 'Italy', '826': 'Italy',
      '827': 'Italy', '828': 'Italy', '829': 'Italy', '830': 'Italy',
      '831': 'Italy', '832': 'Italy', '833': 'Italy', '834': 'Italy',
      '835': 'Italy', '836': 'Italy', '837': 'Italy', '838': 'Italy',
      '839': 'Italy', '840': 'Spain', '841': 'Spain', '842': 'Spain',
      '843': 'Spain', '844': 'Spain', '845': 'Spain', '846': 'Spain',
      '847': 'Spain', '848': 'Spain', '849': 'Spain', '850': 'Cuba',
      '858': 'Slovakia', '859': 'Czech Rep.', '860': 'Serbia',
      '865': 'Mongolia', '867': 'North Korea', '869': 'Turkey',
      '870': 'Netherlands', '871': 'Netherlands', '872': 'Netherlands',
      '873': 'Netherlands', '874': 'Netherlands', '875': 'Netherlands',
      '876': 'Netherlands', '877': 'Netherlands', '878': 'Netherlands',
      '879': 'Netherlands', '880': 'South Korea', '884': 'Cambodia',
      '885': 'Thailand', '888': 'Singapore', '890': 'India',
      '893': 'Vietnam', '899': 'Indonesia', '900': 'Austria',
      '901': 'Austria', '902': 'Austria', '903': 'Austria', '904': 'Austria',
      '905': 'Austria', '906': 'Austria', '907': 'Austria', '908': 'Austria',
      '909': 'Austria', '910': 'Austria', '911': 'Austria', '912': 'Austria',
      '913': 'Austria', '914': 'Austria', '915': 'Austria', '916': 'Austria',
      '917': 'Austria', '918': 'Austria', '919': 'Austria', '930': 'Australia',
      '931': 'Australia', '932': 'Australia', '933': 'Australia',
      '934': 'Australia', '935': 'Australia', '936': 'Australia',
      '937': 'Australia', '938': 'Australia', '939': 'Australia',
      '940': 'New Zealand', '941': 'New Zealand', '942': 'New Zealand',
      '943': 'New Zealand', '944': 'New Zealand', '945': 'New Zealand',
      '946': 'New Zealand', '947': 'New Zealand', '948': 'New Zealand',
      '949': 'New Zealand', '955': 'Malaysia', '958': 'Macau',
      '590': 'Poland', '594': 'Romania', '599': 'Hungary'
    };
    return map[prefix3] || null;
  }

  els.clearHistory.addEventListener('click', function () {
    saveHistory([]);
    renderHistory();
    updateHistoryCount();
  });

  // Camera
  function startCamera() {
    stopCamera();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showError('Camera access is not supported in this browser.');
      return;
    }

    els.placeholder.classList.add('hidden');
    els.error.setAttribute('hidden', '');

    var constraints = {
      video: {
        facingMode: currentFacing,
        width: { ideal: 1280 },
        height: { ideal: 1280 }
      },
      audio: false
    };

    navigator.mediaDevices.getUserMedia(constraints).then(function (s) {
      stream = s;
      els.video.srcObject = s;
      els.video.classList.add('active');
      els.torchBtn.disabled = false;

      s.getVideoTracks().forEach(function (track) {
        if (typeof track.applyConstraints === 'function') {
          try {
            var cap = track.getCapabilities();
            if (!cap.torch || cap.torch.length === 0) {
              els.torchBtn.disabled = true;
            }
          } catch (e) {}
        }
      });

      startScanning();
    }).catch(function (err) {
      showError('Camera access denied or unavailable. Please grant camera permission in your browser settings.');
    });
  }

  function stopCamera() {
    stopScanning();
    if (stream) {
      stream.getTracks().forEach(function (t) { t.stop(); });
      stream = null;
    }
    els.video.classList.remove('active');
    els.video.srcObject = null;
    els.torchBtn.disabled = true;
    els.torchBtn.classList.remove('active');
  }

  function showError(msg) {
    els.error.removeAttribute('hidden');
    els.errorMsg.textContent = msg;
    els.placeholder.classList.add('hidden');
  }

  function startScanning() {
    stopScanning();
    scanTimer = setInterval(scanFrame, SCAN_INTERVAL);
  }

  function stopScanning() {
    if (scanTimer) {
      clearInterval(scanTimer);
      scanTimer = null;
    }
  }

  function scanFrame() {
    if (els.video.readyState < els.video.HAVE_ENOUGH_DATA) return;
    if (scanCooldown) return;

    var vw = els.video.videoWidth;
    var vh = els.video.videoHeight;
    if (vw === 0 || vh === 0) return;

    els.canvas.width = vw;
    els.canvas.height = vh;

    var ctx = els.canvas.getContext('2d');
    ctx.drawImage(els.video, 0, 0, vw, vh);
    var imageData = ctx.getImageData(0, 0, vw, vh);

    try {
      var code = jsQR(imageData.data, vw, vh, { inversionAttempts: 'attemptBoth' });
      if (code && code.data !== lastScanned) {
        var data = code.data;
        if (data !== lastScanned) {
          showScanResult('QR Code', data);
          addToHistory('QR Code', data);
        }
      }
    } catch (e) {}
  }

  els.torchBtn.addEventListener('click', function () {
    if (!stream) return;
    stream.getVideoTracks().forEach(function (track) {
      try {
        var cap = track.getCapabilities();
        if (cap.torch && cap.torch.length > 0) {
          track.applyConstraints({
            advanced: [{ torch: !els.torchBtn.classList.contains('active') }]
          }).then(function () {
            els.torchBtn.classList.toggle('active');
          }).catch(function () {});
        }
      } catch (e) {}
    });
  });

  els.cameraBtn.addEventListener('click', function () {
    currentFacing = currentFacing === 'environment' ? 'user' : 'environment';
    startCamera();
  });

  els.startBtn.addEventListener('click', startCamera);
  els.retryBtn.addEventListener('click', startCamera);

  // Tab switching
  els.tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = tab.getAttribute('data-tab');
      els.tabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');

      Object.keys(els.panels).forEach(function (key) {
        els.panels[key].classList.remove('active');
      });

      if (target === 'scan') {
        els.panels.scan.classList.add('active');
        startCamera();
      } else if (target === 'manual') {
        els.panels.manual.classList.add('active');
        stopCamera();
        els.placeholder.classList.add('hidden');
        els.error.setAttribute('hidden', '');
      } else if (target === 'history') {
        els.panels.history.classList.add('active');
        stopCamera();
        els.placeholder.classList.add('hidden');
        els.error.setAttribute('hidden', '');
        renderHistory();
      }
    });
  });

  // Init
  updateHistoryCount();

  // Start camera on scan tab by default
  startCamera();
})();
