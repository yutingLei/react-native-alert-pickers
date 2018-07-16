//
//  RNImagesView.m
//  RNManagers
//
//  Created by admin on 2018/7/13.
//  Copyright © 2018 Develop. All rights reserved.
//

#import "RNImagesView.h"
#import "RNImageManager.h"
#import "RNLoadingView.h"
#import <Photos/Photos.h>

@implementation RNImageContainerView
@end

@interface RNImagesView () {
    BOOL horizontal;
    NSString *selectMode; // "multiple" or non-multiple
}

/// Container view
@property (nonatomic, strong) RNImageContainerView *containerView;

/// Loading view
@property (nonatomic, strong) RNLoadingView *loadingView;

/// The collection's title's attribute
@property (nonatomic, strong) NSDictionary *attributes;

/// Collections (such as albums)
@property (nonatomic, strong) NSMutableArray *collections;
@property (nonatomic, strong) UITableView *collectionTableView;

@end

@implementation RNImagesView

RCT_EXPORT_MODULE();

/// 选择图片后的回调
RCT_EXPORT_VIEW_PROPERTY(onSelected, RCTBubblingEventBlock)

/// 初始化容器视图
- (UIView *)view {
    if (!_containerView) {
        _containerView = [RNImageContainerView new];
    }
    return _containerView;
}
#pragma mark - Lazy Array
/// 初始化加载视图
- (RNLoadingView *)loadingView {
    if (!_loadingView) {
        CGFloat w = self.view.bounds.size.width / 2;
        _loadingView = [[RNLoadingView alloc] initWithFrame:CGRectMake(0, 0, w, 65)];
        _loadingView.center = self.view.center;
    }
    return _loadingView;
}

/// 初始化相册集合
- (NSMutableArray *)collections {
    if (!_collections) {
        _collections = [NSMutableArray array];
    }
    return _collections;
}

/// 初始化相册集合显示表格
- (UITableView *)collectionTableView {
    if (!_collectionTableView) {
        _collectionTableView = [[UITableView alloc] initWithFrame:self.view.bounds style:UITableViewStylePlain];
        _collectionTableView.tableFooterView = [UIView new];
        _collectionTableView.dataSource = self;
        _collectionTableView.delegate = self;
        _collectionTableView.translatesAutoresizingMaskIntoConstraints = NO;
    }
    return _collectionTableView;
}

/// 初始化标题属性
- (NSDictionary *)attributes {
    if (!_attributes) {
        _attributes = @{@"title": @{NSFontAttributeName: [UIFont systemFontOfSize:17],
                                    NSForegroundColorAttributeName: RN_SELECT_COLOR},
                        @"count": @{NSFontAttributeName: [UIFont systemFontOfSize:15],
                                    NSForegroundColorAttributeName: [UIColor grayColor]}
                        };
    }
    return _attributes;
}
@end

#pragma mark - Fetch Colletions/Assets/Images
@implementation RNImagesView(Fetch)
/**
 * 查询所有相册集合
 */
RCT_CUSTOM_VIEW_PROPERTY(fetchCollections, BOOL, RNImagesView) {
    BOOL isLoading = [json boolValue];
    if (isLoading && !_collections) {
        /// 显示加载动画视图
        [self.view addSubview:self.loadingView];

        /// 开始加载目录列表
        __weak typeof(self) weakSelf = self;
        [RNImageManager fetchAssetsCollectionsWithCompletionHandler:^(NSArray *collections, NSString *errDescription) {
            __strong typeof(weakSelf) self = weakSelf;
            /// 加载失败
            if (errDescription) {
                /// 移除动画
                [self.loadingView.loading removeFromSuperview];
                /// 显示错误
                UILabel *annotate = self.loadingView.annotate;
                annotate.text = errDescription;
                annotate.textColor = [UIColor redColor];
            }
            /// 加载成功
            else {
                /// 1. 移除加载动画视图
                [self.loadingView removeFromSuperview];
                /// 2. 保存数据
                [self.collections addObjectsFromArray:collections];
                /// 3. 添加列表表格视图
                [self.view addSubview: self.collectionTableView];
            }
        }];
    }
}

/**
 * 设置图片显示方式
 */
RCT_CUSTOM_VIEW_PROPERTY(horizontal, BOOL, RNImagesView) {
    horizontal = [json boolValue];
}

/**
 * 设置选择模式
 */
RCT_CUSTOM_VIEW_PROPERTY(selectMode, NSString, RNImagesView) {
    selectMode = (NSString *)json;
}
@end

#pragma mark - Delegates
@implementation RNImagesView(Delegate)

- (void)selectedImages:(NSArray <NSString *> *)images {
    _containerView.onSelected(@{@"images": images});
}

/**
 * 计算表格个数
 */
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return _collections.count;
}
/**
 * 计算表格高度
 */
- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath {
    return 60;
}

/**
 * 绘制表格
 */
- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"collection"];
    if (!cell) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:@"collection"];
        cell.accessoryType = UITableViewCellAccessoryDisclosureIndicator;
    }
    /// name/count
    NSString *name = _collections[indexPath.row][@"title"];
    NSUInteger count = [_collections[indexPath.row][@"count"] integerValue];
    NSString * title = [NSString stringWithFormat:@"%@ (%ld)", name, count];
    NSMutableAttributedString *str = [[NSMutableAttributedString alloc] initWithString:title];
    [str addAttributes:self.attributes[@"title"] range:NSMakeRange(0, name.length)];
    [str addAttributes:self.attributes[@"count"] range:NSMakeRange(name.length, title.length - name.length)];
    cell.textLabel.attributedText = str;
    return cell;
}

/**
 * 点击表格触发
 */
- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    UITableViewCell *cell = [tableView cellForRowAtIndexPath:indexPath];
    [cell setSelected:NO animated:YES];

    /// 初始化图片显示视图
    CGFloat w = self.view.frame.size.width;
    CGFloat h = self.view.frame.size.height;
    RNImagesDetailView *detailView = [[RNImagesDetailView alloc] initWithFrame:CGRectMake(w, 0, w, h)];
    detailView.delegate = self;
    detailView.horizontal = horizontal;
    detailView.multipleSelect = [selectMode containsString:@"multiple"];
    [self.view addSubview:detailView];

    /// 查询所有assets
    NSString *collectionID = self.collections[indexPath.row][@"id"];
    [RNImageManager fetchAssetsWithIdentifier:collectionID
                        ascendingCreationDate:YES
                            completionHandler:^(NSArray *assets, NSString *errDescription)
    {
        [UIView animateWithDuration:0.3 animations:^{
            detailView.transform = CGAffineTransformMakeTranslation(-w, 0);
        } completion:^(BOOL finished) {
            detailView.assets = assets;
        }];
    }];
}
@end
