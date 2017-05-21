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
        var tree = [];
        var drawInteration;
        var markerSource = new ol.source.Vector({
            features: []
        });
        var treeSource = new ol.source.Vector({
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
            treeSource.clear();
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
            tree = [];
            markerSource.forEachFeature(function (elementFeature) {
                markerSource.forEachFeature(function (element) {
                    var elementFeature = this;
                    if (arePointsEqual(element, elementFeature)) {
                        var line = getLine(elementFeature.getGeometry(), element.getGeometry())
                        var edge = {
                            Points: [elementFeature, element],
                            Weight: line.getLength(),
                            Line : line
                        };

                        tree.push(edge);
                        treeSource.addFeature(new ol.Feature(line));
                    }
                }, elementFeature);
            });
            var result = tree;
        };

        var getLine = function (firstPoint, secondPoint) {
            return new ol.geom.LineString([firstPoint.getCoordinates(), secondPoint.getCoordinates()]);
        };

        var arePointsEqual = function (firstPoint, secondPoint) {
            var first = firstPoint.getGeometry().getCoordinates();
            var second = secondPoint.getGeometry().getCoordinates();
            if ((first[0] != second[0]) && (first[1] != second[1])) {
                return true;
            }
            return false;
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
                    }),
                    new ol.layer.Vector({
                        source: treeSource
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