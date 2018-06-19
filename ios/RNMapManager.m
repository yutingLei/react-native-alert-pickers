//
//  RNMapManager.m
//  RNManagers
//
//  Created by admin on 4/27/18.
//  Copyright © 2018 Develop. All rights reserved.
//

#import "RNMapManager.h"

@interface RNMapManager() <CLLocationManagerDelegate, MKMapViewDelegate>
@property (nonatomic, strong) MKMapView *mapView;
@property (nonatomic, strong) CLLocationManager *manager;
@property (nonatomic, strong) MKPointAnnotation *userAnnotation;
@end

@implementation RNMapManager

RCT_EXPORT_MODULE()

- (UIView *)view {
    if (!_mapView) {
        _mapView = [[MKMapView alloc] init];
        _mapView.delegate = self;
    }
    return _mapView;
}

/// Bools
/// Can zoom mapview
RCT_CUSTOM_VIEW_PROPERTY(zoomEnabled, BOOL, MKMapView) {
    view.zoomEnabled = [RCTConvert JSON2Bool:json];
}

/// Can scroll mapview
RCT_CUSTOM_VIEW_PROPERTY(scrollEnabled, BOOL, MKMapView) {
    view.scrollEnabled = [RCTConvert JSON2Bool:json];
}

/// Can rotate mapview
RCT_CUSTOM_VIEW_PROPERTY(rotateEnabled, BOOL, MKMapView) {
    view.rotateEnabled = [RCTConvert JSON2Bool:json];
}

/// Can pitch mapview
RCT_CUSTOM_VIEW_PROPERTY(pitchEnabled, BOOL, MKMapView) {
    view.pitchEnabled = [RCTConvert JSON2Bool:json];
}

/// Show compass
RCT_CUSTOM_VIEW_PROPERTY(showsCompass, BOOL, MKMapView) {
    view.showsCompass = [RCTConvert JSON2Bool:json];
}

/// Show scale
RCT_CUSTOM_VIEW_PROPERTY(showsScale, BOOL, MKMapView) {
    view.showsScale = [RCTConvert JSON2Bool:json];
}

/// Show POI
RCT_CUSTOM_VIEW_PROPERTY(showsPointsOfInterest, BOOL, MKMapView) {
    view.showsPointsOfInterest = [RCTConvert JSON2Bool:json];
}

/// Show buildings
RCT_CUSTOM_VIEW_PROPERTY(showsBuildings, BOOL, MKMapView) {
    view.showsBuildings = [RCTConvert JSON2Bool:json];
}

/// Show traffic
RCT_CUSTOM_VIEW_PROPERTY(showsTraffic, BOOL, MKMapView) {
    view.showsTraffic = [RCTConvert JSON2Bool:json];
}

/// Set map's type
RCT_CUSTOM_VIEW_PROPERTY(mapType, MKMapType, MKMapView) {
    view.mapType = json ? [RCTConvert MKMapType:json] : MKMapTypeStandard;
}

/// Set user tracking mode
RCT_CUSTOM_VIEW_PROPERTY(userTrackingMode, MKUserTrackingMode, MKMapView) {
    view.userTrackingMode = json ? [RCTConvert MKUserTrackingMode:json] : MKUserTrackingModeNone;
}

/// Set map's region
RCT_CUSTOM_VIEW_PROPERTY(region, MKCoordinateRegion, MKMapView) {
    view.region = (MKCoordinateRegion) {
        [RCTConvert CLLocationCoordinate2D:json],
        [RCTConvert MKCoordinateSpan:json]
    };
}

RCT_EXPORT_METHOD(startUpdateLocation) {
    [self stopUpdateLocation];
    if ([CLLocationManager locationServicesEnabled]) {
        CLAuthorizationStatus status = [CLLocationManager authorizationStatus];
        switch (status) {
            case kCLAuthorizationStatusRestricted:
            case kCLAuthorizationStatusDenied:
                RCTLogWarn(@"This application is not authorized to use location services");
                return;
            default:{
                if (!_manager) {
                    _manager = [[CLLocationManager alloc] init];
                }
                _manager.delegate = self;
                _manager.desiredAccuracy = kCLLocationAccuracyHundredMeters;
                _manager.distanceFilter = 500;
                if (status == kCLAuthorizationStatusNotDetermined) {
                    [_manager requestWhenInUseAuthorization];
                } else {
                    [_manager startUpdatingLocation];
                }
            }
                break;
        }
    } else {
        RCTLogWarn(@"The device unsupport location services.");
    }
}

