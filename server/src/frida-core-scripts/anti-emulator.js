function replaceFinaleField(object, fieldName, value){
	var field =  object.class.getDeclaredField(fieldName);
	var result = field.get(object.class);
	var obj = {'plugin': 'bypass', 'property' : 'Build Properties', 'real_value' : fieldName.toString() + ' = ' + result.toString(), 'return_value' : fieldName.toString() + ' = ' + value.toString()};
	send(JSON.stringify(obj));
	field.setAccessible(true);
	field.set(null, value);
}

function bypass_build_properties(){
	// Class containing const that we want to modify
	const Build = Java.use('android.os.Build');

	// reflection class for changing const
	const Field = Java.use('java.lang.reflect.Field');
	const Class = Java.use('java.lang.Class');

	// Replacing Build static fields
	replaceFinaleField(Build, 'FINGERPRINT', 'abcd/C1505:4.1.1/11.3.A.2.13:user/release-keys');
	replaceFinaleField(Build, 'MODEL', 'C1505');
	replaceFinaleField(Build, 'MANUFACTURER', 'Sony');
	replaceFinaleField(Build, 'BRAND', 'Xperia');
	replaceFinaleField(Build, 'BOARD', '7x27');
	replaceFinaleField(Build, 'ID', '11.3.A.2.13');
	replaceFinaleField(Build, 'SERIAL', 'abcdef123');
	replaceFinaleField(Build, 'TAGS', 'release-keys');
	replaceFinaleField(Build, 'USER', 'administrator');
}

function bypass_phonenumber(){
	const TelephonyManager = Java.use('android.telephony.TelephonyManager');
	TelephonyManager.getLine1Number.overload().implementation = function(){
		var result = this.getLine1Number();
		var return_value = '060102030405';
		var obj = {'plugin': 'bypass', 'property' : 'Phone number', 'real_value' : result.toString(), 'return_value' : return_value};
		send(JSON.stringify(obj));
		return return_value;
	};
}

function bypass_deviceid(){
	const TelephonyManager = Java.use('android.telephony.TelephonyManager');
	TelephonyManager.getDeviceId.overload().implementation = function(){
		var result = this.getDeviceId();
		var return_value = '012343545456445';
		var obj = {'plugin': 'bypass', 'property' : 'Device id', 'real_value' : result.toString(), 'return_value' : return_value};
		send(JSON.stringify(obj));
		return return_value;
	};
}

function bypass_imsi(){
	const TelephonyManager = Java.use('android.telephony.TelephonyManager');
	TelephonyManager.getSubscriberId.overload().implementation = function(){
		var result = this.getSubscriberId();
		var return_value = '310260000000111';
		var obj = {'plugin': 'bypass', 'property' : 'Suscriber ID', 'real_value' : result.toString(), 'return_value' : return_value};
		send(JSON.stringify(obj));
		return return_value;
	};
}

function bypass_operator_name(){
	const TelephonyManager = Java.use('android.telephony.TelephonyManager');
	TelephonyManager.getNetworkOperatorName.overload().implementation = function(){
		var result = this.getNetworkOperatorName();
		var return_value = 'not';
		var obj = {'plugin': 'bypass', 'property' : 'Network Operator Name', 'real_value' : result.toString(), 'return_value' : return_value};
		send(JSON.stringify(obj));
		return return_value;
	};
}

function bypass_sim_operator_name(){
	const TelephonyManager = Java.use('android.telephony.TelephonyManager');

	var telephonyManagerMethods = ['getSimOperatorName', 'getSimOperator'];
	var return_value = 'not';

	telephonyManagerMethods.forEach(function(method, i) {
		TelephonyManager[method].overload().implementation = function() {
			var result = this[method]();
			var obj = {'plugin': 'bypass', 'property' : 'Sim Operator', 'real_value' : result.toString(), 'return_value' : return_value};
			send(JSON.stringify(obj));
			return return_value;
		};
	});
}

function bypass_country_iso(){
	const TelephonyManager = Java.use('android.telephony.TelephonyManager');

	TelephonyManager.getNetworkCountryIso.overload('int').implementation = function(slotIndex){
		var result = this.getNetworkCountryIso(slotIndex);
		var return_value = 'not';
		var obj = {'plugin': 'bypass', 'property' : 'Network Country Iso', 'real_value' : result.toString(), 'return_value' : return_value};
		send(JSON.stringify(obj));
		return return_value;
	};

	TelephonyManager.getNetworkCountryIso.overload().implementation = function(){
		var result = this.getNetworkCountryIso();
		var return_value = 'not';
		var obj = {'plugin': 'bypass', 'property' : 'Network Country Iso', 'real_value' : result.toString(), 'return_value' : return_value};
		send(JSON.stringify(obj));
		return return_value;
	};
}

