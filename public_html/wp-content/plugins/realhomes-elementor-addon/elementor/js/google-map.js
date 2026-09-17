/**
 * Google map elementor widget ES6 Class
 *
 * */
class RHEAGoogleMapWidgetClass extends elementorModules.frontend.handlers.Base {
    getDefaultSettings() {
        return {
            selectors : {
                mapDataDiv : '.rhea-listing-google-map'
            }
        };
    }

    getDefaultElements() {
        const selectors = this.getSettings( 'selectors' );
        return {
            $mapDataDiv : this.$element.find( selectors.mapDataDiv )
        };
    }

    bindEvents() {
        this.loadGoogleMap();
    }

    loadGoogleMap() {

        let mapWrapper           = this.elements.$mapDataDiv,
            wrapperID            = mapWrapper.attr( 'id' ),
            propertiesMapData    = JSON.parse( googlePropertiesData.rheaPropertiesData ),
            propertiesMapOptions = JSON.parse( googlePropertiesData.rheaMapOptions ),
            mapStuff             = JSON.parse( googlePropertiesData.rheaMapStuff );

        if ( typeof propertiesMapData !== "undefined" ) {

            if ( 0 < propertiesMapData.length ) {

                let fullScreenControl         = true,
                    fullScreenControlPosition = google.maps.ControlPosition.TOP_LEFT,
                    mapTypeControl            = true,
                    mapTypeControlPosition    = google.maps.ControlPosition.LEFT_BOTTOM;

                if ( mapStuff.modernHome ) {
                    mapTypeControl            = false;
                    fullScreenControlPosition = google.maps.ControlPosition.LEFT_BOTTOM;
                }

                let mapOptions = {
                    zoom                     : 12,
                    maxZoom                  : 16,
                    fullscreenControl        : fullScreenControl,
                    fullscreenControlOptions : {
                        position : fullScreenControlPosition
                    },
                    mapTypeControl           : mapTypeControl,
                    mapTypeControlOptions    : {
                        position : mapTypeControlPosition
                    },
                    scrollwheel              : false,
                    styles                   : [{
                        "featureType" : "landscape",
                        "stylers"     : [{
                            "hue" : "#FFBB00"
                        }, {
                            "saturation" : 43.400000000000006
                        }, {
                            "lightness" : 37.599999999999994
                        }, {
                            "gamma" : 1
                        }]
                    }, {
                        "featureType" : "road.highway",
                        "stylers"     : [{
                            "hue" : "#FFC200"
                        }, {
                            "saturation" : -61.8
                        }, {
                            "lightness" : 45.599999999999994
                        }, {
                            "gamma" : 1
                        }]
                    }, {
                        "featureType" : "road.arterial",
                        "stylers"     : [{
                            "hue" : "#FF0300"
                        }, {
                            "saturation" : -100
                        }, {
                            "lightness" : 51.19999999999999
                        }, {
                            "gamma" : 1
                        }]
                    }, {
                        "featureType" : "road.local",
                        "stylers"     : [{
                            "hue" : "#FF0300"
                        }, {
                            "saturation" : -100
                        }, {
                            "lightness" : 52
                        }, {
                            "gamma" : 1
                        }]
                    }, {
                        "featureType" : "water",
                        "stylers"     : [{
                            "hue" : "#0078FF"
                        }, {
                            "saturation" : -13.200000000000003
                        }, {
                            "lightness" : 2.4000000000000057
                        }, {
                            "gamma" : 1
                        }]
                    }, {
                        "featureType" : "poi",
                        "stylers"     : [{
                            "hue" : "#00FF6A"
                        }, {
                            "saturation" : -1.0989010989011234
                        }, {
                            "lightness" : 11.200000000000017
                        }, {
                            "gamma" : 1
                        }]
                    }]
                };

                // Map Styles
                if ( undefined !== propertiesMapOptions.styles ) {
                    mapOptions.styles = JSON.parse( propertiesMapOptions.styles );
                }

                // Setting Google Map Type
                switch ( propertiesMapOptions.type ) {
                    case 'satellite':
                        mapOptions.mapTypeId = google.maps.MapTypeId.SATELLITE;
                        break;
                    case 'hybrid':
                        mapOptions.mapTypeId = google.maps.MapTypeId.HYBRID;
                        break;
                    case 'terrain':
                        mapOptions.mapTypeId = google.maps.MapTypeId.TERRAIN;
                        break;
                    default:
                        mapOptions.mapTypeId = google.maps.MapTypeId.ROADMAP;
                }

                let propertiesMap = new google.maps.Map( document.getElementById( wrapperID ), mapOptions );

                let overlappingMarkerSpiderfier = new OverlappingMarkerSpiderfier( propertiesMap, {
                    markersWontMove        : true,
                    markersWontHide        : true,
                    keepSpiderfied         : true,
                    circleSpiralSwitchover : Infinity,
                    nearbyDistance         : 50
                } );

                let mapBounds     = new google.maps.LatLngBounds();
                let openedWindows = [];

                let closeOpenedWindows = function () {
                    while ( 0 < openedWindows.length ) {
                        let windowToClose = openedWindows.pop();
                        windowToClose.close();
                    }
                };

                let attachInfoBoxToMarker = function ( map, marker, infoBox ) {
                    google.maps.event.addListener( marker, 'click', function () {
                        closeOpenedWindows();
                        let scale                = Math.pow( 2, map.getZoom() );
                        let offsety              = ( ( 100 / scale ) || 0 );
                        let projection           = map.getProjection();
                        let markerPosition       = marker.getPosition();
                        let markerScreenPosition = projection.fromLatLngToPoint( markerPosition );
                        let pointHalfScreenAbove = new google.maps.Point( markerScreenPosition.x, markerScreenPosition.y - offsety );
                        let aboveMarkerLatLng    = projection.fromPointToLatLng( pointHalfScreenAbove );
                        map.setCenter( aboveMarkerLatLng );
                        infoBox.open( map, marker );
                        openedWindows.push( infoBox );

                        // lazy load info box image to improve performance
                        let infoBoxImage = infoBox.getContent().getElementsByClassName( 'prop-thumb' );
                        if ( infoBoxImage.length ) {
                            if ( infoBoxImage[0].dataset.src ) {
                                infoBoxImage[0].src = infoBoxImage[0].dataset.src;
                            }
                        }

                    } );
                };

                // Loop to generate marker and info windows based on properties data
                let markers = [];
                let map     = {
                    '&amp;'   : '&',
                    '&#038;'  : "&",
                    '&lt;'    : '<',
                    '&gt;'    : '>',
                    '&quot;'  : '"',
                    '&#039;'  : "'",
                    '&#8217;' : "’",
                    '&#8216;' : "‘",
                    '&#8211;' : "–",
                    '&#8212;' : "—",
                    '&#8230;' : "…",
                    '&#8221;' : '”'
                };

                for ( let i = 0; i < propertiesMapData.length; i++ ) {

                    if ( propertiesMapData[i].lat && propertiesMapData[i].lng ) {

                        let iconURL = propertiesMapData[i].icon;
                        let size    = new google.maps.Size( 42, 57 );
                        if ( window.devicePixelRatio > 1.5 ) {
                            if ( propertiesMapData[i].retinaIcon ) {
                                iconURL = propertiesMapData[i].retinaIcon;
                                size    = new google.maps.Size( 83, 113 );
                            }
                        }

                        let makerIcon = {
                            url        : iconURL,
                            size       : size,
                            scaledSize : new google.maps.Size( 42, 57 ),
                            origin     : new google.maps.Point( 0, 0 ),
                            anchor     : new google.maps.Point( 21, 56 )
                        };

                        markers[i] = new google.maps.Marker( {
                            position  : new google.maps.LatLng( propertiesMapData[i].lat, propertiesMapData[i].lng ),
                            map       : propertiesMap,
                            icon      : makerIcon,
                            title     : propertiesMapData[i].title.replace( /\&[\w\d\#]{2,5}\;/g, function ( m ) {
                                return map[m];
                            } ),  // Decode PHP's html special characters encoding with Javascript
                            animation : google.maps.Animation.DROP,
                            visible   : true
                        } );

                        // extend bounds
                        mapBounds.extend( markers[i].getPosition() );

                        // prepare info window contents
                        let boxText       = document.createElement( "div" );
                        boxText.className = 'rhea-map-info-window';
                        let innerHTML     = "";

                        // info window image place holder URL to improve performance
                        let infoBoxPlaceholderURL = "";
                        if ( ( typeof mapStuff !== "undefined" ) && mapStuff.infoBoxPlaceholder ) {
                            infoBoxPlaceholderURL = mapStuff.infoBoxPlaceholder;
                        }

                        if ( propertiesMapData[i].thumb ) {
                            innerHTML += '<a class="thumb-link" href="' + propertiesMapData[i].url + '">' + '<img class="prop-thumb" src="' + infoBoxPlaceholderURL + '"  data-src="' + propertiesMapData[i].thumb + '" alt="' + propertiesMapData[i].title + '"/>' + '</a>';
                        } else {
                            innerHTML += '<a class="thumb-link" href="' + propertiesMapData[i].url + '">' + '<img class="prop-thumb" src="' + infoBoxPlaceholderURL + '" alt="' + propertiesMapData[i].title + '"/>' + '</a>';
                        }

                        innerHTML += '<h5 class="prop-title"><a class="title-link" href="' + propertiesMapData[i].url + '">' + propertiesMapData[i].title + '</a></h5>';
                        if ( propertiesMapData[i].price ) {
                            innerHTML += '<p><span class="rhea-popup-price price">' + propertiesMapData[i].price + '</span></p>';
                        }
                        innerHTML += '<div class="arrow-down"></div>';
                        boxText.innerHTML = innerHTML;

                        // info window close icon URL
                        let closeIconURL = "";
                        if ( ( typeof mapStuff !== "undefined" ) && mapStuff.closeIcon ) {
                            closeIconURL = mapStuff.closeIcon;
                        }

                        // finalize info window
                        let infoWindowOptions = {
                            content                : boxText,
                            disableAutoPan         : true,
                            maxWidth               : 0,
                            alignBottom            : true,
                            pixelOffset            : new google.maps.Size( -122, -48 ),
                            zIndex                 : null,
                            closeBoxMargin         : "0 0 -16px -16px",
                            closeBoxURL            : closeIconURL,
                            infoBoxClearance       : new google.maps.Size( 1, 1 ),
                            isHidden               : false,
                            pane                   : "floatPane",
                            enableEventPropagation : false
                        };
                        let currentInfoBox    = new InfoBox( infoWindowOptions );

                        // attach info window to marker
                        attachInfoBoxToMarker( propertiesMap, markers[i], currentInfoBox );

                        // apply overlapping marker spiderfier to marker
                        overlappingMarkerSpiderfier.addMarker( markers[i] );

                    }

                }


                // fit map to bounds as per markers
                propertiesMap.fitBounds( mapBounds );

                // cluster icon URL
                let clusterIconURL = "";
                if ( ( typeof mapStuff !== "undefined" ) && mapStuff.clusterIcon ) {
                    clusterIconURL = mapStuff.clusterIcon;
                }

                // Markers clusters
                let markerClustererOptions = {
                    ignoreHidden : true,
                    maxZoom      : 14,
                    styles       : [{
                        textColor : '#ffffff',
                        url       : clusterIconURL,
                        height    : 48,
                        width     : 48
                    }]
                };

                let markerClusterer = new MarkerClusterer( propertiesMap, markers, markerClustererOptions );


            } else {

                // Fallback Map in Case of No Properties
                // todo: provide an option for fallback map coordinates
                let fallBackLocation = new google.maps.LatLng( 27.664827, -81.515755 );	// Default location of Florida in fallback map.
                let fallBackOptions  = {
                    center      : fallBackLocation,
                    zoom        : 10,
                    maxZoom     : 16,
                    scrollwheel : false
                };

                // Map Styles
                if ( undefined !== propertiesMapOptions.styles ) {
                    fallBackOptions.styles = JSON.parse( propertiesMapOptions.styles );
                }

                let fallBackMap = new google.maps.Map( document.getElementById( wrapperID ), fallBackOptions );

            }
        }

    }
}

jQuery( window ).on( 'elementor/frontend/init', () => {
    const RHEAGoogleMapHandler = ( $element ) => {
        elementorFrontend.elementsHandler.addHandler( RHEAGoogleMapWidgetClass, { $element } );
    };

    elementorFrontend.hooks.addAction( 'frontend/element_ready/rhea-properties-google-map-widget.default', RHEAGoogleMapHandler );
} );