RCT_EXPORT_METHOD(stopUpdateLocation) {
    if (_manager) {
        [_manager stopUpdatingLocation];
        _manager.delegate = nil;
    }
}

- (void)locationManager:(CLLocationManager *)manager didChangeAuthorizationStatus:(CLAuthorizationStatus)status {
    if (status == kCLAuthorizationStatusAuthorizedWhenInUse) {
        [manager startUpdatingLocation];
    }
}

- (void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error {
    NSLog(@"%@", error.localizedDescription);
}

- (MKAnnotationView *)mapView:(MKMapView *)mapView viewForAnnotation:(id<MKAnnotation>)annotation {
    if ([annotation isKindOfClass:[MKPointAnnotation class]]) {
        MKPinAnnotationView *annView = [[MKPinAnnotationView alloc] initWithAnnotation:annotation
                                                                       reuseIdentifier:@"com.user.annotation"];
        annView.pinTintColor = [UIColor purpleColor];
        return annView;
    }
    mapView.delegate = nil;
    return nil;
}

- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray<CLLocation *> *)locations {
    CLLocation *location = [locations firstObject];
    [_mapView setCenterCoordinate:location.coordinate animated:YES];
    [self parseLocation:location];
    manager.delegate = nil;
}

- (void)parseLocation:(CLLocation *)loc {

    __weak typeof(self) weakSelf = self;
    CLGeocoder *geocoder = [[CLGeocoder alloc] init];

    [geocoder reverseGeocodeLocation:loc completionHandler:^(NSArray<CLPlacemark *> * _Nullable placemarks, NSError * _Nullable error) {
        if (error) {
            RCTLogWarn(@"%@", error.localizedDescription);
        } else {
            __strong typeof(weakSelf) strgSelf = weakSelf;
            if ([[strgSelf.mapView annotations] containsObject:strgSelf.userAnnotation]) {
                [strgSelf.mapView removeAnnotation:strgSelf.userAnnotation];
            }

            NSString *country = placemarks.lastObject.country;
            NSString *city = placemarks.lastObject.locality;
            NSString *street = placemarks.lastObject.subLocality;

            if (!strgSelf.userAnnotation) {
                strgSelf.userAnnotation = [[MKPointAnnotation alloc] init];
            }
            strgSelf.userAnnotation.coordinate = loc.coordinate;
            strgSelf.userAnnotation.title = country;
            strgSelf.userAnnotation.subtitle = [NSString stringWithFormat:@"%@-%@", city, street];
            [strgSelf.mapView addAnnotation:strgSelf.userAnnotation];
        }
    }];
}

@end

@implementation RCTConvert (MapManagerKit)

/// Parse josn to set map's type
+ (MKMapType)MKMapType:(id)json {
    if ([json isEqual:@"satellite"]) {
        return MKMapTypeSatellite;
    } else if ([json isEqual:@"hybrid"]) {
        return MKMapTypeHybrid;
    } else if ([json isEqual:@"satelliteFlyover"]) {
        return MKMapTypeSatelliteFlyover;
    } else if ([json isEqual:@"hybridFlyover"]) {
        return MKMapTypeHybridFlyover;
    } else if ([json isEqual:@"mutedStandard"]) {
        return MKMapTypeMutedStandard;
    } else {
        return MKMapTypeStandard;
    }
}

/// Parse json to set user tracking mode
+ (MKUserTrackingMode)MKUserTrackingMode:(id)json {
    if ([json isEqual:@"follow-heading"]) {
        return MKUserTrackingModeFollowWithHeading;
    } else if ([json isEqual:@"follow"]) {
        return MKUserTrackingModeFollow;
    } else {
        return MKUserTrackingModeNone;
    }
}

/// Parse json to set the delta region of map
+ (MKCoordinateSpan)MKCoordinateSpan:(id)json {
    json = [RCTConvert NSDictionary:json];
    return (MKCoordinateSpan) {
        [RCTConvert CLLocationDegrees:json[@"latitudeDelta"]],
        [RCTConvert CLLocationDegrees:json[@"longitudeDelta"]]
    };
}

/// Parse json to BOOL
+ (BOOL)JSON2Bool:(id)json {
    if (json) {
        return [json isEqual: @(YES)];
    }
    return NO;
}

@end
