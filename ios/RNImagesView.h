//
//  RNImagesView.h
//  RNManagers
//
//  Created by admin on 2018/7/13.
//  Copyright © 2018 Develop. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTViewManager.h>
#import "RNImagesDetailView.h"

@interface RNImageContainerView : UIView

/// The block of selected image
@property (nonatomic, copy) RCTBubblingEventBlock onSelected;

@end

@interface RNImagesView : RCTViewManager
@end

@interface RNImagesView(Fetch)
@end

@interface RNImagesView(Delegate) <UITableViewDelegate, UITableViewDataSource, RNImageManagerDelegate>
@end
