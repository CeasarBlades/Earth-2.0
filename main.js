require([
    // Imports from ArcGis Library
    "esri/Map",
    "esri/views/SceneView",
    "esri/layers/TileLayer",
    "esri/Basemap",
    "esri/layers/FeatureLayer",
    "esri/widgets/LayerList",
    "esri/request",
    "esri/Graphic",
    "dojo/domReady!",
    ], function (
        // Declared functions for the Imports
    Map,
    SceneView,
    TileLayer,
    Basemap,
    FeatureLayer,
    LayerList,
    request,
    Graphic
    ) { 
        // Map and Globe layout with zoom on to the cities and landmaass
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
        
        const rangelands = new TileLayer({
            url: 'https://tiles.arcgis.com/tiles/IkktFdUAcY3WrH25/arcgis/rest/services/gHM_Rangeland_inverted/MapServer'
          })

        const protected = new FeatureLayer({
            url: 'https://services5.arcgis.com/Mj0hjvkNtV7NRhA7/arcgis/rest/services/WDPA_v0/FeatureServer/1'
          })
        
        const map = new Map({
            basemap: basemap,
            layers: [protected, rangelands]

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
          const layerList = new LayerList({
            view: view
          });
          
          view.ui.add(layerList, {
            position: "top-right"
          });
          
          // Forms for uploadeds content onto the app 

          const uploadForm = document.getElementById("uploadForm");

          uploadForm.addEventListener("change", function (event) {
            const filePath = event.target.value.toLowerCase();
            //only accept .zip files
            if (filePath.indexOf(".zip") !== -1) {
                generateFeatureCollection(uploadForm)
            } 
          });
        //    Function for the form to send data to the server and return
          function generateFeatureCollection(uploadFormNode) {
            const generateRequestParams = {
                filetype: "shapefile",
                  publishParameters: JSON.stringify({
                  targetSR: view.spatialReference
                }),
                f: "json"
              };
            request("https://www.arcgis.com/sharing/rest/content/features/generate", {
             query: generateRequestParams,
             body: uploadFormNode,
             responseType: "json"
            }).then(function (response) {
                addShapefileToMap(response.data.featureCollection);
                console.log(response)
                })
            }
            // Creates graphics (layer and graphics)
            function createFeaturesGraphics(layer) {
                console.log(layer)
                return layer.featureSet.features.map(function (feature) {
                  return Graphic.fromJSON(feature);
                });
              }
            function createFeatureLayerFromGraphic(graphics) {
                return new FeatureLayer({
                  objectIdField: "FID",
                  source: graphics,
                  title: 'User uploaded shapefile'
                });
              }
            //    This function takes the zip file and implements it onto the Globe and Map
              function addShapefileToMap(featureCollection) {
                let sourceGraphics = [];
                const collectionLayers = featureCollection.layers;
                const mapLayers = collectionLayers.map(function (layer) {
                  const graphics = createFeaturesGraphics(layer);
                  sourceGraphics = sourceGraphics.concat(graphics);
                  const featureLayer = createFeatureLayerFromGraphic(graphics)
                  return featureLayer;
                });
                map.addMany(mapLayers);
                view.goTo({target: sourceGraphics, tilt: 40});
              }
              
    });