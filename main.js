var FETKit = {
    image_gallery: {
        ready: false,
        currentIndex: 0,
        customId: '',
        firstTime: true,
        type: {
            effect: ''
        },
        container : '',
        effectSetup: function(effect) { //UNFINISHED BUT BETTER
            var loadfunc = function() {
                var returnFunc = '';
                switch(effect) {
                    case 'fade':
                        returnFunc = function() { 
                            $(lis).css({'float':'none'});
                            $(lis).not(currentVis).css({'opacity':0,'position':'absolute','z-index':'0'});
                            currentVis.css({'position':'absolute','z-index':'8'});
                            FETKit.image_gallery.type.effect = 'fade';  
                        }
                    break;
                   
                    case 'slide':
                        returnFunc = function() { 
                            $(lis).css({'float':'left'});
                            $(lis).parent().css('width',$(container).width()*$(lis).size());
                            $(lis).not(currentVis).css({'opacity':1,'position':'relative','z-index':'1'});
                            currentVis.css({'position':'relative','z-index':'8'});
                            FETKit.image_gallery.type.effect = 'slide';
                        }
                        
                        //NEEDS TO BE FINISHED ( SEE BELOW )
                        
                    break;
                     /*
                    case 'mask':
                    
                        //NEEDS TO BE PORTED IN
                        
                    break;
                    */
                };
                return returnFunc;
            }
        },
        setup: function(effect,container) {
            FETKit.image_gallery.container = container;
            var ul = container + ' ul';
            var lis = container + ' ul li';
            var images = container + ' ul li img';
            
            //css reset
            $(container+','+ul+','+lis+','+images).css({'padding':0,'border':0,'font-size':'100%','font':'inherit','vertical-align':'baseline','overflow':'hidden','list-style':'none'});
            $(ul).css('margin-top',0);
            $(lis).css({'list-style':'none','display':'block'});
            $(lis).css('top','0px');
            
            $('body').prepend('<style>ul,ol,li,img { margin: 0; padding: 0; border: 0; font-size: 100%; font: inherit; vertical-align: baseline; }</style>');
            
            var layout = function() {
                switch(effect) {
                    case 'slide':
                        $(lis).parent().css('width',$(container).width()*$(lis).size());
                    break;
                }
                
                if($(container).height() > $(images+':eq(0)').height()) {
                    $(images).height($(container).height());    
                    $(images).width('');
                } else {
                    $(images).width($(container).width());   
                    $(images).height('');
                }
                $(images).css({'margin-top':-(($(images).height()-$(container).height())/2)});
                $(images).css({'margin-left':-(($(images).width()-$(container).width())/2)});
                
            };
            $(window).resize(function() {
                layout();
            });
            $(window).load(function() {
                layout();
                
                $(lis + ':eq(0)').addClass('current');
                FETKit.image_gallery.currentIndex = 0;
                
                if(FETKit.image_gallery.firstTime !== false) {
                    
                    //GENERATE UNIQUE STRING
                    var text = "", possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                    for( var i=0; i < 16; i++ ) { text += possible.charAt(Math.floor(Math.random() * possible.length)); }
                    FETKit.image_gallery.customId = text;
                    
                    
                    //THROTTLE/ANONYMISER
                    setTimeout(function() {
                        $(container).animate({opacity:1});
                        var currentVis = $(lis+':eq('+FETKit.image_gallery.currentIndex+')');
                        FETKit.image_gallery.type.effect.load();
                        FETKit.image_gallery.firstTime = false;
                        FETKit.image_gallery.ready = true;
                    });
                }
            });
        },
        run: function(callback) {
            this.interval = setInterval(function() {
                if(FETKit.image_gallery.ready == true)
                    FETKit.image_gallery.goTo();
            },4000);
            
            // Actually comes out to 4500 because of the buffer ( not sure how to work around this )
        },
        on: function(event,callback) {
            console.log(callback);
            if(event == 'change') {
                var sniffer,run,callback = callback;
                run = function() {
                    callback(FETKit.image_gallery.currentIndex);
                    var current = FETKit.image_gallery.currentIndex;
                    sniffer = setInterval(function() {
                        if(FETKit.image_gallery.currentIndex !== current) {
                            clearInterval(sniffer);
                            run();
                        }
                    },100);
                }
                run();
            }
        },
        goTo: function(index,callback) {
            if(index !== FETKit.image_gallery.currentIndex) {
                
                var container = FETKit.image_gallery.container;
                var lis = FETKit.image_gallery.container + ' ul li';
                var images = FETKit.image_gallery.container + ' ul li img';
                
                //index management
                var currentIndex = FETKit.image_gallery.currentIndex;
                var nextIndex;
    
                
                if(typeof index == 'undefined') { nextIndex = currentIndex+1; } 
                else { nextIndex = index; clearInterval(FETKit.image_gallery.run.interval);  }
                
                if(nextIndex > ($(lis).size()-1)) { nextIndex = 0; }
                
                //FX
                switch(FETKit.image_gallery.type.effect) {
                    case 'fade':
                        var currentVis = $(lis+':eq('+currentIndex+')');
                        currentVis.animate({'opacity':0});
                        $(lis+':eq('+nextIndex+')').stop(true,true).animate({'opacity':1},500);
                    break;
                    case 'slide':
                        $(container + ' ul').animate({'margin-left':-(100*nextIndex) + '%'},500);
                        
                    break;
                    /*
                    case 'mask':
                        //NEEDS TO BE PORTED IN 
                    break;
                    */
                }
                FETKit.image_gallery.currentIndex = nextIndex;
            }
        }
    },
    listPrepend: function(params) {
        var list = 'ul',prefix = '-',space = '5px',color = 'inherit';
        if(typeof params == 'undefined') { var params ='- '; }
        if(typeof params.list !== 'undefined') { list = params.list; }
        if(typeof params.prefix !== 'undefined') { prefix = params.prefix; }
        if(typeof params.space !== 'undefined') { space = params.space; }
        if(typeof params.color !== 'undefined') { color = params.color; }
        $(list).css('list-style','none');
        $(list).children('li').each(function() {
            $(this).children('.listPrepend_prefix').remove();
            $(this).html('<span class="listPrepend_prefix" style="color:'+color+';margin-right: '+space+';">'+prefix+'</span>'+ $(this).html())
        });
    }
}