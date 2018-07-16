//
//  RNImagesDetailView.m
//  RNManagers
//
//  Created by admin on 2018/7/13.
//  Copyright © 2018 Develop. All rights reserved.
//

#import "RNImageManager.h"
#import "RNImagesDetailView.h"
#import "RNImageCollectionCell.h"

@interface RNImagesDetailView() <UICollectionViewDelegate, UICollectionViewDataSource, UIScrollViewDelegate> {
    NSMutableArray *fetchingAssets;
}

/// Back & Title
@property (nonatomic, strong) UIButton *backButton;
@property (nonatomic, strong) UILabel *titleLabel;
@property (nonatomic, strong) UILabel *subTitleLable;
@property (nonatomic, strong) UIButton *selectButton;
/// The view for shown
@property (nonatomic, strong) UICollectionView *assetsCollectionView;

@end

@implementation RNImagesDetailView

@synthesize horizontal = _horizontal;
@synthesize multipleSelect = _multipleSelect;
@synthesize assets;
/// 设置排列方向
- (void)setHorizontal:(BOOL)horizontal {
    _horizontal = horizontal;
    UICollectionViewFlowLayout *layout = (UICollectionViewFlowLayout *)_assetsCollectionView.collectionViewLayout;
    if (layout) {
        /// 初始化图片排列
        CGFloat w = self.frame.size.width;
        CGFloat h = self.frame.size.height;
        layout.scrollDirection = horizontal;
        layout.itemSize = horizontal ? CGSizeMake(w, h - 100) : CGSizeMake(w / 2, w / 2);
    }
}

/// 设置选择模式
- (void)setMultipleSelect:(BOOL)multipleSelect {
    _multipleSelect = multipleSelect;
}

/// 设置数组
- (void)setAssets:(NSArray *)assets {
    /// 创建数组
    if (!fetchingAssets) {
        fetchingAssets = [NSMutableArray array];
    }
    [fetchingAssets removeAllObjects];

    /// 赋值
    for (NSString *assetID in assets) {
        NSMutableDictionary *assetInfo = [NSMutableDictionary dictionary];
        assetInfo[@"id"] = assetID;
        assetInfo[@"select"] = @(NO);
        assetInfo[@"loading"] = @(NO);
        [fetchingAssets addObject:assetInfo];
    }

    /// 刷新
    [_assetsCollectionView reloadData];
    if (_horizontal) {
        [self updateTitle:0];
    }
    if (_multipleSelect) {
        [self updateSubtitle];
    }
}

/**
 * 初始化
 */
- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        /// 背景色
        self.backgroundColor = [UIColor whiteColor];

        /// 顶部视图
        [self createTopContainer:frame];

        /// 图片展示视图
        [self createCollectionView:frame];

        /// 选择按钮
        [self createSelectButton:frame];

        /// 注册Cell
        [_assetsCollectionView registerClass:[RNImageCollectionCell class] forCellWithReuseIdentifier:@"asset"];
    }
    return self;
}

#pragma mark - Creation

/**
 初始化顶部视图
 */
