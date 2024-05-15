Java.perform(function() {
	var currentActivity;

	// Intercept the call to the 'onCreate' method of all the Activities
	var Activity = Java.use('android.app.Activity');
	Activity.onCreate.overload('android.os.Bundle').implementation = function(savedInstanceState) {

		// Save the reference to the current activity
		this.onCreate.overload('android.os.Bundle').call(this, savedInstanceState);

		currentActivity = this;
		console.log('The current Activity is: ' + currentActivity.getClass().getName());

		let bundle = currentActivity.getIntent().getExtras();
		console.log('intent:',  currentActivity.getIntent());
		if (bundle) {
			var keys = bundle.keySet();
			var iterator = keys.iterator();
			while (iterator.hasNext()) {
				var k = iterator.next().toString();
				var v = bundle.get(k);
				console.log('\t' + v.getClass().getName());
				console.log('\t' + k + ' : ' + v.toString());
			}
		}
	};

});