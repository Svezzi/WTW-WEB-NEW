import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Libraries } from '@react-google-maps/api';
import { nanoid } from 'nanoid';
import styled from 'styled-components';
import { MapLocation, RouteStop } from '@/config/googleMapsConfig';

// Libraries needed for custom route editor
const libraries: Libraries = ['places', 'geometry'];

// Types for our custom implementation
interface RouteSegment {
  id: string;
  points: google.maps.LatLng[];
  path: google.maps.Polyline | null;
  startIndex: number;
  endIndex: number;
}

interface EditPoint {
  id: string;
  marker: google.maps.Marker | null;
  position: google.maps.LatLng;
  segmentId?: string;
  isWaypoint: boolean;
  stopIndex?: number;
  isControlPoint: boolean;
}

interface RouteHistory {
  segments: RouteSegment[];
  editPoints: EditPoint[];
}

interface CustomRouteEditorProps {
  stops: RouteStop[];
  onStopsChange?: (stops: RouteStop[]) => void;
  onDirectionsChange?: (directions: google.maps.DirectionsResult) => void;
  initialDirections?: google.maps.DirectionsResult | null;
  isPreviewMode?: boolean;
  mapRef?: React.RefObject<google.maps.Map>;
  isLoaded?: boolean;
}

// Styled components
const EditorContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const EditModeToggle = styled.button<{ $active: boolean }>`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 10px 16px;
  background-color: ${props => props.$active ? '#4CAF50' : '#3B82F6'};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background-color: ${props => props.$active ? '#45a049' : '#2563EB'};
    box-shadow: 0 6px 10px rgba(0,0,0,0.4);
  }
`;

const EditModeIndicator = styled.div`
  position: absolute;
  top: 60px;
  right: 10px;
  padding: 8px 12px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 4px;
  font-size: 13px;
  z-index: 9;
`;

const UndoButton = styled.button`
  position: absolute;
  bottom: 100px;
  right: 10px;
  width: 40px;
  height: 40px;
  background-color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
`;

const RedoButton = styled.button`
  position: absolute;
  bottom: 150px;
  right: 10px;
  width: 40px;
  height: 40px;
  background-color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
`;

const ResetButton = styled.button`
  position: absolute;
  bottom: 50px;
  right: 10px;
  width: 40px;
  height: 40px;
  background-color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
`;

const ControlTooltip = styled.div`
  position: absolute;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 15;
  pointer-events: none;
`;

