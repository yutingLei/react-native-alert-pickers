//
//  RNImageCollectionCell.h
//  RNManagers
//
//  Created by admin on 2018/7/13.
//  Copyright © 2018 Develop. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface RNImageCollectionCell : UICollectionViewCell

/// 是否在加载中
@property (nonatomic, assign, getter=isLoading) BOOL loading;

/// 是否选中
@property (nonatomic, assign, getter=isSelected) BOOL selected;

/// 图片
@property (strong, nonatomic) UIImageView *imageView;

@end
