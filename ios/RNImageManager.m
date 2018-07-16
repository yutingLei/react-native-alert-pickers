//
//  RNImageManager.m
//  RNImageManager
//
//  Created by admin on 4/10/18.
//  Copyright © 2018 Develop. All rights reserved.
//

#import "RNImageManager.h"

@interface RNImageManager()

@end

@implementation RNImageManager

+ (PHImageRequestOptions *)reqOption {
    PHImageRequestOptions *option = [[PHImageRequestOptions alloc] init];
    option.version = PHImageRequestOptionsVersionOriginal;
    option.resizeMode = PHImageRequestOptionsResizeModeFast;
    option.deliveryMode = PHImageRequestOptionsDeliveryModeHighQualityFormat;
    return option;
}

/**
 Fetch assets collection

 @param completionHandler return collection lists and images count.
 */
+ (void)fetchAssetsCollectionsWithCompletionHandler:(FetchCollectionCompletionHandler)completionHandler {
    [self userAuthorized:^(BOOL authorized, NSString *message) {
        if (!authorized) {
            dispatch_async(dispatch_get_main_queue(), ^{
                completionHandler(nil, message);
            });
        } else {

            // Fetch top user library
            PHFetchResult<PHCollection *> *userCollection = [PHAssetCollection fetchTopLevelUserCollectionsWithOptions:nil];

            // Fetch smart album
            PHFetchResult<PHAssetCollection *> *smartCollections = [PHAssetCollection fetchAssetCollectionsWithType:PHAssetCollectionTypeSmartAlbum subtype:PHAssetCollectionSubtypeAny options:nil];

            // Process fetch
            if (smartCollections.count != 0 || userCollection.count != 0) {

                // Imp collection's option container
                NSMutableArray *collectionOptions = [NSMutableArray array];

                __block BOOL userEnded = userCollection.count == 0;
                __block BOOL smartEnded = smartCollections.count == 0;

                // Enumrate user collections
                [userCollection enumerateObjectsUsingBlock:^(PHCollection * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
                    if ([obj isKindOfClass:[PHAssetCollection class]]) {
                        PHFetchResult<PHAsset *> *assets = [PHAsset fetchAssetsInAssetCollection:(PHAssetCollection *)obj
                                                                                         options:nil];
                        if (assets.count != 0 && obj.localizedTitle) {
                            [collectionOptions addObject:@{@"title": obj.localizedTitle,
                                                           @"count": @(assets.count),
                                                           @"id": obj.localIdentifier}];
                        }
                    }

                    if (idx == userCollection.count - 1) {
                        userEnded = YES;
                    }
                    if (userEnded && smartEnded) {
                        userEnded = NO;
                        smartEnded = NO;
                        dispatch_async(dispatch_get_main_queue(), ^{
                            completionHandler(collectionOptions, nil);
                        });
                    }
                }];

                // Enumrate smart collections
                [smartCollections enumerateObjectsUsingBlock:^(PHAssetCollection * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
                    PHFetchResult<PHAsset *> *assets = [PHAsset fetchAssetsInAssetCollection:obj options:nil];
                    if (assets.count != 0 && obj.localizedTitle) {
                        [collectionOptions addObject:@{@"title": obj.localizedTitle,
                                                       @"count": @(assets.count),
                                                       @"id": obj.localIdentifier}];
                    }
                    if (idx == smartCollections.count - 1) {
                        smartEnded = YES;
                    }
                    if (userEnded && smartEnded) {
                        userEnded = NO;
                        smartEnded = NO;
                        dispatch_async(dispatch_get_main_queue(), ^{
                            completionHandler(collectionOptions, nil);
                        });
                    }
                }];

            } else {
                dispatch_async(dispatch_get_main_queue(), ^{
                    completionHandler(nil, @"Not find any assets collections.");
                });
            }
        }
    }];
}


/**
 Fetch assets by collection id

 @param identifier The id of asset's collection
 @param ascending Ascend by creationDate
 @param handler All assets id
 */
