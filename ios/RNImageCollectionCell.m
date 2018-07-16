//
//  RNImageCollectionCell.m
//  RNManagers
//
//  Created by admin on 2018/7/13.
//  Copyright © 2018 Develop. All rights reserved.
//

#import "RNLoadingView.h"
#import "RNImageCollectionCell.h"

#define RN_SELECT_COLOR [UIColor colorWithRed:2/9.0 green:26/51.0 blue:28/51.0 alpha:1]
@interface RNImageCollectionCell()

/// 加载视图
@property (nonatomic, strong) RNLoadingView *loadingView;
/// 选择视图的边框
@property (strong, nonatomic) UIView *selectBorderView;
/// 选择视图
@property (strong, nonatomic) UIView *selectView;

@end

@implementation RNImageCollectionCell

@synthesize selected = _selected;
@synthesize loading = _loading;

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {

        [self createImageView];
        [self createSelectBorderView];
        [self createSelecteView];

        // Initialization code
        _selectBorderView.layer.cornerRadius = 12.5;
        _selectBorderView.layer.borderWidth = 2;
        _selectBorderView.layer.borderColor = RN_SELECT_COLOR.CGColor;
        _selectBorderView.backgroundColor = [UIColor clearColor];
        _selectBorderView.clipsToBounds = YES;

        _selectView.backgroundColor = [UIColor clearColor];
        _selectView.layer.cornerRadius = 8;
        _selectView.clipsToBounds = YES;
        self.clipsToBounds = YES;
    }
    return self;
}

#pragma mark - Creations

/**
 * 创建图片
 */
- (void)createImageView {
    _imageView = [[UIImageView alloc] init];
    _imageView.contentMode = UIViewContentModeScaleAspectFill;
    [self.contentView addSubview:_imageView];

    _imageView.translatesAutoresizingMaskIntoConstraints = NO;
    [self.contentView addConstraint:[NSLayoutConstraint constraintWithItem:self.contentView
                                                                 attribute:NSLayoutAttributeTop
                                                                 relatedBy:NSLayoutRelationEqual
                                                                    toItem:_imageView
                                                                 attribute:NSLayoutAttributeTop
                                                                multiplier:1.0
                                                                  constant:0]];
    [self.contentView addConstraint:[NSLayoutConstraint constraintWithItem:self.contentView
                                                                 attribute:NSLayoutAttributeLeading
                                                                 relatedBy:NSLayoutRelationEqual
                                                                    toItem:_imageView
                                                                 attribute:NSLayoutAttributeLeading
                                                                multiplier:1.0
                                                                  constant:0]];
    [self.contentView addConstraint:[NSLayoutConstraint constraintWithItem:self.contentView
                                                                 attribute:NSLayoutAttributeBottom
                                                                 relatedBy:NSLayoutRelationEqual
                                                                    toItem:_imageView
                                                                 attribute:NSLayoutAttributeBottom
                                                                multiplier:1.0
                                                                  constant:0]];
    [self.contentView addConstraint:[NSLayoutConstraint constraintWithItem:self.contentView
                                                                 attribute:NSLayoutAttributeTrailing
                                                                 relatedBy:NSLayoutRelationEqual
                                                                    toItem:_imageView
                                                                 attribute:NSLayoutAttributeTrailing
                                                                multiplier:1.0
                                                                  constant:0]];
}

/**
 * 创建选择边框视图
 */
