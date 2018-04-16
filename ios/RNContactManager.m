//
//  RNContactManager.m
//  RNManagers
//
//  Created by admin on 4/16/18.
//  Copyright © 2018 Develop. All rights reserved.
//

#import "RNContactManager.h"
#import <Contacts/Contacts.h>

typedef void(^FetchCantactsCompletionHandler)(NSArray  * _Nullable contacts, NSString  * _Nullable errDescription);

@implementation RNContactManager

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(fetchContacts:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [RNContactManager fetchContactsWithCompletionHandler:^(NSArray * _Nullable contacts, NSString * _Nullable errDescription) {
        if (errDescription) {
            reject(@"-1", errDescription, nil);
        } else {
            resolve(contacts);
        }
    }];
}

/**
 检索所有联系人

 @param handler 返回error为空，则表示检索成功。否则失败，err存储失败原因.
 */
+ (void)fetchContactsWithCompletionHandler:(FetchCantactsCompletionHandler)handler {
    // 授权状态
    [RNContactManager authorizationStatus:^(BOOL authorized, NSString *err) {
        if (authorized) {

            // 创建联系人存储器
            CNContactStore *contactStore = [[CNContactStore alloc] init];

            // 检索请求，按名称排序
            CNContactFetchRequest *req = [[CNContactFetchRequest alloc] initWithKeysToFetch:@[CNContactGivenNameKey, CNContactPhoneNumbersKey, CNContactFamilyNameKey]];
            req.sortOrder = CNContactSortOrderGivenName;

            NSError *error;
            NSMutableArray *contacts = [NSMutableArray array];

            // 枚举所有联系人，该函数为同步函数，检索完成后才开始执行下一步
            [contactStore enumerateContactsWithFetchRequest:req
                                                      error:&error
                                                 usingBlock:^(CNContact * _Nonnull contact, BOOL * _Nonnull stop)
             {
                 NSString *name = [NSString stringWithFormat:@"%@ %@", contact.givenName, contact.familyName];
                 CNLabeledValue<CNPhoneNumber *> *phoneNumber = contact.phoneNumbers.firstObject;
                 [contacts addObject:@{@"name": name, @"phoneNumbers": phoneNumber.value.stringValue}];
             }];

            // 处理结果
            if (error) {
                handler(nil, error.localizedDescription);
            } else {
                handler(contacts, nil);
            }
        } else {
            handler(nil, err);
        }
    }];
}

/**
 获取联系人授权状态，未授权则请求授权

 @param handler YES表示已授权或授权成功，否则授权失败。
 */
+ (void)authorizationStatus:(void(^)(BOOL authorized, NSString *err))handler {
    CNAuthorizationStatus status = [CNContactStore authorizationStatusForEntityType:CNEntityTypeContacts];
    switch (status) {
        case CNAuthorizationStatusDenied:
            handler(NO, @"The user explicitly denied access to contact data for the application.");
            break;
        case CNAuthorizationStatusRestricted:
            handler(NO, @"The application is not authorized to access contact data. The user cannot change this application’s status, possibly due to active restrictions such as parental controls being in place.");
            break;
        default: {
            CNContactStore *contactStore = [[CNContactStore alloc] init];
            [contactStore requestAccessForEntityType:CNEntityTypeContacts completionHandler:^(BOOL granted, NSError * _Nullable error) {
                handler(granted, error.localizedDescription);
            }];
        }
            break;
    }
}

@end