function bypass_has_file(){
	const File = Java.use('java.io.File');
	const KnownFiles= [
		'ueventd.android_x86.rc',
		'x86.prop',
		'ueventd.ttVM_x86.rc',
		'init.ttVM_x86.rc',
		'fstab.ttVM_x86',
		'fstab.vbox86',
		'init.vbox86.rc',
		'ueventd.vbox86.rc',
		'/dev/socket/qemud',
		'/dev/qemu_pipe',
		'/system/lib/libc_malloc_debug_qemu.so',
		'/sys/qemu_trace',
		'/system/bin/qemu-props',
		'/dev/socket/genyd',
		'/dev/socket/baseband_genyd',
		'/proc/tty/drivers',
		'/proc/cpuinfo'
	];


	File.exists.implementation = function () {
		var x = this.getAbsolutePath();
		var return_value = false;

		for(var i=0; i<KnownFiles.length; i++){

			if(KnownFiles[i] == x){
				var obj = {'plugin': 'bypass', 'property' : 'Has File', 'real_value' : x.toString(), 'return_value' : return_value};
				send(JSON.stringify(obj));
				return return_value;
			}
		}

		return this.exists();
	};
}

function bypass_processbuilder(){
	var ProcessBuilder = Java.use('java.lang.ProcessBuilder');

	ProcessBuilder.$init.overload('[Ljava.lang.String;').implementation = function(x){
		var result = this.$init(x);
		var return_value = undefined;
		var obj = {'plugin': 'bypass', 'property' : 'ProcessBuilder', 'real_value' : x + '\n' + result, 'return_value' : x + '\n' + return_value};
		send(JSON.stringify(obj));
		return return_value;
	};
}


function bypass_system_properties() {
	/*
	* Function used to bypass common checks to
	* Android OS properties
	* Bypass the props checking from this git : https://github.com/strazzere/anti-emulator
	* Also used https://www.virusbulletin.com/virusbulletin/2019/01/vb2018-paper-unpacking-packed-unpacker-reversing-android-anti-analysis-native-library
	*/
	const SystemProperties = Java.use('android.os.SystemProperties');
	const String = Java.use('java.lang.String');
	const Properties = {
		'init.svc.qemud': null,
		'init.svc.qemu-props': null,
		'qemu.hw.mainkeys': null,
		'qemu.sf.fake_camera': null,
		'qemu.sf.lcd_density': null,
		'ro.bootloader': 'xxxxx',
		'ro.bootmode': 'xxxxxx',
		'ro.hardware': 'xxxxxx',
		'ro.kernel.android.qemud': null,
		'ro.kernel.qemu.gles': null,
		'ro.kernel.qemu': 'xxxxxx',
		'ro.product.device': 'xxxxx',
		'ro.product.model': 'xxxxxx',
		'ro.product.name': 'xxxxxx',
		'ro.serialno': null,
		'init.svc.gce_fs_monitor': 'xxxxxx',
		'init.svc.dumpeventlog': 'xxxxxx',
		'init.svc.dumpipclog': 'xxxxxx',
		'init.svc.dumplogcat': 'xxxxxx',
		'init.svc.dumplogcat-efs': 'xxxxxx',
		'init.svc.filemon': 'xxxxxx',
		'ro.hardware.virtual_device': 'xxxxx',
		'ro.kernel.androidboot.hardware': 'xxxxx',
		'ro.boot.hardware': 'xxxxx',
		'ro.boot.selinux': 'enable',
		'ro.factorytest': 'xxxxxx',
		'ro.kernel.android.checkjni': 'xxxxxx',
		'ro.build.product': 'xxxxx',
		'ro.product.manufacturer': 'xxxxx',
		'ro.product.brand': 'xxxxx',
		'init.svc.vbox86-setup': null,
		'init.svc.goldfish-logcat': null,
		'init.svc.goldfish-setup': null,

	};

	SystemProperties.get.overload('java.lang.String').implementation = function(x){
		var result = this.get(x);
		if (x in Properties){
			var obj = {'plugin': 'bypass', 'property' : 'System Property', 'real_value' : x.toString() + ' = ' + result.toString(), 'return_value' : x.toString() + ' = ' + Properties[x].toString()};
			send(JSON.stringify(obj));
			return Properties[x];
		}
		return this.get(x);
	};

}

export { bypass_build_properties };
export { bypass_phonenumber };
export { bypass_deviceid };
export { bypass_imsi };
export { bypass_operator_name };
export { bypass_sim_operator_name };
export { bypass_has_file };
export { bypass_processbuilder };
export { bypass_system_properties };
export { bypass_country_iso };