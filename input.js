// 相会制约的加减法运算控件

;(function(factory){
    if(typeof define === 'function' && define.amd){   // AMD模式
        // define(['jquery'],factory);
        define(['zepto'],factory);
    }else{  // 全局模式
        factory(window.Zepto || window.jQuery);
    }    
})(function($,undefined){
    // jQuery Widget Factory 代码
    var config = {
        max : 0,  // 最大值
        min : 0,  // 最小值
        value : 0, // 默认值
        step : 1,  // 每次步进值
        fnChange : $.noop  // value改变出发回调
    };
    var core = {
        fnSetmax : function($ele,val){  // 设置最大值
            $ele.data('input-max',val);
            core.fnSetvalue($ele,$ele.find('.input-group-control').val());
        },
        fnSetmin: function($ele,val){  // 设置最小值
            $ele.data('input-min',val);
            core.fnSetvalue($ele, $ele.find('.input-group-control').val());
        },
        fnSetvalue:function($ele,val){
            var max = $ele.data('input-max'),min = $ele.data('input-min'),
                $input = $ele.find('.input-group-control');
            var newVal = Math.max(Math.min(val,max),min),oldVal = $input.val();
            if(newVal !== oldVal){
                $input.val(newVal);
                core.fnGetfnChange($ele)('set',newVal);
            }
        },
        fnSetfnChange:function($ele,fn){  //  设置改变的值
            $ele.data('input-fnchange',fn);
        },
        fnGetMax:function($ele){
            return $ele.data('input-max');
        },
        fnGetMin:function($ele){
            return $ele.data('input-min');
        },
        fnGetValue:function($ele){
            return $ele.find('.input-group-control').val();
        },
        fnGetfnChange:function($ele){  //  得到的改变的值
            return $ele.data('input-fnchange');
        }
    };
    $.fn.input = function(options){
        var $this=$(this),max= $this.data('input-max'),min=$this.data('input-min');
        if(!$this.data('input-init')){
            options = $.extend({},config,options);
            typeof max !== 'undefined' && (options.max = max);
            typeof min !== 'undefined' && (options.min = min);
            options.value = parseInt(options.value || 0);

            $this.data('input-max',options.max);
            $this.data('input-min',options.min);
            $this.find('.input-group-control').prop('readonly',true);

            $this.on('click','.input-group-addon',function(){
                var $this = $(this),$parent = $this.parent(),
                    $input = $this.siblings('input'),
                    fnChange = $parent.data('input-fnchange'),
                    val = $input.val() - 0,index = $this.index(),
                    type = ['minus','','add'][index];
                var newVal = 0;
                switch (type) {
                    case 'minus':  // 减
                        var min = $parent.data('input-min');
                        newVal  = Math.max(min,val - options.step);          
                        break;

                    case 'add': // 加
                        var max = $parent.data('input-max');
                        newVal = Math.min(max,val + options.step);
                        break;                
                }
                val != newVal && fnChange(type,($input.val(newVal),newVal));
                
            });
            $this.data('input-init',true).data('input-fnchange',options.fnChange);
            core.fnSetvalue($this,options.value);

            
        }else{
            console.log(arguments.length)
            if(arguments.length == 1){
                if($.isPlainObject(options)){
                    for(var p in options){
                        core['fnSet' +p]($this,options[p]);
                    }
                }else{
                    return core['fnGet'+arguments[0]] && core['fnGet' + arguments[0]]($this);
                }
            }else if(arguments.length == 2){
                core['fnSet' + arguments[0]]($this,arguments[1]);
            }
        }

    }

});

