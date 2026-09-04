// <oc-map> — Leaflet, TX + CA, clustered by metro. Light/dark basemap via the `theme` attribute.
(function () {
  var GREEN = "#0F7A57", ORANGE = "#FF9500", GRAY = "#8E8E93", BLUE = "#0A84FF";
  var BASE = {
    light: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    dark: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
  };
  var REF = {
    light: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
    dark: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
  };
  function blank(fill) {
    return "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="' + fill + '"/></svg>');
  }
  function color(status) {
    if (status === "mine") return BLUE;
    if (status === "listed") return ORANGE;
    if (status === "portfolio") return GREEN;
    return GRAY;
  }
  function money(n) { return window.OCValue.money(n); }
  function waitFor(test, cb) {
    if (test()) return cb();
    var t = setInterval(function () { if (test()) { clearInterval(t); cb(); } }, 60);
    setTimeout(function () { clearInterval(t); }, 15000);
  }

  class OCMap extends HTMLElement {
    static get observedAttributes() { return ["theme", "map-focus"]; }

    connectedCallback() {
      if (this._booted) return;
      this._booted = true;
      this.style.display = "block";
      this.style.position = "relative";
      this.style.width = "100%";
      this.style.height = "100%";
      this._host = document.createElement("div");
      this._host.style.cssText = "position:absolute;inset:0;";
      this.appendChild(this._host);
      var self = this;
      waitFor(function () { return window.L && window.OC_CLINICS && window.OCValue; }, function () { self._build(); });
    }

    attributeChangedCallback(name) {
      if (!this._map) return;
      if (name === "theme") this._applyTheme();
      if (name === "map-focus") this._applyFocus();
    }

    get _dark() { return (this._theme || this.getAttribute("theme")) === "dark"; }
    get _focus() { return this._focusVal || this.getAttribute("map-focus") || "all"; }

    setTheme(v) { if (v === this._theme) return; this._theme = v; if (this._map) this._applyTheme(); }
    setFocus(v) { if (v === this._focusVal) return; this._focusVal = v; if (this._map) this._applyFocus(); }

    _applyTheme() {
      var k = this._dark ? "dark" : "light";
      var fill = this._dark ? "#1A1A1A" : "#F1EFEA";
      this._host.style.background = fill;
      this._base.setUrl(BASE[k]);
      this._base.options.errorTileUrl = blank(fill);
      this._ref.setUrl(REF[k]);
      this._ref.options.errorTileUrl = blank(fill);
      this._paint();
    }

    _applyFocus() {
      var f = this._focus;
      var set = window.OC_CLINICS, maxZoom = 5;
      if (f === "TX" || f === "CA") {
        set = window.OC_CLINICS.filter(function (c) { return c.state === f; });
        maxZoom = 7.5;
      } else if (f !== "all") {
        var found = window.OC_CLINICS.filter(function (c) { return c.metro === f; });
        if (!found.length) return;
        set = found; maxZoom = 11;
      }
      var map = this._map;
      var b = window.L.latLngBounds(this._bounds(set));
      // ONE view command per focus change: anything else races itself and gets swallowed
      map.stop();
      map.invalidateSize();
      var z = Math.min(maxZoom, map.getBoundsZoom(b, false, window.L.point(40, 54)));
      map.setView(b.getCenter(), z, { animate: false });
      this._paint();
    }

    _bounds(set) { return set.map(function (c) { return [c.lat, c.lng]; }); }

    _build() {
      var L = window.L, self = this;
      var k = this._dark ? "dark" : "light";
      var fill = this._dark ? "#1A1A1A" : "#F1EFEA";
      this._host.style.background = fill;

      var map = L.map(this._host, {
        zoomControl: false, attributionControl: false, scrollWheelZoom: true,
        zoomSnap: 0.25, tap: true, zoomAnimation: false, fadeAnimation: false
      });
      this._base = L.tileLayer(BASE[k], { maxZoom: 16, errorTileUrl: blank(fill) }).addTo(map);
      this._ref = L.tileLayer(REF[k], { maxZoom: 16, opacity: 0.9, errorTileUrl: blank(fill) }).addTo(map);
      map.fitBounds(this._bounds(window.OC_CLINICS), {
        paddingTopLeft: [34, 30], paddingBottomRight: [34, 56], maxZoom: 6, animate: false
      });

      this._pins = L.layerGroup().addTo(map);
      this._map = map;
      map.on("zoomend", function () { self._paint(); });
      window.__ocMap = this;
      var want = window.__ocMapWant;
      if (want) { this._theme = want.theme; this._focusVal = want.focus; this._applyTheme(); this._applyFocus(); }
      this._paint();
      setTimeout(function () { map.invalidateSize(); self._paint(); }, 140);
      this._ro = new ResizeObserver(function () { map.invalidateSize(); });
      this._ro.observe(this);
    }

    // Metro bubbles when zoomed out, individual pins once a metro fills the viewport.
    _paint() {
      var L = window.L, self = this, map = this._map;
      if (!map) return;
      this._pins.clearLayers();
      this._markers = {};
      var dark = this._dark;
      var card = dark ? "#1C1C1E" : "#FFFFFF";
      var ink = dark ? "#FFFFFF" : "#000000";
      var z = map.getZoom();
      var f = this._focus;

      // Below z5.6 the metro centroids are closer together than a bubble is wide,
      // so the whole-country view collapses to one bubble per state.
      if (f === "all" && z < 5.6) {
        ["TX", "CA"].forEach(function (st) {
          var set = window.OC_CLINICS.filter(function (c) { return c.state === st; });
          if (!set.length) return;
          var mine = set.some(function (c) { return c.status === "mine"; });
          var lat = set.reduce(function (a, c) { return a + c.lat; }, 0) / set.length;
          var lng = set.reduce(function (a, c) { return a + c.lng; }, 0) / set.length;
          var icon = L.divIcon({
            className: "", iconSize: [54, 54], iconAnchor: [27, 27],
            html: '<div style="width:54px;height:54px;border-radius:27px;display:flex;flex-direction:column;'
              + 'align-items:center;justify-content:center;gap:1px;background:' + (mine ? BLUE : GREEN) + ';'
              + 'color:#fff;border:3px solid ' + card + ';box-sizing:border-box;'
              + 'box-shadow:0 3px 12px rgba(0,0,0,' + (dark ? "0.6" : "0.24") + ');cursor:pointer;'
              + 'font-family:-apple-system,\'SF Pro Text\',system-ui;">'
              + '<div style="font-size:17px;font-weight:600;letter-spacing:-0.02em;line-height:1;">' + set.length + '</div>'
              + '<div style="font-size:9.5px;font-weight:600;opacity:.85;line-height:1;">' + st + '</div>'
              + '</div>'
          });
          var mk = L.marker([lat, lng], { icon: icon, zIndexOffset: 1000 + set.length }).addTo(self._pins);
          mk.bindTooltip(st + " · " + set.length + " practices", {
            direction: "top", offset: [0, -30], opacity: 1, className: "oc-tip"
          });
          mk.on("click", function () {
            self.setFocus(st);
            window.dispatchEvent(new CustomEvent("oc:state", { detail: st }));
          });
        });
        return;
      }

      if (z < 8.5) {
        var size = z < 6.6 ? 38 : 46;
        var metros = (f === "TX" || f === "CA")
          ? window.OC_METROS.filter(function (x) { return x.state === f; })
          : window.OC_METROS;
        var items = [];
        metros.forEach(function (mt) {
          var set = window.OC_CLINICS.filter(function (c) { return c.metro === mt.id; });
          if (!set.length) return;
          items.push({
            mt: mt, set: set,
            mine: set.some(function (c) { return c.status === "mine"; }),
            pt: map.latLngToLayerPoint([
              set.reduce(function (a, c) { return a + c.lat; }, 0) / set.length,
              set.reduce(function (a, c) { return a + c.lng; }, 0) / set.length
            ])
          });
        });
        // push overlapping centroids apart so no bubble is buried,
        // but never far enough to misplace it on the basemap
        var minD = size + 6, maxShift = size * 0.55;
        items.forEach(function (it) { it.pt0 = it.pt; });
        for (var pass = 0; pass < 24; pass++) {
          var moved = false;
          for (var a = 0; a < items.length; a++) {
            for (var b2 = a + 1; b2 < items.length; b2++) {
              var p = items[a].pt, q = items[b2].pt;
              var dx = q.x - p.x, dy = q.y - p.y;
              var d = Math.sqrt(dx * dx + dy * dy) || 0.01;
              if (d < minD) {
                var push = (minD - d) / 2 + 0.5;
                var ux = dx / d, uy = dy / d;
                var clampTo = function (it, np) {
                  var dxa = np.x - it.pt0.x, dya = np.y - it.pt0.y;
                  var dist = Math.sqrt(dxa * dxa + dya * dya);
                  if (dist <= maxShift) return np;
                  var k = maxShift / dist;
                  return window.L.point(it.pt0.x + dxa * k, it.pt0.y + dya * k);
                };
                items[a].pt = clampTo(items[a], window.L.point(p.x - ux * push, p.y - uy * push));
                items[b2].pt = clampTo(items[b2], window.L.point(q.x + ux * push, q.y + uy * push));
                moved = true;
              }
            }
          }
          if (!moved) break;
        }
        items.forEach(function (it) {
          var mt = it.mt, set = it.set, mine = it.mine;
          var ll = map.layerPointToLatLng(it.pt);
          var lat = ll.lat, lng = ll.lng;
          var icon = L.divIcon({
            className: "", iconSize: [size, size], iconAnchor: [size / 2, size / 2],
            html: '<div style="width:' + size + 'px;height:' + size + 'px;border-radius:' + (size / 2) + 'px;display:flex;flex-direction:column;'
              + 'align-items:center;justify-content:center;background:' + (mine ? BLUE : GREEN) + ';'
              + 'color:#fff;border:3px solid ' + card + ';box-sizing:border-box;'
              + 'box-shadow:0 3px 10px rgba(0,0,0,' + (dark ? "0.6" : "0.22") + ');cursor:pointer;'
              + 'font:600 ' + (size < 42 ? 15 : 17) + 'px/1 -apple-system,\'SF Pro Text\',system-ui;letter-spacing:-0.02em;">'
              + set.length + '</div>'
          });
          // explicit stacking so a northern cluster is never buried under its southern neighbour
          var mk = L.marker([lat, lng], { icon: icon, zIndexOffset: 500 + set.length }).addTo(self._pins);
          mk.bindTooltip(mt.name + " · " + set.length + " practices", {
            direction: "top", offset: [0, -(size / 2) - 4], opacity: 1, className: "oc-tip"
          });
          mk.on("click", function () {
            self.setFocus(mt.id);
            window.dispatchEvent(new CustomEvent("oc:metro", { detail: mt.id }));
          });
        });
        return;
      }

      window.OC_CLINICS.forEach(function (c) {
        var v = window.OCValue.value(c);
        var sel = c.id === self._selected;
        var icon = L.divIcon({
          className: "", iconSize: [30, 30], iconAnchor: [15, 15],
          html: '<div style="width:' + (sel ? 30 : 18) + 'px;height:' + (sel ? 30 : 18) + 'px;margin:'
            + (sel ? 0 : 6) + 'px;border-radius:50%;background:' + color(c.status)
            + ';border:' + (sel ? 4 : 2.5) + 'px solid ' + card + ';box-sizing:border-box;'
            + 'box-shadow:0 2px 7px rgba(0,0,0,' + (dark ? "0.65" : "0.28") + ');cursor:pointer;"></div>'
        });
        var mk = L.marker([c.lat, c.lng], { icon: icon, riseOnHover: true, zIndexOffset: sel ? 900 : 0 }).addTo(self._pins);
        mk.bindTooltip(c.name + " · " + money(v.mid), {
          direction: "top", offset: [0, -12], opacity: 1, className: "oc-tip"
        });
        mk.on("click", function () {
          self._selected = c.id;
          window.dispatchEvent(new CustomEvent("oc:clinic", { detail: c.id }));
          self._paint();
        });
        self._markers[c.id] = mk;
      });
    }

    select(id) {
      this._selected = id;
      this._paint();
      var mk = this._markers && this._markers[id];
      if (mk && this._map) this._map.panTo(mk.getLatLng(), { animate: false });
    }
  }

  if (!window.customElements.get("oc-map")) window.customElements.define("oc-map", OCMap);
})();
