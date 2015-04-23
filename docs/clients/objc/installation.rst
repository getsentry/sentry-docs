Installation
============

The easiest way is to use `CocoaPods`_. It takes care of all required
frameworks and third party dependencies::

    $ pod 'Raven'

Alternatively, you can install manually.

1.  Get the code::

        git clone git://github.com/getsentry/raven-objc

2.  Drag the ``Raven`` subfolder to your project. Check both "copy items into
    destination group's folder" and your target.

Alternatively you can add this code as a Git submodule:

1.  Execute the following commands::

        cd [your project root]
        git submodule add git://github.com/getsentry/raven-objc

2.  Drag the ``Raven`` subfolder to your project. Uncheck the "copy items into
    destination group's folder" box, do check your target.


.. _CocoaPods: http://cocoapods.org/
