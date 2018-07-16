//
//  RNImageManager.h
//  RNImageManager
//
//  Created by admin on 4/10/18.
//  Copyright © 2018 Develop. All rights reserved.
//

#import <Photos/Photos.h>
#import <Foundation/Foundation.h>

#define RN_SELECT_COLOR [UIColor colorWithRed:2/9.0 green:26/51.0 blue:28/51.0 alpha:1]
#define RN_DEEPBLUE_COLOR [UIColor colorWithRed:0 green:12/17.0 blue:1 alpha:1]

typedef void(^FetchImageCompletionHandler)(UIImage *image, NSString *errDescription);
typedef void(^FetchAssetsCompletionHandler)(NSArray *assets, NSString *errDescription);
typedef void(^FetchCollectionCompletionHandler)(NSArray *collections, NSString *errDescription);

@interface RNImageManager : NSObject

+ (PHImageRequestOptions *)reqOption;

+ (void)fetchAssetsCollectionsWithCompletionHandler:(FetchCollectionCompletionHandler)completionHandler;
+ (void)fetchAssetsWithIdentifier:(NSString *)identifier
            ascendingCreationDate:(BOOL)ascending
                completionHandler:(FetchAssetsCompletionHandler)handler;
+ (void)fetchImageWithAssetIdentifier:(NSString *)identifer
                      targetImageSize:(NSDictionary *)sizeInfo
                    completionHandler:(FetchImageCompletionHandler)handler;

@end