- (void)createTopContainer:(CGRect)frame {
    _backButton = [[UIButton alloc] initWithFrame:CGRectMake(0, 0, 75, 50)];
    [_backButton setTitle:@"く返回" forState:UIControlStateNormal];
    [_backButton setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    [_backButton addTarget:self action:@selector(clickBack) forControlEvents:UIControlEventTouchDown];

    _titleLabel = [[UILabel alloc] initWithFrame:CGRectMake(75, 0, frame.size.width - 150, 40)];
    _titleLabel.textColor = [UIColor whiteColor];
    _titleLabel.font = [UIFont systemFontOfSize:17];
    _titleLabel.textAlignment = NSTextAlignmentCenter;

    _subTitleLable = [[UILabel alloc] initWithFrame:CGRectMake(80, 30, frame.size.width - 160, 15)];
    _subTitleLable.textColor = [UIColor whiteColor];
    _subTitleLable.font = [UIFont systemFontOfSize:12];
    _subTitleLable.textAlignment = NSTextAlignmentCenter;

    UIView *container = [[UIView alloc] initWithFrame:CGRectMake(0, 0, frame.size.width, 50)];
    container.backgroundColor = RN_SELECT_COLOR;
    [container addSubview:_backButton];
    [container addSubview:_titleLabel];
    [container addSubview:_subTitleLable];
    [self addSubview:container];
}

/**
 初始化图片展示视图
 */
- (void)createCollectionView:(CGRect)frame {
    /// 初始化图片排列
    CGFloat w = frame.size.width;
    CGFloat h = frame.size.height;
    /// init layout
    UICollectionViewFlowLayout *layout = [[UICollectionViewFlowLayout alloc] init];
    layout.minimumLineSpacing = 0;
    layout.minimumInteritemSpacing = 0;
    layout.scrollDirection = _horizontal;
    layout.itemSize = CGSizeZero;

    /// 初始化图片显示集合视图
    CGRect collectionFrame = CGRectMake(0, 50, w, h - 100);
    _assetsCollectionView = [[UICollectionView alloc] initWithFrame: collectionFrame collectionViewLayout:layout];
    _assetsCollectionView.backgroundColor = [UIColor whiteColor];
    _assetsCollectionView.pagingEnabled = YES;
    _assetsCollectionView.bounces = NO;
    [self addSubview:_assetsCollectionView];

    /// 设置代理
    _assetsCollectionView.dataSource = self;
    _assetsCollectionView.delegate = self;
}

/**
 * 创建选择按钮
 */
- (void)createSelectButton:(CGRect)frame {

    _selectButton = [[UIButton alloc] initWithFrame:CGRectMake(0, frame.size.height - 50, frame.size.width, 50)];
    _selectButton.enabled = NO;
    [_selectButton setTitle:@"选择" forState:UIControlStateNormal];
    [_selectButton setTitleColor:[UIColor grayColor] forState:UIControlStateNormal];
    [_selectButton setTitleColor:RN_DEEPBLUE_COLOR forState:UIControlStateSelected];
    [_selectButton addTarget:self action:@selector(clickSelect) forControlEvents:UIControlEventTouchDown];
    [self addSubview:_selectButton];

    UIView *line = [[UIView alloc] initWithFrame:CGRectMake(0, 0, frame.size.width, 1)];
    line.backgroundColor = [UIColor lightGrayColor];
    [_selectButton addSubview:line];
}

#pragma mark - Logic Operation

/**
 * 点击返回
 */
- (void)clickBack {
    [UIView animateWithDuration:0.3 animations:^{
        self.transform = CGAffineTransformIdentity;
    } completion:^(BOOL finished) {
        [self removeFromSuperview];
    }];
}

/**
 * 点击选择
 */
- (void)clickSelect {
    NSMutableArray *images = [NSMutableArray array];
    for (NSMutableDictionary *assetInfo in fetchingAssets) {
        if ([assetInfo[@"select"] boolValue]) {
            UIImage *image = assetInfo[@"image"];
            NSData *imageData = UIImagePNGRepresentation(image);
            NSString *imageStr = [imageData base64EncodedStringWithOptions:0];
            [images addObject:@{@"uri": [NSString stringWithFormat:@"data:image/png;base64,%@", imageStr]}];
        }
    }
    if (_delegate && [_delegate respondsToSelector:@selector(selectedImages:)]) {
        [_delegate selectedImages:images];
    }
}

/**
 * 更新顶部标签
 */
- (void)updateTitle:(NSInteger)index {
    if (_horizontal) {
        _titleLabel.text = [NSString stringWithFormat:@"%ld/%ld", index + 1, fetchingAssets.count];
    } else {
        _titleLabel.text = [NSString stringWithFormat:@"共%ld张图片", fetchingAssets.count];
    }
}

/**
 * 更新详细
 */
- (void)updateSubtitle {

    NSInteger count = 0;
    for (NSInteger i = 0; i < fetchingAssets.count; i++) {
        if ([fetchingAssets[i][@"select"] boolValue]) {
            count += 1;
        }
    }
    if (count == 0) {
        _subTitleLable.text = @"未选择图片";
    } else {
        _subTitleLable.text = [NSString stringWithFormat:@"已选择(%ld)张图片", count];
    }
}

/**
 * 更新选择按钮状态
 */
- (void)updateSelectButtonStatus {
    BOOL isEnable = NO;
    for (NSDictionary *assetInfo in fetchingAssets) {
        if ([assetInfo[@"select"] boolValue]) {
            isEnable = YES;
            break;
        }
    }
    _selectButton.enabled = isEnable;
    _selectButton.selected = isEnable;
}

#pragma mark - Data source & Delegates

/**
 * 计算图片个数
 */
- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section {
    return fetchingAssets.count;
}

/**
 * 绘制图片Cell
 */
- (__kindof UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath {
    RNImageCollectionCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:@"asset"
                                                                            forIndexPath:indexPath];
    NSMutableDictionary *assetInfo = fetchingAssets[indexPath.row];
    if (!assetInfo[@"image"]) {
        if (![assetInfo[@"loading"] boolValue]) {
            assetInfo[@"loading"] = @(YES);
            [RNImageManager fetchImageWithAssetIdentifier:assetInfo[@"id"]
                                          targetImageSize:nil
                                        completionHandler:^(UIImage *image, NSString *errDescription)
            {
                assetInfo[@"image"] = image;
                assetInfo[@"loading"] = @(NO);
                [collectionView reloadItemsAtIndexPaths:@[indexPath]];
            }];
        }
    } else {
        cell.loading = NO;
        cell.imageView.image = assetInfo[@"image"];
    }
    cell.selected = [assetInfo[@"select"] boolValue];
    return cell;
}

/**
 * 点击Cell触发
 */
- (void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath {
    if (!_multipleSelect) {
        for (NSInteger i = 0; i < fetchingAssets.count; i++) {
            NSMutableDictionary *assetInfo = fetchingAssets[i];
            if (indexPath.row != i) {
                assetInfo[@"select"] = @(NO);
            }
        }
    }
    NSMutableDictionary *assetInfo = fetchingAssets[indexPath.row];
    assetInfo[@"select"] = @(![assetInfo[@"select"] boolValue]);
    [collectionView reloadData];

    /// update selectButton's state
    [self updateSelectButtonStatus];

    /// update title
    if (_multipleSelect) {
        [self updateSubtitle];
    }
}

/**
 * 滑动结束触发
 */
- (void)scrollViewDidEndDecelerating:(UIScrollView *)scrollView {
    if (_horizontal) {
        NSInteger index = scrollView.contentOffset.x / self.frame.size.width;
        [self updateTitle:index];
    }
}

@end
