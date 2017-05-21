(function myfunction() {
    'use strict';

    angular
        .module('kruskal')
        .controller('mapController', mapController);

    function mapController() {
        var self = this;
        this.isDrawing = false;
        this.canCalculate = false;
        var map = {};
        var drawInteration;
        var markerSource = new ol.source.Vector({
            features: []
        });

        var onMapSingleClick = function (evt) {
            if (self.isDrawing) {
                createMarkerOnMap(evt);
            }
        };

        var createMarkerOnMap = function (evt) {
            var marker = createMarker(evt.coordinate);
            markerSource.addFeature(marker);
        };

        var iconStyle = new ol.style.Style({
            image: new ol.style.Icon(({
                anchor: [0.5, 50],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: 'images/stolb.png'
            }))
        });

        var createMarker = function (location) {
            var markerFeature = new ol.Feature({
                geometry: new ol.geom.Point(location)
            });
            markerFeature.setStyle(iconStyle);
            return markerFeature;
        };

        this.clear = function () {
            markerSource.clear();
            self.canCalculate = false;
            self.isDrawing = false;
        };

        this.initialize = function () {
            createMap();
        };


        this.setDrawMode = function (allow) {
            this.isDrawing = allow;
            if (!allow) {
                self.canCalculate = true;
            }
        };

        this.calculate = function () {
            alert("you lox")
        }

        var createMap = function () {
            map = new ol.Map({
                target: 'map',
                renderer: 'canvas',
                layers: [
                    new ol.layer.Tile({
                        source: new ol.source.OSM()
                    }),
                    new ol.layer.Vector({
                        source: markerSource
                    })
                ],
                view: new ol.View({
                    center: ol.proj.fromLonLat([32.542, 48.695]),
                    zoom: 6
                })
            });
            map.on('singleclick', onMapSingleClick);
        };
    };
})();