mootools-laziness
=================

On regular MooTools class creation, all of the class' prototype is being created before it's really needed.

For example:

	var MyClass=new Class({
		Implements:[Options],
		options:{
			defaultOptionA:"defA",
			defaultOptionA:"defB"
		},
		initialize:function (a,b) {
			this.result=a+b;
		},
		getResult:function () {
			return this.result;
		},
		methodA:function () { return "methodA"; },
		methodB:function () { return "methodB"; },
		methodC:function () { return "methodC"; },
		methodD:function () { return "methodD"; }
	});

The above code actually creates 9 new pointers (not including the class itself and Implements array): 1 options object, 2 values in the options object and 6 function pointers.

This happens even if you don't use this class currently in your code. Actually, the only place those pointers are needed is when instantiating a new instance of that class.


Class.Laziness Mutator
----------------------

So, the Class.Laziness Mutator comes to the rescue:

	var MyClass=new Class({
		Implements:[Options],
		Laziness:function () { return {
			initialize:function (a,b) {
				this.result=a+b;
			},
			options:{
				defaultOptionA:"defA",
				defaultOptionA:"defB"
			},
			getResult:function () {
				return this.result;
			},
			methodA:function () { return "methodA"; },
			methodB:function () { return "methodB"; },
			methodC:function () { return "methodC"; },
			methodD:function () { return "methodD"; }
		}; }
	});



This reduces the number of new pointers to 1!

The only place where those objects and function pointers will be created is when creating an instance by using 'new MyClass(a,b)'. Creating stuff only when they are needed is called Lazy Loading, hence, the Mutator's name.

The Mutator rewrites the initialize method and copies the result of the Laziness function to the prototype of the class (using Class#implement method), but only once; the next instance will have everything in it and won't activate the Laziness function.

This is good when including a big library with lots of classes but not all of them are used in a single page.

After applying Laziness on the latest MooTools more (1.2.4.2) there's 20% improvement in parse time, not to mention the memory usage.


Things you need to know when using Laziness
-------------------------------------------

* You should put Extends/Implements outside of the Laziness function
* If you use Binds Mutator, you should put initialize function outside of the Laziness function
* MyClass.prototype.someMethod isn't available until you instantiate a new class instance, so if you need it for some reason, put it outside the Laziness function