- (void)createSelectBorderView {
    _selectBorderView = [[UIView alloc] init];
    [self.contentView addSubview:_selectBorderView];

    _selectBorderView.translatesAutoresizingMaskIntoConstraints = NO;
    [self.contentView addConstraint:[NSLayoutConstraint constraintWithItem:self.contentView
                                                                 attribute:NSLayoutAttributeTrailing
                                                                 relatedBy:NSLayoutRelationEqual
                                                                    toItem:_selectBorderView
                                                                 attribute:NSLayoutAttributeTrailing
                                                                multiplier:1.0
                                                                  constant:5]];
    [self.contentView addConstraint:[NSLayoutConstraint constraintWithItem:self.contentView
                                                                 attribute:NSLayoutAttributeTop
                                                                 relatedBy:NSLayoutRelationEqual
                                                                    toItem:_selectBorderView
                                                                 attribute:NSLayoutAttributeTop
                                                                multiplier:1.0
                                                                  constant:-5]];
    [self.contentView addConstraint:[NSLayoutConstraint constraintWithItem:_selectBorderView
                                                                 attribute:NSLayoutAttributeWidth
                                                                 relatedBy:NSLayoutRelationEqual
                                                                    toItem:nil
                                                                 attribute:NSLayoutAttributeNotAnAttribute
                                                                multiplier:1.0
                                                                  constant:25]];
    [self.contentView addConstraint:[NSLayoutConstraint constraintWithItem:_selectBorderView
                                                                 attribute:NSLayoutAttributeHeight
                                                                 relatedBy:NSLayoutRelationEqual
                                                                    toItem:nil
                                                                 attribute:NSLayoutAttributeNotAnAttribute
                                                                multiplier:1.0
                                                                  constant:25]];
}

/**
 * 创建选择视图
 */
- (void)createSelecteView {
    _selectView = [[UIView alloc] init];
    [_selectBorderView addSubview:_selectView];

    _selectView.translatesAutoresizingMaskIntoConstraints = NO;
    [_selectBorderView addConstraint:[NSLayoutConstraint constraintWithItem:_selectView
                                                                  attribute:NSLayoutAttributeWidth
                                                                  relatedBy:NSLayoutRelationEqual
                                                                     toItem:nil
                                                                  attribute:NSLayoutAttributeNotAnAttribute
                                                                 multiplier:1.0
                                                                   constant:16]];
    [_selectBorderView addConstraint:[NSLayoutConstraint constraintWithItem:_selectView
                                                                  attribute:NSLayoutAttributeHeight
                                                                  relatedBy:NSLayoutRelationEqual
                                                                     toItem:nil
                                                                  attribute:NSLayoutAttributeNotAnAttribute
                                                                 multiplier:1.0
                                                                   constant:16]];
    [_selectBorderView addConstraint:[NSLayoutConstraint constraintWithItem:_selectBorderView
                                                                  attribute:NSLayoutAttributeCenterX
                                                                  relatedBy:NSLayoutRelationEqual
                                                                     toItem:_selectView
                                                                  attribute:NSLayoutAttributeCenterX
                                                                 multiplier:1.0
                                                                   constant:0]];
    [_selectBorderView addConstraint:[NSLayoutConstraint constraintWithItem:_selectBorderView
                                                                  attribute:NSLayoutAttributeCenterY
                                                                  relatedBy:NSLayoutRelationEqual
                                                                     toItem:_selectView
                                                                  attribute:NSLayoutAttributeCenterY
                                                                 multiplier:1.0
                                                                   constant:0]];
}

#pragma mark - Settings
/// 初始化加载视图
- (RNLoadingView *)loading {
    if (!_loadingView) {
        _loadingView = [[RNLoadingView alloc] initWithFrame:self.bounds];
        _loadingView.annotate.text = nil;
        _loadingView.center = self.center;
    }
    return _loadingView;
}

/// 设置加载状态
- (void)setLoading:(BOOL)loading {

    if (loading && !self.loadingView.superview) {
        [self addSubview:self.loadingView];
    } else {
        [self.loadingView removeFromSuperview];
    }
}

/// 设置选中状态
- (void)setSelected:(BOOL)selected {
    _selected = selected;
    _selectView.backgroundColor = selected ? RN_SELECT_COLOR : [UIColor clearColor];
    _selectBorderView.backgroundColor = selected ? [UIColor whiteColor] : [UIColor clearColor];
}

@end
