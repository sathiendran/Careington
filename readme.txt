Plugins to be installed
	1. ionic plugin add https://github.com/EddyVerbruggen/LaunchMyApp-PhoneGap-Plugin.git --variable URL_SCHEME=snapmdconnectedcare
	2. ionic plugin add https://github.com/EddyVerbruggen/Insomnia-PhoneGap-Plugin.git - Added by manual integration.
	3. ionic plugin add https://github.com/prabinyovan/cordova-plugin-opentok-v2.6.0
	4. ionic plugin add https://github.com/katzer/cordova-plugin-background-mode.git
	5. ionic plugin add com.ionic.keyboard
	6. ionic plugin add org.apache.cordova.splashscreen
	7. ionic plugin add https://github.com/apache/cordova-plugin-inappbrowser
	8. ionic plugin add org.apache.cordova.dialogs
	9. ionic plugin add org.apache.cordova.device
	

Notes to remember
	1. Remember to change the signalR reference in index.html on very release to different env.
	2. Remember to update the build number in login.html in every build.
	3. Remember to test the app full flow before releasing it to store to make sure everything is working.
	
Opentok Android:

www/js/opentok.js - 720 - //element.parentNode.removeChild(element);
					604 -  delete streamElements[streamId];
					
C:\Users\RINSOFT\workspace\snapmdV2\platforms\android\src\com\tokbox\cordova

opentokandroidplugin.java - 
	
	33, import com.opentok.android.Stream.StreamVideoType;
	36, import android.util.DisplayMetrics;
		import com.opentok.android.BaseVideoRenderer;
	117,  //widthRatio = (float) mProperty.getDouble(ratioIndex);
          //heightRatio = (float) mProperty.getDouble(ratioIndex + 1);
		
		DisplayMetrics metrics = new DisplayMetrics();
		cordova.getActivity().getWindowManager().getDefaultDisplay().getMetrics(metrics);

		widthRatio = (float) mProperty.getDouble(ratioIndex) * metrics.density;
		heightRatio = (float) mProperty.getDouble(ratioIndex + 1) * metrics.density;
	187, mPublisher.setStyle(BaseVideoRenderer.STYLE_VIDEO_SCALE, BaseVideoRenderer.STYLE_VIDEO_FILL);
	277, mSubscriber.setStyle(BaseVideoRenderer.STYLE_VIDEO_SCALE, BaseVideoRenderer.STYLE_VIDEO_FILL);


Change URL Scheme for co-brand app	
	
	
Android Release
com.snap.connectedcare.production

ionic build --release android

C:\Program Files\Java\jdk1.8.0_25\bin>

	1.	keytool -genkey -v -keystore "C:\Users\RINSOFT\workspace\SnapMD\platforms\android\ant-build\VirtualCare.keystore" -alias VirtualCare -keyalg RSA -keysize 2048 -validity 10000


	2.	jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore "C:\Users\RINSOFT\workspace\snapmdV2\platforms\android\ant-build\VirtualCare.keystore" "C:\Users\RINSOFT\workspace\snapmdV2\platforms\android\ant-build\CordovaApp-release-unsigned.apk" VirtualCare

F:\adt-bundle-windows-x86-20140702\adt-bundle-windows-x86-20140702\sdk\build-too
ls\21.0.0>		

	3.	zipalign -v 4 "C:\Users\RINSOFT\workspace\snapmdV2\platforms\android\ant-build\CordovaApp-release-unsigned.apk" "C:\Users\RINSOFT\workspace\snapmdV2\platforms\android\ant-build\VirtualCare.apk"

	
IOS:

 ionic plugin rm cordova-plugin-customurlscheme
    device org.apache.cordova.device
    ionic plugin rm de.appplant.cordova.plugin.local-notification
    ionic plugin add de.appplant.cordova.plugin.local-notification
		
opentok:

opentokplugin.m

465- [streamData setObject: stream.name forKey: @"name" ];
    [streamData setObject: stream.streamId forKey: @"streamId" ];
     [streamData setObject: [NSNumber numberWithInt: stream.videoType] forKey: @"videoType" ];
     [streamData setObject: [NSNumber numberWithInt: stream.videoDimensions.height] forKey: @"videoHeight" ];
     [streamData setObject: [NSNumber numberWithInt: stream.videoDimensions.width] forKey: @"videowidth" ];	
	 
	
