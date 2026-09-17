/**
 * Javascript to handle open street map for Lightbox popup.
 */
( function ( $ ) {
    "use strict";

    $( document ).on( 'ready', function () {

        function rhGoogleMapLightbox() {

            $( 'body' ).on( 'click', '.rhea_trigger_map', function ( event ) {
                event.preventDefault();

                var id       = $( this ).attr( 'data-rhea-map-source' );
                var location = $( this ).attr( 'data-rhea-map-location' );
                var locSplit = location.split( "," );
                var lat      = locSplit[0];
                var lng      = locSplit[1];
                var zoom     = locSplit[2];

                $.fancybox.open(
                    {
                        src   : '<div class="rhea_map_lightbox_content" id="' + id + '"></div>',
                        type  : 'html',
                        touch : false
                    },
                    {
                        smallBtn : false,
                        toolbar  : true
                    }
                );

                var mapContainer = document.getElementById( id );

                setTimeout( function () {

                    if ( typeof propertyMapData !== "undefined" ) {

                        if ( $( 'body #' + id ).hasClass( 'fancybox-content' ) ) {

                            if ( lat && lng ) {

                                var iconURL  = propertyMapData.icon;
                                var iconSize = new google.maps.Size( 42, 57 );
                                var mapZoom  = 15;

                                // zoom
                                if ( zoom > 0 ) {
                                    mapZoom = parseInt( zoom );
                                }

                                // retina
                                if ( window.devicePixelRatio > 1.5 ) {
                                    if ( propertyMapData.retinaIcon ) {
                                        iconURL  = propertyMapData.retinaIcon;
                                        iconSize = new google.maps.Size( 83, 113 );
                                    }
                                }

                                if ( propertyMapData.marker_type == 'circle' ) {
                                    var markerIcon = {
                                        path         : google.maps.SymbolPath.CIRCLE,
                                        scale        : 30,
                                        fillColor    : propertyMapData.marker_color,
                                        strokeColor  : propertyMapData.marker_color,
                                        fillOpacity  : 0.5,
                                        strokeWeight : 0.6
                                    }
                                } else {
                                    var markerIcon = {
                                        url        : iconURL,
                                        size       : iconSize,
                                        scaledSize : new google.maps.Size( 42, 57 ),
                                        origin     : new google.maps.Point( 0, 0 ),
                                        anchor     : new google.maps.Point( 21, 56 )
                                    };
                                }

                                var propertyLocation   = new google.maps.LatLng( lat, lng );
                                var propertyMapOptions = {
                                    center      : propertyLocation,
                                    zoom        : mapZoom,
                                    scrollwheel : false
                                };

                                // Map Styles
                                if ( undefined !== propertyMapData.styles && propertyMapData.styles !== '' ) {
                                    propertyMapOptions.styles = JSON.parse( propertyMapData.styles );
                                }

                                // Setting Google Map Type
                                switch ( propertyMapData.type ) {
                                    case 'satellite':
                                        propertyMapOptions.mapTypeId = google.maps.MapTypeId.SATELLITE;
                                        break;
                                    case 'hybrid':
                                        propertyMapOptions.mapTypeId = google.maps.MapTypeId.HYBRID;
                                        break;
                                    case 'terrain':
                                        propertyMapOptions.mapTypeId = google.maps.MapTypeId.TERRAIN;
                                        break;
                                    default:
                                        propertyMapOptions.mapTypeId = google.maps.MapTypeId.ROADMAP;
                                }

                                var propertyMap = new google.maps.Map( mapContainer, propertyMapOptions );

                                new google.maps.Marker( {
                                    position : propertyLocation,
                                    map      : propertyMap,
                                    icon     : markerIcon
                                } );
                            }
                        }
                    }
                }, 1000 );
            } );
        }

        rhGoogleMapLightbox();
    } );
} )( jQuery );