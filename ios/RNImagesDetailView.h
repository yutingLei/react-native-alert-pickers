//
//  RNImagesDetailView.h
//  RNManagers
//
//  Created by admin on 2018/7/13.
//  Copyright © 2018 Develop. All rights reserved.
//

#import <UIKit/UIKit.h>

@protocol RNImageManagerDelegate <NSObject>

- (void)selectedImages:(NSArray<NSString *> *)images;

@end

@interface RNImagesDetailView : UIView
/// Direction of layout
@property (nonatomic, assign) BOOL horizontal;
/// Select mode
@property (nonatomic, assign) BOOL multipleSelect;
/// Images assets
@property (nonatomic, strong) NSArray *assets;

/// delegate
@property (nonatomic, assign) id<RNImageManagerDelegate> delegate;
@end
