require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/layers/TileLayer",
    "esri/Basemap",
    "dojo/domReady!",
    ], function (
    Map,
    SceneView,
    TileLayer,
    Basemap
    ) { 
        const satelliteLayer = new TileLayer({
            url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
            title: "satellite"
          })
          const fireflyLayer = new TileLayer({
            url: "https://tiles.arcgis.com/tiles/nGt4QxSblgDfeJn9/arcgis/rest/services/HalfEarthFirefly/MapServer",
            title: "half-earth-firefly"
          })

        const basemap = new Basemap({
            baseLayers: [satelliteLayer, fireflyLayer],
            title: "half-earth-basemap",
            id: "half-earth-basemap"
          });
        
          const map = new Map({
            basemap: 'satellite'
          });

          const view = new SceneView({
            map: map,
            container: "sceneContainer",
            environment: {
                atmosphereEnabled: false,
                background: {
                  type: "color",
                  color: [0,10,16]
                }
              },
            //   ui: {
            //     components: ["zoom"]
            //    }
          });

          
    });