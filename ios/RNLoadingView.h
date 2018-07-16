//
//  RNLoadingView.h
//  RNManagers
//
//  Created by admin on 2018/7/13.
//  Copyright © 2018 Develop. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface RNLoadingView : UIView

/// The animation view
@property (nonatomic, strong, readonly) UIActivityIndicatorView *loading;
/// The annotate for animation
@property (nonatomic, strong, readonly) UILabel *annotate;

@end
