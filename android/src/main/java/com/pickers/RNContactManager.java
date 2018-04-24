package com.pickers;

import android.net.Uri;
import android.database.Cursor;
import android.provider.ContactsContract;
import android.content.Context;
import android.content.ContentResolver;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import java.util.ArrayList;
import java.util.Map;

import static android.provider.ContactsContract.CommonDataKinds.Contactables;
import static android.provider.ContactsContract.CommonDataKinds.Email;
import static android.provider.ContactsContract.CommonDataKinds.Organization;
import static android.provider.ContactsContract.CommonDataKinds.Phone;
import static android.provider.ContactsContract.CommonDataKinds.StructuredName;
import static android.provider.ContactsContract.CommonDataKinds.StructuredPostal;
import static android.provider.ContactsContract.CommonDataKinds.Event;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;

public class RNContactManager extends ReactContextBaseJavaModule {

  public RNContactManager(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "RNContactManager";
  }

  @ReactMethod
  public void fetchContacts(Promise promise) {
    {
      Context context = getReactApplicationContext();
      ContentResolver cr = context.getContentResolver();

      WritableArray contacts = Arguments.createArray();
      Uri rawContactsUri = Uri.parse("content://com.android.contacts/raw_contacts");
      Uri dataUri = Uri.parse("content://com.android.contacts/data");

      Cursor rawContactsCursor = cr.query(rawContactsUri, new String[] { "contact_id" }, null, null, null);

      if (rawContactsCursor != null) {
        while (rawContactsCursor.moveToNext()) {
          String contactId = rawContactsCursor.getString(0);
          Cursor dataCursor = cr.query(dataUri, new String[] { "data1", "mimetype" }, "contact_id=?",
              new String[] { contactId }, null);

          if (dataCursor != null) {
            WritableMap contact = Arguments.createMap();

            while (dataCursor.moveToNext()) {
              String data1 = dataCursor.getString(0);
              String mimetype = dataCursor.getString(1);

              if ("vnd.android.cursor.item/phone_v2".equals(mimetype)) {//手机号码
                contact.putString("phoneNumber", data1);
              } else if ("vnd.android.cursor.item/name".equals(mimetype)) {//联系人名字
                contact.putString("name", data1);
              }
            }
            contacts.pushMap(contact);
            dataCursor.close();
          }
        }
        rawContactsCursor.close();
        promise.resolve(contacts);
      } else {
        promise.reject("E_NONT_CONTACTS", "Not find any contacts");
      }
    }
  }
}