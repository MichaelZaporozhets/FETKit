//begin 
var FETKit = {
    imageGallery: {
        ready: false,
        currentIndex: 0,
        customId: '',
        firstTime: true,
        type: {
            effect: ''
        },
        container : '',
        effectSetup: function(effect) { //NEEDS TO BECOME THE ACTUAL IMPLEMENTATION
            var returnFunc = '';
            switch(effect) {
                case 'fade':
                    returnFunc = function() { 
                        $(lis).css({'float':'none'});
                        $(lis).not(currentVis).css({'opacity':0,'position':'absolute','z-index':'0'});
                        currentVis.css({'position':'absolute','z-index':'8'});
                        FETKit.imageGallery.type.effect = 'fade';
                    }
                break;
               
                case 'slide':
                    returnFunc = function() { 
                        $(lis).css({'float':'left'});
                        $(lis).parent().css('width',$(container).width()*$(lis).size());
                        $(lis).not(currentVis).css({'opacity':1,'position':'relative','z-index':'1'});
                        currentVis.css({'position':'relative','z-index':'8'});
                        FETKit.imageGallery.type.effect = 'slide';
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
        },
        setup: function(effect,container,style,interval) {
            if(style.width && style.height) {
                var style = 'width: '+style.width+'; height: '+ style.height + ';';
            }
            var cssCode = "html,body,div,span,applet,object,iframe,h1,h2,h3,h4,h5,h6,p,blockquote,pre,a,abbr,acronym,address,big,cite,code,del,dfn,em,img,ins,kbd,q,s,samp,small,strike,strong,sub,sup,tt,var,b,u,i,center,dl,dt,dd,ol,ul,li,fieldset,form,label,legend,table,caption,tbody,tfoot,thead,tr,th,td,article,aside,canvas,details,embed,figure,figcaption,footer,header,hgroup,menu,nav,output,ruby,section,summary,time,mark,audio,video{margin:0;padding:0;border:0;font-size:100%;font:inherit;vertical-align:baseline}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}body{line-height:1}ol,ul{list-style:none}blockquote,q{quotes:none}blockquote:before,blockquote:after{content:'';content:none}q:before,q:after{content:'';content:none}table{border-collapse:collapse;border-spacing:0}.clear{clear:both}.img_slider{"+style+"opacity:0; overflow: hidden; position: absolute;}";
            var styleElement = document.createElement("style");
            styleElement.type = "text/css";
            if (styleElement.styleSheet) {
            styleElement.styleSheet.cssText = cssCode;
            } else {
            styleElement.appendChild(document.createTextNode(cssCode));
            }
            document.getElementsByTagName("head")[0].appendChild(styleElement);
            $(document).ready(function() {
                FETKit.imageGallery.container = container;
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
                    FETKit.imageGallery.currentIndex = 0;
                    
                    if(FETKit.imageGallery.firstTime !== false) {
                        
                        //GENERATE UNIQUE STRING
                        var text = "", possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                        for( var i=0; i < 16; i++ ) { text += possible.charAt(Math.floor(Math.random() * possible.length)); }
                        FETKit.imageGallery.customId = text;
                        
                        
                        //THROTTLE/ANONYMISER
                        setTimeout(function() {
                            $(container).animate({opacity:1});
                            var currentVis = $(lis+':eq('+FETKit.imageGallery.currentIndex+')');
                            switch(effect) {
                                case 'fade':
                                    $(lis).css({'float':'none'});
                                    $(lis).not(currentVis).css({'opacity':0,'position':'absolute','z-index':'0'});
                                    currentVis.css({'position':'absolute','z-index':'8'});
                                    FETKit.imageGallery.type.effect = 'fade';
                                break;
                               
                                case 'slide':
                                    $(lis).css({'float':'left'});
                                    $(lis).parent().css('width',$(container).width()*$(lis).size());
                                    $(lis).not(currentVis).css({'opacity':1,'position':'relative','z-index':'1'});
                                    currentVis.css({'position':'relative','z-index':'8'});
                                    FETKit.imageGallery.type.effect = 'slide';
                                    
                                    //NEEDS TO BE FINISHED ( SEE BELOW )
                                    
                                break;
                                 /*
                                case 'mask':
                                
                                    //NEEDS TO BE PORTED IN
                                    
                                break;
                                */
                            }
                            FETKit.imageGallery.firstTime = false;
                            FETKit.imageGallery.ready = true;

                            layout();

                            if(interval) {
                                FETKit.imageGallery.run(interval);
                            }
                        });
                    }
                });
            });
        },
        run: function(interval, callback) {
            if(interval) {
                var int;
                var spin = function() {
                    int = setInterval(function() {
                        FETKit.imageGallery.goTo();
                    },interval);
                }
                spin();
            }
        },
        on: function(event, callback) {
            if(event == 'change') {
                var sniffer,run,callback = callback;
                run = function() {
                    callback(FETKit.imageGallery.currentIndex);
                    var current = FETKit.imageGallery.currentIndex;
                    sniffer = setInterval(function() {
                        if(FETKit.imageGallery.currentIndex !== current) {
                            clearInterval(sniffer);
                            run();
                        }
                    },100);
                }
                run();
            }
        },
        goTo: function(index, callback) {
            if(index !== FETKit.imageGallery.currentIndex) {
                
                var container = FETKit.imageGallery.container;
                var lis = FETKit.imageGallery.container + ' ul li';
                var images = FETKit.imageGallery.container + ' ul li img';
                
                //index management
                var currentIndex = FETKit.imageGallery.currentIndex;
                var nextIndex;

                if(typeof index == 'undefined') { nextIndex = currentIndex+1; } 
                else { nextIndex = index; clearInterval(FETKit.imageGallery.run.interval);  }

                if(nextIndex > ($(lis).size()-1)) { nextIndex = 0; }
                
                //FX
                switch(FETKit.imageGallery.type.effect) {
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
                FETKit.imageGallery.currentIndex = nextIndex;
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