SessionStack
============

SessionStack error session replay plugin for Sentry
```````````````````````````````````````````````````

To integrate the SessionStack player within your Sentry error reports, follow the steps below:
Add your web app to your SessionStack account

.. image:: http://blog.sessionstack.com/wp-content/uploads/2017/04/create_website_opened.png
    :width: 800px

Add the SessionStack JavaScript snippet into the head element of your web app.   	
 
.. code-block:: html

    <!-- Begin SessionStack code -->
    <script type="text/javascript">
        !function(a,b){var c=window;c.SessionStack=a,c[a]=c[a]||function(){
        c[a].q=c[a].q||[],c[a].q.push(arguments)},c[a].t=b;var d=document.createElement("script");
        d.async=1,d.src="https://cdn.sessionstack.com/sessionstack.js";
        var e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(d,e);
        }("sessionstack","<YOUR TOKEN>");
    </script>
    <!-- End SessionStack Code -->
 
To associate each Sentry event with the respective user session at the time the error occurred, an additional snippet needs to be added to your web app:

.. code-block:: html

    <!-- Begin SessionStack-Sentry code -->
    <script type="text/javascript">
        sessionstack("getSessionId",function(s){s&&Raven.setDataCallback(function(t){return t
        .contexts=t.contexts||{},t.contexts.sessionstack={session_id:s,timestamp:(new Date).
        getTime()},t})});
    </script>
    <!-- End SessionStack-Sentry code -->
 
 
* Get your SessionStack website ID from the Settings section. You’ll need it later to configure the SessionStack plugin from within your Sentry project

.. image:: http://blog.sessionstack.com/wp-content/uploads/2017/05/Screenshot_1.png
    :width: 800px
 
Create an API token for your web app:

.. image:: http://blog.sessionstack.com/wp-content/uploads/2017/04/before_token_creation.png
    :width: 800px

* Go back to your Sentry project to configure the SessionStack plugin. Go to your Sentry project settings and find the SessionStack plugin under All integrations.

.. image:: http://blog.sessionstack.com/wp-content/uploads/2017/05/Screenshot_2.png
    :width: 800px

* Click Configure plugin and enter your SessionStack email, API token and website ID.

.. image:: http://blog.sessionstack.com/wp-content/uploads/2017/04/configure_plugin.png
    :width: 800px

* Go to your Entry reports to find the Play session button. The session replay will start 5 seconds before the error occurred so that you can see what user steps led to the error.

.. image:: http://blog.sessionstack.com/wp-content/uploads/2017/04/screenshot-sentry.io-2017-04-10-15-19-40-1.png
    :width: 800px

