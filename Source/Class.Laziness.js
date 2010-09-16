/*
---

description: Class Mutator to reduce memory usage of class' prototype objects and function pointers unless an instance is instantiated

license: MIT-style license

authors:
- Elad Ossadon

requires:
- core:1.2.3/Class

provides: [Class.Laziness]

...
*/

Class.Mutators.Laziness=function (getClassContents) {
	// save current initialize method
	var oldInit=this.prototype.initialize;
	var klass=this;
	// overwrite initialize method
	klass.prototype.initialize=function () {
		// execute the Laziness method and get an object containing the prototype of the class, and extend class' methods
		var classContents=getClassContents();
		klass.implement(classContents);

		// assign this.parent, so it can be used to call the base class' initialize from within the constructor
		if (klass.parent) this.parent=klass.parent.prototype.initialize;

		// if classContents contains initialize method it overrides the oldInit
		if (classContents.initialize) classContents.initialize.apply(this,arguments);
		// otherwise, restore the initialize method in the prototype, the 'klass.prototype.initialize' overwrite is not needed anymore for further instances since everything's in the prototype
		else if (oldInit) {
			klass.prototype.initialize=oldInit;
			// run the old init with the args
			oldInit.apply(this,arguments);
		}

		// forget the parent after executing
		delete this.parent;
	};
};
