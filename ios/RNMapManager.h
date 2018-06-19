//
//  RNMapManager.h
//  RNManagers
//
//  Created by admin on 4/27/18.
//  Copyright © 2018 Develop. All rights reserved.
//

#import <MapKit/MapKit.h>
#import <CoreLocation/CoreLocation.h>


#import <React/RCTConvert.h>
#import <React/RCTViewManager.h>
#import <React/RCTConvert+CoreLocation.h>

@interface RNMapManager : RCTViewManager
@end

@interface RNMapManager(LocationServices)
@end

@interface RCTConvert (MapManagerKit)

/// Parse josn to set map's type
+ (MKMapType)MKMapType:(id)json;
/// Parse json to set user tracking mode
+ (MKUserTrackingMode)MKUserTrackingMode:(id)json;
/// Parse json to set the delta region of map
+ (MKCoordinateSpan)MKCoordinateSpan:(id)json;
/// Parse json to BOOL
+ (BOOL)JSON2Bool:(id)json;

@end
