import 'leaflet-routing-machine';
import * as L from 'leaflet';  

declare module 'leaflet' { 
    namespace Routing {
        // A interface Waypoint já deve ser definida por @types/leaflet-routing-machine
        // Esta aumentação apenas adiciona a propriedade createMarker à interface RoutingControlOptions.
        interface RoutingControlOptions {
            createMarker?: (
                i: number, // Índice do waypoint
                waypoint: L.Routing.Waypoint, // O objeto waypoint
                numberOfWaypoints: number   
            ) => L.Marker;
        }
    }
}