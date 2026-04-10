import { useEffect, useRef, useState, useCallback } from 'react';
import useDebounce from '../hooks/useDebounce';
import LayerToggle from './LayerToggle';
import LocationButton from './LocationButton';

const WINDY_API_KEY = import.meta.env.VITE_WINDY_API_KEY;

// Valid Windy Embed API v4 overlay identifiers
const WINDY_LAYERS = {
  wind:   'wind',
  rain:   'rain',
  temp:   'temp',
  clouds: 'clouds',
};

// ---- Module-level store reference ----
// Stored outside React so layer-change clicks always get the live object,
// no closure or stale-ref issues.
let _windyStore = null;
let _windyBroadcast = null;

const WeatherMap = ({ lat, lon, onLocationSelect, onError }) => {
  const mapContainerRef = useRef(null);
  const leafletMapRef   = useRef(null);
  const markerRef       = useRef(null);
  const initializedRef  = useRef(false);

  const [activeLayer,   setActiveLayer]   = useState('wind');
  const [mapReady,      setMapReady]      = useState(false);
  const [clickedCoords, setClickedCoords] = useState(null);

  const debouncedSelect = useDebounce(
    useCallback((cLat, cLon) => onLocationSelect(cLat, cLon), [onLocationSelect]),
    400
  );

  // ---- Place / move pulsing marker ----
  const placeMarker = useCallback((map, mLat, mLon) => {
    if (!window.L) return;
    if (markerRef.current) {
      markerRef.current.setLatLng([mLat, mLon]);
    } else {
      const icon = window.L.divIcon({
        className: '',
        html: `<div class="marker-pin"><div class="marker-pulse"></div></div>`,
        iconSize:   [24, 24],
        iconAnchor: [12, 12],
      });
      markerRef.current = window.L.marker([mLat, mLon], { icon }).addTo(map);
    }
  }, []);

  // ---- Initialize Windy map ----
  const initWindy = useCallback(() => {
    if (initializedRef.current) return;
    if (!window.windyInit)      return;
    if (!mapContainerRef.current) return;

    initializedRef.current = true;

    const options = {
      key:       WINDY_API_KEY,
      lat,
      lon,
      zoom:      8,
      overlay:   'wind',   // always start on wind; user can switch via buttons
      level:     'surface',
      timestamp: Date.now(),
    };

    try {
      window.windyInit(options, (windyAPI) => {
        // Save to module-level vars — no React closure involved
        _windyStore     = windyAPI.store;
        _windyBroadcast = windyAPI.broadcast;
        leafletMapRef.current = windyAPI.map;

        placeMarker(windyAPI.map, lat, lon);

        windyAPI.map.on('click', (e) => {
          const cLat = parseFloat(e.latlng.lat.toFixed(4));
          const cLon = parseFloat(e.latlng.lng.toFixed(4));
          setClickedCoords({ lat: cLat, lon: cLon });
          placeMarker(windyAPI.map, cLat, cLon);
          debouncedSelect(cLat, cLon);
        });

        setMapReady(true);
      });
    } catch (err) {
      console.error('windyInit error:', err);
      initializedRef.current = false;
      onError?.('Map failed to initialize. Weather data is still shown below.');
    }
  }, [lat, lon, placeMarker, debouncedSelect, onError]);

  // ---- Poll for windyInit — scripts are in index.html but callback is async ----
  useEffect(() => {
    if (window.windyInit) { initWindy(); return; }

    let elapsed = 0;
    const INTERVAL = 200;
    const MAX_WAIT = 15000;

    const poll = setInterval(() => {
      elapsed += INTERVAL;
      if (window.windyInit) { clearInterval(poll); initWindy(); return; }
      if (elapsed >= MAX_WAIT) {
        clearInterval(poll);
        onError?.('Map took too long to load. Weather data is still shown below.');
      }
    }, INTERVAL);

    return () => clearInterval(poll);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- Pan when parent changes coords (geolocation) ----
  useEffect(() => {
    if (leafletMapRef.current && mapReady) {
      leafletMapRef.current.flyTo([lat, lon], 8, { animate: true, duration: 1 });
      placeMarker(leafletMapRef.current, lat, lon);
    }
  }, [lat, lon, mapReady, placeMarker]);

  // ---- Switch overlay layer ----
  // Uses module-level _windyStore — always the live object, never stale
  const handleLayerChange = useCallback((layerId) => {
    setActiveLayer(layerId);

    const overlayName = WINDY_LAYERS[layerId];
    if (!overlayName) return;

    if (_windyStore) {
      try {
        // store.set is self-broadcasting — no manual fire needed
        _windyStore.set('overlay', overlayName);
      } catch (e) {
        console.warn('Windy layer switch failed:', e);
      }
    }
  }, []); // stable — no React deps needed

  // ---- Geolocation ----
  const handleLocationFound = useCallback((uLat, uLon) => {
    if (leafletMapRef.current) {
      leafletMapRef.current.flyTo([uLat, uLon], 10, { animate: true, duration: 1.5 });
      placeMarker(leafletMapRef.current, uLat, uLon);
    }
    onLocationSelect(uLat, uLon);
  }, [placeMarker, onLocationSelect]);

  return (
    <div className="weather-map-wrapper">
      {/* Controls float above EVERYTHING — z-index handled in CSS */}
      <div className="map-controls">
        <LayerToggle activeLayer={activeLayer} onLayerChange={handleLayerChange} />
        <LocationButton
          onLocationFound={handleLocationFound}
          onError={(msg) => onError?.(msg)}
        />
      </div>

      {clickedCoords && (
        <div className="coords-badge">
          {clickedCoords.lat.toFixed(3)}°, {clickedCoords.lon.toFixed(3)}°
        </div>
      )}

      {/* id="windy" is REQUIRED by Windy API — do not rename */}
      <div id="windy" ref={mapContainerRef} className="windy-map" />

      {!mapReady && (
        <div className="map-loading-overlay">
          <div className="map-loading-spinner">
            <div className="spinner-ring" />
            <p>Loading interactive map…</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherMap;