+ (void)fetchAssetsWithIdentifier:(NSString *)identifier
            ascendingCreationDate:(BOOL)ascending
                completionHandler:(FetchAssetsCompletionHandler)handler {
    if (identifier) {

        // Start fetch
        PHFetchResult *collection = [PHAssetCollection fetchAssetCollectionsWithLocalIdentifiers:@[identifier] options:nil];
        if (collection.count != 0) {

            // Fetch option
            PHFetchOptions *options = [[PHFetchOptions alloc] init];
            options.sortDescriptors = @[[NSSortDescriptor sortDescriptorWithKey:@"creationDate" ascending:ascending]];

            PHFetchResult<PHAsset *> *assets = [PHAsset fetchAssetsInAssetCollection:collection.lastObject options:options];
            if (assets.count != 0) {

                NSMutableArray *images = [NSMutableArray array];
                NSMutableArray *cachingAssets = [NSMutableArray array];

                for (NSInteger i = 0; i < assets.count; i++) {
                    PHAsset *asset = [assets objectAtIndex: i];
                    [cachingAssets addObject:asset];
                    [images addObject:asset.localIdentifier];
                }

                dispatch_async(dispatch_get_main_queue(), ^{
                    handler(images, nil);
                });
            } else {
                dispatch_async(dispatch_get_main_queue(), ^{
                    handler(nil, @"Not find any assets.");
                });
            }
        } else {
            dispatch_async(dispatch_get_main_queue(), ^{
                handler(nil, @"Not find the collection asset.");
            });
        }
    } else {
        dispatch_async(dispatch_get_main_queue(), ^{
            handler(nil, @"Unknown asset's collection identifier.");
        });
    }
}


/**
 Fetch image by asset's id

 @param identifer The asset's id
 @param sizeInfo The request image's size.
 @param handler Image's info { uri: '...' }
 */
+ (void)fetchImageWithAssetIdentifier:(NSString *)identifer targetImageSize:(NSDictionary *)sizeInfo completionHandler:(FetchImageCompletionHandler)handler {
    if (identifer) {
        // Start fetch
        PHFetchResult<PHAsset *> *assets = [PHAsset fetchAssetsWithLocalIdentifiers:@[identifer] options:nil];
        if (assets.count != 0) {
            PHAsset *asset = assets.lastObject;

            // Request image
            CGSize imageSize = UIScreen.mainScreen.nativeBounds.size;
            if (sizeInfo) {
                if (sizeInfo[@"width"] && sizeInfo[@"height"]) {
                    imageSize.width = [sizeInfo[@"width"] floatValue];
                    imageSize.height = [sizeInfo[@"height"] floatValue];
                }
            }

            // Start request
            [[PHImageManager defaultManager] requestImageForAsset:asset
                                                       targetSize:imageSize
                                                      contentMode:PHImageContentModeDefault
                                                          options:self.reqOption
                                                    resultHandler:^(UIImage * _Nullable result, NSDictionary * _Nullable info)
            {
                handler(result, nil);
            }];
        } else {
            dispatch_async(dispatch_get_main_queue(), ^{
                handler(nil, @"Not find any asset.");
            });
        }
    } else {
        dispatch_async(dispatch_get_main_queue(), ^{
            handler(nil, @"Unkonwn asset's identifier.");
        });
    }
}

/**
 Whether the user allow this application access to photos data

 @param handler the state of authorization.
 */
+ (void)userAuthorized:(void(^)(BOOL authorized, NSString *message))handler {
    [PHPhotoLibrary requestAuthorization:^(PHAuthorizationStatus status) {
        if (status == PHAuthorizationStatusNotDetermined) {
            handler(NO, @"User has not yet made a choice with regards to this application");
        } else if (status == PHAuthorizationStatusDenied) {
            handler(NO, @"User has explicitly denied this application access to photos data.");
        } else if (status == PHAuthorizationStatusRestricted) {
            handler(NO, @"This application is not authorized to access photo data. The user cannot change this application’s status, possibly due to active restrictions such as parental controls being in place.");
        } else {
            handler(YES, nil);
        }
    }];
}

@end
