(()=>{"use strict";$((()=>{$(".js-control-panel").each(((t,s)=>{const a=$(s);new class{constructor(t){this.$component=t,this.$slider=$(".js-control-panel__slider",t),this.$min=$(".js-control-panel__min input",t),this.$max=$(".js-control-panel__max input",t),this.$step=$(".js-control-panel__step input",t),this.$from=$(".js-control-panel__from input",t),this.$to=$(".js-control-panel__to input",t),this.$parts=$(".js-control-panel__parts input",t),this.$vertical=$(".js-control-panel__vertical input",t),this.$range=$(".js-control-panel__range input",t),this.$scale=$(".js-control-panel__scale input",t),this.$bar=$(".js-control-panel__bar input",t),this.$tip=$(".js-control-panel__tip input",t)}init(){const t=JSON.parse(this.$component.attr("data-slider-options"));this.$slider.rangeSlider(t),this._updateInputs(),this._updateInputs=this._updateInputs.bind(this),this._handleMinChange=this._handleMinChange.bind(this),this._handleMaxChange=this._handleMaxChange.bind(this),this._handleStepChange=this._handleStepChange.bind(this),this._handleFromChange=this._handleFromChange.bind(this),this._handleToChange=this._handleToChange.bind(this),this._handlePartsChange=this._handlePartsChange.bind(this),this._handleVerticalChange=this._handleVerticalChange.bind(this),this._handleRangeChange=this._handleRangeChange.bind(this),this._handleScaleChange=this._handleScaleChange.bind(this),this._handleBarChange=this._handleBarChange.bind(this),this._handleTipChange=this._handleTipChange.bind(this),this._attachEventHandlers()}_attachEventHandlers(){this.$slider.rangeSlider("onchange",this._updateInputs),this.$min.on("change",this._handleMinChange),this.$max.on("change",this._handleMaxChange),this.$step.on("change",this._handleStepChange),this.$from.on("change",this._handleFromChange),this.$to.on("change",this._handleToChange),this.$parts.on("change",this._handlePartsChange),this.$vertical.on("change",this._handleVerticalChange),this.$range.on("change",this._handleRangeChange),this.$scale.on("change",this._handleScaleChange),this.$bar.on("change",this._handleBarChange),this.$tip.on("change",this._handleTipChange)}_handleMinChange(){const t=Number(this.$min.val());this._setValidOptions({min:t})}_handleMaxChange(){const t=Number(this.$max.val());this._setValidOptions({max:t})}_handleStepChange(){const t=Number(this.$step.val());this._setValidOptions({step:t})}_handleFromChange(){const t=Number(this.$from.val());this._setValidOptions({valueFrom:t})}_handleToChange(){const t=Number(this.$to.val());this._setValidOptions({valueTo:t})}_handlePartsChange(){const t=Number(this.$parts.val());this._setValidOptions({scaleParts:t})}_handleVerticalChange(){let{orientation:t}=this._getOptions();t="horizontal"===t?"vertical":"horizontal",this._setOptions({orientation:t})}_handleRangeChange(){const{isRange:t}=this._getOptions();this._setValidOptions({isRange:!t})}_handleScaleChange(){const{showScale:t}=this._getOptions();this._setOptions({showScale:!t})}_handleBarChange(){const{showProgress:t}=this._getOptions();this._setOptions({showProgress:!t})}_handleTipChange(){const{showTooltip:t}=this._getOptions();this._setOptions({showTooltip:!t})}_getOptions(){return this.$slider.rangeSlider("get")}_setOptions(t){this.$slider.rangeSlider("set",t)}_setValidOptions(t,s=0){if(s>10)throw new Error("Stack Overflow");try{console.warn("try to set options",t),this._setOptions(t)}catch(a){const{value:e}=a;if(void 0===e)throw a;const i="isRange"===e,n="scaleParts"===e,h="valueFrom"===e,o="valueTo"===e,l=this._getOptions(),r=void 0!==t.min?t.min:l.min,d=void 0!==t.max?t.max:l.max;console.warn("start validation"),console.warn("original options: ",l),console.warn("trying to set options: ",t),console.error(`error message: ${a.message}`),(i||o)&&this._setValidOptions({...t,valueTo:d},s+1),n&&this._setValidOptions({...t,scaleParts:1},s+1),h&&this._setValidOptions({...t,valueFrom:r},s+1),this._updateInputs(),console.warn("end validation")}}_updateInputs(){const{min:t,max:s,step:a,valueFrom:e,valueTo:i,isRange:n,orientation:h,showScale:o,scaleParts:l,showTooltip:r,showProgress:d}=this.$slider.rangeSlider("get");this.$min.val(t),this.$max.val(s),this.$step.val(a),this.$from.val(e),this.$from.attr("min",t),this.$from.attr("max",s),this.$from.attr("step",a),o?(this.$parts.val(l),this.$parts.attr("disabled",!1)):(this.$parts.val(""),this.$parts.attr("disabled",!0)),n?(this.$to.attr("disabled",!1),this.$to.val(i),this.$to.attr("min",t),this.$to.attr("max",s),this.$to.attr("step",a)):(this.$to.attr("disabled",!0),this.$to.val("")),this.$range.attr("checked",n),this.$vertical.attr("checked","vertical"===h),this.$scale.attr("checked",o),this.$tip.attr("checked",r),this.$bar.attr("checked",d)}}(a).init()}))}));$((()=>{$(".js-tapper-view").each(((t,s)=>{const a=$(s);new class{constructor(t){this.$component=t,this.$slider=$(".js-tapper-view__slider",t),this.$key=$(".js-tapper-view__key",t),this.$canvas=$(".js-tapper-view__canvas",t)}init(){const t=JSON.parse(this.$component.attr("data-tappers")),s=t.map((t=>t.name));this.keys=t.map((t=>t.key)),this.keysBits=this.keys.map(((t,s)=>this._keyToBinaryArray(s))),this.$slider.rangeSlider({strings:s,showScale:!1}),this.$canvas.attr("width",634),this.$canvas.attr("height",100),this.ctx=this.$canvas[0].getContext("2d"),this._update(),this._update=this._update.bind(this),this._attachEventHandlers()}_attachEventHandlers(){this.$slider.rangeSlider("onchange",this._update)}_update(){this._updateKey(),this._updateCanvas()}_updateKey(){const{valueFrom:t}=this.$slider.rangeSlider("get");this.$key.html(this.keys[t])}_updateCanvas(){const{valueFrom:t}=this.$slider.rangeSlider("get"),s=this.keysBits[t];this._clearCanvas(),s.forEach(((t,s)=>{t&&this._drawCell(s)}))}_drawCell(t){const s=106-Math.trunc(t/17)-1,a=t%17,e=4*s+2*s,i=4*a+2*a;this.ctx.fillStyle="black",this.ctx.fillRect(e,i,4,4)}_clearCanvas(){const t=Number(this.$canvas.attr("width")),s=Number(this.$canvas.attr("height"));this.ctx.fillStyle="white",this.ctx.fillRect(0,0,t,s)}_keyToBinaryArray(t){let s=BigInt(this.keys[t])/BigInt(17);const a=[];for(;s>0n;)a.push(s%2n),s/=2n;return a}}(a).init()}))}))})();