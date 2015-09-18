Plugins to be installed
	1. cordova plugin add https://github.com/EddyVerbruggen/LaunchMyApp-PhoneGap-Plugin.git --variable URL_SCHEME=snapmdconeectedcare
	2. cordova plugin add https://github.com/EddyVerbruggen/Insomnia-PhoneGap-Plugin.git
	3. cordova plugin add https://github.com/songz/cordova-plugin-opentok/
	4. cordova plugin add com.ionic.keyboard
	5. cordova plugin add cordova-plugin-splashscreen
	6. cordova plugin add cordova-plugin-inappbrowser
	7. cordova plugin add org.apache.cordova.dialogs

Notes to remember
	1. Remember to change the signalR reference in index.html on very release to different env.
	2. Remember to update the build number in login.html in every build.
	3. Remember to test the app full flow before releasing it to store to make sure everything is working.
