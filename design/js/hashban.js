/*
Copyright (c) 2012 Greg Brown
[gregbrown.co.nz](http://gregbrown.co.nz)
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:
1. Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.
3. The name of the author may not be used to endorse or promote products
   derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

Hashban.js version 1.1
======================

Hashban.js is a plugin to streamline the addition of ajax-style page transitions
to a website.

Example:

    var hashban = Hashban({
        contentWrapSelector: '#mycontent'
    });
    hashban.hijack($('#header nav'));
    hashban.bind();


Options/defaults:

    contentWrapSelector: '#content',
    transitions: [DefaultTransition],
    loader: Hashban.prototype.loader,
    link_order: [],
    link_filter: null,
    loaderTimeout: 300

Transitions:

The transitions option should provide a list of Transition pseudoclasses,
inheriting from Hashban.DefaultTransition and defining the following methods:

    constructor(old_content, data)
    should_use() - returns true if this transition should be used
    transition_out(endfade) - performs "out" transition then calls
                    endfade callback
    transition_in(new_content, contentBody) - performs "in" transition

The Transition objects will be tested in order and the first valid one found
will be used. If none match, the last will be used.

See readme.markdown for more information.

*/

var $ = require("jquery");

var Hashban = function(){
    function DefaultTransition(old_content, data){
        this.old_content = old_content;
        this.data = data;
        this.duration = 500;
    };
    DefaultTransition.prototype = {
        should_use: function() {
            return true;
        },
        transition_out: function(endfade) {
            this.old_content.fadeOut(this.duration, endfade);
        },
        transition_in: function(new_content, contentBody) {
            this.old_content.remove();
            new_content.fadeIn(this.duration);
        }
    };

    function Hashban(user_options) {
        if (!(this instanceof Hashban)) return new Hashban(user_options);
        var that = this;

        this.CACHE = {};
        this.currentXHR = null;
        this.previous_url = window.location.pathname + window.location.search;
        this.options = $.extend({
            contentWrapSelector: '#content',
            transitions: [DefaultTransition],
            content_init: null,
            loader: function(visible) {
                return that.loader(visible);
            },
            link_order: [],
            loaderTimeout: 300,
            uid: 'Hashban.js'
        }, user_options);
    };

    Hashban.LOAD_EVENT = 'hashban-load';
    Hashban.UNLOAD_EVENT = 'hashban-unload';

    Hashban.DefaultTransition = DefaultTransition;

    Hashban.prototype.bind = function(){
        var that = this;

        $(window).bind('popstate', function(e) {
            if (e.originalEvent.state &&
                e.originalEvent.state['handler'] === that.options['uid']) {
                that.loadPage(window.location.pathname + window.location.search, e.originalEvent.state);
                return false;
            }
        });
    };

    Hashban.prototype.hashban = function(links){
        // bind the given links (a jquery collection) to load via ajax

        var that = this;
        links.each(function() {
            var me = $(this),
                url = me.attr('href');

            // TODO uid here? can you bind two Hashbans to one link?

            if (!me.data('hashbanned')) {
                me.click(function() {
                    that.loadPage(url);
                    return false;
                });
                me.data('hashbanned', true);
            }
        });
    };

    Hashban.prototype.filter_links = function(links) {
        var domain = getmatch(window.location.href, /[^\/]+\/\/[^\/]+/, 0);
        return links.filter('a[href]:not([href^="http://"]), ' +
                            'a[href^="' + domain + '"]')
                    .not('[href$=".xml"], [href$=".pdf"], ' +
                         '[href$=".jpg"], [href$=".gif"], ' +
                         '[href$=".png"], [href^="#"], [href^="mailto:"]');
    };
    Hashban.prototype.hijack = function(el, link_filter) {
        // find suitable links within the given element(s), and hijack them
        // to load via ajax

        var domain = getmatch(window.location.href, /[^\/]+\/\/[^\/]+/, 0),
            links = this.filter_links(el.find('a'));

        if (link_filter) {
            links = links.filter(link_filter);
        }

        this.hashban(links);

        return el;
    };

    Hashban.prototype.loadPage = function (url, state, force) {
        // Load the specified url. If state is passed, it is assumed to be the
        // state dictionary from the popstate event, (i.e. back button) and the
        // pageload is handled accordingly. Otherwise, it is assumed the
        // pageLoad was initiated by the user clicking a link.

        var that = this,
            contentWrap = $(this.options.contentWrapSelector),
            html,
            error,
            loaderTimer,
            faded = false,
            completed = false,
            transition_data = {
                direction: get_direction(this.previous_url, url,
                                         this.options.link_order),
                from: this.previous_url,
                to: url,
                state: state
            },
            old_content = contentWrap.children().not(this.options.loader());

        if (this.previous_url !== Hashban.absolute_url(url) || force) {
            // save scroll position in current state; also means the transition
            // will work if the user navigates to the originally loaded page
            // via the back button
            if (!state) {
                window.history.replaceState(that.buildState({
                    scrollTop: $(window).scrollTop()
                }), null, window.location);
            }

            // find appropriate transition (last one is default)
            var transitions = this.options.transitions,
                transition;
            for (var i = 0; i < transitions.length; i++) {
                transition = new transitions[i](old_content, transition_data);
                if (transition.should_use()) {
                    break;
                }
            }

            // Order of events:
            // 1. start loading
            // 2. transition out old content
            // 3. show spinner
            // 4. once load and transition out are both done, transition in

            function fadein() {
                var contentBody = Hashban.getBody(html),
                    bodyClass = contentBody.attr('class'),
                    contentEl = contentBody.find(
                                    that.options.contentWrapSelector).clone(),
                    title = Hashban.getTitle(html);

                if (contentEl.length) {
                    if (!state) {
                        // assume a link was clicked if no state present
                        history.pushState(that.buildState(), null, url);
                    }
                    document.title = $('<div>').html(title).text();

                    $('body').attr('class', bodyClass);

                    clearTimeout(loaderTimer);
                    that.options.loader(false);

                    var new_content = contentEl.children(),
                        old_content = contentWrap.children()
                                                 .not(that.options.loader());

                    // trigger unload event here so that it won't effect any
                    // new content
                    // TODO uid here?
                    $(window).trigger(Hashban.UNLOAD_EVENT);

                    new_content.appendTo(contentWrap).hide();

                    //transition_data.contentBody = contentBody;
                    transition.transition_in(new_content, contentBody);

                    if (typeof that.options.content_init === 'function') {
                        that.options.content_init(new_content);
                    }

                    // if the load was triggered by popstate, eg. the back
                    // button and not a clicked link, restore scroll position
                    if (state && state.scrollTop) {
                        $(window).scrollTop(state.scrollTop);
                    }
                    else {
                        // Otherwise, handle hash fragment if present
                        var hash = url.split('#')[1];
                        if (hash && $('#' + hash).length) {
                            $(window).scrollTop($('#' + hash).offset().top);
                        }
                        else if (transition.handle_scroll) {
                            transition.handle_scroll();
                        }
                        else {
                            // otherwise scroll to top
                            $(window).scrollTop(0);
                        }
                    }

                    // trigger load event here - assume that new content has
                    // been added in transition_in
                    // TODO uid here?
                    $(window).trigger(Hashban.LOAD_EVENT);

                    // work around jquery's auto overflow switch - see
                    // http://goo.gl/V9UUw
                    contentWrap.css({
                        overflow: 'visible'
                    });

                    that.previous_url = url;
                }
                else {
                    // reload the page to show the error
                    window.location.href = url;
                }
            };

            function endfade() {
                // Called once the transition_out animation is completed,
                // or immediately if there is no transition_out.
                if (!completed) {
                    completed = true;
                    if (html) {
                        fadein();
                    }
                    else {
                        loaderTimer = setTimeout(function() {
                            that.options.loader(true);
                        }, that.options.loaderTimeout);
                        faded = true;
                    }
                }
            };

            if (this.CACHE[url]) {
                html = this.CACHE[url];
            }
            else {
                if (this.currentXHR) {
                    this.currentXHR.abort();
                }
                this.currentXHR = $.ajax(url, {
                    success: function(data) {
                        that.CACHE[url] = data;
                        html = data;
                        if (faded) {
                            fadein();
                        }
                        this.currentXHR = null;
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        html = jqXHR.responseText;
                        error = errorThrown;
                        if (faded) {
                            fadein();
                        }
                        this.currentXHR = null;
                    }
                });
            }

            if (typeof transition.transition_out === 'function') {
                transition.transition_out(endfade);
            }
            else {
                endfade();
            }
        }
    };

    Hashban.prototype.buildState = function(params) {
        // builds the History state dict, starting with a common base and
        // adding the params obj

        return $.extend({
            handler: this.options['uid']
        }, params || {});
    };

    Hashban.prototype.loader = function(visible) {
        // this function toggles the "loading" state, based on
        // the parameter. If creating a loader element on the
        // page, it should return this element.

        var loading = $('.hashban-loader');
        if (!loading.length) {
            loading = $('<span>').addClass('hashban-loader')
                                 .text('Loading').hide();
            $(this.options.contentWrapSelector).append(loading);
        }
        if (visible === true) {
            loading.show();
        }
        else if (visible === false) {
            loading.hide();
        }

        return loading;
    };


    // PUBLIC INSTANCE METHODS

    Hashban.prototype.bindUntilUnload = function (el, event, callback) {
        // bind event to el, and unbind when navigating away from the page

        // TODO - account for uid here

        el.on(event, callback);
        $(window).one(Hashban.UNLOAD_EVENT, function() {
            el.off(event, callback);
        });
    };

    Hashban.prototype.preload = function (url) {
        // preload a url to avoid transition delay
        var that = this;

        if (!this.CACHE[url]) {
            $.ajax(url, {
                success: function(data) {
                    that.CACHE[url] = data;
                }
            });
        }
    };


    // PUBLIC UTILITIES

    Hashban.getBody = function (html) {
        // get wrapped body element from an html document

        return $('<div' +
                 getmatch(html, /<body([^>]*>[\S\s]*)<\/body>/, 1) +
                 '</div>');
    };

    Hashban.getTitle = function (html) {
        // get title string from an html document

        return getmatch(html, /<title>([\s\S]*?)<\/title>/, 1);
    };

    Hashban.absolute_url = function(url) {
        if (!url.match(/^(?:\/|https?:\/\/|:\/\/)/)) {
            // must be relative
            return window.location.pathname.replace(/\/[^\/]+$/, '/') + url;
        }
        return url;
    };


    // INTERNAL UTILITIES

    function getmatch(str, re, i) {
        // find and return the ith matched pattern in a regex, or
        // return a blank string if not found

        var match = str.match(re);
        if (match) {
            return match[i];
        }
        else {
            return '';
        }
    };

    function get_direction(from, to, link_order) {
        // Returns 1 (forwards) or -1 (backwards) for a given transition.
        // 0 is returned when the direction cannot be inferred.
        // link_order should be a list of the site's top-level link urls,
        // in order (see setup function).

        if (!link_order) {
            link_order = [];
        }

        if (to === from) {
            // this shouldn't really happen
            return 0;
        }
        else if (is_sublink(from, to)) {
            // if to is a child of from, go forward
            return 1;
        }
        else if (is_sublink(to, from)) {
            // if from is a child of to, go backwards
            return -1;
        }
        else {
            // otherwise, investigate the link_order setting to see
            // which way to go:
            var from_i = -1,
                to_i = -1;

            // first look for exact matches
            for (var i = 0; i < link_order.length; i++) {
                if (from_i === -1 && from === link_order[i]) {
                    from_i = i;
                }
                if (to_i === -1 && to === link_order[i]) {
                    to_i = i;
                }
            }
            if (from_i === -1 || to_i === -1) {
                // if no exact match, look for parent urls that match
                for (var i = 0; i < link_order.length; i++) {
                    if (from_i === -1 && is_sublink(link_order[i], from)) {
                        from_i = i;
                    }
                    if (to_i === -1 && is_sublink(link_order[i], to)) {
                        to_i = i;
                    }
                }
            }

            if (from_i === to_i || from_i === -1 || to_i === -1) {
                // can't determine a direction
                return 0;
            }
            else if (to_i < from_i) {
                // return backwards
                return -1;
            }
            else {
                // return forwards
                return 1;
            }
        }
    };

    function is_sublink(link, possible_sublink) {
        // Determine whether possible_sublink is a child of
        // link in the url tree. Returns false if the links
        // are the same.

        // add trailing slashes if they're missing, to ensure
        // that is_sublink(/test', '/test-2') returns false,
        // but is_sublink(/test', '/test/2') returns true.
        if (possible_sublink.slice(-1) !== '/') {
            possible_sublink += '/';
        }
        if (link.slice(-1) !== '/') {
            link += '/';
        }

        if (link !== possible_sublink && possible_sublink.indexOf(link) === 0) {
            return true;
        }
        else {
            return false;
        }
    };


    return Hashban;

}();

module.exports = Hashban;