export default function CustomRouteEditor({
  stops,
  onStopsChange,
  onDirectionsChange,
  initialDirections,
  isPreviewMode = false,
  mapRef: externalMapRef,
  isLoaded
}: CustomRouteEditorProps) {
  // Refs
  const mapRef = useRef<google.maps.Map | null>(null);
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);
  const segmentsRef = useRef<RouteSegment[]>([]);
  const editPointsRef = useRef<EditPoint[]>([]);
  const draggedMarkerRef = useRef<EditPoint | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const historyRef = useRef<RouteHistory[]>([]);
  const historyIndexRef = useRef<number>(-1);
  const originalDirectionsRef = useRef<google.maps.DirectionsResult | null>(null);
  const isRecalculatingRef = useRef<boolean>(false);

  // State
  const [editMode, setEditMode] = useState(!isPreviewMode);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [hasModifiedRoute, setHasModifiedRoute] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [tooltipText, setTooltipText] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  if (!isLoaded) {
    return <div>Loading maps...</div>;
  }

  // Set up directions service when map is loaded
  useEffect(() => {
    if (!map) return;
    directionsServiceRef.current = new google.maps.DirectionsService();

    // Set map in external ref if provided
    if (externalMapRef && !externalMapRef.current) {
      externalMapRef.current = map;
    }
  }, [map, externalMapRef]);

  // Initialize from initial directions when provided
  useEffect(() => {
    if (!map || !initialDirections || isRecalculatingRef.current) return;
    
    // Store the original directions for reset functionality
    originalDirectionsRef.current = JSON.parse(JSON.stringify(initialDirections));
    
    // Convert directions to segments and create the initial route visualization
    createSegmentsFromDirections(initialDirections);
  }, [map, initialDirections]);

  // Convert Google Directions to our custom segments format
  const createSegmentsFromDirections = useCallback((directions: google.maps.DirectionsResult) => {
    if (!map) return;
    
    // Clear any existing segments
    clearSegments();
    
    const route = directions.routes[0];
    const legs = route.legs;
    const newSegments: RouteSegment[] = [];
    const newEditPoints: EditPoint[] = [];
    
    // Create waypoint markers first
    stops.forEach((stop, index) => {
      const position = new google.maps.LatLng(stop.location.lat, stop.location.lng);
      
      // Create marker for this waypoint
      const marker = new google.maps.Marker({
        position,
        map,
        draggable: !isPreviewMode && editMode,
        label: { 
          text: (index + 1).toString(), 
          color: 'white'
        },
        zIndex: 10
      });
      
      // Add to edit points
      const editPoint: EditPoint = {
        id: nanoid(),
        marker,
        position,
        isWaypoint: true,
        stopIndex: index,
        isControlPoint: false
      };
      
      // Add event listeners
      if (!isPreviewMode) {
        marker.addListener('dragstart', () => handleMarkerDragStart(editPoint));
        marker.addListener('drag', (e: google.maps.MapMouseEvent) => handleMarkerDrag(e));
        marker.addListener('dragend', (e: google.maps.MapMouseEvent) => handleMarkerDragEnd(editPoint, e));
        marker.addListener('mouseover', () => handleMarkerMouseOver(editPoint));
        marker.addListener('mouseout', () => handleMarkerMouseOut());
      }
      
      newEditPoints.push(editPoint);
    });
    
    // Create segments for each leg
    legs.forEach((leg, legIndex) => {
      // Get all points in the path
      const points: google.maps.LatLng[] = [];
      leg.steps.forEach(step => {
        // Decode the polyline path for each step
        if (step.polyline && step.polyline.points) {
          const stepPath = google.maps.geometry.encoding.decodePath(step.polyline.points);
          points.push(...stepPath);
        }
      });
      
      // Create a polyline for this segment
      const polyline = new google.maps.Polyline({
        path: points,
        geodesic: true,
        strokeColor: '#4CAF50',
        strokeOpacity: 0.7,
        strokeWeight: 5,
        map,
        zIndex: 1,
        editable: !isPreviewMode && editMode,
        icons: [{
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#4CAF50',
            fillOpacity: 1,
            scale: 3,
            strokeColor: '#4CAF50',
            strokeWeight: 1,
          },
          offset: '0',
          repeat: '12px'
        }]
      });
      
      // Create segment object
      const segment: RouteSegment = {
        id: nanoid(),
        points,
        path: polyline,
        startIndex: legIndex,
        endIndex: legIndex + 1
      };
      
      // Add to segments
      newSegments.push(segment);
      
      // Add control points if in edit mode and not preview
      if (!isPreviewMode && editMode) {
        // Add control points at intervals along the segment
        const interval = Math.max(1, Math.floor(points.length / 10)); // Add up to 10 control points per segment
        
        for (let i = interval; i < points.length - interval; i += interval) {
          const controlPosition = points[i];
          
          // Create marker for control point
          const controlMarker = new google.maps.Marker({
            position: controlPosition,
            map,
            draggable: true,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: '#1E88E5',
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 2,
              scale: 10
            },
            zIndex: 5
          });
          
          // Add to edit points
          const controlPoint: EditPoint = {
            id: nanoid(),
            marker: controlMarker,
            position: controlPosition,
            segmentId: segment.id,
            isWaypoint: false,
            isControlPoint: true
          };
          
          // Add event listeners
          controlMarker.addListener('dragstart', () => handleMarkerDragStart(controlPoint));
          controlMarker.addListener('drag', (e: google.maps.MapMouseEvent) => handleMarkerDrag(e));
          controlMarker.addListener('dragend', (e: google.maps.MapMouseEvent) => handleMarkerDragEnd(controlPoint, e));
          controlMarker.addListener('mouseover', () => handleMarkerMouseOver(controlPoint));
          controlMarker.addListener('mouseout', () => handleMarkerMouseOut());
          
          newEditPoints.push(controlPoint);
        }
      }
    });
    
    // Update refs
    segmentsRef.current = newSegments;
    editPointsRef.current = newEditPoints;
    
    // Save to history
    saveToHistory();
  }, [map, stops, isPreviewMode, editMode]);

  // Calculate directions between two points
  const calculateSegmentDirections = useCallback(async (
    startPoint: google.maps.LatLng,
    endPoint: google.maps.LatLng
  ): Promise<google.maps.DirectionsResult | null> => {
    if (!directionsServiceRef.current) return null;
    
    try {
      const result = await new Promise<google.maps.DirectionsResult>((resolve, reject) => {
        directionsServiceRef.current!.route({
          origin: startPoint,
          destination: endPoint,
          travelMode: google.maps.TravelMode.WALKING
        }, (response, status) => {
          if (status === google.maps.DirectionsStatus.OK && response) {
            resolve(response);
          } else {
            reject(new Error(`Directions request failed: ${status}`));
          }
        });
      });
      
      return result;
    } catch (error) {
      console.error('Error calculating segment directions:', error);
      return null;
    }
  }, []);

  // Calculate complete route directions
  const calculateCompleteDirections = useCallback(async () => {
    if (!directionsServiceRef.current || stops.length < 2) return null;
    
    isRecalculatingRef.current = true;
    setIsCalculating(true);
    
    try {
      // Extract waypoints (all stops except first and last)
      const waypoints = stops.slice(1, -1).map((stop) => ({
        location: new google.maps.LatLng(stop.location.lat, stop.location.lng),
        stopover: true,
      }));

      const origin = new google.maps.LatLng(
        stops[0].location.lat,
        stops[0].location.lng
      );
      
      const destination = new google.maps.LatLng(
        stops[stops.length - 1].location.lat,
        stops[stops.length - 1].location.lng
      );

      const result = await new Promise<google.maps.DirectionsResult>((resolve, reject) => {
        directionsServiceRef.current!.route({
          origin,
          destination,
          waypoints,
          travelMode: google.maps.TravelMode.WALKING,
          optimizeWaypoints: false,
          provideRouteAlternatives: true,
        }, (response, status) => {
          if (status === google.maps.DirectionsStatus.OK && response) {
            resolve(response);
          } else {
            reject(new Error(`Directions request failed: ${status}`));
          }
        });
      });
      
      // If successful, update visualizations and notify parent
      if (result) {
        createSegmentsFromDirections(result);
        
        if (onDirectionsChange) {
          onDirectionsChange(result);
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error calculating complete directions:', error);
      return null;
    } finally {
      setIsCalculating(false);
      isRecalculatingRef.current = false;
    }
  }, [stops, onDirectionsChange, createSegmentsFromDirections]);

  // Clear all segments and edit points from the map
  const clearSegments = useCallback(() => {
    // Remove polylines
    segmentsRef.current.forEach(segment => {
      if (segment.path) {
        segment.path.setMap(null);
      }
    });
    
    // Remove markers
    editPointsRef.current.forEach(point => {
      if (point.marker) {
        point.marker.setMap(null);
      }
    });
    
    // Clear arrays
    segmentsRef.current = [];
    editPointsRef.current = [];
  }, []);

  // Update route when edit mode changes
  useEffect(() => {
    if (!map) return;
    
    // Show/hide control points based on edit mode
    editPointsRef.current.forEach(point => {
      if (point.marker && point.isControlPoint) {
        point.marker.setVisible(editMode);
        point.marker.setDraggable(editMode);
      } else if (point.marker && point.isWaypoint) {
        point.marker.setDraggable(editMode);
      }
    });
    
    // Make polylines editable based on edit mode
    segmentsRef.current.forEach(segment => {
      if (segment.path) {
        segment.path.setEditable(editMode && !isPreviewMode);
      }
    });
  }, [editMode, map, isPreviewMode]);

  // Handle marker drag start
  const handleMarkerDragStart = useCallback((point: EditPoint) => {
    draggedMarkerRef.current = point;
  }, []);

  // Handle marker drag
  const handleMarkerDrag = useCallback((e: google.maps.MapMouseEvent) => {
    if (!map) return;

    // Update tooltip position during drag
    if (tooltipRef.current && e.latLng) {
      const projection = map.getProjection();
      if (projection) {
        const pointObj = projection.fromLatLngToPoint(e.latLng);
        if (pointObj) {
          const div = map.getDiv();
          const offset = {
            x: div.offsetLeft,
            y: div.offsetTop
          };
          
          setTooltipPosition({
            x: (pointObj.x * Math.pow(2, map.getZoom()!)) + offset.x,
            y: (pointObj.y * Math.pow(2, map.getZoom()!)) + offset.y - 30 // Position above cursor
          });
        }
      }
    }
  }, [map]);

  // Handle marker drag end
  const handleMarkerDragEnd = useCallback(async (dragPoint: EditPoint, e: google.maps.MapMouseEvent) => {
    if (!map || !e.latLng || !draggedMarkerRef.current) return;
    
    // Update the marker position
    const newPosition = e.latLng;
    const point = draggedMarkerRef.current;
    
    // If this is a waypoint, update the stops array
    if (point.isWaypoint && point.stopIndex !== undefined) {
      const updatedStops = [...stops];
      updatedStops[point.stopIndex].location.lat = newPosition.lat();
      updatedStops[point.stopIndex].location.lng = newPosition.lng();
      
      // Update geocoding info
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat: newPosition.lat(), lng: newPosition.lng() } }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const updatedStopsWithAddress = [...updatedStops];
          updatedStopsWithAddress[point.stopIndex!].location.address = results[0].formatted_address;
          updatedStopsWithAddress[point.stopIndex!].location.placeId = results[0].place_id;
          
          // Notify parent component
          if (onStopsChange) {
            onStopsChange(updatedStopsWithAddress);
          }
          
          // Recalculate the entire route
          calculateCompleteDirections();
        }
      });
    } 
    // If this is a control point, update just the affected segment
    else if (point.isControlPoint && point.segmentId) {
      // Find the segment this control point belongs to
      const segment = segmentsRef.current.find(s => s.id === point.segmentId);
      
      if (segment && segment.path) {
        setHasModifiedRoute(true);
        
        // Get the start and end points of the segment
        const startPoint = editPointsRef.current.find(p => p.isWaypoint && p.stopIndex === segment.startIndex);
        const endPoint = editPointsRef.current.find(p => p.isWaypoint && p.stopIndex === segment.endIndex);
        
        if (startPoint && endPoint) {
          try {
            // Calculate new directions with the dragged point as a waypoint
            const newDirections = await calculateSegmentDirections(
              startPoint.position,
              endPoint.position
            );
            
            if (newDirections && newDirections.routes[0]) {
              // Update the segment with the new path
              const newPoints: google.maps.LatLng[] = [];
              newDirections.routes[0].legs[0].steps.forEach(step => {
                if (step.polyline && step.polyline.points) {
                  const stepPath = google.maps.geometry.encoding.decodePath(step.polyline.points);
                  newPoints.push(...stepPath);
                }
              });
              
              // Update the polyline
              segment.path.setPath(newPoints);
              segment.points = newPoints;
              
              // Save to history
              saveToHistory();
            }
          } catch (error) {
            console.error('Failed to update segment:', error);
            
            // Restore the original position if calculation fails
            if (point.marker) {
              point.marker.setPosition(point.position);
            }
          }
        }
      }
    }
    
    // Clear the dragged marker reference
    draggedMarkerRef.current = null;
    
    // Hide tooltip
    setShowTooltip(false);
  }, [map, stops, calculateSegmentDirections, onStopsChange, calculateCompleteDirections]);

  // Handle marker mouse over
  const handleMarkerMouseOver = useCallback((point: EditPoint) => {
    // Set tooltip text based on point type
    if (point.isWaypoint) {
      setTooltipText(`Stop ${point.stopIndex! + 1}: Drag to move`);
    } else if (point.isControlPoint) {
      setTooltipText('Control point: Drag to shape route');
    }
    
    // Show tooltip
    setShowTooltip(true);
  }, []);

  // Handle marker mouse out
  const handleMarkerMouseOut = useCallback(() => {
    setShowTooltip(false);
  }, []);

  // Save current state to history
  const saveToHistory = useCallback(() => {
    // Create deep copies of segments and edit points
    const segmentsCopy = segmentsRef.current.map(segment => ({
      ...segment,
      points: [...segment.points],
      // Don't clone the actual polyline objects
      path: segment.path
    }));
    
    const editPointsCopy = editPointsRef.current.map(point => ({
      ...point,
      position: new google.maps.LatLng(
        point.position.lat(),
        point.position.lng()
      ),
      // Don't clone the actual marker objects
      marker: point.marker
    }));
    
    // If we're not at the end of the history stack, truncate
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    }
    
    // Add to history stack (limit to 10 entries)
    historyRef.current.push({
      segments: segmentsCopy,
      editPoints: editPointsCopy
    });
    
    // Trim history if it exceeds max length
    if (historyRef.current.length > 10) {
      historyRef.current.shift();
    }
    
    // Update index to point to the end
    historyIndexRef.current = historyRef.current.length - 1;
    
    // Enable undo button if we have history
    setHasModifiedRoute(historyRef.current.length > 1);
  }, []);

  // Undo to previous state
  const handleUndo = useCallback(() => {
    // Check if we can undo
    if (historyIndexRef.current <= 0) return;
    
    // Decrement index
    historyIndexRef.current--;
    
    // Load state from history
    applyHistoryState(historyIndexRef.current);
  }, []);

  // Redo to next state
  const handleRedo = useCallback(() => {
    // Check if we can redo
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    
    // Increment index
    historyIndexRef.current++;
    
    // Load state from history
    applyHistoryState(historyIndexRef.current);
  }, []);

  // Reset to original route
  const handleReset = useCallback(() => {
    // Reset to original directions if available
    if (originalDirectionsRef.current) {
      createSegmentsFromDirections(originalDirectionsRef.current);
      
      // Notify parent component if needed
      if (onDirectionsChange) {
        onDirectionsChange(originalDirectionsRef.current);
      }
      
      // Reset history
      historyRef.current = [];
      historyIndexRef.current = -1;
      setHasModifiedRoute(false);
    }
  }, [onDirectionsChange, createSegmentsFromDirections]);

  // Apply a state from history
  const applyHistoryState = useCallback((index: number) => {
    if (index < 0 || index >= historyRef.current.length || !map) return;
    
    const historyState = historyRef.current[index];
    
    // Clear current state
    clearSegments();
    
    // Recreate segments from history
    const newSegments = historyState.segments.map(historySeg => {
      // Create new polyline
      const polyline = new google.maps.Polyline({
        path: historySeg.points,
        geodesic: true,
        strokeColor: '#4CAF50',
        strokeOpacity: 0.7,
        strokeWeight: 5,
        map,
        zIndex: 1,
        editable: !isPreviewMode && editMode,
        icons: [{
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#4CAF50',
            fillOpacity: 1,
            scale: 3,
            strokeColor: '#4CAF50',
            strokeWeight: 1,
          },
          offset: '0',
          repeat: '12px'
        }]
      });
      
      return {
        ...historySeg,
        path: polyline
      };
    });
    
    // Recreate edit points from history
    const newEditPoints = historyState.editPoints.map(historyPoint => {
      // Create marker
      const marker = new google.maps.Marker({
        position: historyPoint.position,
        map,
        draggable: !isPreviewMode && editMode,
        visible: historyPoint.isControlPoint ? editMode : true,
        zIndex: historyPoint.isWaypoint ? 10 : 5,
        ...(historyPoint.isWaypoint
          ? {
              label: {
                text: (historyPoint.stopIndex! + 1).toString(),
                color: 'white'
              }
            }
          : {
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: '#1E88E5',
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 2,
                scale: 10
              }
            })
      });
      
      // Add event listeners
      if (!isPreviewMode) {
        marker.addListener('dragstart', () => handleMarkerDragStart(historyPoint));
        marker.addListener('drag', (e: google.maps.MapMouseEvent) => handleMarkerDrag(e));
        marker.addListener('dragend', (e: google.maps.MapMouseEvent) => handleMarkerDragEnd(historyPoint, e));
        marker.addListener('mouseover', () => handleMarkerMouseOver(historyPoint));
        marker.addListener('mouseout', () => handleMarkerMouseOut());
      }
      
      return {
        ...historyPoint,
        marker
      };
    });
    
    // Update refs
    segmentsRef.current = newSegments;
    editPointsRef.current = newEditPoints;
  }, [map, editMode, isPreviewMode, clearSegments, handleMarkerDragStart, handleMarkerDrag, handleMarkerDragEnd, handleMarkerMouseOver, handleMarkerMouseOut]);

  // Clean up resources on unmount
  useEffect(() => {
    return () => {
      clearSegments();
    };
  }, [clearSegments]);

  if (!isLoaded) {
    return <div>Loading maps...</div>;
  }

  return (
    <EditorContainer>
      {!isPreviewMode && (
        <>
          {/* Edit mode toggle */}
          <EditModeToggle 
            $active={editMode} 
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? '✓ Editing Enabled' : '✏️ Enable Editing'}
          </EditModeToggle>
          
          {editMode && (
            <EditModeIndicator>
              Drag the blue dots to reshape the route
            </EditModeIndicator>
          )}
          
          {/* History controls */}
          {hasModifiedRoute && (
            <>
              <UndoButton onClick={handleUndo} title="Undo last change">
                ↩
              </UndoButton>
              
              {historyIndexRef.current < historyRef.current.length - 1 && (
                <RedoButton onClick={handleRedo} title="Redo change">
                  ↪
                </RedoButton>
              )}
              
              <ResetButton onClick={handleReset} title="Reset to original route">
                ↺
              </ResetButton>
            </>
          )}
          
          {/* Tooltip */}
          {showTooltip && (
            <ControlTooltip 
              ref={tooltipRef}
              style={{ left: `${tooltipPosition.x}px`, top: `${tooltipPosition.y}px` }}
            >
              {tooltipText}
            </ControlTooltip>
          )}
        </>
      )}
      
      {/* Map */}
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={stops[0]?.location ? { lat: stops[0].location.lat, lng: stops[0].location.lng } : undefined}
        zoom={14}
        options={{
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
          gestureHandling: 'greedy',
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
          ],
        }}
        onLoad={(mapInstance) => setMap(mapInstance)}
      >
        {/* Map is just a container here, all markers and polylines are managed via refs */}
      </GoogleMap>
    </EditorContainer>
  );
} 