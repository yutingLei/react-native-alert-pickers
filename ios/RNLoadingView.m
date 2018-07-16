//
//  RNLoadingView.m
//  RNManagers
//
//  Created by admin on 2018/7/13.
//  Copyright © 2018 Develop. All rights reserved.
//

#import "RNLoadingView.h"

@implementation RNLoadingView

@synthesize loading = _loading;
@synthesize annotate = _annotate;

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        CGFloat w = frame.size.width / 2;
        /// 加载动画视图
        CGRect loadingFrame = CGRectMake((w - 20) / 2, 0, 20, 20);
        _loading = [[UIActivityIndicatorView alloc] initWithFrame:loadingFrame];
        _loading.activityIndicatorViewStyle = UIActivityIndicatorViewStyleGray;
        _loading.hidesWhenStopped = YES;
        [_loading startAnimating];
        
        /// 加载提示
        CGRect annotateFrame = CGRectMake(5, 20, w - 10, 45);
        _annotate = [[UILabel alloc] initWithFrame:annotateFrame];
        _annotate.numberOfLines = 2;
        _annotate.text = @"加载列表中...";
        _annotate.font = [UIFont systemFontOfSize:14];
        _annotate.textColor = [UIColor lightGrayColor];
        _annotate.textAlignment = NSTextAlignmentCenter;
        _annotate.tag = 100;
    }
    return self;
}

@end
