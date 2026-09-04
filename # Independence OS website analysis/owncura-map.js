// <owncura-map> — Leaflet + OpenStreetMap, Houston metro. Owns its own mount timing.
(function () {
  var PRIMARY = "#0B6E4F", AMBER = "#C97A2B", INK = "#17211E";
  var BLANK_TILE = "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="#F1EDE5"/></svg>');

  function color(status) {
    if (status === "listed") return AMBER;
    if (status === "portfolio") return PRIMARY;
    return "#8B9490";
  }

  function money(n) {
    if (n >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
    return "$" + Math.round(n / 1e3) + "K";
  }

  function waitFor(test, cb) {
    if (test()) return cb();
    var t = setInterval(function () { if (test()) { clearInterval(t); cb(); } }, 60);
    setTimeout(function () { clearInterval(t); }, 15000);
  }

  class OwnCuraMap extends HTMLElement {
    connectedCallback() {
      if (this._booted) return;
      this._booted = true;
      this.style.display = "block";
      this.style.width = "100%";
      this.style.height = "100%";
      this.style.background = "#EDE8DE";
      var host = document.createElement("div");
      host.style.cssText = "position:absolute;inset:0;";
      this.style.position = "relative";
      this.appendChild(host);
      this._host = host;
      var self = this;
      waitFor(function () { return window.L && window.OWNCURA_CLINICS; }, function () { self._build(); });
    }

    _build() {
      var L = window.L, clinics = window.OWNCURA_CLINICS;
      var map = L.map(this._host, { zoomControl: false, scrollWheelZoom: true, attributionControl: true });
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
        attribution: "Esri, HERE, Garmin, © OpenStreetMap contributors", maxZoom: 16,
        // a blocked or missing tile degrades to blank land, never to legible error copy
        errorTileUrl: BLANK_TILE
      }).addTo(map);
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 16, opacity: 0.9, errorTileUrl: BLANK_TILE
      }).addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);
      // Narrow viewports cannot fit eleven 104px value pills without collision:
      // fall back to dot markers and hold a zoom floor so they stay separable.
      var compact = this.clientWidth > 0 && this.clientWidth < 520;
      this._compact = compact;
      map.fitBounds(clinics.map(function (c) { return [c.lat, c.lng]; }), {
        paddingTopLeft: compact ? [28, 24] : [64, 64],
        paddingBottomRight: compact ? [58, 52] : [64, 64],
        maxZoom: 11
      });
      if (compact && map.getZoom() < 9) map.setZoom(9);

      this._markers = {};
      var self = this;
      clinics.forEach(function (c) {
        var v = window.OwnCuraValue.baseline(c);
        var el = compact
          ? L.divIcon({
              className: "", iconSize: [18, 18], iconAnchor: [9, 9],
              html: '<div data-id="' + c.id + '" style="width:18px;height:18px;border-radius:50%;'
                + 'background:' + color(c.status) + ';border:2.5px solid #fff;box-sizing:border-box;'
                + 'box-shadow:0 2px 8px rgba(23,33,30,0.3);cursor:pointer;transition:transform .16s ease;"></div>'
            })
          : L.divIcon({
              className: "",
              iconSize: [104, 30],
              iconAnchor: [52, 34],
              html: '<div data-id="' + c.id + '" style="display:flex;align-items:center;justify-content:center;'
                + 'height:30px;padding:0 10px;border-radius:15px;background:#fff;border:1.5px solid ' + color(c.status)
                + ';color:' + INK + ';font:500 12px/1 \'DM Sans\',system-ui,sans-serif;letter-spacing:0.01em;'
                + 'box-shadow:0 4px 14px rgba(23,33,30,0.16);white-space:nowrap;cursor:pointer;transition:transform .16s ease;">'
                + '<span style="width:6px;height:6px;border-radius:50%;background:' + color(c.status) + ';margin-right:7px;flex:none;"></span>'
                + money(v.mid) + '</div>'
        });
        var m = L.marker([c.lat, c.lng], { icon: el, riseOnHover: true }).addTo(map);
        m.bindTooltip(
          compact ? c.name + " · " + money(v.mid) : c.name + " · " + c.specialty,
          { direction: "top", offset: compact ? [0, -12] : [0, -34], opacity: 1, permanent: false }
        );
        m.on("click", function () {
          window.dispatchEvent(new CustomEvent("owncura:select", { detail: c.id }));
          self.select(c.id);
        });
        self._markers[c.id] = m;
      });

      this._map = map;
      window.__owncuraMap = this;
      setTimeout(function () { map.invalidateSize(); }, 120);
      window.addEventListener("resize", function () { map.invalidateSize(); });
    }

    select(id) {
      if (!this._map) return;
      var self = this;
      Object.keys(this._markers).forEach(function (k) {
        var node = self._markers[k].getElement();
        if (!node) return;
        var pill = node.firstChild;
        if (!pill) return;
        var on = k === id;
        if (self._compact) {
          pill.style.transform = on ? "scale(1.55)" : "scale(1)";
          pill.style.borderColor = on ? "#17211E" : "#fff";
        } else {
          pill.style.transform = on ? "scale(1.12)" : "scale(1)";
          pill.style.background = on ? "#17211E" : "#fff";
          pill.style.color = on ? "#fff" : "#17211E";
        }
        node.style.zIndex = on ? 900 : "";
      });
      var mk = this._markers[id];
      if (mk) {
        this._map.panTo(mk.getLatLng(), { animate: true, duration: 0.5 });
        if (mk.openTooltip) mk.openTooltip();
      }
    }

    focusAll() {
      if (!this._map) return;
      this._map.fitBounds(window.OWNCURA_CLINICS.map(function (c) { return [c.lat, c.lng]; }), { padding: [64, 64], maxZoom: 11 });
    }
  }

  if (!window.customElements.get("owncura-map")) window.customElements.define("owncura-map", OwnCuraMap);
})();
